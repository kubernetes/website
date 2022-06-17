---
title: 使用 Kubernetes API 訪問叢集
content_type: task
---
<!--
title: Access Clusters Using the Kubernetes API
content_type: task
-->

<!-- overview -->

<!--
This page shows how to access clusters using the Kubernetes API.
-->
本頁展示瞭如何使用 Kubernetes API 訪問叢集

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Accessing the cluster API

### Accessing for the first time with kubectl
-->
## 訪問叢集 API

### 使用 kubectl 進行首次訪問

<!--
When accessing the Kubernetes API for the first time, use the
Kubernetes command-line tool, `kubectl`.
-->
首次訪問 Kubernetes API 時，請使用 Kubernetes 命令列工具 `kubectl` 。

<!--
To access a cluster, you need to know the location of the cluster and have credentials
to access it. Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/setup/),
or someone else setup the cluster and provided you with credentials and a location.
-->
要訪問叢集，你需要知道叢集位置並擁有訪問它的憑證。
通常，當你完成[入門指南](/zh-cn/docs/setup/)時，這會自動設定完成，或者由其他人設定好叢集並將憑證和位置提供給你。

<!--
Check the location and credentials that kubectl knows about with this command:
-->
使用此命令檢查 kubectl 已知的位置和憑證：

```shell
kubectl config view
```

