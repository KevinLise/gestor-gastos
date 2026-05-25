#  GastoSmart — Gestor de Gastos Personales Inteligente

> Controla tus finanzas personales con conversión de divisas en tiempo real. Registra, analiza y visualiza tus gastos desde cualquier dispositivo — sin servidor, sin base de datos.

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/1bf7d7ea-b8cd-4e1d-b743-ba7ff19b8471" />
[Ver sitio en vivo](https://gestor-gastos-five-beta.vercel.app)

---

##  Características

| Función | Descripción |
|---------|-------------|
|  **CRUD completo** | Agregar, editar, eliminar y ver historial de gastos |
|  **Dashboard** | Estadísticas en tiempo real con gráficas interactivas |
|  **API de Divisas** | Conversión automática COP → USD / EUR vía ExchangeRate API |
|  **Persistencia** | Datos guardados en `localStorage` (sin backend) |
|  **Responsive** | Diseño adaptable a móvil, tablet y desktop |
|  **Filtros** | Búsqueda por nombre, categoría, mes y orden |

---

##  Stack Tecnológico

```
React 18          → UI reactiva con hooks y context
Vite 4            → Build tool ultrarrápido
Chart.js 4        → Gráficas interactivas (doughnut + bar)
react-chartjs-2   → Wrapper React para Chart.js
react-hot-toast   → Notificaciones elegantes
date-fns          → Utilidades de fechas
localStorage      → Persistencia sin backend
ExchangeRate API  → Tasas de cambio en tiempo real
CSS moderno       → Variables, grid, flexbox, animaciones
```

---

##  Instalación y Uso Local

### Prerrequisitos
- Node.js v18 o superior
- npm v8 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/gestor-gastos.git
cd gestor-gastos

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Otros comandos

```bash
npm run build    # Compilar para producción → carpeta dist/
npm run preview  # Vista previa del build de producción
npm run lint     # Análisis de código con ESLint
```

---

##  API Externa — ExchangeRate API

### ¿Qué hace?

La app consume la API gratuita de [ExchangeRate-API](https://www.exchangerate-api.com) para obtener tasas de cambio en tiempo real y convertir los montos COP a USD y EUR.

### Endpoint utilizado

```
GET https://v6.exchangerate-api.com/v6/{API_KEY}/latest/COP
```

### Respuesta de ejemplo

```json
{
  "result": "success",
  "conversion_rates": {
    "USD": 0.000243,
    "EUR": 0.000224,
    ...
  }
}
```

### Clave API

El proyecto incluye una API key gratuita de demo. Para producción con alto tráfico, obtén tu propia key gratis en [exchangerate-api.com](https://www.exchangerate-api.com):

1. Regístrate (gratis, sin tarjeta)
2. Copia tu API key
3. Edita `src/utils/constants.js`:

```js
export const EXCHANGE_API_KEY = 'TU_API_KEY_AQUÍ'
```

### Caché inteligente

Las tasas se cachean en `localStorage` durante **6 horas** para respetar los límites del plan gratuito (1500 req/mes).

---

##  Estructura del Proyecto

```
gestor-gastos/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navegación responsive
│   │   ├── Navbar.css
│   │   ├── Dashboard.jsx       # Stats + Chart.js
│   │   ├── Dashboard.css
│   │   ├── GastoForm.jsx       # Formulario agregar/editar
│   │   ├── GastoForm.css
│   │   ├── Historial.jsx       # Lista + filtros + CRUD
│   │   ├── Historial.css
│   │   ├── Divisas.jsx         # Conversor COP → USD/EUR
│   │   └── Divisas.css
│   ├── context/
│   │   └── AppContext.jsx      # Estado global (useReducer)
│   ├── hooks/
│   │   └── useExchangeRates.js # Hook para la API
│   ├── utils/
│   │   ├── constants.js        # Categorías, config API
│   │   ├── helpers.js          # Funciones auxiliares
│   │   ├── storage.js          # localStorage wrapper
│   │   └── exchangeApi.js      # Servicio ExchangeRate API
│   ├── styles/
│   │   └── global.css          # Variables CSS + reset
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
├── index.html
├── vite.config.js
├── vercel.json                 # Config para deploy en Vercel
├── .gitignore
├── .eslintrc.cjs
└── package.json
```

---

##  Categorías de Gastos

| Categoría | Emoji | Color |
|-----------|-------|-------|
| Comida |  | `#ff6b6b` |
| Transporte |  | `#ffd43b` |
| Estudio |  | `#74c0fc` |
| Entretenimiento |  | `#da77f2` |
| Salud |  | `#69db7c` |
| Otros |  | `#ffa94d` |

---

##  Deploy en Vercel — Paso a Paso

### Opción A: desde GitHub (recomendada)

1. **Sube el proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - GastoSmart"
   git remote add origin https://github.com/tu-usuario/gestor-gastos.git
   git push -u origin main
   ```

2. **Entra a [vercel.com](https://vercel.com)** e inicia sesión con GitHub

3. **Haz clic en "New Project"**

4. **Selecciona tu repositorio** `gestor-gastos`

5. **Configuración del proyecto:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Haz clic en "Deploy"** → ¡Tu app estará live en ~1 minuto!

### Opción B: CLI de Vercel

```bash
# Instalar CLI
npm install -g vercel

# En la carpeta del proyecto
vercel

# Seguir las instrucciones del wizard
# La URL pública se mostrará al finalizar
```

### Variables de entorno (opcional)

Si guardas la API key en variable de entorno en lugar del código:

1. En Vercel → tu proyecto → Settings → Environment Variables
2. Agrega: `VITE_EXCHANGE_API_KEY = tu_clave`
3. En `constants.js` usa: `import.meta.env.VITE_EXCHANGE_API_KEY`

---

##  Notas de Privacidad

- Todos los datos se guardan **únicamente en tu navegador** (`localStorage`)
- No hay servidor, no hay base de datos, no se envían datos a terceros
- Solo la llamada a ExchangeRate API es externa (tasas de cambio públicas)

---

##  Licencia

MIT License — libre para uso personal y comercial.

---

<p align="center">
  Hecho con  usando React + Vite + Chart.js
</p>
