---
title: Admission Controller
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  Một đoạn code chặn các yêu cầu đến Kubernetes API server trước khi lưu trữ đối tượng.

aka:
tags:
- extension
- security
---
Một đoạn code chặn các yêu cầu đến Kubernetes API server trước khi lưu trữ đối tượng.

<!--more-->

Admission controller có thể được cấu hình cho Kubernetes API server và có thể là "validating" (xác thực), "mutating" (thay đổi), hoặc cả hai. Bất kỳ admission controller nào cũng có thể từ chối yêu cầu. Mutating controller có thể sửa đổi các đối tượng mà chúng chấp nhận; validating controller thì không.

* [Admission controller trong tài liệu Kubernetes](/docs/reference/access-authn-authz/admission-controllers/)
