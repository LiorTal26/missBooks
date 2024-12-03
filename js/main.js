import headerApp from './cmp/app-header.cmp.js';
import footerApp from './cmp/app-footer.cmp.js';
import { router } from './routes.js';

const options = {
    el: '#app',
    router,
    template: `
        <section>
            <header-app />
            <router-view />
            <footer-app />
        </section>
    `,
    components: {
        footerApp,
        headerApp,
    },
}

new Vue(options);
