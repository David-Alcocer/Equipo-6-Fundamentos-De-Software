## 👥 Herramientas usadas

**Creación de prototipos:**  
[Figma – Profile Setting Page UI (Community)](https://www.figma.com/design/Ae1PKueYyEnYAxevZZ8UEP/Profile-setting-page-UI--Community-?node-id=0-1&p=f&t=glqPa2RehjGyGoNf-0)

[Figma tarea de prototipo ] (https://www.figma.com/proto/MzYcOXkX42vubYmrf3KQvW/dise%C3%B1o?page-id=7%3A513&node-id=11-24233&viewport=500%2C1206%2C0.23&t=8v1bpaNZFSRvojwA-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=11%3A24233)

**Mock up (desplegado):**  
[Peerhive.mockup] (https://peerhive-app.netlify.app/)

El mock up se realizo con prompts de chat gpt usando los wirerframes de baja calidad, dandole instruciones precisas de como implementar las cosas y los roles que deberia tener para chatgpt pueda hacerlo lo mas apegado a la expectativa.

Ademas, los cambios reflejados en las historias de usuario, priorizacion y requisitos funcionales y no funcionales se debieron a la sesión de validación que tuvimos con el coordinador de LIS. Quien dió como bueno la parte del diseño simple pero facil de entender del mock up (login y sign up); sugirió agregar partes como cuenta de admin, añadir cosas como monitoreo de videollamadas atraves de un documento de transcripcion integrado en microsoft teams.

📅 **Fecha:** 24 de octubre de 2025  


---

## 🧩 Primeros prototipos

### 🔐 **Log In**
**Datos:**  
- Correo institucional  
- Contraseña  

**Botones:**  
- Registrarse  
- Iniciar sesión  
- Iniciar  

**Estático:**  
- Foto de perfil  
- Nombre  
- Matrícula  


---

### 🧾 **Sign Up**
**Datos:**  
- Nombre completo  
- Licenciatura  
- Contraseña  
- Semestre  
- Correo institucional  
- Rol  

**Botones:**  
- Registrarse  
- Iniciar sesión  
- Verificar correo institucional  


---

### 🧭 **Panel de inicio (Asesor)**
**Datos:**  
- Asignaturas impartidas  

**Analytics:**  
- Reporte de créditos  
- Horas totales hechas  
- Porcentaje de avance para acreditar  

**Botones:**  
- Descargar reporte de créditos  

**Estático:**  
- Foto de perfil  
- Nombre  
- Matrícula  


---

### 🎥 **Panel de gestión de la sesión (Videollamada y monitoreo)**
**Estático:**  
- Foto de perfil  
- Nombre  
- Matrícula  
- Ticket de la sesión  
- Estudiante que se asesora  
- Logs de check-in  
- Rol del usuario  

**Botones:**  
- Reportar  
- Iniciar  
- Finalizar  
- Chats  

**Custom:**  
- Temporizador de la reunión  


---

### 💬 **Panel de sesión (Estudiante / Asesor que necesita ayuda)**
**Estático:**  
- Foto de perfil  
- Nombre  
- Matrícula  
- Ticket de la sesión  
- Asesor que da la asesoría  
- Logs de check-in  
- Rol del usuario  

**Botones:**  
- Reportar  
- Iniciar  
- Finalizar  
- Chats  

**Custom:**  
- Sesiones agendadas  


---

### 📝 **Panel de solicitud**
**Estáticos:**  
- Asignación de ticket  
- Materia  
- Tiempo estimado  
- Descripción de la duda  
- Máximo de solicitudes simultáneas  

**Botones:**  
- Crear  
- cancelar
- unirse

**Custom:**  
- Calendario de fecha  


---

### 💭 **Chat de estudiante**
**Estático:**  
- Foto de perfil  
- Nombre  
- Asesor que da la asesoría  
- Rol del usuario  

**Botones:**  
- Enviar  
- Agregar chat  

**Custom:**  
- Barra de búsqueda del chat  
- Scroll  
- Enviar archivos  


📅 **Fecha:** 25 de octubre de 2025  

Conclusión de la tarea de prototipos: sign up y login
se subieron los wireframes y proximos a revisión

**Para la siguiente fecha de sprint**
- realizar mejoras en color, diseño, UX/UI [¬/]
- implementación de AI figma [X]



📅 **Fecha:** 25 de noviembre de 2025  
- Ultimos cambios del diseño y usabilidad al prototipo

## 🔹 Qué cambió / Qué se rediseñó

| Área / Componente | Cambio / Mejora propuesta |
|-------------------|---------------------------|
| **Estructura general & arquitectura de navegación** | Se reestructuró la navegación: menú más claro, jerarquía de páginas refinada y rutas reorganizadas para mejorar el flujo de usuario. |
| **Interfaz visual (UI)** | Actualización de estilos: nuevas fuentes, colores, espaciados y uso de iconografía moderna y limpia. |
| **Diseño responsivo / Móvil** | Mejora en la experiencia móvil: mayor adaptabilidad, legibilidad, espaciados táctiles y usabilidad optimizada. |
| **Flujos de usuario (UX)** | Simplificación de flujos críticos como registro, login y navegación entre secciones, permitiendo un acceso más rápido a funciones clave. |
| **Feedback visual y estados de UI** | Inclusión de estados visuales (hover, error, confirmación), mensajes más claros y validaciones mejoradas. |
| **Prototipado de componentes clave** | Desarrollo de wireframes y mockups refinados para módulos esenciales como login, solicitudes, chat, calendario y perfil. |

---

## 🎯 Por qué se hicieron esos cambios (justificación)

- Para mejorar la **usabilidad** y reducir la fricción en el uso diario.  
- Para asegurar que la interfaz funcione correctamente en una variedad de dispositivos, especialmente móviles.  
- Para ofrecer una experiencia **más profesional, moderna y coherente** UX/UI.   

---

## ✅ Qué problemas se solucionan / Qué mejoras trae

- Menús y funcionalidades más intuitivas → **menos confusión del usuario**.  
- Mejor **legibilidad** y **accesibilidad**, incluso en pantallas pequeñas.  
- Flujos de registro, solicitudes y navegación más fluidos → **menor tiempo**.  
- Reducción de errores visuales: validaciones claras.   

---

## 🧩 Impacto para el usuario final

- Experiencia más **agradable, clara y coherente**.  
- Navegación más sencilla y con pasos reducidos para llegar a funcionalidades importantes.  
- Mejor desempeño y visualización en **dispositivos móviles**.  
- Interfaz más profesional que brinda **mayor confianza** en el sistema.  
- Menor incertidumbre durante la interacción gracias a mejores ayudas visuales

---

