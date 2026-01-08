document.addEventListener("DOMContentLoaded", () => {
    
    // Select all links on the page
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.href;
            
            // SECURITY CHECKS:
            // 1. Ignore links that open in new tab
            if (link.target === '_blank') return;
            
            // 2. Ignore links to sections on the same page (e.g., href="#")
            if (targetUrl.includes('#') || targetUrl === window.location.href) return;

            // 3. Ignore external links (optional, if you only want this for your site)
            if (link.hostname !== window.location.hostname) return;

            // THE MAGIC: Prevent immediate navigation
            e.preventDefault();

            // 1. Add the class that triggers the CSS animation (Blue slides down)
            document.body.classList.add('exiting');

            // 2. Wait for animation to finish (500ms), then change page
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500); // This 500 must match the CSS animation duration (0.5s)
        });
    });
});