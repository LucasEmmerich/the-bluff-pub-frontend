import { toast } from 'vue3-toastify'; // Importando a função toast
import 'vue3-toastify/dist/index.css'; // Importando os estilos

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('toast', toast); // Fornece a função toast ao Nuxt
});