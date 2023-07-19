<style lang="postcss" src="./IdeaCard.css"></style>

<script lang="ts">
 import { createEventDispatcher } from 'svelte';

 import type { Idea } from "$state";
 import Search from "$components/Search.svelte";

 import StarIcon from "$lib/icons/StarIcon.svelte";
 import HappyFaceIcon from "$lib/icons/HappyFaceIcon.svelte";
 import SadFaceIcon from "$lib/icons/SadFaceIcon.svelte";

 export let idea: Idea;
 
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

  <div class="icons">
    <HappyFaceIcon/>
    <SadFaceIcon/>
    <StarIcon/>
  </div>
</div>
