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
          :seller-id="seller.id"
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
          :sellerId="seller.id"
          @vote="addVote"
          @dislike="addDislike"
        />
      </div>
    </div>
    <Invoice
      :isVisible="isInvoiceVisible"
      :invoiceData="invoiceData"
      @close="isInvoiceVisible = false"
    />
    <WinnerModal
      :isVisible="isWinnerModalVisible"
      :sellerName="winnerName"
      :points="winnerPoints"
      @close="isWinnerModalVisible = false"
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
export default {
  components: {
    ImageCard,
    SellerCard,
    Header,
    Invoice,
    WinnerModal,
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
    }
  },
  methods: {
    async searchImages() {
      // Guarda una copia de los puntos actuales
      const existingPoints = { ...this.points }

      const images = await fetchImages(this.searchTerm)
      const sellers = await getSellers()

      // Asignar imágenes a vendedores
      this.sellers = sellers.map((seller, index) => ({
        ...seller,
        image: images[index % images.length].urls.small,
      }))

      // Inicializar puntos para cada nuevo vendedor y restaurar puntos existentes
      this.sellers.forEach((seller) => {
        this.points[seller.id] = existingPoints[seller.id] || 0
      })

      // Cambiar el estado a buscando
      this.searching = true
    },
    resetSearch() {
      this.searchTerm = ''
      this.sellers = []
      this.searching = false // Restablecer el estado
    },

    addVote(sellerId) {
      this.points[sellerId] += 3
      console.log(`Imagen del vendedor ${sellerId} fue votada. Puntos: ${this.points[sellerId]}`)

      // Verificar si algún vendedor ha ganado
      if (this.points[sellerId] >= 20) {
        this.winnerName = this.sellers.find((seller) => seller.id === sellerId).name
        this.winnerPoints = this.points[sellerId]
        this.isWinnerModalVisible = true
        this.generateInvoice(sellerId)
      }
    },
    addDislike(sellerId) {
      this.points[sellerId] -= 3
      if (this.points[sellerId] < 0) {
        this.points[sellerId] = 0
      }
    },
    ///
    generateInvoice(sellerId) {
      const seller = this.sellers.find((seller) => seller.id === sellerId)
      if (seller) {
        this.invoiceData = {
          sellerName: seller.name,
          points: this.points[sellerId],
          sellerId: seller.id,
        }
        this.isInvoiceVisible = true
        this.handleCreateInvoice(sellerId)
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
      const client = response.client // Asumiendo que el objeto cliente está en la respuesta

      // Actualizar invoiceData con los datos del cliente
      this.invoiceData = {
        ...this.invoiceData,
        clientId: client.id,
        clientName: client.name,
        clientIdentification: client.identification,
        clientPhonePrimary: client.phonePrimary,
      }
      this.invoiceGenerated = true
      console.log('invoiceData', invoiceData)
    },
    ///
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
  align-items: center; /* Centrar horizontalmente */
  text-align: center;
  margin-top: 80px;
  padding-left: 16px;
  padding-right: 16px;
}
.content {
  width: 100%; /* Ancho completo */
  /* Ancho máximo para pantallas grandes */
  padding: 20px; /* Espaciado interno */
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
  display: flex; /* Usar flexbox para centrar el contenido */
  justify-content: end; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  margin: 0 auto; /* Asegurar que el contenedor esté centrado */
  width: 100%; /* Asegurar que el contenedor ocupe todo el ancho */
}
.photo {
  border-radius: 20px;
  width: 80%; /* Ajustar el tamaño de la imagen para que ocupe menos espacio */
  max-width: 600px; /* Limitar el ancho máximo de la imagen */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Sombra para la imagen */
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
  gap: 1rem; /* Opcional, para espacio entre los elementos */
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
  justify-content: center; /* Cambiado a center para centrar horizontalmente */
  align-items: center; /* Alinear verticalmente */
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
  position: relative; /* Para posicionar el botón dentro del input */
}
.search-form {
  width: 100%;
  height: 60px;
  border: 2px solid #ccc; /* Borde del input */
  border-radius: 35px; /* Bordes redondeados */
  padding: 10px 20px; /* Espaciado interno */
  font-size: 18px; /* Tamaño de fuente */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Sombra para el buscador */
  transition: border-color 0.3s; /* Transición suave */
  padding-right: 100px; /* Espacio para el botón */
}
.search-form:focus {
  border-color: #0a9e9a; /* Color del borde al enfocar */
  outline: none; /* Sin contorno */
}
.search-button {
  width: 70px;
  position: absolute; /* Posición absoluta dentro del contenedor */
  right: 4px; /* Espaciado desde la derecha */
  top: 75%; /* Centrar verticalmente */
  transform: translateY(-50%); /* Ajustar para centrar */
  height: 50px; /* Altura del botón */
  border: none; /* Sin borde */
  border-radius: 25px; /* Bordes redondeados */
  background-color: #0a9e9a; /* Color de fondo */
  color: white; /* Color del texto */

  font-size: 16px; /* Tamaño de fuente */
  cursor: pointer; /* Cambiar cursor al pasar */
  transition: background-color 0.3s; /* Transición suave */
}
.search-button:hover {
  background-color: #0a9e9a; /* Color al pasar el mouse */
}
.search-again-button {
  background-color: #0a9e9a; /* Color de fondo */
  color: white; /* Color del texto */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  padding: 10px 20px; /* Espaciado interno */
  font-size: 18px; /* Tamaño de fuente */
  cursor: pointer; /* Cambiar cursor al pasar */
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
    right: 7px;
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
}
</style>
