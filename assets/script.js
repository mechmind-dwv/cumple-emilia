// Variables para control de música
let currentAudio = null;
let isVolumeOn = true;

// Variables para efectos 3D
let mouseX = 0;
let mouseY = 0;
let is3DEffectsEnabled = true;

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    init3DEffects();
    createParticles();
    initCustomCursor();
    
    // Precargar audio
    preloadAudio();
    
    // Lanzar confeti inicial
    setTimeout(throwConfetti, 1000);
    
    // Activar audio al primer clic (requerimiento de navegadores)
    document.body.addEventListener('click', initAudioOnFirstClick, { once: true });
});

// Precargar audio para mejor rendimiento
function preloadAudio() {
    const audio1 = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    const audio2 = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
    
    audio1.preload = 'auto';
    audio2.preload = 'auto';
}

// Inicializar audio en el primer clic
function initAudioOnFirstClick() {
    console.log('Audio activado - ya se puede reproducir música');
    
    // Crear un audio silencioso para "activar" el audio
    const activator = new Audio();
    activator.volume = 0.01;
    activator.play().then(() => {
        activator.pause();
    }).catch(error => {
        console.log('Error activando audio:', error);
    });
}

// Inicializar efectos 3D
function init3DEffects() {
    if (!is3DEffectsEnabled) return;
    
    // Efecto parallax en el header
    const header = document.querySelector('header');
    header.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 25;
        const y = (window.innerHeight / 2 - e.clientY) / 25;
        
        header.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });

    // Efecto 3D en las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            section.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Añadir clase 3D a las imágenes
    const images = document.querySelectorAll('.photo-item img');
    images.forEach(img => {
        img.classList.add('img-3d');
    });
    
    // Añadir clase 3D a los botones
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(btn => {
        btn.classList.add('btn-3d');
    });
}

// Cursor personalizado
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX - 4}px`;
        cursorDot.style.top = `${mouseY - 4}px`;
        
        cursorOutline.style.left = `${mouseX - 20}px`;
        cursorOutline.style.top = `${mouseY - 20}px`;
    });
    
    // Efectos al hacer hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('button, .photo-item, .cake, .control-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(2) translateZ(110px)';
            cursorOutline.style.transform = 'scale(1.5) translateZ(100px)';
            cursorOutline.style.borderWidth = '3px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1) translateZ(100px)';
            cursorOutline.style.transform = 'scale(1) translateZ(90px)';
            cursorOutline.style.borderWidth = '2px';
        });
    });
}

// Crear partículas flotantes
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '9996';
    document.body.appendChild(particlesContainer);
    
    const colors = ['#ff0066', '#ffcc00', '#00ccff', '#ff00ff', '#00ff99'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
        particle.style.opacity = '0.7';
        
        // Posición inicial aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animación
        const animationDuration = Math.random() * 10 + 10;
        particle.style.animation = `
            floatParticle ${animationDuration}s infinite ease-in-out,
            glowParticle 3s infinite alternate
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Añadir estilos de animación para partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) rotate(0deg) translateZ(20px); }
            25% { transform: translate(20px, -20px) rotate(90deg) translateZ(40px); }
            50% { transform: translate(0, -40px) rotate(180deg) translateZ(20px); }
            75% { transform: translate(-20px, -20px) rotate(270deg) translateZ(40px); }
        }
        
        @keyframes glowParticle {
            0% { opacity: 0.3; filter: blur(2px); }
            100% { opacity: 0.8; filter: blur(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Funcionalidad para la música
function playMusic(type) {
    // Detener música actual si hay alguna
    if (currentAudio) {
        currentAudio.pause();
    }
    
    // Reproducir la música seleccionada
    if (type === 'shakira') {
        currentAudio = document.getElementById('shakira-audio');
    } else if (type === 'cumple') {
        currentAudio = document.getElementById('cumple-audio');
    }
    
    if (!currentAudio) {
        console.error('Elemento de audio no encontrado');
        return;
    }
    
    currentAudio.volume = isVolumeOn ? 0.7 : 0;
    
    currentAudio.play().catch(error => {
        console.log('Error reproduciendo audio:', error);
        alert('Por favor, haz clic en cualquier parte de la página primero para activar el audio');
    });
    
    throwConfetti();
    createMusicVisualizer();
}

function pauseMusic() {
    if (currentAudio) {
        currentAudio.pause();
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
    }
}

// Visualizador de música simple
function createMusicVisualizer() {
    // Eliminar visualizador existente si hay uno
    const existingVisualizer = document.getElementById('music-visualizer');
    if (existingVisualizer) {
        existingVisualizer.remove();
    }
    
    const visualizer = document.createElement('div');
    visualizer.id = 'music-visualizer';
    visualizer.style.position = 'fixed';
    visualizer.style.bottom = '0';
    visualizer.style.left = '0';
    visualizer.style.width = '100%';
    visualizer.style.height = '50px';
    visualizer.style.display = 'flex';
    visualizer.style.justifyContent = 'center';
    visualizer.style.alignItems = 'flex-end';
    visualizer.style.gap = '2px';
    visualizer.style.zIndex = '9995';
    visualizer.style.pointerEvents = 'none';
    
    for (let i = 0; i < 30; i++) {
        const bar = document.createElement('div');
        bar.style.width = '5px';
        bar.style.height = '10px';
        bar.style.background = `linear-gradient(to top, #ff0066, #ffcc00)`;
        bar.style.borderRadius = '2px';
        bar.style.transform = 'translateZ(30px)';
        visualizer.appendChild(bar);
    }
    
    document.body.appendChild(visualizer);
    
    // Animar barras
    const bars = visualizer.querySelectorAll('div');
    const visualizerInterval = setInterval(() => {
        if (currentAudio && !currentAudio.paused) {
            bars.forEach(bar => {
                const height = Math.random() * 40 + 10;
                bar.style.height = `${height}px`;
                bar.style.opacity = Math.random() * 0.5 + 0.5;
            });
        } else {
            clearInterval(visualizerInterval);
            visualizer.remove();
        }
    }, 100);
}

// Funcionalidad para el modal de fotos
function openModal(imgElement) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    
    if (!modal || !modalImg) return;
    
    // Si es una imagen de Google Drive, usar el enlace original para mejor calidad
    if (imgElement.src.includes('drive.google.com')) {
        const driveId = imgElement.src.split('id=')[1].split('&')[0];
        modalImg.src = `https://drive.google.com/uc?export=view&id=${driveId}`;
    } else {
        modalImg.src = imgElement.src;
    }
    
    modalImg.alt = imgElement.alt;
    modal.style.display = 'flex';
    
    // Efecto 3D al abrir el modal
    modal.style.transform = 'scale(0.8) translateZ(100px)';
    setTimeout(() => {
        modal.style.transform = 'scale(1) translateZ(0)';
        modal.style.transition = 'transform 0.5s ease';
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    if (!modal) return;
    
    modal.style.transform = 'scale(0.8) translateZ(100px)';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.transform = 'scale(1) translateZ(0)';
    }, 500);
}

// Cerrar modal al hacer clic fuera de la imagen
document.getElementById('photoModal')?.addEventListener('click', function(e) {
    if (e.target.id === 'photoModal') {
        closeModal();
    }
});

// Sistema de confeti mejorado
function throwConfetti() {
    const colors = ['#ff0066', '#ffcc00', '#00ccff', '#ff00ff', '#00ff99'];
    const types = ['🎊', '🎉', '🎈', '✨', '🥳', '❤️', '🌈'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = types[Math.floor(Math.random() * types.length)];
        confetti.style.position = 'fixed';
        confetti.style.fontSize = (Math.random() * 20 + 15) + 'px';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = Math.random() * window.innerHeight + 'px';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.opacity = '0';
        confetti.style.transform = 'translateZ(50px)';
        document.body.appendChild(confetti);
        
        // Animación de entrada
        setTimeout(() => {
            confetti.style.opacity = '1';
            confetti.style.transition = 'all 1s ease-out';
        }, 10);
        
        // Animación de caída con efecto 3D
        let pos = 0;
        const fall = setInterval(() => {
            pos += 2;
            confetti.style.top = parseFloat(confetti.style.top) + 3 + 'px';
            confetti.style.transform = `rotate(${pos}deg) translateZ(${50 - pos/2}px)`;
            
            if (pos > 100) {
                confetti.style.opacity = '0';
            }
            
            if (pos > 120) {
                clearInterval(fall);
                confetti.remove();
            }
        }, 50);
    }
}

// Efecto de escritura para títulos
function typeWriterEffect() {
    const titles = document.querySelectorAll('h1, h2, h3');
    titles.forEach(title => {
        const originalText = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    });
}

// Iniciar efecto de escritura
typeWriterEffect();

// Efecto de scroll parallax
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-effect');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px) translateZ(0)`;
    });
});

