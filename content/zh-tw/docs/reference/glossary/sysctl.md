---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /zh-cn/docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  用於獲取和設置 Unix 內核參數的介面

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

  `sysctl` 是一個半標準化的介面，用於讀取或更改正在運行的 Unix 內核的屬性。

<!--more-->

<!--
On Unix-like systems, `sysctl` is both the name of the tool that administrators
use to view and modify these settings, and also the system call that the tool
uses.
-->

在類 Unix 系統上， `sysctl` 既是管理員用於查看和修改這些設置的工具的名稱，也是該工具所調用的系統調用的名稱。

<!--
{{< glossary_tooltip text="Container" term_id="container" >}} runtimes and
network plugins may rely on `sysctl` values being set a certain way.
-->

{{< glossary_tooltip text="容器" term_id="container" >}}運行時和網路插件可能對 `sysctl` 的取值有一定的要求。
