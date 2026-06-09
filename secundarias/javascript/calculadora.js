const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clearBtn = document.getElementById('clear');
const equalBtn = document.getElementById('equal');
const toggleScientific = document.getElementById('toggleScientific');
const scientificButtons = document.querySelector('.scientific-buttons');

let currentInput = '';
let scientificMode = false;

// === ACTUALIZAR DISPLAY ===
function updateDisplay(value) {
  currentInput += value;
  display.value = currentInput;
}

// === CLICK EN BOTONES ===
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    if (value) updateDisplay(value);
  });
});

// === BOTÓN CLEAR ===
clearBtn.addEventListener('click', () => {
  currentInput = '';
  display.value = '';
});

// === BOTÓN IGUAL ===
equalBtn.addEventListener('click', () => {
  try {
    const result = eval(currentInput);
    display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
    currentInput = display.value.toString();
  } catch {
    display.value = 'Error';
    currentInput = '';
  }
});

// === MODO CIENTÍFICO ===
toggleScientific.addEventListener('click', () => {
  scientificMode = !scientificMode;
  scientificButtons.classList.toggle('hidden', !scientificMode);
  toggleScientific.textContent = scientificMode ? 'Modo básico' : 'Modo científico';
});

// === FUNCIONES CIENTÍFICAS ===
document.querySelectorAll('.sci').forEach(btn => {
  btn.addEventListener('click', () => {
    const func = btn.getAttribute('data-func');
    let value = parseFloat(display.value);

    if (isNaN(value)) return;

    switch (func) {
      case 'sin': value = Math.sin(value); break;
      case 'cos': value = Math.cos(value); break;
      case 'tan': value = Math.tan(value); break;
      case 'sqrt': value = Math.sqrt(value); break;
      case 'pow': value = Math.pow(value, 2); break;
      case 'log': value = Math.log10(value); break;
      case 'pi': value = Math.PI; break;
      case 'exp': value = Math.exp(value); break;
    }

    display.value = Number.isInteger(value) ? value : parseFloat(value.toFixed(6));
    currentInput = display.value.toString();
  });
});

// === SOPORTE PARA TECLADO ===
document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Números
  if (!isNaN(key)) updateDisplay(key);

  // Punto decimal
  if (key === '.') updateDisplay('.');

  // Operadores
  if (['+', '-', '*', '/'].includes(key)) updateDisplay(key);

  // Enter = igual
  if (key === 'Enter') equalBtn.click();

  // Backspace = borrar último
  if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
  }

  // Escape = limpiar todo
  if (key === 'Escape') clearBtn.click();
});
