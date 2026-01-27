const coolButton = document.querySelector('.cool-button');
const rainContainer = document.querySelector('.rain-container');

let clickCount = 0;
let clickTimer = null;
let weatherType = 'rain'; // rain, snow, thunder

coolButton.addEventListener('click', () => {
    clickCount++;
    
    // Reset timer
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        clickCount = 0;
        weatherType = 'rain';
        coolButton.textContent = 'Cool down';
    }, 2000); // Reset after 2 seconds of no clicks
    
    // Update weather type based on click count
    if (clickCount >= 20) {
        weatherType = 'thunder';
        coolButton.textContent = '⚡ Thunderstorm!';
    } else if (clickCount >= 10) {
        weatherType = 'snow';
        coolButton.textContent = '❄️ Snowflakes!';
    } else {
        weatherType = 'rain';
        coolButton.textContent = 'Cool down';
    }
    
    makeItRain();
});

function makeItRain() {
    const duration = 3000; // 3 seconds
    const dropCount = weatherType === 'thunder' ? 80 : 50;
    
    // Create precipitation
    for (let i = 0; i < dropCount; i++) {
        setTimeout(() => {
            if (weatherType === 'snow') {
                createSnowflake();
            } else if (weatherType === 'thunder') {
                createThunderstorm();
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

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    
    // Random horizontal position
    const leftPosition = Math.random() * 100;
    snowflake.style.left = leftPosition + '%';
    
    // Random animation duration for variety
    const fallDuration = 2 + Math.random() * 2;
    snowflake.style.animationDuration = fallDuration + 's';
    
    // Random size
    const size = 10 + Math.random() * 10;
    snowflake.style.fontSize = size + 'px';
    
    rainContainer.appendChild(snowflake);
    
    // Remove the snowflake after animation completes
    setTimeout(() => {
        snowflake.remove();
    }, fallDuration * 1000);
}

function createThunderstorm() {
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    
    // Random horizontal position
    const leftPosition = Math.random() * 100;
    lightning.style.left = leftPosition + '%';
    
    // Random animation duration for variety
    const fallDuration = 0.3 + Math.random() * 0.3;
    lightning.style.animationDuration = fallDuration + 's';
    
    rainContainer.appendChild(lightning);
    
    // Add flash effect
    if (Math.random() > 0.7) {
        document.body.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            document.body.style.filter = 'brightness(1)';
        }, 100);
    }
    
    // Remove the lightning after animation completes
    setTimeout(() => {
        lightning.remove();
    }, fallDuration * 1000);
}
