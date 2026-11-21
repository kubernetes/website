---
title: Використання Source IP
content_type: tutorial
min-kubernetes-server-version: v1.5
weight: 40
---

<!-- overview -->

Застосунки, що працюють у кластері Kubernetes, виявляють одне одного та взаємодіють між собою й із зовнішнім світом через абстракцію Service. У цьому документі пояснюється, що відбувається з Source IP пакетів, надісланих на різні типи Service, і як ви можете змінити цю поведінку відповідно до ваших потреб.

## {{% heading "prerequisites" %}} {#before-you-begin}

### Терміни {#terminology}

У цьому документі використовуються такі терміни:

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
: Мережевий демон, який керує віртуальними IP Service на кожному вузлі

### Необхідні умови {#prerequisites}

{{< include "task-tutorial-prereqs.md" >}}

У прикладах використовується невеликий вебсервер nginx, який повертає Source IP отриманих запитів через HTTP-заголовок. Ви можете створити його так:

{{< alert color="info" title="Примітка" >}}
Образ у цій команді працює лише на архітектурах AMD64.
{{< /alert >}}

```shell
kubectl create deployment source-ip-app --image=registry.k8s.io/echoserver:1.10
```

Результат:

```
deployment.apps/source-ip-app created
```

## {{% heading "objectives" %}} {#objectives}

* Відкрити доступ до простого застосунку через різні типи Service
* Зрозуміти, як кожен тип Service обробляє Source IP NAT
* Зрозуміти компроміси, повʼязані зі збереженням Source IP

<!-- lessoncontent -->

## Source IP для Service з `Type=ClusterIP` {#source-ip-for-services-with-type-clusterip}

