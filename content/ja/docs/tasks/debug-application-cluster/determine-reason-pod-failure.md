---
title: Pod障害の原因を特定する
content_template: templates/task
---

{{% capture overview %}}

このページでは、コンテナ終了メッセージの読み書き方法を説明します。

終了メッセージは、致命的なイベントに関する情報を、ダッシュボードや監視ソフトウェアなどのツールで簡単に取得して表示できる場所にコンテナが書き込むための手段を提供します。 ほとんどの場合、終了メッセージに入力した情報も一般的な[Kubernetesログ](/docs/concepts/cluster-administration/logging/)に書き込まれるはずです。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## 終了メッセージの書き込みと読み取り

この課題では、1つのコンテナを実行するPodを作成します。
設定ファイルには、コンテナの開始時に実行されるコマンドを指定します。

{{< codenew file="debug/termination.yaml" >}}

1. YAML設定ファイルに基づいてPodを作成します:

        kubectl apply -f https://k8s.io/examples/debug/termination.yaml

    YAMLファイルの`cmd`フィールドと`args`フィールドで、コンテナが10秒間スリープしてから`/dev/termination-log`ファイルに「Sleep expired」と書いているのがわかります。コンテナが「Sleep expired」メッセージを書き込んだ後、コンテナは終了します。

1. Podに関する情報を表示します:

        kubectl get pod termination-demo

    Podが実行されなくなるまで、上記のコマンドを繰り返します。

1. Podに関する詳細情報を表示します:

        kubectl get pod termination-demo --output=yaml

    出力には「Sleep expired」メッセージが含まれています:

        apiVersion: v1
        kind: Pod
        ...
            lastState:
              terminated:
                containerID: ...
                exitCode: 0
                finishedAt: ...
                message: |
                  Sleep expired
                ...

1. Goテンプレートを使用して、終了メッセージのみが含まれるように出力をフィルタリングします:

        kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"

## 終了メッセージのカスタマイズ

Kubernetesは、コンテナの`terminationMessagePath`フィールドで指定されている終了メッセージファイルから終了メッセージを取得します。デフォルト値は`/dev/termination-log`です。このフィールドをカスタマイズすることで、Kubernetesに別のファイルを使うように指示できます。Kubernetesは指定されたファイルの内容を使用して、成功と失敗の両方についてコンテナのステータスメッセージを入力します。

次の例では、コンテナはKubernetesが取得するために終了メッセージを`/tmp/my-log`に書き込みます:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: msg-path-demo
spec:
  containers:
  - name: msg-path-demo-container
    image: debian
    terminationMessagePath: "/tmp/my-log"
```

さらに、ユーザーは追加のカスタマイズをするためにContainerの`terminationMessagePolicy`フィールドを設定できます。このフィールドのデフォルト値は`File`です。これは、終了メッセージが終了メッセージファイルからのみ取得されることを意味します。`terminationMessagePolicy`を`FallbackToLogsOnError`に設定することで、終了メッセージファイルが空でコンテナがエラーで終了した場合に、コンテナログ出力の最後のチャンクを使用するようにKubernetesに指示できます。ログ出力は、2048バイトまたは80行のどちらか小さい方に制限されています。

{{% /capture %}}

{{% capture whatsnext %}}

* [コンテナ](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)の`terminationMessagePath`フィールド参照
* [ログ取得](/docs/concepts/cluster-administration/logging/)について
* [Goテンプレート](https://golang.org/pkg/text/template/)について

{{% /capture %}}



