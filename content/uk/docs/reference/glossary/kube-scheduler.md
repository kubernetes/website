---
title: kube-scheduler
id: kube-scheduler
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Компонент панелі управління, що відстежує створені Podʼи, які ще не розподілені по вузлах, і обирає вузол, на якому вони працюватимуть.

aka:
tags:
- architecture
---

Компонент панелі управління, що відстежує створені {{< glossary_tooltip term_id="pod" text="Podʼи" >}}, які ще не розподілені по {{< glossary_tooltip term_id="node" text="вузлах">}}, і обирає вузол, на якому вони працюватимуть.

<!--more-->

При виборі вузла враховуються наступні фактори: індивідуальна і колективна потреба в {{< glossary_tooltip text="ресурсах" term_id="infrastructure-resource" >}}, обмеження за апаратним/програмним забезпеченням і політиками, характеристики affinity та anti-affinity, локальність даних, сумісність робочих навантажень і граничні терміни виконання.
