---
layout: blog
title:  'IPVS-Based In-Cluster Load Balancing Deep Dive'
date:   2018-07-09
author: >
  Jun Du (Huawei),
  Haibin Xie (Huawei),
  Wei Liang (Huawei) 
---

**Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) on what’s new in Kubernetes 1.11**

## Introduction

Per [the Kubernetes 1.11 release blog post ](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/), we announced that IPVS-Based In-Cluster Service Load Balancing graduates to General Availability. In this blog, we will take you through a deep dive of the feature.

## What Is IPVS?

**IPVS** (**IP Virtual Server**) is built on top of the Netfilter and implements transport-layer load balancing as part of the Linux kernel.

IPVS is incorporated into the LVS (Linux Virtual Server), where it runs on a host and acts as a load balancer in front of a cluster of real servers. IPVS can direct requests for TCP- and UDP-based services to the real servers, and make services of the real servers appear as virtual services on a single IP address. Therefore, IPVS naturally supports Kubernetes Service.

## Why IPVS for Kubernetes?

As Kubernetes grows in usage, the scalability of its resources becomes more and more important. In particular, the scalability of services is paramount to the adoption of Kubernetes by developers/companies running large workloads.

Kube-proxy, the building block of service routing has relied on the battle-hardened iptables to implement the core supported Service types such as ClusterIP and NodePort. However, iptables struggles to scale to tens of thousands of Services because it is designed purely for firewalling purposes and is based on in-kernel rule lists.

Even though Kubernetes already support 5000 nodes in release v1.6, the kube-proxy with iptables is actually a bottleneck to scale the cluster to 5000 nodes. One example is that with NodePort Service in a 5000-node cluster, if we have 2000 services and each services have 10 pods, this will cause at least 20000 iptable records on each worker node, and this can make the kernel pretty busy.

On the other hand, using IPVS-based in-cluster service load balancing can help a lot for such cases. IPVS is specifically designed for load balancing and uses more efficient data structures (hash tables) allowing for almost unlimited scale under the hood.

## IPVS-based Kube-proxy

### Parameter Changes

**Parameter: --proxy-mode** In addition to existing userspace and iptables modes, IPVS mode is configured via `--proxy-mode=ipvs`. It implicitly uses IPVS NAT mode for service port mapping.

**Parameter: --ipvs-scheduler**

A new kube-proxy parameter has been added to specify the IPVS load balancing algorithm, with the parameter being `--ipvs-scheduler`. If it’s not configured, then round-robin (rr) is the default value.

- rr: round-robin
- lc: least connection
- dh: destination hashing
- sh: source hashing
- sed: shortest expected delay
- nq: never queue

In the future, we can implement Service specific scheduler (potentially via annotation), which has higher priority and overwrites the value.

**Parameter: `--cleanup-ipvs`** Similar to the `--cleanup-iptables` parameter, if true, cleanup IPVS configuration and IPTables rules that are created in IPVS mode.

**Parameter: `--ipvs-sync-period`** Maximum interval of how often IPVS rules are refreshed (e.g. '5s', '1m'). Must be greater than 0.

**Parameter: `--ipvs-min-sync-period`** Minimum interval of how often the IPVS rules are refreshed (e.g. '5s', '1m'). Must be greater than 0.

**Parameter: `--ipvs-exclude-cidrs`**  A comma-separated list of CIDR's which the IPVS proxier should not touch when cleaning up IPVS rules because IPVS proxier can't distinguish kube-proxy created IPVS rules from user original IPVS rules. If you are using IPVS proxier with your own IPVS rules in the environment, this parameter should be specified, otherwise your original rule will be cleaned.

### Design Considerations

#### IPVS Service Network Topology

When creating a ClusterIP type Service, IPVS proxier will do the following three things:

* Make sure a dummy interface exists in the node, defaults to kube-ipvs0
* Bind Service IP addresses to the dummy interface
* Create IPVS virtual servers for each Service IP address respectively

Here comes an example:

```
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
```

Please note that the relationship between a Kubernetes Service and IPVS virtual servers is `1:N`. For example, consider a Kubernetes Service that has more than one IP address. An External IP type Service has two IP addresses - ClusterIP and External IP. Then the IPVS proxier will create 2 IPVS virtual servers - one for Cluster IP and another one for External IP. The relationship between a Kubernetes Endpoint (each IP+Port pair) and an IPVS virtual server is `1:1`.

