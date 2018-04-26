---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Using kubeadm to Create a Cluster
---

{% capture overview %}

<!--
This quickstart shows you how to easily install a Kubernetes cluster on machines
running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+. The installation uses a
tool called _kubeadm_ which is part of Kubernetes.  As of v1.6, kubeadm aims to
create a secure cluster out of the box via mechanisms such as RBAC.
-->
该教程展示了如何在运行着Ubuntu 16.04+, CentOS 7 或 HypriotOS v1.0.1+的机器上安装Kubernetes
集群。安装过程使用了_kubeadm_这个工具，这也是Kubernetes的一部分。至于1.6版本，kubeadm
主要通过RBAC等机制建立安全的集群。

<!--
This process works with local VMs, physical servers and/or cloud servers. It is
simple enough that you can easily integrate its use into your own automation
(Terraform, Chef, Puppet, etc).
-->
该教程适用于本地VM，物理机或者是云服务器。它非常简单，以致可以很容易的植入到你的自动化工具当中，
比如Terraform, Chef, Puppet等等。

<!--
See the full [kubeadm reference](/docs/admin/kubeadm/) for information on all
kubeadm command-line flags and for advice on automating kubeadm itself.
-->
如需了解kubeadm命令行的所有参数和本身自动化的一些建议，请查阅[kubeadm reference](/docs/admin/kubeadm).

<!--
kubeadm assumes you have a set of machines (virtual or real) that are up and
running.  It is designed to be part of a large provisioning system - or just for
easy manual provisioning.  kubeadm is a great choice where you have your own
infrastructure (e.g. bare metal), or where you have an existing orchestration
system (e.g. Puppet) that you have to integrate with.
-->
kubeadm 假设你已经用了一批可以正常运行的物理或者虚拟机器。可以是一个大型发布系统的一部分，也可以是一个
简易的人工发布系统。如果你已经有了自己的基础架构，或者已经有了自动化系统，kubeadm是用于集成其中
的一个非常好的选择。

<!--
If you are not constrained, there are other higher-level tools built to give you
complete clusters:
-->
如果你还尚未拥有自己的架构，可以考虑下面的高级工具，可以给你提供一个完整的集群：

