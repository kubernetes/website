---
title: Master
id: master
date: 2020-04-16
short_description: >
  Thuật ngữ cũ, dùng để chỉ các nodes triển khai control plane.

aka:
tags:
- fundamental
---
 Thuật ngữ cũ, dùng để chỉ các {{< glossary_tooltip text="nodes" term_id="node" >}} 
 triển khai {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

<!--more-->
Thuật ngữ này hiện vẫn còn đang được sử dụng bởi một số công cụ triển khai 
như {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}, 
và các dịch vụ quản trị nhằm {{< glossary_tooltip text="gán nhãn" term_id="label" >}} 
`kubernetes.io/role` cho các {{< glossary_tooltip text="nodes" term_id="node" >}} và kiểm soát 
nơi triển khai các {{< glossary_tooltip text="pods" term_id="pod" >}} của {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
