import { AccountSession } from './account-session.js';
import { checkAchievements } from './achievements.js';
import { GameConfig } from './config.js';
import { Difficulty } from './difficulty.js';
import { triggerGameOver } from './game-over.js';
import { currentTexts, shopPerkKeys, state } from './game-state.js';
import { playCashSound, playClickSound } from '../ui/audio.js';
import { updateAuthUI } from '../ui/auth.js';
import { gameErrorText } from '../ui/language.js';
import { saveGuestGame, updateUI } from '../ui/ui.js';

function toggleShop(show) {
    if (show && state.mode === 'blitz') return;
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

        const cost = Difficulty.price(state, key, GameConfig.current.shop.perks[key].price);
        const canAfford = state.money >= cost;
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
        price.innerText = `${cost.toLocaleString()} ₪`;

        details.append(name, description, price);

        const readyDay = state.cooldowns[key] || 0;
        const isCoolingDown = state.day < readyDay;
        const daysLeft = readyDay - state.day;
        const isMaxed = isPerkMaxed(key);

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

function isPerkMaxed(key) {
    return Object.entries(GameConfig.current.shop.perks[key].effects)
        .every(([stat, delta]) => delta === 0 || (delta > 0 ? state[stat] >= 100 : state[stat] <= 0));
}

function buyPerk(key) {
    if (state.gameOverRecorded || state.mode === 'blitz') return;
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

    if (isPerkMaxed(key)) return;

    const cost = Difficulty.price(state, key, GameConfig.current.shop.perks[key].price);
    if (state.money < cost) {
        alert(currentTexts.ui.shop_not_enough);
        return;
    }

    state.money -= cost;
    Difficulty.purchased(state, key, GameConfig.current.shop.perks[key].price);
    for (const [stat, delta] of Object.entries(GameConfig.current.shop.perks[key].effects)) {
        state[stat] = Math.max(0, Math.min(100, state[stat] + delta));
    }

    Difficulty.protectOpening(state, state.day - 1);
    state.cooldowns[key] = state.day + Difficulty.cooldown(state, key);

    if (typeof playClickSound === 'function') playClickSound();
    if (typeof playCashSound === 'function') playCashSound();

    updateUI();
    checkAchievements();
    const reason = Difficulty.defeat(state);
    if (reason) {
        toggleShop(false);
        return triggerGameOver(reason);
    }
    saveGuestGame();
}

export { buyPerk, renderShop, toggleShop };
