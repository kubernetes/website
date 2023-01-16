---
title: 容器存储接口（Container Storage Interface；CSI）
id: csi
date: 2018-06-25
full_link: /zh-cn/docs/concepts/storage/volumes/#csi
short_description: >
    容器存储接口 （CSI）定义了存储系统暴露给容器的标准接口。


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
容器存储接口（Container Storage Interface；CSI）定义存储系统暴露给容器的标准接口。

<!--more--> 

<!--
CSI allows vendors to create custom storage plugins for Kubernetes without adding them to the Kubernetes repository (out-of-tree plugins). To use a CSI driver from a storage provider, you must first [deploy it to your cluster](https://kubernetes-csi.github.io/docs/deploying.html). You will then be able to create a {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} that uses that CSI driver.

* [CSI in the Kubernetes documentation](/docs/concepts/storage/volumes/#csi)
* [List of available CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html)
-->
CSI 允许存储驱动提供商为 Kubernetes 创建定制化的存储插件，
而无需将这些插件的代码添加到 Kubernetes 代码仓库（外部插件）。
要使用某个存储提供商的 CSI 驱动，你首先要
[将它部署到你的集群上](https://kubernetes-csi.github.io/docs/deploying.html)。
然后你才能创建使用该 CSI 驱动的 {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} 。

* [Kubernetes 文档中关于 CSI 的描述](/zh-cn/docs/concepts/storage/volumes/#csi)
* [可用的 CSI 驱动列表](https://kubernetes-csi.github.io/docs/drivers.html)
