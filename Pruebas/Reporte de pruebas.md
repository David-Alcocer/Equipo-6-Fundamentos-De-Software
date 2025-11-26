# ✅ PeerHive — Reporte Integral de Testing con Estudiantes
**Área:** Quality Engineering & Product Insights  
**Rol:** Ingeniero de Software QA  
**Proyecto:** PeerHive (SPA)  
**Fuentes de datos:**  
- [TABLA DE ERRORES](Artefactos/)(errores críticos + tiempos por tarea)  
- [Estudiantes(respuestas)](Artefactos/Estudiante%20(respuestas).xlsx) (encuestas UX)

---

## 1. Resumen Ejecutivo

Se realizó una evaluación integral en dos frentes:

1. **Errores críticos funcionales** detectados por estudiantes durante pruebas del flujo principal.  
2. **Satisfacción y experiencia de usuario (UX)** medidas con encuestas posteriores.

**Objetivo:** identificar hallazgos clave, medir fricción, encontrar tendencias y proponer acciones estratégicas para la siguiente iteración.

**Resumen de hallazgos**
- El flujo E2E es **funcional** y con recepción positiva.
- **Crear solicitud** concentra la mayor fricción (errores + tiempo).
- **Chat** y **Videollamada** son módulos **estables**, con baja incidencia de fallos.
- La percepción general es alta (**≥4.5/5**) y el **100% compartiría la Web** si fuera real.

---

## 2. Reporte de Resultados — Errores Críticos

### 2.1 Módulos evaluados
| Módulo | Descripción |
|---|---|
| Iniciar sesión | Autenticación y acceso |
| Crear solicitud | Registro de solicitud asesor/asesorado |
| Ver solicitud | Consulta de solicitudes |
| Chat | Comunicación interna |
| Ver sesión | Acceso a la sesión/calendario |
| Videollamada | Acceso a Teams/enlace |

---

### 2.2 Métricas agregadas

**N = 13 estudiantes**

| Métrica | Resultado |
|---|---:|
| Errores totales detectados | **28** |
| Promedio de errores / estudiante | **2.15** |
| Estudiantes con ≥5 errores | **3** |

---

### 2.3 Errores por módulo

| Módulo | Errores totales | Estado | Nota QA |
|---|---:|---|---|
| **Iniciar sesión** | **10** | Cambios requeridos | Validaciones/inputs generan fricción inicial |
| **Crear solicitud** | **5** | Aceptable | UX compleja → errores recurrentes |
| **Ver solicitud** | **5** | Aceptable | Flow/estado aún mejorable |
| Chat | 4 | Baja | Estable, sin bloqueos |
| Ver sesión | 3 | bueno | Ubicación/jerarquía mejorable |
| Videollamada | 1 | Excelente | Incidencia técnica mínima |

**Gráfica comparativa — Errores por módulo**  
[Errores por módulo](Artefactos/errores%20criticos.png)

---

### 2.4 Estudiantes con mayor incidencia

| Estudiante | ID | Total errores | Observación |
|---|---|---:|---|
| Eithel | Est. 5 | 5 | Problemas concentrados en Crear solicitud |
| Kevin | Est. 10 | 5 | Falla repetida en Login |
| Anónimo | Est. 13 | 5 | Errores dispersos |
| Patty | Est. 1 | 3 | Flujo general correcto |
| Michelle | Est. 2 | 3 | Error puntual en Solicitudes |

---

### 2.5 Patrón general de errores
- Los fallos se concentran en **momentos iniciales del journey** (Login + Crear solicitud).
- El sistema **no colapsa**, pero la UX provoca errores evitables.
- Módulos en tiempo real (**Chat/Videollamada**) muestran **alta estabilidad**.

---

## 3. Reporte de Resultados — Encuestas Estudiantiles (UX)

**N = 10 estudiantes**  
Escala Likert 1–5 (5 = mejor experiencia)

### 3.1 Promedio global por eje UX
| Eje UX | Promedio | Lectura |
|---|---:|---|
| Claridad del flujo | 4.6 | Lógico y secuencial |
| Distinguir módulos | 4.6 | Jerarquía visual clara |
| Satisfacción visual | 4.7 | Landing/UI muy bien aceptada |
| Navegación | 4.6 | Fluidez buena |
| Discoverability videollamada | 4.2 | Mejorable |

---

