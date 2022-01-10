---
# title: Pod
title: Pod
id: pod
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/pod-overview/
# short_description: >
#   The smallest and simplest Kubernetes object. A Pod represents a set of running containers on your cluster.
short_description: >
  Найменший і найпростіший об'єкт Kubernetes. Pod являє собою групу контейнерів, що запущені у вашому кластері.

aka: 
tags:
- core-object
- fundamental
---
 <!-- The smallest and simplest Kubernetes object. A Pod represents a set of running {{< glossary_tooltip text="containers" term_id="container" >}} on your cluster. -->
 Найменший і найпростіший об'єкт Kubernetes. Pod являє собою групу {{< glossary_tooltip text="контейнерів" term_id="container" >}}, що запущені у вашому кластері.

<!--more-->

<!-- A Pod is typically set up to run a single primary container. It can also run optional sidecar containers that add supplementary features like logging. Pods are commonly managed by a {{< glossary_tooltip term_id="deployment" >}}. -->
Як правило, в одному Pod'і запускається один контейнер. У Pod'і також можуть бути запущені допоміжні контейнери, що забезпечують додаткову функціональність, наприклад, логування. Управління Pod'ами зазвичай здійснює {{< glossary_tooltip term_id="deployment" >}}.
