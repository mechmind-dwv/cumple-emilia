// script.js - Funcionalidad JavaScript para el Portafolios de Cumpleaños de Emily

// Variables globales
let currentAudio = null;
let isVolumeOn = true;
let confettiInterval = null;

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('¡Portafolios de Emily cargado! 🎉');
    
    // Inicializar elementos
    initPhotoGallery();
    initMusicPlayer();
    initVideoPlayers();
    initConfetti();
    
    // Lanzar confeti al cargar la página
    setTimeout(throwConfetti, 1000);
    
    // Agregar evento de clic para activar audio
    document.body.addEventListener('click', activateAudioContext, { once: true });
});

// Inicializar la galería de fotos
function initPhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.getAttribute('data-img-src') || this.querySelector('img').src;
            const imgAlt = this.getAttribute('data-img-alt') || 'Foto de Emily';
            openModal(imgSrc, imgAlt);
        });
    });
}

// Inicializar el reproductor de música
function initMusicPlayer() {
    // Precargar audios
    const shakiraAudio = new Audio();
    shakiraAudio.src = "https://audio.jukehost.co.uk/3U0XQYp8G8M6vQJf2sVzW3Q3o6U3K3Q3";
    shakiraAudio.preload = "auto";
    
    const cumpleAudio = new Audio();
    cumpleAudio.src = "https://audio.jukehost.co.uk/Qs1h4k7y3Hc7U5k8v4J7W8I9c4L5M6N7";
    cumpleAudio.preload = "auto";
    
    console.log('Reproductor de música inicializado 🎵');
}

// Inicializar reproductores de video
function initVideoPlayers() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        container.addEventListener('click', function() {
            this.classList.add('playing');
            const iframe = this.querySelector('iframe');
            if (iframe) {
                // Forzar el inicio del video al hacer clic
                const src = iframe.src;
                iframe.src = src; // Recargar iframe para forzar reproducción
            }
        });
    });
}

// Inicializar sistema de confeti
function initConfetti() {
    console.log('Sistema de confeti inicializado 🎊');
}

// Funcionalidad para la música
function playMusic(type) {
    // Detener música actual si hay alguna
    if (currentAudio) {
        currentAudio.pause();
    }
    
    // Crear nuevo elemento de audio
    currentAudio = new Audio();
    
    // Reproducir la música seleccionada
    if (type === 'shakira') {
        currentAudio.src = "https://audio.jukehost.co.uk/3U0XQYp8G8M6vQJf2sVzW3Q3o6U3K3Q3";
    } else if (type === 'cumple') {
        currentAudio.src = "https://audio.jukehost.co.uk/Qs1h4k7y3Hc7U5k8v4J7W8I9c4L5M6N7";
    }
    
    currentAudio.volume = isVolumeOn ? 0.7 : 0;
    
    currentAudio.play().catch(error => {
        console.log('Error reproduciendo audio:', error);
        showNotification('Por favor, haz clic en cualquier parte de la página primero para activar el audio');
    });
    
    // Lanzar confeti al reproducir música
    throwConfetti();
    
    // Mostrar notificación
    const songName = type === 'shakira' ? 'Shakira - Ole Ola' : 'Canción de Cumpleaños';
    showNotification(`Reproduciendo: ${songName}`);
}

function pauseMusic() {
    if (currentAudio) {
        currentAudio.pause();
        showNotification('Música pausada');
    }
}

function volumeToggle() {
    isVolumeOn = !isVolumeOn;
    if (currentAudio) {
        currentAudio.volume = isVolumeOn ? 0.7 : 0;
        
        // Cambiar icono de volumen
        const volumeIcons = document.querySelectorAll('.fa-volume-up, .fa-volume-mute');
        volumeIcons.forEach(icon => {
            if (isVolumeOn) {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
            } else {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
            }
        });
        
        // Mostrar notificación
        showNotification(isVolumeOn ? 'Volumen activado' : 'Volumen silenciado');
    }
}

// Funcionalidad para el modal de fotos
function openModal(imgSrc, imgAlt) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    
    modalImg.src = imgSrc;
    modalImg.alt = imgAlt;
    modal.style.display = 'flex';
    
    // Desplazarse suavemente al modal
    modal.scrollIntoView({ behavior: 'smooth' });
}

