/**
 * Enhanced Cross-Device Compatibility JavaScript
 * Maison du Croissant - Website Enhancement
 */

// ===== DEVICE DETECTION & INITIALIZATION =====
class DeviceCompatibility {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.isTouch = this.detectTouch();
        this.viewport = this.getViewport();
        
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth < 768;
    }

    detectTablet() {
        return /iPad|Android|Silk|Kindle/i.test(navigator.userAgent) 
               && (window.innerWidth >= 768 && window.innerWidth <= 1024);
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    init() {
        this.addDeviceClasses();
        this.setupEventListeners();
        this.optimizeForDevice();
        this.setupResponsiveImages();
        this.handleOrientationChange();
    }

    addDeviceClasses() {
        const body = document.body;
        
        if (this.isMobile) body.classList.add('is-mobile');
        if (this.isTablet) body.classList.add('is-tablet');
        if (this.isTouch) body.classList.add('is-touch');
    }

    setupEventListeners() {
        // Resize handler with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });

        // Touch event optimization
        if (this.isTouch) {
            this.optimizeTouchEvents();
        }
    }

    handleResize() {
        this.viewport = this.getViewport();
        this.optimizeForDevice();
        this.adjustModalSizes();
        this.handleNavbarCollapse();
    }

    handleOrientationChange() {
        // Force viewport recalculation on orientation change
        setTimeout(() => {
            window.scrollTo(0, 1);
            this.viewport = this.getViewport();
            this.optimizeForDevice();
        }, 100);
    }

    optimizeForDevice() {
        if (this.isMobile) {
            this.optimizeForMobile();
        } else if (this.isTablet) {
            this.optimizeForTablet();
        } else {
            this.optimizeForDesktop();
        }
    }

    optimizeForMobile() {
        // Mobile-specific optimizations
        this.adjustFontSizes();
        this.optimizeButtons();
        this.handleMobileNavigation();
        this.optimizeModals();
    }

    optimizeForTablet() {
        // Tablet-specific optimizations
        this.adjustTabletLayout();
        this.optimizeTabletNavigation();
    }

    optimizeForDesktop() {
        // Desktop-specific optimizations
        this.enableHoverEffects();
        this.optimizeDesktopNavigation();
    }

    adjustFontSizes() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .btn');
        elements.forEach(element => {
            const originalSize = parseFloat(window.getComputedStyle(element).fontSize);
            if (this.viewport.width < 576) {
                element.style.fontSize = Math.max(originalSize * 0.9, 14) + 'px';
            }
        });
    }

    optimizeButtons() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (this.isMobile) {
                button.style.minHeight = '44px';
                button.style.minWidth = '44px';
                button.style.padding = '0.75rem 1rem';
            }
        });
    }

    handleMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', (e) => {
                e.preventDefault();
                navbarCollapse.classList.toggle('show');
                
                // Improve accessibility
                const isExpanded = navbarCollapse.classList.contains('show');
                navbarToggler.setAttribute('aria-expanded', isExpanded);
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    optimizeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalDialog = modal.querySelector('.modal-dialog');
            if (modalDialog && this.isMobile) {
                modalDialog.style.margin = '0.5rem';
                modalDialog.style.maxWidth = 'calc(100vw - 1rem)';
            }
        });
    }

    adjustModalSizes() {
        const modals = document.querySelectorAll('.modal-dialog');
        modals.forEach(modal => {
            if (this.viewport.width < 576) {
                modal.style.margin = '0.5rem';
                modal.style.maxWidth = 'calc(100vw - 1rem)';
            } else {
                modal.style.margin = '';
                modal.style.maxWidth = '';
            }
        });
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.style.maxWidth) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
            
            // Add loading="lazy" for performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    optimizeTouchEvents() {
        // Improve touch response
        const touchElements = document.querySelectorAll('.btn, .card, .nav-link, [data-bs-toggle]');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });

            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    }

    handleNavbarCollapse() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && this.viewport.width >= 992) {
            navbarCollapse.classList.remove('show');
        }
    }

    enableHoverEffects() {
        const hoverElements = document.querySelectorAll('.product-card, .btn, .nav-link');
        hoverElements.forEach(element => {
            element.classList.add('hover-enabled');
        });
    }

    optimizeDesktopNavigation() {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            item.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    }

    adjustTabletLayout() {
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            if (this.isTablet) {
                container.style.maxWidth = '720px';
            }
        });
    }

    optimizeTabletNavigation() {
        // Tablet-specific navigation optimizations
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.padding = '0.75rem 1rem';
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeScrolling();
        this.deferNonCriticalCSS();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('lazyloaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        const criticalCSS = [
            'css/bootstrap.min.css',
            'css/style.css',
            'css/cross-device-compatibility.css'
        ];

        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    optimizeScrolling() {
        let ticking = false;

        function updateScrollPos() {
            const scrollTop = window.pageYOffset;
            const navbar = document.querySelector('.navbar');
            const navbarContainer = document.querySelector('.container-fluid.fixed-top');
            
            if (navbar) {
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                    if (navbarContainer) {
                        navbarContainer.classList.add('scrolled');
                        // Force luxury background
                        navbarContainer.style.background = 'linear-gradient(135deg, #1a1a1a, #2c2c2c)';
                        navbarContainer.style.borderBottom = '2px solid #d4af37';
                        navbarContainer.style.boxShadow = '0 4px 20px rgba(26, 26, 26, 0.3)';
                    }
                } else {
                    navbar.classList.remove('scrolled');
                    if (navbarContainer) {
                        navbarContainer.classList.remove('scrolled');
                        // Keep luxury background
                        navbarContainer.style.background = '#1a1a1a';
                    }
                }
                
                // Remove any blue/primary classes that might be added by Bootstrap
                navbar.classList.remove('bg-primary', 'navbar-primary', 'bg-info');
                if (navbarContainer) {
                    navbarContainer.classList.remove('bg-primary', 'navbar-primary', 'bg-info');
                }
            }
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPos);
                ticking = true;
            }
        }, { passive: true });
    }

    deferNonCriticalCSS() {
        const nonCriticalCSS = document.querySelectorAll('link[data-defer]');
        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addSkipLinks();
        this.enhanceFocusManagement();
        this.improveKeyboardNavigation();
        this.addAriaLabels();
        this.handleReducedMotion();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceFocusManagement() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('focused');
            });

            element.addEventListener('blur', function() {
                this.classList.remove('focused');
            });
        });
    }

    improveKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close modals and dropdowns
                const openModals = document.querySelectorAll('.modal.show');
                openModals.forEach(modal => {
                    const closeBtn = modal.querySelector('[data-bs-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                });

                const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
    }

    addAriaLabels() {
        // Add missing ARIA labels
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        links.forEach(link => {
            if (!link.textContent.trim() && link.querySelector('img')) {
                const img = link.querySelector('img');
                if (img.alt) {
                    link.setAttribute('aria-label', img.alt);
                }
            }
        });
    }

    handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
    }
}

