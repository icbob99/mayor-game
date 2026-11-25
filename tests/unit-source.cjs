const { readFileSync } = require('node:fs');

// Existing VM unit tests supply collaborators as globals. Isolate the module body
// with those doubles; the real import graph is exercised by the browser integration.
// This adapter is test-only and is never loaded by the application.
function readUnit(file) {
    let source = readFileSync(file, 'utf8');
    if (!String(file).replaceAll('\\', '/').includes('app/')) return source;
    const dependencies = [];
    source = source.replace(/^import \{ ([^}]+) \} from '[^']+';\r?\n/gm, (_, names) => {
        dependencies.push(...names.split(',').map(name => name.trim()));
        return '';
    });
    let exported = [];
    source = source.replace(/^export \{ ([^}]+) \};\r?\n/gm, (_, names) => {
        exported = names.split(',').map(name => name.trim());
        return '';
    });
    const defaults = dependencies.map(name => `if (!('${name}' in globalThis)) globalThis.${name} = undefined;`).join('\n');
    // Encapsulated services retain private names such as settings/storage/keys.
    const service = /\/(?:config|statistics|difficulty|modes|guest-storage|guest-session|mayor-save|account-session|audio-settings|browser-session|music-player|choice-order|language-utils)\.js$/.test(file)
        && !/\/ui\/(?:difficulty|modes)\.js$/.test(file);
    return defaults + '\n' + (service
        ? `(function () {\n${source}\nObject.assign(globalThis, { ${exported.join(', ')} });\n})();`
        : source);
}

module.exports = { readUnit };
