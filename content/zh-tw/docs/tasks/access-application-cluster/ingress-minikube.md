---
title: 在 Minikube 環境中使用 NGINX Ingress 控制器配置 Ingress
content_type: task
weight: 100
min-kubernetes-server-version: 1.19
---
<!--
title: Set up Ingress on Minikube with the NGINX Ingress Controller
content_type: task
weight: 100
min-kubernetes-server-version: 1.19
-->

<!-- overview -->

<!--
An [Ingress](/docs/concepts/services-networking/ingress/) is an API object that defines rules which allow external access
to services in a cluster. An [Ingress controller](/docs/concepts/services-networking/ingress-controllers/) fulfills the rules set in the Ingress.

This page shows you how to set up a simple Ingress which routes requests to Service web or web2 depending on the HTTP URI.
-->
[Ingress](/zh-cn/docs/concepts/services-networking/ingress/)是一種 API 物件，其中定義了一些規則使得叢集中的
服務可以從叢集外訪問。
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)
負責滿足 Ingress 中所設定的規則。

本節為你展示如何配置一個簡單的 Ingress，根據 HTTP URI 將服務請求路由到
服務 `web` 或 `web2`。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
如果你使用的是較早的 Kubernetes 版本，請切換到該版本的文件。

<!-- steps -->

<!--
### Create a Minikube cluster
-->
### 建立一個 Minikube  叢集

使用 Katacoda
: {{< kat-button >}}

