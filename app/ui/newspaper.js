import { downloadResult, shareResult } from '../infrastructure/result-sharing.js';
import { getTextDirection } from './language-utils.js';
import { drawNewspaper } from './newspaper-canvas.js';

let newspaperVersion = 0;
let newspaperResult = null;
let newspaperToastTimer;

function createNewspaperModel(state, ui, title, url) {
    const format = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
    const direction = getTextDirection(state.lang);
    const moneyText = new Intl.NumberFormat(state.lang).format(state.money) + ' ' + ui.newspaper_currency;
    const money = direction === 'rtl' ? '\u200f' + moneyText + '\u200f' : moneyText;
    const days = format(ui.newspaper_day_unlimited, { day: state.day });
    const victory = state.endReason === 'honorable_retirement';
    const headline = ui.newspaper_headlines[state.endReason];
    return {
        name: ui.newspaper_name, edition: ui.newspaper_edition, headline, title, days, money, url, direction, victory,
        date: new Intl.DateTimeFormat(state.lang, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(state.finishedAt),
        stamp: ui.newspaper_stamps[victory ? 'victory' : state.endReason === 'resignation' ? 'fled' : 'defeat'],
        settings: ui.difficulty[state.difficulty].name + ' · ' + ui.modes[state.mode].name,
        labels: ui.newspaper_labels,
        shareText: format(ui.newspaper_share_text, { headline, days, money, title })
    };
}

function clearNewspaper() {
    newspaperVersion++;
    newspaperResult = null;
    clearTimeout(newspaperToastTimer);
    const summary = document.getElementById('game-over-summary');
    if (summary) summary.hidden = false;
    const section = document.getElementById('newspaper-section');
    if (!section) return;
    section.hidden = true;
    document.getElementById('newspaper-toast').hidden = true;
    document.getElementById('newspaper-preview').hidden = true;
    document.getElementById('newspaper-preview').removeAttribute('src');
    for (const id of ['btn-share-result', 'btn-download-newspaper']) document.getElementById(id).disabled = true;
}

async function renderNewspaper(state, ui, title) {
    clearNewspaper();
    const section = document.getElementById('newspaper-section');
    if (!section || !ui.newspaper_headlines) return;
    section.hidden = false;
    const version = newspaperVersion;
    const preview = document.getElementById('newspaper-preview');
    const status = document.getElementById('newspaper-status');
    preview.alt = ui.newspaper_preview;
    document.getElementById('btn-share-result').textContent = ui.newspaper_share;
    document.getElementById('btn-download-newspaper').textContent = ui.newspaper_download;
    status.textContent = ui.newspaper_loading;
    status.hidden = false;
    try {
        // Snapshot the ending before waiting for fonts or PNG encoding.
        const model = createNewspaperModel(state, ui, title, location.origin + location.pathname);
        await document.fonts.ready;
        if (version !== newspaperVersion) return;
        const canvas = drawNewspaper(document.createElement('canvas'), model);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (version !== newspaperVersion) return;
        if (!blob) throw new Error('PNG encoding failed');
        newspaperResult = { ...model, file: new File([blob], 'mayor-game-result.png', { type: 'image/png' }), ui };
        preview.src = canvas.toDataURL('image/png');
        preview.dataset.lang = state.lang;
        preview.hidden = false;
        const summary = document.getElementById('game-over-summary');
        if (summary) summary.hidden = true;
        status.hidden = true;
        for (const id of ['btn-share-result', 'btn-download-newspaper']) document.getElementById(id).disabled = false;
    } catch {
        if (version === newspaperVersion) status.textContent = ui.newspaper_error;
    }
}

function showNewspaperToast(message) {
    const toast = document.getElementById('newspaper-toast');
    clearTimeout(newspaperToastTimer);
    toast.textContent = message;
    toast.hidden = false;
    newspaperToastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
}

async function shareNewspaper() {
    if (!newspaperResult) return;
    const result = newspaperResult;
    const version = newspaperVersion;
    const button = document.getElementById('btn-share-result');
    button.disabled = true;
    try {
        const outcome = await shareResult(result);
        if (version !== newspaperVersion) return;
        if (outcome === 'copied') showNewspaperToast(result.ui.newspaper_copied);
        if (outcome === 'downloaded') showNewspaperToast(result.ui.newspaper_copy_failed);
    } catch {
        if (version === newspaperVersion) showNewspaperToast(result.ui.newspaper_share_error);
    } finally {
        if (version === newspaperVersion) button.disabled = false;
    }
}

function downloadNewspaper() {
    if (!newspaperResult) return;
    try { downloadResult(newspaperResult.file); }
    catch { showNewspaperToast(newspaperResult.ui.newspaper_share_error); }
}

export { clearNewspaper, createNewspaperModel, downloadNewspaper, renderNewspaper, shareNewspaper };
