---
title: 在 Minikube 环境中使用 NGINX Ingress 控制器配置 Ingress
content_type: task
weight: 110
min-kubernetes-server-version: 1.19
---
<!--
title: Set up Ingress on Minikube with the NGINX Ingress Controller
content_type: task
weight: 110
min-kubernetes-server-version: 1.19
-->

<!-- overview -->

<!--
An [Ingress](/docs/concepts/services-networking/ingress/) is an API object that defines rules
which allow external access to services in a cluster. An
[Ingress controller](/docs/concepts/services-networking/ingress-controllers/)
fulfills the rules set in the Ingress.

This page shows you how to set up a simple Ingress which routes requests to Service 'web' or
'web2' depending on the HTTP URI.
-->
[Ingress](/zh-cn/docs/concepts/services-networking/ingress/)是一种 API 对象，
其中定义了一些规则使得集群中的服务可以从集群外访问。
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)负责满足
Ingress 中所设置的规则。

本节为你展示如何配置一个简单的 Ingress，根据 HTTP URI 将服务请求路由到服务 `web` 或 `web2`。

## {{% heading "prerequisites" %}}

<!--
This tutorial assumes that you are using `minikube` to run a local Kubernetes cluster.
Visit [Install tools](/docs/tasks/tools/#minikube) to learn how to install `minikube`.
-->
本教程假设你正在使用 `minikube` 运行一个本地 Kubernetes 集群。
参阅[安装工具](/zh-cn/docs/tasks/tools/#minikube)了解如何安装 `minikube`。

{{< note >}}
<!--
This tutorial uses a container that requires the AMD64 architecture. 
If you are using minikube on a computer with a different CPU architecture,
you could try using minikube with a driver that can emulate AMD64.
For example, the Docker Desktop driver can do this.
-->
本教程使用需要 AMD64 架构的容器。
如果你在其他 CPU 架构的计算机上使用 minikube，可以尝试使用带有可以模拟 AMD64 的驱动程序的 minikube。
例如，Docker Desktop 驱动程序可以执行此操作。
{{< /note >}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you are using an older Kubernetes version, switch to the documentation for that version.
-->
如果你使用的是较早的 Kubernetes 版本，请切换到该版本的文档。

<!--
### Create a minikube cluster

If you haven't already set up a cluster locally, run `minikube start` to create a cluster.
-->
### 创建一个 Minikube 集群  {#create-minikube-cluster}

如果你还未在本地搭建集群，运行 `minikube start` 创建集群。

<!-- steps -->

<!--
## Enable the Ingress controller

1. To enable the NGINX Ingress controller, run the following command:
-->
## 启用 Ingress 控制器   {#enable-ingress-controller}

1. 为了启用 NGINIX Ingress 控制器，可以运行下面的命令：

   ```shell
   minikube addons enable ingress
   ```

<!--
1. Verify that the NGINX Ingress controller is running
-->
2. 检查验证 NGINX Ingress 控制器处于运行状态：

   ```shell
   kubectl get pods -n ingress-nginx
   ```

   {{< note >}}
   <!--
   It can take up to a minute before you see these pods running OK.
   -->
   最多可能需要等待一分钟才能看到这些 Pod 运行正常。
   {{< /note >}}

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   NAME                                        READY   STATUS      RESTARTS    AGE
   ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
   ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
   ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
   ```

<!--
## Deploy a hello, world app

1. Create a Deployment using the following command:
-->
## 部署一个 Hello World 应用  {#deploy-hello-world}

1. 使用下面的命令创建一个 Deployment：

   ```shell
   kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
   ```

   <!--
   The output should be:
   -->
   输出：

   ```none
   deployment.apps/web created
   ```

   <!--
   Verify that the Deployment is in a Ready state:
   -->
   验证 Deployment 是否处于 Ready 状态：

   ```shell
   kubectl get deployment web 
   ```  
   <!--
   The output should be similar to:
   -->
   输出应类似于：

   ```none
   NAME   READY   UP-TO-DATE   AVAILABLE   AGE
   web    1/1     1            1           53s
   ```

<!--
1. Expose the Deployment:
-->
2. 将 Deployment 暴露出来：

   ```shell
   kubectl expose deployment web --type=NodePort --port=8080
   ```

   <!--
   The output should be:
   -->
   输出类似于：

   ```none
   service/web exposed
   ```

<!--
1. Verify the Service is created and is available on a node port:
-->
3. 验证 Service 已经创建，并且可以从节点端口访问：

   ```shell
   kubectl get service web
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
   web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
   ```

<!--
1. Visit the Service via NodePort, using the [`minikube service`](https://minikube.sigs.k8s.io/docs/handbook/accessing/#using-minikube-service-with-tunnel) command. Follow the instructions for your platform:
-->
4. 使用节点端口信息访问服务，使用
   [`minikube service`](https://minikube.sigs.k8s.io/docs/handbook/accessing/#using-minikube-service-with-tunnel) 命令。
   请按照适合你平台的说明进行操作：

   {{< tabs name="minikube_service" >}}
   {{% tab name="Linux" %}}

   ```shell
   minikube service web --url
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   http://172.17.0.15:31637
   ```

   <!--
   Invoke the URL obtained in the output of the previous step:
   -->
   调用上一步输出中获取的 URL：

   ```shell
   curl http://172.17.0.15:31637
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   <!--
   # The command must be run in a separate terminal.
   -->
   ```shell
   # 该命令必须在单独的终端中运行。
   minikube service web --url 
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
    http://127.0.0.1:62445
    ! Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
   ```

   <!--
   From a different terminal, invoke the URL obtained in the output of the previous step:
   -->
   从不同的终端调用在上一步的输出中获取的 URL：

   ```shell
    curl http://127.0.0.1:62445 
   ```

   {{% /tab %}}
   {{< /tabs >}}
   <br>

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   <!--
   You can now access the sample application via the Minikube IP address and NodePort.
   The next step lets you access the application using the Ingress resource.
   -->
   你现在应该可以通过 Minikube 的 IP 地址和节点端口来访问示例应用了。
   下一步是让自己能够通过 Ingress 资源来访问应用。

<!--
## Create an Ingress

The following manifest defines an Ingress that sends traffic to your Service via
`hello-world.example`.

1. Create `example-ingress.yaml` from the following file:
-->
## 创建一个 Ingress   {#create-ingress}

下面是一个定义 Ingress 的配置文件，负责通过 `hello-world.example`
将请求转发到你的服务。

1. 根据下面的 YAML 创建文件 `example-ingress.yaml`：

   {{% code_sample file="service/networking/example-ingress.yaml" %}}

<!--
1. Create the Ingress object by running the following command:
-->
2. 通过运行下面的命令创建 Ingress 对象：

   ```shell
   kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
   ```

   <!--
   The output should be:
   -->
   输出类似于：

   ```none
   ingress.networking.k8s.io/example-ingress created
   ```

<!--
1. Verify the IP address is set:
-->
3. 验证 IP 地址已被设置：

   ```shell
   kubectl get ingress
   ```

   {{< note >}}
   <!--
   This can take a couple of minutes.
   -->
   此操作可能需要几分钟时间。
   {{< /note >}}

   <!--
   You should see an IPv4 address in the `ADDRESS` column; for example:
   -->
   接下来你将会在 `ADDRESS` 列中看到 IPv4 地址，例如：

   ```none
   NAME              CLASS   HOSTS                 ADDRESS        PORTS   AGE
   example-ingress   nginx   hello-world.example   172.17.0.15    80      38s
   ```

<!--
1. Verify that the Ingress controller is directing traffic, by following the instructions for your platform:
-->
4. 验证 Ingress 控制器能够转发请求流量，按照适用于所属平台的说明进行操作：

   {{< note >}}
   <!--
   The network is limited if using the Docker driver on MacOS (Darwin) and the Node IP is not reachable directly. To get ingress to work you’ll need to open a new terminal and run `minikube tunnel`.
   `sudo` permission is required for it, so provide the password when prompted. 
   -->
   如果在 MacOS（Darwin）上使用 Docker 驱动程序，网络会受到限制，并且无法直接访问节点 IP。
   要让 Ingress 正常工作，你需要打开一个新终端并运行 `minikube tunnel`。
   此操作需要 `sudo` 权限，因此请在出现提示时提供密码。
   {{< /note >}}

   {{< tabs name="ingress" >}}
   {{% tab name="Linux" %}}

   ```shell
    curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```
   
   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   Tunnel successfully started
 
   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...
   
   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   <!--
   From within a new terminal, invoke the following command:
   -->
   从新终端中调用以下命令：

   ```shell
    curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{< /tabs >}}
   <br>

   <!--
   You should see:
   -->
   你应该看到类似输出：

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   <!--
   You can also visit `hello-world.info` from your browser.

   * **Optionally**

     Look up the external IP address as reported by minikube:
   -->

   你也可以从浏览器访问 `hello-world.info`。

   * **可选**

     查看 Minikube 报告的外部 IP 地址：

     ```shell
     minikube ip
     ```

     <!--
     Add line similar to the following one to the bottom of the `/etc/hosts` file on
     your computer (you will need administrator access):
     -->

     将类似以下这一行添加到你计算机上的  `/etc/hosts` 文件的末尾（需要管理员访问权限）：

     ```none
     172.17.0.15 hello-world.info
     ```

     {{< note >}}

     <!--
     Change the IP address to match the output from `minikube ip`.
     -->

更改 IP 地址以匹配 `minikube ip` 的输出。
     {{< /note >}}

     <!--
     After you make this change, your web browser sends requests for
     `hello-world.info` URLs to Minikube.
     -->

     更改完成后，在浏览器中访问 URL `hello-world.info`，请求将被发送到 Minikube。

<!--
## Create a second Deployment

1. Create another Deployment using the following command:
-->
## 创建第二个 Deployment  {#create-second-deployment}

1. 使用下面的命令创建第二个 Deployment：

   ```shell
   kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
   ```

   <!--
   The output should be:
   -->
   输出类似于：

   ```none
   deployment.apps/web2 created
   ```

   <!--
   Verify that the Deployment is in a Ready state:
   -->
   验证 Deployment 是否处于 Ready 状态：

   ```shell
   kubectl get deployment web2 
   ```  

   <!--
   The output should be similar to:
   -->
   输出应类似于：

   ```none
   NAME   READY   UP-TO-DATE   AVAILABLE   AGE
   web2   1/1     1            1           16s
   ```

<!--
1. Expose the second Deployment:
-->
2. 将第二个 Deployment 暴露出来：

   ```shell
   kubectl expose deployment web2 --port=8080 --type=NodePort
   ```

   <!--
   The output should be:
   -->
   输出类似于：

   ```none
   service/web2 exposed
   ```

<!--
## Edit the existing Ingress {#edit-ingress}

1. Edit the existing `example-ingress.yaml` manifest, and add the
   following lines at the end:
-->
## 编辑现有的 Ingress {#edit-ingress}

1. 编辑现有的 `example-ingress.yaml`，在文件最后添加以下行：

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
2. 应用变更：

   ```shell
   kubectl apply -f example-ingress.yaml
   ```

   <!--
   You should see:
   -->
   输出类似于：

   ```none
   ingress.networking/example-ingress configured
   ```

<!--
## Test your Ingress

1. Access the 1st version of the Hello World app.
-->
## 测试你的 Ingress  {#test-ingress}

1. 访问 Hello World 应用的第一个版本：

   {{< tabs name="ingress2-v1" >}}
   {{% tab name="Linux" %}}

   ```shell
    curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```
   
   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   Tunnel successfully started
 
   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...
   
   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   <!--
   From within a new terminal, invoke the following command:
   -->
   从新终端中调用以下命令：

   ```shell
    curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{< /tabs >}}
   <br>

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

<!--
1. Access the 2nd version of the Hello World app.
-->
2. 访问 Hello World 应用的第二个版本：

   {{< tabs name="ingress2-v2" >}}
   {{% tab name="Linux" %}}

   ```shell
   curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example/v2
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```
   
   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   Tunnel successfully started
 
   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...
   
   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   <!--
   From within a new terminal, invoke the following command:
   -->
   从新终端中调用以下命令：

   ```shell
    curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example/v2
   ```

   {{% /tab %}}
   {{< /tabs >}}

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: web2-75cd47646f-t8cjk
   ```

   {{< note >}}
   <!--
   If you did the optional step to update `/etc/hosts`, you can also visit `hello-world.example` and
   `hello-world.example/v2` from your browser.
   -->
   如果你执行了更新 `/etc/hosts` 的可选步骤，你也可以从你的浏览器中访问
   `hello-world.example` 和 `hello-world.example/v2`。
   {{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read more about [Ingress](/docs/concepts/services-networking/ingress/)
* Read more about [Ingress Controllers](/docs/concepts/services-networking/ingress-controllers/)
* Read more about [Services](/docs/concepts/services-networking/service/)
-->
* 进一步了解 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
* 进一步了解 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)
* 进一步了解 [Service](/zh-cn/docs/concepts/services-networking/service/)
