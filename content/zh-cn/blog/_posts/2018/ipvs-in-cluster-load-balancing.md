---
layout: blog
title: '基于 IPVS 的集群内部负载均衡'
date:   2018-07-09
slug: ipvs-based-in-cluster-load-balancing-deep-dive
---
<!-- 
layout: blog
title:  'IPVS-Based In-Cluster Load Balancing Deep Dive'
date:   2018-07-09
-->

<!--

Author: Jun Du(Huawei), Haibin Xie(Huawei), Wei Liang(Huawei)

Editor’s note: this post is part of a series of in-depth articles on what’s new in Kubernetes 1.11

-->

作者: Jun Du(华为), Haibin Xie(华为), Wei Liang(华为)

注意: 这篇文章出自 系列深度文章 介绍 Kubernetes 1.11 的新特性

<!--

Introduction

Per the Kubernetes 1.11 release blog post , we announced that IPVS-Based In-Cluster Service Load Balancing graduates to General Availability. In this blog, we will take you through a deep dive of the feature.

-->

介绍

根据 Kubernetes 1.11 发布的博客文章, 我们宣布基于 IPVS 的集群内部服务负载均衡已达到一般可用性。 在这篇博客中，我们将带您深入了解该功能。

<!--

What Is IPVS?

IPVS (IP Virtual Server) is built on top of the Netfilter and implements transport-layer load balancing as part of the Linux kernel.

IPVS is incorporated into the LVS (Linux Virtual Server), where it runs on a host and acts as a load balancer in front of a cluster of real servers. IPVS can direct requests for TCP- and UDP-based services to the real servers, and make services of the real servers appear as virtual services on a single IP address. Therefore, IPVS naturally supports Kubernetes Service.

-->

什么是 IPVS ?

IPVS (IP Virtual Server)是在 Netfilter 上层构建的，并作为 Linux 内核的一部分，实现传输层负载均衡。

IPVS 集成在 LVS（Linux Virtual Server，Linux 虚拟服务器）中，它在主机上运行，并在物理服务器集群前作为负载均衡器。IPVS 可以将基于 TCP 和 UDP 服务的请求定向到真实服务器，并使真实服务器的服务在单个IP地址上显示为虚拟服务。 因此，IPVS 自然支持 Kubernetes 服务。

<!--

Why IPVS for Kubernetes?

As Kubernetes grows in usage, the scalability of its resources becomes more and more important. In particular, the scalability of services is paramount to the adoption of Kubernetes by developers/companies running large workloads.

Kube-proxy, the building block of service routing has relied on the battle-hardened iptables to implement the core supported Service types such as ClusterIP and NodePort. However, iptables struggles to scale to tens of thousands of Services because it is designed purely for firewalling purposes and is based on in-kernel rule lists.

Even though Kubernetes already support 5000 nodes in release v1.6, the kube-proxy with iptables is actually a bottleneck to scale the cluster to 5000 nodes. One example is that with NodePort Service in a 5000-node cluster, if we have 2000 services and each services have 10 pods, this will cause at least 20000 iptable records on each worker node, and this can make the kernel pretty busy.

On the other hand, using IPVS-based in-cluster service load balancing can help a lot for such cases. IPVS is specifically designed for load balancing and uses more efficient data structures (hash tables) allowing for almost unlimited scale under the hood.

-->

为什么为 Kubernetes 选择 IPVS ?

随着 Kubernetes 的使用增长，其资源的可扩展性变得越来越重要。特别是，服务的可扩展性对于运行大型工作负载的开发人员/公司采用 Kubernetes 至关重要。

Kube-proxy 是服务路由的构建块，它依赖于经过强化攻击的 iptables 来实现支持核心的服务类型，如 ClusterIP 和 NodePort。 但是，iptables 难以扩展到成千上万的服务，因为它纯粹是为防火墙而设计的，并且基于内核规则列表。

尽管 Kubernetes 在版本v1.6中已经支持5000个节点，但使用 iptables 的 kube-proxy 实际上是将集群扩展到5000个节点的瓶颈。 一个例子是，在5000节点集群中使用 NodePort 服务，如果我们有2000个服务并且每个服务有10个 pod，这将在每个工作节点上至少产生20000个 iptable 记录，这可能使内核非常繁忙。

