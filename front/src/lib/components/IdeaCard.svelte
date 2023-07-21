<style lang="postcss" src="./IdeaCard.css"></style>

<script lang="ts">
 import { createEventDispatcher } from 'svelte';

 import type { Idea } from "$state";
 import Search from "$components/Search.svelte";
 import Toggle from "$components/Toggle.svelte";
 import Button from "$components/Button.svelte";

 export let small: boolean = false;
 export let idea: Idea;
 export let showActions: boolean = true;

 export let selected: boolean = false;
 export let disabled: boolean = false;

 const dispatch = createEventDispatcher();

 let searchNode: Node;
 let actionsNode: Node;
 let keywordsNode: Node;

 function handleSelect(event: MouseEvent) {
   if (!searchNode?.contains(event.target as Node) &&
       !actionsNode?.contains(event.target as Node) &&
       !keywordsNode?.contains(event.target as Node)) {
     dispatch("select");
   }
 }

 function handleSubmit(e: CustomEvent<string>) {
   dispatch("next", e.detail);
 }

 function handleClickKeyword(keyword: string, event: MouseEvent) {
   event.preventDefault();
   dispatch("selectKeyword", keyword);
 }
 
</script>

<div class="idea-card"
     class:disabled={disabled}
     class:selected={selected}
     on:click={handleSelect}>
  <p class="title">{idea.title}</p>
  {#if small}
    <div class="close-button">
      <Button type="icon-secondary" icon="remove"/>
    </div>
  {:else}
    <p class="description">{idea.description}</p>

    {#if showActions}
      <div class="keywords" bind:this={keywordsNode}>
        {#each idea.keywords?.split(" \u00b7 ") as keyword, idx}
          {#if idx !== 0} {@html "<span>\u00b7<span>"} {/if}<a class="keyword-link" on:click={handleClickKeyword.bind(null, keyword)}>{keyword}</a>
        {/each}
      </div>
    {:else}
      <div class="keyword-list">{idea.keywords}</div>
    {/if}

    {#if selected}
      <div bind:this={searchNode}>
        <Search 
          placeholder="More like this"
          color="gray"
          on:search={handleSubmit}
                       value={idea.input} />
      </div>
    {/if}

    {#if showActions}
      <div class="actions" bind:this={actionsNode}>
        <Toggle icon="sad" active={idea.disliked} on:change={e => dispatch("toggleDislike", e.detail)} />
        <Toggle icon="happy" active={idea.liked} on:change={e => dispatch("toggleLike", e.detail)} />
        <Toggle icon="star" active={idea.saved} on:change={e => dispatch("toggleSave", e.detail)} />
      </div>
    {/if}
  {/if}
</div>
