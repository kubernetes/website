---
title: Pod Security Policy
id: pod-security-policy
date: 2018-04-12
full-link: /docs/concepts/security/pod-security-policy/
short_description: >
  API đã bị loại bỏ, trước đây dùng để thực thi các quy tắc bảo mật cho Pod.

aka: 
tags:
- security
---
Là API cũ của Kubernetes, được dùng để thực thi các quy tắc bảo mật trong quá trình tạo và cập nhật {{< glossary_tooltip term_id="pod" >}}.

<!--more--> 

PodSecurityPolicy đã bị ngừng sử dụng kể từ Kubernetes v1.21 và bị loại bỏ trong v1.25.
Giải pháp thay thế là sử dụng [Pod Security Admission](/docs/concepts/security/pod-security-admission/) hoặc plugin kiểm duyệt (admission plugin) của bên thứ ba.
