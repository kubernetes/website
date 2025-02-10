---
titre: Node
id: node
date: 2024-09-12
full_link: /fr/docs/concepts/architecture/nodes/
short_description: >
  Un nœud est une machine de travail dans Kubernetes.

alias:
tags:
- fundamental
---
 Un nœud est une machine de travail dans Kubernetes.

<!--more-->

Un nœud de travail peut être une machine virtuelle ou physique, selon le cluster. Il dispose de démons ou de services locaux nécessaires pour exécuter les {{< glossary_tooltip text="Pods" term_id="pod" >}} et est géré par le plan de contrôle. Les démons sur un nœud comprennent {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, et un moteur d'exécution de conteneur implémentant le {{< glossary_tooltip text="CRI" term_id="cri" >}} tel que {{< glossary_tooltip term_id="docker" >}}.

Dans les premières versions de Kubernetes, les nœuds étaient appelés "Minions".