另一方面，使用基于 IPVS 的集群内服务负载均衡可以为这种情况提供很多帮助。 IPVS 专门用于负载均衡，并使用更高效的数据结构（哈希表），允许几乎无限的规模扩张。

<!--

IPVS-based Kube-proxy

Parameter Changes

Parameter: --proxy-mode In addition to existing userspace and iptables modes, IPVS mode is configured via --proxy-mode=ipvs. It implicitly uses IPVS NAT mode for service port mapping.

-->

基于 IPVS 的 Kube-proxy

参数更改

参数: --proxy-mode 除了现有的用户空间和 iptables 模式，IPVS 模式通过--proxy-mode = ipvs 进行配置。 它隐式使用 IPVS NAT 模式进行服务端口映射。

<!--

Parameter: --ipvs-scheduler

A new kube-proxy parameter has been added to specify the IPVS load balancing algorithm, with the parameter being --ipvs-scheduler. If it’s not configured, then round-robin (rr) is the default value.

- rr: round-robin
- lc: least connection
- dh: destination hashing
- sh: source hashing
- sed: shortest expected delay
- nq: never queue

In the future, we can implement Service specific scheduler (potentially via annotation), which has higher priority and overwrites the value.

-->

参数: --ipvs-scheduler

添加了一个新的 kube-proxy 参数来指定 IPVS 负载均衡算法，参数为 --ipvs-scheduler。 如果未配置，则默认为 round-robin 算法（rr）。

- rr: round-robin
- lc: least connection
- dh: destination hashing
- sh: source hashing
- sed: shortest expected delay
- nq: never queue

将来，我们可以实现特定于服务的调度程序（可能通过注释），该调度程序具有更高的优先级并覆盖该值。

<!--

Parameter: --cleanup-ipvs Similar to the --cleanup-iptables parameter, if true, cleanup IPVS configuration and IPTables rules that are created in IPVS mode.

Parameter: --ipvs-sync-period Maximum interval of how often IPVS rules are refreshed (e.g. '5s', '1m'). Must be greater than 0.

Parameter: --ipvs-min-sync-period Minimum interval of how often the IPVS rules are refreshed (e.g. '5s', '1m'). Must be greater than 0.

-->

参数: --cleanup-ipvs 类似于 --cleanup-iptables 参数，如果为 true，则清除在 IPVS 模式下创建的 IPVS 配置和 IPTables 规则。

参数: --ipvs-sync-period 刷新 IPVS 规则的最大间隔时间（例如'5s'，'1m'）。 必须大于0。

参数: --ipvs-min-sync-period 刷新 IPVS 规则的最小间隔时间间隔（例如'5s'，'1m'）。 必须大于0。

<!--

Parameter: --ipvs-exclude-cidrs  A comma-separated list of CIDR's which the IPVS proxier should not touch when cleaning up IPVS rules because IPVS proxier can't distinguish kube-proxy created IPVS rules from user original IPVS rules. If you are using IPVS proxier with your own IPVS rules in the environment, this parameter should be specified, otherwise your original rule will be cleaned.

-->

参数: --ipvs-exclude-cidrs  清除 IPVS 规则时 IPVS 代理不应触及的 CIDR 的逗号分隔列表，因为 IPVS 代理无法区分 kube-proxy 创建的 IPVS 规则和用户原始规则 IPVS 规则。 如果您在环境中使用 IPVS proxier 和您自己的 IPVS 规则，则应指定此参数，否则将清除原始规则。

<!--

Design Considerations

IPVS Service Network Topology

When creating a ClusterIP type Service, IPVS proxier will do the following three things:

- Make sure a dummy interface exists in the node, defaults to kube-ipvs0
- Bind Service IP addresses to the dummy interface
- Create IPVS virtual servers for each Service IP address respectively
  -->

设计注意事项

IPVS 服务网络拓扑

创建 ClusterIP 类型服务时，IPVS proxier 将执行以下三项操作：

- 确保节点中存在虚拟接口，默认为 kube-ipvs0
- 将服务 IP 地址绑定到虚拟接口
- 分别为每个服务 IP 地址创建 IPVS  虚拟服务器

<!--

