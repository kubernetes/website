---
approvers:
- madhusudancs
- mml
- nikhiljindal
title: （已废弃） 使用 `federation-up` 和 `deploy.sh`
cn-approvers:
- chentao1596
---
<!--
---
approvers:
- madhusudancs
- mml
- nikhiljindal
title: (Deprecated) Using `federation-up` and `deploy.sh`
---
-->

<!--
## The mechanisms explained in this doc to setup federation are deprecated. [`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) is now the recommended way to deploy federation.
-->
## 本文描述的安装联邦的机制已废弃。[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) 是现在推荐的部署联邦的方式。

<!--
This guide explains how to set up cluster federation that lets us control multiple Kubernetes clusters.
-->
本指南描述了如何建立集群联邦来让我们控制多个 Kubernetes 集群。

* TOC
{:toc}

<!--
## Prerequisites
-->
## 先决条件

<!--
This guide assumes that you have a running Kubernetes cluster.
If you need to start a new cluster, see the [getting started guides](/docs/setup/) for instructions on bringing a cluster up.
-->
本指南假设您已经有一个正常运行的 Kubernetes 集群。如果需要启动新集群，请参考 [入门指南](/docs/setup/) 获取有关集群启动的说明。

<!--
To use the commands in this guide, you must download a Kubernetes release from the 
[getting started binary releases](/docs/getting-started-guides/binary_release/) and 
extract into a directory; all the commands in this guide are run from
that directory.
-->
要使用本指南中的命令，您必须从 [使用二进制版本](/docs/getting-started-guides/binary_release/) 中下载 Kubernetes 的版本并且提取到一个目录中；本指南中的所有命令都是在那个解压得到的目录中执行的。

```shell
$ curl -L https://github.com/kubernetes/kubernetes/releases/download/v1.4.0/kubernetes.tar.gz | tar xvzf -
$ cd kubernetes
```

<!--
You must also have a Docker installation running
locally--meaning on the machine where you run the commands described in this
guide.
-->
您还必须安装一个在本地（运行本指南中描述的命令的计算机）运行的 Docker。

<!--
## Setting up a federation control plane
-->
## 设置联邦控制平面

<!--
Setting up federation requires running the federation control plane which
consists of etcd, federation-apiserver (via the hyperkube binary) and
federation-controller-manager (also via the hyperkube binary). You can run
these binaries as pods on an existing Kubernetes cluster.
-->
设置联邦需要运行的联邦控制平面，它由 etcd，federation-apiserver（通过 hyperkube 二进制文件） 以及 federation-controller-manager（也是通过 hyperkube 二进制文件)）组成。您可以将这些二进制文件以 pod 的方式在现有的 Kubernetes 集群中运行。

