<button on:click>
  <slot />
</button>

<style>
  button {
    width: 80px;
    height: 32px;
    border-radius: 999px;
    border: 2px solid var(--primary-color);
    box-sizing: border-box;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
