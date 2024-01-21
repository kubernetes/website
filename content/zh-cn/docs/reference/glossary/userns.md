---
title: 用户名字空间
id: userns
date: 2021-07-13
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  一种为非特权用户模拟超级用户特权的 Linux 内核功能特性。

aka:
tags:
- security
---

<!--
title: user namespace
id: userns
date: 2021-07-13
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  A Linux kernel feature to emulate superuser privilege for unprivileged users.

aka:
tags:
- security
-->

<!--
A kernel feature to emulate root. Used for "rootless containers".
-->
用来模拟 root 用户的内核功能特性。用来支持“Rootless 容器”。

<!--more-->

<!--
User namespaces are a Linux kernel feature that allows a non-root user to
emulate superuser ("root") privileges,
for example in order to run containers without being a superuser outside the container.
-->
用户名字空间（User Namespace）是一种 Linux 内核功能特性，允许非 root 用户
模拟超级用户（"root"）的特权，例如用来运行容器却不必成为容器之外的超级用户。

<!--
User namespace is effective for mitigating damage of potential container break-out attacks.
-->
用户名字空间对于缓解因潜在的容器逃逸攻击而言是有效的。

<!--
In the context of user namespaces, the namespace is a Linux kernel feature, and not a
{{< glossary_tooltip text="namespace" term_id="namespace" >}} in the Kubernetes sense
of the term.
-->
在用户名字空间语境中，名字空间是 Linux 内核的功能特性而不是 Kubernetes 意义上的
{{< glossary_tooltip text="名字空间" term_id="namespace" >}}概念。

<!-- TODO: https://kinvolk.io/blog/2020/12/improving-kubernetes-and-container-security-with-user-namespaces/ -->

