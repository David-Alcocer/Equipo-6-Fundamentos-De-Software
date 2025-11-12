# Proyecto PeerHive: Historias de Usuario

Este documento define las **Historias de Usuario (HU)** que describen las funcionalidades clave de la plataforma PeerHive. 

Las historias aquí listadas representan las **características funcionales** del sistema (lo que el sistema *hace*) y están priorizadas para guiar el desarrollo del Producto Mínimo Viable (MVP) y las futuras iteraciones.

Esta separación es fundamental para la planificación del desarrollo:
* **Requisitos Funcionales (RF):** Definen **qué hace** el sistema (sus características y funciones).
* **Requisitos No Funcionales (RNF):** Definen **cómo es** el sistema (sus atributos de calidad, como velocidad, seguridad o usabilidad).
---

## Historias de Usuario / Requisitos Funcionales

A continuación, se presenta el desglose de las funcionalidades principales de la plataforma, agrupadas por módulo y priorizadas según su impacto en el usuario.

| ID | Módulo | Actor | Descripción | Criterios de Aceptación | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| HU-001 | Autenticación | Usuario (Nuevo) | Como nuevo usuario quiero registrarme usando mi correo institucional UADY para validar que pertenezco a la universidad | El sistema permite registro solo con correos institucionales UADY, valida dominio, envía enlace de activación y confirma la cuenta tras verificación exitosa. | Alta |
| HU-002 | Selección de rol | Usuario (Nuevo) | Como nuevo usuario, quiero elegir si me registro como asesor o aprendiz, para recibir las funciones adecuadas. | Si elijo 'Asesor', mi cuenta queda pendiente de validación administrativa. | Alta |
| HU-003 | Autenticación | Usuario (Registrado) | Como usuario registrado quiero poder iniciar sesión con mi correo y contraseña para acceder a las funcionalidades según mi rol | El sistema valida credenciales institucionales y redirige al panel según el rol asignado, restringiendo accesos no autorizados y mostrando mensajes claros ante errores | Alta |
| HU-004 | Autenticación | Usuario | Como usuario quiero poder recuperar mi contraseña en caso de olvido para restablecer mi acceso al sistema | El sistema permite recuperar la contraseña mediante un enlace enviado al correo institucional verificado, permitiendo definir una nueva clave segura y restablecer el acceso al sistema | Baja |
| HU-005 | Autenticación | Administrador | Como administrador quiero gestionar el estado de los asesores para controlar quién puede brindar asesorías | El sistema permite al administrador activar, desactivar o modificar el estado de los asesores para controlar quién puede brindar asesorías dentro de la plataforma. | Alta |
| HU-007 | Perfil del asesor | Asesor | Como asesor, quiero seleccionar las asignaturas que puedo impartir, para que los estudiantes puedan encontrarme según mis competencias. | Debe mostrarse la lista oficial de asignaturas de la carrera. | Alta |
| HU-008 | Alertas de sesión | Usuario | Como usuario, quiero recibir recordatorios antes de mis sesiones, para no olvidar mis compromisos de asesoría. | Se envía alerta automática 30 minutos antes de la sesión a ambos usuarios. | Baja |
| HU-009 | Reporte de créditos | Asesor | Como asesor, quiero generar un reporte de horas al final del semestre, para presentarlo a la coordinación para créditos. | Debe incluir matrícula, horas acumuladas, fechas y duración de cada sesión. | Media |
| HU-010 | Conexión y colaboración | Asesorado | Como asesorado, quiero enviar una solicitud detallada de ayuda, para que un asesor pueda atender mi necesidad. | Debe incluir materia, tema, descripción y tiempo estimado de respuesta. | Alta |
| HU-011 | Gestión de solicitudes | Asesor | Como asesor, quiero ver y gestionar las solicitudes que recibo, para decidir cuáles atender. | Las solicitudes se listan con prioridad según tiempo de respuesta. Notificaciones inmediatas al recibir una nueva solicitud. | Alta |
| HU-012 | Tickets | Asesor | Como asesor quiero aceptar una solicitud para asignármela y comunicarme con el aprendiz | El sistema permite al asesor aceptar una solicitud de ayuda para asignársela y habilitar la comunicación directa con el aprendiz. | Alta |
| HU-013 | Videollamadas | Asesor | Como asesor quiero generar un enlace de videollamada de Teams desde la sesión programa para realizar la asesoría en línea | El sistema permite al asesor generar un enlace de videollamada de Microsoft Teams desde la sesión programada para realizar la asesoría en línea con el aprendiz | Alta |
| HU-014 | Videollamadas | Asesorado | Como asesorado quiero unirme a la videollamada de mi sesión ya programada para recibir asesoría remota | El sistema permite al asesorado unirse a la videollamada generada en su calendario ya programado de la sesión para recibir la asesoría remota desde la plataforma | Alta |
| HU-015 | Límite de solicitudes | Usuario | Como usuario, quiero tener un límite de solicitudes activas, para evitar saturar el sistema. | No puedo tener más de tres solicitudes activas al mismo tiempo. | Media |
| HU-016 | Cierre de solicitud | Asesorado | Como asesorado, quiero poder cancelar una solicitud enviada, para evitar sesiones innecesarias si ya resolví mi duda. | Puedo cancelar mientras la solicitud no haya sido aceptada. | Baja |
| HU-017 | Control de sesiones | Usuario | Como asesor, quiero agendar una sesión con el asesorado, para coordinar fecha y hora de asesoría. | Debe poder sincronizarse con calendarios externos (Google, Outlook). | Alta |
| HU-018 | Comunicación | Usuario | Como usuario, quiero comunicarme mediante chat privado con la persona de mi sesión, para intercambiar mensajes y archivos. | El chat debe ser individual, con estado 'en línea' y envío de archivos hasta 5 MB. | Alta |
| HU-019 | Buscador | Asesor | Como asesor, quiero buscar aprendices con tickets activos, brindar apoyo. | Puedo filtrar por materia, tema o disponibilidad. | Media |
| HU-020 | Chat individual | Usuario | Como usuario, quiero ver la identidad de la persona con quien converso en el chat, para tener claridad en la comunicación. | Debe mostrarse nombre, rol e imagen de perfil del usuario. | Baja |
| HU-029 | Buscador | Asesorado | Como asesorado, quiero buscar asesores que tengan el conocimiento acerca de mi duda/tema específico para generar ticket | El asesorado debe poder localizar a un asesor específico materia y generar un ticket directamente desde su perfil, siempre que este disponible. | Media |
| HU-030 | Administración | Administrador | Como administrador quiero ver y responder reportes de soporte enviados por los usuarios | El sistema permite al administrador visualizar y responder los reportes de soporte enviados por los usuarios para dar seguimiento y resolver incidencias. | Alta |
| HU-031 | Reportes | Usuario | Como usuario quiero crear un reporte de problema para comunicar incidencias al administrador | El sistema permite al usuario crear y enviar un reporte de problema para informar incidencias al administrador y facilitar su resolución. | Baja |

