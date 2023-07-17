<script lang="ts">
 import Header from "$components/Header.svelte";
 import Button from "$components/Button.svelte";
 import IdeaCard from "$components/IdeaCard.svelte";

 import { fakeState } from "$state";
 let currentSession = "fake-id";
</script>

{#each fakeState.sessions[currentSession].lists as list}
  <section class="topics">
    <ul>
      {#each list.ideas as idea, i}
        <li class="item">
          <IdeaCard title={idea.title}
                    description={idea.description}
                    tags={idea.tags}
                    selected={i === 0}/>
        </li>
      {/each}
    </ul>
    
    <div class="topic-more">
      <Button type="primary">+ More ideas</Button>
    </div>
  </section>
{/each}

<style lang="postcss">
 .topics {
   min-width: 335px;
   background: white;
   border-radius: 4px;
   padding-bottom: 1rem;
 }

 ul {
   height: calc(100% - 45px);
   overflow-y: auto;
   overflow-x: hidden;
   padding: 1rem;
 }

 .topic-more {
   width: 100%;
   text-align: center;
   padding: 0 1rem;
   position: relative;
 }

 .item {
   width: 300px;
   cursor: pointer;
 }
 
</style>
