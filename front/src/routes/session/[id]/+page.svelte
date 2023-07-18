<script lang="ts">
 import { page } from '$app/stores'
 import { goto } from '$app/navigation';
 import { browser } from '$app/environment';
  
 import "$styles/session.css";

 import type {State} from "$state";
 import { currentSession } from "$state";
 import store from "$store";
 
 import Header from "$components/Header.svelte";
 import Button from "$components/Button.svelte";
 import IdeaCard from "$components/IdeaCard.svelte";

 import { InitSession, SelectIdeaCard, NextList, MoreList } from "$events";

 const st = store.get<State>();

 let session = st.select(currentSession);

 $: if (browser && !$session) {
   st.emit(new InitSession($page.params.id))
 }

 function handleMoreClick(indexList: number) {
   st.emit(new MoreList(indexList));
 }

 function handleSelectCard(indexList: number, indexCard: number) {
   st.emit(new SelectIdeaCard(indexList, indexCard));
 }
 
 function handleNextClick(indexList: number, indexCard: number, event: CustomEvent<string>) {
   st.emit(new NextList(indexList, indexCard, event.detail));
 }
</script>

{#each ($session?.lists || []) as list, indexList}
  <section class="topics">
    {#if list.state === "InitialLoading" }
      <div class="loader">loading...</div>
    {:else}
      <ul>
        {#each list.ideas as idea, indexCard}
          <li class="item">
            <IdeaCard title={idea.title}
                      description={idea.description}
                      keywords={idea.keywords}
                      input={idea.input}
                      selected={$session?.selected?.has(indexList + "," + indexCard)}
                      on:select={handleSelectCard.bind(null, indexList, indexCard)}
                      on:next={handleNextClick.bind(null, indexList, indexCard)}
            />
          </li>
        {/each}
      </ul>
      
      <div class="topic-more">
        {#if list.state === "MoreLoading"}
          <div class="loader">loading...</div>
        {/if}
        <Button type="primary"
                disabled={list.state === "MoreLoading"}
                on:click={handleMoreClick.bind(null, indexList)}>
          + More ideas
        </Button>
      </div>
    {/if}
  </section>
{/each}
