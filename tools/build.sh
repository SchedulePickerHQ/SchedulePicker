#!/bin/bash

# SchedulePicker3直下で実行する
rm schedulepicker3.zip
npm install
npm run build
zip -r schedulepicker3.zip dist/
