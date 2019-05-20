---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  用于获取和设置Unix内核参数的接口

aka:
tags:
- 工具
---

<!--
---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  An interface for getting and setting Unix kernel parameters

aka:
tags:
- tool
---
-->

<!--
 `sysctl` is a semi-standardized interface for reading or changing the
 attributes of the running Unix kernel.
-->
 
 `sysctl`是一个半标准化的接口，用于读取或更改正在运行的Unix内核的属性。
 
<!--more--> 

<!--
On Unix-like systems, `sysctl` is both the name of the tool that administrators
use to view and modify these settings, and also the system call that the tool
uses.
-->

在类Unix系统上，`sysctl`是管理员的工具,用于查看和修改这些设置，以及系统调用该工具使用。

<!--
{{< glossary_tooltip text="Container" term_id="container" >}} runtimes and
network plugins may rely on `sysctl` values being set a certain way.
-->

{{< glossary_tooltip text="Container" term_id="container" >}} 容器运行时和网络插件可能依赖于 `sysctl` 设置的某种值。