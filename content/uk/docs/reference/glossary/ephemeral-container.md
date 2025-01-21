---
title: Ефемерний Контейнер
id: ephemeral-container
date: 2019-08-26
full_link: /uk/docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Тип контейнера, який можна тимчасово запустити всередині Podʼа.

aka:
- Ephemeral Container
tags:
- fundamental
---
Тип {{< glossary_tooltip term_id="container" text="контейнера">}}, який можна тимчасово запустити всередині {{< glossary_tooltip term_id="pod" text="Podʼа">}}.

<!--more-->

Якщо вам потрібно дослідити Pod, який зтикається з проблемами, ви можете додати ефемерний контейнер до цього Podʼа та провести діагностику. У ефемерних контейнерів немає гарантій ресурсів чи планування, і ви не повинні використовувати їх для запуску будь-якої частини навантаження самого Podʼа.

Ефемерні контейнери не підтримуються {{< glossary_tooltip text="статичними Podʼами" term_id="static-pod" >}}.
