---
title: 設定ファイルを使用してkubeletのパラメーターを設定する
content_type: task
weight: 330
---

## {{% heading "prerequisites" %}}

このページの一部の手順では、`jq`ツールを使用します。
`jq`がインストールされていない場合は、お使いのオペレーティングシステムのソフトウェア配布元からインストールするか、[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/)から入手してください。

一部の手順では`curl`のインストールも必要です。
`curl`は、お使いのオペレーティングシステムのソフトウェア配布元からインストールできます。

<!-- overview -->

kubeletの設定パラメーターの一部は、コマンドラインフラグの代わりに、ディスク上の設定ファイルで指定できます。
設定ファイルでパラメーターを指定する方法は、ノードのデプロイと設定管理を簡素化できるため、推奨されます。

<!-- steps -->

## 設定ファイルを作成する {#create-the-config-file}

ファイルで設定できるkubelet設定の範囲は、[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)構造体で定義されています。

設定ファイルは、この構造体のパラメーターをJSONまたはYAML形式で表したものでなければなりません。
kubeletにファイルの読み取り権限があることを確認してください。

このファイルの例を次に示します。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
```

この例では、kubeletに次の設定を行っています。

1. `address`: kubeletはIPアドレス`192.168.0.8`でサービスを提供します。
1. `port`: kubeletはポート`20250`でサービスを提供します。
1. `serializeImagePulls`: イメージのプルを並列に実行します。
1. `evictionHard`: 次のいずれかの条件に該当すると、kubeletはPodを退避させます。
   - ノードで利用可能なメモリーが`100MiB`を下回ったとき。
   - ノードのメインファイルシステムで利用可能な領域が`10%`未満になったとき。
   - イメージファイルシステムで利用可能な領域が`15%`未満になったとき。
   - ノードのメインファイルシステムで、inodeの`95%`を超えて使用しているとき。

{{< note >}}
この例のように、`evictionHard`のパラメーターのうち1つだけデフォルト値を変更すると、ほかのパラメーターのデフォルト値は引き継がれず、`0`に設定されます。
カスタム値を指定する場合は、それぞれのしきい値をすべて指定してください。
または、kubeletの設定ファイルで`MergeDefaultEvictionSettings`を`true`に設定できます。
そうすると、いずれかのパラメーターを変更した場合に、ほかのパラメーターは`0`ではなくデフォルト値を引き継ぎます。
{{< /note >}}

`imagefs`は省略可能なファイルシステムです。
コンテナランタイムは、コンテナイメージとコンテナの書き込み可能レイヤーを保存するために、これを使用します。

## 設定ファイルを使ってkubeletプロセスを起動する {#start-a-kubelet-process-configured-via-the-config-file}

{{< note >}}
`kubeadm`でクラスターを初期化する場合は、クラスターの作成時に`kubeadm init`でkubeletの設定を使用してください。
詳細は[kubeadmを使用したkubeletの設定](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)を参照してください。
{{< /note >}}

kubeletの設定ファイルへのパスを`--config`フラグに指定して、kubeletを起動します。
kubeletはこのファイルから設定を読み込みます。
設定ファイルと同じ値を指定するコマンドラインフラグがある場合、その値はコマンドラインフラグで上書きされます。
これは、コマンドラインAPIとの後方互換性を確保するためです。

kubelet設定ファイル内の相対パスは、設定ファイルの場所を基準に解決されます。
一方、コマンドラインフラグ内の相対パスは、kubeletの現在の作業ディレクトリを基準に解決されます。

コマンドラインフラグとkubelet設定ファイルでは、一部のデフォルト値が異なります。
`--config`を指定し、その値をコマンドラインで指定しない場合は、`KubeletConfiguration`のバージョンに対応するデフォルト値が適用されます。
上の例では、バージョンは`kubelet.config.k8s.io/v1beta1`です。

## kubelet設定ファイルのドロップインディレクトリ {#kubelet-conf-d}

kubeletのドロップイン設定ディレクトリを指定できます。
デフォルトでは、kubeletはドロップイン設定ファイルをどの場所からも読み込みません。
読み込み先のパスを指定する必要があります。
たとえば、`--config-dir=/etc/kubernetes/kubelet.conf.d`のように指定します。

Kubernetes v1.28からv1.29では、kubeletプロセスの環境変数`KUBELET_CONFIG_DROPIN_DIR_ALPHA`も設定しないと、`--config-dir`を指定できません。
この環境変数の値は問いません。

{{< note >}}
有効なkubeletドロップイン設定ファイルの拡張子は、`.conf`でなければなりません。
たとえば、`99-kubelet-address.conf`のようにします。
{{< /note >}}

kubeletは、設定ドロップインディレクトリ内のファイルを、ファイル名全体の英数字順で処理します。
たとえば、`00-kubelet.conf`を最初に処理し、その後に`01-kubelet.conf`で上書きします。

これらのファイルには部分的な設定を記述できますが、設定として無効であってはならず、`apiVersion`と`kind`を含む型メタデータを指定する必要があります。
検証は、kubelet内部に保存される最終的な設定構造に対してのみ行われます。
これにより、望ましくない設定を防ぎながら、さまざまなソースからkubelet設定を管理してマージできます。

ただし、設定フィールドのデータ型によって動作が異なる点に注意してください。
kubeletの設定構造では、データ型によってマージ方法が異なります。
詳細は[リファレンス](/docs/reference/node/kubelet-config-directory-merging/)を参照してください。

### kubelet設定のマージ順序 {#kubelet-configuration-merging-order}

起動時に、kubeletは次の設定をマージします。

* コマンドラインで指定されたフィーチャーゲート（優先順位が最も低い）。
* kubelet設定。
* ソート順に並べたドロップイン設定ファイル。
* フィーチャーゲートを除くコマンドライン引数（優先順位が最も高い）。

{{< note >}}
kubeletの設定ドロップインディレクトリの仕組みは、`kubeadm`ツールの設定パッチ機能と似ていますが、異なります。
`kubeadm`ツールは設定に対して特定の[パッチ適用方法](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)を使用します。
一方、kubeletの設定ドロップインファイルで使用できるパッチ適用方法は`replace`のみです。

kubeletは、サフィックスを英数字順に並べてマージ順序を決定し、優先順位の高いファイルに存在するフィールドをすべて置き換えます。
{{< /note >}}

## kubeletの設定を表示する {#viewing-the-kubelet-configuration}

この機能を使うと設定が複数のファイルに分散する場合があります。
最終的に有効になっている設定を確認するには、次の手順に従います。

1. ターミナルで[`kubectl proxy`](/docs/reference/kubectl/generated/kubectl_proxy/)を使ってプロキシサーバーを起動します。

   ```bash
   kubectl proxy
   ```

   次のような出力が表示されます。

   ```none
   Starting to serve on 127.0.0.1:8001
   ```

1. 別のターミナルウィンドウを開き、`curl`を使ってkubeletの設定を取得します。
   `<node-name>`を実際のノード名に置き換えてください。

   ```bash
   curl -X GET http://127.0.0.1:8001/api/v1/nodes/<node-name>/proxy/configz | jq .
   ```

   ```json
   {
     "kubeletconfig": {
       "enableServer": true,
       "staticPodPath": "/var/run/kubernetes/static-pods",
       "syncFrequency": "1m0s",
       "fileCheckFrequency": "20s",
       "httpCheckFrequency": "20s",
       "address": "192.168.1.16",
       "port": 10250,
       "readOnlyPort": 10255,
       "tlsCertFile": "/var/lib/kubelet/pki/kubelet.crt",
       "tlsPrivateKeyFile": "/var/lib/kubelet/pki/kubelet.key",
       "rotateCertificates": true,
       "authentication": {
         "x509": {
           "clientCAFile": "/var/run/kubernetes/client-ca.crt"
         },
         "webhook": {
           "enabled": true,
           "cacheTTL": "2m0s"
         },
         "anonymous": {
           "enabled": true
         }
       },
       "authorization": {
         "mode": "AlwaysAllow",
         "webhook": {
           "cacheAuthorizedTTL": "5m0s",
           "cacheUnauthorizedTTL": "30s"
         }
       },
       "registryPullQPS": 5,
       "registryBurst": 10,
       "eventRecordQPS": 50,
       "eventBurst": 100,
       "enableDebuggingHandlers": true,
       "healthzPort": 10248,
       "healthzBindAddress": "127.0.0.1",
       "oomScoreAdj": -999,
       "clusterDomain": "cluster.local",
       "clusterDNS": [
         "10.0.0.10"
       ],
       "streamingConnectionIdleTimeout": "4h0m0s",
       "nodeStatusUpdateFrequency": "10s",
       "nodeStatusReportFrequency": "5m0s",
       "nodeLeaseDurationSeconds": 40,
       "imageMinimumGCAge": "2m0s",
       "imageMaximumGCAge": "0s",
       "imageGCHighThresholdPercent": 85,
       "imageGCLowThresholdPercent": 80,
       "volumeStatsAggPeriod": "1m0s",
       "cgroupsPerQOS": true,
       "cgroupDriver": "systemd",
       "cpuManagerPolicy": "none",
       "cpuManagerReconcilePeriod": "10s",
       "memoryManagerPolicy": "None",
       "topologyManagerPolicy": "none",
       "topologyManagerScope": "container",
       "runtimeRequestTimeout": "2m0s",
       "hairpinMode": "promiscuous-bridge",
       "maxPods": 110,
       "podPidsLimit": -1,
       "resolvConf": "/run/systemd/resolve/resolv.conf",
       "cpuCFSQuota": true,
       "cpuCFSQuotaPeriod": "100ms",
       "nodeStatusMaxImages": 50,
       "maxOpenFiles": 1000000,
       "contentType": "application/vnd.kubernetes.protobuf",
       "kubeAPIQPS": 50,
       "kubeAPIBurst": 100,
       "serializeImagePulls": true,
       "evictionHard": {
         "imagefs.available": "15%",
         "memory.available": "100Mi",
         "nodefs.available": "10%",
         "nodefs.inodesFree": "5%",
         "imagefs.inodesFree": "5%"
       },
       "evictionPressureTransitionPeriod": "1m0s",
       "mergeDefaultEvictionSettings": false,
       "enableControllerAttachDetach": true,
       "makeIPTablesUtilChains": true,
       "iptablesMasqueradeBit": 14,
       "iptablesDropBit": 15,
       "featureGates": {
         "AllAlpha": false
       },
       "failSwapOn": false,
       "memorySwap": {},
       "containerLogMaxSize": "10Mi",
       "containerLogMaxFiles": 5,
       "configMapAndSecretChangeDetectionStrategy": "Watch",
       "enforceNodeAllocatable": [
         "pods"
       ],
       "volumePluginDir": "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/",
       "logging": {
         "format": "text",
         "flushFrequency": "5s",
         "verbosity": 3,
         "options": {
           "json": {
             "infoBufferSize": "0"
           }
         }
       },
       "enableSystemLogHandler": true,
       "enableSystemLogQuery": false,
       "shutdownGracePeriod": "0s",
       "shutdownGracePeriodCriticalPods": "0s",
       "enableProfilingHandler": true,
       "enableDebugFlagsHandler": true,
       "seccompDefault": false,
       "registerNode": true,
       "localStorageCapacityIsolation": true,
       "containerRuntimeEndpoint": "unix:///var/run/crio/crio.sock"
     }
   }
   ```
<!-- discussion -->

## {{% heading "whatsnext" %}}

- [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)リファレンスを確認して、kubelet設定についてさらに学びましょう。
- [リファレンス](/docs/reference/node/kubelet-config-directory-merging)を確認して、kubelet設定のマージについてさらに学びましょう。
