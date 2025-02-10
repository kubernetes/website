---
title: " Configuring Private DNS Zones and Upstream Nameservers in Kubernetes "
date: 2017-04-04
slug: configuring-private-dns-zones-upstream-nameservers-kubernetes
url: /blog/2017/04/Configuring-Private-Dns-Zones-Upstream-Nameservers-Kubernetes
author: >
   Bowei Du (Google),
   Matthew DeLio (Google) 
---
_Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2017/03/five-days-of-kubernetes-1-6) on what's new in Kubernetes 1.6_

Many users have existing domain name zones that they would like to integrate into their Kubernetes DNS namespace. For example, hybrid-cloud users may want to resolve their internal “.corp” domain addresses within the cluster. Other users may have a zone populated by a non-Kubernetes service discovery system (like Consul). We’re pleased to announce that, in [Kubernetes 1.6](https://kubernetes.io/blog/2017/03/kubernetes-1-6-multi-user-multi-workloads-at-scale), [kube-dns](/docs/concepts/services-networking/dns-pod-service/) adds support for configurable private DNS zones (often called “stub domains”) and external upstream DNS nameservers. In this blog post, we describe how to configure and use this feature.

**Default lookup flow**  


[![](https://2.bp.blogspot.com/-Jj4r6bGt1f8/WORRugYMobI/AAAAAAAABBE/HXH-wBGqweQcJbyQA3bqnUtYeN5aOtE9ACEw/s400/dns2.png)](https://2.bp.blogspot.com/-Jj4r6bGt1f8/WORRugYMobI/AAAAAAAABBE/HXH-wBGqweQcJbyQA3bqnUtYeN5aOtE9ACEw/s1600/dns2.png)

Kubernetes currently supports two DNS policies specified on a per-pod basis using the dnsPolicy flag: “Default” and “ClusterFirst”. If dnsPolicy is not explicitly specified, then “ClusterFirst” is used:  

- If dnsPolicy is set to “Default”, then the name resolution configuration is inherited from the node the pods run on. Note: this feature cannot be used in conjunction with dnsPolicy: “Default”.
- If dnsPolicy is set to “ClusterFirst”, then DNS queries will be sent to the kube-dns service. Queries for domains rooted in the configured cluster domain suffix (any address ending in “.cluster.local” in the example above) will be answered by the kube-dns service. All other queries (for example, www.kubernetes.io) will be forwarded to the upstream nameserver inherited from the node.
Before this feature, it was common to introduce stub domains by replacing the upstream DNS with a custom resolver. However, this caused the custom resolver itself to become a critical path for DNS resolution, where issues with scalability and availability may cause the cluster to lose DNS functionality. This feature allows the user to introduce custom resolution without taking over the entire resolution path.  

**Customizing the DNS Flow**  

Beginning in Kubernetes 1.6, cluster administrators can specify custom stub domains and upstream nameservers by providing a ConfigMap for kube-dns. For example, the configuration below inserts a single stub domain and two upstream nameservers. As specified, DNS requests with the “.acme.local” suffix will be forwarded to a DNS listening at 1.2.3.4. Additionally, Google Public DNS will serve upstream queries. See ConfigMap Configuration Notes at the end of this section for a few notes about the data format.  


```
apiVersion: v1

kind: ConfigMap

metadata:

  name: kube-dns

  namespace: kube-system

data:

  stubDomains: |

    {“acme.local”: [“1.2.3.4”]}

  upstreamNameservers: |

    [“8.8.8.8”, “8.8.4.4”]
 ```


The diagram below shows the flow of DNS queries specified in the configuration above. With the dnsPolicy set to “ClusterFirst” a DNS query is first sent to the DNS caching layer in kube-dns. From here, the suffix of the request is examined and then forwarded to the appropriate DNS.  In this case, names with the cluster suffix (e.g.; “.cluster.local”) are sent to kube-dns. Names with the stub domain suffix (e.g.; “.acme.local”) will be sent to the configured custom resolver. Finally, requests that do not match any of those suffixes will be forwarded to the upstream DNS.  

[![](https://1.bp.blogspot.com/-IeFx2Uuq_i0/WORRuQpxG_I/AAAAAAAABBA/g1P3ljd7YGYMShoHJnPRK1IfX5h3o9GvACEw/s400/dns.png)](https://1.bp.blogspot.com/-IeFx2Uuq_i0/WORRuQpxG_I/AAAAAAAABBA/g1P3ljd7YGYMShoHJnPRK1IfX5h3o9GvACEw/s1600/dns.png)


Below is a table of example domain names and the destination of the queries for those domain names:

| | |
|---|---|
| Domain name | Server answering the query |
| kubernetes.default.svc.cluster.local | kube-dns |
| foo.acme.local | custom DNS (1.2.3.4) |
| widget.com | upstream DNS (one of 8.8.8.8, 8.8.4.4) |



**ConfigMap Configuration Notes**

- stubDomains (optional)

  - Format: a JSON map using a DNS suffix key (e.g.; “acme.local”) and a value consisting of a JSON array of DNS IPs.
  - Note: The target nameserver may itself be a Kubernetes service. For instance, you can run your own copy of dnsmasq to export custom DNS names into the ClusterDNS namespace.
- upstreamNameservers (optional)

  - Format: a JSON array of DNS IPs.
  - Note: If specified, then the values specified replace the nameservers taken by default from the node’s /etc/resolv.conf
  - Limits: a maximum of three upstream nameservers can be specified

**Example #1: Adding a Consul DNS Stub Domain**



In this example, the user has Consul DNS service discovery system they wish to integrate with kube-dns. The consul domain server is located at 10.150.0.1, and all consul names have the suffix “.consul.local”.  To configure Kubernetes, the cluster administrator simply creates a ConfigMap object as shown below.  Note: in this example, the cluster administrator did not wish to override the node’s upstream nameservers, so they didn’t need to specify the optional upstreamNameservers field.  


```
apiVersion: v1

kind: ConfigMap

metadata:

  name: kube-dns

  namespace: kube-system

data:

  stubDomains: |

    {“consul.local”: [“10.150.0.1”]}
 ```



**Example #2: Replacing the Upstream Nameservers**



In this example the cluster administrator wants to explicitly force all non-cluster DNS lookups to go through their own nameserver at 172.16.0.1.  Again, this is easy to accomplish; they just need to create a ConfigMap with the upstreamNameservers field specifying the desired nameserver.  


```
apiVersion: v1

kind: ConfigMap

metadata:

  name: kube-dns

  namespace: kube-system

data:

  upstreamNameservers: |

    [“172.16.0.1”]




**Get involved**  

If you’d like to contribute or simply help provide feedback and drive the roadmap, [join our community](https://github.com/kubernetes/community#kubernetes-community). Specifically for network related conversations participate though one of these channels:  

- Chat with us on the Kubernetes [Slack network channel](https://kubernetes.slack.com/messages/sig-network/)
- Join our Special Interest Group, [SIG-Network](https://github.com/kubernetes/community/wiki/SIG-Network), which meets on Tuesdays at 14:00 PT
Thanks for your support and contributions. Read more in-depth posts on what's new in Kubernetes 1.6 [here](https://kubernetes.io/blog/2017/03/five-days-of-kubernetes-1-6).


- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- [Download](http://get.k8s.io/) Kubernetes
