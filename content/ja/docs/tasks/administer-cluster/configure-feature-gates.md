---
title: フィーチャーゲートの有効化または無効化
content_type: task
weight: 60
---

<!-- overview -->

このページでは、フィーチャーゲートを有効化また無効化して、クラスター内でKubernetesの特定の機能を制御する方法を説明します。
フィーチャーゲートを有効化することで、一般提供される前にアルファまたはベータ機能をテストおよび使用できます。

{{< note >}}
一部の安定版(GA)ゲートについては、通常はGA後の1つのマイナーリリースでのみ無効化することもできます。
ただし、その場合はクラスターがKubernetesに準拠しなくなる可能性があります。
{{< /note >}}

<!--
Changes from original PR proposal:
- Added note about conformance implications when disabling stable gates
- Corrected --help behavior: all components show all gates due to shared definitions
- Clarified that not all components support configuration files (e.g., kube-controller-manager)
- Specified that verification methods apply to kubeadm static pod deployments
- Added context about kubeadm's distributed configuration approach
-->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

以下も必要です:

* クラスターへの管理者アクセス
* 有効化したいフィーチャーゲートに関する知識([フィーチャーゲートのリファレンス](/docs/reference/command-line-tools-reference/feature-gates/)を参照)

{{< note >}}
GA(安定版)機能は常にデフォルトで有効化されています。
通常、ゲートはアルファまたはベータ機能に対して設定します。
{{< /note >}}

<!-- steps -->

## フィーチャーゲートの成熟度を理解する {#understand-feature-gate-maturity}

フィーチャーゲートを有効化する前に、[フィーチャーゲートのリファレンス](/docs/reference/command-line-tools-reference/feature-gates/)で機能の成熟度レベルを確認してください:

- **アルファ**: デフォルトでは無効化されており、バグを含む可能性があります。テストクラスターでのみ使用してください。
- **ベータ**: デフォルトでは通常有効化されており、十分にテストされています。
- **GA**: デフォルトでは常に有効化されています。GA後の1つのリリースでのみ無効化できる場合があります。

## フィーチャーゲートを必要とするコンポーネントの特定 {#identify-which-components-need-the-feature-gate}

フィーチャーゲートごとに、影響を受けるKubernetesコンポーネントは異なります:

- 一部の機能は、**複数のコンポーネント**でゲートを有効化する必要があります(例: APIサーバーとコントローラーマネージャー)
- 他の機能は、**単一のコンポーネント**のみでゲートを必要とします(例: kubeletのみ)

[フィーチャーゲートのリファレンス](/docs/reference/command-line-tools-reference/feature-gates/)は通常、各ゲートによって影響を受けるコンポーネントを示しています。
すべてのKubernetesコンポーネントは同じフィーチャーゲート定義を共有しているため、すべてのゲートがヘルプ出力に表示されますが、各コンポーネントの動作に影響を与えるのは関連するゲートのみです。

## 設定 {#configuration}

### クラスター初期化中 {#during-cluster-initialization}

関連するコンポーネント全体でフィーチャーゲートを有効化するための構成ファイルを作成します:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
apiServer:
  extraArgs:
    feature-gates: "FeatureName=true"
controllerManager:
  extraArgs:
    feature-gates: "FeatureName=true"
scheduler:
  extraArgs:
    feature-gates: "FeatureName=true"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  FeatureName: true
```

クラスターを初期化します:

```shell
kubeadm init --config kubeadm-config.yaml
```

### 既存のクラスター {#on-an-existing-cluster}

kubeadmクラスターの場合、フィーチャーゲートの設定はマニフェストファイル、構成ファイル、kubeadm設定など複数の場所で行うことができます。

`/etc/kubernetes/manifests/`内のコントロールプレーンコンポーネントのマニフェストを編集します:

1. kube-apiserver、kube-controller-manager、またはkube-schedulerの場合、コマンドにフラグを追加します:

   ```yaml
   spec:
     containers:
     - command:
       - kube-apiserver
       - --feature-gates=FeatureName=true
       # ... other flags
   ```

   ファイルを保存します。
   Podは自動的に再起動します。

2. kubeletの場合、`/var/lib/kubelet/config.yaml`を編集します:

   ```yaml
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   featureGates:
     FeatureName: true
   ```

   kubeletを再起動します:

   ```shell
   sudo systemctl restart kubelet
   ```

3. kube-proxyの場合、ConfigMapを編集します:

   ```shell
   kubectl -n kube-system edit configmap kube-proxy
   ```

   設定にフィーチャーゲートを追加します:

   ```yaml
   featureGates:
     FeatureName: true
   ```

   DaemonSetを再起動します:

   ```shell
   kubectl -n kube-system rollout restart daemonset kube-proxy
   ```

## 複数のフィーチャーゲートの設定 {#configure-multiple-feature-gates}

コマンドラインのフラグに、カンマ区切りのリストを使用します:

```shell
--feature-gates=FeatureA=true,FeatureB=false,FeatureC=true
```

構成ファイルをサポートするコンポーネント(kubelet、kube-proxy)の場合:

```yaml
featureGates:
  FeatureA: true
  FeatureB: false
  FeatureC: true
