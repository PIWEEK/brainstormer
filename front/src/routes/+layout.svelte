<script lang="ts">
 import { browser } from '$app/environment';

 import store from "$store";
 import type { State } from "$state";
 import { initialState } from "$state";
 import { StartSavingSystem } from "$events";

 import "../styles/normalize.css";
 import "../styles/fonts.css";
 import "../styles/tokens.css";
 import "../styles/global.css";

 import Header from "$components/Header.svelte";

 import {page} from '$app/stores'

 export const ssr = false;

 let isHome: boolean;
 $: isHome = $page.url.pathname === "/";

 const st = store.start(initialState);

 if (browser) {
   st.emit(new StartSavingSystem(st));
 }
</script>

{#if !isHome}
  <Header></Header>
{/if}

<main class:home={isHome}>
  <slot/>
</main>

<style lang="postcss">
 main {
   display: flex;
   gap: 8px;
   height: 100%;
   justify-content: center;
   overflow-x: auto;
   overflow-y: hidden;
   padding: 10px 20px;
   width: 100%;
 }

 .home {
   padding: 0;
 }
</style> 
