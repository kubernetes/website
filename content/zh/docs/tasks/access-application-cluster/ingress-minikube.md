---
title: 在 Minikube 环境中使用 NGINX Ingress 控制器配置 Ingress
content_type: task
weight: 100
---
<!--
title: Set up Ingress on Minikube with the NGINX Ingress Controller
content_type: task
weight: 100
-->

<!-- overview -->

<!--
An [Ingress](/docs/concepts/services-networking/ingress/) is an API object that defines rules which allow external access
to services in a cluster. An [Ingress controller](/docs/concepts/services-networking/ingress-controllers/) fulfills the rules set in the Ingress.

This page shows you how to set up a simple Ingress which routes requests to Service web or web2 depending on the HTTP URI.
-->
[Ingress](/zh/docs/concepts/services-networking/ingress/)是一种 API 对象，其中定义了一些规则使得集群中的
服务可以从集群外访问。
[Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers/)
负责满足 Ingress 中所设置的规则。

本节为你展示如何配置一个简单的 Ingress，根据 HTTP URI 将服务请求路由到
服务 `web` 或 `web2`。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Create a Minikube cluster

1. Click **Launch Terminal**
-->
## 创建一个 Minikube  集群

1. 点击 **Launch Terminal**

    {{< kat-button >}}

<!--
1. (Optional) If you installed Minikube locally, run the following command:
-->
2. （可选操作）如果你在本地安装了 Minikube，运行下面的命令：

    ```shell
    minikube start
    ```

<!--
## Enable the Ingress controller

1. To enable the NGINX Ingress controller, run the following command:
-->
## 启用 Ingress 控制器

1. 为了启用 NGINIX Ingress 控制器，可以运行下面的命令：


   ```shell
   minikube addons enable ingress
   ```

<!--
1. Verify that the NGINX Ingress controller is running
-->
2. 检查验证 NGINX Ingress 控制器处于运行状态：

   ```shell
   kubectl get pods -n kube-system
   ```

   <!-- This can take up to a minute. -->
   {{< note >}}
   这一操作可能需要近一分钟时间。
   {{< /note >}}

   输出：

   ```
   NAME                                        READY     STATUS    RESTARTS   AGE
   default-http-backend-59868b7dd6-xb8tq       1/1       Running   0          1m
   kube-addon-manager-minikube                 1/1       Running   0          3m
   kube-dns-6dcb57bcc8-n4xd4                   3/3       Running   0          2m
   kubernetes-dashboard-5498ccf677-b8p5h       1/1       Running   0          2m
   nginx-ingress-controller-5984b97644-rnkrg   1/1       Running   0          1m
   storage-provisioner                         1/1       Running   0          2m
   ```

<!--
## Deploy a hello, world app

1. Create a Deployment using the following command:
-->
## 部署一个 Hello World 应用

1. 使用下面的命令创建一个 Deployment：

   ```shell
   kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
   ```

   <!--Output:-->
   输出：

   ```
   deployment.apps/web created
   ```

<!--
1. Expose the Deployment:
-->
2. 将 Deployment 暴露出来：

   ```shell
   kubectl expose deployment web --type=NodePort --port=8080
   ```

   <!-- Output: -->
   输出：

   ```
   service/web exposed
   ```

<!--
1. Verify the Service is created and is available on a node port:
-->
3. 验证 Service 已经创建，并且可能从节点端口访问：

   ```shell
   kubectl get service web
   ```

   <!-- Output: -->
   输出：

   ```shell
   NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
   web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
   ```

