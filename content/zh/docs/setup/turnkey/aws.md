---
reviewers:
- justinsb
- clove
title: 在 AWS EC2 上运行 Kubernetes
content_template: templates/task
---

<!--
---
reviewers:
- justinsb
- clove
title: Running Kubernetes on AWS EC2
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page describes how to install a Kubernetes cluster on AWS.
-->
本页介绍如何在 AWS 上安装 Kubernetes 集群。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
To create a Kubernetes cluster on AWS, you will need an Access Key ID and a Secret Access Key from AWS.
-->
要在 AWS 上创建 Kubernetes 集群，您需要一个访问密钥 ID 和一个来自 AWS 的 Secret 访问密钥。

<!--
### Supported Production Grade Tools
-->

### 支持的生产等级工具

<!--
* [conjure-up](/docs/getting-started-guides/ubuntu/) is an open-source installer for Kubernetes that creates Kubernetes clusters with native AWS integrations on Ubuntu.

* [Kubernetes Operations](https://github.com/kubernetes/kops) - Production Grade K8s Installation, Upgrades, and Management. Supports running Debian, Ubuntu, CentOS, and RHEL in AWS.

* [CoreOS Tectonic](https://coreos.com/tectonic/) includes the open-source [Tectonic Installer](https://github.com/coreos/tectonic-installer) that creates Kubernetes clusters with Container Linux nodes on AWS.

* CoreOS originated and the Kubernetes Incubator maintains [a CLI tool, kube-aws](https://github.com/kubernetes-incubator/kube-aws), that creates and manages Kubernetes clusters with [Container Linux](https://coreos.com/why/) nodes, using AWS tools: EC2, CloudFormation and Autoscaling.
-->

* [conjure-up](/docs/getting-started-guides/ubuntu/) 是 Kubernetes 的一个开源安装程序，可以在 Ubuntu 上创建本机 AWS 集成的 Kubernetes 集群。
                                                                                      \
* [Kubernetes 操作](https://github.com/kubernetes/kops) - 生产级 K8s 安装、升级和管理。支持在 AWS 中运行 Debian、Ubuntu、CentOS 和 RHEL。

* [CoreOS 结构](https://coreos.com/tectonic/)包括开源[结构](https://github.com/coreos/tectonic-installer)，它在 AWS 上创建带有 Linux 容器节点的 Kubernetes 集群。

* CoreOS 起源于 Kubernetes 孵化器，Kubernetes 孵化器维护 [一个 CLI 工具 kube-aws](https://github.com/kubernetes-incubator/kube-aws)，它使用 AWS 工具：EC2、CloudFormation 和 Autoscaling 创建和管理 [Linux 容器](https://coreos.com/why/)节点的 Kubernetes 集群。


{{% /capture %}}

{{% capture steps %}}

<!--
## Getting started with your cluster
-->

## 开始您的集群

<!--
### Command line administration tool: kubectl
-->

### 命令行管理工具：kubectl

<!--
The cluster startup script will leave you with a `kubernetes` directory on your workstation.
Alternately, you can download the latest Kubernetes release from [this page](https://github.com/kubernetes/kubernetes/releases).
-->
集群启动脚本将在您的工作站上留下一个 `kubernetes` 目录。
或者，您可以从[这个页面](https://github.com/kubernetes/kubernetes/releases)下载最新的 Kubernetes 版本。

<!--
Next, add the appropriate binary folder to your `PATH` to access kubectl:
-->
接下来，将相应的二进制文件夹添加到您的 `PATH` 中访问 kubectl：

```shell
# macOS
export PATH=<path/to/kubernetes-directory>/platforms/darwin/amd64:$PATH

# Linux
export PATH=<path/to/kubernetes-directory>/platforms/linux/amd64:$PATH
```

<!--
An up-to-date documentation page for this tool is available here: [kubectl manual](/docs/user-guide/kubectl/)
-->
这个工具的最新文档页面可以在这里找到：[kubectl 手册](/docs/user-guide/kubectl/)

<!--
By default, `kubectl` will use the `kubeconfig` file generated during the cluster startup for authenticating against the API.
For more information, please read [kubeconfig files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
-->
默认情况下，`kubectl` 将使用集群启动期间生成的 `kubeconfig` 文件对 API 进行身份验证。
更多信息，请阅读 [kubeconfig 文件](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)

<!--
### Examples
-->

### 例子

<!--
See [a simple nginx example](/docs/tasks/run-application/run-stateless-application-deployment/) to try out your new cluster.
-->
查看一个[简单的 nginx 示例](/docs/tasks/run-application/run-stateless-application-deployment/)来试用您的新集群。

<!--
The "Guestbook" application is another popular example to get started with Kubernetes: [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)
-->
"留言板"应用程序是 Kubernetes 的另一个流行示例：[留言板示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)

<!--
For more complete applications, please look in the [examples directory](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)
-->
有关更完整的应用程序，请查看[示例目录](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)

<!--
## Scaling the cluster
-->

## 扩展的集群

<!--
Adding and removing nodes through `kubectl` is not supported. You can still scale the amount of nodes manually through adjustments of the 'Desired' and 'Max' properties within the [Auto Scaling Group](http://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scaling.html), which was created during the installation.
-->
`kubectl` 不支持添加和删除节点。您仍然可以通过[自动扩缩功能组](http://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scale.html) 中的 `Desired` 和 `Max` 属性手动调整节点的数量，该属性是在安装过程中创建的。

<!--
## Tearing down the cluster
-->

## 拆除集群

<!--
Make sure the environment variables you used to provision your cluster are still exported, then call the following script inside the
`kubernetes` directory:
-->
确保用于提供集群的环境变量在导出，然后在 `kubernetes` 目录中调用以下脚本：

```shell
cluster/kube-down.sh
```

<!--
## Support Level
-->

## 支持级别

<!--
IaaS Provider        | Config. Mgmt | OS            | Networking  | Docs                                          | Conforms | Support Level
-->


IaaS 供应商          |  配置管理     | 操作系统       | 网络        | 文档                                          |  合规     | 支持级别
-------------------- | ------------ | ------------- | ----------  | --------------------------------------------- | ---------| ----------------------------
AWS                  | kops         | Debian        | k8s (VPC)   | [文档](https://github.com/kubernetes/kops)     |          | 社区 ([@justinsb](https://github.com/justinsb))
AWS                  | CoreOS       | CoreOS        | flannel     | [文档](/docs/getting-started-guides/aws)       |          | 社区
AWS                  | Juju         | Ubuntu        | flannel, calico, canal     | [文档](/docs/getting-started-guides/ubuntu)      | 100%     | 商业、社区

<!--
For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
-->
有关所有解决方案的支持级别信息，请查看[解决方案表](/docs/getting-started-guides/#table-of-solutions)。

<!--
## Further reading
-->

## 进一步阅读

<!--
Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.
-->
有关管理和使用 Kubernetes 集群的详细信息，请参阅 [Kubernetes 文档](/docs/)。


{{% /capture %}}
