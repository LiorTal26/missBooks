export default {
    props: ['item'],
    template: `
        <div>
            <img :src="item.thumbnail" @click="set"/>
            <h1 @click="set">{{item.title}}</h1>
            <h2>{{item.subtitle}}</h2>
        </div>
    `,
    methods: {
        set() {
            this.$emit('set', this.item);
        },
    },
};
