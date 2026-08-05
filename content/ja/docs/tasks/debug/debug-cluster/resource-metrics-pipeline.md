---
title: リソースメトリクスパイプライン
content_type: concept
weight: 15
---

<!-- overview -->

Kubernetesでは、コンテナのCPU使用率やメモリ使用率といったリソース使用量のメトリクスが、メトリクスAPIを通じて提供されています。これらのメトリクスは、ユーザーが`kubectl top`コマンドで直接アクセスするか、クラスター内のコントローラー(例えばHorizontal Pod Autoscaler)が判断するためにアクセスすることができます。

<!-- body -->

## メトリクスAPI

メトリクスAPIを使用すると、指定したノードやPodが現在使用しているリソース量を取得することができます。
このAPIはメトリックの値を保存しないので、例えば10分前に指定されたノードが使用したリソース量を取得することはできません。

メトリクスAPIは他のAPIと何ら変わりはありません。

- 他のKubernetes APIと同じエンドポイントを経由して、`/apis/metrics.k8s.io/`パスの下で発見できます。
- 同じセキュリティ、スケーラビリティ、信頼性の保証を提供します。

メトリクスAPIは[k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)リポジトリで定義されています。
メトリクスAPIについての詳しい情報はそちらをご覧ください。

{{< note >}}
メトリクスAPIを使用するには、クラスター内にメトリクスサーバーが配置されている必要があります。そうでない場合は利用できません。
{{< /note >}}

## リソース使用量の測定

### CPU

CPUは、一定期間の平均使用量を[CPU cores](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)という単位で報告されます。
この値は、カーネルが提供する累積CPUカウンターの比率を取得することで得られます(LinuxとWindowsの両カーネルで)。
kubeletは、比率計算のためのウィンドウを選択します。

### メモリ

メモリは、測定値が収集された時点のワーキングセットとして、バイト単位で報告されます。
理想的な世界では、「ワーキングセット」は、メモリ不足で解放できない使用中のメモリ量です。
しかし、ワーキングセットの計算はホストOSによって異なり、一般に推定値を生成するために経験則を多用しています。
Kubernetesはスワップをサポートしていないため、すべての匿名(非ファイルバックアップ)メモリが含まれます。
ホストOSは常にそのようなページを再請求することができないため、メトリックには通常、一部のキャッシュされた(ファイルバックされた)メモリも含まれます。

## メトリクスサーバー

[メトリクスサーバー](https://github.com/kubernetes-sigs/metrics-server)は、クラスター全体のリソース使用量データのアグリゲーターです。
デフォルトでは、`kube-up.sh`スクリプトで作成されたクラスターにDeploymentオブジェクトとしてデプロイされます。
別のKubernetesセットアップ機構を使用する場合は、提供される[deployment components.yaml](https://github.com/kubernetes-sigs/metrics-server/releases)ファイルを使用してデプロイすることができます。
メトリクスサーバーは、Summary APIからメトリクスを収集します。
各ノードの[Kubelet](/docs/reference/command-line-tools-reference/kubelet/)から[Kubernetes aggregator](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)経由でメインAPIサーバーに登録されるようになっています。

メトリクスサーバーについては、[Design proposals](https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/metrics-server.md)で詳しく解説しています。


### Summary APIソース

[Kubelet](/docs/reference/command-line-tools-reference/kubelet/)は、ノード、ボリューム、Pod、コンテナレベルの統計情報を収集し、[Summary API](https://github.com/kubernetes/kubernetes/blob/7d309e0104fedb57280b261e5677d919cb2a0e2d/staging/src/k8s.io/kubelet/pkg/apis/stats/v1alpha1/types.go)で省略して消費者が読めるようにするものです。

1.23以前は、これらのリソースは主に[cAdvisor](https://github.com/google/cadvisor)から収集されていました。しかし、1.23では`PodAndContainerStatsFromCRI`フィーチャーゲートの導入により、コンテナとPodレベルの統計情報をCRI実装で収集することができます。

注意: これはCRI実装によるサポートも必要です(containerd >= 1.6.0, CRI-O >= 1.23.0)。
