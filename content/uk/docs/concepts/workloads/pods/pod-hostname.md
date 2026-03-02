---
title: Імʼя хосту Podʼа
content_type: concept
weight: 85
---

<!-- overview -->

Ця сторінка пояснює, як встановити ім'я хосту Podʼа, можливі побічні ефекти після налаштування та механізми, що лежать в основі.

<!-- body -->

## Стандартне імʼя хосту Podʼа {#default-pod-hostname}

Коли створюється Pod, імʼя його хосту (яке спостерігається зсередини Podʼа) походить від значення metadata.name Podʼа. І імʼя хосту, і відповідне повністю кваліфіковане доменне імʼя (FQDN) встановлюються зі значення metadata.name (з точки зору Podʼа)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-1
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

Pod, створений цим маніфестом, матиме імʼя хосту та повністю кваліфіковане доменне імʼя (FQDN) встановлені як `busybox-1`.

## Ім'я хосту з полями hostname та subdomain Podʼа {#hostname-with-pods-hostname-and-subdomain-fields}

Специфікація Podʼа включає необовʼязкове поле `hostname`. Коли воно встановлене, це значення має пріоритет над `metadata.name` Podʼа як імʼя хосту (яке спостерігається зсередини Podʼа). Наприклад, Pod з spec.hostname встановленим як `my-host` матиме імʼя хосту встановлене як `my-host`.

Специфікація Podʼа також включає необовʼязкове поле `subdomain`, яке вказує, що Pod належить до піддомену в межах свого простору імен. Якщо Pod має `spec.hostname` встановлений як "foo" і spec.subdomain встановлений як "bar" у просторі імен `my-namespace`, імʼя його хосту стає `foo`, а його повністю кваліфіковане доменне імʼя (FQDN) стає `foo.bar.my-namespace.svc.cluster-domain.example` (спостерігається зсередини Podʼа).

Коли встановлені і hostname, і subdomain, DNS-сервер кластера створить записи A та/або AAAA на основі цих полів. Дивіться: [Поля hostname та subdomain Podʼа](/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field).

## Ім'я хосту з полем setHostnameAsFQDN Podʼа {#hostname-with-pods-sethostnameasfqdn-fields}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Коли Pod налаштований на використання повністю кваліфікованого доменного імені (FQDN), його імʼя хосту є коротким імʼям хосту. Наприклад, якщо у вас є Pod з повністю кваліфікованим доменним імʼям `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`, то стандартно команда `hostname` всередині цього Podʼа повертає `busybox-1`, а команда `hostname --fqdn` повертає FQDN.

Коли в специфікації Podʼа встановлено і `setHostnameAsFQDN: true`, і поле subdomain, kubelet записує FQDN Podʼа як імʼя хосту для простору імен цього Podʼа. У цьому випадку і `hostname`, і `hostname --fqdn` повертають FQDN Podʼа.

FQDN Podʼа конструюється так само, як було визначено раніше. Воно складається з поля `spec.hostname` Podʼа (якщо вказано) або поля `metadata.name`, `spec.subdomain`, імені простору імен та суфікса домену кластера.

{{< note >}}
У Linux поле імені хоста ядра (поле `nodename` структури `utsname`) обмежено 64 символами.

Якщо Pod активує цю функцію, а його FQDN довший за 64 символи, він не зможе запуститися. Pod залишатиметься в статусі `Pending` (відображається як `ContainerCreating` через `kubectl`), генеруючи повідомлення про помилки, такі як "Failed to construct FQDN from Pod hostname and cluster domain".

Це означає, що при використанні цього поля ви повинні переконатися, що комбінована довжина полів `metadata.name` (або `spec.hostname`) та `spec.subdomain` Podʼа не призводить до появи FQDN, що перевищує 64 символи.
{{< /note >}}

## Ім'я хосту з полем hostnameOverride Podʼа {#hostname-with-pods-hostnameoverride}

{{< feature-state feature_gate_name="HostnameOverride" >}}

Встановлення значення для `hostnameOverride` в специфікації Podʼа змушує kubelet безумовно встановлювати як імʼя хосту, так і повністю кваліфіковане доменне імʼя (FQDN) Podʼа на значення `hostnameOverride`.

Поле `hostnameOverride` має обмеження довжини 64 символи і повинно відповідати стандарту імен піддоменів DNS, визначеному в [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123).

Приклад:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-2-busybox-example-domain
spec:
  hostnameOverride: busybox-2.busybox.example.domain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

{{< note >}}
Це впливає лише на імʼя хосту всередині Podʼа; це не впливає на записи A або AAAA Podʼа в DNS-сервері кластера.
{{< /note >}}

Якщо `hostnameOverride` встановлено разом з полями `hostname` та `subdomain`:

* Імʼя хосту всередині Podʼа перевизначається значенням `hostnameOverride`.

* Записи A та/або AAAA Podʼа в DNS-сервері кластера все ще генеруються на основі полів `hostname` та `subdomain`.

Примітка: Якщо встановлено `hostnameOverride`, ви не можете одночасно встановлювати поля `hostNetwork` та `setHostnameAsFQDN`. API-сервер явно відхилить будь-який запит на створення, що намагається використати цю комбінацію.

Для деталей щодо поведінки, коли `hostnameOverride` встановлено в комбінації з іншими полями (hostname, subdomain, setHostnameAsFQDN, hostNetwork), див. таблицю в [деталях проєкту KEP-4762](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details).
