import { ref } from 'vue'
import type { ContactForm, ContactFormStatus } from '@/types'

// Configuration n8n
const N8N_CONFIG = {
  webhookUrl: 'https://n8n.tpierson.fr/webhook/0e4f0a81-fa6e-4c0b-ad99-932f15be7769'
}

export function useN8n() {
  const status = ref<ContactFormStatus>({
    loading: false,
    success: false,
    error: null
  })

  const sendContactForm = async (formData: ContactForm): Promise<boolean> => {
    status.value = {
      loading: true,
      success: false,
      error: null
    }

    try {
      // Vérifier que n8n est configuré
      if (!N8N_CONFIG.webhookUrl) {
        throw new Error('n8n webhook n\'est pas encore configuré.')
      }

      // Préparer les données pour n8n
      const payload = {
        // Informations du contact
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        
        // Métadonnées utiles
        timestamp: new Date().toISOString(),
        source: 'portfolio_website',
        userAgent: navigator.userAgent,
        language: navigator.language,
        
        // Données supplémentaires pour le workflow n8n
        type: 'contact_form_submission'
      }

      console.log('Envoi vers n8n:', payload)

      // Envoyer vers le webhook n8n
      const response = await fetch(N8N_CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`)
      }

      // n8n peut renvoyer une réponse personnalisée
      const result = await response.json().catch(() => ({}))
      
      console.log('Réponse de n8n:', result)

      status.value = {
        loading: false,
        success: true,
        error: null
      }

      return true

    } catch (error) {
      console.error('Erreur n8n:', error)
      
      let errorMessage = 'Une erreur est survenue lors de l\'envoi'
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
        } else if (error.message.includes('HTTP')) {
          errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.'
        } else {
          errorMessage = error.message
        }
      }

      status.value = {
        loading: false,
        success: false,
        error: errorMessage
      }
      
      return false
    }
  }

  const resetStatus = () => {
    status.value = {
      loading: false,
      success: false,
      error: null
    }
  }

  return {
    status,
    sendContactForm,
    resetStatus
  }
}
