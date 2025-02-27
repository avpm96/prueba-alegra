<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <div class="image-container">
        <img class="image-alegra" src="../assets/images/alegra.png" alt="Alegra" />
      </div>
      <button class="close-button" @click="closeModal">×</button>
      <h2 class="modal-title">Factura Generada</h2>

      <p class="modal-content">Cliente: {{ invoiceData.clientName }}</p>
      <p class="modal-content">
        Identificación del Cliente: {{ invoiceData.clientIdentification }}
      </p>
      <p class="modal-content">Telefono Cliente: {{ invoiceData.clientPhonePrimary }}</p>
      <p class="modal-content">Vendedor: {{ invoiceData.sellerName }}</p>
      <p class="modal-content">Cantidad de puntos: {{ invoiceData.points }}</p>
      <p class="modal-content">ID del vendedor: {{ invoiceData.sellerId }}</p>
      <div class="button-container">
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    invoiceData: Object,
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.image-container {
  display: flex;
  align-content: center;
  justify-content: center;
}
.image-alegra {
  max-width: 30%;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  height: 460px;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: left;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.close-button {
  background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.modal-title {
  font-weight: bold;
  color: black;
  font-size: 20px;
  margin-bottom: 10px;
}

.modal-content {
  display: flex;
  justify-content: left;
  align-content: left;
  padding-left: 60px;

  padding-top: 10px;
  color: black;
  font-size: 18px;
  margin-bottom: 10px;
}
.button-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
button {
  width: 50%;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0a9e9a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #088a87;
}
</style>
