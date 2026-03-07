---
title: Налагодження розвʼязання імен DNS
content_type: task
min-kubernetes-server-version: v1.6
weight: 170
---

<!-- overview -->

Ця сторінка надає вказівки щодо діагностування проблем DNS.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Ваш кластер повинен бути налаштований на використання {{< glossary_tooltip text="надбудови" term_id="addons" >}} CoreDNS або її попередника, kube-dns.

{{% version-check %}}

<!-- steps -->

### Створіть простий Pod для використання як тестове середовище {#create-a-simple-pod-to-use-as-a-test-environment}

{{% code_sample file="admin/dns/dnsutils.yaml" %}}

{{< note >}}
У цьому прикладі створюється Pod у просторі імен `default`. Розпізнавання DNS-імені для сервісів залежить від простору імен Podʼа. Для отримання додаткової інформації перегляньте [DNS для Service and Pod](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names).
{{< /note >}}

Використайте цей маніфест, щоб створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```

```none
pod/dnsutils created
```

…і перевірте його статус:

```shell
kubectl get pods dnsutils
```

```none
NAME       READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

Після того, як цей Pod працює, ви можете виконати `nslookup` в цьому середовищі. Якщо ви бачите щось схоже на наступне, DNS працює правильно.

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

```none
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

Якщо команда `nslookup` не вдається, перевірте наступне:

### Спочатку перевірте локальну конфігурацію DNS {#check-the-local-dns-configuration-first}

Подивіться всередину файлу resolv.conf. (Див. [Налаштування служби DNS](/docs/tasks/administer-cluster/dns-custom-nameservers) та [Відомі проблеми](#known-issues) нижче для отримання додаткової інформації)

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

Перевірте, що шлях пошуку та імʼя сервера налаштовані так, як показано нижче (зверніть увагу, що шлях пошуку може відрізнятися для різних постачальників хмарних послуг):

```conf
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

Помилки, такі як наведені нижче, вказують на проблему з CoreDNS (або kube-dns) або з повʼязаними службами:

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

```none
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

або

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

### Перевірте, чи працює Pod DNS {#check-if-the-pod-dns-is-running}

Використайте команду `kubectl get pods`, щоб перевірити, що Pod DNS працює.

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```

```none
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

{{< note >}}
Значення для мітки `k8s-app` — `kube-dns` для розгортання як CoreDNS, так і kube-dns.
{{< /note >}}

Якщо ви бачите, що жоден Pod CoreDNS не працює або що Pod несправний/завершено, надбудова DNS може не бути типово розгорнута у вашому поточному середовищі та вам доведеться розгорнути його вручну.

### Перевірка помилок у Podʼі DNS {#check-for-errors-in-the-dns-pod}

Використайте команду `kubectl logs`, щоб переглянути логи контейнерів DNS.

Для CoreDNS:

```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

Ось приклад здорових журналів CoreDNS:

```none
.:53
2018/08/15 14:37:17 [INFO] CoreDNS-1.2.2
2018/08/15 14:37:17 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.2
linux/amd64, go1.10.3, 2e322f6
2018/08/15 14:37:17 [INFO] plugin/reload: Running configuration MD5 = 24e6c59e83ce706f07bcc82c31b1ea1c
```

Перегляньте, чи є будь-які підозрілі або несподівані повідомлення у логах.

### Чи працює служба DNS? {#is-dns-service-up}

Перевірте, чи працює служба DNS за допомогою команди `kubectl get service`.

```shell
kubectl get svc --namespace=kube-system
```

