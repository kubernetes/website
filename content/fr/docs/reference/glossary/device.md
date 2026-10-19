---
title: Device
id: device
short_description: >
  Toute ressource attachée directement ou indirectement aux nœuds de votre cluster, comme les GPU ou les cartes électroniques.

tags:
- extension
- fondamental
---
Une ou plusieurs
{{< glossary_tooltip text="ressources d’infrastructure" term_id="infrastructure-resource" >}}
directement ou indirectement attachées à vos
{{< glossary_tooltip text="nœuds" term_id="node" >}}.

<!--more-->

Les devices peuvent être des produits commerciaux comme les GPU, ou du matériel personnalisé comme des
[cartes ASIC](https://fr.wikipedia.org/wiki/Circuit_intégré_spécifique_à_une_application).
Les devices attachés nécessitent généralement des pilotes permettant aux Kubernetes {{< glossary_tooltip text="Pods" term_id="pod" >}} d’y accéder.
