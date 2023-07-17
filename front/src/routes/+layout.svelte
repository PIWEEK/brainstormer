<script lang="ts">
 import "../styles/normalize.css";
 import "../styles/fonts.css";
 import "../styles/global.css";

 import Header from "$components/Header.svelte";

 import {page} from '$app/stores'

 let isHome: boolean;

 $: isHome = $page.url.pathname === "/";
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
