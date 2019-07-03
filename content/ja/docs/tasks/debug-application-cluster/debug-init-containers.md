---
title: Init Containerのデバッグ
content_template: templates/task
---

{{% capture overview %}}

このページでは、Init Containerの実行に関連する問題を調査する方法を説明します。以下のコマンドラインの例では、Podを`<pod-name>`、Init Containerを`<init-container-1>`および`<init-container-2>`として参照しています。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [Init Container](/docs/concepts/abstractions/init-containers/)の基本を理解しておきましょう。
* [Init Containerを設定](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container/)しておきましょう。

{{% /capture %}}

{{% capture steps %}}

## Init Containerのステータスを確認する

Podのステータスを表示します:

```shell
kubectl get pod <pod-name>
```

たとえば、`Init：1/2`というステータスは、2つのInit Containerのうちの1つが正常に完了したことを示します。

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

ステータス値とその意味の例については、[Podのステータスを理解する](#understanding-pod-status)を参照してください。

## Init Containerの詳細を取得する

Init Containerの実行に関する詳細情報を表示します:

```shell
kubectl describe pod <pod-name>
```

たとえば、2つのInit Containerを持つPodでは、次のように表示されます:

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

また、Pod Specの`status.initContainerStatuses`フィールドを読むことでプログラムでInit Containerのステータスにアクセスすることもできます。:


```shell
kubectl get pod nginx --template '{{.status.initContainerStatuses}}'
```


このコマンドは生のJSONで上記と同じ情報を返します。

## Init Containerのログにアクセスする

ログにアクセスするには、Init Container名とPod名を渡します。

```shell
kubectl logs <pod-name> -c <init-container-2>
```

シェルスクリプトを実行するInit Containerは、実行時にコマンドを出力します。たとえば、スクリプトの始めに`set -x`を実行することでBashで同じことができます。

{{% /capture %}}

{{% capture discussion %}}

## Podのステータスを理解する

`Init：`で始まるPodステータスはInit Containerの実行ステータスを要約します。以下の表は、Init Containerのデバッグ中に表示される可能性のあるステータス値の例をいくつか示しています。

ステータス | 意味
------ | -------
`Init:N/M` | Podは`M`個のInit Containerを持ち、これまでに`N`個完了しました。
`Init:Error` | Init Containerが実行に失敗しました。
`Init:CrashLoopBackOff` | Init Containerが繰り返し失敗しました。
`Pending` | PodはまだInit Containerの実行を開始していません。
`PodInitializing` or `Running` | PodはすでにInit Containerの実行を終了しています。

{{% /capture %}}



