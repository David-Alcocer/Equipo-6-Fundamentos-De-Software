# Proyecto PeerHive · Historias de Usuario y Requisitos No Funcionales

Este documento define las **Historias de Usuario (HU)** y los **Requisitos No Funcionales (RNF)** que describen las funcionalidades, reglas de negocio y atributos de calidad de la plataforma **PeerHive**, alineados con la versión final del MockUp y las validaciones realizadas.

---

## 🧩 Historias de Usuario

A continuación se presenta el conjunto de historias de usuario organizadas por módulo, con su respectivo actor, criterios de aceptación y prioridad.

| ID | Módulo | Actor | Historia de Usuario | Criterios de Aceptación | Prioridad |
|----|--------|--------|---------------------|--------------------------|-----------|
| HU-001 | Autenticación | Usuario (Nuevo) | Como nuevo usuario quiero registrarme usando mi correo institucional UADY para validar que pertenezco a la universidad. | El sistema solo permite registro con correos institucionales UADY, valida dominio, envía enlace de activación y confirma la cuenta tras verificación exitosa. | Alta |
| HU-002 | Selección de rol | Usuario (Nuevo) | Como nuevo usuario quiero elegir si me registro como asesor o aprendiz para recibir las funciones adecuadas. | Si elijo **Asesor**, el sistema exige la **carga obligatoria del Kardex en formato PDF** y la cuenta queda **pendiente de validación administrativa** antes de activarse. | Alta |
| HU-003 | Autenticación | Usuario (Registrado) | Como usuario registrado quiero iniciar sesión con mi correo y contraseña para acceder a las funcionalidades según mi rol. | El sistema valida credenciales, redirige al panel correspondiente por rol y muestra mensajes claros ante errores. | Alta |
| HU-004 | Autenticación | Usuario | Como usuario quiero recuperar mi contraseña en caso de olvido para restablecer mi acceso al sistema. | El sistema envía un enlace de recuperación al correo institucional y permite definir una nueva contraseña segura. | Baja |
| HU-005 | Autenticación | Administrador | Como administrador quiero gestionar el estado de los asesores para controlar quién puede brindar asesorías. | El administrador puede activar, desactivar o modificar el estado de los asesores dentro de la plataforma. | Alta |
| HU-007 | Perfil del asesor | Asesor | Como asesor quiero seleccionar las asignaturas que puedo impartir para que los estudiantes puedan encontrarme según mis competencias. | Se muestra la lista oficial de asignaturas de la carrera para su selección. | Alta |
| HU-008 | Alertas de sesión | Usuario | Como usuario quiero recibir recordatorios antes de mis sesiones para no olvidar mis compromisos de asesoría. | Se envía una alerta automática 30 minutos antes de la sesión a ambos usuarios. | Baja |
| HU-009 | Reporte de créditos | Asesor | Como asesor quiero generar un reporte de horas al final del semestre para presentarlo a la coordinación y obtener créditos. | El reporte incluye matrícula, horas acumuladas, fechas y duración de cada sesión. | Media |
| HU-010 | Conexión y colaboración | Asesorado | Como asesorado quiero enviar una solicitud detallada de ayuda para que un asesor pueda atender mi necesidad. | La solicitud incluye materia, tema, descripción y tiempo estimado de respuesta. | Alta |
| HU-011 | Gestión de solicitudes | Asesor | Como asesor quiero ver y gestionar las solicitudes que recibo para decidir cuáles atender. | Las solicitudes se listan por prioridad según tiempo de respuesta y generan notificaciones inmediatas. | Alta |
| HU-012 | Tickets | Asesor | Como asesor quiero aceptar una solicitud para asignármela y comunicarme con el aprendiz. | El sistema permite aceptar la solicitud y habilita la comunicación directa con el aprendiz. | Alta |
| HU-013 | Videollamadas | Asesor | Como asesor quiero generar un enlace de videollamada de Microsoft Teams desde la sesión programada para realizar la asesoría en línea. | El sistema genera el enlace de videollamada desde la sesión agendada. | Alta |
| HU-014 | Videollamadas | Asesorado | Como asesorado quiero unirme a la videollamada de mi sesión ya programada para recibir asesoría remota. | El sistema permite unirme a la videollamada desde mi calendario de sesiones. | Alta |
| HU-015 | Límite de solicitudes | Usuario | Como usuario quiero tener un límite de solicitudes activas para evitar saturar el sistema. | No se permite tener más de tres solicitudes activas al mismo tiempo. | Media |
| HU-016 | Cierre de solicitud | Asesorado | Como asesorado quiero cancelar una solicitud enviada si ya resolví mi duda para evitar sesiones innecesarias. | La solicitud puede cancelarse solo si aún no ha sido aceptada. | Baja |
| HU-017 | Control de sesiones | Usuario | Como asesor quiero agendar una sesión con el asesorado para coordinar fecha y hora de asesoría. | La sesión puede sincronizarse con calendarios externos (Google u Outlook). | Alta |
| HU-018 | Comunicación | Usuario | Como usuario quiero comunicarme mediante chat privado con la persona de mi sesión para intercambiar mensajes y archivos. | El chat es individual, muestra estado “en línea” y permite envío de archivos hasta 5 MB. | Alta |
| HU-019 | Buscador | Asesor | Como asesor quiero buscar aprendices con tickets activos para brindar apoyo. | Se puede filtrar por materia, tema o disponibilidad. | Media |
| HU-020 | Chat individual | Usuario | Como usuario quiero ver la identidad de la persona con quien converso en el chat para tener claridad en la comunicación. | Se muestra nombre, rol e imagen de perfil del usuario. | Baja |
| HU-021 | Buscador | Asesorado | Como asesorado quiero buscar asesores con conocimientos en mi tema específico para generar un ticket. | El asesorado puede localizar a un asesor por materia y generar un ticket desde su perfil si está disponible. | Media |
| HU-022 | Administración | Administrador | Como administrador quiero ver y responder reportes de soporte enviados por los usuarios. | El sistema permite visualizar, responder y dar seguimiento a los reportes de soporte. | Alta |
| HU-023 | Reportes | Usuario | Como usuario quiero crear un reporte de problema para comunicar incidencias al administrador. | El usuario puede crear y enviar reportes de problemas para su atención y resolución. | Baja |

