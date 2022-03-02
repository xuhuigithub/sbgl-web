<template>
  <v-card tile>
    <v-card-title>Permission Form</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="formModel.name"
          outlined
          :label="form.name.label"
          :placeholder="form.name.placeholder"
          required
          :append-icon="'mdi-account-check'"
          :rules="form.name.rules"
        />
        <v-text-field
          v-model="formModel.email"
          outlined
          :label="form.email.label"
          :placeholder="form.email.placeholder"
          required
          :append-icon="'mdi-email'"
          :rules="form.email.rules"
        />
        <v-text-field
          v-model="formModel.address"
          outlined
          :label="form.address.label"
          :placeholder="form.address.placeholder"
          :append-icon="'mdi-location'"
          required
          :rules="form.address.rules"
        />
        <v-text-field
          v-model="formModel.city"
          outlined
          :label="form.city.label"
          :placeholder="form.city.placeholder"
          required
          :rules="form.city.rules"
        />
        <v-text-field
          v-model="formModel.state"
          outlined
          :label="form.state.label"
          :placeholder="form.state.placeholder"
          required
          :rules="form.state.rules"
        />
        <v-text-field
          v-model="formModel.zip"
          outlined
          :label="form.zip.label"
          :placeholder="form.zip.placeholder"
          required
          type="number"
          :rules="form.zip.rules"
        />
        <v-combobox
          v-model="formModel.country"
          outlined
          :label="form.country.label"
          :placeholder="form.country.placeholder"
          :rules="form.country.rules"
          :items="countries"
          required
        />
        <v-editor></v-editor>
      </v-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-btn text @click="handleCancelForm">Cancel</v-btn>
      <v-spacer />
      <v-btn tile color="primary" @click="handleSubmitForm">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EMAIL } from '@/util/regex'
export default {
  components: {},
  created(){
    this.$store.dispatch('fetchRole')
  },
  computed: {
  ...mapGetters(['getRoles']),
  },
  data: () => ({
    countries: [],

    valid: true,
    formModel: {
      role: "",
      permissions: [],
    },
    form: {
      name: {
        label: 'Full Name',
        placeholder: 'Tookit',
        rules: [(v) => !!v || 'This field is required'],
      },
      email: {
        label: 'Email',
        placeholder: 'wangqiangshen@gmail.com',
        rules: [(v) => !!v || 'This field is required', (v) => EMAIL.test(v) || 'Invalid email'],
      },
      address: {
        label: 'Address Line',
        placeholder: 'Address',
        rules: [(v) => !!v || 'This field is required'],
      },
      city: {
        label: 'City',
        placeholder: 'Shenzhen',
        rules: [(v) => !!v || 'This field is required'],
      },
      state: {
        label: 'State/Provice/Region',
        placeholder: 'Guangdong',
        rules: [(v) => !!v || 'This field is required'],
      },
      zip: {
        label: 'Zip',
        placeholder: '528020',
        rules: [(v) => !!v || 'This field is required'],
      },
      country: {
        label: 'Country',
        placeholder: 'China',
        rules: [(v) => !!v || 'This field is required'],
      },
    },
    formHasErrors: false,
  }),
  methods: {
    handleCancelForm() {
      this.$refs.form.reset()
    },
    handleSubmitForm() {
      if (this.$refs.form.validate()) {
        console.log('handle form process logic here')
      }
    },
  },
}
</script>
