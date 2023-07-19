<style lang="postcss" src="./IdeaCard.css"></style>

<script lang="ts">
 import { createEventDispatcher } from 'svelte';

 import type { Idea } from "$state";
 import Search from "$components/Search.svelte";
 import Toggle from "$components/Toggle.svelte";

 export let idea: Idea;
 
 export let selected: boolean = false;
 export let disabled: boolean = false;

 const dispatch = createEventDispatcher();

 let searchNode: Node;
 let actionsNode: Node;

 function handleSelect(event: MouseEvent) {
   if (!searchNode?.contains(event.target as Node) &&
       !actionsNode?.contains(event.target as Node)) {
     dispatch("select");
   }
 }

 function handleSubmit(e: CustomEvent<string>) {
   dispatch("next", e.detail);
 }
 
</script>

<div class="idea-card"
     class:disabled={disabled}
     class:selected={selected}
     on:click={handleSelect}>
  <p class="title">{idea.title}</p>
  <p class="description">{idea.description}</p>
  <p class="keywords">{idea.keywords}</p>

  {#if selected}
    <div bind:this={searchNode}>
      <Search 
        placeholder="More like this"
        color="gray"
        on:search={handleSubmit}
        value={idea.input} />
    </div>
  {/if}

  <div class="actions" bind:this={actionsNode}>
    <Toggle icon="happy"/>
    <Toggle icon="sad"/>
    <Toggle icon="star"/>
  </div>
</div>
