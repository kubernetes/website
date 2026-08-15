---
title: DNS для Service та Podʼів
content_type: concept
weight: 80
description: >-
  Ваше робоче навантаження може виявляти Serviceʼи всередині вашого кластеру за допомогою DNS; ця сторінка пояснює, як це працює.
---
<!-- overview -->

Kubernetes створює DNS-записи для Service та Podʼів. Ви можете звертатися до Service за допомогою стійких імен DNS замість IP-адрес.

<!-- body -->

Kubernetes публікує інформацію про Podʼи та Serviceʼи, яка використовується для налаштування DNS. Kubelet конфігурує DNS Podʼів так, щоб запущені контейнери могли знаходити Service за іменем, а не за IP.

Service, визначеним у кластері, призначаються імена DNS. Типово список пошуку DNS клієнта Pod включає власний простір імен Pod та стандартний домен кластера.

### Простори імен Serviceʼів {#namespaces-of-services}

DNS-запит може повертати різні результати залежно від простору імен Podʼа, який його створив. DNS-запити, які не вказують простір імен, обмежені простором імен Podʼа. Для доступу до Service в інших просторах імен, вказуйте його в DNS-запиті.

Наприклад, розгляньте Pod в просторі імен `test`. Service `data` перебуває в просторі імен `prod`.

Запит для `data` не повертає результатів, оскільки використовує простір імен Podʼа `test`.

Запит для `data.prod` повертає бажаний результат, оскільки вказує простір імен.

DNS-запити можуть бути розширені за допомогою `/etc/resolv.conf` Podʼа. Kubelet налаштовує цей файл для кожного Podʼа. Наприклад, запит лише для `data` може бути розширений до `data.test.svc.cluster.local`. Значення опції `search` використовуються для розширення запитів. Щоб дізнатися більше про DNS-запити, див. [сторінку довідки `resolv.conf`](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html).

