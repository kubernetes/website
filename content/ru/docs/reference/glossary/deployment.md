---
title: Деплоймент (Deployment)
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  Управляет реплицированным приложением в кластере.

aka:
tags:
- fundamental
- core-object
- workload
---
 Объект API, который управляет реплицированным (т.е. имеющим копии) приложением, обычно путём запуска подов без локального хранения данных (т.е. stateless).

<!--more-->

Каждая реплика представлена {{< glossary_tooltip text="подом" term_id="pod" >}},
а все поды распределяются по {{< glossary_tooltip text="узлам" term_id="node" >}} кластера.
Для рабочих нагрузок, требующих локальное хранение данных,  стоит обратить внимание на {{< glossary_tooltip term_id="StatefulSet" >}}.