```none
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns     ClusterIP   10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

{{< note >}}
Назва служби — `kube-dns` як для розгортання CoreDNS, так і для kube-dns.
{{< /note >}}

Якщо ви створили Service або у випадку, якщо вона повинна типово створюватися, але вона не зʼявляється, див. [налагодження Service](/docs/tasks/debug/debug-application/debug-service/) для отримання додаткової інформації.

### Чи відкриті точки доступу DNS? {#are-dns-endpoints-exposed}

Ви можете перевірити, чи викриті точки доступу DNS, використовуючи команду `kubectl get endpointslice`.

```shell
kubectl get endpointslice -l kubernetes.io/service-name=kube-dns --namespace=kube-system
```

```none
NAME             ADDRESSTYPE   PORTS   ENDPOINTS                  AGE
kube-dns-zxoja   IPv4          53      10.180.3.17,10.180.3.17    1h
```

Якщо ви не бачите точки доступу, дивіться розділ про точки доступу у документації [налагодження Service](/docs/tasks/debug/debug-application/debug-service/).

### Чи надходять/обробляються DNS-запити? {#are-dns-queries-being-received-processed}

Ви можете перевірити, чи надходять запити до CoreDNS, додавши втулок `log` до конфігурації CoreDNS (тобто файлу Corefile). Файл CoreDNS Corefile зберігається у {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} з назвою `coredns`. Щоб редагувати його, використовуйте команду:

```shell
kubectl -n kube-system edit configmap coredns
```

Потім додайте `log` у розділ Corefile, як показано у прикладі нижче:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        log
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          upstream
          fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

Після збереження змін може знадобитися до хвилини або двох, щоб Kubernetes поширив ці зміни на Podʼи CoreDNS.

Далі зробіть кілька запитів і перегляньте логи, як показано у попередніх розділах цього документа. Якщо Podʼи CoreDNS отримують запити, ви повинні побачити їх в логах.

Ось приклад запиту у логах:

```log
.:53
2018/08/15 14:37:15 [INFO] CoreDNS-1.2.0
2018/08/15 14:37:15 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.0
linux/amd64, go1.10.3, 2e322f6
2018/09/07 15:29:04 [INFO] plugin/reload: Running configuration MD5 = 162475cdf272d8aa601e6fe67a6ad42f
2018/09/07 15:29:04 [INFO] Reloading complete
172.17.0.18:41675 - [07/Sep/2018:15:29

:11 +0000] 59925 "A IN kubernetes.default.svc.cluster.local. udp 54 false 512" NOERROR qr,aa,rd,ra 106 0.000066649s
```

### Чи має CoreDNS достатні дозволи? {#does-coredns-have-sufficient-permissions}

CoreDNS повинен мати можливість переглядати повʼязані {{< glossary_tooltip text="Service" term_id="service" >}} та {{< glossary_tooltip text="endpointslice" term_id="endpoint-slice" >}} ресурси для правильного розпізнавання імен служб.

Приклад повідомлення про помилку:

```log
2022-03-18T07:12:15.699431183Z [INFO] 10.96.144.227:52299 - 3686 "A IN serverproxy.contoso.net.cluster.local. udp 52 false 512" SERVFAIL qr,aa,rd 145 0.000091221s
```

Спочатку отримайте поточну ClusterRole `system:coredns`:

```shell
kubectl describe clusterrole system:coredns -n kube-system
```

Очікуваний вивід:

```none
PolicyRule:
  Resources                        Non-Resource URLs  Resource Names  Verbs
  ---------                        -----------------  --------------  -----
  endpoints                        []                 []              [list watch]
  namespaces                       []                 []              [list watch]
  pods                             []                 []              [list watch]
  services                         []                 []              [list watch]
  endpointslices.discovery.k8s.io  []                 []              [list watch]
```

Якщо відсутні будь-які дозволи, відредагуйте ClusterRole, щоб додати їх:

```shell
kubectl edit clusterrole system:coredns -n kube-system
```

Приклад вставки дозволів для EndpointSlices:

```yaml
...
- apiGroups:
  - discovery.k8s.io
  resources:
  - endpointslices
  verbs:
  - list
  - watch
...
```

### Чи ви у правильному просторі імен для служби? {#are-you-in-the-right-namespace-for-the-service}

DNS-запити, які не вказують простір імен, обмежені простором імен Podʼа.

Якщо простір імен Podʼа та Service відрізняються, DNS-запит повинен включати простір імен Service.

Цей запит обмежений простором імен Podʼа:

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>
```

Цей запит вказує простір імен:

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>.<namespace>
```

Щоб дізнатися більше про розпізнавання імен, дивіться [DNS для Service та Pod](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names).

## Відомі проблеми {#known-issues}

Деякі дистрибутиви Linux (наприклад, Ubuntu) стандартно використовують локальний резолвер DNS (systemd-resolved). Systemd-resolved переміщує та замінює `/etc/resolv.conf` на файл-заглушку, що може спричинити фатальний цикл переспрямовування при розпізнаванні імен на вихідних серверах. Це можна виправити вручну, використовуючи прапорець `--resolv-conf` kubelet, щоб вказати правильний `resolv.conf` (з `systemd-resolved` це `/run/systemd/resolve/resolv.conf`). kubeadm автоматично визначає `systemd-resolved` та налаштовує відповідні прапорці kubelet.

Установки Kubernetes не налаштовують файли `resolv.conf` вузлів для використання кластерного DNS стандартно, оскільки цей процес властивий для певного дистрибутиву. Це, можливо, має бути реалізовано надалі.

У Linux бібліотека libc (відома як glibc) має обмеження для записів `nameserver` DNS на 3 стандартно, і Kubernetes потрібно використовувати 1 запис `nameserver`. Це означає, що якщо локальна установка вже використовує 3 `nameserver`, деякі з цих записів будуть втрачені. Щоб обійти це обмеження, вузол може запускати `dnsmasq`, який надасть більше записів `nameserver`. Ви також можете використовувати прапорець `--resolv-conf` kubelet.

Якщо ви використовуєте Alpine версії 3.17 або раніше як базовий образ, DNS може працювати неправильно через проблему з дизайном Alpine. До версії musl 1.24 не включено резервне перемикання на TCP для stub-резолвера DNS, що означає, що будь-який виклик DNS понад 512 байтів завершиться невдачею. Будь ласка, оновіть свої образи до версії Alpine 3.18 або вище.

## {{% heading "whatsnext" %}}

- Дивіться [Автомасштабування служби DNS в кластері](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- Читайте [DNS для Service та Pod](/docs/concepts/services-networking/dns-pod-service/)
