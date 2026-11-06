---
layout: blog
title: "Kubernetes v1.36: Застарівання та видалення Service ExternalIPs"
date: 2026-05-14T10:35:00-08:00
slug: kubernetes-v1-36-deprecation-and-removal-of-service-externalips # optional
author: >
  Adrian Moisey (independent),
  Dan Winship (Red Hat),
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Поле `.spec.externalIPs` для [Service](/docs/concepts/services-networking/service/) було ранньою спробою забезпечити функціональність, подібну до балансувальника навантаження в хмарі, для кластерів без хмари. На жаль, API передбачає, що кожному користувачу в кластері повністю довіряють, і в будь-якій ситуації, коли це не так, це відкриває можливості для різних зловживань у системі безпеки, як описано в [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/).

Починаючи з Kubernetes 1.21, проєкт Kubernetes рекомендує усім користувачам вимкнути `.spec.externalIPs`. Щоб спростити цей процес, у Kubernetes також було додано контролер допуску (`DenyServiceExternalIPs`), який можна увімкнути для цього. На той час SIG Network вважала, що типове блокування цієї функціональності було б надто великою зміною, що порушує сумісність.

Однак проблеми безпеки все ще залишаються, і як проєкт ми все більше незадоволені тим, що ця можливість "типово небезпечна". Крім того, тепер існує кілька кращих альтернатив для кластерів без хмари, які бажають мати функціональність, подібну до балансувальника навантаження.

