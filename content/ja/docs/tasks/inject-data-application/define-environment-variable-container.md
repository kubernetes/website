---
title: コンテナの環境変数の定義
content_type: task
weight: 20
---

<!-- overview -->

このページでは、Kubernetes Podでコンテナの環境変数を定義する方法を説明します。



## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## コンテナの環境変数を定義する {#define-an-environment-variable-for-a-container}

Podを作成するとき、そのPodで実行するコンテナに環境変数を設定することができます。環境変数を設定するには、設定ファイルに `env` または `envFrom` フィールドを含めます。

この演習では、1つのコンテナを実行するPodを作成します。Podの設定ファイルには、名前 `DEMO_GREETING`、値 `"Hello from the environment"`を持つ環境変数が定義されています。Podの設定マニフェストを以下に示します:

{{% codenew file="pods/inject/envars.yaml" %}}

1. マニフェストに基づいてPodを作成します:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

1. 実行中のPodを一覧表示します:

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    出力は以下のようになります:

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

1. Podで実行しているコンテナのシェルを取得します:

    ```shell
    kubectl exec -it envar-demo -- /bin/bash
    ```

1. シェルで`printenv`コマンドを実行すると、環境変数の一覧が表示されます。

    ```shell
    # コンテナ内のシェルで以下のコマンドを実行します
    printenv
    ```

    出力は以下のようになります:

    ```
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

1. シェルを終了するには、`exit`と入力します。

{{< note >}}
`env`または`envFrom`フィールドを使用して設定された環境変数は、コンテナイメージで指定された環境変数を上書きします。
{{< /note >}}

{{< note >}}
環境変数は相互に参照でき、循環して使用可能です。使用する前に順序に注意してください。
{{< /note >}}

## 設定の中で環境変数を使用する {#using-environment-variables-inside-of-your-config}

Podの設定で定義した環境変数は、Podのコンテナに設定したコマンドや引数など、設定の他の場所で使用することができます。以下の設定例では、環境変数`GREETING`、`HONORORIFIC`、`NAME`にそれぞれ `Warm greetings to`、`The Most Honorable`、`Kubernetes`を設定しています。これらの環境変数は、`env-print-demo`コンテナに渡されるCLI引数で使われます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    command: ["echo"]
    args: ["$(GREETING) $(HONORIFIC) $(NAME)"]
```

作成されると、コンテナ上で`echo Warm greetings to The Most Honorable Kubernetes`というコマンドが実行されます。


## {{% heading "whatsnext" %}}

* [環境変数](/ja/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)の詳細
* [Secretを環境変数として使用する](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables)詳細
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)をご覧ください。

