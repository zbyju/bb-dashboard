<template>
  <div class="help">
    <v-img src="@/assets/img/defaultBabyboxBackground.jpg" max-height="500">
    </v-img>
    <Stats :data="data" />

    <v-container>
      <v-row>
        <v-col md="4" sm="12" xs="12" order-md="last" order-sm="first">
          <v-card>
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
                      name: 'PhoneNumbers',
                      params: {
                        name: this.$route.params.name
                      }
                    }"
                    outlined>Telefonní čísla</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-card-actions>
              <v-row>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn disabled>Galerie</v-btn>
                </v-col>
                <v-col cols="auto" xs="12" class="py-1">
                  <v-btn disabled>Přidat obrázek</v-btn>
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
        <v-col md="8" sm="12" xs="12">
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
            <v-card-title>Upozornění</v-card-title>
            <v-card-text>
              <v-skeleton-loader :loading="loading" type="paragraph">
                <span>Žádné upozornění</span>
              </v-skeleton-loader>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Stats from "../components/Stats";
import moment from "moment"

export default {
  name: "Babybox",
  components: {
    Stats
  },
  data: () => ({
    babybox: {},
    defaultData: function() {
      return {
        idBabybox: "",
        status: -1,
        time: "-",
        temperature: {
          outside: "-",
          inner: "-",
          bottom: "-",
          top: "-",
          casing: "-"
        },
        voltage: {
          in: "-",
          battery: "-"
        }
      };
    },
    data: [],
    loading: true
  }),
  created() {
    const filter = {
      from: moment(0).format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD")
    }
    fetch(`http://localhost:3000/api/babybox/name/${this.$route.params.name}`)
      .then(response => response.json())
      .then(babybox => {
        this.babybox = babybox;

        fetch(`http://localhost:3000/api/data/babybox/${babybox._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(filter)
          })
          .then(response => response.json())
          .then(data => {
            this.data = [];
            data.forEach(val => {
              val.time = moment(val.time).format("DD.MM.YYYY HH:mm");
              const mergedData = this._.merge(this.defaultData(), val);
              this.data.push(mergedData);
            })
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
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
