// DOM Elements
const homeScreen = document.getElementById('homeScreen');
const calculationScreen = document.getElementById('calculationScreen');
const loadingScreen = document.getElementById('loadingScreen');
const resultScreen = document.getElementById('resultScreen');
const calculateBtn = document.getElementById('calculateBtn');
const restartBtn = document.getElementById('restartBtn');
const shareBtn = document.getElementById('shareBtn');
const name1Input = document.getElementById('name1');
const name2Input = document.getElementById('name2');
const errorMsg = document.getElementById('errorMsg');
const loadingText = document.getElementById('loadingText');
const namesDisplay = document.getElementById('namesDisplay');
const resultText = document.getElementById('resultText');
const resultIcon = document.getElementById('resultIcon');
const resultMessage = document.getElementById('resultMessage');
const resultQuote = document.getElementById('resultQuote');
const compatibilityFill = document.getElementById('compatibilityFill');
const compatibilityPercent = document.getElementById('compatibilityPercent');
const particlesContainer = document.getElementById('particles');
const floatingEmojisContainer = document.getElementById('floatingEmojis');

// New DOM elements
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Calculation screen elements
const name1Letters = document.getElementById('name1Letters');
const name2Letters = document.getElementById('name2Letters');
const matchCounter = document.getElementById('matchCounter');
const remainingLetters = document.getElementById('remainingLetters');
const countDisplay = document.getElementById('countDisplay');
const flamesCircle = document.getElementById('flamesCircle');
const eliminationInfo = document.getElementById('eliminationInfo');
const currentCount = document.getElementById('currentCount');
const totalCount = document.getElementById('totalCount');
const finalLetterReveal = document.getElementById('finalLetterReveal');
const calcProgressFill = document.getElementById('calcProgressFill');
const calcStageText = document.getElementById('calcStageText');

// FLAMES Data
const flamesData = {
    F: {
        full: 'FRIENDS',
        icon: '🤝',
        color: '#9d4edd',
        compatibility: 75,
        message: "Your connection is built on trust, laughter, and mutual respect. You're each other's confidant and support system. A beautiful friendship that stands the test of time.",
        quote: "True friendship is a plant of slow growth, and must undergo the shocks of adversity before it is entitled to the appellation."
    },
    L: {
        full: 'LOVERS',
        icon: '💖',
        color: '#c77dff',
        compatibility: 95,
        message: "Your hearts beat in perfect harmony. There's an undeniable chemistry and deep emotional connection between you. Love is in the air, and destiny has brought you together.",
        quote: "Love is not just looking at each other, it's looking in the same direction together."
    },
    A: {
        full: 'AFFECTION',
        icon: '💕',
        color: '#b185db',
        compatibility: 85,
        message: "There's genuine care and warmth between you two. You share a tender bond filled with sweet moments and emotional intimacy. Your connection brings comfort and joy to each other's lives.",
        quote: "Affection is responsible for nine-tenths of whatever solid and durable happiness there is in our lives."
    },
    M: {
        full: 'MARRIAGE',
        icon: '💍',
        color: '#d8b4fe',
        compatibility: 90,
        message: "Your souls are meant to unite! You complement each other perfectly and share a vision for the future. This bond has the potential to last a lifetime, built on love, trust, and commitment.",
        quote: "A successful marriage requires falling in love many times, always with the same person."
    },
    E: {
        full: 'ENEMIES',
        icon: '⚡',
        color: '#7209b7',
        compatibility: 30,
        message: "Your energies clash and create friction. Different perspectives and approaches lead to conflicts. However, sometimes the strongest bonds form after overcoming challenges together.",
        quote: "Keep your friends close, and your enemies closer. Understanding leads to growth."
    },
    S: {
        full: 'SIBLINGS',
        icon: '👫',
        color: '#a29bfe',
        compatibility: 80,
        message: "You share a bond like family - protective, caring, and full of playful banter. You understand each other's quirks and are always there through thick and thin. A beautiful platonic connection.",
        quote: "Siblings: your only enemy you can't live without."
    }
};

// State
let soundEnabled = true;
let calculationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupEventListeners();
    loadHistory();

    
    if ('vibrate' in navigator) {
        window.hasHapticSupport = true;
    }
});

// Create particle background
function createParticles() {
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
    
    // Create falling stars
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        const sizes = ['small', 'medium', 'large'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        star.className = `star ${randomSize}`;
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 8 + 's';
        star.style.animationDuration = (Math.random() * 6 + 8) + 's';
        particlesContainer.appendChild(star);
    }
}

// Setup event listeners
function setupEventListeners() {
    calculateBtn.addEventListener('click', startCalculation);
    restartBtn.addEventListener('click', restart);
    shareBtn.addEventListener('click', shareResult);
    
    closeHistory.addEventListener('click', hideHistory);
    clearHistoryBtn.addEventListener('click', clearHistory);
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) hideHistory();
    });
    
    name1Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') name2Input.focus();
    });
    
    name2Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startCalculation();
    });
    
    name1Input.addEventListener('input', () => hideError());
    name2Input.addEventListener('input', () => hideError());
}

