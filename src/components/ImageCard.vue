<template>
  <div class="image-card">
    <div class="avatar">
      <img src="../assets/images/annie-s.jpg" alt="Avatar" />
      <p class="text-username">{{ userName }}</p>
    </div>
    <div class="image-container">
      <img :src="imageUrl" alt="Imagen" />
      <i :class="['fas', 'fa-heart', 'heart-icon', { liked: hasVoted }]" @click="toggleVote"></i>
    </div>
  </div>
</template>

<script>
import IconHeart from './icons/IconHeart.vue'
import IconHearOutline from './icons/IconHeartOutline.vue'
export default {
  components: {
    IconHeart,
    IconHearOutline,
  },
  props: {
    imageUrl: String,
    avatarUrl: String, // Nueva prop para la URL del avatar
    userName: String, // Nueva prop para el nombre del usuario
    sellerId: Number,
  },
  data() {
    return {
      hasVoted: false,
      hasDisliked: false,
    }
  },
  methods: {
    toggleVote() {
      this.hasVoted = !this.hasVoted
      if (this.hasVoted) {
        this.$emit('vote', this.sellerId)
      } else {
        this.$emit('dislike', this.sellerId)
      }
    },
  },
}
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.image-card {
  display: block;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 25px;
  width: 300px;
  height: 350px;
  margin: 10px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.avatar {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding-left: 20px;
  padding-top: 10px;
}
.avatar img {
  object-fit: cover;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.image-container img {
  object-fit: cover;
  width: 100%;
  height: 77%;
  margin-top: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-end-start-radius: 25px;
  border-end-end-radius: 25px;
}
.heartVue svg path {
  transition: fill 0.3s; /* Transición suave */
}

.heartVue:hover svg path {
  fill: red; /* Cambia 'red' al color que prefieras */
}
.heart-icon {
  position: absolute;
  top: 70%;
  right: 85%;
  font-size: 24px;
  cursor: pointer;
  color: white; /* Color del corazón por defecto */
}
.heart-icon.liked {
  color: red; /* Color del corazón cuando tiene 'me gusta' */
}
.heart-icon:not(.liked) {
  color: white; /* Color del corazón cuando no tiene 'me gusta' */
}

.text-username {
  color: black;
  padding-left: 10px;
}
</style>
