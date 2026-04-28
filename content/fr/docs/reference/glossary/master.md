---
title: Master
id: master
short_description: >
  Terme historique, utilisé comme synonyme des nœuds hébergeant le plan de contrôle.
aka:
tags:
- fondamental
---
Terme historique, utilisé comme synonyme de {{< glossary_tooltip text="nœuds" term_id="node" >}}
hébergeant le {{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}}.

<!--more-->
Le terme est encore utilisé par certains outils de provisionnement, comme {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}},
et par certains services managés, pour {{< glossary_tooltip text="label" term_id="label" >}}
les {{< glossary_tooltip text="nœuds" term_id="node" >}} avec `kubernetes.io/role` et contrôler
le placement des {{< glossary_tooltip text="Pods du plan de contrôle" term_id="control-plane" >}}.
