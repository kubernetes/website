---
title: KubernetesでWindowsコンテナーをスケジュールするためのガイド
content_type: concept
weight: 75
---

<!-- overview -->

Windowsアプリケーションは、多くの組織で実行されるサービスとアプリケーションの大部分を占めます。このガイドでは、KubernetesでWindowsコンテナを構成してデプロイする手順について説明します。



<!-- body -->

## 目的

* WindowsノードでWindowsコンテナを実行するサンプルのDeploymentを構成します
* (オプション)Group Managed Service Accounts(GMSA)を使用してPodのActive Directory IDを構成します

## 始める前に

* [Windows Serverを実行するマスターノードとワーカーノード](/ja/docs/setup/production-environment/windows/user-guide-windows-nodes/)を含むKubernetesクラスターを作成します
* Kubernetes上にServiceとワークロードを作成してデプロイすることは、LinuxコンテナとWindowsコンテナ共に、ほぼ同じように動作することに注意してください。クラスターとのインタフェースとなる[Kubectlコマンド](/docs/reference/kubectl/overview/)も同じです。Windowsコンテナをすぐに体験できる例を以下セクションに用意しています。

## はじめに:Windowsコンテナーのデプロイ

WindowsコンテナをKubernetesにデプロイするには、最初にサンプルアプリケーションを作成する必要があります。以下のYAMLファイルの例では、簡単なウェブサーバーアプリケーションを作成しています。以下の内容で「win-webserver.yaml」という名前のサービススペックを作成します。:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: win-webserver
  labels:
    app: win-webserver
spec:
  ports:
    # このサービスが提供するポート
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
            - "<#code used from https://gist.github.com/wagnerandrade/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count = $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
      nodeSelector:
        kubernetes.io/os: windows
