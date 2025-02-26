<template>
  <div class="seller-card">
    <h3 class="seller-title">{{ userName }}</h3>
    <p class="seller-description">Puntos: {{ points }}</p>
    <p class="seller-description">Puntos necesarios para ganar: {{ remainingPoints }}</p>
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
  border: 1px solid #ddd; /* Borde de la tarjeta */
  border-radius: 8px; /* Bordes redondeados */
  padding: 20px; /* Espaciado interno */
  margin: 10px; /* Espaciado externo */
  text-align: left; /* Alinear texto a la izquierda */
  background-color: white; /* Color de fondo */
  box-shadow: 0 10px 4px rgba(0, 0, 0, 0.1); /* Sombra */
  transition: box-shadow 0.3s; /* Transición suave para la sombra */
  width: 100%; /* Asegurarse de que ocupe el 100% del contenedor */
  box-sizing: border-box; /* Incluir padding y border en el ancho total */
}
.seller-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra más intensa al pasar el mouse */
}

.seller-title {
  color: black;
  font-size: 1.5rem; /* Tamaño de fuente del título */
  font-weight: bold; /* Negrita */
  margin: 0 0 10px; /* Margen inferior */
}
.seller-description {
  color: black;
  font-size: 1rem; /* Tamaño de fuente de la descripción */
  margin: 0 0 20px;
}
</style>
