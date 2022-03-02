<template>
  <v-container>
    <v-row>
      <v-col cols="12">
      <v-card tile>
      <v-card-title>
        资产详情 SN: {{ $route.params.sn }}
      </v-card-title>
      <v-card-text>
        <div>概览:
          <br>
        <p>Model: {{ selectedItem.model }}</p>
        <p>CPU: {{ selectedItem.cpu }}</p>
        </div>
        <div class="text--primary">
        {{ selectedItem.comment }}
        </div>
      </v-card-text>
      </v-card>
      <br>
      <!-- 详情页 -->
      <v-card tile>
        <v-card-text>
        <v-skeleton-loader
          class="mx-auto"
          max-width="100%"
          max-height="200px"
          type="table"
          :loading="loadingItems"
        >
          <v-simple-table
            fixed-header
            :dense=true
            :v-show="!loadingItems"
          >
            <template v-slot:default>

              <tbody>
                <tr
                  v-for="item in dataProps"
                  :key="item.name"
                  style="font-family: 微软雅黑；"
                >
                  <td width="20%" style="text-align: center">{{ item.name }}</td> &nbsp;&nbsp;&nbsp;&nbsp; <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-skeleton-loader>
        </v-card-text>
      </v-card>
      <br/>
      <v-card>
        <v-card-actions>
                  <v-btn
          color="orange"
          @click="goBack()"
          text
        >
         	&lt;- 返回 
        </v-btn>
        </v-card-actions>
      </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import { humanReadableFileSize } from 'vuetify/lib/util/helpers'
export default {
  components: {
  },
  mixins: [TooltipMixin],
  data() {
    return {
      loadingItems: true,
      selectedItem: {},
    }
  },
  computed: {
      dataProps() { return [
        {
          name: 'CPU',
          value: this.selectedItem.cpu,
        },
        {
          name: '内存',
          value: humanReadableFileSize(this.selectedItem.mem),
        },
        {
          name: '磁盘大小',
          value: humanReadableFileSize(this.selectedItem.disk),
        },
        {
          name: '网卡mac',
          value: this.selectedItem.mac,
        },
        {
          name: 'IP地址',
          value: this.selectedItem.ip,
        },
        {
          name: '系统版本',
          value: this.selectedItem.system,
        },
        {
          name: '机柜',
          value: this.selectedItem.cabinet,
        },
        {
          name: '数据中心',
          value: this.selectedItem.dc,
        },
        {
          name: '系统用户数',
          value: this.selectedItem.user_nums,
        },
      ]
    }
  },
  watch: {
  },
  mounted(){
      return this.$store
        .dispatch('getAssetBySN', this.$route.params.sn)
        .then(({ data, meta }) => {
          this.selectedItem = data
          window.setTimeout(()=>{this.loadingItems = false},1000)
        })
        .catch(() => {
          this.loadingItems = false
        })
  },

  methods: {
    //
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>
<style lang="css" scoped>
p {
  margin: 0% 0% 5px 0%;
}
</style>