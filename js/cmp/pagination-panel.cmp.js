export default {
    props: [
        'items', // array of items
        'size',  // items per page
        'panel', // number of pages to show in pagination panel
        'index', // start at specific index
        'loop',  // enable looping by pressing on next/previous buttons
    ],
    template: `
        <div class="pagination-navigator" v-if="pages.length > 1">
            <button @click="set(previous)" :disabled="(disabledPrevious)"> « </button>
            <template v-for="page in pages">
                <button :class="{ pgnactive: page === current }" @click="set(page)"> {{page+1}} </button>
            </template>
            <button @click="set(next)" :disabled="(disabledNext)"> » </button>
        </div>
    `,
    data() {
        return {
            result: [],
            pages: [],
            previous: 0,
            next: 0,
        }
    },
    created() {
        this.set();
    },
    methods: {
        set(index = this.index || 0, items = this.items || [], panelSize = this.panel || 3, resultSize = this.size || 6, loop = this.loop) {
            if (!items || !items.length) {
                this.$emit('set', [], 0, 0);
                return;
            }
            items = items.slice();
            const length = Math.ceil(items.length / resultSize);
            if (index > length - 1) index = length - 1;
            const page = {
                start() {
                    const SIZE = Math.floor(panelSize / 2);
                    const LIMIT = SIZE - Math.min(0, (length - index - 1) - Math.floor(panelSize / 2));
                    return Math.max(0, index - LIMIT);
                },
                end() {
                    const SIZE = Math.floor(panelSize / 2) + Math.max(0, Math.floor(panelSize / 2) - index);
                    const LIMIT = Math.min(length - 1 - index, SIZE);
                    return index + LIMIT;
                },
                previous: (index > 0) ? index - 1 : (loop) ? items.length - 1 : null,
                next: (length > 0 && index < length - 1) ? index + 1 : (loop) ? 0 : null,
            }
            this.pages = [];
            for (let i = page.start(); i <= page.end(); i++) {
                this.pages.push(i);
            };
            this.current = index;
            this.previous = page.previous;
            this.next = page.next;
            this.result = items.splice(index * resultSize, resultSize);
            this.$emit('set', this.result, length, index);
        },
    },
    computed: {
        disabledPrevious() {
            return (typeof this.previous !== 'number');
        },
        disabledNext() {
            return (typeof this.next !== 'number');
        },
    },
};
