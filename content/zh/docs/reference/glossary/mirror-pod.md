---
title: 静态 Pod
id: 静态-pod
date: 2019-08-06
short_description: >
  API 服务器中的一个对象，用于跟踪 kubelet 上的静态容器。

aka:
tags:
- 基本的
---
<!--
---
title: Mirror Pod
id: mirror-pod
date: 2019-08-06
short_description: >
  An object in the API server that tracks a static pod on a kubelet.

aka:
tags:
- fundamental
---
-->

<!--
 A {{< glossary_tooltip text="pod" term_id="pod" >}} object that a kubelet uses
 to represent a {{< glossary_tooltip text="static pod" term_id="static-pod" >}}
-->
 kubelet 使用一个对象 {{< glossary_tooltip text="pod" term_id="pod" >}} 来代表 {{< glossary_tooltip text="static pod" term_id="static-pod" >}}

<!--more-->
<!--更多-->

<!--
When the kubelet finds a static pod in its configuration, it automatically tries to
create a Pod object on the Kubernetes API server for it. This means that the pod
will be visible on the API server, but cannot be controlled from there.

(For example, removing a mirror pod will not stop the kubelet daemon from running it).
-->
当 kubelet 在其配置中发现一个静态容器时，
它会自动地尝试在 Kubernetes API 服务器上为它创建 Pod 对象。
这意味着 pod 在 API 服务器上将是可见的，但不能在其上进行控制。

（例如，删除静态 pod 将不会停止 kubelet 守护程序的运行）。
