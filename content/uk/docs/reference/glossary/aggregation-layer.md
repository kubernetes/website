---
title: Шар агрегації
id: aggregation-layer
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  Шар агрегації дозволяє встановлювати у вашому кластері додаткові API в стилі Kubernetes.

aka:
- Aggregation Layer
tags:
- architecture
- extension
- operation
---

Шар агрегації дозволяє встановлювати у вашому кластері додаткові API в стилі Kubernetes.

<!--more-->

Коли ви налаштували {{< glossary_tooltip text="API-сервер Kubernetes" term_id="kube-apiserver" >}} для [підтримки додаткових API](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), ви можете додавати обʼєкти `APIService`, щоб «зайняти» шлях URL в API Kubernetes.
