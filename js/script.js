// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle click on module name in TOC to scroll to module detail
document.querySelectorAll('.module-toc-item-wrapper .toc-module-name').forEach(nameEl => {
    nameEl.style.cursor = 'pointer';
    nameEl.addEventListener('click', function() {
        const moduleNum = this.textContent.match(/[IVX]+/)?.[0];
        if (moduleNum) {
            const moduleMap = {
                'I': 'module-i',
                'II': 'module-ii',
                'III': 'module-iii',
                'IV': 'module-iv',
                'V': 'module-v',
                'VI': 'module-vi',
                'VII': 'module-vii',
                'VIII': 'module-viii'
            };
            const targetId = moduleMap[moduleNum];
            if (targetId) {
                const target = document.querySelector(`#${targetId}`);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
});

// Add scroll animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all content blocks
document.querySelectorAll('.content-block, .subsection').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Screenshot Carousel with Modal
(function() {
    const carousel = document.getElementById('screenshotCarousel');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const currentIndexSpan = document.getElementById('currentIndex');
    const totalImagesSpan = document.getElementById('totalImages');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    if (!carousel || !modal) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    let currentSlide = 0;
    let modalIndex = 0;
    const totalSlides = slides.length;
    const images = Array.from(slides).map(slide => {
        const img = slide.querySelector('.carousel-image');
        return img ? img.src : '';
    }).filter(src => src);
    
    // Set total images
    if (totalImagesSpan) {
        totalImagesSpan.textContent = totalSlides;
    }
    
    // Carousel functions
    function updateCarousel() {
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
        
        // Update transform for carousel slides container
        const translateX = -currentSlide * 25;
        carousel.style.transform = `translateX(${translateX}%)`;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateCarousel();
        }
    }
    
    // Modal functions
    function openModal(index) {
        if (index < 0 || index >= totalSlides) return;
        
        modalIndex = index;
        updateModalImage();
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function updateModalImage() {
        if (modalImage && images[modalIndex]) {
            modalImage.src = images[modalIndex];
            modalImage.alt = `Campus Cloud Screenshot ${modalIndex + 1}`;
        }
        
        if (currentIndexSpan) {
            currentIndexSpan.textContent = modalIndex + 1;
        }
    }
    
    function nextModalImage() {
        modalIndex = (modalIndex + 1) % totalSlides;
        updateModalImage();
    }
    
    function prevModalImage() {
        modalIndex = (modalIndex - 1 + totalSlides) % totalSlides;
        updateModalImage();
    }
    
    // Carousel event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Open modal on slide click
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            // Don't open modal if clicking on carousel buttons
            if (e.target.closest('.carousel-btn')) return;
            openModal(index);
        });
    });
    
    // Modal event listeners
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextModalImage();
        });
    }
    
    if (modalPrev) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            prevModalImage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal && modal.classList.contains('active')) {
            // Modal is open - handle modal navigation
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevModalImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextModalImage();
            }
        } else {
            // Carousel navigation (only when carousel is visible)
            const carouselSection = document.querySelector('.screenshot-carousel-section');
            if (carouselSection) {
                const rect = carouselSection.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                    e.preventDefault();
                    if (e.key === 'ArrowLeft') prevSlide();
                    if (e.key === 'ArrowRight') nextSlide();
                }
            }
        }
    });
    
    // Touch/swipe support for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleCarouselSwipe();
        });
    }
    
    function handleCarouselSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
        }
    }
    
    // Touch/swipe support for modal
    if (modal) {
        let modalTouchStartX = 0;
        let modalTouchEndX = 0;
        
        modal.addEventListener('touchstart', (e) => {
            modalTouchStartX = e.changedTouches[0].screenX;
        });
        
        modal.addEventListener('touchend', (e) => {
            modalTouchEndX = e.changedTouches[0].screenX;
            handleModalSwipe();
        });
        
        function handleModalSwipe() {
            const swipeThreshold = 50;
            if (modalTouchEndX < modalTouchStartX - swipeThreshold) {
                nextModalImage();
            }
            if (modalTouchEndX > modalTouchStartX + swipeThreshold) {
                prevModalImage();
            }
        }
    }
    
    // Initialize
    updateCarousel();
})();



