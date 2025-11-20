---
title: 部署和訪問 Kubernetes 儀表板（Dashboard）
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: 使用 Web 界面 Dashboard
  description: 部署並訪問 Web 界面（Kubernetes 儀表板）。
---
<!--
reviewers:
- floreks
- maciaszczykm
- shu-mutou
- mikedanese
title: Deploy and Access the Kubernetes Dashboard
description: >-
  Deploy the web UI (Kubernetes Dashboard) and access it.
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Use the Web UI Dashboard
-->

<!-- overview -->

<!--
Dashboard is a web-based Kubernetes user interface.
You can use Dashboard to deploy containerized applications to a Kubernetes cluster,
troubleshoot your containerized application, and manage the cluster resources.
You can use Dashboard to get an overview of applications running on your cluster,
as well as for creating or modifying individual Kubernetes resources
(such as Deployments, Jobs, DaemonSets, etc).
For example, you can scale a Deployment, initiate a rolling update, restart a pod
or deploy new applications using a deploy wizard.

Dashboard also provides information on the state of Kubernetes resources in your cluster and on any errors that may have occurred.
-->
Dashboard 是基於網頁的 Kubernetes 使用者界面。
你可以使用 Dashboard 將容器應用部署到 Kubernetes 叢集中，也可以對容器應用排錯，還能管理叢集資源。
你可以使用 Dashboard 獲取運行在叢集中的應用的概覽資訊，也可以創建或者修改 Kubernetes 資源
（如 Deployment、Job、DaemonSet 等等）。
例如，你可以對 Deployment 實現彈性伸縮、發起滾動升級、重啓 Pod 或者使用嚮導創建新的應用。

Dashboard 同時展示了 Kubernetes 叢集中的資源狀態資訊和所有報錯資訊。

![Kubernetes Dashboard UI](/images/docs/ui-dashboard.png)

<!-- body -->

<!--
## Deploying the Dashboard UI
-->
## 部署 Dashboard UI   {#deploying-the-dashboard-ui}

{{< note >}}
<!--
Kubernetes Dashboard supports only Helm-based installation currently as it is faster
and gives us better control over all dependencies required by Dashboard to run.
-->
Kubernetes Dashboard 目前僅支持基於 Helm 的安裝，因爲它速度更快，
並且可以讓我們更好地控制 Dashboard 運行所需的所有依賴項。
{{< /note >}}

<!--
The Dashboard UI is not deployed by default. To deploy it, run the following command:
-->
預設情況下不會部署 Dashboard，可以通過以下命令部署：

<!--
# Add kubernetes-dashboard repository
# Deploy a Helm Release named "kubernetes-dashboard" using the kubernetes-dashboard chart
-->
```
# 添加 kubernetes-dashboard 倉庫
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
# 使用 kubernetes-dashboard Chart 部署名爲 `kubernetes-dashboard` 的 Helm Release
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard
```

<!--
## Accessing the Dashboard UI

To protect your cluster data, Dashboard deploys with a minimal RBAC configuration by default.
Currently, Dashboard only supports logging in with a Bearer Token.
To create a token for this demo, you can follow our guide on
[creating a sample user](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md).
-->
## 訪問 Dashboard 使用者界面   {#accessing-the-dashboard-ui}

爲了保護你的叢集資料，預設情況下，Dashboard 會使用最少的 RBAC 設定進行部署。
當前，Dashboard 僅支持使用 Bearer 令牌登錄。
要爲此樣本演示創建令牌，你可以按照
[創建示例使用者](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md)
上的指南進行操作。

{{< warning >}}
<!--
The sample user created in the tutorial will have administrative privileges and is for educational purposes only.
-->
在教程中創建的樣本使用者將具有管理特權，並且僅用於教育目的。
{{< /warning >}}

<!--
### Command line proxy

You can enable access to the Dashboard using the `kubectl` command-line tool,
by running the following command:
-->
### 命令列代理   {#command-line-proxy}

你可以使用 `kubectl` 命令列工具來啓用 Dashboard 訪問，命令如下：

```
kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443
```

