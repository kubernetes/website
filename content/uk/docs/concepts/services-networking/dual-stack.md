---
title: Подвійний стек IPv4/IPv6
description: >-
  Kubernetes дозволяє налаштувати мережу з одним стеком IPv4, мережу з одним стеком IPv6 або мережу з подвійним стеком, де активні обидва мережеві сімейства. На цій сторінці пояснено, як це зробити.
feature:
  title: Подвійний стек IPv4/IPv6
  description: >
    Виділення адрес IPv4 та IPv6 для Podʼів та Services
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Двостекова мережа IPv4/IPv6 дозволяє виділяти адреси IPv4 та IPv6 для {{< glossary_tooltip text="Podʼів" term_id="pod" >}} та {{< glossary_tooltip text="Services" term_id="service" >}}.

Двостекова мережа IPv4/IPv6 стандартно увімкнена у вашому кластері Kubernetes починаючи з версії 1.21, що дозволяє одночасно призначати адреси IPv4 та IPv6.

<!-- body -->

## Підтримувані можливості {#supported-features}

Двостекова мережа IPv4/IPv6 у вашому кластері Kubernetes надає такі можливості:

* Двостекова мережа Podʼів (одна адреса IPv4 та одна адреса IPv6 на Pod)
* Services з підтримкою IPv4 та IPv6
* Маршрутизація вихідного трафіку Podʼів за межі кластера (наприклад, в Інтернет) через інтерфейси IPv4 та IPv6

## Передумови {#prerequisites}

Щоб використовувати двостекові кластери Kubernetes IPv4/IPv6, потрібно виконати такі передумови:

* Kubernetes 1.20 або новіше

  Інформацію про використання двостекових Services із попередніми версіями Kubernetes дивіться в документації відповідної версії Kubernetes.

* Підтримка двостекової мережі провайдером (хмарний чи інший провайдер має надати вузлам Kubernetes маршрутизовані мережеві інтерфейси IPv4/IPv6)
* [Мережевий втулок](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/), який підтримує двостекову мережу.

## Налаштування двостекової мережі IPv4/IPv6 {#configure-ipv4-ipv6-dual-stack}

Щоб налаштувати подвійний стек IPv4/IPv6, задайте двостекові мережеві призначення кластера:

* kube-apiserver:
  * `--service-cluster-ip-range=<CIDR IPv4>,<CIDR IPv6>`