// Validate inputs
function validateInputs() {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    
    if (!name1 || !name2) {
        showError('Please enter both names! 💫');
        return false;
    }
    
    if (name1.length < 2 || name2.length < 2) {
        showError('Names must be at least 2 characters long! ✨');
        return false;
    }
    
    if (name1.toLowerCase() === name2.toLowerCase()) {
        showError('Please enter two different names! 💕');
        return false;
    }
    
    return true;
}

// Show error
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    
    if (window.hasHapticSupport) {
        navigator.vibrate(200);
    }
}

// Hide error
function hideError() {
    errorMsg.classList.remove('show');
}

// Start calculation
function startCalculation() {
    if (!validateInputs()) return;
    
    if (window.hasHapticSupport) {
        navigator.vibrate([50, 100, 50]);
    }
    
    switchScreen(homeScreen, calculationScreen);
    
    setTimeout(() => {
        performAnimatedCalculation();
    }, 500);
}

// Perform animated calculation with step-by-step visualization
async function performAnimatedCalculation() {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    
    resetCalculationScreen();
    
    await animateStep1(name1, name2);
    updateProgress(25, 'Matching letters...');
    
    const remainingCount = await animateStep2(name1, name2);
    updateProgress(50, 'Counting unique letters...');
    
    const finalLetter = await animateStep3(remainingCount);
    updateProgress(75, 'Eliminating possibilities...');
    
    await animateStep4(finalLetter);
    updateProgress(100, 'Revealing destiny...');
    
    await sleep(1000);
    
    saveToHistory(name1, name2, finalLetter);
    
    showResult(finalLetter);
}

// Step 1: Letter Matching Animation
async function animateStep1(name1, name2) {
    const step = document.getElementById('step1');
    step.classList.add('active');
    scrollToStep(step);
    
    const str1 = name1.toLowerCase().replace(/\s/g, '');
    const str2 = name2.toLowerCase().replace(/\s/g, '');
    
    name1Letters.innerHTML = '';
    name2Letters.innerHTML = '';
    
    for (let char of str1) {
        const letterBox = createLetterBox(char);
        name1Letters.appendChild(letterBox);
        await sleep(100);
    }
    
    for (let char of str2) {
        const letterBox = createLetterBox(char);
        name2Letters.appendChild(letterBox);
        await sleep(100);
    }
    
    await sleep(500);
    
    let matches = 0;
    let tempStr1 = str1;
    let tempStr2 = str2;
    const boxes1 = name1Letters.children;
    const boxes2 = name2Letters.children;
    
    for (let i = 0; i < tempStr1.length; i++) {
        const char = tempStr1[i];
        const index2 = tempStr2.indexOf(char);
        
        if (index2 !== -1) {
            boxes1[i].classList.add('matched');
            boxes2[index2].classList.add('matched');
            matches++;
            
            matchCounter.querySelector('span').textContent = matches;
            
            playMatchSound();
            
            if (window.hasHapticSupport) {
                navigator.vibrate(30);
            }
            
            tempStr2 = tempStr2.substring(0, index2) + ' ' + tempStr2.substring(index2 + 1);
            
            await sleep(400);
        }
    }
    
    await sleep(800);
    
    for (let box of boxes1) {
        if (box.classList.contains('matched')) {
            box.classList.add('crossed');
        }
    }
    
    for (let box of boxes2) {
        if (box.classList.contains('matched')) {
            box.classList.add('crossed');
        }
    }
    
    await sleep(500);
    
    step.classList.add('completed');
}

// Step 2: Show Remaining Letters
async function animateStep2(name1, name2) {
    const step = document.getElementById('step2');
    step.classList.add('active');
    scrollToStep(step);
    
    let str1 = name1.toLowerCase().replace(/\s/g, '');
    let str2 = name2.toLowerCase().replace(/\s/g, '');
    
    for (let char of str1.split('')) {
        if (str2.includes(char)) {
            str1 = str1.replace(char, '');
            str2 = str2.replace(char, '');
        }
    }
    
    const remaining = str1 + str2;
    const count = remaining.length;
    
    remainingLetters.innerHTML = '';
    
    for (let char of remaining) {
        const letterBox = createLetterBox(char);
        letterBox.style.background = 'var(--love-gradient)';
        letterBox.style.borderColor = 'var(--neon-gold)';
        remainingLetters.appendChild(letterBox);
        
        const currentCount = remainingLetters.children.length;
        countDisplay.querySelector('span').textContent = currentCount;
        
        playTick();
        
        await sleep(200);
    }
    
    await sleep(1000);
    
    step.classList.add('completed');
    
    return count;
}

