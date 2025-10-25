---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  Namespace là một lớp trừu tượng trong Kubernetes dùng để cô lập các nhóm tài nguyên trong một cụm.


aka: 
tags:
- fundamental
---
Namespace là một lớp trừu tượng trong Kubernetes dùng để cô lập các nhóm 
{{< glossary_tooltip text="tài nguyên" term_id="api-resource" >}} trong một 
{{< glossary_tooltip text="cụm" term_id="cluster" >}}.

<!--more--> 

Namespace được sử dụng để tổ chức, sắp xếp các đối tượng trong cụm
và cho phép chia nhỏ tài nguyên của cụm.
Tên của các tài nguyên cần phải là duy nhất trong một namespace, 
nhưng không cần duy nhất giữa các namespace khác nhau.
Cơ chế giới hạn phạm vi theo namespace chỉ áp dụng cho các tài nguyên thuộc namespace _(ví dụ: Pods, Deployments, Services)_ và không áp dụng cho các tài nguyên sử dụng trên toàn cụm _(ví dụ: StorageClasses, Nodes, PersistentVolumes)_.
