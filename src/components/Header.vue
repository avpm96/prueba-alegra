<!-- src/components/Header.vue -->
<template>
  <header>
    <h1>Imágenes del Mundo</h1>
  </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped>
header {
  width: 100%; /* Ancho completo */
  height: auto; /* Altura automática */
  text-align: center; /* Centrar el texto */
  padding: 20px; /* Espaciado interno */
  background-color: #f8f9fa; /* Color de fondo */
  border-bottom: 2px solid #ccc; /* Borde inferior */
  position: fixed; /* Fijar en la parte superior */
  top: 0; /* Alinear al top */
  left: 0; /* Alinear al left */
  z-index: 1000; /* Asegurarse de que esté por encima de otros elementos */
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

h1 {
  font-size: 2rem; /* Tamaño de fuente relativo */
  color: #0a9e9a; /* Color del texto */
  margin: 0; /* Eliminar márgenes */
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem; /* Tamaño de fuente más pequeño en pantallas pequeñas */
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.2rem; /* Tamaño de fuente aún más pequeño en pantallas muy pequeñas */
  }
}
</style>
