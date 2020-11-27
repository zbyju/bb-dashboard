<template>
  <div class="babybox">
    <template v-if="!loadingBackgroundImage">
      <v-img
        v-if="!backgroundImageFromAPI"
        src="@/assets/img/defaultBabyboxBackground.jpg"
        max-height="500"
      ></v-img>
      <v-img
        v-else
        :src="backgroundImage"
        max-height="500"
      ></v-img>
    </template>
    <Stats />

    <v-container>
      <v-row>
        <!-- Babybox info -->
        <v-col cols="12" sm="12" md="5" lg="2" order-lg="first" order="first" class="flex-grow-1 px-8" >
          <v-row>
            <v-col class="pa-0">
              <v-skeleton-loader :loading="loading" type="heading" class="mb-4">
                <h2 mb-0>Babybox {{ babybox.customName }}</h2>
              </v-skeleton-loader>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="loading" class="pa-0">
              <v-skeleton-loader :loading="loading" type="sentences">
              </v-skeleton-loader>
            </v-col>
            <v-col v-else class="pa-0">
                <p class="ma-0 small-text" v-if="babybox.installDate">Datum instalace {{ moment(babybox.installDate).format("DD.MM.YYYY") }}</p>
                <p class="ma-0 small-text" v-if="babybox.lastServisDate">Datum posledního servisu {{ moment(babybox.lastServisDate).format("DD.MM.YYYY") }}</p>
                <p class="ma-0 small-text" v-if="babybox.lastServisDate">Další servis {{ moment().to(moment(babybox.datumPoslednihoServisu).add(2, 'years')) }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="loading" class="pa-0">
              <v-skeleton-loader :loading="loading" type="sentences">
              </v-skeleton-loader>
            </v-col>
            <v-col v-else-if="isAddressDefined()" class="pa-0">
              <h3 class="mx-0 mt-2 mb-1 small-header">Adresa</h3>
              <p class="ma-0 small-text" v-if="babybox.address.hospitalName">{{ babybox.address.hospitalName }}</p>
              <p class="ma-0 small-text" v-if="babybox.address.street">{{ babybox.address.street }}</p>
              <p class="ma-0 small-text" v-if="babybox.address.city">{{ babybox.address.city }}</p>
              <p class="ma-0 small-text" v-if="babybox.address.postcode">{{ babybox.address.postcode }}</p>
            </v-col>
          </v-row>
        </v-col>


        <!-- Sidebar -->
        <v-col cols="12" sm="12" md="7" lg="4" order-lg="last" order="2">
          <v-card class="px-2">
            <v-card-title>Možnosti</v-card-title>
            <v-card-actions>
              <v-row>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn
                    router
                    :to="{
                      name: 'BabyboxMore',
                      params: {
                        name: this.$route.params.name
                      }
                    }"
                    outlined
                  >Více o babyboxu</v-btn>
                </v-col>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn
                    router
                    :to="{
                      name: 'Contacts',
                      params: {
                        name: this.$route.params.name
                      }
                    }"
                    outlined>Kontakty</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-card-actions>
              <v-row>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn
                    router
                    :to="{
                      name: 'Gallery',
                      params: {
                        name: this.$route.params.name
                      }
                    }">Galerie</v-btn>
                </v-col>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn
                    router
                    :to="{
                      name: 'UploadImage',
                      params: {
                        name: this.$route.params.name
                      }
                    }"
                  >Nahrát obrázek</v-btn>
                </v-col>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn
                    router
                    :to="{
                      name: 'EditBabybox',
                      params: {
                        name: this.$route.params.name
                      }
                    }"
                  >Upravit</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-card-actions>
              <v-row>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn
                    router
                    :to="{
                      name: 'Data',
                      params: {
                        name: this.$route.params.name
                      }
                    }"
                  >Všechna data</v-btn>
                </v-col>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn outlined disabled>Teploty</v-btn>
                </v-col>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn outlined disabled>Napětí</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>

        
        <!-- Notifications -->
        <v-col cols="12" sm="12" md="12" lg="6" order-lg="2" order="last">
          <div v-if="!loading">
            <v-alert
              v-if="babybox.name == babybox.customName"
              border="bottom"
              colored-border
              type="warning"
              elevation="2"
            >
              <v-row align="center">
                <v-col class="grow pa-0">Pro tento babybox nebylo změněno jméno.</v-col>
                <v-col class="shrink pa-0">
                  <v-btn
                    router
                    :to="{
                      name: 'EditBabybox',
                      params: {
                        name: this.$route.params.name,
                      },
                    }"
                    text
                    height="24px"
                  >Nastavit</v-btn>
                </v-col>
              </v-row>
            </v-alert>

            <v-alert
              v-if="!isAddressDefined()"
              border="bottom"
              colored-border
              type="warning"
              elevation="2"
            >
              <v-row align="center">
                <v-col class="grow pa-0">
                  Pro tento babybox nebyly přidány informace o adrese (ulice,
                  město, ...)
                </v-col>
                <v-col class="shrink pa-0">
                  <v-btn
                    router
                    :to="{
                      name: 'EditBabybox',
                      params: {
                        name: this.$route.params.name,
                      },
                    }"
                    text
                    height="24px"
                  >Nastavit</v-btn>
                </v-col>
              </v-row>
            </v-alert>

            <v-alert
              v-if="!isNetworkDefined()"
              border="bottom"
              colored-border
              type="warning"
              elevation="2"
            >
              <v-row align="center">
                <v-col class="grow pa-0">
                  Pro tento babybox nebyly přidány informace o nastavení
                  internetové sítě.
                </v-col>
                <v-col class="shrink pa-0">
                  <v-btn
                    router
                    :to="{
                      name: 'EditBabybox',
                      params: {
                        name: this.$route.params.name,
                      },
                    }"
                    text
                    height="24px"
                  >Nastavit</v-btn>
                </v-col>
              </v-row>
            </v-alert>

            <v-alert
              v-if="!isComponentDefined()"
              border="bottom"
              colored-border
              type="warning"
              elevation="2"
            >
              <v-row align="center">
                <v-col class="grow pa-0">
                  Pro tento babybox nebyly přidány informace o komponentách v
                  babyboxu.
                </v-col>
                <v-col class="shrink pa-0">
                  <v-btn
                    router
                    :to="{
                      name: 'EditBabybox',
                      params: {
                        name: this.$route.params.name,
                      },
                    }"
                    text
                    height="24px"
                  >Nastavit</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </div>

          <v-card>
            <v-card-title>Notifikace</v-card-title>
            <v-card-text>
              <Notifications :notifications="notifications" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import moment from "moment"
