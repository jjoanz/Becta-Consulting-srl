// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isActive = navToggle.classList.contains('active');
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Smooth body scroll lock
            if (!isActive) {
                body.style.overflow = 'hidden';
                // Trigger animation for menu items
                setTimeout(() => {
                    navLinks.forEach((link, index) => {
                        link.style.opacity = '0';
                        setTimeout(() => {
                            link.style.opacity = '1';
                        }, index * 50);
                    });
                }, 100);
            } else {
                body.style.overflow = '';
            }
        });
    }
    
    // Close menu when clicking on a link with smooth animation
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => {
                l.style.opacity = '0';
            });
            
            setTimeout(() => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }, 200);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Navbar scroll effect - always visible
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Just add shadow when scrolled, but always keep visible
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for anchor links with easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Smooth scroll with custom easing
                smoothScrollTo(targetPosition, 800);
            }
        });
    });
    
    // Custom smooth scroll function
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Intersection Observer for fade-in animations with smooth timing
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe pillar elements
    const pillars = document.querySelectorAll('.pillar');
    pillars.forEach(pillar => {
        observer.observe(pillar);
    });
    
    // Observe hospitality sections for simple fade-in
    const hospitalitySections = document.querySelectorAll('.hospitality-section, .hospitality-intro, .hospitality-function, .hospitality-distinction');
    hospitalitySections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe target cards for entrance animation
    const targetCards = document.querySelectorAll('.target-card');
    targetCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
    });
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    targetCards.forEach(card => {
        cardObserver.observe(card);
    });
    
    // Observe section elements for staggered smooth animation
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
    });
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Hero parallax effect with smooth scrolling
    const heroBackground = document.querySelector('.hero-background');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroBackground && heroContent) {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * 0.4;
                    
                    if (scrolled <= window.innerHeight) {
                        heroBackground.style.transform = `translateY(${rate}px)`;
                        heroContent.style.transform = `translateY(${rate * 0.6}px)`;
                        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }
    
    // Add smooth hover effects to target cards
    const targetCardsHover = document.querySelectorAll('.target-card');
    targetCardsHover.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeftWidth = '5px';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeftWidth = '3px';
        });
    });
    
    // Add smooth animation to distinctions
    const distinctionItems = document.querySelectorAll('.distinction-item');
    distinctionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 1000 + (index * 100));
    });
    
    // Dynamic year in footer (if needed)
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Add loading animation completion
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-logo, .hero-subtitle');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    });
    
    // Pillar card interactions with smooth transitions
    const pillarCards = document.querySelectorAll('.pillar');
    pillarCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeft = '4px solid var(--color-accent)';
            this.style.paddingLeft = 'calc(var(--spacing-lg) - 1px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeft = 'none';
            this.style.paddingLeft = 'var(--spacing-lg)';
        });
    });
    
    // Add active state to navigation based on scroll position
    function updateActiveNav() {
        const sections = document.querySelectorAll('.section[id]');
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Enhanced hero scene animations with smooth mouse tracking
    const heroCircle = document.querySelector('.hero-circle');
    const heroTree = document.querySelector('.hero-tree');
    
    if (heroCircle && heroTree) {
        let mouseX = 0.5;
        let mouseY = 0.5;
        let currentX = 0.5;
        let currentY = 0.5;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
        });
        
        // Smooth animation loop
        function animate() {
            // Lerp for smooth following
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            
            const circleX = (currentX - 0.5) * 40;
            const circleY = (currentY - 0.5) * 40;
            const treeX = (currentX - 0.5) * -20;
            const treeRotation = (currentX - 0.5) * 3;
            
            heroCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;
            heroTree.style.transform = `translateX(${treeX}px) rotate(${treeRotation}deg)`;
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // Form validation (if contact form is added)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            Object.keys(data).forEach(key => {
                if (!data[key].trim()) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Handle form submission
                console.log('Form submitted:', data);
                this.reset();
                alert('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
            } else {
                alert('Por favor complete todos los campos.');
            }
        });
    }
    
    // Add subtle animation to emphasis text
    const emphasisTexts = document.querySelectorAll('.emphasis-text');
    emphasisTexts.forEach((text, index) => {
        text.style.animationDelay = `${0.2 * index}s`;
    });
    
    // Profile photo smooth hover effect
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03) translateY(-5px)';
            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25)';
        });
        
        profilePhoto.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
        });
    }
    
    // Add smooth reveal for contact section
    const contactSection = document.querySelector('.section-contact');
    if (contactSection) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        contactObserver.observe(contactSection);
    }
    
    // Initialize all animations
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.pillar, .section-title, .hero-tagline');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
    }
    
    initAnimations();
    
    // Console message
    console.log('%cBECTA Consulting', 'font-size: 24px; font-weight: bold; color: #1a3a4a;');
    console.log('%cArquitectura viva de la decisión', 'font-size: 14px; color: #5a7a8a;');
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScroll = debounce(function() {
    // Add any scroll-based logic here
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Prevent flash of unstyled content
document.documentElement.style.visibility = 'visible';