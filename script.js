// Datos de las fotos y videos
const contentData = {
    photos: [
        { id: '1JdtwvYeXNhQx-qna_w-Rg0AOgCMvmVLG', alt: 'Emily sonriendo' },
        { id: '1qlklWfoT53toMmFH-vWa1HkchobZva6b', alt: 'Emily celebrando' },
        { id: '1SsSTFueE5jQWnLHLkGc0LzCqno3vBFtQ', alt: 'Emily jugando' },
        { id: '1v9aO2FwAeWnEKEGyZGRvcSb4ytmSF6RC', alt: 'Emily con globos' },
        { id: '1p5Y3pOK8hSGbwR7giBn0yoNnRB4Tbvhr', alt: 'Emily feliz' },
        { id: '1MrLf673RK0LM7hG2hbXwewIX6NPi0q-n', alt: 'Emily de fiesta' },
        { id: '1O6PfbaULI2_QstDCi-z4C37lvCAOUpBC', alt: 'Emily sonriente' },
        { id: '1s0T2uHuMCipwl4Fx_o3ItrdaNIwFkIzD', alt: 'Emily disfrutando' },
        { id: '1IFT9tVLzDq4TOWZvkyZR8Fjurw8ONGEP', alt: 'Emily contenta' }
    ],
    videos: [
        { id: '1mWJIUgHD5s_zHJlABfpbmBF01Bgmnd-N', title: 'Video de cumpleaños' },
        { id: '1atbf_dlZaBbU-cdIFKxvAXAFKlRw62MD', title: 'Momento divertido' }
    ],
    music: [
        { id: 'wL7I0BU5vtM', title: 'Cumpleaños Feliz Emily' },
        { id: 'TGtWWb9emYI', title: 'Shakira - Ole Ola' }
    ]
};

// Variables de estado
let loadedImagesCount = 0;
let youtubePlayers = {};
let isYouTubeMuted = false;
let currentYouTubePlayer = null;

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeEventListeners();
});

// Inicializar la página
function initializePage() {
    loadPhotos();
    loadVideos();
    loadMusic();
}

// Configurar event listeners
function initializeEventListeners() {
    // Botón de confeti
    document.getElementById('confettiBtn').addEventListener('click', throwConfetti);
    
    // Modal de fotos
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('photoModal').addEventListener('click', function(e) {
        if (e.target.id === 'photoModal') closeModal();
    });
    
    // Controles de música
    document.getElementById('play1').addEventListener('click', () => playYouTubeVideo('wL7I0BU5vtM'));
    document.getElementById('pause1').addEventListener('click', pauseYouTubeVideo);
    document.getElementById('mute1').addEventListener('click', toggleMuteYouTube);
    
    document.getElementById('play2').addEventListener('click', () => playYouTubeVideo('TGtWWb9emYI'));
    document.getElementById('pause2').addEventListener('click', pauseYouTubeVideo);
    document.getElementById('mute2').addEventListener('click', toggleMuteYouTube);
}

