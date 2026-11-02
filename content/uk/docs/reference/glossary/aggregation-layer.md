---
title: Шар агрегації
id: aggregation-layer
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  Шар агрегації дозволяє встановлювати додаткові API в стилі Kubernetes у вашому кластері.

aka:
- Aggregation Layer
tags:
- architecture
- extension
- operation
---

Шар агрегації дозволяє встановлювати додаткові API в стилі Kubernetes у вашому кластері.

<!--more-->

Коли ви налаштували {{< glossary_tooltip text="API сервер Kubernetes" term_id="kube-apiserver" >}} для [підтримки додаткових API](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), ви можете додавати обʼєкти `APIService` які "затребують" URL-адреси в API Kubernetes.
