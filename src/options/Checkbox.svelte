<script lang="ts">
  export let label: string = "";
  export let name: string = "";
  export let checked: boolean = false;
</script>

<label>
  <input type="checkbox" {name} {checked} />
  <span class="text">{label}</span>
</label>

<style>
  label {
    display: inline-flex;
    align-items: center;
    margin: 8px 8px 8px 2px;
    cursor: pointer;
  }

  input[type="checkbox"] {
    position: relative;
    width: 20px;
    height: 20px;
    margin: 0;
    appearance: none;
    cursor: pointer;
  }

  input[type="checkbox"]:before {
    content: "";
    position: absolute;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    background-color: white;
    border: 2px solid var(--border-color);
    border-radius: 4px;
  }

  input[type="checkbox"]:checked:before {
    border: 2px solid var(--primary-color);
  }

  input[type="checkbox"]:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-55%, -95%) rotate(45deg);
    width: calc(20px * 0.4);
    height: calc(20px * 0.6);
    background-color: transparent;
    box-shadow: 3px 3px 0px 0px var(--primary-color);
    opacity: 0;
  }

  input[type="checkbox"]:checked:after {
    opacity: 1;
    animation: toggle 0.2s ease both;
  }

  .text {
    margin-left: 4px;
    color: var(--text-color);
  }

  @keyframes toggle {
    0% {
      opacity: 0;
      transform: translate(-55%, -95%) scale(0) rotate(45deg);
    }

    70% {
      opacity: 1;
      transform: translate(-55%, -95%) scale(1.1) rotate(45deg);
    }

    100% {
      transform: translate(-55%, -95%) scale(1) rotate(45deg);
    }
  }
</style>