function closeModal() {
    document.getElementById('photoModal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera de la imagen
document.addEventListener('click', function(event) {
    const modal = document.getElementById('photoModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Sistema de confeti
function throwConfetti() {
    // Limpiar confeti existente
    clearExistingConfetti();
    
    const colors = ['#ff0066', '#ffcc00', '#00ccff', '#ff00ff', '#00ff99'];
    const confettiTypes = ['🎊', '🎉', '🎈', '✨', '🌟', '🥳', '🎁', '🎂'];
    
    for (let i = 0; i < 40; i++) {
        createConfettiPiece(colors, confettiTypes);
    }
    
    // Detener el confeti después de 5 segundos
    if (confettiInterval) {
        clearTimeout(confettiInterval);
    }
    confettiInterval = setTimeout(clearExistingConfetti, 5000);
}

function createConfettiPiece(colors, confettiTypes) {
    const confetti = document.createElement('div');
    confetti.innerHTML = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
    confetti.style.position = 'fixed';
    confetti.style.fontSize = (Math.random() * 20 + 15) + 'px';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-50px';
    confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    confetti.style.userSelect = 'none';
    confetti.classList.add('confetti-piece');
    
    document.body.appendChild(confetti);
    
    // Animación
    const animationDuration = Math.random() * 3000 + 2000;
    const horizontalMovement = (Math.random() - 0.5) * 100;
    
    confetti.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${horizontalMovement}px, ${window.innerHeight}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: animationDuration,
        easing: 'cubic-bezier(0.1, 0.8, 0.1, 1)'
    });
    
    // Eliminar después de la animación
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, animationDuration);
}

function clearExistingConfetti() {
    const confettiPieces = document.querySelectorAll('.confetti-piece');
    confettiPieces.forEach(piece => {
        if (piece.parentNode) {
            piece.parentNode.removeChild(piece);
        }
    });
}

// Activar contexto de audio
function activateAudioContext() {
    console.log('Contexto de audio activado');
    showNotification('Audio activado - ¡Ahora puedes reproducir música!');
}

// Mostrar notificación
function showNotification(message, duration = 2000) {
    // Eliminar notificación existente
    const existingNotification = document.getElementById('audioNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.id = 'audioNotification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(255, 0, 102, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '25px';
    notification.style.zIndex = '2000';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    notification.style.fontWeight = 'bold';
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    notification.animate([
        { opacity: 0, transform: 'translate(-50%, 100%)' },
        { opacity: 1, transform: 'translate(-50%, 0)' }
    ], {
        duration: 300,
        easing: 'ease-out'
    });
    
    // Eliminar después de un tiempo
    setTimeout(() => {
        if (notification.parentNode) {
            // Animación de salida
            notification.animate([
                { opacity: 1, transform: 'translate(-50%, 0)' },
                { opacity: 0, transform: 'translate(-50%, 100%)' }
            ], {
                duration: 300,
                easing: 'ease-in'
            }).onfinish = () => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            };
        }
    }, duration);
}

// Efectos de interactividad adicional
function initAdditionalEffects() {
    // Efecto de escritura para títulos
    const titles = document.querySelectorAll('h1, h2, h3');
    titles.forEach(title => {
        title.style.opacity = '0';
        title.style.animation = 'fadeIn 1s forwards';
    });
    
    // Efecto de aparición para secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.animation = `fadeInUp 0.8s ${index * 0.2}s forwards`;
    });
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar efectos adicionales cuando la página está completamente cargada
window.addEventListener('load', function() {
    initAdditionalEffects();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenida al portafolios de cumpleaños de Emily!', 3000);
    }, 1500);
});

// Manejar la visibilidad de la página
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pausar música cuando la pestaña no está visible
        if (currentAudio) {
            currentAudio.pause();
        }
    }
});

// Optimización de rendimiento
function optimizePerformance() {
    // Limitar la tasa de refresco de algunas animaciones
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Aquí irían las operaciones relacionadas con el scroll
                lastScrollY = window.scrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Inicializar optimizaciones
optimizePerformance();

// Exportar funciones para uso global (si es necesario)
window.playMusic = playMusic;
window.pauseMusic = pauseMusic;
window.volumeToggle = volumeToggle;
window.openModal = openModal;
window.closeModal = closeModal;
window.throwConfetti = throwConfetti;
