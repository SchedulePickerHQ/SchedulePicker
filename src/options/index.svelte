<script lang="ts">
  import "./i18n";

  import { _ } from "svelte-i18n";

  import Button from "./Button.svelte";
  import Checkbox from "./Checkbox.svelte";
  import Radio from "./Radio.svelte";
</script>

<main lang={$_("option_lang.message")}>
  <header class="header">
    <h1 class="title">{$_("option_header_text.message")}</h1>
    <Button
      on:click={() => {
        console.log("saved");
      }}>{$_("option_save_button_text.message")}</Button>
  </header>
  <div id="template-setting" class="group">
    <h2 class="template-setting__label group__title">{$_("option_template_title.message")}</h2>
    <textarea class="template-setting__textarea" placeholder={$_("option_template_placeholder.message")}></textarea>
    <a
      class="template-setting__usage-link"
      href={$_("option_template_usage_url.message")}
      target="_blank"
      rel="noopener noreferrer">{$_("option_template_usage.message")}</a>
  </div>
  <fieldset id="context-menu-setting" class="group">
    <legend class="group__title">{$_("option_context_menu_title.message")}</legend>
    <Checkbox label={$_("option_context_menu_today.message")} name="context-menu-setting" />
    <Checkbox label={$_("option_context_menu_tomorrow.message")} name="context-menu-setting" />
    <Checkbox label={$_("option_context_menu_yesterday.message")} name="context-menu-setting" />
    <Checkbox label={$_("option_context_menu_next_business_day.message")} name="context-menu-setting" />
    <Checkbox label={$_("option_context_menu_previous_business_day.message")} name="context-menu-setting" />
    <Checkbox label={$_("option_context_menu_specified_day.message")} name="context-menu-setting" />
    <Checkbox label={$_("option_context_menu_template.message")} name="context-menu-setting" />
    <Checkbox label={$_("option_context_menu_syntax.message")} name="context-menu-setting" />
  </fieldset>
  <fieldset id="syntax-setting" class="group">
    <legend class="group__title">{$_("option_syntax_title.message")}</legend>
    <Radio label={$_("option_syntax_html.message")} name="syntax-setting" />
    <Radio label={$_("option_syntax_markdown.message")} name="syntax-setting" />
    <Radio label={$_("option_syntax_plane_text.message")} name="syntax-setting" />
  </fieldset>
  <fieldset id="allday-events-shown-setting" class="group">
    <legend class="group__title">{$_("option_all_day_title.message")}</legend>
    <Checkbox label={$_("option_all_day_shown.message")} />
  </fieldset>
</main>

<style>
  :root {
    --primary-color: #00acc1;
    --border-color: #788087;
    --text-color: #1f2c37;
  }

  main {
    width: 560px;
    height: 100%;
    margin: 24px;
    padding: 24px;
    background-color: white;
    font-size: 14px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    margin-bottom: 24px;
  }

  .title {
    display: inline-block;
    font-size: 28px;
    font-weight: normal;
    margin: 0;
  }

  .group {
    border: none;
    padding: 0;
    margin-bottom: 32px;
  }

  .group__title {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .template-setting__label {
    display: block;
    font-size: 20px;
    font-weight: normal;
  }

  .template-setting__textarea {
    width: 100%;
    height: 280px;
    padding: 8px;
    margin: 8px 0;
    box-sizing: border-box;
    resize: vertical;
  }

  .template-setting__usage-link {
    color: var(--primary-color);
  }
</style>
