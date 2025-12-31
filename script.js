// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Меняем иконку кнопки
    const icon = document.querySelector('.theme-toggle i');
    if (isDark) {
        icon.className = 'fas fa-sun';
        document.querySelector('.theme-toggle button').innerHTML = '<i class="fas fa-sun"></i> Тема';
    } else {
        icon.className = 'fas fa-moon';
        document.querySelector('.theme-toggle button').innerHTML = '<i class="fas fa-moon"></i> Тема';
    }
}

// Загрузка темы из localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-toggle button').innerHTML = '<i class="fas fa-sun"></i> Тема';
    }
    
    // Простая анимация появления элементов
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
});

// Обновление года в футере
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.querySelector('.copyright');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = `© ${currentYear} • Сделано с ❤️`;
    }
});
