---
title: 容器生命周期钩子（Container Lifecycle Hooks）
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /zh/docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  生命周期钩子暴露容器管理生命周期中的事件，允许用户在事件发生时运行代码。

aka: 
tags:
- extension
---
<!--
---
title: Container Lifecycle Hooks
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  The lifecycle hooks expose events in the container management lifecycle and let the user run code when the events occur.

aka:
tags:
- extension
---
-->

  生命周期钩子暴露{{< glossary_tooltip text="容器" term_id="container" >}}管理生命周期中的事件，允许用户在事件发生时运行代码。
  <!--
  The lifecycle hooks expose events in the {{< glossary_tooltip text="Container" term_id="container" >}}container management lifecycle and let the user run code when the events occur.
  -->

<!--more--> 

针对容器暴露了两个钩子：PostStart 在容器创建之后立即执行，PreStop 在容器停止之前立即阻塞并被调用。
<!--
Two hooks are exposed to Containers: PostStart which executes immediately after a container is created and PreStop which is blocking and is called immediately before a container is terminated.
-->
