---
title: Drain
id: drain
full_link:
short_description: >
  Безпечно виселяє Podʼи з Node для підготовки до обслуговування або видалення.
aka:
  - Злив
  - Очищення
tags:
- fundamental
- operation
---

Процес безпечного виселення {{< glossary_tooltip text="Podʼів" term_id="pod" >}} з {{< glossary_tooltip text="Node" term_id="node" >}} для підготовки до обслуговування або видалення з {{< glossary_tooltip text="кластера" term_id="cluster" >}}.

<!--more-->

Команда `kubectl drain` використовується для позначення {{< glossary_tooltip text="Вузла" term_id="node" >}} як такого, що виводиться з експлуатації. При виконанні відбувається виселення всіх {{< glossary_tooltip text="Podʼів" term_id="pod" >}} з {{< glossary_tooltip text="Вузла" term_id="node" >}}. Якщо запит на виселення тимчасово відхилено, `kubectl drain` повторює спроби, доки всі {{< glossary_tooltip text="Podʼи" term_id="pod" >}} не будуть завершені або не буде досягнуто налаштовуваного тайм-ауту.
