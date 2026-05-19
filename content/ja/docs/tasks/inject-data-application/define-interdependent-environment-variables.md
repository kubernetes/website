---
title: 依存関係のある環境変数の定義
content_type: task
weight: 20
---

<!-- overview -->

このページでは、KubernetesのPod内のコンテナに対して、依存関係のある環境変数を定義する方法について説明します。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## コンテナに依存関係のある環境変数を定義する

Podを作成する際に、そのPod内で実行されるコンテナに対して依存関係のある環境変数を設定できます。
依存関係のある環境変数を設定するには、設定ファイル内の`env`の`value`に$(VAR_NAME)を使用します。

このチュートリアルでは、1つのコンテナを実行するPodを作成します。
このPodの設定ファイルでは、一般的な使い方に基づいて依存関係のある環境変数が定義されています。
以下がPodの設定マニフェストです。

{{% code_sample file="pods/inject/dependent-envars.yaml" %}}

1. このマニフェストに基づいてPodを作成します:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
   ```
   ```
   pod/dependent-envars-demo created
   ```

2. 実行中のPodを一覧表示します:

   ```shell
   kubectl get pods dependent-envars-demo
   ```
   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   dependent-envars-demo     1/1       Running   0          9s
   ```

3. Pod内で実行中のコンテナのログを確認します:

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```
   ```

   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

上記のとおり、`SERVICE_ADDRESS`には正しい依存関係の参照を定義しており、`UNCHANGED_REFERENCE`には誤った依存関係の参照が、`ESCAPED_REFERENCE`には依存関係の参照をスキップする表現が使われています。

参照される環境変数がすでに定義されている場合、その参照は正しく解決されます。
たとえば、`SERVICE_ADDRESS`の場合がそれに該当します。

`env`リスト内の順序が重要であることに注意してください。
環境変数は、リスト内で後に記述されているだけでは「定義済み」と見なされません。
このため、上記の例では`UNCHANGED_REFERENCE`が`$(PROTOCOL)`を解決できません。

環境変数が未定義であるか、いくつかの変数しか含まれていない場合、その未定義の環境変数は`UNCHANGED_REFERENCE`のように通常の文字列として扱われます。
一般に、誤って解釈された環境変数があっても、コンテナの起動が妨げられることはないことに注意してください。

`$(VAR_NAME)`構文は、`$`を2つ重ねて`$$(VAR_NAME)`のように記述することでエスケープできます。
エスケープされた参照は、参照される変数が定義されているかどうかに関係なく展開されることはありません。
これは、上記の`ESCAPED_REFERENCE`の例からも確認できます。

## {{% heading "whatsnext" %}}

* [環境変数](/ja/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)についてさらに詳しく学びましょう。
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)をご覧ください。
