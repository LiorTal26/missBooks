export default {
    props: ['items'],
    template: `
        <div class="grid-filter">
            <div>
                <label>Search:</label>
                <input type="text" v-model="filterBy.name"/>
            </div>
            <div>
                <label>Price:</label>
                <input type="number" v-model.number="filterBy.price.min"/>
            </div>
                <label>-</label>
                <input type="number" v-model.number="filterBy.price.max" :min="filterBy.price.min"/>
            </div>
        </div>
    `,
    data() {
        return {
            filterBy: {
                name: null,
                price: {
                    min: 0,
                    max: null,
                }
            }
        }
    },
    updated() {
        this.$emit('set', this.filterBy);
    },
};
