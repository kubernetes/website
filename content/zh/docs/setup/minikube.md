---
reviewers:
- dlorenc
- balopat
- aaron-prindle
title: 使用 Minikube 在本地运行 Kubernetes
content_template: templates/concept
---
<!--
---
reviewers:
- dlorenc
- balopat
- aaron-prindle
title: Running Kubernetes Locally via Minikube
content_template: templates/concept
---
-->

{{% capture overview %}}

<!--
Minikube is a tool that makes it easy to run Kubernetes locally. Minikube runs a single-node Kubernetes cluster inside a VM on your laptop for users looking to try out Kubernetes or develop with it day-to-day.
-->
Minikube 是一个可以在本地轻松运行 Kubernetes 的工具。Minikube 在笔记本电脑的虚拟机中运行单节点 Kubernetes 集群，供那些希望尝试 Kubernetes 或对 Kubernetes 进行日常开发的用户使用。

{{% /capture %}}

{{% capture body %}}

<!--
## Minikube Features
-->
## Minikube 的特性

<!--
* Minikube supports Kubernetes features such as:
  * DNS
  * NodePorts
  * ConfigMaps and Secrets
  * Dashboards
  * Container Runtime: Docker, [rkt](https://github.com/rkt/rkt), [CRI-O](https://github.com/kubernetes-incubator/cri-o) and [containerd](https://github.com/containerd/containerd)
  * Enabling CNI (Container Network Interface)
  * Ingress
-->

* Minikube 支持的 Kubernetes 特性如下：
  * DNS
  * NodePorts
  * ConfigMaps 和 Secrets
  * Dashboards
  * 容器运行时: Docker, [rkt](https://github.com/rkt/rkt), [CRI-O](https://github.com/kubernetes-incubator/cri-o) 和 [containerd](https://github.com/containerd/containerd)
  * 启用 CNI (Container Network Interface)
  * Ingress

<!--
## Installation

See [Installing Minikube](/docs/tasks/tools/install-minikube/).
-->

## 安装

查看 [安装 Minikube](/docs/tasks/tools/install-minikube/)。

<!--
## Quickstart

Here's a brief demo of Minikube usage.
If you want to change the VM driver add the appropriate `--vm-driver=xxx` flag to `minikube start`. Minikube supports
the following drivers:
-->
## 快速入门

下面是 Minikube 用法的简单示例。
如果您想要更改 VM 驱动，可以添加合适的 `--vm-driver=xxx` 到 `minikube start` 命令。Minikube 支持下面的驱动：

* virtualbox
* vmwarefusion
* kvm2 ([安装驱动](https://git.k8s.io/minikube/docs/drivers.md#kvm2-driver))
* kvm ([安装驱动](https://git.k8s.io/minikube/docs/drivers.md#kvm-driver))
* hyperkit ([安装驱动](https://git.k8s.io/minikube/docs/drivers.md#hyperkit-driver))
* xhyve ([安装驱动](https://git.k8s.io/minikube/docs/drivers.md#xhyve-driver)) (deprecated)

<!--
Note that the IP below is dynamic and can change. It can be retrieved with `minikube ip`.
-->

注意下面的 IP 是动态的、可能不同的。它可以通过 `minikube ip` 获取。

```shell
$ minikube start
Starting local Kubernetes cluster...
Running pre-create checks...
Creating machine...
Starting local Kubernetes cluster...

$ kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.10 --port=8080
deployment.apps/hello-minikube created
$ kubectl expose deployment hello-minikube --type=NodePort
service/hello-minikube exposed

# 现在我们启动了一个 echoserver pod，但是必须等待这个 pod 启动成功后才可以通过暴露的服务对它进行访问。
# 要检查这个 pod 是否启动并运行，我们可以使用下面的命令：

$ kubectl get pod
NAME                              READY     STATUS              RESTARTS   AGE
hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s

# 我们可以从 ContainerCreating 的状态得知，这个 pod 仍然处于创建中。
$ kubectl get pod
NAME                              READY     STATUS    RESTARTS   AGE
hello-minikube-3383150820-vctvh   1/1       Running   0          13s

# 我们可以看到这个 pod 现在处于 Running 状态，我们可以对它执行 curl:
$ curl $(minikube service hello-minikube --url)


Hostname: hello-minikube-7c77b68cff-8wdzq

Pod Information:
	-no pod information available-

Server values:
	server_version=nginx: 1.13.3 - lua: 10008

Request Information:
	client_address=172.17.0.1
	method=GET
	real path=/
	query=
	request_version=1.1
	request_scheme=http
	request_uri=http://192.168.99.100:8080/

Request Headers:
	accept=*/*
	host=192.168.99.100:30674
	user-agent=curl/7.47.0

Request Body:
	-no body in request-


$ kubectl delete services hello-minikube
service "hello-minikube" deleted
$ kubectl delete deployment hello-minikube
deployment.extensions "hello-minikube" deleted
$ minikube stop
Stopping local Kubernetes cluster...
Stopping "minikube"...
```

<!--
### Alternative Container Runtimes
-->
### 其他容器运行时

#### containerd

<!--
To use [containerd](https://github.com/containerd/containerd) as the container runtime, run:
-->
要使用 [containerd](https://github.com/containerd/containerd) 作为容器运行时，运行：

```bash
$ minikube start \
    --network-plugin=cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

<!--
Or you can use the extended version:
-->
或者您可以使用命令的扩展版本：

```bash
$ minikube start \
    --network-plugin=cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```

#### CRI-O

<!--
To use [CRI-O](https://github.com/kubernetes-incubator/cri-o) as the container runtime, run:
-->
要使用 [CRI-O](https://github.com/kubernetes-incubator/cri-o) 作为容器运行时，运行：

```bash
$ minikube start \
    --network-plugin=cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```

<!--
Or you can use the extended version:
-->
或者您可以使用命令的扩展版本：

```bash
$ minikube start \
    --network-plugin=cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```

#### rkt container engine

<!--
To use [rkt](https://github.com/rkt/rkt) as the container runtime run:
-->
要使用 [rkt](https://github.com/rkt/rkt) 作为容器的运行时，运行：

```shell
$ minikube start \
    --network-plugin=cni \
    --container-runtime=rkt
```
<!--
This will use an alternative minikube ISO image containing both rkt, and Docker, and enable CNI networking.
-->
这将使用包含 rkt 和 Docker 的替代 minikube ISO 映像，并启用 CNI 网络。

<!--
### Driver plugins
-->
### 驱动插件

<!--
See [DRIVERS](https://git.k8s.io/minikube/docs/drivers.md) for details on supported drivers and how to install
plugins, if required.
-->
如有需要，可以查看 [驱动](https://git.k8s.io/minikube/docs/drivers.md) 查阅支持的驱动的细节和如何安装插件。

<!--
### Use local images by re-using the Docker daemon
-->
### 通过重用 Docker daemon 来使用本地镜像

<!--
When using a single VM of Kubernetes, it's really handy to reuse the Minikube's built-in Docker daemon; as this means you don't have to build a docker registry on your host machine and push the image into it - you can just build inside the same docker daemon as minikube which speeds up local experiments. Just make sure you tag your Docker image with something other than 'latest' and use that tag while you pull the image. Otherwise, if you do not specify version of your image, it will be assumed as `:latest`, with pull image policy of `Always` correspondingly, which may eventually result in `ErrImagePull` as you may not have any versions of your Docker image out there in the default docker registry (usually DockerHub) yet.
-->
当使用只有单个 VM 的 Kubernetes 集群时，重用 Minikube 的内置 Docker daemon 非常方便; 因为这意味着您不必在宿主机上构建 docker regitstry 并将镜像 push 进去 - 您可以在与 minikube 相同的 docker daemon 内部构建，从而加速本地实验。只需确保使用 'latest' 之外的其他标签标记 Docker 镜像，并在拉取镜像时使用该标签。否则，如果你没有指定镜像的版本，它将被假定为`：latest`，相应的拉取镜像策略为 `Always`，最终可能导致 `ErrImagePull`，因为您可能在默认的 docker registry（通常是 DockerHub ）中还没有任何版本的镜像。


<!--
To be able to work with the docker daemon on your mac/linux host use the `docker-env command` in your shell:
-->
为了能够在 mac/linux 主机上使用 docker daemon，请在 shell 中使用 `docker-env command`：

```shell
eval $(minikube docker-env)
```

<!--
You should now be able to use docker on the command line on your host mac/linux machine talking to the docker daemon inside the minikube VM:
-->
现在您应该可以在您的 mac/linux 主机上使用 docker 命令与 minikube VM 中的 docker daemon 进行通信了：

```shell
docker ps
```

<!--
On Centos 7, docker may report the following error:
-->
在 Centos 7 操作系统上，docker 可能报出下面的错误：

```shell
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

<!--
The fix is to update /etc/sysconfig/docker to ensure that Minikube's environment changes are respected:
-->
修复办法是更新 /etc/sysconfig/docker，确保 Minikube 的环境变量的变化和预期一致：

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```

<!--
Remember to turn off the imagePullPolicy:Always, otherwise Kubernetes won't use images you built locally.
-->
记得关闭 imagePullPolicy:Always，否则 Kubernetes 不会使用您在本地构建的镜像。

<!--
## Managing your Cluster

### Starting a Cluster
-->
## 管理您的集群

### 启动一个集群

<!--
The `minikube start` command can be used to start your cluster.
This command creates and configures a Virtual Machine that runs a single-node Kubernetes cluster.
This command also configures your [kubectl](/docs/user-guide/kubectl-overview/) installation to communicate with this cluster.

If you are behind a web proxy, you will need to pass this information to the `minikube start` command:
-->
`minikube start` 命令可以用来启动您的集群。
这个命令会创建和配置一个虚拟机，里面运行了一个单节点的 Kubernetes 集群。
这个命令也会安装 [kubectl](/docs/user-guide/kubectl-overview/) 用于和集群进行通信。

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```

<!--
Unfortunately just setting the environment variables will not work.

Minikube will also create a "minikube" context, and set it to default in kubectl.
To switch back to this context later, run this command: `kubectl config use-context minikube`.
-->
不幸的是，仅仅设置环境变量是不够的。

Minikube 也会创建 "minikube" context，并且在 kubectl 把它设置为默认值。
运行这个命令 `kubectl config use-context minikube` 可以再切换到这个 context。

<!--
#### Specifying the Kubernetes version
-->
#### 指定 Kubernetes 版本

<!--
You can specify the specific version of Kubernetes for Minikube to use by
adding the `--kubernetes-version` string to the `minikube start` command. For
example, to run version `v1.7.3`, you would run the following:
-->
您可以使用 `minikube start` 命令时，添加 `--kubernetes-version` 参数来指定 Minikube 的 Kubernetes 版本。例如，如果要运行 `v1.7.3` 版本，可以运行下面的命令：

```
minikube start --kubernetes-version v1.7.3
```

<!--
### Configuring Kubernetes
-->
### 配置 Kubernetes

<!--
Minikube has a "configurator" feature that allows users to configure the Kubernetes components with arbitrary values.
To use this feature, you can use the `--extra-config` flag on the `minikube start` command.

This flag is repeated, so you can pass it several times with several different values to set multiple options.

This flag takes a string of the form `component.key=value`, where `component` is one of the strings from the below list, `key` is a value on the
configuration struct and `value` is the value to set.

Valid keys can be found by examining the documentation for the Kubernetes `componentconfigs` for each component.
Here is the documentation for each supported configuration:
-->
Minikube 有一个 "配置器" 特性，允许用户为 Kubernetes 组件配置任意值。要使用这个特性，您可以在使用 `minikube start` 时加上 `--extra-config` 参数。

这个参数是可以重复的，所以您可以多次使用不同的值设置不同的选项。

这个参数采用 `component.key=value` 形式的字符串，其中 `component` 是下面列表中的字符串，`key` 是配置结构的值，`value` 是配置项要设置的值。

通过检查每个组件的 Kubernetes `componentconfigs` 文档，可以找到有效的键值。

以下是每个支持配置的文档：

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

<!--
#### Examples

To change the `MaxPods` setting to 5 on the Kubelet, pass this flag: `--extra-config=kubelet.MaxPods=5`.

This feature also supports nested structs. To change the `LeaderElection.LeaderElect` setting to `true` on the scheduler, pass this flag: `--extra-config=scheduler.LeaderElection.LeaderElect=true`.

To set the `AuthorizationMode` on the `apiserver` to `RBAC`, you can use: `--extra-config=apiserver.authorization-mode=RBAC`.
-->
#### 示例

要在 Kubelet 上将 `MaxPods` 设置更改为 5，请传递此参数：`--extra-config=kubelet.MaxPods=5`。

这个特性也支持嵌套结构。要把调度器的 `LeaderElection.LeaderElect` 设置为 `true`，传递这个参数 `--extra-config=scheduler.LeaderElection.LeaderElect=true`。

<!--
### Stopping a Cluster
The `minikube stop` command can be used to stop your cluster.
This command shuts down the Minikube Virtual Machine, but preserves all cluster state and data.
Starting the cluster again will restore it to it's previous state.
-->
### 停止集群
可以使用 `minikube stop` 命令来停止您的集群。这个命令会停止 Minikube 虚拟机，但是保留了集群里的所有状态和数据。重新启动这个集群会恢复到之前的状态。

<!--
### Deleting a Cluster
The `minikube delete` command can be used to delete your cluster.
This command shuts down and deletes the Minikube Virtual Machine. No data or state is preserved.
-->
### 删除集群
可以使用 `minikube delete` 命令来删除您的集群。
这个命令会停止和删除 Minikube 虚拟机。不会保留任何数据和状态。

<!--
## Interacting with Your Cluster

### Kubectl

The `minikube start` command creates a [kubectl context](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-) called "minikube".
This context contains the configuration to communicate with your Minikube cluster.

Minikube sets this context to default automatically, but if you need to switch back to it in the future, run:

`kubectl config use-context minikube`,

Or pass the context on each command like this: `kubectl get pods --context=minikube`.
-->
## 和您的集群进行交互

### Kubectl

`minikube start` 命令会创建一个叫做 "minikube"的 [kubectl 上下文](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-)。这个上下文包含了与您的 Minikube 集群进行通信的配置信息。

Minikube 会自动将这个上下文设为默认值，如果您将来需要将它切回，运行：

`kubectl config use-context minikube`，

或者像这样在每个命令中传递这个上下文：`kubectl get pods --context=minikube`。

<!--
### Dashboard

To access the [Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/), run this command in a shell after starting Minikube to get the address:

```shell
minikube dashboard
```
-->
### Dashboard

要访问 [Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/)，在启动 Minikube 后在 shell 中执行此命令来获取访问地址：

```shell
minikube dashboard
```

<!--
### Services

To access a service exposed via a node port, run this command in a shell after starting Minikube to get the address:

```shell
minikube service [-n NAMESPACE] [--url] NAME
```
-->
### Services

要访问通过 node port 暴露的 service，在启动 Minikube 后在 shell 中执行此命令来获取访问地址：

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

<!--
## Networking

The Minikube VM is exposed to the host system via a host-only IP address, that can be obtained with the `minikube ip` command.
Any services of type `NodePort` can be accessed over that IP address, on the NodePort.

To determine the NodePort for your service, you can use a `kubectl` command like this:

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`
-->
## 网络

Minikube VM 通过一个 host-only IP 地址暴露给宿主机，这个 IP 可以通过 `minikube ip` 命令获取。任何的 `NodePort` 类型的 service 可以通过这个 IP 在 NodePort 上来访问。

要确定服务的 NodePort，您可以使用这样的 `kubectl` 命令：

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

<!--
## Persistent Volumes
Minikube supports [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) of type `hostPath`.
These PersistentVolumes are mapped to a directory inside the Minikube VM.

The Minikube VM boots into a tmpfs, so most directories will not be persisted across reboots (`minikube stop`).
However, Minikube is configured to persist files stored under the following host directories:
-->
## Persistent Volumes
Minikube 支持 `hostPath` 类型的 [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)。
这些 PersistentVolumes 被映射到 Minikube VM 里的目录中。



* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`
<!--
Here is an example PersistentVolume config to persist data in the `/data` directory:
-->
下面是一个将数据永久存储在 `/data` 的 PersistentVolume 配置示例：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

<!--
## Mounted Host Folders
Some drivers will mount a host folder within the VM so that you can easily share files between the VM and host.  These are not configurable at the moment and different for the driver and OS you are using.

{{< note >}}
Host folder sharing is not implemented in the KVM driver yet.
{{< /note >}}

| Driver | OS | HostFolder | VM |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /Users |
| Xhyve | macOS | /Users | /Users |
-->
## 挂载宿主机的目录
一些驱动会在 VM 内挂载宿主机的目录，以便可以在 VM 和宿主机方便的共享文件。目前这些是不可配置的，而且根据您使用的 OS 和驱动而有所不同。

{{< note >}}
<!--
Host folder sharing is not implemented in the KVM driver yet.
-->
目前 KVM 驱动尚未实现宿主机目录共享。
{{< /note >}}

| Driver | OS | HostFolder | VM |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /Users |
| Xhyve | macOS | /Users | /Users |

<!--
## Private Container Registries

To access a private container registry, follow the steps on [this page](/docs/concepts/containers/images/).

We recommend you use `ImagePullSecrets`, but if you would like to configure access on the Minikube VM you can place the `.dockercfg` in the `/home/docker` directory or the `config.json` in the `/home/docker/.docker` directory.
-->
## 私有镜像仓库

要访问私有镜像仓库，请按照 [这个页面](/docs/concepts/containers/images/) 的步骤进行操作。

我们推荐您使用 `ImagePullSecrets`，但是如果您想要配置在 Minikube VM 上能够访问，您可以把 `.dockercfg` 放在 `/home/docker` 目录或者把 `config.json` 放在 `/home/docker/.docker` 目录下。

<!--
## Add-ons

In order to have Minikube properly start or restart custom addons,
place the addons you wish to be launched with Minikube in the `~/.minikube/addons`
directory. Addons in this folder will be moved to the Minikube VM and
launched each time Minikube is started or restarted.
-->
## 插件

为了能让 Minikube 能够正常地启动或者重启自定义插件，请把您要在 Minikube 里启动的插件放在 `~/.minikube/addons` 目录。在这个目录中的插件会被移动到 Minikube VM 中，并且在 Minikube 每次启动或者重启时启动。

<!--
## Using Minikube with an HTTP Proxy

Minikube creates a Virtual Machine that includes Kubernetes and a Docker daemon.
When Kubernetes attempts to schedule containers using Docker, the Docker daemon may require external network access to pull containers.

If you are behind an HTTP proxy, you may need to supply Docker with the proxy settings.
To do this, pass the required environment variables as flags during `minikube start`.

For example:

```shell
$ minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

If your Virtual Machine address is 192.168.99.100, then chances are your proxy settings will prevent `kubectl` from directly reaching it.
To by-pass proxy configuration for this IP address, you should modify your no_proxy settings. You can do so with:

```shell
$ export no_proxy=$no_proxy,$(minikube ip)
```
-->
## 在 Minikube 中使用 HTTP 代理

Minikube 创建了一个包含了 Kubernetes 和 Docker daemon 的虚拟机。当 Kubernetes 尝试使用 Docker 调度容器时，Docker daemon 可能需要访问外部网络来拉取容器。

如果您通过 HTTP 代理访问，您可能要设置 Docker 的代理配置。
通过在运行 `minikube start` 时传入需要的环境变量来实现这个配置。

例如：

```shell
$ minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

如果您的虚拟机地址是 192.168.99.100，那么您的代理设置可能会阻止 `kubectl` 直接访问它。

要绕过此 IP 地址的代理配置，您应该修改 no_proxy 设置。您可以这样做：

```shell
$ export no_proxy=$no_proxy,$(minikube ip)
```

<!--
## Known Issues
* Features that require a Cloud Provider will not work in Minikube. These include:
  * LoadBalancers
* Features that require multiple nodes. These include:
  * Advanced scheduling policies
-->
## 已知问题
* 需要 Cloud Provider 的特性在 Minikube 不能工作。这些特性包括：
  * LoadBalancer
* 需要多个节点的特性 Minikube 也不支持。包括：
  * 高级调度策略
<!--
## Design

Minikube uses [libmachine](https://github.com/docker/machine/tree/master/libmachine) for provisioning VMs, and [kubeadm](https://github.com/kubernetes/kubeadm) to provision a Kubernetes cluster.

For more information about Minikube, see the [proposal](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).
-->
## 设计

Minikube 使用 [libmachine](https://github.com/docker/machine/tree/master/libmachine) 来提供虚拟机，使用 [kubeadm](https://github.com/kubernetes/kubeadm) 来提供 Kubernetes 集群。

想要了解更多 Minikube 的信息，查看 [提议](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md)。



<!--
## Additional Links

* **Goals and Non-Goals**: For the goals and non-goals of the Minikube project, please see our [roadmap](https://git.k8s.io/minikube/docs/contributors/roadmap.md).
* **Development Guide**: See [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) for an overview of how to send pull requests.
* **Building Minikube**: For instructions on how to build/test Minikube from source, see the [build guide](https://git.k8s.io/minikube/docs/contributors/build_guide.md).
* **Adding a New Dependency**: For instructions on how to add a new dependency to Minikube see the [adding dependencies guide](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md).
* **Adding a New Addon**: For instruction on how to add a new addon for Minikube see the [adding an addon guide](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md).
* **Updating Kubernetes**: For instructions on how to update Kubernetes see the [updating Kubernetes guide](https://git.k8s.io/minikube/docs/contributors/updating_kubernetes.md).
-->
## 其他链接

* **目标和非目标**: 对于 Minikube 项目的目标和非目标, 请查看我们的 [路线图](https://git.k8s.io/minikube/docs/contributors/roadmap.md)。
* **开发指南**: 查看 [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) 来了解如果发起 pull requests。
* **编译 Minikube**: 有关如何从源代码构建/测试 Minikube 的说明，请查看 [编译指南](https://git.k8s.io/minikube/docs/contributors/build_guide.md)。
* **添加新的依赖**: 有关如何向 Minikube 添加新依赖项的说明，查看 [添加依赖指南](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md)。
* **添加新的组件**: 有关如何为 Minikube 添加新插件的说明，查看 [添加插件指南](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md)。
* **更新 Kubernetes**: 有关如何更新 Kubernetes 的说明，查看 [更新 Kubernetes 指南](https://git.k8s.io/minikube/docs/contributors/updating_kubernetes.md)。

<!--
## Community

Contributions, questions, and comments are all welcomed and encouraged! Minikube developers hang out on [Slack](https://kubernetes.slack.com) in the #minikube channel (get an invitation [here](http://slack.kubernetes.io/)). We also have the [kubernetes-dev Google Groups mailing list](https://groups.google.com/forum/#!forum/kubernetes-dev). If you are posting to the list please prefix your subject with "minikube: ".
-->
## 社区

我们欢迎和鼓励所有的贡献、问题和评论！Minikube 开发者在 [Slack]（https://kubernetes.slack.com）上 #minikube 频道闲逛（获得邀请[这里](http://slack.kubernetes.io/)）。我们还有[kubernetes-dev Google Groups邮件列表]（https://groups.google.com/forum/#!forum/kubernetes-dev）。如果您要发布到列表中，请在主题前加上"minikube："
{{% /capture %}}