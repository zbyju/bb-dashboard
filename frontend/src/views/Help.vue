<template>
  <div class="help">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="2">
          <v-card
            class="sidebar"
            elevation="12"
            width="256"
          >
              <v-list
                dense
                rounded
              >
                <v-list-item
                  v-for="item in sidebar"
                  :key="item.title"
                  link
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title @click="$vuetify.goTo(item.selector, scrollOptions)">{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
          </v-card>
        </v-col>

        <v-col>
          <v-card
            class="main ml-n12"
          >
            <v-card-title>Nápověda</v-card-title>

            <v-card-subtitle id="uvod">Úvod</v-card-subtitle>
            <v-card-text>
              Funkce, které stránka podporuje:
              <ul>
                <li>Uložení a zobrazení dat z babyboxů</li>
                <li>Přidání informací k babyboxům - adresa, datumy instalace a servisu, informace o síti a komponenty babyboxu</li>
                <li>Přidání kontaktů k babyboxům (telefonní čísla, emaily)</li>
                <li>Nastavení notifikací k přijatým datům</li>
              </ul>
            </v-card-text>

            <v-card-subtitle id="varovani">Varování</v-card-subtitle>
            <v-card-text>
              Seznam varování u dat:
              <ul>
                <li>Varování 2 (čas) - </li>
                <li>Varování 3 (data) - </li>
                <li>Varování 4 (dodělané) - </li>
              </ul>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "Help",
  data: () => ({
    sidebar: [{
      title: "Úvod",
      icon: "mdi-home",
      selector: "#uvod"
    },{
      title: "Varování",
      icon: "mdi-alert",
    },],
    scrollOptions: {
      duration: 500,
      offset: 13
    }
  })
};
</script>

<style lang="scss">
  .help {
    margin: 20px;

    .sidebar {
      display: block;
      position: -webkit-sticky;
      position: sticky;
      top: 20px;
      height: 400px;
      overflow: hidden;
    }

    .v-card__title {
      font-size: 32px;
    }

    .v-card__subtitle {
      font-size: 20px;
      margin-top: -5px !important;
    }
  }
</style>
