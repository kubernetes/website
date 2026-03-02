---
title: Налаштування служби DNS
content_type: task
min-kubernetes-server-version: v1.12
weight: 160
---

<!-- overview -->

На цій сторінці пояснюється, як налаштувати ваші DNS {{< glossary_tooltip text="Pod" term_id="pod" >}} та настроїти процес розвʼязання імен DNS у вашому кластері.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Ваш кластер повинен працювати з надбудовою CoreDNS.

{{% version-check %}}

<!-- steps -->

## Вступ {#introduction}

DNS — це вбудована служба Kubernetes, яка автоматично запускається з допомогою _менеджера надбудов_ [cluster add-on](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md).

{{< note >}}
Служба CoreDNS називається `kube-dns` у полі `metadata.name`. Метою є забезпечення більшої сумісності з навантаженнями, які покладалися на старе імʼя служби `kube-dns` для розвʼязання адрес в межах кластера. Використання служби з іменем `kube-dns` абстрагує деталі реалізації
за цим загальним імʼям DNS-провайдера.
{{< /note >}}

Якщо ви працюєте з CoreDNS як з Deployment, його зазвичай викладають як Service Kubernetes зі статичною IP-адресою. Kubelet передає інформацію про резолвер DNS кожному контейнеру з прапорцем `--cluster-dns=<ір-адреса-dns-служби>`.

DNS-імена також потребують доменів. Ви налаштовуєте локальний домен в kubelet з прапорцем `--cluster-domain=<типовий-локальний-домен>`.

DNS-сервер підтримує прямий пошук (записи A та AAAA), пошук портів (записи SRV), зворотній пошук IP-адрес (записи PTR) та інші. Для отримання додаткової інформації дивіться [DNS для Service та Pod](/docs/concepts/services-networking/dns-pod-service/).

Якщо для Pod `dnsPolicy` встановлено значення `default`, він успадковує конфігурацію розвʼязку імен від вузла, на якому працює Pod. Розвʼязок імен Pod повинен поводитися так само як і на вузлі. Проте див. [Відомі проблеми](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues).

Якщо вам це не потрібно, або якщо ви хочете іншу конфігурацію DNS для Podʼів, ви можете використовувати прапорець `--resolv-conf` kubelet. Встановіть цей прапорець у `""` для того, щоб запобігти успадкуванню DNS від Podʼів. Встановіть його на дійсний шлях до файлу, щоб вказати файл, відмінний від `/etc/resolv.conf` для успадкування DNS.

## CoreDNS

CoreDNS — це універсальний авторитетний DNS-сервер, який може служити як кластерний DNS, відповідаючи [специфікаціям DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

### Опції ConfigMap CoreDNS {#coredns-configmap-options}

CoreDNS — це DNS-сервер, який є модульним та розширюваним, з допомогою втулків, які додають нові можливості. Сервер CoreDNS може бути налаштований за допомогою збереження [Corefile](https://coredns.io/2017/07/23/corefile-explained/), який є файлом конфігурації CoreDNS. Як адміністратор кластера, ви можете змінювати {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} для Corefile CoreDNS для зміни того, як поводитися служба виявлення служби DNS для цього кластера.

У Kubernetes CoreDNS встановлюється з наступною стандартною конфігурацією Corefile:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

Конфігурація Corefile включає наступні [втулки](https://coredns.io/plugins/) CoreDNS:

* [errors](https://coredns.io/plugins/errors/): Помилки реєструються в stdout.
* [health](https://coredns.io/plugins/health/): Справність CoreDNS повідомляється за адресою `http://localhost:8080/health`. У цьому розширеному синтаксисі `lameduck` зробить процес несправним, а потім зачекає 5 секунд, перш ніж процес буде вимкнено.
* [ready](https://coredns.io/plugins/ready/): HTTP-точка на порту 8181 поверне 200 ОК, коли всі втулки, які можуть сигналізувати готовність, зроблять це.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS відповість на DNS-запити на основі IP-адрес Service та Pod. Ви можете знайти [більше деталей](https://coredns.io/plugins/kubernetes/) про цей втулок на вебсайті CoreDNS.
  * `ttl` дозволяє встановити власний TTL для відповідей. Стандартно — 5 секунд. Мінімальний дозволений TTL — 0 секунд, а максимальний обмежений 3600 секундами. Встановлення TTL на 0 запобіжить кешуванню записів.
  * Опція `pods insecure` надається для сумісності з `kube-dns`.
  * Ви можете використовувати опцію `pods verified`, яка поверне запис A лише у випадку, якщо існує Pod в тому ж просторі імен зі потрібним IP.
  * Опцію `pods disabled` можна використовувати, якщо ви не використовуєте записи Podʼів.
* [prometheus](https://coredns.io/plugins/metrics/): Метрики CoreDNS доступні за адресою `http://localhost:9153/metrics` у форматі [Prometheus](https://prometheus.io/) (також відомий як OpenMetrics).
* [forward](https://coredns.io/plugins/forward/): Будь-які запити, які не належать до домену Kubernetes кластера, будуть переслані на попередньо визначені резолвери (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): Це увімкнення кешу фронтенду.
* [loop](https://coredns.io/plugins/loop/): Виявлення простих переспрямовуваннь та припинення процесу CoreDNS у випадку виявлення циклу.
* [reload](https://coredns.io/plugins/reload): Дозволяє автоматичне перезавантаження зміненого Corefile. Після редагування конфігурації ConfigMap дайте дві хвилини для того, щоб ваші зміни набули чинності.
* [loadbalance](https://coredns.io/plugins/loadbalance): Це round-robin DNS-балансувальник, який випадковим чином змінює порядок записів A, AAAA та MX в відповіді.

Ви можете змінити типову поведінку CoreDNS, змінивши ConfigMap.

### Конфігурація Stub-домену та віддаленого сервера імен за допомогою CoreDNS {#configuration-of-stub-domain-and-upstream-nameserver-using-coredns}

CoreDNS має можливість налаштувати stub-домени та віддалені сервери імен за допомогою [втулку forward](https://coredns.io/plugins/forward/).

#### Приклад {#example}

Якщо оператор кластера має сервер домену [Consul](https://www.consul.io/) за адресою "10.150.0.1", і всі імена Consul мають суфікс ".consul.local". Для його налаштування в CoreDNS адміністратор кластера створює наступний запис в ConfigMap CoreDNS.

```conf
consul.local:53 {
    errors
    cache 30
    forward . 10.150.0.1
}
```

Щоб явно пересилати всі не-кластерні DNS-пошуки через конкретний сервер імен за адресою 172.16.0.1, вказуйте `forward` на сервер імен замість `/etc/resolv.conf`.

```conf
forward .  172.16.0.1
```

Кінцевий ConfigMap разом з типовою конфігурацією `Corefile` виглядає так:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . 172.16.0.1
        cache 30
        loop
        reload
        loadbalance
    }
    consul.local:53 {
        errors
        cache 30
        forward . 10.150.0.1
    }
```

{{< note >}}
CoreDNS не підтримує FQDN для піддоменів та серверів імен (наприклад: "ns.foo.com"). Під час обробки всі імена серверів імен FQDN будуть виключені з конфігурації CoreDNS.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Прочитайте [Налагодження розвʼязку адрес DNS](/docs/tasks/administer-cluster/dns-debugging-resolution/)
