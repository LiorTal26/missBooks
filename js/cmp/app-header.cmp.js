export default {
    template: `
        <header class="app-header">
            <h1> MissBook </h1>
            <nav>
                <router-link to="/">Home</router-link> |
                <router-link to="/books/">Books</router-link> |
                <router-link to="/googlebook/">Google</router-link> |
                <router-link to="/about">About</router-link>
            </nav>
        </header>
    `
};
