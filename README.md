\# ComparaPlan CR 2026



Herramienta ciudadana independiente para comparar planes de gobierno de las elecciones presidenciales de Costa Rica 2026.



\## 🎯 Características



\- ✅ Comparación inteligente con IA (Claude Sonnet 4)

\- ✅ 10 partidos principales según encuestas

\- ✅ Sistema de caché para reducir costos

\- ✅ Rate limiting (30 consultas/día por IP)

\- ✅ Datos de planes oficiales del TSE



\## 🛠️ Tecnologías



\- \*\*Frontend:\*\* React + Vite

\- \*\*Backend:\*\* Node.js + Express

\- \*\*Base de datos:\*\* Supabase (PostgreSQL)

\- \*\*IA:\*\* Anthropic Claude API

\- \*\*Datos:\*\* 20 planes de gobierno procesados (3,667+ secciones)



\## 📦 Instalación



\### Backend

```bash

cd backend

npm install

cp .env.example .env  # Configura variables

node src/server.js

```



\### Frontend

```bash

cd frontend

npm install

npm run dev

```



\## 🔧 Variables de entorno



\### Backend (.env)

```

ANTHROPIC\_API\_KEY=tu-api-key

SUPABASE\_URL=tu-supabase-url

SUPABASE\_ANON\_KEY=tu-supabase-key

CLAUDE\_MODEL=claude-sonnet-4-20250514

MAX\_REQUESTS\_PER\_DAY=30

```



\### Frontend (.env)

```

VITE\_API\_URL=http://localhost:3001

VITE\_RECAPTCHA\_SITE\_KEY=tu-recaptcha-site-key

```



\## 💰 Costos



\- ~$0.02-0.03 por consulta nueva

\- Caché reduce costo a $0 en consultas repetidas

\- Presupuesto estimado: $10/mes para 500 consultas



\## 📊 Base de datos



Tablas en Supabase:

\- `partidos` - Información de partidos políticos

\- `plan\_secciones` - Secciones extraídas de planes

\- `cache\_comparaciones` - Caché de respuestas

\- `rate\_limits` - Control de uso por IP

\- `logs\_consultas` - Estadísticas de uso



\## 🗳️ Elecciones 2026



Fecha: 2 de febrero de 2026



Datos de planes oficiales: https://www.tse.go.cr/2026/planesgobierno.html



\## 👤 Creado por



Rosibis Piedra - Sin afiliación política



\## 📄 Licencia



Uso educativo y ciudadano. Datos de planes de gobierno son propiedad de TSE.