<!--
* On GCE, [Google Container Engine](https://cloud.google.com/container-engine/)
  gives you one-click Kubernetes clusters.
* On AWS, [kops](https://github.com/kubernetes/kops) makes cluster installation
  and management easy.  kops supports building high availability clusters (a
  feature that kubeadm is currently lacking but is building toward).
-->

* GCE, [Google Container Engine](https://cloud.google.com/container-engine/)
  一键生成Kubernetes集群.
* AWS, [kops](https://github.com/kubernetes/kops) 安装和管理集群都非常简单。kops同时还支持
创建高可用集群。这是当前kubeadm所缺乏。

<!--
### kubeadm Maturity
-->
### kubeadm 版本
<!--
| Aspect | Maturity Level
|--------|---------------
| Command line UX | beta
| Config file | alpha
| Self-hosting | alpha
| `kubeadm alpha` commands | alpha
| Implementation | beta
-->

| 功能	 | 版本
|--------|---------------
| Command line UX | beta
| Config file | alpha
| Selfhosting | alpha
| `kubeadm alpha` commands | alpha
| Implementation | alpha

<!--
The experience for the command line is currently in beta and we are trying hard
not to change command line flags and break that flow.  Other parts of the
experience are still under active development.  The implementation may change
slightly as the tool evolves to support even easier upgrades and high
availability (HA).  Any commands under `kubeadm alpha` (not documented here)
are, of course, alpha.
-->
现在命令行的操作还处于开发测试当中，我们正在努力不要改变命令行参数破坏这些流程。
其他的部分也在开发当中，特别是kubeadm所依赖的一些功能，比如bootstrap tokens或cluster signing，
都还在测试开发当中。安装流程可能会改变，因为这些工具的发展会更加方便升级和高可用部署。`kubeadm alpha`
的任何命令，当然，也都还在测试开发当中。

<!--
**Be sure to read the [limitations](#limitations)**.  Specifically, configuring
cloud providers is difficult.
-->
**一定要阅读这个 [限制说明](#limitations)**.  但是配置云服务是不同的方式。
{% endcapture %}

{% capture prerequisites %}

<!--
1. One or more machines running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+
1. 1GB or more of RAM per machine (any less will leave little room for your
   apps)
1. Full network connectivity between all machines in the cluster (public or
   private network is fine)
-->
1. 一台或多台运行Ubuntu 16.04+, CentOS 7 或 HypriotOS v1.0.1+
2. 每台机器1GB 或者更多内存，太少可能无法运行你的应用。
3. 集群中完整的网络连接，公网或者私网都可以。

{% endcapture %}

{% capture steps %}

<!--
## Objectives

* Install a secure Kubernetes cluster on your machines
* Install a pod network on the cluster so that application components (pods) can
  talk to each other
* Install a sample microservices application (a socks shop) on the cluster
-->
## 目标

* 在你的机器上建立一个安全的Kubernetes集群。
* 在集群里安装网络插件，以便应用之间可以相互通讯。
* 在集群上安装一个简单的微服务。

<!--
## Instructions

### (1/4) Installing kubeadm on your hosts
-->
## 步骤

### (1/4) 在你的host机器上安装kubeadm

<!--
See [Installing kubeadm](/docs/setup/independent/install-kubeadm/).

**Note:** If you already have kubeadm installed, you should do a `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm.


The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.
-->
请先查阅 [安装 kubeadm](/docs/setup/independent/install-kubeadm/)

**注意** 如果你已经安装了kubeadm,你需要运行`apt-get update &&
apt-get upgrade` 或者 `yum update` 来升级到最新版本的kubeadm.

现在kubelet会每几秒钟重启，在crashloop状态中等待kubeadm的命令。

<!--
### (2/4) Initializing your master

The master is the machine where the control plane components run, including
etcd (the cluster database) and the API server (which the kubectl CLI
communicates with).

To initialize the master, pick one of the machines you previously installed
kubeadm on, and run:
-->

### (2/4) 初始化你的master节点

Master节点就是运行着控制组件的机器，包括
etcd (集群数据库) 和API服务(kubectl CLI通讯服务).

初始化master结点, 只要在随便一台你之前安装过kubeadm的机器，并运行:


``` bash
kubeadm init
```
<!--
**Note:**

 - You need to choose a Pod Network Plugin in the next step. Depending on what
third-party provider you choose, you might have to set the `--pod-network-cidr` to
something provider-specific. The tabs below will contain a notice about what flags
on `kubeadm init` are required.
 - This will autodetect the network interface to advertise the master on
as the interface with the default gateway. If you want to use a different
interface, specify `--apiserver-advertise-address=<ip-address>` argument to `kubeadm
init`.

Please refer to the [kubeadm reference doc](/docs/admin/kubeadm/) if you want to
read more about the flags `kubeadm init` provides.
-->
**注意:**
 - 下一步，你需要选择一个网络插件。取决于你使用哪个第三方提供商，你可能需要为了适应提供商的要求而使用这个
参数`--pod-network-cidr`,下面会提示`kubeadm init`所需要的参数。
 - 这会自动检测网络接口，并决定将master服务发布以默认网关的方式发布在哪个接口。如果需要使用一个不同的接口，
你可以在`kubeadm init`后面使用参数`--apiserver-advertise-address=<ip-address>`。

请参考 [kubeadm 参考文档](/docs/admin/kubeadm/)，如果你想了解更多`kubeadm init`提供的功能。

<!--
`kubeadm init` will first run a series of prechecks to ensure that the machine
is ready to run Kubernetes.  It will expose warnings and exit on errors. It
will then download and install the cluster database and control plane
components. This may take several minutes.
-->
`kubeadm init` 首先会执行一系列的预先检查以确保所有机器都具备运行Kubernetes的环境。它会发出警告，
并在出错时退出。正常的话，它会下载并安装集群数据库和控制面板组件。这可能会花费一些时间。

<!--
You can't run `kubeadm init` twice without tearing down the cluster in between
([unless you're upgrading from v1.6 to v1.7](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/)),
see [Tear Down](#tear-down).

The output should look like:
-->
你可以执行两次`kubeadm init`而不需要拆散集群，除非你从1.6版本升级到1.7
(/docs/tasks/administer-cluster/kubeadm-upgrade-1-7)),
详情请查阅[拆散集群](#tear-down).

输出大概会是下列这样:

```
[kubeadm] WARNING: kubeadm is in beta, please do not use it for production clusters.
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
<!--
Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
will need this in a moment.

The token is used for mutual authentication between the master and the joining
nodes.  The token included here is secret, keep it safe &mdash; anyone with this
token can add authenticated nodes to your cluster.  These tokens can be listed,
created and deleted with the `kubeadm token` command.  See the [reference
guide](/docs/admin/kubeadm/#manage-tokens).
-->
请记录上面`kubeadm init`输出里`kubeadm join`这个命令的用法，因为你很快会使用到。

这个token是用于主从节点之间的验证，因此请妥善保管，任何人拥有这个token，都可以随便
往你的集群里添加节点。可以使用`kubeadm token`来列出token,创建以及删除。请查阅
[向导指引](/docs/admin/kubeadm/#manage-tokens).

<!--
### (3/4) Installing a pod network {#pod-network}

You **must** install a pod network add-on so that your pods can communicate with
each other.

**The network must be deployed before any applications.  Also, kube-dns, a
helper service, will not start up before a network is installed. kubeadm only
supports Container Network Interface (CNI) based networks (and does not support kubenet).**

Several projects provide Kubernetes pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/networkpolicies/). See the [add-ons
page](/docs/concepts/cluster-administration/addons/) for a complete list of available network add-ons.
-->
### (3/4) 安装一个网络插件 {#pod-network}

安装一个网络插件是必须的，因为你的pods之间需要彼此沟通。

**网络部署必须是优先于任何应用的部署。而且,kube-dns, 一个很有用处的服务，
将无法启用除非网络部署成功。kubeadm只支持容器网络接口（CNI）的网络类型。（不支持kubenet）**

有些项目提供了基于CNI的Kubernetes pod网络，有些也支持[网络协议]
(/docs/concepts/services-networking/networkpolicies/). 查看 [插件页面]
(/docs/concepts/cluster-administration/addons/) 有完整的可用插件列表。

<!--
**New for Kubernetes 1.6:** kubeadm 1.6 sets up a more secure cluster by
default.  As such it uses RBAC to grant limited privileges to workloads running
on the cluster.  This includes networking integrations.  As such, ensure that
you are using a network system that has been updated to run with 1.6 and RBAC.
-->
**对于Kubernetes 1.6:** kubeadm 1.6 默认就配置了一个比较安全的集群。因为它使用RBAC来赋予
有限的权限给集群上运行的负载。其中也包含了网络分区，因此，确保你使用的网络系统已经升级到
1.6版本并支持RBAC。

<!--
You can install a pod network add-on with the following command:
-->
使用下列命令安装网络插件:

``` bash
kubectl apply -f <add-on.yaml>
```
<!--
**NOTE:** You can install **only one** pod network per cluster.
-->
**注意:** 每个集群只需要安装一个网络插件。

{% capture choose %}
<!--
Please select one of the tabs to see installation instructions for the respective third-party Pod Network Provider.
-->
请选择对应的第三方网络插件的安装向导.

{% endcapture %}

{% capture calico %}
<!--
The official Calico guide is [here](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/kubeadm/).
-->
Calico 官方向导：[here](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/kubeadm/)

<!--
**Note:**

 - In order for Network Policy to work correctly, you need to pass `--pod-network-cidr=192.168.0.0/16` to `kubeadm init`.
 - Calico works on `amd64` only.
-->
**注意:**
 - 为了可以让网络协议正确运行，必须在执行`kubeadm init`时添加参数`--pod-network-cidr=192.168.0.0/16`.
 - Calico只能在`amd64`上运行。

```shell
kubectl apply -f https://docs.projectcalico.org/v2.6/getting-started/kubernetes/installation/hosted/kubeadm/1.6/calico.yaml
```
{% endcapture %}

{% capture canal %}
<!--
The official Canal set-up guide is [here](https://github.com/projectcalico/canal/tree/master/k8s-install).

**Note:**

 - For Canal to work correctly, `--pod-network-cidr=10.244.0.0/16` has to be passed to `kubeadm init`.
 - Canal works on `amd64` only.
-->
Canal官方配置向导：[here](https://github.com/projectcalico/canal/tree/master/k8s-install)

**注意:**
 - 为了Canal可以正常运行，必须在执行`kubeadm init`时使用 `--pod-network-cidr=10.244.0.0/16` 。
 - Canal只能在`amd64`上运行.

```shell
kubectl apply -f https://raw.githubusercontent.com/projectcalico/canal/master/k8s-install/1.6/rbac.yaml
kubectl apply -f https://raw.githubusercontent.com/projectcalico/canal/master/k8s-install/1.6/canal.yaml
```
{% endcapture %}

{% capture flannel %}

<!--
**Note:**

 - For flannel to work correctly, `--pod-network-cidr=10.244.0.0/16` has to be passed to `kubeadm init`.
 - flannel works on `amd64`, `arm`, `arm64` and `ppc64le`, but for it to work on an other platform than
`amd64` you have to manually download the manifest and replace `amd64` occurences with your chosen platform.
-->
**注意:**
 - 为了flannel可以正常运行, 必须在执行`kubeadm init`时使用参数`--pod-network-cidr=10.244.0.0/16`。
 - flannel可以在`amd64`, `arm`, `arm64` 和 `ppc64le`上运行, 为了可以在其他平台上工作，你可以手动下载配置文件，
 并替换`amd64`为你所选择的平台。

```shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.0/Documentation/kube-flannel.yml
```
{% endcapture %}

{% capture kube-router %}

Kube-router relies on kube-controll-manager to allocate pod CIDR for the nodes. Therefore, use `kubeadm init` with the `--pod-network-cidr` flag.

Kube-router provides pod networking, network policy, and high-performing IP Virtual Server(IPVS)/Linux Virtual Server(LVS) based service proxy.

For information on setting up Kubernetes cluster with Kube-router using kubeadm please see official [setup guide](https://github.com/cloudnativelabs/kube-router/blob/master/Documentation/kubeadm.md).

{% endcapture %}

{% capture romana %}
<!--
The official Romana set-up guide is [here](https://github.com/romana/romana/tree/master/containerize#using-kubeadm).

**Note:** Romana works on `amd64` only.
-->
Romana官方配置向导： [here](https://github.com/romana/romana/tree/master/containerize#using-kubeadm)

**注意:** Romana 只能在`amd64`上运行。

```shell
kubectl apply -f https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml
```
{% endcapture %}

{% capture weave_net %}

<!--
The official Weave Net set-up guide is [here](https://www.weave.works/docs/net/latest/kube-addon/).

**Note:** Weave Net works on `amd64`, `arm` and `arm64` without any extra action required.
Weave Net sets hairpin mode by default. This allows Pods to access themselves via their Service IP address
if they don't know their PodIP.
-->
Weave Net官方配置文档： [here](https://www.weave.works/docs/net/latest/kube-addon/)

**注意:** Weave Net 只能在`amd64`, `arm` 和 `arm64` 上运行。

```shell
export kubever=$(kubectl version | base64 | tr -d '\n')
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$kubever"
```
{% endcapture %}

{% assign tab_names = "Choose one...,Calico,Canal,Flannel,Kube-router,Romana,Weave Net" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: choose | push: calico | push: canal | push: flannel | push: kube-router | push: romana | push: weave_net %}

{% include tabs.md %}
<!--
Once a pod network has been installed, you can confirm that it is working by
checking that the kube-dns pod is Running in the output of `kubectl get pods --all-namespaces`.
And once the kube-dns pod is up and running, you can continue by joining your nodes.

If your network is not working or kube-dns is not in the Running state, check
out the [troubleshooting section](#troubleshooting) below.
-->
一旦网络插件安装成功，就可以通过检查kube-dns pod的运行状态来判断是否网络插件正常运行。
执行命令：`kubectl get pods --all-namespaces`
只要kube-dns pod是正常运行状态，则可以继续添加从节点了。

如果你的网络无法正常工作，或者kube-dns不是正常运行的状态 ，请查看[查错向导](#troubleshooting)。

<!--
#### Master Isolation

By default, your cluster will not schedule pods on the master for security
reasons. If you want to be able to schedule pods on the master, e.g. for a
single-machine Kubernetes cluster for development, run:
-->
#### 隔离主节点

默认，你的集群出于安全原因，并不会在主节点上运行pod，如果你想在主节点上运行pod，比如
说一个单机的kubernetes集群，运行：

``` bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```
<!--
With output looking something like:
-->
输出类似这样：

```
node "test-01" untainted
taint key="dedicated" and effect="" not found.
taint key="dedicated" and effect="" not found.
```
<!--
This will remove the `node-role.kubernetes.io/master` taint from any nodes that
have it, including the master node, meaning that the scheduler will then be able
to schedule pods everywhere.
-->
这会从配置了 `node-role.kubernetes.io/master` 污染标志的节点，移除污染标志。
包括主节点，这表示scheduler可以在任何节点上安排运行pod。

<!--
### (4/4) Joining your nodes

The nodes are where your workloads (containers and pods, etc) run. To add new nodes to your cluster do the following for each machine:

* SSH to the machine
* Become root (e.g. `sudo su -`)
* Run the command that was output by `kubeadm init`. For example:
-->
### (4/4) 添加从节点

节点就是你的负载（容器和pod等等）运行的地方，往集群里添加节点，只需要在每台机器上执行下列几步：

* SSH 登录机器
* 切换到root (比如 `sudo su -`)
* 执行`kubeadm init`输出里的那句命令. 比如:

  ``` bash
  kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```
<!--
The output should look something like:
-->
输出类似这样:

```
[kubeadm] WARNING: kubeadm is in beta, please do not use it for production clusters.
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
<!--
A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the master.
-->
几秒后，你在主节点上运行`kubectl get nodes`就可以看到你新加的机器了。

<!--
### (Optional) Controlling your cluster from machines other than the master

In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your master
to your workstation like this:
-->
### (可选操作) 从非主节点上管理集群

为了可以在其他电脑上使用kubectl来管理你的集群，可以从主节点上复制管理员
的kubeconfig文件到你的电脑上：

``` bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```
<!--
**Note:** If you are using GCE, instances disable ssh access for root by default.
If that's the case you can log in to the machine, copy the file someplace that
can be accessed and then use
[`gcloud compute copy-files`](https://cloud.google.com/sdk/gcloud/reference/compute/copy-files).
-->
**注意** 如果你使用的是GCE, 默认禁止root 的ssh登录权限，如果这是你的主要登录方式，
可以复制这个文件并使用命令：
[`gcloud compute copy-files`](https://cloud.google.com/sdk/gcloud/reference/compute/copy-files).

<!--
### (Optional) Proxying API Server to localhost

If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:
-->
### (可选操作) 映射API服务到本地

如果你想从集群外部连接到API服务，可以使用工具`kubectl proxy`:

``` bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```
<!--
You can now access the API Server locally at `http://localhost:8001/api/v1`
-->
你现在就可以在本地这样 `http://localhost:8001/api/v1` 访问到API服务了。

<!--
### (Optional) Installing a sample application

Now it is time to take your new cluster for a test drive.  Sock Shop is a sample
microservices application that shows how to run and connect a set of services on
Kubernetes. To learn more about the sample microservices app, see the [GitHub
README](https://github.com/microservices-demo/microservices-demo).
-->
### (可选操作) 部署一个微服务

现在可以测试你新搭建的集群了，Sock Shop就是一个微服务的样本，它体现了在Kubernetes里
如果运行和连接一系列的服务。想了解更多关于微服务的内容，请查看[GitHub README]
(https://github.com/microservices-demo/microservices-demo).

<!--
Note that the Sock Shop demo only works on `amd64`.
-->
注意这个Sock Shop只能在 `amd64`平台上运行。

``` bash
kubectl create namespace sock-shop
kubectl apply -n sock-shop -f "https://github.com/microservices-demo/microservices-demo/blob/master/deploy/kubernetes/complete-demo.yaml?raw=true"
```
<!--
You can then find out the port that the [NodePort feature of
services](/docs/concepts/services-networking/service/) allocated for the front-end service by
running:
-->
可以通过以下命令来查看前端服务是否有开放对应的端口，端口信息请查阅[服务端口信息]
(/docs/concepts/services-networking/service/)。

``` bash
kubectl -n sock-shop get svc front-end
```
<!--
Sample output:
-->
类似输出:

```
NAME        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
front-end   10.110.250.153   <nodes>       80:30001/TCP   59s
```
<!--
It takes several minutes to download and start all the containers, watch the
output of `kubectl get pods -n sock-shop` to see when they're all up and
running.

Then go to the IP address of your cluster's master node in your browser, and
specify the given port. So for example, `http://<master_ip>:<port>`. In the
example above, this was `30001`, but it may be a different port for you.

If there is a firewall, make sure it exposes this port to the internet before
you try to access it.

To uninstall the socks shop, run `kubectl delete namespace sock-shop` on the
master.
-->
可能需要几分钟时间来下载和启用所有的容器，查看`kubectl get pods -n sock-shop`
的输出来获知服务的状态。

然后在你的浏览器里访问集群主节点的IP和对应的端口，比如`http://<master_ip>:<port>`。
在这个例子里，可能是`30001` ， 但是它可能跟你的会不一样。

如果有防火墙的话，确保在你访问之前开放了对应的端口。

卸载socks shop, 只需要在主节点上运行`kubectl delete namespace sock-shop`。

<!--
## Tear down

To undo what kubeadm did, you should first [drain the
node](/docs/user-guide/kubectl/{{page.version}}/#drain) and make
sure that the node is empty before shutting it down.

Talking to the master with the appropriate credentials, run:
-->
## 拆散集群

想要撤销kubeadm做的事情，首先要[排除节点](/docs/user-guide/kubectl/v1.6/#drain)
并确保在关闭节点之前要清空节点。

在主节点上运行：

``` bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
kubectl delete node <node name>
```
<!--
Then, on the node being removed, reset all kubeadm installed state:
-->
然后在需要移除的节点上，重置kubeadm的安装状态。

``` bash
kubeadm reset
```
<!--
If you wish to start over simply run `kubeadm init` or `kubeadm join` with the
appropriate arguments.
-->
如果你想重新配置集群，只要运行`kubeadm init`或者`kubeadm join`并使用所需的参数。
<!--
## Upgrading

Instructions for upgrading kubeadm clusters are available for:
-->
## 升级

升级kubeadm集群的文档：[here](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/).

 * [1.6 to 1.7 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/)
 * [1.7.x to 1.7.y  upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.7 to 1.8 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.8.x to 1.8.y upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
<!--
## Explore other add-ons

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons,
including tools for logging, monitoring, network policy, visualization &amp;
control of your Kubernetes cluster.
-->
## 探索其他插件

需要其他插件信息，请查看[插件列表](/docs/concepts/cluster-administration/addons/)
包括日志，监控，网络协议，可视化控制工具等。

## What's next

* Learn about kubeadm's advanced usage on the [advanced reference
  doc](/docs/admin/kubeadm/).
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).
* Configure log rotation. You can use **logrotate** for that. When using Docker, you can specify log rotation options for Docker daemon, for example `--log-driver=json-file --log-opt=max-size=10m --log-opt=max-file=5`. See [Configure and troubleshoot the Docker daemon](https://docs.docker.com/engine/admin/) for more details.

<!--
## Feedback

* kubeadm support Slack Channel:
  [kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* General SIG Cluster Lifecycle Development Slack Channel:
  [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Mailing List:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [GitHub Issues in the kubeadm
  repository](https://github.com/kubernetes/kubeadm/issues)
-->
## 反馈

* kubeadm 维护的 Slack 频道:
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* General SIG Cluster Lifecycle Development Slack Channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Mailing List:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [GitHub Issues in the kubeadm
  repository](https://github.com/kubernetes/kubeadm/issues)

<!--
## Version skew policy

The kubeadm CLI tool of version vX.Y may deploy clusters with a control plane of version vX.Y or vX.(Y-1).
kubeadm CLI vX.Y can also upgrade an existing kubeadm-created cluster of version vX.(Y-1).

Due to that we can't see into the future, kubeadm CLI vX.Y may or may not be able to deploy vX.(Y+1) clusters.

Example: kubeadm v1.8 can deploy both v1.7 and v1.8 clusters and upgrade v1.7 kubeadm-created clusters to
v1.8.
-->
## 版本命名规则

kubeadm命令行工具版本X.Y，可以部署集群具有一个版本X.Y或者X.Y-1的控制界面，也可以升级一个已存在的集群到
版本X.Y-1。

我们也无法预测将来，kubeadm命令行工具版本X.Y可能行也可能不行部署X.Y+1的版本集群。

例子：kubeadm 1.7版可以部署1.6或者1.7版本的集群，也可以升级1.6版本的集群到1.7版。

<!--
## kubeadm is multi-platform {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).

Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.
-->
## kubeadm 是多平台工具 {#multi-platform}

kubeadm deb/rpm 包和源码文件可以面向amd64, arm (32-bit), arm64, ppc64le, 和 s390x的平台编译，
参考[多平台用法](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/multi-platform.md).

并非所有网络插件都支持所有平台，请参考网络插件列表或者对应文档，以确定是否支持你所选择的平台。

<!--
## Limitations

Please note: kubeadm is a work in progress and these limitations will be
addressed in due course.

1. The cluster created here has a single master, with a single etcd database
   running on it. This means that if the master fails, your cluster loses its
   configuration data and will need to be recreated from scratch. Adding HA
   support (multiple etcd servers, multiple API servers, etc) to kubeadm is
   still a work-in-progress.

   Workaround: regularly [back up
   etcd](https://coreos.com/etcd/docs/latest/admin_guide.html). The etcd data
   directory configured by kubeadm is at `/var/lib/etcd` on the master.
-->
## 限制

请注意: kubeadm 还在开发当中，因此这些限制会在不断的开发版本中出现。

1. 这篇文章创建的集群只有一个单主机，和一个单etcd数据库。这表示如果主节点宕机了，
   你的集群将会丢失所有配置数据，这时就只能重新配置集群了。添加HA的支持目前正在
   开发当中。（多etcd数据，多API服务等）

   变通办法: 常规做法 [备份etcd](https://coreos.com/etcd/docs/latest/admin_guide.html).
   kubeadm配置的etcd数据目录位于主节点上：`/var/lib/etcd`

<!--
## Troubleshooting {#troubleshooting}

You may have trouble in the configuration if you see Pod statuses like `RunContainerError`,
`CrashLoopBackOff` or `Error`.
-->
## 疑难排除 {#troubleshooting}

当你看到Pod的状态是`RunContainerError`,`CrashLoopBackOff` 或者 `Error`，
这可能就是你的配置上有问题。

<!--
1. **There are Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state**.
    Right after `kubeadm init` there should not be any such Pods. If there are Pods in
    such a state _right after_ `kubeadm init`, please open an issue in the kubeadm repo.
    `kube-dns` should be in the `Pending` state until you have deployed the network solution.
    However, if you see Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state
    after deploying the network solution and nothing happens to `kube-dns`, it's very
    likely that the Pod Network solution that you installed is somehow broken. You
    might have to grant it more RBAC privileges or use a newer version. Please file
    an issue in the Pod Network providers' issue tracker and get the issue triaged there.
-->
1. **有一些Pods的状态是`RunContainerError`, `CrashLoopBackOff` 或者 `Error` state**.
    如果是刚刚执行`kubeadm init`，那应该不会有这样的Pods. 如果真的有Pod是这样的状态，
    而且是刚刚执行了`kubeadm init` ， 请在kubeadm的repo里开一个issue .`kube-dns`应该是在
    `Pending`直到你部署了网络插件。如果部署了网络插件后，你的Pod是这样的状态`RunContainerError`,
    `CrashLoopBackOff`或者 `Error`而且`kube-dns`状态没有变化，很有可能是你的网络部署有问题。
    可能需要赋予更多RBAC权限或者使用更新的版本。请往网络提供商提交一个issue，在那里获取解决方案。

<!--
1. **The `kube-dns` Pod is stuck in the `Pending` state forever**.
    This is expected and part of the design. kubeadm is network provider-agnostic, so the admin
    should [install the pod network solution](/docs/concepts/cluster-administration/addons/)
    of choice. You have to install a Pod Network
    before `kube-dns` may deployed fully. Hence the `Pending` state before the network is set up.
-->
1. **`kube-dns`一直卡在 `Pending`状态**.
    这是正常的，符合设计的。因为kubeadm对于网络提供商而言是透明的，因此管理员必须先安装网络插件，
    [安装网络插件](/docs/concepts/cluster-administration/addons/)，必须在`kube-dns`运行之前部署网络，
    因此`Pending`状态代表网络正在搭建中。

<!--
1. **I tried to set `HostPort` on one workload, but it didn't have any effect**.
    The `HostPort` and `HostIP` functionality is available depending on your Pod Network
    provider. Please contact the author of the Pod Network solution to find out whether
    `HostPort` and `HostIP` functionality are available.

    If not, you may still use the [NodePort feature of
    services](/docs/concepts/services-networking/service/#type-nodeport) or use `HostNetwork=true`.
-->
1. **我试着在节点上配置 `HostPort`，但没有任何效果**.
    `HostPort`和 `HostIP` 功能依赖于你的网络解决方案。请联系你的网络解决方案提供商
    以找到解决办法。

    如果找不到解决办法，你可能还要使用[服务端口信息](/docs/concepts/services-networking/service/#type-nodeport)
    或使用 `HostNetwork=true`.

1. **Pods cannot access themselves via their Service IP**.
    Many network add-ons do not yet enable [hairpin mode](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/#a-pod-cannot-reach-itself-via-service-ip)
    which allows pods to access themselves via their Service IP if they don't know about their podIP. This is an issue
    related to [CNI](https://github.com/containernetworking/cni/issues/476). Please contact the providers of the network
    add-on providers to get timely information about whether they support hairpin mode
<!--
1. If you are using VirtualBox (directly or via Vagrant), you will need to
   ensure that `hostname -i` returns a routable IP address (i.e. one on the
   second network interface, not the first one). By default, it doesn't do this
   and kubelet ends-up using first non-loopback network interface, which is
   usually NATed. Workaround: Modify `/etc/hosts`, take a look at this
   `Vagrantfile`[ubuntu-vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) for how this can be achieved.
-->

1. 如果你使用VirtualBox (直接或者通过Vagrant), 必须先确保`hostname -i`返回一个
   路由可达的IP地址，默认，它不会这样做，而是选择第一个非loopback的网络接口，通常会使用NAT技术。
   变通方案：修改`/etc/hosts` ， 查阅[`Vagrantfile`][ubuntu-vagrantfile]，看看怎么解决。


1. The following error indicates a possible certificate mismatch.

```
# kubectl get po
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

Verify that the `$HOME/.kube/config` file contains a valid certificate, and regenerate a certificate if necessary.
Another workaround is to overwrite the default `kubeconfig` for the "admin" user:

```
mv  $HOME/.kube $HOME/.kube.bak
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

1. If you are using CentOS and encounter difficulty while setting up the master node，
verify that your Docker cgroup driver matches the kubelet config:

```bash
docker info |grep -i cgroup
cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

If the Docker cgroup driver and the kubelet config don't match, change the kubelet config to match the Docker cgroup driver.

Update

```bash
KUBELET_CGROUP_ARGS=--cgroup-driver=systemd
```

To

```bash
KUBELET_CGROUP_ARGS=--cgroup-driver=cgroupfs
```

Then restart kubelet:

```bash
systemctl daemon-reload
systemctl restart kubelet
```
<!--
The `kubectl describe pod` or `kubectl logs` commands can help you diagnose errors. For example:-->
当在排查Kubernetes问题时，有一些很有用的命令可以帮忙诊断的，就是`kubectl describe pod`
或者 `kubectl logs`. 使用例子如下:

```bash
kubectl -n ${NAMESPACE} describe pod ${POD_NAME}

kubectl -n ${NAMESPACE} logs ${POD_NAME} -c ${CONTAINER_NAME}
```

{% endcapture %}

{% include templates/task.md %}
