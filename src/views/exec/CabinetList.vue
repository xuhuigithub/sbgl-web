<template>
  <v-container>
    <v-subheader class="pl-0">机柜 </v-subheader>
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
              placeholder="Type something"
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
            <v-btn icon @click="handleCreateItem" v-show="hasPermission('cabinet_create')">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider />
          <v-card-text class="pa-0">
            <v-data-table
              :loading="loadingItems"
              :headers="headers"
              :items="items"
              :disable-pagination=true
              item-key="id"
            >
              <template #[`item.dc_name`]="{ item }">
                <v-autocomplete
                  v-model="item.dc_name"
                  :items="getDC"
                  item-text="name"
                  item-value="name"
                  @change="handleUpdateDC(item, item.dc_name)"
                  v-if="hasPermission('cabinet_update')"
                />
                <span v-else>
                  {{ item.dc_name }}
                </span>
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
      <cabinet-form :item="selectedItem" @form:success="handleFormSuccess" @form:cancel="handleFormCancel" />
    </v-dialog>
  </v-container>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import CabinetForm from '@/components/form/CabinetForm'
import { mapGetters } from 'vuex'
export default {
  components: {
    CabinetForm
  },
  mixins: [TooltipMixin],
  data() {
    return {
      showDialog: false,
      search: '',
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      itemsPerPage: 15,
      showFilter: true,
      filter: {
        'filter[name]': "",
      },
      headers: [
        {
          text: 'ID',
          value: 'id',
          width: '10%'
        },
        {
          text: 'NAME',
          value: 'name',
          width: '50%'
        },
        {
          text: 'DC',
          value: 'dc_name',
          width: '20%'
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      items: [],
      actions: [
        {
          text: 'Delete Cabinet',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
          permissionEval: () => {
            return this.hasPermission('cabinet_delete')
          }
        },
      ],
    }
  },
  computed: {
      ...mapGetters(['getDC',,'hasPermission']),
  },
  watch: {
    '$route.query': {
      handler(query) {
        const filter = this.updateFilterQuery(query)
        this.fetchRecords(filter)
      },
      immediate: true,
    },
  },
  created(){


    this.$store.dispatch('fetchCabinet')
    this.$store.dispatch('fetchDC')
    this.fetchRecords(this.filter)
    
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
        'filter[name]': "",
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      const _self = this
      return this.$store.dispatch('fetchCabinet', query)
      .then((res) => {
        _self.loadingItems = false
        _self.items = res.data
      })
        .catch(() => {
          _self.loadingItems = false
        })
    },
    //action
    handleCreateItem() {
      this.selectedItem = null
      this.showDialog = true
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete ID: ' + id)) {
        this.$store.dispatch('deleteCabinet', {id: id}).then(() => {
          this.fetchRecords(this.filter)
        })
      }
    },
    handleUpdateDC(item, dc_name) {
      const payload = {
        id: item.id,
        data: {
          dc_name: dc_name,
        },
      }
      this.$store.dispatch('updateCabinet', payload)
    },
    handleRefreshItem() {
      this.fetchRecords(this.filter)
    },
    handleResetFilter() {
      this.filter = {
        'filter[*]': null,
      }
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
      this.fetchRecords()
    },
    handleFormCancel() {
      this.showDialog = false
    }
  },
}
</script>
