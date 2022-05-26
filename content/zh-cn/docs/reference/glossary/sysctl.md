---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /zh-cn/docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  用于获取和设置 Unix 内核参数的接口

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

  `sysctl` 是一个半标准化的接口，用于读取或更改正在运行的 Unix 内核的属性。

<!--more-->

<!--
On Unix-like systems, `sysctl` is both the name of the tool that administrators
use to view and modify these settings, and also the system call that the tool
uses.
-->

在类 Unix 系统上， `sysctl` 既是管理员用于查看和修改这些设置的工具的名称，也是该工具所调用的系统调用的名称。

<!--
{{< glossary_tooltip text="Container" term_id="container" >}} runtimes and
network plugins may rely on `sysctl` values being set a certain way.
-->

{{< glossary_tooltip text="容器" term_id="container" >}}运行时和网络插件可能对 `sysctl` 的取值有一定的要求。
