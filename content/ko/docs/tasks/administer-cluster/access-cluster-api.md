---
title: 쿠버네티스 API를 사용하여 클러스터에 접근하기
content_type: task
---

<!-- overview -->
이 페이지는 쿠버네티스 API를 사용하여 클러스터에 접근하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## 쿠버네티스 API에 접근

### kubectl을 사용하여 처음으로 접근

쿠버네티스 API에 처음 접근하는 경우, 쿠버네티스
커맨드 라인 도구인 `kubectl` 을 사용한다.

클러스터에 접근하려면, 클러스터 위치를 알고 접근할 수 있는 자격 증명이
있어야 한다. 일반적으로, [시작하기 가이드](/ko/docs/setup/)를
통해 작업하거나,
다른 사람이 클러스터를 설정하고 자격 증명과 위치를 제공할 때 자동으로 설정된다.

다음의 명령으로 kubectl이 알고 있는 위치와 자격 증명을 확인한다.

```shell
kubectl config view
```

많은 [예제](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)는 kubectl 사용에 대한 소개를
제공한다. 전체 문서는 [kubectl 매뉴얼](/ko/docs/reference/kubectl/overview/)에 있다.

### REST API에 직접 접근

kubectl은 API 서버 찾기와 인증을 처리한다. `curl` 이나 `wget` 과 같은 http 클라이언트 또는 브라우저를 사용하여 REST API에
직접 접근하려는 경우, API 서버를 찾고 인증할 수 있는 여러 가지 방법이 있다.

 1. 프록시 모드에서 kubectl을 실행한다(권장). 이 방법은 저장된 API 서버 위치를 사용하고 자체 서명된 인증서를 사용하여 API 서버의 ID를 확인하므로 권장한다. 이 방법을 사용하면 중간자(man-in-the-middle, MITM) 공격이 불가능하다.
 1. 또는, 위치와 자격 증명을 http 클라이언트에 직접 제공할 수 있다. 이 방법은 프록시를 혼란스럽게 하는 클라이언트 코드와 동작한다. 중간자 공격으로부터 보호하려면, 브라우저로 루트 인증서를 가져와야 한다.

 Go 또는 Python 클라이언트 라이브러리를 사용하면 프록시 모드에서 kubectl에 접근할 수 있다.

#### kubectl 프록시 사용

다음 명령은 kubectl을 리버스 프록시로 작동하는 모드에서 실행한다. API
서버 찾기와 인증을 처리한다.

다음과 같이 실행한다.

```shell
kubectl proxy --port=8080 &
```

