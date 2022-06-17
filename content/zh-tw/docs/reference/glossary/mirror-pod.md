---
title: 映象 Pod（Mirror Pod）
id: 靜態-pod
date: 2019-08-06
short_description: >
  API 伺服器中的一個物件，用於跟蹤 kubelet 上的靜態 pod。

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
映象 Pod（Mirror Pod）是被 kubelet 用來代表{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}} 的
{{< glossary_tooltip text="pod" term_id="pod" >}} 物件。

<!--more-->
<!--更多-->

<!--
When the kubelet finds a static pod in its configuration, it automatically tries to
create a Pod object on the Kubernetes API server for it. This means that the pod
will be visible on the API server, but cannot be controlled from there.

(For example, removing a mirror pod will not stop the kubelet daemon from running it).
-->
當 kubelet 在其配置中發現一個靜態容器時，
它會自動地嘗試在 Kubernetes API 伺服器上為它建立 Pod 物件。
這意味著 pod 在 API 伺服器上將是可見的，但不能在其上進行控制。

（例如，刪除映象 Pod 也不會阻止 kubelet 守護程序繼續執行它）。