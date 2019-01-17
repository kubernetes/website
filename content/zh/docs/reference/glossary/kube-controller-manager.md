---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  主控制器上运行的控制器组件。

aka: 
tags:
- architecture
- fundamental
---

<!--
---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  Component on the master that runs controllers.

aka: 
tags:
- architecture
- fundamental
---
-->

<!--
 Component on the master that runs {{< glossary_tooltip text="controllers" term_id="controller" >}}.
-->
在主服务器上运行的组件 {{< glossary_tooltip text="controllers" term_id="controller" >}}。

<!--more--> 

从逻辑上讲，每个 {{< glossary_tooltip text="controller" term_id="controller" >}} 都是一个单独的进程，但是为了降低复杂性，它们都被编译成一个二进制文件，并在一个进程中运行。

