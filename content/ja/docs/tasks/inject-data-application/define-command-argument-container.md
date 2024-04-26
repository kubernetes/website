---
title: コンテナにコマンドと引数を定義する
content_type: task
weight: 10
---

<!-- overview -->

このページでは、{{< glossary_tooltip term_id="pod" >}}でコンテナを実行するときにコマンドと引数を定義する方法を説明します。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Podの作成時にコマンドと引数を定義する

Podを作成するときに、Pod内で実行するコンテナのコマンドと引数を定義できます。コマンドを定義するには、設定ファイルに`command`フィールドを記述します。コマンドの引数を定義するには、設定ファイルに`args`フィールドを記述します。定義したコマンドと引数はPodの作成後に変更することはできません。

設定ファイルで定義したコマンドと引数は、コンテナイメージが提供するデフォルトのコマンドと引数を上書きします。引数を定義し、コマンドを定義しなかった場合、デフォルトのコマンドと新しい引数が使用されます。

{{< note >}}
`command`フィールドは、いくつかのコンテナランタイムではエントリポイントに相当します。
{{< /note >}}

この演習では、1つのコンテナを実行するPodを作成します。Podの設定ファイルには、コマンドと2つの引数を定義します。

{{% code_sample file="pods/commands.yaml" %}}

1. YAMLの設定ファイルに基づいてPodを作成

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/commands.yaml
   ```

1. 実行中のPodをリストアップ

   ```shell
   kubectl get pods
   ```

   出力は、command-demo Podで実行されたコンテナが完了したことを示します。

1. コンテナ内で実行されたコマンドの出力を確認するためにPodのログを見る

   ```shell
   kubectl logs command-demo
   ```

   出力は、HOSTNAMEとKUBERNETES_PORT環境変数の値を示します。

   ```text
   command-demo
   tcp://10.3.240.1:443
   ```

## 環境変数を使って引数を定義する

前述の例では、文字列を指定して引数を直接定義しました。文字列を直接指定する代わりに、環境変数を使用して引数を定義することもできます。


```yaml
env:
- name: MESSAGE
  value: "hello world"
command: ["/bin/echo"]
args: ["$(MESSAGE)"]
```

つまり、[ConfigMap](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)や[Secret](/ja/docs/concepts/configuration/secret/)など、環境変数を定義するために利用可能な技術のどれを使っても、Podの引数を定義できるということです。

{{< note >}}
環境変数は`"$(VAR)"`という括弧で囲まれて表示されます。これは、`command`や`args`フィールドで変数を展開するために必要です。
{{< /note >}}

## シェルでコマンドを実行する

シェルでコマンドを実行する必要がある場合もあります。例えば、コマンドが複数のコマンドをパイプでつないだものであったり、シェルスクリプトであったりします。コマンドをシェルで実行するには、次のように記述します。

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

## {{% heading "whatsnext" %}}

* [Podとコンテナの設定](/ja/docs/tasks/)についてもっとよく知る
* [コンテナ内でのコマンド実行](/ja/docs/tasks/debug/debug-application/get-shell-running-container/)についてもっとよく知る
* [コンテナのAPI](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)を確認する
