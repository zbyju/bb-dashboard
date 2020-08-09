<template>
  <div class="babybox">
    <v-img src="@/assets/img/defaultBabyboxBackground.jpg" max-height="500">
    </v-img>
    <Stats />

    <v-container>
      <v-row>
        <v-col md="4" sm="12" xs="12" order-md="last" order-sm="2">
          <v-card class="px-2">
            <v-card-title>Možnosti</v-card-title>
            <v-card-actions>
              <v-row>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn disabled>Více o babyboxu</v-btn>
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



        <v-col class="flex-grow-1 px-8" order-sm="1">
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
            <v-col v-else-if="!addressNotSet()" class="pa-0">
              <h3 class="mx-0 mt-2 mb-1 small-header">Adresa</h3>
              <p class="ma-0 small-text" v-if="babybox.address.hospitalName">{{ babybox.address.hospitalName }}</p>
              <p class="ma-0 small-text" v-if="babybox.address.street">{{ babybox.address.street }}</p>
              <p class="ma-0 small-text" v-if="babybox.address.city">{{ babybox.address.city }}</p>
              <p class="ma-0 small-text" v-if="babybox.address.postcode">{{ babybox.address.postcode }}</p>
            </v-col>
          </v-row>
        </v-col>




        <v-col md="6" sm="12" xs="12" order-sm="3">
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
              v-if="addressNotSet()"
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
              v-if="networkNotSet()"
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
              v-if="componentsNotSet()"
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

export default {
  name: "Babybox",
  components: {
    Stats,
    Notifications
  },
  data: () => ({
    notifications: [],
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
    this.notifications = await this.$store.dispatch("getNotifications", {
      id: this.babybox._id
    })
  },
  methods: {
    addressNotSet: function() {
      if (
        !this.babybox.address ||
        this.babybox.address == {} ||
        (this.babybox.address.hospitalName == "" &&
          this.babybox.address.street == "" &&
          this.babybox.address.city == "" &&
          this.babybox.address.postcode == "")
      ) {
        return true;
      }
      return false;
    },
    networkNotSet: function() {
      return (
        !this.babybox.network ||
        !this.babybox.network.ip ||
        this.babybox.network.ip == {} ||
        (this.babybox.network.networkType <= 0 &&
          this.babybox.network.ip.pc == "" &&
          this.babybox.network.ip.SDSMotory == "" &&
          this.babybox.network.ip.SDSTopeni == "")
      );
    },
    componentsNotSet: function() {
      if (
        !this.babybox.components ||
        this.babybox.components == {} ||
        (this.babybox.components.camera == "" &&
          this.babybox.components.OS == "" &&
          this.babybox.components.PC == "")
      ) {
        return true;
      }
      return false;
    }
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
