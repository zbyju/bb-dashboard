<template>
  <div class="help">
    <v-container fluid class="pa-0">
      <v-row class="justify-center">
        <v-col cols="12" md="auto">
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

        <v-col cols="auto" class="flex-grow-1">
          <v-card
            class="main"
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
                <li><b>Varování 2</b> (čas) - Tento status je u dat, která došla v pořádku, ale ve špatný čas. Za špatný čas se považuje jakýkoliv čas, kterého minuty nekončí na 9,0,1.</li>
                <li><b>Varování 3</b> (data) - Toto varování je u dat, které jsou technicky v pořádku, ale je podezření, že nejaký sensor nefunguje, protože některá z teplot/napětí jsou velmi blížko hodnotě 0</li>
                <li><b>Varování 4</b> (server) - Toto varování je u dat, které nepřišly a musely být dodělány později, ale k jejich dodělání nedošlo při automatické kontrole - tudíž je velké podzření na to, že data nepřišly, kvůli výpadku serveru, který je nepřijal.</li>
              </ul>
            </v-card-text>

            <v-card-subtitle id="notifikace">Notifikace</v-card-subtitle>
            <v-card-text>
              <p>Stránka pro vytvoření notifikací se nachází v Nastavení > Notifikace.</p>
              <p>Pro vytvoření notifikace je potřeba vyplnit tyto položky:</p>
              <ul>
                <li><b>Název</b> - zobrazuje se jako titulek notifikace</li>
                <li><b>Zpráva</b> - doprovází titulek pro popis vzniku notifikace</li>
                <li><b>Proměnná, porovnání, hranice</b> - společně vytvoří podmínku, která při jejím splnění vytvoří notifikaci</li>
                <li><b>Série</b> - notifikace nebude vytvořena, dokud nebude podmínka splněna alespoň u zadaného počtu dat v řadě. Např. série = 1: první splnění podmínky notikaci nevytvoří, bude vytvořena až u 2 po sobě jdoucích dat, které splnily podmínku </li>
                <li><b>Priorita</b> - slouží pro grafické oddělení a seřazení nofikací na stránce babyboxu (čím vyšší priorita, tím výš se notifikace zobrazí). Priorita 1-3 slouží pro notifikace, které jsou informativní, 4-6 jsou varovné a 7-10 jsou chybné,</li>
                <li><b>Emaily</b> - Při zapnutí bude posílat notifikace i na vybrané emailové adresy</li>
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
      selector: "#varovani"
    },{
      title: "Notifikace",
      icon: "mdi-bell",
      selector: "#notifikace"
    }],
    scrollOptions: {
      duration: 400,
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
      color: var(--white) !important;
      font-size: 20px;
      margin-top: -5px !important;
    }
  }
</style>
