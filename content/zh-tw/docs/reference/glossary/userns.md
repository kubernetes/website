---
title: 使用者名字空間
id: userns
date: 2021-07-13
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  一種爲非特權使用者模擬超級使用者特權的 Linux 內核功能特性。

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
用來模擬 root 使用者的內核功能特性。用來支持“Rootless 容器”。

<!--more-->

<!--
User namespaces are a Linux kernel feature that allows a non-root user to
emulate superuser ("root") privileges,
for example in order to run containers without being a superuser outside the container.
-->
使用者名字空間（User Namespace）是一種 Linux 內核功能特性，允許非 root 使用者
模擬超級使用者（"root"）的特權，例如用來運行容器卻不必成爲容器之外的超級使用者。

<!--
User namespace is effective for mitigating damage of potential container break-out attacks.
-->
使用者名字空間對於緩解因潛在的容器逃逸攻擊而言是有效的。

<!--
In the context of user namespaces, the namespace is a Linux kernel feature, and not a
{{< glossary_tooltip text="namespace" term_id="namespace" >}} in the Kubernetes sense
of the term.
-->
在使用者名字空間語境中，名字空間是 Linux 內核的功能特性而不是 Kubernetes 意義上的
{{< glossary_tooltip text="名字空間" term_id="namespace" >}}概念。

<!-- TODO: https://kinvolk.io/blog/2020/12/improving-kubernetes-and-container-security-with-user-namespaces/ -->

