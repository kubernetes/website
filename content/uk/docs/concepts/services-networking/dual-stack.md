---
title: Подвійний стек IPv4/IPv6
description: >-
  Kubernetes дозволяє налаштувати мережеве зʼєднання з одним стеком IPv4, з одним стеком IPv6 або з подвійним стеком з обома сімействами мереж. Ця сторінка пояснює, як це зробити.
feature:
  title: Подвійний стек IPv4/IPv6
  description: >
    Виділення адрес IPv4 та IPv6 для Podʼів та Serviceʼів
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Двостекова мережа IPv4/IPv6 дозволяє виділяти як адреси IPv4, так і IPv6 для
{{< glossary_tooltip text="Podʼів" term_id="pod" >}} та {{< glossary_tooltip text="Serviceʼів" term_id="service" >}}.

Двостекова мережа IPv4/IPv6 є стандартно увімкненою у вашому кластері Kubernetes починаючи з версії 1.21, що дозволяє одночасно призначати адреси як IPv4, так і IPv6.

<!-- body -->

## Підтримувані функції {#supported-features}

Двостекова мережа IPv4/IPv6 у вашому кластері Kubernetes надає наступні можливості:

* Мережа Pod із двома стеками (призначення адреси IPv4 і IPv6 на один Pod)
* Serviceʼи з підтримкою IPv4 і IPv6
* Маршрутизація egress Pod за межі кластера (наприклад, в Інтернет) через інтерфейси IPv4 та IPv6

## Передумови {#prerequisites}

Для використання двостекових кластерів Kubernetes IPv4/IPv6 потрібні наступні передумови:

* Kubernetes 1.20 або новіше

  Для отримання інформації щодо використання двостекових Serviceʼів із попередніми версіями Kubernetes, дивіться документацію для відповідної версії Kubernetes.

* Підтримка постачальником двостекової мережі (постачальник хмари або інший повинен забезпечити вузлам Kubernetes маршрутизовані мережеві інтерфейси IPv4/IPv6)
* [Мережевий втулок](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/), який підтримує двостекову мережу.

## Налаштування двостекової мережі IPv4/IPv6 {#configure-ipv4-ipv6-dual-stack}

Щоб налаштувати подвійний стек IPv4/IPv6, встановіть призначення мережі кластера з подвійним стеком:

* kube-apiserver:
  * `--service-cluster-ip-range=<CIDR IPv4>,<CIDR IPv6>`
