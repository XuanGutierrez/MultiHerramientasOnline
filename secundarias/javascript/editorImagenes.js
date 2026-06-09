const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;

// ===============================
// VARIABLES PRINCIPALES
// ===============================
let layers = [];
let selectedLayers = []; // selección múltiple
let showAllLayers = true;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

let cropMode = false;
let cropRect = null;

// ===============================
// CAPA 0: FONDO BLANCO
// ===============================
layers.push({
  type: "background",
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  selected: false
});

// ===============================
// FILTROS
// ===============================
const filterValues = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0
};

function getFilterString() {
  return `
    brightness(${filterValues.brightness}%)
    contrast(${filterValues.contrast}%)
    saturate(${filterValues.saturation}%)
    blur(${filterValues.blur}px)
  `;
}

// ===============================
// PANEL DE CAPAS
// ===============================
function updateLayersList() {
  const list = document.getElementById("layersList");
  list.innerHTML = "";

  // Opción: Todas las capas
  const allLi = document.createElement("li");
  allLi.textContent = "Todas las capas";
  if (showAllLayers) allLi.classList.add("active");

  allLi.addEventListener("click", () => {
    showAllLayers = true;
    selectedLayers = [];
    layers.forEach(l => l.selected = false);
    draw();
    updateLayersList();
  });

  list.appendChild(allLi);

  // Capas individuales
  layers.forEach((layer, index) => {
    const li = document.createElement("li");
    li.textContent = "Capa " + index;

    if (!showAllLayers && selectedLayers.includes(index)) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      showAllLayers = false;
      selectedLayers = [index];
      layers.forEach(l => l.selected = false);
      layers[index].selected = true;
      draw();
      updateLayersList();
    });

    list.appendChild(li);
  });
}

updateLayersList();

// ===============================
// CARGAR IMAGEN
// ===============================
document.getElementById("imageInput").addEventListener("change", (e) => {
  [...e.target.files].forEach(file => {
    const img = new Image();
    img.onload = () => {
      layers.push({
        type: "image",
        img,
        x: 50,
        y: 50,
        width: img.width,
        height: img.height,
        originalWidth: img.width,
        originalHeight: img.height,
        selected: false
      });

      selectedLayers = [layers.length - 1];
      showAllLayers = true;

      updateLayersList();
      draw();
    };
    img.src = URL.createObjectURL(file);
  });
});

// ===============================
// PEGAR IMAGEN
// ===============================
document.addEventListener("paste", (e) => {
  const items = e.clipboardData.items;
  for (let item of items) {
    if (item.type.startsWith("image")) {
      const file = item.getAsFile();
      const img = new Image();
      img.onload = () => {
        layers.push({
          type: "image",
          img,
          x: 50,
          y: 50,
          width: img.width,
          height: img.height,
          originalWidth: img.width,
          originalHeight: img.height,
          selected: false
        });

        selectedLayers = [layers.length - 1];
        showAllLayers = true;

        updateLayersList();
        draw();
      };
      img.src = URL.createObjectURL(file);
    }
  }
});

// ===============================
// DETECTAR CAPA CLICADA
// ===============================
function getLayerAt(x, y) {
  for (let i = layers.length - 1; i >= 1; i--) { // ignorar capa 0
    const L = layers[i];
    if (L.type === "image") {
      if (x >= L.x && x <= L.x + L.width && y >= L.y && y <= L.y + L.height) {
        return i;
      }
    }
  }
  return 0; // fondo blanco
}

// ===============================
// MOUSE DOWN (SELECCIÓN / MOVER)
// ===============================
canvas.addEventListener("mousedown", (e) => {
  if (cropMode) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const clickedIndex = getLayerAt(x, y);

  // CLICK EN FONDO → DESELECCIONAR TODO
  if (clickedIndex === 0) {
    selectedLayers = [];
    layers.forEach(l => l.selected = false);
    draw();
    return;
  }

  // CTRL + CLICK → selección múltiple
  if (e.ctrlKey) {
    if (selectedLayers.includes(clickedIndex)) {
      selectedLayers = selectedLayers.filter(i => i !== clickedIndex);
    } else {
      selectedLayers.push(clickedIndex);
    }
  } else {
    selectedLayers = [clickedIndex];
  }

  layers.forEach((l, i) => l.selected = selectedLayers.includes(i));

  // Preparar arrastre
  offsetX = x - layers[clickedIndex].x;
  offsetY = y - layers[clickedIndex].y;
  isDragging = true;

  updateLayersList();
  draw();
});

