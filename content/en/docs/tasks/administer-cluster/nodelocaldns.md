---
reviewers:
- bowei
- zihongz
- sftim
title: Using NodeLocal DNSCache in Kubernetes clusters
content_template: templates/task
---
 
{{% capture overview %}}
{{< feature-state for_k8s_version="v1.18" state="stable" >}}
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
{{< note >}} The local listen IP address for NodeLocal DNSCache can be any IP in the 169.254.20.0/16 space or any other IP address that can be guaranteed to not collide with any existing IP. This document uses 169.254.20.10 as an example.
{{< /note >}}

This feature can be enabled using the following steps:

* Prepare a manifest similar to the sample [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) and save it as `nodelocaldns.yaml.`
* Substitute the variables in the manifest with the right values: 

     * kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}` 
   
     * domain=`<cluster-domain>` 
   
     * localdns=`<node-local-address>`
  
     `<cluster-domain>` is "cluster.local" by default. `<node-local-address>` is the local listen IP address chosen for NodeLocal DNSCache.

   * If kube-proxy is running in IPTABLES mode: 
   
     ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
     ```
     
     `__PILLAR__CLUSTER__DNS__` and `__PILLAR__UPSTREAM__SERVERS__` will be populated by the node-local-dns pods.  
     In this mode, node-local-dns pods listen on both the kube-dns service IP as well as `<node-local-address>`, so pods can lookup DNS records using either IP address.

  * If kube-proxy is running in IPVS mode: 
  
    ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
    ```
     In this mode, node-local-dns pods listen only on `<node-local-address>`. The node-local-dns interface cannot bind the kube-dns cluster IP since the interface used for IPVS loadbalancing already uses this address.  
     `__PILLAR__UPSTREAM__SERVERS__` will be populated by the node-local-dns pods.
  
* Run `kubectl create -f nodelocaldns.yaml`
* If using kube-proxy in IPVS mode, `--cluster-dns` flag to kubelet needs to be modified to use `<node-local-address>` that NodeLocal DNSCache is listening on.
  Otherwise, there is no need to modify the value of the `--cluster-dns` flag, since NodeLocal DNSCache listens on both the kube-dns service IP as well as `<node-local-address>`.

Once enabled, node-local-dns Pods will run in the kube-system namespace on each of the cluster nodes. This Pod runs [CoreDNS](https://github.com/coredns/coredns) in cache mode, so all CoreDNS metrics exposed by the different plugins will be available on a per-node basis.

You can disable this feature by removing the DaemonSet, using `kubectl delete -f <manifest>` . You should also revert any changes you made to the kubelet configuration.
 {{% /capture %}}
