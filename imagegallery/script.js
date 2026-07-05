document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('gallery-search');
    const themeToggle = document.getElementById('theme-toggle');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const downloadBtn = document.getElementById('lightbox-download');
    
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const slides = document.querySelectorAll('.slide');
    let currentSlideIndex = 0;

    function nextSlide() {
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    }
    setInterval(nextSlide, 4000);

    let visibleImages = [...galleryItems];
    let currentIndex = 0;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
    });

    function applyFilters() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const searchKeywords = searchInput.value.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);

        let matchCount = 0;
        galleryItems.forEach((item) => {
            const matchesCategory = activeFilter === 'all' || item.getAttribute('data-category') === activeFilter;
            const altText = item.querySelector('img').getAttribute('alt').toLowerCase();
            
            const matchesSearch = searchKeywords.length === 0 || searchKeywords.every(keyword => altText.includes(keyword));

            if (matchesCategory && matchesSearch) {
                item.classList.remove('hide');
                item.style.animation = 'none';
                item.offsetHeight; 
                item.style.animation = `scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                item.style.animationDelay = `${matchCount * 0.03}s`;
                matchCount++;
            } else {
                item.classList.add('hide');
            }
        });

        visibleImages = [...galleryItems].filter(item => !item.classList.contains('hide'));
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');
            applyFilters();
        });
    });

    searchInput.addEventListener('input', applyFilters);

    function updateCounter() {
        if (visibleImages.length > 0) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${visibleImages.length}`;
        } else {
            lightboxCounter.textContent = `0 / 0`;
        }
    }

    function openLightbox(index) {
        if (visibleImages.length === 0) return;
        currentIndex = index;
        const targetImg = visibleImages[currentIndex].querySelector('img');
        
        lightboxImg.src = targetImg.src;
        lightboxCaption.textContent = targetImg.getAttribute('alt');
        
        updateCounter();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showNext() {
        if (visibleImages.length <= 1) return;
        currentIndex = (currentIndex + 1) % visibleImages.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        if (visibleImages.length <= 1) return;
        currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
        openLightbox(currentIndex);
    }

    downloadBtn.addEventListener('click', async () => {
        try {
            const currentSrc = lightboxImg.src;
            const response = await fetch(currentSrc);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `gallery-image-${currentIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            window.open(lightboxImg.src, '_blank');
        }
    });

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const indexInVisible = visibleImages.indexOf(item);
            if (indexInVisible !== -1) {
                openLightbox(indexInVisible);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});