Пакети, надіслані на ClusterIP зсередини кластера, ніколи не обробляються Source NAT, якщо kube-proxy працює в [режимі iptables](/docs/reference/networking/virtual-ips/#proxy-mode-iptables) (типовий режим). Режим kube-proxy можна дізнатися, запитавши `http://localhost:10249/proxyMode` на вузлі, де працює kube-proxy.

```console
kubectl get nodes
```

Результат схожий на цей:

```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

Отримайте режим проксі на одному з вузлів (kube-proxy слухає порт 10249):

```shell
# Запустіть це в оболонці на вузлі, який хочете запитати.
curl http://localhost:10249/proxyMode
```

Результат:

```
iptables
```

Ви можете протестувати збереження Source IP, створивши Service для застосунку source IP:

```shell
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```

Результат:

```
service/clusterip exposed
```

```shell
kubectl get svc clusterip
```

Результат схожий на:

```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

А також звернувшись до `ClusterIP` з Podʼа в тому самому кластері:

```shell
kubectl run busybox -it --image=busybox:1.28 --restart=Never --rm
```

Результат схожий на цей:

```
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

```

Потім ви можете виконати команду всередині цього Podʼа:

```shell
# Запустіть це всередині терміналу "kubectl run"
ip addr
```

```
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

…потім використайте `wget`, щоб надіслати запит до локального вебсервера

```shell
# Замініть "10.0.170.92" на IPv4-адресу Service з назвою "clusterip"
wget -qO - 10.0.170.92
```

```
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```

`client_address` завжди є IP-адресою Podʼа-клієнта, незалежно від того, чи перебувають Pod-клієнт і Pod-сервер на одному вузлі, чи на різних вузлах.

## Source IP для Service з `Type=NodePort` {#source-ip-for-services-with-type-nodeport}

Пакети, надіслані на Service з [`Type=NodePort`](/docs/concepts/services-networking/service/#type-nodeport), типово обробляються Source NAT. Ви можете протестувати це, створивши Service `NodePort`:

```shell
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```

Результат:

```
service/nodeport exposed
```

```shell
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
```

Якщо ви працюєте у хмарного провайдера, можливо, вам доведеться відкрити правило брандмауера для `nodes:nodeport`, зазначеного вище. Тепер ви можете спробувати звернутися до Service ззовні кластера через виділений вище порт вузла.

```shell
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```

Результат схожий на:

```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

Зверніть увагу, що це неправильні IP клієнтів, це внутрішні IP кластера. Ось що відбувається:

* Клієнт надсилає пакет до `node2:nodePort`
* `node2` замінює Source IP-адресу (SNAT) у пакеті своєю власною IP-адресою
* `node2` замінює Destination IP-адресу пакета на IP Podʼа
* пакет спрямовується до node 1, а потім до точки доступу
* відповідь Podʼа спрямовується назад до node2
* відповідь Podʼа надсилається клієнту

Візуально:

{{< figure src="/docs/images/tutor-service-nodePort-fig01.svg" alt="схема 01 source IP для nodeport" class="diagram-large" caption="Схема. Source IP Type=NodePort з використанням SNAT" link="https://mermaid.live/edit#pako:eNqNkV9rwyAUxb-K3LysYEqS_WFYKAzat9GHdW9zDxKvi9RoMIZtlH732ZjSbE970cu5v3s86hFqJxEYfHjRNeT5ZcUtIbXRaMNN2hZ5vrYRqt52cSXV-4iMSuwkZiYtyX739EqWaahMQ-V1qPxDVLNOvkYrO6fj2dupWMR2iiT6foOKdEZoS5Q2hmVSStoH7w7IMqXUVOefWoaG3XVftHbGeZYVRbH6ZXJ47CeL2-qhxvt_ucTe1SUlpuMN6CX12XeGpLdJiaMMFFr0rdAyvvfxjHEIDbbIgcVSohKDCRy4PUV06KQIuJU6OA9MCdMjBTEEt_-2NbDgB7xAGy3i97VJPP0ABRmcqg" >}}

Щоб уникнути цього, у Kubernetes є можливість [зберегти Source IP клієнта](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip). Якщо ви встановите для `service.spec.externalTrafficPolicy` значення `Local`, kube-proxy спрямовує запити лише до локальних точок доступу і не пересилає трафік до інших вузлів. Цей підхід зберігає початкову Source IP-адресу. Якщо локальних точок доступу немає, пакети, надіслані до вузла, відкидаються, тому ви можете покладатися на правильну Source IP-адресу в будь-яких правилах обробки пакетів, які ви можете застосувати до пакета, що проходить до точки доступу.

Встановіть поле `service.spec.externalTrafficPolicy` так:

```shell
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

Вивід:

```
service/nodeport patched
```

Повторіть тест:

```shell
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```

Вивід подібний до:

```
client_address=198.51.100.79
```

Зауважте, що ви отримали лише одну відповідь із *правильною* IP-адресою клієнта від одного вузла, на якому працює Pod точки доступу.

Ось що відбувається:

* клієнт надсилає пакет на `node2:nodePort`, який не має точок доступу
* пакет відкидається
* клієнт надсилає пакет на `node1:nodePort`, який *має* точки доступу
* node1 направляє пакет до точки доступу з правильною Source IP-адресою

Візуально:

{{< figure src="/docs/images/tutor-service-nodePort-fig02.svg" alt="схема 02 source IP для nodeport" class="diagram-large" caption="Схема. Source IP Type=NodePort зберігає Source IP-адресу клієнта" link="" >}}

## Source IP для Service з `Type=LoadBalancer` {#source-ip-for-services-with-type-loadbalancer}

Пакети, надіслані на Service з [`Type=LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer), типово обробляються Source NAT, оскільки всі вузли Kubernetes, доступні для планування, у стані `Ready` можуть отримувати трафік від балансувальника навантаження. Тому якщо пакети надходять на вузол без точки доступу, система через проксі спрямовує їх на вузол *з* точкою доступу, замінюючи Source IP пакета на IP-адресу вузла (як описано в попередньому розділі).

Ви можете перевірити це, відкривши доступ до застосунку source-ip-app через балансувальник навантаження:

