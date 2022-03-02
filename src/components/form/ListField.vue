<template>
    <div>
    <v-text-field v-for="(item, index) in value" :key="index" :v-model="item.name"> {{ item.name }} </v-text-field>
    </div>
</template>
<script>
import { VTextField } from 'vuetify/lib'
export default {
    components: {
        VTextField,
    },
    props: {
        value: Array,
    },
    data() {
        return {
            items: [ { "name": "lo", "address": "127.0.0.1", "mac": "loop" } ]
        }
},
}
</script>
<style lang="">
    
</style>