// Step 3: FLAMES Elimination
async function animateStep3(count) {
    const step = document.getElementById('step3');
    step.classList.add('active');
    scrollToStep(step);
    
    totalCount.textContent = count;
    
    await sleep(500);
    
    const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    const flamesItems = Array.from(flamesCircle.children);
    let index = 0;
    
    await sleep(500);
    
    while (flames.length > 1) {
        for (let i = 0; i < count; i++) {
            const currentIndex = (index + i) % flames.length;
            const letter = flames[currentIndex];
            const item = flamesItems.find(el => el.dataset.letter === letter && !el.classList.contains('eliminated'));
            
            if (item) {
                item.classList.add('counting');
                currentCount.textContent = i + 1;
                
                playTick();
                
                await sleep(300);
                item.classList.remove('counting');
            }
        }
        
        index = (index + count - 1) % flames.length;
        const eliminatedLetter = flames[index];
        const eliminatedItem = flamesItems.find(el => el.dataset.letter === eliminatedLetter);
        
        eliminatedItem.classList.add('eliminated');
        flames.splice(index, 1);
        
        playElimination();
        
        if (window.hasHapticSupport) {
            navigator.vibrate(50);
        }
        
        await sleep(600);
        
        if (index >= flames.length && flames.length > 0) {
            index = 0;
        }
    }
    
    const winner = flames[0];
    const winnerItem = flamesItems.find(el => el.dataset.letter === winner);
    winnerItem.classList.add('winner');
    
    playWin();
    
    if (window.hasHapticSupport) {
        navigator.vibrate([100, 50, 100]);
    }
    
    await sleep(1500);
    
    step.classList.add('completed');
    
    return winner;
}

// Step 4: Final Letter Reveal
async function animateStep4(letter) {
    const step = document.getElementById('step4');
    step.classList.add('active');
    scrollToStep(step);
    
    await sleep(300);
    
    for (let i = 3; i > 0; i--) {
        finalLetterReveal.textContent = i;
        playTick();
        await sleep(600);
    }
    
    finalLetterReveal.textContent = letter;
    finalLetterReveal.style.transform = 'scale(1.2)';
    
    playWin();
    
    await sleep(800);
    
    finalLetterReveal.style.transform = 'scale(1)';
    
    step.classList.add('completed');
}

// Smooth scroll to active step
function scrollToStep(step) {
    setTimeout(() => {
        step.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

// Show result
function showResult(flamesResult) {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    
    const data = flamesData[flamesResult];
    
    // Store result for sharing
    currentResultForSharing = {
        name1: name1,
        name2: name2,
        result: flamesResult
    };
    
    namesDisplay.textContent = `${name1} & ${name2}`;
    resultText.textContent = data.full;
    resultIcon.textContent = data.icon;
    resultMessage.textContent = data.message;
    resultQuote.textContent = data.quote;
    
    switchScreen(calculationScreen, resultScreen);
    
    setTimeout(() => {
        compatibilityFill.style.width = data.compatibility + '%';
        animateCounter(0, data.compatibility, compatibilityPercent);
    }, 500);
    
    createFloatingEmojis(data.icon);
    
    if (window.hasHapticSupport) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    playResultSound();
    
    // Make social nav visible
    socialNav.style.display = 'flex';
}

// Helper Functions
function createLetterBox(char) {
    const box = document.createElement('div');
    box.className = 'letter-box';
    box.textContent = char.toUpperCase();
    return box;
}

function resetCalculationScreen() {
    document.querySelectorAll('.calc-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    calculationScreen.scrollTop = 0;
    
    calcProgressFill.style.width = '0%';
    calcStageText.textContent = 'Initializing...';
    
    name1Letters.innerHTML = '';
    name2Letters.innerHTML = '';
    matchCounter.querySelector('span').textContent = '0';
    remainingLetters.innerHTML = '';
    countDisplay.querySelector('span').textContent = '0';
    
    document.querySelectorAll('.flames-item').forEach(item => {
        item.classList.remove('counting', 'eliminated', 'winner');
    });
    
    currentCount.textContent = '0';
    totalCount.textContent = '0';
    finalLetterReveal.textContent = '?';
}

function updateProgress(percent, text) {
    calcProgressFill.style.width = percent + '%';
    calcStageText.textContent = text;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showHistory() {
    historyModal.classList.add('show');
    displayHistory();
}

function hideHistory() {
    historyModal.classList.remove('show');
}

function loadHistory() {
    const saved = localStorage.getItem('flamesHistory');
    if (saved) {
        calculationHistory = JSON.parse(saved);
    }
}

function saveToHistory(name1, name2, result) {
    const entry = {
        name1,
        name2,
        result,
        timestamp: Date.now()
    };
    
    calculationHistory.unshift(entry);
    
    if (calculationHistory.length > 10) {
        calculationHistory = calculationHistory.slice(0, 10);
    }
    
    localStorage.setItem('flamesHistory', JSON.stringify(calculationHistory));
}

function displayHistory() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No calculations yet. Start your first destiny reading! ✨</p>';
        return;
    }
    
    historyList.innerHTML = '';
    
    calculationHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const data = flamesData[entry.result];
        const timeAgo = getTimeAgo(entry.timestamp);
        
        item.innerHTML = `
            <div class="history-item-names">${entry.name1} & ${entry.name2}</div>
            <div class="history-item-result">
                ${data.icon} ${data.full}
                <span class="result-badge">${data.compatibility}%</span>
            </div>
            <div class="history-item-time">${timeAgo}</div>
        `;
        
        historyList.appendChild(item);
    });
}

function clearHistory() {
    if (confirm('Clear all history? This cannot be undone.')) {
        calculationHistory = [];
        localStorage.removeItem('flamesHistory');
        displayHistory();
        
        if (window.hasHapticSupport) {
            navigator.vibrate(50);
        }
    }
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

// Sound Functions
function playMatchSound() {
    if (!soundEnabled) return;
    playTone(800, 0.05, 0.1);
}

function playTick() {
    if (!soundEnabled) return;
    playTone(400, 0.03, 0.05);
}

function playElimination() {
    if (!soundEnabled) return;
    playTone(300, 0.1, 0.15);
}

function playWin() {
    if (!soundEnabled) return;
    playTone(1000, 0.1, 0.2);
}

function playTone(frequency, volume, duration) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (err) {
        // Audio not supported
    }
}

// Animate counter
function animateCounter(start, end, element) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Create floating emojis
function createFloatingEmojis(emoji) {
    const emojis = [emoji, '❤️', '✨', '💫', '🌟'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'floating-emoji';
            emojiElement.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emojiElement.style.left = Math.random() * 100 + '%';
            emojiElement.style.animationDelay = '0s';
            emojiElement.style.animationDuration = (Math.random() * 2 + 3) + 's';
            
            floatingEmojisContainer.appendChild(emojiElement);
            
            setTimeout(() => {
                emojiElement.remove();
            }, 5000);
        }, i * 100);
    }
}

