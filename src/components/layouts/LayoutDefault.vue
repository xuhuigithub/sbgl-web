<template>
  <div class="admin">
    <app-drawer ref="drawer" class="admin_drawer" @drawer:collapsed="mini = !mini" />
    <app-toolbar class="admin_toolbar" extended @side-icon-click="handleDrawerVisiable" @showProfile="handleshowProfile" />
    <v-main class="grey lighten-3">
      <!-- Page Wrapper -->
      <div class="page_wrapper"><router-view /></div>
      <!-- App Footer -->
      <v-footer height="auto" class="pa-3 app--footer">
        <span>1498472791@qq.com &copy; {{ new Date().getFullYear() }}</span>
        <v-spacer />
        <!-- <span class="caption mr-1">sbgl</span>
        <v-icon color="pink" small>fa-affiliatetheme</v-icon> -->
      </v-footer>
    <v-dialog v-model="showDialog" scrollable width="840">
      <a-user-form updateAction="updateMe" :item="getUserProfile" @form:success="handleFormSuccess" @form:cancel="handleFormCancel" />
    </v-dialog>
    </v-main>
    <!-- Go to top -->
    <app-fab />
  </div>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import AppFab from '@/components/AppFab'
import AUserForm from '@/components/form/AUserForm'
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutDefault',
    created(){
      this.$store.dispatch('fetchRole')
    },
  components: {
    AppDrawer,
    AppToolbar,
    AppFab,
    AUserForm
  },
  computed: {
      ...mapGetters(['getUserProfile']),
  },
  data() {
    return {
      mini: false,
      showDrawer: true,
      showDialog: false
    }
  },
  methods: {
    handleDrawerVisiable() {
      this.$refs.drawer.toggleDrawer()
    },
    handleshowProfile() {
      this.showDialog = true
    },
    refreshUser() {
        this.$store.dispatch('login', {user_name: this.$store.getters.getUsername, password: this.$store.getters.getPassword}).then(() => {})
    },
    handleFormSuccess() {
      this.showDialog = false
      this.refreshUser()
    },
    handleFormCancel() {
      this.showDialog = false
    }
  },
}
</script>

<style lang="sass" scoped>
.page_wrapper
  min-height: calc(100vh - 112px - 48px)
  padding-top: 35px
  .container
    max-width: 1200px
</style>
