---
title: Node
id: node
date: 2019-29-11
full_link: /docs/concepts/architecture/nodes/
short_description: >
  Một node là một máy worker trong Kubernetes

aka:
tags:
  - fundamental
---

Một node là một máy worker trong Kubernetes

<!--more-->

Một worker node có thể là một máy tính ảo hay máy tính vậy lý, tùy thuộc vào cluster. Nó bao gồm một số daemons hoặc services cần thiết để chạy các {{< glossary_tooltip text="Pods" term_id="pod" >}} và được quản lý bởi control plane. Daemons trên một node bao gồm {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, và một container runtime triển khai theo {{< glossary_tooltip text="CRI" term_id="cri" >}} như {{< glossary_tooltip term_id="docker" >}}.
