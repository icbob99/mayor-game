function toggleShop(show) {
    const modal = document.getElementById('shop-modal');
    if (!modal) return;

    if (show) {
        renderShop();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderShop() {
    if (!currentTexts || !currentTexts.ui.perks) return;

    document.getElementById('shop-title').innerText = `🛒 ${currentTexts.ui.shop_title}`;
    document.getElementById('shop-close-btn').innerText = currentTexts.ui.shop_close;
    document.getElementById('shop-dismiss-btn').setAttribute('aria-label', currentTexts.ui.shop_close);

    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    shopPerkKeys.forEach(key => {
        const perk = currentTexts.ui.perks[key];
        if (!perk) {
            console.error(gameErrorText('perk_text_missing', key));
            return;
        }

        const canAfford = state.money >= perk.price;
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl';

        const details = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'font-bold text-white text-sm';
        name.innerText = perk.name;

        const description = document.createElement('div');
        description.className = 'text-xs text-slate-400';
        description.innerText = perk.desc;

        const price = document.createElement('div');
        price.className = 'text-xs font-bold text-emerald-400 mt-0.5';
        price.innerText = `${perk.price.toLocaleString()} ₪`;

        details.append(name, description, price);

        const readyDay = state.cooldowns[key] || 0;
        const isCoolingDown = state.day < readyDay;
        const daysLeft = readyDay - state.day;
        const isMaxed = (
            (key === 'police_bribe' && state.threat === 0) ||
            (key === 'wife_spa' && state.wife === 100) ||
            (key === 'assuta_vip' && state.health === 100) ||
            (key === 'pr_agency' && state.rating === 100)
        );

        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.perk = key;
        button.disabled = !canAfford || isMaxed || isCoolingDown;
        button.className = `px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            button.disabled
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
        }`;
        button.innerText = isCoolingDown
            ? `${currentTexts.ui.shop_cooldown} ${daysLeft} ${currentTexts.ui.shop_days}`
            : isMaxed
                ? currentTexts.ui.shop_maxed
                : canAfford
                    ? currentTexts.ui.shop_buy
                    : currentTexts.ui.shop_insufficient;
        button.addEventListener('click', event => {
            const perkKey = event.currentTarget.dataset.perk;
            if (perkKey) buyPerk(perkKey);
        });

        item.append(details, button);
        container.appendChild(item);
    });
}

function buyPerk(key) {
    if (!AccountSession.canPlay()) { updateAuthUI(); return; }
    if (!shopPerkKeys.includes(key)) {
        console.error(gameErrorText('perk_unknown', key));
        return;
    }

    const perk = currentTexts?.ui.perks?.[key];
    if (!perk) {
        console.error(gameErrorText('perk_text_missing', key));
        return;
    }

    const readyDay = state.cooldowns[key] || 0;
    if (state.day < readyDay) return;

    const isMaxed = (
        (key === 'police_bribe' && state.threat === 0) ||
        (key === 'wife_spa' && state.wife === 100) ||
        (key === 'assuta_vip' && state.health === 100) ||
        (key === 'pr_agency' && state.rating === 100)
    );
    if (isMaxed) return;

    if (state.money < perk.price) {
        alert(currentTexts.ui.shop_not_enough);
        return;
    }

    state.money -= perk.price;
    if (key === 'police_bribe') {
        state.threat = Math.max(0, state.threat - 20);
    } else if (key === 'wife_spa') {
        state.wife = Math.min(100, state.wife + 30);
    } else if (key === 'assuta_vip') {
        state.health = Math.min(100, state.health + 30);
    } else if (key === 'pr_agency') {
        state.rating = Math.min(100, state.rating + 25);
    }

    state.cooldowns[key] = state.day + shopPerkCooldownDays;

    if (typeof playClickSound === 'function') playClickSound();
    if (typeof playCashSound === 'function') playCashSound();

    updateUI();
    checkAchievements();
    saveGuestGame();
}

