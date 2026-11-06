---
title: Ефемерний контейнер
id: ephemeral-container
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Тип контейнера, який можна тимчасово запустити всередині Podʼа.

aka:
- Ephemeral Container
tags:
- fundamental
---

Тип {{< glossary_tooltip term_id="container" text="контейнера">}}, який можна тимчасово запустити всередині {{< glossary_tooltip term_id="pod" text="Podʼа">}}.

<!--more-->

Якщо вам потрібно дослідити Pod, який працює з проблемами, ви можете додати до цього Podʼа ефемерний контейнер і провести діагностику. Для ефемерних контейнерів немає гарантій щодо {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} чи планування, і не варто використовувати їх для запуску будь-якої частини самого робочого навантаження.

Ефемерні контейнери не підтримуються {{< glossary_tooltip text="статичними Podʼами" term_id="static-pod" >}}.