자세한 내용은 [kubectl 프록시](/docs/reference/generated/kubectl/kubectl-commands/#proxy)를 참고한다.

그런 다음 curl, wget 또는 브라우저를 사용하여 API를 탐색할 수 있다.

```shell
curl http://localhost:8080/api/
```

출력은 다음과 비슷하다.

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

#### kubectl 프록시 없이 접근

다음과 같이 인증 토큰을 API 서버에 직접 전달하여 kubectl 프록시
사용을 피할 수 있다.

`grep/cut` 방식을 사용한다.

```shell
# .KUBECONFIG에 여러 콘텍스트가 있을 수 있으므로, 가능한 모든 클러스터를 확인한다.
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# 위의 출력에서 상호 작용하려는 클러스터의 이름을 선택한다.
export CLUSTER_NAME="some_server_name"

# 클러스터 이름을 참조하는 API 서버를 가리킨다.
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# 토큰 값을 얻는다
TOKEN=$(kubectl get secrets -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='default')].data.token}"|base64 --decode)

# TOKEN으로 API 탐색
curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

출력은 다음과 비슷하다.

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

`jsonpath` 방식을 사용한다.

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret $(kubectl get serviceaccount default -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 --decode )
curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
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

위의 예는 `--insecure` 플래그를 사용한다. 이로 인해 MITM 공격이
발생할 수 있다. kubectl이 클러스터에 접근하면 저장된 루트 인증서와
클라이언트 인증서를 사용하여 서버에 접근한다. (`~/.kube` 디렉터리에
설치된다.) 클러스터 인증서는 일반적으로 자체 서명되므로,
http 클라이언트가 루트 인증서를 사용하도록 하려면 특별한 구성이
필요할 수 있다.

일부 클러스터에서, API 서버는 인증이 필요하지 않다.
로컬 호스트에서 제공되거나, 방화벽으로 보호될 수 있다. 이에 대한 표준은
없다. [쿠버네티스 API에 대한 접근 제어](/ko/docs/concepts/security/controlling-access)은
클러스터 관리자로서 이를 구성하는 방법에 대해 설명한다. 이러한 접근 방식은 향후
고 가용성 지원과 충돌할 수 있다.

### API에 프로그래밍 방식으로 접근

쿠버네티스는 공식적으로 [Go](#go-client), [Python](#python-client), [Java](#java-client), [dotnet](#dotnet-client), [Javascript](#javascript-client) 및 [Haskell](#haskell-client) 용 클라이언트 라이브러리를 지원한다. 쿠버네티스 팀이 아닌 작성자가 제공하고 유지 관리하는 다른 클라이언트 라이브러리가 있다. 다른 언어에서 API에 접근하고 인증하는 방법에 대해서는 [클라이언트 라이브러리](/ko/docs/reference/using-api/client-libraries/)를 참고한다.

#### Go 클라이언트 {#go-client}

* 라이브러리를 얻으려면, 다음 명령을 실행한다. `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>` 어떤 버전이 지원되는지를 확인하려면 [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases)를 참고한다.
* client-go 클라이언트 위에 애플리케이션을 작성한다.

{{< note >}}

client-go는 자체 API 오브젝트를 정의하므로, 필요한 경우, 기본 리포지터리가 아닌 client-go에서 API 정의를 가져온다. 예를 들어, `import "k8s.io/client-go/kubernetes"` 가 맞다.

{{< /note >}}

Go 클라이언트는 kubectl CLI가 API 서버를 찾아 인증하기 위해 사용하는 것과 동일한 [kubeconfig 파일](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을
사용할 수 있다. 이 [예제](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)를 참고한다.

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
  // kubeconfig에서 현재 콘텍스트를 사용한다
  // path-to-kubeconfig -- 예를 들어, /root/.kube/config
  config, _ := clientcmd.BuildConfigFromFlags("", "<path-to-kubeconfig>")
  // clientset을 생성한다
  clientset, _ := kubernetes.NewForConfig(config)
  // 파드를 나열하기 위해 API에 접근한다
  pods, _ := clientset.CoreV1().Pods("").List(context.TODO(), v1.ListOptions{})
  fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
}
```

애플리케이션이 클러스터에서 파드로 배치된 경우, [파드 내에서 API 접근](#accessing-the-api-from-within-a-pod)을 참고한다.

#### Python 클라이언트 {#python-client}

[Python 클라이언트](https://github.com/kubernetes-client/python)를 사용하려면, 다음 명령을 실행한다. `pip install kubernetes` 추가 설치 옵션은 [Python Client Library 페이지](https://github.com/kubernetes-client/python)를 참고한다.

Python 클라이언트는 kubectl CLI가 API 서버를 찾아 인증하기 위해 사용하는 것과 동일한 [kubeconfig 파일](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을
사용할 수 있다. 이 [예제](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py)를 참고한다.

```python
from kubernetes import client, config

config.load_kube_config()

v1=client.CoreV1Api()
print("Listing pods with their IPs:")
ret = v1.list_pod_for_all_namespaces(watch=False)
for i in ret.items:
    print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
```

#### Java 클라이언트 {#java-client}

[Java 클라이언트](https://github.com/kubernetes-client/java)를 설치하려면, 다음을 실행한다.

```shell
# java 라이브러리를 클론한다
git clone --recursive https://github.com/kubernetes-client/java

# 프로젝트 아티팩트, POM 등을 설치한다
cd java
mvn install
```

어떤 버전이 지원되는지를 확인하려면 [https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases)를 참고한다.

Java 클라이언트는 kubectl CLI가 API 서버를 찾아 인증하기 위해 사용하는 것과 동일한 [kubeconfig 파일](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을
사용할 수 있다. 이 [예제](https://github.com/kubernetes-client/java/blob/master/examples/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java)를 참고한다.

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
 * 쿠버네티스 클러스터 외부의 애플리케이션에서 Java API를 사용하는 방법에 대한 간단한 예
 *
 * <p>이것을 실행하는 가장 쉬운 방법: mvn exec:java
 * -Dexec.mainClass="io.kubernetes.client.examples.KubeConfigFileClientExample"
 *
 */
public class KubeConfigFileClientExample {
  public static void main(String[] args) throws IOException, ApiException {

    // KubeConfig의 파일 경로
    String kubeConfigPath = "~/.kube/config";

    // 파일시스템에서 클러스터 외부 구성인 kubeconfig 로드
    ApiClient client =
        ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();

    // 전역 디폴트 api-client를 위에서 정의한 클러스터 내 클라이언트로 설정
    Configuration.setDefaultApiClient(client);

    // CoreV1Api는 전역 구성에서 디폴트 api-client를 로드
    CoreV1Api api = new CoreV1Api();

    // CoreV1Api 클라이언트를 호출한다
    V1PodList list = api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
    System.out.println("Listing all pods: ");
    for (V1Pod item : list.getItems()) {
      System.out.println(item.getMetadata().getName());
    }
  }
}
```

#### dotnet 클라이언트 {#dotnet-client}

[dotnet 클라이언트](https://github.com/kubernetes-client/csharp)를 사용하려면, 다음 명령을 실행한다. `dotnet add package KubernetesClient --version 1.6.1` 추가 설치 옵션은 [dotnet Client Library 페이지](https://github.com/kubernetes-client/csharp)를 참고한다. 어떤 버전이 지원되는지를 확인하려면 [https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases)를 참고한다.

dotnet 클라이언트는 kubectl CLI가 API 서버를 찾아 인증하기 위해 사용하는 것과 동일한 [kubeconfig 파일](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을
사용할 수 있다. 이 [예제](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs)를 참고한다.

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

#### JavaScript 클라이언트 {#javascript-client}

[JavaScript 클라이언트](https://github.com/kubernetes-client/javascript)를 설치하려면, 다음 명령을 실행한다. `npm install @kubernetes/client-node` 어떤 버전이 지원되는지를 확인하려면 [https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases)를 참고한다.

JavaScript 클라이언트는 kubectl CLI가 API 서버를 찾아 인증하기 위해 사용하는 것과 동일한 [kubeconfig 파일](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을
사용할 수 있다. 이 [예제](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js)를 참고한다.

```javascript
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

k8sApi.listNamespacedPod('default').then((res) => {
    console.log(res.body);
});
```

#### Haskell 클라이언트 {#haskell-client}

어떤 버전이 지원되는지를 확인하려면 [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases)를 참고한다.

Haskell 클라이언트는 kubectl CLI가 API 서버를 찾아 인증하기 위해 사용하는 것과 동일한 [kubeconfig 파일](/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)을
사용할 수 있다. 이 [예제](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs)를 참고한다.

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

* [파드 내에서 쿠버네티스 API에 접근](/ko/docs/tasks/run-application/access-api-from-pod/)
