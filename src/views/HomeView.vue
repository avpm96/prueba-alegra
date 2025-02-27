<template>
  <Header />
  <div class="home">
    <div class="content">
      <div v-if="!searching" class="search-container">
        <div class="content-title">
          <h1 class="title-world">Encuentra las mejores imagenes del mundo</h1>
          <div class="input-container">
            <p class="text-p">Ingrese una palabra de lo que desea encontrar:</p>
            <input
              class="search-form"
              v-model="searchTerm"
              placeholder="Ingresa una palabra perro,oso...etc"
            />
            <button class="search-button" @click="searchImages">Buscar</button>
          </div>
        </div>
        <div class="div-photo">
          <img class="photo" src="../assets/images/fotografo.jpg" alt="photo" />
        </div>
      </div>

      <div v-else class="results-container">
        <h2 class="text-search">Resultados para: "{{ searchTerm }}"</h2>
        <button class="search-again-button" @click="resetSearch">Buscar de nuevo</button>
      </div>
      <div class="seller-container">
        <SellerCard
          v-for="(seller, index) in sellers"
          :key="index"
          :seller-id="Number(seller.id)"
          :image-url="seller.imageUrl"
          :avatar-url="seller.avatarUrl"
          :user-name="seller.name"
          :points="points[seller.id]"
        />
      </div>
      <div class="image-gallery">
        <ImageCard
          v-for="(seller, index) in sellers"
          :key="index"
          :imageUrl="seller.image"
          :avatarUrl="seller.avatarUrl"
          :userName="seller.name"
          :sellerId="Number(seller.id)"
          @vote="addVote"
          @dislike="addDislike"
        />
      </div>
    </div>
    <Invoice
      :isVisible="isInvoiceVisible"
      :invoiceData="invoiceData"
      @close="resetPointsAndGoHome"
    />
    <WinnerModal
      :isVisible="isWinnerModalVisible"
      :sellerName="winnerName"
      :points="winnerPoints"
      @close="isWinnerModalVisible = false"
    />
    <AlertModal
      :isVisible="showAlert"
      @close="showAlert = false"
      :paragraph="'Ya has votado en esta búsqueda.'"
    />
    <AlertModal
      :isVisible="showError"
      @close="showError = false"
      :paragraph="'No se consiguieron resultados para la búsqueda, intente otra palabra'"
    />
  </div>
</template>

