// ===== КОНСТАНТЫ И ПЕРЕМЕННЫЕ =====
const STORAGE_KEY = 'moros_full_site_data';
const ADMIN_PASSWORD = 'morosstyagi2008'; // Смените этот пароль!

let currentData = {};
let currentTrack = null;
let isPlaying = false;
let currentSection = 'home';

// ===== ДАННЫЕ ПО УМОЛЧАНИЮ =====
const defaultData = {
    profile: {
        name: "Sentinel",
        bio: "Создаю крутые проекты. Люблю музыку и технологии.",
        avatar: "assets/avatar.jpg",
        followers: 1200
    },
    links: [
        {
            id: 1,
            title: "Telegram",
            url: "https://t.me/mychannel",
            icon: "fab fa-telegram",
            description: "Мой основной канал",
            color: "#0088cc"
        },
        {
            id: 2,
            title: "GitHub",
            url: "https://github.com/myprofile",
            icon: "fab fa-github",
            description: "Мои проекты",
            color: "#181717"
        },
        {
            id: 3,
            title: "YouTube",
            url: "https://youtube.com/@mychannel",
            icon: "fab fa-youtube",
            description: "Видео и стримы",
            color: "#ff0000"
        }
    ],
    music: [
        {
            id: 1,
            title: "Любимая песня",
            artist: "Мой любимый исполнитель",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
        },
        {
            id: 2,
            title: "Еще один трек",
            artist: "Другой артист",
            url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
            cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w-400"
        }
    ],
    posts: [
        {
            id: 1,
            title: "Добро пожаловать на мой сайт!",
            content: "Привет! Это мой новый сайт со ссылками, музыкой и постами. Буду рад общению!",
            date: "2024-01-15",
            likes: 42,
            image: ""
        },
        {
            id: 2,
            title: "Новый проект запущен",
            content: "Только что запустил новый проект. Следите за обновлениями!",
            date: "2024-01-10",
            likes: 28,
            image: ""
        }
    ],
    settings: {
        themeColor: "#6c5ce7",
        requirePassword: true
    }
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initNavigation();
    setupEventListeners();
    updateCurrentYear();
    
    // Проверяем пароль в URL (для быстрого доступа)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === ADMIN_PASSWORD) {
        toggleAdminPanel();
    }
    
    console.log('Сайт загружен! Пароль админа:', ADMIN_PASSWORD);
});

// ===== УПРАВЛЕНИЕ ДАННЫМИ =====
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    currentData = saved ? JSON.parse(saved) : defaultData;
    
    updateProfile();
    renderLinks();
    renderMusic();
    renderPosts();
    updateCounts();
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    console.log('Данные сохранены');
}

