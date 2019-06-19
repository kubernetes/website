---
title: Installing Addons
content_template: templates/concept
---

{{% capture overview %}}


Add-ons extend the functionality of Kubernetes.

This page lists some of the available add-ons and links to their respective installation instructions.

Add-ons in each section are sorted alphabetically - the ordering does not imply any preferential status.

{{% /capture %}}


{{% capture body %}}

## Networking and Network Policy


* [ACI](https://www.github.com/noironetworks/aci-containers) provides integrated container networking and network security with Cisco ACI.
* [Calico](https://docs.projectcalico.org/latest/getting-started/kubernetes/) is a secure L3 networking and network policy provider.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) unites Flannel and Calico, providing networking and network policy.
* [Cilium](https://github.com/cilium/cilium) is a L3 network and network policy plugin that can enforce HTTP/API/L7 policies transparently. Both routing and overlay/encapsulation mode are supported.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) enables Kubernetes to seamlessly connect to a choice of CNI plugins, such as Calico, Canal, Flannel, Romana, or Weave.
* [Contiv](http://contiv.github.io) provides configurable networking (native L3 using BGP, overlay using vxlan, classic L2, and Cisco-SDN/ACI) for various use cases and a rich policy framework. Contiv project is fully [open sourced](http://github.com/contiv). The [installer](http://github.com/contiv/install) provides both kubeadm and non-kubeadm based installation options.
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io), is an open source, multi-cloud network virtualization and policy management platform. Contrail and Tungsten Fabric are integrated with orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, and provide isolation modes for virtual machines, containers/pods and bare metal workloads.
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kubernetes.md) is an overlay network provider that can be used with Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) is a network solution supporting multiple networking in Kubernetes.
* [Multus](https://github.com/Intel-Corp/multus-cni) is a Multi plugin for multiple network support in Kubernetes to support all CNI plugins (e.g. Calico, Cilium, Contiv, Flannel), in addition to SRIOV, DPDK, OVS-DPDK and VPP based workloads in Kubernetes.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) Container Plug-in (NCP) provides integration between VMware NSX-T and container orchestrators such as Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS platforms such as Pivotal Container Service (PKS) and OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) is an SDN platform that provides policy-based networking between Kubernetes Pods and non-Kubernetes environments with visibility and security monitoring.
* [Romana](http://romana.io) is a Layer 3 networking solution for pod networks that also supports the [NetworkPolicy API](/docs/concepts/services-networking/network-policies/). Kubeadm add-on installation details available [here](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) provides networking and network policy, will carry on working on both sides of a network partition, and does not require an external database.

## Service Discovery

* [CoreDNS](https://coredns.io) is a flexible, extensible DNS server which can be [installed](https://github.com/coredns/deployment/tree/master/kubernetes) as the in-cluster DNS for pods.

## Visualization &amp; Control

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) is a dashboard web interface for Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a tool for graphically visualizing your containers, pods, services etc. Use it in conjunction with a [Weave Cloud account](https://cloud.weave.works/) or host the UI yourself.

## Legacy Add-ons

There are several other add-ons documented in the deprecated [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!

{{% /capture %}}
