const coolButton = document.querySelector('.cool-button');
const rainContainer = document.querySelector('.rain-container');

let clickCount = 0;
let clickTimer = null;
let weatherType = 'rain'; // rain, sunshine, rainbow
let rainbowShown = false;

coolButton.addEventListener('click', () => {
    clickCount++;
    
    // Reset timer
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        clickCount = 0;
        weatherType = 'rain';
        rainbowShown = false;
        coolButton.textContent = 'Cool down';
    }, 2000); // Reset after 2 seconds of no clicks
    
    // Update weather type based on click count
    if (clickCount >= 20) {
        weatherType = 'rainbow';
        coolButton.textContent = '🌈 Rainbow!';
    } else if (clickCount >= 10) {
        weatherType = 'sunshine';
        rainbowShown = false;
        coolButton.textContent = '☀️ Sunshine!';
    } else {
        weatherType = 'rain';
        rainbowShown = false;
        coolButton.textContent = 'Cool down';
    }
    
    makeItRain();
});

function makeItRain() {
    const duration = 3000; // 3 seconds
    
    if (weatherType === 'rainbow') {
        if (!rainbowShown) {
            createRainbow();
            rainbowShown = true;
        }
        return;
    }
    
    const dropCount = 50;
    
    // Create precipitation
    for (let i = 0; i < dropCount; i++) {
        setTimeout(() => {
            if (weatherType === 'sunshine') {
                createSunshine();
            } else {
                createRaindrop();
            }
        }, i * 60); // Stagger the drops
    }
}

function createRaindrop() {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    
    // Random horizontal position
    const leftPosition = Math.random() * 100;
    drop.style.left = leftPosition + '%';
    
    // Random animation duration for variety
    const fallDuration = 0.5 + Math.random() * 0.5;
    drop.style.animationDuration = fallDuration + 's';
    
    rainContainer.appendChild(drop);
    
    // Remove the drop after animation completes
    setTimeout(() => {
        drop.remove();
    }, fallDuration * 1000);
}

function createSunshine() {
    const sunbeam = document.createElement('div');
    sunbeam.className = 'sunbeam';
    
    // Random horizontal position
    const leftPosition = Math.random() * 100;
    sunbeam.style.left = leftPosition + '%';
    
    // Random animation duration for variety
    const fallDuration = 1.5 + Math.random() * 1.5;
    sunbeam.style.animationDuration = fallDuration + 's';
    
    // Random width and rotation for variety
    const width = 3 + Math.random() * 5;
    sunbeam.style.width = width + 'px';
    
    const rotation = -10 + Math.random() * 20;
    sunbeam.style.transform = `rotate(${rotation}deg)`;
    
    rainContainer.appendChild(sunbeam);
    
    // Remove the sunbeam after animation completes
    setTimeout(() => {
        sunbeam.remove();
    }, fallDuration * 1000);
}

function createRainbow() {
    const rainbow = document.createElement('div');
    rainbow.className = 'rainbow';
    
    rainContainer.appendChild(rainbow);
    
    // Create sparkles along the rainbow
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 150);
    }
    
    // Remove the rainbow after animation completes
    setTimeout(() => {
        rainbow.remove();
    }, 3500);
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random position along the top arc of the rainbow inside the circle
    const angle = Math.random() * 180; // 0 to 180 degrees
    const radius = 120; // Distance from center, adjusted for inside circle
    const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
    const y = Math.sin((angle - 90) * Math.PI / 180) * radius + 30;
    
    sparkle.style.left = `calc(50% + ${x}px)`;
    sparkle.style.top = `${y + 150}px`;
    
    rainContainer.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}
