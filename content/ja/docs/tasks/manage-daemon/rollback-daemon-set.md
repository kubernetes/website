---
title: DaemonSet上でロールバックを実施する
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
---

<!-- overview -->

このページでは、{{< glossary_tooltip term_id="daemonset" >}}上でロールバックを行う方法について説明します。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

[DaemonSet上でローリングアップデートを実施する](/ja/docs/tasks/manage-daemon/update-daemon-set/)方法については既に知っているものとします。

<!-- steps -->

## DaemonSet上のロールバックの実施

### ステップ1: ロールバック先のDaemonSetのリビジョンを見つける

最新のリビジョンにロールバックしたい場合は、このステップを省略できます。

DaemonSetの全てのリビジョンを列挙します:

```shell
kubectl rollout history daemonset <daemonset-name>
```

これはDaemonSetのリビジョンのリストを返します:

```
daemonsets "<daemonset-name>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

* 変更理由は作成時にDaemonSetのアノテーション`kubernetes.io/change-cause`からコピーされます。
  実行したコマンドをchange-causeアノテーションに記録するために、`kubectl`内で`--record=true`を指定することができます。

特定のリビジョンの詳細を見るためには次を実行します:

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

これは、そのリビジョンの詳細を返します:

```
daemonsets "<daemonset-name>" with revision #1
Pod Template:
Labels:       foo=bar
Containers:
app:
 Image:        ...
 Port:         ...
 Environment:  ...
 Mounts:       ...
Volumes:      ...
```

### ステップ2: 特定のリビジョンにロールバックする

```shell
# ステップ1で得たリビジョン番号を--to-revisionで指定します。
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

成功すると、コマンドは次を返します:

```
daemonset "<daemonset-name>" rolled back
```

{{< note >}}
`--to-revision`フラグが指定されない場合は、kubectlは最新のリビジョンを取得します。
{{< /note >}}

### ステップ3: DaemonSetのロールバックの進行状況を監視する

`kubectl rollout undo daemonset`は、サーバーに対してDaemonSetのロールバックを開始するよう指示します。
実際のロールバックはクラスターの{{< glossary_tooltip term_id="control-plane" text="コントロールプレーン" >}}内で非同期に実行されます。

ロールバックの進行状況を監視するためには次を実行します:

```shell
kubectl rollout status ds/<daemonset-name>
```

ロールバックが完了すると、次のような出力が得られます:

```
daemonset "<daemonset-name>" successfully rolled out
```


<!-- discussion -->

## DaemonSetのリビジョンを理解する

前の`kubectl rollout history`のステップでは、DaemonSetのリビジョンのリストを取得しました。
各リビジョンは、ControllerRevisionという名前のリソースに格納されています。

各リビジョンに何が格納されているか確認するためには、DaemonSetのリビジョンの生のリソースを探します:

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

これはControllerRevisionsのリストを返します:

```
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

各ControllerRevisionはアノテーションとDaemonSetのリビジョンのテンプレートを格納します。

`kubectl rollout undo`は特定のControllerRevisionを受け取り、DaemonSetのテンプレートを、ControllerRevision内に保管されたテンプレートに置き換えます。
`kubectl rollout undo`はDaemonSetのテンプレートを、`kubectl edit`や`kubectl apply`のような他のコマンドによって、以前のリビジョンに更新することに相当します。

{{< note >}}
DaemonSetのリビジョンはロールフォワードのみとなります。
これはつまり、ロールバックが完了すると、ControllerRevisionのリビジョン番号(`.revision`フィールド)が繰り上がります。
例えば、システムにリビジョン1と2があってリビジョン2からリビジョン1にロールバックすると、`.revision: 1`のControllerRevisionは`.revision: 3`になります。
{{< /note >}}

## トラブルシューティング

* [DaemonSetのローリングアップデートのトラブルシューティング](/ja/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting)を参照。
