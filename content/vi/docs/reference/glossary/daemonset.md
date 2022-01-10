---
title: DaemonSet
id: daemonset
date: 2020-03-05
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  Đảm bảo một bản sao của Pod đang chạy trên một tập các node của cluster.
aka: 
tags:
- fundamental
- core-object
- workload
---
 Đảm bảo một bản sao của {{< glossary_tooltip text="Pod" term_id="pod" >}} đang chạy trên một tập các node của {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more--> 

Được sử dụng để deploy những system daemon ví dụ như log collector, monitoring agent, những cái thường phải chạy trên mọi {{< glossary_tooltip term_id="node" >}}.

