---
title: 在谷歌计算引擎上运行 Kubernetes
content_type: task
---

<!-- 
---
reviewers:
- brendandburns
- jbeda
- mikedanese
- thockin
title: Running Kubernetes on Google Compute Engine
content_type: task
--- 
-->

<!-- overview -->

<!--
The example below creates a Kubernetes cluster with 3 worker node Virtual Machines and a master Virtual Machine (i.e. 4 VMs in your cluster). This cluster is set up and controlled from your workstation (or wherever you find convenient).
-->
下面的示例创建了一个 Kubernetes 集群，其中包含 3 个工作节点虚拟机和 1 个主虚拟机（即集群中有 4 个虚拟机）。
这个集群是在你的工作站（或你认为方便的任何地方）设置和控制的。


## {{% heading "prerequisites" %}}

<!-- 
If you want a simplified getting started experience and GUI for managing clusters, please consider trying [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) for hosted cluster installation and management. 
-->
如果你想要一个简化的入门体验和 GUI 来管理集群，
请考虑尝试[谷歌 Kubernetes 引擎](https://cloud.google.com/kubernetes-engine/)来安装和管理托管集群。

<!-- 
For an easy way to experiment with the Kubernetes development environment, click the button below
to open a Google Cloud Shell with an auto-cloned copy of the Kubernetes source repo.
-->
有一个简单的方式可以使用 Kubernetes 开发环境进行实验，
就是点击下面的按钮，打开 Google Cloud Shell，其中包含了 Kubernetes 源仓库自动克隆的副本。

<!--  
[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/kubernetes/kubernetes&page=editor&open_in_editor=README.md)
-->
[![在 Cloud Shell 中打卡](https://gstatic.com/cloudssh/images/open-btn.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/kubernetes/kubernetes&page=editor&open_in_editor=README.md)

<!-- 
If you want to use custom binaries or pure open source Kubernetes, please continue with the instructions below.
-->
如果你想要使用定制的二进制或者纯开源的 Kubernetes，请继续阅读下面的指导。

<!-- ### Prerequisites -->
### 前提条件 {#prerequisites}

<!--  
1. You need a Google Cloud Platform account with billing enabled. Visit the [Google Developers Console](https://console.cloud.google.com) for more details.
1. Install `gcloud` as necessary. `gcloud` can be installed as a part of the [Google Cloud SDK](https://cloud.google.com/sdk/).
1. Enable the [Compute Engine Instance Group Manager API](https://console.developers.google.com/apis/api/replicapool.googleapis.com/overview) in the [Google Cloud developers console](https://console.developers.google.com/apis/library).
1. Make sure that gcloud is set to use the Google Cloud Platform project you want. You can check the current project using `gcloud config list project` and change it via `gcloud config set project <project-id>`.
1. Make sure you have credentials for GCloud by running `gcloud auth login`.
1. (Optional)  In order to make API calls against GCE, you must also run `gcloud auth application-default login`.
1. Make sure you can start up a GCE VM from the command line.  At least make sure you can do the [Create an instance](https://cloud.google.com/compute/docs/instances/#startinstancegcloud) part of the GCE Quickstart.
1. Make sure you can SSH into the VM without interactive prompts.  See the [Log in to the instance](https://cloud.google.com/compute/docs/instances/#sshing) part of the GCE Quickstart.
-->
1. 你需要一个启用了计费的谷歌云平台账号。
   更多细节请访问[谷歌开发者控制台](https://console.cloud.google.com)。
1. 根据需要安装 `gcloud`。
   `gcloud` 可作为[谷歌云 SDK](https://cloud.google.com/sdk/) 的一部分安装。
1. 在[谷歌云开发者控制台](https://console.developers.google.com/apis/library)
   启用[计算引擎实例组管理器 API](https://console.developers.google.com/apis/api/replicapool.googleapis.com/overview)
1. 确保将 gcloud 设置成使用你想要的谷歌云平台项目。
   你可以使用 `gcloud config list project` 检查当前项目，
   并通过 `gcloud config set project <project-id>` 修改它。
1. 通过运行 `gcloud auth login`，确保你拥有 GCloud 的凭据。
1. （可选）如果需要调用 GCE 的 API，你也必须运行 `gcloud auth application-default login`。
1. 确保你能通过命令行启动 GCE 虚拟机。
   至少确保你可以完成 GCE 快速入门的[创建实例](https://cloud.google.com/compute/docs/instances/#startinstancegcloud)部分。
1. 确保你在没有交互式提示的情况下 SSH 到虚拟机。
   查看 GCE 快速入门的[登录实例](https://cloud.google.com/compute/docs/instances/#sshing)部分。


<!-- steps -->

<!-- ## Starting a cluster -->
## 启动集群

<!-- 
You can install a client and start a cluster with either one of these commands (we list both in case only one is installed on your machine):
-->
你可以安装一个客户端，并使用这些命令的其中之一来启动集群（我们列出的两种情况，因为你的机器可能只安装了二者之一）：

```shell
curl -sS https://get.k8s.io | bash
```

或

```shell
wget -q -O - https://get.k8s.io | bash
```

<!--  
Once this command completes, you will have a master VM and four worker VMs, running as a Kubernetes cluster.
-->
这条命令结完成后，你将会有 1 个主虚拟机和 4 个工作虚拟机，它们一起作为 Kubernetes 集群运行。

<!--  
By default, some containers will already be running on your cluster. Containers like `fluentd` provide [logging](/docs/concepts/cluster-administration/logging/), while `heapster` provides [monitoring](https://releases.k8s.io/master/cluster/addons/cluster-monitoring/README.md) services.
-->
默认情况下，有一些容器已经在你的集群上运行。
像 `fluentd` 这样的容器提供[日志记录](/zh/docs/concepts/cluster-administration/logging/)，
而 `heapster` 提供[监控](https://releases.k8s.io/master/cluster/addons/cluster-monitoring/README.md)服务。

<!--  
The script run by the commands above creates a cluster with the name/prefix "kubernetes". It defines one specific cluster config, so you can't run it more than once.
-->
由上述命令运行的脚本创建了一个名称/前缀为“kubernetes”的集群。
它定义了一个特定的集群配置，所以此脚本只能运行一次。

<!--  
Alternately, you can download and install the latest Kubernetes release from [this page](https://github.com/kubernetes/kubernetes/releases), then run the `<kubernetes>/cluster/kube-up.sh` script to start the cluster:
-->
或者，你可以通过[这个页面](https://github.com/kubernetes/kubernetes/releases)下载和安装最新版本的 Kubernetes，
然后运行 `<kubernetes>/cluster/kube-up.sh` 脚本启动集群：

```shell
cd kubernetes
cluster/kube-up.sh
```

<!--  
If you want more than one cluster running in your project, want to use a different name, or want a different number of worker nodes, see the `<kubernetes>/cluster/gce/config-default.sh` file for more fine-grained configuration before you start up your cluster.
-->
如果你希望在项目中运行多个集群，希望使用一个不同名称，或者不同数量工作节点的集群，
请查看 `<kubernetes>/cluster/gce/config-default.sh` 文件，以便在启动集群之前进行更细粒度的配置。


<!--  
If you run into trouble, please see the section on [troubleshooting](/docs/setup/production-environment/turnkey/gce/#troubleshooting), post to the
[Kubernetes Forum](https://discuss.kubernetes.io), or come ask questions on `#gke` Slack channel.
-->
如果你遇到了问题，请参阅[错误排查](#troubleshooting)一节，
发布到 [Kubernetes 论坛](https://discuss.kubernetes.io)，或者来 `#gke` Slack 频道中提问。

<!-- The next few steps will show you: -->
接下来的几个步骤会告诉你:

<!-- 
1. How to set up the command line client on your workstation to manage the cluster
2. Examples of how to use the cluster
3. How to delete the cluster
4. How to start clusters with non-default options (like larger clusters) 
-->
1. 如何在你的工作站设置命令行客户端来管理集群
2. 如何使用集群的示例
3. 如何删除集群
4. 如果以非默认选项启动集群（如规模较大的集群）

<!-- ## Installing the Kubernetes command line tools on your workstation -->
## 在你的工作站安装 Kubernetes 命令行工具

<!--  
The cluster startup script will leave you with a running cluster and a `kubernetes` directory on your workstation.
-->
集群启动脚本将在你的工作站上留下一个正在运行的集群和一个 `kubernetes` 目录。

<!--  
The [kubectl](/docs/reference/kubectl/kubectl/) tool controls the Kubernetes cluster
manager.  It lets you inspect your cluster resources, create, delete, and update
components, and much more. You will use it to look at your new cluster and bring
up example apps.
-->
[kubectl](/zh/docs/reference/kubectl/kubectl/) 工具控制 Kubernetes 集群管理器。
它允许你检查集群资源，创建、删除和更新组件等等。
你将使用它来查看新集群并启动示例应用程序。

<!--  
You can use `gcloud` to install the `kubectl` command-line tool on your workstation:
-->
你可以使用 `gcloud` 在工作站上安装 `kubectl` 命令行工具:

```shell
gcloud components install kubectl
```

{{< note >}}
<!--  
The kubectl version bundled with `gcloud` may be older than the one
downloaded by the get.k8s.io install script. See [Installing kubectl](/docs/tasks/tools/install-kubectl/)
document to see how you can set up the latest `kubectl` on your workstation.
-->
与 `gcloud` 绑定的 kubectl 版本可能比 get.k8s.io 安装脚本所下载的更老。。
查看[安装 kubectl](/zh/docs/tasks/tools/install-kubectl/) 文档，了解如何在工作站上设置最新的 `kubectl`。
{{< /note >}}

<!-- ## Getting started with your cluster -->
## 开始使用你的集群

<!-- ### Inspect your cluster -->
### 检查你的集群

<!--  
Once `kubectl` is in your path, you can use it to look at your cluster. E.g., running:
-->
一旦 `kubectl` 存在于你的路径中，你就可以使用它来查看集群，例如，运行：

```
kubectl get --all-namespaces services
```

<!--  
should show a set of [services](/docs/concepts/services-networking/service/) that look something like this:
-->
应该显示 [services](/zh/docs/concepts/services-networking/service/) 集合，看起来像这样：

```
NAMESPACE     NAME          TYPE             CLUSTER_IP       EXTERNAL_IP       PORT(S)        AGE
default       kubernetes    ClusterIP        10.0.0.1         <none>            443/TCP        1d
kube-system   kube-dns      ClusterIP        10.0.0.2         <none>            53/TCP,53/UDP  1d
kube-system   kube-ui       ClusterIP        10.0.0.3         <none>            80/TCP         1d
...
```

<!--  
Similarly, you can take a look at the set of [pods](/docs/concepts/workloads/pods/) that were created during cluster startup.
You can do this via the
-->
类似的，你可以查看在集群启动时创建的 [pods](/zh/docs/concepts/workloads/pods/) 的集合。
你可以通过命令：

```
kubectl get --all-namespaces pods
```

<!--  
You'll see a list of pods that looks something like this (the name specifics will be different):
-->
你将会看到 Pod 的列表，看起来像这样（名称和细节会有所不同）：

```
NAMESPACE     NAME                                           READY     STATUS    RESTARTS   AGE
kube-system   coredns-5f4fbb68df-mc8z8                       1/1       Running   0          15m
kube-system   fluentd-cloud-logging-kubernetes-minion-63uo   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c1n9   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c4og   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-ngua   1/1       Running   0          14m
kube-system   kube-ui-v1-curt1                               1/1       Running   0          15m
kube-system   monitoring-heapster-v5-ex4u3                   1/1       Running   1          15m
kube-system   monitoring-influx-grafana-v1-piled             2/2       Running   0          15m
```

<!--  
Some of the pods may take a few seconds to start up (during this time they'll show `Pending`), but check that they all show as `Running` after a short period.
-->
一些 Pod 启动可能需要几秒钟（在此期间它们会显示 `Pending`），
但是在短时间后请检查它们是否都显示为 `Running`。

<!-- ### Run some examples -->
### 运行示例

<!--  
Then, see [a simple nginx example](/docs/tasks/run-application/run-stateless-application-deployment/) to try out your new cluster.
-->
那么，看[一个简单的 nginx 示例](/zh/docs/tasks/run-application/run-stateless-application-deployment/)来试试你的新集群。

<!--  
For more complete applications, please look in the [examples directory](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/).  The [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/) is a good "getting started" walkthrough.
-->
要获得完整的应用，请查看 [examples 目录](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)。
[guestbook 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)
是一个很好的“入门”演练。

<!-- ## Tearing down the cluster -->
## 拆除集群

<!-- To remove/delete/teardown the cluster, use the `kube-down.sh` script. -->
要移除/删除/拆除集群，请使用 `kube-down.sh` 脚本。

```shell
cd kubernetes
cluster/kube-down.sh
```

<!--  
Likewise, the `kube-up.sh` in the same directory will bring it back up. You do not need to rerun the `curl` or `wget` command: everything needed to setup the Kubernetes cluster is now on your workstation.
-->
同样地，同一目录下的 `kube-up.sh` 脚本会让集群重新运行起来。 
你不需要再次运行 `curl` 或 `wget` 命令：现在 Kubernetes 集群所需的一切都在你的工作站上。

<!-- ## Customizing -->
## 定制

<!--  
The script above relies on Google Storage to stage the Kubernetes release. It
then will start (by default) a single master VM along with 3 worker VMs.  You
can tweak some of these parameters by editing `kubernetes/cluster/gce/config-default.sh`
You can view a transcript of a successful cluster creation
[here](https://gist.github.com/satnam6502/fc689d1b46db9772adea).
-->
上面的脚本依赖于谷歌存储来保存 Kubernetes 发行版本。
该脚本然后（默认情况下）会启动 1 个主虚拟机和 3 个工作虚拟机。
你可以通过编辑 `kubernetes/cluster/gce/config-default.sh` 来调整这些参数。
你可以在[这里](https://gist.github.com/satnam6502/fc689d1b46db9772adea)查看成功创建集群的记录。

<!-- ## Troubleshooting -->
## 故障排除 {#troubleshooting}

<!-- ### Project settings -->
### 项目设置

<!--  
You need to have the Google Cloud Storage API, and the Google Cloud Storage
JSON API enabled. It is activated by default for new projects. Otherwise, it
can be done in the Google Cloud Console.  See the [Google Cloud Storage JSON
API Overview](https://cloud.google.com/storage/docs/json_api/) for more
details.
-->
你需要启用 Google Cloud Storage API 和 Google Cloud Storage JSON API。
默认情况下，对新项目都是激活的。
如果未激活，可以在谷歌云控制台设置。
更多细节，请查看[谷歌云存储 JSON API 概览](https://cloud.google.com/storage/docs/json_api/)。

<!--  
Also ensure that-- as listed in the [Prerequisites section](#prerequisites)-- you've enabled the `Compute Engine Instance Group Manager API`, and can start up a GCE VM from the command line as in the [GCE Quickstart](https://cloud.google.com/compute/docs/quickstart) instructions.
-->
也要确保——正如在[前提条件](#prerequisites)中列出的那样——
你已经启用了 `Compute Engine Instance Group Manager API`，
并且可以像 [GCE 快速入门](https://cloud.google.com/compute/docs/quickstart)指导那样从命令行启动 GCE 虚拟机。

<!-- ### Cluster initialization hang -->
### 集群初始化过程停滞

<!--  
If the Kubernetes startup script hangs waiting for the API to be reachable, you can troubleshoot by SSHing into the master and node VMs and looking at logs such as `/var/log/startupscript.log`.
-->
如果 Kubernetes 启动脚本停滞，等待 API 可达，
你可以 SSH 登录到主虚拟机和工作虚拟机，
通过查看 `/var/log/startupscript.log` 日志来排除故障。

<!--  
**Once you fix the issue, you should run `kube-down.sh` to cleanup** after the partial cluster creation, before running `kube-up.sh` to try again.
-->
**一旦解决了这个问题，你应该在部分集群创建之后运行 `kube-down.sh` 来进行清理**，然后再运行 `kube-up.sh` 重试。

### SSH

<!-- 
If you're having trouble SSHing into your instances, ensure the GCE firewall
isn't blocking port 22 to your VMs.  By default, this should work but if you
have edited firewall rules or created a new non-default network, you'll need to
expose it: `gcloud compute firewall-rules create default-ssh --network=<network-name>
--description "SSH allowed from anywhere" --allow tcp:22`
-->
如果在 SSH 登录实例时遇到困难，确保 GCE 防火墙没有阻塞你虚拟机的 22 端口。
默认情况下应该可用，但是如果你编辑了防火墙规则或者创建了一个新的非默认网络，
你需要公开它：`gcloud compute firewall-rules create default-ssh --network=<network-name> --description "SSH allowed from anywhere" --allow tcp:22`

<!--  
Additionally, your GCE SSH key must either have no passcode or you need to be
using `ssh-agent`.
-->
此外，你的 GCE SSH 密钥不能有密码，否则你需要使用 `ssh-agent`。

<!-- ### Networking -->
### 网络

<!--  
The instances must be able to connect to each other using their private IP. The
script uses the "default" network which should have a firewall rule called
"default-allow-internal" which allows traffic on any port on the private IPs.
If this rule is missing from the default network or if you change the network
being used in `cluster/config-default.sh` create a new rule with the following
field values:
-->
虚拟机实例必须能够使用它们的私有 IP 彼此连接。
该脚本使用 "default" 网络，此网络应该有一个名为 "default-allow-internal" 的防火墙规则，
此规则允许通过私有 IP 上的任何端口进行通信。
如果默认网络中缺少此规则，或者更改了 `cluster/config-default.sh` 中使用的网络，
用以下字段值创建一个新规则:

<!--  
* Source Ranges: `10.0.0.0/8`
* Allowed Protocols and Port: `tcp:1-65535;udp:1-65535;icmp`
-->
* 源范围：`10.0.0.0/8`
* 允许的协议和端口：`tcp:1-65535;udp:1-65535;icmp`

<!-- ## Support Level -->
## 支持等级

<!--  
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/setup/production-environment/turnkey/gce/)                                    |   | Project
-->
IaaS 提供商 | 配置管理   | 操作系统 | 网络 | 文档                                                        | 符合率 | 支持等级
---------- | --------- | ------ | ---- | ---------------------------------------------------------  | ----- | -------
GCE        | Saltstack | Debian | GCE  | [docs](/zh/docs/setup/production-environment/turnkey/gce/) |       | Project
