---
title: Toleration
id: toleration
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Основний обʼєкт, що складається з трьох обовʼязкових властивостей: key, value та effect. Toleration дозволяє розміщення Podʼів на вузлах чи групах вузлів, які мають відповідні taints.

aka:
- Толерантність
tags:
- core-object
- fundamental
---

Основний обʼєкт, що складається з трьох обовʼязкових властивостей: key, value та effect. Toleration дозволяє розміщення {{< glossary_tooltip text="Podʼів" term_id="pod" >}} на вузлах чи групах вузлів, які мають відповідні {{< glossary_tooltip text="taints" term_id="taint" >}}.

<!--more-->

Tolerations та {{< glossary_tooltip text="taints" term_id="taint" >}} співпрацюють, щоб Podʼи не розміщувалися на непридатних вузлах. Один чи декілька tolerations застосовуються до {{< glossary_tooltip text="Podʼа" term_id="pod" >}}. Toleration вказує, що {{< glossary_tooltip text="Pod" term_id="pod" >}} може (але не обовʼязково) бути розміщеним на вузлах чи групах вузлів із відповідними {{< glossary_tooltip text="taints" term_id="taint" >}}.
