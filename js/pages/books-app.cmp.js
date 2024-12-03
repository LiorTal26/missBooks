import booksPreview from '../cmp/books-preview.cmp.js';
import popupModal from '../cmp/popup-modal.cmp.js';
import paginationPanel from '../cmp/pagination-panel.cmp.js';
import booksFilter from '../cmp/books-filter.cmp.js';

import { bookService } from '../service/books-app.service.js';

export default {
    props: ['inBooks'],
    components: {
        booksPreview,
        popupModal,
        paginationPanel,
        booksFilter,
    },
    template: `
        <div class="books-app">

            <popup-modal v-if="modalSettings" :settings="modalSettings" @yes="onYes" @no="onNo" />

            <div v-if="!inBooks" class="grid-control">
                <books-filter :items="books" @set="setFilter"/>
                <div class="edit-mode">
                    <label>Edit mode: </label>
                    <label class="switch">
                        <input type="checkbox" v-model.bool="isEditMode">
                        <span class="slider"></span>
                    </label>
                    <button v-if="isEditMode" @click="addItem">+</button>
                </div>
            </div>

            <div class="grid-display">
                <div v-for="item in page.books" class="books-preview">
                    <span v-if="isEditMode" @click.stop="delItem(item)" title="Remove">×</span>
                    <books-preview :item="item" :class="{selected: currBook===item}" @set="switchMode" />
                </div>
            </div>
            
            <pagination-panel :index="page.current" :items="filteredItems" :size="8" :panel="5" :loop="true" @set="setPage" :key="page.refresh" />
        </div>
    `,
    data() {
        return {
            filteredItems: null,
            currBook: null,
            isEditMode: false,
            books: null,
            page: {
                refresh: Date.now(),
                last: 0,
                current: 0,
                books: null,
            },
        }
    },
    created() {
        this.modalSettings = null;
        this.loadBooks();
    },
    methods: {
        loadBooks() {
            if (this.inBooks) {
                this.books = this.inBooks;
                this.filteredItems = this.books;
            } else {
                bookService.query()
                    .then(books => {
                        this.books = books;
                        this.filteredItems = this.books;
                        this.page.refresh = Date.now();
                    });
            }
        },
        setFilter(filterBy) {
            const title = filterBy.name || '';
            const minPrice = filterBy.price.min || 0;
            const maxPrice = filterBy.price.max || Infinity;
            const items = this.books.slice();
            this.filteredItems = items.filter(item => {
                return (item.title.toLowerCase().includes(title) && (item.listPrice.amount >= minPrice && item.listPrice.amount <= maxPrice));
            });
            if (!this.filteredItems) this.filteredItems = [];
            this.page.refresh = Date.now();
        },
        setPage(displayItem, lastPage, currPage) {
            this.page.last = lastPage;
            this.page.current = currPage;
            this.page.books = displayItem;
        },
        switchMode(item) {
            if (this.isEditMode) {
                this.setItem(item);
            } else {
                this.previewItem(item);
            }
        },
        previewItem(item) {
            this.currBook = item;
            this.modalSettings = {
                item,
                action: 'preview',
                title: item.title,
                yes: (this.inBooks) ? 'Add' : 'Read more',
                no: 'Close'
            };
        },
        setItem(item) {
            this.currBook = item;
            this.modalSettings = {
                item,
                action: 'modify',
                title: 'Update book',
                yes: 'Save',
                no: 'Cancel'
            };
        },
        addItem() {
            this.currBook = true;
            this.modalSettings = {
                item: bookService.getEmptyItem(),
                action: 'add',
                title: 'Add new book',
                yes: 'Save',
                no: 'Cancel'
            };
        },
        delItem(item) {
            this.currBook = item;
            this.modalSettings = {
                item,
                content: [{ value: `Are you sure you would like to remove "${item.title}" ?` }],
                action: 'remove',
                title: 'Remove book',
                yes: 'Yes',
                no: 'No'
            };
        },
        onYes(action, book, add) {
            switch (action) {
                case 'add':
                    bookService.save(book)
                        .then(() => {
                            this.page.current = this.page.last;
                            this.loadBooks()
                        })
                        .catch(err => console.log(err));
                    break;
                case 'modify':
                    bookService.save(book)
                        .then(this.loadBooks)
                        .catch(err => console.log(err));
                    break;
                case 'remove':
                    bookService.remove(book.id)
                        .then(this.loadBooks)
                        .catch(err => console.log(err));
                    break;
                case 'preview':
                    if (this.inBooks) {
                        bookService.save(book)
                            .then(() => {
                                const idx = this.books.findIndex(item => item === book);
                                this.books.splice(idx, 1);
                                this.filteredItems = this.books;
                                this.page.refresh = Date.now();
                            })
                            .catch(err => console.log(err));
                    } else this.$router.push({ path: `/books/${book.id}` });
                    break;
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
};
