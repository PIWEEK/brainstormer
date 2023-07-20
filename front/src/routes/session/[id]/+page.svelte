<style lang="postcss" src="./session.css"></style>

<script lang="ts">
 import { page } from '$app/stores'
 import { goto } from '$app/navigation';
 import { browser } from '$app/environment';

 import type { State, IdeaList, Idea } from "$state";
 import { currentSession, updateCard, queryIdeas } from "$state";
 import store from "$store";

 import Header from "$components/Header.svelte";
 import Button from "$components/Button.svelte";
 import IdeaCard from "$components/IdeaCard.svelte";
 import Loader from "$components/Loader.svelte";

 import StarIcon from "$lib/icons/StarIcon.svelte";
 import HappyFaceIcon from "$lib/icons/HappyFaceIcon.svelte";
 import SadFaceIcon from "$lib/icons/SadFaceIcon.svelte";

 import { InitSession, SelectIdeaCard, NextList, MoreList, RemoveList } from "$events";

 const st = store.get<State>();

 const session = st.select(currentSession);
 const saved = st.select(st => queryIdeas(st, (i: Idea) => !!i.saved));
 const liked = st.select(st => queryIdeas(st, (i: Idea) => !!i.liked));
 const disliked = st.select(st => queryIdeas(st, (i: Idea) => !!i.disliked));

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

 function handleSelectKeyword(event: CustomEvent<string>) {
   console.log(event.detail);
 }

 function focusCard(idea: Idea) {
 }

 let prevList: IdeaList[] | undefined;
 let curList: IdeaList[] | undefined;

 $: {
   curList = $session?.lists;
   console.log(prevList?.length, curList?.length);

   if (prevList && curList) {
     if (prevList.length < curList.length) {
       const last = curList[curList.length - 1];

       setTimeout(() => {
         console.log("TIMEOUT");
         const node = document.querySelector(`[data-list-id='${last.id}']`);
         console.log(node);
         node?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
       }, 0);
     }
   }
   prevList = curList;
 }

</script>

<svelte:head>
  <title>{($session?.topic) ? ("Brainsurfer: " + $session?.topic) : "Brainsurfer"}</title>
</svelte:head>

<section class="topics selected-ideas">
  <div class="list-header">
    <div class="list-header-title">
      <span class="icon"><StarIcon border="var(--color-text-secondary)" /></span>Selected ideas
    </div>
  </div>
  <ul>
    {#each $saved as idea}
      <li class="item">
        <IdeaCard
          small
          idea={idea}
          on:select={focusCard.bind(null, idea)}
          on:selectKeyword={handleSelectKeyword}
        />
      </li>
    {/each}
  </ul>

  <div class="list-header">
    <div class="list-header-title">
      <span class="icon"><HappyFaceIcon border="var(--color-text-secondary)" /></span>Liked ideas
    </div>
  </div>

  <ul>
    {#each $liked as idea}
      <li class="item">
        <IdeaCard
          small
          idea={idea}
          on:select={focusCard.bind(null, idea)}
          on:selectKeyword={handleSelectKeyword}
        />
      </li>
    {/each}
  </ul>

  <div class="list-header">
    <div class="list-header-title">
      <span class="icon"><SadFaceIcon border="var(--color-text-secondary)" /></span>Disliked ideas
    </div>

  </div>
  <ul>
    {#each $disliked as idea}
      <li class="item">
        <IdeaCard
          small
          idea={idea}
          on:select={focusCard.bind(null, idea)}
          on:selectKeyword={handleSelectKeyword}
        />
      </li>
    {/each}
  </ul>
</section>

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
              on:selectKeyword={handleSelectKeyword}
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
