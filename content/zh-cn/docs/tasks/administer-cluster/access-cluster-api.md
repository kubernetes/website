---
title: 使用 Kubernetes API 访问集群
content_type: task
weight: 60
---
<!--
title: Access Clusters Using the Kubernetes API
content_type: task
weight: 60
-->

<!-- overview -->

<!--
This page shows how to access clusters using the Kubernetes API.
-->
本页展示了如何使用 Kubernetes API 访问集群。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Accessing the Kubernetes API

### Accessing for the first time with kubectl
-->
## 访问 Kubernetes API   {#accessing-the-kubernetes-api}

### 使用 kubectl 进行首次访问

<!--
When accessing the Kubernetes API for the first time, use the
Kubernetes command-line tool, `kubectl`.
-->
首次访问 Kubernetes API 时，请使用 Kubernetes 命令行工具 `kubectl`。

<!--
To access a cluster, you need to know the location of the cluster and have credentials
to access it. Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/setup/),
or someone else set up the cluster and provided you with credentials and a location.
-->
要访问集群，你需要知道集群位置并拥有访问它的凭证。
通常，当你完成[入门指南](/zh-cn/docs/setup/)时，这会自动设置完成，或者由其他人设置好集群并将凭证和位置提供给你。

<!--
Check the location and credentials that kubectl knows about with this command:
-->
使用此命令检查 kubectl 已知的位置和凭证：

```shell
kubectl config view
```

