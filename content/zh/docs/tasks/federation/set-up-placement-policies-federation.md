---
title: 在联邦中设置放置策略
content_template: templates/task
---

<!--
title: Set up placement policies in Federation
content_template: templates/task
-->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This page shows how to enforce policy-based placement decisions over Federated
resources using an external policy engine.
-->
此页面显示如何使用外部策略引擎对联邦资源强制执行基于策略的放置决策。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
You need to have a running Kubernetes cluster (which is referenced as host
cluster). Please see one of the [getting started](/docs/setup/)
guides for installation instructions for your platform.
-->
您需要一个正在运行的 Kubernetes 集群(它被引用为主机集群)。有关您的平台的安装说明，请参阅[入门](/docs/setup/)指南。

{{% /capture %}}

{{% capture steps %}}

<!--
## Deploying Federation and configuring an external policy engine
-->
## Deploying 联邦并配置外部策略引擎

<!--
The Federation control plane can be deployed using `kubefed init`.
-->
可以使用 `kubefed init` 部署联邦控制平面。

<!--
After deploying the Federation control plane, you must configure an Admission
Controller in the Federation API server that enforces placement decisions
received from the external policy engine.
-->
Deploying 联邦控制平面之后，必须在联邦 API 服务器中配置一个准入控制器，该控制器强制执行从外部策略引擎接收到的放置决策。


    kubectl create -f scheduling-policy-admission.yaml

<!--
Shown below is an example ConfigMap for the Admission Controller:
-->
下图是准入控制器的 ConfigMap 示例：

{{< codenew file="federation/scheduling-policy-admission.yaml" >}}

<!--
The ConfigMap contains three files:
-->
ConfigMap 包含三个文件：

<!--
* `config.yml` specifies the location of the `SchedulingPolicy` Admission
  Controller config file.
* `scheduling-policy-config.yml` specifies the location of the kubeconfig file
  required to contact the external policy engine. This file can also include a
  `retryBackoff` value that controls the initial retry backoff delay in
  milliseconds.
* `opa-kubeconfig` is a standard kubeconfig containing the URL and credentials
  needed to contact the external policy engine.
-->
* `config.yml` 指定 `调度策略` 准入控制器配置文件的位置。
* `scheduling-policy-config.yml` 指定与外部策略引擎联系所需的 kubeconfig 文件的位置。
该文件还可以包含一个 `retryBackoff` 值，该值以毫秒为单位控制初始重试 backoff 延迟。
* `opa-kubeconfig` 是一个标准的 kubeconfig，包含联系外部策略引擎所需的 URL 和凭证。

<!--
Edit the Federation API server deployment to enable the `SchedulingPolicy`
Admission Controller.
-->
编辑联邦 API 服务器部署以启用 `SchedulingPolicy` 准入控制器。

	kubectl -n federation-system edit deployment federation-apiserver

<!--
Update the Federation API server command line arguments to enable the Admission
Controller and mount the ConfigMap into the container. If there's an existing
`--enable-admission-plugins` flag, append `,SchedulingPolicy` instead of adding
another line.
-->
更新 Federation API 服务器命令行参数以启用准入控制器，
并将 ConfigMap 挂载到容器中。如果存在现有的 `-enable-admissionplugins` 参数，则追加 `SchedulingPolicy` 而不是添加另一行。


    --enable-admission-plugins=SchedulingPolicy
    --admission-control-config-file=/etc/kubernetes/admission/config.yml

<!--
Add the following volume to the Federation API server pod:
-->
将以下卷添加到联邦 API 服务器 pod：

    - name: admission-config
      configMap:
        name: admission

<!--
Add the following volume mount the Federation API server `apiserver` container:
-->
添加以下卷挂载联邦 API 服务器的 `apiserver` 容器：

    volumeMounts:
    - name: admission-config
      mountPath: /etc/kubernetes/admission

<!--
## Deploying an external policy engine
-->

## Deploying 外部策略引擎