```yaml
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

Отже, узагальнюючи, Pod у просторі імен _test_ може успішно знаходити як `data.prod`, так і `data.prod.svc.cluster.local`.

### DNS-записи {#dns-records}

Для яких обʼєктів створюються DNS-записи?

1. Serviceʼи
2. Podʼи

У наступних розділах детально розглядаються підтримувані типи записів DNS та структура, яка їх підтримує. Будь-яка інша структура, імена чи запити, які випадково працюють, вважаються реалізаційними деталями та можуть змінюватися без попередження. Для отримання більш актуальної специфікації див. [Виявлення Serviceʼів на основі DNS у Kubernetes](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Serviceʼи {#services}

### Записи A/AAAA {#a-aaaa-records}

"Звичайні" (не headless) Serviceʼи отримують DNS-запис A та/або AAAA, залежно від IP-сімейства або сімейств Serviceʼів, з імʼям у вигляді `my-svc.my-namespace.svc.cluster-domain.example`. Це розгортається в кластерний IP Serviceʼу.

[Headless Services](/docs/concepts/services-networking/service/#headless-services)
(без кластерного IP) теж отримують DNS-записи A та/або AAAA, з імʼям у вигляді `my-svc.my-namespace.svc.cluster-domain.example`. На відміну від звичайних Serviceʼів, це розгортається в набір IP-адрес всіх Podʼів, вибраних Serviceʼом. Очікується, що клієнти будуть використовувати цей набір або використовувати стандартний round-robin вибір із набору.

### Записи SRV {#srv-records}

Записи SRV створюються для іменованих портів, які є частиною звичайних або headless сервісів. Для кожного іменованого порту запис SRV має вигляд `_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`. Для звичайного Serviceʼу це розгортається в номер порту та доменне імʼя: `my-svc.my-namespace.svc.cluster-domain.example`. Для headless Serviceʼу це розгортається в кілька відповідей, по одній для кожного Podʼа, які підтримує Service, і містить номер порту та доменне імʼя Podʼа у вигляді `hostname.my-svc.my-namespace.svc.cluster-domain.example`.

- Для кожного іменованого порту SRV-запис має вигляд `_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
- Для звичайного Service він перетворюється на номер порту та імʼя домену: `my-svc.my-namespace.svc.cluster-domain.example`.
- Для headless Service цей запит перетворюється на кілька відповідей, по одній для кожного Podʼа, який підтримує Service, і містить номер порту та доменне імʼя Podʼа у вигляді `hostname.my-svc.my-namespace.svc.cluster-domain.exampleʼ.

## Podʼи {#pods}

### Записи A/AAAA {#a-aaaa-records-1}

Версії Kube-DNS, до впровадження [специфікації DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md), мали наступне DNS-подання:

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

Наприклад, якщо Pod у просторі імен `cafe` має IP-адресу 172.17.0.3, є точкою доступу до Service на імʼя `barista`, а доменне імʼя вашого кластера — `cluster.local`, то Pod матиме такий запис DNS `A`, в межах Service.

```none
172-17-0-3.barista.cafe.svc.cluster.local
```

### Поля hostname та subdomain Podʼа {#pod-hostname-and-subdomain-field}

Наразі, при створенні Podʼа, його імʼя (як його видно зсередини Podʼа) визначається як значення `metadata.name` Podʼа.

У специфікації Podʼа є необовʼязкове поле `hostname`, яке можна використовувати для вказівки відмінного від імʼя Podʼа імені хосту. Коли вказано, воно має пріоритет над іменем Podʼа та стає імʼям хосту Podʼа (знову ж таки, в спостереженнях зсередини Podʼа). Наприклад, якщо у Podʼа вказано `spec.hostname` зі значенням `"my-host"`, то у Podʼа буде імʼя хосту `"my-host"`.

Специфікація Podʼа також має необовʼязкове поле `subdomain`, яке може використовуватися для вказівки того, що Pod є частиною підгрупи простору імен. Наприклад, Pod з `spec.hostname` встановленим на `"foo"`, та `spec.subdomain` встановленим на `"bar"`, у просторі імен `"my-namespace"`, матиме імʼя хосту `"foo"` та повністю визначене доменне імʼя (FQDN) `"foo.bar.my-namespace.svc.cluster.local"` (знову ж таки, в спостереженнях зсередини Podʼа).

Якщо існує headless Service в тому ж просторі імен, що і Pod, із тим самим імʼям, що і піддомен, DNS-сервер кластера також поверне записи A та/або AAAA для повної доменної назви Podʼа.

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
  - name: foo # імʼя не є обовʼязковим для Serviceʼів з одним портом
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

У вище наведеному Прикладі, із Service `"busybox-subdomain"` та Podʼами, які встановлюють `spec.subdomain` на `"busybox-subdomain"`, перший Pod побачить своє власне FQDN як `"busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example"`. DNS повертає записи A та/або AAAA під цим іменем, що вказують на IP-адресу Podʼа. Обидва Podʼа "`busybox1`" та "`busybox2`" матимуть свої власні записи адрес.

{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}} може визначати DNS-hostname для будь-якої адреси endpoint, разом з його IP.

{{< note >}}
Записи A та AAAA не створюються для назв Pod'ів, оскільки для них відсутній `hostname`. Pod без `hostname`, але з `subdomain`, створить запис A або AAAA лише для headless Service (`busybox-subdomain.my-namespace.svc.cluster-domain.example`), що вказує на IP-адреси Podʼів. Крім того, Pod повинен бути готовий, щоб мати запис, якщо не встановлено `publishNotReadyAddresses=True` для Service.
{{< /note >}}

### Поле setHostnameAsFQDN Podʼа {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Коли Pod налаштовано так, що він має повне доменне імʼя (FQDN), його імʼя хосту — це коротке імʼя хосту. Наприклад, якщо у вас є Pod із повним доменним імʼям `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`, то стандартно команда `hostname` в цьому Podʼі повертає `busybox-1`, а команда `hostname --fqdn` повертає FQDN.

Коли ви встановлюєте `setHostnameAsFQDN: true` у специфікації Podʼа, kubelet записує FQDN Podʼа в імʼя хосту для простору імен цього Podʼа. У цьому випадку як `hostname`, так і `hostname --fqdn` повертають FQDN Podʼа.

{{< note >}}
У Linux поле hostname ядра (поле `nodename` структури `struct utsname`) обмежено 64 символами.

Якщо Pod активує цю функцію і його FQDN довше за 64 символи, запуск буде неуспішним. Pod залишиться у статусі `Pending` (`ContainerCreating`, як це бачить `kubectl`), генеруючи події помилок, такі як "Не вдалося побудувати FQDN з імені хосту Podʼа та домену кластера, FQDN `long-FQDN` занадто довгий (максимально 64 символи, запитано 70)". Один зі способів поліпшення досвіду користувача у цьому сценарії — створення [контролера admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) для контролю розміру FQDN при створенні користувачами обʼєктів верхнього рівня, наприклад, Deployment.
{{< /note >}}

### Політика DNS Podʼа {#pod-s-dns-policy}

Політику DNS можна встановлювати для кожного Podʼа окремо. Наразі Kubernetes підтримує наступні політики DNS, вказані у полі `dnsPolicy` в специфікації Podʼа:

- "`Default`": Pod успадковує конфігурацію розпізнавання імені від вузла, на якому працюють Podʼи. Деталі можна переглянути у [відповідному описі](/docs/tasks/administer-cluster/dns-custom-nameservers).
- "`ClusterFirst`": Будь-який DNS-запит, який не відповідає налаштованому суфіксу домену кластера, такому як "`www.kubernetes.io`", пересилається на вихідний DNS-сервер DNS-сервером. Адміністратори кластера можуть мати додаткові налаштовані піддомени та вихідні DNS-сервери. Деталі щодо обробки DNS-запитів у цих випадках можна знайти [відповідному дописі](/docs/tasks/administer-cluster/dns-custom-nameservers).
- "`ClusterFirstWithHostNet`": Для Podʼів, які працюють із `hostNetwork`, ви повинні явно встановити для них політику DNS "`ClusterFirstWithHostNet`". В іншому випадку Podʼи, що працюють із `hostNetwork` та "`ClusterFirst`", будуть використовувати поведінку політики "`Default`".

{{< note >}}
Це не підтримується в Windows. Деталі дивіться [нижче](#dns-windows).
{{< /note >}}

- "`None`": Це дозволяє Podʼу ігнорувати налаштування DNS з оточення Kubernetes. Всі налаштування DNS повинні надаватися за допомогою поля `dnsConfig` у специфікації Podʼа. Деталі дивіться у підрозділі [DNS-конфігурація Podʼа](#pod-dns-config) нижче.

{{< note >}}
"Default" — це не стандартно політика DNS. Якщо поле `dnsPolicy` не вказано явно, то використовується "ClusterFirst".
{{< /note >}}

Наведений нижче приклад показує Pod із встановленою політикою DNS "`ClusterFirstWithHostNet`", оскільки у нього встановлено `hostNetwork` в `true`.

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

### Конфігурація DNS для Podʼа {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Конфігурація DNS для Podʼа дозволяє користувачам мати більше контролю над налаштуваннями DNS для конкретного Podʼа.

Поле `dnsConfig` є необовʼязковим і може використовуватися з будь-якими налаштуваннями `dnsPolicy`. Однак, коли поле `dnsPolicy` Podʼа встановлено в "`None`", поле `dnsConfig` повинно бути вказано.

Нижче наведені значення, які користувач може вказати у полі `dnsConfig`:

- `nameservers`: список IP-адрес, які будуть використовуватися як DNS-сервери для Podʼа. Можна вказати не більше 3 IP-адрес, але коли політика DNS Podʼа встановлена на "`None`", список повинен містити принаймні одну IP-адресу, інакше ця властивість є необовʼязковою. Зазначені сервери будуть обʼєднані з базовими серверами, згенерованими з вказаною політикою DNS, з вилученням дубльованих адрес.
- `searches`: список доменів пошуку DNS для пошуку імен в хостах у Podʼі. Ця властивість є необовʼязковою. При вказанні, вказаний список буде обʼєднаний з базовими доменами пошуку, згенерованими з вибраної політики DNS. Дубльовані доменні імена вилучаються. Kubernetes дозволяє до 32 доменів пошуку.
- `options`: необовʼязковий список обʼєктів, де кожний обʼєкт може мати властивість `name` (обовʼязкова) і властивість `value` (необовʼязкова). Зміст цієї властивості буде обʼєднаний з параметрами, згенерованими з вказаної політики DNS. Дубльовані елементи вилучаються.

Тут наведено приклад Podʼа з власними налаштуваннями DNS:

{{% code_sample file="service/networking/custom-dns.yaml" %}}

Коли створюється Pod, контейнер `test` отримує наступний зміст у своєму файлі `/etc/resolv.conf`:

```none
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

