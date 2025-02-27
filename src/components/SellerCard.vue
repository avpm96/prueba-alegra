<template>
  <div class="seller-card">
    <h3 class="seller-title">{{ userName }}</h3>
    <p class="seller-description">Pts: {{ points }}</p>
    <p class="seller-description">Puntos faltantes para ganar: {{ remainingPoints }}</p>
  </div>
</template>

<script>
export default {
  props: {
    userName: String,
    points: Number,
    pointsNeeded: Number,
    sellerId: Number,
  },

  computed: {
    remainingPoints() {
      return Math.max(0, 20 - this.points)
    },
  },
}
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
.seller-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  text-align: left;
  background-color: white;
  box-shadow: 0 10px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  width: 100%;
  box-sizing: border-box;
}
.seller-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.seller-title {
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
}
.seller-description {
  color: black;
  font-size: 1rem;
}
</style>
