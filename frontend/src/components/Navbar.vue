<template>
  <div id="Navbar">
    <v-toolbar>
      <v-toolbar-title @click="$router.push({ name: 'Home' }).catch(err => {})" class="pointer">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <div class="link" v-for="(link, index) in links" :key="index">
          <v-btn
            v-if="!link.dropdown"
            text
            router
            :to="link.destination"
            exact
            >{{ link.title }}</v-btn
          >
          <v-menu v-else offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <span>{{ link.title }}</span>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(sublink, index) in link.sublinks"
                :key="index"
                router
                :to="sublink.destination"
              >
                <v-list-item-title>{{ sublink.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      title: "Babybox Dashboard",
      links: [
        {
          title: "Domů",
          destination: { name: "Home" },
          dropdown: false
        },
        {
          title: "Nastavení",
          destination: "/nastaveni",
          dropdown: true,
          sublinks: [
            {
              title: "Zkontrolovat připojení",
              destination: { name: "CheckConnection" }
            },
            {
              title: "Link 2",
              destination: "/link2"
            },
            {
              title: "Link test 1",
              destination: "/linktest1"
            }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss">
#Navbar {
  .v-toolbar {

    .v-toolbar__items {
      .link {
        .v-btn {
          height: 100%;
          border-radius: 0;
        }
        .v-menu {
          height: 100%;
        }
      }
    }
  }
}
</style>
