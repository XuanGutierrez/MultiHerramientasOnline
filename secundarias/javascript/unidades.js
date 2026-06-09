// Definición de unidades y factores respecto a una unidad base por categoría
const unitsConfig = {
  length: {
    name: 'Longitud',
    base: 'm', // metro
    units: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34
    },
    labels: {
      m: 'Metro (m)',
      km: 'Kilómetro (km)',
      cm: 'Centímetro (cm)',
      mm: 'Milímetro (mm)',
      in: 'Pulgada (in)',
      ft: 'Pie (ft)',
      yd: 'Yarda (yd)',
      mi: 'Milla (mi)'
    }
  },
  weight: {
    name: 'Peso',
    base: 'kg', // kilogramo
    units: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.0283495
    },
    labels: {
      kg: 'Kilogramo (kg)',
      g: 'Gramo (g)',
      mg: 'Miligramo (mg)',
      lb: 'Libra (lb)',
      oz: 'Onza (oz)'
    }
  },
  temperature: {
    name: 'Temperatura',
    // temperatura se maneja con funciones especiales
    units: ['C', 'F', 'K'],
    labels: {
      C: 'Celsius (°C)',
      F: 'Fahrenheit (°F)',
      K: 'Kelvin (K)'
    }
  },
  speed: {
    name: 'Velocidad',
    base: 'mps', // metros por segundo
    units: {
      mps: 1,
      kmh: 1000 / 3600,
      mph: 1609.34 / 3600,
      knot: 1852 / 3600
    },
    labels: {
      mps: 'm/s (metros por segundo)',
      kmh: 'km/h (kilómetros por hora)',
      mph: 'mph (millas por hora)',
      knot: 'nudo (kn)'
    }
  }
};

const categorySelect = document.getElementById('categorySelect');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const fromValueInput = document.getElementById('fromValue');
const convertBtn = document.getElementById('convertBtn');
const resultBox = document.getElementById('resultBox');

// Rellena las unidades según la categoría seleccionada
function populateUnits(categoryKey) {
  fromUnitSelect.innerHTML = '';
  toUnitSelect.innerHTML = '';

  const config = unitsConfig[categoryKey];

  let units;
  let labels;

  if (categoryKey === 'temperature') {
    units = config.units;
    labels = config.labels;
  } else {
    units = Object.keys(config.units);
    labels = config.labels;
  }

  units.forEach(unitKey => {
    const optionFrom = document.createElement('option');
    optionFrom.value = unitKey;
    optionFrom.textContent = labels[unitKey];
    fromUnitSelect.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = unitKey;
    optionTo.textContent = labels[unitKey];
    toUnitSelect.appendChild(optionTo);
  });

  // Por defecto: primera unidad a segunda unidad
  if (toUnitSelect.options.length > 1) {
    toUnitSelect.selectedIndex = 1;
  }
}

// Conversión genérica (no temperatura)
function convertGeneric(categoryKey, value, fromUnit, toUnit) {
  const config = unitsConfig[categoryKey];
  const baseFactorFrom = config.units[fromUnit];
  const baseFactorTo = config.units[toUnit];

  // Pasar a unidad base
  const valueInBase = value * baseFactorFrom;
  // Pasar de base a unidad destino
  const result = valueInBase / baseFactorTo;
  return result;
}

// Conversión de temperatura
function convertTemperature(value, fromUnit, toUnit) {
  let valueInC;

  // Primero pasamos a Celsius
  switch (fromUnit) {
    case 'C':
      valueInC = value;
      break;
    case 'F':
      valueInC = (value - 32) * (5 / 9);
      break;
    case 'K':
      valueInC = value - 273.15;
      break;
    default:
      valueInC = value;
  }

  // Luego de Celsius a destino
  let result;
  switch (toUnit) {
    case 'C':
      result = valueInC;
      break;
    case 'F':
      result = valueInC * (9 / 5) + 32;
      break;
    case 'K':
      result = valueInC + 273.15;
      break;
    default:
      result = valueInC;
  }

  return result;
}

// Manejar clic en "Convertir"
convertBtn.addEventListener('click', () => {
  const categoryKey = categorySelect.value;
  const rawValue = fromValueInput.value.trim();
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  if (!rawValue || isNaN(rawValue)) {
    resultBox.textContent = '⚠️ Introduce un valor numérico válido.';
    return;
  }

  const value = parseFloat(rawValue);

  if (fromUnit === toUnit) {
    resultBox.textContent = `El valor es el mismo: ${value} (${fromUnit}).`;
    return;
  }

  let result;

  if (categoryKey === 'temperature') {
    result = convertTemperature(value, fromUnit, toUnit);
  } else {
    result = convertGeneric(categoryKey, value, fromUnit, toUnit);
  }

  let rounded;
if (!Number.isFinite(result)) {
  rounded = 'Error';
} else {
  // Si el número es entero, sin decimales
  if (Number.isInteger(result)) {
    rounded = result.toString();
  } else {
    // Si tiene decimales, mostrar solo los necesarios (máx. 6)
    rounded = parseFloat(result.toFixed(6)).toString();
  }
}


  resultBox.textContent = `${value} ${fromUnit} = ${rounded} ${toUnit}`;
});

// Cambiar unidades al cambiar categoría
categorySelect.addEventListener('change', () => {
  populateUnits(categorySelect.value);
  resultBox.textContent = '';
});

// Inicializar
populateUnits(categorySelect.value);
