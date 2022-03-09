<template>
  <v-container>
    <v-row>
      <v-col cols="12">
      <v-card tile>
      <v-card-title>
        主标签:
      </v-card-title>
      <v-card-text>
         <v-text-field v-model="label.name" label="标签名称"></v-text-field>
         <v-text-field v-model="label.path" label="标签路径"></v-text-field>
      </v-card-text>
      </v-card>
      <br>
      <!-- 展开属性 -->
      <v-card tile>
        <v-card-text>
          <v-row  v-for="(item, index) in items" :key="index">
            <v-col cols="3">
              <v-select :items="selects" v-model="item.type"></v-select>
            </v-col>
            <v-col cols="3">
              <v-text-field label="属性名称" v-model="item.name">
             </v-text-field>
            </v-col>
            <v-col cols="3" v-if="item.type == 'String'">
              <v-text-field label="默认值" v-model="item.value">
             </v-text-field>
            </v-col>
            <v-col cols="3" v-else-if="item.type == 'Boolen'">
              <v-switch v-model="item.value" value="true"></v-switch>
            </v-col>
          <v-col cols="2">
              <v-btn
              @click="Sub(index)"
              >
                -
              </v-btn>
              <v-btn
              @click="Add"
              >
                +
              </v-btn>
          </v-col>
        </v-row>
        </v-card-text>
      </v-card>
      <br/>
      <v-card>
        <v-card-actions>
        <v-btn
          color="orange"
          @click="goBack()"
        >
         	提交 
        </v-btn>
        </v-card-actions>
      </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import request from '@/util/request2'

export default {
  components: {
  },
  mixins: [TooltipMixin],
  data() {
    return {
      label: {
        name: "",
        path: ""
      },
      items: [
        {name: '属性', type: "String", value: "CHANGE_ME",},
      ],
      selects: ["String", "Int", "Boolen"]
    }
  },
  computed: {
  },
  watch: {
  },
  mounted(){

  },

  methods: {
    //
    goBack() {
      request({
        url: `/play_role/`,
        method: 'post',
        data: {
          name: this.label.name,
          path: this.label.path,
          play_args: this.items,
        }
      }).then((resp) => {
      return resp
      })
    },

    Add() {
      this.items.push({name: '属性', type: "String", value: "CHANGE_ME",})
    },

    Sub(index) {
      if (this.items.length > 1){
        this.items.splice(index, 1);
      }
    }
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