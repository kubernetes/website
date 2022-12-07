---
title: 动态卷制备（Dynamic Volume Provisioning）
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/dynamic-provisioning/
short_description: >
  允许用户请求自动创建存储卷。

aka: 
tags:
- core-object
- storage
---
<!--
title: Dynamic Volume Provisioning
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  Allows users to request automatic creation of storage  Volumes.

aka: 
tags:
- core-object
- storage
-->

<!--
Allows users to request automatic creation of storage  {{< glossary_tooltip text="Volumes" term_id="volume" >}}.
-->
允许用户请求自动创建存储{{< glossary_tooltip text="卷" term_id="volume" >}}。

<!--more--> 

<!--
Dynamic provisioning eliminates the need for cluster administrators to pre-provision storage. Instead, it automatically provisions storage by user request. Dynamic volume provisioning is based on an API object, {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, referring to a {{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}} that provisions a {{< glossary_tooltip text="Volume" term_id="volume" >}} and the set of parameters to pass to the Volume Plugin.
-->
动态制备让集群管理员无需再预先制备存储。这种机制转为通过用户请求自动地制备存储。
动态卷制备是基于 API 对象 {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} 的，
StorageClass 可以引用{{< glossary_tooltip text="卷插件（Volume Plugin）" term_id="volume-plugin" >}}
提供的{{< glossary_tooltip text="卷" term_id="volume" >}}，
也可以引用传递给卷插件的参数集。
