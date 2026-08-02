---
title: ResourceSlice
id: resourceslice
full_link: /docs/reference/kubernetes-api/workload-resources/resource-slice-v1beta1/
short_description: >
  Представляє один або кілька ресурсів інфраструктури, наприклад, пристроїв, у пулі подібних ресурсів.

tags:
- workload
---

Представляє один або кілька ресурсів інфраструктури, таких як
{{< glossary_tooltip text="пристрої" term_id="device" >}}, які підключені до вузлів. Драйвери створюють і керують ResourceSlices у кластері. ResourceSlices використовуються для [динамічного виділення ресурсів (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!--more-->

Коли створюється {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}, Kubernetes використовує ResourceSlices для пошуку вузлів, які мають доступ до ресурсів, що можуть задовольнити запит. Kubernetes виділяє ресурси для ResourceClaim і планує Pod на вузол, який може отримати доступ до ресурсів.