* kube-controller-manager:
  * `--cluster-cidr=<CIDR IPv4>,<CIDR IPv6>`
  * `--service-cluster-ip-range=<CIDR IPv4>,<CIDR IPv6>`
  * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` типово /24 для IPv4 та /64 для IPv6
* kube-proxy:
  * `--cluster-cidr=<CIDR IPv4>,<CIDR IPv6>`
* kubelet:
  * `--node-ip=<IP IPv4>,<IP IPv6>`
    * Ця опція є обовʼязковою для bare metal двостекових вузлів (вузлів, які не визначають постачальника хмари прапорцем `--cloud-provider`). Якщо ви використовуєте постачальника хмари та вирішили перевизначити IP-адреси вузлів, визначені постачальником хмари, встановіть опцію `--node-ip`.
    * (Вбудовані застарілі постачальники хмари не підтримують двостековий параметр `--node-ip`.)

{{< note >}}
Приклад CIDR IPv4: `10.244.0.0/16` (хоча ви повинні вказати свій власний діапазон адрес)

Приклад CIDR IPv6: `fdXY:IJKL:MNOP:15::/64` (це показує формат, але не є дійсною адресою — дивіться [RFC 4193](https://tools.ietf.org/html/rfc4193))
{{< /note >}}

## Serviceʼи {#services}

Ви можете створювати {{< glossary_tooltip text="Serviceʼи" term_id="service" >}}, які можуть використовувати адреси IPv4, IPv6 або обидві.

Сімейство адрес Service типово відповідає сімейству адрес першого діапазону IP Service кластера (налаштованого через прапорець `--service-cluster-ip-range` у kube-apiserver).

При визначенні Service ви можете конфігурувати його як двостековий за власним бажанням. Щоб вказати потрібну поведінку, ви встановлюєте в поле `.spec.ipFamilyPolicy` одне з наступних значень:

* `SingleStack`: Service з одним стеком. Панель управління виділяє IP кластера для Service, використовуючи перший налаштований діапазон IP кластера для Service.
* `PreferDualStack`: Виділяє IP-адреси кластерів IPv4 та IPv6 для Service, коли ввімкнено подвійний стек. Якщо подвійний стек не ввімкнено або не підтримується, він повертається до одностекового режиму.
* `RequireDualStack`: Виділяє IP-адреси Service `.spec.clusterIP` з діапазонів адрес IPv4 та IPv6, якщо увімкнено подвійний стек. Якщо подвійний стек не ввімкнено або не підтримується, створення обʼєкта Service API завершиться невдачею.
  * Вибирає `.spec.clusterIP` зі списку `.spec.clusterIPs` на основі сімейства адрес першого елемента у масиві `.spec.ipFamilies`.

Якщо ви хочете визначити, яке сімейство IP використовувати для одностекової конфігурації або визначити порядок IP для двостекової, ви можете вибрати сімейства адрес, встановивши необовʼязкове поле `.spec.ipFamilies` в Service.

{{< note >}}
Поле `.spec.ipFamilies` умовно змінюване: ви можете додавати або видаляти вторинне
сімейство IP-адрес, але не можете змінювати основне сімейство IP-адрес наявного Service.
{{< /note >}}

Ви можете встановити `.spec.ipFamilies` в будь-яке з наступних значень масиву:

* `["IPv4"]`
* `["IPv6"]`
* `["IPv4","IPv6"]` (два стеки)
* `["IPv6","IPv4"]` (два стеки)

Перше сімейство, яке ви перераховуєте, використовується для легасі-поля `.spec.clusterIP`.

### Сценарії конфігурації двостекового Service {#dual-stack-service-configuration-scenarios}

Ці приклади демонструють поведінку різних сценаріїв конфігурації двостекового Service.

#### Параметри подвійного стека в нових Service {#dual-stack-options-on-new-services}

1. Специфікація цього Service явно не визначає `.spec.ipFamilyPolicy`. Коли ви створюєте цей Service, Kubernetes виділяє кластерний IP для Service з першого налаштованого `service-cluster-ip-range` та встановлює значення `.spec.ipFamilyPolicy` на `SingleStack`. ([Service без селекторів](/docs/concepts/services-networking/service/#services-without-selectors) та [headless Services](/docs/concepts/services-networking/service/#headless-services) із селекторами будуть працювати так само.)

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

2. Специфікація цього Service явно визначає `PreferDualStack` в `.spec.ipFamilyPolicy`. Коли ви створюєте цей Service у двостековому кластері, Kubernetes призначає як IPv4, так і IPv6 адреси для Service. Панель управління оновлює `.spec` для Service, щоб зафіксувати адреси IP. Поле `.spec.clusterIPs` є основним полем і містить обидві призначені адреси IP; `.spec.clusterIP` є вторинним полем зі значенням, обчисленим з `.spec.clusterIPs`.

   * Для поля `.spec.clusterIP` панель управління записує IP-адресу, яка є з того ж самого сімейства адрес, що й перший діапазон кластерних IP Service.
   * У одностековому кластері поля `.spec.clusterIPs` та `.spec.clusterIP` містять лише одну адресу.
   * У кластері з увімкненими двома стеками вказання `RequireDualStack` в `.spec.ipFamilyPolicy` працює так само як і `PreferDualStack`.

   {{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

3. Специфікація цього Service явно визначає `IPv6` та `IPv4` в `.spec.ipFamilies`, а також визначає `PreferDualStack` в `.spec.ipFamilyPolicy`. Коли Kubernetes призначає IPv6 та IPv4 адреси в `.spec.clusterIPs`, `.spec.clusterIP` встановлюється на IPv6 адресу, оскільки це перший елемент у масиві `.spec.clusterIPs`, що перевизначає типові значення.

   {{% code_sample file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" %}}

#### Параметри подвійного стека в наявних Service {#dual-stack-details-on-existing-services}

Ці приклади демонструють типову поведінку при увімкненні двостековості в кластері, де вже існують Service. (Оновлення наявного кластера до версії 1.21 або новіше вмикає двостековість.)

1. Коли двостековість увімкнена в кластері, наявні Service (безперебійно `IPv4` або `IPv6`) конфігуруються панеллю управління так, щоб встановити `.spec.ipFamilyPolicy` на `SingleStack` та встановити `.spec.ipFamilies` на сімейство адрес наявного Service. Кластерний IP наявного Service буде збережено в `.spec.clusterIPs`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   Ви можете перевірити цю поведінку за допомогою kubectl, щоб переглянути наявний Service.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
     name: my-service
   spec:
     clusterIP: 10.0.197.123
     clusterIPs:
     - 10.0.197.123
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app.kubernetes.io/name: MyApp
     type: ClusterIP
   status:
     loadBalancer: {}
   ```