// Switch screen
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    
    setTimeout(() => {
        toScreen.classList.add('active');
    }, 300);
}

// Restart
function restart() {
    name1Input.value = '';
    name2Input.value = '';
    hideError();
    
    compatibilityFill.style.width = '0%';
    compatibilityPercent.textContent = '0%';
    
    floatingEmojisContainer.innerHTML = '';
    
    switchScreen(resultScreen, homeScreen);
    
    setTimeout(() => {
        name1Input.focus();
    }, 500);
}

// Share result with screenshot
async function shareResult() {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    const result = resultText.textContent;
    const compatibility = compatibilityPercent.textContent;
    const icon = resultIcon.textContent;
    const message = resultMessage.textContent;
    
    // Update share button state
    shareBtn.classList.add('capturing');
    shareBtn.querySelector('span').textContent = '📸 Capturing...';
    
    // Prepare screenshot frame
    const screenshotFrame = document.getElementById('screenshotFrame');
    const screenshotNames = document.getElementById('screenshotNames');
    const screenshotIcon = document.getElementById('screenshotIcon');
    const screenshotResultText = document.getElementById('screenshotResultText');
    const screenshotCompatibility = document.getElementById('screenshotCompatibility');
    const screenshotMessage = document.getElementById('screenshotMessage');
    const screenshotEmojiTrail = document.getElementById('screenshotEmojiTrail');
    const cameraFlash = document.getElementById('cameraFlash');
    
    // Fill screenshot data
    screenshotNames.textContent = `${name1} & ${name2}`;
    screenshotIcon.textContent = icon;
    screenshotResultText.textContent = result;
    screenshotCompatibility.textContent = compatibility;
    screenshotMessage.textContent = message;
    
    // Add emoji trail
    const emojis = [icon, '💕', '✨', '💫', '❤️'];
    screenshotEmojiTrail.innerHTML = '';
    emojis.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        screenshotEmojiTrail.appendChild(span);
    });
    
    // Show screenshot frame with animation
    screenshotFrame.classList.add('capturing');
    
    // Wait for animation
    await sleep(300);
    
    // Flash effect
    cameraFlash.classList.add('active');
    
    // Haptic feedback
    if (window.hasHapticSupport) {
        navigator.vibrate([50, 100, 50]);
    }
    
    // Play shutter sound
    playShutterSound();
    
    // Wait for flash
    await sleep(600);
    
    cameraFlash.classList.remove('active');
    
    // Capture to canvas
    try {
        const canvas = await captureToCanvas();
        
        // Convert to blob
        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'flames-result.png', { type: 'image/png' });
            
            // Try to share image
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'FLAMES Result',
                        text: `${name1} & ${name2} are ${result}! 🔥`
                    });
                    
                    shareBtn.classList.remove('capturing');
                    shareBtn.classList.add('captured');
                    shareBtn.querySelector('span').textContent = 'Shared!';
                } catch (err) {
                    console.log('Share cancelled:', err);
                    // Fallback to download
                    downloadImage(canvas);
                }
            } else {
                // Download image as fallback
                downloadImage(canvas);
            }
            
            // Reset button after delay
            setTimeout(() => {
                shareBtn.classList.remove('capturing', 'captured');
                shareBtn.querySelector('span').textContent = '📸 Share Result';
            }, 3000);
            
            // Hide screenshot frame
            setTimeout(() => {
                screenshotFrame.classList.remove('capturing');
            }, 1000);
            
        }, 'image/png');
        
    } catch (err) {
        console.error('Screenshot failed:', err);
        
        // Fallback to text share
        const shareText = `🔥 FLAMES Result 🔥\n\n${name1} & ${name2}\nAre: ${result}\nCompatibility: ${compatibility}\n\nTry it yourself! ✨`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'FLAMES - Destiny Relationship Analyzer',
                    text: shareText
                });
            } catch (err) {
                await navigator.clipboard.writeText(shareText);
                shareBtn.querySelector('span').textContent = '✓ Copied!';
            }
        }
        
        shareBtn.classList.remove('capturing');
        setTimeout(() => {
            shareBtn.querySelector('span').textContent = '📸 Share Result';
        }, 2000);
        
        screenshotFrame.classList.remove('capturing');
    }
}

