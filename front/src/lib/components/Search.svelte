<style lang="postcss" src="./Search.css"></style>

<script lang="ts">
 import { createEventDispatcher } from 'svelte';
 import Button from "$components/Button.svelte";

 export let placeholder: string;
 export let color: 'blue' | 'white' | 'gray';
 export let fontSize: 'normal' | 'large' = "normal";
 export let value: string | null = null;

 let formElement: HTMLFormElement;

 const dispatch = createEventDispatcher();

 function handleSubmit(event: SubmitEvent) {
   event.preventDefault();
   const formData = new FormData(formElement);
   dispatch("search", formData.get("searchText"));
 }

 function handleInput(event: KeyboardEvent) {
   if (event.key === "Enter" && !event.shiftKey) {
     event.preventDefault();
     const formData = new FormData(formElement);
     dispatch("search", formData.get("searchText"));
   }
 }
</script>

<form bind:this={formElement}
      class="searchForm"
      autocomplete="off"
      class:blue={color === "blue"}
      class:white={color === "white"}
      class:gray={color === "gray"}
      class:font-large={fontSize === "large"}
      on:submit={handleSubmit}>
  <textarea id="searchText"
            name="searchText"
            class="searchInput"
            placeholder={placeholder}
            on:keydown={handleInput}>{value || ""}</textarea>

  <div class="submit-btn">
    <Button type="icon" icon="go" submit/>
  </div>
</form>
