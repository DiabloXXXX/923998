/**
 * Enhanced Cross-Device Compatibility JavaScript
 * Maison du Croissant - Website Enhancement
 * Version 2.0 - Comprehensive Device Support
 */

// ===== DEVICE DETECTION & INITIALIZATION =====
class DeviceCompatibility {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.isTouch = this.detectTouch();
        this.isIOS = this.detectIOS();
        this.isAndroid = this.detectAndroid();
        this.isSafari = this.detectSafari();
        this.viewport = this.getViewport();
        
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth <= 768;
    }

    detectTablet() {
        return /iPad|Android|Silk|Kindle/i.test(navigator.userAgent) 
               && (window.innerWidth >= 768 && window.innerWidth <= 1024);
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    detectAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    detectSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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
        this.fixViewportIssues();
        this.optimizeTouch();
        this.enhanceAccessibility();
        this.improvePerformance();
    }

    addDeviceClasses() {
        const body = document.body;
        
        // Device type classes
        if (this.isMobile) body.classList.add('is-mobile');
        if (this.isTablet) body.classList.add('is-tablet');
        if (this.isTouch) body.classList.add('is-touch');
        if (this.isIOS) body.classList.add('is-ios');
        if (this.isAndroid) body.classList.add('is-android');
        if (this.isSafari) body.classList.add('is-safari');
        
        // Screen size classes
        const width = this.viewport.width;
        if (width < 576) body.classList.add('screen-xs');
        else if (width < 768) body.classList.add('screen-sm');
        else if (width < 992) body.classList.add('screen-md');
        else if (width < 1200) body.classList.add('screen-lg');
        else body.classList.add('screen-xl');
    }

    setupEventListeners() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Keyboard handling for mobile
        if (this.isMobile) {
            this.setupKeyboardHandling();
        }
    }

    handleResize() {
        this.viewport = this.getViewport();
        this.updateDeviceClasses();
        this.adjustLayoutForResize();
    }

    updateDeviceClasses() {
        const body = document.body;
        
        // Remove old screen size classes
        body.classList.remove('screen-xs', 'screen-sm', 'screen-md', 'screen-lg', 'screen-xl');
        
        // Add new screen size classes
        const width = this.viewport.width;
        if (width < 576) body.classList.add('screen-xs');
        else if (width < 768) body.classList.add('screen-sm');
        else if (width < 992) body.classList.add('screen-md');
        else if (width < 1200) body.classList.add('screen-lg');
        else body.classList.add('screen-xl');
    }

    adjustLayoutForResize() {
        // Adjust modals
        this.adjustModals();
        
        // Adjust tables
        this.adjustTables();
        
        // Adjust navigation
        this.adjustNavigation();
        
        // Adjust cards
        this.adjustCards();
    }

    optimizeForDevice() {
        if (this.isMobile) {
            this.optimizeForMobile();
        }
        
        if (this.isTablet) {
            this.optimizeForTablet();
        }
        
        if (this.isTouch) {
            this.optimizeForTouch();
        }
    }

    optimizeForMobile() {
        // Improve tap targets
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (btn.offsetHeight < 44) {
                btn.style.minHeight = '44px';
            }
        });

        // Optimize forms
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.fontSize = '16px'; // Prevent zoom on iOS
            input.addEventListener('focus', this.handleInputFocus.bind(this));
            input.addEventListener('blur', this.handleInputBlur.bind(this));
        });

        // Optimize navigation
        this.optimizeMobileNavigation();
    }

    optimizeForTablet() {
        // Tablet-specific optimizations
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.maxWidth = '350px';
        });
    }

    optimizeForTouch() {
        // Prevent 300ms tap delay
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Improve touch scrolling
        document.addEventListener('touchmove', function() {}, { passive: true });
        
        // Add touch-friendly hover effects
        this.setupTouchHover();
    }

    setupTouchHover() {
        const hoverElements = document.querySelectorAll('[data-hover]');
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-hover');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-hover');
                }, 300);
            });
        });
    }

    setupResponsiveImages() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('loading');
            });
        }

        // Responsive image sizing
        const responsiveImages = document.querySelectorAll('img');
        responsiveImages.forEach(img => {
            if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });
    }

    handleOrientationChange() {
        // Force repaint after orientation change
        setTimeout(() => {
            const body = document.body;
            body.style.display = 'none';
            body.offsetHeight; // Trigger reflow
            body.style.display = '';
            
            // Update viewport
            this.viewport = this.getViewport();
            this.updateDeviceClasses();
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('orientationchange-complete'));
        }, 100);
    }

    fixViewportIssues() {
        // Fix iOS viewport bug
        if (this.isIOS) {
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                viewportMeta.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no');
            }
        }

        // Fix Android viewport scaling
        if (this.isAndroid) {
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                viewportMeta.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no');
            }
        }

        // Prevent horizontal scroll
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
    }

    optimizeTouch() {
        // Improve touch feedback
        const touchElements = document.querySelectorAll('.btn, .card, .nav-link');
        touchElements.forEach(element => {
            element.style.webkitTapHighlightColor = 'rgba(212, 175, 55, 0.3)';
            element.style.touchAction = 'manipulation';
        });

        // Prevent touch callouts on iOS
        if (this.isIOS) {
            document.addEventListener('touchstart', function(e) {
                if (e.target.matches('.btn, .nav-link')) {
                    e.target.style.webkitTouchCallout = 'none';
                }
            });
        }
    }

    enhanceAccessibility() {
        // Add ARIA labels for screen readers
        const buttons = document.querySelectorAll('.btn:not([aria-label])');
        buttons.forEach(btn => {
            if (btn.textContent.trim()) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });

        // Improve focus management
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid #d4af37';
                this.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });

        // Add skip links for keyboard navigation
        this.addSkipLinks();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #d4af37;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    improvePerformance() {
        // Optimize scroll performance
        let scrolling = false;
        window.addEventListener('scroll', () => {
            if (!scrolling) {
                document.body.classList.add('scrolling');
                scrolling = true;
            }
            
            clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => {
                document.body.classList.remove('scrolling');
                scrolling = false;
            }, 150);
        }, { passive: true });

        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize animations for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = ['css/luxury-theme.css', 'css/bootstrap.min.css'];
        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    setupKeyboardHandling() {
        let initialHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDiff = initialHeight - currentHeight;
            
            if (heightDiff > 150) {
                // Keyboard is probably open
                document.body.classList.add('keyboard-open');
                this.handleKeyboardOpen();
            } else {
                // Keyboard is probably closed
                document.body.classList.remove('keyboard-open');
                this.handleKeyboardClose();
                initialHeight = currentHeight;
            }
        });
    }

    handleKeyboardOpen() {
        // Adjust layout when keyboard opens
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT') {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    handleKeyboardClose() {
        // Reset layout when keyboard closes
        window.scrollTo(0, 0);
    }

    handleInputFocus(event) {
        const input = event.target;
        
        // Prevent zoom on iOS
        if (this.isIOS && input.type !== 'file') {
            input.style.fontSize = '16px';
        }
        
        // Scroll input into view
        setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    handleInputBlur(event) {
        const input = event.target;
        
        // Reset font size
        if (this.isIOS) {
            input.style.fontSize = '';
        }
    }

    optimizeMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbar && navbarToggler && navbarCollapse) {
            // Close navbar when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });

            // Close navbar when clicking on nav links
            const navLinks = navbarCollapse.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show')) {
                        setTimeout(() => navbarToggler.click(), 150);
                    }
                });
            });

            // Improve touch targets
            navbarToggler.style.minHeight = '44px';
            navbarToggler.style.minWidth = '44px';
        }
    }

    adjustModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalDialog = modal.querySelector('.modal-dialog');
            if (modalDialog) {
                if (this.viewport.width < 576) {
                    modalDialog.style.margin = '0.5rem';
                    modalDialog.style.maxWidth = 'calc(100vw - 1rem)';
                } else {
                    modalDialog.style.margin = '';
                    modalDialog.style.maxWidth = '';
                }
            }
        });
    }

    adjustTables() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    adjustNavigation() {
        // Dynamic navigation adjustments based on screen size
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (this.viewport.width < 768) {
                navbar.classList.add('navbar-mobile');
            } else {
                navbar.classList.remove('navbar-mobile');
            }
        }
    }

    adjustCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardImg = card.querySelector('.card-img-top');
            if (cardImg) {
                if (this.viewport.width < 576) {
                    cardImg.style.height = '180px';
                } else if (this.viewport.width < 768) {
                    cardImg.style.height = '200px';
                } else if (this.viewport.width < 992) {
                    cardImg.style.height = '220px';
                } else {
                    cardImg.style.height = '240px';
                }
            }
        });
    }

    // Public API
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isTouch: this.isTouch,
            isIOS: this.isIOS,
            isAndroid: this.isAndroid,
            isSafari: this.isSafari,
            viewport: this.viewport
        };
    }

    refresh() {
        this.viewport = this.getViewport();
        this.updateDeviceClasses();
        this.adjustLayoutForResize();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize device compatibility
    window.deviceCompatibility = new DeviceCompatibility();
    
    // Log device info for debugging
    console.log('Device Compatibility Initialized:', window.deviceCompatibility.getDeviceInfo());
    
    // Add global utility functions
    window.isMobile = () => window.deviceCompatibility.isMobile;
    window.isTablet = () => window.deviceCompatibility.isTablet;
    window.isTouch = () => window.deviceCompatibility.isTouch;
    
    // Expose refresh function
    window.refreshDeviceCompatibility = () => window.deviceCompatibility.refresh();
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== CSS FIXES FOR CROSS-DEVICE COMPATIBILITY =====
const crossDeviceCSS = `
    /* Additional CSS for cross-device compatibility */
    .keyboard-open .modal-dialog {
        margin: 0.25rem !important;
    }
    
    .scrolling * {
        pointer-events: none;
    }
    
    .resizing * {
        transition: none !important;
    }
    
    .touch-hover {
        opacity: 0.8;
        transform: scale(0.98);
    }
    
    .navbar-mobile .navbar-nav {
        text-align: center;
    }
    
    .navbar-mobile .nav-link {
        padding: 1rem 0.5rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    @media (max-width: 575.98px) {
        .table-responsive {
            font-size: 0.875rem;
        }
        
        .modal-footer {
            flex-direction: column;
        }
        
        .modal-footer .btn {
            width: 100%;
            margin-bottom: 0.5rem;
        }
        
        .card-columns {
            column-count: 1;
        }
    }
    
    @media (max-width: 767.98px) {
        .d-md-block {
            display: none !important;
        }
        
        .d-md-none {
            display: block !important;
        }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = crossDeviceCSS;
document.head.appendChild(style);

// ===== EXPORT FOR MODULE SYSTEMS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceCompatibility;
}

// ===== END OF CROSS-DEVICE COMPATIBILITY =====
