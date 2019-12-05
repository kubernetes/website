---
reviewers:
- bowei
- zihongz
title: Using NodeLocal DNSCache in Kubernetes clusters
content_template: templates/task
---
 
{{% capture overview %}}
{{< feature-state for_k8s_version="v1.15" state="beta" >}}
This page provides an overview of NodeLocal DNSCache feature in Kubernetes.
{{% /capture %}}


{{% capture prerequisites %}}

 {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

 {{% capture steps %}}

## Introduction

NodeLocal DNSCache improves Cluster DNS performance by running a dns caching agent on cluster nodes as a DaemonSet. In today's architecture, Pods in ClusterFirst DNS mode reach out to a kube-dns serviceIP for DNS queries. This is translated to a kube-dns/CoreDNS endpoint via iptables rules added by kube-proxy. With this new architecture, Pods will reach out to the dns caching agent running on the same node, thereby avoiding iptables DNAT rules and connection tracking. The local caching agent will query kube-dns service for cache misses of cluster hostnames(cluster.local suffix by default).


## Motivation

* With the current DNS architecture, it is possible that Pods with the highest DNS QPS have to reach out to a different node, if there is no local kube-dns/CoreDNS instance.  
Having a local cache will help improve the latency in such scenarios.

* Skipping iptables DNAT and connection tracking will help reduce [conntrack races](https://github.com/kubernetes/kubernetes/issues/56903) and avoid UDP DNS entries filling up conntrack table.

* Connections from local caching agent to kube-dns servie can be upgraded to TCP. TCP conntrack entries will be removed on connection close in contrast with UDP entries that have to timeout ([default](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt) `nf_conntrack_udp_timeout` is 30 seconds)

* Upgrading DNS queries from UDP to TCP would reduce tail latency attributed to dropped UDP packets and DNS timeouts usually up to 30s (3 retries + 10s timeout). Since the nodelocal cache listens for UDP DNS queries, applications don't need to be changed.

* Metrics & visibility into dns requests at a node level.

* Negative caching can be re-enabled, thereby reducing number of queries to kube-dns service.

## Architecture Diagram

This is the path followed by DNS Queries after NodeLocal DNSCache is enabled:


{{< figure src="/images/docs/nodelocaldns.jpg" alt="NodeLocal DNSCache flow" title="Nodelocal DNSCache flow" caption="This image shows how NodeLocal DNSCache handles DNS queries." >}}

## Configuration

This feature can be enabled using the command:

`KUBE_ENABLE_NODELOCAL_DNS=true kubetest --up`

This works for e2e clusters created on GCE. On all other environments, the following steps will setup NodeLocal DNSCache:

* A yaml similar to [this](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) can be applied using `kubectl create -f` command.
* No need to modify the --cluster-dns flag since NodeLocal DNSCache listens on both the kube-dns service IP as well as a link-local IP (169.254.20.10 by default)

Once enabled, node-local-dns Pods will run in the kube-system namespace on each of the cluster nodes. This Pod runs [CoreDNS](https://github.com/coredns/coredns) in cache mode, so all CoreDNS metrics exposed by the different plugins will be available on a per-node basis.

The feature can be disabled by removing the daemonset, using `kubectl delete -f` command. On e2e clusters created on GCE, the daemonset can be removed by deleting the node-local-dns yaml from `/etc/kubernetes/addons/0-dns/nodelocaldns.yaml`

 {{% /capture %}}
