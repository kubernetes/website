---
title: PriorityClass
id: priority-class
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  Зіставлення імені класу з пріоритетом планування, який повинен мати Pod.
aka:
tags:
- core-object
---

PriorityClass — це іменований клас для пріоритету планування, який слід призначити Podʼу у цьому класі.

<!--more-->

[PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption) — це обʼєкт, який не належить до жодного простору імен, який зіставляє назву з цілочисельним пріоритетом, що використовується для Podʼа. Назва вказується в полі `metadata.name`, а значення пріоритету — у полі `value`. Пріоритети коливаються від -2147483648 до 1000000000 включно. Вищі значення вказують на вищий пріоритет.
