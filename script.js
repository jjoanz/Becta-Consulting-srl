

const heroTagline = document.querySelector('.hero-tagline');
if (heroTagline) {
    setTimeout(() => {
        heroTagline.style.opacity = '1';
        heroTagline.style.transform = 'translateY(0)';
    }, 600);
}
