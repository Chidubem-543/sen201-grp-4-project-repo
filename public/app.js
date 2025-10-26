// Main Application JavaScript

(function() {
    'use strict';

    // Contact Form Handling
    const contactForm = document.querySelector('form[action="/api/contact"]');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formStatus = document.getElementById('form-status');
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Success
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.classList.remove('visually-hidden');
                    formStatus.style.color = 'green';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formStatus.classList.add('visually-hidden');
                    }, 5000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Error
                formStatus.textContent = 'Sorry, there was an error sending your message. Please try again.';
                formStatus.classList.remove('visually-hidden');
                formStatus.style.color = 'red';
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Set focus for keyboard users
                target.focus();
            }
        });
    });

    // Update current page indicator in navigation
    function updateNavigation() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            const href = link.getAttribute('href').substring(1);
            
            if (href === currentSection || (!currentSection && href === 'main-content')) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // Update navigation on scroll
    window.addEventListener('scroll', updateNavigation);
    
    // Initial navigation update
    updateNavigation();

})();
