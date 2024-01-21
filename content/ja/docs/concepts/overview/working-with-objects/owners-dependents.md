---
title: オーナーと従属
content_type: concept
weight: 90
---

<!-- overview -->

Kubernetesでは、いくつかのオブジェクトは他のオブジェクトの*オーナー*になっています。
例えば、{{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}}はPodの集合のオーナーです。
これらの所有されているオブジェクトはオーナーに*従属*しています。

オーナーシップはいくつかのリソースでも使われている[ラベルとセレクター](/ja/docs/concepts/overview/working-with-objects/labels/)とは仕組みが異なります。
例として、`EndpointSlice`オブジェクトを作成するServiceオブジェクトを考えてみます。
Serviceはラベルを使ってどの`EndpointSlice`がどのServiceに利用されているかをコントロールプレーンに判断させています。
ラベルに加えて、Serviceの代わりに管理される各`EndpointSlice`はオーナーリファレンスを持ちます。
オーナーリファレンスは、Kubernetesの様々な箇所で管理外のオブジェクトに干渉してしまうのを避けるのに役立ちます。

## オブジェクト仕様におけるオーナーリファレンス

従属オブジェクトはオーナーオブジェクトを参照するための`metadata.ownerReferences`フィールドを持っています。
有効なオーナーリファレンスは従属オブジェクトと同じ名前空間に存在するオブジェクトの名前とUIDで構成されます。
KubernetesはReplicaSet、DaemonSet、Deployment、Job、CronJob、ReplicationControllerのようなオブジェクトの従属オブジェクトに、自動的に値を設定します。
このフィールドの値を手動で変更することで、これらの関係性を自分で設定することもできます。
ただし、通常はその必要はなく、Kubernetesが自動で管理するようにすることができます。

従属オブジェクトは、オーナーオブジェクトが削除されたときにガベージコレクションをブロックするかどうかを管理する真偽値を取る`ownerReferences.blockOwnerDeletion`フィールドも持っています。
Kubernetesは、{{<glossary_tooltip text="コントローラー" term_id="controller">}} 
(例：Deploymentコントローラー)が`metadata.ownerReferences`フィールドに値を設定している場合、自動的にこのフィールドを`true`に設定します。
`blockOwnerDeletion`フィールドに手動で値を設定することで、どの従属オブジェクトがガベージコレクションをブロックするかを設定することもできます。

Kubernetesのアドミッションコントローラーはオーナーの削除権限に基づいて、ユーザーが従属リソースのこのフィールドを変更できるかを管理しています。
これにより、認証されていないユーザーがオーナーオブジェクトの削除を遅らせることを防ぎます。

{{< note >}}
名前空間をまたぐオーナーリファレンスは仕様により許可されていません。
名前空間付き従属オブジェクトには、クラスタースコープ、または名前空間付きのオーナーを指定することができます。名前空間付きオーナーは**必ず**従属オブジェクトと同じ名前空間に存在していなければなりません。
そうでない場合、オーナーリファレンスはないものとして扱われ、全てのオーナーがいなくなった時点で従属オブジェクトは削除対象となります。

クラスタースコープの従属オブジェクトはクラスタースコープのオーナーのみ指定できます。
v1.20以降では、クラスタースコープの従属オブジェクトが名前空間付きのオブジェクトをオーナーとした場合、
解決できないオーナーリファレンスを持っているものとして扱われ、ガベージコレクションの対象とすることができません。

v1.20以降で、ガベージコレクターが無効な名前空間またぎの`ownerReference`や名前空間付きのオーナーに依存するクラスタースコープのオブジェクトなどを検知した場合、`OwnerRefInvalidNamespace`を理由とした警告のEventを出し、`involvedObject`で無効な従属オブジェクトを報告します。
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`を実行することで、この種類のEventを確認することができます。
{{< /note >}}

## オーナーシップとファイナライザー

Kubernetesでリソースを削除するとき、APIサーバーはリソースを管理するコントローラーに[ファイナライザールール](/ja/docs/concepts/overview/working-with-objects/finalizers/)を処理させることができます。
{{<glossary_tooltip text="ファイナライザー" term_id="finalizer">}}はクラスターが正しく機能するために必要なリソースを誤って削除してしまうことを防ぎます。
例えば、まだPodが使用中の`PersistentVolume`を削除しようとするとき、`PersistentVolume`が持っている`kubernetes.io/pv-protection`ファイナライザーにより、削除は即座には行われません。
その代わり、Kubernetesがファイナライザーを削除するまでボリュームは`Terminating`ステータスのまま残り、`PersistentVolume`がPodにバインドされなくなった後で削除が行われます。

またKubernetesは[フォアグラウンド、孤立したオブジェクトのカスケード削除](/ja/docs/concepts/architecture/garbage-collection/#cascading-deletion)を行ったとき、オーナーリソースにファイナライザーを追加します。
フォアグラウンド削除では、`foreground`ファイナライザーを追加し、オーナーを削除する前にコントローラーが`ownerReferences.blockOwnerDeletion=true`を持っている従属リソースを削除するようにします。
孤立したオブジェクトの削除を行う場合、Kubernetesは`orphan`ファイナライザーを追加し、オーナーオブジェクトを削除した後にコントローラーが従属リソースを無視するようにします。

## {{% heading "whatsnext" %}}

* [Kubernetesのファイナライザー](/ja/docs/concepts/overview/working-with-objects/finalizers/)についてさらに学習しましょう。
* [ガベージコレクション](/ja/docs/concepts/architecture/garbage-collection)について学習しましょう。
* [オブジェクトのメタデータ](/docs/reference/kubernetes-api/common-definitions/object-meta/#System)のAPIリファレンスをご覧ください。