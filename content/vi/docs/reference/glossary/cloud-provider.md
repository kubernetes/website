---
title: Cloud Provider
id: cloud-provider
date: 2018-04-12
short_description: >
  Một tổ chức cung cấp nền tảng điện toán đám mây.

aka:
  - Cloud Service Provider
tags:
  - community
---

Một doanh nghiệp hoặc tổ chức cung cấp nền tảng điện toán đám mây .

<!--more-->

Cloud provider, đôi khi còn gọi là Cloud Service Provider (CSP), cung cấp các nền tảng hoặc dịch vụ điện toán đám mây.

Nhiều cloud provider cung cấp hạ tầng được quản lý (còn gọi là Infrastructure as a Service hoặc IaaS).
Với hạ tầng được quản lý, cloud provider chịu trách nhiệm về server, storage và networking, trong khi bạn quản lý các lớp phía trên như vận hành một Kubernetes cluster.

Bạn cũng có thể sử dụng Kubernetes như một dịch vụ được quản lý; đôi khi gọi là Platform as a Service, hoặc PaaS. Với Kubernetes được quản lý, cloud provider chịu trách nhiệm cho control plane của Kubernetes cũng như các {{< glossary_tooltip term_id="node" text="node" >}} và hạ tầng mà chúng phụ thuộc vào: networking, storage, và có thể bao gồm các thành phần khác như cân bằng tải.