function exportAllData() {
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'moros-site-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Данные экспортированы в файл!');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                currentData = importedData;
                saveData();
                loadData();
                alert('Данные успешно импортированы!');
            } catch (error) {
                alert('Ошибка при импорте данных: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// ===== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА =====
function updateProfile() {
    document.getElementById('profileName').textContent = currentData.profile.name;
    document.getElementById('profileBio').textContent = currentData.profile.bio;
    document.getElementById('profileAvatar').src = currentData.profile.avatar;
    
    // Заполняем админ-форму
    document.getElementById('adminName').value = currentData.profile.name;
    document.getElementById('adminBio').value = currentData.profile.bio;
    document.getElementById('adminAvatar').value = currentData.profile.avatar;
    document.getElementById('adminFollowers').value = currentData.profile.followers;
}

function updateCounts() {
    document.getElementById('followersCount').textContent = 
        currentData.profile.followers >= 1000 ? 
        (currentData.profile.followers / 1000).toFixed(1) + 'K' : 
        currentData.profile.followers;
    
    document.getElementById('linksCount').textContent = currentData.links.length;
    document.getElementById('tracksCount').textContent = currentData.music.length;
}

function renderLinks() {
    const container = document.getElementById('linksContainer');
    const preview = document.getElementById('linksContainer'); // Для главной страницы
    
    if (!container) return;
    
    container.innerHTML = '';
    
    currentData.links.forEach(link => {
        const linkCard = document.createElement('a');
        linkCard.href = link.url;
        linkCard.target = '_blank';
        linkCard.className = 'link-card';
        
        linkCard.innerHTML = `
            <div class="link-icon" style="background: ${link.color}20; color: ${link.color}">
                <i class="${link.icon}"></i>
            </div>
            <div class="link-content">
                <h3>${link.title}</h3>
                <p>${link.description}</p>
            </div>
            <div class="link-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        `;
        
        container.appendChild(linkCard);
    });
    
    // Обновляем админ-панель
    renderAdminLinks();
}

function renderMusic() {
    const preview = document.getElementById('musicPreview');
    const playlist = document.getElementById('playlist');
    const adminList = document.getElementById('adminMusicList');
    
    // Превью на главной (3 трека)
    if (preview) {
        preview.innerHTML = '';
        currentData.music.slice(0, 3).forEach((track, index) => {
            const trackEl = document.createElement('div');
            trackEl.className = 'track-preview';
            trackEl.onclick = () => playTrack(index);
            
            trackEl.innerHTML = `
                <div class="track-cover" style="background-image: url(${track.cover})">
                    ${!track.cover ? '<i class="fas fa-music"></i>' : ''}
                </div>
                <div class="track-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
            `;
            
            if (track.cover) {
                trackEl.querySelector('.track-cover').style.backgroundImage = `url(${track.cover})`;
            }
            
            preview.appendChild(trackEl);
        });
    }
    
    // Полный плейлист
    if (playlist) {
        playlist.innerHTML = '';
        currentData.music.forEach((track, index) => {
            const trackEl = document.createElement('div');
            trackEl.className = `playlist-track ${index === currentTrack ? 'active' : ''}`;
            trackEl.onclick = () => playTrack(index);
            
            trackEl.innerHTML = `
                <div class="track-left">
                    <div class="track-num">${index + 1}</div>
                    <div>
                        <h4>${track.title}</h4>
                        <p>${track.artist}</p>
                    </div>
                </div>
                <div class="track-actions">
                    <button class="track-btn" onclick="editTrack(${track.id}); event.stopPropagation()">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="track-btn" onclick="deleteTrack(${track.id}); event.stopPropagation()">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            playlist.appendChild(trackEl);
        });
    }
    
    // Админ-панель
    renderAdminMusic();
}

function renderPosts() {
    const container = document.getElementById('postsContainer');
    const adminList = document.getElementById('adminPostsList');
    
    if (container) {
        container.innerHTML = '';
        
        currentData.posts.forEach(post => {
            const postEl = document.createElement('article');
            postEl.className = 'post-card';
            
            const postDate = new Date(post.date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            postEl.innerHTML = `
                <div class="post-header">
                    <div class="post-meta">
                        <div class="post-author">
                            <img src="${currentData.profile.avatar}" alt="Аватар" class="author-avatar">
                            <div>
                                <strong>${currentData.profile.name}</strong>
                                <div class="post-date">${postDate}</div>
                            </div>
                        </div>
                    </div>
                    <div class="post-actions">
                        <button class="item-btn" onclick="editPost(${post.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="item-btn" onclick="deletePost(${post.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <div class="post-content">${post.content}</div>
                ${post.image ? `<img src="${post.image}" alt="Изображение поста" class="post-image">` : ''}
                <div class="post-footer">
                    <button class="like-btn" onclick="likePost(${post.id})">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button class="item-btn" onclick="sharePost(${post.id})">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(postEl);
        });
    }
    
    // Админ-панель
    renderAdminPosts();
}

// ===== АДМИН-ПАНЕЛЬ =====
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    const password = prompt('Введите пароль админа:', '');
    
    if (password === ADMIN_PASSWORD) {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            openAdminTab('profile');
        }
    } else if (password !== null) {
        alert('Неверный пароль!');
    }
}

function openAdminTab(tabName) {
    // Скрыть все вкладки
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    document.getElementById('admin' + capitalizeFirst(tabName)).classList.add('active');
    document.querySelector(`[onclick="openAdminTab('${tabName}')"]`).classList.add('active');
    
    // Обновить данные если нужно
    if (tabName === 'links') renderAdminLinks();
    if (tabName === 'music') renderAdminMusic();
    if (tabName === 'posts') renderAdminPosts();
}

function renderAdminLinks() {
    const list = document.getElementById('adminLinksList');
    if (!list) return;
    
    list.innerHTML = '';
    
    currentData.links.forEach(link => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div>
                <strong>${link.title}</strong>
                <div style="font-size: 0.9em; color: var(--text-secondary)">${link.url}</div>
            </div>
            <div class="item-actions">
                <button class="item-btn" onclick="editLink(${link.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-btn" onclick="deleteLink(${link.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function renderAdminMusic() {
    const list = document.getElementById('adminMusicList');
    if (!list) return;
    
    list.innerHTML = '';
    
    currentData.music.forEach(track => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div>
                <strong>${track.title}</strong>
                <div style="font-size: 0.9em; color: var(--text-secondary)">${track.artist}</div>
            </div>
            <div class="item-actions">
                <button class="item-btn" onclick="editTrack(${track.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-btn" onclick="deleteTrack(${track.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function renderAdminPosts() {
    const list = document.getElementById('adminPostsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    currentData.posts.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString('ru-RU');
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div style="flex: 1;">
                <strong>${post.title}</strong>
                <div style="font-size: 0.9em; color: var(--text-secondary)">
                    ${postDate} • ❤️ ${post.likes}
                </div>
            </div>
            <div class="item-actions">
                <button class="item-btn" onclick="editPost(${post.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-btn" onclick="deletePost(${post.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

// ===== УПРАВЛЕНИЕ ССЫЛКАМИ =====
function showLinkEditor(linkId = null) {
    const modal = document.getElementById('linkModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (linkId) {
        // Редактирование существующей ссылки
        const link = currentData.links.find(l => l.id === linkId);
        if (link) {
            document.getElementById('linkTitle').value = link.title;
            document.getElementById('linkUrl').value = link.url;
            document.getElementById('linkIcon').value = link.icon;
            document.getElementById('linkDesc').value = link.description;
            document.getElementById('linkModal').dataset.editId = linkId;
        }
    } else {
        // Новая ссылка
        document.getElementById('linkTitle').value = '';
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkIcon').value = 'fab fa-telegram';
        document.getElementById('linkDesc').value = '';
        delete document.getElementById('linkModal').dataset.editId;
    }
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function saveLink() {
    const title = document.getElementById('linkTitle').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const icon = document.getElementById('linkIcon').value;
    const desc = document.getElementById('linkDesc').value.trim();
    const editId = document.getElementById('linkModal').dataset.editId;
    
    if (!title || !url) {
        alert('Заполните название и URL');
        return;
    }
    
    const colors = {
        'fab fa-telegram': '#0088cc',
        'fab fa-discord': '#5865f2',
        'fab fa-github': '#181717',
        'fab fa-youtube': '#ff0000',
        'fab fa-vk': '#4c75a3',
        'fab fa-instagram': '#e1306c',
        'fab fa-twitter': '#1da1f2',
        'fab fa-spotify': '#1db954',
        'fas fa-globe': '#6c5ce7'
    };
    
    const newLink = {
        id: editId ? parseInt(editId) : Date.now(),
        title,
        url,
        icon,
        description: desc,
        color: colors[icon] || '#6c5ce7'
    };
    
    if (editId) {
        // Обновление
        const index = currentData.links.findIndex(l => l.id === parseInt(editId));
        if (index !== -1) {
            currentData.links[index] = newLink;
        }
    } else {
        // Добавление
        currentData.links.push(newLink);
    }
    
    saveData();
    renderLinks();
    updateCounts();
    closeModal();
}

function editLink(id) {
    showLinkEditor(id);
}

function deleteLink(id) {
    if (confirm('Удалить эту ссылку?')) {
        currentData.links = currentData.links.filter(link => link.id !== id);
        saveData();
        renderLinks();
        updateCounts();
    }
}

function addNewLink() {
    showLinkEditor();
}

// ===== УПРАВЛЕНИЕ МУЗЫКОЙ =====
function showMusicEditor(trackId = null) {
    const modal = document.getElementById('musicModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (trackId) {
        const track = currentData.music.find(t => t.id === trackId);
        if (track) {
            document.getElementById('musicTitle').value = track.title;
            document.getElementById('musicArtist').value = track.artist;
            document.getElementById('musicUrl').value = track.url;
            document.getElementById('musicCover').value = track.cover || '';
            document.getElementById('musicModal').dataset.editId = trackId;
        }
    } else {
        document.getElementById('musicTitle').value = '';
        document.getElementById('musicArtist').value = '';
        document.getElementById('musicUrl').value = '';
        document.getElementById('musicCover').value = '';
        delete document.getElementById('musicModal').dataset.editId;
    }
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function saveTrack() {
    const title = document.getElementById('musicTitle').value.trim();
    const artist = document.getElementById('musicArtist').value.trim();
    const url = document.getElementById('musicUrl').value.trim();
    const cover = document.getElementById('musicCover').value.trim();
    const editId = document.getElementById('musicModal').dataset.editId;
    
    if (!title || !artist || !url) {
        alert('Заполните название, исполнителя и URL');
        return;
    }
    
    const newTrack = {
        id: editId ? parseInt(editId) : Date.now(),
        title,
        artist,
        url,
        cover: cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&random=${Date.now()}`
    };
    
    if (editId) {
        const index = currentData.music.findIndex(t => t.id === parseInt(editId));
        if (index !== -1) {
            currentData.music[index] = newTrack;
        }
    } else {
        currentData.music.push(newTrack);
    }
    
    saveData();
    renderMusic();
    updateCounts();
    closeModal();
}

function editTrack(id) {
    showMusicEditor(id);
}

function deleteTrack(id) {
    if (confirm('Удалить этот трек?')) {
        currentData.music = currentData.music.filter(track => track.id !== id);
        if (currentTrack !== null && currentData.music[currentTrack]?.id === id) {
            stopMusic();
        }
        saveData();
        renderMusic();
        updateCounts();
    }
}

function addNewTrack() {
    showMusicEditor();
}

// ===== УПРАВЛЕНИЕ ПОСТАМИ =====
function showPostEditor(postId = null) {
    const modal = document.getElementById('postModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (postId) {
        const post = currentData.posts.find(p => p.id === postId);
        if (post) {
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').value = post.content;
            document.getElementById('postImage').value = post.image || '';
            document.getElementById('postModal').dataset.editId = postId;
        }
    } else {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postImage').value = '';
        delete document.getElementById('postModal').dataset.editId;
    }
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function publishPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const image = document.getElementById('postImage').value.trim();
    const editId = document.getElementById('postModal').dataset.editId;
    
    if (!title || !content) {
        alert('Заполните заголовок и текст поста');
        return;
    }
    
    const newPost = {
        id: editId ? parseInt(editId) : Date.now(),
        title,
        content,
        date: new Date().toISOString().split('T')[0],
        likes: editId ? currentData.posts.find(p => p.id === parseInt(editId))?.likes || 0 : 0,
        image
    };
    
    if (editId) {
        const index = currentData.posts.findIndex(p => p.id === parseInt(editId));
        if (index !== -1) {
            currentData.posts[index] = newPost;
        }
    } else {
        currentData.posts.unshift(newPost); // Добавляем в начало
    }
    
    saveData();
    renderPosts();
    closeModal();
}

function editPost(id) {
    showPostEditor(id);
}

function deletePost(id) {
    if (confirm('Удалить этот пост?')) {
        currentData.posts = currentData.posts.filter(post => post.id !== id);
        saveData();
        renderPosts();
    }
}

function likePost(id) {
    const post = currentData.posts.find(p => p.id === id);
    if (post) {
        post.likes++;
        saveData();
        renderPosts();
    }
}

function sharePost(id) {
    const post = currentData.posts.find(p => p.id === id);
    if (post) {
        const url = window.location.href.split('?')[0] + '?post=' + id;
        navigator.clipboard.writeText(url).then(() => {
            alert('Ссылка на пост скопирована!');
        });
    }
}

function createNewPost() {
    showPostEditor();
}

// ===== МУЗЫКАЛЬНЫЙ ПЛЕЕР =====
function playTrack(index) {
    const track = currentData.music[index];
    if (!track) return;
    
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.querySelector('.play-btn i');
    
    currentTrack = index;
    
    // Обновляем интерфейс
    document.getElementById('currentTitle').textContent = track.title;
    document.getElementById('currentArtist').textContent = track.artist;
    
    const coverEl = document.getElementById('currentCover');
    if (track.cover) {
        coverEl.style.backgroundImage = `url(${track.cover})`;
        coverEl.innerHTML = '';
    } else {
        coverEl.style.backgroundImage = '';
        coverEl.innerHTML = '<i class="fas fa-music"></i>';
    }
    
    // Обновляем активный трек в плейлисте
    document.querySelectorAll('.playlist-track').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
    
    // Устанавливаем источник
    audio.src = track.url;
    
    // Воспроизводим
    audio.play();
    isPlaying = true;
    playBtn.className = 'fas fa-pause';
}

function togglePlay() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.querySelector('.play-btn i');
    
    if (!audio.src) {
        if (currentData.music.length > 0) {
            playTrack(0);
        }
        return;
    }
    
    if (isPlaying) {
        audio.pause();
        playBtn.className = 'fas fa-play';
    } else {
        audio.play();
        playBtn.className = 'fas fa-pause';
    }
    
    isPlaying = !isPlaying;
}

function playNext() {
    if (currentTrack === null || currentData.music.length === 0) return;
    
    const nextIndex = (currentTrack + 1) % currentData.music.length;
    playTrack(nextIndex);
}

function playPrev() {
    if (currentTrack === null || currentData.music.length === 0) return;
    
    const prevIndex = currentTrack === 0 ? currentData.music.length - 1 : currentTrack - 1;
    playTrack(prevIndex);
}

function changeVolume(value) {
    const audio = document.getElementById('audioPlayer');
    audio.volume = value / 100;
}

function stopMusic() {
    const audio = document.getElementById('audioPlayer');
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    document.querySelector('.play-btn i').className = 'fas fa-play';
}

// Аудио события
document.getElementById('audioPlayer').addEventListener('ended', playNext);

// ===== ПРОФИЛЬ И НАСТРОЙКИ =====
function saveProfile() {
    const name = document.getElementById('adminName').value.trim();
    const bio = document.getElementById('adminBio').value.trim();
    const avatar = document.getElementById('adminAvatar').value.trim();
    const followers = parseInt(document.getElementById('adminFollowers').value) || 0;
    
    if (!name) {
        alert('Введите имя');
        return;
    }
    
    currentData.profile = { name, bio, avatar, followers };
    saveData();
    updateProfile();
    updateCounts();
    alert('Профиль сохранен!');
}

function saveSettings() {
    const password = document.getElementById('adminPassword').value;
    const themeColor = document.getElementById('themeColor').value;
    
    if (password) {
        // В реальном приложении нужно хэшировать пароль
        alert('Пароль изменен! (в демо-версии не сохраняется)');
    }
    
    currentData.settings.themeColor = themeColor;
    saveData();
    applyThemeColor(themeColor);
    alert('Настройки сохранены!');
}

function applyThemeColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-light', adjustColor(color, 30));
}

function adjustColor(color, amount) {
    // Простая функция для осветления цвета
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
}

// ===== НАВИГАЦИЯ И ТЕМА =====
function initNavigation() {
    // Навигация по якорям
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Обновляем активные ссылки
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Показываем нужную секцию
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                currentSection = targetId;
            }
            
            // Прокрутка вверх
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = document.querySelector('.theme-toggle-btn i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Загрузка темы
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.querySelector('.theme-toggle-btn i').className = 'fas fa-sun';
}

// ===== УТИЛИТЫ =====
function setupEventListeners() {
    // Закрытие модалок
    document.getElementById('modalOverlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            toggleAdminPanel();
        }
    });
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.getElementById('modalOverlay').style.display = 'none';
}

function updateCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}