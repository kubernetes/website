---
title: Security Context
id: security-context
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  Trường securityContext định nghĩa các đặc quyền và kiểm soát truy cập cho Pod hoặc container.

aka:
tags:
- security
---
Trường `securityContext` định nghĩa các đặc quyền và kiểm soát truy cập cho
{{< glossary_tooltip text="Pod" term_id="pod" >}} hoặc
{{< glossary_tooltip text="container" term_id="container" >}}.

<!--more-->

Trong `securityContext`, bạn có thể định nghĩa: tiến trình được chạy với tư cách người dùng nào , tiến trình được chạy với tư cách nhóm nào và các thiết lập quyền. Bạn cũng có thể cấu hình các chính sách bảo mật (ví dụ: SELinux, AppArmor hoặc seccomp).
Thiết lập `PodSpec.securityContext` áp dụng cho tất cả container trong một Pod.