Deleting of a Kubernetes service will trigger deletion of the corresponding IPVS virtual server, IPVS real servers and its IP addresses bound to the dummy interface.

####  Port Mapping

There are three proxy modes in IPVS: NAT (masq), IPIP and DR. Only NAT mode supports port mapping. Kube-proxy leverages NAT mode for port mapping. The following example shows IPVS mapping Service port 3080 to Pod port 8080.

```
TCP  10.102.128.4:3080 rr
  -> 10.244.0.235:8080            Masq    1      0          0         
  -> 10.244.1.237:8080            Masq    1      0       
```

#### Session Affinity

IPVS supports client IP session affinity (persistent connection). When a Service specifies session affinity, the IPVS proxier will set a timeout value (180min=10800s by default) in the IPVS virtual server. For example:

```
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
```

#### Iptables & Ipset in IPVS Proxier

IPVS is for load balancing and it can't handle other workarounds in kube-proxy, e.g. packet filtering, hairpin-masquerade tricks, SNAT, etc.

IPVS proxier leverages iptables in the above scenarios. Specifically, ipvs proxier will fall back on iptables in the following 4 scenarios:

- kube-proxy start with --masquerade-all=true
- Specify cluster CIDR in kube-proxy startup
- Support Loadbalancer type service
- Support NodePort type service

However, we don't want to create too many iptables rules. So we adopt ipset for the sake of decreasing iptables rules. The following is the table of ipset sets that IPVS proxier maintains:

| set name                       | members                                  | usage                                    |
| ------------------------------ | ---------------------------------------- | ---------------------------------------- |
| KUBE-CLUSTER-IP                | All Service IP + port                    | masquerade for cases that `masquerade-all=true` or `clusterCIDR` specified |
| KUBE-LOOP-BACK                 | All Service IP + port + IP               | masquerade for resolving hairpin issue   |
| KUBE-EXTERNAL-IP               | Service External IP + port               | masquerade for packets to external IPs   |
| KUBE-LOAD-BALANCER             | Load Balancer ingress IP + port          | masquerade for packets to Load Balancer type service |
| KUBE-LOAD-BALANCER-LOCAL       | Load Balancer ingress IP + port with `externalTrafficPolicy=local` | accept packets to Load Balancer with `externalTrafficPolicy=local` |
| KUBE-LOAD-BALANCER-FW          | Load Balancer ingress IP + port with `loadBalancerSourceRanges` | Drop packets for Load Balancer type Service with `loadBalancerSourceRanges` specified |
| KUBE-LOAD-BALANCER-SOURCE-CIDR | Load Balancer ingress IP + port + source CIDR | accept packets for Load Balancer type Service with `loadBalancerSourceRanges` specified |
| KUBE-NODE-PORT-TCP             | NodePort type Service TCP port           | masquerade for packets to NodePort(TCP)  |
| KUBE-NODE-PORT-LOCAL-TCP       | NodePort type Service TCP port with `externalTrafficPolicy=local` | accept packets to NodePort Service with `externalTrafficPolicy=local` |
| KUBE-NODE-PORT-UDP             | NodePort type Service UDP port           | masquerade for packets to NodePort(UDP)  |
| KUBE-NODE-PORT-LOCAL-UDP       | NodePort type service UDP port with `externalTrafficPolicy=local` | accept packets to NodePort Service with `externalTrafficPolicy=local` |


In general, for IPVS proxier, the number of iptables rules is static, no matter how many Services/Pods we have.

### Run kube-proxy in IPVS Mode

Currently, local-up scripts, GCE scripts, and kubeadm support switching IPVS proxy mode via exporting environment variables (`KUBE_PROXY_MODE=ipvs`) or specifying flag (`--proxy-mode=ipvs`). Before running IPVS proxier, please ensure IPVS required kernel modules are already installed.

```
ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack_ipv4
```

Finally, for Kubernetes v1.10, feature gate `SupportIPVSProxyMode` is set to `true` by default. For Kubernetes v1.11, the feature gate is entirely removed. However, you need to enable `--feature-gates=SupportIPVSProxyMode=true` explicitly for Kubernetes before v1.10.

## Get Involved
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting), and through the channels below.

Thank you for your continued feedback and support.
Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
Join the community portal for advocates on [K8sPort](http://k8sport.org/)
Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
Chat with the community on [Slack](http://slack.k8s.io/)
Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