import Stats from "../components/Stats"
import Notifications from "../components/Notifications"

import isAddressDefined from "../mixins/babybox/isAddressDefined"
import isComponentDefined from "../mixins/babybox/isComponentDefined"
import isNetworkDefined from "../mixins/babybox/isNetworkDefined"

export default {
  name: "Babybox",
  components: {
    Stats,
    Notifications
  },
  mixins: [isAddressDefined, isComponentDefined, isNetworkDefined],
  data: () => ({
    api: process.env.VUE_APP_API_URL,
    notifications: [],
    backgroundImageFromAPI: null,
    loadingBackgroundImage: true,
  }),
  computed: {
    babybox() {
      return this.$store.state.babybox.active
    },
    data() {
      return this.$store.state.data.active
    },
    loading() {
      return this.$store.state.babybox.loading
    },
    loadingData() {
      return this.$store.state.data.loading
    },
    backgroundImage() {
      if(this.backgroundImageFromAPI) {
        return this.api + this.backgroundImageFromAPI.path
      } else {
        return "@/assets/img/defaultBabyboxBackground.jpg"
      }
    }
  },
  async mounted() {
    await this.$store.dispatch("getBabybox", {
      name: this.$route.params.name
    })
    await this.$store.dispatch("getData", {
      id: this.babybox._id,
      filter: {
        from: moment().add(-1, 'days').format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD")
      }
    })
    try {
      let response = await this.$store.dispatch("getBackgroundImage", {
        name: this.$route.params.name,
      })
      this.loadingBackgroundImage = false
      this.backgroundImageFromAPI = response
    } catch(err) {
      console.log(err)
      this.loadingBackgroundImage = false
      this.backgroundImageFromAPI = null
    }
    this.notifications = await this.$store.dispatch("getNotifications", {
      id: this.babybox._id
    })
  }
};
</script>

<style lang="scss">
.babybox {
  .v-image__image {
    transition: 0.3s all ease !important;
  }
  .v-image:hover {
    .v-image__image {
      transform: scale(1.05) !important;
    }
  }
}
</style>