// Capture screenshot to canvas
async function captureToCanvas() {
    const screenshotContent = document.getElementById('screenshotContent');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const rect = screenshotContent.getBoundingClientRect();
    const scale = 2; // Higher resolution
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    
    ctx.scale(scale, scale);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Add rounded corners
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, rect.width, rect.height, 30);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw text content
    await drawScreenshotContent(ctx, rect.width, rect.height);
    
    return canvas;
}

// Draw screenshot content on canvas
async function drawScreenshotContent(ctx, width, height) {
    const screenshotNames = document.getElementById('screenshotNames').textContent;
    const screenshotIcon = document.getElementById('screenshotIcon').textContent;
    const screenshotResultText = document.getElementById('screenshotResultText').textContent;
    const screenshotCompatibility = document.getElementById('screenshotCompatibility').textContent;
    const screenshotMessage = document.getElementById('screenshotMessage').textContent;
    
    // Draw FLAMES logo
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('FLAMES', width / 2, 50);
    
    ctx.font = '12px "Poppins", sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillText('DESTINY RELATIONSHIP ANALYZER', width / 2, 75);
    
    // Draw white card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.roundRect(30, 100, width - 60, height - 150, 25);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw names
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(screenshotNames, width / 2, 145);
    
    // Draw icon
    ctx.font = '60px Arial';
    ctx.fillText(screenshotIcon, width / 2, 220);
    
    // Draw result text
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#fa709a');
    gradient.addColorStop(1, '#fee140');
    ctx.fillStyle = gradient;
    ctx.font = 'bold 40px "Playfair Display", serif';
    ctx.fillText(screenshotResultText, width / 2, 280);
    
    // Draw compatibility
    ctx.fillStyle = '#666';
    ctx.font = '11px "Poppins", sans-serif';
    ctx.fillText('COMPATIBILITY', width / 2, 315);
    
    ctx.fillStyle = gradient;
    ctx.font = 'bold 28px "Poppins", sans-serif';
    ctx.fillText(screenshotCompatibility, width / 2, 345);
    
    // Draw message (wrapped)
    ctx.fillStyle = '#555';
    ctx.font = '14px "Poppins", sans-serif';
    const maxWidth = width - 100;
    const words = screenshotMessage.split(' ');
    let line = '';
    let y = 385;
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, width / 2, y);
            line = words[i] + ' ';
            y += 22;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, width / 2, y);
    
    // Draw emoji trail
    const emojis = ['🤝', '💕', '✨', '💫', '❤️'];
    ctx.font = '20px Arial';
    const emojiSpacing = 35;
    const startX = (width - (emojis.length * emojiSpacing)) / 2;
    emojis.forEach((emoji, i) => {
        ctx.fillText(emoji, startX + (i * emojiSpacing), height - 85);
    });
    
    // Draw footer
    ctx.fillStyle = 'white';
    ctx.font = '14px "Poppins", sans-serif';
    ctx.fillText('Try it yourself! ✨ FLAMES Game', width / 2, height - 25);
}

// Download image
function downloadImage(canvas) {
    const link = document.createElement('a');
    link.download = 'flames-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    shareBtn.classList.remove('capturing');
    shareBtn.classList.add('captured');
    shareBtn.querySelector('span').textContent = '✓ Downloaded!';
}

// Play shutter sound
function playShutterSound() {
    if (!soundEnabled) return;
    
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create shutter sound effect
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (err) {
        console.log('Audio not available');
    }
}

// Play result sound
function playResultSound() {
    if (!soundEnabled) return;
    
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        const frequencies = [523.25, 659.25, 783.99];
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
            
            oscillator.start(audioContext.currentTime + index * 0.1);
            oscillator.stop(audioContext.currentTime + index * 0.1 + 0.3);
        });
    } catch (err) {
        console.log('Audio playback not available');
    }
}

// Easter egg: Shake animation on triple click
let clickCount = 0;
let clickTimer;

document.addEventListener('click', () => {
    clickCount++;
    
    if (clickCount === 3) {
        document.body.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
        
        clickCount = 0;
    }
    
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 500);
});

