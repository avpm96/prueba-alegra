<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <p class="text">{{ paragraph }}</p>
      <button @click="close">Cerrar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    paragraph: {
      type: String,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.text {
  color: black;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
button {
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
