---
title: 你好，Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---
<!--
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
-->

<!-- overview -->

<!--
This tutorial shows you how to run a sample app on Kubernetes using minikube.
The tutorial provides a container image that uses NGINX to echo back all the requests.
-->
本教程向你展示如何使用 Minikube 在 Kubernetes 上运行一个应用示例。
教程提供了容器镜像，使用 NGINX 来对所有请求做出回应。

## {{% heading "objectives" %}}

<!--
* Deploy a sample application to minikube.
* Run the app.
* View application logs.
-->
* 将一个示例应用部署到 Minikube。
* 运行应用程序。
* 查看应用日志。

## {{% heading "prerequisites" %}}

<!--
This tutorial assumes that you have already set up `minikube`.
See __Step 1__ in [minikube start](https://minikube.sigs.k8s.io/docs/start/) for installation instructions.
-->
本教程假设你已经安装了 `minikube`。
有关安装说明，请参阅 [minikube start](https://minikube.sigs.k8s.io/docs/start/) 的**步骤 1**。

{{< note >}}
<!--
Only execute the instructions in __Step 1, Installation__. The rest is covered on this page.
-->
仅执行**步骤 1：安装**中的说明，其余内容均包含在本页中。
{{< /note >}}

<!--
You also need to install `kubectl`.
See [Install tools](/docs/tasks/tools/#kubectl) for installation instructions.
-->
你还需要安装 `kubectl`。
有关安装说明，请参阅[安装工具](/zh-cn/docs/tasks/tools/#kubectl)。

<!-- lessoncontent -->

<!--
## Create a minikube cluster
-->
## 创建 Minikube 集群  {#create-a-minikube-cluster}

```shell
minikube start
```

<!--
## Open the Dashboard

Open the Kubernetes dashboard. You can do this two different ways:
-->
## 打开仪表板  {#open-the-dashboard}

打开 Kubernetes 仪表板。你可以通过两种不同的方式执行此操作：

{{< tabs name="dashboard" >}}
{{% tab name="启动浏览器" %}}
<!--
Open a **new** terminal, and run:
-->
打开一个**新的**终端，然后运行：

```shell
# 启动一个新的终端，并保持此命令运行。
minikube dashboard
```

<!--
Now, switch back to the terminal where you ran `minikube start`.
-->
现在，切换回运行 `minikube start` 的终端。

<!--
The `dashboard` command enables the dashboard add-on and opens the proxy in the default web browser.
You can create Kubernetes resources on the dashboard such as Deployment and Service.

To find out how to avoid directly invoking the browser from the terminal and get a URL for the web dashboard, see the "URL copy and paste" tab.

By default, the dashboard is only accessible from within the internal Kubernetes virtual network.
The `dashboard` command creates a temporary proxy to make the dashboard accessible from outside the Kubernetes virtual network.

To stop the proxy, run `Ctrl+C` to exit the process.
After the command exits, the dashboard remains running in the Kubernetes cluster.
You can run the `dashboard` command again to create another proxy to access the dashboard.
-->
{{< note >}}
`dashboard` 命令启用仪表板插件，并在默认的 Web 浏览器中打开代理。
你可以在仪表板上创建 Kubernetes 资源，例如 Deployment 和 Service。

要了解如何避免从终端直接调用浏览器并获取 Web 仪表板的 URL，请参阅
"URL 复制和粘贴"选项卡。

默认情况下，仪表板只能从内部 Kubernetes 虚拟网络中访问。
`dashboard` 命令创建一个临时代理，使仪表板可以从 Kubernetes 虚拟网络外部访问。

要停止代理，请运行 `Ctrl+C` 退出该进程。仪表板仍在运行中。
命令退出后，仪表板仍然在 Kubernetes 集群中运行。
你可以再次运行 `dashboard` 命令创建另一个代理来访问仪表板。
{{< /note >}}

{{% /tab %}}
{{% tab name="URL 复制粘贴" %}}

<!--
If you don't want minikube to open a web browser for you, run the `dashboard` subcommand with the
`--url` flag. `minikube` outputs a URL that you can open in the browser you prefer:

Open a **new** terminal, and run:
-->
如果你不想 Minikube 为你打开 Web 浏览器，可以使用 `--url` 标志运行 `dashboard` 子命令。
`minikube` 会输出一个 URL，你可以在你喜欢的浏览器中打开该 URL。

打开一个**新的**终端，然后运行：

```shell
# 启动一个新的终端，并保持此命令运行。
minikube dashboard --url
```

<!--
Now, you can use this URL and switch back to the terminal where you ran `minikube start`.
-->
现在，你可以使用此 URL 并切换回运行 `minikube start` 的终端。

{{% /tab %}}
{{< /tabs >}}

<!--
## Create a Deployment

A Kubernetes [*Pod*](/docs/concepts/workloads/pods/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.
-->
## 创建 Deployment  {#create-a-deployment}

Kubernetes [**Pod**](/zh-cn/docs/concepts/workloads/pods/)
是由一个或多个为了管理和联网而绑定在一起的容器构成的组。本教程中的 Pod 只有一个容器。
Kubernetes [**Deployment**](/zh-cn/docs/concepts/workloads/controllers/deployment/)
检查 Pod 的健康状况，并在 Pod 中的容器终止的情况下重新启动新的容器。
Deployment 是管理 Pod 创建和扩展的推荐方法。

<!--
1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
   Pod runs a Container based on the provided Docker image.
-->
1. 使用 `kubectl create` 命令创建管理 Pod 的 Deployment。该 Pod 根据提供的 Docker
   镜像运行容器。

   ```shell
   # 运行包含 Web 服务器的测试容器镜像
   kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
   ```

<!--
1. View the Deployment:
-->
2. 查看 Deployment：

   ```shell
   kubectl get deployments
   ```

   <!--
   The output is similar to:
   -->

   输出结果类似于这样：

   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   hello-node   1/1     1            1           1m
   ```

   <!--
   (It may take some time for the pod to become available. If you see "0/1", try again in a few seconds.)
   -->
   （该 Pod 可能需要一些时间才能变得可用。如果你在输出结果中看到 “0/1”，请在几秒钟后重试。）

<!--
1. View the Pod:
-->
3. 查看 Pod：

   ```shell
   kubectl get pods
   ```

   <!--
   The output is similar to:
   -->

   输出结果类似于这样：

   ```
   NAME                          READY     STATUS    RESTARTS   AGE
   hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
   ```

<!--
1. View cluster events:
-->
4. 查看集群事件：

   ```shell
   kubectl get events
   ```

<!--
1. View the `kubectl` configuration:
-->
5. 查看 `kubectl` 配置：

   ```shell
   kubectl config view
   ```

<!--
1. View application logs for a container in a pod (replace pod name with the one you got from `kubectl get pods`).
-->
6. 查看 Pod 中容器的应用程序日志（将 Pod 名称替换为你用 `kubectl get pods` 命令获得的名称）。

   {{< note >}}
   <!--
   Replace `hello-node-5f76cf6ccf-br9b5` in the `kubectl logs` command with the name of the pod from the `kubectl get pods` command output.
   -->
   将 `kubectl logs` 命令中的 `hello-node-5f76cf6ccf-br9b5` 替换为 `kubectl get pods` 命令输出中的 Pod 名称。
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```
   
   <!--
   The output is similar to:
   -->
   输出类似于：

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
<!--
For more information about `kubectl` commands, see the [kubectl overview](/docs/reference/kubectl/).
-->
有关 `kubectl` 命令的更多信息，请参阅 [kubectl 概述](/zh-cn/docs/reference/kubectl/)。
{{< /note >}}

<!--
## Create a Service

By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).
-->
## 创建 Service  {#create-a-service}

默认情况下，Pod 只能通过 Kubernetes 集群中的内部 IP 地址访问。
要使得 `hello-node` 容器可以从 Kubernetes 虚拟网络的外部访问，你必须将 Pod
通过 Kubernetes [**Service**](/zh-cn/docs/concepts/services-networking/service/) 公开出来。

{{< warning >}}
<!--
The agnhost container has a `/shell` endpoint, which is useful for
debugging, but dangerous to expose to the public internet. Do not run this on an
internet-facing cluster, or a production cluster.
-->
agnhost 容器有一个 `/shell` 端点，对于调试很有帮助，但暴露给公共互联网很危险。
请勿在面向互联网的集群或生产集群上运行它。
{{< /warning >}}

<!--
1. Expose the Pod to the public internet using the `kubectl expose` command:
-->
1. 使用 `kubectl expose` 命令将 Pod 暴露给公网：

   ```shell
   kubectl expose deployment hello-node --type=LoadBalancer --port=8080
   ```

   <!--
   The `--type=LoadBalancer` flag indicates that you want to expose your Service
   outside of the cluster.

   The application code inside the test image only listens on TCP port 8080. If you used
   `kubectl expose` to expose a different port, clients could not connect to that other port.
   -->

   这里的 `--type=LoadBalancer` 参数表明你希望将你的 Service 暴露到集群外部。

   测试镜像中的应用程序代码仅监听 TCP 8080 端口。
   如果你用 `kubectl expose` 暴露了其它的端口，客户端将不能访问其它端口。

<!--
2. View the Service you created:
-->
2. 查看你创建的 Service：

   ```shell
   kubectl get services
   ```

   <!--
   The output is similar to:
   -->

   输出结果类似于这样：

   ```
   NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
   hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
   kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
   ```

   <!--
   On cloud providers that support load balancers,
   an external IP address would be provisioned to access the Service. On minikube,
   the `LoadBalancer` type makes the Service accessible through the `minikube service`
   command.
   -->

   对于支持负载均衡器的云服务平台而言，平台将提供一个外部 IP 来访问该服务。
   在 Minikube 上，`LoadBalancer` 使得服务可以通过命令 `minikube service` 访问。

<!--
3. Run the following command:
-->
3. 运行下面的命令：

   ```shell
   minikube service hello-node
   ```

   <!--
   This opens up a browser window that serves your app and shows the app's response.
   -->
   这将打开一个浏览器窗口，为你的应用程序提供服务并显示应用的响应。

<!--
## Enable addons

The minikube tool includes a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}}
hat can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:
-->
## 启用插件   {#enable-addons}

Minikube 有一组内置的{{< glossary_tooltip text="插件" term_id="addons" >}}，
可以在本地 Kubernetes 环境中启用、禁用和打开。

1. 列出当前支持的插件：

   ```shell
   minikube addons list
   ```

   <!--
   The output is similar to:
   -->
   输出结果类似于这样：

   ```
   addon-manager: enabled
   dashboard: enabled
   default-storageclass: enabled
   efk: disabled
   freshpod: disabled
   gvisor: disabled
   helm-tiller: disabled
   ingress: disabled
   ingress-dns: disabled
   logviewer: disabled
   metrics-server: disabled
   nvidia-driver-installer: disabled
   nvidia-gpu-device-plugin: disabled
   registry: disabled
   registry-creds: disabled
   storage-provisioner: enabled
   storage-provisioner-gluster: disabled
   ```

<!--
1. Enable an addon, for example, `metrics-server`:
-->
2. 启用插件，例如 `metrics-server`：

   ```shell
   minikube addons enable metrics-server
   ```

   <!--
   The output is similar to:
   -->

   输出结果类似于这样：

   ```
   The 'metrics-server' addon is enabled
   ```

<!--
1. View the Pod and Service you created by installing that addon:
-->
3. 查看通过安装该插件所创建的 Pod 和 Service：

   ```shell
   kubectl get pod,svc -n kube-system
   ```

   <!--
   The output is similar to:
   -->

   输出结果类似于这样：

   ```
   NAME                                        READY     STATUS    RESTARTS   AGE
   pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
   pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
   pod/metrics-server-67fb648c5                1/1       Running   0          26s
   pod/etcd-minikube                           1/1       Running   0          34m
   pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
   pod/kube-addon-manager-minikube             1/1       Running   0          34m
   pod/kube-apiserver-minikube                 1/1       Running   0          34m
   pod/kube-controller-manager-minikube        1/1       Running   0          34m
   pod/kube-proxy-rnlps                        1/1       Running   0          34m
   pod/kube-scheduler-minikube                 1/1       Running   0          34m
   pod/storage-provisioner                     1/1       Running   0          34m

   NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
   service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
   service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
   service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
   service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
   ```

<!--
1. Check the output from `metrics-server`:
-->
4. 检查 `metrics-server` 的输出：

   ```shell
   kubectl top pods
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```
   NAME                         CPU(cores)   MEMORY(bytes)   
   hello-node-ccf4b9788-4jn97   1m           6Mi             
   ```

   <!--
   If you see the following message, wait, and try again:
   -->
   如果你看到以下消息，请等待并重试：

   ```
   error: Metrics API not available
   ```

<!--
1. Disable `metrics-server`:
--->
5. 禁用 `metrics-server`：

   ```shell
   minikube addons disable metrics-server
   ```

   <!--
   The output is similar to:
   -->

   输出结果类似于这样：

   ```
   metrics-server was successfully disabled
   ```

<!--
## Clean up

Now you can clean up the resources you created in your cluster:
-->
## 清理  {#clean-up}

现在可以清理你在集群中创建的资源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

<!--
Stop the Minikube cluster
-->
停止 Minikube 集群：

```shell
minikube stop
```

<!--
Optionally, delete the Minikube VM:
-->
可选地，删除 Minikube 虚拟机（VM）：

```shell
# 可选的
minikube delete
```

<!--
If you want to use minikube again to learn more about Kubernetes, you don't need to delete it.
-->
如果你还想使用 Minikube 进一步学习 Kubernetes，那就不需要删除 Minikube。

<!--
## Conclusion

This page covered the basic aspects to get a minikube cluster up and running. You are now ready to deploy applications.
-->
## 结论

本页介绍了启动和运行 minikube 集群的基本知识，现在部署应用的准备工作已经完成。

## {{% heading "whatsnext" %}}

<!--
* Tutorial to _[deploy your first app on Kubernetes with kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).
-->
* [使用 kubectl 在 Kubernetes 上部署你的第一个应用程序](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)教程。
* 进一步了解 [Deployment 对象](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
* 进一步了解[部署应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)。
* 进一步了解 [Service 对象](/zh-cn/docs/concepts/services-networking/service/)。
