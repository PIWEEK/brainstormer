<style lang="postcss" src="./Toggle.css"></style>

<script lang="ts">
 import { createEventDispatcher } from 'svelte';

 import TrashIcon from "$lib/icons/TrashIcon.svelte";
 import GoIcon from "$lib/icons/GoIcon.svelte";
 import HappyFaceIcon from "$lib/icons/HappyFaceIcon.svelte";
 import HeartIcon from "$lib/icons/HeartIcon.svelte";
 import SadFaceIcon from "$lib/icons/SadFaceIcon.svelte";
 import StarIcon from "$lib/icons/StarIcon.svelte";
 
 export let icon: 'trash' | 'go' | 'happy' | 'heart' | 'sad' | 'star';
 export let active: boolean = false;

 const dispatch = createEventDispatcher();

 let background: string;
 let border: string;

 $: if (active) {
   border = "var(--color-primary)";
   background = "var(--color-background-primary)";
 } else {
   border = "var(--color-border-strong)";
   background = "none";
 }

 function handleClick() {
   dispatch("change", !active);
 }
</script>

<button on:click={handleClick}>
  {#if icon === "trash"}
    <TrashIcon background={background} border={border} />
  {:else if icon === "go"}
    <GoIcon background={background} border={border}/>
  {:else if icon === "happy"}
    <HappyFaceIcon background={background} border={border}/>
  {:else if icon === "heart"}
    <HeartIcon background={background} border={border}/>
  {:else if icon === "sad"}
    <SadFaceIcon background={background} border={border}/>
  {:else if icon === "star"}
    <StarIcon background={background} border={border}/>
  {/if}
</button>
