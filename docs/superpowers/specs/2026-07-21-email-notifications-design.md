# Notificaciones por Correo Electrónico al Proponer Carreras — Spec de Diseño

## Resumen Ejecutivo
Implementar un sistema de notificaciones automáticas por correo electrónico para que el administrador reciba una alerta por cada nueva carrera/evento propuesto por los usuarios en la web. Esto permite revisar y moderar rápidamente la propuesta desde el panel de administración.

---

## 1. Arquitectura y Componentes

### 1.1 Endpoint Serverless (`api/notify.js`)
- Función Vercel Serverless Function en Node.js que maneja peticiones `POST /api/notify`.
- Utiliza la librería `nodemailer` para conectarse al servidor SMTP de Gmail u otro proveedor.
- Lee las siguientes Variables de Entorno en Vercel:
  - `SMTP_HOST`: Servidor SMTP (por defecto `smtp.gmail.com`).
  - `SMTP_PORT`: Puerto SMTP (por defecto `465`).
  - `SMTP_USER`: Correo del remitente (ej. `tu_correo@gmail.com`).
  - `SMTP_PASS`: Contraseña de aplicación de Google de 16 caracteres.
  - `NOTIFY_EMAIL`: Correo de destino para moderación (si se omite, usa `SMTP_USER`).

### 1.2 Formato del Correo HTML
El correo incluirá una plantilla HTML limpia y moderna:
- Encabezado: 🚴 **¡Nueva carrera propuesta en CalendarioCiclista Chile!**
- Tabla/Tarjeta con datos:
  - **Nombre del Evento:** `[nombre]`
  - **Disciplina:** `[disciplina]`
  - **Fecha:** `[fecha]`
  - **Ubicación:** `[ubicacion], [region]`
  - **Organizador:** `[organizador]`
  - **Distancia:** `[distancia]` | **Desnivel:** `[desnivel]`
- Botón interactivo: **[Ir a Moderar la Carrera]** (`https://calendariociclista.vercel.app/admin`).

### 1.3 Integración en Frontend (`js/supabase.js`)
- En `createPendingRaceSupabase(raceData)`, tras enviar la propuesta a Supabase exitosamente, se efectúa un `fetch('/api/notify', { method: 'POST', body: JSON.stringify(payload) })`.
- La llamada es asíncrona y no bloqueante (catch silencioso de errores de correo) para asegurar que la propuesta nunca falle si el servicio de correo o las variables de entorno están desconfiguradas.

---

## 2. Pruebas y Verificación

1. **Unit tests / QA test suite**:
   - Verificar existencia y estructura de `api/notify.js`.
   - Verificar llamado a `/api/notify` en `createPendingRaceSupabase`.
2. **Prueba local del handler de correo**.
3. **Despliegue y configuración en Vercel**.
