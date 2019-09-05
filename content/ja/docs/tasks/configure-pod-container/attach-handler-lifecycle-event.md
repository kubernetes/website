---
title: コンテナライフサイクルイベントへのハンドラー紐付け
content_template: templates/task
weight: 140
---

{{% capture overview %}}

このページでは、コンテナのライフサイクルイベントにハンドラーを紐付けする方法を説明します。KubernetesはpostStartとpreStopイベントをサポートしています。Kubernetesはコンテナの起動直後にpostStartイベントを送信し、コンテナの終了直前にpreStopイベントを送信します。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## postStartハンドラーとpreStopハンドラーを定義する

この課題では、1つのコンテナを持つPodを作成します。コンテナには、postStartイベントとpreStopイベントのハンドラーがあります。

これがPodの設定ファイルです:

{{< codenew file="pods/lifecycle-events.yaml" >}}

設定ファイルでは、postStartコマンドが`message`ファイルをコンテナの`/usr/share`ディレクトリに書き込むことがわかります。preStopコマンドはnginxを適切にシャットダウンします。これは、障害のためにコンテナが終了している場合に役立ちます。

Podを作成します:

    kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml

Pod内のコンテナが実行されていることを確認します:

    kubectl get pod lifecycle-demo

Pod内で実行されているコンテナでシェルを実行します:

    kubectl exec -it lifecycle-demo -- /bin/bash

シェルで、`postStart`ハンドラーが`message`ファイルを作成したことを確認します:

    root@lifecycle-demo:/# cat /usr/share/message

出力は、postStartハンドラーによって書き込まれたテキストを示しています。

    Hello from the postStart handler

{{% /capture %}}



{{% capture discussion %}}

## 議論

コンテナが作成された直後にKubernetesはpostStartイベントを送信します。
ただし、コンテナのエントリーポイントが呼び出される前にpostStartハンドラーが呼び出されるという保証はありません。postStartハンドラーはコンテナのコードに対して非同期的に実行されますが、postStartハンドラーが完了するまでコンテナのKubernetesによる管理はブロックされます。postStartハンドラーが完了するまで、コンテナのステータスはRUNNINGに設定されません。

Kubernetesはコンテナが終了する直前にpreStopイベントを送信します。
コンテナのKubernetesによる管理は、Podの猶予期間が終了しない限り、preStopハンドラーが完了するまでブロックされます。詳細は[Podの終了](/docs/user-guide/pods/#termination-of-pods)を参照してください。

{{< note >}}
Kubernetesは、Podが *終了* したときにのみpreStopイベントを送信します。
これは、Podが *完了* したときにpreStopフックが呼び出されないことを意味します。
この制限は[issue #55087](https://github.com/kubernetes/kubernetes/issues/55807)で追跡されています。
{{< /note >}}

{{% /capture %}}


{{% capture whatsnext %}}

* [コンテナライフサイクルフック](/docs/concepts/containers/container-lifecycle-hooks/)の詳細
* [Podのライフサイクル](/docs/concepts/workloads/pods/pod-lifecycle/)の詳細


### 参照

* [ライフサイクル](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [コンテナ](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)の`terminationGracePeriodSeconds`

{{% /capture %}}


