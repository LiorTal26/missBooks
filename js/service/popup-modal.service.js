export const modalService = {
    load,
    save,
    check,
    title: camelCaseToSentence,
}

function check(content) {
    const isFailed = content.some(data => (data.isRequired && !data.value));
    if (isFailed) {
        content.forEach(data => data.isFailed = (data.isRequired && !data.value));
    };
    return !isFailed;
}

function load(item, hiddenKeys = [], requiredKeys = [], data = [], path = []) {
    for (const key in item) {
        const value = item[key];
        if (!hiddenKeys.includes(key)) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                load(value, hiddenKeys, requiredKeys, data, path.concat([key]));
            } else {
                const structure = {
                    component: null,
                    type: null,
                    path,
                    key: key,
                    value: value,
                    title: camelCaseToSentence((path.length) ? path.concat([key]) : key),
                    return: typeof value,
                    isRequired: requiredKeys.includes(key),
                    isImage: (typeof value === 'string') ? _isImage(key, value) : false,
                }
                if (Array.isArray(value)) {
                    if (value.some(item => typeof item === 'object')) {
                        structure.return = 'json';
                        structure.value = JSON.stringify(value)
                    } else {
                        structure.return = 'array';
                        structure.value = value.join(',');
                    }
                }
                structure.component = _getComponentType(structure);
                structure.type = _getInputType(structure);
                data.push(structure);
            }
        }
    }
    return data;
}

function save(item = {}, content = []) {
    var duplicate = _getCopy(item);
    content.forEach(data => {
        if (data.key) {
            var fullPath = duplicate;
            if (data.path) data.path.forEach(path => {
                if (!duplicate[path]) duplicate[path] = {};
                fullPath = fullPath[path];
            });
            fullPath[data.key] = _getReturn(data);
        }
    });
    return duplicate;
}

function _getComponentType(structure) {
    if (structure.options) return 'selectBox';
    return (structure.value && structure.value.length > 70) ? 'textArea' : 'textBox';
}

function _getInputType(data) {
    switch (data.return) {
        case 'number': return 'number';
        case 'boolean': return 'checkbox';
        default: return 'text';
    }
}

function _getReturn(data) {
    switch (data.return) {
        case 'array': return data.value.split(',');
        case 'number': return parseFloat(data.value);
        case 'json': return JSON.parse(data.value);
        default: return data.value;
    }
}

function _getCopy(item) {
    return JSON.parse(JSON.stringify(item));
}

function camelCaseToSentence(input, isOnlyFirst = true) {
    if (!input) return;
    if (typeof input === 'string') input = [input];
    return input.map(key => key.replace(/[A-Z]/g, letter => (isOnlyFirst) ? ` ${letter.toLowerCase()}` : ` ${letter}`).replace(/[a-z]/, letter => letter.toUpperCase())).join(' » ')
};

function _isImage(key, url) {
    // plaster
    if (key.includes('thumb')) return true;
    return (/(https?:\/\/.*\.(?:png|jpg))/i).test(url);
}