// Cargar fotos desde Google Drive
function loadPhotos() {
    const photosContainer = document.querySelector('.photos');
    const debugInfo = document.getElementById('photoDebugInfo');
    const photoCounter = document.getElementById('photoCounter');
    
    debugInfo.textContent = 'Cargando fotos...';
    
    contentData.photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        const img = document.createElement('img');
        img.className = 'photo-img';
        img.loading = 'lazy';
        img.alt = photo.alt;
        img.src = `https://drive.google.com/thumbnail?id=${photo.id}&sz=w600`;
        
        img.onload = function() {
            loadedImagesCount++;
            updatePhotoCounter();
            if (loadedImagesCount === contentData.photos.length) {
                debugInfo.textContent = `Todas las fotos (${loadedImagesCount}) se cargaron correctamente.`;
            }
        };
        
        img.onerror = function() {
            this.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'photo-error';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>No se pudo cargar la imagen</p>
                <button onclick="retryImage('${photo.id}', this)">Reintentar</button>
            `;
            photoItem.appendChild(errorDiv);
            updatePhotoCounter();
        };
        
        img.addEventListener('click', () => openModal(img));
        photoItem.appendChild(img);
        photosContainer.appendChild(photoItem);
    });
    
    function updatePhotoCounter() {
        photoCounter.textContent = `${loadedImagesCount} de ${contentData.photos.length} fotos cargadas`;
    }
}

// Reintentar carga de imagen
function retryImage(imageId, button) {
    const photoItem = button.parentElement.parentElement;
    const img = photoItem.querySelector('img');
    
    button.disabled = true;
    button.innerHTML = '<div class="spinner"></div>Cargando...';
    
    // Forzar recarga con timestamp para evitar caché
    img.src = `https://drive.google.com/thumbnail?id=${imageId}&sz=w600&t=${new Date().getTime()}`;
    img.style.display = 'block';
    
    img.onload = function() {
        button.parentElement.remove();
        loadedImagesCount++;
        document.getElementById('photoCounter').textContent = 
            `${loadedImagesCount} de ${contentData.photos.length} fotos cargadas`;
    };
    
    img.onerror = function() {
        button.disabled = false;
        button.textContent = 'Reintentar';
    };
}

// Cargar videos
function loadVideos() {
    document.getElementById('video1').src = `https://drive.google.com/file/d/${contentData.videos[0].id}/preview`;
    document.getElementById('video2').src = `https://drive.google.com/file/d/${contentData.videos[1].id}/preview`;
}

// Cargar música de YouTube
function loadMusic() {
    document.getElementById('youtube1').src = `https://www.youtube.com/embed/${contentData.music[0].id}?rel=0&modestbranding=1`;
    document.getElementById('youtube2').src = `https://www.youtube.com/embed/${contentData.music[1].id}?rel=0&modestbranding=1`;
}

// Controlar reproducción de YouTube
function playYouTubeVideo(videoId) {
    if (currentYouTubePlayer && currentYouTubePlayer !== videoId) {
        pauseYouTubeVideo();
    }
    
    // En un entorno real, aquí se usaría la API de YouTube
    // Por ahora, mostramos un mensaje de confirmación
    console.log(`Reproduciendo video: ${videoId}`);
    currentYouTubePlayer = videoId;
    
    throwConfetti();
}

function pauseYouTubeVideo() {
    if (currentYouTubePlayer) {
        console.log(`Pausando video: ${currentYouTubePlayer}`);
    }
}

function toggleMuteYouTube() {
    isYouTubeMuted = !isYouTubeMuted;
    const muteButtons = document.querySelectorAll('#mute1, #mute2');
    
    muteButtons.forEach(button => {
        const icon = button.querySelector('i');
        if (isYouTubeMuted) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
        }
    });
    
    console.log(`Silencio: ${isYouTubeMuted}`);
}

// Funcionalidad para el modal de fotos
function openModal(imgElement) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    
    if (imgElement.src.includes('drive.google.com')) {
        const driveId = imgElement.src.split('id=')[1].split('&')[0];
        modalImg.src = `https://drive.google.com/uc?export=view&id=${driveId}`;
    } else {
        modalImg.src = imgElement.src;
    }
    
    modalImg.alt = imgElement.alt;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('photoModal').style.display = 'none';
}

// Sistema de confeti
function throwConfetti() {
    const colors = ['#ff0066', '#ffcc00', '#00ccff', '#ff00ff', '#00ff99'];
    const symbols = ['🎊', '🎉', '🎈', '✨', '🥳', '❤️', '🌈'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.fontSize = (Math.random() * 20 + 15) + 'px';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        document.body.appendChild(confetti);
        
        // Eliminar el confeti después de que termine la animación
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Iniciar música automáticamente al cargar la página
window.addEventListener('load', function() {
    setTimeout(() => {
        playYouTubeVideo('wL7I0BU5vtM');
    }, 2000);
});