Here comes an example:

    # kubectl describe svc nginx-service
    Name:			nginx-service
    ...
    Type:			ClusterIP
    IP:			    10.102.128.4
    Port:			http	3080/TCP
    Endpoints:		10.244.0.235:8080,10.244.1.237:8080
    Session Affinity:	None

    # ip addr
    ...
    73: kube-ipvs0: <BROADCAST,NOARP> mtu 1500 qdisc noop state DOWN qlen 1000
        link/ether 1a:ce:f5:5f:c1:4d brd ff:ff:ff:ff:ff:ff
        inet 10.102.128.4/32 scope global kube-ipvs0
           valid_lft forever preferred_lft forever

    # ipvsadm -ln
    IP Virtual Server version 1.2.1 (size=4096)
    Prot LocalAddress:Port Scheduler Flags
      -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
    TCP  10.102.128.4:3080 rr
      -> 10.244.0.235:8080            Masq    1      0          0
      -> 10.244.1.237:8080            Masq    1      0          0

-->

这是一个例子:

    # kubectl describe svc nginx-service
    Name:			nginx-service
    ...
    Type:			ClusterIP
    IP:			    10.102.128.4
    Port:			http	3080/TCP
    Endpoints:		10.244.0.235:8080,10.244.1.237:8080
    Session Affinity:	None

    # ip addr
    ...
    73: kube-ipvs0: <BROADCAST,NOARP> mtu 1500 qdisc noop state DOWN qlen 1000
        link/ether 1a:ce:f5:5f:c1:4d brd ff:ff:ff:ff:ff:ff
        inet 10.102.128.4/32 scope global kube-ipvs0
           valid_lft forever preferred_lft forever

    # ipvsadm -ln
    IP Virtual Server version 1.2.1 (size=4096)
    Prot LocalAddress:Port Scheduler Flags
      -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
    TCP  10.102.128.4:3080 rr
      -> 10.244.0.235:8080            Masq    1      0          0
      -> 10.244.1.237:8080            Masq    1      0          0

<!--

Please note that the relationship between a Kubernetes Service and IPVS virtual servers is 1:N. For example, consider a Kubernetes Service that has more than one IP address. An External IP type Service has two IP addresses - ClusterIP and External IP. Then the IPVS proxier will create 2 IPVS virtual servers - one for Cluster IP and another one for External IP. The relationship between a Kubernetes Endpoint (each IP+Port pair) and an IPVS virtual server is 1:1.

Deleting of a Kubernetes service will trigger deletion of the corresponding IPVS virtual server, IPVS real servers and its IP addresses bound to the dummy interface.

Port Mapping

There are three proxy modes in IPVS: NAT (masq), IPIP and DR. Only NAT mode supports port mapping. Kube-proxy leverages NAT mode for port mapping. The following example shows IPVS mapping Service port 3080 to Pod port 8080.

-->

请注意，Kubernetes 服务和 IPVS 虚拟服务器之间的关系是“1：N”。 例如，考虑具有多个 IP 地址的 Kubernetes 服务。 外部 IP 类型服务有两个 IP 地址 - 集群IP和外部 IP。 然后，IPVS 代理将创建2个 IPVS 虚拟服务器 - 一个用于集群 IP，另一个用于外部 IP。 Kubernetes 的 endpoint（每个IP +端口对）与 IPVS 虚拟服务器之间的关系是“1：1”。

删除 Kubernetes 服务将触发删除相应的 IPVS 虚拟服务器，IPVS 物理服务器及其绑定到虚拟接口的 IP 地址。

端口映射

IPVS 中有三种代理模式：NAT（masq），IPIP 和 DR。 只有 NAT 模式支持端口映射。 Kube-proxy 利用 NAT 模式进行端口映射。 以下示例显示 IPVS 服务端口3080到Pod端口8080的映射。

    TCP  10.102.128.4:3080 rr
      -> 10.244.0.235:8080            Masq    1      0          0
      -> 10.244.1.237:8080            Masq    1      0

<!--

Session Affinity

IPVS supports client IP session affinity (persistent connection). When a Service specifies session affinity, the IPVS proxier will set a timeout value (180min=10800s by default) in the IPVS virtual server. For example:

-->

会话关系