<script>
import ImageCard from '../components/ImageCard.vue'
import { searchImages as fetchImages } from '../services/unsplashService'
import { getSellers, createInvoice } from '../services/alegraService'
import SellerCard from '../components/SellerCard.vue'
import Header from '../components/Header.vue'
import Invoice from '../components/Invoice.vue'
import WinnerModal from '@/components/WinnerModal.vue'
import AlertModal from '@/components/AlertModal.vue'
export default {
  components: {
    ImageCard,
    SellerCard,
    Header,
    Invoice,
    WinnerModal,
    AlertModal,
  },
  data() {
    return {
      client: [],
      sellers: [],
      searchTerm: '',
      points: {},
      searching: false,
      invoiceGenerated: false,
      isInvoiceVisible: false,
      invoiceData: {},
      isWinnerModalVisible: false,
      winnerName: '',
      winnerPoints: '',
      hasVoted: false,
      showAlert: false,
      showError: false,
      isClose: false,
    }
  },
  methods: {
    async searchImages() {
      const existingPoints = { ...this.points }

      try {
        const images = await fetchImages(this.searchTerm)
        const sellers = await getSellers()

        this.sellers = sellers.map((seller, index) => ({
          ...seller,
          image: images[index % images.length].urls.small,
        }))

        this.sellers.forEach((seller) => {
          this.points[seller.id] = existingPoints[seller.id] || 0
        })

        this.searching = true
      } catch (error) {
        this.showError = true
        this.searching = false
      }
    },
    resetSearch() {
      this.searchTerm = ''
      this.sellers = []
      this.searching = false
      this.hasVoted = false
    },

    addVote(sellerId) {
      if (this.hasVoted) {
        this.showAlert = true
        return
      }
      this.points[sellerId] += 3

      if (this.points[sellerId] >= 20) {
        this.winnerName = this.sellers.find((seller) => seller.id === sellerId).name
        this.winnerPoints = this.points[sellerId]
        this.hasVoted = true
        this.isWinnerModalVisible = true
        this.generateInvoice(sellerId)
      }
      this.hasVoted = true
      this.votedSellerId = sellerId
    },

    addDislike(sellerId) {
      if (!this.hasVoted || this.votedSellerId !== sellerId) {
        return
      }
      this.hasVoted = false
      this.votedSellerId = null
      this.points[sellerId] -= 3
      if (this.points[sellerId] < 0) {
        this.points[sellerId] = 0
      }
    },

    generateInvoice(sellerId) {
      const seller = this.sellers.find((seller) => seller.id === sellerId)
      if (seller) {
        this.invoiceData = {
          sellerName: seller.name,
          points: this.points[sellerId],
          sellerId: seller.id,
        }
        this.isInvoiceVisible = true
        // Evitar llamada duplicada si ya se generó la factura
        if (!this.invoiceGenerated) {
          this.invoiceGenerated = true
          this.handleCreateInvoice(sellerId)
        }
      }
    },
    async handleCreateInvoice(sellerId) {
      const items = [
        {
          id: 2,
          price: 0.0,
          quantity: this.points[sellerId],
        },
      ]
      const response = await createInvoice({ seller_id: sellerId, items })
      const client = response.client

      this.invoiceData = {
        ...this.invoiceData,
        clientId: client.id,
        clientName: client.name,
        clientIdentification: client.identification,
        clientPhonePrimary: client.phonePrimary,
      }
      this.invoiceGenerated = true
      console.log('invoiceData', this.invoiceData)
    },
    resetPointsAndGoHome() {
      this.points = {}
      this.searchTerm = ''
      this.sellers = []
      this.searching = false
      this.isInvoiceVisible = false
      this.isWinnerModalVisible = false
      this.hasVoted = false
      this.showAlert = false
      this.showError = false
    },
  },
  watch: {
    points: {
      handler(newPoints) {
        if (this.invoiceGenerated) return

        for (const sellerId in newPoints) {
          if (newPoints[sellerId] >= 20) {
            this.generateInvoice(sellerId)
            break
          }
        }
      },
      deep: true,
    },
  },
}
</script>
<style scoped>
.home {
  max-width: 1320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 80px;
  padding-left: 16px;
  padding-right: 16px;
}
.content {
  width: 100%; /* Ancho completo */
  /* Ancho máximo para pantallas grandes */
  padding: 10px; /* Espaciado interno */
}
.content-title {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.title-world {
  font-family: sans-serif;
  font-size: 40px;
  font-weight: 600;
  color: #0a9e9a;
}
.div-photo {
  display: flex;
  justify-content: end;
  align-items: center;
  margin: 0 auto;
  width: 100%;
}
.photo {
  border-radius: 20px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.seller-container {
  display: grid;
  /* Por defecto, mostramos 4 columnas en pantallas grandes (opcional) */
  grid-template-columns: repeat(4, 1fr);
  gap: 20px; /* espaciado entre columnas/filas */
  justify-content: center;
  justify-items: center;
  padding-bottom: 30px;
}
.image-gallery {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.results-container {
  max-width: 1320px;
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  padding-right: 20px;
  padding-left: 20px;
  color: white;
}
.search-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-search {
  font-weight: bold;
  font-size: 20px;
  color: black;
}
.text-p {
  font-weight: bold;
  font-size: 20px;
  padding-bottom: 5px;
  padding-top: 20px;
  padding-left: 20px;
  display: flex;
  color: black;
}
.input-container {
  position: relative;
}
.search-form {
  width: 100%;
  height: 60px;
  border: 2px solid #ccc;
  border-radius: 35px;
  padding: 10px 20px;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: border-color 0.3s;
  padding-right: 100px;
}
.search-form:focus {
  border-color: #0a9e9a;
  outline: none;
}
.search-button {
  width: 70px;
  position: absolute;
  right: 4px;
  top: 75%;
  transform: translateY(-50%);
  height: 50px;
  border: none;
  border-radius: 25px;
  background-color: #0a9e9a;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.search-button:hover {
  background-color: #0a9e9a;
}
.search-again-button {
  background-color: #0a9e9a;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s; /* Transición suave */
}
.search-again-button:hover {
  background-color: #0a9e9a;
}
@media (max-width: 768px) {
  .search-container {
    display: flex;
    flex-direction: column;
  }
  .div-photo {
    padding-top: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .photo {
    width: 120%;
  }
  .content-title {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
  .title-world {
    font-size: 20px;
  }
  .image-gallery {
    flex-direction: column; /* Las imágenes se apilarán en lugar de estar en fila */
  }
  .results-container {
    /* Cambiamos a columna para que los elementos se apilen */
    flex-direction: column;
    align-items: center;
    /* Ajustamos también la separación entre elementos para que se vea bien */
    justify-content: center;
  }
  .seller-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-button {
    width: 64px;
    position: absolute;
    right: 16px;
    top: 83%;
    transform: translateY(-50%);
    height: 35px;
    border: none;
    border-radius: 25px;
    background-color: #0a9e9a;
    color: white;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .search-form {
    font-size: 10px;
    width: 300px;
    height: 50px;
  }
}
@media (max-width: 480px) {
  .seller-container {
    grid-template-columns: 1fr;
  }
  .search-button {
    width: 64px;
    position: absolute;
    right: 7px;
  }
}
</style>
