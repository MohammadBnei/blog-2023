<script lang="ts">
  import { lang } from '$lib/stores/lang'
  import { fly } from 'svelte/transition'
  export let path: string = ''
</script>

{#key path + $lang}
  <div
    class="bg-base-100 md:bg-base-200 min-h-screen pt-16 md:pb-8 lg:pb-16"
    in:fly={{ y: 100, duration: 300, delay: 300 }}
    out:fly={{ y: -100, duration: 300 }}>
    <slot />
  </div>
{/key}
