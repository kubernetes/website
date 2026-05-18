---
title: Політики планування
content_type: concept
sitemap:
  priority: 0.2 # Пріоритети планування застарілі
weight: 30
---

<!-- overview -->

У версіях Kubernetes до v1.23 політика планування могла використовуватися для вказівки процесу *predicates* та *priorities*. Наприклад, ви могли встановити політику планування, запустивши `kube-scheduler --policy-config-file <filename>` або `kube-scheduler --policy-configmap <ConfigMap>`.

Ця політика планування не підтримується з Kubernetes v1.23. Споріднені прапорці `policy-config-file`, `policy-configmap`, `policy-configmap-namespace` та `use-legacy-policy-config` також не підтримуються. Натомість використовуйте [Конфігурацію планувальника](/docs/reference/scheduling/config/), щоб досягти схожої поведінки.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [планування](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Ознайомтеся з [Конфігурацією kube-scheduler](/docs/reference/scheduling/config/)
* Прочитайте довідку з конфігурації [kube-scheduler (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