<!--
The [Open Policy Agent (OPA)](http://openpolicyagent.org) is an open source,
general-purpose policy engine that you can use to enforce policy-based placement
decisions in the Federation control plane.
-->
[Open Policy Agent (OPA)](http://openpolicyagent.org) 是一个开源的通用策略引擎，
您可以使用它在联邦控制平面中执行基于策略的放置决策。

<!--
Create a Service in the host cluster to contact the external policy engine:
-->
在主机群集中创建服务以联系外部策略引擎：

    kubectl create -f policy-engine-service.yaml

<!--
Shown below is an example Service for OPA.
-->
下面显示的是 OPA 的示例服务。

{{< codenew file="federation/policy-engine-service.yaml" >}}

<!--
Create a Deployment in the host cluster with the Federation control plane:
-->
使用联邦控制平面在主机群集中创建部署：

    kubectl create -f policy-engine-deployment.yaml

<!--
Shown below is an example Deployment for OPA.
-->
下面显示的是 OPA 的部署示例。

{{< codenew file="federation/policy-engine-deployment.yaml" >}}

<!--
## Configuring placement policies via ConfigMaps
-->

## 通过 ConfigMaps 配置放置策略

<!--
The external policy engine will discover placement policies created in the
`kube-federation-scheduling-policy` namespace in the Federation API server.
-->
外部策略引擎将发现在 Federation API 服务器的 `kube-federation-scheduling-policy` 
命名空间中创建的放置策略。

<!--
Create the namespace if it does not already exist:
-->
如果命名空间尚不存在，请创建它：

    kubectl --context=federation create namespace kube-federation-scheduling-policy

<!--
Configure a sample policy to test the external policy engine:
-->
配置一个示例策略来测试外部策略引擎:

```
# OPA supports a high-level declarative language named Rego for authoring and
# enforcing policies. For more information on Rego, visit
# http://openpolicyagent.org.

# Rego policies are namespaced by the "package" directive.
package kubernetes.placement

# Imports provide aliases for data inside the policy engine. In this case, the
# policy simply refers to "clusters" below.
import data.kubernetes.clusters

# The "annotations" rule generates a JSON object containing the key
# "federation.kubernetes.io/replica-set-preferences" mapped to <preferences>.
# The preferences values is generated dynamically by OPA when it evaluates the
# rule.
#
# The SchedulingPolicy Admission Controller running inside the Federation API
# server will merge these annotations into incoming Federated resources. By
# setting replica-set-preferences, we can control the placement of Federated
# ReplicaSets.
#
# Rules are defined to generate JSON values (booleans, strings, objects, etc.)
# When OPA evaluates a rule, it generates a value IF all of the expressions in
# the body evaluate successfully. All rules can be understood intuitively as
# <head> if <body> where <body> is true if <expr-1> AND <expr-2> AND ...
# <expr-N> is true (for some set of data.)
annotations["federation.kubernetes.io/replica-set-preferences"] = preferences {
    input.kind = "ReplicaSet"
    value = {"clusters": cluster_map, "rebalance": true}
    json.marshal(value, preferences)
}

# This "annotations" rule generates a value for the "federation.alpha.kubernetes.io/cluster-selector"
# annotation.
#
# In English, the policy asserts that resources in the "production" namespace
# that are not annotated with "criticality=low" MUST be placed on clusters
# labelled with "on-premises=true".
annotations["federation.alpha.kubernetes.io/cluster-selector"] = selector {
    input.metadata.namespace = "production"
    not input.metadata.annotations.criticality = "low"
    json.marshal([{
        "operator": "=",
        "key": "on-premises",
        "values": "[true]",
    }], selector)
}

# Generates a set of cluster names that satisfy the incoming Federated
# ReplicaSet's requirements. In this case, just PCI compliance.
replica_set_clusters[cluster_name] {
    clusters[cluster_name]
    not insufficient_pci[cluster_name]
}

# Generates a set of clusters that must not be used for Federated ReplicaSets
# that request PCI compliance.
insufficient_pci[cluster_name] {
    clusters[cluster_name]
    input.metadata.annotations["requires-pci"] = "true"
    not pci_clusters[cluster_name]
}

# Generates a set of clusters that are PCI certified. In this case, we assume
# clusters are annotated to indicate if they have passed PCI compliance audits.
pci_clusters[cluster_name] {
    clusters[cluster_name].metadata.annotations["pci-certified"] = "true"
}

# Helper rule to generate a mapping of desired clusters to weights. In this
# case, weights are static.
cluster_map[cluster_name] = {"weight": 1} {
    replica_set_clusters[cluster_name]
}
```

<!--
Shown below is the command to create the sample policy:
-->
下面显示的是创建示例策略的命令：

    kubectl --context=federation -n kube-federation-scheduling-policy create configmap scheduling-policy --from-file=policy.rego

<!--
This sample policy illustrates a few key ideas:
-->
这个示例策略说明了一些关键思想：

<!--
* Placement policies can refer to any field in Federated resources.
* Placement policies can leverage external context (for example, Cluster
  metadata) to make decisions.
* Administrative policy can be managed centrally.
* Policies can define simple interfaces (such as the `requires-pci` annotation) to
  avoid duplicating logic in manifests.
-->

* 位置策略可以引用联邦资源中的任何字段。
* 放置策略可以利用外部上下文(例如，集群元数据)来做出决策。
* 管理策略可以集中管理。
* 策略可以定义简单的接口(例如 `requirements -pci` 注解)，以避免在清单中重复逻辑。

<!--
## Testing placement policies
-->

## 测试放置政策

<!--
Annotate one of the clusters to indicate that it is PCI certified.
-->
注释其中一个集群以表明它是经过 PCI 认证的。

    kubectl --context=federation annotate clusters cluster-name-1 pci-certified=true

<!--
Deploy a Federated ReplicaSet to test the placement policy.
-->
部署联邦副本来测试放置策略。

{{< codenew file="federation/replicaset-example-policy.yaml" >}}

<!--
Shown below is the command to deploy a ReplicaSet that *does* match the policy.
-->
下面显示的命令用于部署与策略匹配的副本集。

    kubectl --context=federation create -f replicaset-example-policy.yaml

<!--
Inspect the ReplicaSet to confirm the appropriate annotations have been applied:
-->
检查副本集以确认已应用适当的注解：

    kubectl --context=federation get rs nginx-pci -o jsonpath='{.metadata.annotations}'

{{% /capture %}}


