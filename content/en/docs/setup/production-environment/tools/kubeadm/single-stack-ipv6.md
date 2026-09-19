---
title: Single-stack IPv6 support with kubeadm
content_type: task
weight: 105
min-kubernetes-server-version: 1.23
---

<!-- overview -->

This page shows how to create a {{< glossary_tooltip text="cluster" term_id="cluster" >}} that
uses single-stack IPv6 networking: every {{< glossary_tooltip text="Pod" term_id="pod" >}} and
{{< glossary_tooltip text="Service" term_id="service" >}} gets an IPv6 address, and no IPv4
addresses are assigned within the cluster.

Single-stack IPv6 is one of the address-family options that
[Kubernetes networking](/docs/concepts/services-networking/dual-stack/) supports, alongside
single-stack IPv4 and [dual-stack](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).

<!-- body -->

## {{% heading "prerequisites" %}}

You need to have installed the {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} tool,
following the steps from [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

For each server that you want to use as a {{< glossary_tooltip text="node" term_id="node" >}},
make sure that:

* The node has an IPv6-routable network interface.
* The node allows IPv6 packet forwarding.

### Enable IPv6 packet forwarding {#prerequisite-ipv6-forwarding}

To check if IPv6 packet forwarding is enabled:

```bash
sysctl net.ipv6.conf.all.forwarding
```
If the output is `net.ipv6.conf.all.forwarding = 1` it is already enabled.
Otherwise it is not enabled yet.

To manually enable IPv6 packet forwarding:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

### Choose an IPv6 address range

Cluster operators typically choose a global unicast address block from within
`2000::/3`, using a range that is assigned to the operator, or a unique local address
(ULA) range within `fc00::/7` for private clusters. You don't have to route the
cluster's IP address ranges to the public internet.

The size of the IP address allocations should be suitable for the number of Pods and
Services that you are planning to run. The examples on this page use the documentation
prefix `2001:db8::/32`; replace it with your own range.

{{< note >}}
Make sure that the CNI plugin you plan to install supports IPv6-only clusters.
Check your CNI provider's documentation before you create the cluster.
{{< /note >}}

## Create a single-stack IPv6 cluster

To create a single-stack IPv6 cluster with `kubeadm init`, provide only IPv6 CIDRs for
the Pod and Service address ranges. Here is an example
[kubeadm configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for the control plane node:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 2001:db8:42:0::/56
  serviceSubnet: 2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "2001:db8:42:2::1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "2001:db8:42:2::1"
```

Notes:

* `advertiseAddress` in InitConfiguration specifies the IP address that the API Server
  will advertise it is listening on. The value of `advertiseAddress` equals the
  `--apiserver-advertise-address` flag of `kubeadm init`.
* The `--apiserver-advertise-address` flag does not support dual-stack; on a
  single-stack IPv6 cluster it must be an IPv6 address.
* Setting `node-ip` to the node's IPv6 address keeps the kubelet from trying to
  select an address that does not fit the cluster's single address family.

Run kubeadm to initiate the control plane node:

```shell
kubeadm init --config=kubeadm-config.yaml
```

The kube-controller-manager flag `--node-cidr-mask-size-ipv6` is set with a default
value of /64. See
[configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

### Join a node to the single-stack IPv6 cluster

Before joining a node, make sure that the node has an IPv6-routable network interface
and allows IPv6 forwarding.

Here is an example kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for joining a worker node to the cluster.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: "[2001:db8:42:2::1]:6443"
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "2001:db8:42:2::2"
```

```shell
kubeadm join --config=kubeadm-config.yaml
```

{{< note >}}
When the API server endpoint is an IPv6 literal address, enclose it in square
brackets followed by the port, as in `[2001:db8:42:2::1]:6443`.
{{< /note >}}

## Check that Pods receive IPv6 addresses

After installing an IPv6-capable CNI plugin, create a Pod and check its address:

```shell
kubectl run --image=registry.k8s.io/e2e-test-images/jessie-dnsutils:1.3 --restart=Never mtx -- sleep 10000
kubectl get pod mtx -o jsonpath='{.status.podIPs}'
```

The output shows a single IPv6 address for the Pod, for example:

```
[{"ip":"2001:db8:42:0::a"}]
```

## CoreDNS upstream DNS resolution

On a single-stack IPv6 cluster, pods have no IPv4 route at all. This affects CoreDNS,
which by default forwards upstream DNS queries using the node's
`/etc/resolv.conf` (the `forward . /etc/resolv.conf` stanza of its Corefile). If the
node's resolver is IPv4-only — for example, a DHCP-issued IPv4 nameserver — CoreDNS
cannot reach it, fails with a `network is unreachable` error, and the CoreDNS pods
never become Ready.

To fix this, point the `forward` target at an IPv6-reachable resolver. Edit the
`coredns` ConfigMap in the `kube-system` namespace:

```shell
kubectl -n kube-system edit configmap coredns
```

Change the forward target, for example to your ISP's IPv6 recursive resolver, to the
IPv6 resolver advertised by your router, or to a public IPv6 resolver such as Google's
`2001:4860:4860::8888` or Quad9's `2620:fe::fe`:

```yaml
forward . 2001:4860:4860::8888
```

After saving the ConfigMap, the CoreDNS pods reload their configuration
automatically. If a pod remains unready for longer than that, delete it so that it is
recreated with the new configuration.

## {{% heading "whatsnext" %}}

* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
* Read about [Dual-stack](/docs/concepts/services-networking/dual-stack/) cluster networking
* Learn more about the kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta4/)
