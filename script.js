// SCRIPT LOADED - Test message
console.log('🚀 BECTA Script Loaded!');

// Multi-step Form Wizard - Using Event Delegation
let currentStep = 1;
const totalSteps = 4;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Event delegation for next/prev buttons
    document.addEventListener('click', function(e) {
        // Handle next button
        if (e.target.matches('[data-next]')) {
            const step = parseInt(e.target.getAttribute('data-next'));
            handleNextStep(step);
        }
        
        // Handle prev button
        if (e.target.matches('[data-prev]')) {
            const step = parseInt(e.target.getAttribute('data-prev'));
            handlePrevStep(step);
        }
    });
    
    // Handle "Otro" option in contexto
    document.addEventListener('change', function(e) {
        if (e.target.id === 'contexto-otro') {
            const otroInput = document.getElementById('contexto-otro-text');
            if (otroInput) {
                if (e.target.checked) {
                    otroInput.style.display = 'block';
                    otroInput.required = true;
                } else {
                    otroInput.style.display = 'none';
                    otroInput.required = false;
                }
            }
        }
    });
    
    // Handle form submission
    const contactFormSubmit = document.getElementById('contactForm');
    if (contactFormSubmit) {
        contactFormSubmit.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate confirmation checkbox
            const confirmCheckbox = this.querySelector('input[name="confirmacion"]');
            if (!confirmCheckbox.checked) {
                alert('Por favor confirme que comprende las condiciones');
                return;
            }
            
            const form = this;
            const formData = new FormData(form);
            
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Hide form, show success message
                form.style.display = 'none';
                const progressBar = document.querySelector('.form-progress');
                if (progressBar) progressBar.style.display = 'none';
                const successMsg = document.getElementById('successMessage');
                if (successMsg) successMsg.classList.remove('hidden');
            })
            .catch((error) => {
                alert('Error al enviar el formulario. Por favor intente nuevamente.');
                console.error('Error:', error);
            });
        });
    }
});

function handleNextStep(step) {
    // Validate current step
    if (!validateStep(step)) {
        return;
    }
    
    // Hide current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const currentProgress = document.querySelector(`.progress-step[data-step="${step}"]`);
    
    if (currentStepEl) currentStepEl.classList.remove('active');
    if (currentProgress) {
        currentProgress.classList.remove('active');
        currentProgress.classList.add('completed');
    }
    
    // Show next step
    currentStep = step + 1;
    const nextStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const nextProgress = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
    
    if (nextStepEl) nextStepEl.classList.add('active');
    if (nextProgress) nextProgress.classList.add('active');
    
    // Show summary on last step
    if (currentStep === totalSteps) {
        showSummary();
    }
    
    // Scroll to top of form
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handlePrevStep(step) {
    // Hide current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const currentProgress = document.querySelector(`.progress-step[data-step="${step}"]`);
    
    if (currentStepEl) currentStepEl.classList.remove('active');
    if (currentProgress) currentProgress.classList.remove('active');
    
    // Show previous step
    currentStep = step - 1;
    const prevStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const prevProgress = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
    
    if (prevStepEl) prevStepEl.classList.add('active');
    if (prevProgress) {
        prevProgress.classList.add('active');
        prevProgress.classList.remove('completed');
    }
    
    // Scroll to top of form
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function validateStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!currentStepEl) return false;
    
    const inputs = currentStepEl.querySelectorAll('input[required]:not([type="radio"]), textarea[required]');
    const radioGroups = {};
    
    let isValid = true;
    
    // Validate text inputs and textareas
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#c74440';
            input.style.boxShadow = '0 0 0 3px rgba(199, 68, 64, 0.1)';
            
            // Remove error style on input
            input.addEventListener('input', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, { once: true });
        }
    });
    
    // Validate radio groups
    const radios = currentStepEl.querySelectorAll('input[type="radio"][required]');
    radios.forEach(radio => {
        if (!radioGroups[radio.name]) {
            radioGroups[radio.name] = false;
        }
        if (radio.checked) {
            radioGroups[radio.name] = true;
        }
    });
    
    // Check if all radio groups have a selection
    Object.keys(radioGroups).forEach(groupName => {
        if (!radioGroups[groupName]) {
            isValid = false;
            const radioContainer = currentStepEl.querySelector(`input[name="${groupName}"]`)?.closest('.form-group');
            if (radioContainer) {
                const label = radioContainer.querySelector('label');
                if (label) {
                    label.style.color = '#c74440';
                    setTimeout(() => {
                        label.style.color = '';
                    }, 3000);
                }
            }
        }
    });
    
    if (!isValid) {
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Por favor complete todos los campos obligatorios';
        errorMsg.style.cssText = 'color: #c74440; text-align: center; padding: 10px; margin-top: 10px; background: rgba(199, 68, 64, 0.1); border-radius: 4px;';
        
        const existingError = currentStepEl.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const navigation = currentStepEl.querySelector('.form-navigation');
        if (navigation) {
            navigation.insertAdjacentElement('beforebegin', errorMsg);
            
            setTimeout(() => {
                errorMsg.remove();
            }, 3000);
        }
    }
    
    return isValid;
}

function showSummary() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const summaryEl = document.getElementById('formSummary');
    if (!summaryEl) return;
    
    let summaryHTML = '';
    
    const labels = {
        'nombre': 'Nombre y apellido',
        'organizacion': 'Organización',
        'rol': 'Rol',
        'contexto': 'Contexto',
        'situacion': 'Situación a abordar',
        'intervencion': 'Tipo de intervención',
        'email': 'Correo electrónico',
        'ubicacion': 'País / Ciudad'
    };
    
    for (const [key, value] of formData.entries()) {
        if (key !== 'form-name' && key !== 'bot-field' && key !== 'confirmacion' && key !== 'contexto-otro-detalle' && value) {
            summaryHTML += `
                <div class="summary-item">
                    <span class="summary-label">${labels[key] || key}:</span>
                    <span class="summary-value">${value}</span>
                </div>
            `;
        }
    }
    
    summaryEl.innerHTML = summaryHTML;
}

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
            // Cierra el menú y restaura el scroll inmediatamente después de un pequeño retraso
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
                // Obtiene la altura actual de la navbar para un desplazamiento perfecto
                const navbarHeight = navbar ? navbar.offsetHeight : 0; 
                
                // Calcula la posición de destino, restando la altura de la navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Smooth scroll con custom easing
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