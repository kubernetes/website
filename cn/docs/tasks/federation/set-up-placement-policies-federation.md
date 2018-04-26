---
cn-approvers:
- lichuqiang
title: 在联邦中设置放置策略
---
<!--
---
title: Set up placement policies in Federation
---
-->

{% capture overview %}

<!--
This page shows how to enforce policy-based placement decisions over Federated
resources using an external policy engine.
-->
本文展示了如何使用外部策略引擎来对联邦资源执行基于策略的放置决策。

{% endcapture %}

{% capture prerequisites %}

<!--
You need to have a running Kubernetes cluster (which is referenced as host
cluster). Please see one of the [getting started](/docs/setup/)
guides for installation instructions for your platform.
-->
您需要拥有一个运行的 Kubernetes 集群 （它被引用为 host 集群）。
请查看 [入门](/docs/setup/) 指导，根据您的平台选择相应的安装说明。

{% endcapture %}

{% capture steps %}

<!--
## Deploying Federation and configuring an external policy engine

The Federation control plane can be deployed using `kubefed init`.
-->
## 部署联邦并配置外部策略引擎

可以使用 `kubefed init` 来部署联邦控制平面。

<!--
After deploying the Federation control plane, you must configure an Admission
Controller in the Federation API server that enforces placement decisions
received from the external policy engine.
-->
在部署联邦控制平面后，您必须在联邦 API server 中配置一个准入控制器，
该控制器执行从外部策略引擎接收到的放置决策。

    kubectl create -f scheduling-policy-admission.yaml

<!--
Shown below is an example ConfigMap for the Admission Controller:
-->
下面展示的是准入控制器的一个 ConfigMap 示例：

{% include code.html language="yaml" file="scheduling-policy-admission.yaml" ghlink="/docs/tasks/federation/scheduling-policy-admission.yaml" %}

<!--
The ConfigMap contains three files:
-->
该 ConfigMap 包含三个文件：

<!--
* `config.yml` specifies the location of the `SchedulingPolicy` Admission
  Controller config file.
-->
* `config.yml` 指定 `SchedulingPolicy` 准入控制器配置文件的位置。
<!--
* `scheduling-policy-config.yml` specifies the location of the kubeconfig file
  required to contact the external policy engine. This file can also include a
  `retryBackoff` value that controls the initial retry backoff delay in
  milliseconds.
-->
* `scheduling-policy-config.yml` 指定用来与外部策略引擎联系的 kubeconfig 文件的位置。
  该文件还可以包括一个 `retryBackoff` 值，它以毫秒为单位，控制初始重试退避时延（backoff delay）。
<!--
* `opa-kubeconfig` is a standard kubeconfig containing the URL and credentials
  needed to contact the external policy engine.
-->
* `opa-kubeconfig` 是一个标准的 kubeconfig，它包含用来联系外部策略引擎的 URL 和 证书。

<!--
Edit the Federation API server deployment to enable the `SchedulingPolicy`
Admission Controller.
-->
编辑联邦 API server 的 deployment 来启用 `SchedulingPolicy` 准入控制器。

	kubectl -n federation-system edit deployment federation-apiserver

<!--
Update the Federation API server command line arguments to enable the Admission
Controller and mount the ConfigMap into the container. If there's an existing
`--admission-control` flag, append `,SchedulingPolicy` instead of adding
another line.
-->
更新联邦 API server 命令行参数来启用准入控制器，并将 ConfigMap 挂载到容器中。
如果已存在 `--admission-control` 参数，请追加 `,SchedulingPolicy` 而不是添加另一行。

    --admission-control=SchedulingPolicy
    --admission-control-config-file=/etc/kubernetes/admission/config.yml

<!--
Add the following volume to the Federation API server pod:
-->
添加以下卷到联邦 API server pod 中：

    - name: admission-config
      configMap:
        name: admission

<!--
Add the following volume mount the Federation API server `apiserver` container:
-->
添加以下卷挂载到联邦 API server 容器中：

    volumeMounts:
    - name: admission-config
      mountPath: /etc/kubernetes/admission

<!--
## Deploying an external policy engine

