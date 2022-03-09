<template>
    <div>
    <v-text-field v-for="(item, index) in value" :key="index" v-model="item.name"> {{ item.name }} 
        <v-btn
        slot="append"
          color="orange"
          text
          @click="Add"
        >
         	+ 
        </v-btn>

        <!-- <v-btn
        slot="prepend"
          color="orange"
          text
          @click="Sub(index)"
        >
         	- 
        </v-btn> -->

    </v-text-field>
    <span>{{ value }}</span>
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
        id: String,
    },
    mounted() {
        console.log(this.value)
    },
    data() {
        return {
            items: [ { "name": "lo", "address": "127.0.0.1", "mac": "loop" } ],
            vaule_d: this.value
        }
    },
    methods: {
        Add() {
            this.vaule_d.push({})
        }
    }
}
</script>
<style lang="">
    
</style>