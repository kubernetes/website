---
title: KubernetesでWindowsコンテナをスケジュールするためのガイド
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

* [Windows Serverを実行するマスターノードとワーカーノード](/ja/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes)を含むKubernetesクラスターを作成します
* Kubernetes上にServiceとワークロードを作成してデプロイすることは、LinuxコンテナとWindowsコンテナ共に、ほぼ同じように動作することに注意してください。クラスターとのインタフェースとなる[Kubectlコマンド](/docs/reference/kubectl/overview/)も同じです。Windowsコンテナをすぐに体験できる例を以下セクションに用意しています。

## はじめに:Windowsコンテナのデプロイ

WindowsコンテナをKubernetesにデプロイするには、最初にサンプルアプリケーションを作成する必要があります。以下のYAMLファイルの例では、簡単なウェブサーバーアプリケーションを作成しています。以下の内容で`win-webserver.yaml`という名前のサービススペックを作成します。:

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
            - "<#code used from https://gist.github.com/19WAS85/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count = $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
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
    * サービスディスカバリ、Kubernetesの[default DNS suffix](/ja/docs/concepts/services-networking/dns-pod-service/#services)と共にService名に`curl`します
    * Inbound connectivity, `curl` the NodePort from the Linux master or machines outside of the cluster
    * インバウンド接続、Linuxマスターまたはクラスター外のマシンからNodePortに`curl`します
    * アウトバウンド接続、kubectl execを使用したPod内からの外部IPに`curl`します

{{< note >}}
今のところ、Windowsネットワークスタックのプラットフォーム制限のため、Windowsコンテナホストは、ホストされているサービスのIPにアクセスできません。Service IPにアクセスできるのは、Windows Podだけです。
{{< /note >}}

## 可観測性

### ワークロードからのログキャプチャ

ログは可観測性の重要な要素です。これにより、ユーザーはワークロードの運用面に関する洞察を得ることができ、問題のトラブルシューティングの主要な要素になります。WindowsコンテナとWindowsコンテナ内のワークロードの動作はLinuxコンテナとは異なるため、ユーザーはログの収集に苦労し、運用の可視性が制限されていました。たとえば、Windowsワークロードは通常、ETW(Windowsのイベントトレース)にログを記録するか、アプリケーションイベントログにエントリをプッシュするように構成されます。Microsoftのオープンソースツールである[LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor)は、Windowsコンテナ内の構成されたログソースを監視するための推奨方法です。LogMonitorは、イベントログ、ETWプロバイダー、カスタムアプリケーションログのモニタリングをサポートしており、それらをSTDOUTにパイプして、`kubectl logs <pod>`で使用できます。

LogMonitor GitHubページの指示に従って、バイナリと構成ファイルをすべてのコンテナにコピーして、LogMonitorがログをSTDOUTにプッシュするために必要なエントリーポイントを追加します。

## 構成可能なコンテナのユーザー名の使用

Kubernetes v1.16以降、Windowsコンテナは、イメージのデフォルトとは異なるユーザー名でエントリーポイントとプロセスを実行するように構成できます。これが達成される方法は、Linuxコンテナで行われる方法とは少し異なります。詳しくは[こちら](/docs/tasks/configure-pod-container/configure-runasusername/).

## Group Managed Service AccountsによるワークロードIDの管理

Kubernetes v1.14以降、Windowsコンテナワークロードは、Group Managed Service Accounts(GMSA)を使用するように構成できます。Group Managed Service Accountsは、自動パスワード管理、簡略化されたサービスプリンシパル名（SPN）管理、および複数のサーバー間で他の管理者に管理を委任する機能を提供する特定の種類のActive Directoryアカウントです。GMSAで構成されたコンテナは、GMSAで構成されたIDを保持しながら、外部Active Directoryドメインリソースにアクセスできます。Windowsコンテナ用のGMSAの構成と使用の詳細は[こちら](/docs/tasks/configure-pod-container/configure-gmsa/)。

## TaintsとTolerations

今日のユーザーは、LinuxとWindowsのワークロードをそれぞれのOS固有のノードで維持するために、Taintsとノードセレクターのいくつかの組み合わせを使用する必要があります。これはおそらくWindowsユーザーにのみ負担をかけます。推奨されるアプローチの概要を以下に示します。主な目標の1つは、このアプローチによって既存のLinuxワークロードの互換性が損なわれないようにすることです。

### OS固有のワークロードが適切なコンテナホストに確実に到達するようにする

ユーザーは、TaintsとTolerationsを使用して、Windowsコンテナを適切なホストでスケジュールできるようにすることができます。現在、すべてのKubernetesノードには次のデフォルトラベルがあります。:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

Podの仕様で`"kubernetes.io/os": windows`のようなnodeSelectorが指定されていない場合、PodをWindowsまたはLinuxの任意のホストでスケジュールすることができます。WindowsコンテナはWindowsでのみ実行でき、LinuxコンテナはLinuxでのみ実行できるため、これは問題になる可能性があります。ベストプラクティスは、nodeSelectorを使用することです。

ただし、多くの場合、ユーザーには既存の多数のLinuxコンテナのdepolyment、およびコミュニティHelmチャートのような既成構成のエコシステムやOperatorのようなプログラム的にPodを生成するケースがあることを理解しています。このような状況では、nodeSelectorsを追加するための構成変更をためらう可能性があります。代替策は、Taintsを使用することです。kubeletは登録中にTaintsを設定できるため、Windowsだけで実行する時に自動的にTaintを追加するように簡単に変更できます。

例:`--register-with-taints='os=windows:NoSchedule'`

すべてのWindowsノードにTaintを追加することにより、それらには何もスケジュールされません（既存のLinuxPodを含む）。Windows PodがWindowsノードでスケジュールされるためには、nodeSelectorがWindowsを選択することと、適切にマッチするTolerationが必要です。

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

### 同じクラスター内の複数Windowsバージョンの管理

各Podで使用されるWindows Serverのバージョンは、ノードのバージョンと一致している必要があります。
同じクラスター内で複数のWindows Serverバージョンを使用したい場合は、追加のノードラベルとnodeSelectorsを設定する必要があります。

Kubernetes 1.17では、これを簡単するために新しいラベル`node.kubernetes.io/windows-build`が自動的に追加されます。古いバージョンを実行している場合は、このラベルをWindowsノードに手動で追加することをお勧めします。

このラベルは、互換性のために一致する必要があるWindowsのメジャー、マイナー、およびビルド番号を反映しています。以下は、Windows Serverの各バージョンで現在使用されている値です。

| 製品番号                         　　 |   ビルド番号            |
|--------------------------------------|------------------------|
| Windows Server 2019                  | 10.0.17763             |
| Windows Server version 1809          | 10.0.17763             |
| Windows Server version 1903          | 10.0.18362             |


### RuntimeClassによる簡素化

[RuntimeClass]は、TaintsとTolerationsを使用するプロセスを簡略化するために使用できます。クラスター管理者は、これらのTaintsとTolerationsをカプセル化するために使用する`RuntimeClass`オブジェクトを作成できます。

1. このファイルを`runtimeClasses.yml`に保存します。これには、Windows OS、アーキテクチャ、およびバージョンに適切な`nodeSelector`が含まれています。

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

1. クラスター管理者として使用する`kubectl create -f runtimeClasses.yml`を実行します
1. Podの仕様に応じて`runtimeClassName: windows-2019`を追加します

例:

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
