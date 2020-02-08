---
title: rkt
id: rkt
date: 2019-01-24
translater: Coffey Gao
full_link: https://coreos.com/rkt/
short_description: >
  一个安全的、基于标准的容器引擎。

aka: 
tags:
- security
- tool
---

<!--
---
title: rkt
id: rkt
date: 2019-01-24
full_link: https://coreos.com/rkt/
short_description: >
  A security-minded, standards-based container engine.

aka: 
tags:
- security
- tool
---
-->

<!--
 A security-minded, standards-based container engine.
-->
 
 一个安全的、基于标准的容器引擎。

<!--more--> 

<!--
rkt is an application {{< glossary_tooltip text="container" term_id="container" >}} engine featuring a {{< glossary_tooltip text="Pod" term_id="pod" >}}-native approach, a pluggable execution environment, and a well-defined surface area. rkt allows users to apply different configurations at both the Pod and application level. Each Pod executes directly in the classic Unix process model, in a self-contained, isolated environment.
-->

rkt 是一个应用程序 {{< glossary_tooltip text="容器" term_id="container" >}} 引擎，它具有原生的 {< glossary_tooltip text="Pod" term_id="pod" >}} 方法、可插拔的执行环境和定义良好的接口。rkt 允许用户在 Pod 和应用程序级别应用不同的配置。每个 Pod 在一个自包含的、独立的经典 Unix 进程模型中直接执行。