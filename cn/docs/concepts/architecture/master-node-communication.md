---
approvers:
- dchen1107
- roberthbailey
- liggitt

title: Master 节点通信
---

* TOC
{:toc}


## 概览


本文对 Master 节点（确切说是 apiserver）和 Kubernetes 集群之间的通信路径进行了分类。目的是为了让用户能够自定义他们的安装，对网络配置进行加固，使得集群能够在不可信的网络上（或者在一个云服务商完全公共的 IP 上）运行。


## Cluster -> Master


所有从集群到 master 的通信路径都终止于 apiserver（其它 master 组件没有被设计为可暴露远程服务）。在一个典型的部署中，apiserver 被配置为在一个安全的 HTTPS 端口（443）上监听远程连接并启用一种或多种形式的客户端[身份认证](/docs/admin/authentication/)机制。一种或多种客户端[身份认证](/docs/admin/authentication/)机制应该被启用，特别是在允许使用 [匿名请求](/docs/admin/authentication/#anonymous-requests) 或 [service account tokens](/docs/admin/authentication/#service-account-tokens) 的时候。


应该使用集群的公共根证书开通节点，如此它们就能够基于有效的客户端凭据安全的连接 apiserver。例如：在一个默认的 GCE 部署中，客户端凭据以客户端证书的形式提供给 kubelet。请查看 [kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/) 获取如何自动提供 kubelet 客户端证书。


想要连接到 apiserver 的 Pods 可以使用一个 service account 安全的进行连接。这种情况下，当 Pods 被实例化时 Kubernetes 将自动的把公共根证书和一个有效的不记名令牌注入到 pod 里。`kubernetes` service （所有 namespaces 中）都配置了一个虚拟 IP 地址，用于转发（通过 kube-proxy）请求到 apiserver 的 HTTPS endpoint。


Master 组件通过非安全（没有加密或认证）端口和集群的 apiserver 通信。这个端口通常只在 master 节点的 localhost 接口暴露，这样，所有在相同机器上运行的 master 组件就能和集群的 apiserver 通信。一段时间以后，master 组件将变为使用带身份认证和权限验证的安全端口（查看[#13598](https://github.com/kubernetes/kubernetes/issues/13598)）。


这样的结果使得从集群（在节点上运行的 nodes 和 pods）到 master 的缺省连接操作模式默认被保护，能够在不可信或公网中运行。


## Master -> Cluster


从 master（apiserver）到集群有两种主要的通信路径。第一种是从 apiserver 到集群中每个节点上运行的 kubelet 进程。第二种是从 apiserver 通过它的代理功能到任何 node、pod 或者 service。


### apiserver -> kubelet


从 apiserver 到 kubelet 的连接用于获取 pods 日志、连接（通过 kubectl）运行中的 pods，以及使用 kubele 的端口转发功能。这些连接终止于 kubelet 的 HTTPS endpoint。


默认的，apiserver 不会验证 kubelet 的服务证书，这会导致连接遭到中间人攻击，因而在不可信或公共网络上是不安全的。  


为了对这个连接进行认证，请使用 `--kubelet-certificate-authority` 标记给 apiserver 提供一个根证书捆绑，用于 kubelet 的服务证书。


如果这样不可能，又要求避免在不可信的或公共的网络上进行连接，请在 apiserver 和 kubelet 之间使用 [SSH 隧道](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)。


最后，应该启用[Kubelet 用户认证和/或权限认证](/docs/admin/kubelet-authentication-authorization/)来保护 kubelet API。


### apiserver -> nodes, pods, and services


从 apiserver 到 node、pod或者service 的连接默认为纯 HTTP 方式，因此既没有认证，也没有加密。他们能够通过给API URL 中的 node、pod 或 service 名称添加前缀 `https:` 来运行在安全的 HTTPS 连接上。但他们即不会认证 HTTPS endpoint 提供的证书，也不会提供客户端证书。这样虽然连接是加密的，但它不会提供任何完整性保证。这些连接**目前还不能安全的**在不可信的或公共的网络上运行。


### SSH 隧道


[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs/) 使用 SSH 隧道保护 Master -> Cluster 通信路径。在这种配置下，apiserver 发起一个到集群中每个节点的 SSH 隧道（连接到在 22 端口监听的 ssh 服务）并通过这个隧道传输所有到 kubelet、node、pod 或者 service 的流量。这个隧道保证流量不会在集群运行的私有 GCE 网络之外暴露。
