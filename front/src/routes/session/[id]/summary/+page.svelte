<script lang="ts">
 import { page } from '$app/stores'
 import { marked } from 'marked';
 import { browser } from '$app/environment';

 import store from "$store";

 import type {State} from "$state";
 import { currentSession, selectedIdeas } from "$state";

 import { InitSession } from "$events";

 import Header from "$components/Header.svelte";
 import Button from "$components/Button.svelte";
 import IdeaCard from "$components/IdeaCard.svelte";

 const st = store.get<State>();

 let session = st.select(currentSession);
 let summary = st.select(st => st.currentSession ? st.sessions[st.currentSession]?.summary : null);
 let selected = st.select(selectedIdeas);

 $: if (browser && !$session) {
   st.emit(new InitSession($page.params.id))
 }

</script>

<section class="topics">
  <h3>Your ideation flow</h3>
  <ul>
    {#each $selected as idea}
      <li class="topic-item">
        <IdeaCard title={idea.title}
                  description={idea.description}
                  keywords={idea.keywords}/>
      </li>
    {/each}
  </ul>
</section>

<section class="summary">
  {#if $summary?.state === "Loading"}
    <div class="loader"></div>
  {:else}
    <div class="summary-content">
      {@html $summary?.data ? marked.parse($summary.data, {mangle: false, headerIds: false}) : ""}
    </div>

    <div class="actions">
      <Button type="secondary">Copy text</Button>
      <Button type="primary">Start over</Button>
    </div>
  {/if}
</section>

<style lang="postcss">
 .topics,
 .summary {
   background: white;
   border-radius: 4px;
   padding-bottom: 1rem;
 }

 .topics {
   max-width: 335px;
 }

 h3 {
   color: var(--robin-egg-blue);
   font-size: 20px;
   margin: 20px;
 }

 .topic-item {
   max-width: 300px;
   margin-bottom: calc(1rem + 1px);
 }

 .summary {
   display: flex;
   flex-direction: column;
   max-width: 700px;
   overflow-y: auto;
   padding: 1rem;
   width: 700px;
 }

 .summary-content {
   display: flex;
   flex-direction: column;
   overflow-y: auto;

   :global(h2) {
     margin: 0 0 1rem 0;
     color: var(--robin-egg-blue);
     font-size: 20px;
   }

   :global(h3) {
     font-size: 20px;
     color: black;
     margin: 1rem 0;
     text-align: left;
     font-weight: 700;
   }

   :global(p) {
     padding: 0.5rem 0;
   }

   :global(ul) {
     display: flex;
     flex-direction: column;
     padding: 1rem;
     overflow: initial;
   }

   :global(li) {
     margin-bottom: 1rem;
   }
 }

 .actions {
   display: flex;
   align-items: center;
   justify-content: center;
   column-gap: 20px;
   margin-top: auto;

   & > :global(*) {
     max-width: 170px;
   }
 }

 .loader {
   background-image: url("$lib/images/beaver-48.gif.webp");
   background-size: 200px;
   background-repeat: no-repeat;
   background-position: -59px -37px;
   width: 81px;
   padding: 1rem;
   height: 80px;
   border-radius: 50%;
   margin: 20% auto;
   color: transparent;
   position: relative;
 }
</style>
