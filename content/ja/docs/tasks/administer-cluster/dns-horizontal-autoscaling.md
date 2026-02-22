---
title: クラスター内のDNSサービスのオートスケール
content_type: task
weight: 80
---

<!-- overview -->
このページでは、KubernetesクラスターでDNSサービスのオートスケールを有効にし、設定する方法を説明します。


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* このガイドでは、ノードがAMD64またはIntel 64のCPUアーキテクチャを使用していることを前提としています。

* [Kubernetes DNS](/docs/concepts/services-networking/dns-pod-service/)が有効になっていることを確認してください。



<!-- steps -->

## DNS水平オートスケールがすでに有効になっているかどうかの確認 {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

kube-system{{< glossary_tooltip text="名前空間" term_id="namespace" >}}内のクラスターの{{< glossary_tooltip text="Deployment" term_id="deployment" >}}を一覧表示します:

```shell
kubectl get deployment --namespace=kube-system
```

出力は次のようになります:

    NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
    ...
    kube-dns-autoscaler    1/1     1            1           ...
    ...

出力に「kube-dns-autoscaler」が表示されている場合、DNS水平オートスケールはすでに有効になっています。
[オートスケーリングパラメーターの調整](#tuning-autoscaling-parameters)にスキップしても問題ありません。

## DNS Deploymentの名前を取得する {#find-scaling-target}

kube-system名前空間内のクラスターのDNS Deploymentを一覧表示します:

```shell
kubectl get deployment -l k8s-app=kube-dns --namespace=kube-system
```

出力は次のようになります:

    NAME      READY   UP-TO-DATE   AVAILABLE   AGE
    ...
    coredns   2/2     2            2           ...
    ...

DNSサービスのDeploymentが表示されない場合は、名前で検索することもできます:

```shell
kubectl get deployment --namespace=kube-system
```

そして、`coredns`または`kube-dns`という名前のDeploymentを探します。


スケール対象は

    Deployment/<your-deployment-name>

となります。
ここで、`<your-deployment-name>`はDNS Deploymentの名前です。
たとえば、DNS Deploymentの名前がcorednsの場合、スケール対象はDeployment/corednsになります。

{{< note >}}
CoreDNSはKubernetesのデフォルトDNSサービスです。
CoreDNSは、もともとkube-dnsを使用していたクラスターでも動作できるように、`k8s-app=kube-dns`というラベルを設定しています。
{{< /note >}}

## DNS水平オートスケールを有効にする {#enablng-dns-horizontal-autoscaling}

このセクションでは、新しいDeploymentを作成します。
Deployment内のPodは、`cluster-proportional-autoscaler-amd64`イメージに基づくコンテナを実行します。

次の内容で`dns-horizontal-autoscaler.yaml`という名前のファイルを作成します:

{{% code_sample file="admin/dns/dns-horizontal-autoscaler.yaml" %}}

ファイル内で、`<SCALE_TARGET>`をスケール対象に置き換えます。

設定ファイルがあるディレクトリに移動し、次のコマンドを入力してDeploymentを作成します:

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

コマンドが成功した場合の出力は次のようになります:

    deployment.apps/kube-dns-autoscaler created

DNS水平オートスケールが有効になりました。

## DNSオートスケーリングパラメーターを調整する {#tuning-autoscaling-parameters}

kube-dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}が存在することを確認します:

```shell
kubectl get configmap --namespace=kube-system
```

出力は次のようになります:

    NAME                  DATA      AGE
    ...
    kube-dns-autoscaler   1         ...
    ...

ConfigMap内のデータを変更します:

```shell
kubectl edit configmap kube-dns-autoscaler --namespace=kube-system
```

次の行を探します:

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

ニーズに応じてフィールドを変更します。
「min」フィールドは、DNSバックエンドの最小数を示します。
実際のバックエンド数は次の式を使用して計算されます:

    replicas = max( ceil( cores × 1/coresPerReplica ) , ceil( nodes × 1/nodesPerReplica ) )

`coresPerReplica`と`nodesPerReplica`の値はどちらも浮動小数点数であることに注意してください。

クラスターで多くのコアを持つノードが使用されている場合は`coresPerReplica`が支配的になります。
クラスターでコアが少ないノードが使用されている場合は`nodesPerReplica`が支配的になります。

他にもサポートされているスケーリングパターンがあります。
詳細は、[cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)を参照してください。

## DNS水平オートスケールを無効にする {#disable-dns-horizontal-autoscaling}

DNS水平オートスケールを調整するためのオプションはいくつかあります。
どのオプションを使用するかは、さまざまな条件によって異なります。

### オプション1: kube-dns-autoscaler Deploymentを0レプリカにスケールダウンする {#option-1-scale-down-the-kube-dns-autoscaler-deployment-to-0-replicas}

このオプションはすべての状況で機能します。
次のコマンドを入力します:

```shell
kubectl scale deployment --replicas=0 kube-dns-autoscaler --namespace=kube-system
```

出力は次のようになります:

    deployment.apps/kube-dns-autoscaler scaled

レプリカ数がゼロであることを確認します:

```shell
kubectl get rs --namespace=kube-system
```

出力のDESIRED列とCURRENT列に0が表示されます:

    NAME                                  DESIRED   CURRENT   READY   AGE
    ...
    kube-dns-autoscaler-6b59789fc8        0         0         0       ...
    ...

### オプション2: kube-dns-autoscaler Deploymentを削除する {#option-2-delete-the-kube-dns-autoscaler-deployment}

このオプションは、kube-dns-autoscalerが自身の管理下にある場合、つまり誰も再作成しない場合に機能します:

```shell
kubectl delete deployment kube-dns-autoscaler --namespace=kube-system
```

出力は次のようになります:

    deployment.apps "kube-dns-autoscaler" deleted

### オプション3: マスターノードからkube-dns-autoscalerマニフェストファイルを削除する {#option-3-delete-the-kube-dns-autoscaler-manifest-file-from-the-master-node}

このオプションは、kube-dns-autoscalerが(非推奨の)[Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md)の管理下にあり、マスターノードへの書き込みアクセス権がある場合に機能します。

マスターノードにサインインし、対応するマニフェストファイルを削除します。
このkube-dns-autoscalerの一般的なパスは次のとおりです:

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

マニフェストファイルが削除されると、Addon Managerはkube-dns-autoscaler Deploymentを削除します。



<!-- discussion -->

## DNS水平オートスケールの仕組みを理解する {#understanding-how-dns-horizontal-autoscaling-works}

* cluster-proportional-autoscalerアプリケーションは、DNSサービスとは別にデプロイされます。

* オートスケーラーPodは、クラスター内のノード数とコア数についてKubernetes APIサーバーをポーリングするクライアントを実行します。

* 現在のスケジュール可能なノードとコア、および指定されたスケーリングパラメーターに基づいて、必要なレプリカ数が計算され、DNSバックエンドに適用されます。

* スケーリングパラメーターとデータポイントはConfigMapを介してオートスケーラーに提供され、最新の目的のスケーリングパラメーターで最新の状態を維持するために、ポーリング間隔ごとにパラメーターテーブルを更新します。

* スケーリングパラメーターへの変更は、オートスケーラーPodを再構築または再起動することなく許可されます。

* オートスケーラーは、*linear*と*ladder*の2つの制御パターンをサポートするコントローラーインターフェースを提供します。



## {{% heading "whatsnext" %}}

* [クリティカルなアドオンPodの保証されたスケジューリング](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)について読む。
* [cluster-proportional-autoscalerの実装](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)について詳しく学ぶ。