<script lang="ts">
 import { createEventDispatcher } from 'svelte';
 import Search from "$components/Search.svelte";

 export let title: string;
 export let description: string;
 export let keywords: string;
 export let input: string | undefined | null = null;
 
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
        on:search={handleSubmit}
        value={input} />
    </div>
  {/if}
</li>
