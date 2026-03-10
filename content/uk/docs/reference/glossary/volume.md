---
title: Том
id: volume
full_link: /docs/concepts/storage/volumes/
short_description: >
  Тека, що містить дані та доступна для контейнерів у Podʼі.

aka:
- Volume
tags:
- fundamental
---

Тека, що містить дані та доступна для {{< glossary_tooltip text="контейнерів" term_id="container" >}} у {{< glossary_tooltip term_id="pod" text="Podʼі" >}}.

<!--more-->

Том Kubernetes існує так довго, як і Pod, який його містить. Відповідно, том існує довше, ніж будь-які контейнери, які працюють у межах Podʼа, і дані в томі зберігаються при перезапуску контейнера.

Дивіться [сховище](/docs/concepts/storage/) для отримання додаткової інформації.
