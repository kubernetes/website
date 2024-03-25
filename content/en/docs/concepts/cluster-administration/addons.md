---
title: Installing Addons
content_type: concept
weight: 150
---

<!-- overview -->

{{% thirdparty-content %}}

Add-ons extend the functionality of Kubernetes.

This page lists some of the available add-ons and links to their respective
installation instructions. The list does not try to be exhaustive.

<!-- body -->

## Networking and Network Policy

* [ACI](https://www.github.com/noironetworks/aci-containers) provides integrated
  container networking and network security with Cisco ACI.
* [Antrea](https://antrea.io/) operates at Layer 3/4 to provide networking and
  security services for Kubernetes, leveraging Open vSwitch as the networking
  data plane. Antrea is a [CNCF project at the Sandbox level](https://www.cncf.io/projects/antrea/).
* [Calico](https://www.tigera.io/project-calico/) is a networking and network
  policy provider. Calico supports a flexible set of networking options so you
  can choose the most efficient option for your situation, including non-overlay
  and overlay networks, with or without BGP. Calico uses the same engine to
  enforce network policy for hosts, pods, and (if using Istio & Envoy)
  applications at the service mesh layer.
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel)
  unites Flannel and Calico, providing networking and network policy.
* [Cilium](https://github.com/cilium/cilium) is a networking, observability,
  and security solution with an eBPF-based data plane. Cilium provides a
  simple flat Layer 3 network with the ability to span multiple clusters
  in either a native routing or overlay/encapsulation mode, and can enforce
  network policies on L3-L7 using an identity-based security model that is
  decoupled from network addressing. Cilium can act as a replacement for
  kube-proxy; it also offers additional, opt-in observability and security features.
  Cilium is a [CNCF project at the Graduated level](https://www.cncf.io/projects/cilium/).
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) enables Kubernetes to seamlessly
  connect to a choice of CNI plugins, such as Calico, Canal, Flannel, or Weave.
  CNI-Genie is a [CNCF project at the Sandbox level](https://www.cncf.io/projects/cni-genie/).
* [Contiv](https://contivpp.io/) provides configurable networking (native L3 using BGP,
  overlay using vxlan, classic L2, and Cisco-SDN/ACI) for various use cases and a rich
  policy framework. Contiv project is fully [open sourced](https://github.com/contiv).
  The [installer](https://github.com/contiv/install) provides both kubeadm and
  non-kubeadm based installation options.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/),
  based on [Tungsten Fabric](https://tungsten.io), is an open source, multi-cloud
  network virtualization and policy management platform. Contrail and Tungsten
  Fabric are integrated with orchestration systems such as Kubernetes, OpenShift,
  OpenStack and Mesos, and provide isolation modes for virtual machines, containers/pods
  and bare metal workloads.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) is
  an overlay network provider that can be used with Kubernetes.
* [Gateway API](/docs/concepts/services-networking/gateway/) is an open source project managed by
  the [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) community and
  provides an expressive, extensible, and role-oriented API for modeling service networking.
* [Knitter](https://github.com/ZTE/Knitter/) is a plugin to support multiple network
  interfaces in a Kubernetes pod.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) is a Multi plugin for
  multiple network support in Kubernetes to support all CNI plugins
  (e.g. Calico, Cilium, Contiv, Flannel), in addition to SRIOV, DPDK, OVS-DPDK and
  VPP based workloads in Kubernetes.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) is a networking
  provider for Kubernetes based on [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/),
  a virtual networking implementation that came out of the Open vSwitch (OVS) project.
  OVN-Kubernetes provides an overlay based networking implementation for Kubernetes,
  including an OVS based implementation of load balancing and network policy.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus) is an OVN based CNI
  controller plugin to provide cloud native based Service function chaining(SFC).
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP)
  provides integration between VMware NSX-T and container orchestrators such as
  Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS
  platforms such as Pivotal Container Service (PKS) and OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)
  is an SDN platform that provides policy-based networking between Kubernetes
  Pods and non-Kubernetes environments with visibility and security monitoring.
* [Romana](https://github.com/romana) is a Layer 3 networking solution for pod
  networks that also supports the [NetworkPolicy](/docs/concepts/services-networking/network-policies/) API.
* [Spiderpool](https://github.com/spidernet-io/spiderpool) is an underlay and RDMA
  networking solution for Kubernetes. Spiderpool is supported on bare metal, virtual machines,
  and public cloud environments.
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes)
  provides networking and network policy, will carry on working on both sides
  of a network partition, and does not require an external database.

## Service Discovery

* [CoreDNS](https://coredns.io) is a flexible, extensible DNS server which can
  be [installed](https://github.com/coredns/deployment/tree/master/kubernetes)
  as the in-cluster DNS for pods.

## Visualization &amp; Control

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard)
  is a dashboard web interface for Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a
  tool for visualizing your containers, Pods, Services and more.

## Infrastructure

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) is an add-on
  to run virtual machines on Kubernetes. Usually run on bare-metal clusters.
* The
  [node problem detector](https://github.com/kubernetes/node-problem-detector)
  runs on Linux nodes and reports system issues as either
  [Events](/docs/reference/kubernetes-api/cluster-resources/event-v1/) or
  [Node conditions](/docs/concepts/architecture/nodes/#condition).

## Instrumentation

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)

## Legacy Add-ons

There are several other add-ons documented in the deprecated
[cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!
