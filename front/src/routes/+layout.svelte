<script lang="ts">
 import { browser } from '$app/environment';

 import store from "$store";
 import type { State } from "$state";
 import { initialState } from "$state";
 import { StartSavingSystem } from "$events";

 import "../styles/normalize.css";
 import "../styles/fonts.css";
 import "../styles/global.css";

 import Header from "$components/Header.svelte";

 import {page} from '$app/stores'

 export const ssr = false;

 let theme = "light";

 let isHome: boolean;
 $: isHome = $page.url.pathname === "/";

 const st = store.start(initialState);

 if (browser) {
   (window as any).setTheme = (input: string) => {
     theme = input;
   }
   st.emit(new StartSavingSystem(st));
 }
</script>

{#if !isHome}
  <Header></Header>
{/if}

<svelte:head>
  <link rel="stylesheet" href={"/themes/" + theme + ".css"} />
</svelte:head>

<main class:home={isHome}>
  <slot/>
</main>
