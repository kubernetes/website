---
layout: blog
title: "Kubernetes v1.33: Продовження переходу від Endpoints до EndpointSlices"
slug: endpoints-deprecation
date: 2025-04-24T10:30:00-08:00
author: >
  Dan Winship (Red Hat)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Відтоді як [EndpointSlices] ([KEP-752]) з’явились у версії v1.15 як alpha, а згодом стали стабільними (GA) у v1.21, API Endpoints у Kubernetes поступово втрачало актуальність. Нові можливості Service, як-от [dual-stack networking] та [traffic distribution], підтримуються лише через API EndpointSlice, тож усі проксі-сервери сервісів, реалізації Gateway API та подібні контролери мусили перейти від використання Endpoints до EndpointSlices. Станом на сьогодні API Endpoints зберігається здебільшого задля сумісності — щоб не ламати робочі навантаження та скрипти користувачів, які досі його використовують.

Починаючи з Kubernetes 1.33, API Endpoints офіційно оголошено застарілим, і API-сервер повертатиме попередження користувачам, які читають або записують ресурси Endpoints замість використання EndpointSlices.

Зрештою, згідно з [KEP-4974], план полягає в тому, щоб змінити критерії [Kubernetes Conformance], вилучивши з вимог обов’язкове використання _контролера Endpoints_ (який генерує об’єкти Endpoints на основі Services і Pods), аби уникнути зайвої роботи в більшості сучасних кластерів.

Отже, хоча згідно з [політикою застарівання Kubernetes] тип Endpoints, ймовірно, ніколи не буде повністю вилучено, користувачам, які досі мають робочі навантаження або скрипти, що використовують API Endpoints, слід починати їх перенесення на EndpointSlices.

[EndpointSlices]: /blog/2020/09/02/scaling-kubernetes-networking-with-endpointslices/
[KEP-752]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0752-endpointslices/README.md
[dual-stack networking]: /docs/concepts/services-networking/dual-stack/
[traffic distribution]: /docs/reference/networking/virtual-ips/#traffic-distribution
[політикою застарівання Kubernetes]: /docs/reference/using-api/deprecation-policy/
[KEP-4974]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4974-deprecate-endpoints/README.md
[Kubernetes Conformance]: https://www.cncf.io/training/certification/software-conformance/

## Примітки щодо міграції з Endpoints до EndpointSlices {#notes-on-migrating-from-endpoints-to-endpointslices}

### Використання EndpointSlices замість Endpoints {#consuming-endpointslices-rather-than-endpoints}

Для кінцевих користувачів найбільшою відмінністю між API Endpoints та API EndpointSlice є те, що кожен Service із `selector` має рівно один об’єкт Endpoints (з такою ж назвою, як і сам Service), тоді як у нього може бути будь-яка кількість пов’язаних EndpointSlice:

```console
$ kubectl get endpoints myservice
Warning: v1 Endpoints is deprecated in v1.33+; use discovery.k8s.io/v1 EndpointSlice
NAME        ENDPOINTS          AGE
myservice   10.180.3.17:443    1h

$ kubectl get endpointslice -l kubernetes.io/service-name=myservice
NAME              ADDRESSTYPE   PORTS   ENDPOINTS          AGE
myservice-7vzhx   IPv4          443     10.180.3.17        21s
myservice-jcv8s   IPv6          443     2001:db8:0123::5   21s
```

У цьому прикладі сервіс є двостековим (dual-stack), тому має два EndpointSlice: один для IPv4-адрес, інший — для IPv6. (Endpoints не підтримує dual-stack, тому виводить адреси лише у головному стеку кластера.)

Хоча будь-який Service з кількома endpointʼами _може_ мати кілька EndpointSlice, є три основні випадки, коли ви точно побачите це:

- EndpointSlice може представляти лише одну IP-сім’ю, тож dual-stack-сервіси матимуть окремі EndpointSlice для IPv4 та IPv6.

- Усі endpoints в одному EndpointSlice повинні мати однакові порти.
  Наприклад, якщо під час оновлення Podsʼи змінюють порт з 80 на 8080, то на час розгортання Service матиме два EndpointSlice: один для порту 80, інший — для 8080.

