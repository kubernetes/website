---
title: user namespace
id: userns
date: 2021-07-13
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  A Linux kernel feature to emulate superuser privilege for unprivileged users.

aka:
tags:
- security
---

A kernel feature to emulate root. Used for "rootless containers".

<!--more-->

User namespaces are a Linux kernel feature that allows a non-root user to
emulate superuser ("root") privileges,
for example in order to run containers without being a superuser outside the container.

User namespace is effective for mitigating damage of potential container break-out attacks.

In the context of user namespaces, the namespace is a Linux kernel feature, and not a
{{< glossary_tooltip text="namespace" term_id="namespace" >}} in the Kubernetes sense
of the term.

<!-- TODO: https://kinvolk.io/blog/2020/12/improving-kubernetes-and-container-security-with-user-namespaces/ -->
