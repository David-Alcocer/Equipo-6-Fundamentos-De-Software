loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (email === "" || password === "") {
    alert("Por favor, llena todos los campos.");
    return;
  }

  // Simulación de validación básica (sin backend)
  if (email.endsWith("@alumnos.uady.mx")) {
    alert("Inicio de sesión exitoso ✅");
    window.location.href = "dashboard.html";
  } else {
    alert("Solo se permite el correo institucional (@alumnos.uady.mx)");
  }
});