---
title: 在 Kubernetes 中運行 Windows 容器的指南
content_type: tutorial
weight: 75
---
<!-- 
reviewers:
- jayunit100
- jsturtevant
- marosset
title: Guide for Running Windows Containers in Kubernetes
content_type: tutorial
weight: 75
-->

<!-- overview -->

<!-- 
This page provides a walkthrough for some steps you can follow to run
Windows containers using Kubernetes.
The page also highlights some Windows specific functionality within Kubernetes.

It is important to note that creating and deploying services and workloads on Kubernetes
behaves in much the same way for Linux and Windows containers.
The [kubectl commands](/docs/reference/kubectl/) to interface with the cluster are identical.
The examples in this page are provided to jumpstart your experience with Windows containers.
-->
本文提供了一些參考演示步驟，方便你使用 Kubernetes 運行 Windows 容器。
本文還重點介紹了 Kubernetes 中專爲 Windows 設計的一些特有功能。

需要注意的是，在 Kubernetes 中創建和部署服務與工作負載的行爲，對於 Linux 容器和 Windows 容器來說是相同的。
與叢集交互的 [kubectl 命令](/zh-cn/docs/reference/kubectl/)也是完全一致的。
本文中的幾個例子旨在幫助你快速開始使用 Windows 容器。

<!-- body -->

<!-- 
## Objectives

Configure an example deployment to run Windows containers on a Windows node.
-->
## 目標  {#objectives}

設定 Deployment 樣例以在 Windows 節點上運行 Windows 容器。

## {{% heading "prerequisites" %}}

<!--
You should already have access to a Kubernetes cluster that includes a
worker node running Windows Server.
-->
你應當已經擁有一個 Kubernetes 叢集的訪問權限，並且該叢集中包含一個運行 Windows Server 的工作節點。

<!-- 
## Getting Started: Deploying a Windows workload

The example YAML file below deploys a simple webserver application running inside a Windows container.

Create a manifest named `win-webserver.yaml` with the contents below:
-->
## 快速開始：部署 Windows 工作負載  {#getting-started-deploying-a-windows-workload}

以下示例 YAML 文件部署了一個在 Windows 容器內運行的簡單 Web 伺服器的應用。

創建一個名爲 `win-webserver.yaml` 的清單（Manifest），其內容如下：

<!--
# the port that this service should serve on
-->
```yaml
apiVersion: v1
kind: Service
metadata:
  name: win-webserver
  labels:
    app: win-webserver
spec:
  ports:
    # 此 Service 服務的端口
    - port: 80
      targetPort: 80
  selector:
    app: win-webserver
  type: NodePort
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: win-webserver
  name: win-webserver
spec:
  replicas: 2
  selector:
    matchLabels:
      app: win-webserver
  template:
    metadata:
      labels:
        app: win-webserver
      name: win-webserver
    spec:
     containers:
      - name: windowswebserver
        image: mcr.microsoft.com/windows/servercore:ltsc2019
        command:
        - powershell.exe
        - -command
        - "<#code used from https://gist.github.com/19WAS85/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
     nodeSelector:
      kubernetes.io/os: windows
```

{{< note >}}
<!-- 
Port mapping is also supported, but for simplicity this example exposes
port 80 of the container directly to the Service.
-->
端口映射也是支持的，但爲簡單起見，此示例將容器的端口 80 直接暴露給服務。
{{< /note >}}

<!-- 
1. Check that all nodes are healthy:
-->
1. 檢查所有節點是否健康

   ```bash
   kubectl get nodes
   ```

<!-- 
1. Deploy the service and watch for pod updates:
-->
2. 部署 Service 並監視 Pod 更新：

   ```bash
   kubectl apply -f win-webserver.yaml
   kubectl get pods -o wide -w
   ```

   <!-- 
   When the service is deployed correctly both Pods are marked as Ready. To exit the watch command, press Ctrl+C.
   -->

   當 Service 被正確部署時，兩個 Pod 都被標記爲就緒（Ready）。要退出 watch 命令，請按 Ctrl+C。

