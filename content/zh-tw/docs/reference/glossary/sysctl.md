---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /zh-cn/docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  用於獲取和設定 Unix 核心引數的介面

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

  `sysctl` 是一個半標準化的介面，用於讀取或更改正在執行的 Unix 核心的屬性。

<!--more-->

<!--
On Unix-like systems, `sysctl` is both the name of the tool that administrators
use to view and modify these settings, and also the system call that the tool
uses.
-->

在類 Unix 系統上， `sysctl` 既是管理員用於檢視和修改這些設定的工具的名稱，也是該工具所呼叫的系統呼叫的名稱。

<!--
{{< glossary_tooltip text="Container" term_id="container" >}} runtimes and
network plugins may rely on `sysctl` values being set a certain way.
-->

{{< glossary_tooltip text="容器" term_id="container" >}}執行時和網路外掛可能對 `sysctl` 的取值有一定的要求。
