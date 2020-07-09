<template>
  <div class="help">
    <img src="@/assets/img/defaultBabyboxBackground.jpg">
    {{ data }}
  </div>
</template>
<script>
export default {
  name: "Babybox",
  data: () => ({
    babybox: null,
    data: null,
    stats: null,
    loading: true
  }),
  created() {
    fetch(`http://localhost:3000/api/babybox/name/${this.$route.params.name}`)
      .then(response => response.json())
      .then(babybox => {
        this.babybox = babybox;

        fetch(`http://localhost:3000/api/data/babybox/${babybox._id}`)
          .then(response => response.json())
          .then(data => {
            this.data = data;
            this.loading = false;
            this.findStats()
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
    findStats: function() {
      console.log('test')
    }
  }
};
</script>
