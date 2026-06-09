const qrText = document.getElementById('qrText');
const qrSize = document.getElementById('qrSize');
const qrColor = document.getElementById('qrColor');
const qrBgColor = document.getElementById('qrBgColor');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.getElementById('qrContainer');
const resultBox = document.getElementById('resultBox');

let qrInstance = null;

function showMessage(msg) {
  resultBox.textContent = msg;
}

function clearQR() {
  qrContainer.innerHTML = '';
  qrInstance = null;
  downloadBtn.disabled = true;
}

generateBtn.addEventListener('click', () => {
  const text = qrText.value.trim();

  if (!text) {
    showMessage('Por favor, introduce un texto o URL para generar el código QR.');
    clearQR();
    return;
  }

  clearQR();

  const size = parseInt(qrSize.value, 10) || 256;

  qrInstance = new QRCode(qrContainer, {
    text,
    width: size,
    height: size,
    colorDark: qrColor.value || '#000000',
    colorLight: qrBgColor.value || '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  showMessage('Código QR generado correctamente.');
  downloadBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  if (!qrInstance) return;

  // El QR se genera como <img> o <canvas>, buscamos el elemento
  const img = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
  if (!img) {
    showMessage('No se ha podido encontrar la imagen del QR.');
    return;
  }

  let dataUrl;

  if (img.tagName.toLowerCase() === 'img') {
    dataUrl = img.src;
  } else {
    dataUrl = img.toDataURL('image/png');
  }

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'codigo_qr_MultiHerramientasOnline.png';
  document.body.appendChild(a);
  a.click();
  a.remove();

  showMessage('Código QR descargado correctamente.');
});
