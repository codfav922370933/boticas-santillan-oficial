/* ════════════════════════════════════════
   BOTICA SANTILLÁN — script.js
   Funcionalidades:
   1. Resaltar enlace activo en la navbar al hacer scroll
   2. Formulario de comentarios con Firebase Firestore
════════════════════════════════════════ */

// ──────────────────────────────────────
// 1. FIREBASE — CONFIGURACIÓN E INICIO
// ──────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaeT08Z-MH4XBbcgh3LvtGMd01JoUHSoE",
  authDomain: "botica-santillan.firebaseapp.com",
  projectId: "botica-santillan",
  storageBucket: "botica-santillan.firebasestorage.app",
  messagingSenderId: "30323881140",
  appId: "1:30323881140:web:eab635a5131ce36432d3e1"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);


// ──────────────────────────────────────
// 2. NAVBAR — ENLACE ACTIVO AL SCROLLEAR
// ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

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
    link.style.color      = isActive ? '#ffffff'    : '';
  });
});


// ──────────────────────────────────────
// 3. COMENTARIOS — FUNCIONES
// ──────────────────────────────────────

/**
 * Convierte un número de estrellas (1-5) en cadena de caracteres ★ / ☆.
 */
function starsHtml(n) {
  return '★'.repeat(n) + (n < 5 ? '☆'.repeat(5 - n) : '');
}


/**
 * Crea y devuelve un elemento DOM de tarjeta de comentario.
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
 * Carga los comentarios desde Firestore y los muestra en pantalla.
 * Los ordena del más reciente al más antiguo.
 */
async function renderComentariosGuardados() {
  try {
    const container = document.getElementById('listaComentarios');
    const q = query(collection(db, 'comentarios'), orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      container.appendChild(crearTarjetaComentario(doc.data()));
    });
  } catch (error) {
    console.error('Error al cargar comentarios:', error);
  }
}


/**
 * Recoge los datos del formulario, los valida, los guarda en Firestore
 * y los muestra en pantalla con animación.
 */
window.enviarComentario = async function () {
  const nombre       = document.getElementById('nombre').value.trim();
  const calificacion = document.getElementById('calificacion').value;
  const comentario   = document.getElementById('comentario').value.trim();

  // Validación básica
  if (!nombre || !comentario) {
    alert('Por favor completa tu nombre y comentario.');
    return;
  }

  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.disabled    = true;
  btnSubmit.textContent = 'Enviando...';

  try {
    // Guardar en Firestore
    await addDoc(collection(db, 'comentarios'), {
      nombre,
      calificacion,
      comentario,
      fecha: serverTimestamp()
    });

    // Mostrar en pantalla con animación
    const container = document.getElementById('listaComentarios');
    const tarjeta   = crearTarjetaComentario({ nombre, calificacion, comentario });
    tarjeta.style.animation = 'fadeInUp 0.5s ease';
    container.prepend(tarjeta);

    // Limpiar formulario
    document.getElementById('nombre').value       = '';
    document.getElementById('comentario').value   = '';
    document.getElementById('calificacion').value = '5';

    // Mostrar mensaje de éxito
    const successMsg = document.getElementById('successMsg');
    successMsg.style.display = 'block';
    setTimeout(() => { successMsg.style.display = 'none'; }, 4000);

  } catch (error) {
    console.error('Error al guardar comentario:', error);
    alert('Hubo un error al enviar tu comentario. Intenta nuevamente.');
  } finally {
    btnSubmit.disabled    = false;
    btnSubmit.textContent = 'Enviar Comentario';
  }
};


// ──────────────────────────────────────
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderComentariosGuardados();
});
