document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const backLogin = document.getElementById("backLogin");

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  backLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("regEmail").value.trim();
    const matricula = document.getElementById("regMatricula").value.trim();

    // Validar dominio institucional
    if (!email.endsWith("@alumnos.uady.mx")) {
      alert("El correo debe pertenecer al dominio institucional '@alumnos.uady.mx'");
      return;
    }

    // Validar formato de matrícula (ejemplo: A01234567)
    const matriculaRegex = /^[A-Za-z0-9]{8,10}$/;
    if (!matriculaRegex.test(matricula)) {
      alert("Formato de matrícula inválido. Verifica tus datos.");
      return;
    }

    alert("Registro enviado correctamente (simulado).");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Inicio de sesión simulado. Aquí se conectará con el backend.");
  });
});