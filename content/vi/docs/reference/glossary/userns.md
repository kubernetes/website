---
title: user namespace
id: userns
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  Một tính năng của Linux kernel để mô phỏng quyền superuser cho người dùng không có đặc quyền.

aka:
tags:
- security
---
Một tính năng của kernel để mô phỏng root. Được sử dụng cho "rootless containers".

<!--more-->

User namespaces là một tính năng của Linux kernel cho phép người dùng không phải root mô phỏng quyền superuser ("root"), ví dụ để chạy containers mà không cần là superuser bên ngoài container.

User namespace hiệu quả trong việc giảm thiểu thiệt hại của các cuộc tấn công container break-out tiềm năng.

Trong ngữ cảnh của user namespaces, namespace là một tính năng của Linux kernel, và không phải là một {{< glossary_tooltip text="namespace" term_id="namespace" >}} theo nghĩa của Kubernetes.