---

## Historias de usuario / Requisitos No Funcionales (RNF)

Estos son los requisitos que describen **atributos de calidad, restricciones o el "cómo"** debe operar el sistema, en lugar de una función específica.

| ID | Módulo | Actor | Descripción | Criterios de Aceptación | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| HU-021 | Seguridad | Usuario | Como usuario, quiero que mis datos personales estén protegidos, para usar la plataforma con confianza. | Toda la información sensible debe cifrarse (contraseñas, matrículas, chat). | Baja |
| HU-022 | Recuperación de datos | Usuario | Como usuario, quiero que el sistema no pierda mis datos, para que mis registros de horas y mensajes estén siempre disponibles. | Debe haber copias de seguridad diarias y restauración en menos de 24 horas. | Baja |
| HU-023 | Diseño responsivo | Usuario | Como usuario móvil, quiero poder usar la plataforma desde mi teléfono o tableta, para acceder desde cualquier lugar. | El diseño debe adaptarse automáticamente al dispositivo. | Baja |
| HU-024 | Usabilidad | Usuario | Como usuario, quiero que la interfaz sea clara y sencilla, para usar la plataforma sin complicaciones. | Acceso a funciones clave en pocos pasos. Interfaz coherente y visualmente agradable. | Alta |
| HU-025 | Rendimiento | Usuario | Como usuario, quiero que la plataforma cargue rápido, para no perder tiempo esperando. | Las páginas clave deben cargar en menos de 2 segundos. | Media |
| HU-026 | Soporte al usuario | Usuario | Como usuario, quiero poder reportar errores o pedir soporte técnico fácilmente, para resolver problemas rápidamente. | Debe haber un canal de soporte accesible dentro de la plataforma. | Baja |
| HU-027 | Privacidad | Usuario | Como usuario, quiero saber que la plataforma respeta mi privacidad y mis datos, para confiar en su uso académico. | Debe haber aviso de privacidad claro y consentimiento informado de uso de datos. | Alta |
| HU-028 | Usabilidad | Usuario | Como usuario, quiero realizar videollamadas dentro de la misma plataforma, mediante un canal exclusivo de Microsoft Teams | La opción de “Iniciar videollamada” solo aparece una vez que la solicitud de ayuda ha sido aceptada. | Alta |