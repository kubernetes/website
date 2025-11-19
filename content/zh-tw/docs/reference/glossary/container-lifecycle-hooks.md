---
title: 容器生命週期鉤子（Container Lifecycle Hooks）
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /zh-cn/docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  生命週期鉤子暴露容器管理生命週期中的事件，允許用戶在事件發生時運行代碼。

aka: 
tags:
- extension
---
<!--
title: Container Lifecycle Hooks
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  The lifecycle hooks expose events in the container management lifecycle and let the user run code when the events occur.

aka:
tags:
- extension
-->

  <!--
  The lifecycle hooks expose events in the {{< glossary_tooltip text="Container" term_id="container" >}} management lifecycle and let the user run code when the events occur.
  -->
  生命週期鉤子（Lifecycle Hooks）暴露{{< glossary_tooltip text="容器" term_id="container" >}}管理生命週期中的事件，
  允許用戶在事件發生時運行代碼。

<!--more--> 

<!--
Two hooks are exposed to Containers: PostStart which executes immediately after a container is created and PreStop which is blocking and is called immediately before a container is terminated.
-->
針對容器暴露了兩個鉤子：
PostStart 在容器創建之後立即執行，
PreStop 在容器停止之前立即阻塞並被調用。
