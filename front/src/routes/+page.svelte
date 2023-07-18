<script lang="ts">
 import logo from "$lib/images/main-logo.png";
 import Search from "$components/Search.svelte";
 import type {State} from "$state";
 import store from "$store";
 import { CreateSession, InitSession } from "$events";
 import "../styles/start.css";

 const st = store.get<State>();
 const recent = st.select(st => st.recent ? [...st.recent].reverse() : []);

 function search(e: CustomEvent<string>) {
   st.emit(new CreateSession(e.detail));
 }

 function openSession(id: string) {
   st.emit(new InitSession(id));
 }
 
</script>

<section class="start">
  <div class="start-img"></div>
  <div class="start-form">
    <h1 class="main-logo">
      <img src={logo} alt="Brainsurfer">
      <span>Brainsurfer</span>
    </h1>
    
    <div class="start-form-inside">
      <h2>Ready to kickstart your brainstorming session?</h2>
      <p>Enter your first idea and let our AI-powered app guide you towards a world of innovative and creative possibilities.</p>

      <div class="search">
        <Search placeholder="Give me ideas for ..."
                color="blue"
                fontSize="large"
                on:search={search} />
      </div>
      {#if $recent}
        <div class="recent-ideas">
          <h3>Continue session:</h3>
          <ul>
            {#each $recent as ri}
              <li><a href={"/session/" + ri.id} on:click={openSession.bind(null, ri.id)}>{ri.topic}</a></li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
</section>
