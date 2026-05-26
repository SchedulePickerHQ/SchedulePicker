import { addMessages, getLocaleFromNavigator, init } from "svelte-i18n";

import en from "../../../public/_locales/en/messages.json";
import ja from "../../../public/_locales/ja/messages.json";

addMessages("en", en);
addMessages("ja", ja);

init({
	fallbackLocale: "en",
	initialLocale: getLocaleFromNavigator(),
});
