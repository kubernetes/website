---
title: Helmを使用したサービスカタログのインストール
content_type: task
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="サービスカタログは" >}}  

[Helm](https://helm.sh/)を使用してKubernetesクラスターにサービスカタログをインストールします。手順の最新情報は[kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog/blob/master/docs/install.md)リポジトリーを参照してください。




## {{% heading "prerequisites" %}}

* [サービスカタログ](/docs/concepts/extend-kubernetes/service-catalog/)の基本概念を理解してください。
* サービスカタログを使用するには、Kubernetesクラスターのバージョンが1.7以降である必要があります。
* KubernetesクラスターのクラスターDNSを有効化する必要があります。
  * クラウド上のKubernetesクラスター、または{{< glossary_tooltip text="Minikube" term_id="minikube" >}}を使用している場合、クラスターDNSはすでに有効化されています。
  * `hack/local-up-cluster.sh`を使用している場合は、環境変数`KUBE_ENABLE_CLUSTER_DNS`が設定されていることを確認し、インストールスクリプトを実行してください。
* [kubectlのインストールおよびセットアップ](/ja/docs/tasks/tools/install-kubectl/)を参考に、v1.7以降のkubectlをインストールし、設定を行ってください。
* v2.7.0以降の[Helm](https://helm.sh/)をインストールしてください。
  * [Helm install instructions](https://helm.sh/docs/intro/install/)を参考にしてください。
  * 上記のバージョンのHelmをすでにインストールしている場合は、`helm init`を実行し、HelmのサーバーサイドコンポーネントであるTillerをインストールしてください。




<!-- steps -->
## Helmリポジトリーにサービスカタログを追加

Helmをインストールし、以下のコマンドを実行することでローカルマシンに*service-catalog*のHelmリポジトリーを追加します。


```shell
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com
```

以下のコマンドを実行し、インストールに成功していることを確認します。

```shell
helm search service-catalog
```

インストールが成功していれば、出力は以下のようになります:

```
NAME                	CHART VERSION	APP VERSION	DESCRIPTION                                                 
svc-cat/catalog     	0.2.1        	           	service-catalog API server and controller-manager helm chart
svc-cat/catalog-v0.2	0.2.2        	           	service-catalog API server and controller-manager helm chart
```

## RBACの有効化

KubernetesクラスターのRBACを有効化することで、Tiller Podに`cluster-admin`アクセスを持たせます。

v0.25以前のMinikubeを使用している場合は、明示的にRBACを有効化して起動する必要があります:

```shell
minikube start --extra-config=apiserver.Authorization.Mode=RBAC
```

v0.26以降のMinikubeを使用している場合は、以下のコマンドを実行してください。

```shell
minikube start
```

v0.26以降のMinikubeを使用している場合、`--extra-config`を指定しないでください。
このフラグは--extra-config=apiserver.authorization-modeを指定するものに変更されており、現在MinikubeではデフォルトでRBACが有効化されています。
古いフラグを指定すると、スタートコマンドが応答しなくなることがあります。

`hack/local-up-cluster.sh`を使用している場合、環境変数`AUTHORIZATION_MODE`を以下の値に設定してください:

```
AUTHORIZATION_MODE=Node,RBAC hack/local-up-cluster.sh -O
```

`helm init`は、デフォルトで`kube-system`のnamespaceにTiller Podをインストールし、Tillerは`default`のServiceAccountを使用するように設定されています。

{{< note >}}
`helm init`を実行する際に`--tiller-namespace`または`--service-account`のフラグを使用する場合、以下のコマンドの`--serviceaccount`フラグには適切なnamespaceとServiceAccountを指定する必要があります。
{{< /note >}}

Tillerに`cluster-admin`アクセスを設定する場合:

```shell
kubectl create clusterrolebinding tiller-cluster-admin \
    --clusterrole=cluster-admin \
    --serviceaccount=kube-system:default
```


## Kubernetesクラスターにサービスカタログをインストール

以下のコマンドを使用して、Helmリポジトリーのrootからサービスカタログをインストールします:

{{< tabs name="helm-versions" >}} 
{{% tab name="Helm バージョン3" %}}
```shell
helm install catalog svc-cat/catalog --namespace catalog
```
{{% /tab %}}
{{% tab name="Helm バージョン2" %}}
```shell
helm install svc-cat/catalog --name catalog --namespace catalog
```
{{% /tab %}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers)
* [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog)


