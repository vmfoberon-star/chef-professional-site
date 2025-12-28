// Chef Professional Website Script

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        navToggle.textContent = isActive ? '✕' : '☰';
    });
}

// Close mobile menu on link click
if (navLinks) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (navToggle) navToggle.textContent = '☰';
        });
    });
}

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Language Switcher
const langToggle = document.getElementById('langToggle');
const langMenu = document.getElementById('langMenu');
const langOptions = document.querySelectorAll('.lang-option');
const langCurrent = document.querySelector('.lang-current');

// Set Hebrew as default, but check localStorage first
let savedLang = localStorage.getItem('language');
let currentLang = savedLang || 'he';

// If no saved language, force Hebrew
if (!savedLang) {
    currentLang = 'he';
    localStorage.setItem('language', 'he');
    // Also update HTML immediately
    document.documentElement.setAttribute('lang', 'he');
    document.documentElement.setAttribute('dir', 'rtl');
}

const langCodes = {
    ru: 'RU',
    en: 'EN',
    he: 'HE'
};

function applyLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    
    currentLang = lang;
    const t = translations[lang];
    
    // Update lang and dir attributes on html element
    document.documentElement.setAttribute('lang', lang);
    if (lang === 'he') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                return;
            } else {
                element.textContent = t[key];
            }
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
    
    document.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (t[key]) {
            option.textContent = t[key];
        }
    });
    
    if (langCurrent) {
        langCurrent.textContent = langCodes[lang] || lang.toUpperCase();
    }
    
    localStorage.setItem('language', lang);
}

if (langToggle) {
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const languageSwitcher = langToggle.closest('.language-switcher');
        if (languageSwitcher) {
            languageSwitcher.classList.toggle('active');
        }
    });
}

document.addEventListener('click', (e) => {
    const languageSwitcher = langToggle ? langToggle.closest('.language-switcher') : null;
    if (langMenu && languageSwitcher && !languageSwitcher.contains(e.target)) {
        languageSwitcher.classList.remove('active');
    }
});

langOptions.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        applyLanguage(lang);
        const languageSwitcher = langToggle ? langToggle.closest('.language-switcher') : null;
        if (languageSwitcher) {
            languageSwitcher.classList.remove('active');
        }
    });
});

// Booking Form
const bookingForm = document.getElementById('bookingForm');
const bookingMessage = document.getElementById('bookingMessage');

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(bookingForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const eventType = formData.get('eventType');
        const date = formData.get('date');
        const guests = formData.get('guests');
        const address = formData.get('address');
        const message = formData.get('message');
        
        // Get event type text
        const eventTypeTexts = {
            wedding: currentLang === 'ru' ? 'Свадьба' : currentLang === 'en' ? 'Wedding' : 'חתונה',
            birthday: currentLang === 'ru' ? 'День рождения' : currentLang === 'en' ? 'Birthday' : 'יום הולדת',
            corporate: currentLang === 'ru' ? 'Корпоратив' : currentLang === 'en' ? 'Corporate' : 'אירוע חברה',
            private: currentLang === 'ru' ? 'Частное мероприятие' : currentLang === 'en' ? 'Private Event' : 'אירוע פרטי'
        };
        
        const eventTypeText = eventTypeTexts[eventType] || eventType;
        
        // Disable submit button
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'ru' ? 'Отправка...' : currentLang === 'en' ? 'Sending...' : 'שולח...';
        
        try {
            // EmailJS configuration
            const emailjsPublicKey = window.EMAILJS_PUBLIC_KEY || "CLotTe4fNOA4jUx76";
            const emailjsServiceId = window.EMAILJS_SERVICE_ID || 'service_uc4ywgl';
            const emailjsTemplateId = window.EMAILJS_TEMPLATE_ID || 'template_63dy65h';
            
            if (typeof emailjs === 'undefined' || !emailjsPublicKey || !emailjsServiceId || !emailjsTemplateId) {
                throw new Error('EmailJS не настроен');
            }
            
            emailjs.init(emailjsPublicKey);
            
            const templateParams = {
                to_name: 'Chef Professional',
                to_email: 'chef@example.com',
                from_name: name,
                from_email: email,
                subject: `Новая заявка на мероприятие: ${eventTypeText} - ${date}`,
                message: `
Новая заявка на мероприятие:

Имя: ${name}
Телефон: ${phone}
Email: ${email}
Тип мероприятия: ${eventTypeText}
Дата: ${date}
Количество гостей: ${guests}
Адрес: ${address}
${message ? `Дополнительная информация:\n${message}` : ''}

Дата заявки: ${new Date().toLocaleString('ru-RU')}
                `.trim()
            };
            
            await emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams);
            
            // Success message
            const successMsg = currentLang === 'ru' ? 
                'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.' :
                currentLang === 'en' ?
                'Thank you! Your request has been sent. We will contact you soon.' :
                'תודה! הבקשה נשלחה. ניצור קשר בקרוב.';
            
            showBookingMessage(successMsg, 'success');
            bookingForm.reset();
            
        } catch (error) {
            console.error('Booking error:', error);
            const errorMsg = currentLang === 'ru' ? 
                'Ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь по телефону.' :
                currentLang === 'en' ?
                'Error sending. Please try again later or contact by phone.' :
                'שגיאה בשליחה. נסו שוב מאוחר יותר או צרו קשר בטלפון.';
            
            showBookingMessage(errorMsg, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function showBookingMessage(message, type) {
    if (!bookingMessage) return;
    
    bookingMessage.textContent = message;
    bookingMessage.className = `form-message ${type}`;
    bookingMessage.style.display = 'block';
    
    setTimeout(() => {
        bookingMessage.style.display = 'none';
    }, 5000);
}

// Phone Mask
const phoneInput = document.getElementById('booking-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('972') && value.length > 3) {
            value = '0' + value.slice(3);
        }
        
        if (value.length > 0 && !value.startsWith('0') && value.length <= 9) {
            value = '0' + value;
        }
        
        let formatted = '';
        if (value.length <= 3) {
            formatted = value;
        } else if (value.length <= 6) {
            formatted = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            formatted = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }
        e.target.value = formatted;
    });
}

