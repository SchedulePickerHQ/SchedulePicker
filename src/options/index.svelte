<script lang="ts">
  import "./i18n";

  import { _ } from "svelte-i18n";
</script>

<main lang={$_("option_lang.message")}>
  <header class="header">
    <h1 class="title">{$_("option_header_text.message")}</h1>
    <button class="save-button">
      <span class="save-button__text">{$_("option_save_button_text.message")}</span>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path
          d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
      </svg>
    </button>
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
    <label class="checkbox-label">
      <input id="today" class="checkbox" type="checkbox" name="display-menu-setting" checked />
      <span class="checkbox-text">{$_("option_context_menu_today.message")}</span>
    </label>
    <label class="checkbox-label">
      <input id="tomorrow" class="checkbox" type="checkbox" name="display-menu-setting" />
      <span class="checkbox-text">{$_("option_context_menu_tomorrow.message")}</span>
    </label>
    <label class="checkbox-label">
      <input id="yesterday" class="checkbox" type="checkbox" name="display-menu-setting" />
      <span class="checkbox-text">{$_("option_context_menu_yesterday.message")}</span>
    </label>
    <label class="checkbox-label">
      <input id="next-business-day" class="checkbox" type="checkbox" name="display-menu-setting" />
      <span class="checkbox-text">{$_("option_context_menu_next_business_day.message")}</span>
    </label>
    <label class="checkbox-label">
      <input id="previous-business-day" class="checkbox" type="checkbox" name="display-menu-setting" />
      <span class="checkbox-text">{$_("option_context_menu_previous_business_day.message")}</span>
    </label>
    <label class="checkbox-label">
      <input id="specified-day" class="checkbox" type="checkbox" name="display-menu-setting" />
      <span class="checkbox-text">{$_("option_context_menu_specified_day.message")}</span>
    </label>
    <label class="checkbox-label">
      <input id="template" class="checkbox" type="checkbox" name="display-menu-setting" />
      <span class="checkbox-text">{$_("option_context_menu_template.message")}</span>
    </label>
    <label class="checkbox-label">
      <input id="syntax" class="checkbox" type="checkbox" name="display-menu-setting" checked />
      <span class="checkbox-text">{$_("option_context_menu_syntax.message")}</span>
    </label>
  </fieldset>
  <fieldset id="syntax-setting" class="group">
    <legend class="group__title">{$_("option_syntax_title.message")}</legend>
    <label class="radio-label">
      <input id="html" class="radio" type="radio" name="syntax-setting" checked />
      <span class="radio-text">{$_("option_syntax_html.message")}</span>
    </label>
    <label class="radio-label">
      <input id="markdown" class="radio" type="radio" name="syntax-setting" />
      <span class="radio-text">{$_("option_syntax_markdown.message")}</span>
    </label>
    <label class="radio-label">
      <input id="plane-text" class="radio" type="radio" name="syntax-setting" />
      <span class="radio-text">{$_("option_syntax_plane_text.message")}</span>
    </label>
  </fieldset>
  <fieldset id="allday-events-shown-setting" class="group">
    <legend class="group__title">{$_("option_all_day_title.message")}</legend>
    <label class="checkbox-label">
      <input id="allday-events-shown" class="checkbox" type="checkbox" name="allday-events-shown-setting" />
      <span class="checkbox-text">{$_("option_all_day_shown.message")}</span>
    </label>
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
  }

  .group {
    margin-bottom: 32px;
  }

  .group__title {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .template-setting__label {
    display: block;
  }

  .template-setting__textarea {
    width: 100%;
    height: 320px;
    padding: 8px;
    margin: 8px 0;
    box-sizing: border-box;
    resize: vertical;
  }

  .template-setting__usage-link {
    color: var(--primary-color);
  }
</style>
