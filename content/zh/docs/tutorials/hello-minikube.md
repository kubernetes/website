---
title: 你好 Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "开始"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs "Hello World" for Node.js.</p>
      <>准备好动手了吗？构建一个简单的 Kubernetes 集群，为 Node.js 运行 “Hello World”。
---

<!--
title: Hello Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs "Hello World" for Node.js.</p>
---
-->

{{% capture overview %}}

<!--
This tutorial shows you how to run a simple Hello World Node.js app
on Kubernetes using [Minikube](/docs/getting-started-guides/minikube) and Katacoda.
Katacoda provides a free, in-browser Kubernetes environment. 
-->
本教程向您展示如何运行一个简单的 Hello World Node.js 应用程序
在 Kubernetes 上使用 [Minikube](/docs/get -start -guides/Minikube) 和 Katacoda。
Katacoda 提供了一个免费的浏览器内 Kubernetes 环境。

{{< note >}}

<!--
You can also follow this tutorial if you've installed [Minikube locally](/docs/tasks/tools/install-minikube/).
-->
如果您在本地安装了[Minikube](/docs/tasks/tools/install-minikube/)，也可以学习本教程。

{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

<!--
* Deploy a hello world application to Minikube.
* Run the app.
* View application logs.
-->

* 将 hello world 应用程序部署到 Minikube。
* 运行应用程序。
* 查看应用日志。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
This tutorial provides a container image built from the following files:
-->
本教程提供了一个由以下文件构建的容器镜像：

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

<!--
For more information on the `docker build` command, read the [Docker documentation](https://docs.docker.com/engine/reference/commandline/build/).
-->
有关 `docker build` 命令的更多信息，请阅读 [docker 文档](https://docs.docker.com/engine/reference/commandline/build/)。

{{% /capture %}}

{{% capture lessoncontent %}}

<!--
## Create a Minikube cluster
-->

## 创建 Minikube 集群

<!--
1. Click **Launch Terminal** 
-->
1. 点击 **Launch Terminal** 

    {{< kat-button >}}

    {{< note >}}如果您在本地安装了 Minikube，请运行 `minikube start`。{{< /note >}}

<!--
2. Open the Kubernetes dashboard in a browser:
-->
2. 在浏览器中打开 Kubernetes 仪表盘：

    ```shell
    minikube dashboard
    ```

<!--
3. Katacoda environment only: At the top of the terminal pane, click the plus sign, and then click **Select port to view on Host 1**.

4. Katacoda environment only: Type 30000, and then click **Display Port**. 

## Create a Deployment
-->

3. 仅限 Katacoda 环境: 在终端窗口的顶部，单击加号，然后单击 **Select port** 查看主机 1。

4. 仅限 Katacoda 环境: 输出 30000, 然后点击 **Display Port**. 

## 创建 Deployment


<!--
A Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.
-->
Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) 是一组一个或多个容器，为了管理网络的目的而捆绑在一起。
本教程中的 Pod 只有一个容器。
Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/) 检查 Pod 的健康状况，如果它终止了，则重新启动 Pod 的容器。
Deployment 是管理 Pod 的创建和扩展的推荐方法。

<!--
1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
Pod runs a Container based on the provided Docker image. 
-->
1. 使用 `kubectl create` 命令创建管理 pod 的 Deployment，Pod 根据提供的 Docker 镜像运行容器。

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node --port=8080
    ```

<!--
2. View the Deployment:
-->
2. 查看 Deployment：

    ```shell
    kubectl get deployments
    ```
<!--
    Output:
-->
    输出：

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

<!--
3. View the Pod:
-->
3. 查看 Pod：

    ```shell
    kubectl get pods
    ```
    
<!--
    Output:
-->

    输出:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

<!--
4. View cluster events:
-->
4. 查看集群事件：


    ```shell
    kubectl get events
    ```

<!--
5. View the `kubectl` configuration:
-->
5. 查看 `kubectl` 配置：

    ```shell
    kubectl config view
    ```
  
<!--  
    {{< note >}}For more information about `kubectl`commands, see the [kubectl overview](/docs/user-guide/kubectl-overview/).{{< /note >}}
-->
    {{< note >}}有关 `kubectl` 命令的更多信息，请参考 [kubectl 概述](/docs/user-guide/kubectl-overview/)。{{< /note >}}

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
在默认情况下，Pod 只能通过其内部 IP 地址访问 Kubernetes 集群。
使 `hello-node` 容器可以从 Kubernetes 虚拟网络外部访问，您必须将 Pod 公开 Kubernetes [*Service*](/docs/concepts/services-networking/service/)。

<!--
1. Expose the Pod to the public internet using the `kubectl expose` command:
-->
1. 使用 `kubectl expose` 命令将 Pod 暴露给公共互联网：

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer
    ```

<!--
    The `--type=LoadBalancer` flag indicates that you want to expose your Service
    outside of the cluster.
-->
    `--type=LoadBalancer` 参数表示希望在集群外部公开 Service。


<!--
2. View the Service you just created:
-->
2. 查看刚创建的 Service:

    ```shell
    kubectl get services
    ```

<!--
    Output:
-->
    输出：

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

<!--
    On cloud providers that support load balancers,
    an external IP address would be provisioned to access the Service. On Minikube,
    the `LoadBalancer` type makes the Service accessible through the `minikube service`
    command.
-->
    在支持负载均衡的云供应商上，将提供一个外部 IP 地址来访问服务。
    在 Minikube 上，`LoadBalancer` 类型使服务可通过 `minikube service` 命令访问。

<!--
3. Run the following command:
-->
3. 运行以下命令：

    ```shell
    minikube service hello-node
    ```

<!--
4. Katacoda environment only: Click the plus sign, and then click **Select port to view on Host 1**.

5. Katacoda environment only: Type in the Port number following `8080:`, and then click **Display Port**. 

    This opens up a browser window that serves your app and shows the "Hello World" message.

-->

4. 仅限 Katacoda 环境: 点击加号，然后点击 **Select port** 查看主机 1.

5. 仅限 Katacoda 环境: 在 `8080:` 后面输入端口号，然后单击 **Display Port**。 

    这将打开一个浏览器窗口，为您的应用程序提供服务，并显示 "Hello World" 消息。


<!--
## Enable addons

Minikube has a set of built-in addons that can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:
-->

## 启用插件

Minikube 有一组内置插件，可以在本地 Kubernetes 环境中启用，禁用和打开。

1. 列出当前支持的插件：


    ```shell
    minikube addons list
    ```

<!--
    Output:
-->
    输出：

    ```shell
    addon-manager: enabled
    coredns: disabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    heapster: disabled
    ingress: disabled
    kube-dns: enabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    ```

<!--
2. Enable an addon, for example, `heapster`:
-->
2. 启用插件，例如 `heapster`：

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
3. View the Pod and Service you just created:
-->
3. 查看刚创建的 Pod 和 Service：

    ```shell
    kubectl get pod,svc -n kube-system
    ```

<!--
    Output:
-->
    输出：

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/heapster-9jttx                          1/1       Running   0          26s
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-dns-6dcb57bcc8-gv7mw               3/3       Running   0          34m
    pod/kubernetes-dashboard-5498ccf677-cgspw   1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/heapster               ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/kubernetes-dashboard   NodePort    10.109.29.1     <none>        80:30000/TCP        34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

<!--
4. Disable `heapster`:
-->
4. 禁用 `heapster`：

    ```shell
    minikube addons disable heapster
    ```

<!--
    Output:
-->
    输出：

    ```shell
    heapster was successfully disabled
    ```

<!--
## Clean up
-->

## 清理

<!--
Now you can clean up the resources you created in your cluster:
-->
现在您可以清理在集群中创建的资源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

<!--
Optionally, stop the Minikube virtual machine (VM):
-->
（可选）停止 Minikube 虚拟机（VM）：

```shell
minikube stop
```

<!--
Optionally, delete the Minikube VM:
-->
（可选）删除 Minikube 虚拟机（VM）：

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

* 了解更多关于 [Deployment 对象](/docs/concepts/workloads/controllers/deployment/)。
* 了解更多关于 [Deploying 应用程序](/docs/user-guide/deploying-applications/)。
* 了解更多关于 [Service 对象](/docs/concepts/services-networking/service/)。

{{% /capture %}}