// Toggle efectos 3D (para dispositivos móviles o con rendimiento limitado)
function toggle3DEffects() {
    is3DEffectsEnabled = !is3DEffectsEnabled;
    
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        if (is3DEffectsEnabled) {
            el.style.transform = '';
            el.style.perspective = '';
        } else {
            el.style.transform = 'none';
            el.style.perspective = 'none';
        }
    });
    
    console.log(`Efectos 3D ${is3DEffectsEnabled ? 'activados' : 'desactivados'}`);
}

// Detectar si es un dispositivo móvil y ajustar efectos
function checkMobileDevice() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Dispositivo móvil detectado, reducir efectos 3D
        is3DEffectsEnabled = false;
        toggle3DEffects();
    }
}

// Verificar si es móvil al cargar
checkMobileDevice();

// Efectos de hover mejorados para elementos 3D
function enhance3DHoverEffects() {
    const threeDElements = document.querySelectorAll('.img-3d, .btn-3d, .card-3d');
    
    threeDElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            if (!is3DEffectsEnabled) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 10;
            const rotateX = (centerY - y) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            if (!is3DEffectsEnabled) return;
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Mejorar efectos de hover 3D
enhance3DHoverEffects();

// Función para rotar elementos 3D continuamente
function start3DRotation() {
    if (!is3DEffectsEnabled) return;
    
    const rotatingElements = document.querySelectorAll('.rotate-3d');
    rotatingElements.forEach(element => {
        let rotation = 0;
        
        setInterval(() => {
            rotation += 0.5;
            element.style.transform = `rotateX(${rotation}deg) rotateY(${rotation}deg) rotateZ(${rotation}deg)`;
        }, 50);
    });
}

// Iniciar rotación 3D
start3DRotation();

// Efecto de carga inicial con animación 3D
function initialLoadAnimation() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    container.style.opacity = '0';
    container.style.transform = 'perspective(1000px) rotateX(90deg) translateZ(100px)';
    
    setTimeout(() => {
        container.style.transition = 'all 1s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'perspective(1000px) rotateX(0) translateZ(0)';
    }, 500);
}

// Ejecutar animación inicial
initialLoadAnimation();
