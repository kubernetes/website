---
title: Kubernetes z-pages
content_type: reference
weight: 60
description: >-
  爲 Kubernetes 組件提供運行時診斷，展示組件運行狀態和設定標誌的監測資訊。
---
<!--
title: Kubernetes z-pages
content_type: reference
weight: 60
reviewers:
- dashpole
description: >-
  Provides runtime diagnostics for Kubernetes components, offering insights into component runtime status and configuration flags.
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.32" state="alpha" >}}

<!--
Kubernetes core components can expose a suite of _z-endpoints_ to make it easier for users
to debug their cluster and its components. These endpoints are strictly to be used for human
inspection to gain real time debugging information of a component binary.
Avoid automated scraping of data returned by these endpoints; in Kubernetes {{< skew currentVersion >}}
these are an **alpha** feature and the response format may change in future releases.
-->
Kubernetes 的核心組件可以暴露一系列 **z-endpoints**，以便使用者更輕鬆地調試他們的叢集及其組件。
這些端點僅用於人工檢查，以獲取組件二進制檔案的實時調試資訊。請不要自動抓取這些端點返回的資料；
在 Kubernetes {{< skew currentVersion >}} 中，這些是 **Alpha** 特性，響應格式可能會在未來版本中發生變化。

<!-- body -->

<!--
## z-pages

Kubernetes v{{< skew currentVersion >}} allows you to enable _z-pages_ to help you troubleshoot
problems with its core control plane components. These special debugging endpoints provide internal
information about running components. For Kubernetes {{< skew currentVersion >}}, components
serve the following endpoints (when enabled):
-->
## z-pages

Kubernetes v{{< skew currentVersion >}} 允許你啓用 **z-pages** 來幫助排查其核心控制平面組件的問題。
這些特殊的調試端點提供與正在運行的組件有關的內部資訊。對於 Kubernetes {{< skew currentVersion >}}，
這些組件提供以下端點（當啓用 z-pages 後）：

- [z-pages](#z-pages)
  - [statusz](#statusz)
  - [flagz](#flagz)

<!--
### statusz

Enabled using the `ComponentStatusz` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
the `/statusz` endpoint displays high level information about the component such as its Kubernetes version, emulation version, start time and more.

The `/statusz` response from the API server is similar to:
-->
### statusz

使用 `ComponentStatusz`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)啓用後，
`/statusz` 端點顯示有關組件的高級資訊，例如其 Kubernetes 版本、仿真版本、啓動時間等。

來自 API 伺服器的 `/statusz` 響應類似於：

```
kube-apiserver statusz
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

Started: Wed Oct 16 21:03:43 UTC 2024
Up: 0 hr 00 min 16 sec
Go version: go1.23.2
Binary version: 1.32.0-alpha.0.1484&#43;5eeac4f21a491b-dirty
Emulation version: 1.32.0-alpha.0.1484
```

<!--
### flagz

Enabled using the `ComponentFlagz` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/), the `/flagz` endpoint shows you the command line arguments that were used to start a component.

The `/flagz` data for the API server looks something like:
-->
### flagz

使用 `ComponentFlagz`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)啓用後，
`/flagz` 端點爲你顯示用於啓動某組件的命令列參數。

API 伺服器的 `/flagz` 資料看起來類似於：

```
kube-apiserver flags
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

advertise-address=192.168.8.2
contention-profiling=false
enable-priority-and-fairness=true
profiling=true
authorization-mode=[Node,RBAC]
authorization-webhook-cache-authorized-ttl=5m0s
authorization-webhook-cache-unauthorized-ttl=30s
authorization-webhook-version=v1beta1
default-watch-cache-size=100
```
