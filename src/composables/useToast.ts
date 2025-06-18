import { ref } from 'vue'

interface Toast {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  visible: boolean
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const addToast = (toast: Omit<Toast, 'id' | 'visible'>) => {
    const newToast: Toast = {
      ...toast,
      id: generateId(),
      visible: true
    }
    
    toasts.value.push(newToast)
    
    // Auto-remove after duration
    setTimeout(() => {
      removeToast(newToast.id)
    }, toast.duration)
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value[index].visible = false
      // Remove from array after animation
      setTimeout(() => {
        toasts.value.splice(index, 1)
      }, 300)
    }
  }
  
  const success = (title: string, message: string = '', duration: number = 3000) => {
    addToast({ title, message, type: 'success', duration })
  }
  
  const error = (title: string, message: string = '', duration: number = 5000) => {
    addToast({ title, message, type: 'error', duration })
  }
  
  const warning = (title: string, message: string = '', duration: number = 4000) => {
    addToast({ title, message, type: 'warning', duration })
  }
  
  const info = (title: string, message: string = '', duration: number = 3000) => {
    addToast({ title, message, type: 'info', duration })
  }
  
  const clear = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear
  }
}
