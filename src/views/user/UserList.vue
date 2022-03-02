<template>
  <v-container>
    <v-subheader class="pl-0">用户 </v-subheader>
    <v-row>
      <v-col cols="12">
        <v-card tile>
          <v-toolbar flat>
            <v-text-field
              v-model="filter['filter[*]']"
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
            <v-btn icon @click="handleCreateItem">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider />
          <v-card-text class="pa-0">
            <v-data-table
              :loading="loadingItems"
              :headers="headers"
              :items="getUsers"
              :disable-pagination=true
              item-key="name"
              show-select
            >
              <template #[`item.role_name`]="{ item }">
                <v-autocomplete
                  v-model="item.role_name"
                  :items="getRoles"
                  item-text="name"
                  item-value="name"
                  @change="handleUpdateUserRole(item, item.role_name)"
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
                    <v-list-item v-for="action in actions" :key="action.text" @click="action.click(item)">
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
      <a-user-form updateAction="updateUser" :item="selectedItem" @form:success="handleFormSuccess" @form:cancel="handleFormCancel" />
    </v-dialog>
  </v-container>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import AUserForm from '@/components/form/AUserForm'
import { mapGetters } from 'vuex'
export default {
  components: {
    AUserForm,
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
        'filter[*]': "*",
      },
      headers: [
        {
          text: 'NAME',
          value: 'name',
          width: '15%'
        },
        {
          text: 'RealName',
          value: 'realname',
          width: '15%'
        },
        {
          text: 'Role',
          value: 'role_name',
          width: '20%'
        },
        {
          text: 'Description',
          value: 'desc',
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      items: [],
      actions: [
        {
          text: 'Edit User',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Delete User',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
      start: function(){
          return (this.filter.page - 1) * this.itemsPerPage
      },
      limit: function(){
        return this.filter.page * this.itemsPerPage
      },
      ...mapGetters(['getsearchAbleFieldData','getUsers','getRoles']),
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


    this.$store.dispatch('fetchRole')
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
        'filter[*]': "*",
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      const _self = this
      return this.$store.dispatch('fetchUser', query)
      .then(() => {
        _self.loadingItems = false
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
    handleEditItem(item) {
      this.selectedItem = item
      this.showDialog = true
    },
    handleDeleteItem({ name }) {
      if (window.confirm('Are you sure to delete ' + name)) {
        this.$store.dispatch('deleteUser', {name: name}).then(() => {
          this.fetchRecords(this.filter)
        })
      }
    },
    handleUpdateUserRole(item, role_name) {
      const payload = {
        name: item.name,
        data: {
          role_name: role_name,
        },
      }
      this.$store.dispatch('updateUser', payload)
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
