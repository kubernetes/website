---
title: コンテナライフサイクルフック
content_type: concept
weight: 40
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

このフックは、APIからの要求、またはliveness/startup probeの失敗、プリエンプション、リソース競合などの管理イベントが原因でコンテナが終了する直前に呼び出されます。コンテナがすでに終了状態または完了状態にある場合には`PreStop`フックの呼び出しは失敗し、コンテナを停止するTERMシグナルが送信される前にフックは完了する必要があります。`PreStop`フックが実行される前にPodの終了猶予期間のカウントダウンが開始されるので、ハンドラーの結果に関わらず、コンテナはPodの終了猶予期間内に最終的に終了します。
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
`httpGet`と`tcpSocket`はkubeletプロセスによって実行され、`exec`はコンテナの中で実行されます。

フックハンドラーの呼び出しは、コンテナを含むPodのコンテキスト内で同期しています。
これは、`PostStart`フックの場合、コンテナのENTRYPOINTとフックは非同期に起動することを意味します。
しかし、フックの実行に時間がかかりすぎたりハングしたりすると、コンテナは`running`状態になることができません。

`PreStop`フックはコンテナを停止するシグナルから非同期で実行されるのではなく、TERMシグナルが送られる前に実行を完了する必要があります。
もし`PreStop`フックが実行中にハングした場合、Podは`Terminating`状態になり、
`terminationGracePeriodSeconds`の時間切れで強制終了されるまで続きます。
この猶予時間は、`PreStop`フックが実行され正常にコンテナを停止できるまでの合計時間に適用されます。
例えば`terminationGracePeriodSeconds`が60で、フックの終了に55秒かかり、シグナルを受信した後にコンテナを正常に停止させるのに10秒かかる場合、コンテナは正常に停止する前に終了されてしまいます。`terminationGracePeriodSeconds`が、これら2つの実行にかかる合計時間(55+10)よりも短いからです。

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
失敗の`FailedPreStopHook`イベントを自分自身で生成する場合には、[lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml)ファイルに対してpostStartのコマンドを"badcommand"に変更し、適用してください。
`kubectl describe pod lifecycle-demo`を実行した結果のイベントの出力例を以下に示します。

```
Events:
  Type     Reason               Age              From               Message
  ----     ------               ----             ----               -------
  Normal   Scheduled            7s               default-scheduler  Successfully assigned default/lifecycle-demo to ip-XXX-XXX-XX-XX.us-east-2...
  Normal   Pulled               6s               kubelet            Successfully pulled image "nginx" in 229.604315ms
  Normal   Pulling              4s (x2 over 6s)  kubelet            Pulling image "nginx"
  Normal   Created              4s (x2 over 5s)  kubelet            Created container lifecycle-demo-container
  Normal   Started              4s (x2 over 5s)  kubelet            Started container lifecycle-demo-container
  Warning  FailedPostStartHook  4s (x2 over 5s)  kubelet            Exec lifecycle hook ([badcommand]) for Container "lifecycle-demo-container" in Pod "lifecycle-demo_default(30229739-9651-4e5a-9a32-a8f1688862db)" failed - error: command 'badcommand' exited with 126: , message: "OCI runtime exec failed: exec failed: container_linux.go:380: starting container process caused: exec: \"badcommand\": executable file not found in $PATH: unknown\r\n"
  Normal   Killing              4s (x2 over 5s)  kubelet            FailedPostStartHook
  Normal   Pulled               4s               kubelet            Successfully pulled image "nginx" in 215.66395ms
  Warning  BackOff              2s (x2 over 3s)  kubelet            Back-off restarting failed container
```



## {{% heading "whatsnext" %}}


* [コンテナ環境](/ja/docs/concepts/containers/container-environment/)の詳細
* [コンテナライフサイクルイベントへのハンドラー紐付け](/ja/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)のハンズオン

