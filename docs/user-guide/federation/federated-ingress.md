---
title: 联邦 Ingress
---

本指南介绍如何使用 Kubernetes 联邦 Ingress[入口] 在多个 Kubernetes 集群所在的联邦服务上，部署常见的 HTTPS 虚拟 IP 负载均衡器。自版本v1.4开始，K8S 就已经支持 Google Cloud 托管的集群服务了(包含 GKE和GCE,或两者)。

这样可以轻松部署一个服务，可以在单个静态IP地址上可靠地为来自全球各地的Web客户端提供 HTTP(S) 流量。
通过智能请求路由和自动复本重定位，确保网络延迟低、容错能力强、管理简单 (使用 [联邦 ReplicaSets](docs/user-guide/federation/federated-replicaset.md))。
客户端通过最优的网络路径自动路由到最近可用容量的集群 (尽管所有客户端都使用完全相同的静态 IP 地址)。负载均衡器自动检测包含服务 POD 的运行状况，并避免向未响应或缓慢的 POD (或整个无响应集群) 发送请求。

联邦 Ingress 作为 alpha 功能发布，并在 Kubernetes版本1.4中支持 Google 云平台 (GKE,
GCE 和涉及两者的混合方案)。目前正在开展的工作，以支持其他云提供商 (如 AWS) 和其他混合云方案 (例如 跨么有内部部署的服务以及公有云 Kubernetes 集群)。我们欢迎您的反馈。

* TOC
{:toc}

## 前提条件

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/) ，特别是对 [Ingress](/docs/user-guide/ingress/) 要有些了解。

## 概述

联邦 Ingresses 以与传统[Kubernetes Ingresses](/docs/user-guide/ingress/) 相同的方式创建: 通过指定逻辑入口点的所需属性，进行 API 调用。在联邦入口的状态下，此 API 调用针对的是联邦 API 端点，而不是 Kubernetes 集群 API 端点。联邦入口 API 与传统的 Kubernetes 服务 API 100% 兼容。

一旦创建，联邦入口自动有如下特性:

1. 在集群联邦中的每个集群中创建匹配的 Kubernetes Ingress 对象。
2. 确保所有这些集群中的入口对象全局共享相同的逻辑 L7 (即 HTTP(S)) 负载均衡器和 IP 地址。
3. 监测每个集群入口后端的服务对象(即 pods) 的健康和容量。
4. 确保所有客户端连接，始终路由到适当且健康的后端服务端点，即使在部分 pod、集群、区域不可用的情况下也是如此。

