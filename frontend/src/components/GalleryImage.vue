<template>
  <div id="Image">

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

    <v-card
      v-if="!deleted"
      width="300"
      class="mx-auto my-12"
    >
      <v-img
        :src="url"
        :lazy-src="url"
        contain
        class="align-self-center"
      ></v-img>

      <v-card-title>
        {{ image.name }}
      </v-card-title>
      <v-card-actions class="d-flex justify-center wrap">

        <v-btn
          color="blue lighten-2"
          text
          @click="updateBackground"
        >
          Nastavit jako pozadí
        </v-btn>

        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red lighten-2"
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      Smazat
                    </v-btn>
          </template>

          <v-card class="grey darken-4">
            <v-card-title class="headline grey darken-3">
              Privacy Policy
            </v-card-title>

            <v-card-text class="mt-5">
              Doopravdy chcete smazat obrázek {{ image.name + image.extension }}? Tato akce nelze vrátit zpět.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                text
                @click="deleteImage"
              >
                Smazat
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="dialog = false"
              >
                Zrušit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card-actions>
    </v-card>
  </div> 
</template>

<script>
export default {
  name: "GalleryImage",
  props: ["image", "url"],
  data() {
    return {
      dialog: false,
      deleted: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
        colorBtn: '',
        timeout: 10000
      }
    }
  },
  computed: {
    babybox() {
      return this.$store.state.babybox.active
    }
  },
  methods: {
    deleteImage: async function() {
      this.dialog = false
      try {
        await this.$store.dispatch("deleteImage", {
          babybox: this.babybox,
          image: this.$props.image
        })
        this.deleted = true

        this.snackbar.text = "Obrázek úspěšně smazán."
        this.snackbar.color = "success"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true
      } catch(err) {
        console.log(err)

        this.snackbar.text = "Vyskytla se chyba při mazání obrázku."
        this.snackbar.color = "error"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true
      }
    },
    updateBackground: async function() {
      this.dialog = false
      try {
        await this.$store.dispatch("updateBackground", {
          babybox: this.babybox,
          image: this.$props.image
        })
        
        this.snackbar.text = "Pozadí babyboxu úspěšně změněno."
        this.snackbar.color = "success"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true
      } catch(err) {
        console.log(err)

        this.snackbar.text = "Nepodařilo se změnit pozadí babyboxu."
        this.snackbar.color = "error"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true
      }
    }
  }
}
</script>