---

## 🧪 Requisitos No Funcionales (RNF)

Los **Requisitos No Funcionales** describen los **atributos de calidad del sistema**, tales como seguridad, rendimiento, usabilidad y diseño.

| ID | Módulo | Criterio de Aceptación |
|----|--------|------------------------|
| RNF-001 | Seguridad | Toda la información sensible debe cifrarse (contraseñas, matrículas, chat). |
| RNF-002 | Recuperación de datos | Deben existir copias de seguridad diarias y capacidad de restauración en menos de 24 horas. |
| RNF-003 | Diseño responsivo | La interfaz debe adaptarse automáticamente a diferentes tamaños de pantalla y dispositivos. |
| RNF-004 | Usabilidad | El acceso a funciones clave debe lograrse en pocos pasos mediante una interfaz clara y coherente. |
| RNF-005 | Rendimiento | Las páginas principales deben cargar en menos de 2 segundos. |
| RNF-006 | Soporte al usuario | Debe existir un canal de soporte accesible dentro de la plataforma. |
| RNF-007 | Privacidad | Debe mostrarse aviso de privacidad claro y solicitar consentimiento informado para el uso de datos. |
| RNF-008 | Control de videollamadas | La opción de “Iniciar videollamada” solo aparece cuando la solicitud de ayuda ha sido aceptada. |
| RNF-009 | Usabilidad y diseño visual | La plataforma debe contar con **modo claro y modo oscuro**, ambos totalmente funcionales y sin errores de contraste. |

---

✅ Este documento integra las funcionalidades actuales del sistema, la validación administrativa mediante **Kardex en PDF para asesores** y las mejoras de **usabilidad visual con modo claro/oscuro**, alineándose con el MockUp final del proyecto PeerHive.

