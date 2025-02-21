---
title: Job
id: job
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  Скінченне або пакетне завдання, яке виконується до завершення.

aka:
- Завдання
tags:
- fundamental
- core-object
- workload
---

Скінченне або пакетне завдання, яке виконується до завершення.

<!--more-->

Створює один чи кілька {{< glossary_tooltip term_id="pod" text="Podʼів">}} і забезпечує, що зазначена кількість з них успішно завершиться. В міру успішного завершення Podʼів, Job відстежує успішні завершення їх роботи.
