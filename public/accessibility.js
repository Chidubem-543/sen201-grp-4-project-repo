// Accessibility Features JavaScript
// Text-to-Speech, Font Size Controls, High Contrast Mode

(function() {
    'use strict';

    // Text-to-Speech using Web Speech API
    let ttsEnabled = false;
    let speechSynthesis = window.speechSynthesis;
    let currentUtterance = null;

    // Check if browser supports Web Speech API
    if (!('speechSynthesis' in window)) {
        console.warn('Text-to-Speech not supported in this browser');
        document.getElementById('tts-toggle').disabled = true;
    }

    // TTS Toggle
    const ttsToggle = document.getElementById('tts-toggle');
    ttsToggle.addEventListener('click', function() {
        ttsEnabled = !ttsEnabled;
        this.setAttribute('aria-pressed', ttsEnabled);
        
        if (!ttsEnabled) {
            speechSynthesis.cancel();
            announceToScreenReader('Text-to-speech disabled');
        } else {
            announceToScreenReader('Text-to-speech enabled. Click on any text to hear it read aloud.');
        }
        
        // Save preference
        localStorage.setItem('ttsEnabled', ttsEnabled);
    });

    // Read text aloud when clicked (if TTS is enabled)
    document.addEventListener('click', function(e) {
        if (!ttsEnabled) return;
        
        const target = e.target;
        
        // Check if clicked element has tts-content class or is inside one
        const ttsElement = target.classList.contains('tts-content') 
            ? target 
            : target.closest('.tts-content');
        
        if (ttsElement) {
            e.preventDefault();
            const text = ttsElement.textContent.trim();
            speakText(text);
        }
    });

    function speakText(text) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        if (text) {
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.rate = 1.0;
            currentUtterance.pitch = 1.0;
            currentUtterance.volume = 1.0;
            
            // Announce to screen readers that speech is starting
            currentUtterance.onstart = function() {
                announceToScreenReader('Reading text');
            };
            
            currentUtterance.onend = function() {
                announceToScreenReader('Finished reading');
            };
            
            speechSynthesis.speak(currentUtterance);
        }
    }

    // Font Size Controls
    let currentFontSize = 'normal'; // normal, large, small
    
    document.getElementById('font-size-increase').addEventListener('click', function() {
        document.body.classList.remove('font-size-small', 'font-size-large');
        document.body.classList.add('font-size-large');
        currentFontSize = 'large';
        localStorage.setItem('fontSize', currentFontSize);
        announceToScreenReader('Font size increased');
    });

    document.getElementById('font-size-decrease').addEventListener('click', function() {
        document.body.classList.remove('font-size-small', 'font-size-large');
        document.body.classList.add('font-size-small');
        currentFontSize = 'small';
        localStorage.setItem('fontSize', currentFontSize);
        announceToScreenReader('Font size decreased');
    });

    // High Contrast Mode
    let highContrastEnabled = false;
    
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    highContrastToggle.addEventListener('click', function() {
        highContrastEnabled = !highContrastEnabled;
        this.setAttribute('aria-pressed', highContrastEnabled);
        
        if (highContrastEnabled) {
            document.body.classList.add('high-contrast');
            announceToScreenReader('High contrast mode enabled');
        } else {
            document.body.classList.remove('high-contrast');
            announceToScreenReader('High contrast mode disabled');
        }
        
        localStorage.setItem('highContrast', highContrastEnabled);
    });

    // Announce to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Load saved preferences on page load
    function loadPreferences() {
        // Load TTS preference
        const savedTTS = localStorage.getItem('ttsEnabled');
        if (savedTTS === 'true') {
            ttsEnabled = true;
            ttsToggle.setAttribute('aria-pressed', 'true');
        }
        
        // Load font size preference
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize === 'large') {
            document.body.classList.add('font-size-large');
        } else if (savedFontSize === 'small') {
            document.body.classList.add('font-size-small');
        }
        
        // Load high contrast preference
        const savedHighContrast = localStorage.getItem('highContrast');
        if (savedHighContrast === 'true') {
            highContrastEnabled = true;
            document.body.classList.add('high-contrast');
            highContrastToggle.setAttribute('aria-pressed', 'true');
        }
    }

    // Initialize on page load
    loadPreferences();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Plus: Increase font size
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
            e.preventDefault();
            document.getElementById('font-size-increase').click();
        }
        
        // Ctrl/Cmd + Minus: Decrease font size
        if ((e.ctrlKey || e.metaKey) && e.key === '-') {
            e.preventDefault();
            document.getElementById('font-size-decrease').click();
        }
        
        // Ctrl/Cmd + T: Toggle TTS
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            ttsToggle.click();
        }
        
        // Ctrl/Cmd + H: Toggle High Contrast
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            highContrastToggle.click();
        }
    });

    // Focus management - ensure skip link works
    document.querySelector('.skip-link').addEventListener('click', function(e) {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        mainContent.focus();
    });

})();
