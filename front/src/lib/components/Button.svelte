<style lang="postcss" src="./Button.css"></style>

<script lang="ts">
 import { createEventDispatcher } from 'svelte';
 import GoIcon from "$components/GoIcon.svelte";
 
 export let type: 'primary' | 'secondary' | 'icon';
 export let icon: 'go' | null = null;
 export let submit: boolean = false;
 export let disabled: boolean = false;

 const dispatch = createEventDispatcher();

 function handleClick() {
   if (!submit && !disabled) {
     dispatch("click");
   }
 }
</script>

<button class:primary={type === "primary"}
        class:secondary={type === "secondary"}
        class:icon={type === "icon"}
        type={submit ? "submit" : null}
        on:click={handleClick}
        disabled={disabled}>
  {#if icon === "go"}
    <GoIcon/>
  {:else}
    <slot/>
  {/if}
</button>
