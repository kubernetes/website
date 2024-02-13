---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Забезпечує ідентифікацію для процесів, які працюють в Podʼі.

aka:
tags:
- fundamental
- core-object
---
Забезпечує ідентифікацію для процесів, які працюють в {{< glossary_tooltip text="Podʼі" term_id="pod" >}}.

<!--more-->

Коли процеси всередині Podʼів отримують доступ до кластера, їх автентифікує сервер API як певний обліковий запис сервісу, наприклад, `default`. При створенні Podʼа, якщо ви не вказали обліковий запис сервісу, йому автоматично буде призначений типовий обліковий запис сервісу у тому ж {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.
