<style lang="postcss" src="./session.css"></style>

<script lang="ts">
 import { page } from '$app/stores'
 import { goto } from '$app/navigation';
 import { browser } from '$app/environment';
 
 import type {State} from "$state";
 import { currentSession, updateCard } from "$state";
 import store from "$store";
 
 import Header from "$components/Header.svelte";
 import Button from "$components/Button.svelte";
 import IdeaCard from "$components/IdeaCard.svelte";
 import Loader from "$components/Loader.svelte";

 import { InitSession, SelectIdeaCard, NextList, MoreList, RemoveList } from "$events";

 const st = store.get<State>();

 let session = st.select(currentSession);

 $: if (browser && !$session) {
   st.emit(new InitSession($page.params.id))
 }

 function handleMoreClick(listId: string) {
   st.emit(new MoreList(listId));
 }

 function handleSelectCard(listId: string, indexCard: number) {
   st.emit(new SelectIdeaCard(listId, indexCard));
 }
 
 function handleNextClick(listId: string, indexCard: number, event: CustomEvent<string>) {
   st.emit(new NextList(listId, indexCard, event.detail));
 }

 function handleRemoveList(listId: string) {
   st.emit(new RemoveList(listId));
 }
 
 function handleLikeCard(listId: string, indexCard: number, event: CustomEvent<boolean>) {
   st.emit(state => updateCard(state, listId, indexCard, idea => {
     idea.liked = event.detail;
   }));
 }
 
 function handleDisikeCard(listId: string, indexCard: number, event: CustomEvent<boolean>) {
   st.emit(state => updateCard(state, listId, indexCard, idea => {
     idea.disliked = event.detail;
   }));
 }

 function handleSaveCard(listId: string, indexCard: number, event: CustomEvent<boolean>) {
   st.emit(state => updateCard(state, listId, indexCard, idea => {
     idea.saved = event.detail;
   }));
 }

 function handleSelectKeyword(listId: string, event: CustomEvent<string>) {
   console.log(event.detail);
 }
</script>

<svelte:head>
  <title>{($session?.topic) ? ("Brainsurfer: " + $session?.topic) : "Brainsurfer"}</title>
</svelte:head>

{#each ($session?.lists || []) as list}
  <section class="topics" data-list-id={list.id}>
    {#if list.state === "InitialLoading" }
      <div class="loader">
        <Loader/>
      </div>
    {:else}
      <div class="list-header">
        <div class="list-header-title">{list.title || ""}</div>
        {#if $session && $session.lists && $session.lists.length > 1}
          <div class="list-header-actions">
            <Button type="icon-secondary" icon="remove" on:click={handleRemoveList.bind(null, list.id)} />
          </div>
        {/if}
      </div>
      <ul>
        {#each list.ideas as idea, indexCard}
          <li class="item">
            <IdeaCard
              idea={idea}
              selected={$session?.selected?.has(`${list.id},${indexCard}`)}
              on:select={handleSelectCard.bind(null, list.id, indexCard)}
              on:next={handleNextClick.bind(null, list.id, indexCard)}
              on:toggleLike={handleLikeCard.bind(null, list.id, indexCard)}
              on:toggleDislike={handleDisikeCard.bind(null, list.id, indexCard)}
              on:toggleSave={handleSaveCard.bind(null, list.id, indexCard)}
              on:selectKeyword={handleSelectKeyword.bind(null, list.id)}
            />
          </li>
        {/each}
      </ul>
      
      <div class="topic-more">
        {#if list.state === "MoreLoading"}
          <div class="loader">
            <Loader/>
          </div>
        {/if}
        <Button type="primary"
                disabled={list.state === "MoreLoading"}
                on:click={handleMoreClick.bind(null, list.id)}>
          + More ideas
        </Button>
      </div>
    {/if}
  </section>
{/each}

