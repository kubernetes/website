---
title: Kubefed 搭建联邦集群
content_template: templates/task
weight: 125
---
<!-- ---
title: Set up Cluster Federation with Kubefed
reviewers:
- madhusudancs
content_template: templates/task
weight: 125
--- -->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!-- Kubernetes version 1.5 and above includes a new command line tool called
[`kubefed`](/docs/admin/kubefed/) to help you administrate your federated
clusters. `kubefed` helps you to deploy a new Kubernetes cluster federation
control plane, and to add clusters to or remove clusters from an existing
federation control plane. -->
Kubernetes 1.5及更高版本包括一个名为[`kubefed`](/docs/admin/kubefed/)的新命令行工具，可帮助您管理联邦集群。
`kubefed` 可帮助您部署新的 Kubernetes 集群联合控制平面,以及向现有联合控制平面添加集群或从现有联合控制平面删除集群。

<!-- This guide explains how to administer a Kubernetes Cluster Federation
using `kubefed`. -->
本文介绍了如何使用 `kubefed` 管理 Kubernetes 联邦集群。

<!-- > Note: `kubefed` is a beta feature in Kubernetes 1.6. -->
> 说明: `kubefed` 是 Kubernetes 1.6 中的 beta 功能。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!-- ## Prerequisites -->
## 前提

<!-- This guide assumes that you have a running Kubernetes cluster. Please
see one of the [getting started](/docs/setup/) guides
for installation instructions for your platform. -->
本文假设您有一个正在运行的 Kubernetes 集群。
请参阅[入门](/docs/setup/)指南获取适用于您平台的安装说明。

<!-- ## Getting `kubefed` -->
## 获取 `kubefed`

<!-- Download the client tarball corresponding to the particular release and
extract the binaries in the tarball: -->
下载特定发行版相对应的客户端 tarball，并提取 tarball 二进制文件:

