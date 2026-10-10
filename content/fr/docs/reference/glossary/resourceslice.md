---
title: ResourceSlice
id: resourceslice
full_link: /docs/reference/kubernetes-api/workload-resources/resource-slice-v1beta1/
short_description: >
  Représente une ou plusieurs ressources d'infrastructure, comme des dispositifs, dans un pool de ressources similaires.

tags:
- workload
---
Représente une ou plusieurs ressources d'infrastructure, telles que
{{< glossary_tooltip text="devices" term_id="device" >}}, attachées aux nœuds.  
Les pilotes créent et gèrent les ResourceSlices dans le cluster. Les ResourceSlices
sont utilisés pour
[l'allocation dynamique de ressources (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!--more-->

Lorsqu'un {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} est
créé, Kubernetes utilise les ResourceSlices pour trouver les nœuds ayant accès aux
ressources capables de satisfaire la demande. Kubernetes alloue les ressources au
ResourceClaim et planifie le Pod sur un nœud pouvant accéder aux ressources.
