<script lang="ts">
 import logo from "$lib/images/main-logo.png";
 import Search from "$components/Search.svelte";
 import type {State} from "$state";
 import store from "$store";
 import { CreateSession } from "$events";

 const st = store.get<State>();

 function search(e: CustomEvent<string>) {
   st.emit(new CreateSession(e.detail));
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
    </div>
  </div>
</section>

<style lang="postcss">
 .start {
   box-sizing: border-box;
   display: flex;
   width: 100%;
 }

 .start-img {
   background-image: url($lib/images/start-img.png);
   background-size: cover;
   background-position: center -60px;
   max-width: 40%;
   width: 100%;
 }

 .start-form {
   background-color: white;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   text-align: center;
   padding: 30px;
 }

 .main-logo {
   align-items: center;
   display: flex;
   font-family: Lato;

   img {
     width: 64px;
     margin-right: 10px;
   }

   span {
     font-weight: 700;
     font-size: 24px;
   }
 }

 .start-form-inside {
   display: flex;
   flex-direction: column;
   align-items: center;
   max-width: 600px;
   width: 100%;
   margin: auto 0;
 }

 h2 {
   font-weight: light;
   font-size: 40px;
   line-height: 1.4;
   margin-bottom: 20px;
 }

 .search {
   margin-top: 4rem;
   max-width: 800px;
   width: 100%;
 }

</style>