2. Коли двостековість увімкнена в кластері, наявні [headless Services](/docs/concepts/services-networking/service/#headless-services) з селекторами конфігуруються панеллю управління так, щоб встановити `.spec.ipFamilyPolicy` на `SingleStack` та встановити `.spec.ipFamilies` на сімейство адрес першого діапазону кластерних IP Service (налаштованого за допомогою прапорця `--service-cluster-ip-range` для kube-apiserver), навіть якщо `.spec.clusterIP` встановлено в `None`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   Ви можете перевірити цю поведінку за допомогою kubectl, щоб переглянути наявний headless Service з селекторами.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
     name: my-service
   spec:
     clusterIP: None
     clusterIPs:
     - None
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app.kubernetes.io/name: MyApp
   ```

#### Перемикання Service між одностековим та двостековим режимами {#switching-services-between-single-stack-and-dual-stack}

Service можна перемикати з одностекового режиму на двостековий та навпаки.

1. Для того щоби перемикнути Service з одностекового режиму на двостековий, змініть `.spec.ipFamilyPolicy` з `SingleStack` на `PreferDualStack` або `RequireDualStack` за необхідності. Коли ви змінюєте цей Service з одностекового режиму на двостековий, Kubernetes призначає відсутнє адресне сімейство, так що тепер Service має адреси IPv4 та IPv6.

   Відредагуйте специфікацію Service, оновивши `.spec.ipFamilyPolicy` з `SingleStack` на `PreferDualStack`.

   До:

   ```yaml
   spec:
     ipFamilyPolicy: SingleStack
   ```

   Після:

   ```yaml
   spec:
     ipFamilyPolicy: PreferDualStack
   ```

2. Для того щоби змінити Service з двостекового режиму на одностековий, змініть `.spec.ipFamilyPolicy` з `PreferDualStack` або `RequireDualStack` на `SingleStack`. Коли ви змінюєте цей Service з двостекового режиму на одностековий, Kubernetes залишає лише перший елемент у масиві `.spec.clusterIPs`, і встановлює `.spec.clusterIP` на цю IP-адресу і встановлює `.spec.ipFamilies` на адресне сімейство `.spec.clusterIPs`.

### Headless Services без селекторів {#headless-services-without-selectors}

Для [Headless Services без селекторів](/docs/concepts/services-networking/service/#without-selectors) і без явно вказаного `.spec.ipFamilyPolicy`, поле `.spec.ipFamilyPolicy` має типове значення `RequireDualStack`.

### Тип Service — LoadBalancer {#service-type-loadbalancer}

Щоб налаштувати двостековий балансувальник навантаження для вашого Service:

* Встановіть значення поля `.spec.type` в `LoadBalancer`
* Встановіть значення поля `.spec.ipFamilyPolicy` в `PreferDualStack` або `RequireDualStack`

{{< note >}}
Для використання двостекового Service типу `LoadBalancer`, ваш постачальник хмари повинен підтримувати балансувальники навантаження IPv4 та IPv6.
{{< /note >}}

## Трафік Egress {#egress-traffic}

Якщо ви хочете увімкнути трафік Egress, щоб досягти призначення за межами кластера (наприклад, публічний Інтернет) з Podʼа, який використовує непублічно марковані адреси IPv6, вам потрібно увімкнути Pod для використання публічно-маршрутизованих адрес IPv6 за допомогою механізму, такого як прозорий проксі або IP маскування. Проєкт [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent) підтримує IP-маскування у двохстекових кластерах.

{{< note >}}
Переконайтеся, що ваш постачальник {{< glossary_tooltip text="CNI" term_id="cni" >}} підтримує IPv6.
{{< /note >}}

## Підтримка Windows {#windows-support}

Kubernetes на Windows не підтримує одностекову мережу "лише IPv6". Однак
підтримується двохстекова мережа IPv4/IPv6 для Podʼів та вузлів з одностековими Service.

Ви можете використовувати двохстекову мережу IPv4/IPv6 з мережами `l2bridge`.

{{< note >}}
Мережі VXLAN на Windows **не** підтримують двохстекову мережу.
{{< /note >}}

Ви можете дізнатися більше про різні режими мережі для Windows в розділі [Мережа у Windows](/docs/concepts/services-networking/windows-networking#network-modes).

## {{% heading "whatsnext" %}}

* [Перевірте двохстекову мережу IPv4/IPv6](/docs/tasks/network/validate-dual-stack)
* [Увімкніть двохстекову мережу за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)
