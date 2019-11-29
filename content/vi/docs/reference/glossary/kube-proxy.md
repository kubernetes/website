---
title: kube-proxy
id: kube-proxy
date: 2019-29-11
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` là một tầng proxy mạng chạy trên mỗi node trong cluster.

aka:
tags:
  - fundamental
  - networking
---

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) là một tầng proxy mạng chạy trên mỗi node trong cluster, triển khai khái niệm về Kubernetes {{< glossary_tooltip term_id="service">}}.

<!--more-->

kube-proxy duy trình network rules trên các node. Những network rules này cho phép việc giao tiếp trên network giữa các pods với trong và ngoài cluster.

Kube-proxy sử dụng lớp packet filtering của hệ điều hành nếu có sẵn để sử dụng.Nếu không thì kube-proxy sẽ tự điều hướng network traffic.
