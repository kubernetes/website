---
layout: blog
title: '基於 IPVS 的集羣內部負載均衡'
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

作者: Jun Du(華爲), Haibin Xie(華爲), Wei Liang(華爲)

注意: 這篇文章出自 系列深度文章 介紹 Kubernetes 1.11 的新特性

<!--

Introduction

Per the Kubernetes 1.11 release blog post , we announced that IPVS-Based In-Cluster Service Load Balancing graduates to General Availability. In this blog, we will take you through a deep dive of the feature.

-->

介紹

根據 Kubernetes 1.11 發佈的博客文章, 我們宣佈基於 IPVS 的集羣內部服務負載均衡已達到一般可用性。 在這篇博客中，我們將帶您深入瞭解該功能。

<!--

What Is IPVS?

IPVS (IP Virtual Server) is built on top of the Netfilter and implements transport-layer load balancing as part of the Linux kernel.

IPVS is incorporated into the LVS (Linux Virtual Server), where it runs on a host and acts as a load balancer in front of a cluster of real servers. IPVS can direct requests for TCP- and UDP-based services to the real servers, and make services of the real servers appear as virtual services on a single IP address. Therefore, IPVS naturally supports Kubernetes Service.

-->

什麼是 IPVS ?

IPVS (IP Virtual Server)是在 Netfilter 上層構建的，並作爲 Linux 內核的一部分，實現傳輸層負載均衡。

IPVS 集成在 LVS（Linux Virtual Server，Linux 虛擬服務器）中，它在主機上運行，並在物理服務器集羣前作爲負載均衡器。IPVS 可以將基於 TCP 和 UDP 服務的請求定向到真實服務器，並使真實服務器的服務在單個IP地址上顯示爲虛擬服務。 因此，IPVS 自然支持 Kubernetes 服務。

<!--

Why IPVS for Kubernetes?

As Kubernetes grows in usage, the scalability of its resources becomes more and more important. In particular, the scalability of services is paramount to the adoption of Kubernetes by developers/companies running large workloads.

Kube-proxy, the building block of service routing has relied on the battle-hardened iptables to implement the core supported Service types such as ClusterIP and NodePort. However, iptables struggles to scale to tens of thousands of Services because it is designed purely for firewalling purposes and is based on in-kernel rule lists.

Even though Kubernetes already support 5000 nodes in release v1.6, the kube-proxy with iptables is actually a bottleneck to scale the cluster to 5000 nodes. One example is that with NodePort Service in a 5000-node cluster, if we have 2000 services and each services have 10 pods, this will cause at least 20000 iptable records on each worker node, and this can make the kernel pretty busy.

On the other hand, using IPVS-based in-cluster service load balancing can help a lot for such cases. IPVS is specifically designed for load balancing and uses more efficient data structures (hash tables) allowing for almost unlimited scale under the hood.

-->

爲什麼爲 Kubernetes 選擇 IPVS ?

隨着 Kubernetes 的使用增長，其資源的可擴展性變得越來越重要。特別是，服務的可擴展性對於運行大型工作負載的開發人員/公司採用 Kubernetes 至關重要。

Kube-proxy 是服務路由的構建塊，它依賴於經過強化攻擊的 iptables 來實現支持核心的服務類型，如 ClusterIP 和 NodePort。 但是，iptables 難以擴展到成千上萬的服務，因爲它純粹是爲防火牆而設計的，並且基於內核規則列表。

儘管 Kubernetes 在版本v1.6中已經支持5000個節點，但使用 iptables 的 kube-proxy 實際上是將集羣擴展到5000個節點的瓶頸。 一個例子是，在5000節點集羣中使用 NodePort 服務，如果我們有2000個服務並且每個服務有10個 pod，這將在每個工作節點上至少產生20000個 iptable 記錄，這可能使內核非常繁忙。

另一方面，使用基於 IPVS 的集羣內服務負載均衡可以爲這種情況提供很多幫助。 IPVS 專門用於負載均衡，並使用更高效的數據結構（哈希表），允許幾乎無限的規模擴張。

<!--

IPVS-based Kube-proxy

Parameter Changes

Parameter: --proxy-mode In addition to existing userspace and iptables modes, IPVS mode is configured via --proxy-mode=ipvs. It implicitly uses IPVS NAT mode for service port mapping.

-->

基於 IPVS 的 Kube-proxy

參數更改

參數: --proxy-mode 除了現有的用戶空間和 iptables 模式，IPVS 模式通過--proxy-mode = ipvs 進行配置。 它隱式使用 IPVS NAT 模式進行服務端口映射。

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

