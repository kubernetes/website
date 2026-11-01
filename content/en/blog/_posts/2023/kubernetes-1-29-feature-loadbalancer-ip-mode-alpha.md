---
layout: blog
title: "Kubernetes 1.29: New (alpha) Feature, Load Balancer IP Mode for Services"
date: 2023-12-18
slug: kubernetes-1-29-feature-loadbalancer-ip-mode-alpha
author: >
  [Aohan Yang](https://github.com/RyanAoh)
---

This blog introduces a new alpha feature in Kubernetes 1.29. 
It provides a configurable approach to define how Service implementations, 
exemplified in this blog by kube-proxy, 
handle traffic from pods to the Service, within the cluster.

## Background

In older Kubernetes releases, the kube-proxy would intercept traffic that was destined for the IP
address associated with a Service of `type: LoadBalancer`. This happened whatever mode you used
for `kube-proxy`. 
The interception implemented the expected behavior (traffic eventually reaching the expected
endpoints behind the Service). The mechanism to make that work depended on the mode for kube-proxy;
on Linux, kube-proxy in iptables mode would redirecting packets directly to the endpoint; in ipvs mode,
kube-proxy would configure the load balancer's IP address to one interface on the node. 
The motivation for implementing that interception was for two reasons:

1. **Traffic path optimization:** Efficiently redirecting pod traffic - when a container in a pod sends an outbound
   packet that is destined for the load balancer's IP address - 
   directly to the backend service by bypassing the load balancer.
  
2. **Handling load balancer packets:** Some load balancers send packets with the destination IP set to 
the load balancer's IP address. As a result, these packets need to be routed directly to the correct backend (which 
might not be local to that node), in order to avoid loops.
  
## Problems

However, there are several problems with the aforementioned behavior:

1. **[Source IP](https://github.com/kubernetes/kubernetes/issues/79783):** 
    Some cloud providers use the load balancer's IP as the source IP when 
    transmitting packets to the node. In the ipvs mode of kube-proxy, 
    there is a problem that health checks from the load balancer never return. This occurs because the reply packets 
    would be forward to the local interface `kube-ipvs0`(where the load balancer's IP is bound to) 
    and be subsequently ignored.
  
2. **[Feature loss at load balancer level](https://github.com/kubernetes/kubernetes/issues/66607):**
    Certain cloud providers offer features(such as TLS termination, proxy protocol, etc.) at the
    load balancer level.
    Bypassing the load balancer results in the loss of these features when the packet reaches the service
    (leading to protocol errors).
  

Even with the new alpha behaviour disabled (the default), there is a 
[workaround](https://github.com/kubernetes/kubernetes/issues/66607#issuecomment-474513060) 
that involves setting `.status.loadBalancer.ingress.hostname` for the Service, in order 
to bypass kube-proxy binding. 
But this is just a makeshift solution.

## Solution

In summary, providing an option for cloud providers to disable the current behavior would be highly beneficial.

To address this, Kubernetes v1.29 introduces a new (alpha) `.status.loadBalancer.ingress.ipMode` 
field for a Service.
This field specifies how the load balancer IP behaves and can be specified only when 
the `.status.loadBalancer.ingress.ip` field is also specified.

Two values are possible for `.status.loadBalancer.ingress.ipMode`: `"VIP"` and `"Proxy"`.
The default value is "VIP", meaning that traffic delivered to the node 
with the destination set to the load balancer's IP and port will be redirected to the backend service by kube-proxy.
This preserves the existing behavior of kube-proxy. 
The "Proxy" value is intended to prevent kube-proxy from binding the load balancer's IP address 
to the node in both ipvs and iptables modes. 
Consequently, traffic is sent directly to the load balancer and then forwarded to the destination node. 
The destination setting for forwarded packets varies depending on how the cloud provider's load balancer delivers traffic:

- If the traffic is delivered to the node then DNATed to the pod, the destination would be set to the node's IP and node port;
- If the traffic is delivered directly to the pod, the destination would be set to the pod's IP and port.

## Usage

Here are the necessary steps to enable this feature:

- Download the [latest Kubernetes project](https://kubernetes.io/releases/download/) (version `v1.29.0` or later).
- Enable the feature gate with the command line flag `--feature-gates=LoadBalancerIPMode=true` 
on kube-proxy, kube-apiserver, and cloud-controller-manager.
- For Services with `type: LoadBalancer`, set `ipMode` to the appropriate value. 
This step is likely handled by your chosen cloud-controller-manager during the `EnsureLoadBalancer` process.

## More information

- Read [Specifying IPMode of load balancer status](/docs/concepts/services-networking/service/#load-balancer-ip-mode).
- Read [KEP-1860](https://kep.k8s.io/1860) - [Make Kubernetes aware of the LoadBalancer behaviour](https://github.com/kubernetes/enhancements/tree/b103a6b0992439f996be4314caf3bf7b75652366/keps/sig-network/1860-kube-proxy-IP-node-binding#kep-1860-make-kubernetes-aware-of-the-loadbalancer-behaviour) _(sic)_.

## Getting involved

Reach us on [Slack](https://slack.k8s.io/): [#sig-network](https://kubernetes.slack.com/messages/sig-network), 
or through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-network).

## Acknowledgments

Huge thanks to [@Sh4d1](https://github.com/Sh4d1) for the original KEP and initial implementation code. 
I took over midway and completed the work. Similarly, immense gratitude to other contributors 
who have assisted in the design, implementation, and review of this feature (alphabetical order):

- [@aojea](https://github.com/aojea)
- [@danwinship](https://github.com/danwinship)
- [@sftim](https://github.com/sftim)
- [@tengqm](https://github.com/tengqm)
- [@thockin](https://github.com/thockin)
- [@wojtek-t](https://github.com/wojtek-t)