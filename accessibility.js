(function () {
    // 1. Initialize State
    let fontSize = 100; // percentage

    // 2. Create the HTML Elements
    const container = document.createElement("div");
    const increaseBtn = document.createElement("button");
    const decreaseBtn = document.createElement("button");

    // 3. Set Text and Attributes
    increaseBtn.textContent = "+A";
    increaseBtn.setAttribute("aria-label", "Increase Font Size");

    decreaseBtn.textContent = "-A";
    decreaseBtn.setAttribute("aria-label", "Decrease Font Size");

    // 4. Style the Elements (Basic "Floating Widget" Styles)
    // You can move this to a CSS file if you prefer
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "1000";
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";

    const btnStyle = "font-size: 16px; padding: 8px 12px; cursor: pointer; font-weight: bold; border: 1px solid #ccc; border-radius: 4px; background: #fff;";
    increaseBtn.style.cssText = btnStyle;
    decreaseBtn.style.cssText = btnStyle;

    // 5. Add Event Listeners (Your Logic)
    const updateFontSize = () => {
        document.documentElement.style.setProperty("--base-font-size", fontSize + "%");
    };

    increaseBtn.addEventListener("click", () => {
        fontSize += 10;
        if (fontSize > 150) fontSize = 150; // Max limit
        updateFontSize();
    });

    decreaseBtn.addEventListener("click", () => {
        fontSize -= 10;
        if (fontSize < 50) fontSize = 50; // Min limit
        updateFontSize();
    });

    // 6. Assemble and Inject into DOM
    container.appendChild(decreaseBtn);
    container.appendChild(increaseBtn);
    document.body.appendChild(container);

    // Initialize logic immediately
    updateFontSize();
})();