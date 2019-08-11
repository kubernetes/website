---
title: 你好 Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs "Hello World" for Node.js.</p>
card:
  name: tutorials
  weight: 10
---
<!--
---
title: Hello Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs "Hello World" for Node.js.</p>
card:
  name: tutorials
  weight: 10
---
-->

{{% capture overview %}}
<!--
This tutorial shows you how to run a simple Hello World Node.js app
on Kubernetes using [Minikube](/docs/getting-started-guides/minikube) and Katacoda.
Katacoda provides a free, in-browser Kubernetes environment.
-->
本教程向您展示如何使用 [Minikube](/docs/getting-started-guides/minikube) 和 Katacoda 在 Kubernetes 上运行一个简单的 “Hello World” Node.js 应用程序。Katacoda 提供免费的浏览器内 Kubernetes 环境。

{{< note >}}
<!--
You can also follow this tutorial if you've installed [Minikube locally](/docs/tasks/tools/install-minikube/).
-->
如果您已在本地安装 [Minikube](/docs/tasks/tools/install-minikube/)，也可以按照本教程操作。

{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}
<!--
* Deploy a hello world application to Minikube.
* Run the app.
* View application logs.
-->
* 将 "Hello World" 应用程序部署到 Minikube。
* 运行应用程序。
* 查看应用日志

{{% /capture %}}

{{% capture prerequisites %}}
<!--
This tutorial provides a container image built from the following files:
-->
本教程提供了从以下文件构建的容器镜像：

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}
<!--
For more information on the `docker build` command, read the [Docker documentation](https://docs.docker.com/engine/reference/commandline/build/).
-->
有关 `docker build` 命令的更多信息，请参阅 [Docker 文档](https://docs.docker.com/engine/reference/commandline/build/)。

{{% /capture %}}

{{% capture lessoncontent %}}

<!--
## Create a Minikube cluster

1. Click **Launch Terminal**

    {{< kat-button >}}

    {{< note >}}If you installed Minikube locally, run `minikube start`.{{< /note >}}

2. Open the Kubernetes dashboard in a browser:

    ```shell
    minikube dashboard
    ```

3. Katacoda environment only: At the top of the terminal pane, click the plus sign, and then click **Select port to view on Host 1**.

4. Katacoda environment only: Type `30000`, and then click **Display Port**.
-->
## 创建 Minikube 集群

1. 点击 **启动终端**
    {{< kat-button >}}

    {{< note >}}如果您本地安装了 Minikube, 运行 `minikube start`.{{< /note >}}

2. 在浏览器中打开 Kubernetes dashboard：

    ```shell
    minikube dashboard
    ```

3. 仅限 Katacoda 环境：在终端窗口的顶部，单击加号，然后单击 **选择要在主机 1 上查看的端口**。

4. 仅限 Katacoda 环境：输入“30000”，然后单击 **显示端口**。

<!--
## Create a Deployment

A Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.

1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
Pod runs a Container based on the provided Docker image.

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. View the Deployment:

    ```shell
    kubectl get deployments
    ```

    Output:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. View the Pod:

    ```shell
    kubectl get pods
    ```
    Output:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. View cluster events:

    ```shell
    kubectl get events
    ```

5. View the `kubectl` configuration:

    ```shell
    kubectl config view
    ```

    {{< note >}}For more information about `kubectl`commands, see the [kubectl overview](/docs/user-guide/kubectl-overview/).{{< /note >}}
-->
## 创建 Deployment

Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) 是由一个或多个容器为了管理和联网的目的而绑定在一起构成的组。本教程中的 Pod 只有一个容器。Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/) 检查 Pod 的健康状况，并在 Pod 中的容器终止的情况下重新启动新的容器。Deployment 是管理 Pod 创建和扩展的推荐方法。

1. 使用 `kubectl create` 命令创建管理 Pod 的 Deployment。该 Pod 根据提供的 Docker 镜像运行 Container。

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. 查看 Deployment：

    ```shell
    kubectl get deployments
    ```

    输出:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. 查看 Pod：

    ```shell
    kubectl get pods
    ```
    输出:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. 查看集群事件：

    ```shell
    kubectl get events
    ```