IPVS 支持客户端 IP 会话关联（持久连接）。 当服务指定会话关系时，IPVS 代理将在 IPVS 虚拟服务器中设置超时值（默认为180分钟= 10800秒）。 例如：

    # kubectl describe svc nginx-service
    Name:			nginx-service
    ...
    IP:			    10.102.128.4
    Port:			http	3080/TCP
    Session Affinity:	ClientIP

    # ipvsadm -ln
    IP Virtual Server version 1.2.1 (size=4096)
    Prot LocalAddress:Port Scheduler Flags
      -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
    TCP  10.102.128.4:3080 rr persistent 10800

<!--

Iptables & Ipset in IPVS Proxier

IPVS is for load balancing and it can't handle other workarounds in kube-proxy, e.g. packet filtering, hairpin-masquerade tricks, SNAT, etc.

IPVS proxier leverages iptables in the above scenarios. Specifically, ipvs proxier will fall back on iptables in the following 4 scenarios:

- kube-proxy start with --masquerade-all=true
- Specify cluster CIDR in kube-proxy startup
- Support Loadbalancer type service
- Support NodePort type service

However, we don't want to create too many iptables rules. So we adopt ipset for the sake of decreasing iptables rules. The following is the table of ipset sets that IPVS proxier maintains:

-->

IPVS 代理中的 Iptables 和 Ipset

IPVS 用于负载均衡，它无法处理 kube-proxy 中的其他问题，例如 包过滤，数据包欺骗，SNAT 等

IPVS proxier 在上述场景中利用 iptables。 具体来说，ipvs proxier 将在以下4种情况下依赖于 iptables：

- kube-proxy 以 --masquerade-all = true 开头
- 在 kube-proxy 启动中指定集群 CIDR
- 支持 Loadbalancer 类型服务
- 支持 NodePort 类型的服务

但是，我们不想创建太多的 iptables 规则。 所以我们采用 ipset 来减少 iptables 规则。 以下是 IPVS proxier 维护的 ipset 集表：

<!--

  set name                      	members                                 	usage
  KUBE-CLUSTER-IP               	All Service IP + port                   	masquerade for cases that masquerade-all=true or clusterCIDR specified
  KUBE-LOOP-BACK                	All Service IP + port + IP              	masquerade for resolving hairpin issue
  KUBE-EXTERNAL-IP              	Service External IP + port              	masquerade for packets to external IPs
  KUBE-LOAD-BALANCER            	Load Balancer ingress IP + port         	masquerade for packets to Load Balancer type service
  KUBE-LOAD-BALANCER-LOCAL      	Load Balancer ingress IP + port with externalTrafficPolicy=local	accept packets to Load Balancer with externalTrafficPolicy=local
  KUBE-LOAD-BALANCER-FW         	Load Balancer ingress IP + port with loadBalancerSourceRanges	Drop packets for Load Balancer type Service with loadBalancerSourceRanges specified
  KUBE-LOAD-BALANCER-SOURCE-CIDR	Load Balancer ingress IP + port + source CIDR	accept packets for Load Balancer type Service with loadBalancerSourceRanges specified
  KUBE-NODE-PORT-TCP            	NodePort type Service TCP port          	masquerade for packets to NodePort(TCP)
  KUBE-NODE-PORT-LOCAL-TCP      	NodePort type Service TCP port with externalTrafficPolicy=local	accept packets to NodePort Service with externalTrafficPolicy=local
  KUBE-NODE-PORT-UDP            	NodePort type Service UDP port          	masquerade for packets to NodePort(UDP)
  KUBE-NODE-PORT-LOCAL-UDP      	NodePort type service UDP port with externalTrafficPolicy=local	accept packets to NodePort Service with externalTrafficPolicy=local

