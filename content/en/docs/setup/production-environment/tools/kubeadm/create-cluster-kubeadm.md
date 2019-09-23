---
reviewers:
- sig-cluster-lifecycle
title: Creating a single control-plane cluster with kubeadm
content_template: templates/task
weight: 30
---

{{% capture overview %}}

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">**kubeadm** helps you bootstrap a minimum viable Kubernetes cluster that conforms to best practices.  With kubeadm, your cluster should pass [Kubernetes Conformance tests](https://kubernetes.io/blog/2017/10/software-conformance-certification). Kubeadm also supports other cluster
lifecycle functions, such as upgrades, downgrade, and managing [bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/).

Because you can install kubeadm on various types of machine (e.g. laptop, server,
Raspberry Pi, etc.), it's well suited for integration with provisioning systems
such as Terraform or Ansible.

kubeadm's simplicity means it can serve a wide range of use cases:

- New users can start with kubeadm to try Kubernetes out for the first time.
- Users familiar with Kubernetes can spin up clusters with kubeadm and test their applications.
- Larger projects can include kubeadm as a building block in a more complex system that can also include other installer tools.

kubeadm is designed to be a simple way for new users to start trying
Kubernetes out, possibly for the first time, a way for existing users to
test their application on and stitch together a cluster easily, and also to be
a building block in other ecosystem and/or installer tool with a larger
scope.

You can install _kubeadm_ very easily on operating systems that support
installing deb or rpm packages. The responsible SIG for kubeadm,
[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle), provides these packages pre-built for you,
but you may also build them from source for other OSes.


### kubeadm maturity

kubeadm's overall feature state is **GA**. Some sub-features, like the configuration
file API are still under active development. The implementation of creating the cluster
may change slightly as the tool evolves, but the overall implementation should be pretty stable.
Any commands under `kubeadm alpha` are by definition, supported on an alpha level.


### Support timeframes

Kubernetes releases are generally supported for nine months, and during that
period a patch release may be issued from the release branch if a severe bug or
security issue is found. Here are the latest Kubernetes releases and the support
timeframe; which also applies to `kubeadm`.

| Kubernetes version | Release month  | End-of-life-month |
|--------------------|----------------|-------------------|
| v1.13.x            | December 2018  | September 2019    |
| v1.14.x            | March 2019     | December 2019     |
| v1.15.x            | June 2019      | March 2020        |
| v1.16.x            | September 2019 | June 2020         |

{{% /capture %}}

{{% capture prerequisites %}}

- One or more machines running a deb/rpm-compatible OS, for example Ubuntu or CentOS
- 2 GB or more of RAM per machine. Any less leaves little room for your
   apps.
- 2 CPUs or more on the control-plane node
- Full network connectivity among all machines in the cluster. A public or
   private network is fine.

{{% /capture %}}

{{% capture steps %}}

## Objectives

* Install a single control-plane Kubernetes cluster or [high-availability cluster](/docs/setup/production-environment/tools/kubeadm/high-availability/)
* Install a Pod network on the cluster so that your Pods can
  talk to each other

## Instructions

### Installing kubeadm on your hosts

