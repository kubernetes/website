---
title: 设置Konnectivity服务
content_type: task
weight: 70
---

<!--
title: Set up Konnectivity service
content_type: task
weight: 70
-->
<!-- overview -->

<!--
The Konnectivity service provides a TCP level proxy for the control plane to cluster
communication.
-->
Konnectivity服务为控制平面群集提供了TCP级别的代理通讯。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Configure the Konnectivity service

The following steps require an egress configuration, for example:
-->
##配置Konnectivity服务

例如，以下步骤需要出口配置：

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

<!--
You need to configure the API Server to use the Konnectivity service
and direct the network traffic to the cluster nodes:
-->
您需要配置API服务器以使用Konnectivity服务
并将网络流量定向到群集节点：

<!--
1. Create an egress configuration file such as `admin/konnectivity/egress-selector-configuration.yaml`.
1. Set the `--egress-selector-config-file` flag of the API Server to the path of
your API Server egress configuration file.
-->
1.创建一个出口配置文件，例如“ admin / konnectivity / egress-selector-configuration.yaml”。
1.将API服务器的`--egress-selector-config-file`标志设置为
您的API服务器出口配置文件。

<!--
Next, you need to deploy the Konnectivity server and agents.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
is a reference implementation.
-->
接下来，您需要部署Konnectivity服务器和代理。
[kubernetes-sigs / apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
是参考实现。

<!--
Deploy the Konnectivity server on your control plane node. The provided
`konnectivity-server.yaml` manifest assumes
that the Kubernetes components are deployed as a {{< glossary_tooltip text="static Pod"
term_id="static-pod" >}} in your cluster. If not, you can deploy the Konnectivity
server as a DaemonSet.
-->
在控制平面节点上部署Konnectivity服务器。 提供的
konnectivity-server.yaml清单假定
Kubernetes组件被部署为{{< glossary_tooltip text="static Pod"
term_id="static-pod" >}}。 如果没有，您可以部署Konnectivity服务器作为DaemonSet。

{{< codenew file="admin/konnectivity/konnectivity-server.yaml" >}}

<!--
Then deploy the Konnectivity agents in your cluster:
-->
然后在集群中部署Konnectivity代理：

{{< codenew file="admin/konnectivity/konnectivity-agent.yaml" >}}

<!--
Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:
-->
最后，如果您的集群中启用了RBAC，请创建相关的RBAC规则：

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}
