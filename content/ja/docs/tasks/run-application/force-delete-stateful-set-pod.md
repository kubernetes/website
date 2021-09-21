---
title: StatefulSet Podの強制削除
content_type: task
weight: 70
---

<!-- overview -->
このページでは、StatefulSetの一部であるPodを削除する方法と、削除する際に考慮すべき事項について説明します。


## {{% heading "prerequisites" %}}


* これはかなり高度なタスクであり、StatefulSetに固有のいくつかの特性に反する可能性があります。
* 先に進む前に、以下に列挙されている考慮事項をよく理解してください。


<!-- steps -->

## StatefulSetに関する考慮事項

StatefulSetの通常の操作では、StatefulSet Podを強制的に削除する必要は**まったく**ありません。StatefulSetコントローラーは、StatefulSetのメンバーの作成、スケール、削除を行います。それは序数0からN-1までの指定された数のPodが生きていて準備ができていることを保証しようとします。StatefulSetは、クラスター内で実行されている特定のIDを持つ最大1つのPodがいつでも存在することを保証します。これは、StatefulSetによって提供される*最大1つの*セマンティクスと呼ばれます。

手動による強制削除は、StatefulSetに固有の最大1つのセマンティクスに違反する可能性があるため、慎重に行う必要があります。StatefulSetを使用して、安定したネットワークIDと安定した記憶域を必要とする分散型およびクラスター型アプリケーションを実行できます。これらのアプリケーションは、固定IDを持つ固定数のメンバーのアンサンブルに依存する構成を持つことがよくあります。同じIDを持つ複数のメンバーを持つことは悲惨なことになり、データの損失につながる可能性があります(例：定足数ベースのシステムでのスプリットブレインシナリオ)。

## Podの削除

次のコマンドで正常なPod削除を実行できます:

```shell
kubectl delete pods <pod>
```

上記がグレースフルターミネーションにつながるためには、`pod.Spec.TerminationGracePeriodSeconds`に0を指定しては**いけません**。`pod.Spec.TerminationGracePeriodSeconds`を0秒に設定することは安全ではなく、StatefulSet Podには強くお勧めできません。グレースフル削除は安全で、kubeletがapiserverから名前を削除する前にPodが[適切にシャットダウンする](/ja/docs/concepts/workloads/pods/pod-lifecycle/#termination-of-pods)ことを保証します。

Kubernetes(バージョン1.5以降)は、Nodeにアクセスできないという理由だけでPodを削除しません。到達不能なNodeで実行されているPodは、[タイムアウト](/ja/docs/concepts/architecture/nodes/#condition)の後に`Terminating`または`Unknown`状態になります。到達不能なNode上のPodをユーザーが適切に削除しようとすると、Podはこれらの状態に入ることもあります。そのような状態のPodをapiserverから削除することができる唯一の方法は以下の通りです:

* (ユーザーまたは[Node Controller](/ja/docs/concepts/architecture/nodes/)によって)Nodeオブジェクトが削除されます。
* 応答していないNodeのkubeletが応答を開始し、Podを終了してapiserverからエントリーを削除します。
* ユーザーによりPodを強制削除します。

推奨されるベストプラクティスは、1番目または2番目のアプローチを使用することです。Nodeが死んでいることが確認された(例えば、ネットワークから恒久的に切断された、電源が切られたなど)場合、Nodeオブジェクトを削除します。Nodeがネットワークパーティションに苦しんでいる場合は、これを解決するか、解決するのを待ちます。パーティションが回復すると、kubeletはPodの削除を完了し、apiserverでその名前を解放します。

通常、PodがNode上で実行されなくなるか、管理者によってそのNodeが削除されると、システムは削除を完了します。あなたはPodを強制的に削除することでこれを無効にすることができます。

### 強制削除

強制削除はPodが終了したことをkubeletから確認するまで**待ちません**。強制削除がPodの削除に成功したかどうかに関係なく、apiserverから名前をすぐに解放します。これにより、StatefulSetコントローラーは、同じIDを持つ交換Podを作成できます。これは、まだ実行中のPodの複製につながる可能性があり、そのPodがまだStatefulSetの他のメンバーと通信できる場合、StatefulSetが保証するように設計されている最大1つのセマンティクスに違反します。

StatefulSetのPodを強制的に削除するということは、問題のPodがStatefulSet内の他のPodと再び接触することはなく、代わりのPodを作成するために名前が安全に解放されることを意味します。

バージョン1.5以上のkubectlを使用してPodを強制的に削除する場合は、次の手順を実行します:

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

バージョン1.4以下のkubectlを使用している場合、`--force`オプションを省略する必要があります:

```shell
kubectl delete pods <pod> --grace-period=0
```

これらのコマンドを実行した後でもPodが`Unknown`状態のままになっている場合は、次のコマンドを使用してPodをクラスターから削除します:

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

StatefulSet Podの強制削除は、常に慎重に、関連するリスクを完全に把握して実行してください。



## {{% heading "whatsnext" %}}


[StatefulSetのデバッグ](/docs/tasks/debug-application-cluster/debug-stateful-set/)の詳細

