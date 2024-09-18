---
reviewers:
- sig-cluster-lifecycle
title: Creating a cluster with kubeadm
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Using `kubeadm`, you can create a minimum viable Kubernetes cluster that conforms to best practices.
In fact, you can use `kubeadm` to set up a cluster that will pass the
[Kubernetes Conformance tests](/blog/2017/10/software-conformance-certification/).
`kubeadm` also supports other cluster lifecycle functions, such as
[bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and cluster upgrades.

The `kubeadm` tool is good if you need:

- A simple way for you to try out Kubernetes, possibly for the first time.
- A way for existing users to automate setting up a cluster and test their application.
- A building block in other ecosystem and/or installer tools with a larger
  scope.

You can install and use `kubeadm` on various machines: your laptop, a set
of cloud servers, a Raspberry Pi, and more. Whether you're deploying into the
cloud or on-premises, you can integrate `kubeadm` into provisioning systems such
as Ansible or Terraform.



## {{% heading "prerequisites" %}}


To follow this guide, you need:

- One or more machines running a deb/rpm-compatible Linux OS; for example: Ubuntu or CentOS.
- 2 GiB or more of RAM per machine--any less leaves little room for your
   apps.
- At least 2 CPUs on the machine that you use as a control-plane node.
- Full network connectivity among all machines in the cluster. You can use either a
  public or a private network.


You also need to use a version of `kubeadm` that can deploy the version
of Kubernetes that you want to use in your new cluster.

[Kubernetes' version and version skew support policy](/docs/setup/release/version-skew-policy/#supported-versions)
applies to `kubeadm` as well as to Kubernetes overall.
Check that policy to learn about what versions of Kubernetes and `kubeadm`
are supported. This page is written for Kubernetes {{< param "version" >}}.

The `kubeadm` tool's overall feature state is General Availability (GA). Some sub-features are
still under active development. The implementation of creating the cluster may change
slightly as the tool evolves, but the overall implementation should be pretty stable.

{{< note >}}
Any commands under `kubeadm alpha` are, by definition, supported on an alpha level.
{{< /note >}}



<!-- steps -->

## Objectives

* Install a single control-plane Kubernetes cluster
* Install a Pod network on the cluster so that your Pods can
  talk to each other

## Instructions

### Preparing the hosts

#### Component installation

Install a {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}} and kubeadm on all the hosts.
For detailed instructions and other prerequisites, see [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
If you have already installed kubeadm, see the first two steps of the
[Upgrading Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes) document for instructions on how to upgrade kubeadm.

When you upgrade, the kubelet restarts every few seconds as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal.
After you initialize your control-plane, the kubelet runs normally.
{{< /note >}}

#### Network setup

kubeadm similarly to other Kubernetes components tries to find a usable IP on
the network interfaces associated with a default gateway on a host. Such
an IP is then used for the advertising and/or listening performed by a component.

To find out what this IP is on a Linux host you can use:

```shell
ip route show # Look for a line starting with "default via"
```

{{< note >}}
If two or more default gateways are present on the host, a Kubernetes component will
try to use the first one it encounters that has a suitable global unicast IP address.
While making this choice, the exact ordering of gateways might vary between different
operating systems and kernel versions.
{{< /note >}}

Kubernetes components do not accept custom network interface as an option,
therefore a custom IP address must be passed as a flag to all components instances
that need such a custom configuration.

{{< note >}}
If the host does not have a default gateway and if a custom IP address is not passed
to a Kubernetes component, the component may exit with an error.
{{< /note >}}

To configure the API server advertise address for control plane nodes created with both
`init` and `join`, the flag `--apiserver-advertise-address` can be used.
Preferably, this option can be set in the [kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4)
as `InitConfiguration.localAPIEndpoint` and `JoinConfiguration.controlPlane.localAPIEndpoint`.

For kubelets on all nodes, the `--node-ip` option can be passed in
`.nodeRegistration.kubeletExtraArgs` inside a kubeadm configuration file
(`InitConfiguration` or `JoinConfiguration`).

For dual-stack see
[Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

The IP addresses that you assign to control plane components become part of their X.509 certificates'
subject alternative name fields. Changing these IP addresses would require
signing new certificates and restarting the affected components, so that the change in
certificate files is reflected. See
[Manual certificate renewal](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
for more details on this topic.

{{< warning >}}
The Kubernetes project recommends against this approach (configuring all component instances
with custom IP addresses). Instead, the Kubernetes maintainers recommend to setup the host network,
so that the default gateway IP is the one that Kubernetes components auto-detect and use.
On Linux nodes, you can use commands such as `ip route` to configure networking; your operating
system might also provide higher level network management tools. If your node's default gateway
is a public IP address, you should configure packet filtering or other security measures that
protect the nodes and your cluster.
{{< /warning >}}

### Preparing the required container images

This step is optional and only applies in case you wish `kubeadm init` and `kubeadm join`
to not download the default container images which are hosted at `registry.k8s.io`.

Kubeadm has commands that can help you pre-pull the required images
when creating a cluster without an internet connection on its nodes.
See [Running kubeadm without an internet connection](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
for more details.

Kubeadm allows you to use a custom image repository for the required images.
See [Using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
for more details.

### Initializing your control-plane node

The control-plane node is the machine where the control plane components run, including
{{< glossary_tooltip term_id="etcd" >}} (the cluster database) and the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
(which the {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} command line tool
communicates with).

1. (Recommended) If you have plans to upgrade this single control-plane `kubeadm` cluster
to [high availability](/docs/setup/production-environment/tools/kubeadm/high-availability/)
you should specify the `--control-plane-endpoint` to set the shared endpoint for all control-plane nodes.
Such an endpoint can be either a DNS name or an IP address of a load-balancer.
1. Choose a Pod network add-on, and verify whether it requires any arguments to
be passed to `kubeadm init`. Depending on which
third-party provider you choose, you might need to set the `--pod-network-cidr` to
a provider-specific value. See [Installing a Pod network add-on](#pod-network).
1. (Optional) `kubeadm` tries to detect the container runtime by using a list of well
known endpoints. To use different container runtime or if there are more than one installed
on the provisioned node, specify the `--cri-socket` argument to `kubeadm`. See
[Installing a runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

To initialize the control-plane node run:

```bash
kubeadm init <args>
```

### Considerations about apiserver-advertise-address and ControlPlaneEndpoint

While `--apiserver-advertise-address` can be used to set the advertise address for this particular
control-plane node's API server, `--control-plane-endpoint` can be used to set the shared endpoint
for all control-plane nodes.

`--control-plane-endpoint` allows both IP addresses and DNS names that can map to IP addresses.
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

For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/).

To configure `kubeadm init` with a configuration file see
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

To customize control plane components, including optional IPv6 assignment to liveness probe
for control plane components and etcd server, provide extra arguments to each component as documented in
[custom arguments](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

To run `kubeadm init` again, you must first [tear down the cluster](#tear-down).

If you join a node with a different architecture to your cluster, make sure that your deployed DaemonSets
have container image support for this architecture.

`kubeadm init` first runs a series of prechecks to ensure that the machine
is ready to run Kubernetes. These prechecks expose warnings and exit on errors. `kubeadm init`
then downloads and installs the cluster control plane components. This may take several minutes.
After it finishes you should see:

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
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

{{< warning >}}
The kubeconfig file `admin.conf` that `kubeadm init` generates contains a certificate with
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. The group `kubeadm:cluster-admins`
is bound to the built-in `cluster-admin` ClusterRole.
Do not share the `admin.conf` file with anyone.

`kubeadm init` generates another kubeconfig file `super-admin.conf` that contains a certificate with
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` is a break-glass, super user group that bypasses the authorization layer (for example RBAC).
Do not share the `super-admin.conf` file with anyone. It is recommended to move the file to a safe location.

See
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
on how to use `kubeadm kubeconfig user` to generate kubeconfig files for additional users.
{{< /warning >}}

Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
need this command to [join nodes to your cluster](#join-nodes).

The token is used for mutual authentication between the control-plane node and the joining
nodes. The token included here is secret. Keep it safe, because anyone with this
token can add authenticated nodes to your cluster. These tokens can be listed,
created, and deleted with the `kubeadm token` command. See the
[kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Installing a Pod network add-on {#pod-network}

{{< caution >}}
This section contains important information about networking setup and
deployment order.
Read all of this advice carefully before proceeding.

**You must deploy a
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) based Pod network add-on so that your Pods can communicate with each other.
Cluster DNS (CoreDNS) will not start up before a network is installed.**

- Take care that your Pod network must not overlap with any of the host
  networks: you are likely to see problems if there is any overlap.
  (If you find a collision between your network plugin's preferred Pod
  network and some of your host networks, you should think of a suitable
  CIDR block to use instead, then use that during `kubeadm init` with
  `--pod-network-cidr` and as a replacement in your network plugin's YAML).

- By default, `kubeadm` sets up your cluster to use and enforce use of
  [RBAC](/docs/reference/access-authn-authz/rbac/) (role based access
  control).
  Make sure that your Pod network plugin supports RBAC, and so do any manifests
  that you use to deploy it.

- If you want to use IPv6--either dual-stack, or single-stack IPv6 only
  networking--for your cluster, make sure that your Pod network plugin
  supports IPv6.
  IPv6 support was added to CNI in [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Kubeadm should be CNI agnostic and the validation of CNI providers is out of the scope of our current e2e testing.
If you find an issue related to a CNI plugin you should log a ticket in its respective issue
tracker instead of the kubeadm or kubernetes issue trackers.
{{< /note >}}

Several external projects provide Kubernetes Pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/network-policies/).

See a list of add-ons that implement the
[Kubernetes networking model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).


Please refer to the [Installing Addons](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
page for a non-exhaustive list of networking addons supported by Kubernetes.
You can install a Pod network add-on with the following command on the
control-plane node or a node that has the kubeconfig credentials:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Only a few CNI plugins support Windows. More details and setup instructions can be found
in [Adding Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config).
{{< /note >}}

You can install only one Pod network per cluster.

Once a Pod network has been installed, you can confirm that it is working by
checking that the CoreDNS Pod is `Running` in the output of `kubectl get pods --all-namespaces`.
And once the CoreDNS Pod is up and running, you can continue by joining your nodes.

If your network is not working or CoreDNS is not in the `Running` state, check out the
[troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
for `kubeadm`.

### Managed node labels

By default, kubeadm enables the [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
admission controller that restricts what labels can be self-applied by kubelets on node registration.
The admission controller documentation covers what labels are permitted to be used with the kubelet `--node-labels` option.
The `node-role.kubernetes.io/control-plane` label is such a restricted label and kubeadm manually applies it using
a privileged client after a node has been created. To do that manually you can do the same by using `kubectl label`
and ensure it is using a privileged kubeconfig such as the kubeadm managed `/etc/kubernetes/admin.conf`.

### Control plane node isolation

By default, your cluster will not schedule Pods on the control plane nodes for security
reasons. If you want to be able to schedule Pods on the control plane nodes,
for example for a single machine Kubernetes cluster, run:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

The output will look something like:

```
node "test-01" untainted
...
```

This will remove the `node-role.kubernetes.io/control-plane:NoSchedule` taint
from any nodes that have it, including the control plane nodes, meaning that the
scheduler will then be able to schedule Pods everywhere.

Additionally, you can execute the following command to remove the
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers) label
from the control plane node, which excludes it from the list of backend servers:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Adding more control plane nodes

See [Creating Highly Available Clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) for steps on creating a high availability kubeadm cluster by adding more control plane
nodes.

### Adding worker nodes {#join-nodes}

The worker nodes are where your workloads run.

The following pages show how to add Linux and Windows worker nodes to the cluster by using
the `kubeadm join` command:

* [Adding Linux worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Adding Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Optional) Controlling your cluster from machines other than the control-plane node

In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your control-plane node
to your workstation like this:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you grant privileges. You can do
this with the `kubeadm kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, grant
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

## Clean up {#tear-down}

If you used disposable servers for your cluster, for testing, you can
switch those off and do no further clean up. You can use
`kubectl config delete-cluster` to delete your local references to the
cluster.

However, if you want to deprovision your cluster more cleanly, you should
first [drain the node](/docs/reference/generated/kubectl/kubectl-commands#drain)
and make sure that the node is empty, then deconfigure the node.

### Remove the node

Talking to the control-plane node with the appropriate credentials, run:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

Before removing the node, reset the state installed by `kubeadm`:

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

Now remove the node:
```bash
kubectl delete node <node name>
```

If you wish to start over, run `kubeadm init` or `kubeadm join` with the
appropriate arguments.

### Clean up the control plane

You can use `kubeadm reset` on the control plane host to trigger a best-effort
clean up.

See the [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
reference documentation for more information about this subcommand and its
options.


## Version skew policy {#version-skew-policy}

While kubeadm allows version skew against some components that it manages, it is recommended that you
match the kubeadm version with the versions of the control plane components, kube-proxy and kubelet.

### kubeadm's skew against the Kubernetes version

kubeadm can be used with Kubernetes components that are the same version as kubeadm
or one version older. The Kubernetes version can be specified to kubeadm by using the
`--kubernetes-version` flag of `kubeadm init` or the
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)
field when using `--config`. This option will control the versions
of kube-apiserver, kube-controller-manager, kube-scheduler and kube-proxy.

Example:
* kubeadm is at {{< skew currentVersion >}}
* `kubernetesVersion` must be at {{< skew currentVersion >}} or {{< skew currentVersionAddMinor -1 >}}

### kubeadm's skew against the kubelet

Similarly to the Kubernetes version, kubeadm can be used with a kubelet version that is
the same version as kubeadm or three versions older.

Example:
* kubeadm is at {{< skew currentVersion >}}
* kubelet on the host must be at {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}}, {{< skew currentVersionAddMinor -2 >}} or {{< skew currentVersionAddMinor -3 >}}

### kubeadm's skew against kubeadm

There are certain limitations on how kubeadm commands can operate on existing nodes or whole clusters
managed by kubeadm.

If new nodes are joined to the cluster, the kubeadm binary used for `kubeadm join` must match
the last version of kubeadm used to either create the cluster with `kubeadm init` or to upgrade
the same node with `kubeadm upgrade`. Similar rules apply to the rest of the kubeadm commands
with the exception of `kubeadm upgrade`.

Example for `kubeadm join`:
* kubeadm version {{< skew currentVersion >}} was used to create a cluster with `kubeadm init`
* Joining nodes must use a kubeadm binary that is at version {{< skew currentVersion >}}

Nodes that are being upgraded must use a version of kubeadm that is the same MINOR
version or one MINOR version newer than the version of kubeadm used for managing the
node.

Example for `kubeadm upgrade`:
* kubeadm version {{< skew currentVersionAddMinor -1 >}} was used to create or upgrade the node
* The version of kubeadm used for upgrading the node must be at {{< skew currentVersionAddMinor -1 >}}
or {{< skew currentVersion >}}

To learn more about the version skew between the different Kubernetes component see
the [Version Skew Policy](/releases/version-skew-policy/).

## Limitations {#limitations}

### Cluster resilience {#resilience}

The cluster created here has a single control-plane node, with a single etcd database
running on it. This means that if the control-plane node fails, your cluster may lose
data and may need to be recreated from scratch.

Workarounds:

* Regularly [back up etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). The
  etcd data directory configured by kubeadm is at `/var/lib/etcd` on the control-plane node.

* Use multiple control-plane nodes. You can read
  [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) to pick a cluster
  topology that provides [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Platform compatibility {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Multiplatform container images for the control plane and addons are also supported since v1.12.

Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.

## Troubleshooting {#troubleshooting}

If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).


<!-- discussion -->

## What's next {#whats-next}

* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />See [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  for details about upgrading your cluster using `kubeadm`.
* Learn about advanced `kubeadm` usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/reference/kubectl/).
* See the [Cluster Networking](/docs/concepts/cluster-administration/networking/) page for a bigger list
  of Pod network add-ons.
* <a id="other-addons" />See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to
  explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp;
  control of your Kubernetes cluster.
* Configure how your cluster handles logs for cluster events and from
  applications running in Pods.
  See [Logging Architecture](/docs/concepts/cluster-administration/logging/) for
  an overview of what is involved.

### Feedback {#feedback}

* For bugs, visit the [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* For support, visit the
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack channel
* General SIG Cluster Lifecycle development Slack channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycle mailing list:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
