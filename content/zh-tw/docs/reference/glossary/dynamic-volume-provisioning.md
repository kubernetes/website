---
title: 動態卷製備（Dynamic Volume Provisioning）
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/dynamic-provisioning/
short_description: >
  允許使用者請求自動創建儲存卷。

aka: 
tags:
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
- storage
-->

<!--
Allows users to request automatic creation of storage  {{< glossary_tooltip text="Volumes" term_id="volume" >}}.
-->
允許使用者請求自動創建儲存{{< glossary_tooltip text="卷" term_id="volume" >}}。

<!--more--> 

<!--
Dynamic provisioning eliminates the need for cluster administrators to pre-provision storage. Instead, it automatically provisions storage by user request. Dynamic volume provisioning is based on an API object, {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, referring to a {{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}} that provisions a {{< glossary_tooltip text="Volume" term_id="volume" >}} and the set of parameters to pass to the Volume Plugin.
-->
動態製備讓叢集管理員無需再預先製備儲存。這種機制轉爲通過使用者請求自動地製備儲存。
動態卷製備是基於 API 對象 {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} 的，
StorageClass 可以引用{{< glossary_tooltip text="卷插件（Volume Plugin）" term_id="volume-plugin" >}}
提供的{{< glossary_tooltip text="卷" term_id="volume" >}}，
也可以引用傳遞給卷插件的參數集。
