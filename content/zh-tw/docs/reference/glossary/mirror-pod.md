---
title: 鏡像 Pod（Mirror Pod）
id: 靜態-pod
date: 2019-08-06
short_description: >
  API 服務器中的一個對象，用於跟蹤 kubelet 上的靜態 pod。

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
鏡像 Pod（Mirror Pod）是被 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
用來代表{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}} 的
{{< glossary_tooltip text="Pod" term_id="pod" >}} 對象。

<!--more-->

<!--
When the kubelet finds a static pod in its configuration, it automatically tries to
create a Pod object on the Kubernetes API server for it. This means that the pod
will be visible on the API server, but cannot be controlled from there.

(For example, removing a mirror pod will not stop the kubelet daemon from running it).
-->
當 kubelet 在其配置中發現一個靜態容器時，
它會自動地嘗試在 Kubernetes API 服務器上爲它創建 Pod 對象。
這意味着 pod 在 API 服務器上將是可見的，但不能在其上進行控制。

（例如，刪除鏡像 Pod 也不會阻止 kubelet 守護進程繼續運行它）。
