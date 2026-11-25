function downloadResult(file, browser = globalThis) {
    const url = browser.URL.createObjectURL(file);
    const link = browser.document.createElement('a');
    link.href = url;
    link.download = 'mayor-game-result.png';
    browser.document.body.appendChild(link);
    link.click();
    link.remove();
    browser.setTimeout(() => browser.URL.revokeObjectURL(url), 1000);
}

async function copyResultText(text, browser) {
    try {
        await browser.navigator.clipboard.writeText(text);
        return true;
    } catch {
        const input = browser.document.createElement('textarea');
        const focused = browser.document.activeElement;
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        browser.document.body.appendChild(input);
        try {
            input.select();
            return browser.document.execCommand('copy');
        } catch {
            return false;
        } finally {
            input.remove();
            focused?.focus();
        }
    }
}

async function shareResult(result, browser = globalThis) {
    const text = result.shareText + '\n' + result.url;
    // The File is prepared with the preview, before the user's click.
    if (browser.navigator.share && browser.navigator.canShare?.({ files: [result.file] })) {
        try {
            await browser.navigator.share({ files: [result.file], title: result.name, text });
            return 'shared';
        } catch (error) {
            if (error.name === 'AbortError') return 'cancelled';
            throw error;
        }
    }
    downloadResult(result.file, browser);
    return await copyResultText(text, browser) ? 'copied' : 'downloaded';
}

export { downloadResult, shareResult };