// Add sparkle cursor effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        const sparkle = document.createElement('div');
        sparkle.className = 'particle';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.position = 'fixed';
        sparkle.style.width = '3px';
        sparkle.style.height = '3px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(1) translateY(-30px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console easter egg
        
        <div class="post-result-display">
            <div class="post-result-names">${post.name1} & ${post.name2}</div>
            <div class="post-result-icon">${flamesInfo.icon}</div>
            <div class="post-result-text">${flamesInfo.full}</div>
            <div class="post-result-compatibility">${flamesInfo.compatibility}% Compatible</div>
        </div>
        
        <div class="post-actions">
            <button class="post-action-btn ${post.likedByCurrentUser ? 'liked' : ''}" data-action="like">
                <span class="action-icon">${post.likedByCurrentUser ? '❤️' : '🤍'}</span>
                <span>${post.likes}</span>
            </button>
            <button class="post-action-btn" data-action="comment">
                <span class="action-icon">💬</span>
                <span>${post.comments.length}</span>
            </button>
            <button class="post-action-btn" data-action="share">
                <span class="action-icon">📤</span>
            </button>
        </div>
    `;
    


function handleLike(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    
    if (post.likedByCurrentUser) {
        post.likes--;
        post.likedByCurrentUser = false;
    } else {
        post.likes++;
        post.likedByCurrentUser = true;
        
        if (window.hasHapticSupport) {
            navigator.vibrate(30);
        }
        playTone(600, 0.05, 0.1);
    }
    
    loadFeed();
}

function showPostModal(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    
    currentOpenPost = post;
    
    const flamesInfo = flamesData[post.result];
    
    document.getElementById('postDetailContent').innerHTML = `
        <div class="post-result-display">
            <div class="post-result-names">${post.name1} & ${post.name2}</div>
            <div class="post-result-icon">${flamesInfo.icon}</div>
            <div class="post-result-text">${flamesInfo.full}</div>
            <div class="post-result-compatibility">${flamesInfo.compatibility}% Compatible</div>
        </div>
        ${post.caption ? `<p class="post-caption">${post.caption}</p>` : ''}
    `;
    
    loadComments(post);
    postModal.classList.add('show');
}

function hidePostModal() {
    postModal.classList.remove('show');
    currentOpenPost = null;
}

function loadComments(post) {
    commentsList.innerHTML = '';
    document.getElementById('commentsCount').textContent = post.comments.length;
    
    if (post.comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 40px 20px;">No comments yet. Be the first! 💬</p>';
        return;
    }
    
    post.comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-header">
                <img src="${comment.userAvatar}" alt="Avatar" class="comment-avatar">
                <span class="comment-user">${comment.username}</span>
                <span class="comment-time">${getTimeAgo(comment.timestamp)}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
        `;
        commentsList.appendChild(commentItem);
    });
    
    commentsList.scrollTop = commentsList.scrollHeight;
}

function handleAddComment() {
    const text = commentInput.value.trim();
    if (!text || !currentOpenPost) return;
    
    if (currentUser.isGuest) {
        alert('Please login to comment!');
        showAuthModal();
        return;
    }
    
    const comment = {
        id: Date.now(),
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        text: text,
        timestamp: Date.now()
    };
    
    currentOpenPost.comments.push(comment);
    commentInput.value = '';
    
    loadComments(currentOpenPost);
    loadFeed();
    
    if (window.hasHapticSupport) {
        navigator.vibrate(50);
    }
    playTone(800, 0.05, 0.1);
}

// Share functions
function showShareModal() {
    if (!currentResultForSharing) return;
    
    const flamesInfo = flamesData[currentResultForSharing.result];
    
    document.getElementById('sharePreview').innerHTML = `
        <div class="post-result-names">${currentResultForSharing.name1} & ${currentResultForSharing.name2}</div>
        <div class="post-result-icon">${flamesInfo.icon}</div>
        <div class="post-result-text">${flamesInfo.full}</div>
        <div class="post-result-compatibility">${flamesInfo.compatibility}% Compatible</div>
    `;
    
    sharePostModal.classList.add('show');
}

function hideShareModal() {
    sharePostModal.classList.remove('show');
    shareCaption.value = '';
    captionCount.textContent = '0';
}

function updateCaptionCount() {
    captionCount.textContent = shareCaption.value.length;
}

function handleSharePost() {
    if (!currentResultForSharing) return;
    
    if (currentUser.isGuest) {
        alert('Please login to share posts!');
        showAuthModal();
        return;
    }
    
    const post = {
        id: Date.now(),
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        name1: currentResultForSharing.name1,
        name2: currentResultForSharing.name2,
        result: currentResultForSharing.result,
        caption: shareCaption.value.trim(),
        likes: 0,
        likedByCurrentUser: false,
        comments: [],
        timestamp: Date.now()
    };
    
    allPosts.unshift(post);
    currentUser.posts.push(post);
    
    const shareToStory = document.getElementById('shareStory').checked;
    if (shareToStory) {
        addStoryFromResult(currentResultForSharing);
    }
    
    hideShareModal();
    switchToNav(navHome, socialFeedScreen);
    
    if (window.hasHapticSupport) {
        navigator.vibrate([50, 100, 50]);
    }
    playResultSound();
}

function handleShareExistingPost(postId) {
    alert('Sharing functionality coming soon! 📤');
}

