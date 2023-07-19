<style lang="postcss" src="./summary.css"></style>

<script lang="ts">
 import { page } from '$app/stores'
 import { marked } from 'marked';
 import { browser } from '$app/environment';

 import store from "$store";

 import type {State} from "$state";
 import { currentSession, selectedIdeas } from "$state";

 import { InitSession } from "$events";

 import Header from "$components/Header.svelte";
 import Loader from "$components/Loader.svelte";
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

<section class="summary-wrapper">
  <div class="topics">
    <h3>Your ideation flow</h3>
    <ul>
      {#each $selected as idea}
        <li class="topic-item">
          <IdeaCard idea={idea} showActions={false} />
        </li>
      {/each}
    </ul>
  </div>

  <div class="summary">
    {#if $summary?.state === "Loading"}
      <div class="loader">
        <Loader/>
      </div>
    {:else}
      <div class="summary-content">
        {@html $summary?.data ? marked.parse($summary.data, {mangle: false, headerIds: false}) : ""}
      </div>

      <div class="actions">
        <Button type="secondary">Copy text</Button>
        <Button type="primary">Start over</Button>
      </div>
    {/if}
  </div>
</section>
