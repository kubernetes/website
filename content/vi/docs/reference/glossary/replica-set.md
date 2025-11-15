---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
 ReplicaSet đảm bảo số lượng các bản sao của một pod đang hoạt động cùng lúc.

aka: 
tags:
- fundamental
- core-object
- workload
---
 Một ReplicaSet (có mục đích) duy trì số lượng bản sao nhất định 
 của một Pod đang hoạt động trong một thời điểm.

<!--more-->

Các đối tượng như {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 
dựa vào ReplicaSet để đảm bảo duy trì đúng số lượng {{< glossary_tooltip term_id="pod" text="Pod" >}} 
đang hoạt động theo đúng cấu hình đã định nghĩa trong ReplicaSet.
