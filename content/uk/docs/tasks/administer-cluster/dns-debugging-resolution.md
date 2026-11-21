---
title: Налагодження розвʼязання імен DNS
content_type: task
min-kubernetes-server-version: v1.6
weight: 170
---

<!-- overview -->

Ця сторінка надає вказівки щодо діагностування проблем DNS.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Ваш кластер повинен бути налаштований на використання {{< glossary_tooltip text="надбудови" term_id="addons" >}} CoreDNS.

{{% version-check %}}

<!-- steps -->

### Створіть простий Pod для використання як тестове середовище {#create-a-simple-pod-to-use-as-a-test-environment}

{{% code_sample file="admin/dns/dnsutils.yaml" %}}

{{< note >}}
У цьому прикладі створюється Pod у просторі імен `default`. Розвʼязання DNS-імен для Service залежить від простору імен Podʼа. Докладніше див. [DNS для Services та Podʼів](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names).
{{< /note >}}

Використайте цей маніфест, щоб створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```

```
pod/dnsutils created
```

…і перевірте його статус:

```shell
kubectl get pods dnsutils
```

```
NAME       READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

Коли цей Pod запрацює, ви можете виконати в цьому середовищі `nslookup`. Якщо ви бачите щось подібне до наведеного нижче, DNS працює правильно.

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

Якщо команда `nslookup` завершується невдачею, перевірте таке:

### Спочатку перевірте локальну конфігурацію DNS {#check-the-local-dns-configuration-first}

