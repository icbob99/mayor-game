const newspaperFont = 'Georgia, "Times New Roman", serif';

function fitText(ctx, text, width, height, maxSize) {
    for (let fontSize = maxSize; fontSize >= 1; fontSize--) {
        ctx.font = `bold ${fontSize}px ${newspaperFont}`;
        const lines = [];
        let line = '';
        for (const word of String(text).trim().split(/\s+/)) {
            const next = line ? line + ' ' + word : word;
            if (ctx.measureText(next).width <= width) { line = next; continue; }
            if (line) lines.push(line);
            line = '';
            for (const character of word) {
                if (line && ctx.measureText(line + character).width > width) {
                    lines.push(line);
                    line = '';
                }
                line += character;
            }
        }
        if (line) lines.push(line);
        const lineHeight = fontSize * 1.2;
        if (lines.length * lineHeight <= height) return { lines, fontSize, lineHeight };
    }
    throw new Error('Newspaper text exceeds its box');
}

function drawNewspaper(canvas, model) {
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f4ecd8';
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = '#57534e0b';
    for (let y = 0; y < 630; y += 7) for (let x = (y % 5); x < 1200; x += 11) ctx.fillRect(x, y, 1, 1);
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 1168, 598);
    ctx.lineWidth = 1;
    ctx.strokeRect(23, 23, 1154, 584);
    ctx.direction = model.direction;
    ctx.textBaseline = 'middle';

    const text = (value, x, y, width, height, size, align = 'center', color = '#1c1917') => {
        const fit = fitText(ctx, value, width, height, size);
        ctx.textAlign = align;
        ctx.fillStyle = color;
        const anchor = align === 'right' ? x + width : align === 'left' ? x : x + width / 2;
        const top = y + (height - fit.lines.length * fit.lineHeight) / 2;
        fit.lines.forEach((line, i) => ctx.fillText(line, anchor, top + (i + .5) * fit.lineHeight));
    };
    const rule = y => { ctx.beginPath(); ctx.moveTo(48, y); ctx.lineTo(1152, y); ctx.stroke(); };
    text(model.edition, 48, 45, 225, 60, 21);
    text(model.name, 285, 38, 630, 75, 49);
    text(model.date, 927, 45, 225, 60, 22);
    rule(124); rule(129);
    text(model.headline, 60, 145, 1080, 141, 54);
    rule(302);
    ctx.fillStyle = '#1c191710';
    ctx.fillRect(48, 316, 1104, 91);
    text(model.labels.title, 68, 320, 1064, 24, 18, 'center', '#57534e');
    text(model.title, 68, 346, 1064, 55, 29);

    const rtl = model.direction === 'rtl';
    const metricsX = rtl ? 408 : 60;
    const rows = [[model.labels.days, model.days], [model.labels.money, model.money], [model.labels.settings, model.settings]];
    rows.forEach(([label, value], index) => {
        const y = 427 + index * 44;
        text(label, metricsX + (rtl ? 448 : 0), y, 272, 38, 22, rtl ? 'right' : 'left', '#57534e');
        text(value, metricsX + (rtl ? 0 : 284), y, 436, 38, 28, rtl ? 'left' : 'right');
    });

    ctx.save();
    ctx.translate(rtl ? 215 : 985, 490);
    ctx.rotate(-12 * Math.PI / 180);
    ctx.globalAlpha = .82;
    const stampColor = model.victory ? '#15803d' : '#b91c1c';
    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(-142, -45, 284, 90);
    ctx.lineWidth = 1;
    ctx.strokeRect(-135, -38, 270, 76);
    text(model.stamp, -126, -32, 252, 64, 31, 'center', stampColor);
    ctx.restore();

    ctx.fillStyle = '#1c1917';
    ctx.fillRect(32, 576, 1136, 26);
    ctx.direction = 'ltr';
    text(model.url, 42, 577, 1116, 24, 20, 'center', '#f4ecd8');
    return canvas;
}

export { drawNewspaper, fitText };
