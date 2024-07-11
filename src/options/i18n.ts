import { addMessages, getLocaleFromNavigator, init } from "svelte-i18n";

import en from "./../../assets/_locales/en/messages.json";
import ja from "./../../assets/_locales/ja/messages.json";

addMessages("en", en);
addMessages("ja", ja);

init({
  fallbackLocale: "en",
  initialLocale: getLocaleFromNavigator()
});
