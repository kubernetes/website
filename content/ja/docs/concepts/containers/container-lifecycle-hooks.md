---
title: コンテナライフサイクルフック
content_type: concept
weight: 30
---

<!-- overview -->

このページでは、kubeletにより管理されるコンテナがコンテナライフサイクルフックフレームワークを使用して、管理ライフサイクル中にイベントによって引き起こされたコードを実行する方法について説明します。




<!-- body -->

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

このフックは、APIからの要求、またはliveness probeの失敗、プリエンプション、リソース競合などの管理イベントが原因でコンテナが終了する直前に呼び出されます。コンテナがすでに終了状態または完了状態にある場合、preStopフックの呼び出しは失敗します。
これはブロッキング、つまり同期的であるため、コンテナを停止する信号が送信される前に完了する必要があります。
ハンドラーにパラメーターは渡されません。

終了動作の詳細な説明は、[Termination of Pods](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)にあります。

### フックハンドラーの実装

コンテナは、フックのハンドラーを実装して登録することでそのフックにアクセスできます。
コンテナに実装できるフックハンドラーは2種類あります。

* Exec - コンテナのcgroupsと名前空間の中で、 `pre-stop.sh`のような特定のコマンドを実行します。
コマンドによって消費されたリソースはコンテナに対してカウントされます。
* HTTP - コンテナ上の特定のエンドポイントに対してHTTP要求を実行します。

### フックハンドラーの実行

コンテナライフサイクル管理フックが呼び出されると、Kubernetes管理システムはフックアクションにしたがってハンドラーを実行します。
`exec`と`tcpSocket`はコンテナの中で実行され、`httpGet`はkubeletプロセスによって実行されます。

フックハンドラーの呼び出しは、コンテナを含むPodのコンテキスト内で同期しています。
これは、`PostStart`フックの場合、コンテナのENTRYPOINTとフックは非同期に起動することを意味します。
しかし、フックの実行に時間がかかりすぎたりハングしたりすると、コンテナは`running`状態になることができません。

`PreStop`フックはコンテナを停止する信号から非同期で実行されるのではなく、信号が送られる前に実行を完了する必要があります。
もし`PreStop`フックが実行中にハングした場合、Podは`Terminating`状態にになり、
`terminationGracePeriodSeconds`の時間切れで強制終了されるまで続きます。
この猶予時間は、`PreStop`フックが実行され正常にコンテナを停止できるまでの合計時間に適用されます。
例えば`terminationGracePeriodSeconds`が60で、フックの終了に55秒かかり、シグナルを受信した後にコンテナを正常に停止させるのに10秒かかる場合、コンテナは正常に停止する前に終了されてしまいます。`terminationGracePeriodSeconds`が、これら２つの実行にかかる合計時間(55+10)よりも短いからです。

`PostStart`または`PreStop`フックが失敗した場合、コンテナは強制終了します。

ユーザーはフックハンドラーをできるだけ軽量にするべきです。
ただし、コンテナを停止する前に状態を保存するなどの場合は、長時間のコマンド実行が必要なケースもあります。

### フック配信保証

フックの配信は *少なくとも1回* を意図しています。これはフックが`PostStart`や`PreStop`のような任意のイベントに対して複数回呼ばれることがあることを意味します。
これを正しく処理するのはフックの実装次第です。

通常、1回の配信のみが行われます。
たとえば、HTTPフックレシーバーがダウンしていてトラフィックを受け取れない場合、再送信は試みられません。
ただし、まれに二重配信が発生することがあります。
たとえば、フックの送信中にkubeletが再起動した場合、kubeletが起動した後にフックが再送信される可能性があります。

### フックハンドラーのデバッグ

フックハンドラーのログは、Podのイベントには表示されません。
ハンドラーが何らかの理由で失敗した場合は、イベントをブロードキャストします。
`PostStart`の場合、これは`FailedPostStartHook`イベントで、`PreStop`の場合、これは`FailedPreStopHook`イベントです。
これらのイベントは `kubectl describe pod <pod_name>`を実行することで見ることができます。
このコマンドの実行によるイベントの出力例をいくつか示します。

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubObjectPath          Type      Reason               Message
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



## {{% heading "whatsnext" %}}


* [コンテナ環境](/ja/docs/concepts/containers/container-environment/)の詳細
* [コンテナライフサイクルイベントへのハンドラー紐付け](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)のハンズオン


