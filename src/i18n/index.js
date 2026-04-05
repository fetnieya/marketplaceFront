import { createI18n } from 'vue-i18n'
import fr from './locales/fr.js'

const messages = {
  fr
}

const i18n = createI18n({
  locale: 'fr', // Langue par défaut
  fallbackLocale: 'fr',
  messages,
  legacy: false, // Utiliser la Composition API
  globalInjection: true // Permettre l'utilisation de $t dans les templates
})

export default i18n
