---
reviewers:
- thockin
- dwinship
min-kubernetes-server-version: v1.33
title: Kubernetes Default Service CIDR Reconfiguration
content_type: task
---

<!-- overview -->
{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

This document shares how to reconfigure the default Service IP range(s) assigned
to a cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- steps -->

## Kubernetes Default Service CIDR Reconfiguration

This document explains how to manage the Service IP address range within a
Kubernetes cluster, which also influences the cluster's supported IP families
for Services.

The IP families available for Service ClusterIPs are determined by the
`--service-cluster-ip-range` flag to kube-apiserver. For a better understanding of Service IP address allocation, refer to the
[Services IP address allocation tracking](https://kubernetes.io/docs/reference/networking/virtual-ips/#ip-address-objects) documentation.

Since Kubernetes 1.33, the Service IP families configured for the cluster are
reflected by the `ServiceCIDR` object named `kubernetes`. The `kubernetes` `ServiceCIDR`
object is created by the first kube-apiserver instance that starts, based on its
configured `--service-cluster-ip-range` flag. To ensure consistent cluster behavior, all kube-apiserver instances must be configured with the same `--service-cluster-ip-range` values, which must match the default kubernetes ServiceCIDR object.

### Kubernetes Service CIDR Reconfiguration Categories

We can categorize Service CIDR reconfiguration into the following scenarios:

* **Extending the existing Service CIDRs:** This can be done dynamically by
    adding new ServiceCIDR objects without the need of reconfiguration of the
    kube-apiserver. Please refer to the dedicated documentation on
    [Extending Service IP
    Ranges](https://kubernetes.io/docs/tasks/network/extend-service-ip-ranges/).

* **Single-to-dual-stack conversion preserving the primary service CIDR:** This
    involves introducing a secondary IP family (IPv6 to an IPv4-only cluster, or
    IPv4 to an IPv6-only cluster) while keeping the original IP family as
    primary. This requires an update to the kube-apiserver configuration and a
    corresponding modification of various cluster components that need to handle
    this additional IP family. These components include, but are not limited to,
    kube-proxy, the CNI or network plugin, service mesh implementations, and DNS
    services.

* **Dual-to-single conversion preserving the primary service CIDR:** This
    involves removing the secondary IP family from a dual-stack cluster,
    reverting to a single IP family while retaining the original primary IP
    family. In addition to the reconfiguration of the components to match the
    new IP family, you might need to address Services that were explicitly
    configured to use the removed IP family.

* **Anything that results in changing the primary service CIDR:** Completely
  replacing the default ServiceCIDR is a complex operation. If the new
  ServiceCIDR does not overlap with the existing one, [it will require
  renumbering all existing Services and changing the `kubernetes.default`
  service](#Illustrative Reconfiguration Steps). The case where the primary IP
  family also changes is even more complicated, and may require to change
  multiple cluster components (kubelet, network plugins, etc.) to match the new
  primary IP family.

### Manual Operations for Replacing the Default Service CIDR

Reconfiguring the default Service CIDR necessitates manual steps performed by
the cluster operator, administrator, or the software managing the cluster
lifecycle. These typically include:

1.  **Updating** the kube-apiserver configuration: Modify the
    `--service-cluster-ip-range` flag with the new IP range(s).
2.  **Reconfiguring** the network components: This is a critical step and the
    specific procedure depends on the different networking components in use. It
    might involve updating configuration files, restarting agent pods, or
    updating the components to manage the new Service CIDR(s) and the desired IP
    family configuration for Pods. Typical components can be the implementation
    of Kubernetes Services, such as kube-proxy, and the configured networking
    plugin, and potentially other networking components like service mesh
    controllers and DNS servers, to ensure they can correctly handle traffic and
    perform service discovery with the new IP family configuration.
3.  **Managing existing Services:** Services with IPs from the old CIDR need to
    be addressed if they are not within the new configured ranges. Options
    include recreation (leading to downtime and new IP assignments) or
    potentially more complex reconfiguration strategies.
4.  **Recreating internal Kubernetes services:** The `kubernetes.default`
    service must be deleted and recreated to obtain an IP address from the new
    Service CIDR if the primary IP family is changed or replaced by a different
    network.

### Illustrative Reconfiguration Steps

The following steps describe a controlled reconfiguration focusing on the
completely replacement of the default Service CIDR and the recreation of the
`kubernetes.default` Service:

1.  Start the kube-apiserver with the initial `--service-cluster-ip-range`.
2.  Create initial Services that obtain IPs from this range.
3.  Introduce a new Service CIDR as a temporary target for reconfiguration.
4.  Mark the `kubernetes` default Service CIDR for deletion (it will remain
    pending due to existing IPs and finalizers). This prevents new allocations
    from the old range.
5.  Recreate existing Services. They should now be allocated IPs from the new,
    temporary Service CIDR.
6.  Restart the kube-apiserver with the new Service CIDR(s) configured and shut
    down the old instance.
7.  Delete the `kubernetes.default` service. The new kube-apiserver will
    recreate it within the new Service CIDR.

## {{% heading "whatsnext" %}}

* **Kubernetes Networking Concepts:**
  [https://kubernetes.io/docs/concepts/cluster-administration/networking/](https://kubernetes.io/docs/concepts/cluster-administration/networking/)
* **Kubernetes Dual-Stack Services:**
  [https://kubernetes.io/docs/concepts/services-networking/dual-stack/](https://kubernetes.io/docs/concepts/services-networking/dual-stack/)
* **Extending Kubernetes Service IP Ranges:**
  [https://kubernetes.io/docs/tasks/network/extend-service-ip-ranges/](https://kubernetes.io/docs/tasks/network/extend-service-ip-ranges/)