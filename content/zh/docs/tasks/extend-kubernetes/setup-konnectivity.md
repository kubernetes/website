---
title: 设置 Konnectivity 服务
content_type: task
weight: 70
---

<!-- overview -->
<!--
The Konnectivity service provides a TCP level proxy for the control plane to cluster
communication.
-->
Konnectivity 服务为控制平面提供集群通信的 TCP 级别代理。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->
<!--
## Configure the Konnectivity service

The following steps require an egress configuration, for example:

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

You need to configure the API Server to use the Konnectivity service
and direct the network traffic to the cluster nodes:

1. Create an egress configuration file such as `admin/konnectivity/egress-selector-configuration.yaml`.
1. Set the `--egress-selector-config-file` flag of the API Server to the path of
your API Server egress configuration file.
-->
## 配置 Konnectivity 服务

接下来的步骤需要出口配置，比如：

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

您需要配置 API 服务器来使用 Konnectivity 服务，并将网络流量定向到集群节点：

1. 创建一个出口配置文件比如 `admin/konnectivity/egress-selector-configuration.yaml`。
1. 将 API 服务器的 `--egress-selector-config-file` 参数设置为你的 API 服务器的出口配置文件路径。

<!--
Next, you need to deploy the Konnectivity server and agents.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
is a reference implementation.

Deploy the Konnectivity server on your control plane node. The provided
`konnectivity-server.yaml` manifest assumes
that the Kubernetes components are deployed as a {{< glossary_tooltip text="static Pod"
term_id="static-pod" >}} in your cluster. If not, you can deploy the Konnectivity
server as a DaemonSet.
-->
接下来，你需要部署 Konnectivity 服务器和代理。[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy) 是参考实现。

在控制平面节点上部署 Konnectivity 服务，下面提供的 `konnectivity-server.yaml` 配置清单假定您在集群中
将 Kubernetes 组件都是部署为{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}。如果不是，你可以将 Konnectivity 服务部署为 DaemonSet。

{{< codenew file="admin/konnectivity/konnectivity-server.yaml" >}}

<!--
Then deploy the Konnectivity agents in your cluster:
-->
在您的集群中部署 Konnectivity 代理：

{{< codenew file="admin/konnectivity/konnectivity-agent.yaml" >}}

<!--
Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:
-->
最后，如果您的集群开启了 RBAC，请创建相关的 RBAC 规则：

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}
