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

Network plugins in Kubernetes come in a few flavors:

* CNI plugins: adhere to the [Container Network Interface](https://github.com/containernetworking/cni) (CNI) specification, designed for interoperability.
  * Kubernetes follows the [v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) release of the CNI specification.
* Kubenet plugin: implements basic `cbr0` using the `bridge` and `host-local` CNI plugins

<!-- body -->

## Installation

The kubelet has a single default network plugin, and a default network common to the entire cluster. It probes for plugins when it starts up, remembers what it finds, and executes the selected plugin at appropriate times in the pod lifecycle (this is only true for Docker, as CRI manages its own CNI plugins). There are two Kubelet command line parameters to keep in mind when using plugins:

* `cni-bin-dir`: Kubelet probes this directory for plugins on startup
* `network-plugin`: The network plugin to use from `cni-bin-dir`.  It must match the name reported by a plugin probed from the plugin directory.  For CNI plugins, this is `cni`.

## Network Plugin Requirements

Besides providing the [`NetworkPlugin` interface](https://github.com/kubernetes/kubernetes/tree/{{< param "fullversion" >}}/pkg/kubelet/dockershim/network/plugins.go) to configure and clean up pod networking, the plugin may also need specific support for kube-proxy.  The iptables proxy obviously depends on iptables, and the plugin may need to ensure that container traffic is made available to iptables.  For example, if the plugin connects containers to a Linux bridge, the plugin must set the `net/bridge/bridge-nf-call-iptables` sysctl to `1` to ensure that the iptables proxy functions correctly.  If the plugin does not use a Linux bridge (but instead something like Open vSwitch or some other mechanism) it should ensure container traffic is appropriately routed for the proxy.

By default if no kubelet network plugin is specified, the `noop` plugin is used, which sets `net/bridge/bridge-nf-call-iptables=1` to ensure simple configurations (like Docker with a bridge) work correctly with the iptables proxy.

### CNI

The CNI plugin is selected by passing Kubelet the `--network-plugin=cni` command-line option.  Kubelet reads a file from `--cni-conf-dir` (default `/etc/cni/net.d`) and uses the CNI configuration from that file to set up each pod's network.  The CNI configuration file must match the [CNI specification](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration), and any required CNI plugins referenced by the configuration must be present in `--cni-bin-dir` (default `/opt/cni/bin`).

If there are multiple CNI configuration files in the directory, the kubelet uses the configuration file that comes first by name in lexicographic order.

In addition to the CNI plugin specified by the configuration file, Kubernetes requires the standard CNI [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) plugin, at minimum version 0.2.0

#### Support hostPort

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

#### Support traffic shaping

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

### kubenet

Kubenet is a very basic, simple network plugin, on Linux only.  It does not, of itself, implement more advanced features like cross-node networking or network policy.  It is typically used together with a cloud provider that sets up routing rules for communication between nodes, or in single-node environments.

Kubenet creates a Linux bridge named `cbr0` and creates a veth pair for each pod with the host end of each pair connected to `cbr0`.  The pod end of the pair is assigned an IP address allocated from a range assigned to the node either through configuration or by the controller-manager.  `cbr0` is assigned an MTU matching the smallest MTU of an enabled normal interface on the host.

The plugin requires a few things:

* The standard CNI `bridge`, `lo` and `host-local` plugins are required, at minimum version 0.2.0. Kubenet will first search for them in `/opt/cni/bin`. Specify `cni-bin-dir` to supply additional search path. The first found match will take effect.
* Kubelet must be run with the `--network-plugin=kubenet` argument to enable the plugin
* Kubelet should also be run with the `--non-masquerade-cidr=<clusterCidr>` argument to ensure traffic to IPs outside this range will use IP masquerade.
* The node must be assigned an IP subnet through either the `--pod-cidr` kubelet command-line option or the `--allocate-node-cidrs=true --cluster-cidr=<cidr>` controller-manager command-line options.

### Customizing the MTU (with kubenet)

The MTU should always be configured correctly to get the best networking performance.  Network plugins will usually try
to infer a sensible MTU, but sometimes the logic will not result in an optimal MTU.  For example, if the
Docker bridge or another interface has a small MTU, kubenet will currently select that MTU.  Or if you are
using IPSEC encapsulation, the MTU must be reduced, and this calculation is out-of-scope for
most network plugins.

Where needed, you can specify the MTU explicitly with the `network-plugin-mtu` kubelet option.  For example,
on AWS the `eth0` MTU is typically 9001, so you might specify `--network-plugin-mtu=9001`.  If you're using IPSEC you
might reduce it to allow for encapsulation overhead; for example: `--network-plugin-mtu=8873`.

This option is provided to the network-plugin; currently **only kubenet supports `network-plugin-mtu`**.

## Usage Summary

* `--network-plugin=cni` specifies that we use the `cni` network plugin with actual CNI plugin binaries located in `--cni-bin-dir` (default `/opt/cni/bin`) and CNI plugin configuration located in `--cni-conf-dir` (default `/etc/cni/net.d`).
* `--network-plugin=kubenet` specifies that we use the `kubenet` network plugin with CNI `bridge`, `lo` and `host-local` plugins placed in `/opt/cni/bin` or `cni-bin-dir`.
* `--network-plugin-mtu=9001` specifies the MTU to use, currently only used by the `kubenet` network plugin.

## {{% heading "whatsnext" %}}
