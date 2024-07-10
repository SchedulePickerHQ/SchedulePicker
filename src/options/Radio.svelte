<script lang="ts">
  export let label: string = "";
  export let name: string = "";
  export let checked: boolean = false;
</script>

<label>
  <input type="radio" {name} {checked} />
  <span class="text">{label}</span>
</label>

<style>
  label {
    display: inline-flex;
    align-items: center;
    margin: 8px 8px 8px 2px;
    cursor: pointer;
  }

  .text {
    margin-left: 4px;
    color: var(--text-color);
  }

  input[type="radio"] {
    position: relative;
    width: 20px;
    height: 20px;
    margin: 0;
    appearance: none;
    cursor: pointer;
  }

  input[type="radio"]:before {
    content: "";
    position: absolute;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    background-color: white;
    border: 2px solid var(--border-color);
    border-radius: 999px;
  }

  input[type="radio"]:checked:before {
    border: 2px solid var(--primary-color);
  }

  input[type="radio"]:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    transform-origin: 50% 50%;
    transform: translate(-50%, -50%);
    width: calc(20px * 0.5);
    height: calc(20px * 0.5);
    background-color: var(--primary-color);
    border-radius: 999px;
    opacity: 0;
  }

  input[type="radio"]:checked:after {
    opacity: 1;
    animation: toggle 0.2s ease both;
  }

  @keyframes toggle {
    0% {
      opacity: 0;
    }

    70% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }
</style>