<!--
Kubectl will make Dashboard available at [https://localhost:8443](https://localhost:8443).
-->
kubectl 會使得 Dashboard 可以通過 [https://localhost:8443](https://localhost:8443) 訪問。

<!--
The UI can _only_ be accessed from the machine where the command is executed. See `kubectl port-forward --help` for more options.
-->
UI **只能**通過執行這條命令的機器進行訪問。更多選項參見 `kubectl port-forward --help`。

{{< note >}}
<!--
The kubeconfig authentication method does **not** support external identity providers
or X.509 certificate-based authentication.
-->
Kubeconfig 身份驗證方法**不**支持外部身份提供程式或基於 x509 證書的身份驗證。
{{< /note >}}

<!--
## Welcome view
-->
## 歡迎界面   {#welcome-view}

<!--
When you access Dashboard on an empty cluster, you'll see the welcome page.
This page contains a link to this document as well as a button to deploy your first application.
In addition, you can view which system applications are running by default in the `kube-system`
[namespace](/docs/tasks/administer-cluster/namespaces/) of your cluster, for example the Dashboard itself.
 -->
當訪問空叢集的 Dashboard 時，你會看到歡迎界面。
頁面包含一個指向此文檔的鏈接，以及一個用於部署第一個應用程式的按鈕。
此外，你可以看到在預設情況下有哪些預設系統應用運行在 `kube-system`
[名字空間](/zh-cn/docs/tasks/administer-cluster/namespaces/) 中，比如 Dashboard 自己。

<!--
![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)
 -->
![Kubernetes Dashboard 歡迎頁面](/images/docs/ui-dashboard-zerostate.png)

<!--
## Deploying containerized applications

Dashboard lets you create and deploy a containerized application as a Deployment and optional Service with a simple wizard.
You can either manually specify application details, or upload a YAML or JSON _manifest_ file containing application configuration.
-->
## 部署容器化應用   {#deploying-containerized-applications}

通過一個簡單的部署嚮導，你可以使用 Dashboard 將容器化應用作爲一個 Deployment 和可選的
Service 進行創建和部署。你可以手工指定應用的詳細設定，或者上傳一個包含應用設定的 YAML
或 JSON **清單**檔案。

<!--
Click the **CREATE** button in the upper right corner of any page to begin.
-->
點擊任何頁面右上角的 **CREATE** 按鈕以開始。

<!--
### Specifying application details

The deploy wizard expects that you provide the following information:
-->
### 指定應用的詳細設定   {#specifying-application-details}

部署嚮導需要你提供以下資訊：

<!--
- **App name** (mandatory): Name for your application.
  A [label](/docs/concepts/overview/working-with-objects/labels/) with the name will be
  added to the Deployment and Service, if any, that will be deployed.
-->
- **應用名稱**（必填）：應用的名稱。內容爲 `應用名稱` 的
  [標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)
  會被添加到任何將被部署的 Deployment 和 Service。

  <!--
  The application name must be unique within the selected Kubernetes [namespace](/docs/tasks/administer-cluster/namespaces/).
  It must start with a lowercase character, and end with a lowercase character or a number,
  and contain only lowercase letters, numbers and dashes (-). It is limited to 24 characters.
  Leading and trailing spaces are ignored.
  -->
  在選定的 Kubernetes [名字空間](/zh-cn/docs/tasks/administer-cluster/namespaces/) 中，
  應用名稱必須唯一。必須由小寫字母開頭，以數字或者小寫字母結尾，
  並且只含有小寫字母、數字和中劃線（-）。小於等於24個字符。開頭和結尾的空格會被忽略。

<!--
- **Container image** (mandatory):
  The URL of a public Docker [container image](/docs/concepts/containers/images/) on any registry,
  or a private image (commonly hosted on the Google Container Registry or Docker Hub).
  The container image specification must end with a colon.
 -->
- **容器映像檔**（必填）：公共映像檔倉庫上的 Docker
  [容器映像檔](/zh-cn/docs/concepts/containers/images/) 或者私有映像檔倉庫
  （通常是 Google Container Registry 或者 Docker Hub）的 URL。容器映像檔參數說明必須以冒號結尾。

<!--
- **Number of pods** (mandatory): The target number of Pods you want your application to be deployed in.
  The value must be a positive integer.
-->
- **Pod 的數量**（必填）：你希望應用程式部署的 Pod 的數量。值必須爲正整數。

  <!--
  A [Deployment](/docs/concepts/workloads/controllers/deployment/) will be created to
  maintain the desired number of Pods across your cluster.
  -->
  系統會創建一個 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)
  以保證叢集中運行期望的 Pod 數量。

<!--
- **Service** (optional): For some parts of your application (e.g. frontends) you may want to expose a
  [Service](/docs/concepts/services-networking/service/) onto an external,
  maybe public IP address outside of your cluster (external Service).
 -->
- **服務**（可選）：對於部分應用（比如前端），你可能想對外暴露一個
  [Service](/zh-cn/docs/concepts/services-networking/service/)，這個 Service
  可能用的是叢集之外的公網 IP 地址（外部 Service）。

  {{< note >}}
  <!-- 
  For external Services, you may need to open up one or more ports to do so.
  -->
  對於外部服務，你可能需要開放一個或多個端口才行。
  {{< /note >}}

  <!--
  Other Services that are only visible from inside the cluster are called internal Services.
  -->
  其它只能對叢集內部可見的 Service 稱爲內部 Service。
  
  <!--
  Irrespective of the Service type, if you choose to create a Service and your container listens
  on a port (incoming), you need to specify two ports.
  The Service will be created mapping the port (incoming) to the target port seen by the container.
  This Service will route to your deployed Pods. Supported protocols are TCP and UDP.
  The internal DNS name for this Service will be the value you specified as application name above.
  -->
  不管哪種 Service 類型，如果你選擇創建一個 Service，而且容器在一個端口上開啓了監聽（入向的），
  那麼你需要定義兩個端口。創建的 Service 會把（入向的）端口映射到容器可見的目標端口。
  該 Service 會把流量路由到你部署的 Pod。支持 TCP 協議和 UDP 協議。
  這個 Service 的內部 DNS 解析名就是之前你定義的應用名稱的值。

<!--
If needed, you can expand the **Advanced options** section where you can specify more settings:
 -->
如果需要，你可以打開 **Advanced Options** 部分，這裏你可以定義更多設置：

<!--
- **Description**: The text you enter here will be added as an
  [annotation](/docs/concepts/overview/working-with-objects/annotations/)
  to the Deployment and displayed in the application's details.
 -->
- **描述**：這裏你輸入的文本會作爲一個
  [註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)
  添加到 Deployment，並顯示在應用的詳細資訊中。

<!--
- **Labels**: Default [labels](/docs/concepts/overview/working-with-objects/labels/) to be used
  for your application are application name and version.
  You can specify additional labels to be applied to the Deployment, Service (if any), and Pods,
  such as release, environment, tier, partition, and release track.
-->
- **標籤**：應用預設使用的
  [標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)是應用名稱和版本。
  你可以爲 Deployment、Service（如果有）定義額外的標籤，比如 release（版本）、
  environment（環境）、tier（層級）、partition（分區） 和 release track（版本跟蹤）。

  <!-- Example: -->
  例子：

  ```conf
  release=1.0
  tier=frontend
  environment=pod
  track=stable
  ```

<!--
- **Namespace**: Kubernetes supports multiple virtual clusters backed by the same physical cluster.
  These virtual clusters are called [namespaces](/docs/tasks/administer-cluster/namespaces/).
  They let you partition resources into logically named groups.
-->
- **名字空間**：Kubernetes 支持多個虛擬叢集依附於同一個物理叢集。
  這些虛擬叢集被稱爲[名字空間](/zh-cn/docs/tasks/administer-cluster/namespaces/)，
  可以讓你將資源劃分爲邏輯命名的組。

  <!--
  Dashboard offers all available namespaces in a dropdown list, and allows you to create a new namespace.
  The namespace name may contain a maximum of 63 alphanumeric characters and dashes (-) but can not contain capital letters.
  -->
  Dashboard 通過下拉菜單提供所有可用的名字空間，並允許你創建新的名字空間。
  名字空間的名稱最長可以包含 63 個字母或數字和中橫線（-），但是不能包含大寫字母。

  <!--
  Namespace names should not consist of only numbers.
  If the name is set as a number, such as 10, the pod will be put in the default namespace.
  -->
  名字空間的名稱不能只包含數字。如果名字被設置成一個數字，比如 10，pod 就

  <!--
  In case the creation of the namespace is successful, it is selected by default.
  If the creation fails, the first namespace is selected.
  -->
  在名字空間創建成功的情況下，預設會使用新創建的名字空間。如果創建失敗，那麼第一個名字空間會被選中。

<!--
- **Image Pull Secret**:
  In case the specified Docker container image is private, it may require
  [pull secret](/docs/concepts/configuration/secret/) credentials.
-->
- **映像檔拉取 Secret**：如果要使用私有的 Docker 容器映像檔，需要拉取
  [Secret](/zh-cn/docs/concepts/configuration/secret/) 憑證。

  <!--
  Dashboard offers all available secrets in a dropdown list, and allows you to create a new secret.
  The secret name must follow the DNS domain name syntax, for example `new.image-pull.secret`.
  The content of a secret must be base64-encoded and specified in a
  [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) file.
  The secret name may consist of a maximum of 253 characters.
  -->
  Dashboard 通過下拉菜單提供所有可用的 Secret，並允許你創建新的 Secret。
  Secret 名稱必須遵循 DNS 域名語法，比如 `new.image-pull.secret`。
  Secret 的內容必須是 base64 編碼的，並且在一個
  [`.dockercfg`](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
  檔案中聲明。Secret 名稱最大可以包含 253 個字符。
  
  <!--
  In case the creation of the image pull secret is successful, it is selected by default. If the creation fails, no secret is applied.
  -->
  在映像檔拉取 Secret 創建成功的情況下，預設會使用新創建的 Secret。
  如果創建失敗，則不會使用任何 Secret。

<!--
- **CPU requirement (cores)** and **Memory requirement (MiB)**:
  You can specify the minimum [resource limits](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
  for the container. By default, Pods run with unbounded CPU and memory limits.
 -->
- **CPU 需求（核數）** 和 **內存需求（MiB）**：你可以爲容器定義最小的
  [資源限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
  預設情況下，Pod 沒有 CPU 和內存限制。

<!--
- **Run command** and **Run command arguments**:
  By default, your containers run the specified Docker image's default
  [entrypoint command](/docs/tasks/inject-data-application/define-command-argument-container/).
  You can use the command options and arguments to override the default.
 -->
- **運行命令**和**運行命令參數**：預設情況下，你的容器會運行 Docker
  映像檔的預設[入口命令](/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/)。
  你可以使用 command 選項覆蓋預設值。

<!--
- **Run as privileged**: This setting determines whether processes in
  [privileged containers](/docs/concepts/workloads/pods/#privileged-mode-for-containers)
  are equivalent to processes running as root on the host.
  Privileged containers can make use of capabilities like manipulating the network stack and accessing devices.
 -->
- **以特權模式運行**：這個設置決定了在
  [特權容器](/zh-cn/docs/concepts/workloads/pods/#privileged-mode-for-containers)
  中運行的進程是否像主機中使用 root 運行的進程一樣。
  特權容器可以使用諸如操縱網路堆棧和訪問設備的功能。

<!--
- **Environment variables**: Kubernetes exposes Services through
  [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
  You can compose environment variable or pass arguments to your commands using the values of environment variables.
  They can be used in applications to find a Service.
  Values can reference other variables using the `$(VAR_NAME)` syntax.
 -->
- **環境變量**：Kubernetes 通過
  [環境變量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
  暴露 Service。你可以構建環境變量，或者將環境變量的值作爲參數傳遞給你的命令。
  它們可以被應用用於查找 Service。值可以通過 `$(VAR_NAME)` 語法關聯其他變量。

<!--
### Uploading a YAML or JSON file

Kubernetes supports declarative configuration.
In this style, all configuration is stored in manifests (YAML or JSON configuration files).
The manifests use Kubernetes [API](/docs/concepts/overview/kubernetes-api/) resource schemas.
-->
### 上傳 YAML 或者 JSON 檔案   {#uploading-a-yaml-or-json-file}

Kubernetes 支持聲明式設定。所有的設定都儲存在清單檔案
（YAML 或者 JSON 設定檔案）中。
這些清單使用 Kubernetes [API](/zh-cn/docs/concepts/overview/kubernetes-api/) 定義的資源模式。

<!--
As an alternative to specifying application details in the deploy wizard,
you can define your application in one or more manifests, and upload the files using Dashboard.
-->
作爲一種替代在部署嚮導中指定應用詳情的方式，你可以在一個或多個清單檔案中定義應用，並且使用
Dashboard 上傳檔案。

<!--
## Using Dashboard

Following sections describe views of the Kubernetes Dashboard UI; what they provide and how can they be used.
-->
## 使用 Dashboard   {#using-dashboard}

以下各節描述了 Kubernetes Dashboard UI 視圖；包括它們提供的內容，以及怎麼使用它們。

<!--
### Navigation

When there are Kubernetes objects defined in the cluster, Dashboard shows them in the initial view.
By default only objects from the _default_ namespace are shown and
this can be changed using the namespace selector located in the navigation menu.
-->
### 導航   {#navigation}

當在叢集中定義 Kubernetes 對象時，Dashboard 會在初始視圖中顯示它們。
預設情況下只會顯示**預設**名字空間中的對象，可以通過更改導航欄菜單中的名字空間篩選器進行改變。

<!--
Dashboard shows most Kubernetes object kinds and groups them in a few menu categories.
-->
Dashboard 展示大部分 Kubernetes 對象，並將它們分組放在幾個菜單類別中。

<!--
#### Admin overview

For cluster and namespace administrators, Dashboard lists Nodes, Namespaces and PersistentVolumes and has detail views for them.
Node list view contains CPU and memory usage metrics aggregated across all Nodes.
The details view shows the metrics for a Node, its specification, status,
allocated resources, events and pods running on the node.
-->
#### 管理概述   {#admin-overview}

叢集和名字空間管理的視圖，Dashboard 會列出節點、名字空間和持久卷，並且有它們的詳細視圖。
節點列表視圖包含從所有節點聚合的 CPU 和內存使用的度量值。
詳細資訊視圖顯示了一個節點的度量值，它的規格、狀態、分配的資源、事件和這個節點上運行的 Pod。

<!--
#### Workloads

Shows all applications running in the selected namespace.
The view lists applications by workload kind (for example: Deployments, ReplicaSets, StatefulSets).
Each workload kind can be viewed separately.
The lists summarize actionable information about the workloads,
such as the number of ready pods for a ReplicaSet or current memory usage for a Pod.
 -->
#### 負載   {#workloads}

顯示選中的名字空間中所有運行的應用。
視圖按照負載類型（例如：Deployment、ReplicaSet、StatefulSet）羅列應用，並且每種負載都可以單獨查看。
列表總結了關於負載的可執行資訊，比如一個 ReplicaSet 的就緒狀態的 Pod 數量，或者目前一個 Pod 的內存用量。

<!--
Detail views for workloads show status and specification information and
surface relationships between objects.
For example, Pods that ReplicaSet is controlling or new ReplicaSets and HorizontalPodAutoscalers for Deployments.
-->
工作負載的詳情視圖展示了對象的狀態、詳細資訊和相互關係。
例如，ReplicaSet 所控制的 Pod，或者 Deployment 所關聯的新 ReplicaSet 和
HorizontalPodAutoscalers。

<!--
#### Services

Shows Kubernetes resources that allow for exposing services to external world and
discovering them within a cluster.
For that reason, Service and Ingress views show Pods targeted by them,
internal endpoints for cluster connections and external endpoints for external users.
-->
#### 服務   {#services}

展示允許暴露給外網服務和允許叢集內部發現的 Kubernetes 資源。
因此，Service 和 Ingress 視圖展示他們關聯的 Pod、給叢集連接使用的內部端點和給外部使用者使用的外部端點。

<!--
#### Storage

Storage view shows PersistentVolumeClaim resources which are used by applications for storing data.
-->
#### 儲存   {#storage}

儲存視圖展示持久卷申領（PVC）資源，這些資源被應用程式用來儲存資料。

<!--
#### ConfigMaps and Secrets {#config-maps-and-secrets}

Shows all Kubernetes resources that are used for live configuration of applications running in clusters.
The view allows for editing and managing config objects and displays secrets hidden by default.
-->
#### ConfigMap 和 Secret {#config-maps-and-secrets}

展示的所有 Kubernetes 資源是在叢集中運行的應用程式的實時設定。
通過這個視圖可以編輯和管理設定對象，並顯示那些預設隱藏的 Secret。

<!--
#### Logs viewer

Pod lists and detail pages link to a logs viewer that is built into Dashboard.
The viewer allows for drilling down logs from containers belonging to a single Pod.
-->
#### 日誌查看器   {#logs-viewer}

Pod 列表和詳細資訊頁面可以鏈接到 Dashboard 內置的日誌查看器。
查看器可以深入查看屬於同一個 Pod 的不同容器的日誌。

<!--
![Logs viewer](/images/docs/ui-dashboard-logs-view.png)
 -->
![日誌瀏覽](/images/docs/ui-dashboard-logs-view.png)

## {{% heading "whatsnext" %}}

<!--
For more information, see the
[Kubernetes Dashboard project page](https://github.com/kubernetes/dashboard).
-->
更多資訊，參見 [Kubernetes Dashboard 項目頁面](https://github.com/kubernetes/dashboard)。
