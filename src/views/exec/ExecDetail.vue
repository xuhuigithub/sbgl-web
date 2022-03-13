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
  props: {
    value: String,
    uuid: Number,
},
  data() {
    return {
      loadingItems: true,
      selectedItem: {},
      pets: []
    }
  },
  computed: {
  },
  watch: {
  },
  created(){
    let evtSource = new EventSource(`/api/execPlayRole?name=${this.value}&${this.uuid}`);
    const self = this;
    evtSource.addEventListener("ping", function(event) {
      if (event.data == 'EOF') {
        evtSource.close()
        self.$emit("playok")
      }
      self.pets.push(event.data)
    })

    evtSource.onmessage = function(e) {
      console.log(e.data)
    if (e.data == "EOF") {
        evtSource.close()
    }
    var newElement = document.createElement("li");

    newElement.textContent = "message: " + e.data;
    }

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
.v-card__text {
  background-color: blanchedalmond;
}
</style>