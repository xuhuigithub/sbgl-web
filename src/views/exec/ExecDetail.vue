<template>
  <v-container>
    <v-row>
      <v-col cols="12">
      <v-card tile>
      <v-card-title>
        组件日志:
      </v-card-title>
      <!-- <v-card-text>
          <v-btn> Zookeeper </v-btn> <v-btn> Kafka </v-btn> <v-btn> Redis </v-btn>
      </v-card-text> -->
      </v-card>
      <br>
      <!-- 详情页 -->
      <v-card tile>
        <v-card-text>
                <div v-for="(item, index) in pets" :key="`${index}`" v-html="item"></div>
        </v-card-text>
      </v-card>
      <br/>
      <!-- <v-card>
        <v-card-actions>
                  <v-btn
          color="orange"
          @click="goBack()"
          text
        >
         	&lt;- 返回 
        </v-btn>
        </v-card-actions>
      </v-card> -->

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
      pets: []
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
    // let evtSource = new EventSource('/api/test');
    // const self = this;
    // evtSource.addEventListener("ping", function(event) {
    //   if (event.data == 'EOF') {
    //     evtSource.close()
    //   }
    //   self.pets.push(event.data)
    // })

    // evtSource.onmessage = function(e) {
    //   console.log(e.data)
    // if (e.data == "EOF") {
    //     evtSource.close()
    // }
    // var newElement = document.createElement("li");

    // newElement.textContent = "message: " + e.data;
    // }

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
.v-btn {
  margin: 0% 5px 0% 5px;
}
</style>