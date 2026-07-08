---
title: イメージをプライベートレジストリから取得する
weight: 130
---

<!-- overview -->

このページでは、{{< glossary_tooltip text="Secret" term_id="secret" >}}を用いるPodを作成するためにイメージをプライベートコンテナイメージレジストリもしくはリポジトリから取得する方法について説明します。
多くのプライベートレジストリが存在しますが、このタスクでは[Docker Hub](https://www.docker.com/ja-jp/products/docker-hub/)をレジストリの一例として使用します。

{{% thirdparty-content single="true" %}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* この演習を行うためには、`docker`コマンドラインツールと自身の[Docker ID](https://docs.docker.com/accounts/create-account/)が必要です。
* 別のプライベートコンテナレジストリを使用している場合は、そのレジストリのコマンドラインツールとログイン情報が必要です。

<!-- steps -->

## Docker Hubにログインする

ラップトップ(ローカル環境)上では、プライベートイメージを取得するためにレジストリに認証する必要があります。

`docker`ツールを使用してDocker Hubにログインしてください。詳細は[Docker IDアカウント](https://docs.docker.com/accounts/create-account/#sign-in)の _Sign in_ セクションを参照してください。

```shell
docker login
```

プロンプトが表示されたら、Docker IDと使用したい認証情報(アクセストークンまたはDocker IDのパスワード)を入力してください。

ログインプロセスは、認証トークンを保持する`config.json`ファイルを作成または更新します。[Kubernetesがこのファイルを解釈する方法](/ja/docs/concepts/containers/images#config-json)を確認してください。

以下のように`config.json`ファイルを確認します:

```shell
cat ~/.docker/config.json
```

出力には以下のような部分が含まれています:

```json
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "c3R...zE2"
        }
    }
}
```

{{< note >}}
Dockerの認証情報ストアを使用している場合、`auth`エントリの代わりに、ストア名を値とする`credsStore`エントリが表示されます。
この場合、Secretを直接作成できます。
[コマンドライン上で認証情報を入力してSecretを作成する](#create-a-secret-by-providing-credentials-on-the-command-line)を参照してください。
{{< /note >}}

## 既存の認証情報を用いるSecretを作成する {#registry-secret-existing-credentials}

Kubernetesクラスターはプライベートイメージを取得するためのレジストリとの認証に`kubernetes.io/dockerconfigjson`タイプのSecretを使用します。

既に`docker login`を実行済みの場合、その認証情報をKubernetesにコピーできます:

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

新しいSecretをカスタマイズする必要がある場合(例えば、新しいSecretにNamespaceやLabelを設定する場合)は、保存する前にSecretをカスタマイズできます。
必ず以下を行ってください:

- `data`項目の名前を`.dockerconfigjson`に設定する
- Dockerの設定ファイルをbase64エンコードし、その文字列を分割せずに`data[".dockerconfigjson"]`の値として貼り付ける
- `type`を`kubernetes.io/dockerconfigjson`に設定する

Secretをカスタマイズする場合のマニフェストの例:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
  namespace: awesomeapps
data:
  .dockerconfigjson: UmVhbGx5IHJlYWxseSByZWVlZWVlZWVlZWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGx5eXl5eXl5eXl5eXl5eXl5eXl5eSBsbGxsbGxsbGxsbGxsbG9vb29vb29vb29vb29vb29vb29vb29vb29vb25ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubmdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cgYXV0aCBrZXlzCg==
type: kubernetes.io/dockerconfigjson
```

`error: no objects passed to create`をエラーメッセージとして受け取った場合、base64エンコードされた文字列が無効である可能性があります。
`Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`をエラーメッセージとして受け取った場合は、`data`内のbase64エンコードされた文字列は正常にデコードされたものの、`.docker/config.json`ファイルとして読み込むことができなかったことを意味します。

## コマンドライン上で認証情報を入力してSecretを作成する {#create-a-secret-by-providing-credentials-on-the-command-line}

このSecretを`regcred`という名前で作成します:

```shell
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

ここでは:

* `<your-registry-server>`は、プライベートDockerレジストリのFQDN(完全修飾ドメイン名)です。
  Docker Hubを使用する場合は、`https://index.docker.io/v1/`を設定して下さい。
* `<your-name>`は、Dockerのユーザー名です。
* `<your-pword>`は、Dockerのパスワードです。
* `<your-email>`は、Dockerのメールアドレスです。

Dockerレジストリの認証情報がSecretとして`regcred`という名前でクラスターに正常に設定されました。

{{< note >}}
コマンドラインで認証情報を入力すると、認証情報が保護されていない状態でシェルの履歴に保存される可能性があり、また`kubectl`実行中はPCの他のユーザーがそれらの認証情報を閲覧できる可能性があります。
{{< /note >}}

## `regcred`Secretを確認する

作成した`regcred`Secretの内容を理解するために、まずYAML形式でSecretを表示します:

```shell
kubectl get secret regcred --output=yaml
```

出力は以下のようになります:

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
  name: regcred
  ...
data:
  .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
type: kubernetes.io/dockerconfigjson
```

`.dockerconfigjson`フィールドの値は、Docker認証情報をbase64でエンコードしたものです。

`.dockerconfigjson`フィールドの内容を理解するために、認証情報のデータを読解可能な形式に変換します:

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

出力は以下のようになります:

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

`auth`フィールドの内容を理解するために、base64エンコードされたデータを読解可能な形式に変換します:

```shell
echo "c3R...zE2" | base64 --decode
```

出力はユーザー名とパスワードが`:`で連結された以下のような形式になります:

```none
janedoe:xxxxxxxxxxx
```

Secretの`data`には、ローカルの`~/.docker/config.json`ファイルと同様の認証トークンが含まれていることが分かります。

クラスターに`regcred`という名前のSecretとしてDockerの認証情報が正常に設定されました。

## 作成したSecretを利用するPodを作成する

以下は`regcred`という名前のDockerの認証情報へのアクセスが必要なPodのマニフェストの例です:

{{% code_sample file="pods/private-reg-pod.yaml" %}}

上記のファイルをあなたのコンピューターにダウンロードします:

```shell
curl -L -o my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

`my-private-reg-pod.yaml`ファイル内の`<your-private-image>`を、以下のようなプライベートレジストリのイメージのパスに置き換えてください:

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

プライベートレジストリからイメージを取得するために、Kubernetesは認証情報を必要とします。
設定ファイル内の`imagePullSecrets`フィールドは、Kubernetesが`regcred`という名前のSecretから認証情報を取得することを指定します。

以下のようにして作成したSecretを使用するPodを作成し、Podが実行されていることを確認します:

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

{{< note >}}
イメージプルシークレットをPod(またはDeployment、あるいはPodテンプレートを使用するその他のオブジェクト)で使用するには、適切なSecretが正しいNamespaceに存在することを確認する必要があります。
使用するNamespaceは、Podを定義したNamespaceと同一である必要があります。
{{< /note >}}

また、Podのステータスが`ImagePullBackOff`になり起動に失敗した場合は、Podのイベントを確認してください:

```shell
kubectl describe pod private-reg
```

もし`FailedToRetrieveImagePullSecret`という理由を持つイベントが表示された場合は、Kubernetesが指定された名前のSecret(この例では`regcred`)を見つけることができないことを示します。

指定したSecretが存在し、その名前が正しく記載されていることを確認してください。
```shell
Events:
  ...  Reason                           ...  Message
       ------                                -------
  ...  FailedToRetrieveImagePullSecret  ...  Unable to retrieve some image pull secrets (<regcred>); attempting to pull the image may not succeed.
```

## 複数のレジストリ上のイメージを利用する

1つのPodは複数のコンテナを持つことができ、各コンテナのイメージは異なるレジストリから取得できます。
1つのPodで複数の`imagePullSecrets`を使用でき、それぞれに複数の認証情報を含めることができます。

レジストリに一致する各認証情報を使用してイメージの取得が試行されます。
レジストリに一致する認証情報がない場合、認証なしで、またはカスタムランタイム固有の設定を使用してイメージの取得が試行されます。

## {{% heading "whatsnext" %}}

* [Secret](/ja/docs/concepts/configuration/secret/)についてさらに学ぶ。
  * または{{< api-reference page="config-and-storage-resources/secret-v1" >}}でAPIリファレンスを読む。
* [プライベートレジストリを使用する方法](/ja/docs/concepts/containers/images/#プライベートレジストリを使用する方法)についてさらに学ぶ。
* [イメージプルシークレットをサービスアカウントへ追加する](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)についてさらに学ぶ。
* [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-)を参照する。
* Podの[コンテナの定義](/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers)内の`imagePullSecrets`フィールドを参照する。
