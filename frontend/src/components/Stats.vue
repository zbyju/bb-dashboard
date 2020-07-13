<template>
  <div id="Stats">
    <div class="statRow headers">
      <div class="statCell header" v-for="(stat, i) in stats" :key="i">
        <v-icon>{{ stat.icon }}</v-icon>
        <span>{{ stat.text }}</span>
      </div>
    </div>
    <div class="statRow stats">
      <div class="statCell stat" v-for="(stat, i) in stats" :key="i">
        <span>{{ stat.value }}{{ stat.unit }}</span>
      </div>
    </div>
  </div> 
</template>

<script>
export default {
  name: "Stats",
  props: ["stats"],
  data() {
    return {
    }
  }
};
</script>

<style lang="scss" scoped>
  #Stats {
    background: var(--darkGrey);
    display: flex;
    flex-direction: column;

    box-shadow: 0px -1px 0px var(--primary) inset;

    .statRow {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      overflow: hidden;

      .statCell {
        width: 115px;
        max-height: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;

        span {
          display: inline-flex;
          align-items: center;
        }
      }
    }

    .headers {
      height: 30px;
      .header {
        height: 200px;
        padding-top: 10px;
        font-size: 14px;
        color: var(--darkWhite);
        
        span {
          padding-top: 2px;
          margin: 0 5px;
        }

        .v-icon {
          color: var(--darkWhite)
        }
      }

    }

    .stats {
      height: 35px;
      .stat {
        margin-top: -3px;
        height: 200px;
        color: var(--primary);

        span {
          font-size: 20px;
          font-weight: 500;
        }
      }
    }
  }
</style>
