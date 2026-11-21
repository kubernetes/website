---
title: Доступ до кластера через API Kubernetes
content_type: task
weight: 60
---

<!-- overview -->

Ця сторінка описує, як отримати доступ до кластера через API Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Доступ до API Kubernetes {#accessing-the-kubernetes-api}

### Перший доступ за допомогою kubectl {#accessing-for-the-first-time-with-kubectl}

Під час першого доступу до API Kubernetes використовуйте інструмент командного рядка Kubernetes, `kubectl`.

Для отримання доступу до кластера вам потрібно знати його розташування та мати облікові дані для доступу до нього. Зазвичай це налаштовується автоматично, коли ви проходите [посібник «Початок роботи»](/docs/setup/), або ж хтось інший налаштував кластер і надав вам облікові дані та розташування.

Перевірте розташування та облікові дані, про які знає kubectl, за допомогою цієї команди:

```shell
kubectl config view
```

Багато [прикладів](https://github.com/kubernetes/examples/tree/master/) містять введення в користування `kubectl`. Повну документацію ви можете знайти в [довідці kubectl](/docs/reference/kubectl/).

### Прямий доступ до REST API {#directly-accessing-the-rest-api}

kubectl виконує пошук API-сервера та автентифікацію на ньому. Якщо ви хочете звертатися до REST API напряму за допомогою HTTP-клієнта, як-от `curl` чи `wget`, або вебоглядача, є кілька способів знайти API-сервер і автентифікуватися на ньому:

1. Запустіть kubectl у режимі проксі (рекомендовано). Цей метод рекомендується, оскільки він використовує збережене розташування API-сервера та перевіряє ідентичність API-сервера за допомогою самопідписного сертифіката. За цього методу атака man-in-the-middle (MITM) неможлива.
1. Як альтернатива, ви можете передати розташування та облікові дані безпосередньо HTTP-клієнту. Це підходить для клієнтського коду, який погано працює з проксі. Щоб захиститися від атак man in the middle, вам потрібно буде імпортувати кореневий сертифікат у свій вебоглядач.

Використання клієнтських бібліотек Go або Python забезпечує доступ до kubectl у режимі проксі.

#### Використання kubectl proxy {#using-kubectl-proxy}

Наведена нижче команда запускає kubectl у режимі, в якому він діє як зворотний проксі. Він виконує пошук API-сервера та автентифікацію.

```shell
kubectl proxy --port=8080 &
```

Докладніше див. [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy).

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

Можна обійтися без kubectl proxy, передаючи токен автентифікації безпосередньо API-серверу, ось так:

Використовуючи підхід `grep/cut`:

```shell
# Перевірте всі можливі кластери, оскільки ваш .KUBECONFIG може мати кілька контекстів:
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# Виберіть назву кластера, з яким ви хочете взаємодіяти, з виводу вище:
export CLUSTER_NAME="some_server_name"

# Вкажіть сервер API, посилаючись на імʼя кластера
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# Створіть секрет для зберігання токена для стандартного службового облікового запису
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF

# Зачекайте, поки контролер токенів заповнить секрет токеном:
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

У наведеному вище прикладі використовується прапорець `--insecure`. Через це він вразливий до атак MITM. Коли kubectl звертається до кластера, він використовує збережений кореневий сертифікат і клієнтські сертифікати для доступу до сервера. (Вони встановлені в теці `~/.kube`.) Оскільки сертифікати кластера зазвичай самопідписні, може знадобитися спеціальне налаштування, щоб ваш HTTP-клієнт використовував кореневий сертифікат.

На деяких кластерах API-сервер не вимагає автентифікації; він може обслуговувати запити лише на localhost або бути захищений брандмауером. Стандарту для цього немає. У документі [Контроль доступу до API Kubernetes](/docs/concepts/security/controlling-access) описано, як адміністратор кластера може це налаштувати.

### Програмний доступ до API {#programmatic-access-to-the-api}

Kubernetes офіційно підтримує клієнтські бібліотеки для [Go](#go-client), [Python](#python-client), [Java](#java-client), [dotnet](#dotnet-client), [JavaScript](#javascript-client) та [Haskell](#haskell-client). Існують інші клієнтські бібліотеки, які надаються та підтримуються їхніми авторами, а не командою Kubernetes. Як отримати доступ до API з інших мов і як вони автентифікуються, див. у [клієнтських бібліотеках](/docs/reference/using-api/client-libraries/).

#### Go-клієнт {#go-client}

* Щоб отримати бібліотеку, виконайте таку команду: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`. Які версії підтримуються, див. на [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases).
* Напишіть застосунок поверх клієнтів client-go.

{{< note >}}

`client-go` визначає власні обʼєкти API, тому за потреби імпортуйте визначення API з client-go, а не з основного репозиторію. Наприклад, правильним є `import "k8s.io/client-go/kubernetes"`.

{{< /note >}}

Go-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
як і kubectl CLI, для пошуку та автентифікації на API-сервері. Дивіться цей [приклад](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go):

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
  // звернення до API, щоб отримати список Podʼів
  pods, _ := clientset.CoreV1().Pods("").List(context.TODO(), v1.ListOptions{})
  fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
}
```

Якщо застосунок розгорнуто як Pod у кластері, див. [Доступ до API зсередини Podʼа](/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod).

#### Python-клієнт {#python-client}

Щоб використовувати [Python-клієнт](https://github.com/kubernetes-client/python), виконайте таку команду: `pip install kubernetes`. Дивіться [сторінку бібліотеки Python-клієнта](https://github.com/kubernetes-client/python) для отримання додаткових варіантів встановлення.

Python-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), як і kubectl CLI, для пошуку та автентифікації на API-сервері. Дивіться цей [приклад](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py):

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

Для встановлення [Java-клієнта](https://github.com/kubernetes-client/java) виконайте таку команду:

```shell
# Склонуйте код бібліотеки Java
git clone --recursive https://github.com/kubernetes-client/java

# Встановлення артефактів проєкту, POM й так далі:
cd java
mvn install
```

Які версії підтримуються, див. на [https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases).

Java-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на API-сервері. Дивіться цей [приклад](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-latest/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java):

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
 * Простий приклад використання Java API із застосунку поза кластером Kubernetes
 *
 * <p>Найпростіший спосіб запустити це: mvn exec:java
 * -Dexec.mainClass="io.kubernetes.client.examples.KubeConfigFileClientExample"
 *
 */
public class KubeConfigFileClientExample {
  public static void main(String[] args) throws IOException, ApiException {

    // шлях до файлу KubeConfig
    String kubeConfigPath = "~/.kube/config";

    // завантаження конфігурації ззовні кластера, kubeconfig із файлової системи
    ApiClient client =
        ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();

    // встановлення глобального api-client на того, що працює в межах кластера, як описано вище
    Configuration.setDefaultApiClient(client);

    // CoreV1Api завантажує стандартний api-client з глобальної конфігурації.
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

Щоб використовувати [dotnet-клієнт](https://github.com/kubernetes-client/csharp), виконайте таку команду: `dotnet add package KubernetesClient --version 1.6.1`. Дивіться [сторінку бібліотеки dotnet-клієнта](https://github.com/kubernetes-client/csharp) для отримання додаткових варіантів встановлення. Які версії підтримуються, див. на [https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases).

Dotnet-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на API-сервері. Дивіться цей [приклад](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs):

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

Щоб встановити [JavaScript-клієнт](https://github.com/kubernetes-client/javascript), виконайте таку команду: `npm install @kubernetes/client-node`. Які версії підтримуються, див. на [https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases).

JavaScript-клієнт може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на API-сервері. Дивіться цей [приклад](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js):

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

Які версії підтримуються, див. на [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases).

[Haskell-клієнт](https://github.com/kubernetes-client/haskell) може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що і kubectl CLI, для пошуку та автентифікації на API-сервері. Дивіться цей [приклад](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs):

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

## {{% heading "whatsnext" %}} {#what-s-next}

* [Отримання доступу до API Kubernetes з Podʼа](/docs/tasks/run-application/access-api-from-pod/)
