document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica original para el Acordeón (Cronograma) ---
    const dias = document.querySelectorAll('.cronograma-dia h4');

    dias.forEach(header => {
        header.addEventListener('click', function() {
            const parent = this.parentElement;
            const isActive = parent.classList.contains('active');

            document.querySelectorAll('.cronograma-dia').forEach(item => {
                item.classList.remove('active');
                item.querySelector('h4').textContent = item.querySelector('h4').textContent.replace('▴', '▾');
            });

            if (!isActive) {
                parent.classList.add('active');
                this.textContent = this.textContent.replace('▾', '▴');
            }
        });
    });

    // --- LÓGICA PARA RESALTAR LA SECCIÓN ACTIVA (SCROLLSPY) ---
    
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Obtener todas las secciones (incluyendo la nueva y la galería)
    const sections = Array.from(navLinks).map(link => {
        const id = link.getAttribute('href');
        return document.querySelector(id);
    }).filter(section => section !== null); 

    function updateActiveSection() {
        const offset = 100; 
        let currentSection = null;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            
            if (window.scrollY >= section.offsetTop - offset) {
                currentSection = section;
                break;
            }
        }
        
        sections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (currentSection) {
            currentSection.classList.add('active');
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // --- LÓGICA COMPLETA DEL CARRUSEL (SLIDER) ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    const slideCount = slides.length;
    let slideIndex = 0;
    
    // 1. Generar los puntos de navegación 
    if (dotsContainer) {
        const dots = [];
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-index', i);
            dotsContainer.appendChild(dot);
            dots.push(dot);
            
            dot.addEventListener('click', () => moveToSlide(i));
        }

        // 2. Función principal de movimiento
        function moveToSlide(index) {
            if (index < 0) {
                index = slideCount - 1; 
            } else if (index >= slideCount) {
                index = 0; 
            }

            slideIndex = index;
            const offset = -slideIndex * 100;
            if (track) {
                track.style.transform = `translateX(${offset}%)`;
            }

            // Actualizar puntos
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[slideIndex]) {
                dots[slideIndex].classList.add('active');
            }
        }
        
        // 3. Handlers de botones
        if (nextButton) nextButton.addEventListener('click', () => moveToSlide(slideIndex + 1));
        if (prevButton) prevButton.addEventListener('click', () => moveToSlide(slideIndex - 1));

        // 4. Autoplay
        let autoPlayInterval = setInterval(() => {
            moveToSlide(slideIndex + 1);
        }, 5000); 

        // Pausar Autoplay al interactuar
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseover', () => clearInterval(autoPlayInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(() => {
                    moveToSlide(slideIndex + 1);
                }, 5000);
            });
        }

        // 5. Inicialización
        moveToSlide(0);
    }
    // --- FIN DE LA LÓGICA DEL CARRUSEL ---

    // --- LÓGICA PARA EL BOTÓN VOLVER AL INICIO (BACK TO TOP) ---
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Mostrar/Ocultar el botón
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) { 
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


    // Agregar un 'listener' para el evento scroll
    window.addEventListener('scroll', updateActiveSection);
    
    // Ejecutar una vez al cargar
    updateActiveSection();
});