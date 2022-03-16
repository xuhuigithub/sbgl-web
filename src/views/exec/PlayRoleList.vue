<template>
  <v-container>
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
              placeholder="输入名称 模糊搜索"
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
                  <v-autocomplete v-model="filter['filter[ip]']" :items="getsearchAbleFieldData" item-text="ip" item-value="ip" label="主机IP" />
                </v-col>
                <v-col :cols="4">
                  <v-autocomplete v-model="filter['filter[main_name]']" :items="main_label_names" item-text="name" item-value="name" label="主标签名称" />
                </v-col>
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
              :footer-props="{'items-per-page-options':[15, 30, 50, 100, -1]}"
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
    <v-dialog ref="execs" v-model="showDialog" scrollable fullscreen persistent>
      <v-row>
        <v-col cols="12">
          <exec-detail  v-model="exec_name" :uuid="componentKey"  @playok="handelPlayOK" />
        </v-col>
        <v-col cols="12">
          <v-btn color="orange" @click="handleColse" v-show="isplayok" block>关闭</v-btn>
        </v-col>
      </v-row>
    </v-dialog>
  </v-container>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import AssetForm from '@/components/form/AssetForm'
import { mapGetters } from 'vuex'
import request from '@/util/request2'
// import ExecDetail from '@/views/exec/ExecDetail'
import ExecDetail from './ExecDetail.vue'

export default {
  components: {
    ExecDetail
  },
  mixins: [TooltipMixin],
  data() {
    return {
      isplayok: false,
      componentKey: 0,
      showDialog: false,
      exec_name: '',
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      itemsPerPage: 15,
      formColumns: [],
      showFilter: true,
      filter: {
        page: 1,
        'filter[name]': null,
        'filter[main_name]': null,
        'filter[ip]': null,
      },
      headers: [
        {
          text: '名称',
          value: 'name',
          width: '30%'
        },
        {
          text: '主标签',
          value: 'main_name',
        },
        {
          text: '主机',
          value: 'hosts',
        },
        {
          text: '上一次执行时间',
          value: 'last_execution',
        },
        {
          text: '上一次退出代码',
          value: 'last_exit_code',
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      items: [],
      actions: [
        {
          text: '执行',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
          permissionEval: () => {
            return this.hasPermission('asset_update')
          }
        },
        {
          text: '删除',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
          permissionEval: () => {
            return this.hasPermission('asset_delete')
          }
        },        
        {
          text: '下载日志',
          icon: 'mdi-close',
          click: this.downloadLog,
          permissionEval: () => {
            return this.hasPermission('asset_delete')
          }
        },
      ],
      main_label_names: [],
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

    const _self = this
    request({
        url: `/play_role/`,
        method: 'get',
        params: {
      'start': '1',
      'limit': '65535'
      },
        headers: {
          'X-Fields': '{results{name}}'
        }
    }).then((resp) => {
        _self.main_label_names = resp.data.results.map((item) => {
          return item.name
        })
  }).catch(() => {
      })
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
        'filter[name]': null,
        'filter[main_name]': null,
        'filter[ip]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      const _self = this
      request({
        url: `/play_role/sub`,
        method: 'get',
        params: {start: _self.start, limit: _self.limit, ...query},
      }).then((resp) => {
        _self.items = resp.data.results
        _self.serverItemsLength = resp.data.count
        _self.loadingItems = false
    }).catch(() => {
          _self.loadingItems = false
        })
    },
    //action
    handleCreateItem() {
      this.$router.push({path: `/exec/SubPlayRoleAdd?action=add`})
    },
    handleEditItem(item) {
      this.exec_name = item.name
      this.showDialog = true
    },
    handleDeleteItem({ name }) {
      if (window.confirm('Are you sure to delete this')) {
            request({
                url: `/play_role/sub/${name}`,
                method: 'delete',
            }).then(()=>{
              this.fetchRecords(this.filter)
            }).catch(()=>{
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
    handleClickRow ({name}) {
      this.$router.push({path: `/exec/SubPlayRoleAdd?action=update&name=${name}`})
    },
    handleColse (){
      this.showDialog = false
      this.componentKey += 1;  
      location.reload()
    },
    handelPlayOK () {
      this.isplayok = true;
    },
    downloadLog ({ name }){
      window.open(`/api/play_role/sub/${name}/log`)
    }
  },
}
</script>
