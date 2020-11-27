<template>
  <div class="gallery">
    <div v-if="images.length > 0">
      <v-carousel
        height="auto"
        max-height="700"
        show-arrows-on-hover
        hide-delimiters
      >
        <v-carousel-item v-for="(image,i) in images" :key="i">
          <h1 class="text-center">{{ image.name }}</h1>
          <v-img :src="api + image.path" :lazy-src="api + image.path" contain :alt="image.name" class="align-self-center image"></v-img>
        </v-carousel-item>
      </v-carousel>

      <v-container fluid>
        <v-row>
          <div
            class="d-flex flex-column justify-center mx-3"
            v-for="(image, index) in images" :key="index">
              <GalleryImage :image="image" :url="api + image.path" :babybox="babybox" />
          </div>
        </v-row>
      </v-container>

    </div>
    <div v-else>
      <h1 class="text-center mt-10">Žádné obrázky</h1>
    </div>
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
import GalleryImage from "../components/GalleryImage"

export default {
  name: "Login",
  components: { GalleryImage },
  data: () => ({
    api: process.env.VUE_APP_API_URL,
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
      this.images = values[1]
    }).catch(err => {
      console.log(err)
    })
  }
};
</script>

<style lang="scss">

.carousel-image {
  object-fit: contain;
}

.image {
  max-height: 500px;
  object-fit: cover;
}

</style>
