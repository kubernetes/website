---
title: Ефемерний Контейнер
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Тип контейнера, який можна тимчасово запустити всередині Podʼа.

aka:
tags:
- fundamental
---
{{< glossary_tooltip term_id="container" >}} тип, який можна тимчасово запустити всередині {{< glossary_tooltip term_id="pod" text="Podʼа">}}.

<!--more-->

Якщо вам потрібно дослідити Pod, який працює з проблемами, ви можете додати ефемерний контейнер до цього Podʼа і провести діагностику. У ефемерних контейнерів немає гарантій ресурсів чи планування, і ви не повинні використовувати їх для запуску будь-якої частини навантаження самого Podʼа.

Ефемерні контейнери не підтримуються {{< glossary_tooltip text="статичними Podʼами" term_id="static-pod" >}}.
