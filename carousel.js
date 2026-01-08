document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');

    // Safety check: stops script if carousel isn't on the page
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');

    let currentIndex = 0;

    // Function to move to specific slide
    const moveToSlide = (index) => {
        // Calculate percentage to move
        // 0% for slide 1, -100% for slide 2, -200% for slide 3
        const amountToMove = '-' + (index * 100) + '%';
        track.style.transform = 'translateX(' + amountToMove + ')';
        currentIndex = index;
    };

    // Click Previous Button
    prevButton.addEventListener('click', () => {
        // If at start, go to last slide; otherwise go back one
        const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        moveToSlide(prevIndex);
    });

    // Click Next Button
    nextButton.addEventListener('click', () => {
        // If at end, loop to first slide; otherwise go next
        const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        moveToSlide(nextIndex);
    });

    // Auto-Play Feature (Slides every 5 seconds)
    let autoPlay = setInterval(() => {
        const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        moveToSlide(nextIndex);
    }, 5000);

    // Pause Auto-Play on Hover (Optional but recommended)
    track.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoPlay);
    });

    // Resume Auto-Play on Mouse Leave
    track.parentElement.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
            moveToSlide(nextIndex);
        }, 5000);
    });
});