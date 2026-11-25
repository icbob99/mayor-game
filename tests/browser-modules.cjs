const { readdirSync, readFileSync } = require('node:fs');
const path = require('node:path');

const app = path.join(__dirname, '../app');
const modules = readdirSync(app, { recursive: true })
    .filter(file => file.endsWith('.js') && /^export /m.test(readFileSync(path.join(app, file), 'utf8')))
    .map(file => 'app/' + file.replaceAll('\\', '/'));

// Evaluate the existing behavioral scenarios against native module exports.
// Getters retain live bindings across awaited language/session changes. This
// scope exists only inside the test expression; nothing is added to window.
function moduleExpression(expression) {
    return `(async () => {
        const modules = await Promise.all(${JSON.stringify(modules)}.map(file => import(new URL(file, document.baseURI))));
        const scope = Object.create(null);
        for (const module of modules) for (const name of Object.keys(module)) {
            Object.defineProperty(scope, name, { get: () => module[name] });
        }
        return Function('scope', 'code', 'with (scope) { return eval(code); }')(scope, ${JSON.stringify(expression)});
    })()`;
}

module.exports = { moduleExpression };
