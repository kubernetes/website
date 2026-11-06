---
title: Виділення ClusterIP для Service
content_type: concept
weight: 120
---


<!-- overview -->

У Kubernetes [Services](/docs/concepts/services-networking/service/) — це абстрактний спосіб надати доступ до застосунку, що працює на наборі Podʼів. Services можуть мати віртуальну IP-адресу в межах кластера (за допомогою Service з `type: ClusterIP`). Клієнти можуть підключатися за цією віртуальною IP-адресою, а Kubernetes балансує трафік до цього Service між різними Podʼами, що його обслуговують.

<!-- body -->

## Як виділяються ClusterIP для Services? {#how-service-clusterips-are-allocated}

Коли Kubernetes потрібно призначити віртуальну IP-адресу для Service, це відбувається одним із двох способів:

_динамічно_
: панель управління кластера автоматично вибирає вільну IP-адресу з налаштованого діапазону IP для Services із `type: ClusterIP`.

_статично_
: ви вказуєте IP-адресу на свій вибір із налаштованого діапазону IP для Services.

У всьому вашому кластері `ClusterIP` кожного Service має бути унікальним. Спроба створити Service із конкретним `ClusterIP`, який уже виділено, поверне помилку.

## Навіщо резервувати Cluster IP для Services? {#why-do-you-need-to-reserve-service-cluster-ips}

Іноді вам може знадобитися, щоб Services працювали на добре відомих IP-адресах, аби інші компоненти та користувачі в кластері могли ними користуватися.

Найкращий приклад — DNS Service для кластера. За неформальною домовленістю деякі інсталятори Kubernetes призначають DNS Service 10-ту IP-адресу з діапазону IP для Services. Припустимо, ви налаштували кластер із діапазоном IP для Services 10.96.0.0/16 і хочете, щоб IP-адресою вашого DNS Service була 10.96.0.10; тоді вам доведеться створити такий Service:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: CoreDNS
  name: kube-dns
  namespace: kube-system
spec:
  clusterIP: 10.96.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
    targetPort: 53
  - name: dns-tcp
    port: 53
    protocol: TCP
    targetPort: 53
  selector:
    k8s-app: kube-dns
  type: ClusterIP
```

Але, як уже пояснювалося, IP-адресу 10.96.0.10 не зарезервовано. Якщо інші Services буде створено раніше або паралельно з динамічним виділенням, є ймовірність, що їм буде виділено цю IP-адресу. Тоді ви не зможете створити DNS Service, оскільки це завершиться помилкою конфлікту.

## Як уникнути конфліктів ClusterIP для Services? {#avoid-ClusterIP-conflict}

Стратегія виділення ClusterIP для Services, реалізована в Kubernetes, зменшує ризик колізій.

Діапазон `ClusterIP` поділено на основі формули `min(max(16, cidrSize / 16), 256)`, яку можна описати так: _ніколи не менше ніж 16 і не більше ніж 256, з поступовим кроком між ними_.

Динамічне призначення IP стандартно використовує верхню смугу, а коли її вичерпано, використовує нижній діапазон. Це дає користувачам змогу робити статичні виділення в нижній смузі з низьким ризиком колізій.

## Приклади {#allocation-examples}

### Приклад 1 {#allocation-example-1}

У цьому прикладі використовується діапазон IP-адрес: 10.96.0.0/24 (нотація CIDR) для IP-адрес Services.

Розмір діапазону: 2<sup>8</sup> - 2 = 254
Зсув смуги: `min(max(16, 256/16), 256)` = `min(16, 256)` = 16
Початок статичної смуги: 10.96.0.1
Кінець статичної смуги: 10.96.0.16
Кінець діапазону: 10.96.0.254

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "Статичний" : 16
    "Динамічний" : 238
{{< /mermaid >}}

### Приклад 2 {#allocation-example-2}

У цьому прикладі використовується діапазон IP-адрес: 10.96.0.0/20 (нотація CIDR) для IP-адрес Services.

Розмір діапазону: 2<sup>12</sup> - 2 = 4094
Зсув смуги: `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256
Початок статичної смуги: 10.96.0.1
Кінець статичної смуги: 10.96.1.0
Кінець діапазону: 10.96.15.254

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "Статичний" : 256
    "Динамічний" : 3838
{{< /mermaid >}}

### Приклад 3 {#allocation-example-3}

У цьому прикладі використовується діапазон IP-адрес: 10.96.0.0/16 (нотація CIDR) для IP-адрес Services.

Розмір діапазону: 2<sup>16</sup> - 2 = 65534
Зсув смуги: `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256
Початок статичної смуги: 10.96.0.1
Кінець статичної смуги: 10.96.1.0
Кінець діапазону: 10.96.255.254

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "Статичний" : 256
    "Динамічний" : 65278
{{< /mermaid >}}

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся про [політику зовнішнього трафіку Service](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Дізнайтеся про [підключення застосунків за допомогою Services](/docs/tutorials/services/connect-applications-service/)
* Дізнайтеся про [Services](/docs/concepts/services-networking/service/)