У результаті поле `.spec.externalIPs` для Service тепер офіційно визнано застарілим в Kubernetes 1.36. Ми очікуємо, що в майбутньому мінорному випуску Kubernetes реалізацію цієї поведінки буде видалено з `kube-proxy`, а критерії [відповідності](https://www.cncf.io/training/certification/software-conformance/) Kubernetes будуть оновлені, щоб вимагати, щоб відповідні реалізації **не надавали** таку підтримку.

## Примітка щодо термінології та того, що не застаріло {#terminology}

Фраза _external IP_ має дещо перевантажене значення в Kubernetes:

  - API Service має поле `.spec.externalIPs`, яке можна використовувати для додавання додаткових IP-адрес, на які Service буде відповідати.

  - API Node має поле `.status.addresses`, яке може містити адреси кількох різних типів, один з яких називається `ExternalIP`.

  - Інструмент `kubectl`, при виводі інформації про Service типу LoadBalancer у типовому форматі виводу, покаже IP-адресу балансувальника навантаження в стовпці з заголовком `EXTERNAL-IP`.

Це застарівання стосується саме першого з них. Якщо ви не задаєте поле `externalIPs` у жодному зі своїх Service, то це вас не стосується.

Проте, як запобіжний захід, ви все одно можете увімкнути контролер допуску [DenyServiceExternalIPs](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips), щоб заблокувати будь-яке майбутнє використання поля `externalIPs`.

## Альтернативи для `externalIPs` {#alternatives}

Якщо ви використовуєте `.spec.externalIPs`, то існує кілька альтернатив.

Розглянемо Service, як показано нижче:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  externalIPs:
    - "192.0.2.4"
```

### Використання вручну керованих Service типу LoadBalancer замість `externalIPs` {#alternative-LoadBalancer}

Найпростіший (але також найгірший) варіант — просто перейти від використання `externalIPs` до використання Service з `type: LoadBalancer` і призначення IP-адреси балансувальника навантаження вручну. Це, по суті, точно те ж саме, що і `externalIPs`, з однією важливою відмінністю: IP-адреса балансувальника навантаження є частиною `.status` Service, а не його `.spec`, і в кластері з увімкненим RBAC її типово не можуть редагувати звичайні користувачі. Таким чином, ця заміна для `externalIPs` буде доступна лише користувачам, яким адміністратори надали дозволи (хоча ці користувачі тоді будуть повністю уповноважені повторити CVE-2020-8554; все одно не буде жодних додаткових перевірок, щоб переконатися, що один користувач не краде IP-адреси іншого користувача тощо).

Через те, як працює `.status` у Kubernetes, спочатку потрібно створити Service без IP-адреси балансувальника навантаження, а потім додати IP як другий крок:

```console
$ cat loadbalancer-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  # prevent any real load balancer controllers from managing this service
  # by using a non-existent loadBalancerClass
  loadBalancerClass: non-existent-class
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
$ kubectl apply -f loadbalancer-service.yaml
service/my-example-service created
$ kubectl patch service my-example-service --subresource=status --type=merge -p '{"status":{"loadBalancer":{"ingress":[{"ip":"192.0.2.4"}]}}}'
```

### Використання контролера балансування навантаження, що працює не у хмарі {#alternative-load-balancer-controller}

Хоча Service типу `LoadBalancer` спочатку були розроблені для підтримки хмарних балансувальників навантаження, Kubernetes також може підтримувати їх на не хмарних платформах за допомогою стороннього контролера балансування навантаження, такого як [MetalLB](https://metallb.io/). Це вирішує проблеми безпеки, повʼязані з `externalIPs`, оскільки адміністратор може налаштувати, які діапазони IP-адрес контролер призначатиме Service, і контролер забезпечить, щоб два Service не могли одночасно використовувати одну й ту ж IP-адресу.

Отже, наприклад, після [встановлення](https://metallb.io/installation/) та [налаштування](https://metallb.io/configuration/) MetalLB, адміністратор кластера може налаштувати пул IP-адрес для використання в кластері:

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: production
  namespace: metallb-system
spec:
  addresses:
  - 192.0.2.0/24
  autoAssign: true
  avoidBuggyIPs: false
```

Після цього користувач може створити Service з `type: LoadBalancer`, і MetalLB обробить призначення IP-адреси. MetalLB навіть підтримує застаріле поле `loadBalancerIP` у Service, тому кінцевий користувач може запитати конкретну IP-адресу (за умови, що вона доступна) для зворотної сумісності з підходом `externalIPs`, замість того, щоб отримати її випадковим чином:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  loadBalancerIP: "192.0.2.4"
```

Подібні підходи працюватимуть і з іншими контролерами балансування навантаження. Цей підхід дозволяє адміністраторам кластера контролювати, які IP-адреси призначаються, замість того щоб це робили користувачі.

### Використання Gateway API {#alternative-gateway-api}

Ще одним потенційним рішенням є використання реалізації [Gateway API](https://gateway-api.sigs.k8s.io/).

Gateway API дозволяє адміністраторам кластера визначати ресурс Gateway, до якого можна прикріпити IP-адресу через поле `.spec.addresses`. Оскільки ресурси Gateway призначені для керування [адміністраторами кластера](https://gateway-api.sigs.k8s.io/concepts/security/), можна встановити правила RBAC, щоб лише привілейовані користувачі могли ними керувати.

Приклад того, як це може виглядати:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  addresses:
  - type: IPAddress
    value: "192.0.2.4"
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-route
spec:
  parentRefs:
  - name: example-gateway
  rules:
  - backendRefs:
    - name: example-svc
      port: 80
---
apiVersion: v1
kind: Service
metadata:
  name: example-svc
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

Проєкт Gateway API — це нове покоління API-інтерфейсів Kubernetes для Ingress, балансування навантаження та Service Mesh. Gateway API було створено з метою усунення недоліків ресурсів Service та Ingress, що робить його надзвичайно надійним і стабільним рішенням, яке наразі активно розвивається.

## План дій щодо припинення підтримки `externalIPs` {#timeline-for-externalips-deprecation}

Орієнтовний план дій щодо припинення підтримки виглядає так:

1. З випуском Kubernetes 1.36 поле було визнане застарілим; Kubernetes тепер видає [попередження](/blog/2020/09/03/warnings/), коли користувач використовує це поле
2. Приблизно через рік (v1.40 найраніше) підтримка `.spec.externalIPs` буде вимкнена в kube-proxy, але користувачі матимуть можливість повторно ввімкнути її, якщо їм знадобиться більше часу для міграції
3. Приблизно через ще один рік (v1.43 найраніше) підтримка буде повністю вимкнена; користувачі не матимуть можливості повторно ввімкнути її
