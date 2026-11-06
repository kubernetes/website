---
title: DNS для Services та Podʼів
content_type: concept
weight: 80
description: >-
  Ваше робоче навантаження може виявляти Services у вашому кластері за допомогою DNS; на цій сторінці пояснено, як це працює.
---
<!-- overview -->

Kubernetes створює DNS-записи для Services та Podʼів. Ви можете звертатися до Services за стабільними DNS-іменами замість IP-адрес.

<!-- body -->

Kubernetes публікує інформацію про Podʼи та Services, яка використовується для програмування DNS. kubelet налаштовує DNS Podʼів так, щоб запущені контейнери могли знаходити Services за іменем, а не за IP.

Services, визначеним у кластері, призначаються DNS-імена. Стандартно список пошуку DNS клієнтського Podʼа містить власний простір імен Podʼа та стандартний домен кластера.

### Простори імен Services {#namespaces-of-services}

DNS-запит може повертати різні результати залежно від простору імен Podʼа, який його робить. DNS-запити, які не вказують простір імен, обмежуються простором імен Podʼа. Щоб отримати доступ до Services в інших просторах імен, вказуйте простір імен у DNS-запиті.

Наприклад, розгляньмо Pod у просторі імен `test`. Service `data` міститься в просторі імен `prod`.

Запит `data` не повертає результатів, оскільки використовує простір імен Podʼа `test`.

Запит `data.prod` повертає очікуваний результат, оскільки вказує простір імен.

DNS-запити можуть бути розширені за допомогою `/etc/resolv.conf` Podʼа. kubelet налаштовує цей файл для кожного Podʼа. Наприклад, запит лише `data` може бути розширено до `data.test.svc.cluster.local`. Для розширення запитів використовуються значення параметра `search`. Щоб дізнатися більше про DNS-запити, див. [сторінку довідки `resolv.conf`](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html).

```yaml
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

Отже, Pod у просторі імен _test_ може успішно розвʼязувати як `data.prod`, так і `data.prod.svc.cluster.local`.

### DNS-записи {#dns-records}

Для яких обʼєктів створюються DNS-записи?

1. Services
1. Podʼи

У розділах нижче докладно описано підтримувані типи DNS-записів та їхню структуру. Будь-яка інша структура, імена чи запити, які випадково працюють, вважаються деталями реалізації й можуть змінитися без попередження. Актуальнішу специфікацію див. у [Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Services {#services}

### Записи A/AAAA {#a-aaaa-records}

«Звичайні» (не headless) Services отримують DNS-записи A та/або AAAA залежно від сімейства або сімейств IP цього Service, з іменем у вигляді `my-svc.my-namespace.svc.cluster-domain.example`. Це імʼя розвʼязується в кластерний IP Service.

[Headless Services](/docs/concepts/services-networking/service/#headless-services)
(без кластерного IP) теж отримують DNS-записи A та/або AAAA, з іменем у вигляді `my-svc.my-namespace.svc.cluster-domain.example`. На відміну від звичайних Services, це імʼя розвʼязується в набір IP-адрес усіх Podʼів, вибраних Service. Очікується, що клієнти використовуватимуть увесь набір або стандартний вибір round-robin із нього.

### Записи SRV {#srv-records}

Записи SRV створюються для іменованих портів, які є частиною звичайних або headless Services.

- Для кожного іменованого порту SRV-запис має вигляд `_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
- Для звичайного Service він розвʼязується в номер порту та доменне імʼя: `my-svc.my-namespace.svc.cluster-domain.example`.
- Для headless Service він розвʼязується в кілька відповідей, по одній для кожного Podʼа, що обслуговує Service, і містить номер порту та доменне імʼя Podʼа у вигляді `hostname.my-svc.my-namespace.svc.cluster-domain.example`.

## Podʼи {#pods}

### Записи A/AAAA {#a-aaaa-records-1}

Версії Kube-DNS до впровадження [специфікації DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md) мали таке розвʼязання DNS:

```none
<pod-IPv4-address>.<namespace>.pod.<cluster-domain>
```

Наприклад, якщо Pod в просторі імен `default` має IP-адресу 172.17.0.3, а доменне імʼя вашого кластера — `cluster.local`, то у Podʼа буде DNS-імʼя:

```none
172-17-0-3.default.pod.cluster.local
```

