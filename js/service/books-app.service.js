import { utilService } from './utils.service.js';
import { storageService } from './async-storage.service.js';

const KEY = 'missbook';
const CACHE_KEY = 'fetch';
_createDemo();

export const bookService = {
    query,
    remove,
    save,
    getById,
    getEmptyItem,
    getBooksFromGoogle,
    getFormatted,
};

function query() {
    return storageService.query(KEY);
}

function remove(itemId) {
    return storageService.remove(KEY, itemId);
}

function save(item) {
    if (item.id) return storageService.put(KEY, item);
    else return storageService.post(KEY, item);
}

function getById(itemId) {
    return storageService.get(KEY, itemId);
}

function getEmptyItem() {
    return {
        id: null,
        title: '',
        subtitle: '',
        authors: '',
        publishedDate: '',
        description: '',
        pageCount: '',
        categories: '',
        thumbnail: '',
        language: '',
        listPrice: {
            amount: 0,
            currencyCode: '',
            isOnSale: false,
        }
    }
}

function getBooksFromGoogle(value) {
    const url = 'https://www.googleapis.com/books/v1/volumes?q=' + value;
    return _fetch(url)
        .then(data => getFormatted(data.items));
}

function getFormatted(data) {
    return data.map(book => {
        const root = book.volumeInfo;
        const image = root.imageLinks;
        return {
            id: null,
            title: root.title || null,
            subtitle: root.subtitle || null,
            authors: root.authors || null,
            publishedDate: root.publishedDate || null,
            description: root.description || null,
            pageCount: root.pageCount || null,
            categories: root.categories || null,
            thumbnail: (image) ? image.thumbnail || null : null,
            language: root.language || null,
            listPrice: {
                amount: 0,
                currencyCode: '',
                isOnSale: false,
            }
        }
    });
}

function _fetch(url) {
    const cache = utilService.loadFromStorage(CACHE_KEY) || [];
    const save = cache.find(item => item.url === url) || { url, data: null };
    if (save.data) return Promise.resolve(save.data);
    return fetch(url)
        .then(res => res.json())
        .then(data => {
            save.data = data;
            cache.push(save);
            utilService.saveToStorage(CACHE_KEY, cache);
            return data
        });
}

function _createDemo(jsonFile = 'json/books.json') {
    let books = utilService.loadFromStorage(KEY);
    if (!books || !books.length) {
        var request = new XMLHttpRequest();
        request.open('GET', jsonFile, false);
        request.send(null);
        books = JSON.parse(request.responseText);
        utilService.saveToStorage(KEY, books);
    }
    return books;
}