-->

  设置名称                          	成员                                      	用法
  KUBE-CLUSTER-IP               	所有服务 IP + 端口                             	masquerade-all=true 或 clusterCIDR 指定的情况下进行伪装
  KUBE-LOOP-BACK                	所有服务 IP +端口+ IP                          	解决数据包欺骗问题
  KUBE-EXTERNAL-IP              	服务外部 IP +端口                              	将数据包伪装成外部 IP
  KUBE-LOAD-BALANCER            	负载均衡器入口 IP +端口                           	将数据包伪装成 Load Balancer 类型的服务
  KUBE-LOAD-BALANCER-LOCAL      	负载均衡器入口 IP +端口 以及 externalTrafficPolicy=local	接受数据包到 Load Balancer externalTrafficPolicy=local
  KUBE-LOAD-BALANCER-FW         	负载均衡器入口 IP +端口 以及 loadBalancerSourceRanges	使用指定的 loadBalancerSourceRanges 丢弃 Load Balancer类型Service的数据包
  KUBE-LOAD-BALANCER-SOURCE-CIDR	负载均衡器入口 IP +端口 + 源 CIDR                  	接受 Load Balancer 类型 Service 的数据包，并指定loadBalancerSourceRanges
  KUBE-NODE-PORT-TCP            	NodePort 类型服务 TCP                         	将数据包伪装成 NodePort（TCP）
  KUBE-NODE-PORT-LOCAL-TCP      	NodePort 类型服务 TCP 端口，带有 externalTrafficPolicy=local	接受数据包到 NodePort 服务 使用 externalTrafficPolicy=local
  KUBE-NODE-PORT-UDP            	NodePort 类型服务 UDP 端口                       	将数据包伪装成 NodePort(UDP)
  KUBE-NODE-PORT-LOCAL-UDP      	NodePort 类型服务 UDP 端口 使用 externalTrafficPolicy=local	接受数据包到NodePort服务 使用 externalTrafficPolicy=local

<!--

In general, for IPVS proxier, the number of iptables rules is static, no matter how many Services/Pods we have.

-->

通常，对于 IPVS proxier，无论我们有多少 Service/ Pod，iptables 规则的数量都是静态的。

<!--

Run kube-proxy in IPVS Mode

Currently, local-up scripts, GCE scripts, and kubeadm support switching IPVS proxy mode via exporting environment variables (KUBE_PROXY_MODE=ipvs) or specifying flag (--proxy-mode=ipvs). Before running IPVS proxier, please ensure IPVS required kernel modules are already installed.

    ip_vs
    ip_vs_rr
    ip_vs_wrr
    ip_vs_sh
    nf_conntrack_ipv4

Finally, for Kubernetes v1.10, feature gate SupportIPVSProxyMode is set to true by default. For Kubernetes v1.11, the feature gate is entirely removed. However, you need to enable --feature-gates=SupportIPVSProxyMode=true explicitly for Kubernetes before v1.10.

-->

在 IPVS 模式下运行 kube-proxy

目前，本地脚本，GCE 脚本和 kubeadm 支持通过导出环境变量（KUBE_PROXY_MODE=ipvs）或指定标志（--proxy-mode=ipvs）来切换 IPVS 代理模式。 在运行IPVS 代理之前，请确保已安装 IPVS 所需的内核模块。

    ip_vs
    ip_vs_rr
    ip_vs_wrr
    ip_vs_sh
    nf_conntrack_ipv4

最后，对于 Kubernetes v1.10，“SupportIPVSProxyMode” 默认设置为 “true”。 对于 Kubernetes v1.11 ，该选项已完全删除。 但是，您需要在v1.10之前为Kubernetes 明确启用 --feature-gates = SupportIPVSProxyMode = true。

<!--

Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many Special Interest Groups (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly community meeting, and through the channels below.

Thank you for your continued feedback and support.

Post questions (or answer questions) on Stack Overflow

Join the community portal for advocates on K8sPort

Follow us on Twitter @Kubernetesio for latest updates

Chat with the community on Slack

Share your Kubernetes story

-->

参与其中

参与 Kubernetes 的最简单方法是加入众多[特别兴趣小组](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIG）中与您的兴趣一致的小组。 你有什么想要向 Kubernetes 社区广播的吗？ 在我们的每周[社区会议](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting)或通过以下渠道分享您的声音。

感谢您的持续反馈和支持。
在[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)上发布问题（或回答问题）

加入[K8sPort](http://k8sport.org/)的倡导者社区门户网站

在 Twitter 上关注我们 [@Kubernetesio](https://twitter.com/kubernetesio )获取最新更新

在[Slack](http://slack.k8s.io/)上与社区聊天

分享您的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
