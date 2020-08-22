---
title: 安全上下文（Security Context）
id: security-context
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  securityContext 字段定义 Pod 或容器的特权和访问控制设置，包括运行时 UID 和 GID。

aka: 
tags:
- security
---

<!--
---
title: Security Context
id: security-context
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  The securityContext field defines privilege and access control settings for a Pod or Container, including the runtime UID and GID.

aka: 
tags:
- security
---
-->

<!--
 The securityContext field defines privilege and access control settings for a Pod or Container, including the runtime UID and GID.
-->
securityContext 字段定义 Pod 或容器的特权和访问控制设置，包括运行时 UID 和 GID。

<!--more--> 

<!--
The securityContext field in a {{< glossary_tooltip term_id="pod" >}} (applying to all containers) or container is used to set the user (runAsUser) and group (fsGroup), capabilities, privilege settings, and security policies (SELinux/AppArmor/Seccomp) that container processes use.
-->
{{< glossary_tooltip term_id="pod" >}} 或者容器中的 securityContext 字段（应用于所有容器）用于设置容器进程使用的用户（runAsUser）和组 （fsGroup）、权能字、特权设置和安全策略（SELinux/AppArmor/Seccomp）。




