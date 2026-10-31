---
title: Taint
id: taint
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Основний обʼєкт, що складається з трьох обовʼязкових властивостей: key, value та effect. Taints запобігають розміщенню Podʼів на вузлах чи групах вузлів.

aka:
- Позначка
- Заплямованість
tags:
- fundamental
---

Основний обʼєкт, що складається з трьох обовʼязкових властивостей: key, value та effect. Taints запобігають розміщенню {{< glossary_tooltip text="Podʼів" term_id="pod" >}} на {{< glossary_tooltip text="вузлах" term_id="node" >}} чи групах вузлів.

<!--more-->

Taints та {{< glossary_tooltip text="tolerations" term_id="toleration" >}} співпрацюють, щоб Podʼи не розміщувалися на непридатних вузлах. Один чи декілька taints застосовуються до вузла. Вузол повинен розміщувати лише Podʼи з tolerations, що збігаються з налаштованими taints.
