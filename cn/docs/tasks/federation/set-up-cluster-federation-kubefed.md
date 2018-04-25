<!--
---
approvers:
- madhusudancs
title: Set up Cluster Federation with Kubefed
cn-approvers : NickSu86
---

* TOC
{:toc}

Kubernetes version 1.5 and above includes a new command line tool called
[`kubefed`](/docs/admin/kubefed/) to help you administrate your federated
clusters. `kubefed` helps you to deploy a new Kubernetes cluster federation
control plane, and to add clusters to or remove clusters from an existing
federation control plane.

This guide explains how to administer a Kubernetes Cluster Federation
using `kubefed`.

> Note: `kubefed` is a beta feature in Kubernetes 1.6.
-->
---
approvers:
- madhusudancs
title: 使用 Kubefed 创建集群联邦
cn-approvers : NickSu86
---

* TOC
{:toc}

Kubernetes 的1.5及以上版本提供了一个命令行工具[`kubefed`](/docs/admin/kubefed/) ，
用于管理用户的集群联邦。`kubefed` 可以帮助你部署一个集群联邦的控制面板，您可以通过
这个面板来添加或者删除一个联邦里面的集群。

这篇教程指导如何使用 `kubefed` 来管理一个 Kubernetes 集群联邦。

> 注意: `kubefed` 在 Kubernetes 1.6版本中仍然是一个 beta 功能.
<!--
## Prerequisites

This guide assumes that you have a running Kubernetes cluster. Please
see one of the [getting started](/docs/setup/) guides
for installation instructions for your platform.
-->
## 前提要求

这篇教程假设您已经有了正常运行的 Kubernetes 集群。如果需要在您的平台
上部署集群，请查阅文档[getting started](/docs/setup/).
<!--
## Getting `kubefed`

Download the client tarball corresponding to the latest release and
extract the binaries in the tarball with the commands:

```shell
# Linux
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/kubernetes-client-linux-amd64.tar.gz
tar -xzvf kubernetes-client-linux-amd64.tar.gz

# OS X
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/kubernetes-client-darwin-amd64.tar.gz
tar -xzvf kubernetes-client-darwin-amd64.tar.gz

# Windows
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/kubernetes-client-windows-amd64.tar.gz
tar -xzvf kubernetes-client-windows-amd64.tar.gz
```
-->

## 安装 `kubefed`

使用下列命令下载对应最新发行的客户端安装包并将安装包里的二进制文件解压出来：