```

{{< note >}}
ポートマッピングもサポートされていますが、この例では簡単にするために、コンテナポート80がサービスに直接公開されています。
{{< /note >}}

1. すべてのノードが正常であることを確認します。:

    ```bash
    kubectl get nodes
    ```

1. Serviceをデプロイして、Podの更新を確認します。:

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    Serviceが正しくデプロイされると、両方のPodがReadyとして表示されます。watch状態のコマンドを終了するには、Ctrl + Cを押します。

1. デプロイが成功したことを確認します。検証するために行うこと:

    * WindowsノードのPodごとの2つのコンテナに`docker ps`します
    * Linuxマスターからリストされた2つのPodに`kubectl get pods`します
    * ネットワークを介したノードとPod間通信、LinuxマスターからのPod IPのポート80に向けて`curl`して、ウェブサーバーの応答をチェックします
    * docker execまたはkubectl execを使用したPod間通信、Pod間(および複数のWindowsノードがある場合はホスト間)へのpingします
    * ServiceからPodへの通信、Linuxマスターおよび個々のPodからの仮想Service IP(`kubectl get services`で表示される)に`curl`します
    * サービスディスカバリ、Kuberntesの[default DNS suffix](/ja/docs/concepts/services-networking/dns-pod-service/#services)と共にService名に`curl`します
    * Inbound connectivity, `curl` the NodePort from the Linux master or machines outside of the cluster
    * インバウンド接続、Linuxマスターまたはクラスター外のマシンからNodePortに`curl`します
    * アウトバウンド接続、kubectl execを使用したPod内からの外部IPに`curl`します

{{< note >}}
今のところ、Windowsネットワークスタックのプラットフォーム制限のため、Windowsコンテナホストは、ホストされているサービスのIPにアクセスできません。Service IPにアクセスできるのは、Windows Podだけです。
{{< /note >}}

## Observability

### Capturing logs from workloads

Logs are an important element of observability; they enable users to gain insights into the operational aspect of workloads and are a key ingredient to troubleshooting issues. Because Windows containers and workloads inside Windows containers behave differently from Linux containers, users had a hard time collecting logs, limiting operational visibility. Windows workloads for example are usually configured to log to ETW (Event Tracing for Windows) or push entries to the application event log. [LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor), an open source tool by Microsoft, is the recommended way to monitor configured log sources inside a Windows container. LogMonitor supports monitoring event logs, ETW providers, and custom application logs, piping them to STDOUT for consumption by `kubectl logs <pod>`.

Follow the instructions in the LogMonitor GitHub page to copy its binaries and configuration files to all your containers and add the necessary entrypoints for LogMonitor to push your logs to STDOUT.

## Using configurable Container usernames

Starting with Kubernetes v1.16, Windows containers can be configured to run their entrypoints and processes with different usernames than the image defaults. The way this is achieved is a bit different from the way it is done for Linux containers. Learn more about it [here](/docs/tasks/configure-pod-container/configure-runasusername/).

## Managing Workload Identity with Group Managed Service Accounts

Starting with Kubernetes v1.14, Windows container workloads can be configured to use Group Managed Service Accounts (GMSA). Group Managed Service Accounts are a specific type of Active Directory account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers. Containers configured with a GMSA can access external Active Directory Domain resources while carrying the identity configured with the GMSA. Learn more about configuring and using GMSA for Windows containers [here](/docs/tasks/configure-pod-container/configure-gmsa/).

## Taints and Tolerations

Users today need to use some combination of taints and node selectors in order to keep Linux and Windows workloads on their respective OS-specific nodes. This likely imposes a burden only on Windows users. The recommended approach is outlined below, with one of its main goals being that this approach should not break compatibility for existing Linux workloads.

### Ensuring OS-specific workloads land on the appropriate container host

Users can ensure Windows containers can be scheduled on the appropriate host using Taints and Tolerations. All Kubernetes nodes today have the following default labels:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

If a Pod specification does not specify a nodeSelector like `"kubernetes.io/os": windows`, it is possible the Pod can be scheduled on any host, Windows or Linux. This can be problematic since a Windows container can only run on Windows and a Linux container can only run on Linux. The best practice is to use a nodeSelector.

However, we understand that in many cases users have a pre-existing large number of deployments for Linux containers, as well as an ecosystem of off-the-shelf configurations, such as community Helm charts, and programmatic Pod generation cases, such as with Operators. In those situations, you may be hesitant to make the configuration change to add nodeSelectors. The alternative is to use Taints. Because the kubelet can set Taints during registration, it could easily be modified to automatically add a taint when running on Windows only.

For example:  `--register-with-taints='os=windows:NoSchedule'`

By adding a taint to all Windows nodes, nothing will be scheduled on them (that includes existing Linux Pods). In order for a Windows Pod to be scheduled on a Windows node, it would need both the nodeSelector to choose Windows, and the appropriate matching toleration.

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

### Handling multiple Windows versions in the same cluster

The Windows Server version used by each pod must match that of the node. If you want to use multiple Windows
Server versions in the same cluster, then you should set additional node labels and nodeSelectors.

Kubernetes 1.17 automatically adds a new label `node.kubernetes.io/windows-build` to simplify this. If you're running an older version, then it's recommended to add this label manually to Windows nodes.

This label reflects the Windows major, minor, and build number that need to match for compatibility. Here are values used today for each Windows Server version.

| Product Name                         |   Build Number(s)      |
|--------------------------------------|------------------------|
| Windows Server 2019                  | 10.0.17763             |
| Windows Server version 1809          | 10.0.17763             |
| Windows Server version 1903          | 10.0.18362             |


### Simplifying with RuntimeClass

[RuntimeClass] can be used to simplify the process of using taints and tolerations. A cluster administrator can create a `RuntimeClass` object which is used to encapsulate these taints and tolerations.


1. Save this file to `runtimeClasses.yml`. It includes the appropriate `nodeSelector` for the Windows OS, architecture, and version.

```yaml
apiVersion: node.k8s.io/v1beta1
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

1. Run `kubectl create -f runtimeClasses.yml` using as a cluster administrator
1. Add `runtimeClassName: windows-2019` as appropriate to Pod specs

For example:

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