const textBox = {
    props: ['data'],
    template: `<input :id="data.key" :type="data.type" v-model="data.value" autocomplete="off" />`,
};

const textArea = {
    props: ['data'],
    template: `<textarea :id="data.key" v-model="data.value" ></textarea>`,
};

const selectBox = {
    props: ['data'],
    template: `
        <select :id="data.key" v-model="data.value">
            <option v-for="(option,idx) in data.options" :value="option">{{ options[idx] }}</option>
        </select>
    `,
    created() {
        this.options = this.data.options;
        if (this.data.symbol) this.options = this.options.map(option => this.data.symbol.repeat(option));
    },
};

export default {
    props: ['data'],
    components: {
        textBox,
        textArea,
        selectBox,
    },
    template: `
        <div class="field" :class="fieldClass">
            <template v-if="!data.component">
                {{data.value}}
            </template>
            <template v-else>
                <label :class="labelClass" :for="data.key">{{data.title}}:</label>
                <component :is="data.component" :data="data" @setInput="setInput($event, idx)"></component>
            </template>
        </div>
    `,
    computed: {
        fieldClass() {
            return { doublecol: this.data.component === 'textArea' };
        },
        labelClass() {
            return { warning: this.data.isFailed };
        },
    },
}