```shell
# Linux
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/kubernetes-client-linux-amd64.tar.gz
tar -xzvf kubernetes-client-linux-amd64.tar.gz

# OS X
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/kubernetes-client-darwin-amd64.tar.gz
tar -xzvf kubernetes-client-darwin-amd64.tar.gz

# Windows
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/kubernetes-client-windows-amd64.tar.gz
tar -xzvf kubernetes-client-windows-amd64.tar.gz
```
<!--
> Note: The URLs in the curl commands above download the binaries for
`amd64`. If you are on a different architecture, please use a URL
appropriate for your architecture. You can find the list of available
binaries on the
[release page](https://git.k8s.io/kubernetes/CHANGELOG.md#client-binaries-1).

Copy the extracted binaries to one of the directories in your `$PATH`
and set the executable permission on those binaries.


```shell
sudo cp kubernetes/client/bin/kubefed /usr/local/bin
sudo chmod +x /usr/local/bin/kubefed
sudo cp kubernetes/client/bin/kubectl /usr/local/bin
sudo chmod +x /usr/local/bin/kubectl
```
-->
> 注意: 上述命令里的 URL 提供的都是适合 `amd64` 架构的包，如果您需要其他架构的
包，请更换为对应的 URL ，在这里列出了所有可用的发行版本，
[发布页面](https://git.k8s.io/kubernetes/CHANGELOG.md#client-binaries-1).

将解压出来的内容复制到你的环境变量 `$PATH` 里的随便一个路径，
并设置可执行权限。

```shell
sudo cp kubernetes/client/bin/kubefed /usr/local/bin
sudo chmod +x /usr/local/bin/kubefed
sudo cp kubernetes/client/bin/kubectl /usr/local/bin
sudo chmod +x /usr/local/bin/kubectl
```
<!--
### Install with snap on Ubuntu

kubefed is available as a [snap](https://snapcraft.io/) application.

1. If you are on Ubuntu or one of other Linux distributions that support [snap](https://snapcraft.io/docs/core/install) package manager, you can install with:

       sudo snap install kubefed --classic

2. Run [`kubefed version`](/docs/admin/kubefed_version/) to verify that the version you've installed is sufficiently up-to-date.
-->
### 在 Ubuntu 上使用 snap 安装

kubefed 也提供了可用的 [snap](https://snapcraft.io/) 软件包。

1. 如果您使用的是 Ubuntu 或者其他支持 [snap](https://snapcraft.io/docs/core/install) 包管理器的 Linux 发现版本，可以使用下列命令安装：

       sudo snap install kubefed --classic

2. 运行 [`kubefed version`](/docs/admin/kubefed_version/) 来验证您安装的版本是不是最新的。
<!--
## Choosing a host cluster.

You'll need to choose one of your Kubernetes clusters to be the
*host cluster*. The host cluster hosts the components that make up
your federation control plane. Ensure that you have a `kubeconfig`
entry in your local `kubeconfig` that corresponds to the host cluster.
You can verify that you have the required `kubeconfig` entry by
running:

```shell
kubectl config get-contexts
```

The output should contain an entry corresponding to your host cluster,
similar to the following:

```
CURRENT   NAME                                          CLUSTER                                       AUTHINFO                                      NAMESPACE
*         gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1
```

You'll need to provide the `kubeconfig` context (called name in the
entry above) for your host cluster when you deploy your federation
control plane.
-->
## 选择一个主集群

您将需要选择您其中的一个集群作为主集群，这个主集群将运行组成联邦控制面板
的所有组件。确保在您本地的 `kubeconfig` 里有一个对应您的主集群的 `kubeconfig` 
条目。可以使用下列命令来验证是否有需求的 `kubeconfig` 条目：

```shell
kubectl config get-contexts
```

输出里必须有一个条目对应您的主集群，类似下面的内容：

```
CURRENT   NAME                                          CLUSTER                                       AUTHINFO                                      NAMESPACE
*         gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1
```

当您部署联邦集群控制面板时，您将需要提供主集群的 `kubeconfig` 内容(就是上面条目对应的 name ) 。
<!--
## Deploying a federation control plane

To deploy a federation control plane on your host cluster, run
[`kubefed init`](/docs/admin/kubefed_init/) command. When you use
`kubefed init`, you must provide the following:

* Federation name
* `--host-cluster-context`, the `kubeconfig` context for the host cluster
* `--dns-provider`, one of `'google-clouddns'`, `aws-route53` or `coredns`
* `--dns-zone-name`, a domain name suffix for your federated services

If your host cluster is running in a non-cloud environment or an
environment that doesn't support common cloud primitives such as
load balancers, you might need additional flags. Please see the
[on-premises host clusters](#on-premises-host-clusters) section below.
-->
## 部署一个联邦控制面板

想要在你的主集群上部署联邦控制面板，运行 [`kubefed init`](/docs/admin/kubefed_init/) 。
使用 `kubefed init` 时，需要提供以下参数：

* 联邦名字
* `--host-cluster-context`, 主集群的 `kubeconfig` 内容
* `--dns-provider`, 可选 `'google-clouddns'`, `aws-route53` 或者 `coredns`
* `--dns-zone-name`, 联邦服务的域名后缀

如果您的主集群不是运行在一个云的环境，或者是这个环境不支持常见的云功能，比如负载均衡，
那您可能还需要提供其他的参数。请查阅下面的内容
[on-premises 主集群](#on-premises-host-clusters) 。

<!--
The following example command deploys a federation control plane with
the name `fellowship`, a host cluster context `rivendell`, and the
domain suffix `example.com.`:

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com."
```

The domain suffix specified in `--dns-zone-name` must be an existing
domain that you control, and that is programmable by your DNS provider.
It must also end with a trailing dot.

Once the federation control plane is initialized, query the namespaces:

```shell
kubectl get namespace --context=fellowship
```

If you do not see the `default` namespace listed (this is due to a
[bug](https://github.com/kubernetes/kubernetes/issues/33292)). Create it
yourself with the following command:

```shell
kubectl create namespace default --context=fellowship
```
-->
下面的命令部署了一个联邦集群，名称为 fellowship，主集群上下
文（host cluster context）为 rivendell，域名后缀为 example.com.：

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com."
```

`--dns-zone-name` 定义的联邦集群的域名后缀必须是一个属于您的已存在的域名，
而且必须是受您的 DNS 提供商所管理的，结尾必须有个点号。

等联邦控制面板初始化完毕，查询 namespace ：

```shell
kubectl get namespace --context=fellowship
```

如果没有列出来名字为 `default` 的 namespace (这是因为一个 Bug 
[bug](https://github.com/kubernetes/kubernetes/issues/33292)). 
请使用下列命令自己创建一个：

```shell
kubectl create namespace default --context=fellowship
```

<!--
The machines in your host cluster must have the appropriate permissions
to program the DNS service that you are using. For example, if your
cluster is running on Google Compute Engine, you must enable the
Google Cloud DNS API for your project.

The machines in Google Container Engine (GKE) clusters are created
without the Google Cloud DNS API scope by default. If you want to use a
GKE cluster as a Federation host, you must create it using the `gcloud`
command with the appropriate value in the `--scopes` field. You cannot
modify a GKE cluster directly to add this scope, but you can create a
new node pool for your cluster and delete the old one. *Note that this
will cause pods in the cluster to be rescheduled.*

To add the new node pool, run:

```shell
scopes="$(gcloud container node-pools describe --cluster=gke-cluster default-pool --format='value[delimiter=","](config.oauthScopes)')"
gcloud container node-pools create new-np \
    --cluster=gke-cluster \
    --scopes="${scopes},https://www.googleapis.com/auth/ndev.clouddns.readwrite"
```
-->
您的主集群里的节点必须有足够的权限来管理您所使用的 DNS 服务，比如说，
如果您使用的集群是运行在 Google Compute Engine 上面，您必须启用 Google Cloud DNS API。

默认情况下，Google Container Engine (GKE) 集群里的节点创建时是不启用 Google Cloud DNS API 的，
如果您需要使用一个 GKE 集群作为联邦主集群，请在创建的时候使用 `gcloud` 和正确的 `--scopes` 
标签。您无法修改一个 GKE 集群来直接添加这个 scope ，但是可以创建一个新的节点群并删除旧的节点。
*注意 这样会导致集群里的 Pod 被重新调度。*

添加新的节点群，请运行下列命令:

```shell
scopes="$(gcloud container node-pools describe --cluster=gke-cluster default-pool --format='value[delimiter=","](config.oauthScopes)')"
gcloud container node-pools create new-np \
    --cluster=gke-cluster \
    --scopes="${scopes},https://www.googleapis.com/auth/ndev.clouddns.readwrite"
```

<!--
To delete the old node pool, run:

```shell
gcloud container node-pools delete default-pool --cluster gke-cluster
```

`kubefed init` sets up the federation control plane in the host
cluster and also adds an entry for the federation API server in your
local kubeconfig. Note that in the beta release in Kubernetes 1.6,
`kubefed init` does not automatically set the current context to the
newly deployed federation. You can set the current context manually by
running:

```shell
kubectl config use-context fellowship
```

where `fellowship` is the name of your federation.
-->
删除旧的节点群，请运行:

```shell
gcloud container node-pools delete default-pool --cluster gke-cluster
```

`kubefed init` 在主集群里配置联邦控制面板，并在您本地的 kubeconfig 添加联邦 API 服务的
配置条目。注意，在 Kubernetes 1.6 beta 发行版本中，`kubefed init` 并不会自动将新部署的集群联邦的
上下文配置为当前的内容, 因此您需要手动配置，运行下面的命令：

```shell
kubectl config use-context fellowship
```

在这里 `fellowship` 是您的联邦名字。
<!--
### Basic and token authentication support

`kubefed init` by default only generates TLS certificates and keys
to authenticate with the federation API server and writes them to
your local kubeconfig file. If you wish to enable basic authentication
or token authentication for debugging purposes, you can enable them by
passing the `--apiserver-enable-basic-auth` flag or the
`--apiserver-enable-token-auth` flag.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-enable-basic-auth=true \
    --apiserver-enable-token-auth=true
```
-->
### 基本和令牌验证支持

`kubefed init` 默认只会用于联邦 API 服务验证的 TLS 证书和密钥，
并写入到本地的 kubeconfig 文件里面。如果您需要 debug 而启用基本验证
或者令牌验证，您可以通过传递 `--apiserver-enable-basic-auth` 或者 `--apiserver-enable-token-auth` 标签来实现。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-enable-basic-auth=true \
    --apiserver-enable-token-auth=true
```
<!--
### Passing command line arguments to federation components

`kubefed init` bootstraps a federation control plane with default
arguments to federation API server and federation controller manager.
Some of these arguments are derived from `kubefed init`'s flags.
However, you can override these command line arguments by passing
them via the appropriate override flags.

You can override the federation API server arguments by passing them
to `--apiserver-arg-overrides` and override the federation controller
manager arguments by passing them to
`--controllermanager-arg-overrides`.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-arg-overrides="--anonymous-auth=false,--v=4" \
    --controllermanager-arg-overrides="--controllers=services=false"
```
-->
### 给联邦组件传递命令行参数

`kubefed init` 使用了默认参数配置联邦 API 服务和联邦控制管理服务，从而部署了
一个联邦控制管理面板。而其中的一些参数是衍生自 `kubefed init` 的标签。
然而用户也可以自己通过对应的标签来定义这些参数。

您即可以使用`--apiserver-arg-overrides` 这个标签来定义联邦 API 服务的参数，
也可以使用`--controllermanager-arg-overrides` 来定义联邦控制管理服务的参数。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-arg-overrides="--anonymous-auth=false,--v=4" \
    --controllermanager-arg-overrides="--controllers=services=false"
```
<!--
### Configuring a DNS provider

The Federated service controller programs a DNS provider to expose
federated services via DNS names. Certain cloud providers
automatically provide the configuration required to program the
DNS provider if the host cluster's cloud provider is same as the DNS
provider. In all other cases, you have to provide the DNS provider
configuration to your federation controller manager which will in-turn
be passed to the federated service controller. You can provide this
configuration to federation controller manager by storing it in a file
and passing the file's local filesystem path to `kubefed init`'s
`--dns-provider-config` flag. For example, save the config below in
`$HOME/coredns-provider.conf`.

```ini
[Global]
etcd-endpoints = http://etcd-cluster.ns:2379
zones = example.com.
```

And then pass this file to `kubefed init`:

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```
-->
### 配置一个 DNS 服务提供商

联邦管理服务会使用 DNS 来通过域名开放联邦服务。有些云服务提供商会
自动提供所需配置，前提是主集群的云提供商跟所使用的 DNS 服务提供商是
同一家。如果不是这种情况的话，您就需要给联邦管理控制器提供 DNS 配置信
息，而反过来，这个配置信息也会传递给联邦管理服务。可以把配置信息保存
在文件里，然后通过文件的本地文件系统路径传递
给 `kubefed init` 的 `--dns-provider-config` 标签来向联邦管理控制器
提供配置。比如，将配置保存在 `$HOME/coredns-provider.conf` 。

```ini
[Global]
etcd-endpoints = http://etcd-cluster.ns:2379
zones = example.com.
```

然后将这个文件路径传递给 `kubefed init`:

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```
<!--
### On-premises host clusters

#### API server service type

`kubefed init` exposes the federation API server as a Kubernetes
[service](/docs/concepts/services-networking/service/) on the host cluster. By default,
this service is exposed as a
[load balanced service](/docs/concepts/services-networking/service/#type-loadbalancer).
Most on-premises and bare-metal environments, and some cloud
environments lack support for load balanced services. `kubefed init`
allows exposing the federation API server as a
[`NodePort` service](/docs/concepts/services-networking/service/#type-nodeport) on
such environments. This can be accomplished by passing
the `--api-server-service-type=NodePort` flag. You can also specify
the preferred address to advertise the federation API server by
passing the `--api-server-advertise-address=<IP-address>`
flag. Otherwise, one of the host cluster's node address is chosen as
the default.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --api-server-service-type="NodePort" \
    --api-server-advertise-address="10.0.10.20"
```
-->
### On-premises 主集群

#### API 服务类型

`kubefed init` 在主集群上以 Kubernetes [服务](/docs/concepts/services-networking/service/) 
的方式开放联邦的 API 服务。默认情况下，这个服务是作为[负载均衡服务](/docs/concepts/services-networking/service/#type-loadbalancer).
大部分 on-premises 和 bare-metal 的环境和一些云环境，都缺乏负载均衡服务。
因此 `kubefed init` 允许将联邦的 API 服务作为[`NodePort` 服务](/docs/concepts/services-networking/service/#type-nodeport)
在这样的环境里开放出来。这可以通过传递 `--api-server-service-type=NodePort` 标签来实现。
您也可以传递 `--api-server-advertise-address=<IP-address>` 来指定公开的联邦 API 服务的地址。
否则，主集群上的其中一个节点地址将会被作为默认地址。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --api-server-service-type="NodePort" \
    --api-server-advertise-address="10.0.10.20"
```
<!--
#### Provisioning storage for etcd

Federation control plane stores its state in
[`etcd`](https://coreos.com/etcd/docs/latest/).
[`etcd`](https://coreos.com/etcd/docs/latest/) data must be stored in
a persistent storage volume to ensure correct operation across
federation control plane restarts. On host clusters that support
[dynamic provisioning of storage volumes](/docs/concepts/storage/persistent-volumes/#dynamic),
`kubefed init` dynamically provisions a
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)
and binds it to a
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
to store [`etcd`](https://coreos.com/etcd/docs/latest/) data. If your
host cluster doesn't support dynamic provisioning, you can also
statically provision a
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes).
`kubefed init` creates a
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
that has the following configuration:
-->
#### 给 etcd 提供存储

联邦控制面板将它的数据存放在
[`etcd`](https://coreos.com/etcd/docs/latest/).
而[`etcd`](https://coreos.com/etcd/docs/latest/) 的数据必须存放在一个PersistentVolume里
才能确保在联邦控制面板重启之后能提供正确的操作。在支持
[动态分配存储卷](/docs/concepts/storage/persistent-volumes/#dynamic)的主集群上,
`kubefed init` 动态分配一个
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)
并绑定到一个
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
用于存储 [`etcd`](https://coreos.com/etcd/docs/latest/) 的数据。如果您的主集群不支持动态分配，
您可以固定的分配一个
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes).
`kubefed init` 创建一个有下面的配置的
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)：
<!--
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    volume.alpha.kubernetes.io/storage-class: "yes"
  labels:
    app: federated-cluster
  name: fellowship-federation-apiserver-etcd-claim
  namespace: federation-system
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```
-->
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    volume.alpha.kubernetes.io/storage-class: "yes"
  labels:
    app: federated-cluster
  name: fellowship-federation-apiserver-etcd-claim
  namespace: federation-system
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```
<!--
To statically provision a
[`PersistentVolume`](/docs/user-guide/persistent-volumes/#persistent-volumes),
you must ensure that the
[`PersistentVolume`](/docs/user-guide/persistent-volumes/#persistent-volumes)
that you create has the matching storage class, access mode and
at least as much capacity as the requested
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

Alternatively, you can disable persistent storage completely
by passing `--etcd-persistent-storage=false` to `kubefed init`.
However, we do not recommended this because your federation control
plane cannot survive restarts in this mode.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --etcd-persistent-storage=false
```

`kubefed init` still doesn't support attaching an existing
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
to the federation control plane that it bootstraps. We are planning to
support this in a future version of `kubefed`.
-->
想要固定的分配一个
[`PersistentVolume`](/docs/user-guide/persistent-volumes/#persistent-volumes),
您就必须确保您所创建的
[`PersistentVolume`](/docs/user-guide/persistent-volumes/#persistent-volumes)
有正确的存储类型，访问模式和
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
所需要的存储空间。

或者，您也可以通过给 `kubefed init` 传递标签 `--etcd-persistent-storage=false`
来完全的禁止永久存储。然而，我们并不建议您这么做，因为这样的话，您的联邦控制面板
重启之后将无法正常工作。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --etcd-persistent-storage=false
```

`kubefed init` 仍然不支持往一个已建立的联邦控制面板连接一个已存在的
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。
我们计划在将来的 `kubefed` 版本提供这方面的支持。

<!--
#### CoreDNS support

Federated services now support [CoreDNS](https://coredns.io/) as one
of the DNS providers. If you are running your clusters and federation
in an environment that does not have access to cloud-based DNS
providers, then you can run your own [CoreDNS](https://coredns.io/)
instance and publish the federated service DNS names to that server.

You can configure your federation to use
[CoreDNS](https://coredns.io/), by passing appropriate values to
`kubefed init`'s `--dns-provider` and `--dns-provider-config` flags.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```

For more information see
[Setting up CoreDNS as DNS provider for Cluster Federation](/docs/tasks/federation/set-up-coredns-provider-federation/).
-->
#### CoreDNS 支持

联邦服务现在支持 [CoreDNS](https://coredns.io/) 作为 DNS 提供商，
如果您现在的集群或者联邦集群的环境不支持基于云的 DNS 服务，那您可以
运行您自己的 [CoreDNS](https://coredns.io/) 实例并将公布的联邦 DNS 
服务指向该节点。

想要配置联邦集群使用
[CoreDNS](https://coredns.io/), 只需要给 `kubefed init` 的标签
`--dns-provider` 和 `--dns-provider-config` 配置相应的值就可以了。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```

更多信息请查看
[给联邦集群搭建 CoreDNS 作为 DNS 服务提供](/docs/tasks/federation/set-up-coredns-provider-federation/).
<!--
## Adding a cluster to a federation

Once you've deployed a federation control plane, you'll need to make
that control plane aware of the clusters it should manage. You can add
a cluster to your federation by using the [`kubefed join`](/docs/admin/kubefed_join/)
command.

To use `kubefed join`, you'll need to provide the name of the cluster
you want to add to the federation, and the `--host-cluster-context`
for the federation control plane's host cluster.

> Note: The name that you provide to the `join` command is used as the
joining cluster's identity in federation. This name should adhere to
the rules described in the
[identifiers doc](/docs/concepts/overview/working-with-objects/names/). If the context
corresponding to your joining cluster conforms to these rules then you
can use the same name in the join command. Otherwise, you will have to
choose a different name for your cluster's identity. For more
information, please see the
[naming rules and customization](#naming-rules-and-customization)
section below.
-->
## 往联邦添加集群

一旦您部署成功一个联邦控制面板，您就需要让控制面板知道需要管理哪些集群。
因此您可以使用 [`kubefed join`](/docs/admin/kubefed_join/) 命令往控制面板
添加集群。

要使用 `kubefed join`, 您需要提供集群的名字和`--host-cluster-context` 
指定的联邦控制面板的主集群。

> 注意: 您在使用 `join` 命令时使用的名字将会作为待添加集群在这个联邦里的
标识。这个名字必须符合这篇文章所描述的规则
[标识符文档](/docs/concepts/overview/working-with-objects/names/). 如果您的待添加集群的 context 
符合这个规则，您可以在 join 命令里使用相同的名字。否则，您将需要使用一个不同
的名字作为集群的标识。更多信息请查阅
[命名规则和自定义](#naming-rules-and-customization)。

<!--
The following example command adds the cluster `gondor` to the
federation running on host cluster `rivendell`:

```
kubefed join gondor --host-cluster-context=rivendell
```

> Note: Kubernetes requires that you manually join clusters to a
federation because the federation control plane manages only those
clusters that it is responsible for managing. Adding a cluster tells
the federation control plane that it is responsible for managing that
cluster.
-->
下面的命令将名字为 `gondor` 的集群添加到运行在主集群 `rivendell` 上面
的联邦集群里：

```
kubefed join gondor --host-cluster-context=rivendell
```

> 注意: Kubernetes 要求您手动添加集群到联邦里面，因为联邦控制面板只管理
那些可响应的集群，添加集群就会告诉联邦控制面板，这个被添加的集群是可响应的，
以便联邦管理。

<!--
### Naming rules and customization

The cluster name you supply to `kubefed join` must be a valid
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label and are
enumerated in the [Identifiers doc](/docs/concepts/overview/working-with-objects/names/).

Furthermore, federation control plane requires credentials of the
joined clusters to operate on them. These credentials are obtained
from the local kubeconfig. `kubefed join` uses the cluster name
specified as the argument to look for the cluster's context in the
local kubeconfig. If it fails to find a matching context, it exits
with an error.

This might cause issues in cases where context names for each cluster
in the federation don't follow
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label naming rules.
In such cases, you can specify a cluster name that conforms to the
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label naming rules
and specify the cluster context using the `--cluster-context` flag.
For example, if context of the cluster you are joining is
`gondor_needs-no_king`, then you can join the cluster by running:

```shell
kubefed join gondor --host-cluster-context=rivendell --cluster-context=gondor_needs-no_king
```
-->
### 命名规则和自定义

您提供给 `kubefed join` 的集群名字必须是一个有效的
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) 标签而且是符合
[标识符文档](/docs/concepts/overview/working-with-objects/names/)所列举的规范.

而且，联邦控制面板需要有被添加集群的验证信息以便管理。这些验证信息
是从本地的 kubeconfig 获取的。`kubefed join` 使用这个集群的名字作为
参数在本地的 kubeconfig 里查找集群的信息。如果找不到匹配的集群验证信息，
它就会报错并退出。

如果联邦里的集群名字不遵循[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt)
标签命名规则，这可能会造成错误。如果是这样的话，您可以通过给 `--cluster-context` 
标签指定一个符合[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt)标签命名规则的名字。
比如说，如果你要添加的集群的 context 为`gondor_needs-no_king` ， 那可以这样添加
这个集群：

```shell
kubefed join gondor --host-cluster-context=rivendell --cluster-context=gondor_needs-no_king
```
<!--
#### Secret name

Cluster credentials required by the federation control plane as
described above are stored as a secret in the host cluster. The name
of the secret is also derived from the cluster name.

However, the name of a secret object in Kubernetes should conform
to the DNS subdomain name specification described in
[RFC 1123](https://tools.ietf.org/html/rfc1123). If this isn't the
case, you can pass the secret name to `kubefed join` using the
`--secret-name` flag. For example, if the cluster name is `noldor` and
the secret name is `11kingdom`, you can join the cluster by
running:

```shell
kubefed join noldor --host-cluster-context=rivendell --secret-name=11kingdom
```

Note: If your cluster name does not conform to the DNS subdomain name
specification, all you need to do is supply the secret name via the
`--secret-name` flag. `kubefed join` automatically creates the secret
for you.
-->
#### Secret 命名

上面描述的联邦控制面板需要的集群验证信息，会作为 secret 保存在主集群里。
而这个 secret 的名字就衍生自这个集群的名字。

然后，Kubernetes 里的 secret 对象命名，必须遵从这个文档 [RFC 1123](https://tools.ietf.org/html/rfc1123) ，
所描述的 DNS 子域名的命名规则。如果不是这样的话，您可以将 secret 名字使用 `--secret-name` 的标签，
传递给 `kubefed join` 。 比如说，如果集群名字是 `noldor` ， 而 secret  名字是`11kingdom` ， 您可以这样添加这个集群：

```shell
kubefed join noldor --host-cluster-context=rivendell --secret-name=11kingdom
```

注意: 如果您的集群名字并不符合 DNS 子域名的命名规则，您所需要做的只是通过 `--secret-name` 标签，
来提供这个 secret 的名字而已。`kubefed join` 会自动为您创建这个 secret . 

<!--
### `kube-dns` configuration

`kube-dns` configuration must be updated in each joining cluster to
enable federated service discovery. If the joining Kubernetes cluster
is version 1.5 or newer and your `kubefed` is version 1.6 or newer,
then this configuration is automatically managed for you when the
clusters are joined or unjoined using `kubefed join` or `unjoin`
commands.

In all other cases, you must update `kube-dns` configuration manually
as described in the
[Updating KubeDNS section of the admin guide](/docs/admin/federation/).
-->
### `kube-dns` 配置

每个被添加的集群里的 `kube-dns` 的配置必需更新，以便启用联邦服务发现功能。
如果这个被添加的集群是1.5或者更高的版本，而您的 `kubefed` 是1.6或者更新，
那这个配置在集群被添加时或者使用 `kubefed join` 或 `unjoin` 这样的命令的时候，
会自动更新。

除此之外，您都必须更新 `kube-dns` 的配置，详情请查阅
[更新管理指南中的 KubeDNS 章节](/docs/admin/federation/).
<!--
## Removing a cluster from a federation

To remove a cluster from a federation, run the [`kubefed unjoin`](/docs/admin/kubefed_unjoin/)
command with the cluster name and the federation's
`--host-cluster-context`:

```
kubefed unjoin gondor --host-cluster-context=rivendell
```
-->
## 从联邦里移除一个集群

要从联邦里移除一个集群，执行命令 [`kubefed unjoin`](/docs/admin/kubefed_unjoin/)
并使用联邦的标签 `--host-cluster-context` 和集群的名字：

```
kubefed unjoin gondor --host-cluster-context=rivendell
```
<!--
## Turning down the federation control plane

Proper cleanup of federation control plane is not fully implemented in
this beta release of `kubefed`. However, for the time being, deleting
the federation system namespace should remove all the resources except
the persistent storage volume dynamically provisioned for the
federation control plane's etcd. You can delete the federation
namespace by running the following command:

```
kubectl delete ns federation-system
```
-->
## 清除联邦控制面板

在目前的 kubefed beta 版本里并未完全实现对联邦控制面板的彻底清理。
然而，目前而言，删除联邦系统对应的 namespace 会删除所有的资源，除了自动分配
给联邦集群的 etcd 服务的永久存储。您可以这样删除联邦的 namespace ：

```
kubectl delete ns federation-system
```