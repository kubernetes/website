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

Відтоді як [EndpointSlices] ([KEP-752]) зʼявились у версії v1.15 як alpha, а згодом стали стабільними (GA) у v1.21, API Endpoints у Kubernetes поступово втрачало актуальність. Нові можливості Service, як-от [двостекова мережа][dual-stack networking] та [розподіл трафіку][traffic distribution], підтримуються лише через API EndpointSlice, тож усі проксі-сервери сервісів, реалізації Gateway API та подібні контролери мусили перейти від використання Endpoints до EndpointSlices. Наразі API Endpoints існує фактично лише для того, щоб не ламати робочі навантаження та скрипти кінцевих користувачів, які досі його використовують.

Починаючи з Kubernetes 1.33, API Endpoints офіційно оголошено застарілим, і API-сервер повертатиме попередження користувачам, які читають або записують ресурси Endpoints замість використання EndpointSlices.

Зрештою, план (як описано в [KEP-4974]) полягає в тому, щоб змінити критерії [відповідності Kubernetes][Kubernetes Conformance] так, щоб вони більше не вимагали від кластерів запускати _контролер Endpoints_ (який генерує обʼєкти Endpoints на основі Service і Podʼів), аби уникнути роботи, яка не потрібна в більшості сучасних кластерів.

Отже, хоча згідно з [політикою застарівання Kubernetes][Kubernetes deprecation policy] тип Endpoints, ймовірно, ніколи не буде повністю вилучено, користувачам, які досі мають робочі навантаження або скрипти, що використовують API Endpoints, слід починати їх перенесення на EndpointSlices.

[EndpointSlices]: /blog/2020/09/02/scaling-kubernetes-networking-with-endpointslices/
[KEP-752]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0752-endpointslices/README.md
[dual-stack networking]: /docs/concepts/services-networking/dual-stack/
[traffic distribution]: /docs/reference/networking/virtual-ips/#traffic-distribution
[Kubernetes deprecation policy]: /docs/reference/using-api/deprecation-policy/
[KEP-4974]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4974-deprecate-endpoints/README.md
[Kubernetes Conformance]: https://www.cncf.io/training/certification/software-conformance/

## Примітки щодо міграції з Endpoints до EndpointSlices {#notes-on-migrating-from-endpoints-to-endpointslices}

### Використання EndpointSlices замість Endpoints {#consuming-endpointslices-rather-than-endpoints}

Для кінцевих користувачів найбільшою відмінністю між API Endpoints та API EndpointSlice є те, що кожен Service із `selector` має рівно один обʼєкт Endpoints (з такою ж назвою, як і сам Service), тоді як у нього може бути будь-яка кількість повʼязаних EndpointSlice:

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

У цьому прикладі сервіс є двостековим (dual-stack), тому має два EndpointSlice: один для IPv4-адрес, інший — для IPv6. (API Endpoints не підтримує подвійний стек, тому обʼєкт Endpoints показує лише адреси з основного сімейства адрес кластера.) Хоча будь-який Service з кількома точками доступу _може_ мати кілька EndpointSlice, є три основні випадки, коли ви це побачите:

  - EndpointSlice може представляти лише точки доступу одного сімейства IP, тож двостекові Service матимуть окремі EndpointSlice для IPv4 та IPv6.

  - Усі точки доступу в EndpointSlice мають бути спрямовані на однакові порти. Тож, наприклад, якщо у вас є набір Podʼів точок доступу, які слухають порт 80, і ви розгортаєте оновлення, щоб натомість вони слухали порт 8080, то поки розгортання триває, Service потребуватиме двох EndpointSlice: одного для точок доступу, що слухають порт 80, і одного для точок доступу, що слухають порт 8080.

  - Коли Service має понад 100 точок доступу, контролер EndpointSlice розділить їх на кілька EndpointSlice, замість того щоб обʼєднувати їх в один надмірно великий обʼєкт, як це робить контролер Endpoints.

Оскільки між Service і EndpointSlice немає передбачуваного відображення 1:1, неможливо заздалегідь дізнатися, якою буде фактична назва ресурсу (ресурсів) EndpointSlice для Service; тож замість того, щоб отримувати EndpointSlice за назвою, ви запитуєте всі EndpointSlice з [міткою](/docs/concepts/overview/working-with-objects/labels/) "`kubernetes.io/service-name`", що вказує на Service:

```console
$ kubectl get endpointslice -l kubernetes.io/service-name=myservice
```

Подібні зміни потрібні й у Go-коді. Для Endpoints це виглядало б приблизно так:

```go
// Отримати Endpoints з назвою `name` у просторі імен `namespace`.
endpoint, err := client.CoreV1().Endpoints(namespace).Get(ctx, name, metav1.GetOptions{})
if err != nil {
	if apierrors.IsNotFound(err) {
		// Для Service (ще?) не існує Endpoints
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
// Отримати всі EndpointSlice для Service `name` у просторі імен `namespace`.
slices, err := client.DiscoveryV1().EndpointSlices(namespace).List(ctx,
	metav1.ListOptions{LabelSelector: discoveryv1.LabelServiceName + "=" + name})
if err != nil {
        // обробка помилок
	...
} else if len(slices.Items) == 0 {
	// Для Service (ще?) не існує EndpointSlice
	...
}

// обробка `slices.Items`
...
```

### Генерація EndpointSlices замість Endpoints {#generating-endpointslices-rather-than-endpoints}

Для користувачів або контролерів, які створюють обʼєкти Endpoints, перехід на EndpointSlices дещо простіший, оскільки в більшості випадків не потрібно опрацьовувати кілька sliceʼів. Достатньо оновити YAML або Go-код, щоб використовувати новий тип (який організовує інформацію дещо інакше, ніж Endpoints).

Наприклад, цей обʼєкт Endpoints:

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

виглядатиме приблизно так:

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

Деякі моменти, на які слід звернути увагу:

1. У цьому прикладі явно вказано `name`, але можна використати `generateName`, і API-сервер сам додасть унікальний суфікс. Назва обʼєкта не має значення — важлива мітка `"kubernetes.io/service-name"`, що вказує на Service.

2. Необхідно явно вказати `addressType: IPv4` (або `IPv6`).

3. EndpointSlice подібний до одного елемента масиву `"subsets"` в Endpoints. Обʼєкт Endpoints з кількома підмножинами (subsets) зазвичай потрібно буде виразити як кілька EndpointSlice, кожен з іншими `"ports"`.

4. Поля `endpoints` і `addresses` — масиви, але за домовленістю кожен масив `addresses` містить лише один елемент. Якщо ваш Service має кілька точок доступу, вам потрібно мати кілька елементів у масиві `endpoints`, кожен з одним елементом у своєму масиві `addresses`.

5. API Endpoints перелічує «готові» та «неготові» точки доступу окремо, тоді як API EndpointSlice дозволяє кожній точці доступу мати повʼязані з нею стани (як-от "`ready: false`").

І, звісно, після переходу на EndpointSlice можна використовувати специфічні для нього можливості, як-от підказки топології та точки доступу, що завершують роботу. Докладніше в [документації до API EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1).