Подивіться вміст файлу resolv.conf. (Докладніше див. [Налаштування служби DNS](/docs/tasks/administer-cluster/dns-custom-nameservers) та [Відомі проблеми](#known-issues) нижче.)

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

Перевірте, що шлях пошуку та сервер імен налаштовані так, як показано нижче (зверніть увагу, що шлях пошуку може відрізнятися для різних хмарних провайдерів):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

Помилки, подібні до наведених нижче, вказують на проблему з надбудовою CoreDNS або з повʼязаними Service:

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

```
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

або

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

### Перевірте, чи працює Pod DNS {#check-if-the-dns-pod-is-running}

Використайте команду `kubectl get pods`, щоб перевірити, що Pod DNS працює.

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```

```
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

{{< note >}}
Значення для мітки `k8s-app` для CoreDNS — `kube-dns`, для зворотної сумісності з оригінальним kube-dns.
{{< /note >}}

Якщо ви бачите, що жоден Pod CoreDNS не працює або що Pod завершився з помилкою чи завершив роботу, надбудова DNS може бути стандартно не розгорнута у вашому поточному середовищі, і вам доведеться розгорнути її вручну.

### Перевірка помилок у Podʼі DNS {#check-for-errors-in-the-dns-pod}

Використайте команду `kubectl logs`, щоб переглянути логи контейнерів DNS.

Для CoreDNS:

```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

Ось приклад логу справного CoreDNS:

```
.:53
2018/08/15 14:37:17 [INFO] CoreDNS-1.2.2
2018/08/15 14:37:17 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.2
linux/amd64, go1.10.3, 2e322f6
2018/08/15 14:37:17 [INFO] plugin/reload: Running configuration MD5 = 24e6c59e83ce706f07bcc82c31b1ea1c
```

Перегляньте, чи є будь-які підозрілі або несподівані повідомлення у логах.

### Чи працює Service DNS? {#is-dns-service-up}

Перевірте, що Service DNS працює, за допомогою команди `kubectl get service`.

```shell
kubectl get svc --namespace=kube-system
```

```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns     ClusterIP   10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

{{< note >}}
Service для CoreDNS називається `kube-dns`, для зворотної сумісності з оригінальним kube-dns.
{{< /note >}}

Якщо ви створили Service або він мав бути створений стандартно, але не зʼявляється, докладніше див. [налагодження Service](/docs/tasks/debug/debug-application/debug-service/).

### Чи доступні точки доступу DNS? {#are-dns-endpoints-exposed}

Ви можете перевірити, чи доступні точки доступу DNS, за допомогою команди `kubectl get endpointslice`.

```shell
kubectl get endpointslice -l kubernetes.io/service-name=kube-dns --namespace=kube-system
```

```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS                  AGE
coredns-zxoja    IPv4          53      10.180.3.17,10.180.3.17    1h
```

Якщо ви не бачите точок доступу, див. розділ про точки доступу в документації [налагодження Service](/docs/tasks/debug/debug-application/debug-service/).

### Чи надходять/обробляються DNS-запити? {#are-dns-queries-being-received-processed}

Ви можете перевірити, чи надходять запити до CoreDNS, додавши втулок `log` до конфігурації CoreDNS (також відомої як Corefile). Corefile CoreDNS зберігається у {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} з назвою `coredns`. Щоб відредагувати його, використовуйте команду:

```
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

Після збереження змін може знадобитися хвилина-дві, поки Kubernetes поширить ці зміни на Podʼи CoreDNS.

Далі зробіть кілька запитів і перегляньте логи, як показано у попередніх розділах цього документа. Якщо Podʼи CoreDNS отримують запити, ви повинні побачити їх в логах.

Ось приклад запиту у логах:

```
.:53
2018/08/15 14:37:15 [INFO] CoreDNS-1.2.0
2018/08/15 14:37:15 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.0
linux/amd64, go1.10.3, 2e322f6
2018/09/07 15:29:04 [INFO] plugin/reload: Running configuration MD5 = 162475cdf272d8aa601e6fe67a6ad42f
2018/09/07 15:29:04 [INFO] Reloading complete
172.17.0.18:41675 - [07/Sep/2018:15:29:11 +0000] 59925 "A IN kubernetes.default.svc.cluster.local. udp 54 false 512" NOERROR qr,aa,rd,ra 106 0.000066649s
```

### Чи має CoreDNS достатні дозволи? {#does-coredns-have-sufficient-permissions}

CoreDNS повинен мати змогу отримувати перелік повʼязаних ресурсів {{< glossary_tooltip text="Service" term_id="service" >}} та {{< glossary_tooltip text="endpointslice" term_id="endpoint-slice" >}}, щоб правильно розвʼязувати імена Service.

Приклад повідомлення про помилку:

```
2022-03-18T07:12:15.699431183Z [INFO] 10.96.144.227:52299 - 3686 "A IN serverproxy.contoso.net.cluster.local. udp 52 false 512" SERVFAIL qr,aa,rd 145 0.000091221s
```

Спочатку отримайте поточну ClusterRole `system:coredns`:

```shell
kubectl describe clusterrole system:coredns -n kube-system
```

Очікуваний вивід:

```
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

```
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

### Чи ви в правильному просторі імен для Service? {#are-you-in-the-right-namespace-for-the-service}

DNS-запити, які не вказують простір імен, обмежені простором імен Podʼа.

Якщо простори імен Podʼа та Service відрізняються, DNS-запит повинен містити простір імен Service.

Цей запит обмежений простором імен Podʼа:

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>
```

Цей запит вказує простір імен:

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>.<namespace>
```

Докладніше про розвʼязання імен див. [DNS для Services та Podʼів](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names).

## Відомі проблеми {#known-issues}

Деякі дистрибутиви Linux (наприклад, Ubuntu) стандартно використовують локальний резолвер DNS (systemd-resolved). Systemd-resolved переміщує та замінює `/etc/resolv.conf` файлом-заглушкою, що може спричинити фатальний цикл пересилання під час розвʼязання імен на вищестоящих серверах. Це можна виправити вручну, використовуючи прапорець kubelet `--resolv-conf`, щоб вказати правильний `resolv.conf` (з `systemd-resolved` це `/run/systemd/resolve/resolv.conf`). kubeadm автоматично виявляє `systemd-resolved` і відповідно налаштовує прапорці kubelet.

Інсталяції Kubernetes стандартно не налаштовують файли `resolv.conf` вузлів на використання кластерного DNS, оскільки цей процес за своєю суттю залежить від дистрибутива. Імовірно, це зрештою слід реалізувати.

У Linux бібліотека libc (також відома як glibc) стандартно обмежує кількість записів DNS `nameserver` трьома, а Kubernetes потрібен 1 запис `nameserver`. Це означає, що якщо локальна інсталяція вже використовує 3 `nameserver`, деякі з цих записів буде втрачено. Щоб обійти це обмеження, на вузлі можна запустити `dnsmasq`, який надасть більше записів `nameserver`. Ви також можете використовувати прапорець kubelet `--resolv-conf`.

Якщо ви використовуєте Alpine версії 3.17 або старішої як базовий образ, DNS може працювати неправильно через проблему в дизайні Alpine. До версії 1.24 musl не мав резервного перемикання на TCP для stub-резолвера DNS, тому будь-який виклик DNS понад 512 байтів завершувався невдачею. Оновіть свої образи до Alpine версії 3.18 або новішої.

## {{% heading "whatsnext" %}} {#what-s-next}

- Див. [Автоматичне масштабування служби DNS в кластері](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- Прочитайте [DNS для Services та Podʼів](/docs/concepts/services-networking/dns-pod-service/)
