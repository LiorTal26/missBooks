import booksApp from './pages/books-app.cmp.js';
import bookApp from './pages/book-app.cmp.js';
import googlebookApp from './pages/googlebook-app.cmp.js';
import aboutApp from './pages/about-app.cmp.js'

const routes = [
    {
        path: '/',
        component: booksApp
    },
    {
        path: '/books',
        component: booksApp
    },
    {
        path: '/books/:bookId',
        component: bookApp
    },
    {
        path: '/googlebook/:search?',
        component: googlebookApp
    },
    {
        path: '/about',
        component: aboutApp
    }
];

export const router = new VueRouter({ routes });
