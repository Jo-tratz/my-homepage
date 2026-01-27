const coolButton = document.querySelector('.cool-button');
const rainContainer = document.querySelector('.rain-container');

coolButton.addEventListener('click', () => {
    makeItRain();
});

function makeItRain() {
    const duration = 3000; // 3 seconds
    const dropCount = 50;
    
    // Create raindrops
    for (let i = 0; i < dropCount; i++) {
        setTimeout(() => {
            createRaindrop();
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
