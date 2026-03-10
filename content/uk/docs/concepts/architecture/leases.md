---
title: Лізинг
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---

<!-- overview -->

Часто в розподілених системах є потреба в _лізингу_, яка забезпечує механізм блокування спільних ресурсів та координації дій між членами групи. В Kubernetes концепцію лізингу представлено обʼєктами [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) в {{< glossary_tooltip text="API Group" term_id="api-group" >}} `coordination.k8s.io`, які використовуються для критичних для системи можливостей, таких як час роботи вузлів та вибір лідера на рівні компонентів.

<!-- body -->

## Час роботи вузлів {#node-heart-beats}

Kubernetes використовує API Lease для звʼязку з пульсом kubelet вузла з  API сервером Kubernetes. Для кожного `Node` існує обʼєкт `Lease` з відповідним імʼям в просторі імен `kube-node-lease`. Під капотом кожен сигнал пульсу kubelet — це запит на **оновлення** цього обʼєкта `Lease`, який оновлює поле `spec.renewTime` для оренди. Панель управління Kubernetes використовує відмітку часу цього поля для визначення доступності цього вузла.

Дивіться [Обʼєкти Lease вузлів](/docs/concepts/architecture/nodes/#node-heartbeats) для отримання додаткових деталей.

## Вибір лідера {#leader-election}

Kubernetes також використовує лізинги для забезпечення того, що в будь-який момент часу працює лише один екземпляр компонента. Це використовується компонентами панелі управління, такими як `kube-controller-manager` та `kube-scheduler` в конфігураціях з високою доступністю, де лише один екземпляр компонента має активно працювати, тоді як інші екземпляри перебувають в режимі очікування.

Прочитайте [координовані вибори лідера](/docs/concepts/cluster-administration/coordinated-leader-election), щоб дізнатися про те, як Kubernetes використовує Lease API для вибору екземпляра компонента, який буде виконувати роль лідера.

## Ідентифікація API сервера {#api-server-identity}

{{< feature-state feature_gate_name="APIServerIdentity" >}}

Починаючи з Kubernetes v1.26, кожен `kube-apiserver` використовує API Lease для публікації своєї ідентичності для решти системи. Хоча це само по собі не є особливо корисним, це забезпечує механізм для клієнтів для визначення кількості екземплярів `kube-apiserver`, які керують панеллю управління Kubernetes. Наявність лізингів kube-apiserver дозволяє майбутнім можливостям, які можуть потребувати координації між кожним kube-apiserver.

Ви можете перевірити лізинги, якими володіє кожен kube-apiserver, перевіривши обʼєкти лізингу в просторі імен `kube-system` з іменем `apiserver-<sha256-hash>`. Або ви можете використовувати селектор міток `apiserver.kubernetes.io/identity=kube-apiserver`:

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
```

```none
NAME                                        HOLDER                                                                           AGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s

```

Хеш SHA256, який використовується в назвах лізингу, базується на імені ОС, які бачить цей API сервер. Кожен kube-apiserver повинен бути налаштований на використання унікального імені в межах кластера. Нові екземпляри kube-apiserver, які використовують те саме імʼя хоста, захоплюють наявні лізинги за допомогою нового ідентифікатора власника, замість того щоб створювати нові обʼєкти лізингу. Ви можете перевірити імʼя хоста, використовуючи kube-apiserver, перевіривши значення мітки `kubernetes.io/hostname`:

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```

```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```

Прострочені лізинги від kube-apiservers, які вже не існують, прибираються новими kube-apiservers через 1 годину.

Ви можете вимкнути лізинги ідентичності API сервера, вимкнувши [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `APIServerIdentity`.

## Робочі навантаження {#custom-workload}

Ваші власні робочі навантаження можуть визначити своє власне використання лізингів. Наприклад, ви можете запускати власний {{< glossary_tooltip term_id="controller" text="контролер" >}}, де первинний член чи лідер виконує операції, які його партнери не виконують. Ви визначаєте лізинг так, щоб репліки контролера могли вибирати чи обирати лідера, використовуючи API Kubernetes для координації. Якщо ви використовуєте лізинг, це гарна практика визначати імʼя лізингу, яке очевидно повʼязано з продуктом чи компонентом. Наприклад, якщо у вас є компонент з іменем Example Foo, використовуйте лізинг з іменем `example-foo`.

Якщо оператор кластера чи інший кінцевий користувач може розгортати кілька екземплярів компонента, виберіть префікс імʼя і виберіть механізм (такий як хеш від назви Deployment), щоб уникнути конфліктів імен для лізингів.

Ви можете використовувати інший підхід, поки він досягає того самого результату: відсутність конфліктів між різними програмними продуктами.
