document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if (burger) {
        burger.addEventListener('click', function() {
            // Toggle navigation menu
            navLinks.classList.toggle('active');
            
            // Animate burger menu
            burger.classList.toggle('toggle');
            
            const lines = burger.querySelectorAll('div');
            if (burger.classList.contains('toggle')) {
                lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                burger.classList.remove('toggle');
                
                const lines = burger.querySelectorAll('div');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    });
    
    // Shrink navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Account for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 90;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    });
    
    // Form validation
    const hashForm = document.querySelector('.hash-form');
    if (hashForm) {
        hashForm.addEventListener('submit', function(e) {
            const nameInput = document.querySelector('#name');
            const passwordInput = document.querySelector('#password');
            
            if (!nameInput.value.trim() || !passwordInput.value.trim()) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Copy to clipboard functionality
    const copyButton = document.querySelector('#copy-button');
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const hashValue = document.querySelector('#hash-value').textContent;
            navigator.clipboard.writeText(hashValue).then(() => {
                const message = document.querySelector('#copied-message');
                message.style.opacity = '1';
                setTimeout(() => {
                    message.style.opacity = '0';
                }, 2000);
            });
        });
    }

    // Add animations to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.algorithm-card, .about-content, .contact-content');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.animation = 'fadeIn 1s forwards';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    // Run once on load
    animateOnScroll();

    // Hero section animation
    const heroContent = document.querySelector('.hero-content');
    heroContent.classList.add('animated', 'fadeIn');
});

function copyToClipboard() {
    const hashText = document.getElementById('hashText');
    const textArea = document.createElement('textarea');
    textArea.value = hashText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    const copiedMessage = document.querySelector('.copied-message');
    copiedMessage.style.opacity = '1';
    setTimeout(() => {
        copiedMessage.style.opacity = '0';
    }, 2000);
}