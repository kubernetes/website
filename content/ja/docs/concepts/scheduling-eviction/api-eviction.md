---
title: APIを起点とした退避
content_type: concept
weight: 110
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

Eviction APIを直接呼び出すか、`kubectl drain`コマンドのように{{<glossary_tooltip term_id="kube-apiserver" text="APIサーバー">}}のクライアントを使って退避を要求することが可能です。これにより、`Eviction`オブジェクトを作成し、APIサーバーにPodを終了させます。

APIを起点とした退避は[`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)と[`terminationGracePeriodSeconds`](/ja/docs/concepts/workloads/pods/pod-lifecycle#pod-termination)の設定を優先します。

APIを使用してPodのEvictionオブジェクトを作成することは、Podに対してポリシー制御された[`DELETE`操作](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod)を実行することに似ています。

## Eviction APIの実行 {#calling-the-eviction-api}

Kubernetes APIへアクセスして`Eviction`オブジェクトを作るために[Kubernetesのプログラミング言語のクライアント](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api)を使用できます。
そのためには、次の例のようなデータをPOSTすることで操作を試みることができます。

{{< tabs name="Eviction_example" >}}
{{% tab name="policy/v1" %}}
{{< note >}}
`policy/v1`においてEvictionはv1.22以上で利用可能です。それ以前のリリースでは、`policy/v1beta1`を使用してください。
{{< /note >}}

```json
{
  "apiVersion": "policy/v1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{% tab name="policy/v1beta1" %}}
{{< note >}}
v1.22で非推奨となり、`policy/v1`が採用されました。
{{< /note >}}

```json
{
  "apiVersion": "policy/v1beta1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

また、以下の例のように`curl`や`wget`を使ってAPIにアクセスすることで、操作を試みることもできます。

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

## APIを起点とした退避の仕組み {#how-api-initiated-eviction-works}

APIを使用して退去を要求した場合、APIサーバーはアドミッションチェックを行い、以下のいずれかを返します。

* `200 OK`:この場合、退去が許可されると`Eviction`サブリソースが作成され、PodのURLに`DELETE`リクエストを送るのと同じように、Podが削除されます。
* `429 Too Many Requests`:{{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}の設定により、現在退去が許可されていないことを示します。しばらく時間を空けてみてください。また、APIのレート制限のため、このようなレスポンスが表示されることもあります。
* `500 Internal Server Error`:複数のPodDisruptionBudgetが同じPodを参照している場合など、設定に誤りがあり退去が許可されないことを示します。

退去させたいPodがPodDisruptionBudgetを持つワークロードの一部でない場合、APIサーバーは常に`200 OK`を返して退去を許可します。

APIサーバーが退去を許可した場合、以下の流れでPodが削除されます。

1. APIサーバーの`Pod`リソースの削除タイムスタンプが更新され、APIサーバーは`Pod`リソースが終了したと見なします。また`Pod`リソースは、設定された猶予期間が設けられます。
1. ローカルのPodが動作しているNodeの{{<glossary_tooltip term_id="kubelet" text="kubelet">}}は、`Pod`リソースが終了するようにマークされていることに気付き、Podの適切なシャットダウンを開始します。
1. kubeletがPodをシャットダウンしている間、コントロールプレーンは{{<glossary_tooltip term_id="endpoint" text="Endpoint">}}オブジェクトからPodを削除します。その結果、コントローラーはPodを有効なオブジェクトと見なさないようになります。
1. Podの猶予期間が終了すると、kubeletはローカルPodを強制的に終了します。
1. kubeletはAPIサーバーに`Pod`リソースを削除するように指示します。
1. APIサーバーは`Pod`リソースを削除します。

## トラブルシューティング {#troubleshooting-stuck-evictions}

場合によっては、アプリケーションが壊れた状態になり、対処しない限りEviction APIが`429`または`500`レスポンスを返すだけとなることがあります。例えば、ReplicaSetがアプリケーション用のPodを作成しても、新しいPodが`Ready`状態にならない場合などです。また、最後に退去したPodの終了猶予期間が長い場合にも、この事象が見られます。

退去が進まない場合は、以下の解決策を試してみてください。

* 問題を引き起こしている自動化された操作を中止または一時停止し、操作を再開する前に、スタックしているアプリケーションを調査を行ってください。
* しばらく待ってから、Eviction APIを使用する代わりに、クラスターのコントロールプレーンから直接Podを削除してください。

## {{% heading "whatsnext" %}}
* [Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/)でアプリケーションを保護する方法について学ぶ
* [Node不足による退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)について学ぶ
* [Podの優先度とプリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)について学ぶ
