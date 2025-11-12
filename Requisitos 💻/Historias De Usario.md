# Proyecto PeerHive: Historias de Usuario

Este documento define las **Historias de Usuario (HU)** que describen las funcionalidades clave de la plataforma PeerHive. 

Las historias aquí listadas representan las **características funcionales** del sistema (lo que el sistema *hace*) y están priorizadas para guiar el desarrollo del Producto Mínimo Viable (MVP) y las futuras iteraciones.

Esta separación es fundamental para la planificación del desarrollo:
* **Requisitos Funcionales (RF):** Definen **qué hace** el sistema (sus características y funciones).
* **Requisitos No Funcionales (RNF):** Definen **cómo es** el sistema (sus atributos de calidad, como velocidad, seguridad o usabilidad).
---

## Historias de Usuario / Requisitos Funcionales

A continuación, se presenta el desglose de las funcionalidades principales de la plataforma, agrupadas por módulo y priorizadas según su impacto en el usuario.

| ID | Módulo | Actor | Descripción (Como... Quiero... Para...) |
| :--- | :--- | :--- | :--- |
| **HU-001** | Autenticación | Usuario (Nuevo) | Como nuevo usuario quiero registrarme usando mi correo institucional UADY para validar que pertenezco a la universidad. |
| **HU-002** | Selección de rol | Usuario (Nuevo) | Como nuevo usuario, quiero elegir si me registro como asesor o aprendiz, para recibir las funciones adecuadas. |
| **HU-003** | Autenticación | Usuario (Registrado) | Como usuario registrado quiero poder iniciar sesión con mi correo y contraseña para acceder a las funcionalidades según mi rol. |
| **HU-004** | Autenticación | Usuario | Como usuario quiero poder recuperar mi contraseña en caso de olvido para restablecer mi acceso al sistema. |
| **HU-005** | Autenticación | Administrador | Como administrador quiero gestionar el estado de los asesores para controlar quién puede brindar asesorías. |
| **HU-007** | Perfil del asesor | Asesor | Como asesor, quiero seleccionar las asignaturas que puedo impartir, para que los estudiantes puedan encontrarme según mis competencias. |
| **HU-008** | Alertas de sesión | Usuario | Como usuario, quiero recibir recordatorios antes de mis sesiones, para no olvidar mis compromisos de asesoría. |
| **HU-009** | Reporte de créditos | Asesor | Como asesor, quiero generar un reporte de horas al final del semestre, para presentarlo a la coordinación para créditos. |
| **HU-010** | Conexión y colaboración | Asesorado | Como asesorado, quiero enviar una solicitud detallada de ayuda, para que un asesor pueda atender mi necesidad. |
| **HU-011** | Gestión de solicitudes | Asesor | Como asesor, quiero ver y gestionar las solicitudes que recibo, para decidir cuáles atender. |
| **HU-012** | Tickets | Asesor | Como asesor quiero aceptar una solicitud para asignármela y comunicarme con el aprendiz. |
| **HU-013** | Videoll llamadas | Asesor | Como asesor quiero generar un enlace de videollamada de Teams desde la sesión programada para realizar la asesoría en línea. |
| **HU-014** | Videollamadas | Asesorado | Como asesorado quiero unirme a la videollamada de mi sesión ya programada para recibir asesoría remota. |
| **HU-015** | Límite de solicitudes | Usuario | Como usuario, quiero tener un límite de solicitudes activas, para evitar saturar el sistema. |
| **HU-016** | Cierre de solicitud | Asesorado | Como asesorado, quiero poder cancelar una solicitud enviada, para evitar sesiones innecesarias si ya resolví mi duda. |
| **HU-017** | Control de sesiones | Usuario | Como asesor, quiero agendar una sesión con el asesorado, para coordinar fecha y hora de asesoría. |
| **HU-018** | Comunicación | Usuario | Como usuario, quiero comunicarme mediante chat privado con la persona de mi sesión, para intercambiar mensajes y archivos. |
| **HU-019** | Buscador | Asesor | Como asesor, quiero buscar aprendices con tickets activos, brindar apoyo. |
| **HU-020** | Chat individual | Usuario | Como usuario, quiero ver la identidad de la persona con quien converso en el chat, para tener claridad en la comunicación. |
| **HU-028** | Usabilidad | Usuario | Como usuario, quiero realizar videollamadas dentro de la misma plataforma, mediante un canal exclusivo de Microsoft Teams. |
| **HU-029** | Buscador | Asesorado | Como asesorado, quiero buscar asesores que tengan el conocimiento acerca de mi duda/tema específico para generar ticket. |
| **HU-030** | Administración | Administrador | Como administrador quiero ver y responder reportes de soporte enviados por los usuarios. |
| **HU-031** | Reportes | Usuario | Como usuario quiero crear un reporte de problema para comunicar incidencias al administrador. |

---

## Historias de usuario / Requisitos No Funcionales (RNF)

Estos son los requisitos que describen **atributos de calidad, restricciones o el "cómo"** debe operar el sistema, en lugar de una función específica.

| ID | Módulo | Actor | Descripción (Como... Quiero... Para...) |
| :--- | :--- | :--- | :--- |
| **HU-021** | Seguridad | Usuario | Como usuario, quiero que mis datos personales estén protegidos, para usar la plataforma con confianza. |
| **HU-022** | Recuperación de datos | Usuario | Como usuario, quiero que el sistema no pierda mis datos, para que mis registros de horas y mensajes estén siempre disponibles. |
| **HU-023** | Diseño responsivo | Usuario | Como usuario móvil, quiero poder usar la plataforma desde mi teléfono o tableta, para acceder desde cualquier lugar. |
| **HU-024** | Usabilidad | Usuario | Como usuario, quiero que la interfaz sea clara y sencilla, para usar la plataforma sin complicaciones. |
| **HU-025** | Rendimiento | Usuario | Como usuario, quiero que la plataforma cargue rápido, para no perder tiempo esperando. |
| **HU-026** | Soporte al usuario | Usuario | Como usuario, quiero poder reportar errores o pedir soporte técnico fácilmente, para resolver problemas rápidamente. |
| **HU-027** | Privacidad | Usuario | Como usuario, quiero saber que la plataforma respeta mi privacidad y mis datos, para confiar en su uso académico. |