// Set minimum date to today
const dateInput = document.getElementById('booking-date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Scroll Animation
const scrollObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            entry.target.classList.add('animated');
        }
    });
}, scrollObserverOptions);

// Enhanced Scroll Animation with stagger
const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .menu-item, .gallery-item, .feature, .menu-category');

animateElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(40px)';
    element.style.transition = `opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`;
    scrollObserver.observe(element);
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (hero && scrolled < window.innerHeight) {
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = Math.max(0.5, 1 - (scrolled / window.innerHeight) * 0.5);
        }
        if (heroParticles) {
            heroParticles.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    }
});

// Magnetic cursor effect for buttons and cards
document.addEventListener('mousemove', (e) => {
    const magneticElements = document.querySelectorAll('.cta-button, .service-card, .menu-item, .gallery-item');
    
    magneticElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;
        
        if (distance < maxDistance && !element.matches(':hover')) {
            const moveX = x * 0.2;
            const moveY = y * 0.2;
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
});

// Reset magnetic effect when mouse leaves
document.addEventListener('mouseleave', () => {
    const magneticElements = document.querySelectorAll('.cta-button, .service-card, .menu-item, .gallery-item');
    magneticElements.forEach(element => {
        element.style.transform = '';
    });
});

// Add active class to current nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Apply language immediately on page load
function initializeLanguage() {
    // Set HTML attributes immediately
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'he' ? 'rtl' : 'ltr');
    
    // Update language toggle display
    if (langCurrent) {
        langCurrent.textContent = langCodes[currentLang] || currentLang.toUpperCase();
    }
    
    // Apply translations when available
    if (typeof translations !== 'undefined') {
        applyLanguage(currentLang);
    } else {
        // If translations not loaded yet, wait a bit
        setTimeout(() => {
            if (typeof translations !== 'undefined') {
                applyLanguage(currentLang);
            }
        }, 50);
    }
}

// Initialize language immediately
initializeLanguage();

// Gallery lightbox
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.createElement('div');
lightbox.className = 'gallery-lightbox';
lightbox.innerHTML = '<button class="gallery-lightbox-close">×</button>';
const lightboxImg = document.createElement('img');
lightbox.appendChild(lightboxImg);
document.body.appendChild(lightbox);

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightbox.classList.add('active');
    });
});

lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
    }
});

}); // End of DOMContentLoaded
