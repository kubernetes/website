---
title: Job
id: job
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  Конечная или пакетная задача, которая выполняется до завершения.

aka:
tags:
- fundamental
- core-object
- workload
---
 Конечная или пакетная задача, которая выполняется до завершения.

<!--more-->

Создаёт один или несколько объектов {{< glossary_tooltip term_id="pod" >}} и гарантирует,
что заданное их количество успешно завершит работу. По мере того как поды успешно
завершаются, Job подсчитывает их.
