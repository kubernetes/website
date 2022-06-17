---
title: 你好，Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>準備好動手操作了麼？構建一個簡單的 Kubernetes 叢集來執行示例應用。</p>
card:
  name: tutorials
  weight: 10
---
<!--
title: Hello Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs a sample app.</p>
card:
  name: tutorials
  weight: 10
-->

<!-- overview -->

<!--
This tutorial shows you how to run a sample app
on Kubernetes using minikube and Katacoda.
Katacoda provides a free, in-browser Kubernetes environment.
-->
本教程向你展示如何使用 Minikube 和 Katacoda
在 Kubernetes 上執行一個應用示例。Katacoda 提供免費的瀏覽器內 Kubernetes 環境。

<!--
{{< note >}}
You can also follow this tutorial if you've installed minikube locally.
See [minikube start](https://minikube.sigs.k8s.io/docs/start/) for installation instructions.
{{< /note >}}
-->
{{< note >}}
如果你已在本地安裝 Minikube，也可以按照本教程操作。
安裝指南參閱 [minikube start](https://minikube.sigs.k8s.io/docs/start/) 。
{{< /note >}}


## {{% heading "objectives" %}}

<!--
* Deploy a sample application to minikube.
* Run the app.
* View application logs.
-->
* 將一個示例應用部署到 Minikube。
* 執行應用程式。
* 檢視應用日誌

## {{% heading "prerequisites" %}}


<!--
This tutorial provides a container image that uses NGINX to echo back all the requests.
-->
本教程提供了容器映象，使用 NGINX 來對所有請求做出回應：

<!-- lessoncontent -->

<!--
## Create a minikube cluster

1. Click **Launch Terminal**
-->
## 建立 Minikube 叢集

1. 點選 **啟動終端**

   {{< kat-button >}}

   <!-- 
   If you installed minikube locally, run `minikube start`. Before you run `minikube dashboard`, you should open a new terminal, start `minikube dashboard` there, and then switch back to the main terminal.
   -->
   {{< note >}}
   如果你在本地安裝了 Minikube，執行 `minikube start`。
   在執行 `minikube dashboard` 之前，你應該開啟一個新終端，
   在此啟動 `minikube dashboard` ，然後切換回主終端。 
   {{< /note >}}

<!--
2. Open the Kubernetes dashboard in a browser:
-->
2. 在瀏覽器中開啟 Kubernetes 儀表板（Dashboard）：

   ```shell
   minikube dashboard
   ```

<!--
3. Katacoda environment only: At the top of the terminal pane, click the plus sign, and then click **Select port to view on Host 1**.
-->
3. 僅限 Katacoda 環境：在終端視窗的頂部，單擊加號，然後單擊 **選擇要在主機 1 上檢視的埠**。

<!--
4. Katacoda environment only: Type `30000`, and then click **Display Port**.
-->
4. 僅限 Katacoda 環境：輸入“30000”，然後單擊 **顯示埠**。

<!--
The `dashboard` command enables the dashboard add-on and opens the proxy in the default web browser. 
You can create Kubernetes resources on the dashboard such as Deployment and Service.

If you are running in an environment as root, see [Open Dashboard with URL](#open-dashboard-with-url).

By default, the dashboard is only accessible from within the internal Kubernetes virtual network.
The `dashboard` command creates a temporary proxy to make the dashboard accessible from outside the Kubernetes virtual network.

To stop the proxy, run `Ctrl+C` to exit the process.
After the command exits, the dashboard remains running in the Kubernetes cluster.
You can run the `dashboard` command again to create another proxy to access the dashboard.
-->
{{< note >}}
`dashboard` 命令啟用儀表板外掛，並在預設的 Web 瀏覽器中開啟代理。
你可以在儀表板上建立 Kubernetes 資源，例如 Deployment 和 Service。

如果你以 root 使用者身份在環境中執行，
請參見[使用 URL 開啟儀表板](#open-dashboard-with-url)。

預設情況下，儀表板只能從內部 Kubernetes 虛擬網路中訪問。
`dashboard` 命令建立一個臨時代理，使儀表板可以從 Kubernetes 虛擬網路外部訪問。

要停止代理，請執行 `Ctrl+C` 退出該程序。儀表板仍在執行中。
命令退出後，儀表板仍然在 Kubernetes 叢集中執行。
你可以再次執行 `dashboard` 命令建立另一個代理來訪問儀表板。

{{< /note >}}

<!--
## Open Dashboard with URL
-->
## 使用 URL 開啟儀表板

<!--
If you don't want to open a web browser, run the dashboard command with the `--url` flag to emit a URL:
-->
如果你不想開啟 Web 瀏覽器，請使用 `--url` 標誌執行顯示板命令以得到 URL：

```shell
minikube dashboard --url
```

<!--

## Create a Deployment

A Kubernetes [*Pod*](/docs/concepts/workloads/pods/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.
-->

## 建立 Deployment

Kubernetes [*Pod*](/zh-cn/docs/concepts/workloads/pods/) 是由一個或多個
為了管理和聯網而繫結在一起的容器構成的組。 本教程中的 Pod 只有一個容器。
Kubernetes [*Deployment*](/zh-cn/docs/concepts/workloads/controllers/deployment/)
檢查 Pod 的健康狀況，並在 Pod 中的容器終止的情況下重新啟動新的容器。
Deployment 是管理 Pod 建立和擴充套件的推薦方法。

<!--
1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
Pod runs a Container based on the provided Docker image.
-->
1. 使用 `kubectl create` 命令建立管理 Pod 的 Deployment。該 Pod 根據提供的 Docker
   映象執行 Container。

   ```shell
   kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
   ```

<!--
2. View the Deployment:
-->

2. 檢視 Deployment：

   ```shell
   kubectl get deployments
   ```

   <!--
   The output is similar to:
   -->

   輸出結果類似於這樣：

   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   hello-node   1/1     1            1           1m
   ```

<!--
3. View the Pod:
-->
3. 檢視 Pod：

   ```shell
   kubectl get pods
   ```

   <!--
   The output is similar to:
   -->

   輸出結果類似於這樣：

   ```
   NAME                          READY     STATUS    RESTARTS   AGE
   hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
   ```

<!--
4. View cluster events:
-->
4. 檢視叢集事件：

   ```shell
   kubectl get events
   ```

<!--
5. View the `kubectl` configuration:
-->
5. 檢視 `kubectl` 配置：

   ```shell
   kubectl config view
   ```

<!--
For more information about `kubectl`commands, see the
[kubectl overview](/docs/reference/kubectl/).
-->
{{< note >}}
有關 `kubectl` 命令的更多資訊，請參閱 [kubectl 概述](/zh-cn/docs/reference/kubectl/)。
{{< /note >}}

<!--
## Create a Service

By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).
-->
## 建立 Service

預設情況下，Pod 只能透過 Kubernetes 叢集中的內部 IP 地址訪問。
要使得 `hello-node` 容器可以從 Kubernetes 虛擬網路的外部訪問，你必須將 Pod
暴露為 Kubernetes [*Service*](/zh-cn/docs/concepts/services-networking/service/)。

<!--
1. Expose the Pod to the public internet using the `kubectl expose` command:
-->
1. 使用 `kubectl expose` 命令將 Pod 暴露給公網：

   ```shell
   kubectl expose deployment hello-node --type=LoadBalancer --port=8080
   ```

   <!--
    The `--type=LoadBalancer` flag indicates that you want to expose your Service
    outside of the cluster.

    The application code inside the image `k8s.gcr.io/echoserver` only listens on TCP port 8080. If you used
    `kubectl expose` to expose a different port, clients could not connect to that other port.
   -->
   這裡的 `--type=LoadBalancer` 引數表明你希望將你的 Service 暴露到叢集外部。

   映象 `k8s.gcr.io/echoserver` 中的應用程式程式碼僅監聽 TCP 8080 埠。
   如果你用 `kubectl expose` 暴露了其它的埠，客戶端將不能訪問其它埠。

<!--
2. View the Service you created:
-->
2. 檢視你建立的 Service：

   ```shell
   kubectl get services
   ```

   <!--
   The output is similar to:
   -->

   輸出結果類似於這樣:

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
   對於支援負載均衡器的雲服務平臺而言，平臺將提供一個外部 IP 來訪問該服務。
   在 Minikube 上，`LoadBalancer` 使得服務可以透過命令 `minikube service` 訪問。

<!--
3. Run the following command:
-->
3. 執行下面的命令：

   ```shell
   minikube service hello-node
   ```

<!--
4. Katacoda environment only: Click the plus sign, and then click **Select port to view on Host 1**.
-->
4. 僅限 Katacoda 環境：單擊加號，然後單擊 **選擇要在主機 1 上檢視的埠**。

<!--
5. Katacoda environment only: Note the 5-digit port number displayed opposite to `8080` in services output. This port number is randomly generated and it can be different for you. Type your number in the port number text box, then click Display Port. Using the example from earlier, you would type `30369`.

    This opens up a browser window that serves your app and shows the app's response.
-->
5. 僅限 Katacoda 環境：請注意在 service 輸出中與 `8080` 對應的長度為 5 位的埠號。
   此埠號是隨機生成的，可能與你的不同。
   在埠號文字框中輸入你自己的埠號，然後單擊顯示埠。
   對應於上面的例子，需要輸入 `30369`。

   這將開啟一個瀏覽器視窗，為你的應用程式提供服務並顯示應用的響應。

<!--
## Enable addons

The minikube tool includes a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}} that can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:
-->
## 啟用外掛

Minikube 有一組內建的 {{< glossary_tooltip text="外掛" term_id="addons" >}}，
可以在本地 Kubernetes 環境中啟用、禁用和開啟。

1. 列出當前支援的外掛：

   ```shell
   minikube addons list
   ```

   <!--
   The output is similar to:
   -->
   輸出結果類似於這樣：

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
2. Enable an addon, for example, `metrics-server`:
-->
2. 啟用外掛，例如 `metrics-server`：

   ```shell
   minikube addons enable metrics-server
   ```

   <!--
   The output is similar to:
   -->

   輸出結果類似於這樣：

   ```
   The 'metrics-server' addon is enabled
   ```

<!--
3. View the Pod and Service you created:
-->
3. 檢視建立的 Pod 和 Service：

   ```shell
   kubectl get pod,svc -n kube-system
   ```

   <!--
   The output is similar to:
   -->

   輸出結果類似於這樣：

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
4. Disable `metrics-server`:
-->
4. 禁用 `metrics-server`：

   ```shell
   minikube addons disable metrics-server
   ```

   <!--
   The output is similar to:
   -->

   輸出結果類似於這樣：

   ```
   metrics-server was successfully disabled
   ```

<!--
## Clean up

Now you can clean up the resources you created in your cluster:
-->
## 清理

現在可以清理你在叢集中建立的資源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

<!--
Optionally, stop the Minikube virtual machine (VM):
-->
可選地，停止 Minikube 虛擬機器（VM）：

```shell
minikube stop
```

<!--
Optionally, delete the Minikube VM:
-->
可選地，刪除 Minikube 虛擬機器（VM）：

```shell
minikube delete
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).
-->
* 進一步瞭解 [Deployment 物件](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
* 進一步瞭解[部署應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)。
* 進一步瞭解 [Service 物件](/zh-cn/docs/concepts/services-networking/service/)。