<!--
Many of the [examples](https://github.com/kubernetes/examples/tree/master/) provide an introduction to using
kubectl. Complete documentation is found in the [kubectl manual](/docs/reference/kubectl/).
-->

許多[樣例](https://github.com/kubernetes/examples/tree/master/)
提供了使用 kubectl 的介紹。完整文件請見 [kubectl 手冊](/zh-cn/docs/reference/kubectl/)。

<!--
### Directly accessing the REST API

kubectl handles locating and authenticating to the API server. If you want to directly access the REST API with an http client like
`curl` or `wget`, or a browser, there are multiple ways you can locate and authenticate against the API server:
-->
### 直接訪問 REST API

kubectl 處理對 API 伺服器的定位和身份驗證。如果你想透過 http 客戶端（如 `curl` 或 `wget`，或瀏覽器）直接訪問 REST API，你可以透過多種方式對 API 伺服器進行定位和身份驗證：

 <!--
1. Run kubectl in proxy mode (recommended). This method is recommended, since it uses the stored apiserver location and verifies the identity of the API server using a self-signed cert. No man-in-the-middle (MITM) attack is possible using this method.
 1. Alternatively, you can provide the location and credentials directly to the http client. This works with client code that is confused by proxies. To protect against man in the middle attacks, you'll need to import a root cert into your browser.
-->
1. 以代理模式執行 kubectl（推薦）。
   推薦使用此方法，因為它用儲存的 apiserver 位置並使用自簽名證書驗證 API 伺服器的標識。
   使用這種方法無法進行中間人（MITM）攻擊。
2. 另外，你可以直接為 HTTP 客戶端提供位置和身份認證。
   這適用於被代理混淆的客戶端程式碼。
   為防止中間人攻擊，你需要將根證書匯入瀏覽器。

<!--
Using the Go or Python client libraries provides accessing kubectl in proxy mode.
-->
使用 Go 或 Python 客戶端庫可以在代理模式下訪問 kubectl。

<!--
#### Using kubectl proxy

The following command runs kubectl in a mode where it acts as a reverse proxy. It handles
locating the API server and authenticating.
-->
#### 使用 kubectl 代理

下列命令使 kubectl 執行在反向代理模式下。它處理 API 伺服器的定位和身份認證。

<!-- Run it like this: -->
像這樣執行它：

```shell
kubectl proxy --port=8080 &
```

<!--
See [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) for more details.
-->
參見 [kubectl 代理](/docs/reference/generated/kubectl/kubectl-commands/#proxy) 獲取更多細節。

<!--
Then you can explore the API with curl, wget, or a browser, like so:
-->
然後你可以透過 curl，wget，或瀏覽器瀏覽 API，像這樣：

```shell
curl http://localhost:8080/api/
```

<!-- The output is similar to this: -->
輸出類似如下：

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

<!--
#### Without kubectl proxy

It is possible to avoid using kubectl proxy by passing an authentication token
directly to the API server, like this:

Using `grep/cut` approach:
-->
#### 不使用 kubectl 代理

透過將身份認證令牌直接傳給 API 伺服器，可以避免使用 kubectl 代理，像這樣：

使用 `grep/cut` 方式：

```shell
# 檢視所有的叢集，因為你的 .kubeconfig 檔案中可能包含多個上下文
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# 從上述命令輸出中選擇你要與之互動的叢集的名稱
export CLUSTER_NAME="some_server_name"

# 指向引用該叢集名稱的 API 伺服器
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# 建立一個 secret 來儲存預設服務賬戶的令牌
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF

# 等待令牌控制器使用令牌填充 secret:
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done

# 獲取令牌
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

# 使用令牌玩轉 API
curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

<!-- The output is similar to this: -->
輸出類似如下：

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

<!--
The above example uses the `--insecure` flag. This leaves it subject to MITM
attacks. When kubectl accesses the cluster it uses a stored root certificate
and client certificates to access the server. (These are installed in the
`~/.kube` directory). Since cluster certificates are typically self-signed, it
may take special configuration to get your http client to use root
certificate.
-->
上面例子使用了 `--insecure` 標誌位。這使它易受到 MITM 攻擊。
當 kubectl 訪問叢集時，它使用儲存的根證書和客戶端證書訪問伺服器。
（已安裝在 `~/.kube` 目錄下）。
由於叢集認證通常是自簽名的，因此可能需要特殊設定才能讓你的 http 客戶端使用根證書。

<!--
On some clusters, the API server does not require authentication; it may serve
on localhost, or be protected by a firewall. There is not a standard
for this. [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access)
describes how you can configure this as a cluster administrator.
-->
在一些叢集中，API 伺服器不需要身份認證；它執行在本地，或由防火牆保護著。
對此並沒有一個標準。
[配置對 API 的訪問](/zh-cn/docs/concepts/security/controlling-access/)
講解了作為叢集管理員可如何對此進行配置。

<!--
### Programmatic access to the API

Kubernetes officially supports client libraries for [Go](#go-client), [Python](#python-client), [Java](#java-client), [dotnet](#dotnet-client), [JavaScript](#javascript-client), and [Haskell](#haskell-client). There are other client libraries that are provided and maintained by their authors, not the Kubernetes team. See [client libraries](/docs/reference/using-api/client-libraries/) for accessing the API from other languages and how they authenticate.
-->
### 程式設計方式訪問 API

Kubernetes 官方支援 [Go](#go-client)、[Python](#python-client)、[Java](#java-client)、
[dotnet](#dotnet-client)、[JavaScript](#javascript-client) 和 [Haskell](#haskell-client)
語言的客戶端庫。還有一些其他客戶端庫由對應作者而非 Kubernetes 團隊提供並維護。
參考[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)瞭解如何使用其他語言
來訪問 API 以及如何執行身份認證。

<!-- #### Go client -->

#### Go 客戶端  {#go-client}

<!--
* To get the library, run the following command: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>` See [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases) to see which versions are supported.
* Write an application atop of the client-go clients.
-->

* 要獲取庫，執行下列命令：`go get k8s.io/client-go/kubernetes-<kubernetes 版本號>`，
  參見 [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases) 檢視受支援的版本。
* 基於 client-go 客戶端編寫應用程式。

<!--
Note that client-go defines its own API objects, so if needed, please import API definitions from client-go rather than from the main repository, e.g., `import "k8s.io/client-go/kubernetes"` is correct.
-->
{{< note >}}
注意 client-go 定義了自己的 API 物件，因此如果需要，請從 client-go 而不是主倉庫匯入
API 定義，例如 `import "k8s.io/client-go/kubernetes"` 是正確做法。
{{< /note >}}

<!--
The Go client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go):
-->
Go 客戶端可以使用與 kubectl 命令列工具相同的
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
定位和驗證 API 伺服器。參見這個
[例子](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)：

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
  // uses the current context in kubeconfig
  // path-to-kubeconfig -- for example, /root/.kube/config
  config, _ := clientcmd.BuildConfigFromFlags("", "<path-to-kubeconfig>")
  // creates the clientset
  clientset, _ := kubernetes.NewForConfig(config)
  // access the API to list pods
  pods, _ := clientset.CoreV1().Pods("").List(context.TODO(), v1.ListOptions{})
  fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
}
```

<!--
If the application is deployed as a Pod in the cluster, see [Accessing the API from within a Pod](/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod).
-->
如果該應用程式部署為叢集中的一個
Pod，請參閱[從 Pod 內訪問 API](/zh-cn/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod)。

<!-- #### Python client -->
#### Python 客戶端 {#python-client}

<!--
To use [Python client](https://github.com/kubernetes-client/python), run the following command: `pip install kubernetes` See [Python Client Library page](https://github.com/kubernetes-client/python) for more installation options.
-->
要使用 [Python 客戶端](https://github.com/kubernetes-client/python)，執行下列命令：
`pip install kubernetes`。
參見 [Python 客戶端庫主頁](https://github.com/kubernetes-client/python) 瞭解更多安裝選項。

<!--
The Python client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py):
-->
Python 客戶端可以使用與 kubectl 命令列工具相同的
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
定位和驗證 API 伺服器。參見這個
[例子](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py)：

```python
from kubernetes import client, config

config.load_kube_config()

v1=client.CoreV1Api()
print("Listing pods with their IPs:")
ret = v1.list_pod_for_all_namespaces(watch=False)
for i in ret.items:
    print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
```

<!-- #### Java client -->
#### Java 客戶端    {#java-client}

<!--
To install the [Java Client](https://github.com/kubernetes-client/java), run:
-->
要安裝 [Java 客戶端](https://github.com/kubernetes-client/java)，執行：

```shell
# 克隆 Java 庫
git clone --recursive https://github.com/kubernetes-client/java

# 安裝專案檔案、POM 等
cd java
mvn install
```

<!--
See [https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases) to see which versions are supported.

The Java client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://github.com/kubernetes-client/java/blob/master/examples/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java):
-->
參閱[https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases)
瞭解當前支援的版本。

Java 客戶端可以使用 kubectl 命令列所使用的
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
以定位 API 伺服器並向其認證身份。
參看此[示例](https://github.com/kubernetes-client/java/blob/master/examples/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java)：

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
 * A simple example of how to use the Java API from an application outside a kubernetes cluster
 *
 * <p>Easiest way to run this: mvn exec:java
 * -Dexec.mainClass="io.kubernetes.client.examples.KubeConfigFileClientExample"
 *
 */
public class KubeConfigFileClientExample {
  public static void main(String[] args) throws IOException, ApiException {

    // file path to your KubeConfig
    String kubeConfigPath = "~/.kube/config";

    // loading the out-of-cluster config, a kubeconfig from file-system
    ApiClient client =
        ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();

    // set the global default api-client to the in-cluster one from above
    Configuration.setDefaultApiClient(client);

    // the CoreV1Api loads default api-client from global configuration.
    CoreV1Api api = new CoreV1Api();

    // invokes the CoreV1Api client
    V1PodList list = api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
    System.out.println("Listing all pods: ");
    for (V1Pod item : list.getItems()) {
      System.out.println(item.getMetadata().getName());
    }
  }
}
```

<!--
#### dotnet client

To use [dotnet client](https://github.com/kubernetes-client/csharp), run the following command: `dotnet add package KubernetesClient --version 1.6.1` See [dotnet Client Library page](https://github.com/kubernetes-client/csharp) for more installation options. See [https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases) to see which versions are supported.

The dotnet client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs):
-->
#### .Net 客戶端    {#dotnet-client}

要使用[.Net 客戶端](https://github.com/kubernetes-client/csharp)，執行下面的命令：
`dotnet add package KubernetesClient --version 1.6.1`。
參見[.Net 客戶端庫頁面](https://github.com/kubernetes-client/csharp)瞭解更多安裝選項。
關於可支援的版本，參見[https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases)。

.Net 客戶端可以使用與 kubectl CLI 相同的 [kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
來定位並驗證 API 伺服器。
參見[樣例](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs): 

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

<!--
#### JavaScript client

To install [JavaScript client](https://github.com/kubernetes-client/javascript), run the following command: `npm install @kubernetes/client-node`. See [https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases) to see which versions are supported.

The JavaScript client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js):
-->
#### JavaScript 客戶端    {#javascript-client}

要安裝 [JavaScript 客戶端](https://github.com/kubernetes-client/javascript)，執行下面的命令：
`npm install @kubernetes/client-node`。
參考[https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases)瞭解可支援的版本。

JavaScript 客戶端可以使用 kubectl 命令列所使用的
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
以定位 API 伺服器並向其認證身份。
參見[此例](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js)：

```javascript
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

k8sApi.listNamespacedPod('default').then((res) => {
    console.log(res.body);
});
```

<!--
#### Haskell client

See [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases) to see which versions are supported.

The [Haskell client](https://github.com/kubernetes-client/haskell) can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs):
-->
#### Haskell 客戶端    {#haskell-client}

參考 [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases) 瞭解支援的版本。

[Haskell 客戶端](https://github.com/kubernetes-client/haskell)
可以使用 kubectl 命令列所使用的
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
以定位 API 伺服器並向其認證身份。
參見[此例](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs)：

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
<!--
* [Accessing the Kubernetes API from a Pod](/docs/tasks/run-application/access-api-from-pod/)
-->
* [從 Pod 中訪問 API](/zh-cn/docs/tasks/run-application/access-api-from-pod/)
