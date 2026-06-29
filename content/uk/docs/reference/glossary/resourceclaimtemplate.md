---
title: ResourceClaimTemplate
id: resourceclaimtemplate
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Визначає шаблон для Kubernetes для створення ResourceClaims. Використовується для забезпечення доступу до окремих схожих ресурсів на кожному Podʼі або PodGroup.

tags:
- workload
---

Визначає шаблон для Kubernetes для створення {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. ResourceClaimTemplates використовуються в [динамічному виділенні ресурсів (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) для надання _доступу до окремих, подібних ресурсів на рівні Pod або {{< glossary_tooltip text="PodGroup" term_id="podgroup" >}}_.

<!--more-->

Коли шаблон ResourceClaimTemplate згадується в специфікації робочого навантаження, Kubernetes автоматично створює обʼєкти ResourceClaim на основі шаблону. Кожен ResourceClaim привʼязується до конкретного Podʼа або PodGroup. Коли Pod завершує свою роботу або PodGroup видаляється, Kubernetes видаляє відповідний ResourceClaim. Для використання ResourceClaimTemplates з PodGroup необхідно ввімкнути функцію [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims).
