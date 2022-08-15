---
title: コンテナイメージのガベージコレクション
content_type: concept
weight: 70
---

<!-- overview -->

ガベージコレクションは、未使用の[イメージ](/ja/docs/concepts/containers/#container-images)と未使用の[コンテナ](/ja/docs/concepts/containers/)をクリーンアップするkubeletの便利な機能です。kubeletコンテナのガベージコレクションを1分ごとに行い、イメージのガベージコレクションは5分ごとに行います。

存在することが期待されているコンテナを削除してkubeletの動作を壊す可能性があるため、外部のガベージコレクションのツールは推奨されません。

<!-- body -->

## イメージのガベージコレクション

Kubernetesでは、すべてのイメージのライフサイクルの管理はcadvisorと協調してimageManager経由で行います。

イメージのガベージコレクションのポリシーについて考えるときは、`HighThresholdPercent`および`LowThresholdPercent`という2つの要因について考慮する必要があります。ディスク使用量がhigh thresholdを超えると、ガベージコレクションがトリガされます。ガベージコレクションは、low
thresholdが満たされるまで、最後に使われてから最も時間が経った(least recently used)イメージを削除します。

## コンテナのガベージコレクション

コンテナのガベージコレクションのポリシーは、3つのユーザー定義の変数を考慮に入れます。`MinAge`は、ガベージコレクションできるコンテナの最小の年齢です。`MaxPerPodContainer`は、すべての単一のPod(UID、コンテナ名)が保持することを許されているdead状態のコンテナの最大値です。`MaxContainers`はdead状態のコンテナの合計の最大値です。これらの変数は、`MinAge`は0に、`MaxPerPodContainer`と`MaxContainers`は0未満にそれぞれ設定することで個別に無効にできます。

kubeletは、未指定のコンテナ、削除されたコンテナ、前述のフラグにより設定された境界の外にあるコンテナに対して動作します。一般に、最も古いコンテナが最初に削除されます。`MaxPerPodContainer`と`MaxContainer`は、Podごとの保持するコンテナの最大値(`MaxPerPodContainer`)がグローバルのdead状態のコンテナの許容範囲(`MaxContainers`)外である場合には、互いに競合する可能性があります。このような状況では、`MaxPerPodContainer`が調整されます。最悪のケースのシナリオでは、`MaxPerPodContainer`が1にダウングレードされ、最も古いコンテナが強制退去されます。さらに、`MinAge`より古くなると、削除済みのPodが所有するコンテナが削除されます。

kubeletによって管理されないコンテナは、コンテナのガベージコレクションの対象にはなりません。

## ユーザー設定

イメージのガベージコレクションを調整するために、以下のkubeletのフラグを使用して次のようなしきい値を調整できます。

1. `image-gc-high-threshold`: イメージのガベージコレクションをトリガするディスク使用量の割合(%)。デフォルトは85%。
2. `image-gc-low-threshold`: イメージのガベージコレクションが解放を試みるディスク使用量の割合(%)。デフォルトは80%。

ガベージコレクションのポリシーは、以下のkubeletのフラグを使用してカスタマイズできます。

1. `minimum-container-ttl-duration`: 完了したコンテナがガベージコレクションされる前に経過するべき最小期間。デフォルトは0分です。つまり、すべての完了したコンテナはガベージコレクションされます。
2. `maximum-dead-containers-per-container`: コンテナごとに保持される古いインスタンスの最大値です。デフォルトは1です。
3. `maximum-dead-containers`: グローバルに保持するべき古いコンテナのインスタンスの最大値です。デフォルトは-1です。つまり、グローバルなリミットは存在しません。

コンテナは役に立たなくなる前にガベージコレクションされる可能性があります。こうしたコンテナには、トラブルシューティングに役立つログや他のデータが含まれるかもしれません。そのため、期待されるコンテナごとに最低でも1つのdead状態のコンテナが許容されるようにするために、`maximum-dead-containers-per-container`には十分大きな値を設定することが強く推奨されます。同様の理由で、`maximum-dead-containers`にも、より大きな値を設定することが推奨されます。詳しくは、[こちらのissue](https://github.com/kubernetes/kubernetes/issues/13287)を読んでください。

## 廃止

このドキュメントにあるkubeletの一部のガベージコレクションの機能は、将来kubelet evictionで置換される予定です。

これには以下のものが含まれます。

| 既存のフラグ | 新しいフラグ | 理由 |
| ------------- | -------- | --------- |
| `--image-gc-high-threshold` | `--eviction-hard`または`--eviction-soft` | 既存のevictionのシグナルがイメージのガベージコレクションをトリガする可能性がある |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` | eviction reclaimが同等の動作を実現する |
| `--maximum-dead-containers` | | 古いログがコンテナのコンテキストの外部に保存されるようになったら廃止 |
| `--maximum-dead-containers-per-container` | | 古いログがコンテナのコンテキストの外部に保存されるようになったら廃止 |
| `--minimum-container-ttl-duration` | | 古いログがコンテナのコンテキストの外部に保存されるようになったら廃止 |
| `--low-diskspace-threshold-mb` | `--eviction-hard` or `eviction-soft` | evictionはディスクのしきい値を他のリソースに一般化している |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` | evictionはディスクのpressure transitionを他のリソースに一般化している |



## {{% heading "whatsnext" %}}


詳細については、[リソース不足のハンドリング方法を設定する](/docs/tasks/administer-cluster/out-of-resource/)を参照してください。