5. 查看 `kubectl` 配置：

    ```shell
    kubectl config view
    ```
    {{< note >}}有关 kubectl 命令的更多信息，请参阅 [kubectl 概述](/docs/user-guide/kubectl-overview/)。{{< /note >}}

<!--
## Create a Service

By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).

1. Expose the Pod to the public internet using the `kubectl expose` command:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    The `--type=LoadBalancer` flag indicates that you want to expose your Service
    outside of the cluster.

2. View the Service you just created:

    ```shell
    kubectl get services
    ```

    Output:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    On cloud providers that support load balancers,
    an external IP address would be provisioned to access the Service. On Minikube,
    the `LoadBalancer` type makes the Service accessible through the `minikube service`
    command.

3. Run the following command:

    ```shell
    minikube service hello-node
    ```

4. Katacoda environment only: Click the plus sign, and then click **Select port to view on Host 1**.

5. Katacoda environment only: Type `30369` (see port opposite to `8080` in services output), and then click

    This opens up a browser window that serves your app and shows the "Hello World" message.
-->
## 创建 Service

默认情况下，Pod 只能通过 Kubernetes 集群中的内部 IP 地址访问。要使得 `hello-node` 容器可以从 Kubernetes 虚拟网络的外部访问，您必须将 Pod 暴露为 Kubernetes [*Service*](/docs/concepts/services-networking/service/)。

1. 使用 `kubectl expose` 命令将 Pod 暴露给公网：

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    The `--type=LoadBalancer` flag indicates that you want to expose your Service
    outside of the cluster.

2. 查看您刚刚创建的服务:

    ```shell
    kubectl get services
    ```

    输出:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    在支持负载均衡器的云服务提供商上，将提供一个外部 IP 来访问该服务。在 Minikube 上，`LoadBalancer` 使得服务可以通过命令 `minikube service` 访问。

3. 运行下面的命令：

    ```shell
    minikube service hello-node
    ```

4. 仅限 Katacoda 环境：单击加号，然后单击 **选择要在主机 1 上查看的端口**。

5. 仅限 Katacoda 环境：输入 `30369`（请参阅服务输出中与 `8080` 相对的端口），然后单击

    这将打开一个浏览器窗口，为您的应用程序提供服务并显示 “Hello World” 消息。

<!--
## Enable addons

Minikube has a set of built-in addons that can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:

    ```shell
    minikube addons list
    ```

    Output:

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

2. Enable an addon, for example, `heapster`:

    ```shell
    minikube addons enable heapster
    ```

    Output:

    ```shell
    heapster was successfully enabled
    ```

3. View the Pod and Service you just created:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Output:

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

4. Disable `heapster`:

    ```shell
    minikube addons disable heapster
    ```

    Output:

    ```shell
    heapster was successfully disabled
    ```
-->
## 启用插件

Minikube 有一组内置的插件，可以在本地 Kubernetes 环境中启用、禁用和打开。

1. 列出当前支持的插件：

    ```shell
    minikube addons list
    ```

    输出:

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

2. 启用插件，例如 `heapster`：

    ```shell
    minikube addons enable heapster
    ```

    输出:

    ```shell
    heapster was successfully enabled
    ```

3. 查看刚才创建的 Pod 和 Service：

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    输出:

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

4. 禁用 `heapster`：

    ```shell
    minikube addons disable heapster
    ```

    输出:

    ```shell
    heapster was successfully disabled
    ```

<!--
## Clean up

Now you can clean up the resources you created in your cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Optionally, stop the Minikube virtual machine (VM):

```shell
minikube stop
```

Optionally, delete the Minikube VM:

```shell
minikube delete
```
-->
## 清理

现在可以清理您在集群中创建的资源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

可以停止 Minikube VM：

```shell
minikube stop
```

或者，删除 Minikube VM：

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
* 进一步了解 [Deployment 对象](/docs/concepts/workloads/controllers/deployment/)。
* 学习更多关于 [部署应用](/docs/user-guide/deploying-applications/)。
* 学习更多关于 [Service 对象](/docs/concepts/services-networking/service/)。

{{% /capture %}}