<!-- {{< note >}}
Until Kubernetes version `1.8.x` the federation project was
maintained as part of the [core kubernetes repo](https://github.com/kubernetes/kubernetes).
Between Kubernetes releases `1.8` and `1.9`, the federation project moved into
a separate [federation repo](https://github.com/kubernetes/federation), where it is
now maintained. Consequently, the federation release information is available on the
[release page](https://github.com/kubernetes/federation/releases).
{{< /note >}} -->
{{< note >}}
在 Kubernetes `1.8.x` 之前，联合项目是作为[核心 kubernetes repo](https://github.com/kubernetes/kubernetes)的一部分进行维护。在 Kubernetes `1.8` 和 `1.9` 之间，联合项目移到了一个单独的[联邦 repo](https://github.com/kubernetes/federation)中，现在已在其中维护。因此，联合发布信息可在[发行页面]](https://github.com/kubernetes/federation/releases)上找到。
{{< /note >}}

<!-- ### For Kubernetes versions 1.8.x and earlier: -->
### 对于 Kubernetes 1.8.x 和更老版本:

```shell
curl -LO https://storage.googleapis.com/kubernetes-release/release/${RELEASE-VERSION}/kubernetes-client-linux-amd64.tar.gz
tar -xzvf kubernetes-client-linux-amd64.tar.gz
```
<!-- {{< note >}}
The `RELEASE-VERSION` variable should either be set to or replaced with the actual version needed.
{{< /note >}} -->
{{< note >}}
应该将 `RELEASE-VERSION` 变量设置或替换为所需的实际版本。
{{< /note >}}

<!-- Copy the extracted binary to one of the directories in your `$PATH`
and set the executable permission on the binary. -->
将提取的二进制文件复制到 `$PATH` 中的任意目录，并给予二进制文件可执行权限。

```shell
sudo cp kubernetes/client/bin/kubefed /usr/local/bin
sudo chmod +x /usr/local/bin/kubefed
```

<!-- ### For Kubernetes versions 1.9.x and above: -->
### 对于 Kubernetes 1.9.x 及更高版本:

```shell
curl -LO https://storage.cloud.google.com/kubernetes-federation-release/release/${RELEASE-VERSION}/federation-client-linux-amd64.tar.gz
tar -xzvf federation-client-linux-amd64.tar.gz
```

<!-- {{< note >}}
The `RELEASE-VERSION` variable should be replaced with one of the release versions available at [federation release page](https://github.com/kubernetes/federation/releases).
{{< /note >}} -->
{{< note >}}
`RELEASE-VERSION` 变量应替换为[联邦发布页面](https://github.com/kubernetes/federation/releases)上可用的发行版本之一。
{{< /note >}}

<!-- Copy the extracted binary to one of the directories in your `$PATH`
and set the executable permission on the binary. -->
将提取的二进制文件复制到 `$PATH` 中的任意目录，并给予二进制文件可执行权限。

```shell
sudo cp federation/client/bin/kubefed /usr/local/bin
sudo chmod +x /usr/local/bin/kubefed
```

<!-- ### Install kubectl -->
### 安装 kubectl

<!-- You can install a matching version of kubectl using the instructions on
the  [kubectl install page](/docs/tasks/tools/install-kubectl/). -->
您可以按照[安装 kubectl](/docs/tasks/tools/install-kubectl/)说明安装匹配的 kubectl 版本。


<!-- ## Choosing a host cluster. -->
## 选择主机集群

<!-- You'll need to choose one of your Kubernetes clusters to be the
*host cluster*. The host cluster hosts the components that make up
your federation control plane. Ensure that you have a `kubeconfig`
entry in your local `kubeconfig` that corresponds to the host cluster.
You can verify that you have the required `kubeconfig` entry by
running: -->
您需要选择一个 Kubernetes 集群作为 *host cluster*。主机集群托管组成联邦控制平面的组件。 
确保主机集群相对应的本地 `kubeconfig` 中有一个 `kubeconfig` 条目。
您可以通过运行以下命令来验证您是否具有必备的 `kubeconfig` 条目：

```shell
kubectl config get-contexts
```

<!-- The output should contain an entry corresponding to your host cluster,
similar to the following: -->
应输出包含与您的主机集群相对应的条目，类似以下内容:

```
CURRENT   NAME                                          CLUSTER                                       AUTHINFO                                      NAMESPACE
*         gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1
```


<!-- You'll need to provide the `kubeconfig` context (called name in the
entry above) for your host cluster when you deploy your federation
control plane. -->
部署联合控制平面时，您需要为主机集群提供 `kubeconfig` 上下文(上面条目中的名称)。


<!-- ## Deploying a federation control plane -->
## 部署联邦控制平面

<!-- To deploy a federation control plane on your host cluster, run
[`kubefed init`](/docs/admin/kubefed_init/) command. When you use
`kubefed init`, you must provide the following: -->
要在主机群集上部署联合控制平面，请运行[`kubefed init`](/docs/admin/kubefed_init/)命令。
使用 `kubefed init` 时，您必须提供以下内容:

<!-- * Federation name
* `--host-cluster-context`, the `kubeconfig` context for the host cluster
* `--dns-provider`, one of `'google-clouddns'`, `aws-route53` or `coredns`
* `--dns-zone-name`, a domain name suffix for your federated services -->
* Federation 名称
* `--host-cluster-context`,对于主机集群的 `kubeconfig` 上下文 
* `--dns-provider`, `'google-clouddns'` , `aws-route53` 或 `coredns` 其中之一
* `--dns-zone-name`, 联邦服务域名后缀

<!-- If your host cluster is running in a non-cloud environment or an
environment that doesn't support common cloud primitives such as
load balancers, you might need additional flags. Please see the
[on-premises host clusters](#on-premises-host-clusters) section below. -->
如果主机集群在非云环境中运行，或者在不支持常见云原语的环境(例如负载平衡器)中运行，则可能需要其他标志。
请参阅下面的[本地主机集群](#on-premises-host-clusters)部分。

<!-- The following example command deploys a federation control plane with
the name `fellowship`, a host cluster context `rivendell`, and the
domain suffix `example.com.`: -->
以下示例命令部署名称为 `fellowship`，主机集群上下文 `rivendell` 和域名后缀 `example.com.` 的联合控制平面:

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com."
```

<!-- The domain suffix specified in `--dns-zone-name` must be an existing
domain that you control, and that is programmable by your DNS provider.
It must also end with a trailing dot. -->
`--dns-zone-name` 中指定的域名后缀必须是您控制的现有域名，并且可以由您的 DNS 提供程序进行编程。它还必须以 . 结尾。

<!-- Once the federation control plane is initialized, query the namespaces: -->
联邦控制平面初始化后，查询命名空间:

```shell
kubectl get namespace --context=fellowship
```

<!-- If you do not see the `default` namespace listed (this is due to a
[bug](https://github.com/kubernetes/kubernetes/issues/33292)). Create it
yourself with the following command: -->
如果您未看到列出的 `default` 命名空间(这是由于[bug](https://github.com/kubernetes/kubernetes/issues/33292))。
使用以下命令自行创建:

```shell
kubectl create namespace default --context=fellowship
```

<!-- The machines in your host cluster must have the appropriate permissions
to program the DNS service that you are using. For example, if your
cluster is running on Google Compute Engine, you must enable the
Google Cloud DNS API for your project. -->
主机集群中的计算机必须具有适当的权限才能对正在使用的 DNS 服务进行编程。例如，如果您的集群在 Google Compute Engine 上运行，则必须为您的项目启用 Google Cloud DNS API。

<!-- The machines in Google Kubernetes Engine clusters are created
without the Google Cloud DNS API scope by default. If you want to use a
Google Kubernetes Engine cluster as a Federation host, you must create it using the `gcloud`
command with the appropriate value in the `--scopes` field. You cannot
modify a Google Kubernetes Engine cluster directly to add this scope, but you can create a
new node pool for your cluster and delete the old one. -->
默认情况下，创建的 Google Kubernetes Engine 集群中的计算机没有 Google Cloud DNS API 范围。
如果要使用 Google Kubernetes Engine 集群作为联邦身份验证主机，则必须使用 `gcloud` 字段中具有适当值的 `gcloud` 命令来创建它。您不能直接修改 Google Kubernetes Engine 集群来添加此范围，但是可以为集群创建一个新的节点池并删除旧的节点池。

<!-- {{< note >}}
This will cause pods in the cluster to be rescheduled.
{{< /note >}} -->
{{< note >}}
这将导致集群的 Pod 重新安排。
{{< /note >}}

<!-- To add the new node pool, run: -->
要添加新的节点池，请运行:

```shell
scopes="$(gcloud container node-pools describe --cluster=gke-cluster default-pool --format='value[delimiter=","](config.oauthScopes)')"
gcloud container node-pools create new-np \
    --cluster=gke-cluster \
    --scopes="${scopes},https://www.googleapis.com/auth/ndev.clouddns.readwrite"
```

要删除旧的节点池，请运行:

```shell
gcloud container node-pools delete default-pool --cluster gke-cluster
```

<!-- `kubefed init` sets up the federation control plane in the host
cluster and also adds an entry for the federation API server in your
local kubeconfig. -->
`kubefed init` 在主机集群中设置联合控制平面，并在本地 kubeconfig 中添加联邦 API 服务器的条目。

<!-- {{< note >}}
In the beta release of Kubernetes 1.6, `kubefed init` does not automatically set the current context to the
newly deployed federation. You can set the current context manually by running:

```shell
kubectl config use-context fellowship
```

where `fellowship` is the name of your federation.
{{< /note >}} -->
{{< note >}}
在 Kubernetes 1.6 的 beta 版本中，`kubefed init` 不会自动将当前上下文设置为新部署的联邦。
您可以通过运行以下命令手动设置当前上下文:

```shell
kubectl config use-context fellowship
```

其中，`fellowship` 是联邦的名称。
{{< /note >}}

<!-- ### Basic and token authentication support -->
### 基本和令牌认证支持

<!-- `kubefed init` by default only generates TLS certificates and keys
to authenticate with the federation API server and writes them to
your local kubeconfig file. If you wish to enable basic authentication
or token authentication for debugging purposes, you can enable them by
passing the `--apiserver-enable-basic-auth` flag or the
`--apiserver-enable-token-auth` flag. -->
默认情况下,`kubefed init` 仅生成 TLS 证书和密钥与联邦 API 服务器进行身份验证，并将它们写入本地 kubeconfig 文件。
如果您希望出于调试目的启用基本身份验证或令牌身份验证，则可以通过传递 `--apiserver-enable-basic-auth` 参数或`--apiserver-enable-token-auth` 参数来启用它们。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-enable-basic-auth=true \
    --apiserver-enable-token-auth=true
```

<!-- ### Passing command line arguments to federation components -->
### 将命令行参数传递给联邦组件

<!-- `kubefed init` bootstraps a federation control plane with default
arguments to federation API server and federation controller manager.
Some of these arguments are derived from `kubefed init`'s flags.
However, you can override these command line arguments by passing
them via the appropriate override flags. -->
`kubefed init` 引导联邦控制平面使用默认参数传递给联邦 API 服务器和联邦控制器管理器，
其中一些参数是从 `kubefed init` 参数中派生的。但是您可以通过适当的覆盖参数来覆盖这些命令行参数。

<!-- You can override the federation API server arguments by passing them
to `--apiserver-arg-overrides` and override the federation controller
manager arguments by passing them to
`--controllermanager-arg-overrides`. -->
您可以通过将联邦 API 服务器参数传递给 `--apiserver-arg-overrides` 来覆盖，并通过将联邦控制器管理器参数传递给 `--controllermanager-arg-overrides` 来覆盖。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-arg-overrides="--anonymous-auth=false,--v=4" \
    --controllermanager-arg-overrides="--controllers=services=false"
```

<!-- ### Configuring a DNS provider -->
### 配置 DNS 提供商

<!-- The Federated service controller programs a DNS provider to expose
federated services via DNS names. Certain cloud providers
automatically provide the configuration required to program the
DNS provider if the host cluster's cloud provider is same as the DNS
provider. In all other cases, you have to provide the DNS provider
configuration to your federation controller manager which will in-turn
be passed to the federated service controller. You can provide this
configuration to federation controller manager by storing it in a file
and passing the file's local filesystem path to `kubefed init`'s
`--dns-provider-config` flag. For example, save the config below in
`$HOME/coredns-provider.conf`. -->
联合服务控制器对 DNS 提供程序进行编程，以通过 DNS 名称公开联合服务。
如果主机集群的云提供程序与 DNS 提供程序相同，则某些云提供程序会自动提供对 DNS 提供程序进行编程所需的配置。
在所有其他情况下，您必须将 DNS 提供程序配置提供给联合身份验证控制器管理器，然后将其传递给联合身份验证服务控制器。
您可以通过将配置存储在文件中并将文件的本地文件系统路径传递到 `kubefed init` 的 `--dns-provider-config` 标志来提供此配置给联合控制器管理器。例如，将以下配置保存在 `$HOME/coredns-provider.conf` 中。

```ini
[Global]
etcd-endpoints = http://etcd-cluster.ns:2379
zones = example.com.
```

<!-- And then pass this file to `kubefed init`: -->
然后将此文件传递给 `kubefed init`:

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```

<!-- ### On-premises host clusters -->
### 本地主机集群

<!-- #### API server service type -->
#### API 服务器服务类型

<!-- `kubefed init` exposes the federation API server as a Kubernetes
[service](/docs/concepts/services-networking/service/) on the host cluster. By default,
this service is exposed as a
[load balanced service](/docs/concepts/services-networking/service/#loadbalancer).
Most on-premises and bare-metal environments, and some cloud
environments lack support for load balanced services. `kubefed init`
allows exposing the federation API server as a
[`NodePort` service](/docs/concepts/services-networking/service/#nodeport) on
such environments. This can be accomplished by passing
the `--api-server-service-type=NodePort` flag. You can also specify
the preferred address to advertise the federation API server by
passing the `--api-server-advertise-address=<IP-address>`
flag. Otherwise, one of the host cluster's node address is chosen as
the default. -->
`kubefed init` 将联合 API 服务器作为主机集群上的 Kubernetes [service](/docs/concepts/services-networking/service/)公开。默认情况下，此服务公开为[负载均衡服务](/docs/concepts/services-networking/service/#loadbalancer)。大多数本地和裸机环境，某些云环境缺少对负载均衡服务的支持。`kubefed init` 允许在此类环境中将联合身份验证 API 服务器公开为[`NodePort` service](/docs/concepts/services-networking/service/#nodeport)。这可以通过传递 `--api-server-service-type=NodePort` 参数来完成。您还可以通过传递 `--api-server-advertise-address=<IP-address>` 参数来指定用于宣传联邦 API 服务器的首选地址。否则，将选择主机集群的节点地址之一作为默认值。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --api-server-service-type="NodePort" \
    --api-server-advertise-address="10.0.10.20"
```

<!-- #### Provisioning storage for etcd -->
#### 设置 etcd 的存储

<!-- Federation control plane stores its state in
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
that has the following configuration: -->
联合控制平面将其状态存储在[`etcd`](https://coreos.com/etcd/docs/latest/)。
[`etcd`](https://coreos.com/etcd/docs/latest/)数据必须存储在永久性存储卷中，以确保跨联合控制平面重新启动的正确操作。在支持[动态调配存储卷](/docs/concepts/storage/persistent-volumes/#dynamic)的主机集群上,
`kubefed init` 动态配置[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)并将其绑定到[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)来存储[`etcd`](https://coreos.com/etcd/docs/latest/)数据。如果您的主机集群不支持动态配置，则还可以静态配置[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)。
`kubefed init` 创建[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)具有以下配置:

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

<!-- To statically provision a
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes),
you must ensure that the
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)
that you create has the matching storage class, access mode and
at least as much capacity as the requested
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims). -->
要静态设置[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes),您必须确保创建的[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)具有匹配的存储类，访问模式，并且容量至少与请求的[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)一致。

<!-- Alternatively, you can disable persistent storage completely
by passing `--etcd-persistent-storage=false` to `kubefed init`.
However, we do not recommended this because your federation control
plane cannot survive restarts in this mode. -->
或者，您可以通过将 `--etcd-persistent-storage=false` 传递给 `kubefed init` 来完全禁用持久性存储。
但是，我们不建议您这样做，因为您的联合控制平面在这种模式下无法重启。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --etcd-persistent-storage=false
```

<!-- `kubefed init` still doesn't support attaching an existing
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
to the federation control plane that it bootstraps. We are planning to
support this in a future version of `kubefed`. -->
`kubefed init` 仍然不支持将现有的[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)附加到它引导的联盟控制平面上。我们计划在 `kubefed` 的未来版本中对此提供支持。

<!-- #### CoreDNS support -->
#### CoreDNS 支持

<!-- Federated services now support [CoreDNS](https://coredns.io/) as one
of the DNS providers. If you are running your clusters and federation
in an environment that does not have access to cloud-based DNS
providers, then you can run your own [CoreDNS](https://coredns.io/)
instance and publish the federated service DNS names to that server. -->
联合服务现在支持[CoreDNS](https://coredns.io/)作为 DNS 提供程序之一。如果您在无法访问基于云的 DNS 提供程序的环境中运行集群和联合身份验证，则可以运行自己的[CoreDNS](https://coredns.io/)实例并发布联合服务 DNS 名称到该服务器。

<!-- You can configure your federation to use
[CoreDNS](https://coredns.io/), by passing appropriate values to
`kubefed init`'s `--dns-provider` and `--dns-provider-config` flags. -->
您可以通过将合适的值传递给 `kubefed init` 的 `--dns-provider` 和 `--dns-provider-config` 标志来配置联合以使用[CoreDNS](https://coredns.io/)。

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```

<!-- For more information see
[Setting up CoreDNS as DNS provider for Cluster Federation](/docs/tasks/federation/set-up-coredns-provider-federation/). -->
有关更多信息，请参见[将 CoreDNS 设置为联邦集群的 DNS 提供程序](/docs/tasks/federation/set-up-coredns-provider-federation/)。

<!-- #### AWS Route53 support -->
#### AWS Route53 支持

<!-- It is possible to utilize AWS Route53 as a cloud DNS provider when the
federation controller-manager is run on-premise. The controller-manager
Deployment must be configured with AWS credentials since it cannot implicitly
gather them from a VM running on AWS. -->
当联合身份验证控制器管理器在内部运行时，可以将 AWS Route53 用作云 DNS 提供程序。
控制器管理器部署必须配置有 AWS 凭证，因为它无法从 AWS 上运行 VM 隐式收集它们。

<!-- Currently, `kubefed init` does not read AWS Route53 credentials from the
`--dns-provider-config` flag, so a patch must be applied. -->
当前，`kubefed init` 不会从 `--dns-provider-config` 标志中读取 AWS Route53 凭据，因此必须应用补丁。

<!-- Specify AWS Route53 as your DNS provider when initializing your on-premise
federation controller-manager by passing the flag `--dns-provider="aws-route53"`
to `kubefed init`. -->
通过将标志 `--dns-provider="aws-route53"` 传递给 `kubefed init`，初始化内部联盟控制器时，将 AWS Route53 指定为 DNS 提供程序。

<!-- Create a patch file with your AWS credentials: -->
使用您的 AWS 凭证创建补丁文件:

```yaml
spec:
  template:
    spec:
      containers:
      - name: controller-manager
        env:
        - name: AWS_ACCESS_KEY_ID
          value: "ABCDEFG1234567890"
        - name: AWS_SECRET_ACCESS_KEY
          value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
```

<!-- Patch the Deployment: -->
补丁部署:

```shell
kubectl -n federation-system patch deployment controller-manager --patch "$(cat <patch-file-name>.yml)"
```

<!-- Where `<patch-file-name>` is the name of the file you created above. -->
其中 `<patch-file-name>` 是您在上面创建的文件的名称。

<!-- ## Adding a cluster to a federation -->
## 将集群添加到联邦

<!-- After you've deployed a federation control plane, you'll need to make that control plane aware of the clusters it should manage. -->
部署联邦控制平面后，需要使控制平面知道其应管理的集群。

<!-- To join clusters into the federation: -->
将集群加入联盟:

<!-- 1. Change the context: -->
1. 更改内容:

    ```shell
    kubectl config use-context fellowship
    ```

<!-- 1. If you are using a managed cluster service, allow the service to access the cluster. To do this, create a `clusterrolebinding` for the account associated with your cluster service: -->
1. 如果使用的是托管集群服务，则允许该服务访问集群。为此，请为集群服务关联的帐户创建一个 `clusterrolebinding`:

    ```shell
    kubectl create clusterrolebinding <your_user>-cluster-admin-binding --clusterrole=cluster-admin --user=<your_user>@example.org --context=<joining_cluster_context>
    ```

<!-- 1. Join the cluster to the federation, using `kubefed join`, and make sure you provide the following: -->
1. 使用 `kubefed join` 将集群加入联盟，并确保您提供以下内容:

    <!-- * The name of the cluster that you are joining to the federation
    * `--host-cluster-context`, the kubeconfig context for the host cluster

    For example, this command adds the cluster `gondor` to the federation running on host cluster `rivendell`: -->
    * 您要加入联邦的集群名称
    * `--host-cluster-context`, 主机集群的 kubeconfig 上下文

    例如, 此命令将集群 `gondor` 添加到在主机集群 `rivendell` 上运行的联合身份验证中:

    ```shell
    kubefed join gondor --host-cluster-context=rivendell
    ```

<!-- A new context has now been added to your kubeconfig named `fellowship` (after the name of your federation). -->
现在，已将一个新上下文添加到您的 kubeconfig 中，名为 `fellowship` (在联邦名称之后)。

<!-- {{< note >}}
The name that you provide to the `join` command is used as the joining cluster's identity in federation. This name should adhere to the rules described in the [identifiers doc](/docs/concepts/overview/working-with-objects/names/). If the context
corresponding to your joining cluster conforms to these rules, you can use the same name in the join command. Otherwise, you must choose a different name for your cluster's identity.
{{< /note >}} -->
{{< note >}}
您提供给 `join` 命令的名称在联合身份验证中用作联接集群的标识。 
此名称应遵守[identifiers 文档](/docs/concepts/overview/working-with-objects/names/)中描述的规则。
如果您加入集群相对应的上下文符合这些规则，则可以在 join 命令中使用相同的名称。否则，您必须为集群的身份选择其他名称。
{{< /note >}}

<!-- ### Naming rules and customization -->
### 命名规则和自定义

<!-- The cluster name you supply to `kubefed join` must be a valid
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label and are
enumerated in the [Identifiers doc](/docs/concepts/overview/working-with-objects/names/). -->
您提供给 `kubefed join` 的集群名称必须是有效的[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt)标签，并在[Identifiers doc](/docs/concepts/overview/working-with-objects/names/)中进行枚举。

<!-- Furthermore, federation control plane requires credentials of the
joined clusters to operate on them. These credentials are obtained
from the local kubeconfig. `kubefed join` uses the cluster name
specified as the argument to look for the cluster's context in the
local kubeconfig. If it fails to find a matching context, it exits
with an error. -->
此外，联合控制平面需要已加入集群的凭据才能在它们上面进行操作。 
这些凭证是从本地 kubeconfig 获得的。`kubefed join` 使用指定的集群名称作为参数在本地 kubeconfig 中寻找集群的上下文。如果找不到匹配的上下文，则会退出并显示错误。

<!-- This might cause issues in cases where context names for each cluster
in the federation don't follow
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label naming rules.
In such cases, you can specify a cluster name that conforms to the
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label naming rules
and specify the cluster context using the `--cluster-context` flag.
For example, if context of the cluster you are joining is
`gondor_needs-no_king`, then you can join the cluster by running: -->
如果联合中每个集群的上下文名称未遵循[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt)标签命名规则，则可能会导致问题。
在这种情况下，您可以指定符合[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt)标签命名规则的集群名称，并使用 `--cluster-context` 标志指定集群上下文。例如，如果要加入集群的上下文是 `gondor_needs-no_king`，则可以通过运行以下命令加入集群:

```shell
kubefed join gondor --host-cluster-context=rivendell --cluster-context=gondor_needs-no_king
```

<!-- #### Secret name -->
#### 密钥名称

<!-- Cluster credentials required by the federation control plane as
described above are stored as a secret in the host cluster. The name
of the secret is also derived from the cluster name. -->
如上所述，联合身份验证控制平面所需的集群凭据作为秘密存储在主机集群中。密钥名称也从集群名称中派生。

<!-- However, the name of a secret object in Kubernetes should conform
to the DNS subdomain name specification described in
[RFC 1123](https://tools.ietf.org/html/rfc1123). If this isn't the
case, you can pass the secret name to `kubefed join` using the
`--secret-name` flag. For example, if the cluster name is `noldor` and
the secret name is `11kingdom`, you can join the cluster by
running: -->
但是，Kubernetes 中的密钥对象的名称应符合[RFC 1123](https://tools.ietf.org/html/rfc1123)中描述的 DNS 子域名规范。 
如果不是这种情况，您可以使用 `--secret-name` 标志将密钥名称传递给 `kubefed join`。 
例如，如果集群名称为 `noldor`，而秘密名称为 `11kingdom`，则可以通过运行以下命令加入集群:

```shell
kubefed join noldor --host-cluster-context=rivendell --secret-name=11kingdom
```

<!-- {{< note >}}
If your cluster name does not conform to the DNS subdomain name specification, all you need to do is supply the secret name using the `--secret-name` flag. `kubefed join` automatically creates the secret for you.
{{< /note >}} -->
{{< note >}}
如果您的集群名称不符合 DNS 子域名规范，则您需要做的就是使用 `--secret-name` 标志提供密钥名称。`kubefed join` 会自动为您创建密钥。
{{< /note >}}

<!-- ### `kube-dns` configuration -->
### `kube-dns` 配置

<!-- `kube-dns` configuration must be updated in each joining cluster to
enable federated service discovery. If the joining Kubernetes cluster
is version 1.5 or newer and your `kubefed` is version 1.6 or newer,
then this configuration is automatically managed for you when the
clusters are joined or unjoined using `kubefed join` or `unjoin`
commands. -->
必须在每个加入群集中更新 `kube-dns` 配置，以启用联合服务发现。如果加入的 Kubernetes 集群是 1.5 或更高版本，而您的 `kubefed` 是 1.6 或更高版本，那么当使用 `kubefed join` 或 `unjoin` 命令来加入或者不加入集群时，将自动为您管理此配置。

<!-- In all other cases, you must update `kube-dns` configuration manually
as described in the
[Updating KubeDNS section of the admin guide](/docs/admin/federation/). -->
在所有其他情况下，您必须按照管理指南[更新管理指南的 KubeDNS 部分](/docs/admin/federation/)中的说明手动更新 `kube-dns` 配置。

<!-- ## Removing a cluster from a federation -->
## 从联邦中删除集群

<!-- To remove a cluster from a federation, run the [`kubefed unjoin`](/docs/reference/setup-tools/kubefed/kubefed_unjoin/)
command with the cluster name and the federation's
`--host-cluster-context`: -->
要从联合中删除集群，请运行带有集群名称和联邦 `--host-cluster-context` 的[`kubefed unjoin`](/docs/reference/setup-tools/kubefed/kubefed_unjoin/)命令:

```shell
kubefed unjoin gondor --host-cluster-context=rivendell
```

<!-- ## Turning down the federation control plane -->
## 调低联邦控制平面

<!-- Proper cleanup of federation control plane is not fully implemented in
this beta release of `kubefed`. However, for the time being, deleting
the federation system namespace should remove all the resources except
the persistent storage volume dynamically provisioned for the
federation control plane's etcd. You can delete the federation
namespace by running the following command: -->
在 beta 版本的 `kubefed` 中，没有完全实现对联邦控制平面的正确清理。但是，暂时删除联合系统命令空间应该会删除所有资源，除了为联合控制平面的 etcd 动态提供的持久性存储卷之外。您可以通过运行以下命令来删除联合命名空间:

```shell
kubectl delete ns federation-system --context=rivendell
```

<!-- {{< note >}}
`rivendell` is the host cluster name. Replace that name with the appropriate name in your configuration.
{{< /note >}} -->
{{< note >}}
`rivendell` 是主机集群名称，用您配置中的合适名称替换该名称。
{{< /note >}}

{{% /capture %}}