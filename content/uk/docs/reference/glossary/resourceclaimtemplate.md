---
title: ResourceClaimTemplate
id: resourceclaimtemplate
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Визначає шаблон для Kubernetes для створення ResourceClaims. Використовується для забезпечення доступу до окремих схожих ресурсів на кожному Pod\і.

tags:
- workload
---

Визначає шаблон для Kubernetes для створення {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}.  ResourceClaimTemplates використовуються в [динамічному виділенні ресурсів (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) для надання _персоналізованого доступу до окремих, схожих ресурсів_.

<!--more-->

Коли шаблон ResourceClaimTemplate згадується в специфікації робочого навантаження, Kubernetes автоматично створює обʼєкти ResourceClaim на основі шаблону. Кожен ResourceClaim привʼязується до конкретного Podʼа. Коли Pod завершує свою роботу, Kubernetes видаляє відповідний ResourceClaim.
