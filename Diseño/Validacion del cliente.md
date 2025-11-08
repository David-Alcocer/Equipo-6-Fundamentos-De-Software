🎯 Validación de Cliente: El Pivote Estratégico de PeerHive

Este documento detalla el pipeline (proceso) de desarrollo de PeerHive, centrado en cómo la Validación de Cliente nos permitió pivotar de un prototipo inicial a un blueprint de desarrollo alineado con las reglas de negocio.

1. El Punto de Partida: La Hipótesis del Usuario (N=20)

Para definir los requisitos iniciales (RF y RNF), realizamos una encuesta a 20 alumnos. El análisis generó nuestra hipótesis de producto inicial:

📱 RNF Core: La plataforma debe ser mobile-first (80%) y extremadamente intuitiva (75%).

⚙️ RF Prioritarios: El pain point principal es la fricción al encontrar y agendar. Las prioridades eran:

Facilidad para encontrar asesores (75%).

Facilidad para contactar asesores (60%).

Agendamiento vía calendario automatizado (70%).

Poder elegir al asesor (80%).

Acceso a historial (95%) y grabaciones de sesiones (95%).

✨ Insight Clave (UX): Un 30% deseaba un modo de "vista pública" sin registro obligatorio.

2. La Primera Iteración: El Artefacto de Prueba (Mockup 1.0)

Con esta data, el integrante Leonardo San Martín desarrolló el primer artefacto de prueba.

Herramienta: Figma

Esfuerzo: 6 horas hábiles

Resultado: Un prototipo de fidelidad media-alta listo para la validación.

3. La Validación de Cliente: La Voz del Negocio

Con el Mockup 1.0 en mano, procedimos a la fase más crítica: la validación del cliente. Queríamos un feedback robusto que definiera las reglas de negocio, por lo que nos presentamos ante el Coordinador Luis Basto en dos sesiones (20 y 21 de octubre).

Para asegurar la captura total de requisitos, la primera sesión de 40 minutos fue grabada y procesada con nuestro pipeline de IA:

Grabación de Audio ➡️ Transcripción ➡️ NoteBookLM ➡️ Resumen Ejecutivo

El feedback del cliente fue transformador y redefinió el scope (alcance) del proyecto:

🏛️ 1. El Pilar de Negocio: Reglas y Auditoría
La administración de créditos es un proceso complejo que debe ejecutarse al final del semestre y cumplir las reglas de Control Escolar. Para garantizar la evidencia, se propuso una integración con Microsoft Teams para grabar sesiones, generar logs de asistencia y registrar la duración.

🤝 2. La Arquitectura de Roles (IAM)
Se definió una arquitectura de permisos (IAM) clara. El personal académico (Coordinadores) necesita un rol de validación. Los roles son: Asesor, Asesorado y Coordinador.

🗓️ 3. El Control del Calendario
Si bien los estudiantes pueden calendarizar libremente, el sistema debe permitir a la administración definir períodos y ventanas de tiempo específicas para las asesorías.

4. El Contraste: Validación de Usabilidad (N=9)

Simultáneamente, lanzamos un forms para que los compañeros (usuarios finales) testearan el Mockup 1.0. Los resultados (N=9) nos dieron la otra mitad de la historia:

✅ Éxito Funcional (91.11% UX)
¡La lógica funcionaba! El workflow (flujo de trabajo) central fue validado. Módulos como el Chat (100%), Dashboard y Videollamadas (97%) fueron recibidos con una satisfacción altísima.

⚠️ Deuda Técnica en UI (UX Polish)
A pesar del éxito funcional, el frontend acumuló "deuda técnica". Aunque la UI se percibió como "intuitiva", se detectaron inconsistencias críticas en la capa de presentación: paleta de colores, tipografía, redundancia de información y mal balance visual.

5. La Síntesis: Hacia el Mockup 2.0

Teníamos dos datasets de feedback oro puro:

Validación de Cliente: Qué debía hacer el sistema (Reglas de Negocio).

Validación de Usuario: Cómo debía sentirse el sistema (UI/UX).

Implementamos un pipeline de síntesis final:

(Feedback UI N=9) + (Resumen Cliente) ➡️ Gemini ➡️ Backlog 2.0 (RF, RNF, Historias de Usuario)

Al pedirle a la IA que fusionara ambas fuentes, generamos un backlog de producto detallado que sirvió como blueprint para el Mockup 2.0, una versión que no solo era funcionalmente intuitiva, sino también alineada con las reglas críticas del negocio.

🚀 Conclusión

La validación de cliente fue el pivote esencial del proyecto. Nos movió de "construir una buena idea" a "construir la solución correcta". El Mockup 1.0 validó la lógica de usuario, pero el feedback del Coordinador Basto nos dio la arquitectura de negocio. Al fusionar ambas visiones, el Mockup 2.0 se convirtió en un prototipo robusto, listo para un desarrollo con un riesgo técnico y de negocio mucho menor.