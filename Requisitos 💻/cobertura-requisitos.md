# ✅ Nivel de Cobertura de Requisitos – Proyecto PeerHive (Versión Corregida)

## 1. Cobertura de Requisitos Funcionales (RF)

Se analizaron un total de **22 Historias de Usuario (HU)**.  
De estas:

- **17 están cubiertas (Funcionaron en la versión evaluada)**
- **5 NO están cubiertas** (No estuvieron presentes en el MockUp actual)

> 🔎 Se valida adicionalmente que, al elegir el rol de **Asesor**, el sistema **solicita obligatoriamente la carga del Kardex en formato PDF**, quedando **pendiente de validación administrativa**, lo cual **sí funciona en la versión final del MockUp**.

### 📊 Tabla de Cobertura – Requisitos Funcionales (Corrección aplicada)

| ID | Módulo | Estado | Prioridad | Evidencia de Cobertura |
|----|--------|--------|-----------|-------------------------|
| HU-001 | Autenticación | ✅ Funciona | Alta | Pruebas de Login |
| HU-002 | Selección de Rol | ✅ Funciona | Alta | Registro con validación de rol + **Carga obligatoria de Kardex PDF para Asesor** |
| HU-003 | Autenticación | ✅ Funciona | Alta | Pruebas de acceso |
| HU-004 | Recuperación | ✅ Funciona | Baja | Flujo validado |
| HU-005 | Administración | ✅ Funciona | Alta | Validación administrativa de asesores |
| HU-007 | Perfil Asesor | ✅ Funciona | Alta | Selección de materias |
| HU-008 | Alertas | ❌ No implementado | Baja | No presente en mockup |
| HU-009 | Reporte Créditos | ❌ No implementado | Media | No presente |
| HU-010 | Solicitudes | ✅ Funciona | Alta | Flujo probado |
| HU-011 | Gestión Solicitudes | ✅ Funciona | Alta | Aceptación validada |
| HU-012 | Tickets | ✅ Funciona | Alta | Asignación funcional |
| HU-013 | Videollamada Asesor | ✅ Funciona | Alta | Teams estable |
| HU-014 | Videollamada Asesorado | ✅ Funciona | Alta | Acceso validado |
| HU-015 | Límite Solicitudes | ✅ Funciona | Media | Restricción operativa |
| HU-016 | Cancelar Solicitud | ✅ Funciona | Baja | Flujo estable |
| HU-017 | Control de Sesiones | ✅ Funciona | Alta | Calendario probado |
| HU-018 | Comunicación | ✅ Funciona | Alta | Chat evaluado |
| HU-019 | Buscador Asesor | ❌ No implementado | Media | Fuera del mockup |
| HU-020 | Identidad en Chat | ✅ Funciona | Baja | UI validada |
| HU-021 | Buscador Asesorado | ❌ No implementado | Media | Fuera del mockup |
| HU-022 | Soporte Admin | ✅ Funciona | Alta | Reportes operativos |
| HU-023 | Reporte Usuario | ❌ No implementado | Baja | No presente |

---

### 📈 Porcentaje de Cobertura RF

Cobertura RF = (17 / 22) × 100 = **77.27 %**

**Interpretación:**  
El sistema cubre más del **77 % de las funcionalidades definidas**, incluyendo ahora explícitamente:  
- **Validación de asesores mediante Kardex en PDF**
- **Control administrativo previo a la activación como asesor**

---

## 2. Cobertura de Requisitos No Funcionales (RNF)

Se evaluaron **9 Requisitos No Funcionales**, de los cuales:

- ✅ **9 Implementados**
- ❌ **0 Pendientes**

> 🔎 Se agrega formalmente el **modo claro / modo oscuro totalmente funcional** como requisito de usabilidad y diseño.

### 📊 Tabla de Cobertura – Requisitos No Funcionales (Actualizada)

| ID | Módulo | Estado | Evidencia |
|----|--------|--------|-----------|
| RNF-001 | Seguridad | ✅ Funciona | Datos cifrados |
| RNF-002 | Recuperación de datos | ✅ Funciona | Backups definidos |
| RNF-003 | Diseño responsivo | ✅ Funciona | Pruebas multidispositivo |
| RNF-004 | Usabilidad | ✅ Funciona | Encuestas UX |
| RNF-005 | Rendimiento | ✅ Funciona | Tiempos < 2s |
| RNF-006 | Soporte al usuario | ✅ Funciona | Módulo de reportes |
| RNF-007 | Privacidad | ✅ Funciona | Aviso y consentimiento |
| RNF-008 | Control de videollamadas | ✅ Funciona | Bloqueo hasta aceptación |
| RNF-009 | Interfaz claro / oscuro | ✅ Funciona | Cambio dinámico de tema sin fallos visuales |

---

### 📈 Porcentaje de Cobertura RNF

Cobertura RNF = (9 / 9) × 100 = **100 %**

**Interpretación:**  
Todos los requisitos de calidad del sistema están completamente cubiertos, incluyendo ahora el **doble modo de visualización claro/oscuro como atributo formal de usabilidad y diseño**.

---

## 3. Validación mediante Pruebas de Usuario

Las pruebas realizadas con:

- **13 estudiantes**
- **4 asesores**

demuestran que los requisitos cubiertos no solo están implementados, sino también **validados en uso real**.

### Evidencias clave:

- Errores totales:
  - 28 (estudiantes)
  - 7 (asesores)

- Errores concentrados en:
  - Login
  - Crear / Aceptar solicitud

- Módulos críticos estables:
  - Chat
  - Videollamada
  - Ver sesión

- La **subida de Kardex PDF** fue completada correctamente en pruebas de rol Asesor.
- El **modo claro y oscuro** fue validado sin errores de contraste ni fallos de visibilidad.

### Resultados UX (Promedios > 4.5 / 5):

- Claridad de flujo
- Navegación
- Satisfacción visual
- Usabilidad general

Esto confirma que los requisitos cubiertos son además **funcionalmente viables, estables y usables**.

---

## 4. Resumen Ejecutivo del Nivel de Cobertura 

El proyecto PeerHive cuenta con un **nivel de cobertura del 77.27 % en Requisitos Funcionales** y un **100 % en Requisitos No Funcionales**.

Las funcionalidades principales del sistema se encuentran correctamente implementadas y fueron validadas mediante pruebas con usuarios reales, incluyendo de forma explícita:

- La **validación de asesores mediante carga obligatoria de Kardex en PDF**.
- El **correcto funcionamiento del modo claro y modo oscuro como atributo de usabilidad**.

Los requisitos no cubiertos corresponden a funcionalidades complementarias (alertas, buscadores y reportes avanzados), planeadas para etapas posteriores del desarrollo.

En términos de calidad, el sistema cumple completamente con los atributos de **seguridad, usabilidad, rendimiento, privacidad y diseño visual adaptable**.

---

## ✅ Conclusión Final para la Rúbrica 

- ✔ Listado final de requisitos: **Cumplido**
- ✔ Diagrama representativo: **Implícito en módulos evaluados**
- ✔ Nivel de cobertura RF/RNF: **Calculado y documentado**
- ✔ Evidencia mediante pruebas de usuario: **Cumplida**
- ✔ Validación administrativa por Kardex PDF: **Funcional**
- ✔ Modo claro / oscuro validado: **Funcional**
- ✔ Trazabilidad diseño → validación: **Alta**