请注意，在 Google 云平台下，逻辑 L7 负载均衡器不是一个单一的物理设置 (它将呈现现单一节点故障，导致服务不可用)，而是一个[真正全球性、高可用性负载均衡管理服务](https://cloud.google.com/load-balancing/)，通过一个静态的全局可访问 IP。

您的联邦 Kubernetes 集群 (即 Pods) 内的客户端将被自动路由到联邦服务的集群本地对象。如果它们存在并且是健康的，则支持其集群中的 Ingress，如果不存在，则不再是其他集群中最接近的健康对象(即 Pods)。请注意，这涉及到位于本地以外的HTTP(s) 负载均衡器的网络访问 Kubernetes 集群，但在同一个 GCP 区域内。

## 创建一个联邦 ingress

您可以以任何常规方式创建联邦入口，例如 使用 kubectl:

``` shell
kubectl --context=federation-cluster create -f myingress.yaml
```
例如 ingress YAML 配置，请参阅 [Ingress 用户指南](/docs/user-guide/ingress/)
此选项 '--context=federation-cluster' 标记告诉 kubectl 提交请求到联邦 API 端点，并附加相应的证书。如果您尚未配置此类上下文，请访问[联邦管理员指南](/docs/admin/federation/) 或其中之一
[管理教程](https://github.com/kelseyhightower/kubernetes-cluster-federation)找出如何做到这一点。

如上所述，联邦 Ingress 将自动在联邦的所有集群中创建和维护匹配的所有 Kubernetes ingresses。
这些集群特定的 ingresses (以及相关的 ingress 控制器) 配置，管理负载均衡以及基础架构健康检查，确保流量对每个集群进行适当的负载均衡。

您可以通过检查每个基础集群来验证这一点，例如:

``` shell
kubectl --context=gce-asia-east1a get ingress myingress
NAME        HOSTS     ADDRESS           PORTS     AGE
myingress      *         130.211.5.194   80, 443   1m
```

以上假设您在您的客户端中为您的集群在该区域中配置了名为 'gce-asia-east1a' 的上下文。
底层的 Ingress 的名称和命名空间将自动匹配您在上面创建的联邦 Ingress 的名称 (如果您的基础集群恰好存在相同名称的命名空间的 Ingress,则它们将自动被联邦 Ingress 更新以符合您的联邦 Ingress 规范 - 无论哪种方式，最终 张果将是一样的)。

联邦 Ingress 的状态将自动实时反馈到底层的 Kubernetes ingresses, 例如:

``` shell
$kubectl --context=federation-cluster describe ingress myingress

Name:           myingress
Namespace:      default
Address:        130.211.5.194
TLS:
  tls-secret terminates
Rules:
  Host  Path    Backends
  ----  ----    --------
  * *   echoheaders-https:80 (10.152.1.3:8080,10.152.2.4:8080)
Annotations:
  https-target-proxy:       k8s-tps-default-myingress--ff1107f83ed600c0
  target-proxy:         k8s-tp-default-myingress--ff1107f83ed600c0
  url-map:          k8s-um-default-myingress--ff1107f83ed600c0
  backends:         {"k8s-be-30301--ff1107f83ed600c0":"Unknown"}
  forwarding-rule:      k8s-fw-default-myingress--ff1107f83ed600c0
  https-forwarding-rule:    k8s-fws-default-myingress--ff1107f83ed600c0
Events:
  FirstSeen LastSeen    Count   From                SubobjectPath   Type        Reason  Message
  --------- --------    -----   ----                -------------   --------    ------  -------
  3m        3m      1   {loadbalancer-controller }          Normal      ADD default/myingress
  2m        2m      1   {loadbalancer-controller }          Normal      CREATE  ip: 130.211.5.194
```

注意:

1. 联邦 Ingress 的地址对应于所有底层的 Kubernetes 入口 (一旦地址被分配-这可能需要几分钟)。
2. 我们未提供任何后端的 Pods 来接管 Ingress 的网络流量。 (即 '服务端点' 后面的服务支持 Ingress )，所以联邦 Ingress 不会考虑这些健康的 Pods,不会将流量引导到这些集群。
3. 联邦控制系统将自动重新配置联邦中所有集群中的负载均衡控制器，使其一致，并允许它们共享全局负载均衡器。但是，如果这些集群中没有预先存在的 Igresses，则此重新配置将成功完成。 (这是一个安全功能，可为防止意外破坏现在有的 Ingress)。所以要确保您的联邦 ingresses 功能正常，从新的、空的集群开始，或制作确保您删除 (并在必要时重新创建) 所有预先存在的，包含您的联邦群组中的 Ingresses。

#添加后端服务和 pods

为了使底层的 Ingress 健康，我们需要在 Ingress 所基于的服务后面添加后端 Pods。有几种方法可以实现这一点，但最简单的是创建一个[联邦 Service](federated-services.md) 和
[联邦 Replicaset](federated-replicasets.md)。在上述用户指南中涵盖了这些工作的详细信息 - 在这里我们将简单地使用它们，在联邦的 13 个基础集群中创建适当标签的 pods 和 服务:

``` shell
kubectl --context=federation-cluster create -f services/nginx.yaml
```

``` shell
kubectl --context=federation-cluster create -f myreplicaset.yaml
```

请注意，为使您的联邦 ingress 在 Google 云上正常工作, 所有基础集群本地服务的节点端口都必须相同。如果您使用联邦服务，这很容易做到。只需要选择一个尚未在任何集群中使用的节点端口，并将其添加到联邦服务规范中。如果不为联邦服务指定节点端口，则每个集群将选择自己的节点端口作为其服务的集群本地分片，并且这些端点可能会有不同，这不是您想要的。

例如，您可以通过检查每一个基础集群来验证这一点:

``` shell
kubectl --context=gce-asia-east1a get services nginx
NAME      CLUSTER-IP     EXTERNAL-IP      PORT(S)   AGE
nginx     10.63.250.98   104.199.136.89   80/TCP    9m
```


## 混合云功能

Kuberntes 集群联邦可以包括运行集群的不同云提供商 (例如 Google 云, AWS)，和内部部署(例如 在OpenStack上)。然而，在 Kubernetes 版本v1.4中，联邦 Ingress 只支持 Google 云集群。在未来的版本，我们打算支持基于 Ingress 的混合云部署。

## 暴露联邦 ingress

Ingress 对象 (在纯 Kubernets 集群和联邦集群) 会暴露一个或多个 IP 地址 (通过 Status.Loadbalancer.Ingress 域)，该地址在 Ingress 对象的生命周期内保持静态。 (将来会自动管理 DNS 名称)。 所有客户端 (无论是内部集群，或是外部网络或互联网上) 应该连接到这些 IP 地址之一或 DNS 地址。如上所述，所有客户端请求都通过最短的网络路径自动路由到与请求原点最近的集群中的健康端口。例如， HTTP(S) 来自欧洲互联网用户的请求将直接路由到具有可用容量的欧洲最接近的集群。如果在欧洲没有这样的集群，则请求将被路由到下一个最接近的集群 (通常在美国)。

## 处理后端的 pods 和整个集群的故障

Ingresses 由服务支持， 服务通常由一个或多个(但不总是) ReplicaSets 支持。 如前所述，对于联邦 Ingresses，通常的做法是使用服务和 ReplicaSets 的组合来支持 (查看[联邦服务](federated-services.md) 和
[联邦 ReplicaSets](federated-replicasets.md)) 。

特别的是，联邦 ReplicaSets 确保即使在节点发生故障的情况下，所需数量的 Pod 也保持在每个集群中运行。在整个集群或可用区域故障的情况下，联邦 ReplicaSets 会自动将其他可用集群放置在联邦中的其他可用集群中，以适应以前由现在不可用集群提供的流量。联邦 ReplicaSet 确保足够的幅本保持运行，联邦 Ingress 可确保用户流量自动从故障集群重定向到其他可用集群。

## 已知问题

GCE L7 负载均衡器的和后端和健康检查已知"异常"; 这是由于联邦基础集群中的防火墙规则冲突，这可能会相互覆盖。要解决此问题，您可以手动安装防火墙规则，以暴露联邦 Ingress 对象在联邦中的所有基础集群的目标。
通过这种方式，健康检查可以持续通过，GCE L7 负载均衡器可以保持稳定，您使用
[`gcloud`](https://cloud.google.com/sdk/gcloud/) 命令行工具安装规则,
[Google Cloud Console](https://console.cloud.google.com) 或
[Google Compute Engine APIs](https://cloud.google.com/compute/docs/reference/latest/)。

您可以使用以下方式
[`gcloud`](https://cloud.google.com/sdk/gcloud/) 安装这些规则:

```shell
gcloud compute firewall-rules create <firewall-rule-name> \
  --source-ranges 130.211.0.0/22 --allow [<service-nodeports>] \
  --target-tags [<target-tags>] \
  --network <network-name>
```

注解:

1. `firewall-rule-name` 可以是任何名字。
2. `[<service-nodeports>]` 逗号分隔列表,返回联邦 Ingress 的服务相对应的节点端口。
3. [<target-tags>] 逗号分隔列表，是分配给 Kubernetes 集群中节点点的目标标签。
4. <network-name> 是必须安装防火墙规则的网络名称。

样例:
```shell
gcloud compute firewall-rules create my-federated-ingress-firewall-rule \
  --source-ranges 130.211.0.0/22 --allow tcp:30301, tcp:30061, tcp:34564 \
  --target-tags my-cluster-1-minion, my-cluster-2-minion \
  --network default
```


## 故障排除

#### 我无法连接到我的集群联邦 API
检查你的

1. 客户端 (通常是 kubectl) 被正确配置 (包括 API 端点和登录凭据)， 以及
2. 集群联邦 API 服务器正在运行并且可以网络连接。

请参阅 [联邦管理员指南](/docs/admin/federation/) 学习
如何正确启动集群联邦(或让您的集群管理员为您执行此操作)，以及如何正确配置客户端。

#### 我可以针对集群联邦 API 成功创建 ingress/service/replicaset，但是在我的基础集群中不会创建匹配的 ingresses/services/replicasets。

检查:

1. 您的集群已正确注册到集群联邦 API (`kubectl describe clusters`) 中。
2. 您的集群都是 'Active'。这意味着集群联邦系统能够连接和验证集群的端点。如果没有，请查看联邦控制管理器 POD 事件，以确定故障是什么。(`kubectl --namespace=federation logs $(kubectl get pods --namespace=federation -l module=federation-controller-manager -oname`)
3. 提供给集群联邦 API 的登录凭据对于集群具有正确的授权和配额来创建相关命名空间中的
   ingresses/services/replicasets 集群。如果不是这样，您应该会看到相关的错误信息，提供以上事件日志文件以查看更多细节。
4. 是否有任何其他错误阻止了服务创建操作成功 (查找 `ingress-controller`,
   `service-controller` 或 `replicaset-controller`,`kubectl logs federation-controller-manager --namespace federation` 输出中的错误)。

#### 我可以成功创建一个联邦 ingress，但请求的负载没有正确地分布在基础集群中。

检查:

1. 每个集群中的联邦 ingress 服务所在的节点端口是否相同。参见 [above](#creating_a_federated_ingress) 进一步解释。
2. 每个集群中的负载均衡控制器都是正确类型 ("GLBC")，并已被正确重新配置到联邦控制层，共享全局 GCE 负载均衡器(这应该自动发生)。如果它们是正确的类型，并被正确重新配置，则每个集群中GLBC 配置映射中的UID数据项在所有集群中都是相同的。
   [看 GLBC 文档](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/gce/BETA_LIMITATIONS.md#changing-the-cluster-uid)
   获取详细信息。
   如果不是这种情况，请检查联邦控制管理器的日志，以确定此自动重新配置可能失败的原因。
3. 在上述重新配置负载均衡控制器成功完成之前，不会在任何集群中手动创建 ingresses。在重新配置GLBC 之前，创建的 Ingress 将干扰重新配置后创建的联邦 Ingresses 的行为。 (see
    [请参阅 GLBC 文档](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/gce/BETA_LIMITATIONS.md#changing-the-cluster-uid)
    了解更多信息。为解决此问题，删除集群加入联邦之前创建的任何 Ingress (并重新配置 GLBC)，并在必要时重新创建。

#### 此故障排除指南没有帮助我解决我的问题

请使用我们的 [支持渠道](http://kubernetes.io/docs/troubleshooting/) 寻求更多帮助。

## 了解更多信息

 * [联邦提案](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/federation.md) 详细介绍了这一工作的情况。