* kube-controller-manager:
  * `--cluster-cidr=<CIDR IPv4>,<CIDR IPv6>`
  * `--service-cluster-ip-range=<CIDR IPv4>,<CIDR IPv6>`
  * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` стандартно /24 для IPv4 та /64 для IPv6
* kube-proxy:
  * `--cluster-cidr=<CIDR IPv4>,<CIDR IPv6>`
* kubelet:
  * `--node-ip=<IP IPv4>,<IP IPv6>`
    * Цей параметр є обовʼязковим для двостекових вузлів bare metal (вузлів, які не визначають хмарного провайдера прапорцем `--cloud-provider`). Якщо ви використовуєте хмарного провайдера й вирішили перевизначити IP-адреси вузлів, вибрані ним, встановіть параметр `--node-ip`.
    * (Застарілі вбудовані хмарні провайдери не підтримують двостековий `--node-ip`.)

{{< note >}}
Приклад CIDR IPv4: `10.244.0.0/16` (хоча ви вказуватимете власний діапазон адрес)

Приклад CIDR IPv6: `fdXY:IJKL:MNOP:15::/64` (це показує формат, але не є дійсною адресою — дивіться [RFC 4193](https://tools.ietf.org/html/rfc4193))
{{< /note >}}

## Services {#services}

Ви можете створювати {{< glossary_tooltip text="Services" term_id="service" >}}, які можуть використовувати IPv4, IPv6 або обидва.

Сімейство адрес Service стандартно відповідає сімейству адрес першого діапазону кластерних IP Services (налаштованого через прапорець `--service-cluster-ip-range` для kube-apiserver).

Під час визначення Service ви можете за бажанням налаштувати його як двостековий. Щоб вказати потрібну поведінку, встановіть у полі `.spec.ipFamilyPolicy` одне з таких значень:

* `SingleStack`: одностековий Service. Панель управління виділяє кластерний IP для Service, використовуючи перший налаштований діапазон кластерних IP Services.
* `PreferDualStack`: виділяє кластерні IP IPv4 та IPv6 для Service, коли подвійний стек увімкнено. Якщо подвійний стек не увімкнено або він не підтримується, застосовується одностекова поведінка.
* `RequireDualStack`: виділяє `.spec.clusterIPs` Service з діапазонів адрес IPv4 та IPv6, коли подвійний стек увімкнено. Якщо подвійний стек не увімкнено або він не підтримується, створення обʼєкта API Service завершиться невдачею.
  * Вибирає `.spec.clusterIP` зі списку `.spec.clusterIPs` на основі сімейства адрес першого елемента у масиві `.spec.ipFamilies`.

Якщо ви хочете визначити, яке сімейство IP використовувати для одного стека, або задати порядок сімейств IP для подвійного стека, ви можете вибрати сімейства адрес, встановивши необовʼязкове поле `.spec.ipFamilies` у Service.

{{< note >}}
Поле `.spec.ipFamilies` умовно змінюване: ви можете додавати або видаляти вторинне
сімейство IP-адрес, але не можете змінювати основне сімейство IP-адрес наявного Service.
{{< /note >}}

Ви можете встановити `.spec.ipFamilies` в будь-яке з таких значень масиву:

* `["IPv4"]`
* `["IPv6"]`
* `["IPv4","IPv6"]` (подвійний стек)
* `["IPv6","IPv4"]` (подвійний стек)

Перше вказане вами сімейство використовується для застарілого поля `.spec.clusterIP`.

### Сценарії конфігурації двостекового Service {#dual-stack-service-configuration-scenarios}

Ці приклади демонструють поведінку різних сценаріїв конфігурації двостекового Service.

#### Параметри подвійного стека в нових Services {#dual-stack-options-on-new-services}

1. Специфікація цього Service явно не визначає `.spec.ipFamilyPolicy`. Коли ви створюєте цей Service, Kubernetes призначає кластерний IP для Service з першого налаштованого `service-cluster-ip-range` і встановлює `.spec.ipFamilyPolicy` у `SingleStack`. ([Services без селекторів](/docs/concepts/services-networking/service/#services-without-selectors) та [headless Services](/docs/concepts/services-networking/service/#headless-services) із селекторами поводитимуться так само.)

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

1. Специфікація цього Service явно визначає `PreferDualStack` в `.spec.ipFamilyPolicy`. Коли ви створюєте цей Service у двостековому кластері, Kubernetes призначає адреси IPv4 та IPv6 для Service. Панель управління оновлює `.spec` Service, щоб зафіксувати призначені IP-адреси. Поле `.spec.clusterIPs` є основним і містить обидві призначені IP-адреси; `.spec.clusterIP` є вторинним полем, значення якого обчислюється з `.spec.clusterIPs`.

   * Для поля `.spec.clusterIP` панель управління записує IP-адресу з того самого сімейства адрес, що й перший діапазон кластерних IP Services.
   * В одностековому кластері обидва поля `.spec.clusterIPs` та `.spec.clusterIP` містять лише одну адресу.
   * У кластері з увімкненим подвійним стеком вказання `RequireDualStack` в `.spec.ipFamilyPolicy` працює так само, як і `PreferDualStack`.

   {{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

1. Специфікація цього Service явно визначає `IPv6` та `IPv4` в `.spec.ipFamilies`, а також `PreferDualStack` в `.spec.ipFamilyPolicy`. Коли Kubernetes призначає адреси IPv6 та IPv4 у `.spec.clusterIPs`, `.spec.clusterIP` встановлюється на адресу IPv6, оскільки це перший елемент масиву `.spec.clusterIPs`, що перевизначає стандартну поведінку.

   {{% code_sample file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" %}}

#### Стандартні значення подвійного стека в наявних Services {#dual-stack-defaults-on-existing-services}

Ці приклади демонструють стандартну поведінку, коли подвійний стек щойно увімкнено в кластері, де вже існують Services. (Оновлення наявного кластера до версії 1.21 або новішої вмикає подвійний стек.)

1. Коли в кластері увімкнено подвійний стек, панель управління налаштовує наявні Services (чи то `IPv4`, чи `IPv6`), встановлюючи `.spec.ipFamilyPolicy` у `SingleStack`, а `.spec.ipFamilies` — у сімейство адрес наявного Service. Кластерний IP наявного Service зберігається в `.spec.clusterIPs`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   Цю поведінку можна перевірити, переглянувши наявний Service за допомогою kubectl.

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

1. Коли в кластері увімкнено подвійний стек, панель управління налаштовує наявні [headless Services](/docs/concepts/services-networking/service/#headless-services) із селекторами, встановлюючи `.spec.ipFamilyPolicy` у `SingleStack`, а `.spec.ipFamilies` — у сімейство адрес першого діапазону кластерних IP Services (налаштованого через прапорець `--service-cluster-ip-range` для kube-apiserver), навіть якщо `.spec.clusterIP` встановлено в `None`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   Цю поведінку можна перевірити, переглянувши наявний headless Service із селекторами за допомогою kubectl.

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

#### Перемикання Services між одностековим та двостековим режимами {#switching-services-between-single-stack-and-dual-stack}

Services можна перемикати з одностекового режиму на двостековий і навпаки.

1. Щоб перемкнути Service з одностекового режиму на двостековий, змініть `.spec.ipFamilyPolicy` з `SingleStack` на `PreferDualStack` або `RequireDualStack`, залежно від потреби. Коли ви переводите цей Service з одностекового режиму на двостековий, Kubernetes призначає відсутнє сімейство адрес, тож Service тепер має адреси IPv4 та IPv6.

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

1. Щоб перемкнути Service з двостекового режиму на одностековий, змініть `.spec.ipFamilyPolicy` з `PreferDualStack` або `RequireDualStack` на `SingleStack`. Коли ви переводите цей Service з двостекового режиму на одностековий, Kubernetes залишає лише перший елемент масиву `.spec.clusterIPs`, встановлює `.spec.clusterIP` на цю IP-адресу, а `.spec.ipFamilies` — на сімейство адрес `.spec.clusterIPs`.

### Headless Services без селектора {#headless-services-without-selector}

Для [Headless Services без селекторів](/docs/concepts/services-networking/service/#without-selectors) і без явно вказаного `.spec.ipFamilyPolicy` стандартним значенням поля `.spec.ipFamilyPolicy` є `RequireDualStack`.

### Service типу LoadBalancer {#service-type-loadbalancer}

Щоб створити двостековий балансувальник навантаження для вашого Service:

* Встановіть значення поля `.spec.type` в `LoadBalancer`
* Встановіть значення поля `.spec.ipFamilyPolicy` в `PreferDualStack` або `RequireDualStack`

{{< note >}}
Щоб використовувати двостековий Service типу `LoadBalancer`, ваш хмарний провайдер має підтримувати балансувальники навантаження IPv4 та IPv6.
{{< /note >}}

## Вихідний трафік {#egress-traffic}

Якщо ви хочете увімкнути вихідний трафік, щоб досягати призначень за межами кластера (наприклад, публічного Інтернету) з Podʼа, який використовує адреси IPv6, що не маршрутизуються публічно, вам потрібно дати Podʼу змогу використовувати публічно маршрутизовану адресу IPv6 за допомогою такого механізму, як прозоре проксіювання або IP-маскування. Проєкт [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent) підтримує IP-маскування у двостекових кластерах.

{{< note >}}
Переконайтеся, що ваш провайдер {{< glossary_tooltip text="CNI" term_id="cni" >}} підтримує IPv6.
{{< /note >}}

## Підтримка Windows {#windows-support}

Kubernetes у Windows не підтримує одностекову мережу «лише IPv6». Однак підтримується двостекова мережа IPv4/IPv6 для Podʼів і вузлів з одностековими Services.

Ви можете використовувати двостекову мережу IPv4/IPv6 з мережами `l2bridge`.

{{< note >}}
Оверлейні мережі (VXLAN) у Windows **не** підтримують двостекову мережу.
{{< /note >}}

Докладніше про різні режими мережі у Windows читайте в розділі [Мережа у Windows](/docs/concepts/services-networking/windows-networking#network-modes).

## {{% heading "whatsnext" %}} {#whats-next}

* [Перевірте двостекову мережу IPv4/IPv6](/docs/tasks/network/validate-dual-stack)
* [Увімкніть двостекову мережу за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)
