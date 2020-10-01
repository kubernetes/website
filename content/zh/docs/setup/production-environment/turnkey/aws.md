---
title: 在 AWS EC2 上运行 Kubernetes
content_type: task
---
<!--
reviewers:
- justinsb
- clove
title: Running Kubernetes on AWS EC2
content_type: task
-->

<!-- overview -->

<!--
This page describes how to install a Kubernetes cluster on AWS.
-->
本页面介绍了如何在 AWS 上安装 Kubernetes 集群。

## {{% heading "prerequisites" %}}

<!--
To create a Kubernetes cluster on AWS, you will need an Access Key ID and a Secret Access Key from AWS.
-->
在 AWS 上创建 Kubernetes 集群，你将需要 AWS 的 Access Key ID 和 Secret Access Key。

<!--
### Supported Production Grade Tools
-->
### 支持的生产级别工具

<!--
* [conjure-up](/docs/getting-started-guides/ubuntu/) is an open-source installer for Kubernetes that creates Kubernetes clusters with native AWS integrations on Ubuntu.
-->
* [conjure-up](/zh/docs/setup/) 是 Kubernetes 的开源安装程序，可在 Ubuntu 上创建与原生 AWS 集成的 Kubernetes 集群。

<!--
* [Kubernetes Operations](https://github.com/kubernetes/kops) - Production Grade K8s Installation, Upgrades, and Management. Supports running Debian, Ubuntu, CentOS, and RHEL in AWS.
-->
* [Kubernetes Operations](https://github.com/kubernetes/kops) - 生产级 K8s 的安装、升级和管理。支持在 AWS 运行 Debian、Ubuntu、CentOS 和 RHEL。

<!--
* [kube-aws](https://github.com/kubernetes-incubator/kube-aws), creates and manages Kubernetes clusters with [Flatcar Linux](https://www.flatcar-linux.org/) nodes, using AWS tools: EC2, CloudFormation and Autoscaling.
-->
* [kube-aws](https://github.com/kubernetes-incubator/kube-aws) 使用 [Flatcar Linux](https://www.flatcar-linux.org/) 节点创建和管理 Kubernetes 集群，它使用了 AWS 工具：EC2、CloudFormation 和 Autoscaling。

<!--
* [KubeOne](https://github.com/kubermatic/kubeone) is an open source cluster lifecycle management tool that creates, upgrades and manages Kubernetes Highly-Available clusters.
-->
* [KubeOne](https://github.com/kubermatic/kubeone) 是一个开源集群生命周期管理工具，它可用于创建，升级和管理高可用 Kubernetes 集群。



<!-- steps -->

<!--
## Getting started with your cluster
-->
## 集群入门

<!--
### Command line administration tool: kubectl
-->
### 命令行管理工具：kubectl

<!--
The cluster startup script will leave you with a `kubernetes` directory on your workstation.
Alternately, you can download the latest Kubernetes release from [this page](https://github.com/kubernetes/kubernetes/releases).

Next, add the appropriate binary folder to your `PATH` to access kubectl:
-->
集群启动脚本将在你的工作站上为你提供一个 `kubernetes` 目录。
或者，你可以从[此页面](https://github.com/kubernetes/kubernetes/releases)下载最新的 Kubernetes 版本。

接下来，将适当的二进制文件夹添加到你的 `PATH` 以访问 kubectl： 

```shell
# macOS
export PATH=<path/to/kubernetes-directory>/platforms/darwin/amd64:$PATH

# Linux
export PATH=<path/to/kubernetes-directory>/platforms/linux/amd64:$PATH
```

<!--
An up-to-date documentation page for this tool is available here: [kubectl manual](/docs/user-guide/kubectl/)

By default, `kubectl` will use the `kubeconfig` file generated during the cluster startup for authenticating against the API.
For more information, please read [kubeconfig files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
-->
此工具的最新文档页面位于此处：[kubectl 手册](/zh/docs/reference/kubectl/kubectl/) 

默认情况下，`kubectl` 将使用在集群启动期间生成的 `kubeconfig` 文件对 API 进行身份验证。
有关更多信息，请阅读 [kubeconfig 文件](/zh/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。

<!--
### Examples

See [a simple nginx example](/docs/tasks/run-application/run-stateless-application-deployment/) to try out your new cluster.

The "Guestbook" application is another popular example to get started with Kubernetes: [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)
-->
### 示例

请参阅[一个简单的 nginx 示例](/zh/docs/tasks/run-application/run-stateless-application-deployment/)试用你的新集群。

“Guestbook” 应用程序是另一个入门 Kubernetes 的流行示例：[guestbook 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)。

有关更完整的应用程序，请查看[示例目录](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)。

<!--
## Scaling the cluster

Adding and removing nodes through `kubectl` is not supported. You can still scale the amount of nodes manually through adjustments of the 'Desired' and 'Max' properties within the [Auto Scaling Group](http://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scaling.html), which was created during the installation.
-->
## 集群伸缩

不支持通过 `kubectl` 添加和删除节点。你仍然可以通过调整在安装过程中创建的
[Auto Scaling Group](https://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scaling.html)
中的 “Desired” 和 “Max” 属性来手动伸缩节点数量。

<!--
## Tearing down the cluster

Make sure the environment variables you used to provision your cluster are still exported, then call the following script inside the
`kubernetes` directory:
-->
## 集群拆除

确保你用于配置集群的环境变量已被导出，然后在运行如下在 Kubernetes 目录的脚本：

```shell
cluster/kube-down.sh
```

<!--
## Support Level

IaaS Provider        | Config. Mgmt | OS            | Networking  | Docs                                          | Conforms | Support Level
-------------------- | ------------ | ------------- | ----------  | --------------------------------------------- | ---------| ----------------------------
AWS                  | kops         | Debian        | k8s (VPC)   | [docs](https://github.com/kubernetes/kops)    |          | Community ([@justinsb](https://github.com/justinsb))
AWS                  | CoreOS       | CoreOS        | flannel     | [docs](/docs/getting-started-guides/aws)      |          | Community
AWS                  | Juju         | Ubuntu        | flannel, calico, canal     | [docs](/docs/getting-started-guides/ubuntu)      | 100%     | Commercial, Community
AWS                  | KubeOne         | Ubuntu, CoreOS, CentOS   | canal, weavenet     | [docs](https://github.com/kubermatic/kubeone)      | 100%    | Commercial, Community
-->
## 支持等级

IaaS 提供商          | 配置管理     | 操作系统      | 网络        | 文档                                          | 符合率   | 支持等级 
-------------------- | ------------ | ------------- | ----------  | --------------------------------------------- | ---------| ----------------------------
AWS                  | kops         | Debian        | k8s (VPC)   | [docs](https://github.com/kubernetes/kops)    |          | Community ([@justinsb](https://github.com/justinsb))
AWS                  | CoreOS       | CoreOS        | flannel     | [docs](/zh/docs/setup/)      |          | Community
AWS                  | Juju         | Ubuntu        | flannel, calico, canal     | [docs](/zh/docs/setup/)      | 100%     | Commercial, Community
AWS                  | KubeOne         | Ubuntu, CoreOS, CentOS   | canal, weavenet     | [docs](https://github.com/kubermatic/kubeone)      | 100%    | Commercial, Community

<!--
## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.
-->
## 进一步阅读

请参阅 [Kubernetes 文档](/zh/docs/)了解有关管理和使用 Kubernetes 集群的更多详细信息。