// Stories functions
function loadStories() {
    storiesList.innerHTML = '';
    
    if (allStories.length === 0) {
        storiesList.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 40px 20px; grid-column: 1/-1;">No stories yet. Be the first! 📖</p>';
        return;
    }
    
    allStories.forEach(story => {
        const storyItem = createStoryItem(story);
        storiesList.appendChild(storyItem);
    });
    
    updateStoriesBadge();
}

function createStoryItem(story) {
    const item = document.createElement('div');
    item.className = 'story-item';
    if (currentUser.viewedStories.includes(story.id)) {
        item.classList.add('viewed');
    }
    
    const flamesInfo = flamesData[story.result];
    
    item.innerHTML = `
        <div class="story-background">
            ${flamesInfo.icon}
        </div>
        <img src="${story.userAvatar}" alt="Avatar" class="story-user-avatar">
        <span class="story-user-name">${story.username}</span>
    `;
    
    item.addEventListener('click', () => viewStory(story));
    
    return item;
}

function viewStory(story) {
    const flamesInfo = flamesData[story.result];
    
    document.getElementById('storyAvatar').src = story.userAvatar;
    document.getElementById('storyUsername').textContent = story.username;
    document.getElementById('storyTime').textContent = getTimeAgo(story.timestamp);
    
    document.getElementById('storyContent').innerHTML = `
        <div style="background: var(--card-bg); backdrop-filter: blur(20px); border-radius: 20px; padding: 40px; text-align: center; max-width: 400px;">
            <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 15px;">${story.name1} & ${story.name2}</div>
            <div style="font-size: 5rem; margin: 20px 0;">${flamesInfo.icon}</div>
            <div style="font-size: 2.5rem; font-weight: 700; background: var(--love-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 15px 0;">${flamesInfo.full}</div>
            <div style="font-size: 1.5rem; color: var(--neon-pink); font-weight: 700; margin-top: 15px;">${flamesInfo.compatibility}%</div>
        </div>
    `;
    
    storyViewer.classList.add('active');
    
    if (!currentUser.viewedStories.includes(story.id)) {
        currentUser.viewedStories.push(story.id);
    }
    
    animateStoryProgress();
}

function animateStoryProgress() {
    const progressBar = document.getElementById('storyProgress');
    let width = 0;
    const interval = setInterval(() => {
        width += 1;
        progressBar.style.width = width + '%';
        if (width >= 100) {
            clearInterval(interval);
            hideStoryViewer();
        }
    }, 50);
    
    storyViewer.dataset.progressInterval = interval;
}

function hideStoryViewer() {
    if (storyViewer.dataset.progressInterval) {
        clearInterval(parseInt(storyViewer.dataset.progressInterval));
    }
    storyViewer.classList.remove('active');
    document.getElementById('storyProgress').style.width = '0%';
    loadStories();
}

function handleAddStory() {
    if (!currentResultForSharing) {
        alert('Please calculate a FLAMES result first!');
        switchToNav(navCalculator, homeScreen);
        return;
    }
    
    if (currentUser.isGuest) {
        alert('Please login to add stories!');
        showAuthModal();
        return;
    }
    
    addStoryFromResult(currentResultForSharing);
    
    if (window.hasHapticSupport) {
        navigator.vibrate([50, 100, 50]);
    }
}

function addStoryFromResult(result) {
    const story = {
        id: Date.now(),
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        name1: result.name1,
        name2: result.name2,
        result: result.result,
        timestamp: Date.now()
    };
    
    allStories.unshift(story);
    loadStories();
    updateStoriesBadge();
}