<!--
Many of the [examples](https://github.com/kubernetes/examples/tree/master/) provide an introduction to using
kubectl. Complete documentation is found in the [kubectl manual](/docs/reference/kubectl/).
-->

许多[样例](https://github.com/kubernetes/examples/tree/master/)
提供了使用 kubectl 的介绍。完整文档请见 [kubectl 手册](/zh-cn/docs/reference/kubectl/)。

<!--
### Directly accessing the REST API

kubectl handles locating and authenticating to the API server. If you want to directly access the REST API with an http client like
`curl` or `wget`, or a browser, there are multiple ways you can locate and authenticate against the API server:
-->
### 直接访问 REST API

kubectl 处理对 API 服务器的定位和身份验证。如果你想通过 http 客户端（如 `curl`、`wget`
或浏览器）直接访问 REST API，你可以通过多种方式对 API 服务器进行定位和身份验证：

<!--
 1. Run kubectl in proxy mode (recommended). This method is recommended, since it uses
    the stored apiserver location and verifies the identity of the API server using a
    self-signed cert. No man-in-the-middle (MITM) attack is possible using this method.
 1. Alternatively, you can provide the location and credentials directly to the http client.
    This works with client code that is confused by proxies. To protect against man in the
    middle attacks, you'll need to import a root cert into your browser.
-->
1. 以代理模式运行 kubectl（推荐）。
   推荐使用此方法，因为它用存储的 apiserver 位置并使用自签名证书验证 API 服务器的标识。
   使用这种方法无法进行中间人（MITM）攻击。
2. 另外，你可以直接为 HTTP 客户端提供位置和身份认证。
   这适用于被代理混淆的客户端代码。
   为防止中间人攻击，你需要将根证书导入浏览器。

<!--
Using the Go or Python client libraries provides accessing kubectl in proxy mode.
-->
使用 Go 或 Python 客户端库可以在代理模式下访问 kubectl。

<!--
#### Using kubectl proxy

The following command runs kubectl in a mode where it acts as a reverse proxy. It handles
locating the API server and authenticating.
-->
#### 使用 kubectl 代理

下列命令使 kubectl 运行在反向代理模式下。它处理 API 服务器的定位和身份认证。

<!--
Run it like this:
-->
像这样运行它：

```shell
kubectl proxy --port=8080 &
```

<!--
See [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) for more details.
-->
参见 [kubectl 代理](/docs/reference/generated/kubectl/kubectl-commands/#proxy) 获取更多细节。

<!--
Then you can explore the API with curl, wget, or a browser, like so:
-->
然后你可以通过 curl，wget，或浏览器浏览 API，像这样：

```shell
curl http://localhost:8080/api/
```

<!--
The output is similar to this:
-->
输出类似如下：

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

通过将身份认证令牌直接传给 API 服务器，可以避免使用 kubectl 代理，像这样：

使用 `grep/cut` 方式：

```shell
# 查看所有的集群，因为你的 .kubeconfig 文件中可能包含多个上下文
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# 从上述命令输出中选择你要与之交互的集群的名称
export CLUSTER_NAME="some_server_name"

# 指向引用该集群名称的 API 服务器
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# 创建一个 secret 来保存默认服务账户的令牌
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

# 获取令牌
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

# 使用令牌玩转 API
curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

<!--
The output is similar to this:
-->
输出类似如下：

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
上面例子使用了 `--insecure` 标志位。这使它易受到 MITM 攻击。
当 kubectl 访问集群时，它使用存储的根证书和客户端证书访问服务器。
（已安装在 `~/.kube` 目录下）。
由于集群认证通常是自签名的，因此可能需要特殊设置才能让你的 http 客户端使用根证书。

<!--
On some clusters, the API server does not require authentication; it may serve
on localhost, or be protected by a firewall. There is not a standard
for this. [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access)
describes how you can configure this as a cluster administrator.
-->
在一些集群中，API 服务器不需要身份认证；它运行在本地，或由防火墙保护着。
对此并没有一个标准。
[配置对 API 的访问](/zh-cn/docs/concepts/security/controlling-access/)
讲解了作为集群管理员可如何对此进行配置。

<!--
### Programmatic access to the API

Kubernetes officially supports client libraries for [Go](#go-client), [Python](#python-client),
[Java](#java-client), [dotnet](#dotnet-client), [JavaScript](#javascript-client), and
[Haskell](#haskell-client). There are other client libraries that are provided and maintained by
their authors, not the Kubernetes team. See [client libraries](/docs/reference/using-api/client-libraries/)
for accessing the API from other languages and how they authenticate.
-->
### 编程方式访问 API

Kubernetes 官方支持 [Go](#go-client)、[Python](#python-client)、[Java](#java-client)、
[dotnet](#dotnet-client)、[JavaScript](#javascript-client) 和 [Haskell](#haskell-client)
语言的客户端库。还有一些其他客户端库由对应作者而非 Kubernetes 团队提供并维护。
参考[客户端库](/zh-cn/docs/reference/using-api/client-libraries/)了解如何使用其他语言来访问 API
以及如何执行身份认证。

<!--
#### Go client
-->

#### Go 客户端  {#go-client}

<!--
* To get the library, run the following command: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`
  See [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases)
  to see which versions are supported.
* Write an application atop of the client-go clients.
-->

* 要获取库，运行下列命令：`go get k8s.io/client-go/kubernetes-<kubernetes 版本号>`，
  参见 [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases)
  查看受支持的版本。
* 基于 client-go 客户端编写应用程序。

{{< note >}}
<!--
client-go defines its own API objects, so if needed, import API definitions from client-go rather than
from the main repository. For example, `import "k8s.io/client-go/kubernetes"` is correct.
-->
client-go 定义了自己的 API 对象，因此如果需要，从 client-go 而不是主仓库导入
API 定义，例如 `import "k8s.io/client-go/kubernetes"` 是正确做法。
{{< /note >}}

<!--
The Go client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go):
-->
Go 客户端可以使用与 kubectl 命令行工具相同的
[kubeconfig 文件](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
定位和验证 API 服务器。参见这个
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
  // 在 kubeconfig 中使用当前上下文
  // path-to-kubeconfig -- 例如 /root/.kube/config
  config, _ := clientcmd.BuildConfigFromFlags("", "<path-to-kubeconfig>")
  // 创建 clientset
  clientset, _ := kubernetes.NewForConfig(config)
  // 访问 API 以列出 Pod
  pods, _ := clientset.CoreV1().Pods("").List(context.TODO(), v1.ListOptions{})
  fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
}
```

<!--
If the application is deployed as a Pod in the cluster, see
[Accessing the API from within a Pod](/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod).
-->
如果该应用程序部署为集群中的一个
Pod，请参阅[从 Pod 内访问 API](/zh-cn/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod)。

<!--
#### Python client
-->
#### Python 客户端 {#python-client}

<!--
To use [Python client](https://github.com/kubernetes-client/python), run the following command:
`pip install kubernetes`. See [Python Client Library page](https://github.com/kubernetes-client/python)
for more installation options.
-->
要使用 [Python 客户端](https://github.com/kubernetes-client/python)，运行下列命令：
`pip install kubernetes`。
参见 [Python 客户端库主页](https://github.com/kubernetes-client/python)了解更多安装选项。

<!--
The Python client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this
[example](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py):
-->
Python 客户端可以使用与 kubectl 命令行工具相同的
[kubeconfig 文件](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
定位和验证 API 服务器。参见这个
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

<!--
#### Java client
-->
#### Java 客户端    {#java-client}

<!--
To install the [Java Client](https://github.com/kubernetes-client/java), run:
-->
要安装 [Java 客户端](https://github.com/kubernetes-client/java)，运行：

```shell
# 克隆 Java 库
git clone --recursive https://github.com/kubernetes-client/java

# 安装项目文件、POM 等
cd java
mvn install
```

<!--
See [https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases)
to see which versions are supported.

The Java client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this
[example](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-15/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java):
-->
参阅 [https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases)
了解当前支持的版本。

Java 客户端可以使用 kubectl 命令行所使用的
[kubeconfig 文件](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
以定位 API 服务器并向其认证身份。
参看此[示例](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-15/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java)：

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

To use [dotnet client](https://github.com/kubernetes-client/csharp),
run the following command: `dotnet add package KubernetesClient --version 1.6.1`
See [dotnet Client Library page](https://github.com/kubernetes-client/csharp)
for more installation options. See
[https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases)
to see which versions are supported.

The dotnet client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this
[example](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs):
-->
#### .Net 客户端    {#dotnet-client}

要使用 [.Net 客户端](https://github.com/kubernetes-client/csharp)，运行下面的命令：
`dotnet add package KubernetesClient --version 1.6.1`。
参见 [.Net 客户端库页面](https://github.com/kubernetes-client/csharp)了解更多安装选项。
关于可支持的版本，参见[https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases)。

.Net 客户端可以使用与 kubectl CLI 相同的
[kubeconfig 文件](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)来定位并验证
API 服务器。
参见[样例](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs)：

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

To install [JavaScript client](https://github.com/kubernetes-client/javascript),
run the following command: `npm install @kubernetes/client-node`. See
[https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases)
to see which versions are supported.

The JavaScript client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this
[example](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js):
-->
#### JavaScript 客户端    {#javascript-client}

要安装 [JavaScript 客户端](https://github.com/kubernetes-client/javascript)，运行下面的命令：
`npm install @kubernetes/client-node`。
参考[https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases)了解可支持的版本。

JavaScript 客户端可以使用 kubectl 命令行所使用的
[kubeconfig 文件](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
以定位 API 服务器并向其认证身份。
参见[此例](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js)：

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

See [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases)
to see which versions are supported.

The [Haskell client](https://github.com/kubernetes-client/haskell) can use the same
[kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this
[example](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs):
-->
#### Haskell 客户端    {#haskell-client}

参考 [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases)
了解支持的版本。

[Haskell 客户端](https://github.com/kubernetes-client/haskell)
可以使用 kubectl 命令行所使用的
[kubeconfig 文件](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
以定位 API 服务器并向其认证身份。
参见[此例](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs)：

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
* [从 Pod 中访问 Kubernetes API](/zh-cn/docs/tasks/run-application/access-api-from-pod/)
