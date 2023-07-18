<script lang="ts">
 import { createEventDispatcher } from 'svelte';
 import Search from "$components/Search.svelte";

 export let title: string;
 export let description: string;
 export let keywords: string;
 
 export let selected: boolean = false;
 export let disabled: boolean = false;

 const dispatch = createEventDispatcher();

 let searchNode: Node;

 function handleSelect(event: MouseEvent) {
   if (!searchNode || !searchNode.contains(event.target as Node)) {
     dispatch("select");
   }
 }

 function handleSubmit(e: CustomEvent<string>) {
   dispatch("next", e.detail);
 }
 
</script>

<li class="idea-card"
    class:disabled={disabled}
    class:selected={selected}
    on:click={handleSelect}>
  <p class="title">{title}</p>
  <p class="description">{description}</p>
  <p class="keywords">{keywords}</p>

  {#if selected}
    <div bind:this={searchNode}>
      <Search 
        placeholder="More like this"
        color="gray"
        on:search={handleSubmit} />
    </div>
  {/if}
</li>

<style lang="postcss">
 .idea-card {
   border-radius: 4px;
   border: 2px solid var(--anti-flash-white);
   margin-bottom: calc(1rem + 1px);
   padding: 1rem;
   position: relative;
   width: 100%;

   &.disabled {
     opacity: 0.7;
   }

   &.selected {
     margin: 0;
     margin-bottom: 1rem;
     border: 2px solid var(--robin-egg-blue);
   }
 }

 .title {
   font-size: 20px;
   font-weight: 700;
 }

 .description {
   font-size: 16px;
   line-height: 1.2;
   margin: 0.5rem 0;
 }

 .keywords {
   font-size: 14px;
   line-height: 1.2;
   margin: 0.5rem 0;
   font-weight: 700;
   color: var(--robin-egg-blue);
 }
</style>
