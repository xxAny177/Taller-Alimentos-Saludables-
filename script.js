document.addEventListener('DOMContentLoaded', function() {
    // === FIX: Mover los puntos de navegación al contenedor del carrusel para correcto posicionamiento ===
    const carouselContainer = document.querySelector('.carousel-container');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (carouselContainer && dotsContainer && dotsContainer.parentElement !== carouselContainer) {
        carouselContainer.appendChild(dotsContainer);
    }
    // === FIN DEL FIX ===

    // ---------------------------------------------
    // --- Lógica del Acordeón (Cronograma) ---
    // ---------------------------------------------
    const dias = document.querySelectorAll('.cronograma-dia h4');

    dias.forEach(header => {
        // Inicializar la flecha hacia abajo si no existe
        if (!header.textContent.includes('▾') && !header.textContent.includes('▴')) {
            header.textContent += ' ▾';
        }
        
        header.addEventListener('click', function() {
            const parent = this.parentElement;
            const isActive = parent.classList.contains('active');

            // 1. Cierra todos los acordeones
            document.querySelectorAll('.cronograma-dia').forEach(item => {
                item.classList.remove('active');
                // Reemplaza la flecha '▴' por '▾' en todos los que la tienen
                let headerText = item.querySelector('h4').textContent;
                item.querySelector('h4').textContent = headerText.replace('▴', '▾');
            });

            // 2. Abre el acordeón clicado si no estaba activo
            if (!isActive) {
                parent.classList.add('active');
                // Reemplaza la flecha '▾' por '▴' en el acordeón actual
                this.textContent = this.textContent.replace('▾', '▴');
            }
        });
    });
    
    // ---------------------------------------------
    // --- LÓGICA DEL CARRUSEL (SLIDER) ---
    // ---------------------------------------------
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    if (track && slides.length > 0) {
        let slideIndex = 0;
        let autoPlayInterval;

        // 1. Crear Puntos de Navegación (Dots)
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-index', i);
            dotsContainer.appendChild(dot);
            
            dot.addEventListener('click', () => {
                moveToSlide(i);
            });
        }
        const dots = document.querySelectorAll('.dot');


        // 2. Función principal para mover el carrusel
        function moveToSlide(index) {
            // Asegura que el índice esté dentro del rango
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }

            slideIndex = index;
            
            // Mueve el track
            const amountToMove = -slideIndex * 100;
            track.style.transform = 'translateX(' + amountToMove + '%)';

            // Actualiza los puntos de navegación
            dots.forEach(dot => dot.classList.remove('active'));
            dots[slideIndex].classList.add('active');
        }

        // 3. Botones Anterior y Siguiente
        prevButton.addEventListener('click', () => {
            moveToSlide(slideIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            moveToSlide(slideIndex + 1);
        });

        // 4. Autoplay (Cambia cada 5 segundos)
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                moveToSlide(slideIndex + 1);
            }, 5000); 
        }

        // Pausar Autoplay al interactuar
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseover', () => clearInterval(autoPlayInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        }

        // 5. Inicialización
        moveToSlide(0);
        startAutoPlay();
    }
    // --- FIN DE LA LÓGICA DEL CARRUSEL ---

    // ---------------------------------------------
    // --- LÓGICA PARA EL BOTÓN VOLVER AL INICIO (BACK TO TOP) ---
    // ---------------------------------------------
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Mostrar/Ocultar el botón
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) { // Muestra el botón después de 300px de scroll
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Función de scroll suave
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // --- FIN LÓGICA BACK TO TOP ---


    // ---------------------------------------------
    // --- LÓGICA PARA RESALTAR LA SECCIÓN ACTIVA (SCROLLSPY) ---
    // ---------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Obtener todas las secciones ancladas
    const sections = Array.from(navLinks).map(link => {
        const id = link.getAttribute('href');
        return document.querySelector(id);
    }).filter(section => section !== null); 

    function updateActiveSection() {
        const offset = 100; // Un margen para que se active antes de llegar al borde superior
        let currentSection = null;
        
        // Recorre las secciones de abajo hacia arriba
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            
            // Si el scroll supera el inicio de la sección (menos el offset), esa es la actual
            if (window.scrollY >= section.offsetTop - offset) {
                currentSection = section;
                break;
            }
        }
        
        // Remover 'active' de todas las secciones y enlaces
        sections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Asignar 'active' a la sección y enlace actual
        if (currentSection) {
            currentSection.classList.add('active');
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Ejecutar el scrollspy al cargar y al hacer scroll
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Ejecutar al inicio para la primera sección
});