---
title: PodTemplate
id: pod-template
short_description: >
  Шаблон для створення Podʼів.

aka:
  - pod template
tags:
- core-object
---

Обʼєкт API, який визначає шаблон для створення {{< glossary_tooltip text="Podʼів" term_id="pod" >}}. PodTemplate API також вбудований у визначення API для управління робочими навантаженнями, такими як {{< glossary_tooltip text="Deployment" term_id="deployment" >}} або {{< glossary_tooltip text="StatefulSets" term_id="StatefulSet" >}}.

<!--more-->

Шаблони Podʼів дозволяють визначати загальні метадані (такі як мітки або шаблон для імені нового Podʼа), а також вказувати бажаний стан podʼа. Контролери [управління робочим навантаженням](/docs/concepts/workloads/controllers/) використовують шаблони Podʼів (вбудовані в інший обʼєкт, такий як Deployment або StatefulSet) для визначення та управління одним або кількома {{< glossary_tooltip text="Podʼами" term_id="pod" >}}. Коли може бути кілька Podʼів на основі одного і того ж шаблону, вони називаються {{< glossary_tooltip term_id="replica" text="репліками" >}}. Хоча ви можете створити обʼєкт PodTemplate безпосередньо, вам рідко потрібно це робити.
