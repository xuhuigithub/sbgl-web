<template>
  <v-navigation-drawer
    v-model="showDrawer"
    app
    class="app-drawer"
    :mini-variant.sync="mini"
    mini-variant-width="64"
    :width="drawerWidth"
  >
    <v-toolbar color="primary darken-1" dark>
      <img :src="computeLogo" height="36" alt="Vue Material Admin Template" />
      <v-toolbar-title>
        <span class="hidden-sm-and-down">SBGL {{ VERSION }}</span>
        <br/>
                <span style="font-size: 3px;">后端版本：{{ BACKEND_VERSION }}</span>
      </v-toolbar-title>
    </v-toolbar>
    <!-- <app-switcher /> -->
    <vue-perfect-scrollbar class="app-drawer__scrollbar">
      <div class="app-drawer__inner">
        <nav-list :items="computeMenu" :mini="mini" />
      </div>
    </vue-perfect-scrollbar>
    <template #append>
      <div class="grey lighten-3">
        <template v-if="mini">
          <v-btn block width="64" height="48" icon tile class="mx-auto" @click="handleDrawerCollapse">
            <v-icon>mdi-arrow-collapse-right</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn right block height="48" icon tile @click="handleDrawerCollapse">
            <v-icon>mdi-arrow-collapse-left</v-icon>
          </v-btn>
        </template>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
import { protectedRoute as routes } from '@/router/Aconfig'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { mapGetters } from 'vuex'
// import AppSwitcher from './AppSwitcher'
import {VERSION} from '@/version'
import NavList from '@/components/nav/NavList'
import request from '@/util/request2'
export default {
  name: 'AppDrawer',
  components: { VuePerfectScrollbar, NavList },
  props: {},
  data() {
    return {
      mini: false,
      VERSION: VERSION,
      BACKEND_VERSION: 0,
      showDrawer: true,
      drawerWidth: 256,
      scrollSettings: {
        maxScrollbarLength: 160,
      },
    }
  },
  mounted(){
      const _self = this;
      request({
          url: `/version`,
          method: 'get',
        }).then((resp => {
          _self.BACKEND_VERSION = resp.data
        }))
  },
  computed: {
    computeLogo() {
      return '/static/m.png'
    },
    computeMenu() {
      return this.filterRouteItem(routes[0].children)
    },
    computeHeight() {
      return {
        height: this.height || '',
      }
    },
    ...mapGetters(['hasPermission']),
  },
  created() {},

  methods: {
    filterRouteItem(routes) {
      return routes
        .map((item) => {
          if (!item.meta.needPermissions){
            item.meta.needPermissions = []
          }
          return item
        })
        .filter((item) => item.meta.hidden !== true)
        .filter((item) => item.meta.needPermissions.every((a)=>{return this.hasPermission(a)} ))
        .map((item) => {
          return {
            title: this.$t(item.meta.title),
            icon: item.meta.icon,
            path: item.path,
            isNew: item.meta.isNew || false,
            children: item.children ? this.filterRouteItem(item.children) : [],
          }
        })
    },
    handleDrawerCollapse() {
      this.mini = !this.mini
    },
    toggleDrawer() {
      this.showDrawer = !this.showDrawer
    },
  },
}
</script>

<style lang="sass" scoped>
.app-drawer
  &__srollbar
    max-height:  calc(100vh - 64px - 36px - 44px)
  &__inner
    height: calc(100vh - 64px - 36px - 44px)
</style>
