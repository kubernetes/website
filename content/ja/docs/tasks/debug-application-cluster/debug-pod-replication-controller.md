---
title: PodとReplicationControllerのデバッグ
content_template: templates/task
---

{{% capture overview %}}

このページでは、PodとReplicationControllerをデバッグする方法を説明します。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [Pod](/ja/docs/concepts/workloads/pods/pod/)と[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)の基本を理解している必要があります。

{{% /capture %}}

{{% capture steps %}}

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

* クラスターに[ノードを追加します](/docs/admin/cluster-management/#resizing-a-cluster)。

* [不要なPodを終了](/docs/user-guide/pods/single-container/#deleting_a_pod)して、
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

最初に、現在のコンテナのログを確認して下さい。

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

以前にコンテナがクラッシュした場合、次のコマンドで以前のコンテナのクラッシュログにアクセスできます。

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

別の方法として、`exec`を使用してそのコンテナ内でコマンドを実行できます。

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}`はオプションです。単一のコンテナのみを含むPodの場合は省略できます。
{{< /note >}}

例えば、実行中のCassandra Podのログを確認するには、次のコマンドを実行します。

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

これらのアプローチがいずれも機能しない場合、Podが実行されているホストマシンを見つけて、そのホストにSSH接続することができます。

## ReplicationControllerのデバッグ

ReplicationControllerはかなり明快です。Podを作成できるか、できないかのどちらかです。
Podを作成できない場合は、[上述の手順](#Podのデバッグ)を参照してPodをデバッグしてください。

`kubectl describe rc ${CONTROLLER_NAME}`を使用して、レプリケーションコントローラーに関連するイベントを調べることもできます。

{{% /capture %}}
