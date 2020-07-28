---
title: 使用 Minikube 安装 Kubernetes
content_type: concept
---
<!--
---
reviewers:
- dlorenc
- balopat
- aaron-prindle
title: Installing Kubernetes with Minikube
content_type: concept
---
-->

<!-- overview -->

<!--
Minikube is a tool that makes it easy to run Kubernetes locally. Minikube runs a single-node Kubernetes cluster inside a Virtual Machine (VM) on your laptop for users looking to try out Kubernetes or develop with it day-to-day.
-->
Minikube 是一种可以让您在本地轻松运行 Kubernetes 的工具。Minikube 在笔记本电脑上的虚拟机（VM）中运行单节点 Kubernetes 集群，供那些希望尝试 Kubernetes 或进行日常开发的用户使用。



<!-- body -->

<!--
## Minikube Features
-->
## Minikube 功能

<!--
Minikube supports the following Kubernetes features:
-->
Minikube 支持以下 Kubernetes 功能：

<!--
* DNS
* NodePorts
* ConfigMaps and Secrets
* Dashboards
* Container Runtime: Docker, [CRI-O](https://github.com/kubernetes-incubator/cri-o), and [containerd](https://github.com/containerd/containerd)
* Enabling CNI (Container Network Interface)
* Ingress
-->

* DNS
* NodePorts
* ConfigMaps 和 Secrets
* Dashboards
* 容器运行时: Docker、[CRI-O](https://github.com/kubernetes-incubator/cri-o) 以及 [containerd](https://github.com/containerd/containerd)
* 启用 CNI （容器网络接口）
* Ingress

<!--
## Installation
-->
## 安装

<!--
See [Installing Minikube](/docs/tasks/tools/install-minikube/).
-->
请参阅[安装 Minikube](/zh/docs/tasks/tools/install-minikube/)。

<!--
## Quickstart
-->
## 快速开始

<!--
This brief demo guides you on how to start, use, and delete Minikube locally. Follow the steps given below to start and explore Minikube.
-->
这个简短的演示将指导您如何在本地启动、使用和删除 Minikube。请按照以下步骤开始探索 Minikube。

<!--
1. Start Minikube and create a cluster:
-->
1. 启动 Minikube 并创建一个集群：

    ```shell
    minikube start
    ```
    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
    Starting local Kubernetes cluster...
    Running pre-create checks...
    Creating machine...
    Starting local Kubernetes cluster...
    ```

    <!--
    For more information on starting your cluster on a specific Kubernetes version, VM, or container runtime, see [Starting a Cluster](#starting-a-cluster).
    -->

    有关使用特定 Kubernetes 版本、VM 或容器运行时启动集群的详细信息，请参阅[启动集群](#starting-a-cluster)。

2. 现在，您可以使用 kubectl 与集群进行交互。有关详细信息，请参阅[与集群交互](#interacting-with-your-cluster)。

    <!--
    Now, you can interact with your cluster using kubectl. For more information, see [Interacting with Your Cluster](#interacting-with-your-cluster).
    -->

    <!--
    Let’s create a Kubernetes Deployment using an existing image named `echoserver`, which is a simple HTTP server and expose it on port 8080 using `--port`.
    -->
    让我们使用名为 `echoserver` 的镜像创建一个 Kubernetes Deployment，并使用 `--port` 在端口 8080 上暴露服务。`echoserver` 是一个简单的 HTTP 服务器。

    ```shell
    kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.10
    ```
    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
    deployment.apps/hello-minikube created
    ```

3. 要访问 `hello-minikube` Deployment，需要将其作为 Service 公开：

    <!--
    To access the `hello-minikube` Deployment, expose it as a Service:
    -->

    ```shell
    kubectl expose deployment hello-minikube --type=NodePort --port=8080
    ```
    <!--
    The option `--type=NodePort` specifies the type of the Service.
    -->
    选项 `--type = NodePort` 指定 Service 的类型。

    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
    service/hello-minikube exposed
    ```

4. 现在 `hello-minikube` Pod 已经启动，但是您必须等到 Pod 启动完全才能通过暴露的 Service 访问它。

    <!--
    The `hello-minikube` Pod is now launched but you have to wait until the Pod is up before accessing it via the exposed Service.
    -->

    <!--
	Check if the Pod is up and running:
    -->
    检查 Pod 是否启动并运行：

	```shell
	kubectl get pod
	```
    <!--
	If the output shows the `STATUS` as `ContainerCreating`, the Pod is still being created:
    -->
    如果输出显示 `STATUS` 为 `ContainerCreating`，则表明 Pod 仍在创建中：
	```
	NAME                              READY     STATUS              RESTARTS   AGE
	hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
	```
    <!--
	If the output shows the `STATUS` as `Running`, the Pod is now up and running:
    -->
    如果输出显示 `STATUS` 为 `Running`，则 Pod 现在正在运行：
	```
	NAME                              READY     STATUS    RESTARTS   AGE
	hello-minikube-3383150820-vctvh   1/1       Running   0          13s
	```

5. 获取暴露 Service 的 URL 以查看 Service 的详细信息：

    <!--
    Get the URL of the exposed Service to view the Service details:
    -->

	```shell
	minikube service hello-minikube --url
	```

6. 要查看本地集群的详细信息，请在浏览器中复制粘贴并访问上一步骤输出的 URL。

    <!--
    To view the details of your local cluster, copy and paste the URL you got as the output, on your browser.
    -->

    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
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
    ```
    <!--
	If you no longer want the Service and cluster to run, you can delete them.
    -->
    如果您不再希望运行 Service 和集群，则可以删除它们。

7. 删除 `hello-minikube` Service：

    <!--
    Delete the `hello-minikube` Service:
    -->

    ```shell
    kubectl delete services hello-minikube
    ```
    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
    service "hello-minikube" deleted
    ```

8. 删除 `hello-minikube` Deployment：

    <!--
    Delete the `hello-minikube` Deployment:
    -->

    ```shell
    kubectl delete deployment hello-minikube
    ```
    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
    deployment.extensions "hello-minikube" deleted
    ```

9.  停止本地 Minikube 集群：

    <!--
    Stop the local Minikube cluster:
    -->

    ```shell
    minikube stop
    ```
    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
    Stopping "minikube"...
    "minikube" stopped.
    ```
    <!--
	For more information, see [Stopping a Cluster](#stopping-a-cluster).
    -->
    有关更多信息，请参阅[停止集群](#stopsing-a-cluster)。

10. 删除本地 Minikube 集群：

    <!--
    Delete the local Minikube cluster:
    -->

    ```shell
    minikube delete
    ```
    <!--
    The output is similar to this:
    -->
    输出类似于：

    ```
    Deleting "minikube" ...
    The "minikube" cluster has been deleted.
    ```
    <!--
	For more information, see [Deleting a cluster](#deleting-a-cluster).
    -->
    有关更多信息，请参阅[删除集群](#deletion-a-cluster)。

<!--
## Managing your Cluster
-->
## 管理您的集群

<!--
### Starting a Cluster
-->
### 启动集群 {#starting-a-cluster}

<!--
The `minikube start` command can be used to start your cluster.
-->
`minikube start` 命令可用于启动集群。
<!--
This command creates and configures a Virtual Machine that runs a single-node Kubernetes cluster.
-->
此命令将创建并配置一台虚拟机，使其运行单节点 Kubernetes 集群。
<!--
This command also configures your [kubectl](/docs/user-guide/kubectl-overview/) installation to communicate with this cluster.
-->
此命令还会配置您的 [kubectl](/docs/user-guide/kubectl-overview/) 安装，以便使其能与您的 Kubernetes 集群正确通信。

<!--
If you are behind a web proxy, you need to pass this information to the `minikube start` command:
-->
<!--
Unfortunately, setting the environment variables alone does not work.
-->
<!--
Minikube also creates a "minikube" context, and sets it to default in kubectl.
-->
<!--
To switch back to this context, run this command: `kubectl config use-context minikube`.
-->

{{< note >}}
如果您启用了 web 代理，则需要将此信息传递给 `minikube start` 命令：

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```

不幸的是，单独设置环境变量不起作用。

Minikube 还创建了一个 `minikube` 上下文，并将其设置为 kubectl 的默认上下文。

要切换回此上下文，请运行以下命令：`kubectl config use-context minikube`。
{{< /note >}}

<!--
#### Specifying the Kubernetes version
-->
#### 指定 Kubernetes 版本

<!--
You can specify the version of Kubernetes for Minikube to use byadding the `--kubernetes-version` string to the `minikube start` command. Forexample, to run version {{< param "fullversion" >}}, you would run the following:
-->
您可以通过将 `--kubernetes-version` 字符串添加到 `minikube start` 命令来指定要用于 Minikube 的 Kubernetes 版本。例如，要运行版本 {{< param "fullversion" >}}，您可以运行以下命令：

```
minikube start --kubernetes-version {{< param "fullversion" >}}
```
<!--
#### Specifying the VM driver
-->
#### 指定 VM 驱动程序

<!--
You can change the VM driver by adding the `--vm-driver=<enter_driver_name>` flag to `minikube start`.
-->

您可以通过将 `--vm-driver=<enter_driver_name>` 参数添加到 `minikube start` 来更改 VM 驱动程序。
<!--
For example the command would be.
-->
例如命令：

```shell
minikube start --vm-driver=<driver_name>
```
<!--
 Minikube supports the following drivers:
-->
Minikube 支持以下驱动程序：

<!--
 See [DRIVERS](https://minikube.sigs.k8s.io/docs/drivers/) for details on supported drivers and how to install plugins.
-->

<!--
* virtualbox
* vmwarefusion
* kvm2 ([driver installation](https://minikube.sigs.k8s.io/docs/drivers/#kvm2-driver))
* hyperkit ([driver installation](https://minikube.sigs.k8s.io/docs/drivers/#hyperkit-driver))
* hyperv ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperv-driver))
Note that the IP below is dynamic and can change. It can be retrieved with `minikube ip`.
* vmware ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#vmware-unified-driver)) (VMware unified driver)
* none (Runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker ([docker install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)) and a Linux environment)
-->


 {{< note >}}
有关支持的驱动程序以及如何安装插件的详细信息，请参阅[驱动程序](https://minikube.sigs.k8s.io/docs/drivers/)。
{{< /note >}}

* virtualbox
* vmwarefusion
* kvm2 ([驱动安装](https://minikube.sigs.k8s.io/docs/drivers/#kvm2-driver))
* hyperkit ([驱动安装](https://minikube.sigs.k8s.io/docs/drivers/#hyperkit-driver))
* hyperv ([驱动安装](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperv-driver))
<!--
Note that the IP below is dynamic and can change. It can be retrieved with `minikube ip`.
-->
请注意，下面的 IP 是动态的，可以更改。可以使用 `minikube ip` 检索。
* vmware ([驱动安装](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#vmware-unified-driver)) （VMware 统一驱动）
* none (在主机上运行Kubernetes组件，而不是在 VM 中。使用该驱动依赖 Docker ([安装 Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)) 和 Linux 环境)

<!--
#### Starting a cluster on alternative container runtimes

You can start Minikube on the following container runtimes.
-->
#### 通过别的容器运行时启动集群

您可以通过以下容器运行时启动 Minikube。

{{< tabs name="container_runtimes" >}}
{{% tab name="containerd" %}}
<!--
To use [containerd](https://github.com/containerd/containerd) as the container runtime, run:
-->
要使用 [containerd](https://github.com/containerd/containerd) 作为容器运行时，请运行：

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

<!--
Or you can use the extended version:
-->
或者您可以使用扩展版本：

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{% tab name="CRI-O" %}}
<!--
To use [CRI-O](https://github.com/kubernetes-incubator/cri-o) as the container runtime, run:
-->
要使用 [CRI-O](https://github.com/kubernetes-incubator/cri-o) 作为容器运行时，请运行：

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```
<!--
Or you can use the extended version:
-->
或者您可以使用扩展版本：

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{< /tabs >}}

<!--
#### Use local images by re-using the Docker daemon
-->
#### 通过重用 Docker 守护进程使用本地镜像

<!--
When using a single VM for Kubernetes, it's useful to reuse Minikube's built-in Docker daemon. Reusing the built-in daemon means you don't have to build a Docker registry on your host machine and push the image into it. Instead, you can build inside the same Docker daemon as Minikube, which speeds up local experiments.
-->
当为 Kubernetes 使用单个 VM 时，重用 Minikube 的内置 Docker 守护程序非常有用。重用内置守护程序意味着您不必在主机上构建 Docker 镜像仓库并将镜像推入其中。相反，您可以在与 Minikube 相同的 Docker 守护进程内部构建，这可以加速本地实验。

{{< note >}}
<!--
Be sure to tag your Docker image with something other than latest and use that tag to pull the image. Because `:latest` is the default value, with a corresponding default image pull policy of `Always`, an image pull error (`ErrImagePull`) eventually results if you do not have the Docker image in the default Docker registry (usually DockerHub).
-->
一定要用非 `latest` 的标签来标记你的 Docker 镜像，并使用该标签来拉取镜像。因为 `:latest` 标记的镜像，其默认镜像拉取策略是 `Always`，如果在默认的 Docker 镜像仓库（通常是 DockerHub）中没有找到你的 Docker 镜像，最终会导致一个镜像拉取错误（`ErrImagePull`）。
{{< /note >}}

<!--
To work with the Docker daemon on your Mac/Linux host, use the `docker-env command` in your shell:
-->
要在 Mac/Linux 主机上使用 Docker 守护程序，请在 shell 中运行 `docker-env command`：

```shell
eval $(minikube docker-env)
```

<!--
You can now use Docker at the command line of your host Mac/Linux machine to communicate with the Docker daemon inside the Minikube VM:
-->
您现在可以在 Mac/Linux 机器的命令行中使用 Docker 与 Minikube VM 内的 Docker 守护程序进行通信：

```shell
docker ps
```

{{< note >}}
<!--
On Centos 7, Docker may report the following error:
-->
在 Centos 7 上，Docker 可能会报如下错误：

```
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

<!--
You can fix this by updating /etc/sysconfig/docker to ensure that Minikube's environment changes are respected:
-->
您可以通过更新 /etc/sysconfig/docker 来解决此问题，以确保 Minikube 的环境更改得到遵守：

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```
{{< /note >}}

<!--
### Configuring Kubernetes
-->
### 配置 Kubernetes

<!--
Minikube has a "configurator" feature that allows users to configure the Kubernetes components with arbitrary values.
-->
Minikube 有一个 "configurator" 功能，允许用户使用任意值配置 Kubernetes 组件。
<!--
To use this feature, you can use the `--extra-config` flag on the `minikube start` command.
-->
要使用此功能，可以在 `minikube start` 命令中使用 `--extra-config` 参数。

<!--
This flag is repeated, so you can pass it several times with several different values to set multiple options.
-->
此参数允许重复，因此您可以使用多个不同的值多次传递它以设置多个选项。

<!--
This flag takes a string of the form `component.key=value`, where `component` is one of the strings from the below list, `key` is a value on the configuration struct and `value` is the value to set.
-->
此参数采用 `component.key=value` 形式的字符串，其中 `component` 是下面列表中的一个字符串，`key` 是配置项名称，`value` 是要设置的值。

<!--
Valid keys can be found by examining the documentation for the Kubernetes `componentconfigs` for each component.
-->
通过检查每个组件的 Kubernetes `componentconfigs` 的文档，可以找到有效的 key。
<!--
Here is the documentation for each supported configuration:
-->
下面是每个组件所支持的配置的介绍文档：

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

<!--
#### Examples
-->
#### 例子

<!--
To change the `MaxPods` setting to 5 on the Kubelet, pass this flag: `--extra-config=kubelet.MaxPods=5`.
-->
要在 Kubelet 上将 `MaxPods` 设置更改为 5，请传递此参数：`--extra-config=kubelet.MaxPods=5`。

<!--
This feature also supports nested structs. To change the `LeaderElection.LeaderElect` setting to `true` on the scheduler, pass this flag: `--extra-config=scheduler.LeaderElection.LeaderElect=true`.
-->
此功能还支持嵌套结构。要在调度程序上将 `LeaderElection.LeaderElect` 设置更改为 `true`，请传递此参数：`--extra-config=scheduler.LeaderElection.LeaderElect=true`。

<!--
To set the `AuthorizationMode` on the `apiserver` to `RBAC`, you can use: `--extra-config=apiserver.authorization-mode=RBAC`.
-->
要将 `apiserver` 的 `AuthorizationMode` 设置为 `RBAC`，您可以使用：`--extra-config=apiserver.authorization-mode=RBAC`。

<!--
### Stopping a ClusterThe

`minikube stop` command can be used to stop your cluster.
-->
### 停止集群 {#stopsing-a-cluster}

`minikube stop` 命令可用于停止集群。
<!--
This command shuts down the Minikube Virtual Machine, but preserves all cluster state and data.
-->
此命令关闭 Minikube 虚拟机，但保留所有集群状态和数据。
<!--
Starting the cluster again will restore it to its previous state.
-->
再次启动集群会将其恢复到以前的状态。

<!--
### Deleting a ClusterThe

`minikube delete` command can be used to delete your cluster.
-->
### 删除集群 {#deletion-a-cluster}

`minikube delete` 命令可用于删除集群。
<!--
This command shuts down and deletes the Minikube Virtual Machine. No data or state is preserved.
-->
此命令将关闭并删除 Minikube 虚拟机，不保留任何数据或状态。

<!--
## Interacting with Your Cluster
-->
## 与集群交互 {#interacting-with-your-cluster}

<!--
### Kubectl
-->
### Kubectl

<!--
The `minikube start` command creates a [kubectl context](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-) called "minikube".
-->
`minikube start` 命令创建一个名为 `minikube` 的 [kubectl 上下文](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-)。
<!--
This context contains the configuration to communicate with your Minikube cluster.
-->
此上下文包含与 Minikube 集群通信的配置。

<!--
Minikube sets this context to default automatically, but if you need to switch back to it in the future, run:
-->
Minikube 会自动将此上下文设置为默认值，但如果您以后需要切换回它，请运行：

<!--
`kubectl config use-context minikube`,
-->
`kubectl config use-context minikube`，

<!--
Or pass the context on each command like this: `kubectl get pods --context=minikube`.
-->
或者像这样，每个命令都附带其执行的上下文：`kubectl get pods --context=minikube`。

<!--
### Dashboard
-->
### 仪表盘

<!--
To access the [Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/), run this command in a shell after starting Minikube to get the address:
-->
要访问 [Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/)，请在启动 Minikube 后在 shell 中运行此命令以获取地址：

```shell
minikube dashboard
```

<!--
### Services
-->
### Service

<!--
To access a Service exposed via a node port, run this command in a shell after starting Minikube to get the address:
-->
要访问通过节点（Node）端口公开的 Service，请在启动 Minikube 后在 shell 中运行此命令以获取地址：

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

<!--
## Networking
-->
## 网络

<!--
The Minikube VM is exposed to the host system via a host-only IP address, that can be obtained with the `minikube ip` command.
-->
Minikube VM 通过 host-only IP 暴露给主机系统，可以通过 `minikube ip` 命令获得该 IP。
<!--
Any services of type `NodePort` can be accessed over that IP address, on the NodePort.
-->
在 NodePort 上，可以通过该 IP 地址访问任何类型为 `NodePort` 的服务。

<!--
To determine the NodePort for your service, you can use a `kubectl` command like this:
-->
要确定服务的 NodePort，可以像这样使用 `kubectl` 命令：

<!--
`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`
-->
`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

<!--
## Persistent Volumes

Minikube supports [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) of type `hostPath`.
-->
## 持久卷（PersistentVolume）

Minikube 支持 `hostPath` 类型的 [持久卷](/docs/concepts/storage/persistent-volumes/)。
<!--
These PersistentVolumes are mapped to a directory inside the Minikube VM.
-->
这些持久卷会映射为 Minikube VM 内的目录。

<!--
The Minikube VM boots into a tmpfs, so most directories will not be persisted across reboots (`minikube stop`).
-->
Minikube VM 引导到 tmpfs，因此大多数目录不会在重新启动（`minikube stop`）之后保持不变。
<!--
However, Minikube is configured to persist files stored under the following host directories:
-->
但是，Minikube 被配置为保存存储在以下主机目录下的文件：

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

<!--
Here is an example PersistentVolume config to persist data in the `/data` directory:
-->
下面是一个持久卷配置示例，用于在 `/data` 目录中保存数据：

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
-->
## 挂载宿主机文件夹

一些驱动程序将在 VM 中挂载一个主机文件夹，以便您可以轻松地在 VM 和主机之间共享文件。目前这些都是不可配置的，并且根据您正在使用的驱动程序和操作系统的不同而不同。

<!--
Host folder sharing is not implemented in the KVM driver yet.
-->

{{< note >}}
KVM 驱动程序中尚未实现主机文件夹共享。
{{< /note >}}

| 驱动 | 操作系统 | 宿主机文件夹 | VM 文件夹 |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /Users |
| Xhyve | macOS | /Users | /Users |

<!--
## Private Container Registries
-->
## 私有容器镜像仓库

<!--
To access a private container registry, follow the steps on [this page](/docs/concepts/containers/images/).
-->
要访问私有容器镜像仓库，请按照[本页](/docs/concepts/containers/images/)上的步骤操作。

<!--
We recommend you use `ImagePullSecrets`, but if you would like to configure access on the Minikube VM you can place the `.dockercfg` in the `/home/docker` directory or the `config.json` in the `/home/docker/.docker` directory.
-->
我们建议您使用 `ImagePullSecrets`，但是如果您想在 Minikube VM 上配置访问权限，可以将 `.dockercfg` 放在 `/home/docker` 目录中，或将`config.json` 放在 `/home/docker/.docker` 目录。

<!--
## Add-ons
-->
## 附加组件

<!--
In order to have Minikube properly start or restart custom addons,place the addons you wish to be launched with Minikube in the `~/.minikube/addons`directory. Addons in this folder will be moved to the Minikube VM and launched each time Minikube is started or restarted.
-->
为了让 Minikube 正确启动或重新启动自定义插件，请将您希望用 Minikube 启动的插件放在 `~/.minikube/addons` 目录中。此文件夹中的插件将被移动到 Minikube VM 并在每次 Minikube 启动或重新启动时被启动。

<!--
## Using Minikube with an HTTP Proxy
-->
## 基于 HTTP 代理使用 Minikube

<!--
Minikube creates a Virtual Machine that includes Kubernetes and a Docker daemon.
-->
Minikube 创建了一个包含 Kubernetes 和 Docker 守护进程的虚拟机。
<!--
When Kubernetes attempts to schedule containers using Docker, the Docker daemon may require external network access to pull containers.
-->
当 Kubernetes 尝试使用 Docker 调度容器时，Docker 守护程序可能需要访问外部网络来拉取容器镜像。

<!--
If you are behind an HTTP proxy, you may need to supply Docker with the proxy settings.
-->
如果您配置了 HTTP 代理，则可能也需要为 Docker 进行代理设置。
<!--
To do this, pass the required environment variables as flags during `minikube start`.
-->
要实现这一点，可以在 `minikube start` 期间将所需的环境变量作为参数传递给启动命令。

<!--
For example:
-->
例如：

```shell
minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

<!--
If your Virtual Machine address is 192.168.99.100, then chances are your proxy settings will prevent `kubectl` from directly reaching it.
-->
如果您的虚拟机地址是 192.168.99.100，那么您的代理设置可能会阻止 `kubectl` 直接访问它。
<!--
To by-pass proxy configuration for this IP address, you should modify your no_proxy settings. You can do so with:
-->
要绕过此 IP 地址的代理配置，您应该修改 no_proxy 设置。您可以这样做：

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

<!--
## Known Issues
-->
## 已知的问题

<!--
Features that require multiple nodes will not work in Minikube.
-->
需要多个节点的功能无法在 Minikube 中使用。

<!--
## Design
-->
## 设计

<!--
Minikube uses [libmachine](https://github.com/docker/machine/tree/master/libmachine) for provisioning VMs, and [kubeadm](https://github.com/kubernetes/kubeadm) to provision a Kubernetes cluster.
-->
Minikube 使用 [libmachine](https://github.com/docker/machine/tree/master/libmachine) 配置虚拟机，[kubeadm](https://github.com/kubernetes/kubeadm) 配置 Kubernetes 集群。

<!--
For more information about Minikube, see the [proposal](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).
-->
有关 Minikube 的更多信息，请参阅[提案](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md)。

<!--
## Additional Links
-->
## 其他链接

<!--
* **Goals and Non-Goals**: For the goals and non-goals of the Minikube project, please see our [roadmap](https://git.k8s.io/minikube/docs/contributors/roadmap.md).
* **Development Guide**: See [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) for an overview of how to send pull requests.
* **Building Minikube**: For instructions on how to build/test Minikube from source, see the [build guide](https://git.k8s.io/minikube/docs/contributors/build_guide.md).
* **Adding a New Dependency**: For instructions on how to add a new dependency to Minikube, see the [adding dependencies guide](https://minikube.sigs.k8s.io/docs/contrib/building/iso/).
* **Adding a New Addon**: For instructions on how to add a new addon for Minikube, see the [adding an addon guide](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md).
* **MicroK8s**: Linux users wishing to avoid running a virtual machine may consider [MicroK8s](https://microk8s.io/) as an alternative.
-->

* **目标和非目标**: 有关 Minikube 项目的目标和非目标，请参阅我们的 [roadmap](https://git.k8s.io/minikube/docs/contributors/roadmap.md)。
* **开发指南**: 请查阅 [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) 获取有关如何提交 Pull Request 的概述。
* **构建 Minikube**: 有关如何从源代码构建/测试 Minikube 的说明，请参阅[构建指南](https://git.k8s.io/minikube/docs/contributors/build_guide.md)。
* **添加新依赖**: 有关如何向 Minikube 添加新依赖的说明，请参阅[添加依赖项指南](https://minikube.sigs.k8s.io/docs/contrib/building/iso/)。
* **添加新插件**: 有关如何为 Minikube 添加新插件的说明，请参阅[添加插件指南](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md)。
* **MicroK8s**: 希望避免运行虚拟机的 Linux 用户可以考虑使用 [MicroK8s](https://microk8s.io/) 作为替代品。

<!--
## Community
-->
## 社区

<!--
Contributions, questions, and comments are all welcomed and encouraged! Minikube developers hang out on [Slack](https://kubernetes.slack.com) in the #minikube channel (get an invitation [here](http://slack.kubernetes.io/)). We also have the [kubernetes-dev Google Groups mailing list](https://groups.google.com/forum/#!forum/kubernetes-dev). If you are posting to the list please prefix your subject with "minikube: ".
-->
我们欢迎您向社区提交贡献、提出问题以及参与评论！Minikube 开发人员可以在 [Slack](https://kubernetes.slack.com) 的 #minikube 频道上互动交流（点击[这里](http://slack.kubernetes.io/)获得邀请）。我们还有 [kubernetes-dev Google Groups 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-dev)。如果您要发信到列表中，请在主题前加上 "minikube: "。


