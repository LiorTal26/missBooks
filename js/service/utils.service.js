export const utilService = {
    saveToStorage,
    loadFromStorage,
    deepCopy,
};

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val);
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