<!-- 
1. Check that the deployment succeeded. To verify:

    * Several pods listed from the Linux control plane node, use `kubectl get pods`
    * Node-to-pod communication across the network, `curl` port 80 of your pod IPs from the Linux control plane node
      to check for a web server response
    * Pod-to-pod communication, ping between pods (and across hosts, if you have more than one Windows node)
      using `kubectl exec`
    * Service-to-pod communication, `curl` the virtual service IP (seen under `kubectl get services`)
      from the Linux control plane node and from individual pods
    * Service discovery, `curl` the service name with the Kubernetes [default DNS suffix](/docs/concepts/services-networking/dns-pod-service/#services)
    * Inbound connectivity, `curl` the NodePort from the Linux control plane node or machines outside of the cluster
    * Outbound connectivity, `curl` external IPs from inside the pod using `kubectl exec`
-->
3. 檢查部署是否成功。請驗證：

   * 當執行 `kubectl get pods` 命令時，能夠從 Linux 控制平面所在的節點上列出若干 Pod。
   * 跨網路的節點到 Pod 通信，從 Linux 控制平面所在的節點上執行 `curl` 命令來訪問
     Pod IP 的 80 端口以檢查 Web 伺服器響應。
   * Pod 間通信，使用 `kubectl exec`
     命令進入容器，並在 Pod 之間（以及跨主機，如果你有多個 Windows 節點）相互進行 ping 操作。
   * Service 到 Pod 的通信，在 Linux 控制平面所在的節點以及獨立的 Pod 中執行 `curl`
     命令來訪問虛擬的服務 IP（在 `kubectl get services` 命令下查看）。
   * 服務發現，執行 `curl` 命令來訪問帶有 Kubernetes
     [默認 DNS 後綴](/zh-cn/docs/concepts/services-networking/dns-pod-service/#services)的服務名稱。
   * 入站連接，在 Linux 控制平面所在的節點上或叢集外的機器上執行 `curl` 命令來訪問 NodePort 服務。
   * 出站連接，使用 `kubectl exec`，從 Pod 內部執行 `curl` 訪問外部 IP。

{{< note >}}
<!-- 
Windows container hosts are not able to access the IP of services scheduled on them due to current platform limitations of the Windows networking stack.
Only Windows pods are able to access service IPs.
-->
由於當前 Windows 平臺的網路堆棧限制，Windows 容器主機無法訪問調度到其上的 Service 的 IP。
只有 Windows Pod 能夠訪問 Service IP。
{{< /note >}}

<!-- 
## Observability

### Capturing logs from workloads

Logs are an important element of observability; they enable users to gain insights
into the operational aspect of workloads and are a key ingredient to troubleshooting issues.
Because Windows containers and workloads inside Windows containers behave differently from Linux containers,
users had a hard time collecting logs, limiting operational visibility.
Windows workloads for example are usually configured to log to ETW (Event Tracing for Windows)
or push entries to the application event log.
[LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor), an open source tool by Microsoft,
is the recommended way to monitor configured log sources inside a Windows container.
LogMonitor supports monitoring event logs, ETW providers, and custom application logs,
piping them to STDOUT for consumption by `kubectl logs <pod>`.
-->
## 可觀察性  {#observability}

### 捕捉來自工作負載的日誌  {#capturing-logs-from-workloads}

日誌是可觀察性的重要元素；它們使使用者能夠深入瞭解工作負載的運行情況，並且是解決問題的關鍵因素。
由於 Windows 容器和 Windows 容器中的工作負載與 Linux 容器的行爲不同，因此使用者很難收集日誌，從而限制了操作可見性。
例如，Windows 工作負載通常設定爲記錄到 ETW（Windows 事件跟蹤）或嚮應用程序事件日誌推送條目。
[LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor)
是一個微軟開源的工具，是監視 Windows 容器內所設定的日誌源的推薦方法。
LogMonitor 支持監視事件日誌、ETW 提供程序和自定義應用程序日誌，將它們傳送到 STDOUT 以供 `kubectl logs <pod>` 使用。

<!--
Follow the instructions in the LogMonitor GitHub page to copy its binaries and configuration files
to all your containers and add the necessary entrypoints for LogMonitor to push your logs to STDOUT.
-->
按照 LogMonitor GitHub 頁面中的說明，將其二進制文件和設定文件複製到所有容器，
併爲 LogMonitor 添加必要的入口點以將日誌推送到標準輸出（STDOUT）。

<!-- 
## Configuring container user

### Using configurable Container usernames

Windows containers can be configured to run their entrypoints and processes
with different usernames than the image defaults.
Learn more about it [here](/docs/tasks/configure-pod-container/configure-runasusername/).
-->
## 設定容器使用者  {#configuring-container-user}

### 使用可設定的容器使用者名  {#using-configurable-container-usernames}

Windows 容器可以設定爲使用不同於映像檔默認值的使用者名來運行其入口點和進程。
[在這裏](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername/)瞭解更多信息。

<!-- 
### Managing Workload Identity with Group Managed Service Accounts

Windows container workloads can be configured to use Group Managed Service Accounts (GMSA).
Group Managed Service Accounts are a specific type of Active Directory account that provide automatic password management,
simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers.
Containers configured with a GMSA can access external Active Directory Domain resources while carrying the identity configured with the GMSA.
Learn more about configuring and using GMSA for Windows containers [here](/docs/tasks/configure-pod-container/configure-gmsa/).
-->
### 使用組託管服務帳戶（GMSA）管理工作負載身份  {#managing-workload-identity-with-group-managed-service-accounts}

Windows 容器工作負載可以設定爲使用組託管服務帳戶（Group Managed Service Accounts，GMSA）。
組託管服務帳戶是一種特定類型的活動目錄（Active Directory）帳戶，可提供自動密碼管理、
簡化的服務主體名稱（Service Principal Name，SPN）管理，以及將管理委派給多個伺服器上的其他管理員的能力。
設定了 GMSA 的容器可以攜帶使用 GMSA 設定的身份訪問外部活動目錄域資源。
在[此處](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/)瞭解有關爲 Windows
容器設定和使用 GMSA 的更多信息。

<!-- 
## Taints and tolerations

Users need to use some combination of {{<glossary_tooltip text="taint" term_id="taint" >}}
and node selectors in order to schedule Linux and Windows workloads to their respective OS-specific nodes.
The recommended approach is outlined below,
with one of its main goals being that this approach should not break compatibility for existing Linux workloads.

You can (and should) set `.spec.os.name` for each Pod, to indicate the operating system
that the containers in that Pod are designed for. For Pods that run Linux containers, set
`.spec.os.name` to `linux`. For Pods that run Windows containers, set `.spec.os.name`
to `windows`.
-->
## 污點和容忍度  {#taints-and-tolerations}

使用者需要使用某種{{<glossary_tooltip text="污點" term_id="taint" >}}和節點選擇器的組合，
以便將 Linux 和 Windows 工作負載各自調度到特定操作系統的節點。
下面概述了推薦的方法，其主要目標之一是該方法不應破壞現有 Linux 工作負載的兼容性。

你可以（並且應該）將每個 Pod 的 `.spec.os.name` 設置爲 Pod 中的容器設計所用於的操作系統。
對於運行 Linux 容器的 Pod，將 `.spec.os.name` 設置爲 `linux`。
對於運行 Windows 容器的 Pod，將 `.spec.os.name` 設置爲 `windows`。

{{< note >}}
<!--
If you are running a version of Kubernetes older than 1.24, you may need to enable
the `IdentifyPodOS` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to be able to set a value for `.spec.pod.os`.
-->
如果你運行的 Kubernetes 版本低於 1.24，你可能需要啓用 `IdentifyPodOS`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
才能爲 `.spec.pod.os` 設置值。
{{< /note >}}

<!-- 
The scheduler does not use the value of `.spec.os.name` when assigning Pods to nodes. You should
use normal Kubernetes mechanisms for
[assigning pods to nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
to ensure that the control plane for your cluster places pods onto nodes that are running the
appropriate operating system.

The `.spec.os.name` value has no effect on the scheduling of the Windows pods,
so taints and tolerations (or node selectors) are still required
 to ensure that the Windows pods land onto appropriate Windows nodes.
-->
調度器在將 Pod 分配到節點時並不使用 `.spec.os.name` 的值。
你應該使用正常的 Kubernetes 機制[將 Pod 分配給節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)，
以確保叢集的控制平面將 Pod 放置到運行適當操作系統的節點上。

`.spec.os.name` 值對 Windows Pod 的調度沒有影響，
因此仍然需要污點和容忍（或節點選擇器）來確保 Windows Pod 落在適當的 Windows 節點。

<!-- 
### Ensuring OS-specific workloads land on the appropriate container host

Users can ensure Windows containers can be scheduled on the appropriate host using taints and tolerations.
All Kubernetes nodes running Kubernetes {{< skew currentVersion >}} have the following default labels:
-->
### 確保特定於操作系統的工作負載落到合適的容器主機上  {#ensuring-os-specific-workloads-land-on-the-appropriate-container-host}

使用者可以使用污點（Taint）和容忍度（Toleration）確保將 Windows 容器調度至合適的主機上。
所有運行 Kubernetes {{< skew currentVersion >}} 的 Kubernetes 節點都有以下默認標籤：

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

<!-- 
If a Pod specification does not specify a `nodeSelector` such as `"kubernetes.io/os": windows`,
it is possible the Pod can be scheduled on any host, Windows or Linux.
This can be problematic since a Windows container can only run on Windows and a Linux container can only run on Linux.
The best practice for Kubernetes {{< skew currentVersion >}} is to use a `nodeSelector`.
-->
如果 Pod 規約沒有指定像 `"kubernetes.io/os": windows` 這樣的 `nodeSelector`，
則 Pod 可以被調度到任何主機上，Windows 或 Linux。
這可能會有問題，因爲 Windows 容器只能在 Windows 上運行，而 Linux 容器只能在 Linux 上運行。
Kubernetes {{< skew currentVersion >}} 的最佳實踐是使用 `nodeSelector`。

<!-- 
However, in many cases users have a pre-existing large number of deployments for Linux containers,
as well as an ecosystem of off-the-shelf configurations, such as community Helm charts, and programmatic Pod generation cases, such as with operators.
In those situations, you may be hesitant to make the configuration change to add `nodeSelector` fields to all Pods and Pod templates.
The alternative is to use taints. Because the kubelet can set taints during registration,
it could easily be modified to automatically add a taint when running on Windows only.
-->
但是，在許多情況下，使用者已經預先存在大量 Linux 容器部署，
以及現成設定的生態系統，例如社區中的 Helm Chart 包和程序化的 Pod 生成案例，例如 Operator。
在這些情況下，你可能不願更改設定來添加 `nodeSelector` 字段到所有 Pod 或 Pod 模板。
另一種方法是使用污點。因爲 kubelet 可以在註冊過程中設置污點，
所以可以很容易地修改爲，當只能在 Windows 上運行時，自動添加污點。

<!-- 
For example:  `--register-with-taints='os=windows:NoSchedule'`

By adding a taint to all Windows nodes, nothing will be scheduled on them (that includes existing Linux Pods).
In order for a Windows Pod to be scheduled on a Windows node,
it would need both the `nodeSelector` and the appropriate matching toleration to choose Windows.
-->
例如：`--register-with-taints='os=windows:NoSchedule'`

通過向所有 Windows 節點添加污點，任何負載都不會被調度到這些節點上（包括現有的 Linux Pod）。
爲了在 Windows 節點上調度 Windows Pod，它需要 `nodeSelector` 和匹配合適的容忍度來選擇 Windows。

```yaml
nodeSelector:
    kubernetes.io/os: windows
    node.kubernetes.io/windows-build: '10.0.17763'
tolerations:
    - key: "os"
      operator: "Equal"
      value: "windows"
      effect: "NoSchedule"
```

<!-- 
### Handling multiple Windows versions in the same cluster

The Windows Server version used by each pod must match that of the node. If you want to use multiple Windows
Server versions in the same cluster, then you should set additional node labels and `nodeSelector` fields.

Kubernetes automatically adds a label,
[`node.kubernetes.io/windows-build`](/docs/reference/labels-annotations-taints/#nodekubernetesiowindows-build)
to simplify this.

This label reflects the Windows major, minor, and build number that need to match for compatibility.
Here are values used for each Windows Server version:
-->
### 處理同一叢集中的多個 Windows 版本  {#handling-multiple-windows-versions-in-the-same-cluster}

每個 Pod 使用的 Windows Server 版本必須與節點的版本匹配。
如果要在同一個叢集中使用多個 Windows Server 版本，則應設置額外的節點標籤和 `nodeSelector` 字段。

Kubernetes 自動添加了一個新標籤
[`node.kubernetes.io/windows-build`](/zh-cn/docs/reference/labels-annotations-taints/#nodekubernetesiowindows-build)
來簡化這一點。

此標籤反映了需要匹配以實現兼容性的 Windows 主要、次要和內部版本號。
以下是用於每個 Windows Server 版本的值。

<!-- 
| Product Name                         | Version                |
|--------------------------------------|------------------------|
| Windows Server 2019                  | 10.0.17763             |
| Windows Server 2022                  | 10.0.20348             |
-->
| 產品名稱                              |   版本                |
|--------------------------------------|------------------------|
| Windows Server 2019                  | 10.0.17763             |
| Windows Server 2022                  | 10.0.20348             |

<!-- 
### Simplifying with RuntimeClass

[RuntimeClass] can be used to simplify the process of using taints and tolerations.
A cluster administrator can create a `RuntimeClass` object which is used to encapsulate these taints and tolerations.

1. Save this file to `runtimeClasses.yml`. It includes the appropriate `nodeSelector`
   for the Windows OS, architecture, and version.
-->
### 使用 RuntimeClass 進行簡化  {#simplifying-with-runtimeclass}

[RuntimeClass] 可用於簡化使用污點和容忍度的流程。
叢集管理員可以創建一個用於封裝這些污點和容忍度的 `RuntimeClass` 對象。

1. 將此文件保存到 `runtimeClasses.yml`。它包括針對 Windows 操作系統、架構和版本的 `nodeSelector`。

   ```yaml
   ---
   apiVersion: node.k8s.io/v1
   kind: RuntimeClass
   metadata:
     name: windows-2019
   handler: example-container-runtime-handler
   scheduling:
     nodeSelector:
       kubernetes.io/os: 'windows'
       kubernetes.io/arch: 'amd64'
       node.kubernetes.io/windows-build: '10.0.17763'
     tolerations:
     - effect: NoSchedule
       key: os
       operator: Equal
       value: "windows"
   ```

<!-- 
1. Run `kubectl create -f runtimeClasses.yml` using as a cluster administrator
1. Add `runtimeClassName: windows-2019` as appropriate to Pod specs

   For example:
-->
2. 以叢集管理員身份運行 `kubectl create -f runtimeClasses.yml`
3. 根據情況，向 Pod 規約中添加 `runtimeClassName: windows-2019`

   例如：

   ```yaml
   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: iis-2019
     labels:
       app: iis-2019
   spec:
     replicas: 1
     template:
       metadata:
         name: iis-2019
         labels:
           app: iis-2019
       spec:
         runtimeClassName: windows-2019
         containers:
         - name: iis
           image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
           resources:
             limits:
               cpu: 1
               memory: 800Mi
             requests:
               cpu: .1
               memory: 300Mi
           ports:
             - containerPort: 80
    selector:
       matchLabels:
         app: iis-2019
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: iis
   spec:
     type: LoadBalancer
     ports:
     - protocol: TCP
       port: 80
     selector:
       app: iis-2019
   ```

[RuntimeClass]: /zh-cn/docs/concepts/containers/runtime-class/
