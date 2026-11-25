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

Шаблони Podʼів дозволяють визначати загальні метадані (такі як мітки або шаблон для назви нового Podʼа), а також вказувати бажаний стан Podʼа. Контролери [управління робочими навантаженнями](/docs/concepts/workloads/controllers/) використовують шаблони Podʼів (вбудовані в інший обʼєкт, такий як Deployment або StatefulSet) для визначення одного або кількох {{< glossary_tooltip text="Podʼів" term_id="pod" >}} та управління ними. Коли може бути кілька Podʼів на основі одного й того самого шаблону, вони називаються {{< glossary_tooltip term_id="replica" text="репліками" >}}. Хоча ви можете створити обʼєкт PodTemplate безпосередньо, вам рідко потрібно це робити.
