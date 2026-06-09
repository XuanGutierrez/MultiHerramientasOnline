const passwordField = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const strengthIndicator = document.getElementById("strengthIndicator");

// 🔹 Función para obtener un carácter aleatorio seguro
function getRandomChar(chars) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return chars[array[0] % chars.length];
}

// 🔹 Generar contraseña segura
generateBtn.addEventListener("click", () => {
  const length = parseInt(document.getElementById("length").value);
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;

  let chars = "abcdefghijklmnopqrstuvwxyz";
  if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeNumbers) chars += "0123456789";
  if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += getRandomChar(chars);
  }

  passwordField.value = password;
  evaluateStrength(password);
});

// 🔹 Copiar contraseña
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordField.value);
  copyBtn.textContent = "¡Copiado!";
  setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
});

// 🔹 Evaluar seguridad de la contraseña
function evaluateStrength(password) {
  let score = 0;

  // Puntos por longitud
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Puntos por variedad de caracteres
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Penalización si la contraseña es demasiado corta
  if (password.length < 6) score = 0;

  // Determinar nivel de seguridad
  let strength = "Débil";
  let className = "weak";

  if (score >= 4) {
    strength = "Fuerte";
    className = "strong";
  } else if (score >= 2) {
    strength = "Media";
    className = "medium";
  }

  strengthIndicator.textContent = `Seguridad: ${strength}`;
  strengthIndicator.className = `strength ${className}`;
}
