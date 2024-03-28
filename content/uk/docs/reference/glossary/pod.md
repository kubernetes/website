---
title: Pod
id: pod
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/
short_description: >
  Pod являє собою групу контейнерів, що запущені у вашому кластері.

aka: 
tags:
- core-object
- fundamental
---
Найменший та найпростіший обʼєкт Kubernetes. Pod являє собою групу {{< glossary_tooltip text="контейнерів" term_id="container" >}}, що запущені у вашому кластері.

<!--more-->

Pod зазвичай налаштовується для запуску одного основного контейнера. Він також може запускати додаткові sidecar контейнери, які додають додаткові функції, наприклад журналювання. Podʼами зазвичай керує {{< glossary_tooltip term_id="deployment" >}}.
