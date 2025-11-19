# 📊 Análisis de Feedback de Usuarios (N=20) - Proyecto PeerHive

Este documento resume el análisis de la recolección de comentarios (N=20) para la plataforma PeerHive. La recepción general es muy positiva, y los datos revelan un *roadmap* claro de las funcionalidades esperadas por el usuario (UX) y los requisitos funcionales (RF) prioritarios.

## 📱 1. UX/UI y Experiencia de Usuario

La facilidad de uso y el acceso móvil no son negociables.

* **Prioridad Móvil:** El **80%** de los usuarios (16/20) marcó la **versión móvil como "Muy Importante"**. Esto no es un *feature* opcional, es un requisito central (*core requirement*).

* **Prioridades del Usuario:** Cuando se les preguntó qué era lo más importante, el *stack* de prioridades quedó así:
    1.  **Facilidad para encontrar asesorías (75%)**
    2.  **Facilidad para contactar asesores (60%)**
    3.  Seguridad y privacidad (45%)

* **Punto de Fricción: Onboarding/Login**
    ¡Atención! El flujo de ingreso (onboarding) está dividido.
    * `40%` prefiere Correo Institucional
    * `30%` prefiere Correo Personal
    * `30%` quiere poder ver información **"Sin registro"**

    **Implicación:** Forzar un *login* antes de que el usuario vea el valor (ej. asesores disponibles) puede causar una alta tasa de rebote. Se sugiere un modelo de "vista pública" con *login* requerido solo para agendar.

* **Recuperación de Contraseña:** El **75%** prefiere la recuperación vía `Correo`. Es el *endpoint* de recuperación estándar y esperado.

---

## ⚙️ 2. Requisitos Funcionales (Core)

Estas son las funcionalidades principales que definen el producto.

* **Agendamiento de Asesorías:** La preferencia es un sistema automatizado. El **70%** quiere **"Seleccionar fecha y hora en un calendario"**. Los métodos manuales (formulario o mensaje) solo suman el 30%.

* **Selección de Asesor:** El **80%** demanda poder **"Elegirlo de acuerdo a mi comodidad y recomendación"**. Los usuarios quieren control.

* **Persistencia de Datos:**
    * **Historial de Sesiones:** `95%` (19/20) lo considera necesario para recordar sesiones pasadas y futuras.
    * **Guardar Sesiones Virtuales:** `95%` (19/20) quiere esta funcionalidad para consulta futura.

---

## 💬 3. Flujo de Comunicación y Notificaciones

Se observan dos casos de uso distintos para la comunicación.

* **Canal de Comunicación:**
    * **Para dudas generales:** `40%` WhatsApp y `40%` Asesoría presencial.
    * **Para acordar especificaciones (logística):** `45%` WhatsApp y `35%` Chat dentro de la página.
    * **Implicación:** El chat *in-app* es valorado, pero WhatsApp sigue siendo el canal preferido para la inmediatez.

* **Recordatorios (Notificaciones):**
    * El **100%** de los usuarios espera recibir recordatorios.
    * **Canal preferido:** `65%` vía Correo Electrónico y `30%` vía Notificación *in-app*.

---

## ⭐ 4. Perfiles y Sistema de Feedback

La información del perfil es crucial para generar confianza.

* **Payload del Perfil:** El *payload* de datos (la información) que se debe mostrar en un perfil de asesor/alumno debe priorizar:
    1.  **`95%` Horario de disponibilidad** (¡El requisito de información más solicitado!)
    2.  `85%` Grado de estudio
    3.  `85%` Correo electrónico
    4.  `60%` Número telefónico
    5.  `50%` Foto de perfil

* **Sistema de *Rating* (Puntuación):**
    * El **60%** prefiere un **sistema numérico (ej. 0-5 estrellas)**.
    * Combinar esto con un campo de `Comentario libre` (preferido por el 20%) cubriría la expectativa del 80% de los usuarios.

---

## 🔧 5. Comentarios Libres y *Backlog* Técnico

Los comentarios libres revelan preocupaciones a nivel de arquitectura y *backend*.

* **`Performance` (Rendimiento):** Múltiples usuarios mencionaron la necesidad de "Una buena optimización" y "Un buen sistema para que no se sature". Esto indica una preocupación por la escalabilidad.

* **Nuevos *Features* (Ideas para el *Backlog*):**
    * "Guías de estudio en formato digital" (Gestión de archivos).
    * "Grupos de estudio" (Funcionalidad comunitaria).
    * "Más variedad de docentes y horarios" (Adquisición de asesores).

---

## 🚀 Conclusión del Análisis

La data es concluyente: el usuario final espera una plataforma ***mobile-first* (80%)** y **extremadamente intuitiva (75%)**. Los *pain points* (puntos de dolor) actuales que la plataforma debe resolver se centran en la dificultad para encontrar y agendar asesorías.

El *backlog* de desarrollo para el próximo *sprint* debe priorizar dos *features* clave:

1.  **Un módulo de agendamiento robusto basado en calendario (70% de demanda).**
2.  **Perfiles de usuario detallados que muestren claramente la disponibilidad (95% de demanda).**

Ignorar la optimización de rendimiento y la arquitectura escalable (mencionado en comentarios libres) es un riesgo técnico a mediano plazo.