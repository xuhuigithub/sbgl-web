<template>
  <v-container>
    <!-- <v-subheader class="pl-0">资产 </v-subheader> -->
    <v-row>
      <v-col cols="12">
        <v-card tile>
          <v-toolbar flat>
            <v-text-field
              v-model="filter['filter[name]']"
              text
              solo
              flat
              :prepend-icon="showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'"
              append-icon="mdi-magnify"
              placeholder="输入IP 或者 SN 模糊搜索"
              hide-details
              clearable
              @keyup.enter="handleApplyFilter"
              @click:append="handleApplyFilter"
              @click:prepend="showFilter = !showFilter"
              @click:clear="handleClear"
            />
            <v-btn icon @click="handleRefreshItem">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn icon @click="handleCreateItem" v-show="hasPermission('asset_create')">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider />
          <v-card v-show="showFilter" flat class="grey lighten-4">
            <v-card-text>
              <v-row>
                <v-col :cols="4">
                  <v-autocomplete v-model="filter['filter[sn]']" :items="getsearchAbleFieldData" item-text="sn" item-value="sn" label="SN" />
                </v-col>
                <v-col :cols="4">
                  <v-autocomplete v-model="filter['filter[ip]']" :items="getsearchAbleFieldData" item-text="ip" item-value="ip" label="IP" />
                </v-col>
                <v-col :cols="4">
                  <v-autocomplete v-model="filter['filter[user]']" :items="getUsers" item-text="name" item-value="name" label="UserName" />
                </v-col>
                <!-- <v-col :cols="4">
                  <v-autocomplete v-model="filter['filter[status]']" :items="getTaskStatus" label="Status" />
                </v-col> -->
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="handleResetFilter">Reset</v-btn>
              <v-btn tile color="primary" @click="handleApplyFilter">Apply</v-btn>
            </v-card-actions>
          </v-card>
          <v-card-text class="pa-0">
            <v-data-table
              disable-sort
              :loading="loadingItems"
              :headers="headers"
              :items="items"
              :footer-props="{'items-per-page-options':[5, 15, 30, 50, 100, -1]}"
              :server-items-length="serverItemsLength"
              :items-per-page.sync="itemsPerPage"
              :page.sync="filter['page']"
              item-key="name"
              @update:page="handlePageChanged"
              @click:row="handleClickRow"
            >
              <template #[`item.status`]="{ item }">
                <v-autocomplete
                  v-model="item.status"
                  :items="getTaskStatus"
                  @change="handleUpdateStatus(item, item.status)"
                />
              </template>
              <template #[`item.action`]="{ item }">
                <v-menu>
                  <template #activator="{ on: menu }">
                    <v-tooltip bottom>
                      <template #activator="{ on: tooltip }">
                        <v-btn icon v-on="onTooltip({ ...tooltip, ...menu })">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <span>Action</span>
                    </v-tooltip>
                  </template>
                  <v-list class="pa-0" dense>
                    <v-list-item v-for="action in actions" :key="action.text" @click="action.click(item)" v-show="action.permissionEval()">
                      <v-list-item-icon class="mr-2">
                        <v-icon small>{{ action.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ action.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" scrollable width="840">
      <asset-form :item="selectedItem" :columns="formColumns" @form:success="handleFormSuccess" @form:cancel="handleFormCancel" />
    </v-dialog>
  </v-container>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import AssetForm from '@/components/form/AssetForm'
import { mapGetters } from 'vuex'
export default {
  components: {
    AssetForm,
  },
  mixins: [TooltipMixin],
  data() {
    return {
      showDialog: false,
      search: '',
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      itemsPerPage: 5,
      formColumns: [],
      showFilter: true,
      filter: {
        page: 1,
        'filter[sn]': null,
        'filter[ip]': null,
        'filter[user]': null,
      },
      headers: [
        {
          text: 'SN',
          value: 'sn',
          width: '30%'
        },
        {
          text: 'IP',
          value: 'ip',
        },
        {
          text: 'Model',
          value: 'model',
        },
        {
          text: 'Description',
          value: 'comment',
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      items: [],
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
          permissionEval: () => {
            return this.hasPermission('asset_update')
          }
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
          permissionEval: () => {
            return this.hasPermission('asset_delete')
          }
        },
      ],
    }
  },
  computed: {
      start: function(){
        let a = (this.filter.page - 1) * this.itemsPerPage
        // if (a == 0) {
          a += 1
        // }
          return a
      },
      limit: function(){
        return this.filter.page * this.itemsPerPage
      },
      ...mapGetters(['getTaskStatus', 'getProjectList', 'getsearchAbleFieldData','getUsers','hasPermission']),
  },
  watch: {
    '$route.query': {
      handler(query) {
        const filter = this.updateFilterQuery(query)
        this.fetchRecords(filter)
      },
      immediate: true,
    },
    'itemsPerPage': {
      handler() {
        this.fetchRecords(this.filter)
      },
    }
  },
  created(){

  this.$store
    .dispatch('fetchsearchAbleFieldData', {
      'start': '1',
      'limit': '65535'
    })

    this.$store.dispatch('fetchUser')
    this.$store.dispatch('fetchCabinet')
  },

  methods: {
    //
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, this.transformQuery(query))
      return filter
    },
    transformQuery(query) {
      const numbers = ['filter[project_id]', 'filter[status]', 'page']
      for (let key in query) {
        if (numbers.includes(key)) {
          const val = query[key] ? parseInt(query[key]) : query[key]
          query[key] = val
        }
      }
      return query
    },
    resetFilter() {
      this.filter = {
        page: this.filter.page,
        'filter[sn]': null,
        'filter[ip]': null,
        'filter[user]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      const _self = this
      return this.$store
        .dispatch('fetchAsset', {start: this.start, limit: this.limit, ...query})
        .then(({ data, meta }) => {
          _self.items = data.results
          _self.serverItemsLength = data.count
          _self.loadingItems = false
        })
        .catch(() => {
          _self.loadingItems = false
        })
    },
    //action
    handleCreateItem() {
      this.formColumns = ['sn','ip','user_name','comment','cabinet_id','family']
      this.selectedItem = null
      this.showDialog = true
    },
    handleEditItem(item) {
      this.formColumns = ['*']
      this.selectedItem = item
      this.showDialog = true
    },
    handleDeleteItem({ sn }) {
      if (window.confirm('Are you sure to delete this')) {
        this.$store.dispatch('deleteAsset', sn).then(() => {
          this.fetchRecords(this.filter)
        })
      }
    },
    handleUpdateStatus(item, status) {
      const payload = {
        id: item.id,
        data: {
          status: status,
        },
      }
      this.$store.dispatch('updateTask', payload)
    },
    handleRefreshItem() {
      this.fetchRecords(this.filter)
    },
    // filter
    handlePageChanged(page) {
      this.filter.page = page
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleResetFilter() {
      this.resetFilter()
      this.$router.replace({
        path: this.$route.path,
      })
    },
    handleApplyFilter() {
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleFormSuccess() {
      this.showDialog = false
      this.fetchRecords(this.filter)
    },
    handleFormCancel() {
      this.showDialog = false
    },
    handleClickRow ({sn}) {
      this.$router.push({path: `/asset/detail/${sn}`})
    }
  },
}
</script>
