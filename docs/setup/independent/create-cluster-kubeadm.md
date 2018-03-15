---
reviewers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Using kubeadm to Create a Cluster
---

{% capture overview %}

<img src="https://raw.githubusercontent.com/cncf/artwork/master/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">**kubeadm** is a toolkit that helps you bootstrap a best-practice Kubernetes
cluster in an easy, reasonably secure and extensible way. It also supports
managing [Bootstrap Tokens](/docs/admin/bootstrap-tokens/) for you and upgrading/downgrading clusters.

kubeadm aims to set up a minimum viable cluster that pass the
[Kubernetes Conformance tests](http://blog.kubernetes.io/2017/10/software-conformance-certification.html), but installing other addons than
really necessary for a functional cluster is out of scope.

It by design does not install a networking solution for you, which means you
have to install a third-party CNI-compliant networking solution yourself
using `kubectl apply`.

kubeadm expects the user to bring a machine to execute on, the type doesn't
matter, can be a Linux laptop, virtual machine, physical/cloud server or
Raspberry Pi. This makes kubeadm well suited to integrate with provisioning
systems of different kinds (e.g. Terraform, Ansible, etc.).

kubeadm is designed to be a simple way for new users to start trying
Kubernetes out, possibly for the first time, a way for existing users to
test their application on and stitch together a cluster easily, and also to be
a building block in other ecosystem and/or installer tool with a larger
scope.

You can install _kubeadm_ very easily on operating systems that support
installing deb or rpm packages. The responsible SIG for kubeadm,
[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle), provides these packages pre-built for you,
but you may also on other OSes.


### kubeadm Maturity

| Area                      | Maturity Level |
|---------------------------|--------------- |
| Command line UX           | beta           |
| Implementation            | beta           |
| Config file API           | alpha          |
| Self-hosting              | alpha          |
| kubeadm alpha subcommands | alpha          |
| CoreDNS                   | alpha          |
| DynamicKubeletConfig      | alpha          |


kubeadm's overall feature state is **Beta** and will soon be graduated to
**General Availability (GA)** during 2018. Some sub-features, like self-hosting
or the configuration file API are still under active development. The
implementation of creating the cluster may change slightly as the tool evolves,
but the overall implementation should be pretty stable. Any commands under
`kubeadm alpha` are by definition, supported on an alpha level.


### Support timeframes

Kubernetes releases are generally supported for nine months, and during that
period a patch release may be issued from the release branch if a severe bug or
security issue is found. Here are the latest Kubernetes releases and the support
timeframe; which also applies to `kubeadm`.

| Kubernetes version | Release month  | End-of-life-month |
|--------------------|----------------|-------------------|
| v1.6.x             | March 2017     | December 2017     |
| v1.7.x             | June 2017      | March 2018        |
| v1.8.x             | September 2017 | June 2018         |
| v1.9.x             | December 2017  | September 2018    |

{% endcapture %}

{% capture prerequisites %}

1. One or more machines running a deb/rpm-compatible OS, e.g. Ubuntu or CentOS
1. 2 GB or more of RAM per machine (any less will leave little room for your
   apps)
1. 2 CPUs or more on the master
1. Full network connectivity between all machines in the cluster (public or
   private network is fine)
{% endcapture %}

{% capture steps %}

## Objectives

* Install a secure Kubernetes cluster on your machines
* Install a Pod network on the cluster so that your Pods can
  talk to each other

## Instructions

### (1/4) Installing kubeadm on your hosts

See [Installing kubeadm](/docs/setup/independent/install-kubeadm/).

**Note:** If you already have kubeadm installed, you should do a `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm.


The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal, please
proceed with the next step and the kubelet will start running normally.

### (2/4) Initializing your master

The master is the machine where the control plane components run, including
etcd (the cluster database) and the API server (which the kubectl CLI
communicates with).

To initialize the master, pick one of the machines you previously installed
kubeadm on, and run:

```bash
kubeadm init
```

**Notes:**

- Please refer to the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm/) if you want to
read more about the flags `kubeadm init` provides. You can also specify a
[configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file) instead of using flags.
- You need to choose a Pod Network Plugin in the next step. Depending on what
third-party provider you choose, you might have to set the `--pod-network-cidr` to
something provider-specific. The tabs below will contain a notice about what flags
on `kubeadm init` are required.
- Unless otherwise specified, kubeadm uses the default gateway's network interface
to advertise the master's IP. If you want to use a different network interface, specify
`--apiserver-advertise-address=<ip-address>` argument to `kubeadm init`. To deploy an IPv6 Kubernetes cluster using IPv6 addressing, you must specify an IPv6, e.g. `--apiserver-advertise-address=fd00::101`
- If you would like to customise control plane components including optional IPv6 assignment to liveness probe for control plane components and etcd server, you can do so by providing extra args to each one, as documented [here](/docs/admin/kubeadm#custom-args).
- `kubeadm init` will first run a series of prechecks to ensure that the machine
is ready to run Kubernetes. It will expose warnings and exit on errors. It
will then download and install the cluster database and control plane
components. This may take several minutes.
- You can't run `kubeadm init` twice without tearing down the cluster in between
([unless you're upgrading from v1.6 to v1.7](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/)),
see [Tear Down](#tear-down).

The output should look like:

```
[init] Using Kubernetes version: v1.8.0
[init] Using Authorization modes: [Node RBAC]
[preflight] Running pre-flight checks
[kubeadm] WARNING: starting in 1.8, tokens expire after 24 hours by default (if you require a non-expiring token use --token-ttl 0)
[certificates] Generated ca certificate and key.
[certificates] Generated apiserver certificate and key.
[certificates] apiserver serving cert is signed for DNS names [kubeadm-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.138.0.4]
[certificates] Generated apiserver-kubelet-client certificate and key.
[certificates] Generated sa key and public key.
[certificates] Generated front-proxy-ca certificate and key.
[certificates] Generated front-proxy-client certificate and key.
[certificates] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "admin.conf"
[kubeconfig] Wrote KubeConfig file to disk: "kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "controller-manager.conf"
[kubeconfig] Wrote KubeConfig file to disk: "scheduler.conf"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/manifests/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/manifests/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/manifests/kube-scheduler.yaml"
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/manifests/etcd.yaml"
[init] Waiting for the kubelet to boot up the control plane as Static Pods from directory "/etc/kubernetes/manifests"
[init] This often takes around a minute; or longer if the control plane images have to be pulled.
[apiclient] All control plane components are healthy after 39.511972 seconds
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[markmaster] Will mark node master as master by adding a label and a taint
[markmaster] Master master tainted and labelled with key/value: node-role.kubernetes.io/master=""
[bootstraptoken] Using token: <token>
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run (as a regular user):

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  http://kubernetes.io/docs/admin/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

To make kubectl work for your non-root user, you might want to run these commands (which is also a part of the `kubeadm init` output):

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Alternatively, if you are the `root` user, you could run this:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
will need this in a moment.

The token is used for mutual authentication between the master and the joining
nodes.  The token included here is secret, keep it safe as anyone with this
token can add authenticated nodes to your cluster. These tokens can be listed,
created and deleted with the `kubeadm token` command. See the
[reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/) for more details.

### (3/4) Installing a pod network {#pod-network}

You **MUST** install a pod network add-on so that your pods can communicate with
each other.

**The network must be deployed before any applications.  Also, kube-dns, an
internal helper service, will not start up before a network is installed. kubeadm only
supports Container Network Interface (CNI) based networks (and does not support kubenet).**

Several projects provide Kubernetes pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/networkpolicies/). See the [add-ons page](/docs/concepts/cluster-administration/addons/) for a complete list of available network add-ons. IPv6 support was added in [CNI v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0). [CNI bridge](https://github.com/containernetworking/plugins/blob/master/plugins/main/bridge/README.md) and [local-ipam](https://github.com/containernetworking/plugins/blob/master/plugins/ipam/host-local/README.md) are the only supported IPv6 network plugins in 1.9.


**Note:** kubeadm sets up a more secure cluster by default and enforces use of [RBAC](#TODO).
Please make sure that the network manifest of choice supports RBAC.

You can install a pod network add-on with the following command:

```bash
kubectl apply -f <add-on.yaml>
```

**NOTE:** You can install **only one** pod network per cluster.

{% capture choose %}
Please select one of the tabs to see installation instructions for the respective third-party Pod Network Provider.
{% endcapture %}

{% capture calico %}

Refer to the Calico documentation for a [kubeadm quickstart](https://docs.projectcalico.org/latest/getting-started/kubernetes/), a [kubeadm installation guide](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/kubeadm/), and other resources.

**Note:**

 - In order for Network Policy to work correctly, you need to pass `--pod-network-cidr=192.168.0.0/16` to `kubeadm init`.
 - Calico works on `amd64` only.

```shell
kubectl apply -f https://docs.projectcalico.org/v3.0/getting-started/kubernetes/installation/hosted/kubeadm/1.7/calico.yaml
```
{% endcapture %}

{% capture canal %}

The official Canal set-up guide is [here](https://github.com/projectcalico/canal/tree/master/k8s-install).

**Note:**

 - For Canal to work correctly, `--pod-network-cidr=10.244.0.0/16` has to be passed to `kubeadm init`.
 - Canal works on `amd64` only.

```shell
kubectl apply -f https://raw.githubusercontent.com/projectcalico/canal/master/k8s-install/1.7/rbac.yaml
kubectl apply -f https://raw.githubusercontent.com/projectcalico/canal/master/k8s-install/1.7/canal.yaml
```
{% endcapture %}

{% capture flannel %}

**Note:**

 - For `flannel` to work correctly, `--pod-network-cidr=10.244.0.0/16` has to be passed to `kubeadm init`.
 - `flannel` works on `amd64`, `arm`, `arm64` and `ppc64le`, but for it to work on a platform other than
`amd64` you have to manually download the manifest and replace `amd64` occurrences with your chosen platform.
 - Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

```shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.1/Documentation/kube-flannel.yml
```

 - For more information about `flannel`, please see [here](https://github.com/coreos/flannel).

{% endcapture %}

{% capture kube-router %}

Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

Kube-router relies on kube-controller-manager to allocate pod CIDR for the nodes. Therefore, use `kubeadm init` with the `--pod-network-cidr` flag.

Kube-router provides pod networking, network policy, and high-performing IP Virtual Server(IPVS)/Linux Virtual Server(LVS) based service proxy.

For information on setting up Kubernetes cluster with Kube-router using kubeadm, please see official [setup guide](https://github.com/cloudnativelabs/kube-router/blob/master/Documentation/kubeadm.md).

{% endcapture %}

{% capture romana %}

Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

The official Romana set-up guide is [here](https://github.com/romana/romana/tree/master/containerize#using-kubeadm).

**Note:** Romana works on `amd64` only.

```shell
kubectl apply -f https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml
```
{% endcapture %}

{% capture weave_net %}

Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for some CNI plugins to work, for more information
please see [here](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

The official Weave Net set-up guide is [here](https://www.weave.works/docs/net/latest/kube-addon/).

**Note:** Weave Net works on `amd64`, `arm`, `arm64` and `ppc64le` without any extra action required.
Weave Net sets hairpin mode by default. This allows Pods to access themselves via their Service IP address
if they don't know their PodIP.

```shell
export kubever=$(kubectl version | base64 | tr -d '\n')
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$kubever"
```
{% endcapture %}

{% assign tab_names = "Choose one...,Calico,Canal,Flannel,Kube-router,Romana,Weave Net" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: choose | push: calico | push: canal | push: flannel | push: kube-router | push: romana | push: weave_net %}

{% include tabs.md %}

Once a pod network has been installed, you can confirm that it is working by
checking that the kube-dns pod is Running in the output of `kubectl get pods --all-namespaces`.
And once the kube-dns pod is up and running, you can continue by joining your nodes.

If your network is not working or kube-dns is not in the Running state, check
out our [troubleshooting docs](/docs/setup/independent/troubleshooting-kubeadm/).

#### Master Isolation

By default, your cluster will not schedule pods on the master for security
reasons. If you want to be able to schedule pods on the master, e.g. for a
single-machine Kubernetes cluster for development, run:

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

With output looking something like:

```
node "test-01" untainted
taint key="dedicated" and effect="" not found.
taint key="dedicated" and effect="" not found.
```

This will remove the `node-role.kubernetes.io/master` taint from any nodes that
have it, including the master node, meaning that the scheduler will then be able
to schedule pods everywhere.

### (4/4) Joining your nodes

The nodes are where your workloads (containers and pods, etc) run. To add new nodes to your cluster do the following for each machine:

* SSH to the machine
* Become root (e.g. `sudo su -`)
* Run the command that was output by `kubeadm init`. For example:

``` bash
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

**Note:** To specify an IPv6 tuple for `<master-ip>:<master-port>`, IPv6 address must be enclosed in square brackets, for example: `[fd00::101]:2073`.
{: .note}

The output should look something like:

```
[preflight] Running pre-flight checks
[discovery] Trying to connect to API Server "10.138.0.4:6443"
[discovery] Created cluster-info discovery client, requesting info from "https://10.138.0.4:6443"
[discovery] Requesting info from "https://10.138.0.4:6443" again to validate TLS against the pinned public key
[discovery] Cluster info signature and contents are valid and TLS certificate validates against pinned roots, will use API Server "10.138.0.4:6443"
[discovery] Successfully established connection with API Server "10.138.0.4:6443"
[bootstrap] Detected server version: v1.8.0
[bootstrap] The server supports the Certificates API (certificates.k8s.io/v1beta1)
[csr] Created API client to obtain unique certificate for this node, generating keys and certificate signing request
[csr] Received signed certificate from the API server, generating KubeConfig...

Node join complete:
* Certificate signing request sent to master and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on the master to see this machine join.
```

A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the master.

### (Optional) Controlling your cluster from machines other than the master

In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your master
to your workstation like this:

``` bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

**Note:**
 - The example above assumes SSH access is enabled for root. If that is not the
   case, you can copy the `admin.conf` file to be accessible by some other user
   and `scp` using that other user instead.
 - The `admin.conf` file gives the user _superuser_ privileges over the cluster.
   This file should be used sparsingly. For normal users, it's recommended to
   generate an unique credential to which you whitelist privileges. You can do
   this with the `kubeadm alpha phase kubeconfig user --client-name <CN>`
   command. That command will print out a KubeConfig file to STDOUT which you
   should save to a file and distribute to your user. After that, whitelist
   privileges by using `kubectl create (cluster)rolebinding`.

### (Optional) Proxying API Server to localhost

If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:

```bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

You can now access the API Server locally at `http://localhost:8001/api/v1`

## Tear down {#tear-down}

To undo what kubeadm did, you should first [drain the
node](/docs/user-guide/kubectl/{{page.version}}/#drain) and make
sure that the node is empty before shutting it down.

Talking to the master with the appropriate credentials, run:

```bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
kubectl delete node <node name>
```

Then, on the node being removed, reset all kubeadm installed state:

```bash
kubeadm reset
```

If you wish to start over simply run `kubeadm init` or `kubeadm join` with the
appropriate arguments.

More options and information about the
[`kubeadm reset command`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/).

## Upgrading a kubeadm cluster {#upgrades}

Instructions for upgrading kubeadm clusters are available for:

 * [1.6 to 1.7 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/)
 * [1.7.x to 1.7.y  upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.7 to 1.8 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.8.x to 1.8.y upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.8 to 1.9 upgrades/downgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/)
 * [1.9.x to 1.9.y upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/)
 * [1.9.x to 1.9.y HA cluster upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-ha/)

## Explore other add-ons {#other-addons}

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons,
including tools for logging, monitoring, network policy, visualization &amp;
control of your Kubernetes cluster.

## What's next {#whats-next}

* Learn about kubeadm's advanced usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/kubeadm)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).
* Configure log rotation. You can use **logrotate** for that. When using Docker, you can specify log rotation options for Docker daemon, for example `--log-driver=json-file --log-opt=max-size=10m --log-opt=max-file=5`. See [Configure and troubleshoot the Docker daemon](https://docs.docker.com/engine/admin/) for more details.

## Feedback {#feedback}

* kubeadm support Slack Channel:
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* General SIG Cluster Lifecycle Development Slack Channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](#TODO)
* SIG Cluster Lifecycle Mailing List:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [kubeadm Github issue tracker](https://github.com/kubernetes/kubeadm/issues)


## Version skew policy {#version-skew-policy}

The kubeadm CLI tool of version vX.Y may deploy clusters with a control plane of version vX.Y or vX.(Y-1).
kubeadm CLI vX.Y can also upgrade an existing kubeadm-created cluster of version vX.(Y-1).

Due to that we can't see into the future, kubeadm CLI vX.Y may or may not be able to deploy vX.(Y+1) clusters.

Example: kubeadm v1.8 can deploy both v1.7 and v1.8 clusters and upgrade v1.7 kubeadm-created clusters to
v1.8.

Please also check our [installation guide](/docs/setup/independent/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)
for more information on the version skew between kubelets and the control plane.

## kubeadm works on multiple platforms {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).

Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.

## Limitations {#limitations}

Please note: kubeadm is a work in progress and these limitations will be
addressed in due course.

1. The cluster created here has a single master, with a single etcd database
   running on it. This means that if the master fails, your cluster may lose
   data and may need to be recreated from scratch. Adding HA support
   (multiple etcd servers, multiple API servers, etc) to kubeadm is
   still a work-in-progress.

   Workaround: regularly
   [back up etcd](https://coreos.com/etcd/docs/latest/admin_guide.html). The
   etcd data directory configured by kubeadm is at `/var/lib/etcd` on the master.

## Troubleshooting {#troubleshooting}

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/independent/troubleshooting-kubeadm/).

{% endcapture %}

{% include templates/task.md %}
