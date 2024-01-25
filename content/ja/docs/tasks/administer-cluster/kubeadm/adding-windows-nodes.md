---
title: Windowsノードの追加
min-kubernetes-server-version: 1.17
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Kubernetesを使用してLinuxノードとWindowsノードを混在させて実行できるため、Linuxで実行するPodとWindowsで実行するPodを混在させることができます。このページでは、Windowsノードをクラスターに登録する方法を示します。




## {{% heading "prerequisites" %}}
 {{< version-check >}}

* WindowsコンテナをホストするWindowsノードを構成するには、[Windows Server 2019ライセンス](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)(またはそれ以上)を取得します。
VXLAN/オーバーレイネットワークを使用している場合は、[KB4489899](https://support.microsoft.com/help/4489899)もインストールされている必要があります。

* コントロールプレーンにアクセスできるLinuxベースのKubernetes kubeadmクラスター([kubeadmを使用したシングルコントロールプレーンクラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)を参照)




## {{% heading "objectives" %}}


* Windowsノードをクラスターに登録する
* LinuxとWindowsのPodとServiceが相互に通信できるようにネットワークを構成する




<!-- lessoncontent -->

## はじめに: クラスターへのWindowsノードの追加

### ネットワーク構成

LinuxベースのKubernetesコントロールプレーンノードを取得したら、ネットワーキングソリューションを選択できます。このガイドでは、簡単にするためにVXLANモードでのFlannelの使用について説明します。

#### Flannel構成

1. FlannelのためにKubernetesコントロールプレーンを準備する

    クラスター内のKubernetesコントロールプレーンでは、多少の準備が推奨されます。Flannelを使用する場合は、iptablesチェーンへのブリッジIPv4トラフィックを有効にすることをお勧めします。すべてのLinuxノードで次のコマンドを実行する必要があります:

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```

1. Linux用のFlannelをダウンロードして構成する

    最新のFlannelマニフェストをダウンロード:

    ```bash
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```

    VNIを4096、ポートを4789に設定するために、flannelマニフェストの`net-conf.json`セクションを変更します。次のようになります:

    ```json
    net-conf.json: |
        {
          "Network": "10.244.0.0/16",
          "Backend": {
            "Type": "vxlan",
            "VNI" : 4096,
            "Port": 4789
          }
        }
    ```

    {{< note >}}Linux上のFlannelがWindows上のFlannelと相互運用するには、VNIを4096およびポート4789に設定する必要があります。これらのフィールドの説明については、[VXLANドキュメント](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)を参照してください。{{< /note >}}

    {{< note >}}L2Bridge/Host-gatewayモードを使用するには、代わりに`Type`の値を`"host-gw"`に変更し、`VNI`と`Port`を省略します。{{< /note >}}

1. Flannelマニフェストを適用して検証する

    Flannelの構成を適用しましょう:

    ```bash
    kubectl apply -f kube-flannel.yml
    ```

    数分後、Flannel Podネットワークがデプロイされていれば、すべてのPodが実行されていることがわかります。

    ```bash
    kubectl get pods -n kube-system
    ```

    出力結果には、実行中のLinux flannel DaemonSetが含まれているはずです:

    ```
    NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
    ...
    kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
    ```

1. Windows Flannelとkube-proxy DaemonSetを追加する

    これで、Windows互換バージョンのFlannelおよびkube-proxyを追加できます。
    互換性のあるバージョンのkube-proxyを確実に入手するには、イメージのタグを置換する必要があります。
    次の例は、Kubernetes {{< skew currentPatchVersion >}}の使用方法を示していますが、
    独自のデプロイに合わせてバージョンを調整する必要があります。

    ```bash
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/v{{< skew currentPatchVersion >}}/g' | kubectl apply -f -
    kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml
    ```
    {{< note >}}
    ホストゲートウェイを使用している場合は、代わりに https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-host-gw.yml を使用してください。
    {{< /note >}}

    {{< note >}}
Windowsノードでイーサネット(「Ethernet0 2」など)ではなく別のインターフェースを使用している場合は、次の行を変更する必要があります:

```powershell
wins cli process run --path /k/flannel/setup.exe --args "--mode=overlay --interface=Ethernet"
```

`flannel-host-gw.yml`または`flannel-overlay.yml`ファイルで、それに応じてインターフェースを指定します。

```bash
# 例
curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml | sed 's/Ethernet/Ethernet0 2/g' | kubectl apply -f -
```
    {{< /note >}}



### Windowsワーカーノードの参加
{{< note >}}
`Containers`機能をインストールし、Dockerをインストールする必要があります。
行うための指示としては、[Dockerエンジンのインストール - Windowsサーバー上のエンタープライズ](https://docs.mirantis.com/docker-enterprise/v3.1/dockeree-products/docker-engine-enterprise/dee-windows.html)を利用できます。
{{< /note >}}

{{< note >}}
Windowsセクションのすべてのコードスニペットは、
Windowsワーカーノードの(管理者)権限を持つPowerShell環境で実行されます。
{{< /note >}}

1. wins、kubelet、kubeadmをインストールします。

   ```PowerShell
   curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/kubeadm/scripts/PrepareNode.ps1
   .\PrepareNode.ps1 -KubernetesVersion v{{% skew currentPatchVersion %}}
   ```

1. `kubeadm`を実行してノードに参加します

    コントロールプレーンホストで`kubeadm init`を実行したときに提供されたコマンドを使用します。
    このコマンドがなくなった場合、またはトークンの有効期限が切れている場合は、`kubeadm token create --print-join-command`
    (コントロールプレーンホスト上で)を実行して新しいトークンを生成します。


#### インストールの確認
次のコマンドを実行して、クラスター内のWindowsノードを表示できるようになります:

```bash
kubectl get nodes -o wide
```

新しいノードが`NotReady`状態の場合は、flannelイメージがまだダウンロード中の可能性があります。
`kube-system`名前空間のflannel Podを確認することで、以前と同様に進行状況を確認できます:

```shell
kubectl -n kube-system get pods -l app=flannel
```

flannel Podが実行されると、ノードは`Ready`状態になり、ワークロードを処理できるようになります。



## {{% heading "whatsnext" %}}


- [Windows kubeadmノードのアップグレード](/ja/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes)