本地
: 如果已經在本地[安裝Minikube](/zh-cn/docs/tasks/tools/#minikube)，
請執行 `minikube start` 建立一個叢集。

<!--
## Enable the Ingress controller

1. To enable the NGINX Ingress controller, run the following command:
-->
## 啟用 Ingress 控制器

1. 為了啟用 NGINIX Ingress 控制器，可以執行下面的命令：


   ```shell
   minikube addons enable ingress
   ```

<!--
1. Verify that the NGINX Ingress controller is running
-->
2. 檢查驗證 NGINX Ingress 控制器處於執行狀態：


   {{< tabs name="tab_with_md" >}}
   {{% tab name="minikube v1.19 或更高版本" %}}
```shell
kubectl get pods -n ingress-nginx
```
   <!-- It can take up to a minute before you see these pods running OK. -->
   {{< note >}}最多可能需要等待一分鐘才能看到這些 Pod 執行正常。{{< /note >}}

   <!-- The output is similar to: -->
   輸出類似於：

```
NAME                                        READY   STATUS      RESTARTS    AGE
ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
```
   {{% /tab %}}
   {{% tab name="minikube v1.18.1 或更早版本" %}}
```shell
kubectl get pods -n kube-system
```
   <!-- It can take up to a minute before you see these pods running OK. -->
   {{< note >}}最多可能需要等待一分鐘才能看到這些 Pod 執行正常。{{< /note >}}

   <!-- The output is similar to: -->
   輸出類似於：

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
   Make sure that you see a Pod with a name that starts with `nginx-ingress-controller-`.
   -->
   請確保可以在輸出中看到一個名稱以 `nginx-ingress-controller-` 為字首的 Pod。
   {{% /tab %}}
   {{< /tabs >}}

<!--
## Deploy a hello, world app

1. Create a Deployment using the following command:
-->
## 部署一個 Hello World 應用

1. 使用下面的命令建立一個 Deployment：

   ```shell
   kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
   ```

   <!--The output should be:-->
   輸出：

   ```
   deployment.apps/web created
   ```

<!--
1. Expose the Deployment:
-->
2. 將 Deployment 暴露出來：

   ```shell
   kubectl expose deployment web --type=NodePort --port=8080
   ```

   <!--The output should be:-->
   輸出：

   ```
   service/web exposed
   ```

<!--
1. Verify the Service is created and is available on a node port:
-->
3. 驗證 Service 已經建立，並且可能從節點埠訪問：

   ```shell
   kubectl get service web
   ```

   <!-- The output is similar to: -->
   輸出類似於：

   ```shell
   NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
   web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
   ```

<!--
1. Visit the service via NodePort:
-->
4. 使用節點埠資訊訪問服務：

   ```shell
   minikube service web --url
   ```

   <!-- The output is similar to: -->
   輸出類似於：

   ```shell
   http://172.17.0.15:31637
   ```

   <!--
   Katacoda environment only: at the top of the terminal panel, click the plus sign, and then click **Select port to view on Host 1**. Enter the NodePort, in this case `31637`, and then click **Display Port**.
   -->
   {{< note >}}
   如果使用的是 Katacoda 環境，在終端面板頂端，請點選加號標誌。
   然後點選 **Select port to view on Host 1**。
   輸入節點和埠號（這裡是`31637`），之後點選 **Display Port**。
   {{< /note >}}

   <!-- The output is similar to: -->
   輸出類似於：

   ```shell
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   <!--
   You can now access the sample app via the Minikube IP address and NodePort. The next step lets you access
   the app using the Ingress resource.
   -->
   你現在應該可以透過 Minikube 的 IP 地址和節點埠來訪問示例應用了。
   下一步是讓自己能夠透過 Ingress 資源來訪問應用。

<!--
## Create an Ingress

The following manifest defines an Ingress that sends traffic to your Service via hello-world.info.

1. Create `example-ingress.yaml` from the following file:
-->
## 建立一個 Ingress

下面是一個定義 Ingress 的配置檔案，負責透過 `hello-world.info` 將請求
轉發到你的服務。

1. 根據下面的 YAML 建立檔案 `example-ingress.yaml`：

   {{< codenew file="service/networking/example-ingress.yaml" >}}

<!--
1. Create the Ingress object by running the following command:
-->
2. 透過執行下面的命令建立 Ingress 物件：

   ```shell
   kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
   ```

   <!-- The output should be: -->
   輸出：

   ```
   ingress.networking.k8s.io/example-ingress created
   ```

<!--
1. Verify the IP address is set:
-->
3. 驗證 IP 地址已被設定：

   ```shell
   kubectl get ingress
   ```

   <!-- This can take a couple of minutes. -->
   {{< note >}}
   此操作可能需要幾分鐘時間。
   {{< /note >}}

   <!-- You should see an IPv4 address in the ADDRESS column; for example: -->
   接下來你將會在ADDRESS列中看到IPv4地址，例如：

   ```
   NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
   example-ingress   <none>   hello-world.info   172.17.0.15    80      38s
   ```

<!--
1. Add the following line to the bottom of the `/etc/hosts` file on
   your computer (you will need administrator access):
-->
4. 在 `/etc/hosts` 檔案的末尾新增以下內容（需要管理員訪問許可權）：

   <!--
   If you are running Minikube locally, use `minikube ip` to get the external IP. The IP address displayed within the ingress list will be the internal IP.
   -->
   {{< note >}}
   如果你在本地執行 Minikube 環境，需要使用 `minikube ip` 獲得外部 IP 地址。
   Ingress 列表中顯示的 IP 地址會是內部 IP 地址。
   {{< /note >}}
   ```
   172.17.0.15 hello-world.info
   ```

   <!--     
   After you make this change, your web browser sends requests for
   hello-world.info URLs to Minikube.
   -->
   新增完成後，在瀏覽器中訪問URL `hello-world.info`，請求將被髮送到 Minikube。

<!--
1. Verify that the Ingress controller is directing traffic:
-->
5. 驗證 Ingress 控制器能夠轉發請求流量：

   ```shell
   curl hello-world.info
   ```

   <!-- You should see: -->
   你應該看到類似輸出：

   ```
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   <!--
   If you are running Minikube locally, you can visit hello-world.info from your browser.
   -->
   {{< note >}}
   如果你在使用本地 Minikube 環境，你可以從瀏覽器中訪問 hello-world.info。
   {{< /note >}}

<!--
## Create a second Deployment

1. Create another Deployment using the following command:
-->
## 建立第二個 Deployment

1. 使用下面的命令建立第二個 Deployment：

   ```shell
   kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
   ```

   <!-- The output should be: -->
   輸出：

   ```
   deployment.apps/web2 created
   ```

<!--
1. Expose the second Deployment:
-->
2. 將第二個 Deployment 暴露出來：

   ```shell
   kubectl expose deployment web2 --port=8080 --type=NodePort
   ```

   <!-- The output should be:  -->
   輸出：

   ```
   service/web2 exposed
   ```

<!--
## Edit the existing Ingress {#edit-ingress}

1. Edit the existing `example-ingress.yaml` manifest, and add the
   following lines at the end:
-->
## 編輯現有的 Ingress {#edit-ingress}

1. 編輯現有的 `example-ingress.yaml`，在檔案最後新增以下行：


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
2. 應用變更：

   ```shell
   kubectl apply -f example-ingress.yaml
   ```

   <!-- You should see: -->
   輸出：

   ```
   ingress.networking/example-ingress configured
   ```

<!--
## Test Your Ingress

1. Access the 1st version of the Hello World app.
-->
## 測試你的 Ingress

1. 訪問 HelloWorld 應用的第一個版本：

   ```shell
   curl hello-world.info
   ```

   <!-- The output is similar to: -->
   輸出類似於：

   ```
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

<!--
1. Access the 2nd version of the Hello World app.
-->
2. 訪問 HelloWorld 應用的第二個版本：

   ```shell
   curl hello-world.info/v2
   ```

   <!-- The output is similar to: -->
   輸出類似於：

   ```
   Hello, world!
   Version: 2.0.0
   Hostname: web2-75cd47646f-t8cjk
   ```

   <!--
   If you are running Minikube locally, you can visit hello-world.info and hello-world.info/v2 from your browser.
   -->
   {{< note >}}
   如果你在本地執行 Minikube 環境，你可以使用瀏覽器來訪問
   hello-world.info 和 hello-world.info/v2。
   {{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read more about [Ingress](/docs/concepts/services-networking/ingress/)
* Read more about [Ingress Controllers](/docs/concepts/services-networking/ingress-controllers/)
* Read more about [Services](/docs/concepts/services-networking/service/)
-->

* 進一步瞭解 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)。
* 進一步瞭解 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)
* 進一步瞭解 [服務](/zh-cn/docs/concepts/services-networking/service/)
