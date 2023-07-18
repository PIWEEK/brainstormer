<script lang="ts">
 import {page} from '$app/stores'
 import store from "$store";
 import type { State } from "$state";
 import { currentSession } from "$state";
 import { RetrieveSummary, CreateSession } from "$events";

 import logo from "$lib/images/main-logo.png";
 import GoIcon from "$components/GoIcon.svelte";
 import Search from "$components/Search.svelte";
 import Button from "$components/Button.svelte";

 const st = store.get<State>();

 let session = st.select(currentSession);

 function search(e: CustomEvent<string>) {
   st.emit(new CreateSession(e.detail));
 }

 function handleClick() {
   st.emit(new RetrieveSummary());
 }

</script>

<header>
  <h1 class="main-logo">
    <a class="main-logo-link" href="/">
      <img src={logo} alt="Brainsurfer">
    </a>
  </h1>

  <div class="search">
    <Search placeholder="Ideas for..."
            color="white"
            fontSize="large"
            value={$session?.topic}
            on:search={search} />
  </div>
  {#if $page.route.id !== "/session/[id]/summary"}
    <div class="done-btn">
      <Button type="primary" on:click={handleClick}>I'm done!</Button>
    </div>
  {/if}
</header>
