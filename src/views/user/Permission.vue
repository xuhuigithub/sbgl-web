<template>
  <div class="page-forms">
    <v-container>
      <v-row>
        <v-col :cols="12" :lg="12">
          <contact-form />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ContactForm from '@/components/form/ContactForm'
export default {
  components: {
    ContactForm,
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>
