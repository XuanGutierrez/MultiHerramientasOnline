// ===== SCROLL SUAVE =====
document.querySelector('.btn-scroll')?.addEventListener('click', () => {
  document.querySelector('#tools').scrollIntoView({ behavior: 'smooth' });
});

// ===== ANIMACIÓN AL HACER SCROLL =====
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add('visible');
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== MODAL PREMIUM =====
const modal = document.getElementById('infoModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalActionBtn = document.getElementById('modalActionBtn');

// Abrir modal (solo si existe el botón)
if (openModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
}

// Cerrar modal (solo si existe el botón)
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Botón de acción del modal
if (modalActionBtn) {
  modalActionBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.querySelector('#tools').scrollIntoView({ behavior: 'smooth' });
  });
}

// Cerrar al hacer clic fuera
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

// ===== BANNER DE COOKIES =====
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieReject = document.getElementById('cookie-reject');

// Mensaje temporal
function showTestMessage() {
  const msg = document.createElement('div');
  msg.textContent = "Esta es una versión de prueba. Aún no hay anuncios activos.";
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.right = "20px";
  msg.style.background = "#0077ff";
  msg.style.color = "white";
  msg.style.padding = "12px 18px";
  msg.style.borderRadius = "8px";
  msg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  msg.style.zIndex = "99999";
  msg.style.fontSize = "14px";

  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 3500);
}

// Comprobar si ya hay decisión
const cookieDecision = localStorage.getItem('cookie_consent');

if (cookieDecision && cookieBanner) {
  cookieBanner.style.display = 'none';
}

// Aceptar cookies
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    cookieBanner.style.display = 'none';
    showTestMessage();
  });
}

// Rechazar cookies
if (cookieReject) {
  cookieReject.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'rejected');
    cookieBanner.style.display = 'none';
    showTestMessage();
  });
}
