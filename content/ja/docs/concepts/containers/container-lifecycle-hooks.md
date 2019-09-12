---
title: コンテナライフサイクルフック
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

このページでは、kubeletにより管理されるコンテナがコンテナライフサイクルフックフレームワークを使用して、管理ライフサイクル中にイベントによって引き起こされたコードを実行する方法について説明します。

{{% /capture %}}


{{% capture body %}}

## 概要

Angularなどのコンポーネントライフサイクルフックを持つ多くのプログラミング言語フレームワークと同様に、Kubernetesはコンテナにライフサイクルフックを提供します。
フックにより、コンテナは管理ライフサイクル内のイベントを認識し、対応するライフサイクルフックが実行されたときにハンドラーに実装されたコードを実行できます。

## コンテナフック

コンテナに公開されている2つのフックがあります。

`PostStart`

このフックはコンテナが作成された直後に実行されます。
しかし、フックがコンテナのENTRYPOINTの前に実行されるという保証はありません。
ハンドラーにパラメーターは渡されません。

`PreStop`

このフックは、liveness probeの失敗、プリエンプション、リソース競合などのAPI要求または管理イベントが原因でコンテナが終了する直前に呼び出されます。コンテナが既に終了状態または完了状態にある場合、preStopフックの呼び出しは失敗します。
これはブロッキング、つまり同期的であるため、コンテナを削除するための呼び出しを送信する前に完了する必要があります。
ハンドラーにパラメーターは渡されません。

終了動作の詳細な説明は、[Termination of Pods](/docs/concepts/workloads/pods/pod/#termination-of-pods)にあります。

### フックハンドラーの実装

コンテナは、フックのハンドラーを実装して登録することでそのフックにアクセスできます。
コンテナに実装できるフックハンドラーは2種類あります。

* Exec - コンテナのcgroupsと名前空間の中で、 `pre-stop.sh`のような特定のコマンドを実行します。
コマンドによって消費されたリソースはコンテナに対してカウントされます。
* HTTP - コンテナ上の特定のエンドポイントに対してHTTP要求を実行します。

### フックハンドラーの実行

コンテナライフサイクル管理フックが呼び出されると、Kubernetes管理システムはそのフック用に登録されたコンテナ内のハンドラーを実行します。

フックハンドラーの呼び出しは、コンテナを含むPodのコンテキスト内で同期しています。
これは、`PostStart`フックの場合、コンテナのENTRYPOINTとフックは非同期に起動することを意味します。
しかし、フックの実行に時間がかかりすぎたりハングしたりすると、コンテナは`running`状態になることができません。

その振る舞いは `PreStop`フックに似ています。
実行中にフックがハングした場合、Podフェーズは`Terminating`状態に留まり、Podの`terminationGracePeriodSeconds`が終了した後に終了します。
`PostStart`または`PreStop`フックが失敗した場合、コンテナを強制終了します。

ユーザーはフックハンドラーをできるだけ軽量にするべきです。
ただし、コンテナを停止する前に状態を保存する場合など、長時間実行されるコマンドが意味をなす場合があります。

### フック配送保証

フックの配送は *少なくとも1回* を意図しています。これはフックが`PostStart`や`PreStop`のような任意のイベントに対して複数回呼ばれることがあることを意味します。
これを正しく処理するのはフックの実装次第です。

通常、単一の配送のみが行われます。
たとえば、HTTPフックレシーバーがダウンしていてトラフィックを受け取れない場合、再送信は試みられません。
ただし、まれに二重配送が発生することがあります。
たとえば、フックの送信中にkubeletが再起動した場合、kubeletが起動した後にフックが再送信される可能性があります。

### フックハンドラーのデバッグ

フックハンドラーのログは、Podのイベントには表示されません。
ハンドラーが何らかの理由で失敗した場合は、イベントをブロードキャストします。
`PostStart`の場合、これは`FailedPostStartHook`イベントで、`PreStop`の場合、これは`FailedPreStopHook`イベントです。
これらのイベントは `kubectl describe pod <pod_name>`を実行することで見ることができます。
このコマンドの実行によるイベントの出力例をいくつか示します。

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubobjectPath          Type      Reason               Message
  ---------  --------  -----  ----                                                   -------------          --------  ------               -------
  1m         1m        1      {default-scheduler }                                                          Normal    Scheduled            Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulling              pulling image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Created              Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulled               Successfully pulled image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Started              Started container with docker id 5c6a256a2567
  38s        38s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s        37s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s        37s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}                         Warning   FailedSync           Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m         22s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Warning   FailedPostStartHook
```

{{% /capture %}}

{{% capture whatsnext %}}

* [コンテナ環境](/docs/concepts/containers/container-environment-variables/)の詳細
* [コンテナライフサイクルイベントへのハンドラー紐付け](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)のハンズオン


{{% /capture %}}
