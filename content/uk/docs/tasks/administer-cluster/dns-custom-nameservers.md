---
title: Налаштування служби DNS
content_type: task
min-kubernetes-server-version: v1.12
weight: 160
---

<!-- overview -->

На цій сторінці пояснюється, як налаштувати ваші DNS {{< glossary_tooltip text="Pod" term_id="pod" >}} та налаштувати процес розвʼязання імен DNS у вашому кластері.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

У вашому кластері має працювати надбудова CoreDNS.

{{% version-check %}}

<!-- steps -->

## Вступ {#introduction}

DNS — це вбудована служба Kubernetes, яка автоматично запускається за допомогою _менеджера надбудов_ — [надбудови кластера](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md).

{{< note >}}
Service CoreDNS має назву `kube-dns` у полі `metadata.name`. Мета — забезпечити кращу сумісність з робочими навантаженнями, які покладалися на застарілу назву Service `kube-dns` для розвʼязання адрес усередині кластера. Використання Service з назвою `kube-dns` приховує деталі реалізації: який саме DNS-провайдер працює під цією загальною назвою.
{{< /note >}}

Якщо ви запускаєте CoreDNS як Deployment, доступ до нього зазвичай відкривають через Service Kubernetes зі статичною IP-адресою. kubelet передає інформацію про резолвер DNS кожному контейнеру за допомогою прапорця `--cluster-dns=<dns-service-ip>`.

DNS-імена також потребують доменів. Ви налаштовуєте локальний домен у kubelet за допомогою прапорця `--cluster-domain=<default-local-domain>`.

DNS-сервер підтримує прямий пошук (записи A та AAAA), пошук портів (записи SRV), зворотний пошук IP-адрес (записи PTR) тощо. Докладніше дивіться [DNS для Services та Podʼів](/docs/concepts/services-networking/dns-pod-service/).

Якщо для Podʼа `dnsPolicy` встановлено значення `default`, він успадковує конфігурацію розвʼязання імен від вузла, на якому працює. Розвʼязання імен DNS у Podʼі має поводитися так само, як на вузлі. Проте див. [Відомі проблеми](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues).

Якщо вам це не потрібно або ви хочете іншу конфігурацію DNS для Podʼів, ви можете використовувати прапорець kubelet `--resolv-conf`. Встановіть для цього прапорця значення `""`, щоб Podʼи не успадковували DNS. Встановіть дійсний шлях до файлу, щоб для успадкування DNS використовувався інший файл, ніж `/etc/resolv.conf`.

## CoreDNS

CoreDNS — це універсальний авторитетний DNS-сервер, який може слугувати кластерним DNS відповідно до [специфікацій DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

### Параметри ConfigMap CoreDNS {#coredns-configmap-options}

CoreDNS — це модульний DNS-сервер з підтримкою втулків, які додають нові можливості. Сервер CoreDNS можна налаштувати, підтримуючи [Corefile](https://coredns.io/2017/07/23/corefile-explained/), який є файлом конфігурації CoreDNS. Як адміністратор кластера, ви можете змінювати {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} для Corefile CoreDNS, щоб змінити поведінку виявлення сервісів через DNS у цьому кластері.

У Kubernetes CoreDNS встановлюється з такою стандартною конфігурацією Corefile:

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

Конфігурація Corefile містить такі [втулки](https://coredns.io/plugins/) CoreDNS:

* [errors](https://coredns.io/plugins/errors/): Помилки записуються в stdout.
* [health](https://coredns.io/plugins/health/): Стан справності CoreDNS доступний за адресою `http://localhost:8080/health`. У цьому розширеному синтаксисі `lameduck` зробить процес несправним, а потім зачекає 5 секунд, перш ніж процес буде зупинено.
* [ready](https://coredns.io/plugins/ready/): HTTP-точка доступу на порту 8181 повертатиме 200 OK, коли всі втулки, здатні сигналізувати про готовність, це зроблять.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS відповідатиме на DNS-запити на основі IP-адрес Service та Podʼів. Ви можете знайти [більше деталей](https://coredns.io/plugins/kubernetes/) про цей втулок на вебсайті CoreDNS.
  * `ttl` дозволяє встановити власний TTL для відповідей. Стандартно — 5 секунд. Мінімальний дозволений TTL — 0 секунд, а максимальний обмежений 3600 секундами. Встановлення TTL на 0 запобіжить кешуванню записів.
  * Параметр `pods insecure` надається для зворотної сумісності з `kube-dns`.
  * Ви можете використовувати параметр `pods verified`, який повертає запис A, лише якщо в тому самому просторі імен існує Pod з відповідною IP-адресою.
  * Параметр `pods disabled` можна використовувати, якщо ви не використовуєте записи Podʼів.
* [prometheus](https://coredns.io/plugins/metrics/): Метрики CoreDNS доступні за адресою `http://localhost:9153/metrics` у форматі [Prometheus](https://prometheus.io/) (також відомий як OpenMetrics).
* [forward](https://coredns.io/plugins/forward/): Будь-які запити, що не належать до домену кластера Kubernetes, пересилаються до попередньо визначених резолверів (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): Вмикає кеш фронтенду.
* [loop](https://coredns.io/plugins/loop/): Виявляє прості цикли пересилання і зупиняє процес CoreDNS, якщо цикл знайдено.
* [reload](https://coredns.io/plugins/reload): Дозволяє автоматично перезавантажувати змінений Corefile. Після редагування конфігурації ConfigMap зачекайте дві хвилини, поки ваші зміни наберуть чинності.
* [loadbalance](https://coredns.io/plugins/loadbalance): Це round-robin DNS-балансувальник, який випадковим чином змінює порядок записів A, AAAA та MX у відповіді.

Ви можете змінити стандартну поведінку CoreDNS, змінивши ConfigMap.

### Конфігурація stub-домену та вищестоящого сервера імен за допомогою CoreDNS {#configuration-of-stub-domain-and-upstream-nameserver-using-coredns}

CoreDNS має можливість налаштовувати stub-домени та вищестоящі сервери імен за допомогою [втулка forward](https://coredns.io/plugins/forward/).

#### Приклад {#example}

Припустимо, оператор кластера має сервер домену [Consul](https://www.consul.io/) за адресою "10.150.0.1", і всі імена Consul мають суфікс ".consul.local". Щоб налаштувати його в CoreDNS, адміністратор кластера створює такий блок у ConfigMap CoreDNS.

```
consul.local:53 {
    errors
    cache 30
    forward . 10.150.0.1
}
```

Щоб явно спрямувати всі DNS-запити поза кластером через конкретний сервер імен за адресою 172.16.0.1, вкажіть у `forward` цей сервер імен замість `/etc/resolv.conf`

```
forward .  172.16.0.1
```

Остаточний ConfigMap разом зі стандартною конфігурацією `Corefile` виглядає так:

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
CoreDNS не підтримує FQDN для stub-доменів і серверів імен (наприклад: "ns.foo.com"). Під час трансляції всі сервери імен, задані через FQDN, буде вилучено з конфігурації CoreDNS.
{{< /note >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте [Налагодження розвʼязання імен DNS](/docs/tasks/administer-cluster/dns-debugging-resolution/)
