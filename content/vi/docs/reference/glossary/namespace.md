---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  Một khái niệm được sử dụng bởi Kubernetes để hỗ trợ nhiều cluster ảo trên cùng một cluster vật lý.

aka: 
tags:
- fundamental
---
 Một khái niệm được sử dụng bởi Kubernetes để hỗ trợ nhiều cluster ảo trên cùng một cluster vật lý {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more--> 

Namespace được sử dụng để tổ chức các đối tượng trong một cluster và cung cấp một cách để chia tài nguyên cluster. Tên của các tài nguyên phải là duy nhất trong một namespace, nhưng không nhất thiết giữa các namespace.

