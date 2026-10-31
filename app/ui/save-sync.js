let saveSyncBusy = false;
let saveSyncShown = null;

function updateSaveSyncUI() {
    const texts = currentTexts?.ui.saveSync;
    if (!texts) return;
    const status = AccountSession.syncStatus();
    const visible = AccountSession.isMayor() && Boolean(status) && AccountSession.check() !== 'expired';
    const dialog = document.getElementById('save-sync-dialog');
    const notice = document.getElementById('save-sync-notice');
    notice.hidden = !visible || dialog.open;
    const choosing = visible && ['save_conflict', 'transfer_required'].includes(status) && AccountSession.token();
    document.getElementById('save-sync-notice-text').textContent = texts[status] || authText('server_unavailable');
    document.getElementById('save-sync-review').hidden = !choosing;
    document.getElementById('save-sync-review').textContent = texts.review;
    if (!choosing) {
        if (dialog.open) dialog.close();
        saveSyncShown = null;
        return;
    }
    const details = AccountSession.syncDetails();
    const conflict = status === 'save_conflict';
    document.getElementById('save-sync-title').textContent = texts[status];
    document.getElementById('save-sync-description').textContent = texts.transfer_description;
    function summary(snapshot) {
        if (!snapshot) return texts.new_game;
        return `${currentTexts.ui.day}: ${snapshot.day}\n${currentTexts.ui.money}: ${snapshot.money.toLocaleString(state.lang)} ₪\n${texts[snapshot.isFinished ? 'finished' : 'playing']}`;
    }
    for (const source of ['local', 'cloud']) {
        const state = source === 'local' ? details.local : details.cloud?.state;
        document.getElementById(`save-sync-${source}-card`).hidden = !conflict;
        document.getElementById(`save-sync-${source}-title`).textContent = texts[source];
        document.getElementById(`save-sync-${source}-summary`).textContent = summary(state);
        const button = document.getElementById(`save-sync-${source}`);
        button.textContent = details.selection === source ? texts.retry : texts['use_' + source];
        button.disabled = saveSyncBusy || (source === 'local' && !state) || Boolean(details.selection && details.selection !== source);
    }
    document.getElementById('save-sync-confirm').hidden = conflict;
    document.getElementById('save-sync-confirm').textContent = details.selection ? texts.retry : texts.confirm;
    document.getElementById('save-sync-confirm').disabled = saveSyncBusy;
    document.getElementById('save-sync-cancel').textContent = authText('cancel');
    document.getElementById('save-sync-cancel').disabled = saveSyncBusy;
    const key = status + ':' + (details.cloud?.versionGuid || 'none');
    if (key !== saveSyncShown && !document.getElementById('auth-dialog').open) {
        saveSyncShown = key;
        document.getElementById('save-sync-error').textContent = '';
        if (!dialog.open) dialog.showModal();
    }
    notice.hidden = dialog.open;
}

function showSaveSync() {
    saveSyncShown = null;
    updateSaveSyncUI();
}

async function resolveSaveSync(source) {
    if (saveSyncBusy) return;
    const details = AccountSession.syncDetails();
    source ||= details.source;
    // A transfer without a version conflict preserves any local unsent progress.
    if (AccountSession.syncStatus() === 'transfer_required') source = details.selection || details.source;
    saveSyncBusy = true;
    updateSaveSyncUI();
    try {
        await AccountSession.resolveSave(source);
        if (AccountSession.isMayor() && !AccountSession.syncStatus()) await restoreMayor();
        else document.getElementById('save-sync-error').textContent = AccountSession.syncDetails().selection
            ? authText('server_unavailable') : currentTexts.ui.saveSync.changed;
    } finally {
        saveSyncBusy = false;
        updateAuthUI();
    }
}