```

{{< note >}}
kubeadmクラスターの場合、コントロールプレーンのコンポーネント(kube-apiserver、kube-controller-manager、kube-scheduler)は通常、`/etc/kubernetes/manifests/`にある静的Podマニフェスト内のコマンドラインフラグを介して構成されます。
これらのコンポーネントは`--config`フラグを介して構成ファイルをサポートしていますが、kubeadmは主にコマンドラインフラグを使用します。
{{< /note >}}


<!-- discussion -->

## フィーチャーゲート設定の確認 {#verify-feature-gate-configuration}

設定後、フィーチャーゲートがアクティブであることを確認します。
以下の方法は、コントロールプレーンのコンポーネントが静的Podとして実行されるkubeadmクラスターに適用されます。

### コントロールプレーンコンポーネントのマニフェストを確認する {#check-control-plane-component-manifests}

静的Podマニフェストで設定されたフィーチャーゲートを表示します:
```shell
kubectl -n kube-system get pod kube-apiserver-<node-name> -o yaml | grep feature-gates
```

### kubeletの設定を確認する {#check-kubelet-configuration}

kubeletのconfigzエンドポイントを使用します:
```shell
kubectl proxy --port=8001 &
curl -sSL "http://localhost:8001/api/v1/nodes/<node-name>/proxy/configz" | grep featureGates -A 5
```

もしくは、ノード上で直接構成ファイルを確認します:
```shell
cat /var/lib/kubelet/config.yaml | grep -A 10 featureGates
```

### メトリクスエンドポイントを介して確認する {#check-via-metrics-endpoint}

フィーチャーゲートのステータスは、KubernetesコンポーネントによってPrometheusスタイルのメトリクスで公開されます(利用可能なのはKubernetes 1.26以降)。

メトリクスエンドポイントをクエリして、どのフィーチャーゲートが有効になっているかを確認します:
```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled
```

特定のフィーチャーゲートを確認するには:
```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep FeatureName
```

メトリクスは、有効なゲートには`1`、無効なゲートには`0`を表示します。

{{< note >}}
kubeadmクラスターでは、フィーチャーゲートが構成される可能性のあるすべての関連場所を確認してください。
設定は複数のファイルと場所に分散しています。
{{< /note >}}

### /flagzエンドポイントで確認する {#check-via-flagz-endpoint}

コンポーネントのデバッグエンドポイントにアクセスでき、`ComponentFlagz`フィーチャーゲートがそのコンポーネントで有効化されている場合、`/flagz`エンドポイントにアクセスしてコンポーネントの軌道に使用されたコマンドラインフラグを検査できます。
コマンドラインフラグを使用して構成されたフィーチャーゲートは、この出力に表示されます。

`/flagz`エンドポイントは、Kubernetesの*z-pages*の一部であり、人間が読みやすい形式でコアコンポーネントのランタイムデバッグ情報を提供します。

より詳しくは、[z-pagesのドキュメント](/docs/reference/instrumentation/zpages/)を参照してください。

## コンポーネント固有の要件の理解 {#understanding-component-specific-requirements}

コンポーネント固有のフィーチャーゲートの例:

- **APIサーバー向け**: `StructuredAuthenticationConfiguration`のような機能は主にkube-apiserverに影響します
- **Kubelet向け**: `GracefulNodeShutdown`のような機能は主にkubeletに影響します
- **複数コンポーネント**: 一部の機能では、コンポーネント間の調整が必要です

{{< caution >}}
ある機能が複数のコンポーネントを必要とする場合、関連するすべてのコンポーネントでゲートを有効化する必要があります。
一部のコンポーネントでのみ有効化すると、予期しない動作やエラーが発生する可能性があります。
{{< /caution >}}

フィーチャーゲートは必ず本番環境以外の環境で最初にテストしてください。
アルファ機能は予告なしに削除される可能性があります。

## {{% heading "whatsnext" %}}

* [フィーチャーゲートのリファレンス](/docs/reference/command-line-tools-reference/feature-gates/)を読む
* [機能のステージ](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)について学ぶ
* [kubeadmの設定](/docs/reference/config-api/kubeadm-config.v1beta4/)を確認する