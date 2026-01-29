---
title: 容器儲存介面（Container Storage Interface；CSI）
id: csi
date: 2018-06-25
full_link: /zh-cn/docs/concepts/storage/volumes/#csi
short_description: >
    容器儲存介面 （CSI）定義了儲存系統暴露給容器的標準介面。


aka: 
tags:
- storage 
---
<!--
title: Container Storage Interface (CSI)
id: csi
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    The Container Storage Interface (CSI) defines a standard interface to expose storage systems to containers.


aka: 
tags:
- storage 
-->

<!--
 The Container Storage Interface (CSI) defines a standard interface to expose storage systems to containers.
-->
容器儲存介面（Container Storage Interface；CSI）定義儲存系統暴露給容器的標準介面。

<!--more--> 

<!--
CSI allows vendors to create custom storage plugins for Kubernetes without adding them to the Kubernetes repository (out-of-tree plugins). To use a CSI driver from a storage provider, you must first [deploy it to your cluster](https://kubernetes-csi.github.io/docs/deploying.html). You will then be able to create a {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} that uses that CSI driver.

* [CSI in the Kubernetes documentation](/docs/concepts/storage/volumes/#csi)
* [List of available CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html)
-->
CSI 允許儲存驅動提供商爲 Kubernetes 創建定製化的儲存插件，
而無需將這些插件的代碼添加到 Kubernetes 代碼倉庫（外部插件）。
要使用某個儲存提供商的 CSI 驅動，你首先要
[將它部署到你的叢集上](https://kubernetes-csi.github.io/docs/deploying.html)。
然後你才能創建使用該 CSI 驅動的 {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} 。

* [Kubernetes 文檔中關於 CSI 的描述](/zh-cn/docs/concepts/storage/volumes/#csi)
* [可用的 CSI 驅動列表](https://kubernetes-csi.github.io/docs/drivers.html)
