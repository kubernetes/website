---
title: Kubernetes 中的 Windows 容器排程指南
content_type: concept
weight: 75
---
<!-- 
reviewers:
- jayunit100
- jsturtevant
- marosset
title: Guide for scheduling Windows containers in Kubernetes
content_type: concept
weight: 75
-->

<!-- overview -->

<!-- 
Windows applications constitute a large portion of the services and applications that run in many organizations.
This guide walks you through the steps to configure and deploy Windows containers in Kubernetes.
-->
在許多組織中執行的服務和應用程式中，Windows 應用程式構成了很大一部分。
本指南將引導你完成在 Kubernetes 中配置和部署 Windows 容器的步驟。

<!-- body -->

<!-- 
## Objectives

* Configure an example deployment to run Windows containers on the Windows node
* Highlight Windows specific funcationality in Kubernetes
-->
## 目標  {#objectives}

* 配置 Deployment 樣例以在 Windows 節點上執行 Windows 容器
* 在 Kubernetes 中突出 Windows 特定的功能

<!-- 
## Before you begin

* Create a Kubernetes cluster that includes a
control plane and a [worker node running Windows Server](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)
* It is important to note that creating and deploying services and workloads on Kubernetes
behaves in much the same way for Linux and Windows containers.
[Kubectl commands](/docs/reference/kubectl/) to interface with the cluster are identical.
The example in the section below is provided to jumpstart your experience with Windows containers.
-->
## 在你開始之前  {#before-you-begin}

* 建立一個 Kubernetes 叢集，其中包含一個控制平面和一個[執行 Windows Server 的工作節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)
* 務必請注意，在 Kubernetes 上建立和部署服務和工作負載的行為方式與 Linux 和 Windows 容器的行為方式大致相同。
  與叢集互動的 [kubectl 命令](/zh-cn/docs/reference/kubectl/)是一致的。
  下一小節的示例旨在幫助你快速開始使用 Windows 容器。

<!-- 
## Getting Started: Deploying a Windows container

The example YAML file below deploys a simple webserver application running inside a Windows container.

Create a service spec named `win-webserver.yaml` with the contents below:
-->
## 快速開始：部署 Windows 容器  {#getting-started-deploying-a-windows-container}

以下示例 YAML 檔案部署了一個在 Windows 容器內執行的簡單 Web 伺服器的應用程式。

建立一個名為 `win-webserver.yaml` 的 Service 規約，其內容如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: win-webserver
  labels:
    app: win-webserver
spec:
  ports:
    # 此 Service 服務的埠
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
埠對映也是支援的，但為簡單起見，此示例將容器的埠 80 直接暴露給服務。
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
1. 部署 Service 並監視 Pod 更新：

   ```bash
   kubectl apply -f win-webserver.yaml
   kubectl get pods -o wide -w
   ```

   <!-- 
   When the service is deployed correctly both Pods are marked as Ready. To exit the watch command, press Ctrl+C.
   -->
   當 Service 被正確部署時，兩個 Pod 都被標記為就緒（Ready）。要退出 watch 命令，請按 Ctrl+C。