See ["Installing kubeadm"](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
If you have already installed kubeadm, run `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm.

When you upgrade, the kubelet restarts every few seconds as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal.
After you initialize your control-plane, the kubelet runs normally.
{{< /note >}}

### Initializing your control-plane node

The control-plane node is the machine where the control plane components run, including
etcd (the cluster database) and the API server (which the kubectl CLI
communicates with).

1. (Recommended) If you have plans to upgrade this single control-plane kubeadm cluster
to high availability you should specify the `--control-plane-endpoint` to set the shared endpoint
for all control-plane nodes. Such an endpoint can be either a DNS name or an IP address of a load-balancer.
1. Choose a pod network add-on, and verify whether it requires any arguments to
be passed to kubeadm initialization. Depending on which
third-party provider you choose, you might need to set the `--pod-network-cidr` to
a provider-specific value. See [Installing a pod network add-on](#pod-network).
1. (Optional) Since version 1.14, kubeadm will try to detect the container runtime on Linux
by using a list of well known domain socket paths. To use different container runtime or
if there are more than one installed on the provisioned node, specify the `--cri-socket`
argument to `kubeadm init`. See [Installing runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
1. (Optional) Unless otherwise specified, kubeadm uses the network interface associated
with the default gateway to set the advertise address for this particular control-plane node's API server.
To use a different network interface, specify the `--apiserver-advertise-address=<ip-address>` argument
to `kubeadm init`. To deploy an IPv6 Kubernetes cluster using IPv6 addressing, you
must specify an IPv6 address, for example `--apiserver-advertise-address=fd00::101`
1. (Optional) Run `kubeadm config images pull` prior to `kubeadm init` to verify
connectivity to gcr.io registries.

To initialize the control-plane node run:

```bash
kubeadm init <args>
```

### Considerations about apiserver-advertise-address and ControlPlaneEndpoint

While `--apiserver-advertise-address` can be used to set the advertise address for this particular
control-plane node's API server, `--control-plane-endpoint` can be used to set the shared endpoint
for all control-plane nodes.

`--control-plane-endpoint` allows IP addresses but also DNS names that can map to IP addresses.
Please contact your network administrator to evaluate possible solutions with respect to such mapping.

Here is an example mapping:

```
192.168.0.102 cluster-endpoint
```

Where `192.168.0.102` is the IP address of this node and `cluster-endpoint` is a custom DNS name that maps to this IP.
This will allow you to pass `--control-plane-endpoint=cluster-endpoint` to `kubeadm init` and pass the same DNS name to
`kubeadm join`. Later you can modify `cluster-endpoint` to point to the address of your load-balancer in an
high availability scenario.

Turning a single control plane cluster created without `--control-plane-endpoint` into a highly available cluster
is not supported by kubeadm.

### More information

For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm/).

For a complete list of configuration options, see the [configuration file documentation](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

To customize control plane components, including optional IPv6 assignment to liveness probe for control plane components and etcd server, provide extra arguments to each component as documented in [custom arguments](/docs/admin/kubeadm#custom-args).

To run `kubeadm init` again, you must first [tear down the cluster](#tear-down).

If you join a node with a different architecture to your cluster, make sure that your deployed DaemonSets
have container image support for this architecture.

`kubeadm init` first runs a series of prechecks to ensure that the machine
is ready to run Kubernetes. These prechecks expose warnings and exit on errors. `kubeadm init`
then downloads and installs the cluster control plane components. This may take several minutes.
The output should look like:

```none
[init] Using Kubernetes version: vX.Y.Z
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Activating the kubelet service
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [kubeadm-cp localhost] and IPs [10.138.0.4 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [kubeadm-cp localhost] and IPs [10.138.0.4 127.0.0.1 ::1]
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubeadm-cp kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.138.0.4]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 31.501735 seconds
[uploadconfig] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-X.Y" in namespace kube-system with the configuration for the kubelets in the cluster
[patchnode] Uploading the CRI Socket information "/var/run/dockershim.sock" to the Node API object "kubeadm-cp" as an annotation
[mark-control-plane] Marking the node kubeadm-cp as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node kubeadm-cp as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: <token>
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstraptoken] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

