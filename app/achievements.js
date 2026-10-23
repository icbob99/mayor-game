function toggleAchievements(show) {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;

    if (show) {
        renderAchievements();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderAchievements() {
    if (!currentTexts?.ui.achievements) return;

    document.getElementById('achievements-title').innerText = `🏆 ${currentTexts.ui.achievements_title}`;
    document.getElementById('achievements-dismiss-btn').setAttribute('aria-label', currentTexts.ui.achievements_close);

    const container = document.getElementById('achievements-list');
    container.innerHTML = '';

    ACHIEVEMENTS_DEF.forEach(achievement => {
        const info = currentTexts.ui.achievements[achievement.id];
        if (!info) {
            console.error(`Ошибка: Не найден перевод достижения "${achievement.id}" в базе данных для языка ${state.lang}`);
            return;
        }

        const isUnlocked = state.unlockedAchievements.includes(achievement.id);
        const item = document.createElement('div');
        item.className = `flex items-center gap-3 p-3 rounded-xl border ${
            isUnlocked
                ? 'bg-slate-900 border-purple-500/50 text-white'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
        }`;

        const icon = document.createElement('div');
        icon.className = 'text-2xl';
        icon.innerText = isUnlocked ? achievement.icon : '🔒';

        const details = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'font-bold text-sm';
        name.innerText = info.name;

        const description = document.createElement('div');
        description.className = `text-xs ${isUnlocked ? 'text-slate-300' : 'text-slate-600'}`;
        description.innerText = info.desc;

        details.append(name, description);
        item.append(icon, details);
        container.appendChild(item);
    });
}

function showAchievementToast(achievement) {
    const info = currentTexts?.ui.achievements?.[achievement.id];
    if (!info) {
        console.error(`Ошибка: Не найден перевод достижения "${achievement.id}" в базе данных для языка ${state.lang}`);
        return;
    }

    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-purple-700 text-white px-5 py-3 rounded-xl shadow-xl text-center';
    toast.innerText = `🏆 ${currentTexts.ui.achievement_unlocked}: ${info.name}`;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3500);
}

function checkAchievements() {
    ACHIEVEMENTS_DEF.forEach(achievement => {
        if (!state.unlockedAchievements.includes(achievement.id) && achievement.req(state)) {
            state.unlockedAchievements.push(achievement.id);
            state.earnedAchievementsThisGame.push(achievement.id);
            if (typeof playCashSound === 'function') playCashSound();
            showAchievementToast(achievement);
        }
    });
}

