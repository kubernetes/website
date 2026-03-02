---
title: Використання Source IP
content_type: tutorial
min-kubernetes-server-version: v1.5
weight: 40
---

<!-- overview -->

Застосунки, що працюють у кластері Kubernetes, знаходять і взаємодіють один з одним та з зовнішнім світом через абстракцію Service. У цьому документі пояснюється, що відбувається з Source IP пакетів, надісланих на різні типи Service, і як ви можете змінити цю поведінку відповідно до ваших потреб.

## {{% heading "prerequisites" %}}

### Терміни {#terminology}

У цьому документі використовуються наступні терміни:

{{< comment >}}
Якщо цей розділ локалізується, посилання повинні вказувати на відповідні сторінки Вікіпедії для цільової локалізації.
{{< /comment >}}

[NAT](https://uk.wikipedia.org/wiki/NAT)
: Трансляція мережевих адрес

[Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)
: Заміна Source IP в пакеті; у цьому документі це зазвичай означає заміну на IP-адресу вузла.

[Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)
: Заміна Destination IP в пакеті; у цьому документі це зазвичай означає заміну на IP-адресу {{< glossary_tooltip term_id="pod" >}}

[VIP](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: Віртуальна IP-адреса, така як та, що призначається кожному {{< glossary_tooltip text="Service" term_id="service" >}} у Kubernetes

[kube-proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: Мережевий демон, який оркеструє управління віртуальними IP Service на кожному вузлі

### Необхідні умови {#prerequisites}

{{< include "task-tutorial-prereqs.md" >}}

У прикладах використовується невеликий вебсервер nginx, який повертає Source IP запитів, які він отримує через HTTP-заголовок. Ви можете створити його наступним чином:

{{< note >}}
Образ у наступній команді працює лише на архітектурах AMD64.
{{< /note >}}

```shell
kubectl create deployment source-ip-app --image=registry.k8s.io/echoserver:1.10
```

Результат:

```none
deployment.apps/source-ip-app created
```

## {{% heading "objectives" %}}

* Експонувати простий застосунок через різні типи Serviceʼів
* Зрозуміти, як кожен тип Services обробляє Source IP NAT
* Зрозуміти компроміси, повʼязані зі збереженням Source IP

<!-- lessoncontent -->

## Source IP для Service з `Type=ClusterIP` {#source-ip-for-services-with-type-clusterip}

Пакети, надіслані на ClusterIP зсередини кластера, ніколи не обробляються Source NAT, якщо ви використовуєте kube-proxy в [iptables mode](/docs/reference/networking/virtual-ips/#proxy-mode-iptables), (станартно). Ви можете запитати режим kube-proxy, отримавши `http://localhost:10249/proxyMode` на вузлі, де працює kube-proxy.

```console
kubectl get nodes
```

Результат схожий на цей:

```none
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

Отримати режим проксі на одному з вузлів (kube-proxy слухає на порту 10249):

```shell
# Запустіть це в оболонці на вузлі, який хочете запитати.
curl http://localhost:10249/proxyMode
```

Результат:

```none
iptables
```

Ви можете протестувати збереження Source IP, створивши Service над source-ip застосунку:

```shell
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```

Результат:

```none
service/clusterip exposed
```

```shell
kubectl get svc clusterip
```

Результат схожий на:

```none
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

І звернутися до `ClusterIP` з Pod в тому ж кластері:

```shell
kubectl run busybox -it --image=busybox:1.28 --restart=Never --rm
```

Результат схожий на цей:

```none
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

```

Ви можете виконати команду всередині цього Pod:

```shell
# Запустіть це всередині терміналу "kubectl run"
ip addr
```

```none
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc noqueue
    link/ether 0a:58:0a:f4:03:08 brd ff:ff:ff:ff:ff:ff
    inet 10.244.3.8/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::188a:84ff:feb0:26a5/64 scope link
       valid_lft forever preferred_lft forever
```

…потім використовувати `wget` для надсилання запиту до локального вебсервера

```shell
# Замініть "10.0.170.92" на IPv4-адресу сервісу "clusterip"
wget -qO - 10.0.170.92
```

```none
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```

`client_address` завжди є IP-адресою Podʼа-клієнта, незалежно від того, знаходяться Pod-клієнт і Pod-сервер на одному вузлі чи на різних вузлах.

## Source IP для Service з `Type=NodePort` {#source-ip-for-services-with-type-nodeport}

Пакети, надіслані на Serviceʼи з [`Type=NodePort`](/docs/concepts/services-networking/service/#type-nodeport), типово обробляються Source NAT. Ви можете протестувати це, створивши Service `NodePort`:

```shell
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```

Результат:

```none
service/nodeport exposed
```

```shell
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
```

Якщо ви працюєте на хмарному провайдері, можливо, вам доведеться відкрити правило брандмауера для `nodes:nodeport`, зазначеного вище. Тепер ви можете спробувати звернутися до сервісу ззовні кластера через вказаний вище порт вузла.

```shell
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```

Результат схожий на:

```none
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

Зверніть увагу, що це не правильні IP клієнтів, це внутрішні IP кластера. Це відбувається так:

* Клієнт надсилає пакет до `node2:nodePort`
* `node2` замінює Source IP-адресу (SNAT) у пакеті своєю власною IP-адресою
* `node2` замінює Destination IP-адресу пакета на IP Podʼа 
* пакет спрямовується до node 1, а потім до точки доступу
* відповідь Podʼа спрямовується назад до node2
* відповідь Podʼа надсилається клієнту

Візуально це виглядає так:

{{< mermaid >}}
graph LR;
  client(client)-->node2[Node 2];
  node2-->client;
  node2-. SNAT .->node1[Node 1];
  node1-. SNAT .->node2;
  node1-->endpoint(Endpoint);

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;
{{< /mermaid >}}

Схема. Source IP Type=NodePort з використанням SNAT

Щоб уникнути цього, Kubernetes має функцію [зберігати Source IP-адресу клієнта](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip). Якщо ви встановите для `service.spec.externalTrafficPolicy` значення `Local`, kube-proxy надсилає проксі-запити лише до локальних точок доступу та не пересилає трафік до інших вузлів. Цей підхід зберігає Source IP-адресу. Якщо немає локальних точок доступу, пакети, надіслані до вузла, відкидаються, тому ви можете покладатися на правильну Source IP-адресу в будь-яких правилах обробки пакетів, які ви можете застосувати до пакета, який проходить до точки доступу.

Встановіть значення поля `service.spec.externalTrafficPolicy` наступним чином:

```shell
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

Вивід має бути наступним:

```none
service/nodeport patched
```

Повторіть тест:

```shell
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```

Вивід подібний до:

```none
client_address=198.51.100.79
```

Зауважте, що ви отримали лише одну відповідь із *правильною* IP-адресою клієнта від одного вузла, на якому працює Pod точки доступу.

Ось що відбувається:

* клієнт надсилає пакет на `node2:nodePort`, який не має кінцевих точок
* пакет відкидається
* клієнт надсилає пакет на `node1:nodePort`, який *має* точки доступу
* node1 направляє пакет до точки доступу з правильною Source IP-адресою

Візуально:

{{< mermaid >}}
graph TD;
  client(client)-->node1[Node 1];
  client(client)-->node2[Node 2];
  node1-->endpoint(Endpoint);
  endpoint(Endpoint)-->node1;

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;

{{< /mermaid >}}
Схема. Source IP Type=NodePort зберігає Source IP клієнта

## Source IP для Service з `Type=LoadBalancer` {#source-ip-for-services-with-type-loadbalancer}

Пакети, які надсилаються на Service з [`Type=LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer), стандартно мають Source NAT адресацію, оскільки всі можливі для планування вузли Kubernetes у стані `Ready` мають право на навантаження рівномірного розподілу трафіку. Якщо пакети надходять на вузол без точки доступу, система передає їх на вузол *з* точкою доступу, замінюючи адресу Source IP на пакеті на IP-адресу вузла (як описано у попередньому розділі).

Ви можете перевірити це, експонувавши застосунок source-ip-app через балансувальник навантаження:

```shell
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```

Результат виглядає наступним чином:

```none
service/loadbalancer exposed
```

Виведіть IP-адреси Service:

```console
kubectl get svc loadbalancer
```

Вивід подібний наступному:

```none
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   203.0.113.140     80/TCP    5m
```

Потім надішліть запит на зовнішню IP-адресу цього Service:

```shell
curl 203.0.113.140
```

Вивід подібний наступному:

```none
CLIENT VALUES:
client_address=10.240.0.5
...
```

Однак, якщо ви працюєте на середовищі Google Kubernetes Engine/GCE, встановлення поля `service.spec.externalTrafficPolicy` на значення `Local` змушує вузли *без* точок доступу Service видаляти себе зі списку вузлів, які мають право на рівномірно розподілений трафік, шляхом умисної невдачі перевірок стану.

Візуально:

![IP-адреса джерела з externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)

Ви можете перевірити це, встановивши анотацію:

```shell
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

Ви повинні негайно побачити, що поле `service.spec.healthCheckNodePort` виділене Kubernetes:

```shell
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```

Вивід подібний наступному:

```yaml
  healthCheckNodePort: 32122
```

Поле `service.spec.healthCheckNodePort` вказує на порт на кожному вузлі, на якому надається перевірка стану за адресою `/healthz`. Ви можете перевірити це:

```shell
kubectl get pod -o wide -l app=source-ip-app
```

Вивід подібний наступному:

```none
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```

Використовуйте `curl`, щоб отримати доступ до точки доступу `/healthz` на різних вузлах:

```shell
# Виконайте це локально на вузлі, який ви вибрали
curl localhost:32122/healthz
```

```none
1 Service Endpoints found
```

На іншому вузлі ви можете отримати інший результат:

```shell
# Виконайте це локально на вузлі, який ви вибрали
curl localhost:32122/healthz
```

```nnone
No Service Endpoints Found
```

Контролер, який працює на {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} відповідає за доступ до хмарного балансувальника навантаження. Той самий контролер також виділяє HTTP перевірки стану, що вказують на цей порт/шлях на кожному вузлі. Зачекайте приблизно 10 секунд, щоб вузли без точок доступу мають невдалі перевірки стану, а потім використовуйте `curl`, щоб запитати IPv4-адресу балансувальника навантаження:

```shell
curl 203.0.113.140
```

Вивід подібний наступному:

```none
CLIENT VALUES:
client_address=198.51.100.79
...
```

## Міжплатформна підтримка {#cross-platform-support}

Тільки деякі хмарні постачальники пропонують підтримку збереження Source IP-адреси через Serviceʼи з `Type=LoadBalancer`. Хмарний постачальник, на якому ви працюєте, може виконати запит на надання балансувальника навантаження кількома різними способами:

1. З проксі, що завершує зʼєднання клієнта та відкриває нове зʼєднання з вашими вузлами/точками доступу. У таких випадках Source IP-адреса завжди буде адресою хмарного балансувальника, а не адресою клієнта.

2. З сервісом пересилання пакетів (forwarder), таким чином, що запити від клієнта, надісліна до VIP балансувальника, потрапляють на вузол з Source IP-адресою клієнта, а не на проміжний проксі.

Балансувальники навантаження у першій категорії повинні використовувати узгоджений протокол між балансувальником навантаження та бекендом для передачі реальної IP-адреси клієнта, такі як HTTP [Forwarded](https://tools.ietf.org/html/rfc7239#section-5.2) або [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For) заголовки, або [протокол проксі](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt). Балансувальники навантаження у другій категорії можуть використовувати функціонал, описаний вище, створюючи HTTP перевірку стану, що вказує на порт, збережений у полі `service.spec.healthCheckNodePort` Serviceʼа.

## {{% heading "cleanup" %}}

Видаліть Serviceʼи:

```shell
kubectl delete svc -l app=source-ip-app
```

Видаліть Deployment, ReplicaSet та Pod:

```shell
kubectl delete deployment source-ip-app
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/)
* Прочитайте, як [Створення зовнішнього балансувальника навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/)
