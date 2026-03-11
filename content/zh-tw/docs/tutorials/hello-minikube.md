---
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->
<!--
This tutorial shows you how to run a sample app on Kubernetes using minikube.
The tutorial provides a container image that uses NGINX to echo back all the requests.
-->
本教學示範如何使用 minikube 在 Kubernetes 上執行一個範例應用程式。
教學提供了一個使用 NGINX 回應所有請求的容器映像檔。

## {{% heading "objectives" %}}

<!--
* Deploy a sample application to minikube.
* Run the app.
* View application logs.
-->
* 將範例應用程式部署到 minikube。
* 執行應用程式。
* 查看應用程式日誌。

## {{% heading "prerequisites" %}}

<!--
This tutorial assumes that you have already set up `minikube`.
See __Step 1__ in [minikube start](https://minikube.sigs.k8s.io/docs/start/) for installation instructions.
-->
本教學假設您已完成 `minikube` 的設定。
請參閱 [minikube start](https://minikube.sigs.k8s.io/docs/start/) 中的**步驟 1** 以取得安裝說明。

{{< note >}}
<!--Only execute the instructions in __Step 1, Installation__. The rest is covered on this page.-->
請只執行**步驟 1：安裝**中的指令，其餘部分將在本頁說明。
{{< /note >}}

<!--
You also need to install `kubectl`.
See [Install tools](/docs/tasks/tools/#kubectl) for installation instructions.
-->
您還需要安裝 `kubectl`。
請參閱[安裝工具](/zh-tw/docs/tasks/tools/#kubectl)以取得安裝說明。

<!-- lessoncontent -->

<!--
## Create a minikube cluster
-->
## 建立 minikube 叢集

```shell
minikube start
```

<!--
## Check the status of the minikube cluster

Verify the status of the minikube cluster to ensure all the components are in a running state.
-->
## 確認 minikube 叢集狀態

確認 minikube 叢集的狀態，以確保所有元件都處於執行狀態。

```shell
minikube status
```

<!--
The output from the above command should show all components Running or Configured, as shown in the example output below:
-->
上述指令的輸出應顯示所有元件為 Running 或 Configured，如以下範例輸出所示：

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

<!--
## Open the Dashboard

Open the Kubernetes dashboard. You can do this two different ways:
-->
## 開啟 Dashboard

開啟 Kubernetes Dashboard，您可以透過以下兩種方式進行：

{{< tabs name="dashboard" >}}
<!--{{% tab name="Launch a browser" %}}-->
{{% tab name="啟動瀏覽器" %}}
<!--Open a **new** terminal, and run:-->
開啟一個**新的**終端機，並執行：
```shell
# Start a new terminal, and leave this running.
# 開啟新終端機，讓此指令持續執行。
minikube dashboard
```

<!--Now, switch back to the terminal where you ran `minikube start`.-->
接著，切換回您執行 `minikube start` 的終端機。

{{< note >}}
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
`dashboard` 指令會啟用 dashboard 附加元件，並在預設網頁瀏覽器中開啟 Proxy。
您可以在 Dashboard 上建立 Kubernetes 資源，例如 Deployment 和 Service。

若要了解如何避免直接從終端機啟動瀏覽器並取得 Web Dashboard 的 URL，請參閱「複製貼上 URL」分頁。

預設情況下，Dashboard 只能從 Kubernetes 的內部虛擬網路存取。
`dashboard` 指令會建立一個臨時 Proxy，讓 Dashboard 可從 Kubernetes 虛擬網路外部存取。

若要停止 Proxy，請執行 `Ctrl+C` 結束程序。
指令結束後，Dashboard 仍會繼續在 Kubernetes 叢集中執行。
您可以再次執行 `dashboard` 指令以建立另一個 Proxy 來存取 Dashboard。
{{< /note >}}

{{% /tab %}}
<!--{{% tab name="URL copy and paste" %}}-->
{{% tab name="複製貼上 URL" %}}

<!--
If you don't want minikube to open a web browser for you, run the `dashboard` subcommand with the
`--url` flag. `minikube` outputs a URL that you can open in the browser you prefer.

Open a **new** terminal, and run:
-->
若您不想讓 minikube 自動開啟網頁瀏覽器，請使用 `--url` 旗標執行 `dashboard` 子指令。
`minikube` 會輸出一個 URL，您可以在偏好的瀏覽器中開啟。

開啟一個**新的**終端機，並執行：
```shell
# Start a new terminal, and leave this running.
# 開啟新終端機，讓此指令持續執行。
minikube dashboard --url
```

<!--Now, you can use this URL and switch back to the terminal where you ran `minikube start`.-->
接著，您可以使用此 URL 並切換回您執行 `minikube start` 的終端機。

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
## 建立 Deployment

Kubernetes [*Pod*](/zh-tw/docs/concepts/workloads/pods/) 是由一個或多個容器組成的群組，
以便集中管理並共用網路資源。本教學中的 Pod 只有一個容器。Kubernetes
[*Deployment*](/zh-tw/docs/concepts/workloads/controllers/deployment/) 會檢查 Pod 的健康狀態，
並在 Pod 的容器終止時將其重新啟動。建議使用 Deployment 來管理 Pod 的建立和擴展。

<!--
1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
   Pod runs a Container based on the provided Docker image.
-->
1. 使用 `kubectl create` 指令建立一個管理 Pod 的 Deployment。
   Pod 會根據提供的 Docker 映像檔執行容器。

    ```shell
    # Run a test container image that includes a webserver
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
    ```

<!--1. View the Deployment:-->
1. 查看 Deployment：

    ```shell
    kubectl get deployments
    ```

    <!--The output is similar to:-->
    輸出類似如下：

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    <!--(It may take some time for the pod to become available. If you see "0/1", try again in a few seconds.)-->
    （Pod 可能需要一些時間才能就緒。若看到「0/1」，請稍候幾秒後再試。）

<!--1. View the Pod:-->
1. 查看 Pod：

    ```shell
    kubectl get pods
    ```

    <!--The output is similar to:-->
    輸出類似如下：

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

<!--1. View cluster events:-->
1. 查看叢集事件：

    ```shell
    kubectl get events
    ```

<!--1. View the `kubectl` configuration:-->
1. 查看 `kubectl` 設定：

    ```shell
    kubectl config view
    ```

<!--1. View application logs for a container in a pod (replace pod name with the one you got from `kubectl get pods`).-->
1. 查看 Pod 中容器的應用程式日誌（請將 Pod 名稱替換為您從 `kubectl get pods` 取得的名稱）。

   {{< note >}}
   <!--Replace `hello-node-5f76cf6ccf-br9b5` in the `kubectl logs` command with the name of the pod from the `kubectl get pods` command output.-->
   請將 `kubectl logs` 指令中的 `hello-node-5f76cf6ccf-br9b5` 替換為 `kubectl get pods` 輸出中的 Pod 名稱。
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   <!--The output is similar to:-->
   輸出類似如下：

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
<!--For more information about `kubectl` commands, see the [kubectl overview](/docs/reference/kubectl/).-->
有關 `kubectl` 指令的更多資訊，請參閱 [kubectl 概述](/zh-tw/docs/reference/kubectl/)。
{{< /note >}}

<!--
## Create a Service

By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).
-->
## 建立 Service

預設情況下，Pod 只能透過其在 Kubernetes 叢集內的內部 IP 位址存取。
若要讓 `hello-node` 容器可從 Kubernetes 虛擬網路外部存取，
您必須將 Pod 公開為 Kubernetes [*Service*](/zh-tw/docs/concepts/services-networking/service/)。

{{< warning >}}
<!--
The agnhost container has a `/shell` endpoint, which is useful for
debugging, but dangerous to expose to the public internet. Do not run this on an
internet-facing cluster, or a production cluster.
-->
agnhost 容器有一個 `/shell` 端點，這對於除錯很有用，但若暴露於公開網際網路上則相當危險。
請勿在對外公開的叢集或正式環境叢集上執行此指令。
{{< /warning >}}

<!--1. Expose the Pod to the public internet using the `kubectl expose` command:-->
1. 使用 `kubectl expose` 指令將 Pod 對外公開：

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    <!--
    The `--type=LoadBalancer` flag indicates that you want to expose your Service
    outside of the cluster.

    The application code inside the test image only listens on TCP port 8080. If you used
    `kubectl expose` to expose a different port, clients could not connect to that other port.
    -->
    `--type=LoadBalancer` 旗標表示您希望將 Service 公開至叢集外部。

    測試映像檔中的應用程式碼只監聽 TCP 通訊埠 8080。若您使用
    `kubectl expose` 公開不同的通訊埠，用戶端將無法連線到該通訊埠。

<!--2. View the Service you created:-->
2. 查看您建立的 Service：

    ```shell
    kubectl get services
    ```

    <!--The output is similar to:-->
    輸出類似如下：

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
    在支援負載平衡器的雲端供應商上，系統會分配一個外部 IP 位址來存取 Service。
    在 minikube 上，`LoadBalancer` 類型讓您可透過 `minikube service` 指令存取 Service。

<!--3. Run the following command:-->
3. 執行以下指令：

    ```shell
    minikube service hello-node
    ```

    <!--This opens up a browser window that serves your app and shows the app's response.-->
    這會開啟一個瀏覽器視窗，顯示您的應用程式及其回應。

<!--
## Enable addons

The minikube tool includes a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}} that can be enabled, disabled and opened in the local Kubernetes environment.
-->
## 啟用附加元件

minikube 工具內建了一組 {{< glossary_tooltip text="附加元件" term_id="addons" >}}，可在本機 Kubernetes 環境中啟用、停用，或在瀏覽器中開啟。

<!--1. List the currently supported addons:-->
1. 列出目前支援的附加元件：

    ```shell
    minikube addons list
    ```

    <!--The output is similar to:-->
    輸出類似如下：

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

<!--1. Enable an addon, for example, `metrics-server`:-->
1. 啟用附加元件，例如 `metrics-server`：

    ```shell
    minikube addons enable metrics-server
    ```

    <!--The output is similar to:-->
    輸出類似如下：

    ```
    The 'metrics-server' addon is enabled
    ```

<!--1. View the Pod and Service you created by installing that addon:-->
1. 查看安裝該附加元件後建立的 Pod 和 Service：

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    <!--The output is similar to:-->
    輸出類似如下：

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

<!--1. Check the output from `metrics-server`:-->
1. 查看 `metrics-server` 的輸出：

    ```shell
    kubectl top pods
    ```

    <!--The output is similar to:-->
    輸出類似如下：

    ```
    NAME                         CPU(cores)   MEMORY(bytes)
    hello-node-ccf4b9788-4jn97   1m           6Mi
    ```

    <!--If you see the following message, wait, and try again:-->
    若您看到以下訊息，請等待後再試：

    ```
    error: Metrics API not available
    ```

<!--1. Disable `metrics-server`:-->
1. 停用 `metrics-server`：

    ```shell
    minikube addons disable metrics-server
    ```

    <!--The output is similar to:-->
    輸出類似如下：

    ```
    metrics-server was successfully disabled
    ```

<!--
## Clean up

Now you can clean up the resources you created in your cluster:
-->
## 清理

現在您可以清理在叢集中建立的資源：

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

<!--Stop the Minikube cluster-->
停止 Minikube 叢集：

```shell
minikube stop
```

<!--Optionally, delete the Minikube VM:-->
選擇性地刪除 Minikube 虛擬機器：

```shell
# Optional
minikube delete
```

<!--If you want to use minikube again to learn more about Kubernetes, you don't need to delete it.-->
若您想再次使用 minikube 來學習更多 Kubernetes 知識，則不需要刪除它。

<!--
## Conclusion

This page covered the basic aspects to get a minikube cluster up and running. You are now ready to deploy applications.
-->
## 結論

本頁說明了啟動並執行 minikube 叢集的基本步驟，您現在已準備好部署應用程式。

## {{% heading "whatsnext" %}}

<!--
* Tutorial to _[deploy your first app on Kubernetes with kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).
-->
* 教學：_[使用 kubectl 在 Kubernetes 上部署您的第一個應用程式](/zh-tw/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_。
* 深入了解 [Deployment 物件](/zh-tw/docs/concepts/workloads/controllers/deployment/)。
* 深入了解[部署應用程式](/zh-tw/docs/tasks/run-application/run-stateless-application-deployment/)。
* 深入了解 [Service 物件](/zh-tw/docs/concepts/services-networking/service/)。
