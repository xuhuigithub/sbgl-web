<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :title="formTitle"
    :items="formItems"
    :loading="loading"
    color="primary"
    show-header
    @form:submit="handleSubmit"
    @form:cancel="handleCancel"
  />
</template>

<script>
import { VFormBuilder } from '@tookit/vma'
import { VTextField, VTextarea, VAutocomplete } from 'vuetify/lib'
import { mapGetters } from 'vuex'
export default {
  components: {
    VFormBuilder,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      formModel: {},

    }
  },
  computed: {
    ...mapGetters(['getDC']),
    formTitle() {
      return this.item ? 'Edit Cabinet - ' + this.item.name : 'Create Cabinet'
    },
    formItems() {
      return [
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'name',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'name is required'],
          },
        },
        {
          cols: 12,
          element: VAutocomplete,
          props: {
            name: 'dc_name',
            label: 'DC',
            outlined: true,
            items: this.getDC,
            "item-text": "name",
            "item-value": "name",
          },
        }
      ]
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
    handleCancel(){
      this.$emit('form:cancel')
    },
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        if (this.item && this.item.exists) {
          return this.$store
            .dispatch(this.updateAction, {
              name: this.item.name,
              data: data,
            })
            .then((data) => {
              if (data.status != 0){
                this.$emit('form:fail')
              } else {
                this.$emit('form:success')
              }
              this.loading = false
            })
            .catch(() => {
              this.$emit('form:fail')
              this.loading = false
            })
        } else {
          return this.$store
            .dispatch('createCabinet', data)
            .then((data) => {
              if (data.status != 0){
                this.$emit('form:fail')
              } else {
                this.$emit('form:success')
              }
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
