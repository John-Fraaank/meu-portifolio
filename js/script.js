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
    radius: 120 // Raio de interação do mouse
};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, size, color) {
        this.baseX = x; // Ponto de origem para onde ele volta
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 20) + 5; // Ajuda na força de repulsão

        // Variaveis para o movimento aleatorio lento
        this.angle = Math.random() * Math.PI * 2;
        this.wanderRadius = Math.random() * 30 + 10;
        this.wanderSpeed = Math.random() * 0.01 + 0.005;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // 1. Calcular a posição flutuante base (movendo-se lentamente)
        this.angle += this.wanderSpeed;
        let targetX = this.baseX + Math.cos(this.angle) * this.wanderRadius;
        let targetY = this.baseY + Math.sin(this.angle) * this.wanderRadius;

        // 2. Interação com o Mouse (Repulsão forte)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (mouse.x != null && distance < mouse.radius) {
            // Mouse proximo: Afastar
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;

            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX * 2; // repelir mais rapido
            this.y -= directionY * 2;
        } else {
            // Mouse longe: Voltar suavemente para a posição flutuante (Efeito elástico/Mola)
            this.x += (targetX - this.x) * 0.05;
            this.y += (targetY - this.y) * 0.05;
        }

        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let color = '#00eeff';
        particlesArray.push(new Particle(x, y, size, color));
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = (dx * dx) + (dy * dy);

            if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                let opacityValue = 1 - (distance / 20000);
                if (opacityValue > 0) {
                    ctx.strokeStyle = 'rgba(0, 238, 255,' + opacityValue * 0.5 + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

window.addEventListener('mouseout', function () {
    mouse.x = undefined;
    mouse.y = undefined;
});

initParticles();
animateParticles();

// === LER MAIS MODAL LOGIC ===
const modal = document.createElement('div');
modal.className = 'modal';
modal.id = 'genericModal';

modal.innerHTML = `
  <div class="modal-content">
    <span class="close-btn">&times;</span>
    <h2 id="modalTitle" style="text-align: center; margin-bottom: 1.5rem;"></h2>
    <div class="modal-body" id="modalBody"></div>
  </div>
`;
document.body.appendChild(modal);

const closeBtn = modal.querySelector('.close-btn');
const modalTitle = modal.querySelector('#modalTitle');
const modalBody = modal.querySelector('#modalBody');

// Seleciona todos os botões "Ler mais" das seções de interesse
const allReadMoreBtns = document.querySelectorAll('.services-box .btn, .about-content .btn');

allReadMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        let title = "";
        let content = "";

        // Verifica se o clique veio da seção de serviços ou sobre
        if (btn.closest('.services-box')) {
            const box = btn.closest('.services-box');
            title = box.querySelector('h3').innerText;
            content = box.querySelector('p').innerHTML;
        } else if (btn.closest('.about-content')) {
            const container = btn.closest('.about-content');
            title = 'Sobre <span>mim</span>';
            content = container.querySelector('p').innerHTML;
        }

        modalTitle.innerHTML = title;
        modalBody.innerHTML = content;
        modal.classList.add('show');
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// === DINAMIC AGE CALCULATION ===
function updateAge() {
    const birthDate = new Date('1987-04-02');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    // Se o mês atual é menor que o mês de nascimento, ou se é o mesmo mês mas o dia ainda não chegou
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const ageElement = document.getElementById('user-age');
    if (ageElement) {
        ageElement.innerText = age;
    }
}

// Executa ao carregar a página
updateAge();