```shell
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```

Вивід:

```
service/loadbalancer exposed
```

Виведіть IP-адреси Service:

```console
kubectl get svc loadbalancer
```

Вивід подібний до цього:

```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   203.0.113.140     80/TCP    5m
```

Потім надішліть запит на зовнішню IP-адресу цього Service:

```shell
curl 203.0.113.140
```

Вивід подібний до цього:

```
CLIENT VALUES:
client_address=10.240.0.5
...
```

Однак якщо ви працюєте в Google Kubernetes Engine/GCE, встановлення того самого поля `service.spec.externalTrafficPolicy` у `Local` змушує вузли *без* точок доступу Service вилучати себе зі списку вузлів, які отримують трафік від балансувальника навантаження, навмисно не проходячи перевірки стану.

Візуально:

![Source IP з externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)

Ви можете перевірити це, встановивши анотацію:

```shell
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

Ви одразу побачите поле `service.spec.healthCheckNodePort`, виділене Kubernetes:

```shell
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```

Вивід подібний до цього:

```yaml
  healthCheckNodePort: 32122
```

Поле `service.spec.healthCheckNodePort` вказує на порт на кожному вузлі, на якому надається перевірка стану за адресою `/healthz`. Ви можете перевірити це:

```shell
kubectl get pod -o wide -l app=source-ip-app
```

Вивід подібний до цього:

```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```

Використайте `curl`, щоб запитати `/healthz` на різних вузлах:

```shell
# Виконайте це локально на вузлі, який ви вибрали
curl localhost:32122/healthz
```

```
1 Service Endpoints found
```

На іншому вузлі ви можете отримати інший результат:

```shell
# Виконайте це локально на вузлі, який ви вибрали
curl localhost:32122/healthz
```

```
No Service Endpoints Found
```

Контролер, який працює на {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}}, відповідає за виділення хмарного балансувальника навантаження. Той самий контролер також створює HTTP-перевірки стану, що вказують на цей порт/шлях на кожному вузлі. Зачекайте приблизно 10 секунд, поки 2 вузли без точок доступу не пройдуть перевірки стану, а потім за допомогою `curl` запитайте IPv4-адресу балансувальника навантаження:

```shell
curl 203.0.113.140
```

Вивід подібний до цього:

```
CLIENT VALUES:
client_address=198.51.100.79
...
```

## Міжплатформна підтримка {#cross-platform-support}

Лише деякі хмарні провайдери підтримують збереження Source IP-адреси через Service з `Type=LoadBalancer`. Ваш хмарний провайдер може виконати запит на балансувальник навантаження кількома способами:

1. З проксі, що завершує зʼєднання клієнта та відкриває нове зʼєднання з вашими вузлами/точками доступу. У таких випадках Source IP-адреса завжди буде адресою хмарного балансувальника, а не адресою клієнта.

2. За допомогою пересилача пакетів (packet forwarder), завдяки чому запити від клієнта, надіслані на VIP балансувальника, потрапляють на вузол із Source IP-адресою клієнта, а не проміжного проксі.

Балансувальники навантаження першої категорії повинні використовувати узгоджений між балансувальником навантаження та бекендом протокол для передачі справжньої IP-адреси клієнта, як-от заголовки HTTP [Forwarded](https://tools.ietf.org/html/rfc7239#section-5.2) або [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For), або [протокол proxy](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt). Балансувальники навантаження другої категорії можуть використовувати описану вище можливість, створюючи HTTP-перевірку стану, що вказує на порт, збережений у полі `service.spec.healthCheckNodePort` Service.

## {{% heading "cleanup" %}} {#cleaning-up}

Видаліть Service:

```shell
kubectl delete svc -l app=source-ip-app
```

Видаліть Deployment, ReplicaSet та Pod:

```shell
kubectl delete deployment source-ip-app
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/)
* Прочитайте про [Створення зовнішнього балансувальника навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/)
