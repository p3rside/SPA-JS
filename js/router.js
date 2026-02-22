const app = document.getElementById('app');

const routes = {
    '/': '<h1>Witaj w SPA</h1>...',
    '/gallery': `...`, // kod galerii
    '/contact': `
        <h1>Kontakt</h1>
        <form id="contact-form">
            <input type="text" id="name" placeholder="Imię" required>
            <input type="email" id="email" placeholder="Email" required>
            <textarea id="message" placeholder="Wiadomość" required></textarea>
            
            <div class="g-recaptcha" data-sitekey="6LcQYXQsAAAAAGWCVv5kdaaqhzTJgeFiJfW-i2eq"></div>
            
            <button type="submit">Wyślij</button>
        </form>
    `
};


const navigate = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
    render(path);
};

const render = (path) => {
    app.innerHTML = routes[path] || '<h1>404</h1>';
    
    
    if (path === '/gallery') initGallery();
    if (path === '/contact') initContact();
};


async function initGallery() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const response = await fetch(img.dataset.src);
                const blob = await response.blob();
                img.src = URL.createObjectURL(blob);
                observer.unobserve(img);
                
                img.onclick = () => openModal(img.src);
            }
        });
    });
    document.querySelectorAll('.lazy-blob').forEach(i => observer.observe(i));
}


const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
function openModal(src) {
    modal.style.display = 'flex';
    modalImg.src = src;
}
modal.onclick = (e) => {
    if (e.target === modal || e.target.classList.contains('close-btn')) {
        modal.style.display = 'none';
    }
};


function initContact() {
    // Re-render reCAPTCHA jeśli SPA nie odświeża skryptów
    if (window.grecaptcha) {
        grecaptcha.render(document.querySelector('.g-recaptcha'));
    }

    document.getElementById('contact-form').onsubmit = (e) => {
        e.preventDefault();
        const captcha = grecaptcha.getResponse();
        if (!captcha) return alert("Zaznacz reCAPTCHA!");
        alert("Formularz wysłany!");
    };
}


document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        navigate(e.target.getAttribute('href'));
    }
});

window.onpopstate = () => render(window.location.pathname);
render(window.location.pathname);