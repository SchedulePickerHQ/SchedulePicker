#!/bin/bash

# SchedulePicker3直下で実行する
rm schedulepicker3_chrome.zip schedulepicker3_firefox.zip
npm install
npm run build
zip -r schedulepicker3_chrome.zip dist/chrome
zip -r schedulepicker3_firefox.zip dist/firefox
