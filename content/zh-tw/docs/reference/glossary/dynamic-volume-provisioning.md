---
title: 動態卷供應（Dynamic Volume Provisioning）
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/dynamic-provisioning/
short_description: >
  允許使用者請求自動建立儲存卷。

aka: 
tags:
- core-object
- storage
---

<!--
---
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
---
-->

<!--
 Allows users to request automatic creation of storage  {{< glossary_tooltip text="Volumes" term_id="volume" >}}.
-->

 允許使用者請求自動建立儲存 {{< glossary_tooltip text="卷" term_id="volume" >}}。

<!--more--> 

<!--
Dynamic provisioning eliminates the need for cluster administrators to pre-provision storage. Instead, it automatically provisions storage by user request. Dynamic volume provisioning is based on an API object, {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, referring to a {{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}} that provisions a {{< glossary_tooltip text="Volume" term_id="volume" >}} and the set of parameters to pass to the Volume Plugin.
-->

動態供應讓叢集管理員無需再預先供應儲存。相反，它透過使用者請求自動地供應儲存。
動態卷供應是基於 API 物件 {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} 的，
StorageClass 可以引用 {{< glossary_tooltip text="卷外掛" term_id="volume-plugin" >}} 提供的
{{< glossary_tooltip text="卷" term_id="volume" >}}，也可以引用傳遞給卷外掛（Volume Plugin）的引數集。
