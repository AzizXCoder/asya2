// ==========================================================
// SCRIPT UTAMA: JURNAL PETUALANGAN (EFEK & LOGIKA TAMPILAN)
// ==========================================================

// --- FUNGSI GLOBAL RENDERING ELEMEN (Dipanggil otomatis oleh Firebase di HTML) ---
window.renderCardElement = function(data, isNew = false) {
    const cardsColumn = document.querySelector('.cards-column');
    if (!cardsColumn) return;

    const newCard = document.createElement('article');
    newCard.className = 'card active'; 
    newCard.setAttribute('data-category', data.category);
    newCard.innerHTML = `
        <div class="card-image-wrapper">
            <img src="${data.img}" alt="${data.loc}" class="card-img clickable-img">
            <span class="card-location">📍 ${data.loc}</span>
            <button class="like-btn" data-liked="false" data-id="${data.id}">
                <span class="heart-icon">❤️</span> <span class="like-count">${data.likes || 0}</span>
            </button>
        </div>
        <div class="card-content">
            <div class="highlight-box">
                <span class="highlight-badge">HIGHLIGHT MENARIK 🌟</span>
                <p class="highlight-text">"${data.highlight}"</p>
            </div>
            <h3 class="story-title">Behind The Scene 🎬</h3>
            <p class="story-text">${data.story}</p>
        </div>
    `;

    window.bindNewCardEvents(newCard);

    if (isNew) {
        cardsColumn.insertBefore(newCard, cardsColumn.children[1]); // Letakkan di tumpukan paling atas seksi kartu
    } else {
        cardsColumn.appendChild(newCard);
    }
};

window.renderThoughtElement = function(data, isNew = false) {
    const sidebarColumn = document.querySelector('.sidebar-column');
    if (!sidebarColumn) return;

    const newThought = document.createElement('div');
    newThought.className = 'thought-box pop-box active';
    newThought.innerHTML = `
        <div class="quote-mark">“</div>
        <p class="thought-text-content">"${data.text}"</p>
        <span class="thought-meta">${data.meta}</span>
    `;

    if (isNew) {
        sidebarColumn.insertBefore(newThought, sidebarColumn.children[1]); // Pasang di paling atas seksi thoughts
    } else {
        sidebarColumn.appendChild(newThought);
    }
};

// Pasang fungsi interaksi klik Like & Zoom Lightbox untuk elemen baru maupun lama
window.bindNewCardEvents = function(cardElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    const likeBtn = cardElement.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLiked = likeBtn.getAttribute('data-liked') === 'true';
            const countSpan = likeBtn.querySelector('.like-count');
            let currentCount = parseInt(countSpan.textContent) || 0;
            
            if (!isLiked) {
                likeBtn.setAttribute('data-liked', 'true');
                countSpan.textContent = currentCount + 1;
                window.createFloatingHearts(e.clientX, e.clientY);
            } else {
                likeBtn.setAttribute('data-liked', 'false');
                countSpan.textContent = currentCount - 1;
            }
        });
    }

    const img = cardElement.querySelector('.clickable-img');
    if (img && lightbox && lightboxImg && lightboxCaption) {
        img.addEventListener('click', () => {
            lightbox.classList.remove('hidden');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt || "Jejak Petualangan";
            document.body.style.overflow = 'hidden';
        });
    }
};

window.createFloatingHearts = function(x, y) {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.innerText = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
        
        heart.style.left = `${x + (Math.random() * 30 - 15)}px`;
        heart.style.top = `${y + (Math.random() * 30 - 15)}px`;
        heart.style.fontSize = `${Math.random() * 0.8 + 0.8}rem`;
        
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 1000);
    }
};

