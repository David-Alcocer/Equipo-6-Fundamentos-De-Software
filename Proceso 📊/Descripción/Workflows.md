# ⚙️ Automatización del Flujo de Trabajo — PeerHive (GitHub Projects)

## 🎯 Objetivo
Automatizar el flujo de estado de cada ticket (issue o sub-issue) en GitHub Projects para reflejar el progreso del sprint automáticamente, desde la creación hasta la aprobación final.

---

## 🧩 Flujo General

| Evento | Estado Automático | Workflow |
|--------|--------------------|-----------|
| Nuevo issue | **To Do** | *Item added to project* |
| Se crea rama o commit | (opcional) manual → **In Progress** | — |
| Se crea Pull Request vinculado | **Review** | *Pull request linked to issue* |
| Se solicitan cambios | **In Progress** | *Code changes requested* |
| PR aprobado o mergeado | **Done** | *Code review approved / Pull request merged / Item closed* |

---

## ⚙️ Configuración Paso a Paso

### 1️⃣ Estados base
En tu **Board → Project settings → Fields → Status**, asegúrate de tener los siguientes estados en orden:

- 🟢 **To Do** – *This item hasn’t been started*
- 🟡 **In Progress** – *This is actively being worked on*
- 🔴 **Review** – *Verifican si cumplen con el DoD*
- 🟣 **Done** – *This has been completed*

> 💡 Elimina cualquier “No Status” adicional.

---

### 2️⃣ Workflow: Auto-add to project
**Filtro:**
```
is:issue OR is:pr is:open
```
📌 Agrega automáticamente issues y PRs al tablero correspondiente.

---

### 3️⃣ Workflow: Item added to project
**Acción:**
```
Set value → Status: To Do
```
🟢 Cada nuevo issue o PR comenzará en “To Do”, evitando el bug del “No Status”.

---

### 4️⃣ Workflow: Pull request linked to issue
**Acción:**
```
Set value → Status: Review
```
🔁 Cuando se cree un PR vinculado a un issue (#ID), la tarjeta pasa a “Review”.

---

### 5️⃣ Workflow: Code changes requested
**Acción:**
```
Set value → Status: In Progress
```
🔄 Si un revisor (Code Owner) solicita cambios, el issue vuelve automáticamente a “In Progress”.

---

### 6️⃣ Workflow: Code review approved
**Acción:**
```
Set value → Status: Done
```
✅ Cuando el PR es aprobado por un Code Owner, el issue salta a “Done”.

---

### 7️⃣ Workflow: Pull request merged
**Acción:**
```
Set value → Status: Done
```
💥 Cuando el PR se fusiona (merge / squash / rebase), el issue se marca como “Done”.

---

### 8️⃣ Workflow: Item closed
**Acción:**
```
Set value → Status: Done
```
📦 Si cierras un issue manualmente, también pasa a “Done”.

---

## 🧠 Buenas Prácticas

1. **Crear ramas desde los issues.**  
   Esto garantiza la vinculación automática entre rama, issue y PR.

2. **Nombrar PRs con el número del issue:**  
   Ejemplo: `Fix login issue (#127)`  
   → Esto activa automáticamente los workflows de transición.

3. **Usar squash merge** para mantener el historial limpio.

4. **Code Owners:** definen los revisores automáticos que activan “Review” y “Approved”.

---

## ✨ Resultado Final

El flujo automatizado es el siguiente:

```
To Do → In Progress → Review → Done
```

Cada transición ocurre automáticamente según las acciones del equipo,
manteniendo el tablero siempre actualizado y alineado con el progreso real del sprint.

---

**Autor:** Equipo PeerHive 🐝  
**Versión:** Sprint 3 — Automatización Estable