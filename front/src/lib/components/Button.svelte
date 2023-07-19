<style lang="postcss" src="./Button.css"></style>

<script lang="ts">
 import { createEventDispatcher } from 'svelte';
 import GoIcon from "$lib/icons/GoIcon.svelte";
 import TrashIcon from "$lib/icons/TrashIcon.svelte";
 import RemoveIcon from "$lib/icons/RemoveIcon.svelte";

 export let type: 'primary' | 'secondary' | 'icon' | 'icon-secondary';
 export let icon: 'go' | 'trash' | 'remove' | null = null;
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
        class:icon-secondary={type === "icon-secondary"}
        type={submit ? "submit" : null}
        on:click={handleClick}
        disabled={disabled}>
  {#if icon === "go"}
    <GoIcon border={(type === "icon") ? "white" : "black"} />
  {:else if icon === "remove"}
    <RemoveIcon border={(type === "icon") ? "white" : "black"}/>
  {:else if icon === "trash"}
    <TrashIcon border={(type === "icon") ? "white" : "black"}/>
  {:else}
    <slot/>
  {/if}
</button>
