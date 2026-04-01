// Seleciona o elemento com a classe 'menu-hamburguer' e armazena na variável menuHamburguer
const menuHamburguer = document.querySelector('.menu-hamburguer');

// Adiciona um evento de clique ao elemento menuHamburguer
menuHamburguer.addEventListener('click', () => {
    // Quando clicado, chama a função toggleMenu
    toggleMenu();
});

// Função para alternar a exibição do menu
function toggleMenu() {
    // Seleciona o elemento com a classe 'nav-responsive'
    const nav = document.querySelector('.nav-responsive');

    // Alterna a classe 'change' no elemento menuHamburguer
    menuHamburguer.classList.toggle('change');

    // Verifica se o menuHamburguer tem a classe 'change'
    if (menuHamburguer.classList.contains('change')) {
        // Se tiver, exibe o menu de navegação
        nav.style.display = "block";
    } else {
        // Se não tiver, oculta o menu de navegação
        nav.style.display = 'none';
    }
}

// === ANTIGRAVITY ANIMATIONS & FIXES === //

// 1. Fechar o menu automaticamente ao clicar em um link
const navLinks = document.querySelectorAll('.nav-responsive a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuHamburguer.classList.contains('change')) {
            toggleMenu();
        }
    });
});

// 2. Animação suave e dinâmica no Scroll (Antigravity Fade-Up)
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('section').forEach((section) => {
    section.classList.add('antigravity-section'); // Adiciona classe inicial
    sectionObserver.observe(section);
});

// === ANTIGRAVITY PARTICLES ===
const canvas = document.createElement('canvas');
canvas.id = 'particleCanvas';
// Insere o canvas no comeco do body
document.body.insertBefore(canvas, document.body.firstChild);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00eeff'; // Neon Cyan
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Efeito de repulsao do mouse
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 1.5;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 1.5;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 1.5;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 1.5;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#00eeff';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                let opacityValue = 1 - (distance / 15000);
                ctx.strokeStyle = 'rgba(0, 238, 255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 80) * (canvas.width / 80);
    initParticles();
});

window.addEventListener('mouseout', function () {
    mouse.x = undefined; mouse.y = undefined;
});

initParticles();
animateParticles();