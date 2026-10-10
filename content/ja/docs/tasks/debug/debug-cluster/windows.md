---
title: WindowsデバッグTips
content_type: concept
---

<!-- overview -->

<!-- body -->

## ノードレベルのトラブルシューティング{#troubleshooting-node}

1. Podが"Container Creating"と表示されたまま動かなくなったり、何度も再起動を繰り返します

   pauseイメージがWindows OSのバージョンと互換性があることを確認してください。
   最新/推奨のpauseイメージや詳細情報については、[Pauseコンテナ](/docs/concepts/windows/intro/#pause-container)を参照してください。

   {{< note >}}
   コンテナランタイムとしてcontainerdを使用している場合、pauseイメージはconfig.toml設定ファイルの`plugins.plugins.cri.sandbox_image`フィールドで指定されます。
   {{< /note >}}

1. Podが`ErrImgPull`または`ImagePullBackOff`のステータスを表示します

   Podが[互換性](https://learn.microsoft.com/ja-jp/virtualization/windowscontainers/deploy-containers/version-compatibility)のあるWindowsノードにスケジュールされていることを確認してください。

   Podに対して互換性のあるノードを指定する方法の詳細については、[このガイド](/docs/concepts/windows/user-guide/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host)を参照してください。

## ネットワークのトラブルシューティング{#troubleshooting-network}

1. Windows Podがネットワークに接続できません

   仮想マシンを使用している場合は、すべてのVMのネットワークアダプターでMACスプーフィングが**有効**になっていることを確認してください。

1. Windows Podから外部リソースにpingできません

   Windows Podには、ICMPプロトコル用にプログラムされたアウトバウンドルールはありません。ただし、TCP/UDPはサポートされています。
   クラスター外のリソースへの接続を実証する場合は、`ping <IP>`を対応する`curl <IP>`コマンドに置き換えてください。

   それでも問題が解決しない場合は、[cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)のネットワーク設定に問題がある可能性が高いです。
   この静的ファイルはいつでも編集できます。
   設定の更新は、新しく作成されたすべてのKubernetesリソースに適用されます。

   Kubernetesのネットワーク要件の1つ([Kubernetesモデル](/ja/docs/concepts/cluster-administration/networking/)を参照)は、内部でNATせずにクラスター通信が行われることです。
   この要件を満たすために、アウトバウンドのNATを発生させたくないすべての通信のための[ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)があります。
   ただしこれは、クエリしようとしている外部IPを`ExceptionList`から除外する必要があることも意味します。
   そうして初めて、Windows Podからのトラフィックが正しくSNATされ、外部からの応答を受信できるようになります。
   この点について、`cni.conf`の`ExceptionList`は次のようになります:

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # クラスターのサブネット
                   "10.96.0.0/12",   # Serviceのサブネット
                   "10.127.130.0/24" # 管理(ホスト)のサブネット
               ]
   ```

1. Windowsノードが`NodePort`タイプのServiceにアクセスできません

   ノード自身からのローカルNodePortへのアクセスは失敗します。
   これは既知の制限です。
   NodePortへのアクセスは、他のノードや外部のクライアントからは動作します。

1. コンテナのvNICとHNSエンドポイントが削除されています

   この問題は`hostname-override`パラメーターが[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
   に渡されていない場合に発生する可能性があります。
   これを解決するためには、ユーザーは次のようにkube-proxyにホスト名を渡す必要があります:

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

1. WindowsノードがService IPを使用してサービスにアクセスできません

   これはWindows上のネットワークスタックの既知の制限です。
   ただし、Windows PodはService IPにアクセスできます。

1. kubeletの起動時にネットワークアダプターが見つかりません

   Windowsのネットワーキングスタックでは、Kubernetesネットワーキングが動作するために仮想アダプターが必要です。
   (管理者シェルで)次のコマンドを実行しても結果が返されない場合、kubeletが動作するために必要な前提条件である仮想ネットワークの作成に失敗しています。

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   ホストのネットワークアダプターが"Ethernet"ではない場合、`start.ps1`スクリプトの[InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7)パラメーターを修正することが有益です。
   それ以外の場合は、`start-kubelet.ps1`スクリプトの出力結果を参照して、仮想ネットワークの作成中にエラーが発生していないか確認します。

1. DNS名前解決が正しく動作しません

   この[セクション](/ja/docs/concepts/services-networking/dns-pod-service/#dns-windows)のWindowsにおけるDNSの制限について確認してください。

1. `kubectl port-forward`が"unable to do port forwarding: wincat not found"で失敗します

   これは、pauseインフラコンテナ`mcr.microsoft.com/oss/kubernetes/pause:3.6`に`wincat.exe`を含める形で、Kubernetes 1.15にて実装されました。
   必ずサポートされたKubernetesのバージョンを使用してください。
   独自のpauseインフラコンテナをビルドしたい場合は、必ず[wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat)を含めるようにしてください。

1. Windows Serverノードがプロキシの背後にあるため、Kubernetesのインストールに失敗しています

   プロキシの背後にある場合は、次のPowerShell環境変数が定義されている必要があります:

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```

### Flannelのトラブルシューティング

1. Flannelを使用すると、クラスターに再参加した後にノードに問題が発生します

   以前に削除したノードがクラスターに再参加すると、flanneldはノードに新しいPodサブネットを割り当てようとします。
   ユーザーは、次のパスにある古いPodサブネットの設定ファイルを削除する必要があります:

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```

1. Flanneldが"Waiting for the Network to be created"と表示されたままになります

   この[Issue](https://github.com/coreos/flannel/issues/1066)に関する多数の報告があります;
   最も可能性が高いのは、flannelネットワークの管理IPが設定されるタイミングの問題です。
   回避策は、`start.ps1`を再度実行するか、次のように手動で再起動することです:

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

1. `/run/flannel/subnet.env`が見つからないためにWindows Podが起動しません

   これはFlannelが正常に起動できなかったことを示しています。
   `flanneld.exe`を再起動するか、Kubernetesマスター上の`/run/flannel/subnet.env`をWindowsワーカーノード上の`C:\run\flannel\subnet.env`に手動でコピーして、`FLANNEL_SUBNET`行を異なる数値に変更します。
   例えば、ノードのサブネットを10.244.4.1/24としたい場合は次のようにします:

   ```env
   FLANNEL_NETWORK=10.244.0.0/16
   FLANNEL_SUBNET=10.244.4.1/24
   FLANNEL_MTU=1500
   FLANNEL_IPMASQ=true
   ```

### さらなる調査

これらの手順で問題が解決しない場合は、下記からKubernetesのWindowsノード上でWindowsコンテナを実行するためのヘルプを得ることができます:

* StackOverflowの[Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container)トピック
* Kubernetesの公式フォーラム[discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windowsチャンネル](https://kubernetes.slack.com/messages/sig-windows)

