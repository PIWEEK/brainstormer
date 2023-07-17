<script lang="ts">
 import logo from "$lib/images/main-logo.png";
 import GoIcon from "$components/GoIcon.svelte";
</script>

<header>
  <h1 class="main-logo">
    <a class="main-logo-link" href="/">
      <img src={logo} alt="Brainsurfer">
    </a>
  </h1>

  <form class="searchForm" autocomplete="off">
    <textarea class="searchInput" placeholder="Ideas for..."></textarea>
    <button class="submit-btn" type="submit">
      <GoIcon/>
    </button>
  </form>
  <button id="doneBtn" class="primary-button">I'm done!</button>
</header>

<style lang="postcss">

 header {
   align-self: center;
   align-items: center;
   display: flex;
   width: 100%;
   padding: 10px 20px;
 }

 .searchForm {
   display: flex;
   gap: 0.5rem;
   align-items: baseline;
   width: 100%;
   position: relative;
   max-width: 800px;
   margin: 0 auto;
 }

 .searchInput {
   flex-grow: 1;
   font-family: Lato;
   font-size: 20px;
   font-weight: 700;
   padding: 0.5rem 1rem;
   border: none;
   border-radius: 4px;
   height: 55px;
 }

 .searchInput {
   padding-top: 16px;
   padding-bottom: 16px;
   resize: none;
   overflow: hidden;
 }

 .submit-btn {
   align-self: normal;
   position: absolute;
   right: 8px;
   bottom: 8px;
 }

 .submit-btn {
   width: 40px;
   border-radius: 8px;
   background: var(--robin-egg-blue);
   border: none;
   padding: 0;
   margin: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 0.25rem;
   cursor: pointer;
 }

 .main-logo {
   align-items: center;
   display: flex;
 }

 .main-logo img {
   width: 64px;
   margin-right: 10px;
 }

 .primary-button {
   max-width: 170px;
 }

 .primary-button:hover {
   background: var(--caribbean-current);
 }

 .primary-button {
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

</style>
