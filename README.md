# JPB SRL • Sistema de Control Financiero de Obras & Gestión de Fondos

[![App Live Preview](https://img.shields.io/badge/App_En_Línea-Online-emerald?style=for-the-badge&logo=google-cloud)](https://ais-pre-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app)
[![Bimonetary ARS/USD](https://img.shields.io/badge/Divisas-ARS_%2F_USD-amber?style=for-the-badge)](https://ais-pre-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app)
[![React Vite](https://img.shields.io/badge/Stack-React_19_+_TypeScript_+_Tailwind-blue?style=for-the-badge&logo=react)](https://ais-pre-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app)
[![Firebase Cloud Sync](https://img.shields.io/badge/Cloud-Firestore_Sync-orange?style=for-the-badge&logo=firebase)](https://ais-pre-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app)

---

## 🌐 Accesos a la Aplicación

- 🛠️ **Acceso Inmediato en Vivo (Entorno Activo):**  
  👉 **[https://ais-dev-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app](https://ais-dev-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app)**

- 🚀 **Enlace Público Permanente (Shared / Public URL):**  
  👉 **[https://ais-pre-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app](https://ais-pre-gno62cuvzjovqy6a34kgtz-839645878130.us-east1.run.app)**  
  *(Nota: Si este enlace muestra "Page not found", se activa haciendo clic en el botón **"Share" / "Compartir"** ubicado en la esquina superior derecha de Google AI Studio).*

---

## 🏗️ Acerca de JPB SRL

**JPB SRL - Sistema Integral de Control Financiero de Obras** es una plataforma corporativa desarrollada para la administración, auditoría presupuestaria, liquidación y control de flujo de fondos en proyectos de construcción y arquitectura.

El sistema resuelve la complejidad del manejo financiero bimonetario en obras (Pesos Argentinos `$ ARS` y Dólares Estadounidenses `u$s USD`), permitiendo el seguimiento exacto de aportes de comitentes, liquidaciones de mano de obra, compras de materiales, control de cajas/bancos y análisis de desvíos en tiempo real con ponderación por peso específico.

---

## ✨ Características Principales

### 1. 🟢 Origen de Fondos (Ingresos)
- Registro y clasificación de aportes de socios/comitentes, venta de divisas y cancelaciones.
- Conversión bimonetaria instantánea según tipo de cambio (t.c.) del comprobante.
- Evolución temporal mes a mes y gráficos de participación por origen del capital.
- Búsqueda en tiempo real y filtrado por períodos.

### 2. 🔴 Aplicación de Fondos (Egresos & Costos)
- Clasificación por rubros: **Mano de Obra (M.O.)**, **Materiales & Acopios**, **Honorarios y Dirección Técnica**, **Derechos y Permisos Municipales**, **Volquetes & Fletes**, **Subcontratos** e **Imprevistos**.
- Resumen visual con gráficos de barras y torta para análisis inmediato de costos.
- Filtros interactivos por rubro, fecha y método de pago.

### 3. ⚖️ Presupuesto vs. Real y Tablero de Desvíos (Peso Específico)
- Matriz de control presupuestario: Compara lo **Presupuestado** vs. **Real Ejecutado** con cálculo automático de desvío ($ y %).
- **Ponderación por Peso Específico:** Prioriza los desvíos según su porcentaje de impacto sobre el costo total de la obra.
- Sistema de semáforos:
  - 🟢 **En Presupuesto:** Ejecución dentro de márgenes previstos (< 85%).
  - 🟡 **Alerta Preventiva:** Rubros cercanos al límite (85% - 100%).
  - 🔴 **Desvío Crítico:** Rubros con sobrecostos o desvíos estructurales (> 100%).
- Calibrador en línea de presupuestos por partida.

### 4. 🌐 Consolidado Macro (Visión Ejecutiva de Obras)
- Panel directivo con visión transversal de todas las obras activas (*Casa Mily y Fer Caracas 2672*, *Edificio Las Heras*, *Casa de Campo Pilar*, etc.).
- Comparativa lado a lado de Ingresos vs. Egresos vs. Presupuesto Global.
- Indicadores de margen operativo y estado de avance porcentual.

### 5. 👥 Control de Usuarios, Roles & Permisos (RBAC)
- **Superadministrador Maestro** (`fernandoj.laso@gmail.com`): Control total, aprobación de usuarios y asignación de obras.
- **Director de Proyecto**: Supervisión general y administración técnica.
- **Administrativo**: Carga de comprobantes, ingresos y egresos.
- **Comitente / Cliente**: Acceso restringido exclusivamente a las obras asignadas para auditoría transparente.
- **Autenticación Dual**: Ingreso en 1 Clic con Google o registro con correo y contraseña protegidos.

### 6. 📊 Integración con Excel (.xlsx / .csv)
- **Importador Inteligente:** Carga masiva de comprobantes arrastrando planillas Excel con previsualización y validación previa.
- **Descargador de Plantilla Modelo:** Genera la planilla con las columnas requeridas para una carga ordenada.
- **Exportación en 1 Clic:** Exporta todos los libros contables a Excel manteniendo las estructuras bimonetarias.

### 7. 💱 Conversor y Selector Bimonetario
- Alternancia con un clic de toda la plataforma entre `$ ARS` y `u$s USD`.
- Herramienta de calculadora y conversor de tipo de cambio integrada en el encabezado.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador:** [Vite](https://vitejs.dev/)
- **Estilos & UI:** [Tailwind CSS](https://tailwindcss.com/)
- **Base de Datos & Auth:** [Google Cloud Firestore](https://firebase.google.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Visualización de Datos & Gráficos:** [Recharts](https://recharts.org/)
- **Procesamiento de Hojas de Cálculo:** [SheetJS (XLSX)](https://sheetjs.com/)
- **Despliegue:** [Google Cloud Run](https://cloud.google.com/run)

---

## 🚀 Instalación y Ejecución Local

Para correr el proyecto en un entorno local:

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Ingresar a la carpeta del proyecto
cd jpb-srl-obras

# 3. Instalar las dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación se ejecutará localmente en `http://localhost:3000`.

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo Vite en el puerto 3000.
- `npm run build`: Compila la aplicación optimizada para producción en `/dist`.
- `npm run lint`: Ejecuta el validador de tipos TypeScript (`tsc --noEmit`).

---

## 🏢 Créditos & Empresa

Desarrollado para **JPB SRL** — Sistema Integral de Control Financiero de Obras & Gestión de Fondos.
