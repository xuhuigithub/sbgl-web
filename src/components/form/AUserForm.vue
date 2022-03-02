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
    updateAction: String
  },
  data() {
    return {
      loading: false,
      formModel: {},

    }
  },
  computed: {
    ...mapGetters(['getRoles']),
    formTitle() {
      return this.item ? 'Edit User - ' + this.item.name : 'Create User'
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
          element: VTextField,
          props: {
            name: 'realname',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'realname is required'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'tel',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'tel is required'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'email',
            outlined: true,
            rules: [(v) => !!v || 'email is required'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'password',
            type: 'password',
            outlined: true,
            rules: [(v) => !!v || 'password is required'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'password_confirm',
            type: 'password',
            outlined: true,
            rules: [(v) => v == this.formModel.password  || 'password mismatch'],
          },
        },
        {
          cols: 12,
          element: VAutocomplete,
          props: {
            name: 'role_name',
            label: 'RoleName',
            outlined: true,
            items: this.getRoles,
            "item-text": "name",
            "item-value": "name",
          },
        },
        {
          cols: 12,
          element: VTextarea,
          props: {
            name: 'desc',
            outlined: true,
          },
        }
      ]
    },
  },
  watch: {
    item: {
      handler(item) {
        this.formModel = item ? this.mergeData(this.formData(), item) : this.formData()
        this.formModel.password_confirm = this.formModel.password
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
            .dispatch('createUser', data)
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