Деякі кластерні механізми DNS, такі як [CoreDNS](https://coredns.io/), також надають записи `A` для:

```none
<pod-ipv4-address>.<service-name>.<my-namespace>.svc.<cluster-domain.example>
```

Наприклад, якщо Pod у просторі імен `cafe` має IP-адресу 172.17.0.3, є точкою доступу Service з назвою `barista`, а доменне імʼя вашого кластера — `cluster.local`, то Pod матиме такий запис DNS `A` в межах Service.

```none
172-17-0-3.barista.cafe.svc.cluster.local
```

### Поля hostname та subdomain Podʼа {#pod-hostname-and-subdomain-field}

Наразі під час створення Podʼа його імʼя хоста (як його видно зсередини Podʼа) — це значення `metadata.name` Podʼа.

У специфікації Podʼа є необовʼязкове поле `hostname`, яке можна використовувати, щоб вказати інше імʼя хоста. Якщо його вказано, воно має пріоритет над назвою Podʼа й стає іменем хоста Podʼа (знову ж таки, як його видно зсередини Podʼа). Наприклад, Pod зі `spec.hostname`, встановленим у `"my-host"`, матиме імʼя хоста `"my-host"`.

У специфікації Podʼа також є необовʼязкове поле `subdomain`, яким можна вказати, що Pod є частиною підгрупи простору імен. Наприклад, Pod зі `spec.hostname`, встановленим у `"foo"`, і `spec.subdomain`, встановленим у `"bar"`, у просторі імен `"my-namespace"` матиме імʼя хоста `"foo"` та повне доменне імʼя (FQDN) `"foo.bar.my-namespace.svc.cluster.local"` (знову ж таки, як його видно зсередини Podʼа).

Якщо в тому самому просторі імен, що й Pod, існує headless Service із такою самою назвою, як піддомен, DNS-сервер кластера також повертає записи A та/або AAAA для повного імені хоста Podʼа.

Приклад:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: busybox-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # name не є обовʼязковим для Services з одним портом
    port: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

Для наведеного вище Service `"busybox-subdomain"` і Podʼів, які встановлюють `spec.subdomain` у `"busybox-subdomain"`, перший Pod бачитиме своє FQDN як `"busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example"`. DNS обслуговує за цим іменем записи A та/або AAAA, що вказують на IP-адресу Podʼа. Обидва Podʼи, "`busybox1`" та "`busybox2`", матимуть власні адресні записи.

{{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}} може вказувати DNS-імʼя хоста для будь-яких адрес точок доступу разом з їхнім IP.

{{< note >}}
Записи A та AAAA не створюються для назв Podʼів, оскільки для Podʼа відсутній `hostname`. Pod без `hostname`, але з `subdomain` створить запис A або AAAA лише для headless Service (`busybox-subdomain.my-namespace.svc.cluster-domain.example`), що вказує на IP-адреси Podʼів. Крім того, Pod має бути готовим, щоб мати запис, якщо для Service не встановлено `publishNotReadyAddresses=True`.
{{< /note >}}

### Поле setHostnameAsFQDN Podʼа {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Коли Pod налаштовано так, що він має повне доменне імʼя (FQDN), його імʼя хоста — це коротке імʼя хоста. Наприклад, якщо у вас є Pod із повним доменним імʼям `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`, то стандартно команда `hostname` в цьому Podʼі повертає `busybox-1`, а команда `hostname --fqdn` повертає FQDN.

Коли ви встановлюєте `setHostnameAsFQDN: true` у специфікації Podʼа, kubelet записує FQDN Podʼа в імʼя хоста для простору імен цього Podʼа. У цьому випадку як `hostname`, так і `hostname --fqdn` повертають FQDN Podʼа.

{{< note >}}
У Linux поле hostname ядра (поле `nodename` структури `struct utsname`) обмежено 64 символами.

Якщо Pod вмикає цю можливість, а його FQDN довше за 64 символи, він не запуститься. Pod залишиться у статусі `Pending` (`ContainerCreating`, як показує `kubectl`), генеруючи події помилок, такі як Failed to construct FQDN from Pod hostname and cluster domain, FQDN `long-FQDN` is too long (64 characters is the max, 70 characters requested). Один зі способів покращити досвід користувача в цьому сценарії — створити [контролер вебхука допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks), щоб контролювати розмір FQDN під час створення користувачами обʼєктів верхнього рівня, наприклад Deployment.
{{< /note >}}

### Політика DNS Podʼа {#pod-s-dns-policy}

Політику DNS можна встановлювати для кожного Podʼа окремо. Наразі Kubernetes підтримує такі політики DNS для Podʼів. Ці політики вказуються в полі `dnsPolicy` специфікації Podʼа.

- "`Default`": Pod успадковує конфігурацію розвʼязання імен від вузла, на якому він працює. Докладніше дивіться в [повʼязаному обговоренні](/docs/tasks/administer-cluster/dns-custom-nameservers).
- "`ClusterFirst`": Будь-який DNS-запит, який не відповідає налаштованому суфіксу домену кластера, наприклад "`www.kubernetes.io`", DNS-сервер пересилає до вищестоящого сервера імен. Адміністратори кластера можуть налаштувати додаткові stub-домени та вищестоящі DNS-сервери. Як у цих випадках обробляються DNS-запити, дивіться в [повʼязаному обговоренні](/docs/tasks/administer-cluster/dns-custom-nameservers).
- "`ClusterFirstWithHostNet`": Для Podʼів, що працюють із hostNetwork, слід явно встановити політику DNS "`ClusterFirstWithHostNet`". Інакше Podʼи, що працюють із hostNetwork і `"ClusterFirst"`, повернуться до поведінки політики `"Default"`.

{{< note >}}
Це не підтримується в Windows. Деталі дивіться [нижче](#dns-windows).
{{< /note >}}

- "`None`": Дозволяє Podʼу ігнорувати налаштування DNS із середовища Kubernetes. Усі налаштування DNS мають надаватися за допомогою поля `dnsConfig` у специфікації Podʼа. Див. підрозділ [Конфігурація DNS Podʼа](#pod-dns-config) нижче.

{{< note >}}
"Default" — це не стандартна політика DNS. Якщо `dnsPolicy` не вказано явно, використовується "ClusterFirst".
{{< /note >}}

У прикладі нижче показано Pod із політикою DNS "`ClusterFirstWithHostNet`", оскільки `hostNetwork` встановлено в `true`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### Конфігурація DNS Podʼа {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Конфігурація DNS Podʼа дає користувачам більше контролю над налаштуваннями DNS Podʼа.

Поле `dnsConfig` є необовʼязковим і може працювати з будь-якими налаштуваннями `dnsPolicy`. Однак коли `dnsPolicy` Podʼа встановлено в "`None`", поле `dnsConfig` потрібно вказати обовʼязково.

Нижче наведено властивості, які користувач може вказати в полі `dnsConfig`:

- `nameservers`: список IP-адрес, які використовуватимуться як DNS-сервери для Podʼа. Можна вказати не більше 3 IP-адрес. Коли `dnsPolicy` Podʼа встановлено в "`None`", список повинен містити принаймні одну IP-адресу, інакше ця властивість є необовʼязковою. Указані сервери буде обʼєднано з базовими серверами імен, згенерованими із зазначеної політики DNS, а дубльовані адреси вилучено.
- `searches`: список доменів пошуку DNS для пошуку імен хостів у Podʼі. Ця властивість є необовʼязковою. Якщо її вказано, цей список буде обʼєднано з базовими доменами пошуку, згенерованими з вибраної політики DNS. Дубльовані доменні імена вилучаються. Kubernetes дозволяє до 32 доменів пошуку.
- `options`: необовʼязковий список обʼєктів, де кожний обʼєкт може мати властивість `name` (обовʼязкова) і властивість `value` (необовʼязкова). Вміст цієї властивості буде обʼєднано з параметрами, згенерованими із зазначеної політики DNS. Дубльовані записи вилучаються.

Ось приклад Podʼа з власними налаштуваннями DNS:

{{% code_sample file="service/networking/custom-dns.yaml" %}}

Коли наведений вище Pod створено, контейнер `test` отримує такий вміст у своєму файлі `/etc/resolv.conf`:

```none
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

Для налаштування IPv6 шлях пошуку та сервер імен слід налаштувати так:

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

Вивід буде подібний до такого:

```none
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

## Обмеження списку доменів пошуку DNS {#dns-search-domain-list-limits}

{{< feature-state for_k8s_version="1.28" state="stable" >}}

Kubernetes сам не обмежує конфігурацію DNS, доки довжина списку доменів пошуку не перевищить 32 або загальна довжина всіх доменів пошуку не перевищить 2048. Це обмеження стосується файлу конфігурації резолвера вузла, конфігурації DNS Podʼа та обʼєднаної конфігурації DNS відповідно.

{{< note >}}
Деякі середовища виконання контейнерів раніших версій можуть мати власні обмеження щодо кількості доменів пошуку DNS. Залежно від середовища виконання контейнерів,
Podʼи з великою кількістю доменів пошуку DNS можуть залишатися в стані очікування.

Відомо, що цю проблему мають containerd v1.5.5 або раніші та CRI-O v1.21 або раніші.
{{< /note >}}

## Розвʼязання DNS на вузлах Windows {#dns-windows}

- `ClusterFirstWithHostNet` не підтримується для Podʼів, що працюють на вузлах Windows. Windows вважає всі імена з крапкою `.` повними доменними іменами (FQDN) і пропускає розвʼязання FQDN.
- У Windows можна використовувати кілька резолверів DNS. Оскільки їхня поведінка дещо відрізняється, для розвʼязання імен рекомендовано використовувати командлет PowerShell [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname).
- У Linux є список суфіксів DNS, який використовується після невдалого розвʼязання імені як повного. У Windows можна мати лише 1 суфікс DNS — суфікс, повʼязаний із простором імен цього Podʼа (наприклад, `mydns.svc.cluster.local`). Windows може розвʼязувати FQDN, Services або мережеві імена, які можна розвʼязати за допомогою цього єдиного суфікса. Наприклад, Pod, запущений у просторі імен `default`, матиме суфікс DNS `default.svc.cluster.local`. Усередині Podʼа Windows можна розвʼязувати і `kubernetes.default.svc.cluster.local`, і `kubernetes`, але не частково кваліфіковані імена (`kubernetes.default` або `kubernetes.default.svc`).

## {{% heading "whatsnext" %}} {#whats-next}

Настанови щодо адміністрування конфігурацій DNS дивіться на сторінці [Налаштування DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/).
