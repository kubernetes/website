---
title: Dual-stack support with kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Your Kubernetes cluster includes [dual-stack](/docs/concepts/services-networking/dual-stack/)
networking, which means that cluster networking lets you use either address family.
In a cluster, the control plane can assign both an IPv4 address and an IPv6 address to a single
{{< glossary_tooltip text="Pod" term_id="pod" >}} or a {{< glossary_tooltip text="Service" term_id="service" >}}.

<!-- body -->

## {{% heading "prerequisites" %}}

You need to have installed the {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} tool,
following the steps from [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

For each server that you want to use as a {{< glossary_tooltip text="node" term_id="node" >}},
make sure it allows IPv6 forwarding. On Linux, you can set this by running run
`sysctl -w net.ipv6.conf.all.forwarding=1` as the root user on each server.

You need to have an IPv4 and and IPv6 address range to use. Cluster operators typically
use private address ranges for IPv4. For IPv6, a cluster operator typically chooses a global
unicast address block from within `2000::/3`, using a range that is assigned to the operator.
You don't have to route the cluster's IP address ranges to the public internet.

The size of the IP address allocations should be suitable for the number of Pods and
Services that you are planning to run.

{{< note >}}
If you are upgrading an existing cluster with the `kubeadm upgrade` command,
`kubeadm` does not support making modifications to the pod IP address range
(“cluster CIDR”) nor to the cluster's Service address range (“Service CIDR”).
{{< /note >}}

### Create a dual-stack cluster

To create a dual-stack cluster with `kubeadm init` you can pass command line arguments
similar to the following example:

```shell
# These address ranges are examples
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

To make things clearer, here is an example kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for the primary dual-stack control plane node.

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

`advertiseAddress` in InitConfiguration specifies the IP address that the API Server
will advertise it is listening on. The value of `advertiseAddress` equals the
`--apiserver-advertise-address` flag of `kubeadm init`.

Run kubeadm to initiate the dual-stack control plane node:

```shell
kubeadm init --config=kubeadm-config.yaml
```

The kube-controller-manager flags `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
are set with default values. See [configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

{{< note >}}
The `--apiserver-advertise-address` flag does not support dual-stack.
{{< /note >}}

### Join a node to dual-stack cluster

Before joining a node, make sure that the node has IPv6 routable network interface and allows IPv6 forwarding.

Here is an example kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for joining a worker node to the cluster.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

Also, here is an example kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for joining another control plane node to the cluster.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

`advertiseAddress` in JoinConfiguration.controlPlane specifies the IP address that the
API Server will advertise it is listening on. The value of `advertiseAddress` equals
the `--apiserver-advertise-address` flag of `kubeadm join`.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Create a single-stack cluster

{{< note >}}
Dual-stack support doesn't mean that you need to use dual-stack addressing.
You can deploy a single-stack cluster that has the dual-stack networking feature enabled.
{{< /note >}}

To make things more clear, here is an example kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for the single-stack control plane node.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
* Read about [Dual-stack](/docs/concepts/services-networking/dual-stack/) cluster networking
* Learn more about the kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta4/)
