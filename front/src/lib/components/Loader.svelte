<style lang="postcss" src="./Loader.css"></style>

<script lang="ts">
 import { onMount, onDestroy } from 'svelte';

 let time: number = 0;
 let interval: number;

 onMount(async () => {
   time = 0;

   const start = performance.now();
   interval = setInterval(() => {
     const end = performance.now();
     time = (end - start) / 1000;
   }, 100);
 });

 onDestroy(() => {
   clearInterval(interval);
 });
</script>

<div class="wrapper">
  <div class="time">{new Number(time).toFixed(1)}</div>
  <div class="loader">loading...</div>
</div>

