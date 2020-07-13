<template>
  <div class="help">
    
  </div>
</template>
<script>

export default {
  name: "EditBabybox",
  data: () => ({
    babybox: null,
    loading: true
  }),
  created() {
    fetch(`http://localhost:3000/api/babybox/name/${this.$route.params.name}`)
      .then(response => response.json())
      .then(babybox => {
        this.babybox = babybox;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
  },
};
</script>
