# ✅ PeerHive — Reporte Integral de Testing con Asesores
**Área:** Quality Engineering & Product Insights
**Rol:** Ingeniero de Software QA
**Proyecto:** PeerHive (SPA)
**Fuentes de datos:**
- [TABLA DE ERRORES](Artefactos/)(errores críticos + tiempos por tarea)  
- [Asesores(respuestas)](Artefactos//Asesor%20(respuestas).xlsx) (encuestas UX)

---

## 1. Resumen Ejecutivo

Se realizó una evaluación integral a los asesores en dos frentes clave:

1. **Errores críticos funcionales** detectados por asesores durante pruebas del flujo principal.
2. **Satisfacción y experiencia de usuario (UX)** medidas con encuestas posteriores.

**Objetivo:** identificar hallazgos clave, medir fricción en tareas del rol de asesor, encontrar tendencias y proponer acciones estratégicas para la siguiente iteración.

**Resumen de hallazgos**
- El flujo E2E para el rol de **Asesor es funcional y muy estable**.
- Las tareas principales (Ver sesión, Chat, Videollamada) mostraron **cero errores** en esta muestra.
- **Aceptar solicitud** concentra la mayor fricción (errores + tiempo).
- La percepción general de UX es **excepcionalmente alta (Promedio ≥4.7/5)** y el **100% compartiría la app** si fuera real.

---

## 2. Reporte de Resultados — Errores Críticos

### 2.1 Módulos evaluados
| Módulo | Descripción |
|---|---|
| Iniciar sesión | Autenticación y acceso |
| Aceptar solicitud | Aceptar o rechazar una sesión solicitada |
| Chat | Comunicación interna |
| Escribir | Envío de mensaje en el chat |
| Ver sesión | Acceso a la sesión/calendario |
| Videollamada | Acceso a Teams/enlace |

---

### 2.2 Métricas agregadas

**N = 4 asesores**

| Métrica | Resultado |
|---|---:|
| Errores totales detectados | **7** |
| Promedio de errores / asesor | **1.75** |
| Asesores con ≥2 errores | **3** |

---

### 2.3 Errores por módulo

| Módulo | Errores totales | Severidad percibida | Nota QA |
|---|---:|---|---|
| **Aceptar solicitud** | **5** | Alta | La tarea principal del rol genera fricción |
| Iniciar sesión | 2 | Media | Fricción inicial por *login* |
| Chat | 0 | Baja | **Completamente estable** |
| Escribir | 0 | Baja | **Completamente estable** |
| Ver sesión | 0 | Baja | **Completamente estable** |
| Videollamada | 0 | Baja | **Completamente estable** |

**Gráfica comparativa — Errores por módulo**


---

### 2.4 Asesores con mayor incidencia

| Asesor | ID | Total errores | Observación |
|---|---|---:|---|
| Rodrigo / 5to | Asesor 3 | 3 | Falla en Login y Aceptar solicitud |
| Josue / 5to | Asesor 1 | 2 | Errores concentrados en Aceptar solicitud |
| Mauricio / 5to | Asesor 4 | 2 | Errores concentrados en Iniciar Sesión y Aceptar solicitud |
| Gibran / 7mo | Asesor 2 | 0 | Flujo completado sin errores |

---

### 2.5 Patrón general de errores
- Los fallos se concentran en las **tareas de control y validación** (Aceptar solicitud) y en el **acceso** (Login).
- Una vez dentro del flujo principal de colaboración (Chat, Videollamada, Calendario), el sistema es **extremadamente estable y sin errores**.
- La fricción se debe principalmente al **flujo de trabajo y UI**, no a fallos funcionales graves.

---

## 3. Reporte de Resultados — Encuestas Asesores (UX)

**N = 4 asesores**
Escala Likert 1–5 (5 = mejor experiencia)

### 3.1 Promedio global por eje UX
| Eje UX | Promedio | Lectura |
|---|---:|---|
| Claridad del flujo | 4.5 | Lógico y secuencial, excepto por el caso aislado de 'ver sesión' |
| Distinguir módulos | 4.75 | Jerarquía visual muy clara |
| Satisfacción visual | 4.75 | Diseño bien aceptado |
| Navegación | 4.75 | Muy fluida, sin desorientación |
| Usabilidad general | 4.5 | Plataforma muy fácil de usar |

---

### 3.2 Hallazgos clave
- **Diseño y claridad visual:** Calificaciones consistentemente altas (4.75 en promedio) en *diseño*, *iconografía* y *contraste de colores*.
- **Navegación:** El flujo principal es muy intuitivo. Un solo asesor mencionó confusión en **"ver sesión agendada"**.
- **Acciones principales:** Las acciones como **aceptar solicitud** y **ver calendario** son consideradas claras (5.0 en promedio).
- **Dificultad de tareas:**
    - Escribir al estudiante: **5.0** (Muy fácil)
    - Aceptar solicitud: **4.75** (Fácil, a pesar de los errores funcionales)
- **Valor percibido:** **100%** lo compartiría, indicando un gran valor potencial.

**Gráfica comparativa — Promedios encuesta por pregunta**


---

## 4. Análisis de Tiempos de los Usuarios

Se midieron tiempos en segundos por tarea para evaluar eficiencia y fricción cognitiva.

### 4.1 Promedios por tarea

**N = 4 asesores**

| Tarea | Promedio (s) |
|---|---:|
| Iniciar sesión | **15.25** |
| **Aceptar solicitud** | **22.75** |
| Chat | 0.00 |
| Escribir | 13.75 |
| Ver sesión | 12.50 |
| Videollamada | 7.75 |
| **Tiempo total (sin Chat)** | **72.00** |

---

### 4.2 Interpretación profesional

**🟩 Operaciones rápidas (Promedio < 15s)**
- Iniciar sesión (15.25s), Escribir (13.75s), Ver sesión (12.50s), Videollamada (7.75s)
➡️ Todas las tareas secundarias se completan con alta eficiencia y baja fricción. El *Login* es muy rápido.

**🟨 Moderadas (Promedio < 30s)**
- **Aceptar solicitud (22.75 s)**
➡️ A pesar de concentrar los errores, el tiempo de ejecución es relativamente bajo, lo que sugiere que la fricción es puntual (un *input* o *botón* que confunde), más que un proceso largo y complejo.

**Gráfica comparativa — Tiempo promedio por tarea**


---

## 5. Conclusiones Generales

### ✔ Fortalezas
- **Estabilidad de Módulos Centrales:** Chat, Videollamada y la visualización de Sesiones son **perfectamente estables** (cero errores) y muy rápidos de ejecutar.
- **UX Excepcional:** Los promedios UX son muy altos, especialmente en claridad visual y navegación.
- **Adopción:** El **100%** de los asesores adoptaría la herramienta.

### ⚠ Prioridades de mejora
1. **Aceptar Solicitud:** Es la única tarea principal con errores. Se debe revisar el flujo de UI para reducir la incidencia, a pesar de su bajo tiempo de ejecución.
2. **Iniciar Sesión:** El error residual en el *Login* debe ser investigado para asegurar una entrada fluida.
3. **Ver Sesión:** Un caso de confusión en la encuesta (a pesar de cero errores) sugiere mejorar la **Discoverability** o jerarquía del enlace al calendario/sesión.

## 6. Dashboard Ejecutivo (síntesis)

| Dimensión | Resultado clave | Riesgo |
|---|---|---|
| Calidad funcional | 1.75 errores/asesor | Foco en "Aceptar solicitud" |
| Eficiencia | 1.2 min flujo de tareas | Tareas completadas rápidamente |
| UX | Promedios ≥4.5/5 | Videollamada y Chat son intuitivos |
| Adopción | 100% lo compartiría | Riesgo bajo |

---

## 7. Resumen para Stakeholders

El rol de Asesor tiene un flujo muy robusto, con tareas de colaboración (Chat, Videollamada, Ver sesión) que son perfectamente funcionales y rápidas (menos de 15 segundos en promedio). La principal fricción se concentra en la acción de "Aceptar solicitud", la cual, aunque se ejecuta en menos de 23 segundos, concentra la mayoría de los errores. La plataforma tiene una aceptación y potencial de adopción muy alto (100% la recomendaría). La mejora prioritaria es simplificar la interfaz de "Aceptar solicitud" para eliminar el error recurrente y aumentar la fluidez de la tarea central del rol.