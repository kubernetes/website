---
title: Kubernetes APIを使用してクラスターにアクセスする
content_type: task
weight: 60
---

<!-- overview -->
このページでは、Kubernetes APIを使用してクラスターにアクセスする方法を説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Kubernetes APIへのアクセス {#accessing-the-kubernetes-api}

### kubectlを使用した初回アクセス {#accessing-for-the-first-time-with-kubectl}

Kubernetes APIに初めてアクセスする際は、Kubernetesコマンドラインツールの`kubectl`を使用します。

クラスターにアクセスするには、クラスターのロケーションを知り、アクセス用の認証情報が必要です。
通常、これは[はじめに](/docs/setup/)を進めていく中で自動的に設定されるか、他の誰かがクラスターをセットアップしてあなたに認証情報とロケーションを提供してくれます。

このコマンドで、kubectlが認識しているロケーションと認証情報を確認できます:

```shell
kubectl config view
```

多くの[例](https://github.com/kubernetes/examples/tree/master/)でkubectlの使用方法について紹介しています。
完全なドキュメントは[kubectlマニュアル](/docs/reference/kubectl/)にあります。

### REST APIへの直接アクセス {#directly-accessing-the-rest-api}

kubectlはAPIサーバーの特定と認証を扱います。
`curl`や`wget`などのHTTPクライアント、またはブラウザでREST APIに直接アクセスしたい場合は、APIサーバーを特定して認証する方法がいくつかあります:

1. kubectlをプロキシモードで実行する(推奨)。
この方法は、保存されたAPIサーバーのロケーションを使用し、自己署名証明書を使用してAPIサーバーを検証するため、推奨されます。
この方法では中間者攻撃(MITM)は不可能です。
1. あるいは、ロケーションと認証情報をHTTPクライアントに直接提供することもできます。
これはプロキシに混乱するクライアントコードで機能します。
中間者攻撃から保護するには、ブラウザにルート証明書をインポートする必要があります。

GoまたはPythonのクライアントライブラリを使用すると、プロキシモードでkubectlにアクセスできます。

#### kubectl proxyの使用 {#using-kubectl-proxy}

次のコマンドは、kubectlをリバースプロキシとして動作するモードで実行します。
APIサーバーの特定と認証を扱います。

次のように実行します:

```shell
kubectl proxy --port=8080 &
```

詳細については、[kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy)を参照してください。

その後、curl、wget、またはブラウザでAPIを探索できます。次のように:

```shell
curl http://localhost:8080/api/
```

出力は次のとおりです:

```json
{
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

#### kubectl proxyを使用しない {#without-kubectl-proxy}

認証トークンをAPIサーバーに直接渡すことで、kubectl proxyの使用を避けることが可能です。
次のように:

`grep/cut`アプローチを使用:

```shell

# .KUBECONFIGが複数コンテキストを含む可能性があるため、接続可能なすべてのクラスターをチェックする
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# 上記出力結果から接続したいクラスター名を選択する:
export CLUSTER_NAME="some_server_name"

# クラスター名を参照してAPIサーバーを指定する
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# デフォルトのService Accountのトークンを保持するSecretを作成する
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF

# トークンコントローラーがSecretを追加するまで待つ:
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done

# トークンの値を取得する
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

# TOKENを利用してAPIを調査する
curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

出力結果は次のとおりです:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

上記の例では`--insecure`フラグを使用しています。
これは、MITM攻撃を受ける可能性があります。
kubectlがクラスターにアクセスする際は、保存されたルート証明書とクライアント証明書を使用してサーバーにアクセスします(これらは`~/.kube`ディレクトリにインストールされています)。
クラスター証明書は通常自己署名されているため、HTTPクライアントにルート証明書を使用させるには特別な設定が必要な場合があります。

一部のクラスターでは、APIサーバーは認証を必要としません。
localhostで提供される場合や、ファイアウォールで保護されている場合などです。
このように、認証を必要としない構成を行うための標準的な方法はありません。
[Kubernetes APIへのアクセスコントロール](/docs/concepts/security/controlling-access)では、クラスター管理者としてこれを設定する方法を説明しています。

### APIへのプログラムによるアクセス {#programmatic-access-to-the-api}

Kubernetesは、公式に[Go](#go-client)、[Python](#python-client)、[Java](#java-client)、[dotnet](#dotnet-client)、[JavaScript](#javascript-client)、[Haskell](#haskell-client)のクライアントライブラリをサポートしています。
Kubernetesチームではなく、それぞれのライブラリの作成者によって提供および保守されている他のクライアントライブラリもあります。
他の言語からAPIにアクセスする方法と認証方法については、[クライアントライブラリ](/docs/reference/using-api/client-libraries/)を参照してください。

#### Goクライアント {#go-client}

* ライブラリを取得するには、次のコマンドを実行します: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`。
  サポートされているバージョンについては、[https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases)を参照してください。
* client-goクライアントを用いて、アプリケーションを記述します。

{{< note >}}

`client-go`は独自のAPIオブジェクトを定義しているため、必要に応じて、メインリポジトリではなくclient-goからAPI定義をインポートしてください。
例えば、`import "k8s.io/client-go/kubernetes"`が正しいです。

{{< /note >}}

Goクライアントは、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーを特定し、認証できます。
この[例](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)を参照してください:

```golang
package main

import (
  "context"
  "fmt"
  "k8s.io/apimachinery/pkg/apis/meta/v1"
  "k8s.io/client-go/kubernetes"
  "k8s.io/client-go/tools/clientcmd"
)

func main() {
  // kubeconfigのcurrent contextを使用する
  // path-to-kubeconfig -- 例として /root/.kube/config
  config, _ := clientcmd.BuildConfigFromFlags("", "<path-to-kubeconfig>")
  // creates the clientset
  clientset, _ := kubernetes.NewForConfig(config)
  // Podを一覧するためにAPIにアクセスする
  pods, _ := clientset.CoreV1().Pods("").List(context.TODO(), v1.ListOptions{})
  fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
}
```

もしアプリケーションがクラスター内のPodとしてデプロイされているのであれば、[Pod内からAPIにアクセスする](/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod)を参照してください。

#### Pythonクライアント {#python-client}

[Pythonクライアント](https://github.com/kubernetes-client/python)を使用するには、次のコマンドを実行します: 
`pip install kubernetes`。
その他のインストールオプションについては、[Pythonクライアントライブラリページ](https://github.com/kubernetes-client/python)を参照してください。

Pythonクライアントは、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーを特定し、認証できます。
この[例](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py)を参照してください:

```python
from kubernetes import client, config

config.load_kube_config()

v1=client.CoreV1Api()
print("Listing pods with their IPs:")
ret = v1.list_pod_for_all_namespaces(watch=False)
for i in ret.items:
    print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
```

#### Javaクライアント {#java-client}

[Javaクライアント](https://github.com/kubernetes-client/java)をインストールするには、次を実行します:

```shell
# Clone java library
git clone --recursive https://github.com/kubernetes-client/java

# Installing project artifacts, POM etc:
cd java
mvn install
```

サポートされているバージョンについては、[https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases)を参照してください。

Javaクライアントは、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーを特定し、認証できます。
この[例](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-15/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java)を参照してください:

```java
package io.kubernetes.client.examples;

import io.kubernetes.client.ApiClient;
import io.kubernetes.client.ApiException;
import io.kubernetes.client.Configuration;
import io.kubernetes.client.apis.CoreV1Api;
import io.kubernetes.client.models.V1Pod;
import io.kubernetes.client.models.V1PodList;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import java.io.FileReader;
import java.io.IOException;

/**
 * Kubernetesクラスター外のアプリケーションからJava APIを利用する簡単な例
 *
 * <p>最も簡単に実行する方法: mvn exec:java
 * -Dexec.mainClass="io.kubernetes.client.examples.KubeConfigFileClientExample"
 *
 */
public class KubeConfigFileClientExample {
  public static void main(String[] args) throws IOException, ApiException {

    // KubeConfigへのファイルパス
    String kubeConfigPath = "~/.kube/config";

    // クラスター外の設定（ファイルシステム上のkubeconfig）を読み込む
    ApiClient client =
        ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();

    // 上記のクラスター内api-clientをグローバル標準api-clientに設定する
    Configuration.setDefaultApiClient(client);

    // the CoreV1Api loads default api-client from global configuration.
    // CoreV1Apiはグローバル設定から標準のapi-clientを読み込む
    CoreV1Api api = new CoreV1Api();

    // CoreV1Api clientを呼び出す
    V1PodList list = api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
    System.out.println("Listing all pods: ");
    for (V1Pod item : list.getItems()) {
      System.out.println(item.getMetadata().getName());
    }
  }
}
```

#### dotnetクライアント {#dotnet-client}

[dotnetクライアント](https://github.com/kubernetes-client/csharp)を使用するには、次のコマンドを実行します: `dotnet add package KubernetesClient --version 1.6.1`。
その他のインストールオプションについては、[dotnetクライアントライブラリページ](https://github.com/kubernetes-client/csharp)を参照してください。
サポートされているバージョンについては、[https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases)を参照してください。

dotnetクライアントは、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーを特定し、認証できます。
この[例](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs)を参照してください:

```csharp
using System;
using k8s;

namespace simple
{
    internal class PodList
    {
        private static void Main(string[] args)
        {
            var config = KubernetesClientConfiguration.BuildDefaultConfig();
            IKubernetes client = new Kubernetes(config);
            Console.WriteLine("Starting Request!");

            var list = client.ListNamespacedPod("default");
            foreach (var item in list.Items)
            {
                Console.WriteLine(item.Metadata.Name);
            }
            if (list.Items.Count == 0)
            {
                Console.WriteLine("Empty!");
            }
        }
    }
}
```

#### JavaScriptクライアント {#javascript-client}

[JavaScriptクライアント](https://github.com/kubernetes-client/javascript)をインストールするには、次のコマンドを実行します: `npm install @kubernetes/client-node`。
サポートされているバージョンについては、[https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases)を参照してください。

JavaScriptクライアントは、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーを特定し、認証できます。
この[例](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js)を参照してください:

```javascript
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

k8sApi.listNamespacedPod({ namespace: 'default' }).then((res) => {
    console.log(res);
});
```

#### Haskellクライアント {#haskell-client}

サポートされているバージョンについては、[https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases)を参照してください。

[Haskellクライアント](https://github.com/kubernetes-client/haskell)は、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーを特定し、認証できます。
この[例](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs)を参照してください:

```haskell
exampleWithKubeConfig :: IO ()
exampleWithKubeConfig = do
    oidcCache <- atomically $ newTVar $ Map.fromList []
    (mgr, kcfg) <- mkKubeClientConfig oidcCache $ KubeConfigFile "/path/to/kubeconfig"
    dispatchMime
            mgr
            kcfg
            (CoreV1.listPodForAllNamespaces (Accept MimeJSON))
        >>= print
```

## {{% heading "whatsnext" %}}

* [PodからKubernetes APIにアクセスする](/docs/tasks/run-application/access-api-from-pod/)
