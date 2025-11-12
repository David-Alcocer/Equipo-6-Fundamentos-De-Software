# Proyecto PeerHive: Historias de Usuario Funcionales

Este documento define las **Historias de Usuario (HU)** que describen las funcionalidades clave de la plataforma PeerHive. 

Las historias aquí listadas representan las **características funcionales** del sistema (lo que el sistema *hace*) y están priorizadas para guiar el desarrollo del Producto Mínimo Viable (MVP) y las futuras iteraciones.

---

## Historias de Usuario Funcionales

A continuación, se presenta el desglose de las funcionalidades principales de la plataforma, agrupadas por módulo y priorizadas según su impacto en el usuario.

| ID | Módulo | Actor | Descripción (Como... Quiero... Para...) | Criterios de Aceptación | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-008** | Alertas de sesión | Usuario | Como usuario, quiero recibir recordatorios antes de mis sesiones, para no olvidar mis compromisos de asesoría. | Se envía alerta automática 30 minutos antes de la sesión a ambos usuarios. | Baja |
| **HU-009** | Reporte de créditos | Asesor | Como asesor, quiero generar un reporte de horas al final del semestre, para presentarlo a la coordinación para créditos. | Debe incluir matrícula, horas acumuladas, fechas y duración de cada sesión. | Media |
| **HU-010** | Conexión y colaboración | Asesorado | Como asesorado, quiero enviar una solicitud detallada de ayuda, para que un asesor pueda atender mi necesidad. | Debe incluir materia, tema, descripción y tiempo estimado de respuesta. | **Alta** |
| **HU-011** | Gestión de solicitudes | Asesor | Como asesor, quiero ver y gestionar las solicitudes que recibo, para decidir cuáles atender. | Las solicitudes se listan con prioridad según tiempo de respuesta. Notificaciones inmediatas al recibir una nueva solicitud. | **Alta** |
| **HU-012** | Tickets | Asesor | Como asesor quiero aceptar una solicitud para asignármela y comunicarme con el aprendiz. | El sistema permite al asesor aceptar una solicitud de ayuda para asignársela y habilitar la comunicación directa con el aprendiz. | **Alta** |
| **HU-013** | Videollamadas | Asesor | Como asesor quiero generar un enlace de videollamada de Teams desde la sesión programada para realizar la asesoría en línea. | El sistema permite al asesor generar un enlace de videollamada de Microsoft Teams desde la sesión programada para realizar la asesoría en línea con el aprendiz. | **Alta** |
| **HU-014** | Videollamadas | Asesorado | Como asesorado quiero unirme a la videollamada de mi sesión ya programada para recibir asesoría remota. | El sistema permite al asesorado unirse a la videollamada generada en su calendario ya programado de la sesión para recibir la asesoría remota desde la plataforma. | **Alta** |
| **HU-015** | Límite de solicitudes | Usuario | Como usuario, quiero tener un límite de solicitudes activas, para evitar saturar el sistema. | No puedo tener más de tres solicitudes activas al mismo tiempo. | Media |
| **HU-016** | Cierre de solicitud | Asesorado | Como asesorado, quiero poder cancelar una solicitud enviada, para evitar sesiones innecesarias si ya resolví mi duda. | Puedo cancelar mientras la solicitud no haya sido aceptada. | Baja |
| **HU-025** | Rendimiento | Usuario | Como usuario, quiero que la plataforma cargue rápido, para no perder tiempo esperando. | Las páginas clave deben cargar en menos de 2 segundos. | Media |
| **HU-026** | Soporte al usuario | Usuario | Como usuario, quiero poder reportar errores o pedir soporte técnico fácilmente, para resolver problemas rápidamente. | Debe haber un canal de soporte accesible dentro de la plataforma. | Baja |
| **HU-027** | Privacidad | Usuario | Como usuario, quiero saber que la plataforma respeta mi privacidad y mis datos, para confiar en su uso académico. | Debe haber aviso de privacidad claro y consentimiento informado de uso de datos. | **Alta** |
| **HU-028** | Usabilidad | Usuario | Como usuario, quiero realizar videollamadas dentro de la misma plataforma, mediante un canal exclusivo de Microsoft Teams. | La opción de “Iniciar videollamada” solo aparece una vez que la solicitud de ayuda ha sido aceptada. | **Alta** |
| **HU-029** | Buscador | Asesorado | Como asesorado, quiero buscar asesores que tengan el conocimiento acerca de mi duda/tema específico para generar ticket. | El asesorado debe poder localizar a un asesor específico por materia y generar un ticket directamente desde su perfil, siempre que esté disponible. | Media |
| **HU-030** | Administración | Administrador | Como administrador quiero ver y responder reportes de soporte enviados por los usuarios. | El sistema permite al administrador visualizar y responder los reportes de soporte enviados por los usuarios para dar seguimiento y resolver incidencias. | **Alta** |
| **HU-031** | Reportes | Usuario | Como usuario quiero crear un reporte de problema para comunicar incidencias al administrador. | El sistema permite al usuario crear y enviar un reporte de problema para informar incidencias al administrador y facilitar su resolución. | Baja |