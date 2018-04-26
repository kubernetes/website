---
title: 你好 Minikube
cn-approvers:
- chentao1596
---
<!--
---
title: Hello Minikube
---
-->


{% capture overview %}

<!--
The goal of this tutorial is for you to turn a simple Hello World Node.js app
into an application running on Kubernetes. The tutorial shows you how to
take code that you have developed on your machine, turn it into a Docker
container image and then run that image on [Minikube](/docs/getting-started-guides/minikube).
Minikube provides a simple way of running Kubernetes on your local machine for free.
-->
本教程的目标是将一个简单的 “Hello World” Node.js 应用转换为运行在 Kubernetes 上的应用。本教程向您展示如何将您在计算机上开发的代码转换为 Docker 容器镜像，然后在 [Minikube](/docs/getting-started-guides/minikube) 上运行。Minikube 提供了一种在本地机器上免费运行 Kubernetes 的简单方法。

{% endcapture %}

{% capture objectives %}

<!--
* Run a hello world Node.js application.
* Deploy the application to Minikube.
* View application logs.
* Update the application image.
-->
* 运行一个 “hello world” Node.js 应用。
* 将应用部署到Minikube。
* 查看应用日志。
* 更新应用镜像。


{% endcapture %}

{% capture prerequisites %}

<!--
* For OS X, you need [Homebrew](https://brew.sh) to install the `xhyve`
driver.

* [NodeJS](https://nodejs.org/en/) is required to run the sample application.

* Install Docker. On OS X, we recommend
[Docker for Mac](https://docs.docker.com/engine/installation/mac/).
-->
* 对于 OS X，您需要使用 [Homebrew](https://brew.sh) 安装 `xhyve` 驱动。

* [NodeJS](https://nodejs.org/en/) 用于运行示例应用。

* 安装 Docker。在 OS X 上，我们建议使用 [提供给 Mac 系统的 Docker](https://docs.docker.com/engine/installation/mac/)。


{% endcapture %}

{% capture lessoncontent %}

<!--
## Create a Minikube cluster
-->
## 创建 Minikube 集群

<!--
This tutorial uses [Minikube](https://github.com/kubernetes/minikube) to
create a local cluster. This tutorial also assumes you are using
[Docker for Mac](https://docs.docker.com/engine/installation/mac/)
on OS X. If you are on a different platform like Linux, or using VirtualBox
instead of Docker for Mac, the instructions to install Minikube may be
slightly different. For general Minikube installation instructions, see
the [Minikube installation guide](/docs/getting-started-guides/minikube/).
-->
本教程使用 [Minikube](https://github.com/kubernetes/minikube) 创建本地集群。本教程还假设您在 OS X 上使用 [提供给 Mac 系统的 Docker](https://docs.docker.com/engine/installation/mac/)。如果您使用的是类似 Linux 这种不同的平台，或者使用 VirtualBox 而不是 Docker，那么安装 Minikube 的说明可能会略有不同。有关通用 Minikube 的安装说明，请参阅 [Minikube 安装指南](/docs/getting-started-guides/minikube/)。

<!--
Use `curl` to download and install the latest Minikube release:
-->
使用 `curl` 下载和安装 Minikube 最新发布的版本：

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 && \
  chmod +x minikube && \
  sudo mv minikube /usr/local/bin/
```

<!--
Use Homebrew to install the xhyve driver and set its permissions:
-->
使用 Homebrew 安装 xhyve 驱动程序并设置其权限：

```shell
brew install docker-machine-driver-xhyve
sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
```

<!--
Use Homebrew to download the `kubectl` command-line tool, which you can
use to interact with Kubernetes clusters:
-->
使用 Homebrew 下载 `kubectl` 命令行工具，您可以使用它与 Kubernetes 集群进行交互：

```shell
brew install kubectl
```

<!--
Determine whether you can access sites like [https://cloud.google.com/container-registry/](https://cloud.google.com/container-registry/) directly without a proxy, by opening a new terminal and using
-->
在不使用代理的情况下，请确认您是否可以直接访问以下站点 [https://cloud.google.com/container-registry/](https://cloud.google.com/container-registry/)，通过打开新终端并使用

```shell
curl --proxy "" https://cloud.google.com/container-registry/
```

<!--
If NO proxy is required, start the Minikube cluster:
-->
如果不需要代理，请启动 Minikube 集群：

```shell
minikube start --vm-driver=xhyve
```
<!--
If a proxy server is required, use the following method to start Minikube cluster with proxy setting:
-->
如果需要代理服务器，请使用以下方法启动具有代理设置的 Minikube 集群：

```shell
minikube start --vm-driver=xhyve --docker-env HTTP_PROXY=http://your-http-proxy-host:your-http-proxy-port  --docker-env HTTPS_PROXY=http(s)://your-https-proxy-host:your-https-proxy-port
```

<!--
The `--vm-driver=xhyve` flag specifies that you are using Docker for Mac. The
default VM driver is VirtualBox.
-->
`--vm-driver=xhyve` 标志表示您正在使用提供给 Mac 系统的 Docker。默认的 VM 驱动是 VirtualBox。

<!--
Note if `minikube start --vm-driver=xhyve` is unsuccessful due to the error:
-->
注意，如果 `minikube start --vm-driver=xhyve` 由于下面错误而不成功：
```
Error creating machine: Error in driver during machine creation: Could not convert the UUID to MAC address: exit status 1
```

<!--
Then the following may resolve the `minikube start --vm-driver=xhyve` issue:
-->
那么，以下内容可以解决该问题：
```
rm -rf ~/.minikube
sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
```

<!--
Now set the Minikube context. The context is what determines which cluster
`kubectl` is interacting with. You can see all your available contexts in the
`~/.kube/config` file.
-->
现在设置 Minikube 上下文。上下文决定了 `kubectl` 与哪一个集群进行交互。您可以在 `~/.kube/config` 文件中看到所有可用的上下文内容。

```shell
kubectl config use-context minikube
```

<!--
Verify that `kubectl` is configured to communicate with your cluster:
-->
验证 `kubectl` 已经配置为与您的集群通信：

```shell
kubectl cluster-info
```

<!--
## Create your Node.js application
-->
## 创建您的 Node.js 应用

<!--
The next step is to write the application. Save this code in a folder named `hellonode`
with the filename `server.js`:
-->
下一步是编写应用。将此代码使用文件 `server.js` 保存在 `hellonode` 的文件夹中：

{% include code.html language="js" file="server.js" ghlink="/docs/tutorials/stateless-application/server.js" %}

<!--
Run your application:
-->
运行您的应用：

```shell
node server.js
```

<!--
You should be able to see your "Hello World!" message at http://localhost:8080/.
-->
您应该能够通过 http://localhost:8080/ 看到 "Hello World!" 的消息：

<!--
Stop the running Node.js server by pressing **Ctrl-C**.
-->
通过按 **Ctrl-C** 停止运行中的 Node.js 服务器。

<!--
The next step is to package your application in a Docker container.
-->
接下来将应用打包到 Docker 容器中。

<!--
## Create a Docker container image
-->
## 创建 Docker 容器镜像

<!--
Create a file, also in the `hellonode` folder, named `Dockerfile`. A Dockerfile describes
the image that you want to build. You can build a Docker container image by extending an
existing image. The image in this tutorial extends an existing Node.js image.
-->
在 `hellonode` 文件夹中，创建一个文件 Dockerfile。Dockerfile 描述要生成的镜像。您可以通过扩展现有镜像来构建 Docker 容器镜像。本教程中的镜像扩展了现有的 Node.js 镜像。

{% include code.html language="conf" file="Dockerfile" ghlink="/docs/tutorials/stateless-application/Dockerfile" %}

<!--
This recipe for the Docker image starts from the official Node.js LTS image
found in the Docker registry, exposes port 8080, copies your `server.js` file
to the image and starts the Node.js server.
-->
构建的过程是从 Docker 仓库中找到的官方 Node.js LTS 镜像开始，然后暴露端口 8080，接着将您的 `server.js` 文件复制到镜像中，并启动 Node.js 服务器。

<!--
Because this tutorial uses Minikube, instead of pushing your Docker image to a
registry, you can simply build the image using the same Docker host as
the Minikube VM, so that the images are automatically present. To do so, make
sure you are using the Minikube Docker daemon:
-->
由于本教程使用 Minikube，而不是将 Docker 镜像推送到仓库，您可以使用同一个 Docker 主机作为 Minikube VM 来构建镜像，这样镜像就会自动保存。为此，请确保您使用的是 Minikube Docker 守护进程：

```shell
eval $(minikube docker-env)
```

<!--
**Note:** Later, when you no longer wish to use the Minikube host, you can undo
this change by running `eval $(minikube docker-env -u)`.
-->
**注：** 当您不再希望使用这个 Minikube 主机时，您可以通过运行 `eval $(minikube docker-env -u)` 来撤消此更改。

<!--
Build your Docker image, using the Minikube Docker daemon:
-->
使用 Minikube Docker 守护程序构建您的 Docker 镜像：

```shell
docker build -t hello-node:v1 .
```

<!--
Now the Minikube VM can run the image you built.
-->
现在 Minikube VM 可以运行您构建的镜像了。

<!--
## Create a Deployment
-->
## 创建 Deployment

<!--
A Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.
-->
Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) 是由一个或多个容器为了管理和联网的目的而绑定在一起构成的组。本教程中的 Pod 只有一个容器。Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/) 检查 Pod 的健康状况，并在 Pod 中的容器终止的情况下重新启动新的容器。Deployment 是管理 Pod 创建和伸缩的推荐方法。

<!--
Use the `kubectl run` command to create a Deployment that manages a Pod. The
Pod runs a Container based on your `hello-node:v1` Docker image:
-->
使用 `kubectl run` 命令创建一个管理 Pod 的 Deployment。该 Pod 基于镜像 `hello-node:v1` 运行了一个容器：

```shell
kubectl run hello-node --image=hello-node:v1 --port=8080
```

<!--
View the Deployment:
-->
查看 Deployment：


```shell
kubectl get deployments
```

<!--
Output:
-->
输出：


```shell
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello-node   1         1         1            1           3m
```

<!--
View the Pod:
-->
查看 Pod：


```shell
kubectl get pods
```

<!--
Output:
-->
输出：


```shell
NAME                         READY     STATUS    RESTARTS   AGE
hello-node-714049816-ztzrb   1/1       Running   0          6m
```

<!--
View cluster events:
-->
查看集群事件：

```shell
kubectl get events
```

<!--
View the `kubectl` configuration:
-->
查看 `kubectl` 配置：

```shell
kubectl config view
```

<!--
For more information about `kubectl`commands, see the
[kubectl overview](/docs/user-guide/kubectl-overview/).
-->
有关 `kubectl` 命令的更多信息，请参阅 [kubectl 概述](/docs/user-guide/kubectl-overview/)。

<!--
## Create a Service
-->
## 创建 Service

<!--
By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).
-->
默认情况下，Pod 只能通过 Kubernetes 集群中的内部 IP 地址访问。要使得 `hello-node` 容器可以从 Kubernetes 虚拟网络的外部访问，您必须将 Pod 暴露为 Kubernetes [*Service*](/docs/concepts/services-networking/service/)。

<!--
From your development machine, you can expose the Pod to the public internet
using the `kubectl expose` command:
-->
在您的开发机器中，可以使用 `kubectl expose` 命令将 Pod 暴露给公网：

```shell
kubectl expose deployment hello-node --type=LoadBalancer
```

<!--
View the Service you just created:
-->
查看您刚刚创建的服务

```shell
kubectl get services
```

<!--
Output:
-->
输出：

```shell
NAME         CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
hello-node   10.0.0.71    <pending>     8080/TCP   6m
kubernetes   10.0.0.1     <none>        443/TCP    14d
```

<!--
The `--type=LoadBalancer` flag indicates that you want to expose your Service
outside of the cluster. On cloud providers that support load balancers,
an external IP address would be provisioned to access the Service. On Minikube,
the `LoadBalancer` type makes the Service accessible through the `minikube service`
command.
-->
`--type=LoadBalancer` 表示要在集群之外公开您的服务。在支持负载均衡器的云服务提供商上，将提供一个外部 IP（external IP） 来访问该服务。在 Minikube 上，`LoadBalancer` 使得服务可以通过命令 `minikube service` 访问。

```shell
minikube service hello-node
```

<!--
This automatically opens up a browser window using a local IP address that
serves your app and shows the "Hello World" message.
-->
这会自动打开一个浏览器窗口，使用本地 IP 地址访问您的应用，并显示 “HelloWorld” 消息。

<!--
Assuming you've sent requests to your new web service using the browser or curl,
you should now be able to see some logs:
-->
假设您已经使用浏览器或 curl 向您新的 web 服务发送了请求，那么现在应该能够看到一些日志：

```shell
kubectl logs <POD-NAME>
```

<!--
## Update your app
-->
## 更新您的应用

<!--
Edit your `server.js` file to return a new message:
-->
编辑文件 `server.js`，返回一个新的消息：

```javascript
response.end('Hello World Again!');

```

<!--
Build a new version of your image:
-->
构建一个新版本的镜像：

```shell
docker build -t hello-node:v2 .
```

<!--
Update the image of your Deployment:
-->
更新 Deployment 中的镜像：

```shell
kubectl set image deployment/hello-node hello-node=hello-node:v2
```

<!--
Run your app again to view the new message:
-->
再次运行您的应用，查看新的消息：

```shell
minikube service hello-node
```

<!--
## Enable addons
-->
## 启用 addons

<!--
Minikube has a set of built-in addons that can be enabled, disabled and opened in the local Kubernetes environment.
-->
Minikube 有一组内置的 addons，可以在本地 Kubernetes 环境中启用、禁用和打开。

<!--
First list the currently supported addons:
-->
首先，列出当前支持的 addons：

```shell
minikube addons list
```

<!--
Output:
-->
输出：

```shell
- storage-provisioner: enabled
- kube-dns: enabled
- registry: disabled
- registry-creds: disabled
- addon-manager: enabled
- dashboard: disabled
- default-storageclass: enabled
- coredns: disabled
- heapster: disabled
- efk: disabled
- ingress: disabled
```

<!--
Minikube must be running for these command to take effect. To enable `heapster` addon, for example:
-->
minkube 必须运行这些命令才能使它们生效。例如，为了启用 `heapster`  addon：

```shell
minikube addons enable heapster
```

<!--
Output:
-->
输出：

```shell
heapster was successfully enabled
```

<!--
View the Pod and Service you just created:
-->
查看刚才创建的 Pod 和 Service：

```shell
kubectl get po,svc -n kube-system
```

<!--
Output:
-->
输出：

```shell
NAME                             READY     STATUS    RESTARTS   AGE
po/heapster-zbwzv                1/1       Running   0          2m
po/influxdb-grafana-gtht9        2/2       Running   0          2m

NAME                       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)             AGE
svc/heapster               NodePort    10.0.0.52    <none>        80:31655/TCP        2m
svc/monitoring-grafana     NodePort    10.0.0.33    <none>        80:30002/TCP        2m
svc/monitoring-influxdb    ClusterIP   10.0.0.43    <none>        8083/TCP,8086/TCP   2m
```

<!--
Open the endpoint to interacting with heapster in a browser:
-->
在浏览器打开跟 heapster 交互的 endpoint：

```shell
minikube addons open heapster
```

<!--
Output:
-->
输出：

```shell
Opening kubernetes service kube-system/monitoring-grafana in default browser...
```

<!--
## Clean up
-->
## 清理

<!--
Now you can clean up the resources you created in your cluster:
-->
现在可以清理您在集群中创建的资源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

<!--
Optionally, stop the Minikube VM:
-->
可以停止 Minikube VM：

```shell
minikube stop
eval $(minikube docker-env -u)
```

<!--
Optionally, delete the Minikube VM:
-->
或者，删除 Minikube VM：

```shell
minikube delete
```

{% endcapture %}


{% capture whatsnext %}

<!--
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/user-guide/deploying-applications/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).
-->
* 学习更多关于 [Deployment 对象](/docs/concepts/workloads/controllers/deployment/)。
* 学习更多关于 [部署应用](/docs/user-guide/deploying-applications/)。
* 学习更多关于 [Service 对象](/docs/concepts/services-networking/service/)。

{% endcapture %}

{% include templates/tutorial.md %}
