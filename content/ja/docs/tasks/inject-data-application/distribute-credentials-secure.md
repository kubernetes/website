---
title: Secretsで安全にクレデンシャルを配布する
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->
このページでは、パスワードや暗号化キーなどの機密データをPodに安全に注入する方法を紹介します。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

### 機密データをbase64でエンコードする

ユーザー名`my-app`とパスワード`39528$vdg7Jb`の2つの機密データが必要だとします。
まず、base64エンコーディングツールを使って、ユーザ名とパスワードをbase64表現に変換します。
ここでは、手軽に入手できるbase64プログラムを使った例を紹介します:

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

出力結果によると、ユーザ名のbase64表現は`bXktYXBw`で、パスワードのbase64表現は`Mzk1MjgkdmRnN0pi`です。

{{< caution >}}
OSから信頼されているローカルツールを使用することで、外部ツールのセキュリティリスクを低減することができます。
{{< /caution >}}


<!-- steps -->

## Secretを作成する

以下はユーザー名とパスワードを保持するSecretを作成するために使用できる設定ファイルです:

{{% codenew file="pods/inject/secret.yaml" %}}

1. Secret を作成する

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
    ```

1. Secretの情報を取得する

    ```shell
    kubectl get secret test-secret
    ```

    出力:

    ```
    NAME          TYPE      DATA      AGE
    test-secret   Opaque    2         1m
    ```

1. Secretの詳細な情報を取得する:

    ```shell
    kubectl describe secret test-secret
    ```

    出力:

    ```
    Name:       test-secret
    Namespace:  default
    Labels:     <none>
    Annotations:    <none>

    Type:   Opaque

    Data
    ====
    password:   13 bytes
    username:   7 bytes
    ```

### kubectlでSecretを作成する

base64エンコードの手順を省略したい場合は、`kubectl create secret`コマンドで同じSecretを作成することができます。

例えば:

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

先ほどの詳細なアプローチでは 各ステップを明示的に実行し、何が起こっているかを示していますが、`kubectl create secret`の方が便利です。


## Volumeにある機密情報をアクセスするPodを作成する

これはPodの作成に使用できる設定ファイルです。

{{% codenew file="pods/inject/secret-pod.yaml" %}}

1. Podを作成する:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. Podの`STATUS`が`Running`であるのを確認する:

   ```shell
   kubectl get pod secret-test-pod
   ```

    出力:
   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. Podの中にあるコンテナにシェルを実行する

   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. 機密データは `/etc/secret-volume` にマウントされたボリュームを介してコンテナに公開されます。

   ディレクトリ `/etc/secret-volume` 中のファイルの一覧を確認する:
   ```shell
   # Run this in the shell inside the container
   ls /etc/secret-volume
   ```
   `password`と`username` ２つのファイル名が出力される:
   ```
   password username
   ```

1.  `username` と `password` ファイルの中身を表示する:

   ```shell
   # Run this in the shell inside the container
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"

   ```
   出力:
   ```
   my-app
   39528$vdg7Jb
   ```

## Secretでコンテナの環境変数を定義する

### 単一のSecretでコンテナの環境変数を定義する

*  Secretの中でkey-valueペアで環境変数を定義する:

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   ```

*  Secretで定義された`backend-username`の値をPodの環境変数`SECRET_USERNAME`に割り当てます。

   {{% codenew file="pods/inject/pod-single-secret-env-variable.yaml" %}}

*  Podを作成する:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
   ```

*  コンテナの環境変数`SECRET_USERNAME`の中身を表示する:

   ```shell
   kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
   ```

   出力:
   ```
   backend-admin
   ```

### 複数のSecretからコンテナの環境変数を定義する

*  前述の例と同様に、まずSecretを作成します:

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   kubectl create secret generic db-user --from-literal=db-username='db-admin'
   ```

*  Podの中で環境変数を定義する:

   {{% codenew file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

*  Podを作成する:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
   ```

*  コンテナの環境変数を表示する:

   ```shell
   kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
   ```
   出力:
   ```
   DB_USERNAME=db-admin
   BACKEND_USERNAME=backend-admin
   ```


## Secretのすべてのkey-valueペアを環境変数として設定する

{{< note >}}
この機能は Kubernetes v1.6 以降から利用可能
{{< /note >}}

*  複数のkey-valueペアを含むSecretを作成する

   ```shell
   kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
   ```

*  envFromを使用してSecretのすべてのデータをコンテナの環境変数として定義します。SecretのキーがPodの環境変数名になります。

    {{% codenew file="pods/inject/pod-secret-envFrom.yaml" %}}

*  Podを作成する:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
   ```

* `username`と`password`コンテナの環境変数を表示する

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  出力:
  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

### 参考文献

* [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

* [Secrets](/docs/concepts/configuration/secret/)についてもっと知る。
* [Volumes](/docs/concepts/storage/volumes/)について知る。
