---
title: Kubernetes z-pages
content_type: reference
weight: 60
description: >-
  为 Kubernetes 组件提供运行时诊断，展示组件运行状态和配置标志的监测信息。
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
Kubernetes 的核心组件可以暴露一系列 **z-endpoints**，以便用户更轻松地调试他们的集群及其组件。
这些端点仅用于人工检查，以获取组件二进制文件的实时调试信息。请不要自动抓取这些端点返回的数据；
在 Kubernetes {{< skew currentVersion >}} 中，这些是 **Alpha** 特性，响应格式可能会在未来版本中发生变化。

<!-- body -->

<!--
## z-pages

Kubernetes v{{< skew currentVersion >}} allows you to enable _z-pages_ to help you troubleshoot
problems with its core control plane components. These special debugging endpoints provide internal
information about running components. For Kubernetes {{< skew currentVersion >}}, components
serve the following endpoints (when enabled):
-->
## z-pages

Kubernetes v{{< skew currentVersion >}} 允许你启用 **z-pages** 来帮助排查其核心控制平面组件的问题。
这些特殊的调试端点提供与正在运行的组件有关的内部信息。对于 Kubernetes {{< skew currentVersion >}}，
这些组件提供以下端点（当启用 z-pages 后）：

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
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)启用后，
`/statusz` 端点显示有关组件的高级信息，例如其 Kubernetes 版本、仿真版本、启动时间等。

来自 API 服务器的 `/statusz` 响应类似于：

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
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)启用后，
`/flagz` 端点为你显示用于启动某组件的命令行参数。

API 服务器的 `/flagz` 数据看起来类似于：

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
