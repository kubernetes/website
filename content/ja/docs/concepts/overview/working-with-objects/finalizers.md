---
title: ファイナライザー(Finalizers)
content_type: concept
weight: 80
---

<!-- overview -->

{{<glossary_definition term_id="finalizer" length="long">}}

ファイナライザーを利用すると、対象のリソースを削除する前に特定のクリーンアップを行うように{{<glossary_tooltip text="コントローラー" term_id="controller">}}に警告することで、{{<glossary_tooltip text="ガベージコレクション" term_id="garbage-collection">}}を管理することができます。

大抵の場合ファイナライザーは実行されるコードを指定することはありません。
その代わり、一般的にはアノテーションのように特定のリソースに関するキーのリストになります。
Kubernetesはいくつかのファイナライザーを自動的に追加しますが、自分で追加することもできます。

## ファイナライザーはどのように動作するか

マニフェストファイルを使ってリソースを作るとき、`metadata.finalizers`フィールドの中でファイナライザーを指定することができます。
リソースを削除しようとするとき、削除リクエストを扱うAPIサーバーは`finalizers`フィールドの値を確認し、以下のように扱います。

  * 削除を開始した時間をオブジェクトの`metadata.deletionTimestamp`フィールドに設定します。
  * `metadata.finalizers`フィールドが空になるまでオブジェクトが削除されるのを阻止します。
  * ステータスコード`202`(HTTP "Accepted")を返します。

ファイナライザーを管理しているコントローラーは、オブジェクトの削除がリクエストされたことを示す`metadata.deletionTimestamp`がオブジェクトに設定されたことを検知します。
するとコントローラーはリソースに指定されたファイナライザーの要求を満たそうとします。
ファイナライザーの条件が満たされるたびに、そのコントローラーはリソースの`finalizers`フィールドの対象のキーを削除します。
`finalizers`フィールドが空になったとき、`deletionTimestamp`フィールドが設定されたオブジェクトは自動的に削除されます。管理外のリソース削除を防ぐためにファイナライザーを利用することもできます。

ファイナライザーの一般的な例は`kubernetes.io/pv-protection`で、これは `PersistentVolume`オブジェクトが誤って削除されるのを防ぐためのものです。
`PersistentVolume`オブジェクトをPodが利用中の場合、Kubernetesは`pv-protection`ファイナライザーを追加します。
`PersistentVolume`を削除しようとすると`Terminating`ステータスになりますが、ファイナライザーが存在しているためコントローラーはボリュームを削除することができません。
Podが`PersistentVolume`の利用を停止するとKubernetesは`pv-protection`ファイナライザーを削除し、コントローラーがボリュームを削除します。

## オーナーリファレンス、ラベル、ファイナライザー {#owners-labels-finalizers}

{{<glossary_tooltip text="ラベル" term_id="label">}}のように、
[オーナーリファレンス](/docs/concepts/overview/working-with-objects/owners-dependents/)はKubernetesのオブジェクト間の関係性を説明しますが、利用される目的が異なります。
{{<glossary_tooltip text="コントローラー" term_id="controller">}} がPodのようなオブジェクトを管理するとき、関連するオブジェクトのグループの変更を追跡するためにラベルを利用します。
例えば、{{<glossary_tooltip text="Job" term_id="job">}}がいくつかのPodを作成するとき、JobコントローラーはそれらのPodにラベルを付け、クラスター内の同じラベルを持つPodの変更を追跡します。

Jobコントローラーは、Podを作成したJobを指す*オーナーリファレンス*もそれらのPodに追加します。
Podが実行されているときにJobを削除すると、Kubernetesはオーナーリファレンス(ラベルではない)を使って、クリーンアップする必要のあるPodをクラスター内から探し出します。

また、Kubernetesは削除対象のリソースのオーナーリファレンスを認識して、ファイナライザーを処理します。

状況によっては、ファイナライザーが依存オブジェクトの削除をブロックしてしまい、対象のオーナーオブジェクトが完全に削除されず予想以上に長時間残ってしまうことがあります。
このような状況では、対象のオーナーと依存オブジェクトの、ファイナライザーとオーナーリファレンスを確認して問題を解決する必要があります。

{{<note>}}
オブジェクトが削除中の状態で詰まってしまった場合、削除を続行するために手動でファイナライザーを削除することは避けてください。
通常、ファイナライザーは理由があってリソースに追加されているものであるため、強制的に削除してしまうとクラスターで何らかの問題を引き起こすことがあります。
そのファイナライザーの目的を理解しているかつ、別の方法で達成できる場合にのみ行うべきです(例えば、依存オブジェクトを手動で削除するなど)。
{{</note>}}

## {{% heading "whatsnext" %}}

* Kubernetesブログの[ファイナライザーを利用した削除の制御](/blog/2021/05/14/using-finalizers-to-control-deletion/)をお読みください。
