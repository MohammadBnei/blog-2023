import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { get, writable } from 'svelte/store'

const langStore = () => {
  const { subscribe, set, update } = writable<'en' | 'fr'>('en')

  if (browser) {
    localStorage.getItem('lang')?.toLowerCase() === 'fr' ? set('fr') : set('en')
  }

  return {
    subscribe,
    set: (l: 'en' | 'fr') => {
      set(l)
      if (browser) {
        localStorage.setItem('lang', l)
        const routeId = get(page).route.id
        if (l === 'fr') routeId !== '/' && goto('/fr' + routeId)
        if (l === 'en') {
          goto(routeId?.replace('/fr', '') || '/')
        }
      }
    },
    update
  }
}

export const lang = langStore()
