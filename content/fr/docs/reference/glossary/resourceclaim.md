---
title: ResourceClaim
id: resourceclaim
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Décrit les ressources dont un workload a besoin, comme des périphériques. Les ResourceClaims peuvent demander des périphériques à partir de DeviceClasses.

tags:
- workload
---

Décrit les ressources nécessaires à un {{< glossary_tooltip text="workload" term_id="workload" >}}, comme des
{{< glossary_tooltip text="devices" term_id="device" >}}. Les ResourceClaims sont
utilisés dans la [allocation dynamique de ressources (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
pour fournir aux Pods l’accès à une ressource spécifique.

<!--more-->

Les ResourceClaims peuvent être créés par les opérateurs de workload ou générés par Kubernetes
à partir d’un {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}.
