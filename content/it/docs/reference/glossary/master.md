---
title: Master
id: master
date: 2020-04-16
short_description: >
  Termine vecchio, usato come sinonimo per i nodi che ospitano la control plane.

aka:
tags:
- fundamental
---
 Termine vecchio, usato come sinonimo per i {{< glossary_tooltip text="nodi" term_id="node" >}} che ospitano la {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

<!--more-->
Il termine è ancora usato da alcuni strumenti di provisioning, come {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}, e servizi gestiti, per mettere la {{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/role` ai {{< glossary_tooltip text="nodi" term_id="node" >}} per controllare il posizionamento dei {{< glossary_tooltip text="pods" term_id="pod" >}} della {{< glossary_tooltip text="control plane" term_id="control-plane" >}} .