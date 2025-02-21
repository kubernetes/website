---
title: Master
id: master
date: 2020-04-16
short_description: >
  Legacy term, used as synonym for nodes running the control plane.

aka:
tags:
- fundamental
---
 Legacy term, used as synonym for {{< glossary_tooltip text="nodes" term_id="node" >}} hosting the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

<!--more-->
The term is still being used by some provisioning tools, such as {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}, and managed services, to {{< glossary_tooltip text="label" term_id="label" >}} {{< glossary_tooltip text="nodes" term_id="node" >}} with `kubernetes.io/role` and control placement of {{< glossary_tooltip text="control plane" term_id="control-plane" >}} {{< glossary_tooltip text="pods" term_id="pod" >}}.