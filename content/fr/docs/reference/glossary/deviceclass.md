---
title: DeviceClass
id: deviceclass
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  Une catégorie de devices dans le cluster. Les utilisateurs peuvent réclamer des devices spécifiques dans une DeviceClass.
tags:
- extension
---
Une catégorie de {{< glossary_tooltip text="devices" term_id="device" >}} dans le cluster
qui peut être utilisée avec l’allocation dynamique de ressources (DRA).

<!--more-->

Les administrateurs ou propriétaires de devices utilisent les DeviceClasses pour définir un ensemble de devices
qui peuvent être réclamés et utilisés dans des workloads. Les devices sont réclamés en créant des
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} filtrant les paramètres spécifiques
d’un device dans une DeviceClass.

Pour plus d’informations, voir
[Allocation dynamique de ressources](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass).
