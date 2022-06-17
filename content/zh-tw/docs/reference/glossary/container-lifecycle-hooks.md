---
title: 容器生命週期鉤子（Container Lifecycle Hooks）
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /zh-cn/docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  生命週期鉤子暴露容器管理生命週期中的事件，允許使用者在事件發生時執行程式碼。

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

  生命週期鉤子暴露{{< glossary_tooltip text="容器" term_id="container" >}}管理生命週期中的事件，允許使用者在事件發生時執行程式碼。
  <!--
  The lifecycle hooks expose events in the {{< glossary_tooltip text="Container" term_id="container" >}}container management lifecycle and let the user run code when the events occur.
  -->

<!--more--> 

針對容器暴露了兩個鉤子：PostStart 在容器建立之後立即執行，PreStop 在容器停止之前立即阻塞並被呼叫。
<!--
Two hooks are exposed to Containers: PostStart which executes immediately after a container is created and PreStop which is blocking and is called immediately before a container is terminated.
-->
