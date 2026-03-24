---
title: ResourceQuota
id: resource-quota
full_link: /docs/concepts/policy/resource-quotas/
short_description: >
  Fournit des contraintes qui limitent la consommation agrégée de ressources par namespace.

aka: 
tags:
- fundamental
- operation
- architecture
---

Objet qui contraint la consommation agrégée de ressources par {{< glossary_tooltip term_id="namespace" >}}.

<!--more-->

Un ResourceQuota peut soit limiter la quantité de {{< glossary_tooltip text="ressources API" term_id="api-resource" >}}
qui peuvent être créées dans un namespace par type, soit définir une limite sur la quantité totale de
{{< glossary_tooltip text="ressources d’infrastructure" term_id="infrastructure-resource" >}}
pouvant être consommées au nom du namespace (et des objets qu’il contient).