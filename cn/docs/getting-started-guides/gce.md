<!--
---
assignees:
- brendandburns
- jbeda
- mikedanese
- thockin
title: Running Kubernetes on Google Compute Engine
---

The example below creates a Kubernetes cluster with 4 worker node Virtual Machines and a master Virtual Machine (i.e. 5 VMs in your cluster). This cluster is set up and controlled from your workstation (or wherever you find convenient).

* TOC
{:toc}
-->
---
approvers:
- brendandburns
- jbeda
- mikedanese
- thockin
title: 在 Google 计算引擎上运行 Kubernetes
---

下面的例子创建了4个工作节点虚拟机和一个主虚拟机（例如，你的集群里有5个虚拟机）。这个集群从你的工作平台建立和控制（或者你方便的任何地方）。

* TOC
{:toc}

<!--
### Before you start

If you want a simplified getting started experience and GUI for managing clusters, please consider trying [Google Container Engine](https://cloud.google.com/container-engine/) (GKE) for hosted cluster installation and management.

If you want to use custom binaries or pure open source Kubernetes, please continue with the instructions below.
-->

### 开始之前

如果你想要一个精简的入门体验和 GUI 管理集群，请考虑尝试 [Google 容器引擎](https://cloud.google.com/container-engine/)（GKE）来托管集群安装和管理。

如果你想使用自定义二进制文件或纯开源 Kubernetes，请继续参考下面。

<!--
### Prerequisites

1. You need a Google Cloud Platform account with billing enabled. Visit the [Google Developers Console](https://console.cloud.google.com) for more details.
1. Install `gcloud` as necessary. `gcloud` can be installed as a part of the [Google Cloud SDK](https://cloud.google.com/sdk/).
1. Enable the [Compute Engine Instance Group Manager API](https://console.developers.google.com/apis/api/replicapool.googleapis.com/overview) in the [Google Cloud developers console](https://console.developers.google.com/apis/library).
1. Make sure that gcloud is set to use the Google Cloud Platform project you want. You can check the current project using `gcloud config list project` and change it via `gcloud config set project <project-id>`.
1. Make sure you have credentials for GCloud by running `gcloud auth login`.
1. (Optional)  In order to make API calls against GCE, you must also run `gcloud auth application-default login`.
1. Make sure you can start up a GCE VM from the command line.  At least make sure you can do the [Create an instance](https://cloud.google.com/compute/docs/instances/#startinstancegcloud) part of the GCE Quickstart.
1. Make sure you can ssh into the VM without interactive prompts.  See the [Log in to the instance](https://cloud.google.com/compute/docs/instances/#sshing) part of the GCE Quickstart.
-->

### 先决条件

1. 你需要一个开启账单的 Google 云平台账户。浏览 [Google 开发控制台](https://console.cloud.google.com)获取更多详细内容。
1. 安装 `gcloud` 是必要。`gcloud` 作为 [Google 云 SDK](https://cloud.google.com/sdk/) 的一部分，可以被安装。
1. 在 [Google 云开发控制台](https://console.developers.google.com/apis/library)开启[计算引擎实例组管理 API](https://console.developers.google.com/apis/api/replicapool.googleapis.com/overview)
1. 确保 gcloud 被设置为你想要使用的 Google 云平台工程。你可以使用 `gcloud config list project` 检查当前的工程，通过 `gcloud config set project <project-id>` 来修改。
1. 通过运行 `gcloud auth login` 确保你有 GCloud 权限。
1. 确保你能通过命令行启动一个 GCE VM。至少确保你能做[创建一个实例](https://cloud.google.com/compute/docs/instances/#startinstancegcloud)的 GCE 快速开始部分。
1. 确保你能无交互提示地 ssh 进 VM。看[登录到实例](https://cloud.google.com/compute/docs/instances/#sshing)的 GCE 快速开始部分。

<!--
### Starting a cluster

You can install a client and start a cluster with either one of these commands (we list both in case only one is installed on your machine):


```shell
curl -sS https://get.k8s.io | bash
```

or

```shell
wget -q -O - https://get.k8s.io | bash
```

Once this command completes, you will have a master VM and four worker VMs, running as a Kubernetes cluster.

By default, some containers will already be running on your cluster. Containers like `fluentd` provide [logging](/docs/user-guide/logging/overview), while `heapster` provides [monitoring](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/README.md) services.

The script run by the commands above creates a cluster with the name/prefix "kubernetes". It defines one specific cluster config, so you can't run it more than once.

Alternately, you can download and install the latest Kubernetes release from [this page](https://github.com/kubernetes/kubernetes/releases), then run the `<kubernetes>/cluster/kube-up.sh` script to start the cluster:

```shell
cd kubernetes
cluster/kube-up.sh
```

If you want more than one cluster running in your project, want to use a different name, or want a different number of worker nodes, see the `<kubernetes>/cluster/gce/config-default.sh` file for more fine-grained configuration before you start up your cluster.

If you run into trouble, please see the section on [troubleshooting](/docs/getting-started-guides/gce/#troubleshooting), post to the
[kubernetes-users group](https://groups.google.com/forum/#!forum/kubernetes-users), or come ask questions on [Slack](/docs/troubleshooting/#slack).

The next few steps will show you:

1. How to set up the command line client on your workstation to manage the cluster
1. Examples of how to use the cluster
1. How to delete the cluster
1. How to start clusters with non-default options (like larger clusters)
-->

### 启动一个集群

你可以安装一个客户端并且使用下面任一命令启动一个集群（我们列出两个以防只有一个命令安装在你的机器上）：

```shell
curl -sS https://get.k8s.io | bash
```

或

```shell
wget -q -O - https://get.k8s.io | bash
```

一旦这个命令完成，你将有一个主 VM 和四个工作 VM，作为 Kubernetes 集群运行。

默认的，一些容器已经运行在你的集群。像容器 `fluentd` 提供[日志](/docs/user-guide/logging/overview)，同时 `heapster` 提供[监控](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/README.md)服务。

通过上面命令运行脚本创建一个集群命名／前缀为 “kubernetes”。它定义了一个指定的集群配置，所以你不能多次运行它。

或者，你可以从[这个页面](https://github.com/kubernetes/kubernetes/releases)下载安装最新的 Kubernetes 版本，然后运行 `<kubernetes>/cluster/kube-up.sh` 脚本来开启集群：

```shell
cd kubernetes
cluster/kube-up.sh
```

如果你想要多于一个集群运行在你的工程，想使用一个不同的名字，或者想要一个不同数量的工作节点，在你启动你的集群之前更多细粒度配置看 `<kubernetes>/cluster/gce/config-default.sh` 文件。

如果你运行出现问题，请看[问题分析](/docs/getting-started-guides/gce/#troubleshooting)部分，提交到 [kubernetes 用户组](https://groups.google.com/forum/#!forum/kubernetes-users)，或者在 [Slack](/docs/troubleshooting/#slack) 上提问题。

接下来的一些步骤将展示给你：

1. 如何在你的工作平台建立命令行客户端来管理你的集群
1. 如何使用集群的例子
1. 如何删除集群
1. 如何启动非默认选项的集群（像更大的集群）

<!--
### Installing the Kubernetes command line tools on your workstation

The cluster startup script will leave you with a running cluster and a `kubernetes` directory on your workstation.

The [kubectl](/docs/user-guide/kubectl/) tool controls the Kubernetes cluster
manager.  It lets you inspect your cluster resources, create, delete, and update
components, and much more. You will use it to look at your new cluster and bring
up example apps.

You can use` gcloud` to install the `kubectl` command-line tool on your workstation:

     gcloud components install kubectl

**Note:** The kubectl version bundled with `gcloud` may be older than the one
downloaded by the get.k8s.io install script. See [Installing kubectl](/docs/tasks/kubectl/install/)
document to see how you can set up the latest `kubectl` on your workstation.
-->

### 在你的工作站安装 Kubernetes 命令行工具

集群启动脚本将运行集群并在你的工作站上留下一个 `kubernetes` 目录。

[kubectl](/docs/user-guide/kubectl/) 工具管理 Kubernetes 集群。它可以让你审查你的集群资源，创建，删除，和更新组件，还有更多。你将使用它来查看你的新集群和启动例子应用。

你可以在你的工作站使用 `gcloud` 来安装 `kubectl` 命令行工具：

     gcloud components install kubectl

**注：** 与 `gcloud` 绑定的 kubectl 版本也许比从 get.k8s.io 下载安装脚本要旧。看[安装 kubectl](/docs/tasks/kubectl/install/) 文档来了解你如何在工作站安装最新的 `kubectl`。

<!--
### Getting started with your cluster

#### Inspect your cluster

Once `kubectl` is in your path, you can use it to look at your cluster. E.g., running:

```shell
$ kubectl get --all-namespaces services
```

should show a set of [services](/docs/user-guide/services) that look something like this:

```shell
NAMESPACE     NAME                  CLUSTER_IP       EXTERNAL_IP       PORT(S)        AGE
default       kubernetes            10.0.0.1         <none>            443/TCP        1d
kube-system   kube-dns              10.0.0.2         <none>            53/TCP,53/UDP  1d
kube-system   kube-ui               10.0.0.3         <none>            80/TCP         1d
...
```

Similarly, you can take a look at the set of [pods](/docs/user-guide/pods) that were created during cluster startup.
You can do this via the

```shell
$ kubectl get --all-namespaces pods
```

command.

You'll see a list of pods that looks something like this (the name specifics will be different):

```shell
NAMESPACE     NAME                                           READY     STATUS    RESTARTS   AGE
kube-system   fluentd-cloud-logging-kubernetes-minion-63uo   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c1n9   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c4og   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-ngua   1/1       Running   0          14m
kube-system   kube-dns-v5-7ztia                              3/3       Running   0          15m
kube-system   kube-ui-v1-curt1                               1/1       Running   0          15m
kube-system   monitoring-heapster-v5-ex4u3                   1/1       Running   1          15m
kube-system   monitoring-influx-grafana-v1-piled             2/2       Running   0          15m
```

Some of the pods may take a few seconds to start up (during this time they'll show `Pending`), but check that they all show as `Running` after a short period.
-->

### 集群入门

#### 查看你的集群

一旦 `kubectl` 在你的路径里，你就可以使用它查看你的集群。例如运行：

```shell
$ kubectl get --all-namespaces services
```

应该输出一系列[服务](/docs/user-guide/services)，看起来像这样：

```shell
NAMESPACE     NAME                  CLUSTER_IP       EXTERNAL_IP       PORT(S)        AGE
default       kubernetes            10.0.0.1         <none>            443/TCP        1d
kube-system   kube-dns              10.0.0.2         <none>            53/TCP,53/UDP  1d
kube-system   kube-ui               10.0.0.3         <none>            80/TCP         1d
...
```

类似的，你可以查看一系列在启动集群期间创建的 [pods](/docs/user-guide/pods)。你可以通过这个

```shell
$ kubectl get --all-namespaces pods
```

命令查看。

你将看到 pods 列表，看起来像这样（具体的名字是不一样的）：

```shell
NAMESPACE     NAME                                           READY     STATUS    RESTARTS   AGE
kube-system   fluentd-cloud-logging-kubernetes-minion-63uo   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c1n9   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c4og   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-ngua   1/1       Running   0          14m
kube-system   kube-dns-v5-7ztia                              3/3       Running   0          15m
kube-system   kube-ui-v1-curt1                               1/1       Running   0          15m
kube-system   monitoring-heapster-v5-ex4u3                   1/1       Running   1          15m
kube-system   monitoring-influx-grafana-v1-piled             2/2       Running   0          15m
```

一些 pod 也许要花一些时间来启动（在这期间他们将显示为 `Pending`），但是短暂的检查后他们所有显示为 `Running` 

<!--
#### Run some examples

Then, see [a simple nginx example](/docs/user-guide/simple-nginx) to try out your new cluster.

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/).  The [guestbook example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/) is a good "getting started" walkthrough.
-->

#### 运行一些例子

接下来，看[一个简单的 nginx 例子](/docs/user-guide/simple-nginx) 来试试你的新集群。

为更多完整应用，请看[示例目录](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/)。[留言簿示例](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/)是一个好的“入门”演练。

<!--
### Tearing down the cluster

To remove/delete/teardown the cluster, use the `kube-down.sh` script.

```shell
cd kubernetes
cluster/kube-down.sh
```

Likewise, the `kube-up.sh` in the same directory will bring it back up. You do not need to rerun the `curl` or `wget` command: everything needed to setup the Kubernetes cluster is now on your workstation.
-->

### 销毁集群

移走／删除／销毁集群，使用 `kube-down.sh` 脚本。

```shell
cd kubernetes
cluster/kube-down.sh
```

同样的，在同目录下 `kube-up.sh` 会重新启动回来。你不需要重新运行 `curl` 或 `wget` 命令：所有东西需要部署到 Kubernetes 集群已经在你的工作站上了。


<!--
### Customizing

The script above relies on Google Storage to stage the Kubernetes release. It
then will start (by default) a single master VM along with 4 worker VMs.  You
can tweak some of these parameters by editing `kubernetes/cluster/gce/config-default.sh`
You can view a transcript of a successful cluster creation
[here](https://gist.github.com/satnam6502/fc689d1b46db9772adea).

-->

### 定制

上面的脚本依赖于 Google 存储预制的 Kubernetes 发行版。它将启动一个单独的主 VM 和 4 个工作 VM。你可以通过编辑 `kubernetes/cluster/gce/config-default.sh` 修改一些参数.[这里](https://gist.github.com/satnam6502/fc689d1b46db9772adea)你可以浏览一个成功创建集群的副本。

<!---
### Troubleshooting

#### Project settings

You need to have the Google Cloud Storage API, and the Google Cloud Storage
JSON API enabled. It is activated by default for new projects. Otherwise, it
can be done in the Google Cloud Console.  See the [Google Cloud Storage JSON
API Overview](https://cloud.google.com/storage/docs/json_api/) for more
details.

Also ensure that-- as listed in the [Prerequsites section](#prerequisites)-- you've enabled the `Compute Engine Instance Group Manager API`, and can start up a GCE VM from the command line as in the [GCE Quickstart](https://cloud.google.com/compute/docs/quickstart) instructions.
-->

### 问题排查

#### 工程设置

你需要有 Google 云存储 API，开启 Google 云存储 JSON API。新工程默认是激活的。另一方面，也可以在 Google 云控制台来完成。更多详细可以查看 [Google 云存储 JSON API 概览](https://cloud.google.com/storage/docs/json_api/)。

还要确保 -- 在[先决条件部分]（＃先决条件）中列出 -- 您启用了 “Compute Engine Instance Group Manager API”，并可以从命令行启动 GCE VM，如 [GCE 快速入门](https://cloud.google.com/compute/docs/quickstart)教程。

<!--
#### Cluster initialization hang

If the Kubernetes startup script hangs waiting for the API to be reachable, you can troubleshoot by SSHing into the master and node VMs and looking at logs such as `/var/log/startupscript.log`.

**Once you fix the issue, you should run `kube-down.sh` to cleanup** after the partial cluster creation, before running `kube-up.sh` to try again.
-->

#### 集群初始化挂起

如果 Kubernetes 启动脚本挂起等待获取 API，你可以通过 SSHing 进入主和节点 VM 查看日志，如 `/var/log/startupscript.log`。

在运行 `kube-up.sh` 再次尝试之前，**一旦你解决了问题，你应该运行 `kube-down.sh` 来清理**部分集群创建。

<!--
#### SSH

If you're having trouble SSHing into your instances, ensure the GCE firewall
isn't blocking port 22 to your VMs.  By default, this should work but if you
have edited firewall rules or created a new non-default network, you'll need to
expose it: `gcloud compute firewall-rules create default-ssh --network=<network-name>
--description "SSH allowed from anywhere" --allow tcp:22`

Additionally, your GCE SSH key must either have no passcode or you need to be
using `ssh-agent`.
-->

#### SSH

如果你 SSHing 到你的实例有问题，确保 GCE 防火墙没有限制你的 VM 22端口。默认这个应该是工作的，但是如果你编辑了防火墙规则或创建了一个新的非默认网络，你将需要暴露它：`gcloud compute firewall-rules create default-ssh --network=<network-name> --description "SSH allowed from anywhere" --allow tcp:22`

另外，你的 GCE SSH 密钥必须没有密码或你需要使用 `ssh-agent`。

<!--
#### Networking

The instances must be able to connect to each other using their private IP. The
script uses the "default" network which should have a firewall rule called
"default-allow-internal" which allows traffic on any port on the private IPs.
If this rule is missing from the default network or if you change the network
being used in `cluster/config-default.sh` create a new rule with the following
field values:

* Source Ranges: `10.0.0.0/8`
* Allowed Protocols and Port: `tcp:1-65535;udp:1-65535;icmp`
-->

#### 网络

实例必须能使用他们的私网 IP 连接到每个彼此。脚本使用 “default” 网络，它应该有一个防火墙规则叫做 “default-allow-internal”,它允许私有 IP 的所有端口流量。如果这个规则从默认网络丢失或者如果你改变了网络，使用 `cluster/config-default.sh` 创建一个新规则字段如下：

* Source Ranges: `10.0.0.0/8`
* Allowed Protocols and Port: `tcp:1-65535;udp:1-65535;icmp`

<!--
## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/getting-started-guides/gce)                                    |   | Project

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.
-->

## 支持级别

IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/getting-started-guides/gce)                                    |   | Project

所有解决方案的支持等级信息，看[解决方案表](/docs/getting-started-guides/#table-of-solutions)表格.

## 进一步阅读

请看 [Kubernetes 文档](/docs/)获取关于管理使用 Kubernetes 集群更多详细。
