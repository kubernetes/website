---
title: LimitRange
id: limitrange
full_link:  /uk/docs/concepts/policy/limit-range/
short_description: >
  Впроваджує ліміти для обмеження обсягу споживання ресурсів для кожного контейнера чи Podʼа в просторі імен.

aka:
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container
---

Обмеження споживання ресурсів на {{< glossary_tooltip text="контейнера" term_id="container" >}} або {{< glossary_tooltip text="Podʼа" term_id="pod" >}}, визначених для конкретного {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

<!--more-->

[LimitRange](/docs/concepts/policy/limit-range/) обмежує кількість {{< glossary_tooltip text="ресурсів API" term_id="api-resource" >}}, які можуть бути створені (для певного типу ресурсів), або кількість {{< glossary_tooltip text="ресурсів інфраструктури" term_id="infrastructure-resource" >}}, які можуть бути затребувані/спожиті окремими контейнерами або Podʼами в межах простору імен.
