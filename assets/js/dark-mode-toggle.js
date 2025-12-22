// Dark Mode Toggle
(function () {
    'use strict';

    const STORAGE_KEY = 'k8s-dark-mode';

    
    function initDarkMode() {
        const storedPreference = localStorage.getItem(STORAGE_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedPreference === 'dark') {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        } else if (storedPreference === 'light') {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        } else if (systemPrefersDark) {
            // No stored preference, but system prefers dark - let CSS media query handle it
            document.documentElement.classList.remove('dark-mode', 'light-mode');
        }
    }

    function toggleDarkMode() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark-mode') ||
            (!html.classList.contains('light-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            // Currently dark, switch to light
            html.classList.remove('dark-mode');
            html.classList.add('light-mode');
            localStorage.setItem(STORAGE_KEY, 'light');
            updateToggleButton(false);
        } else {
            // Currently light, switch to dark
            html.classList.add('dark-mode');
            html.classList.remove('light-mode');
            localStorage.setItem(STORAGE_KEY, 'dark');
            updateToggleButton(true);
        }
    }

    function updateToggleButton(isDark) {
        const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
        toggleButtons.forEach(function(toggleBtn) {
            const sunIcon = toggleBtn.querySelector('.sun-icon');
            const moonIcon = toggleBtn.querySelector('.moon-icon');

            if (isDark) {
                if (sunIcon) sunIcon.style.display = 'inline-block';
                if (moonIcon) moonIcon.style.display = 'none';
                toggleBtn.setAttribute('aria-label', 'Switch to light mode');
                toggleBtn.setAttribute('title', 'Switch to light mode');
            } else {
                if (sunIcon) sunIcon.style.display = 'none';
                if (moonIcon) moonIcon.style.display = 'inline-block';
                toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
                toggleBtn.setAttribute('title', 'Switch to dark mode');
            }
        });
    }

    // Initialize on page load
    initDarkMode();

    document.addEventListener('DOMContentLoaded', function () {
        const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
        toggleButtons.forEach(function(toggleBtn) {
            toggleBtn.addEventListener('click', toggleDarkMode);
        });
        
        if (toggleButtons.length > 0) {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark-mode') ||
                (!html.classList.contains('light-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
            updateToggleButton(isDark);
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (localStorage.getItem(STORAGE_KEY) === null) {
                if (e.matches) {
                    document.documentElement.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                }
                updateToggleButton(e.matches);
            }
        });
    });

    window.toggleDarkMode = toggleDarkMode;
})();