<!-- 
1. Check that the deployment succeeded. To verify:

    * Two pods listed from the Linux control plane node, use `kubectl get pods`
    * Node-to-pod communication across the network, `curl` port 80 of your pod IPs from the Linux control plane node
      to check for a web server response
    * Pod-to-pod communication, ping between pods (and across hosts, if you have more than one Windows node)
      using docker exec or kubectl exec
    * Service-to-pod communication, `curl` the virtual service IP (seen under `kubectl get services`)
      from the Linux control plane node and from individual pods
    * Service discovery, `curl` the service name with the Kubernetes [default DNS suffix](/docs/concepts/services-networking/dns-pod-service/#services)
    * Inbound connectivity, `curl` the NodePort from the Linux control plane node or machines outside of the cluster
    * Outbound connectivity, `curl` external IPs from inside the pod using kubectl exec
-->
1. 檢查部署是否成功。請驗證：

   * 使用 `kubectl get pods` 從 Linux 控制平面節點能夠列出兩個 Pod
   * 跨網路的節點到 Pod 通訊，從 Linux 控制平面節點上執行 `curl` 訪問
     Pod IP 的 80 埠以檢查 Web 伺服器響應
   * Pod 間通訊，使用 docker exec 或 kubectl exec
     在 Pod 之間（以及跨主機，如果你有多個 Windows 節點）互 ping
   * Service 到 Pod 的通訊，在 Linux 控制平面節點以及獨立的 Pod 中執行 `curl`
     訪問虛擬的服務 IP（在 `kubectl get services` 下檢視）
   * 服務發現，使用 Kubernetes [預設 DNS 字尾](/zh-cn/docs/concepts/services-networking/dns-pod-service/#services)的服務名稱，
     用 `curl` 訪問服務名稱
   * 入站連線，在 Linux 控制平面節點或叢集外的機器上執行 `curl` 來訪問 NodePort 服務
   * 出站連線，使用 kubectl exec，從 Pod 內部執行 `curl` 訪問外部 IP

{{< note >}}
<!-- 
Windows container hosts are not able to access the IP of services scheduled on them due to current platform limitations of the Windows networking stack.
Only Windows pods are able to access service IPs.
-->
由於當前 Windows 平臺的網路堆疊限制，Windows 容器主機無法訪問排程到其上的 Service 的 IP。
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

Follow the instructions in the LogMonitor GitHub page to copy its binaries and configuration files
to all your containers and add the necessary entrypoints for LogMonitor to push your logs to STDOUT.
-->
## 可觀察性  {#observability}

### 捕捉來自工作負載的日誌  {#capturing-logs-from-workloads}

日誌是可觀察性的重要元素；它們使使用者能夠深入瞭解工作負載的執行情況，並且是解決問題的關鍵因素。
由於 Windows 容器和 Windows 容器中的工作負載與 Linux 容器的行為不同，因此使用者很難收集日誌，從而限制了操作可見性。
例如，Windows 工作負載通常配置為記錄到 ETW（Windows 事件跟蹤）或嚮應用程式事件日誌推送條目。
[LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor)
是一個微軟開源的工具，是監視 Windows 容器內所配置的日誌源的推薦方法。
LogMonitor 支援監視事件日誌、ETW 提供程式和自定義應用程式日誌，將它們傳送到 STDOUT 以供 `kubectl logs <pod>` 使用。

按照 LogMonitor GitHub 頁面中的說明，將其二進位制檔案和配置檔案複製到所有容器，
併為 LogMonitor 新增必要的入口點以將日誌推送到標準輸出（STDOUT）。

<!-- 
## Configuring container user

### Using configurable Container usernames

Windows containers can be configured to run their entrypoints and processes
with different usernames than the image defaults.
Learn more about it [here](/docs/tasks/configure-pod-container/configure-runasusername/).
-->
## 配置容器使用者  {#configuring-container-user}

### 使用可配置的容器使用者名稱  {#using-configurable-container-usernames}

Windows 容器可以配置為使用不同於映象預設值的使用者名稱來執行其入口點和程序。
[在這裡](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername/)瞭解更多資訊。

<!-- 
### Managing Workload Identity with Group Managed Service Accounts

Windows container workloads can be configured to use Group Managed Service Accounts (GMSA).
Group Managed Service Accounts are a specific type of Active Directory account that provide automatic password management,
simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers.
Containers configured with a GMSA can access external Active Directory Domain resources while carrying the identity configured with the GMSA.
Learn more about configuring and using GMSA for Windows containers [here](/docs/tasks/configure-pod-container/configure-gmsa/).
-->
### 使用組託管服務帳戶（GMSA）管理工作負載身份  {#managing-workload-identity-with-group-managed-service-accounts}

Windows 容器工作負載可以配置為使用組託管服務帳戶（Group Managed Service Accounts，GMSA）。
組託管服務帳戶是一種特定型別的活動目錄（Active Directory）帳戶，可提供自動密碼管理、
簡化的服務主體名稱（Service Principal Name，SPN）管理，以及將管理委派給多個伺服器上的其他管理員的能力。
配置了 GMSA 的容器可以攜帶使用 GMSA 配置的身份訪問外部活動目錄域資源。
在[此處](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/)瞭解有關為 Windows 容器配置和使用 GMSA 的更多資訊。

<!-- 
## Taints and Tolerations

Users need to use some combination of taints and node selectors in order to
schedule Linux and Windows workloads to their respective OS-specific nodes.
The recommended approach is outlined below,
with one of its main goals being that this approach should not break compatibility for existing Linux workloads.

If the `IdentifyPodOS` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is
enabled, you can (and should) set `.spec.os.name` for a Pod to indicate the operating system
that the containers in that Pod are designed for. For Pods that run Linux containers, set
`.spec.os.name` to `linux`. For Pods that run Windows containers, set `.spec.os.name`
to Windows.
-->
## 汙點和容忍度  {#taints-and-tolerations}

使用者需要使用某種汙點（Taint）和節點選擇器的組合，以便將 Linux 和 Windows 工作負載各自排程到特定作業系統的節點。
下面概述了推薦的方法，其主要目標之一是該方法不應破壞現有 Linux 工作負載的相容性。

如果啟用了 `IdentifyPodOS` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
你可以（並且應該）將 Pod 的 `.spec.os.name` 設定為該 Pod 中的容器設計所用於的作業系統。
對於執行 Linux 容器的 Pod，將 `.spec.os.name` 設定為 `linux`。
對於執行 Windows 容器的 Pod，將 `.spec.os.name` 設定為 `Windows`。

{{< note >}}
<!-- 
Starting from 1.24, the `IdentifyPodOS` feature is in Beta stage and defaults to be enabled.
-->
從 1.24 開始，`IdentifyPodOS` 特性處於 Beta 階段，預設啟用。
{{< /note >}}

<!-- 
The scheduler does not use the value of `.spec.os.name` when assigning Pods to nodes. You should
use normal Kubernetes mechanisms for
[assigning pods to nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
to ensure that the control plane for your cluster places pods onto nodes that are running the
appropriate operating system.

The `.spec.os.name` value has no effect on the scheduling of the Windows pods,
so taints and tolerations and node selectors are still required
 to ensure that the Windows pods land onto appropriate Windows nodes.
-->
排程器在將 Pod 分配到節點時並不使用 `.spec.os.name` 的值。
你應該使用正常的 Kubernetes 機制[將 Pod 分配給節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)，
以確保叢集的控制平面將 Pod 放置到執行適當作業系統的節點上。

`.spec.os.name` 值對 Windows Pod 的排程沒有影響，
因此仍然需要汙點和容忍以及節點選擇器來確保 Windows Pod 落在適當的 Windows 節點。

<!-- 
### Ensuring OS-specific workloads land on the appropriate container host

Users can ensure Windows containers can be scheduled on the appropriate host using Taints and Tolerations.
All Kubernetes nodes today have the following default labels:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]
-->
### 確保特定於作業系統的工作負載落到合適的容器主機上  {#ensuring-os-specific-workloads-land-on-the-appropriate-container-host}

使用者可以使用汙點（Taint）和容忍度（Toleration）確保將 Windows 容器排程至合適的主機上。
現在，所有的 Kubernetes 節點都有以下預設標籤：

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

<!-- 
If a Pod specification does not specify a nodeSelector like `"kubernetes.io/os": windows`,
it is possible the Pod can be scheduled on any host, Windows or Linux.
This can be problematic since a Windows container can only run on Windows and a Linux container can only run on Linux.
The best practice is to use a nodeSelector.
-->
如果 Pod 規約沒有指定像 `"kubernetes.io/os": windows` 這樣的 nodeSelector，
則 Pod 可以被排程到任何主機上，Windows 或 Linux。
這可能會有問題，因為 Windows 容器只能在 Windows 上執行，而 Linux 容器只能在 Linux 上執行。
最佳實踐是使用 nodeSelector。

<!-- 
However, we understand that in many cases users have a pre-existing large number of deployments for Linux containers,
as well as an ecosystem of off-the-shelf configurations, such as community Helm charts, and programmatic Pod generation cases, such as with Operators.
In those situations, you may be hesitant to make the configuration change to add nodeSelectors.
The alternative is to use Taints. Because the kubelet can set Taints during registration,
it could easily be modified to automatically add a taint when running on Windows only.
-->
但是，我們瞭解到，在許多情況下，使用者已經預先存在大量 Linux 容器部署，
以及現成配置的生態系統，例如社群中的 Helm Chart 包和程式化的 Pod 生成案例，例如 Operator。
在這些情況下，你可能不願更改配置來新增節點選擇器。
另一種方法是使用汙點。因為 kubelet 可以在註冊過程中設定汙點，
所以可以很容易地修改為，當只能在 Windows 上執行時，自動新增汙點。

<!-- 
For example:  `--register-with-taints='os=windows:NoSchedule'`

By adding a taint to all Windows nodes, nothing will be scheduled on them (that includes existing Linux Pods).
In order for a Windows Pod to be scheduled on a Windows node, 
it would need both the nodeSelector and the appropriate matching toleration to choose Windows.
-->
例如：`--register-with-taints='os=windows:NoSchedule'`

透過向所有 Windows 節點新增汙點，任何負載都不會被排程到這些節點上（包括現有的 Linux Pod）。
為了在 Windows 節點上排程 Windows Pod，它需要 nodeSelector 和匹配合適的容忍度來選擇 Windows。

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
Server versions in the same cluster, then you should set additional node labels and nodeSelectors.

Kubernetes 1.17 automatically adds a new label `node.kubernetes.io/windows-build` to simplify this.
If you're running an older version, then it's recommended to add this label manually to Windows nodes.

This label reflects the Windows major, minor, and build number that need to match for compatibility.
Here are values used today for each Windows Server version.
-->
### 處理同一叢集中的多個 Windows 版本  {#handling-multiple-windows-versions-in-the-same-cluster}

每個 Pod 使用的 Windows Server 版本必須與節點的版本匹配。
如果要在同一個叢集中使用多個 Windows Server 版本，則應設定額外的節點標籤和節點選擇器。

Kubernetes 1.17 自動添加了一個新標籤 `node.kubernetes.io/windows-build` 來簡化這一點。
如果你執行的是舊版本，則建議手動將此標籤新增到 Windows 節點。

此標籤反映了需要匹配以實現相容性的 Windows 主要、次要和內部版本號。
以下是目前用於每個 Windows Server 版本的值。

<!-- 
| Product Name                         |   Build Number(s)      |
-->
| 產品名稱                              |   構建號                |
|--------------------------------------|------------------------|
| Windows Server 2019                  | 10.0.17763             |
| Windows Server, Version 20H2         | 10.0.19042             |
| Windows Server 2022                  | 10.0.20348             |

<!-- 
### Simplifying with RuntimeClass

[RuntimeClass] can be used to simplify the process of using taints and tolerations.
A cluster administrator can create a `RuntimeClass` object which is used to encapsulate these taints and tolerations.

1. Save this file to `runtimeClasses.yml`. It includes the appropriate `nodeSelector`
for the Windows OS, architecture, and version.
-->
### 使用 RuntimeClass 進行簡化  {#simplifying-with-runtimeclass}

[RuntimeClass] 可用於簡化使用汙點和容忍度的流程。
叢集管理員可以建立一個用於封裝這些汙點和容忍度的 `RuntimeClass` 物件。

1. 將此檔案儲存到 `runtimeClasses.yml`。它包括針對 Windows 作業系統、架構和版本的 `nodeSelector`。

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: windows-2019
handler: 'docker'
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
1. 以叢集管理員身份執行 `kubectl create -f runtimeClasses.yml`
1. 根據情況，向 Pod 規約中新增 `runtimeClassName: windows-2019`

例如：

```yaml
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

[RuntimeClass]: https://kubernetes.io/docs/concepts/containers/runtime-class/
