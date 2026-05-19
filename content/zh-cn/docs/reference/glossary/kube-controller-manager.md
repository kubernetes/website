---
title: kube-controller-manager
id: kube-controller-manager
full_link: /zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  运行控制器进程的控制平面组件。

aka: 
tags:
- architecture
- fundamental
---
<!--
title: kube-controller-manager
id: kube-controller-manager
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  Control Plane component that runs controller processes.

aka: 
tags:
- architecture
- fundamental
-->

<!--
Control plane component that runs {{< glossary_tooltip text="controller" term_id="controller" >}} processes.
-->
kube-controller-manager 是运行{{< glossary_tooltip text="控制器" term_id="controller" >}}进程的控制平面组件。

<!--more-->

<!--
Logically, each {{< glossary_tooltip text="controller" term_id="controller" >}} is a separate process, but to reduce complexity, they are all compiled into a single binary and run in a single process.
-->
从逻辑上讲，每个{{< glossary_tooltip text="控制器" term_id="controller" >}}都是一个单独的进程，
但是为了降低复杂性，它们都被编译到同一个可执行文件，并在同一个进程中运行。
