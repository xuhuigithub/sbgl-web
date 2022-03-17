<template>
<div>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :title="formTitle"
    :items="formItems"
    :loading="loading"
    color="primary"
    show-header
    @form:submit="handleSubmit"
    @form:cancel="$emit('form:cancel')"
  />
  <v-switch label="是否自动采集" v-model="auto_populate"></v-switch>
</div>

</template>

<script>
import { VFormBuilder } from '@tookit/vma'
import { VTextField, VTextarea, VAutocomplete } from 'vuetify/lib'
import { mapGetters } from 'vuex'
import { IP } from '@/util/regex'
import ListField from './ListField.vue'
export default {
  components: {
    VFormBuilder,
  },
  props: {
    item: Object,
    columns: Array,
  },
  data() {
    return {
      loading: false,
      formModel: {},
      auto_populate: true,
    }
  },
  computed: {
    ...mapGetters(['getProjectList', 'getUsers','getCabinets', 'getAssetFamily']),
    formTitle() {
      return this.item ? 'Edit Asset - ' + this.item.sn : 'Create Asset'
    },
    formItems() {
      return [
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'real_sn',
            required: true,
            outlined: true,
            rules: [(v) => !!v || '此字段不能为空'],
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'model',
            required: true,
            outlined: true,
            rules: [(v) => !!v || '此字段不能为空'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'ip',
            required: true,
            outlined: true,
            rules: [(v) => !!v || '此字段不能为空', (v) => IP.test(v) || '错误的IP格式'],
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'cpu',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'mem',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'mac',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'port',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'disk',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'system',
            outlined: true,
          },
        },
        {
          cols: 12,
          element: VAutocomplete,
          props: {
            name: 'user_name',
            label: 'UserName',
            outlined: true,
            items: this.getUsers,
            "item-text": "name",
            "item-value": "name",
          },
        },
        {
          cols: 12,
          element: VAutocomplete,
          props: {
            name: 'cabinet_id',
            label: 'Cabinet',
            outlined: true,
            items: this.getCabinets
          },
        },
        {
          cols: 12,
          element: VAutocomplete,
          props: {
            name: 'family',
            label: 'Family',
            outlined: true,
            items: this.getAssetFamily
          },
        },
        {
          cols: 12,
          element: VTextarea,
          props: {
            name: 'comment',
            outlined: true,
          },
        }
      ].filter((a) => {
          if (this.columns[0] == '*') {
            return true
          }
          return this.columns.includes(a.props.name)
      })
    },
  },
  watch: {
    item: {
      handler(item) {
        this.formModel = item ? this.mergeData(this.formData(), item) : this.formData()
      },
      immediate: true,
    },
  },
  methods: {
    mergeData(source, target) {
      for (let key in source) {
        source[key] = target[key]
      }
      return source
    },
    formData() {
      const model = {}
      this.formItems.forEach((item) => {
        model[item.props.name] = item.default || null
      })
      return model
    },
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        console.log(this.auto_populate)
        if (this.item && this.item.created_time) {
          return this.$store
            .dispatch('updateAsset', {
              sn: this.item.sn,
              data: data,
              auto_populate: this.auto_populate
            })
            .then(() => {
              this.$emit('form:success')
              this.loading = false
            })
            .catch(() => {
              this.$emit('form:fail')
              this.loading = false
            })
        } else {
          data.auto_populate = this.auto_populate
          return this.$store
            .dispatch('createAsset', data)
            .then(() => {
              this.$emit('form:success')
              this.loading = false
            })
            .catch(() => {
              this.$emit('form:fail')
              this.loading = false
            })
        }
      }
    },
    transformData(data) {
      return data
    },
  },
}
</script>