參數: --ipvs-scheduler

添加了一個新的 kube-proxy 參數來指定 IPVS 負載均衡算法，參數爲 --ipvs-scheduler。 如果未配置，則默認爲 round-robin 算法（rr）。

- rr: round-robin
- lc: least connection
- dh: destination hashing
- sh: source hashing
- sed: shortest expected delay
- nq: never queue

將來，我們可以實現特定於服務的調度程序（可能通過註釋），該調度程序具有更高的優先級並覆蓋該值。

<!--

Parameter: --cleanup-ipvs Similar to the --cleanup-iptables parameter, if true, cleanup IPVS configuration and IPTables rules that are created in IPVS mode.

Parameter: --ipvs-sync-period Maximum interval of how often IPVS rules are refreshed (e.g. '5s', '1m'). Must be greater than 0.

Parameter: --ipvs-min-sync-period Minimum interval of how often the IPVS rules are refreshed (e.g. '5s', '1m'). Must be greater than 0.

-->

參數: --cleanup-ipvs 類似於 --cleanup-iptables 參數，如果爲 true，則清除在 IPVS 模式下創建的 IPVS 配置和 IPTables 規則。

參數: --ipvs-sync-period 刷新 IPVS 規則的最大間隔時間（例如'5s'，'1m'）。 必須大於0。

參數: --ipvs-min-sync-period 刷新 IPVS 規則的最小間隔時間間隔（例如'5s'，'1m'）。 必須大於0。

<!--

Parameter: --ipvs-exclude-cidrs  A comma-separated list of CIDR's which the IPVS proxier should not touch when cleaning up IPVS rules because IPVS proxier can't distinguish kube-proxy created IPVS rules from user original IPVS rules. If you are using IPVS proxier with your own IPVS rules in the environment, this parameter should be specified, otherwise your original rule will be cleaned.

-->

參數: --ipvs-exclude-cidrs  清除 IPVS 規則時 IPVS 代理不應觸及的 CIDR 的逗號分隔列表，因爲 IPVS 代理無法區分 kube-proxy 創建的 IPVS 規則和用戶原始規則 IPVS 規則。 如果您在環境中使用 IPVS proxier 和您自己的 IPVS 規則，則應指定此參數，否則將清除原始規則。

<!--

Design Considerations

IPVS Service Network Topology

When creating a ClusterIP type Service, IPVS proxier will do the following three things:

- Make sure a dummy interface exists in the node, defaults to kube-ipvs0
- Bind Service IP addresses to the dummy interface
- Create IPVS virtual servers for each Service IP address respectively
  -->

設計注意事項

IPVS 服務網絡拓撲

創建 ClusterIP 類型服務時，IPVS proxier 將執行以下三項操作：

- 確保節點中存在虛擬接口，默認爲 kube-ipvs0
- 將服務 IP 地址綁定到虛擬接口
- 分別爲每個服務 IP 地址創建 IPVS  虛擬服務器

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

這是一個例子:

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

請注意，Kubernetes 服務和 IPVS 虛擬服務器之間的關係是“1：N”。 例如，考慮具有多個 IP 地址的 Kubernetes 服務。 外部 IP 類型服務有兩個 IP 地址 - 集羣IP和外部 IP。 然後，IPVS 代理將創建2個 IPVS 虛擬服務器 - 一個用於集羣 IP，另一個用於外部 IP。 Kubernetes 的 endpoint（每個IP +端口對）與 IPVS 虛擬服務器之間的關係是“1：1”。

刪除 Kubernetes 服務將觸發刪除相應的 IPVS 虛擬服務器，IPVS 物理服務器及其綁定到虛擬接口的 IP 地址。

端口映射

IPVS 中有三種代理模式：NAT（masq），IPIP 和 DR。 只有 NAT 模式支持端口映射。 Kube-proxy 利用 NAT 模式進行端口映射。 以下示例顯示 IPVS 服務端口3080到Pod端口8080的映射。

    TCP  10.102.128.4:3080 rr
      -> 10.244.0.235:8080            Masq    1      0          0
      -> 10.244.1.237:8080            Masq    1      0

<!--

Session Affinity

IPVS supports client IP session affinity (persistent connection). When a Service specifies session affinity, the IPVS proxier will set a timeout value (180min=10800s by default) in the IPVS virtual server. For example:

-->

會話關係

