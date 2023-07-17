<script lang="ts">
 import logo from "$lib/images/main-logo.png";
 import GoIcon from "$components/GoIcon.svelte";
 import Search from "$components/Search.svelte";
 import Button from "$components/Button.svelte";
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
            fontSize="large" />
  </div>
  <div class="done-btn">
    <Button type="primary">I'm done!</Button>
  </div>
</header>

<style lang="postcss">
 header {
   align-items: center;
   align-self: center;
   display: flex;
   padding: 10px 20px;
   width: 100%;
 }

 .search {
   margin: 0 auto;
   max-width: 800px;
   width: 800px;
 }

 .main-logo {
   align-items: center;
   display: flex;

   img {
     width: 64px;
     margin-right: 10px;
   }
 }

 .done-btn {
   width: 170px;
 }
</style>
