---
title: PodとReplicationControllerのデバッグ
content_type: task
---

<!-- overview -->

このページでは、PodとReplicationControllerをデバッグする方法を説明します。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [Pod](/ja/docs/concepts/workloads/pods/pod/)と[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)の基本を理解している必要があります。



<!-- steps -->

## Podのデバッグ

Podのデバッグの最初のステップは、Podを調べることです。
次のコマンドで、Podの現在の状態と最近のイベントを確認して下さい。

```shell
kubectl describe pods ${POD_NAME}
```

Pod内のコンテナの状態を確認します。
コンテナはすべて`Running`状態ですか？最近再起動はしましたか？

Podの状態に応じてデバッグを続けます。

### PodがPending状態にとどまっている

Podが`Pending`状態でスタックしている場合、ノードにスケジュールできていないことを意味します。
一般的に、これは、何らかのタイプのリソースが不足しており、それによってスケジューリングを妨げられているためです。
上述の`kubectl describe...`コマンドの出力を確認してください。
Podをスケジュールできない理由に関するスケジューラーからのメッセージがあるはずです。
理由としては以下のようなものがあります。

#### リソースが不十分

クラスター内のCPUまたはメモリーの供給を使い果たした可能性があります。
この場合、いくつかのことを試すことができます。

* クラスターに[ノードを追加します](/docs/tasks/administer-cluster/cluster-management/#resizing-a-cluster)。

* [不要なPodを終了](/docs/concepts/workloads/pods/#pod-termination)して、
  `Pending`状態のPodのための空きリソースを作ります。

* Podがノードよりも大きくないことを確認します。
  例えば、すべてのノードのキャパシティーが`cpu: 1`の場合、`cpu: 1.1`を要求するPodは決してスケジュールされません。

    `kubectl get nodes -o <format>`コマンドでノードのキャパシティーを確認できます。
    必要な情報を抽出するコマンドラインの例を以下に示します。

    ```shell
    kubectl get nodes -o yaml | egrep '\sname:|cpu:|memory:'
    kubectl get nodes -o json | jq '.items[] | {name: .metadata.name, cap: .status.capacity}'
    ```

  [リソースクォータ](/docs/concepts/policy/resource-quotas/)機能では、
  消費できるリソースの合計量を制限するように構成できます。
  Namespaceと組み合わせて使用すると、1つのチームがすべてのリソースを占有することを防ぐことができます。

#### hostPortの使用

Podを`hostPort`にバインドすると、Podをスケジュールできる場所の数が制限されます。
ほとんどの場合、`hostPort`は不要です。Serviceオブジェクトを使用してPodを公開してください。
どうしても`hostPort`が必要な場合は、コンテナクラスター内のノードと同じ数のPodのみをスケジュールできます。

### PodがWaiting状態にとどまっている

Podが`Waiting`状態でスタックしている場合、Podはワーカーノードにスケジュールされていますが、そのマシンでは実行できない状態です。
この場合も、`kubectl describe ...`の情報が参考になるはずです。
Podが`Waiting`状態となる最も一般的な原因は、イメージをプルできないことです。
確認すべき事項が3つあります。

* イメージの名前が正しいことを確認して下さい。
* イメージはリポジトリーにプッシュしましたか？
* マシンで手動で`docker pull <image>`を実行し、イメージをプルできるかどうかを確認して下さい。

### Podがクラッシュする、あるいはUnhealthy状態

Podがスケジュールされると、[動作中のPodをデバッグする](/docs/tasks/debug-application-cluster/debug-running-pod/)に説明されている方法がデバッグに使用可能です。

## ReplicationControllerのデバッグ

ReplicationControllerはかなり明快です。Podを作成できるか、できないかのどちらかです。
Podを作成できない場合は、[上述の手順](#Podのデバッグ)を参照してPodをデバッグしてください。

`kubectl describe rc ${CONTROLLER_NAME}`を使用して、レプリケーションコントローラーに関連するイベントを調べることもできます。


