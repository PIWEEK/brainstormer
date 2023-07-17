<script lang="ts">
 import store from "$store";
 import type { State } from "$state";
 import { initialState } from "$state";

 import Header from "$components/Header.svelte";

 import * as rx from "rxjs/operators";
 const st = store.start(initialState);

</script>


<section class="topics">
  <h3>Your ideation flow</h3>
  <ul>
    <li class="topic-item">
      <p class="topic-item-title">Test 1</p>
      <p class="topic-item-description">Develop a new test to evaluate the performance of an application</p>
      <p class="topic-item-keywords"></p>
    </li>
    <li class="topic-item">
      <p class="topic-item-title">Test 2</p>
      <p class="topic-item-description">Design a test to evaluate the scalability of an application</p>
      <p class="topic-item-keywords"></p>
    </li>
  </ul>
</section>

<section class="topics summary">
  <div class="summary-content">
    <h2 id="pros-and-cons-for-every-idea">Pros and cons for every idea</h2>

    <h3 id="test-1">Test 1</h3>
    <p>Pros:</p>
    <ul>
      <li>Allows for a comprehensive evaluation of the application's performance
      </li>
      <li>Can provide valuable insights into areas where improvements can be made
      </li>
      <li>Can help identify potential issues before they become major problems
      </li>
    </ul>
    <p>Cons:</p>
    <ul>
      <li>Can be time consuming and costly to develop
      </li>
      <li>May require specialized expertise or resources to create
      </li>
      <li>Results may not always be reliable or accurate.
      </li>
    </ul>
    <h3 id="test-2">Test 2</h3>
    <p>Pros:</p>
    <ul>
      <li>Identifies any weaknesses in scalability that could lead to future performance issues
      </li>
      <li>Can detect any bottlenecks that might limit the application's growth
      </li>
      <li>Allows developers to plan ahead and make changes if necessary
      </li>
    </ul>
    <p>Cons:</p>
    <ul>
      <li>Can be difficult to set up and execute properly
      </li>
      <li>Results may be unreliable depending on the environment used
      </li>
      <li>Can be expensive to run multiple tests with different scenarios
      </li>
    </ul>
    <h2 id="summary">Summary</h2>
    <p>The two ideas presented are Test 1 and Test 2. Test 1 is a test to evaluate the performance of an application, while Test 2 is a test to evaluate the scalability of an application. Both tests have their pros and cons, such as being time consuming and costly to develop for Test 1, or being difficult to set up and execute properly for Test 2. Ultimately, it depends on the specific needs of the project which test should be used.
    </p>
    <p>Total price: 0.03$</p>
    <p>Tokens: 1295</p>
  </div>
  <div class="actions">
    <button class="secondary-button">Copy text</button>
    <button class="primary-button">Start over</button>
  </div>
</section>


<style>

 .topics {
   min-width: 335px;
   background: white;
   border-radius: 4px;
   padding-bottom: 1rem;
 }

 .topics h3 {
   font-size: 20px;
   color: var(--robin-egg-blue);
   margin: 20px;
 }

 .topic-item {
   padding: 1rem;
   border-radius: 4px;
   position: relative;
   border: 2px solid var(--anti-flash-white);
   width: 300px;
   margin-bottom: calc(1rem + 1px);
   cursor: pointer;
 }

 .topic-item-title {
   font-size: 20px;
   font-weight: 700;
 }

 .topic-item-description {
   font-size: 16px;
   line-height: 1.2;
   margin: 0.5rem 0;
 }

 .topic-item-keywords {
   font-size: 14px;
   line-height: 1.2;
   margin: 0.5rem 0;
   font-weight: 700;
   color: var(--robin-egg-blue);
 }

 .summary {
   display: flex;
   flex-direction: column;
   width: 700px;
   max-width: 700px;
 }
 
 .topics.summary {
   padding: 1rem;
   overflow-y: auto;
 }
 
 .summary-content {
   display: flex;
   flex-direction: column;
   overflow-y: auto;
 }

 .topics.summary h2 {
   margin: 0 0 1rem 0;
   color: var(--robin-egg-blue);
   font-size: 20px;
 }

 .topics h3 {
   font-size: 20px;
   color: var(--robin-egg-blue);
   margin: 20px;
 }
 
 .topics.summary h3 {
   color: black;
   margin: 1rem 0;
   text-align: left;
   font-weight: 700;
 }

 .topics.summary p {
   padding: 0.5rem 0;
 }

 .topics.summary ul {
   display: flex;
   flex-direction: column;
   padding: 1rem;
   overflow: initial;
 }

 .topics.summary ul li {
   margin-bottom: 1rem;
 }

 .summary .actions {
   display: flex;
   align-items: center;
   justify-content: center;
   column-gap: 20px;
   margin-top: auto;
 }

 .secondary-button {
   width: 100%;
   display: block;
   height: 45px;
   border: 2px solid var(--robin-egg-blue);
   color: var(--robin-egg-blue);
   font-family: Lato;
   font-weight: 700;
   font-size: 16px;
   background: white;
   border-radius: 4px;
   padding: 0 1rem;
   cursor: pointer;
 }

 .topic-more > button, .primary-button {
   width: 100%;
   display: block;
   height: 45px;
   background: var(--robin-egg-blue);
   color: white;
   font-family: Lato;
   font-weight: 700;
   font-size: 16px;
   border: none;
   border-radius: 4px;
   padding: 0 1rem;
   cursor: pointer;
 }

 .primary-button, .secondary-button {
   max-width: 170px;
 }
 
</style>
