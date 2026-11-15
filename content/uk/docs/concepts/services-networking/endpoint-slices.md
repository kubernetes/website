---
title: EndpointSlices
api_metadata:
- apiVersion: "discovery.k8s.io/v1"
  kind: "EndpointSlice"
content_type: concept
weight: 60
description: >-
  API EndpointSlice — це механізм, який Kubernetes використовує, щоб ваш Service
  масштабувався для обробки великої кількості бекендів і дозволяє кластеру ефективно оновлювати свій список справних бекендів.
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

{{< glossary_definition term_id="endpoint-slice" length="short" >}}

<!-- body -->

## EndpointSlice API {#endpointslice-resource}

У Kubernetes, EndpointSlice містить посилання на набір мережевих точок доступу. Панель управління автоматично створює EndpointSlices для будь-якого Service Kubernetes, який має вказаний {{<glossary_tooltip text="селектор" term_id="selector">}}. Ці EndpointSlices містять посилання на всі Podʼи, які відповідають селектору Service. EndpointSlices групують мережеві точки доступу за унікальними комбінаціями сімейства IP, протоколу, номера порту та імені Service. Імʼя обʼєкта EndpointSlice повинно бути дійсним [імʼям піддомену DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Наприклад, ось приклад обʼєкта EndpointSlice, яким володіє Service Kubernetes з імʼям `example`.

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    nodeName: node-1
    zone: us-west2-a
```

Типово, панель управління створює та керує EndpointSlices так, щоб в кожному з них було не більше 100 мережевих точок доступу. Це можна налаштувати за допомогою прапорця `--max-endpoints-per-slice` {{<glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager">}}, до максимуму 1000.

EndpointSlices виступають джерелом правди для {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}} щодо того, як маршрутизувати внутрішній трафік.

### Типи адрес {#address-types}

EndpointSlices підтримують два типи адрес:

* IPv4
* IPv6

Кожен обʼєкт `EndpointSlice` представляє конкретний тип IP-адреси. Якщо у вас
є Service, який доступний через IPv4 та IPv6, буде принаймні два обʼєкти `EndpointSlice` (один для IPv4 та один для IPv6).

### Стани {#conditions}

API EndpointSlice зберігає стани точок доступу, які можуть бути корисні для споживачів. Три стани: `serving`, `terminating` та `ready`.

#### Serving {#serving}


{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Стан `serving` вказує на те, що точка доступу наразі обслуговує відповіді, і тому вона повинна використовуватися як призначення для трафіку Service. Для точок доступу, що підтримуються Podʼом, це відповідає стану Podʼа `Ready`.

#### Terminating {#terminating}


{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Стан `terminating` вказує на те, що точка доступу завершує свою роботу. Для точок доступу, які підтримуються Podʼом, цей стан встановлюється, коли Pod вперше видаляється (тобто, коли він отримує мітку часу видалення, але, швидше за все, до того, як контейнери Podʼа завершать свою роботу).

Сервісні проксі зазвичай ігнорують точки доступу, які є в стані `terminating`, але вони можуть перенаправляти трафік на точки доступу, які є одночасно `serving` та `terminating`, якщо всі доступні точки доступу є в стані `terminating`. (Це допомагає гарантувати, що трафік Service не буде втрачено під час поступових оновлень відповідних Podʼів.)

#### Ready {#ready}


Стан `ready` — це по суті скорочення для перевірки "`serving` та не `terminating`" (хоча він також завжди матиме значення `true` для Service, у яких `spec.publishNotReadyAddresses` встановлено в `true`).

### Інформація про топологію {#topology}

Кожна точка доступу в межах EndpointSlice може містити відповідну інформацію про топологію. Інформація про топологію включає місцезнаходження точки доступу та інформацію про відповідний вузол та зону. Ця інформація доступна в таких полях кожної точки доступу в EndpointSlices:

* `nodeName` — імʼя вузла, на якому знаходиться ця точка доступу.
* `zone` — зона, в якій знаходиться ця точка доступу.

### Управління {#management}

Здебільшого обʼєкти EndpointSlice створює панель управління і вона ж ними керує (а саме {{<glossary_tooltip text="контролер" term_id="controller">}} EndpointSlice). Є різноманітні інші випадки використання EndpointSlices, як-от реалізації service mesh, через які додатковими наборами EndpointSlices можуть керувати інші сутності або контролери.

Щоб забезпечити можливість кількох сутностей керувати EndpointSlices, не заважаючи одна одній, Kubernetes визначає {{<glossary_tooltip term_id="label" text="мітку">}} `endpointslice.kubernetes.io/managed-by`, яка вказує на сутність, що керує EndpointSlice. Контролер EndpointSlice встановлює значення `endpointslice-controller.k8s.io` для цієї мітки на всіх EndpointSlices, якими він керує. Інші сутності, які керують EndpointSlices, також повинні встановити унікальне значення для цієї мітки.

### Власність {#ownership}

У більшості випадків EndpointSlices належать Service, точки доступу якого відстежує обʼєкт EndpointSlice. На володіння вказує посилання на власника в кожному EndpointSlice, а також мітка `kubernetes.io/service-name`, що спрощує пошук усіх EndpointSlices, які належать Service.

### Розподіл EndpointSlices {#distribution-of-endpointslices}

Кожен EndpointSlice має набір портів, які застосовуються до всіх точок доступу ресурсу. При використанні іменованих портів для Service, Podʼи можуть мати різні номери цільового порту для того самого іменованого порту, що вимагає різних EndpointSlices.

Панель управління намагається заповнити EndpointSlices так повно, як це можливо, але не активно перерозподіляє їх. Логіка досить проста:

1. Перебрати наявні EndpointSlices, вилучити точки доступу, які вже не потрібні, і оновити відповідні точки, які змінилися.
2. Перебрати EndpointSlices, які були змінені на першому етапі, і заповнити їх новими точками доступу, які потрібно додати.
3. Якщо ще залишилися нові точки доступу для додавання, спробувати додати їх у раніше не змінений EndpointSlice та/або створити нові.

Важливо, що третій крок надає пріоритет обмеженню оновлень EndpointSlice над ідеально повним розподілом EndpointSlices. Наприклад, якщо є 10 нових точок доступу для додавання та 2 EndpointSlices з простором для ще 5 точок доступу кожна, цей підхід створить новий EndpointSlice замість заповнення 2 наявних EndpointSlices. Іншими словами, одне створення EndpointSlice краще, ніж кілька оновлень EndpointSlice.

З kube-proxy, який працює на кожному вузлі та слідкує за EndpointSlices, кожна зміна EndpointSlice стає відносно дорогою, оскільки вона буде передана кожному вузлу в кластері. Цей підхід призначений для обмеження кількості змін, які потрібно надіслати кожному вузлу, навіть якщо це може призвести до декількох EndpointSlices, які не є повністю заповненими.

На практиці такий не зовсім ідеальний розподіл має траплятися рідко. Більшість змін, які опрацьовує контролер EndpointSlice, будуть достатньо малими, щоб поміститися в наявний EndpointSlice, а якщо ні, новий EndpointSlice, імовірно, однаково невдовзі знадобиться. Поступові оновлення Deploymentʼів також забезпечують природне перепакування EndpointSlices, оскільки всі Podʼи та відповідні їм точки доступу замінюються.

### Дублікати точок доступу {#duplicate-endpoints}

Через характер змін EndpointSlice точки доступу можуть бути представлені в більш ніж одному EndpointSlice одночасно. Це, природно, відбувається, оскільки зміни до різних обʼєктів EndpointSlice можуть надходити до watch / кешу клієнта Kubernetes у різний час.

{{< note >}}
Клієнти API EndpointSlice повинні переглянути всі наявні EndpointSlices, повʼязані з Service, та побудувати повний список унікальних мережевих точок доступу. Важливо зазначити, що мережеві точки доступу можуть бути дубльовані в різних EndpointSlices.

Еталонну реалізацію того, як виконати це агрегування точок доступу та вилучення дублікатів, можна знайти в коді `EndpointSliceCache` у `kube-proxy`.
{{< /note >}}

### Віддзеркалення EndpointSlice {#endpointslice-mirroring}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

API EndpointSlice є заміною старого API Endpoints. Щоб зберегти сумісність зі старими контролерами та робочими навантаженнями користувачів, які очікують від {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}} маршрутизації трафіку на основі ресурсів Endpoints, панель управління кластера віддзеркалює більшість створених користувачем ресурсів Endpoints до відповідних EndpointSlices.

(Втім, ця функція, як і решта API Endpoints, є застарілою. Користувачі, які вручну вказують точки доступу для Service без селектора, повинні робити це, створюючи ресурси EndpointSlice безпосередньо, а не створювати ресурси Endpoints і дозволяти їхнє віддзеркалення).

Панель управління віддзеркалює ресурси Endpoints, крім випадків, коли:


* ресурс Endpoints має мітку `endpointslice.kubernetes.io/skip-mirror`, встановлену у значення `true`.
* ресурс Endpoints має анотацію `control-plane.alpha.kubernetes.io/leader`.
* відповідний ресурс Service не існує.
* відповідний ресурс Service має селектор, відмінний від nil.

Окремі ресурси Endpoints можуть транслюватися у декілька EndpointSlices. Це станеться, якщо ресурс Endpoints має декілька підмножин або включає точки доступу з декількома сімействами IP-адрес (IPv4 і IPv6). Максимум 1000 адрес на підмножину буде віддзеркалено в EndpointSlices.

## {{% heading "whatsnext" %}} {#what-s-next}

* Пройдіть навчальний посібник [Підключення застосунків до Service](/docs/tutorials/services/connect-applications-service/)
* Прочитайте [довідку API](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/) для API EndpointSlice
* Прочитайте [довідку API](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) для API Endpoints