// ===== FORM ENHANCEMENTS =====
class FormEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.preventZoomOnFocus();
        this.addFormValidation();
        this.improveFormAccessibility();
    }

    preventZoomOnFocus() {
        // Prevent zoom on iOS when focusing inputs
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (parseFloat(window.getComputedStyle(input).fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }
    }

    addFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showValidationErrors(form);
                }
                form.classList.add('was-validated');
            });
        });
    }

    showValidationErrors(form) {
        const invalidInputs = form.querySelectorAll(':invalid');
        if (invalidInputs.length > 0) {
            invalidInputs[0].focus();
            invalidInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    improveFormAccessibility() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Add required attribute visual indicator
            if (input.hasAttribute('required')) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label && !label.querySelector('.required-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'required-indicator';
                    indicator.textContent = ' *';
                    indicator.setAttribute('aria-label', 'required');
                    label.appendChild(indicator);
                }
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all enhancements
    new DeviceCompatibility();
    new PerformanceEnhancer();
    new AccessibilityEnhancer();
    new FormEnhancer();

    // Add custom CSS for enhanced interactions
    const style = document.createElement('style');
    style.textContent = `
        .touch-active {
            opacity: 0.7;
            transform: scale(0.98);
        }
        
        .focused {
            outline: 2px solid #d4af37 !important;
            outline-offset: 2px !important;
        }
        
        .navbar.scrolled {
            background: linear-gradient(135deg, #1a1a1a, #2c2c2c) !important;
            backdrop-filter: blur(10px);
            border-bottom: 2px solid #d4af37;
            box-shadow: 0 4px 20px rgba(26, 26, 26, 0.3);
        }
        
        .required-indicator {
            color: #dc3545;
            font-weight: bold;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        .lazyload {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazyloaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// ===== WINDOW LOAD OPTIMIZATIONS =====
window.addEventListener('load', () => {
    // Remove loading states
    const spinners = document.querySelectorAll('#spinner, .spinner, .loading');
    spinners.forEach(spinner => {
        spinner.style.display = 'none';
    });

    // Optimize images after page load
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete && img.naturalHeight === 0) {
            img.style.display = 'none';
        }
    });
});

// ===== NAVBAR-SPECIFIC BLUE PREVENTION =====
// Hanya memantau navbar untuk mencegah warna biru, tidak semua elemen
const navbarBlueMonitor = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
            const target = mutation.target;
            
            // Only monitor navbar and its container
            if (target.classList.contains('navbar') || 
                target.classList.contains('container-fluid') ||
                target.closest('.navbar') ||
                target.closest('.container-fluid.fixed-top')) {
                
                // Remove blue classes only from navbar elements
                if (target.classList) {
                    const blueClasses = ['bg-primary', 'navbar-primary', 'bg-info'];
                    blueClasses.forEach(className => {
                        if (target.classList.contains(className)) {
                            target.classList.remove(className);
                        }
                    });
                }
            }
        }
    });
});

// Monitor only navbar and its container for changes
const navbarContainer = document.querySelector('.container-fluid.fixed-top');
const navbar = document.querySelector('.navbar');

if (navbarContainer) {
    navbarBlueMonitor.observe(navbarContainer, { 
        attributes: true, 
        attributeFilter: ['class', 'style'],
        subtree: false 
    });
}

if (navbar) {
    navbarBlueMonitor.observe(navbar, { 
        attributes: true, 
        attributeFilter: ['class', 'style'],
        subtree: false 
    });
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.MaisonDuCroissant = {
    DeviceCompatibility,
    PerformanceEnhancer,
    AccessibilityEnhancer,
    FormEnhancer
};