<!--
1. Visit the service via NodePort:
-->
4. 使用节点端口信息访问服务：

   ```shell
   minikube service web --url
   ```

   <!-- Output: -->
   输出：

   ```shell
   http://172.17.0.15:31637
   ```

   <!--
   Katacoda environment only: at the top of the terminal panel, click the plus sign, and then click **Select port to view on Host 1**. Enter the NodePort, in this case `31637`, and then click **Display Port**.
   -->
   {{< note >}}
   如果使用的是 Katacoda 环境，在终端面板顶端，请点击加号标志。
   然后点击 **Select port to view on Host 1**。
   输入节点和端口号（这里是`31637`），之后点击 **Display Port**。
   {{< /note >}}

   <!-- Output: -->
   输出：

   ```shell
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   <!--
   You can now access the sample app via the Minikube IP address and NodePort. The next step lets you access
   the app using the Ingress resource.
   -->
   你现在应该可以通过 Minikube 的 IP 地址和节点端口来访问示例应用了。
   下一步是让自己能够通过 Ingress 资源来访问应用。

<!--
## Create an Ingress resource

The following file is an Ingress resource that sends traffic to your Service via hello-world.info.

1. Create `example-ingress.yaml` from the following file:
-->
## 创建一个 Ingress 资源

下面是一个 Ingress 资源的配置文件，负责通过 `hello-world.info` 将服务请求
转发到你的服务。

1. 根据下面的 YAML 创建文件 `example-ingress.yaml`：

   {{< codenew file="service/networking/example-ingress.yaml" >}}

<!--
1. Create the Ingress resource by running the following command:
-->
2. 通过运行下面的命令创建 Ingress 资源：

   ```shell
   kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
   ```

   <!-- Output: -->
   输出：

   ```
   ingress.networking.k8s.io/example-ingress created
   ```

<!--
1. Verify the IP address is set:
-->
3. 验证 IP 地址已被设置：

   ```shell
   kubectl get ingress
   ```

   <!-- This can take a couple of minutes. -->
   {{< note >}}
   此操作可能需要几分钟时间。
   {{< /note >}}

   ```
   NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
   example-ingress   <none>   hello-world.info   172.17.0.15    80      38s
   ```

<!--
1. Add the following line to the bottom of the `/etc/hosts` file.
-->
4. 在 `/etc/hosts` 文件的末尾添加以下内容：

   <!--
   If you are running Minikube locally, use `minikube ip` to get the external IP. The IP address displayed within the ingress list will be the internal IP.
   -->
   {{< note >}}
   如果你在本地运行 Minikube 环境，需要使用 `minikube ip` 获得外部 IP 地址。
   Ingress 列表中显示的 IP 地址会是内部 IP 地址。
   {{< /note >}}
   ```
   172.17.0.15 hello-world.info
   ```

   <!-- This sends requests from hello-world.info to Minikube. -->
   此设置使得来自 `hello-world.info` 的请求被发送到 Minikube。

<!--
1. Verify that the Ingress controller is directing traffic:
-->
5. 验证 Ingress 控制器能够转发请求流量：

   ```shell
   curl hello-world.info
   ```

   <!-- Output: -->
   输出：

   ```
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   <!--
   If you are running Minikube locally, you can visit hello-world.info from your browser.
   -->
   {{< note >}}
   如果你在使用本地 Minikube 环境，你可以从浏览器中访问 hello-world.info。
   {{< /note >}}

<!--
## Create Second Deployment

1. Create a v2 Deployment using the following command:
-->
## 创建第二个 Deployment

1. 使用下面的命令创建 v2 的 Deployment：

   ```shell
   kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
   ```
   <!-- Output: -->
   输出：

   ```
   deployment.apps/web2 created
   ```

<!--
1. Expose the Deployment:
-->
2. 将 Deployment 暴露出来：

   ```shell
   kubectl expose deployment web2 --port=8080 --type=NodePort
   ```

   <!-- Output:  -->
   输出：

   ```
   service/web2 exposed
   ```

<!--
## Edit Ingress

1. Edit the existing `example-ingress.yaml` and add the following lines:
-->
## 编辑 Ingress

1. 编辑现有的 `example-ingress.yaml`，添加以下行：


   ```yaml
   - path: /v2
     pathType: Prefix
     backend:
       service:
         name: web2
         port:
           number: 8080
   ```

<!--
1. Apply the changes:
-->
2. 应用所作变更：

   ```shell
   kubectl apply -f example-ingress.yaml
   ```

   <!-- Output: -->
   输出：

   ```
   ingress.networking/example-ingress configured
   ```

<!--
## Test Your Ingress

1. Access the 1st version of the Hello World app.
-->
## 测试你的 Ingress

1. 访问 HelloWorld 应用的第一个版本：

   ```shell
   curl hello-world.info
   ```

   <!-- Output: -->
   输出：

   ```
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

<!--
1. Access the 2nd version of the Hello World app.
-->
2. 访问 HelloWorld 应用的第二个版本：

   ```shell
   curl hello-world.info/v2
   ```

   <!-- Output: -->
   输出：

   ```
   Hello, world!
   Version: 2.0.0
   Hostname: web2-75cd47646f-t8cjk
   ```

   <!--
   If you are running Minikube locally, you can visit hello-world.info and hello-world.info/v2 from your browser
   -->
   {{< note >}}
   如果你在本地运行 Minikube 环境，你可以使用浏览器来访问
   hello-world.info 和 hello-world.info/v2。
   {{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read more about [Ingress](/docs/concepts/services-networking/ingress/)
* Read more about [Ingress Controllers](/docs/concepts/services-networking/ingress-controllers/)
* Read more about [Services](/docs/concepts/services-networking/service/)
-->

* 进一步了解 [Ingress](/zh/docs/concepts/services-networking/ingress/)。
* 进一步了解 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers/)
* 进一步了解[服务](/zh/docs/concepts/services-networking/service/)

