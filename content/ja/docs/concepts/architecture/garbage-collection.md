---
title: ガベージコレクション
content_type: concept
weight: 70
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}}これにより、次のようなリソースのクリーンアップが可能になります:

  * [終了したPod](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
  * [完了したJob](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)
  * [owner referenceのないオブジェクト](#owners-dependents)
  * [未使用のコンテナとコンテナイメージ](#containers-images)
  * [StorageClassの再利用ポリシーがDeleteである動的にプロビジョニングされたPersistentVolume](/ja/docs/concepts/storage/persistent-volumes/#delete)
  * [失効または期限切れのCertificateSigningRequests (CSRs)](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
  * 次のシナリオで削除された{{<glossary_tooltip text="Node" term_id="node">}}:
    * クラウド上でクラスターが[クラウドコントローラーマネージャー](/ja/docs/concepts/architecture/cloud-controller/)を使用する場合
    * オンプレミスでクラスターがクラウドコントローラーマネージャーと同様のアドオンを使用する場合
  * [Node Leaseオブジェクト](/ja/docs/concepts/architecture/nodes/#heartbeats)

## オーナーの依存関係 {#owners-dependents}

Kubernetesの多くのオブジェクトは、[*owner reference*](/docs/concepts/overview/working-with-objects/owners-dependents/)を介して相互にリンクしています。
owner referenceは、どのオブジェクトが他のオブジェクトに依存しているかをコントロールプレーンに通知します。
Kubernetesは、owner referenceを使用して、コントロールプレーンやその他のAPIクライアントに、オブジェクトを削除する前に関連するリソースをクリーンアップする機会を提供します。
ほとんどの場合、Kubernetesはowner referenceを自動的に管理します。

Ownershipは、一部のリソースでも使用される[ラベルおよびセレクター](/docs/concepts/overview/working-with-objects/labels/)メカニズムとは異なります。
たとえば、`EndpointSlice`オブジェクトを作成する{{<glossary_tooltip text="Service" term_id="service">}}を考えます。
Serviceは*ラベル*を使用して、コントロールプレーンがServiceに使用されている`EndpointSlice`オブジェクトを判別できるようにします。
ラベルに加えて、Serviceに代わって管理される各`EndpointSlice`には、owner referenceがあります。
owner referenceは、Kubernetesのさまざまな部分が制御していないオブジェクトへの干渉を回避するのに役立ちます。

{{< note >}}
namespace間のowner referenceは、設計上許可されていません。
namespaceの依存関係は、クラスタースコープまたはnamespaceのオーナーを指定できます。
namespaceのオーナーは、依存関係と同じnamespaceに**存在する必要があります**。
そうでない場合、owner referenceは不在として扱われ、すべてのオーナーが不在であることが確認されると、依存関係は削除される可能性があります。

クラスタースコープの依存関係は、クラスタースコープのオーナーのみを指定できます。
v1.20以降では、クラスタースコープの依存関係がnamespaceを持つkindをオーナーとして指定している場合、それは解決できないowner referenceを持つものとして扱われ、ガベージコレクションを行うことはできません。

V1.20以降では、ガベージコレクタは無効な名前空間間の`ownerReference`、またはnamespaceのkindを参照する`ownerReference`をもつクラスター・スコープの依存関係を検出した場合、無効な依存関係の`OwnerRefInvalidNamespace`と`involvedObject`を理由とする警告イベントが報告されます。
以下のコマンドを実行すると、そのようなイベントを確認できます。
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`
{{< /note >}}

## カスケード削除 {#cascading-deletion}

Kubernetesは、ReplicaSetを削除したときに残されたPodなど、owner referenceがなくなったオブジェクトをチェックして削除します。
オブジェクトを削除する場合、カスケード削除と呼ばれるプロセスで、Kubernetesがオブジェクトの依存関係を自動的に削除するかどうかを制御できます。
カスケード削除には、次の2つのタイプがあります。

  * フォアグラウンドカスケード削除
  * バックグラウンドカスケード削除

また、Kubernetes {{<glossary_tooltip text="finalizer" term_id="finalizer">}}を使用して、ガベージコレクションがowner referenceを持つリソースを削除する方法とタイミングを制御することもできます。

### フォアグラウンドカスケード削除 {#foreground-deletion}

フォアグラウンドカスケード削除では、削除するオーナーオブジェクトは最初に*削除進行中*の状態になります。
この状態では、オーナーオブジェクトに次のことが起こります。

  * Kubernetes APIサーバーは、オブジェクトの`metadata.deletionTimestamp`フィールドを、オブジェクトに削除のマークが付けられた時刻に設定します。
  * Kubernetes APIサーバーは、`metadata.finalizers`フィールドを`foregroundDeletion`に設定します。
  * オブジェクトは、削除プロセスが完了するまで、KubernetesAPIを介して表示されたままになります。

オーナーオブジェクトが削除進行中の状態に入ると、コントローラーは依存関係を削除します。
すべての依存関係オブジェクトを削除した後、コントローラーはオーナーオブジェクトを削除します。
この時点で、オブジェクトはKubernetesAPIに表示されなくなります。

フォアグラウンドカスケード削除中に、オーナーの削除をブロックする依存関係は、`ownerReference.blockOwnerDeletion=true`フィールドを持つ依存関係のみです。
詳細については、[フォアグラウンドカスケード削除の使用](/ja/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)を参照してください。

### バックグラウンドカスケード削除 {#background-deletion}

バックグラウンドカスケード削除では、Kubernetes APIサーバーがオーナーオブジェクトをすぐに削除し、コントローラーがバックグラウンドで依存オブジェクトをクリーンアップします。
デフォルトでは、フォアグラウンド削除を手動で使用するか、依存オブジェクトを孤立させることを選択しない限り、Kubernetesはバックグラウンドカスケード削除を使用します。

詳細については、[バックグラウンドカスケード削除の使用](/ja/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)を参照してください。

### 孤立した依存関係

Kubernetesがオーナーオブジェクトを削除すると、残された依存関係は*orphan*オブジェクトと呼ばれます。
デフォルトでは、Kubernetesは依存関係オブジェクトを削除します。この動作をオーバーライドする方法については、[オーナーオブジェクトの削除と従属オブジェクトの孤立](/ja/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy)を参照してください。

## 未使用のコンテナとイメージのガベージコレクション {#containers-images}

{{<glossary_tooltip text="kubelet" term_id="kubelet">}}は未使用のイメージに対して5分ごとに、未使用のコンテナに対して1分ごとにガベージコレクションを実行します。
外部のガベージコレクションツールは、kubeletの動作を壊し、存在するはずのコンテナを削除する可能性があるため、使用しないでください。

未使用のコンテナとイメージのガベージコレクションのオプションを設定するには、[設定ファイル](/docs/tasks/administer-cluster/kubelet-config-file/)を使用してkubeletを調整し、[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)リソースタイプを使用してガベージコレクションに関連するパラメーターを変更します。

### コンテナイメージのライフサイクル

Kubernetesは、kubeletの一部である*イメージマネージャー*を通じて、{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}の協力を得て、すべてのイメージのライフサイクルを管理します。kubeletは、ガベージコレクションを決定する際に、次のディスク使用制限を考慮します。

  * `HighThresholdPercent`
  * `LowThresholdPercent`

設定された`HighThresholdPercent`値を超えるディスク使用量はガベージコレクションをトリガーします。
ガベージコレクションは、最後に使用された時間に基づいて、最も古いものから順にイメージを削除します。
kubeletは、ディスク使用量が`LowThresholdPercent`値に達するまでイメージを削除します。

### コンテナのガベージコレクション {#container-image-garbage-collection}

kubeletは、次の変数に基づいて未使用のコンテナをガベージコレクションします。

  * `MinAge`: kubeletがガベージコレクションできるコンテナの最低期間。`0`を設定すると無効化されます。
  * `MaxPerPodContainer`: 各Podが持つことができるデッドコンテナの最大数。`0`未満に設定すると無効化されます。
  * `MaxContainers`: クラスターが持つことができるデッドコンテナの最大数。`0`未満に設定すると無効化されます。

これらの変数に加えて、kubeletは、通常、最も古いものから順に、定義されていない削除されたコンテナをガベージコレクションします。

`MaxPerPodContainer`と`MaxContainers`は、Podごとのコンテナの最大数(`MaxPerPodContainer`)を保持すると、グローバルなデッドコンテナの許容合計(`MaxContainers`)を超える状況で、互いに競合する可能性があります。
この状況では、kubeletは`MaxPerPodContainer`を調整して競合に対処します。最悪のシナリオは、`MaxPerPodContainer`を1にダウングレードし、最も古いコンテナを削除することです。
さらに、削除されたPodが所有するコンテナは、`MinAge`より古くなると削除されます。

{{<note>}}
 kubeletがガベージコレクションするのは、自分が管理するコンテナのみです。
{{</note>}}

## ガベージコレクションの設定 {#configuring-gc}

これらのリソースを管理するコントローラーに固有のオプションを設定することにより、リソースのガベージコレクションを調整できます。次のページは、ガベージコレクションを設定する方法を示しています。

  * [Kubernetesオブジェクトのカスケード削除の設定](/ja/docs/tasks/administer-cluster/use-cascading-deletion/)
  * [完了したジョブのクリーンアップの設定](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)
  
<!-- * [Configuring unused container and image garbage collection](/docs/tasks/administer-cluster/reconfigure-kubelet/) -->

## {{% heading "whatsnext" %}}

* [Kubernetes オブジェクトの所有権](/docs/concepts/overview/working-with-objects/owners-dependents/)を学びます。
* Kubernetes [finalizer](/docs/concepts/overview/working-with-objects/finalizers/)を学びます。
* 完了したジョブをクリーンアップする[TTL controller](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)(beta)について学びます。
