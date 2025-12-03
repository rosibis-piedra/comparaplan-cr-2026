require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const supabase = require('../src/config/database');

// Procesar un PDF
async function processPDF(pdfPath, partidoId) {
  console.log(`📄 Procesando: ${path.basename(pdfPath)}`);
  
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(dataBuffer);
  
  const text = pdfData.text;
  const totalPages = pdfData.numpages;
  
  // Dividir por secciones
  const sections = extractSections(text, totalPages);
  
  console.log(`   ✓ ${sections.length} secciones encontradas`);
  
  // Insertar en base de datos
  for (const section of sections) {
    await supabase.from('plan_secciones').insert({
      partido_id: partidoId,
      tema: section.tema,
      contenido: section.contenido,
      pagina_inicio: section.pagina,
      keywords: section.keywords
    });
  }
  
  console.log(`   ✅ Insertado en DB`);
}

// Extraer secciones del texto
function extractSections(text, totalPages) {
  const sections = [];
  const temas = ['pensiones', 'salud', 'educación', 'seguridad', 'empleo', 'ambiente', 'economía', 'transporte'];
  
  const charsPerPage = Math.ceil(text.length / totalPages);
  
  temas.forEach(tema => {
    const regex = new RegExp(`${tema}[\\s\\S]{0,2000}`, 'gi');
    const matches = text.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        const charIndex = text.indexOf(match);
        const pageNum = Math.ceil(charIndex / charsPerPage);
        
        sections.push({
          tema: tema,
          contenido: match.trim().substring(0, 1500),
          pagina: pageNum,
          keywords: [tema, ...match.toLowerCase().match(/\w{4,}/g).slice(0, 10)]
        });
      });
    }
  });
  
  return sections;
}

// Función principal
async function main() {
  const pdfsDir = path.join(__dirname, 'pdfs');
  
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir);
    console.log('📁 Carpeta /scripts/pdfs/ creada');
    return;
  }
  
  const files = fs.readdirSync(pdfsDir).filter(f => f.endsWith('.pdf'));
  
  if (files.length === 0) {
    console.log('⚠️  No hay PDFs en /scripts/pdfs/');
    return;
  }
  
  console.log(`🚀 Procesando ${files.length} PDFs...\n`);
  
  for (const file of files) {
    const partidoNombre = file.replace('.pdf', '');
    
    // Buscar partido
    const { data: partidos } = await supabase
      .from('partidos')
      .select('id')
      .eq('nombre', partidoNombre);
    
    let partidoId;
    
    if (partidos && partidos.length > 0) {
      partidoId = partidos[0].id;
    } else {
      // Crear partido
      const { data: newPartido } = await supabase
        .from('partidos')
        .insert({ 
          nombre: partidoNombre, 
          siglas: partidoNombre.substring(0, 5).toUpperCase(),
          plan_url: 'https://observador.cr/planes-de-gobierno-2026'
        })
        .select();
      
      partidoId = newPartido[0].id;
    }
    
    await processPDF(path.join(pdfsDir, file), partidoId);
  }
  
  console.log('\n✅ TODOS LOS PDFs PROCESADOS');
}

main().catch(console.error);