/* ════════════════════════════════════════
   BOTICA SANTILLÁN — script.js
   Funcionalidades:
   1. Resaltar enlace activo en la navbar al hacer scroll
   2. Formulario de comentarios con almacenamiento en localStorage
════════════════════════════════════════ */

// ──────────────────────────────────────
// 1. NAVBAR — ENLACE ACTIVO AL SCROLLEAR
// ──────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + current;
    link.style.background = isActive ? 'var(--teal)' : '';
    link.style.color       = isActive ? '#ffffff'    : '';
  });
});


// ──────────────────────────────────────
// 2. COMENTARIOS — CLAVE DE ALMACENAMIENTO
// ──────────────────────────────────────
const STORAGE_KEY = 'botica_santillan_comentarios';


/**
 * Obtiene la lista de comentarios guardados en localStorage.
 * @returns {Array} Lista de objetos de comentario.
 */
function getComentarios() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}


/**
 * Guarda un nuevo comentario al inicio de la lista en localStorage.
 * @param {Object} comentario - Objeto con nombre, calificacion y comentario.
 */
function saveComentario(comentario) {
  const lista = getComentarios();
  lista.unshift(comentario);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}


/**
 * Convierte un número de estrellas (1-5) en cadena de caracteres ★ / ☆.
 * @param {number} n - Número de estrellas llenas.
 * @returns {string} Representación visual de estrellas.
 */
function starsHtml(n) {
  return '★'.repeat(n) + (n < 5 ? '☆'.repeat(5 - n) : '');
}


/**
 * Crea y devuelve un elemento DOM de tarjeta de comentario.
 * @param {Object} c - Objeto con datos del comentario.
 * @returns {HTMLElement} Div con el comentario renderizado.
 */
function crearTarjetaComentario(c) {
  const div = document.createElement('div');
  div.className = 'comentario-card';
  div.innerHTML = `
    <div class="comentario-stars">${starsHtml(parseInt(c.calificacion))}</div>
    <p class="comentario-texto">"${c.comentario}"</p>
    <div class="comentario-autor">— ${c.nombre}</div>
  `;
  return div;
}


/**
 * Renderiza en el DOM los comentarios guardados en localStorage.
 * Se ejecuta al cargar la página.
 */
function renderComentariosGuardados() {
  const lista     = getComentarios();
  const container = document.getElementById('listaComentarios');

  lista.forEach(c => {
    container.appendChild(crearTarjetaComentario(c));
  });
}


/**
 * Recoge los datos del formulario, los valida, los guarda y los muestra.
 * Función llamada desde el botón "Enviar Comentario" en el HTML.
 */
function enviarComentario() {
  const nombre       = document.getElementById('nombre').value.trim();
  const calificacion = document.getElementById('calificacion').value;
  const comentario   = document.getElementById('comentario').value.trim();

  // Validación básica
  if (!nombre || !comentario) {
    alert('Por favor completa tu nombre y comentario.');
    return;
  }

  // Crear objeto
  const nuevo = { nombre, calificacion, comentario };

  // Guardar en localStorage
  saveComentario(nuevo);

  // Mostrar en pantalla con animación
  const container  = document.getElementById('listaComentarios');
  const tarjeta    = crearTarjetaComentario(nuevo);
  tarjeta.style.animation = 'fadeInUp 0.5s ease';
  container.prepend(tarjeta);

  // Limpiar formulario
  document.getElementById('nombre').value       = '';
  document.getElementById('comentario').value   = '';
  document.getElementById('calificacion').value = '5';

  // Mostrar mensaje de éxito
  const successMsg = document.getElementById('successMsg');
  successMsg.style.display = 'block';
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 4000);
}


// ──────────────────────────────────────
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderComentariosGuardados();
});