- Якщо в Service більше 100 endpointʼів, контролер EndpointSlice розділить їх на кілька об’єктів, щоб уникнути створення надто великого ресурсу — на відміну від Endpoints.

Оскільки немає передбачуваного співвідношення 1:1 між Service і EndpointSlice, неможливо заздалегідь знати імена пов’язаних EndpointSlice. Натомість, слід фільтрувати їх за [міткою](/docs/concepts/overview/working-with-objects/labels/) `kubernetes.io/service-name`, що вказує на назву сервісу:

```console
$ kubectl get endpointslice -l kubernetes.io/service-name=myservice
```

Подібні зміни потрібні й у Go-коді. Для Endpoints це виглядало так:

```go
// Отримати Endpoints з назвою `name` у просторі імен `namespace`.
endpoint, err := client.CoreV1().Endpoints(namespace).Get(ctx, name, metav1.GetOptions{})
if err != nil {
  if apierrors.IsNotFound(err) {
    // Endpoints для сервісу ще не існує
    ...
  }
        // обробка інших помилок
  ...
}

// обробка `endpoint`
...
```

Для EndpointSlice це буде:

```go
// Отримати всі EndpointSlice для сервісу `name` у просторі `namespace`.
slices, err := client.DiscoveryV1().EndpointSlices(namespace).List(ctx,
  metav1.ListOptions{LabelSelector: discoveryv1.LabelServiceName + "=" + name})
if err != nil {
        // обробка помилок
  ...
} else if len(slices.Items) == 0 {
  // EndpointSlices для сервісу ще не існує
  ...
}

// обробка `slices.Items`
...
```

### Генерація EndpointSlices замість Endpoints {#generating-endpointslices-rather-than-endpoints}

Для користувачів або контролерів, які створюють об’єкти Endpoints, перехід на EndpointSlices зазвичай є простішим, оскільки в більшості випадків не потрібно опрацьовувати кілька sliceʼів. Достатньо оновити YAML або Go-код, щоб використовувати новий тип (із трохи зміненою структурою).

Наприклад, цей об’єкт Endpoints:

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: myservice
subsets:
  - addresses:
      - ip: 10.180.3.17
        nodeName: node-4
      - ip: 10.180.5.22
        nodeName: node-9
      - ip: 10.180.18.2
        nodeName: node-7
    notReadyAddresses:
      - ip: 10.180.6.6
        nodeName: node-8
    ports:
      - name: https
        protocol: TCP
        port: 443
```

можна переписати як:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: myservice
  labels:
    kubernetes.io/service-name: myservice
addressType: IPv4
endpoints:
  - addresses:
      - 10.180.3.17
    nodeName: node-4
  - addresses:
      - 10.180.5.22
    nodeName: node-9
  - addresses:
      - 10.180.18.12
    nodeName: node-7
  - addresses:
      - 10.180.6.6
    nodeName: node-8
    conditions:
      ready: false
ports:
  - name: https
    protocol: TCP
    port: 443
```

Основні моменти:

1. У цьому прикладі явно вказано `name`, але можна використати `generateName`, і API-сервер сам додасть унікальний суфікс. Назва об’єкта не має значення — важлива мітка `"kubernetes.io/service-name"`, що вказує на Service.

2. Необхідно явно вказати `addressType: IPv4` (або `IPv6`).

3. Один EndpointSlice відповідає одному елементу масиву `"subsets"` в Endpoints. Якщо Endpoints мав кілька `subsets`, треба створити кілька EndpointSlice з різними `"ports"`.

4. Поля `endpoints` і `addresses` — масиви, але зазвичай `addresses` містить лише один елемент. Якщо сервіс має кілька endpointʼів — це мають бути окремі елементи масиву `endpoints`, кожен з одним `addresses`.

5. В Endpoints "готові" й "не готові" адреси розділено, тоді як в EndpointSlice кожен endpoint може мати атрибут `conditions` (наприклад, `ready: false`).

І, звісно, після переходу на EndpointSlice, можна використовувати специфічні для нього можливості, наприклад, _topology hints_ чи _terminating endpoints_. Докладніше в [документації до API EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1).