<!--
Note: This is a new mechanism to turn up Kubernetes Cluster Federation. If
you want to follow the old mechanism, please refer to the section
[Previous Federation turn up mechanism](#previous-federation-turn-up-mechanism)
at the end of this guide.
-->
注：这是一种新的创建 Kubernetes 集群联邦的机制。如果您想遵循旧的机制，请参阅本指南末尾的章节描述的 [以前的联邦创建机制](#以前的联邦创建机制)。

<!--
### Initial setup
-->
### 初始设置

<!--
Create a directory to store the configs required to turn up federation
and export that directory path in the environment variable
`FEDERATION_OUTPUT_ROOT`. This can be an existing directory, but it is
highly recommended to create a separate directory so that it is easier
to clean up later.
-->
创建目录，用于存储创建联邦的配置，将环境变量 `FEDERATION_OUTPUT_ROOT` 导出为该目录的路径。这可以是一个已经存在的目录，但我们强烈建议创建一个单独的目录，以便以后更容易清理。

```shell
$ export FEDERATION_OUTPUT_ROOT="${PWD}/_output/federation"
$ mkdir -p "${FEDERATION_OUTPUT_ROOT}"
```

<!--
Initialize the setup.
-->
初始化设置

```shell
$ federation/deploy/deploy.sh init
```

<!--
Optionally, you can create/edit `${FEDERATION_OUTPUT_ROOT}/values.yaml` to
customize any value in
[federation/federation/manifests/federation/values.yaml](https://github.com/madhusudancs/kubernetes-anywhere/blob/federation/federation/manifests/federation/values.yaml). Example:
-->
或者，您可以创建或者编辑 `${FEDERATION_OUTPUT_ROOT}/values.yaml` 文件，去自定义任何 [federation/federation/manifests/federation/values.yaml](https://github.com/madhusudancs/kubernetes-anywhere/blob/federation/federation/manifests/federation/values.yaml) 中的值。例如：

```yaml
apiserverRegistry: "gcr.io/myrepository"
apiserverVersion: "v1.5.0-alpha.0.1010+892a6d7af59c0b"
controllerManagerRegistry: "gcr.io/myrepository"
controllerManagerVersion: "v1.5.0-alpha.0.1010+892a6d7af59c0b"
```

<!--
Assuming you have built and pushed the `hyperkube` image to the repository
with the given tag in the example above.
-->
假设您已经使用上面例子中给定的标签构建并且推送 `hyperkube` 镜像到仓库中。

<!--
### Getting images
-->
## 获取镜像

<!--
To run the federation control plane components as pods, you first need the
images for all the components. You can either use the official release
images or you can build them yourself from HEAD.
-->
要将联邦控制平面组件作为 pod 运行，首先需要所有组件的镜像。您可以使用官方发布的镜像，也可以自己从头构建它们。

<!--
### Using official release images
-->
### 使用官方发布的镜像

<!--
As part of every Kubernetes release, official release images are pushed to
`k8s.gcr.io`. To use the images in this repository, you can
set the container image fields in the following configs to point to the
images in this repository. `k8s.gcr.io/hyperkube` image
includes the federation-apiserver and federation-controller-manager
binaries, so you can point the corresponding configs for those components
to the hyperkube image.
-->
作为每个 Kubernetes 版本发布的一部分，官方发布镜像将推送到 `k8s.gcr.io` 仓库中。要使用这个仓库中的镜像，您可以将下面配置中的容器镜像字段指向该仓库中的镜像。`k8s.gcr.io/hyperkube` 包含了 federation-apiserver 和 federation-controller-manager 二进制文件，因此，您可以将这些组件相应的配置指定为这个 hyperkube 镜像。


<!--
### Building and pushing images from HEAD
-->
### 从头构建和推送镜像

<!--
To build the binaries, check out the
[Kubernetes repository](https://github.com/kubernetes/kubernetes) and
run the following commands from the root of the source directory:
-->
要构建二进制文件，请签出 [Kubernetes 仓库](https://github.com/kubernetes/kubernetes)，并在源代码的根目录下运行下面这些命令：


```shell
$ federation/develop/develop.sh build_binaries
```

<!--
To build the image and push it to the repository, run:
-->
要构建镜像并将其推送到仓库，请运行：

```shell
$ KUBE_REGISTRY="gcr.io/myrepository" federation/develop/develop.sh build_image
$ KUBE_REGISTRY="gcr.io/myrepository" federation/develop/develop.sh push
```

<!--
Note: This is going to overwrite the values you might have set for
`apiserverRegistry`, `apiserverVersion`, `controllerManagerRegistry` and
`controllerManagerVersion` in your `${FEDERATION_OUTPUT_ROOT}/values.yaml`
file. Hence, it is not recommend to customize these values in
`${FEDERATION_OUTPUT_ROOT}/values.yaml` if you are building the
images from source.
-->
注：执行过程会覆盖文件 `${FEDERATION_OUTPUT_ROOT}/values.yaml` 中可能你已经设置过的某些值，包括 `apiserverRegistry`，`apiserverVersion`，`controllerManagerRegistry` 以及
`controllerManagerVersion`。因此，如果您从源代码构建镜像的话，不建议自定义 `${FEDERATION_OUTPUT_ROOT}/values.yaml` 中的这些值。

<!--
### Running the federation control plane
-->
### 运行联邦控制平面

<!--
Once you have the images, you can turn up the federation control plane by
running:
-->
一旦有了镜像，您可以通过运行下面命令创建联邦控制平面：

```shell
$ federation/deploy/deploy.sh deploy_federation
```

<!--
This spins up the federation control components as pods managed by
[`Deployments`](/docs/concepts/workloads/controllers/deployment/) on your
existing Kubernetes cluster. It also starts a
[`type: LoadBalancer`](/docs/concepts/services-networking/service/#type-loadbalancer)
[`Service`](/docs/concepts/services-networking/service/) for the
`federation-apiserver` and a
[`PVC`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims/) backed
by a dynamically provisioned
[`PV`](/docs/concepts/storage/persistent-volumes/) for
 `etcd`. All these components are created in the `federation` namespace.
-->
它将在您现有的 Kubernetes 集群中用 [`Deployment`](/docs/concepts/workloads/controllers/deployment/) 管理的 pod 来启动联邦控制平面组件。它还会为 `federation-apiserver` 启动一个 [`type: LoadBalancer`](/docs/concepts/services-networking/service/#type-loadbalancer) 类型的 [`Service`](/docs/concepts/services-networking/service/)，以及为 `etcd` 创建一个通过动态 [`PV`](/docs/concepts/storage/persistent-volumes/) 支持的 [`PVC`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims/) 。所有这些组件都创建在 `federation` 命名空间中。

<!--
You can verify that the pods are available by running the following
command:
-->
您可以通过运行以下命令来验证 pod 是否可用：


```shell
$ kubectl get deployments --namespace=federation
NAME                            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
federation-apiserver            1         1         1            1           1m
federation-controller-manager   1         1         1            1           1m
```

<!--
Running `deploy.sh` also creates a new record in your kubeconfig for us
to be able to talk to federation apiserver. You can view this by running
`kubectl config view`.
-->
运行 `deploy.sh` 也会在您的 kubeconfig 中创建一个新的记录，用于跟联邦 apiserver 通信。您可以运行 `kubectl config view` 进行查看。


<!--
Note: Dynamic provisioning for persistent volume currently works only on
AWS, Google Kubernetes Engine, and GCE. However, you can edit the created `Deployments` to suit
your needs, if required.
-->
注：目前，持久性卷的动态配置只适用于AWS、GoogleKubernetes 引擎和 GCE。但是，如果需要，您可以编辑创建的 `Deployment` 以满足您的需要。

<!--
## Registering Kubernetes clusters with federation
-->
## 向联邦注册 Kubernetes 集群

<!--
Now that you have the federation control plane up and running, you can start registering Kubernetes clusters.
-->
现在，联邦控制平面已经启动并运行，您可以开始注册 Kubernetes 集群了。

<!--
First of all, you need to create a secret containing kubeconfig for that Kubernetes cluster, which federation control plane will use to talk to that Kubernetes cluster.
For now, you can create this secret in the host Kubernetes cluster (that hosts federation control plane). When federation starts supporting secrets, you will be able to create this secret there.
Suppose that your kubeconfig for Kubernetes cluster is at `/cluster1/kubeconfig`, you can run the following command to create the secret:
-->
首先，您需要为该 Kubernetes 集群创建一个包含 kubeconfig 的 secret，联邦控制平面将使用该 secret 来与 Kubernetes 集群通信。现在，您可以在主机 Kubernetes 集群（托管联邦控制平面的集群）中创建这个 secret。当联邦开始支持 secret 时，您将能够在那里直接创建这个 secret。假设 Kubernetes 集群的 kubeconfig 位于 `/cluster1/kubeconfig`，您可以运行以下命令来创建 secret：

```shell
$ kubectl create secret generic cluster1 --namespace=federation --from-file=/cluster1/kubeconfig
```

<!--
Note that the file name should be `kubeconfig` since file name determines the name of the key in the secret.
-->
注意，文件名应该是 `kubeconfig` ，因为文件名决定了 secret 中密钥的名称。

<!--
Now that the secret is created, you are ready to register the cluster. The YAML file for cluster will look like:
-->
创建 secret 之后，就可以注册集群了。用于注册集群的 YAML 文件如下所示：

```yaml
apiVersion: federation/v1beta1
kind: Cluster
metadata:
  name: cluster1
spec:
  serverAddressByClientCIDRs:
  - clientCIDR: <client-cidr>
    serverAddress: <apiserver-address>
  secretRef:
    name: <secret-name>
```

<!--
You need to insert the appropriate values for `<client-cidr>`, `<apiserver-address>` and `<secret-name>`.
`<secret-name>` here is name of the secret that you just created.
serverAddressByClientCIDRs contains the various server addresses that clients
can use as per their CIDR. You can set the server's public IP address with CIDR
`"0.0.0.0/0"` which all clients will match. In addition, if you want internal
clients to use server's clusterIP, you can set that as serverAddress. The client
CIDR in that case will be a CIDR that only matches IPs of pods running in that
cluster.
-->
您需要为 `<client-cidr>`，`<apiserver-address>` 和 `<secret-name>` 填入适当的值。这里的 `<secret-name>`  就是您刚才创建的 secret 的名称。serverAddressByClientCIDRs 包含客户端按照 CIDR 使用的各种服务地址。您可以将公网 IP 按照 CIDR 设置为 `"0.0.0.0/0"`，这样所有的客户端都能匹配。另外，如果想要内部客户端使用服务的 clusterIP，那么可以将它设置为 serverAddress。在这种情况下，客户端 CIDR 将是只匹配运行在该集群中的 pod 的 IP 的那些 CIDR。

<!--
Assuming your YAML file is located at `/cluster1/cluster.yaml`, you can run the following command to register this cluster:
-->
假设您的 YAML 文件位于 `/cluster1/cluster.yaml`，可以运行以下命令来注册此集群：

<!-- TODO(madhusudancs): Make the kubeconfig context configurable with default set to `federation` -->
```shell
$ kubectl create -f /cluster1/cluster.yaml --context=federation-cluster

```

<!--
By specifying `--context=federation-cluster`, you direct the request to
federation apiserver. You can ensure that the cluster registration was
successful by running:
-->
通过指定 `--context=federation-cluster`，您将请求发送到联邦 apiserver。通过运行以下命令，可以确定集群注册是否成功：

```shell
$ kubectl get clusters --context=federation-cluster
NAME       STATUS    VERSION   AGE
cluster1   Ready               3m
```

<!--
## Updating KubeDNS
-->
## 更新 KubeDNS

<!--
Once you've registered your cluster with the federation, you'll need to update KubeDNS so that your cluster can route federation service requests. The update method varies depending on your Kubernetes version; on Kubernetes 1.5 or later, you must pass the
`--federations` flag to kube-dns via the kube-dns config map. In version 1.4 or earlier, you must set the `--federations` flag directly on kube-dns-rc on other clusters.
-->
向联邦注册集群后，您需要更新 KubeDNS，以便您的集群可以路由联邦服务请求。更新方法根据您的 Kubernetes 版本而有所不同：在 Kubernetes 1.5 或更高版本上，您必须通过 kube-dns 配置映射 将 `--federations` 标志传递到 kube-dns 中；在 1.4 或者更早的版本，则必须直接在其他集群的 kube-dns-rc 上设置 `--federations` 标志。

<!--
### Kubernetes 1.5+: Passing federations flag via config map to kube-dns
-->
### Kubernetes 1.5+：通过配置映射（config map）传递 federations 标志到 kube-dns 中

<!--
For Kubernetes clusters of version 1.5+, you can pass the
`--federations` flag to kube-dns via the kube-dns config map.
The flag uses the following format:
-->
对于 1.5+ 版本的 Kubernetes 集群，可以通过 kube-dns 配置映射将 `--federations` 标志传递到 kube-dns 中。标志使用以下格式：

```
--federations=${FEDERATION_NAME}=${DNS_DOMAIN_NAME}
```

<!--
To pass this flag to KubeDNS, create a config-map with name `kube-dns` in
namespace `kube-system`. The configmap should look like the following:
-->
若要将此标志传递给 KubeDNS，请在命名空间 `kube-system` 下创建名称为 `kube-dns` 的 config-map。config-map 应该如下所示：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  federations: <federation-name>=<federation-domain-name>
```

<!--
where `<federation-name>` should be replaced by the name you want to give to your
federation, and
`federation-domain-name` should be replaced by the domain name you want to use
in your federation DNS.
-->
这里的 `<federation-name>` 应该使用您想要给您的联邦取的名字代替，`federation-domain-name` 则应该被您想要在联邦 DNS 中使用的域名代替。

<!--
You can find more details about config maps in general at
[config map](/docs/tasks/configure-pod-container/configmap/).
-->
您可以在 [配置映射](/docs/tasks/configure-pod-container/configmap/) 找到有关配置映射的更多详细信息。

<!--
### Kubernetes 1.4 and earlier: Setting federations flag on kube-dns-rc
-->
### Kubernetes 1.4 及更早版本：在 kube-dns-rc 上设置联邦标志

<!--
If your cluster is running Kubernetes version 1.4 or earlier, you must restart
KubeDNS and pass it a `--federations` flag, which tells it about valid federation DNS hostnames.
The flag uses the following format:
-->
如果您的集群运行的是 Kubernetes 1.4 或更早的版本，则必须重新启动 KubeDNS，并传递给它一个 `--federations` 标志，该标志告诉它有效的联邦 DNS 主机名。标志使用以下格式：

```
--federations=${FEDERATION_NAME}=${DNS_DOMAIN_NAME}
```

<!--
To update KubeDNS with the `--federations` flag, you can edit the existing kubedns replication controller to
include that flag in pod template spec, and then delete the existing pod. The replication controller then
recreates the pod with updated template.
-->
若要使用 `--federations` 标志更新 KubeDNS，可以编辑现有的 kubedns replication controller（rc 副本控制器），在 pod 模板的 spec 中包含它，然后删除现有的 pod。之后，replication controller 就会使用更新后的模板重新创建 pod。

<!--
To find the name of existing kubedns replication controller, run the following command:
-->
若要查找现有 kubedns replication controller 的名称，请运行以下命令：

```shell
$ kubectl get rc --namespace=kube-system
```

<!--
You should see a list of all the replication controllers on the cluster. The kube-dns replication
controller should have a name similar to `kube-dns-v18`. To edit the replication controller, specify it by name as follows:
-->
您应该会看到集群上所有 replication controller 的列表。kube-dns replication controller 应该有一个类似于 `kube-dns-v18` 一样的名称。若要编辑 replication controller，请按名称指定它，如下所示：

```shell
$ kubectl edit rc <rc-name> --namespace=kube-system
```
<!--
In the resulting YAML file for the kube-dns replication controller, add the `--federations` flag as an argument to kube-dns container.
-->
在 kube-dns replication controller 的最终 YAML 文件中，将 `--federations` 标志作为参数添加到 kube-dns 容器中。

<!--
Then, you must delete the existing kube dns pod. You can find the pod by running:
-->
然后，您必须删除现有的 kube-dns pod。可以先通过运行下面命令找到 pod：

```shell
$ kubectl get pods --namespace=kube-system
```

<!--
And then delete the appropriate pod by running:
-->
然后通过运行以下命令删除该 pod：

```shell
$ kubectl delete pods <pod-name> --namespace=kube-system
```

<!--
Once you've completed the kube-dns configuration, your federation is ready for use.
-->
一旦完成了 kube-dns 配置，您的联邦就可以使用了。

<!--
## Turn down
-->
## 卸载

<!--
In order to turn the federation control plane down run the following
command:
-->
为了将联邦控制平面卸载，请运行以下命令：

```shell
$ federation/deploy/deploy.sh destroy_federation
```

<!--
## Previous Federation turn up mechanism
-->
## 以前的联邦创建机制

<!--
This describes the previous mechanism we had to turn up Kubernetes Cluster
Federation. It is recommended to use the new turn up mechanism. If you would
like to use this mechanism instead of the new one, please let us know
why the new mechanism doesn't work for your case by filing an issue here -
[https://github.com/kubernetes/kubernetes/issues/new](https://github.com/kubernetes/kubernetes/issues/new)
-->
这里描述了以前创建 Kubernetes 集群联邦的机制。建议使用新的创建机制。如果您愿意想用这个机制代替新的，请在 [https://github.com/kubernetes/kubernetes/issues/new](https://github.com/kubernetes/kubernetes/issues/new) 提一个 issue 告诉我们为什么新的机制在您的使用中不起作用。

<!--
### Getting images
-->
### 获取镜像

<!--
To run these as pods, you first need images for all the components. You can use
official release images or you can build from HEAD.
-->
要将它们作为 pod 运行，首先需要所有组件的镜像。你可以使用官方发布的镜像，也可以从头构建。

<!--
#### Using official release images
-->
#### 使用官方发布的镜像

<!--
As part of every release, images are pushed to `k8s.gcr.io`. To use
these images, set env var `FEDERATION_PUSH_REPO_BASE=k8s.gcr.io`
This will always use the latest image.
To use the hyperkube image which includes federation-apiserver and
federation-controller-manager from a specific release, set the
`FEDERATION_IMAGE_TAG` environment variable.
-->
作为每个 Kubernetes 版本发布的一部分，官方发布镜像将推送到 `k8s.gcr.io` 仓库中。要使用这些镜像，请设置环境变量 `FEDERATION_PUSH_REPO_BASE=k8s.gcr.io`，它将一直使用最新的镜像。若要使用来自特定发行版的 hyperkube 镜像（包含 federation-apiserver 和
federation-controller-manager），请设置环境变量 `FEDERATION_IMAGE_TAG`。

<!--
#### Building and pushing images from HEAD
-->
#### 从头构建和推送镜像

<!--
To run the code from HEAD, you need to build and push your own images.
You can build the images using the following command:
-->
要从头运行代码来构建和推送自己的镜像。您可以使用以下命令构建镜像：

```shell
$ FEDERATION=true KUBE_RELEASE_RUN_TESTS=n make quick-release
```

<!--
Next, you need to push these images to a registry such as Google Container Registry or Docker Hub, so that your cluster can pull them.
If Kubernetes cluster is running on Google Compute Engine (GCE), then you can push the images to `gcr.io/<gce-project-name>`.
The command to push the images will look like:
-->
接下来，您需要将这些镜像推送到注册表中，如 Google Container Registry 或者 Docker Hub，这样集群就可以拉取它们。如果 Kubernetes 集群运行在 Google Compute Engine（GCE）上，那么您可以将镜像推送到 `gcr.io/<gce-project-name>`。推送镜像的命令如下所示：

```shell
$ FEDERATION=true FEDERATION_PUSH_REPO_BASE=gcr.io/<gce-project-name> ./build/push-federation-images.sh
```

<!--
### Running the federation control plane
-->
### 运行联邦控制平面

<!--
Once you have the images, you can run these as pods on your existing kubernetes cluster.
The command to run these pods on an existing GCE cluster will look like:
-->
一旦有了镜像，你就可以在现有的集群上以 pod 的方式运行。在现有 GCE 集群上运行这些 pod 的命令如下所示：

```shell
$ KUBERNETES_PROVIDER=gce FEDERATION_DNS_PROVIDER=google-clouddns FEDERATION_NAME=myfederation DNS_ZONE_NAME=myfederation.example FEDERATION_PUSH_REPO_BASE=k8s.gcr.io ./federation/cluster/federation-up.sh
```

<!--
`KUBERNETES_PROVIDER` is the cloud provider.
-->
`KUBERNETES_PROVIDER` 是云服务提供商。

<!--
`FEDERATION_DNS_PROVIDER` can be `google-clouddns` or `aws-route53`. It will be
set appropriately if it is missing and `KUBERNETES_PROVIDER` is one of `gce`, `gke` and `aws`.
This is used to resolve DNS requests for federation services. The service
controller keeps DNS records with the provider updated as services/pods are
updated in underlying Kubernetes clusters.
-->
`FEDERATION_DNS_PROVIDER` 可以是 `google-clouddns` 或者 `aws-route53`。如果它没有值，需要使用适当的值对它进行设置。`KUBERNETES_PROVIDER` 是 `gce`，`gke` 和 `aws` 当中的一个，它用于解析联邦服务的 dns 请求。服务控制器在底层 Kubernetes 集群中更新 service/pod 时，为提供者保存 DNS 记录。

<!--
`FEDERATION_NAME` is a name you can choose for your federation. This is the name that will appear in DNS routes.
-->
`FEDERATION_NAME` 是一个您可以为联邦选择的名字。这是 DNS 路由中将出现的名称。

<!--
`DNS_ZONE_NAME` is the domain to be used for DNS records. This is a domain that you
need to buy and then configure it such that DNS queries for that domain are
routed to the appropriate provider as per `FEDERATION_DNS_PROVIDER`.
-->
‘DNS_zone_NAME’ 是用于 DNS 记录的域。您需要购买这样一个域，然后对其进行配置，以便按照 `FEDERATION_DNS_PROVIDER` 将该域的 DNS 查询路由到适当的提供商。

<!--
Running that command creates a namespace `federation` and creates 2 deployments: `federation-apiserver` and `federation-controller-manager`.
You can verify that the pods are available by running the following command:
-->
运行这些命令将创建一个命名空间 `federation`，并创建两个 deployment：`federation-apiserver` 和 `federation-controller-manager`。您可以通过运行以下命令来验证 pod 是否可用：

```shell
$ kubectl get deployments --namespace=federation
NAME                            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
federation-apiserver            1         1         1            1           1m
federation-controller-manager   1         1         1            1           1m
```

<!--
Running `federation-up.sh` also creates a new record in your kubeconfig for us
to be able to talk to federation apiserver. You can view this by running
`kubectl config view`.
-->
运行 `federation-up.sh` 也会在您的 kubeconfig 中创建一个新的记录，用于跟联邦 apiserver 通信。您可以运行 `kubectl config view` 进行查看。

<!--
Note: `federation-up.sh` creates the federation-apiserver pod with an etcd
container that is backed by a persistent volume, so as to persist data. This
currently works only on AWS, Google Kubernetes Engine, and GCE.  You can edit
`federation/manifests/federation-apiserver-deployment.yaml` to suit your needs,
if required.
-->
注：`federation-up.sh` 创建一个 federation-apiserver pod，它包含一个由持久卷（PV persistent volume）支持的 etcd 容器，用来持久化数据。目前，它仅能在 AWS，Google Kubernetes Engine 以及 GCE 上工作。如果需要的话，您可以编辑 `federation/manifests/federation-apiserver-deployment.yaml`，以满足您的需要。


<!--
## For more information

 * [Federation proposal](https://git.k8s.io/community/contributors/design-proposals/multicluster/federation.md) details use cases that motivated this work.
-->
## 更多信息

 * [联邦提议](https://git.k8s.io/community/contributors/design-proposals/multicluster/federation.md) 推动这项工作的详细用例。
