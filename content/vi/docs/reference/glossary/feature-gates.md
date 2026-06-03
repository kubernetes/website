---
title: Feature gate
id: feature-gate
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  Một cách để kiểm soát việc bật hoặc tắt một tính năng cụ thể của Kubernetes.

aka:
tags:
- fundamental
- operation
---

Feature gates là một tập hợp các khóa (giá trị chuỗi mờ đục) mà bạn có thể sử dụng để kiểm soát các tính năng Kubernetes nào được bật trong cluster của bạn.

<!--more-->

Bạn có thể bật hoặc tắt các tính năng này bằng cờ dòng lệnh `--feature-gates` trên mỗi thành phần Kubernetes.
Mỗi thành phần Kubernetes cho phép bạn bật hoặc tắt một tập hợp các feature gates liên quan đến thành phần đó.
Tài liệu Kubernetes liệt kê tất cả các
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) hiện tại và những gì chúng kiểm soát.