// --- CORE ANIMASI DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader
    const preloader = document.getElementById('preloader');
    typeEffect();
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => { preloader.style.visibility = 'hidden'; }, 500);
            }
        }, 400); 
    });

    // 2. Typewriter Effect
    const titleElement = document.getElementById('typewriter-title');
    const textToType = "Buku Harian Si Cantik ✨";
    let index = 0;
    function typeEffect() {
        if (titleElement && index < textToType.length) {
            titleElement.textContent += textToType.charAt(index);
            index++;
            setTimeout(typeEffect, 120);
        }
    }

    // 3. Parallax Hero Header
    const heroElement = document.getElementById('parallax-hero');
    window.addEventListener('scroll', () => {
        let scrollValue = window.scrollY;
        if (heroElement && scrollValue <= 600) {
            heroElement.style.backgroundPositionY = `${scrollValue * 0.4}px`;
        }
    });

    // 4. Filter Kategori Menu
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            document.querySelectorAll('.card').forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide-card');
                    card.classList.add('active');
                } else {
                    card.classList.add('hide-card');
                    card.classList.remove('active');
                }
            });
        });
    });

    // 5. Dark / Light Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if(themeToggle) themeToggle.textContent = currentTheme === 'dark' ? '☀️ Light' : '🌓 Dark';
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = '☀️ Light';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = '🌓 Dark';
            }
        });
    }

    // 6. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    revealElements.forEach(element => revealObserver.observe(element));

    // 7. Tombol Like Bawaan HTML Statis
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLiked = btn.getAttribute('data-liked') === 'true';
            const countSpan = btn.querySelector('.like-count');
            let currentCount = parseInt(countSpan.textContent) || 0;
            if (!isLiked) {
                btn.setAttribute('data-liked', 'true');
                countSpan.textContent = currentCount + 1;
                window.createFloatingHearts(e.clientX, e.clientY);
            } else {
                btn.setAttribute('data-liked', 'false');
                countSpan.textContent = currentCount - 1;
            }
        });
    });

    // 8. Logika Mood Meter
    const moodBtn = document.getElementById('moodBtn');
    const moodResult = document.getElementById('moodResult');
    const travelPredictions = [
        "🔮 Ramalan: Kamu lagi butuh 'Rebahan Berkedok Staycation' di hotel bintang 5 yang bantalnya empuk banget, minimal 3 hari gak usah mikirin tugas/kerjaan!",
        "🔮 Ramalan: Tingkat stresmu butuh diobati dengan 'Wisata Kulineran Malem' sampe kenyang bgt, trus besoknya nyesel pas nimbang berat badan. Klasik.",
        "🔮 Ramalan: Wah, kamu butuh ke Pantai dengerin suara ombak biar tenang, sekalian hunting foto estetik buat nyindir orang yang udah bikin kamu kesel!",
        "🔮 Ramalan: Kamu butuh kabur ke Gunung yang dingin, pake syal tebel, trus melamun estetik ala-ala video klip indie sambil nungguin jodoh dateng.",
        "🔮 Ramalan: Fix! Kamu cuma butuh 'Mall Keliling Seharian', beli jajanan manis, trus beli baju baru yang sebenernya ga butuh-butuh banget tapi bikin seneng."
    ];
    if (moodBtn && moodResult) {
        moodBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * travelPredictions.length);
            moodResult.textContent = travelPredictions[randomIndex];
            moodResult.classList.remove('hidden');
        });
    }

    // 9. Secret Message Box (FormSubmit Fetch)
    const secretForm = document.getElementById('secretForm');
    const secretInput = document.getElementById('secretInput');
    const secretSuccess = document.getElementById('secretSuccess');
    if (secretForm) {
        secretForm.addEventListener('submit', function(e) {
            e.preventDefault();
            fetch(secretForm.action, { method: 'POST', body: new FormData(secretForm) })
            .then(response => {
                if (response.ok) {
                    if (secretSuccess) secretSuccess.classList.remove('hidden');
                    if (secretInput) secretInput.value = "";
                    setTimeout(() => { if (secretSuccess) secretSuccess.classList.add('hidden'); }, 4000);
                } else { alert("Waduh, ada gangguan sistem. Coba lagi nanti ya! 😢"); }
            }).catch(() => { alert("Gagal mengirim, periksa koneksi internetmu! 🌐"); });
        });
    }

    // 10. Lightbox Overlay Gambar Utama
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    document.querySelectorAll('.clickable-img').forEach(img => {
        img.addEventListener('click', () => {
            if (lightbox && lightboxImg && lightboxCaption) {
                lightbox.classList.remove('hidden');
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt || "";
                document.body.style.overflow = 'hidden';
            }
        });
    });
    const closeLightbox = () => {
        if (lightbox) { lightbox.classList.add('hidden'); document.body.style.overflow = ''; }
    };
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
        });
    }

    // 11. Login Admin & Otentikasi Akun (Asya & Aziz)
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const adminPanel = document.getElementById('adminPanel');
    const logoutBtn = document.getElementById('logoutBtn');

    if (sessionStorage.getItem('isAdmin') === 'true') showAdminMode();
    if (adminLoginBtn && loginModal) adminLoginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    if (closeLogin && loginModal) closeLogin.addEventListener('click', () => loginModal.classList.add('hidden'));

    if (submitLoginBtn) {
        submitLoginBtn.addEventListener('click', () => {
            if (usernameInput.value.trim() === 'asya' && passwordInput.value.trim() === 'azizganteng') {
                alert('Otentikasi Berhasil! Selamat datang di Mode Admin ✨');
                sessionStorage.setItem('isAdmin', 'true');
                showAdminMode();
                if (loginModal) loginModal.classList.add('hidden');
                usernameInput.value = ''; passwordInput.value = '';
            } else { alert('Username atau Sandi salah! Tolong periksa kembali ❌'); }
        });
    }
    function showAdminMode() {
        if (adminPanel) { adminPanel.classList.remove('hidden'); adminPanel.classList.add('active'); }
        if (adminLoginBtn) adminLoginBtn.classList.add('hidden');
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdmin');
            if (adminPanel) adminPanel.classList.add('hidden');
            if (adminLoginBtn) adminLoginBtn.classList.remove('hidden');
            alert('Keluar dari Mode Admin. Keamanan terkunci kembali! 🔒');
        });
    }
});
