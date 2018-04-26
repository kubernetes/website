---
approvers:
- david-mcmahon
- jbeda
title: 下载或构建 Kubernetes
cn-reviewers:
- chentao1596
---

<!--
You can either build a release from sources or download a pre-built release.  If you do not plan on developing Kubernetes itself, we suggest a pre-built release. 
-->
您可以选择使用源代码构建版本或者下载预先构建好的 Kubernetes 版本。如果不打算开发 Kubernetes 本身，建议您使用预先构建好的版本。

<!--
If you just want to run Kubernetes locally for development, we recommend using Minikube. You can download Minikube [here](https://github.com/kubernetes/minikube/releases/latest).
Minikube sets up a local VM that runs a Kubernetes cluster securely, and makes it easy to work with that cluster.
-->
如果只是想在本地运行 Kubernetes 来做开发，我们建议使用 Minikube。您能够从 [这里](https://github.com/kubernetes/minikube/releases/latest) 下载 Minikube。Minikube 创建一个运行安全的 Kubernetes 集群的本地虚拟机，使用它处理集群非常的容易。

* TOC
{:toc}

<!--
### Prebuilt Binary Release
-->
### 预先构建的二进制版本

<!--
The list of binary releases is available for download from the [GitHub Kubernetes repo release page](https://github.com/kubernetes/kubernetes/releases).
-->
从 [Kubernetes GitHub 仓库的版本页](https://github.com/kubernetes/kubernetes/releases) 能够找到可下载的二进制版本列表。

<!--
Download the latest release and unpack this tar file on Linux or OS X, cd to the created `kubernetes/` directory, and then follow the getting started guide for your cloud.
-->
下载最新的版本，在 Linux 或者 OS X 上解包 tar 文件，使用 cd 命令进入创建的 `kubernetes/` 目录，然后根据您的云环境按照相应的入门指南进行操作。

<!--
On OS X you can also use the [homebrew](http://brew.sh/) package manager: `brew install kubernetes-cli`
-->
如果是在 OS X 上，您也能够使用 [homebrew](http://brew.sh/) 包管理器：`brew install kubernetes-cli`

<!--
### Building from source
-->
### 从源代码构建

<!--
Get the Kubernetes source.  If you are simply building a release from source there is no need to set up a full golang environment as all building happens in a Docker container.
-->
获取 Kubernetes 源代码。如果只是想从源代码简单地构建版本，您没有必要创建一个完整的 golang 环境，只需要在 Docker 容器中执行构建。

<!--
Building a release is simple.
-->
构建版本非常的简单。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

<!--
For more details on the release process see the [`build`](http://releases.k8s.io/{{page.githubbranch}}/build/) directory
-->
更多构建版本的细节请查看 [`build`](http://releases.k8s.io/{{page.githubbranch}}/build/) 目录

<!--
### Download Kubernetes and automatically set up a default cluster
-->
### 下载 Kubernetes 并自动创建一个默认的集群

<!--
The bash script at [`https://get.k8s.io`](https://get.k8s.io), which can be run with `wget` or `curl`, automatically downloads Kubernetes, and provisions a cluster based on your desired cloud provider.
-->
使用 `wget` 或者 `curl` 命令从 [`https://get.k8s.io`](https://get.k8s.io) 下载 bash 脚本并执行，就会自动下载 Kubernetes，并基于您想要的云服务提供商创建一个集群环境。

```shell
# wget version
export KUBERNETES_PROVIDER=YOUR_PROVIDER; wget -q -O - https://get.k8s.io | bash

# curl version
export KUBERNETES_PROVIDER=YOUR_PROVIDER; curl -sS https://get.k8s.io | bash
```

<!--
Possible values for `YOUR_PROVIDER` include:
-->
支持的 `YOUR_PROVIDER` 包括：

<!--
* `gce` - Google Compute Engine [default]
* `gke` - Google Container Engine
* `aws` - Amazon EC2
* `azure` - Microsoft Azure
* `vagrant` - Vagrant (on local virtual machines)
* `vsphere` - VMWare VSphere
* `rackspace` - Rackspace
-->
* `gce` - 谷歌计算引擎 [默认]
* `gke` - 谷歌容器引擎
* `aws` - 亚马逊 EC2
* `azure` - 微软 Azure
* `vagrant` - Vagrant（在本地虚拟机上）
* `vsphere` - VMWare VSphere
* `rackspace` - Rackspace

<!--
For the complete, up-to-date list of providers supported by this script, see the [`/cluster`](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/cluster) folder in the main Kubernetes repo, where each folder represents a possible value for `YOUR_PROVIDER`. If you don't see your desired provider, try looking at our [getting started guides](/docs/getting-started-guides); there's a good chance we have docs for them.
-->
如果想要了解脚本支持的最新的完整的供应商名单，可以在查看 Kubernetes 主代码仓库下面的 [`/cluster`](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/cluster) 目录，目录下面每个文件夹都代表了 `YOUR_PROVIDER` 支持的一个值。如果没有找到您想要的供应商，可以试着查看我们的 [入门指南](/docs/getting-started-guides)，很有可能我们的文档上对它进行了描述。
