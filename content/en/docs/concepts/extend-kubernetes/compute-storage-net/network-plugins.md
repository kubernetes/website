---
reviewers:
- dcbw
- freehan
- thockin
title: Network Plugins
content_type: concept
weight: 10
---


<!-- overview -->

Kubernetes {{< skew currentVersion >}} supports [Container Network Interface](https://github.com/containernetworking/cni)
(CNI) plugins for cluster networking. You must use a CNI plugin that is compatible with your cluster and that suits your needs. Different plugins are available (both open- and closed- source) in the wider Kubernetes ecosystem.

A CNI plugin is required to implement the [Kubernetes network model](/docs/concepts/services-networking/#the-kubernetes-network-model). 

You must use a CNI plugin that is compatible with the 
[v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) or later
releases of the CNI specification. The Kubernetes project recommends using a plugin that is
compatible with the [v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md)
CNI specification (plugins can be compatible with multiple spec versions).

<!-- body -->

## Installation

A Container Runtime, in the networking context, is a daemon on a node configured to provide CRI Services for kubelet. In particular, the Container Runtime must be configured to load the CNI plugins required to implement the Kubernetes network model.

{{< note >}}
Prior to Kubernetes 1.24, the CNI plugins could also be managed by the Kubelet using the `cni-bin-dir` and `network-plugin` command line parameters.
These command line parameters were removed in Kubernetes 1.24, with management of the CNI no longer in scope for Kubelet.

See [Troubleshooting CNI plugin-related errors](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)
if you are facing issues following the removal of dockershim.
{{< /note >}}

For specific information about how a Container Runtime manages the CNI plugins, see the documentation for that Container Runtime, for example:
- [containerd](https://github.com/containerd/containerd/blob/main/script/setup/install-cni)
- [CRI-O](https://github.com/cri-o/cri-o/blob/main/contrib/cni/README.md)

For specific information about how to install and manage a CNI plugin, see the documentation for that plugin or [networking provider](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model).

## Network Plugin Requirements

The plugin may also need specific support for kube-proxy.  The iptables proxy obviously depends on iptables, and the plugin may need to ensure that container traffic is made available to iptables.  For example, if the plugin connects containers to a Linux bridge, the plugin must set the `net/bridge/bridge-nf-call-iptables` sysctl to `1` to ensure that the iptables proxy functions correctly.  If the plugin does not use a Linux bridge (but instead something like Open vSwitch or some other mechanism) it should ensure container traffic is appropriately routed for the proxy.

By default if no kubelet network plugin is specified, the `noop` plugin is used, which sets `net/bridge/bridge-nf-call-iptables=1` to ensure simple configurations (like Docker with a bridge) work correctly with the iptables proxy.

### Loopback CNI

In addition to the CNI plugin installed on the nodes, Kubernetes requires the standard CNI [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) plugin, at minimum version 0.2.0

### Support hostPort

The CNI networking plugin supports `hostPort`. You can use the official [portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
plugin offered by the CNI plugin team or use your own plugin with portMapping functionality.

If you want to enable `hostPort` support, you must specify `portMappings capability` in your `cni-conf-dir`.
For example:

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true}
    }
  ]
}
```

### Support traffic shaping

**Experimental Feature**

The CNI networking plugin also supports pod ingress and egress traffic shaping. You can use the official [bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth)
plugin offered by the CNI plugin team or use your own plugin with bandwidth control functionality.

If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file
(default `/etc/cni/net.d`) and ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

Now you can add the `kubernetes.io/ingress-bandwidth` and `kubernetes.io/egress-bandwidth` annotations to your pod.
For example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

## Usage Summary

Once the Kubelet is installed and communicating with the Kubernetes API Server, a CNI plugin can be installed using the instructions for that plugin.

## {{% heading "whatsnext" %}}
