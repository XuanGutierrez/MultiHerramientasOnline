// Scroll suave al pulsar el botón
document.querySelector('.btn-scroll')?.addEventListener('click', () => {
  document.querySelector('#tools').scrollIntoView({ behavior: 'smooth' });
});

// Animación ligera al hacer scroll (sin ocultar tarjetas)
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

openModalBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

modalActionBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  document.querySelector('#tools').scrollIntoView({ behavior: 'smooth' });
});

// Cerrar al hacer clic fuera
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});
