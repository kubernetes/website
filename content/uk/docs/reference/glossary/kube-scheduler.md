---
title: kube-scheduler
id: kube-scheduler
full_link: /docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  Компонент панелі управління, що відстежує щойно створені Podʼи, які ще не розподілені по вузлах, і обирає вузол, на якому вони працюватимуть.

aka:
tags:
- architecture
---

Компонент панелі управління, що відстежує щойно створені {{< glossary_tooltip term_id="pod" text="Podʼи" >}}, які ще не розподілені по {{< glossary_tooltip term_id="node" text="вузлах" >}}, і обирає вузол, на якому вони працюватимуть.

<!--more-->

Під час вибору вузла враховуються такі фактори: індивідуальна і колективна потреба в {{< glossary_tooltip text="ресурсах" term_id="infrastructure-resource" >}}, обмеження за апаратним/програмним забезпеченням і політиками, характеристики affinity та anti-affinity, локальність даних, взаємний вплив робочих навантажень і граничні терміни виконання.
