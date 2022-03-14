<template>
  <v-container>
    <v-row>
      <v-col cols="12">
      <v-card tile>
      <v-card-title>
        主标签:
      </v-card-title>
      <v-card-text>
          <v-form
              v-model="valid2"
              lazy-validation
               ref="form2"
          >
            <v-text-field v-model="sub_label.name" label="标签名称" :rules="[...rules_str, value => {
          const pattern = /^[A-Za-z-]+$/
          return pattern.test(value) || 'Invalid'
        }, value => {
          return value.endsWith('-' + label_name) || '必须以主Label名结尾'
        },]"></v-text-field>
            <v-select :menu-props="{ top: true, offsetY: true }" :items="labels" item-text="name" item-value="name" @change="updateItems" v-model="label_name" label="标签" :rules="[value => !!value || 'Required.']"></v-select>
            <v-select v-model="sub_label.hosts" multiple :items="hosts" :item-text="item => item.sn +' - '+ item.ip"  item-value="ip"  :rules="[value => !!value || 'Required.']">
            </v-select>
          </v-form>
      </v-card-text>
      </v-card>
      <br>
      <!-- 展开属性 -->
      <v-card tile>
        <v-card-text>
          <v-form
              v-model="valid"
              lazy-validation
               ref="form"
          >
            <v-row  v-for="(item, index) in items" :key="index">
              <v-col cols="3">
                <v-select :items="selects" v-model="item.type" readonly></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field label="属性名称" v-model="item.name" readonly>
              </v-text-field>
              </v-col>
              <v-col cols="3" v-if="item.type == 'String'">
                <v-text-field label="值" v-model="item.value" :rules="rules_str">
              </v-text-field>
              </v-col>
              <v-col cols="3" v-else-if="item.type == 'Boolean'">
                <v-switch v-model="item.value" value="true"></v-switch>
              </v-col>
              <v-col cols="3" v-else-if="item.type == 'Int'">
                <v-text-field label="值" v-model="item.value" :rules="rules_int">
              </v-text-field>
              </v-col>
          </v-row>
        </v-form>

        </v-card-text>
      </v-card>
      <br/>
      <v-card>
        <v-card-actions>
        <v-btn
        :disabled="!valid || !valid2"
          color="orange"
          @click="goBack()"
        >
         	{{ buttonName }}
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
      valid: false,
      valid2: false,
      label_name: "",
      labels: [],
      hosts: [],
      sub_label: {
        name: "",
        hosts: []
      },
      items: [
        {name: '属性', type: "String", value: null,},
      ],
      selects: ["String", "Int", "Boolean"],
      rules_str: [
        value => !!value || 'Required.',
        value => (value || '').length <= 50 ||  'Max 50 characters'
      ],
      rules_int: [
        value => !!value || 'Required.',
        value => (value || '').length <= 50 ||  'Max 50 characters',
        value => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Invalid'
        },
      ]
    }
  },
  computed: {
    isUpdate: function() {
       if (this.$route.query.action == "update") {
         return true
       } else {
         return false
       }
    },
    buttonName: function() {
       if (this.isUpdate) {
         return "更新"
       } else {
         return "提交"
       }
    }
  },
  watch: {
  },
  mounted(){
    this.validate()
    this.getItems()
    const _self = this
    this.$store
        .dispatch('fetchAsset', {})
        .then(({ data, meta }) => {
          _self.hosts = data.results
        })
    if (this.isUpdate) {
      request({
        url: `/play_role/sub/${this.$route.query.name}`,
        method: 'get',
      }).then((resp) => {
        this.items = resp.data.play_args
        this.sub_label.name = resp.data.name
        this.label_name =  resp.data.main_name
        this.sub_label.hosts = resp.data.hosts
      })    
    }
  },

  methods: {
    //
    goBack() {
      if (!this.$refs.form.validate()){
        return
      }
      if (!this.$refs.form2.validate()){
        return
      }
      if (this.isUpdate) {
        request({
          url: `/play_role/sub/${this.$route.query.name}`,
          method: 'put',
          data: {
            name: this.sub_label.name,
            main_name: this.label_name,
            play_args: this.items,
            hosts: this.sub_label.hosts
          }
        }).then((resp) => {
        return resp
        })
      } else {
        request({
          url: `/play_role/sub`,
          method: 'post',
          data: {
            name: this.sub_label.name,
            main_name: this.label_name,
            play_args: this.items,
            hosts: this.sub_label.hosts
          }
        }).then((resp) => {
        return resp
        })
      }
    },

    updateItems() {
      request({
        url: `/play_role/${this.label_name}`,
        method: 'get',
      }).then((resp) => {
        this.items = resp.data.play_args
      })
    },

    getItems() {

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
        _self.labels = resp.data.results
  }).catch(() => {
      })
    },

    validate () {
      this.$refs.form.validate()
      this.$refs.form2.validate()
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