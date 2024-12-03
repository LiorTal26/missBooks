import popupModal from '../cmp/popup-modal.cmp.js';
import { bookService } from "../service/books-app.service.js";

const reviewArea = {
    props: ['review'],
    template: `
        <div class="book-review">
            <h1>Review by: {{review.name}}</h1>
            <h2>Rate: {{stars}}</h2>
            <h3>Description:</h3>
            <p>{{review.desc}}</p>
        </div>
    `,
    computed: {
        stars() {
            return ('⭐').repeat(this.review.rate);
        }
    }
}

export default {
    components: {
        popupModal,
        reviewArea,
    },
    template: `
    <div v-if="book" class="book-app">
        <popup-modal v-if="modalSettings" :settings="modalSettings" @yes="onYes" @no="onNo" />
        <div class="book-display">
            <img :src="book.thumbnail"/>
            <div><span class="label">Title:\t</span>{{book.title}}</div>
            <div><span class="label">Subtitle:\t</span>{{book.subtitle}}</div>
            <div><span class="label">Authors:\t</span>{{getAuthors}}</div>
            <div :class="yearStyle"><span class="label">Year:\t</span>{{book.publishedDate}}</div>
            <div><span class="label">Description:\t</span>{{book.description}}</div>
            <div :class="pageStyle"><span class="label">Total Pages:\t</span>{{book.pageCount}}</div>
            <div><span class="label">Categories:\t</span>{{getCategories}}</div>
            <div :class="priceStyle"><span class="label">Price:\t</span>{{book.listPrice.amount}} {{book.listPrice.currencyCode}}</div>
            <button @click="newReview">Add review</button>
        </div>
        <template v-for="review in book.review">
            <component :is="'reviewArea'" :review="review"></component>
        </template>
    </div>
    `,
    data() {
        return {
            book: null,
            modalSettings: null,
        }
    },
    created() {
        const { bookId } = this.$route.params;
        if (bookId) {
            bookService.getById(bookId)
                .then(book => this.book = book);
        }
    },
    updated() { },
    destroyed() { },
    methods: {
        newReview() {
            this.modalSettings = {
                item: this.book,
                content: [
                    { key: 'name', value: '', component: 'textBox', return: 'string', isRequired: true },
                    { key: 'rate', value: 5, component: 'selectBox', return: 'string', options: ['1', '2', '3', '4', '5'], symbol: '⭐' },
                    { key: 'desc', value: '', component: 'textArea', return: 'string', isRequired: true },
                ],
                action: 'review',
                title: 'Enter a new review',
                yes: 'Yes',
                no: 'No'
            };
        },
        onYes(action, book, add) {
            (action, book, add);
            switch (action) {
                case 'review':
                    if (!book[action]) book[action] = [];
                    book[action].push(add);
                    bookService.save(book)
                        .then(this.loadBooks)
                        .catch(err => console.log(err));
                    break;
            }
            this.modalSettings = null;
            this.currBook = null;
        },
        onNo() {
            this.modalSettings = null;
            this.currBook = null;
        },
    },
    computed: {
        getAuthors() {
            return Array(this.book.authors).join();
        },
        getCategories() {
            return Array(this.book.categories).join();
        },
        pageStyle() {
            return { 'long-reading': this.book.pageCount > 500, 'descent-reading': this.book.pageCount < 500 && this.book.pageCount > 200, 'light-reading': this.book.pageCount < 100 }
        },
        yearStyle() {
            const year = new Date().getFullYear();
            return { 'veteran-book': year - this.book.publishedDate > 10, 'new-book': year - this.book.publishedDat < 1 }
        },
        priceStyle() {
            return { 'on-sale': this.book.listPrice.isOnSale };
        }
    },
}