Для налаштування IPv6 шляху пошуку та сервера імен слід встановити:

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

Вивід буде подібний до наступного:

```none
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

## Обмеження списку доменів пошуку DNS {#dns-search-domain-list-limits}

{{< feature-state for_k8s_version="1.28" state="stable" >}}

Kubernetes сам по собі не обмежує конфігурацію DNS до тих пір, поки довжина списку доменів пошуку не перевищить 32 або загальна довжина всіх доменів пошуку не перевищить 2048. Це обмеження стосується файлу конфігурації резолвера вузла, конфігурації DNS Podʼа та обʼєднаної конфігурації DNS відповідно.

{{< note >}}
Деякі середовища виконання контейнерів раніших версій можуть мати власні обмеження щодо кількості доменів пошуку DNS. Залежно від середовища виконання контейнерів,
Podʼи з великою кількістю доменів пошуку DNS можуть залишатися в стані очікування.

Відомо, що containerd версії 1.5.5 або раніше та CRI-O версії 1.21 або раніше мають цю проблему.
{{< /note >}}

## DNS на вузлах з операційною системою Windows {#dns-windows}

- ClusterFirstWithHostNet не підтримується для Podʼів, які працюють на вузлах з операційною системою Windows. У Windows всі імена з крапкою `.` розглядаються як повністю кваліфіковані та пропускають розгортання FQDN.
- На Windows існують кілька резолверів DNS, які можна використовувати. Оскільки вони мають трохи відмінну поведінку, рекомендується використовувати [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname) для отримання імені.
- У Linux у вас є список суфіксів DNS, який використовується після того, як розгортання імені як повністю кваліфіковане не вдалося. У Windows можна вказати лише 1 суфікс DNS, який є суфіксом DNS, повʼязаним з простором імен цього Podʼа (наприклад, `mydns.svc.cluster.local`). Windows може розгортати FQDN, служби або мережеве імʼя, яке може бути розгорнуто за допомогою цього єдиного суфікса. Наприклад, Pod, створений у просторі імен `default`, матиме суфікс DNS `default.svc.cluster.local`. Всередині Windows імʼя Podʼа можна розгортати як `kubernetes.default.svc.cluster.local`, так і `kubernetes`, але не в частково кваліфіковані імена (`kubernetes.default` або `kubernetes.default.svc`).

## {{% heading "whatsnext" %}}

Для керівництва щодо адміністрування конфігурацій DNS дивіться [Налаштування служби DNS](/docs/tasks/administer-cluster/dns-custom-nameservers/).
