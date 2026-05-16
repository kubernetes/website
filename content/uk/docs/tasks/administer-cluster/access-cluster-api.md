---
title: Доступ до кластера через API Kubernetes
content_type: task
weight: 60
---

<!-- overview -->

Ця сторінка описує, як отримати доступ до кластера через API Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Доступ до API Kubernetes {#accessing-the-kubernetes-api}

### Перший доступ за допомогою kubectl {#accessing-for-the-first-time-using-kubectl}

При першому доступі до API Kubernetes використовуйте інструмент командного рядка Kubernetes, `kubectl`.

Для отримання доступу до кластера вам потрібно знати його розташування та мати облікові дані для входу. Зазвичай вони встановлюються автоматично, коли ви користуєтесь настановами зі сторінки [Початок роботи](/docs/setup/), або ж ви вже маєте розгорнутий кластер з налаштованим доступом.

Перевірте місце знаходження та облікові дані, про які знає kubectl, за допомогою цієї команди:

```shell
kubectl config view
```

Багато [прикладів](https://github.com/kubernetes/examples/tree/master/) містять введення в користування `kubectl`. Повну документацію ви можете знайти в [довідці kubectl](/docs/reference/kubectl/).

### Прямий доступ до REST API {#direct-accessing-the-rest-api}

kubectl використовується для знаходження та автентифікації на сервері API. Якщо ви хочете дістатись REST API за допомогою інструментів на кшталт `curl` або `wget`, чи вебоглядача, існує кілька способів якими ви можете знайти та автентифікуватись на сервері API.

1. Запустіть kubectl у режимі проксі (рекомендовано). Цей метод рекомендується, оскільки він використовує збережене розташування сервера API та перевіряє відповідність сервера API за допомогою самопідписного сертифіката. За допомогою цього методу неможлива атака man-in-the-middle (MITM).
2. Крім того, ви можете вказати знаходження та облікові дані безпосередньо http-клієнту. Це працює з клієнтським кодом, який плутають проксі. Щоб захиститися від атак man in the middle, вам потрібно буде імпортувати кореневий сертифікат у свій вебоглядач.

Використання клієнтських бібліотек Go або Python забезпечує доступ до kubectl у режимі проксі.

### Використання kubectl proxy {#using-kubectl-proxy}

Наступна команда запускає kubectl у режимі, де він діє як зворотний проксі. Він виконує пошук сервера API та автентифікацію.

```shell
kubectl proxy --port=8080 &
```

Дивіться [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) для отримання додаткової інформації.

Потім ви можете дослідити API за допомогою curl, wget або вебоглядача, наприклад:

```shell
curl http://localhost:8080/api/
```

Вивід має бути схожий на цей:

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

#### Без використання kubectl proxy {#without-kubectl-proxy}

Можна уникнути використання kubectl proxy, передаючи токен автентифікації безпосередньо на сервер API, наприклад:

Використовуючи підхід `grep/cut`:

```shell
# Перевірте всі можливі кластери, оскільки ваш .KUBECONFIG може мати кілька контекстів:
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# Виберіть назву кластера, з яким ви хочете взаємодіяти, з виводу вище:
export CLUSTER_NAME="some_server_name"

# Вкажіть сервер API, посилаючись на імʼя кластера
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# Створіть секрет для зберігання токена для службовоого облікового запису
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF

# Зачекайте, поки контролер заповнить секрет токеном:
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done

# Отримайте значення токена
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

# Дослідіть API скориставшись TOKEN
curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

Вивід має бути схожий на цей:

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

У вищенаведеному прикладі використовується прапорець `--insecure`. Це залишає систему вразливою до атак типу MITM (Man-In-The-Middle). Коли kubectl отримує доступ до кластера, він використовує збережений кореневий сертифікат та сертифікати клієнта для доступу до сервера. (Ці дані знаходяться у теці `~/.kube`). Оскільки сертифікати кластера зазвичай самопідписні, може знадобитися спеціальна конфігурація, щоб ваш HTTP-клієнт використовував кореневий сертифікат.

На деяких кластерах сервер API може не вимагати автентифікації; він може обслуговувати локальний хост або бути захищений фаєрволом. Не існує стандарту для цього. Документ [Керування доступом до API Kubernetes](/docs/concepts/security/controlling-access) описує, як ви можете налаштувати це, як адміністратор кластера.

### Програмний доступ до API {#programmatic-access-to-the-api}

Kubernetes офіційно підтримує клієнтські бібліотеки для [Go](#go-client), [Python](#python-client), [Java](#java-client), [dotnet](#dotnet-client), [JavaScript](#javascript-client) та [Haskell](#haskell-client). Існують інші клієнтські бібліотеки, які надаються та підтримуються їхніми авторами, а не командою Kubernetes. Дивіться [бібліотеки клієнтів](/docs/reference/using-api/client-libraries/) для доступу до API з інших мов програмування та їхнього методу автентифікації.

#### Go-клієнт {#go-client}

* Щоб отримати бібліотеку, виконайте наступну команду: `go get k8s.io/client-go@kubernetes-<номер-версії-kubernetes>`. Дивіться [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases), щоб переглянути підтримувані версії.
* Напишіть застосунок поверх клієнтів client-go.

{{< note >}}

`client-go` визначає власні обʼєкти API, тому у разі необхідності імпортуйте визначення API з client-go, а не з основного сховища. Наприклад, `import "k8s.io/client-go/kubernetes"` є правильним.

{{< /note >}}

Go-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
як і kubectl CLI, для пошуку та автентифікації на сервері API. Дивіться цей [приклад](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go):

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
  // використовуємо поточний контекст з kubeconfig
  // path-to-kubeconfig -- наприклад, /root/.kube/config
  config, _ := clientcmd.BuildConfigFromFlags("", "<path-to-kubeconfig>")
  // створює clientset
  clientset, _ := kubernetes.NewForConfig(config)
  // доступ API до списку Podʼів
  pods, _ := clientset.CoreV1().Pods("").List(context.TODO(), v1.ListOptions{})
  fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
}
```

Якщо застосунок розгорнуто як Pod у кластері, дивіться [Доступ до API зсередини Pod](/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod).

#### Python-клієнт {#python-client}

Щоб використовувати [Python-клієнт](https://github.com/kubernetes-client/python), виконайте наступну команду: `pip install kubernetes`. Дивіться [сторінку бібліотеки Python-клієнта](https://github.com/kubernetes-client/python) для отримання додаткових варіантів встановлення.

Python-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), як і kubectl CLI, для пошуку та автентифікації на сервері API. Дивіться цей [приклад](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py):

```python
from kubernetes import client, config

config.load_kube_config()

v1=client.CoreV1Api()
print("Listing pods with their IPs:")
ret = v1.list_pod_for_all_namespaces(watch=False)
for i in ret.items:
    print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
```

#### Java-клієнт {#java-client}

Для встановлення [Java-клієнта](https://github.com/kubernetes-client/java) виконайте наступну команду:

```shell
# Зколнуйте код білліотеки java
git clone --recursive https://github.com/kubernetes-client/java

# Встановлення артефактів проєкту, POM й так даіл:
cd java
mvn install
```

Дивіться [https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases), щоб переглянути підтримувані версії.

Java-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на сервері API. Дивіться цей [приклад](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-15/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java):

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
 * Простий приклад використання Java API з застосунку поза кластером Kubernetes.
 *
 * Найпростіший спосіб запуску цього: mvn exec:java
 * -Dexec.mainClass="io.kubernetes.client.examples.KubeConfigFileClientExample"
 *
 */
public class KubeConfigFileClientExample {
  public static void main(String[] args) throws IOException, ApiException {

    // шлях до файлуу KubeConfig
    String kubeConfigPath = "~/.kube/config";

    // завантаження конфігурації ззовні кластера, kubeconfig із файлової системи
    ApiClient client =
        ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();

    // встановлення глобального api-client на того, що працює в межах кластера, як описано вище
    Configuration.setDefaultApiClient(client);

    // the CoreV1Api завантажує api-client з глобальної конфігурації.
    CoreV1Api api = new CoreV1Api();

    // виклик клієнта CoreV1Api
    V1PodList list = api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
    System.out.println("Listing all pods: ");
    for (V1Pod item : list.getItems()) {
      System.out.println(item.getMetadata().getName());
    }
  }
}
```

#### dotnet-клієнт {#dotnet-client}

Щоб використовувати [dotnet-клієнт](https://github.com/kubernetes-client/csharp), виконайте наступну команду: `dotnet add package KubernetesClient --version 1.6.1`. Дивіться [сторінку бібліотеки dotnet-клієнта](https://github.com/kubernetes-client/csharp) для отримання додаткових варіантів встановлення. Дивіться [https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases), щоб переглянути підтримувані версії.

Dotnet-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на сервері API. Дивіться цей [приклад](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs):

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

#### JavaScript-клієнт {#javascript-client}

Щоб встановити [JavaScript-клієнт](https://github.com/kubernetes-client/javascript), виконайте наступну команду: `npm install @kubernetes/client-node`. Дивіться [сторінку бібліотеки JavaScript-клієнта](https://github.com/kubernetes-client/javascript) для отримання додаткових варіантів встановлення. Дивіться [https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases), щоб переглянути підтримувані версії.

JavaScript-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на сервері API. Дивіться цей [приклад](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js):

```javascript
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

k8sApi.listNamespacedPod({ namespace: 'default' }).then((res) => {
    console.log(res);
});
```

#### Haskell-клієнт {#haskell-client}

Дивіться [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases), щоб переглянути підтримувані версії.

[Haskell-клієнт](https://github.com/kubernetes-client/haskell) може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на сервері API. Дивіться цей [приклад](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs):

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

* [Доступ до API Kubernetes із Pod](/docs/tasks/run-application/access-api-from-pod/)
