---
title: ResourceClaimTemplate
id: resourceclaimtemplate
full_link: /docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceclaims-templates
short_description: >
  Визначає шаблон, за яким Kubernetes створює ResourceClaims. Використовується для надання доступу до окремих подібних ресурсів на рівні кожного Podʼа або PodGroup.

tags:
- workload
---

Визначає шаблон, за яким Kubernetes створює {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. ResourceClaimTemplates використовуються в [динамічному виділенні ресурсів (DRA)](/docs/concepts/resource-management/dynamic-resource-allocation/) для надання _доступу до окремих подібних ресурсів на рівні кожного Podʼа або {{< glossary_tooltip text="PodGroup" term_id="podgroup" >}}_.

<!--more-->

Коли в специфікації робочого навантаження є посилання на ResourceClaimTemplate, Kubernetes автоматично створює обʼєкти ResourceClaim на основі шаблону. Кожен ResourceClaim привʼязується до конкретного Podʼа або PodGroup. Коли Pod завершує свою роботу або PodGroup видаляється, Kubernetes видаляє відповідний ResourceClaim. Для використання ResourceClaimTemplates з PodGroup необхідно ввімкнути функціональну можливість [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims).