IPVS 支持客戶端 IP 會話關聯（持久連接）。 當服務指定會話關係時，IPVS 代理將在 IPVS 虛擬服務器中設置超時值（默認爲180分鐘= 10800秒）。 例如：

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

IPVS 用於負載均衡，它無法處理 kube-proxy 中的其他問題，例如 包過濾，數據包欺騙，SNAT 等

IPVS proxier 在上述場景中利用 iptables。 具體來說，ipvs proxier 將在以下4種情況下依賴於 iptables：

- kube-proxy 以 --masquerade-all = true 開頭
- 在 kube-proxy 啓動中指定集羣 CIDR
- 支持 Loadbalancer 類型服務
- 支持 NodePort 類型的服務

但是，我們不想創建太多的 iptables 規則。 所以我們採用 ipset 來減少 iptables 規則。 以下是 IPVS proxier 維護的 ipset 集表：

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

  設置名稱                          	成員                                      	用法
  KUBE-CLUSTER-IP               	所有服務 IP + 端口                             	masquerade-all=true 或 clusterCIDR 指定的情況下進行僞裝
  KUBE-LOOP-BACK                	所有服務 IP +端口+ IP                          	解決數據包欺騙問題
  KUBE-EXTERNAL-IP              	服務外部 IP +端口                              	將數據包僞裝成外部 IP
  KUBE-LOAD-BALANCER            	負載均衡器入口 IP +端口                           	將數據包僞裝成 Load Balancer 類型的服務
  KUBE-LOAD-BALANCER-LOCAL      	負載均衡器入口 IP +端口 以及 externalTrafficPolicy=local	接受數據包到 Load Balancer externalTrafficPolicy=local
  KUBE-LOAD-BALANCER-FW         	負載均衡器入口 IP +端口 以及 loadBalancerSourceRanges	使用指定的 loadBalancerSourceRanges 丟棄 Load Balancer類型Service的數據包
  KUBE-LOAD-BALANCER-SOURCE-CIDR	負載均衡器入口 IP +端口 + 源 CIDR                  	接受 Load Balancer 類型 Service 的數據包，並指定loadBalancerSourceRanges
  KUBE-NODE-PORT-TCP            	NodePort 類型服務 TCP                         	將數據包僞裝成 NodePort（TCP）
  KUBE-NODE-PORT-LOCAL-TCP      	NodePort 類型服務 TCP 端口，帶有 externalTrafficPolicy=local	接受數據包到 NodePort 服務 使用 externalTrafficPolicy=local
  KUBE-NODE-PORT-UDP            	NodePort 類型服務 UDP 端口                       	將數據包僞裝成 NodePort(UDP)
  KUBE-NODE-PORT-LOCAL-UDP      	NodePort 類型服務 UDP 端口 使用 externalTrafficPolicy=local	接受數據包到NodePort服務 使用 externalTrafficPolicy=local

<!--

In general, for IPVS proxier, the number of iptables rules is static, no matter how many Services/Pods we have.

-->

通常，對於 IPVS proxier，無論我們有多少 Service/ Pod，iptables 規則的數量都是靜態的。

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

在 IPVS 模式下運行 kube-proxy

目前，本地腳本，GCE 腳本和 kubeadm 支持通過導出環境變量（KUBE_PROXY_MODE=ipvs）或指定標誌（--proxy-mode=ipvs）來切換 IPVS 代理模式。 在運行IPVS 代理之前，請確保已安裝 IPVS 所需的內核模塊。

    ip_vs
    ip_vs_rr
    ip_vs_wrr
    ip_vs_sh
    nf_conntrack_ipv4

最後，對於 Kubernetes v1.10，“SupportIPVSProxyMode” 默認設置爲 “true”。 對於 Kubernetes v1.11 ，該選項已完全刪除。 但是，您需要在v1.10之前爲Kubernetes 明確啓用 --feature-gates = SupportIPVSProxyMode = true。

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

參與其中

參與 Kubernetes 的最簡單方法是加入衆多[特別興趣小組](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIG）中與您的興趣一致的小組。 你有什麼想要向 Kubernetes 社區廣播的嗎？ 在我們的每週[社區會議](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting)或通過以下渠道分享您的聲音。

感謝您的持續反饋和支持。
在[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)上發佈問題（或回答問題）

加入[K8sPort](http://k8sport.org/)的倡導者社區門戶網站

在 Twitter 上關注我們 [@Kubernetesio](https://twitter.com/kubernetesio )獲取最新更新

在[Slack](http://slack.k8s.io/)上與社區聊天

分享您的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
