// ========== КОНФИГУРАЦИЯ ==========
const ADMIN_PASSWORD = "morosstyagi2008"; // Смените этот пароль!
const STORAGE_KEY = "moros_links_data";

// ========== ПЕРЕМЕННЫЕ ==========
let linksData = [];

// ========== ДАННЫЕ ПО УМОЛЧАНИЮ ==========
const defaultData = {
    name: "Ваше Имя",
    bio: "Дизайнер, разработчик, создатель контента. Здесь все мои важные ссылки.",
    avatar: "assets/avatar.jpg",
    links: [
        {
            title: "Телеграм-канал",
            url: "https://t.me/yourchannel",
            icon: "fab fa-telegram",
            description: "Анонсы, мысли и полезные материалы",
            color: "#0088cc"
        },
        {
            title: "Discord сервер",
            url: "https://discord.gg/yourinvite",
            icon: "fab fa-discord",
            description: "Сообщество для общения и помощи",
            color: "#5865f2"
        },
        {
            title: "GitHub",
            url: "https://github.com/yourprofile",
            icon: "fab fa-github",
            description: "Мои проекты и исходный код",
            color: "#181717"
        },
        {
            title: "YouTube",
            url: "https://youtube.com/@yourchannel",
            icon: "fab fa-youtube",
            description: "Обучающие видео и стримы",
            color: "#ff0000"
        },
        {
            title: "ВКонтакте",
            url: "https://vk.com/yourpage",
            icon: "fab fa-vk",
            description: "Основная социальная сеть",
            color: "#4c75a3"
        },
        {
            title: "Instagram",
            url: "https://instagram.com/yourprofile",
            icon: "fab fa-instagram",
            description: "Фото и короткие видео",
            color: "#e1306c"
        }
    ]
};

// ========== ЗАГРУЗКА ДАННЫХ ==========
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
        const data = JSON.parse(saved);
        applyData(data);
        linksData = data.links;
    } else {
        applyData(defaultData);
        linksData = defaultData.links;
        saveToLocalStorage();
    }
    
    renderLinks();
}

function applyData(data) {
    document.getElementById("name").textContent = data.name;
    document.getElementById("bio").textContent = data.bio;
    document.getElementById("avatar").src = data.avatar;
}

// ========== ОТОБРАЖЕНИЕ ССЫЛОК ==========
function renderLinks() {
    const container = document.querySelector(".links-grid");
    container.innerHTML = "";
    
    linksData.forEach(link => {
        const linkCard = document.createElement("a");
        linkCard.href = link.url;
        linkCard.target = "_blank";
        linkCard.className = "link-card";
        
        // Определяем класс для цвета (для обратной совместимости)
        let colorClass = "";
        if (link.title.includes("Телеграм")) colorClass = "telegram";
        else if (link.title.includes("Discord")) colorClass = "discord";
        else if (link.title.includes("GitHub")) colorClass = "github";
        else if (link.title.includes("YouTube")) colorClass = "youtube";
        else if (link.title.includes("ВКонтакте")) colorClass = "vk";
        else if (link.title.includes("Instagram")) colorClass = "instagram";
        
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
}

// ========== АДМИН-ПАНЕЛЬ ==========
function showAdminPanel() {
    const password = prompt("Введите пароль для доступа к редактированию:", "");
    
    if (password === ADMIN_PASSWORD) {
        // Заполняем поля текущими данными
        const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
        
        document.getElementById("editName").value = currentData.name;
        document.getElementById("editBio").value = currentData.bio;
        document.getElementById("editAvatar").value = currentData.avatar;
        document.getElementById("editLinks").value = JSON.stringify(currentData.links, null, 2);
        
        document.getElementById("adminPanel").style.display = "block";
    } else if (password !== null) {
        alert("Неверный пароль!");
    }
}

function hideAdminPanel() {
    document.getElementById("adminPanel").style.display = "none";
}

function saveChanges() {
    try {
        const newData = {
            name: document.getElementById("editName").value,
            bio: document.getElementById("editBio").value,
            avatar: document.getElementById("editAvatar").value,
            links: JSON.parse(document.getElementById("editLinks").value)
        };
        
        // Валидация
        if (!newData.name.trim()) throw new Error("Введите имя");
        if (!Array.isArray(newData.links)) throw new Error("Ссылки должны быть массивом");
        
        // Сохраняем
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        linksData = newData.links;
        
        // Обновляем интерфейс
        applyData(newData);
        renderLinks();
        
        alert("Изменения сохранены!");
        hideAdminPanel();
        
    } catch (error) {
        alert("Ошибка: " + error.message);
    }
}

function exportData() {
    const data = localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "moros-site-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert("Данные экспортированы в файл!");
}

function saveToLocalStorage() {
    const data = {
        name: document.getElementById("name").textContent,
        bio: document.getElementById("bio").textContent,
        avatar: document.getElementById("avatar").src,
        links: linksData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ========== ГОРЯЧИЕ КЛАВИШИ ==========
document.addEventListener("keydown", function(event) {
    // Alt + A открывает админку
    if (event.altKey && event.key === "a") {
        event.preventDefault();
        showAdminPanel();
    }
    
    // Escape закрывает админку
    if (event.key === "Escape") {
        hideAdminPanel();
    }
});

// ========== ТЕМА ==========
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = document.querySelector('.theme-toggle i');
    const button = document.querySelector('.theme-toggle button');
    
    if (isDark) {
        icon.className = 'fas fa-sun';
        button.innerHTML = '<i class="fas fa-sun"></i> Тема';
    } else {
        icon.className = 'fas fa-moon';
        button.innerHTML = '<i class="fas fa-moon"></i> Тема';
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener("DOMContentLoaded", function() {
    // Загрузка темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-toggle button').innerHTML = '<i class="fas fa-sun"></i> Тема';
    }
    
    // Загрузка данных
    loadData();
    
    // Обновление года в футере
    const yearSpan = document.querySelector('.copyright');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = `© ${currentYear} • Сделано с ❤️`;
    }
    
    // Анимация появления
    const cards = document.querySelectorAll('.link-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    console.log("Сайт загружен! Используйте Alt+A для редактирования");
});