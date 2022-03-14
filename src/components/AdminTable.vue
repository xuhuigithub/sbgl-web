<template>
         <v-row>
             <v-col>
                <v-data-table
                disable-sort
                :loading="loadingItems"
                :headers="newHeaders"
                :items="apidata.results"
                :footer-props="{'items-per-page-options':[15, 30, 50, 100, -1]}"
                :server-items-length="apidata.count"
                :items-per-page="itemsPerPage"
                :page="page"
                :item-key="itemKey"
                @update:page="handlePageChanged"
                >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="handleClickRow(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        small
                        @click="handelDeleteRow(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                </v-data-table>
             </v-col>
         </v-row>
</template>

<script>
export default {
    components: {
    },
    props: {
      headers: Array,
      loadingItems: Boolean,
      apidata: Object,
      itemsPerPage: Number,
      itemKey: String,
      page: Number
    },
    mounted() {
        console.log(this.value)
    },
    data() {
        return {
            newHeaders: [{
          text: '动作',
          value: 'actions',
            },...this.headers]
        }
    },
    methods: {
      handlePageChanged(){
          this.$emit("adminTable:pageChanged", this.page)
      },
      handleClickRow(item){
          this.$emit("adminTable:cilckRow", item)
      },
      handelDeleteRow(item){
          this.$emit("adminTable:deleteRow", item)
      }
    }
}
</script>
