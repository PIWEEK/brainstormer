<script lang="ts">
  import Button from "$components/Button.svelte";

  export let placeholder: string;
  export let color: 'blue' | 'white' | 'gray';
  export let fontSize: 'normal' | 'large' = "normal";
</script>

<form class="searchForm" autocomplete="off"
      class:blue={color === "blue"}
      class:white={color === "white"}
      class:gray={color === "gray"}
      class:font-large={fontSize === "large"}>
  <textarea class="searchInput" placeholder={placeholder}></textarea>

  <div class="submit-btn">
    <Button type="icon" icon="go" submit/>
  </div>
</form>

<style lang="postcss">
  .searchForm {
    display: flex;
    position: relative;
    width: 100%;
  }

  .searchInput {
    border-radius: 8px;
    color: black;
    font-family: Lato;
    font-size: 14px;
    height: 50px;
    padding-left: 0.5rem;
    padding-top: 1rem;
    resize: none;
    width: 100%;
  }

  .font-large .searchInput {
    font-size: 20px;
    font-weight: 700;
    padding-left: 1rem;
  }

  .blue .searchInput {
    border: var(--alice-blue);
    background-color: var(--alice-blue);
  }

  .gray .searchInput {
    border: var(--anti-flash-white);
    background: var(--anti-flash-white);
  }

  .white .searchInput {
    border: white;
    background: white;
  }

  .submit-btn {
    position: absolute;
    right: 0.25rem;
    top: 0.25rem;
  }

</style>
