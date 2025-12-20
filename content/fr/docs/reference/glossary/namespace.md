---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  Une abstraction utilisée par Kubernetes pour permettre l’isolation de groupes de ressources au sein d’un même cluster.

aka: 
tags:
- fundamental
---
Une abstraction utilisée par Kubernetes pour permettre l’isolation de groupes de {{< glossary_tooltip text="ressources API" term_id="api-resource" >}}
au sein d’un même {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more-->

Les namespaces sont utilisés pour organiser les objets dans un cluster et permettent de répartir les ressources du cluster. Les noms des ressources doivent être uniques au sein d’un namespace, mais pas entre différents namespaces. La portée par namespace ne s’applique qu’aux ressources **namespacées** _(par exemple : Pods, Deployments, Services)_ et non aux ressources **à l’échelle du cluster** _(par exemple : StorageClasses, Nodes, PersistentVolumes)_.
