---
title: Drain
id: drain
full_link:
short_description: >
  Безпечно виселяє Podʼи з вузла, щоб підготувати його до обслуговування або вилучення.
tags:
- fundamental
- operation
---

Процес безпечного виселення {{< glossary_tooltip text="Podʼів" term_id="pod" >}} з {{< glossary_tooltip text="вузла" term_id="node" >}}, щоб підготувати його до обслуговування або вилучення з {{< glossary_tooltip text="кластера" term_id="cluster" >}}.

<!--more-->

Команда `kubectl drain` позначає {{< glossary_tooltip text="вузол" term_id="node" >}} як такий, що виводиться з експлуатації. Під час виконання вона виселяє всі {{< glossary_tooltip text="Podʼи" term_id="pod" >}} з {{< glossary_tooltip text="вузла" term_id="node" >}}. Якщо запит на виселення тимчасово відхилено, `kubectl drain` повторює спроби, доки всі {{< glossary_tooltip text="Podʼи" term_id="pod" >}} не буде завершено або не мине налаштований час очікування.
