---
title: Dockershim
id: dockershim
date: 2022-04-15
full_link: /zh-cn/dockershim
short_description: >
   dockershim 是 Kubernetes v1.23 及之前版本中的一個元件，Kubernetes 系統元件透過它與 Docker Engine 通訊。

aka:
tags:
- fundamental
---

<!--
title: Dockershim
id: dockershim
date: 2022-04-15
full_link: /dockershim
short_description: >
   A component of Kubernetes v1.23 and earlier, which allows Kubernetes system components to communicate with Docker Engine.

aka:
tags:
- fundamental
-->

<!--
The dockershim is a component of Kubernetes version 1.23 and earlier. It allows the kubelet
to communicate with {{< glossary_tooltip text="Docker Engine" term_id="docker" >}}.
-->

dockershim 是 Kubernetes v1.23 及之前版本中的一個元件。
Kubernetes 系統元件透過它與 {{< glossary_tooltip text="Docker Engine" term_id="docker" >}} 通訊。

<!--more-->
<!--
Starting with version 1.24, dockershim has been removed from Kubernetes. For more information, see [Dockershim FAQ](/dockershim).
-->
從 Kubernetes v1.24 開始，dockershim 已從 Kubernetes 中移除.
想了解更多資訊，可參考[移除 Dockershim 的常見問題](/zh-cn/dockershim)。