function updateStoriesBadge() {
    const unviewedCount = allStories.filter(s => !currentUser.viewedStories.includes(s.id)).length;
    const badge = document.getElementById('storiesBadge');
    if (unviewedCount > 0) {
        badge.textContent = unviewedCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// Leaderboard functions
function loadLeaderboard(type) {
    leaderboardContent.innerHTML = '';
    
    let sortedPosts = [...allPosts];
    
    if (type === 'compatible') {
        sortedPosts.sort((a, b) => {
            const aCompat = flamesData[a.result].compatibility;
            const bCompat = flamesData[b.result].compatibility;
            return bCompat - aCompat;
        });
    } else if (type === 'popular') {
        sortedPosts.sort((a, b) => b.likes - a.likes);
    } else {
        sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    sortedPosts.slice(0, 20).forEach((post, index) => {
        const item = createLeaderboardItem(post, index + 1);
        leaderboardContent.appendChild(item);
    });
}

function createLeaderboardItem(post, rank) {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    
    const flamesInfo = flamesData[post.result];
    let rankClass = '';
    if (rank === 1) rankClass = 'gold';
    else if (rank === 2) rankClass = 'silver';
    else if (rank === 3) rankClass = 'bronze';
    
    item.innerHTML = `
        <div class="leaderboard-rank ${rankClass}">
            ${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : '#' + rank}
        </div>
        <div class="leaderboard-info">
            <div class="leaderboard-names">${post.name1} & ${post.name2}</div>
            <div class="leaderboard-result">${flamesInfo.icon} ${flamesInfo.full}</div>
        </div>
        <div class="leaderboard-stats">
            <div class="leaderboard-score">${flamesInfo.compatibility}%</div>
            <div class="leaderboard-likes">❤️ ${post.likes}</div>
        </div>
    `;
    
    item.addEventListener('click', () => showPostModal(post.id));
    
    return item;
}

// Profile functions
function loadProfile() {
    document.getElementById('profilePosts').textContent = currentUser.posts.length;
    document.getElementById('profileFollowers').textContent = currentUser.followers;
    document.getElementById('profileFollowing').textContent = currentUser.following;
    
    loadProfileTab('grid');
}

function loadProfileTab(tab) {
    profileGrid.innerHTML = '';
    
    if (tab === 'grid') {
        if (currentUser.posts.length === 0) {
            profileGrid.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 40px 20px; grid-column: 1/-1;">No results yet. Calculate your first FLAMES! ✨</p>';
            return;
        }
        
        currentUser.posts.forEach(post => {
            const item = createProfileResultItem(post);
            profileGrid.appendChild(item);
        });
    } else if (tab === 'list') {
        profileGrid.style.display = 'block';
        profileGrid.style.gridTemplateColumns = '1fr';
        
        if (calculationHistory.length === 0) {
            profileGrid.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 40px 20px;">No history yet. Calculate your first FLAMES! ✨</p>';
            return;
        }
        
        calculationHistory.forEach(entry => {
            const flamesInfo = flamesData[entry.result];
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-item-names">${entry.name1} & ${entry.name2}</div>
                <div class="history-item-result">
                    ${flamesInfo.icon} ${flamesInfo.full}
                    <span class="result-badge">${flamesInfo.compatibility}%</span>
                </div>
                <div class="history-item-time">${getTimeAgo(entry.timestamp)}</div>
            `;
            profileGrid.appendChild(item);
        });
    } else if (tab === 'friends') {
        profileGrid.style.display = 'block';
        profileGrid.style.gridTemplateColumns = '1fr';
        profileGrid.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 40px 20px;">Friends feature coming soon! 👥</p>';
    }
}

function createProfileResultItem(post) {
    const item = document.createElement('div');
    item.className = 'profile-result-item';
    
    const flamesInfo = flamesData[post.result];
    
    item.innerHTML = `
        <div class="profile-result-icon">${flamesInfo.icon}</div>
        <div class="profile-result-type">${flamesInfo.full}</div>
        <div class="profile-result-percent">${flamesInfo.compatibility}%</div>
    `;
    
    item.addEventListener('click', () => showPostModal(post.id));
    
    return item;
}

// Friends functions
function showFriendsModal(tab) {
    friendsModal.classList.add('show');
    loadFriendsList(tab);
}

function hideFriendsModal() {
    friendsModal.classList.remove('show');
}

function loadFriendsList(tab) {
    friendsList.innerHTML = '';
    
    // Demo users
    for (let i = 0; i < 10; i++) {
        const friend = {
            username: `User${i + 1}`,
            name: `Demo User ${i + 1}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i + 1}`,
            isFollowing: Math.random() > 0.5
        };
        
        const item = createFriendItem(friend);
        friendsList.appendChild(item);
    }
}

function createFriendItem(friend) {
    const item = document.createElement('div');

        'Destiny has spoken! ✨',
        'So accurate! 💕',
        'This is amazing! 🔥',
        'We tried it and... wow! 💖',
        'Couldn\'t be more perfect! 🌟',
        ''
    ];
    
    // Generate posts
    demoUsers.forEach((user, index) => {
        const username = user.name + Math.floor(Math.random() * 100);
        const result = results[Math.floor(Math.random() * results.length)];
        const timestamp = Date.now() - (index * 3600000); // 1 hour apart
        
        const post = {
            id: timestamp,
            username: username,
            userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            name1: user.name,
            name2: user.partner,
            result: result,
            caption: captions[Math.floor(Math.random() * captions.length)],
            likes: Math.floor(Math.random() * 200),
            likedByCurrentUser: false,
            comments: [],
            timestamp: timestamp
        };
        
        // Add some comments
        const numComments = Math.floor(Math.random() * 5);
        for (let i = 0; i < numComments; i++) {
            post.comments.push({
                id: timestamp + i,
                username: 'User' + Math.floor(Math.random() * 100),
                userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`,
                text: ['So cute! ❤️', 'Congrats! 🎉', 'Beautiful! ✨', 'Love this! 💕'][Math.floor(Math.random() * 4)],
                timestamp: timestamp + (i * 60000)
            });
        }
        
        allPosts.push(post);
    });
    
    // Generate stories
    demoUsers.slice(0, 3).forEach((user, index) => {
        const username = user.name + Math.floor(Math.random() * 100);
        const result = results[Math.floor(Math.random() * results.length)];
        
        allStories.push({
            id: Date.now() - (index * 1000),
            username: username,
            userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            name1: user.name,
            name2: user.partner,
            result: result,
            timestamp: Date.now() - (index * 3600000)
        });
    });
}