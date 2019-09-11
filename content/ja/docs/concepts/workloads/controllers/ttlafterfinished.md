---
reviewers:
title: 終了したリソースのためのTTLコントローラー(TTL Controller for Finished Resources)
content_template: templates/concept
weight: 65
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

TTLコントローラーは実行を終えたリソースオブジェクトのライフタイムを制御するためのTTL機構を提供します。  
TTLコントローラーは現在[Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)のみ扱っていて、将来的にPodやカスタムリソースなど、他のリソースの実行終了を扱えるように拡張される予定です。

α版の免責事項: この機能は現在α版の機能で、[Feature Gate](/docs/reference/command-line-tools-reference/feature-gates/)の`TTLAfterFinished`を有効にすることで使用可能です。

{{% /capture %}}




{{% capture body %}}

## TTLコントローラー

TTLコントローラーは現在Jobに対してのみサポートされています。クラスターオペレーターはこの[例](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically)のように、Jobの`.spec.ttlSecondsAfterFinished`フィールドを指定することにより、終了したJob(`完了した`もしくは`失敗した`)を自動的に削除するためにこの機能を使うことができます。  
TTLコントローラーは、そのリソースが終了したあと指定したTTLの秒数後に削除できるか推定します。言い換えると、そのTTLが期限切れになると、TTLコントローラーがリソースをクリーンアップするときに、そのリソースに紐づく従属オブジェクトも一緒に連続で削除します。注意点として、リソースが削除されるとき、ファイナライザーのようなライフサイクルに関する保証は尊重されます。

TTL秒はいつでもセット可能です。下記はJobの`.spec.ttlSecondsAfterFinished`フィールドのセットに関するいくつかの例です。

* Jobがその終了後にいくつか時間がたった後に自動的にクリーンアップできるように、そのリソースマニフェストにこの値を指定します。
* この新しい機能を適用させるために、存在していて既に終了したリソースに対してこのフィールドをセットします。
* リソース作成時に、このフィールドを動的にセットするために、[管理webhookの変更](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)をさせます。クラスター管理者は、終了したリソースに対して、このTTLポリシーを強制するために使うことができます。
* リソースが終了した後に、このフィールドを動的にセットしたり、リソースステータスやラベルなどの値に基づいて異なるTTL値を選択するために、[管理webhookの変更](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)をさせます。

## 注意

### TTL秒の更新

注意点として、Jobの`.spec.ttlSecondsAfterFinished`フィールドといったTTL期間はリソースが作成された後、もしくは終了した後に変更できます。しかし、一度Jobが削除可能(TTLの期限が切れたとき)になると、それがたとえTTLを伸ばすような更新に対してAPIのレスポンスで成功したと返されたとしても、そのシステムはJobが稼働し続けることをもはや保証しません。

### タイムスキュー(Time Skew)

TTLコントローラーが、TTL値が期限切れかそうでないかを決定するためにKubernetesリソース内に保存されたタイムスタンプを使うため、この機能はクラスター内のタイムスキュー(時刻のずれ)に対してセンシティブとなります。タイムスキューは、誤った時間にTTLコントローラーに対してリソースオブジェクトのクリーンアップしてしまうことを引き起こすものです。

Kubernetesにおいてタイムスキューを避けるために、全てのNode上でNTPの稼働を必須とします([#6159](https://github.com/kubernetes/kubernetes/issues/6159#issuecomment-93844058)を参照してください)。クロックは常に正しいものではありませんが、Node間におけるその差はとても小さいものとなります。TTLに0でない値をセットするときにこのリスクに対して注意してください。

{{% /capture %}}

{{% capture whatsnext %}}

[Jobの自動クリーンアップ](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically)

[設計ドキュメント](https://github.com/kubernetes/community/blob/master/keps/sig-apps/0026-ttl-after-finish.md)

{{% /capture %}}
