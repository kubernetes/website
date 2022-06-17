---
title: 安全上下文（Security Context）
id: security-context
date: 2018-04-12
full_link: /zh-cn/docs/tasks/configure-pod-container/security-context/
short_description: >
  securityContext 欄位定義 Pod 或容器的特權和訪問控制設定，包括執行時 UID 和 GID。

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
  The securityContext field defines privilege and access control settings for a Pod or container.

aka: 
tags:
- security
---
-->

<!--
 The `securityContext` field defines privilege and access control settings for
a {{< glossary_tooltip text="Pod" term_id="pod" >}} or
{{< glossary_tooltip text="container" term_id="container" >}}.
-->

securityContext 欄位定義 {{< glossary_tooltip text="Pod" term_id="pod" >}} 或
{{< glossary_tooltip text="容器" term_id="container" >}}的特權和訪問控制設定。

<!--more-->

<!--
In a `securityContext`, you can define: the user that processes run as,
the group that processes run as, and privilege settings.
You can also configure security policies (for example: SELinux, AppArmor or seccomp).
-->

在一個 `securityContext` 欄位中，你可以設定程序所屬使用者和使用者組、許可權相關設定。你也可以設定安全策略（例如：SELinux、AppArmor、seccomp）。	

<!--
The `PodSpec.securityContext` setting applies to all containers in a Pod.
-->

`PodSpec.securityContext` 欄位配置會應用到一個 Pod 中的所有的 container 。														 