The [Open Policy Agent (OPA)](http://openpolicyagent.org) is an open source,
general-purpose policy engine that you can use to enforce policy-based placement
decisions in the Federation control plane.
-->
## 部署一个外部策略引擎

[Open Policy Agent (OPA)](http://openpolicyagent.org) 是一种开源的、
通用的策略引擎。 您可以使用它在联邦控制平面执行基于策略的放置决策。

<!--
Create a Service in the host cluster to contact the external policy engine:
-->
在 host 集群中创建一个 Service 来联系外部策略引擎：

    kubectl create -f policy-engine-service.yaml

<!--
Shown below is an example Service for OPA.
-->
下面展示了一个 OPA 的 Service 示例。

{% include code.html language="yaml" file="policy-engine-service.yaml" ghlink="/docs/tasks/federation/policy-engine-service.yaml" %}

<!--
Create a Deployment in the host cluster with the Federation control plane:
-->
使用联邦控制平面在 host 集群中创建一个 Deployment：

    kubectl create -f policy-engine-deployment.yaml

<!--
Shown below is an example Deployment for OPA.
-->
下面展示了一个 OPA 的 Deployment 示例。

{% include code.html language="yaml" file="policy-engine-deployment.yaml" ghlink="/docs/tasks/federation/policy-engine-deployment.yaml" %}

<!--
## Configuring placement policies via ConfigMaps

The external policy engine will discover placement policies created in the
`kube-federation-scheduling-policy` namespace in the Federation API server.
-->
## 通过 ConfigMap 配置放置策略

外部策略引擎会发现联邦 API server 的 `kube-federation-scheduling-policy`
namespace 下创建的放置策略。

<!--
Create the namespace if it does not already exist:
-->
如果该 namespace 不存在，请创建：

    kubectl --context=federation create namespace kube-federation-scheduling-policy

<!--
Configure a sample policy to test the external policy engine:
-->
配置一个示例策略来测试外部策略引擎：

{% include code.html language="yaml" file="policy.rego" ghlink="/docs/tasks/federation/policy.rego" %}

<!--
Shown below is the command to create the sample policy:
-->
下面展示的是创建示例策略的命令：

    kubectl --context=federation -n kube-federation-scheduling-policy create configmap scheduling-policy --from-file=policy.rego

<!--
This sample policy illustrates a few key ideas:
-->
这个示例策略说明了几个关键概念：

<!--
* Placement policies can refer to any field in Federated resources.
-->
* 放置策略适用于联邦资源的任何字段。
<!--
* Placement policies can leverage external context (for example, Cluster
  metadata) to make decisions.
-->
* 放置策略能够利用外部上下文（例如集群 metadata）来做决策。
<!--
* Administrative policy can be managed centrally.
-->
* 管理策略可以集中管理。
<!--
* Policies can define simple interfaces (such as the `requires-pci` annotation) to
  avoid duplicating logic in manifests.
-->
* 策略可以定义简单的接口（如 `requires-pci` 注解）来避免 manifest 中存在重复逻辑。

<!--
## Testing placement policies

Annotate one of the clusters to indicate that it is PCI certified.
-->
## 测试放置策略

为其中一个集群添加注解，以表明它是经过 PCI 认证的。

    kubectl --context=federation annotate clusters cluster-name-1 pci-certified=true

<!--
Deploy a Federated ReplicaSet to test the placement policy.
-->
部署一个联邦 ReplicaSet 来测试放置策略。

{% include code.html language="yaml" file="replicaset-example-policy.yaml" ghlink="/docs/tasks/federation/replicaset-example-policy.yaml" %}

<!--
Shown below is the command to deploy a ReplicaSet that *does* match the policy.
-->
下面展示的是部署一个 *能够* 匹配策略的 ReplicaSet 的命令。

    kubectl --context=federation create -f replicaset-example-policy.yaml

<!--
Inspect the ReplicaSet to confirm the appropriate annotations have been applied:
-->
检查 ReplicaSet，确认适当的注解已经被应用。

    kubectl --context=federation get rs nginx-pci -o jsonpath='{.metadata.annotations}'

{% endcapture %}

{% include templates/task.md %}
