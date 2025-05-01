---
title: kube-proxy
id: kube-proxy
date: 2019-11-29
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` là một network proxy chạy trên mỗi node trong cluster.

aka:
tags:
  - fundamental
  - networking
---

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) là một network proxy chạy trên mỗi node trong cluster, thực hiện một phần Kubernetes {{< glossary_tooltip term_id="service">}}.

<!--more-->

kube-proxy duy trình network rules trên các node. Những network rules này cho phép kết nối mạng đến các pods từ trong hoặc ngoài cluster.

Kube-proxy sử dụng lớp packet filtering của hệ điều hành nếu có sẵn. Nếu không thì kube-proxy sẽ tự điều hướng network traffic.
