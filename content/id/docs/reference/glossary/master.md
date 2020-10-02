---
title: Master
id: master
date: 2020-04-16
short_description: >
  Istilah lama, digunakan sebagai sinonim untuk Node yang menjalankan _control plane_.

aka:
tags:
- fundamental
---
Istilah lama, digunakan sebagai sinonim untuk {{< glossary_tooltip term_id="node" >}} yang menjalankan {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

<!--more-->

Istilah ini masih digunakan oleh beberapa utilitas penyediaan (_provisioning_), seperti {{< glossary_tooltip  term_id="kubeadm" >}}, dan Service terkelola (_managed_), untuk {{< glossary_tooltip text="melabeli" term_id="label" >}} {{< glossary_tooltip term_id="node" >}} dengan `kubernetes.io/role` dan mengatur penempatan dari {{< glossary_tooltip term_id="pod" >}} {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
