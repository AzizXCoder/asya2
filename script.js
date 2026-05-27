document.addEventListener('DOMContentLoaded', () => {

    // === 1. FITUR LOADING SCREEN (PRELOADER) ===
    const preloader = document.getElementById('preloader');
    
    // Hilangkan loading screen saat seluruh aset web (gambar, font) kelar di-load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
            // Mulai efek ketikan setelah preloader menghilang
            typeEffect();
        }, 600); // Memberi jeda visual halus
    });


    // === 2. FITUR TYPEWRITER EFFECT ===
    const titleElement = document.getElementById('typewriter-title');
    const textToType = "Buku Harian Si Cantik ✨";
    let index = 0;

    function typeEffect() {
        if (index < textToType.length) {
            titleElement.textContent += textToType.charAt(index);
            index++;
            setTimeout(typeEffect, 120);
        }
    }


    // === 3. FITUR EFEK PARALLAX DI HERO HEADER ===
    const heroElement = document.getElementById('parallax-hero');
    
    window.addEventListener('scroll', () => {
        let scrollValue = window.scrollY;
        // Geser posisi vertikal background hero sedikit lebih lambat dari scroll utama
        if (heroElement && scrollValue <= 500) {
            heroElement.style.transform = `translateY(${scrollValue * 0.25}px)`;
        }
    });


    // === 4. FITUR FILTER MENU KATEGORI ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus kelas aktif dari tombol lain, pindahkan ke yang diklik
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide-card');
                    // Picu ulang efek scroll reveal agar langsung muncul mulus
                    card.classList.add('active');
                } else {
                    card.classList.add('hide-card');
                }
            });
        });
    });


    // === 5. FITUR DARK / LIGHT MODE TOGGLE ===
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


    // === 6. FITUR ANIMASI MUNCUL PAS DI-SCROLL (SCROLL REVEAL) ===
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // === 7. FITUR TOMBOL LIKE + FLOATING HEARTS EFFECT ===
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLiked = btn.getAttribute('data-liked') === 'true';
            const countSpan = btn.querySelector('.like-count');
            let currentCount = parseInt(countSpan.textContent);

            if (!isLiked) {
                btn.setAttribute('data-liked', 'true');
                countSpan.textContent = currentCount + 1;
                createFloatingHearts(e.clientX, e.clientY);
            } else {
                btn.setAttribute('data-liked', 'false');
                countSpan.textContent = currentCount - 1;
            }
        });
    });

    function createFloatingHearts(x, y) {
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
    }


    // === 8. LOGIKA MOOD METER ===
    const moodBtn = document.getElementById('moodBtn');
    const moodResult = document.getElementById('moodResult');
    const travelPredictions = [
        "🔮 Ramalan: Kamu lagi butuh 'Rebahan Berkedok Staycation' di hotel bintang 5 yang bantalnya empuk banget, minimal 3 hari gak usah mikirin tugas/kerjaan!",
        "🔮 Ramalan: Tingkat stresmu butuh diobati dengan 'Wisata Kulineran Malem' sampe kenyang bgt, trus besoknya nyesel pas nimbang berat badan. Klasik.",
        "🔮 Ramalan: Wah, kamu butuh ke Pantai dengerin suara ombak biar tenang, sekalian hunting foto estetik buat nyindir orang yang udah bikin kamu kesel!",
        "🔮 Ramalan: Kamu butuh kabur ke Gunung yang dingin, pake syal tebel, trus melamun estetik ala-ala video klip indie sambil nungguin jodoh dateng.",
        "🔮 Ramalan: Fix! Kamu cuma butuh 'Mall Keliling Seharian', beli jajanan manis, trus beli baju baru yang sebenernya ga butuh-butuh banget tapi bikin seneng."
    ];

    if (moodBtn) {
        moodBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * travelPredictions.length);
            moodResult.textContent = travelPredictions[randomIndex];
            moodResult.classList.remove('hidden');
        });
    }


    // === 9. LOGIKA KOTAK PESAN RAHASIA (SECRET MESSAGE WITH FORMSUBMIT) ===
    const secretForm = document.getElementById('secretForm');
    const secretInput = document.getElementById('secretInput');
    const secretSuccess = document.getElementById('secretSuccess');

    if (secretForm) {
        secretForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Menahan halaman agar tidak pindah/refresh otomatis

            // Mengirim data form secara background (AJAX) ke FormSubmit
            fetch(secretForm.action, {
                method: 'POST',
                body: new FormData(secretForm)
            })
            .then(response => {
                if (response.ok) {
                    // Munculkan notifikasi sukses di web
                    secretSuccess.classList.remove('hidden');
                    secretInput.value = ""; // Kosongkan inputan teks
                    
                    // Sembunyikan notifikasi sukses kembali setelah 4 detik
                    setTimeout(() => {
                        secretSuccess.classList.add('hidden');
                    }, 4000);
                } else {
                    alert("Waduh, ada gangguan sistem. Coba lagi nanti ya! 😢");
                }
            })
            .catch(error => {
                alert("Gagal mengirim, periksa koneksi internetmu! 🌐");
            });
        });
    }


    // === 10. LOGIKA LIGHTBOX OVERLAY ===
    const images = document.querySelectorAll('.clickable-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    images.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.classList.remove('hidden');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) {
                closeLightbox();
            }
        });
    }


    // === 11. SISTEM LOGIN ADMIN & OTENTIKASI (ASYA & AZIZ) ===
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    
    const adminPanel = document.getElementById('adminPanel');
    const logoutBtn = document.getElementById('logoutBtn');

    // Cek Status Kredensial Saat Halaman Direfresh / Dimuat Ulang
    if (sessionStorage.getItem('isAdmin') === 'true') {
        showAdminMode();
    }

    // Buka & Tutup Pop-up Box Login
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    }
    if (closeLogin) {
        closeLogin.addEventListener('click', () => loginModal.classList.add('hidden'));
    }

    // Validasi Login Akun Admin
    if (submitLoginBtn) {
        submitLoginBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (username === 'asya' && password === 'azizganteng') {
                alert('Otentikasi Berhasil! Selamat datang di Mode Admin ✨');
                sessionStorage.setItem('isAdmin', 'true');
                showAdminMode();
                loginModal.classList.add('hidden');
                usernameInput.value = '';
                passwordInput.value = '';
            } else {
                alert('Username atau Sandi salah! Tolong periksa kembali ❌');
            }
        });
    }

    // Prosedur Aktivasi Dashboard Admin
    function showAdminMode() {
        adminPanel.classList.remove('hidden');
        adminPanel.classList.add('active'); 
        if (adminLoginBtn) adminLoginBtn.classList.add('hidden');
    }

    // Prosedur Log Out Panel Admin
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdmin');
            adminPanel.classList.add('hidden');
            if (adminLoginBtn) adminLoginBtn.classList.remove('hidden');
            alert('Keluar dari Mode Admin. Keamanan terkunci kembali! 🔒');
        });
    }


    // === 12. LOGIKA PANEL ADMIN: SUBMIT KONTEN BARU SECARA INSTAN ===
    const cardsColumn = document.querySelector('.cards-column');
    const sidebarColumn = document.querySelector('.sidebar-column');

    // Submit Kartu Dokumentasi Perjalanan Baru
    const saveCardBtn = document.getElementById('saveCardBtn');
    if (saveCardBtn) {
        saveCardBtn.addEventListener('click', () => {
            const loc = document.getElementById('newCardLoc').value.trim();
            const img = document.getElementById('newCardImg').value.trim() || 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80';
            const highlight = document.getElementById('newCardHighlight').value.trim();
            const story = document.getElementById('newCardStory').value.trim();
            const category = document.getElementById('newCardCategory').value;

            if (!loc || !highlight || !story) {
                alert('Harap isi semua teks box petualangan terlebih dahulu! ⚠️');
                return;
            }

            // Injeksi Kode Elemen Kartu Baru Sesuai Kerangka Baku Awal
            const newCard = document.createElement('article');
            newCard.className = 'card active'; 
            newCard.setAttribute('data-category', category);
            newCard.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${img}" alt="${loc}" class="card-img clickable-img">
                    <span class="card-location">📍 ${loc}</span>
                    <button class="like-btn" data-liked="false">
                        <span class="heart-icon">❤️</span> <span class="like-count">0</span>
                    </button>
                </div>
                <div class="card-content">
                    <div class="highlight-box">
                        <span class="highlight-badge">HIGHLIGHT MENARIK 🌟</span>
                        <p class="highlight-text">"${highlight}"</p>
                    </div>
                    <h3 class="story-title">Behind The Scene 🎬</h3>
                    <p class="story-text">${story}</p>
                </div>
            `;

            // Pasang fungsi klik Like dan zoom Lightbox pada kartu baru
            bindNewCardEvents(newCard);

            // Letakkan di tumpukan paling atas seksi Jejak Kaki
            cardsColumn.insertBefore(newCard, cardsColumn.children[1]);
            
            // Pembersihan Form Input
            document.getElementById('newCardLoc').value = '';
            document.getElementById('newCardImg').value = '';
            document.getElementById('newCardHighlight').value = '';
            document.getElementById('newCardStory').value = '';
            alert('Jejak Kaki baru berhasil dipublikasikan! 🐾✨');
        });
    }

    // Submit Catatan Pikiran Random Baru ke Sidebar
    const saveThoughtBtn = document.getElementById('saveThoughtBtn');
    if (saveThoughtBtn) {
        saveThoughtBtn.addEventListener('click', () => {
            const text = document.getElementById('newThoughtText').value.trim();
            const meta = document.getElementById('newThoughtMeta').value.trim() || '— Baru Saja';

            if (!text) {
                alert('Isi pikiranmu tidak boleh kosong, Admin! 🧠');
                return;
            }

            const newThought = document.createElement('div');
            newThought.className = 'thought-box pop-box active';
            newThought.innerHTML = `
                <div class="quote-mark">“</div>
                <p class="thought-text-content">"${text}"</p>
                <span class="thought-meta">${meta}</span>
            `;

            // Letakkan di posisi paling atas seksi Pikiran Random Sidebar
            sidebarColumn.insertBefore(newThought, sidebarColumn.children[1]);

            // Pembersihan Form Input
            document.getElementById('newThoughtText').value = '';
            document.getElementById('newThoughtMeta').value = '';
            alert('Isi pikiran acak berhasil ditambahkan ke sidebar! 🧠💭');
        });
    }

    // Fungsi pembantu untuk mengaktifkan sistem interaksi Like & Zoom pada konten buatan admin
    function bindNewCardEvents(cardElement) {
        // Event Handler Tombol Like
        const likeBtn = cardElement.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLiked = likeBtn.getAttribute('data-liked') === 'true';
            const countSpan = likeBtn.querySelector('.like-count');
            let currentCount = parseInt(countSpan.textContent);
            if (!isLiked) {
                likeBtn.setAttribute('data-liked', 'true');
                countSpan.textContent = currentCount + 1;
                createFloatingHearts(e.clientX, e.clientY);
            } else {
                likeBtn.setAttribute('data-liked', 'false');
                countSpan.textContent = currentCount - 1;
            }
        });

        // Event Handler Gambar Zoom Lightbox
        const img = cardElement.querySelector('.clickable-img');
        img.addEventListener('click', () => {
            lightbox.classList.remove('hidden');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            document.body.style.overflow = 'hidden';
        });
    }
});

// === 12. LOGIKA KONEKSI EVENT INTERAKSI KONTEN BARU ===
    // Fungsi ini dipasang secara global agar script module di HTML bisa memanggil fitur Like & Lightbox
    window.bindNewCardEvents = function(cardElement) {
        // Logika Like
        const likeBtn = cardElement.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isLiked = likeBtn.getAttribute('data-liked') === 'true';
                const countSpan = likeBtn.querySelector('.like-count');
                let currentCount = parseInt(countSpan.textContent);
                if (!isLiked) {
                    likeBtn.setAttribute('data-liked', 'true');
                    countSpan.textContent = currentCount + 1;
                    createFloatingHearts(e.clientX, e.clientY);
                } else {
                    likeBtn.setAttribute('data-liked', 'false');
                    countSpan.textContent = currentCount - 1;
                }
            });
        }

        // Logika Lightbox Zoom Gambar
        const img = cardElement.querySelector('.clickable-img');
        if (img) {
            img.addEventListener('click', () => {
                lightbox.classList.remove('hidden');
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt;
                document.body.style.overflow = 'hidden';
            });
        }
    };