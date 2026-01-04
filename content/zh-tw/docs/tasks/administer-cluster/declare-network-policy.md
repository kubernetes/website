---
title: 聲明網路策略
min-kubernetes-server-version: v1.8
content_type: task
weight: 180
---
<!--
reviewers:
- caseydavenport
- danwinship
title: Declare Network Policy
min-kubernetes-server-version: v1.8
content_type: task
weight: 180
-->

<!-- overview -->

<!--
This document helps you get started using the Kubernetes [NetworkPolicy API](/docs/concepts/services-networking/network-policies/) to declare network policies that govern how pods communicate with each other.
-->
本文可以幫助你開始使用 Kubernetes 的
[NetworkPolicy API](/zh-cn/docs/concepts/services-networking/network-policies/)
聲明網路策略去管理 Pod 之間的通信

{{% thirdparty-content %}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Make sure you've configured a network provider with network policy support. There are a number of network providers that support NetworkPolicy, including:

* [Antrea](/docs/tasks/administer-cluster/network-policy-provider/antrea-network-policy/)
* [Calico](/docs/tasks/administer-cluster/network-policy-provider/calico-network-policy/)
* [Cilium](/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/)
* [Kube-router](/docs/tasks/administer-cluster/network-policy-provider/kube-router-network-policy/)
* [Romana](/docs/tasks/administer-cluster/network-policy-provider/romana-network-policy/)
* [Weave Net](/docs/tasks/administer-cluster/network-policy-provider/weave-network-policy/)
-->
你首先需要有一個支持網路策略的 Kubernetes 叢集。已經有許多支持 NetworkPolicy 的網路提供商，包括：

* [Antrea](/zh-cn/docs/tasks/administer-cluster/network-policy-provider/antrea-network-policy/)
* [Calico](/zh-cn/docs/tasks/administer-cluster/network-policy-provider/calico-network-policy/)
* [Cilium](/zh-cn/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/)
* [Kube-router](/zh-cn/docs/tasks/administer-cluster/network-policy-provider/kube-router-network-policy/)
* [Romana](/zh-cn/docs/tasks/administer-cluster/network-policy-provider/romana-network-policy/)
* [Weave 網路](/zh-cn/docs/tasks/administer-cluster/network-policy-provider/weave-network-policy/)

<!-- steps -->

<!--
## Create an `nginx` deployment and expose it via a service

To see how Kubernetes network policy works, start off by creating an `nginx` Deployment.
-->
## 創建一個`nginx` Deployment 並且通過服務將其暴露

爲了查看 Kubernetes 網路策略是怎樣工作的，可以從創建一個`nginx` Deployment 並且通過服務將其暴露開始

```shell
kubectl create deployment nginx --image=nginx
```

```none
deployment.apps/nginx created
```

<!--
Expose the Deployment through a Service called `nginx`.
-->
將此 Deployment 以名爲 `nginx` 的 Service 暴露出來：

```shell
kubectl expose deployment nginx --port=80
```

```none
service/nginx exposed
```

<!--
The above commands create a Deployment with an nginx Pod and expose the Deployment through a Service named `nginx`. The `nginx` Pod and Deployment are found in the `default` namespace.
-->
上述命令創建了一個帶有一個 nginx 的 Deployment，並將之通過名爲 `nginx` 的
Service 暴露出來。名爲 `nginx` 的 Pod 和 Deployment 都位於 `default`
名字空間內。

```shell
kubectl get svc,pod
```
```none
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/kubernetes          10.100.0.1    <none>        443/TCP    46m
service/nginx               10.100.0.16   <none>        80/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
pod/nginx-701339712-e0qfq   1/1           Running       0          35s
```

<!--
## Test the service by accessing it from another Pod

You should be able to access the new `nginx` service from other Pods. To access the `nginx` Service from another Pod in the `default` namespace, start a busybox container:
-->
## 通過從 Pod 訪問服務對其進行測試

你應該可以從其它的 Pod 訪問這個新的 `nginx` 服務。
要從 default 命名空間中的其它 Pod 來訪問該服務。可以啓動一個 busybox 容器：

```shell
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

<!--
In your shell, run the following command:
-->
在你的 Shell 中，運行下面的命令：

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```

<!--
## Limit access to the `nginx` service

To limit the access to the `nginx` service so that only Pods with the label `access: true` can query it, create a NetworkPolicy object as follows:
-->
## 限制 `nginx` 服務的訪問

如果想限制對 `nginx` 服務的訪問，只讓那些擁有標籤 `access: true` 的 Pod 訪問它，
那麼可以創建一個如下所示的 NetworkPolicy 對象：

{{% code_sample file="service/networking/nginx-policy.yaml" %}}

<!--
The name of a NetworkPolicy object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
NetworkPolicy 對象的名稱必須是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

<!--
NetworkPolicy includes a `podSelector` which selects the grouping of Pods to which the policy applies. You can see this policy selects Pods with the label `app=nginx`. The label was automatically added to the Pod in the `nginx` Deployment. An empty `podSelector` selects all pods in the namespace.
-->
{{< note >}}
NetworkPolicy 中包含選擇策略所適用的 Pods 集合的 `podSelector`。
你可以看到上面的策略選擇的是帶有標籤 `app=nginx` 的 Pods。
此標籤是被自動添加到 `nginx` Deployment 中的 Pod 上的。
如果 `podSelector` 爲空，則意味着選擇的是名字空間中的所有 Pods。
{{< /note >}}

<!--
## Assign the policy to the service

Use kubectl to create a NetworkPolicy from the above `nginx-policy.yaml` file:
-->
## 爲服務指定策略

使用 kubectl 根據上面的 `nginx-policy.yaml` 檔案創建一個 NetworkPolicy：

```shell
kubectl apply -f https://k8s.io/examples/service/networking/nginx-policy.yaml
```
```none
networkpolicy.networking.k8s.io/access-nginx created
```

<!--
## Test access to the service when access label is not defined

When you attempt to access the `nginx` Service from a Pod without the correct labels, the request times out:
-->
## 測試沒有定義訪問標籤時訪問服務

如果你嘗試從沒有設定正確標籤的 Pod 中去訪問 `nginx` 服務，請求將會超時：

```shell
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

<!--
In your shell, run the command:
-->
在 Shell 中運行命令：

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
wget: download timed out
```

<!--
## Define access label and test again

You can create a Pod with the correct labels to see that the request is allowed:
-->
## 定義訪問標籤後再次測試

創建一個擁有正確標籤的 Pod，你將看到請求是被允許的：

```shell
kubectl run busybox --rm -ti --labels="access=true" --image=busybox -- /bin/sh
```
<!--
In your shell, run the command:
-->
在 Shell 中運行命令：

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```
