<template>
  <div class="register">

    <v-carousel
      cycle
      height="700"
      show-arrows-on-hover
      hide-delimiters
    >
      <v-carousel-item
        v-for="image in images"
        :key="image"
      >
        <h1 class="text-center">{{ image }}</h1>
        <v-img
          :src="getImage(image)"
          contain
          max-height="700"
        ></v-img>
      </v-carousel-item>
    </v-carousel>

    <v-container fluid>
      <v-row>
        <v-col
          class="d-flex flex-column justify-center"
          cols="12" md="3" lg="2"
          v-for="image in images" :key="image">
            <v-img
              :src="getImage(image)"
              contain
              max-height="500px"
              class="align-self-center"
            ></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "Login",
  data: () => ({
    images: []
  }),
  computed: {
    babybox() {
      return this.$store.state.babybox.active
    }
  },
  async mounted() {
    let promise1 =  await this.$store.dispatch("getBabybox", {
                      name: this.$route.params.name
                    })
    let promise2 =  await this.$store.dispatch("getImages", {
                      name: this.$route.params.name
                    })
    await Promise.all([promise1, promise2]).then(values => {
      console.log(values)
      this.images = values[1]
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    getImage: function(pathImage) {
      let image = ""
      try {
        image = require(`@/assets/uploads/${ this.babybox.name }/gallery/${ pathImage }`)
      } finally {
        return image
      }
    }
  }
};
</script>

<style lang="scss">
</style>
