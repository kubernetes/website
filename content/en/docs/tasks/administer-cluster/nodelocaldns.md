---
reviewers:
- bowei
- zihongz
title: Using Node-local DNS Cache
content_template: templates/task
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.15" state="beta" >}}
This page explains how to use the Node-local DNS Cache [add-on](/docs/concepts/cluster-administration/addons/) in your cluster.

Node-local DNS Cache lets you improve DNS performance, by running a DNS caching agent as a {{< glossary_tooltip term_id="daemonset" >}}.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

## Motivation

Without a local DNS cache on each Node, Pods in ClusterFirst DNS mode access the `kube-dns` application via its serviceIP in order to resolve DNS queries. Your cluster translates that serviceIP to a kube-dns or CoreDNS endpoint via kube-proxy.
  With this add-on, Pods send DNS queries to a caching agent running on the same node. The local caching agent queries your cluster's kube-dns application when resolving cluster DNS queries. For cache hits, the local agent serves the response directly.

In detail:

* With the current DNS architecture, it is possible that Pods with the
  highest DNS QPS have to reach out to a different node, if there is no
  local kube-dns / CoreDNS instance.
  Having a local cache help improve the latency in such scenarios.

* Skipping iptables DNAT and connection tracking helps to reduce [conntrack races](https://github.com/kubernetes/kubernetes/issues/56903) and to avoid UDP DNS entries filling up conntrack table.

* Connections from local caching agent to kube-dns servie can be upgraded to TCP. TCP conntrack entries will be removed on connection close in contrast with UDP entries that have to time out ([default](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt) `nf_conntrack_udp_timeout` is 30 seconds)

* Upgrading DNS queries from UDP to TCP would reduce tail latency attributed to dropped UDP packets and DNS timeouts usually up to 30s (3 retries + 10s timeout). Since the node-local cache container listens for UDP DNS queries, you don't need to change applications.

* Metrics & visibility into dns requests at a node level.

* Negative caching can be re-enabled, thereby reducing number of queries to the kube-dns service.

## Architecture diagram

This is the path followed by DNS Queries after you enable the Node-local DNS Cache add-on.

{{< figure src="/images/docs/nodelocaldns.jpg" alt="Node-local DNS Cache query flow" title="Node-local DNS Cache query flow" caption="This image shows how Node-local DNS Cache handles DNS queries." >}}

## Set up

You can instead deploy this add-on by running YAML similar to [nodelocaldns.yaml](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) using `kubectl create -f nodelocaldns.yaml`.

There is no need to modify the `--cluster-dns` flag since Node-Local DNS Cache listens on both the kube-dns service IP as well as to the IP address it adds to each node.

Once enabled, Kubernetes runs node-local-dns Pods (in the `kube-system` namespace) on each cluster node. These Pods run [CoreDNS](https://github.com/coredns/coredns) in cache mode, so all CoreDNS metrics exposed by the different plugins be available on a per-node basis, in Prometheus / OpenMetrics format.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [DNS in Kubernetes](/docs/concepts/services-networking/dns-pod-service/)
{{% /capture %}}
