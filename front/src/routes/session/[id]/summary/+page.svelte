<script lang="ts">
 import { marked } from 'marked';
 import store from "$store";
 import type { State } from "$state";
 import { initialState } from "$state";

 import Header from "$components/Header.svelte";
 import Button from "$components/Button.svelte";
 import IdeaCard from "$components/IdeaCard.svelte";

 import * as rx from "rxjs/operators";
 const st = store.start(initialState);

 const summary = "## Pros and cons for every idea\n\n### AAA\n\nPros:\n-  Increase visibility of AAA in the market\n-  Reach more people and potential customers\n-  Potential to create a stronger brand presence\n\nCons:\n- Need to invest time and resources into creating and managing the platform\n- Risk of not reaching desired results or ROI\n\n### Integrated AAA Platforms\n\nPros:\n- Easy access to all services, products and activities from one place\n- Increased convenience for users\n- More efficient use of resources\n\nCons:\n- High cost of implementation\n- Complexity of integrating different systems\n- Risk of user data security breaches\n\n### Integrated AAA Marketplace\n\nPros:\n- Easier access to services, products and activities from one place\n- Wider range of offerings available\n- Ability to reach a larger customer base\n\nCons:\n- High cost of implementation\n- Need to manage multiple vendors and suppliers\n- Risk of user data security breaches\n## Summary\n\nThe three ideas presented are all potential ways to increase the visibility of AAA in the market and reach more people. The first idea is about creating a platform that would allow users to access all of AAA's services from one place. The second idea is about creating an integrated platform that would integrate all of AAA's services, products and activities. The third idea is about creating a marketplace that would integrate all of AAA's services, products and activities from one place. Each of these ideas has its own pros and cons, so it is important to consider them carefully before making a decision.";

</script>

<section class="topics">
  <h3>Your ideation flow</h3>
  <ul>
    <li class="topic-item">
      <IdeaCard title="Test 1"
                description="Develop a new test to evaluate the performance of an application"
                tags={["uno", "dos", "tres"]} selected/>
    </li>
    <li class="topic-item">
      <IdeaCard title="Test 2"
                description="Develop a new test to evaluate the performance of an application"
                tags={["uno", "dos", "tres"]}/>
    </li>
  </ul>
</section>

<section class="summary">
  <div class="summary-content">
    {@html marked.parse(summary, {mangle: false, headerIds: false})}
  </div>

  <div class="actions">
    <Button type="secondary">Copy text</Button>
    <Button type="primary">Start over</Button>
  </div>
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
</style>
