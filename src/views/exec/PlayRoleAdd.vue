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
            <v-text-field v-model="label.name" label="标签名称" :rules="[...rules_str, value => {
          const pattern = /^[A-Za-z]+$/
          return pattern.test(value) || 'Invalid'
        },]"></v-text-field>
            <v-text-field v-model="label.path" label="标签路径" :rules="[value => !!value || 'Required.']"></v-text-field>
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
                <v-select :items="selects" v-model="item.type"></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field label="属性名称" v-model="item.name">
              </v-text-field>
              </v-col>
              <v-col cols="3" v-if="item.type == 'String'">
                <v-text-field label="默认值" v-model="item.value" :rules="rules_str">
              </v-text-field>
              </v-col>
              <v-col cols="3" v-else-if="item.type == 'Boolean'">
                <v-switch v-model="item.value" value="true"></v-switch>
              </v-col>
              <v-col cols="3" v-else-if="item.type == 'Int'">
                <v-text-field label="默认值" v-model="item.value" :rules="rules_int">
              </v-text-field>
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
        </v-form>

        </v-card-text>
      </v-card>
      <br/>

      <v-card>
        <v-card-actions>
        <v-btn
        v-show="mode == 'submit'"
        :disabled="!valid || !valid2"
          color="orange"
          @click="goBack()"
        >
         	提交 
        </v-btn>
        <v-btn
        v-show="mode == 'update'"
        :disabled="!valid || !valid2"
          color="green"
          @click="update()"
        >
         	更新 
        </v-btn>
        </v-card-actions>
      </v-card>
      <br/>
      <v-card>
        <v-card-text>
          <admin-table
          :loadingItems="admintable.loadingItems" 
          :page="admintable.page" 
          :apidata="admintable.apidata" 
          :headers="admintable.headers" 
          :itemsPerPage="admintable.itemsPerPage" 
          :itemKey="admintable.itemKey"
          @adminTable:cilckRow="handleClickRow"
          @adminTable:deleteRow="handleDeleteRow"
          />
        </v-card-text>
      </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import request from '@/util/request2'
import AdminTable from '@/components/AdminTable'

export default {
  components: {
    AdminTable
  },
  mixins: [TooltipMixin],
  data() {
    return {
      valid: false,
      valid2: false,
      mode: "submit",
      label: {
        name: "",
        path: ""
      },
      admintable: {
        loadingItems: false,
        headers: [
        {
          text: '名称',
          value: 'name',
        },
        {
          text: '路径',
          value: 'path',
        },
        ],
        apidata: {
          results: [],
        },
        itemsPerPage: 15,
        itemKey: "name",
        page: 1
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
        start: function(){
        let a = (this.admintable.page - 1) * this.admintable.itemsPerPage
        // if (a == 0) {
          a += 1
        // }
          return a
      },
      limit: function(){
        return this.admintable.page * this.admintable.itemsPerPage
      },
  },
  watch: {
  },
  created(){
    this.fetchRecords()
  },
  mounted(){
    this.validate()
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
      request({
        url: `/play_role/`,
        method: 'post',
        data: {
          name: this.label.name,
          path: this.label.path,
          play_args: this.items,
        }
      }).hten(()=>{
        this.fetchRecords()
      }).catch(() => {
        this.fetchRecords()
      })
    },

    update() {
      if (!this.$refs.form.validate()){
        return
      }
      if (!this.$refs.form2.validate()){
        return
      }
      request({
        url: `/play_role/${this.label.name}`,
        method: 'put',
        data: {
          name: this.label.name,
          path: this.label.path,
          play_args: this.items,
        }
      }).hten(()=>{
        this.fetchRecords()
      }).catch(() => {
        this.fetchRecords()
      })
    },

    Add() {
      this.items.push({name: '属性', type: "String", value: null,})
    },

    Sub(index) {
      if (this.items.length > 1){
        this.items.splice(index, 1);
      }
    },
    validate () {
      this.$refs.form.validate()
      this.$refs.form2.validate()
    },

    handleClickRow({name, path, play_args}){
      this.items = play_args
      this.label.name = name
      this.label.path = path
      this.mode = 'update'
    },

    handleDeleteRow({name}){
    request({
        url: `/play_role/${name}`,
        method: 'delete',
      }).hten(()=>{
        this.fetchRecords()
      }).catch(() => {
        this.fetchRecords()
      })
    },

    fetchRecords(){
      this.admintable.loadintItems = true
      const _self = this
      request({
          url: `/play_role/`,
          method: 'get',
          params: {start: _self.start, limit: _self.limit},
        }).then((resp => {
          _self.admintable.apidata = resp.data
          _self.admintable.loadintItems = false
        })).catch((err => {
          _self.admintable.loadintItems = false
        }))
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