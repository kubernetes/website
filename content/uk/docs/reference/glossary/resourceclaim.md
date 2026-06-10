---
title: ResourceClaim
id: resourceclaim
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Описує ресурси, які потрібні робочому навантаженню, наприклад, пристрої. ResourceClaims можуть запитувати пристрої з DeviceClasses.

tags:
- workload
---

Описує ресурси, які потрібні робочому навантаженню, наприклад, пристрої. ResourceClaims можуть запитувати пристрої з {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}. ResourceClaims використовуються в [динамічному виділенні ресурсів (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) для надання Podʼам доступу до конкретного ресурсу.

<!--more-->

ResourceClaims можуть бути створені операторами робочих навантажень або згенеровані Kubernetes на основі {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}.
