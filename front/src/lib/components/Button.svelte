<script lang="ts">
 import GoIcon from "$components/GoIcon.svelte";
 
 export let type: 'primary' | 'secondary' | 'icon';
 export let icon: 'go' | null = null;
 export let submit: boolean = false;
</script>

<button class:primary={type === "primary"}
        class:secondary={type === "secondary"}
        class:icon={type === "icon"}
        type={submit ? "submit" : null}>
  {#if icon === "go"}
    <GoIcon/>
  {:else}
    <slot/>
  {/if}
</button>


<style lang="postcss">
 .primary {
   background: var(--robin-egg-blue);
   border-radius: 4px;
   border: none;
   color: white;
   cursor: pointer;
   display: block;
   font-family: Lato;
   font-size: 16px;
   font-weight: 700;
   height: 45px;
   padding: 0 1rem;
   width: 100%;
 }

 .secondary {
   background: white;
   border-radius: 4px;
   border: 2px solid var(--robin-egg-blue);
   color: var(--robin-egg-blue);
   cursor: pointer;
   display: block;
   font-family: Lato;
   font-size: 16px;
   font-weight: 700;
   height: 45px;
   padding: 0 1rem;
   width: 100%;
 }

 .icon {
   align-items: center;
   background: var(--robin-egg-blue);
   border-radius: 8px;
   border: none;
   cursor: pointer;
   display: flex;
   justify-content: center;
   margin: 0;
   padding: 0.25rem;
   width: 40px;
 }


 .primary:hover {
   background: var(--caribbean-current);
 }


</style>
