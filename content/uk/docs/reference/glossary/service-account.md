---
title: ServiceAccount
id: service-account
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Забезпечує ідентифікацію для процесів, які працюють в Podʼі.

aka:
- Службовий обліковий запис
tags:
- fundamental
- core-object
---

Забезпечує ідентифікацію для процесів, які працюють в {{< glossary_tooltip text="Podʼі" term_id="pod" >}}.

<!--more-->

Коли процеси всередині Podʼів отримують доступ до кластера, їх автентифікує API-сервер як певний службовий обліковий запис, наприклад, `default`. Якщо під час створення Podʼа ви не вказали службовий обліковий запис, йому автоматично призначається типовий службовий обліковий запис у тому самому {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}.
