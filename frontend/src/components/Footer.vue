<template>
    <div id="Footer">
    </div>
</template>

<script>

export default {
    name: 'Navbar',
    data () {
        return {
            title: 'ADRESY'
        }
    }
}
</script>

<style lang="scss">
#Navbar {
    .v-toolbar {
        .v-toolbar__items {
            .link {
                .v-btn {
                    height: 100%;
                }
                .v-menu {
                    height: 100%;
                }
            }
        }
    }
}
</style>
