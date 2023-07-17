<script lang="ts">
 import store from "$store";
 import type { State } from "$state";
 import { initialState } from "$state";

 import logo from "$lib/images/main-logo.png";
 import GoIcon from "$components/GoIcon.svelte";

 import * as rx from "rxjs/operators";
 const st = store.start(initialState);

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
      <form class="searchForm" autocomplete="off">
        <textarea class="searchInput" placeholder="Give me ideas for ..." style="height: 55px;"></textarea>
        <button class="submit-btn" type="submit">
          <GoIcon/>
        </button>
      </form>
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
 }

 .main-logo img {
   width: 64px;
   margin-right: 10px;
 }

 .main-logo span {
   font-weight: 800;
   font-size: 24px;
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

 header form, .searchForm {
   display: flex;
   gap: 0.5rem;
   align-items: baseline;
   width: 100%;
   position: relative;
   max-width: 800px;
   margin: 0 auto;
 }

 .searchInput {
   background-color: var(--alice-blue);
   margin-top: 3rem;
   height: 55px;
   padding: 16px 1rem;
   resize: none;
   overflow: hidden;
   flex-grow: 1;
   font-family: Lato;
   font-size: 20px;
   font-weight: 700;
   border: none;
   border-radius: 4px;
   
 }
 
 .submit-btn {
   align-self: normal;
   position: absolute;
   right: 8px;
   bottom: 8px;
   width: 40px;
   border-radius: 8px;
   background: var(--robin-egg-blue);
   border: none;
   margin: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 0.25rem;
   cursor: pointer;
 }
</style>
