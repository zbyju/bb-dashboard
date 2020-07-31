<template>
  <div class="help">
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      <span>{{ snackbar.text }}</span>
      <v-btn
        :color="snackbar.colorBtn"
        text
        @click="snackbar.show = false"
      >
        Zavřít
      </v-btn>
    </v-snackbar>

      <v-container>
        <v-skeleton-loader :loading="loading" type="table">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Jméno a příjmení</th>
                  <th class="text-left">Telefonní číslo</th>
                  <th class="text-left">Emailová adresa</th>
                  <th class="text-left">Poznámky</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in babybox.contacts" :key="index">
                  <td>{{ item.name }}</td>
                  <td><a :href="`tel:+420${item.phoneNumber}`">{{ item.phoneNumber }}</a></td>
                  <td><a :href="`mailto:${item.email}`">{{ item.email }}</a></td>
                  <td>{{ item.notes }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-skeleton-loader>
      </v-container>

    <v-container>
      <v-form class="mb-10">
        <v-container class="main mt-10">
          <h1 class="ma-3">Přidat kontakt</h1>
          <v-row>
            <v-col>
              <v-text-field
                label="Jméno a příjmení"
                v-model="contact.name"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Telefonní číslo"
                v-model="contact.phoneNumber"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Emailová adresa"
                v-model="contact.email"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                outlined
                label="Poznámky"
                v-model="contact.notes"></v-textarea>
            </v-col>
          </v-row>
          <v-btn class="mx-3" @click="submit">Uložit</v-btn>
        </v-container>
      </v-form>
    </v-container>

    <v-btn
      fab
      large
      dark
      bottom
      right
      fixed
      class="v-btn--example"
      router
      :to="{
        name: 'Babybox',
        params: {
          name: this.$route.params.name
        }
      }"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </div>
</template>
<script>

export default {
  name: "EditBabybox",
  data: () => ({
    defaultContact: {
      name: '',
      phoneNumber: '',
      email: '',
      notes: '',
    },
    contact: {
      name: '',
      phoneNumber: '',
      email: '',
      notes: '',
    },
    editedBabybox: {},
    snackbar: {
      show: false,
      text: '',
      color: '',
      colorBtn: '',
      timeout: 10000
    }
  }),
  computed: {
    babybox() {
      return this.$store.state.babybox.active
    },
    loading() {
      return this.$store.state.babybox.loading
    }
  },
  async mounted() {
    await this.$store.dispatch("getBabybox", {
      name: this.$route.params.name
    })
    this.editedBabybox = this._.merge(this.$store.state.babybox.default(), this.babybox)
  },
  methods: {
    submit: async function() {
      this.editedBabybox.contacts.push(this.contact)
      try {
        await this.$store.dispatch("putBabybox", this.editedBabybox)

        this.snackbar.text = "Informace o babyboxu úspěšně upraveny."
        this.snackbar.color = "success"
        this.snackbar.colorBtn = "white"
      } catch(err) {
        this.snackbar.text = "Vyskytla se chyba při ukládání informací o babyboxu."
        this.snackbar.color = "error"
        this.snackbar.colorBtn = "white"
      } finally {
        this.snackbar.show = true
      }
      this.contact = this._.merge({}, this.defaultContact)
    }
  }
};
</script>

<style lang="scss" scoped>
.theme--dark.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: var(--lightGrey) !important;
}
</style>
