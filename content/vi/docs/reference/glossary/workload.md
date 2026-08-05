---
title: Workload
id: workload
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   Workload là một ứng dụng chạy trên Kubernetes.

aka: 
tags:
- fundamental
---
   Workload là một ứng dụng chạy trên Kubernetes.

<!--more--> 

Các đối tượng cốt lõi khác nhau đại diện cho các loại hoặc thành phần của workload
bao gồm các đối tượng DaemonSet, Deployment, Job, ReplicaSet và StatefulSet.

Ví dụ, một workload có máy chủ web và cơ sở dữ liệu có thể chạy
cơ sở dữ liệu trong một {{< glossary_tooltip term_id="StatefulSet" >}} và máy chủ web
trong một {{< glossary_tooltip term_id="Deployment" >}}.
