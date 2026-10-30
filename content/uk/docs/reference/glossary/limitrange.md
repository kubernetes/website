---
title: LimitRange
id: limitrange
full_link: /docs/concepts/policy/limit-range/
short_description: >
  Встановлює обмеження на споживання ресурсів окремими контейнерами чи Podʼами в просторі імен.

aka:
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container
---

Обмежує споживання ресурсів кожним {{< glossary_tooltip text="контейнером" term_id="container" >}} або {{< glossary_tooltip text="Podʼом" term_id="pod" >}} і задається для конкретного {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

<!--more-->

[LimitRange](/docs/concepts/policy/limit-range/) обмежує або кількість {{< glossary_tooltip text="ресурсів API" term_id="api-resource" >}}, які можна створити (для певного типу ресурсів), або обсяг {{< glossary_tooltip text="ресурсів інфраструктури" term_id="infrastructure-resource" >}}, який можуть запитувати/споживати окремі контейнери або Podʼи в межах простору імен.