### 3.2 Hallazgos clave
- **Diseño y claridad visual:** calificadas como *agradable, ordenada, fácil*.  
- **Navegación:** flujo intuitivo; pocos usuarios se pierden.  
- **Videollamada:** funcional, pero cuesta ubicar el enlace al inicio.  
- **Valor percibido:** **100%** la compartiría si fuese un producto real.

**Gráfica comparativa — Promedios encuesta por pregunta**  
[Promedios encuesta](Artefactos/errores%20de%20usuarios.png)

---

## 4. Análisis de Tiempos de los Usuarios

Se midieron tiempos en segundos por tarea para evaluar eficiencia y fricción cognitiva.

### 4.1 Promedios, desviación estándar y percentiles

| Tarea | Promedio (s) | σ (s) |
|---|---:|---:|---:|---:|---:|---:|
| Iniciar sesión | 41.31 | 23.85 ||
| **Crear solicitud** | **78.46** | **40.93** |
| Ver solicitud | 13.46 | 6.89 |
| Chat | 34.92 | 23.57 | 16 |
| Ver sesión | 16.38 | 9.81 |
| Videollamada | 8.85 | 7.40 |
| **Tiempo total** | **193.38** | **61.64** |

---

### 4.2 Interpretación

**🟩 Operaciones rápidas (mediana < 15s)**  
- Ver solicitud, Ver sesión, Videollamada  
➡️ Los usuarios llegan rápido a estas acciones cuando ya están orientados.

**🟨 Moderadas (15–35s)**  
- Chat  
➡️ UX es buena, pero hay carga cognitiva en selección/navegación.

**🟥 Crítica (mediana > 60s)**  
- **Crear solicitud (P50=73 s)**  
➡️ Mayor fricción del sistema. La variabilidad alta (σ=40.9) indica que usuarios con menor familiaridad tardan mucho más.

**Gráfica comparativa — Tiempo promedio con variabilidad**  
[Tiempos promedio](Artefactos/promedio%20de%20tiempo%20por%20tareas.png)

---

## 5. Conclusiones Generales

### ✔ Fortalezas
- Chat y Videollamada son **confiables y estables**.
- UI muy bien recibido (**≥4.5/5**).
- Alto potencial de adopción: **todos lo recomendarían**.

### ⚠ Prioridades de mejora
1. **Crear solicitud:** simplificar, guiar y reducir inputs.  
2. **Login:** validaciones más claras y feedback inmediato.  
3. **Videollamada:** mejorar  enlace.  
4. **Estados de solicitud:** reforzar claridad del flujo.

## 6. Dashboard Ejecutivo (síntesis)

| Dimensión | Resultado clave | Riesgo |
|---|---|---|
| Calidad funcional | 2.15 errores/estudiante | Foco en login + solicitud |
| Eficiencia | 3.2 min flujo total | “Crear solicitud” domina tiempo |
| UX | Promedios ≥4.5/5 | Videollamada poco evidente |
| Adopción | 100% lo compartiría | Riesgo bajo |

---

## 7. Resumen para Stakeholders

 Validamos la propuesta de valor: estudiantes completan el flujo completo en 3.2 minutos y califican la UX con 4.5/5. Chat y videollamada operan con estabilidad alta y bajo error. La principal fricción del producto se concentra en “Crear solicitud”, tanto en errores como en tiempo, lo que lo vuelve prioridad del siguiente sprint. Optimizar este módulo puede reducir el tiempo total del flujo en 30–40%, aumentar satisfacción y disminuir errores tempranos, acelerando adopción institucional.

---

## 8. Mapas de calor

# 🔥 Resumen Súper Compacto de Mapas de Calor – PeerHive (Móvil)

[Mapa 1](Artefactos/mapa1.png)
[Mapa 2](Artefactos/mapa2.png)


##  Interacción
- Los usuarios solo tocan **las celdas con sesiones** y la **tarjeta de información**.  
- El menú inferior sí recibe interacción.  
- Los controles del calendario (mes, flechas) casi **no se usan**.

##  Atención Visual
- La vista se concentra en **el centro del calendario** y en la **tarjeta de sesión**.  
- El header superior casi **no recibe atención**.

##  Conclusión
Los usuarios van directo a:
1. **Buscar la sesión**,  
2. **Ver sus detalles**,  
3. **Navegar desde la barra inferior**.  

El área superior y los controles del calendario **no se descubren fácilmente** → requieren mayor peso visual o rediseño.