// ===============================
// MOUSE MOVE (MOVER CAPAS SELECCIONADAS)
// ===============================
canvas.addEventListener("mousemove", (e) => {
  if (!isDragging || selectedLayers.length === 0 || cropMode) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  selectedLayers.forEach(index => {
    const L = layers[index];
    if (L.type === "image") {
      L.x = x - offsetX;
      L.y = y - offsetY;
    }
  });

  draw();
});

// ===============================
// MOUSE UP
// ===============================
canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

// ===============================
// DIBUJAR TODO
// ===============================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = getFilterString();

  layers.forEach((L, index) => {
    if (L.type === "background") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(L.img, L.x, L.y, L.width, L.height);
    }

    if (selectedLayers.includes(index) && !cropMode && L.type === "image") {
      ctx.strokeStyle = "#007bff";
      ctx.lineWidth = 2;
      ctx.setLineDash([5]);
      ctx.strokeRect(L.x, L.y, L.width, L.height);
      ctx.setLineDash([]);
    }
  });

  if (cropMode && cropRect) {
    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
  }
}

// ===============================
// FILTROS (AFECTAN A SELECCIÓN O A TODO)
// ===============================
["brightness", "contrast", "saturation", "blur"].forEach(id => {
  document.getElementById(id).addEventListener("input", (e) => {
    filterValues[id] = e.target.value;
    draw();
  });
});

// ===============================
// ESCALA (TAMAÑO) — MULTISELECCIÓN
// ===============================
document.getElementById("scale").addEventListener("input", (e) => {
  const scale = e.target.value / 100;

  // Si no hay selección → aplicar a todas las imágenes
  const targets = selectedLayers.length > 0 ? selectedLayers : layers.map((_, i) => i).slice(1);

  targets.forEach(index => {
    const L = layers[index];
    if (L.type === "image") {
      L.width = L.originalWidth * scale;
      L.height = L.originalHeight * scale;
    }
  });

  draw();
});

// ===============================
// MODO RECORTE
// ===============================
document.getElementById("cropModeBtn").addEventListener("click", () => {
  cropMode = !cropMode;
  cropRect = null;

  const btn = document.getElementById("cropModeBtn");
  btn.style.background = cropMode ? "#007bff" : "#f0f4ff";
  btn.style.color = cropMode ? "white" : "#333";

  draw();
});

// ===============================
// CREAR RECTÁNGULO DE RECORTE
// ===============================
canvas.addEventListener("mousedown", (e) => {
  if (!cropMode) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  cropRect = { x, y, w: 0, h: 0 };

  function move(ev) {
    cropRect.w = ev.clientX - rect.left - x;
    cropRect.h = ev.clientY - rect.top - y;
    draw();
  }

  function up() {
    canvas.removeEventListener("mousemove", move);
    canvas.removeEventListener("mouseup", up);
  }

  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", up);
});

// ===============================
// APLICAR RECORTE
// ===============================
document.getElementById("applyCropBtn").addEventListener("click", () => {
  if (!cropRect) return;

  const temp = document.createElement("canvas");
  temp.width = cropRect.w;
  temp.height = cropRect.h;

  const tctx = temp.getContext("2d");
  tctx.drawImage(canvas, cropRect.x, cropRect.y, cropRect.w, cropRect.h, 0, 0, cropRect.w, cropRect.h);

  const img = new Image();
  img.onload = () => {
    layers = [{
      type: "image",
      img,
      x: 0,
      y: 0,
      width: cropRect.w,
      height: cropRect.h,
      originalWidth: cropRect.w,
      originalHeight: cropRect.h,
      selected: false
    }];

    selectedLayers = [0];
    showAllLayers = true;

    updateLayersList();
    draw();
  };
  img.src = temp.toDataURL();
});

// ===============================
// REINICIAR
// ===============================
document.getElementById("resetBtn").addEventListener("click", () => {
  layers = [{
    type: "background",
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    selected: false
  }];

  selectedLayers = [];
  showAllLayers = true;

  updateLayersList();
  draw();
});

// ===============================
// DESCARGAR
// ===============================
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "imagen_editada.png";
  link.href = canvas.toDataURL();
  link.click();
});
