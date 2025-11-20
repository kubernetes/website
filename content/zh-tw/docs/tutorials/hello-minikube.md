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
本教程向你展示如何使用 Minikube 在 Kubernetes 上運行一個應用示例。
教程提供了容器映像檔，使用 NGINX 來對所有請求做出回應。

## {{% heading "objectives" %}}

<!--
* Deploy a sample application to minikube.
* Run the app.
* View application logs.
-->
* 將一個示例應用部署到 Minikube。
* 運行應用程式。
* 查看應用日誌。

## {{% heading "prerequisites" %}}

<!--
This tutorial assumes that you have already set up `minikube`.
See __Step 1__ in [minikube start](https://minikube.sigs.k8s.io/docs/start/) for installation instructions.
-->
本教程假設你已經安裝了 `minikube`。
有關安裝說明，請參閱 [minikube start](https://minikube.sigs.k8s.io/docs/start/) 的**步驟 1**。

{{< note >}}
<!--
Only execute the instructions in __Step 1, Installation__. The rest is covered on this page.
-->
僅執行**步驟 1：安裝**中的說明，其餘內容均包含在本頁中。
{{< /note >}}

<!--
You also need to install `kubectl`.
See [Install tools](/docs/tasks/tools/#kubectl) for installation instructions.
-->
你還需要安裝 `kubectl`。
有關安裝說明，請參閱[安裝工具](/zh-cn/docs/tasks/tools/#kubectl)。

<!-- lessoncontent -->

<!--
## Create a minikube cluster
-->
## 創建 Minikube 叢集  {#create-a-minikube-cluster}

```shell
minikube start
```

<!--
## Open the Dashboard

Open the Kubernetes dashboard. You can do this two different ways:
-->
## 打開儀表板  {#open-the-dashboard}

打開 Kubernetes 儀表板。你可以通過兩種不同的方式執行此操作：

{{< tabs name="dashboard" >}}
{{% tab name="啓動瀏覽器" %}}
<!--
Open a **new** terminal, and run:
-->
打開一個**新的**終端，然後運行：

```shell
# 啓動一個新的終端，並保持此命令運行。
minikube dashboard
```

<!--
Now, switch back to the terminal where you ran `minikube start`.
-->
現在，切換回運行 `minikube start` 的終端。

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
`dashboard` 命令啓用儀表板插件，並在預設的 Web 瀏覽器中打開代理。
你可以在儀表板上創建 Kubernetes 資源，例如 Deployment 和 Service。

要了解如何避免從終端直接調用瀏覽器並獲取 Web 儀表板的 URL，請參閱
"URL 複製和粘貼"選項卡。

預設情況下，儀表板只能從內部 Kubernetes 虛擬網路中訪問。
`dashboard` 命令創建一個臨時代理，使儀表板可以從 Kubernetes 虛擬網路外部訪問。

要停止代理，請運行 `Ctrl+C` 退出該進程。儀表板仍在運行中。
命令退出後，儀表板仍然在 Kubernetes 叢集中運行。
你可以再次運行 `dashboard` 命令創建另一個代理來訪問儀表板。
{{< /note >}}

{{% /tab %}}
{{% tab name="URL 複製粘貼" %}}

<!--
If you don't want minikube to open a web browser for you, run the `dashboard` subcommand with the
`--url` flag. `minikube` outputs a URL that you can open in the browser you prefer:

Open a **new** terminal, and run:
-->
如果你不想 Minikube 爲你打開 Web 瀏覽器，可以使用 `--url` 標誌運行 `dashboard` 子命令。
`minikube` 會輸出一個 URL，你可以在你喜歡的瀏覽器中打開該 URL。

打開一個**新的**終端，然後運行：

```shell
# 啓動一個新的終端，並保持此命令運行。
minikube dashboard --url
```

<!--
Now, you can use this URL and switch back to the terminal where you ran `minikube start`.
-->
現在，你可以使用此 URL 並切換回運行 `minikube start` 的終端。

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
## 創建 Deployment  {#create-a-deployment}

Kubernetes [**Pod**](/zh-cn/docs/concepts/workloads/pods/)
是由一個或多個爲了管理和聯網而綁定在一起的容器構成的組。本教程中的 Pod 只有一個容器。
Kubernetes [**Deployment**](/zh-cn/docs/concepts/workloads/controllers/deployment/)
檢查 Pod 的健康狀況，並在 Pod 中的容器終止的情況下重新啓動新的容器。
Deployment 是管理 Pod 創建和擴展的推薦方法。

<!--
1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
   Pod runs a Container based on the provided Docker image.
-->
1. 使用 `kubectl create` 命令創建管理 Pod 的 Deployment。該 Pod 根據提供的 Docker
   映像檔運行容器。

   ```shell
   # 運行包含 Web 伺服器的測試容器鏡像
   kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
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

   輸出結果類似於這樣：

   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   hello-node   1/1     1            1           1m
   ```

   <!--
   (It may take some time for the pod to become available. If you see "0/1", try again in a few seconds.)
   -->
   （該 Pod 可能需要一些時間才能變得可用。如果你在輸出結果中看到 “0/1”，請在幾秒鐘後重試。）

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

   輸出結果類似於這樣：

   ```
   NAME                          READY     STATUS    RESTARTS   AGE
   hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
   ```

<!--
1. View cluster events:
-->
4. 查看叢集事件：

   ```shell
   kubectl get events
   ```

<!--
1. View the `kubectl` configuration:
-->
5. 查看 `kubectl` 設定：

   ```shell
   kubectl config view
   ```

<!--
1. View application logs for a container in a pod (replace pod name with the one you got from `kubectl get pods`).
-->
6. 查看 Pod 中容器的應用程式日誌（將 Pod 名稱替換爲你用 `kubectl get pods` 命令獲得的名稱）。

   {{< note >}}
   <!--
   Replace `hello-node-5f76cf6ccf-br9b5` in the `kubectl logs` command with the name of the pod from the `kubectl get pods` command output.
   -->
   將 `kubectl logs` 命令中的 `hello-node-5f76cf6ccf-br9b5` 替換爲 `kubectl get pods` 命令輸出中的 Pod 名稱。
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```
   
   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
<!--
For more information about `kubectl` commands, see the [kubectl overview](/docs/reference/kubectl/).
-->
有關 `kubectl` 命令的更多資訊，請參閱 [kubectl 概述](/zh-cn/docs/reference/kubectl/)。
{{< /note >}}

<!--
## Create a Service

By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).
-->
## 創建 Service  {#create-a-service}

預設情況下，Pod 只能通過 Kubernetes 叢集中的內部 IP 地址訪問。
要使得 `hello-node` 容器可以從 Kubernetes 虛擬網路的外部訪問，你必須將 Pod
通過 Kubernetes [**Service**](/zh-cn/docs/concepts/services-networking/service/) 公開出來。

{{< warning >}}
<!--
The agnhost container has a `/shell` endpoint, which is useful for
debugging, but dangerous to expose to the public internet. Do not run this on an
internet-facing cluster, or a production cluster.
-->
agnhost 容器有一個 `/shell` 端點，對於調試很有幫助，但暴露給公共互聯網很危險。
請勿在面向互聯網的叢集或生產叢集上運行它。
{{< /warning >}}

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

   The application code inside the test image only listens on TCP port 8080. If you used
   `kubectl expose` to expose a different port, clients could not connect to that other port.
   -->

   這裏的 `--type=LoadBalancer` 參數表明你希望將你的 Service 暴露到叢集外部。

   測試映像檔中的應用程式代碼僅監聽 TCP 8080 端口。
   如果你用 `kubectl expose` 暴露了其它的端口，客戶端將不能訪問其它端口。

<!--
2. View the Service you created:
-->
2. 查看你創建的 Service：

   ```shell
   kubectl get services
   ```

   <!--
   The output is similar to:
   -->

   輸出結果類似於這樣：

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

   對於支持負載均衡器的雲服務平臺而言，平臺將提供一個外部 IP 來訪問該服務。
   在 Minikube 上，`LoadBalancer` 使得服務可以通過命令 `minikube service` 訪問。

<!--
3. Run the following command:
-->
3. 運行下面的命令：

   ```shell
   minikube service hello-node
   ```

   <!--
   This opens up a browser window that serves your app and shows the app's response.
   -->
   這將打開一個瀏覽器窗口，爲你的應用程式提供服務並顯示應用的響應。

<!--
## Enable addons

The minikube tool includes a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}}
hat can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:
-->
## 啓用插件   {#enable-addons}

Minikube 有一組內置的{{< glossary_tooltip text="插件" term_id="addons" >}}，
可以在本地 Kubernetes 環境中啓用、禁用和打開。

1. 列出當前支持的插件：

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
1. Enable an addon, for example, `metrics-server`:
-->
2. 啓用插件，例如 `metrics-server`：

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
1. View the Pod and Service you created by installing that addon:
-->
3. 查看通過安裝該插件所創建的 Pod 和 Service：

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
1. Check the output from `metrics-server`:
-->
4. 檢查 `metrics-server` 的輸出：

   ```shell
   kubectl top pods
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   NAME                         CPU(cores)   MEMORY(bytes)   
   hello-node-ccf4b9788-4jn97   1m           6Mi             
   ```

   <!--
   If you see the following message, wait, and try again:
   -->
   如果你看到以下消息，請等待並重試：

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

   輸出結果類似於這樣：

   ```
   metrics-server was successfully disabled
   ```

<!--
## Clean up

Now you can clean up the resources you created in your cluster:
-->
## 清理  {#clean-up}

現在可以清理你在叢集中創建的資源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

<!--
Stop the Minikube cluster
-->
停止 Minikube 叢集：

```shell
minikube stop
```

<!--
Optionally, delete the Minikube VM:
-->
可選地，刪除 Minikube 虛擬機（VM）：

```shell
# 可選的
minikube delete
```

<!--
If you want to use minikube again to learn more about Kubernetes, you don't need to delete it.
-->
如果你還想使用 Minikube 進一步學習 Kubernetes，那就不需要刪除 Minikube。

<!--
## Conclusion

This page covered the basic aspects to get a minikube cluster up and running. You are now ready to deploy applications.
-->
## 結論

本頁介紹了啓動和運行 minikube 叢集的基本知識，現在部署應用的準備工作已經完成。

## {{% heading "whatsnext" %}}

<!--
* Tutorial to _[deploy your first app on Kubernetes with kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).
-->
* [使用 kubectl 在 Kubernetes 上部署你的第一個應用程式](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)教程。
* 進一步瞭解 [Deployment 對象](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
* 進一步瞭解[部署應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)。
* 進一步瞭解 [Service 對象](/zh-cn/docs/concepts/services-networking/service/)。