To make kubectl work for your non-root user, run these commands, which are
also part of the `kubeadm init` output:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Alternatively, if you are the `root` user, you can run:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
need this command to [join nodes to your cluster](#join-nodes).

The token is used for mutual authentication between the control-plane node and the joining
nodes. The token included here is secret. Keep it safe, because anyone with this
token can add authenticated nodes to your cluster. These tokens can be listed,
created, and deleted with the `kubeadm token` command. See the
[kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Installing a pod network add-on {#pod-network}

{{< caution >}}
This section contains important information about installation and deployment order. Read it carefully before proceeding.
{{< /caution >}}

You must install a pod network add-on so that your pods can communicate with
each other.

**The network must be deployed before any applications. Also, CoreDNS will not start up before a network is installed.
kubeadm only supports Container Network Interface (CNI) based networks (and does not support kubenet).**

Several projects provide Kubernetes pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/networkpolicies/). See the [add-ons page](/docs/concepts/cluster-administration/addons/) for a complete list of available network add-ons.
- IPv6 support was added in [CNI v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).
- [CNI bridge](https://github.com/containernetworking/plugins/blob/master/plugins/main/bridge/README.md) and [local-ipam](https://github.com/containernetworking/plugins/blob/master/plugins/ipam/host-local/README.md) are the only supported IPv6 network plugins in Kubernetes version 1.9.

Note that kubeadm sets up a more secure cluster by default and enforces use of [RBAC](/docs/reference/access-authn-authz/rbac/).
Make sure that your network manifest supports RBAC.

Also, beware, that your Pod network must not overlap with any of the host networks as this can cause issues.
If you find a collision between your network plugin’s preferred Pod network and some of your host networks, you should think of a suitable CIDR replacement and use that during `kubeadm init` with `--pod-network-cidr` and as a replacement in your network plugin’s YAML.

You can install a pod network add-on with the following command on the control-plane node or a node that has the kubeconfig credentials:

```bash
kubectl apply -f <add-on.yaml>
```

You can install only one pod network per cluster.

{{< tabs name="tabs-pod-install" >}}
{{% tab name="Choose one..." %}}
Please select one of the tabs to see installation instructions for the respective third-party Pod Network Provider.
{{% /tab %}}

{{% tab name="AWS VPC" %}}
AWS VPC CNI provides native AWS VPC networking to Kubernetes clusters.

For installation, please refer to the [AWS VPC CNI setup guide](https://github.com/aws/amazon-vpc-cni-k8s#setup).
{{% /tab %}}

{{% tab name="Calico" %}}
For more information about using Calico, see [Quickstart for Calico on Kubernetes](https://docs.projectcalico.org/latest/getting-started/kubernetes/), [Installing Calico for policy and networking](https://docs.projectcalico.org/latest/getting-started/kubernetes/installation/calico), and other related resources.

For Calico to work correctly, you need to pass `--pod-network-cidr=192.168.0.0/16` to `kubeadm init` or update the `calico.yml` file to match your Pod network. Note that Calico works on `amd64`, `arm64`, and `ppc64le` only.

```shell
kubectl apply -f https://docs.projectcalico.org/v3.8/manifests/calico.yaml
```

{{% /tab %}}
{{% tab name="Canal" %}}
Canal uses Calico for policy and Flannel for networking. Refer to the Calico documentation for the [official getting started guide](https://docs.projectcalico.org/latest/getting-started/kubernetes/installation/flannel).

For Canal to work correctly, `--pod-network-cidr=10.244.0.0/16` has to be passed to `kubeadm init`. Note that Canal works on `amd64` only.

```shell
kubectl apply -f https://docs.projectcalico.org/v3.8/manifests/canal.yaml
```

{{% /tab %}}

{{% tab name="Cilium" %}}
For more information about using Cilium with Kubernetes, see [Kubernetes Install guide for Cilium](https://docs.cilium.io/en/stable/kubernetes/).

For Cilium to work correctly, you must pass `--pod-network-cidr=10.217.0.0/16` to `kubeadm init`.

These commands will deploy Cilium with its own etcd managed by etcd operator.

_Note_: If you are running kubeadm in a single node please untaint it so that
etcd-operator pods can be scheduled in the control-plane node.

```shell
kubectl taint nodes <node-name> node-role.kubernetes.io/master:NoSchedule-
```

To deploy Cilium you just need to run:

```shell
kubectl create -f https://raw.githubusercontent.com/cilium/cilium/v1.5/examples/kubernetes/1.14/cilium.yaml
```

Once all Cilium pods are marked as `READY`, you start using your cluster.

```shell
kubectl get pods -n kube-system --selector=k8s-app=cilium
```
The output is similar to this:
```
NAME           READY   STATUS    RESTARTS   AGE
cilium-drxkl   1/1     Running   0          18m
```

{{% /tab %}}

{{% tab name="Contiv-VPP" %}}
[Contiv-VPP](https://contivpp.io/) employs a programmable CNF vSwitch based on [FD.io VPP](https://fd.io/),
offering feature-rich & high-performance cloud-native networking and services.

It implements k8s services and network policies in the user space (on VPP).

Please refer to this installation guide: [Contiv-VPP Manual Installation](https://github.com/contiv/vpp/blob/master/docs/setup/MANUAL_INSTALL.md)
{{% /tab %}}

{{% tab name="Flannel" %}}

For `flannel` to work correctly, you must pass `--pod-network-cidr=10.244.0.0/16` to `kubeadm init`.

Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

Make sure that your firewall rules allow UDP ports 8285 and 8472 traffic for all hosts participating in the overlay network.
see [here
](https://coreos.com/flannel/docs/latest/troubleshooting.html#firewalls).

Note that `flannel` works on `amd64`, `arm`, `arm64`, `ppc64le` and `s390x` under Linux.
Windows (`amd64`) is claimed as supported in v0.11.0 but the usage is undocumented.

```shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/32a765fd19ba45b387fdc5e3812c41fff47cfd55/Documentation/kube-flannel.yml
```

For more information about `flannel`, see [the CoreOS flannel repository on GitHub
](https://github.com/coreos/flannel).
{{% /tab %}}

{{% tab name="JuniperContrail/TungstenFabric" %}}
Provides overlay SDN solution, delivering multicloud networking, hybrid cloud networking,
simultaneous overlay-underlay support, network policy enforcement, network isolation,
service chaining and flexible load balancing.

There are multiple, flexible ways to install JuniperContrail/TungstenFabric CNI.

Kindly refer to this quickstart: [TungstenFabric](https://tungstenfabric.github.io/website/)
{{% /tab %}}

{{% tab name="Kube-router" %}}
Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

Kube-router relies on kube-controller-manager to allocate pod CIDR for the nodes. Therefore, use `kubeadm init` with the `--pod-network-cidr` flag.

Kube-router provides pod networking, network policy, and high-performing IP Virtual Server(IPVS)/Linux Virtual Server(LVS) based service proxy.

For information on setting up Kubernetes cluster with Kube-router using kubeadm, please see official [setup guide](https://github.com/cloudnativelabs/kube-router/blob/master/docs/kubeadm.md).
{{% /tab %}}

{{% tab name="Romana" %}}
Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

The official Romana set-up guide is [here](https://github.com/romana/romana/tree/master/containerize#using-kubeadm).

Romana works on `amd64` only.

```shell
kubectl apply -f https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml
```
{{% /tab %}}

{{% tab name="Weave Net" %}}
Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

The official Weave Net set-up guide is [here](https://www.weave.works/docs/net/latest/kube-addon/).

Weave Net works on `amd64`, `arm`, `arm64` and `ppc64le` without any extra action required.
Weave Net sets hairpin mode by default. This allows Pods to access themselves via their Service IP address
if they don't know their PodIP.

```shell
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```
{{% /tab %}}

{{< /tabs >}}


Once a pod network has been installed, you can confirm that it is working by
checking that the CoreDNS pod is Running in the output of `kubectl get pods --all-namespaces`.
And once the CoreDNS pod is up and running, you can continue by joining your nodes.

If your network is not working or CoreDNS is not in the Running state, checkout our [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

### Control plane node isolation

By default, your cluster will not schedule pods on the control-plane node for security
reasons. If you want to be able to schedule pods on the control-plane node, e.g. for a
single-machine Kubernetes cluster for development, run:

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

With output looking something like:

```
node "test-01" untainted
taint "node-role.kubernetes.io/master:" not found
taint "node-role.kubernetes.io/master:" not found
```

This will remove the `node-role.kubernetes.io/master` taint from any nodes that
have it, including the control-plane node, meaning that the scheduler will then be able
to schedule pods everywhere.

### Joining your nodes {#join-nodes}

The nodes are where your workloads (containers and pods, etc) run. To add new nodes to your cluster do the following for each machine:

* SSH to the machine
* Become root (e.g. `sudo su -`)
* Run the command that was output by `kubeadm init`. For example:

``` bash
kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
```

If you do not have the token, you can get it by running the following command on the control-plane node:

``` bash
kubeadm token list
```

The output is similar to this:

``` console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

By default, tokens expire after 24 hours. If you are joining a node to the cluster after the current token has expired,
you can create a new token by running the following command on the control-plane node:

``` bash
kubeadm token create
```

The output is similar to this:

``` console
5didvk.d09sbcov8ph2amjw
```

If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the following command chain on the control-plane node:

``` bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

The output is similar to this:

``` console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

{{< note >}}
To specify an IPv6 tuple for `<control-plane-host>:<control-plane-ip>`, IPv6 address must be enclosed in square brackets, for example: `[fd00::101]:2073`.
{{< /note >}}

The output should look something like:

```
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the control-plane node.

### (Optional) Controlling your cluster from machines other than the control-plane node

In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your control-plane node
to your workstation like this:

``` bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you whitelist privileges. You can do
this with the `kubeadm alpha kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, whitelist
privileges by using `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Optional) Proxying API Server to localhost

If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

You can now access the API Server locally at `http://localhost:8001/api/v1`

## Tear down {#tear-down}

To undo what kubeadm did, you should first [drain the
node](/docs/reference/generated/kubectl/kubectl-commands#drain) and make
sure that the node is empty before shutting it down.

Talking to the control-plane node with the appropriate credentials, run:

```bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
kubectl delete node <node name>
```

Then, on the node being removed, reset all kubeadm installed state:

```bash
kubeadm reset
```

The reset process does not reset or clean up iptables rules or IPVS tables. If you wish to reset iptables, you must do so manually:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

If you want to reset the IPVS tables, you must run the following command:

```bash
ipvsadm -C
```

If you wish to start over simply run `kubeadm init` or `kubeadm join` with the
appropriate arguments.

More options and information about the
[`kubeadm reset command`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/).

## Maintaining a cluster {#lifecycle}

Instructions for maintaining kubeadm clusters (e.g. upgrades,downgrades, etc.) can be found [here.](/docs/tasks/administer-cluster/kubeadm)

## Explore other add-ons {#other-addons}

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons,
including tools for logging, monitoring, network policy, visualization &amp;
control of your Kubernetes cluster.

## What's next {#whats-next}

* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* Learn about kubeadm's advanced usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/kubeadm)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).
* Configure log rotation. You can use **logrotate** for that. When using Docker, you can specify log rotation options for Docker daemon, for example `--log-driver=json-file --log-opt=max-size=10m --log-opt=max-file=5`. See [Configure and troubleshoot the Docker daemon](https://docs.docker.com/engine/admin/) for more details.

## Feedback {#feedback}

* For bugs, visit [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* For support, visit kubeadm Slack Channel:
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* General SIG Cluster Lifecycle Development Slack Channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](#TODO)
* SIG Cluster Lifecycle Mailing List:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)

## Version skew policy {#version-skew-policy}

The kubeadm CLI tool of version vX.Y may deploy clusters with a control plane of version vX.Y or vX.(Y-1).
kubeadm CLI vX.Y can also upgrade an existing kubeadm-created cluster of version vX.(Y-1).

Due to that we can't see into the future, kubeadm CLI vX.Y may or may not be able to deploy vX.(Y+1) clusters.

Example: kubeadm v1.8 can deploy both v1.7 and v1.8 clusters and upgrade v1.7 kubeadm-created clusters to
v1.8.

These resources provide more information on supported version skew between kubelets and the control plane, and other Kubernetes components:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)

## kubeadm works on multiple platforms {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).

Multiplatform container images for the control plane and addons are also supported since v1.12.

Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.

## Limitations {#limitations}

The cluster created here has a single control-plane node, with a single etcd database
running on it. This means that if the control-plane node fails, your cluster may lose
data and may need to be recreated from scratch.

Workarounds:

* Regularly [back up etcd](https://coreos.com/etcd/docs/latest/admin_guide.html). The
  etcd data directory configured by kubeadm is at `/var/lib/etcd` on the control-plane node.

* Use multiple control-plane nodes by completing the
  [HA setup](/docs/setup/independent/ha-topology) instead.

## Troubleshooting {#troubleshooting}

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
