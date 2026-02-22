const app = document.getElementById('app');

const routes = {
    '/': '<h1>Witaj w SPA</h1><p>Wybierz sekcję z menu powyżej.</p>',
    '/gallery': `
        <h1>Galeria</h1>
        <div class="gallery-grid">
            <img class="gallery-item lazy-blob" data-src="img/foto1.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto2.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto3.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto4.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto5.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto6.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto7.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto8.jpg">
            <img class="gallery-item lazy-blob" data-src="img/foto9.jpg">
        </div>
    `,
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
    app.innerHTML = routes[path] || '<h1>404</h1><p>Strona nie istnieje.</p>';
    
    if (path === '/gallery') initGallery();
    if (path === '/contact') initContact();
};


async function initGallery() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;

                try {
                    const response = await fetch(src);
                    const blob = await response.blob();
                    const objectURL = URL.createObjectURL(blob);
                    img.src = objectURL;
                    
                    
                    img.onclick = () => openModal(objectURL);
                } catch (err) {
                    console.error("Błąd ładowania zdjęcia:", src, err);
                }
                
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.lazy-blob').forEach(i => observer.observe(i));
}


const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');

function openModal(src) {
    if (!modal) return;
    modal.style.display = 'flex';
    modalImg.src = src;
}


if (modal) {
    modal.onclick = (e) => {
        if (e.target === modal || e.target.classList.contains('close-btn')) {
            modal.style.display = 'none';
        }
    };
}


function initContact() {
   
    if (window.grecaptcha && document.querySelector('.g-recaptcha')) {
        try {
            grecaptcha.render(document.querySelector('.g-recaptcha'));
        } catch (e) {
            
        }
    }

    const form = document.getElementById('contact-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            
            const response = grecaptcha.getResponse();
            if (response.length === 0) {
                alert("Proszę potwierdzić, że nie jesteś robotem!");
                return;
            }

            alert("Dziękujemy! Formularz został wysłany.");
            form.reset();
            grecaptcha.reset();
        };
    }
}

document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        navigate(e.target.getAttribute('href'));
    }
});


window.onpopstate = () => render(window.location.pathname);


render(window.location.pathname);