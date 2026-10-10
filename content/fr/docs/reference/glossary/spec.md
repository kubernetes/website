---
title: Spec
id: spec
full_link: /docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  Champ dans les manifestes Kubernetes qui définit l’état souhaité ou la configuration.

aka:
tags:
- fundamental
- architecture
---

Définit la manière dont chaque objet, comme les Pods ou les Services, doit être configuré ainsi que son état souhaité.

<!--more-->

Presque tous les objets Kubernetes incluent deux champs imbriqués qui régissent leur configuration : le spec de l’objet et le status de l’objet. Pour les objets qui possèdent un spec, celui-ci doit être défini lors de la création de l’objet, en fournissant une description des caractéristiques que la {{< glossary_tooltip text="ressource" term_id="api-resource" >}} doit avoir : son état souhaité.

Ce champ varie selon les objets tels que les Pods, StatefulSets et Services, en détaillant des paramètres comme les conteneurs, les volumes, les réplicas, les ports et d’autres spécifications propres à chaque type d’objet. Il représente l’état que Kubernetes doit maintenir pour l’objet défini.