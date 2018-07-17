---
title: Hello Minikube
content_template: templates/tutorial
weight: 5
---

{{% capture overview %}}
<!--
The goal of this tutorial is for you to turn a simple Hello World Node.js app
into an application running on Kubernetes. The tutorial shows you how to
take code that you have developed on your machine, turn it into a Docker
container image and then run that image on [Minikube](/docs/getting-started-guides/minikube).
Minikube provides a simple way of running Kubernetes on your local machine for free.
-->
本教程的目标是让您将一个简单的 Hello World Node.js 应用程序转换为 Kubernetes 上运行的应用程序。
本教程将向您展示如何操作获取您在计算机上开发的代码，将其转换为 Docker 镜像，然后在 [Minikube](/docs/getting-started-guides/minikube) 上运行该镜像。
Minikube 提供了一种在本地计算机上免费运行 Kubernetes 的简单方法。

{{% /capture %}}

{{% capture objectives %}}

<!--
* Run a hello world Node.js application.
* Deploy the application to Minikube.
* View application logs.
* Update the application image.
-->

* 运行一个 hello world Node.js 应用程序
* 部署该程序到 Minikube 中
* 查看应用程序日志
* 更新应用镜像

{{% /capture %}}

{{% capture prerequisites %}}

<!--
* For OS X, you need [Homebrew](https://brew.sh) to install the `xhyve` driver.

  {{< note >}}
  **Note:** If you see the following Homebrew error when you run `brew update` after you update your computer to MacOS 10.13:
  
  ```
  Error: /usr/local is not writable. You should change the ownership
  and permissions of /usr/local back to your user account:
  sudo chown -R $(whoami) /usr/local
  ```
  You can resolve the issue by reinstalling Homebrew:
  ```
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```
  {{< /note >}}

* [NodeJS](https://nodejs.org/en/) is required to run the sample application.

* Install Docker. On OS X, we recommend
[Docker for Mac](https://docs.docker.com/engine/installation/mac/).
-->

* 对于 OS X 操作系统，您需要使用 [Homebrew](https://brew.sh) 去安装 `xhyve` 驱动程序。

  {{< note >}}
  **注意:** 如果您在更新您的计算机到 MacOS 10.13 后运行 `brew update` 时，出现了下面的 Homebrew error :
  
  ```
  Error: /usr/local is not writable. You should change the ownership
  and permissions of /usr/local back to your user account:
  sudo chown -R $(whoami) /usr/local
  ```
  您可以通过重新安装 Homebrew 来解决该问题:
  ```
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```
  {{< /note >}}

* 需要安装 [NodeJS](https://nodejs.org/en/) 来运行示例程序。

* 安装 Docker。在 OS X 上，我们推荐使用 [Docker for Mac](https://docs.docker.com/engine/installation/mac/)。

{{% /capture %}}

{{% capture lessoncontent %}}

<!--
## Create a Minikube cluster

This tutorial uses [Minikube](https://github.com/kubernetes/minikube) to
create a local cluster. This tutorial also assumes you are using
[Docker for Mac](https://docs.docker.com/engine/installation/mac/)
on OS X. If you are on a different platform like Linux, or using VirtualBox
instead of Docker for Mac, the instructions to install Minikube may be
slightly different. For general Minikube installation instructions, see
the [Minikube installation guide](/docs/getting-started-guides/minikube/).

Use `curl` to download and install the latest Minikube release:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 && \
  chmod +x minikube && \
  sudo mv minikube /usr/local/bin/
```
-->
## 创建一个 Minikube 集群

本教程使用 [Minikube](https://github.com/kubernetes/minikube) 创建一个本地集群。同时本教程假定您在 OS X 上使用 [Docker for Mac](https://docs.docker.com/engine/installation/mac/)。如果您在一个不同的平台例如 Linux，或者使用 VirtualBox 而不是 Docker for Mac，安装 Minikube 的步骤可能稍微有所不同。对于一般的 Minikube 安装步骤，请查看 [Minikube installation guide](/docs/getting-started-guides/minikube/) 。

使用 `curl` 去下载和按照最新发布的 Minikube：

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 && \
  chmod +x minikube && \
  sudo mv minikube /usr/local/bin/
```
<!--
Use Homebrew to install the xhyve driver and set its permissions:

```shell
brew install docker-machine-driver-xhyve
sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
```

Use Homebrew to download the `kubectl` command-line tool, which you can
use to interact with Kubernetes clusters:

```shell
brew install kubernetes-cli
```
-->
使用 Homebrew 去安装 xhyve 驱动并且设置它的权限：

```shell
brew install docker-machine-driver-xhyve
sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
```

使用 Homebrew 下载 `kubectl` 命令行工具，您可以使用它和 Kubernetes 集群交互：

```shell
brew install kubernetes-cli
```
<!--
Determine whether you can access sites like [https://cloud.google.com/container-registry/](https://cloud.google.com/container-registry/) directly without a proxy, by opening a new terminal and using

```shell
curl --proxy "" https://cloud.google.com/container-registry/
```

Make sure that the Docker daemon is started. You can determine if docker is running by using a command such as:

```shell
docker images
```
-->
判断您是否可以不通过代理直接访问像 [https://cloud.google.com/container-registry/](https://cloud.google.com/container-registry/) 这样的网站，打开一个新的终端，通过使用

```shell
curl --proxy "" https://cloud.google.com/container-registry/
```

确保 Docker deamon 已经启动。您可以通过下面的命令判断 docker 是否在运行，例如：

```shell
docker images
```

<!--
If NO proxy is required, start the Minikube cluster:

```shell
minikube start --vm-driver=xhyve
```
If a proxy server is required, use the following method to start Minikube cluster with proxy setting:

```shell
minikube start --vm-driver=xhyve --docker-env HTTP_PROXY=http://your-http-proxy-host:your-http-proxy-port  --docker-env HTTPS_PROXY=http(s)://your-https-proxy-host:your-https-proxy-port
```
-->

如果不需要代理，直接启动 Minikube 集群：

```shell
minikube start --vm-driver=xhyve
```

如果需要代理服务器，使用下面的方法来通过代理启动 Minikube 集群：

```shell
minikube start --vm-driver=xhyve --docker-env HTTP_PROXY=http://your-http-proxy-host:your-http-proxy-port  --docker-env HTTPS_PROXY=http(s)://your-https-proxy-host:your-https-proxy-port
```

<!--
The `--vm-driver=xhyve` flag specifies that you are using Docker for Mac. The
default VM driver is VirtualBox.

Note if `minikube start --vm-driver=xhyve` is unsuccessful due to the error:
```
Error creating machine: Error in driver during machine creation: Could not convert the UUID to MAC address: exit status 1
```

Then the following may resolve the `minikube start --vm-driver=xhyve` issue:
```
rm -rf ~/.minikube
sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
```
-->

<!--
Now set the Minikube context. The context is what determines which cluster
`kubectl` is interacting with. You can see all your available contexts in the
`~/.kube/config` file.

```shell
kubectl config use-context minikube
```

Verify that `kubectl` is configured to communicate with your cluster:

```shell
kubectl cluster-info
```

Open the Kubernetes dashboard in a browser:

```shell
minikube dashboard
```
-->
现在设置 Minikube 上下文。这个上下文决定了 `kubectl` 与哪个集群进行交互。您可以在 `~/.kube/config` 文件里查看所有可用的上下文。

```shell
kubectl config use-context minikube
```
验证 `kubectl` 配置好了可以与您的集群通信：

```shell
kubectl cluster-info
```

在浏览器打开 Kubernetes dashboard：

```shell
minikube dashboard
```

<!--
## Create your Node.js application

The next step is to write the application. Save this code in a folder named `hellonode`
with the filename `server.js`:

{{< codenew language="js" file="minikube/server.js" >}}

Run your application:

```shell
node server.js
```
-->

## 创建您的 Node.js 应用程序

下一步是编写应用程序。保存代码在 `hellonode` 目录下的 `server.js` 文件中：

{{< codenew language="js" file="minikube/server.js" >}}

运行您的程序：

```shell
node server.js
```

<!--
You should be able to see your "Hello World!" message at http://localhost:8080/.

Stop the running Node.js server by pressing **Ctrl-C**.

The next step is to package your application in a Docker container.
-->
您应该可以在 http://localhost:8080/ 上看到 "Hello World!" 信息。

按下 **Ctrl-C** 终止 Node.js 服务器。

下一步是将您的程序打包在一个 Docker 容器中。

<!--
## Create a Docker container image

Create a file, also in the `hellonode` folder, named `Dockerfile`. A Dockerfile describes
the image that you want to build. You can build a Docker container image by extending an
existing image. The image in this tutorial extends an existing Node.js image.

{{< codenew language="conf" file="minikube/Dockerfile" >}}

This recipe for the Docker image starts from the official Node.js LTS image
found in the Docker registry, exposes port 8080, copies your `server.js` file
to the image and starts the Node.js server.

Because this tutorial uses Minikube, instead of pushing your Docker image to a
registry, you can simply build the image using the same Docker host as
the Minikube VM, so that the images are automatically present. To do so, make
sure you are using the Minikube Docker daemon:

```shell
eval $(minikube docker-env)
```

{{< note >}}
**Note:** Later, when you no longer wish to use the Minikube host, you can undo
this change by running `eval $(minikube docker-env -u)`.
{{< /note >}}

Build your Docker image, using the Minikube Docker daemon (mind the trailing dot):

```shell
docker build -t hello-node:v1 .
```

Now the Minikube VM can run the image you built.
-->
## 创建一个 Docker 镜像

创建一个名为 Dockerfile` 的文件，也放到 `hellonode` 目录下。Dockerfile 文件描述了您想构建的镜像。您可以通过基于已经存在的镜像来构建新的 Docker 镜像。在本教程中的镜像是一个已经存在的 Node.js 镜像。

{{< codenew language="conf" file="minikube/Dockerfile" >}}

<!--
## Create a Deployment

A Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.

Use the `kubectl run` command to create a Deployment that manages a Pod. The
Pod runs a Container based on your `hello-node:v1` Docker image. Set the 
`--image-pull-policy` flag to `Never` to always use the local image, rather than
pulling it from your Docker registry (since you haven't pushed it there):
-->

## 创建一个 Deployment

Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) 是一组一个或者多个容器，为了管理和网络的目的而绑定在一起。在本教程中的 Pod 只有一个容器。Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) 会检查您的 Pod 的健康状况，如果 Pod 的容器终止了会重启它。推荐使用 Deployments 管理 Pod 的创建和伸缩。

使用 `kubectl run` 命令去创建管理一个 Pod 的 Deployment。这个 Pod 运行了一个基于您的 `hello-node:v1` Docker 镜像的容器。设置 `--image-pull-policy` 参数为 `Never` 永远使用本地的镜像，而不是从 Docker registry 中拉取(因为您从未 push 到那里)：

```shell
kubectl run hello-node --image=hello-node:v1 --port=8080 --image-pull-policy=Never
```

<!--
View the Deployment:
-->
查看这个 Deployment:

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
查看这个 Pod：

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
想要了解更多关于 `kubectl` 命令，查看 [kubectl overview](/docs/user-guide/kubectl-overview/) 。


<!--
## Create a Service

By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).

From your development machine, you can expose the Pod to the public internet
using the `kubectl expose` command:
-->

## 创建一个 Service

默认情况下，Pod 在 Kubernetes 集群内部只能通过它的内部 IP 地址来访问。为了能在 Kubernetes 虚拟网络外部可以访问到这个 `hello-node` 容器，您必须将这个 Pod 通过 Kubernetes [*Service*](/docs/concepts/services-networking/service/) 暴露出来。

从您的开发机器，您可以使用 `kubectl expose` 命令将这个 Pod 暴露到公网上。

```shell
kubectl expose deployment hello-node --type=LoadBalancer
```

<!--
View the Service you just created:
-->
查看您刚刚创建的 Service：

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
`--type=LoadBalancer` 参数表示您想在集群的外部暴露您的 Service。在支持负载均衡的云厂商上，将配置外部 IP 地址以便访问这个 Service。在 Minikube 中 `LoadBalancer` 类型通过 `minikube service` 命令使这个 Service 可以被访问。

```shell
minikube service hello-node
```

<!--
This automatically opens up a browser window using a local IP address that
serves your app and shows the "Hello World" message.

Assuming you've sent requests to your new web service using the browser or curl,
you should now be able to see some logs:
-->

这将使用本地 IP 地址自动打开浏览器窗口为您的应用程序提供服务并显示 "Hello World" 消息。

假设您已使用浏览器或 curl 向您的新 Web 服务发送请求，您现在应该能够看到一些日志：

```shell
kubectl logs <POD-NAME>
```

<!--
## Update your app

Edit your `server.js` file to return a new message:

```javascript
response.end('Hello World Again!');

```

Build a new version of your image (mind the trailing dot):

```shell
docker build -t hello-node:v2 .
```

Update the image of your Deployment:

```shell
kubectl set image deployment/hello-node hello-node=hello-node:v2
```

Run your app again to view the new message:

```shell
minikube service hello-node
```
-->
## 更新您的应用

编辑您的 `server.js` 文件，使其返回一条消息：

```javascript
response.end('Hello World Again!');

```

构建新版本的镜像(注意结尾的点)：

```shell
docker build -t hello-node:v2 .
```

更新 Deployment 中的镜像：

```shell
kubectl set image deployment/hello-node hello-node=hello-node:v2
```

再次运行您的程序查看新的消息：

```shell
minikube service hello-node
```

<!--
## Enable addons

Minikube has a set of built-in addons that can be enabled, disabled and opened in the local Kubernetes environment.

First list the currently supported addons:

```shell
minikube addons list
```

Output:

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
-->
## 启用 addons

Minikube 有一些内置的 addons 可以被启用，禁用和打开在本地的 Kubernetes 环境中。

首先列举下当前支持的 addons:

```shell
minikube addons list
```

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
Minikube must be running for these commands to take effect. To enable `heapster` addon, for example:

```shell
minikube addons enable heapster
```

Output:

```shell
heapster was successfully enabled
```
-->
Minikube 必须运行这些命令才能生效。例如，启用 `heapster` addon：

```shell
minikube addons enable heapster
```

输出：

```shell
heapster was successfully enabled
```
<!--
View the Pod and Service you just created:

```shell
kubectl get po,svc -n kube-system
```

Output:

```shell
NAME                             READY     STATUS    RESTARTS   AGE
po/heapster-zbwzv                1/1       Running   0          2m
po/influxdb-grafana-gtht9        2/2       Running   0          2m

NAME                       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)             AGE
svc/heapster               NodePort    10.0.0.52    <none>        80:31655/TCP        2m
svc/monitoring-grafana     NodePort    10.0.0.33    <none>        80:30002/TCP        2m
svc/monitoring-influxdb    ClusterIP   10.0.0.43    <none>        8083/TCP,8086/TCP   2m
```
-->
查看您刚才创建的 Pod 和 Service：

```shell
kubectl get po,svc -n kube-system
```

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

```shell
minikube addons open heapster
```

Output:

```shell
Opening kubernetes service kube-system/monitoring-grafana in default browser...
```
-->
在浏览器中打开 endpoint 去和 heapster 交互：

```shell
minikube addons open heapster
```

输出：

```shell
Opening kubernetes service kube-system/monitoring-grafana in default browser...
```

<!--
## Clean up

Now you can clean up the resources you created in your cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Optionally, force removal of the Docker images created:

```shell
docker rmi hello-node:v1 hello-node:v2 -f
```

Optionally, stop the Minikube VM:

```shell
minikube stop
eval $(minikube docker-env -u)
```

Optionally, delete the Minikube VM:

```shell
minikube delete
```
-->
## 清理

现在您可以清理您在集群中创建的资源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

另外，可以强制清除创建的 Docker 镜像：

```shell
docker rmi hello-node:v1 hello-node:v2 -f
```

另外，可以停止 Minikube VM：

```shell
minikube stop
eval $(minikube docker-env -u)
```

另外, 可以删除 Minikube VM：

```shell
minikube delete
```

{{% /capture %}}


{{% capture whatsnext %}}

<!--
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/user-guide/deploying-applications/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).
-->

* 学习更多关于 [Deployment 对象](/docs/concepts/workloads/controllers/deployment/)。
* 学习更多关于 [部署应用程序](/docs/user-guide/deploying-applications/)。
* 学习更多关于 [Service 对象](/docs/concepts/services-networking/service/)。


{{% /capture %}}


