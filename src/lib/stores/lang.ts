import { browser } from '$app/environment'
import { writable } from 'svelte/store'

const langStore = () => {
  const { subscribe, set, update } = writable<'en' | 'fr'>('en')

  if (browser) {
    localStorage.getItem('lang')?.toLowerCase() === 'fr' ? set('fr') : set('en')
  }

  return {
    subscribe,
    set: (l: 'en' | 'fr') => {
      if (browser) {
        localStorage.setItem('lang', l)
      }
      set(l)
    },
    update
  }
}

export const lang = langStore()
