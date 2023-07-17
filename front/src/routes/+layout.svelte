<script>
 import "../styles/normalize.css";
 import "../styles/fonts.css";
 import "../styles/global.css";

 import Header from "$components/Header.svelte";

 import {page} from '$app/stores'

 console.log(">>>", );

 const isHome = $page.url.pathname === "/";
</script>

{#if !isHome}
  <Header></Header>
{/if}

<main class:explore={!isHome}>
  <slot/>
</main>

<style lang="postcss">
 main {
   display: flex;
   width: 100%;
   height: 100%;
   gap: 8px;
   overflow-x: auto;
   overflow-y: hidden;
   justify-content: center;
 }

 .explore {
   padding: 10px 20px;
 }
</style> 
