---
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  Робить вашу мережеву службу HTTP (або HTTPS) доступною за допомогою конфігурації, яка розуміє протокол та враховує вебконцепції, такі як URI, імена хостів, шляхи та інше. Концепція Ingress дозволяє вам направляти трафік на різні бекенди на основі правил, які ви визначаєте через API Kubernetes.
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
Проєкт Kubernetes рекомендує використовувати [Gateway](https://gateway-api.sigs.k8s.io/) замість [Ingress](/docs/concepts/services-networking/ingress/). API Ingress наразі перебуває в стані замороження.

Це означає, що:

* API Ingress є загальнодоступним і на нього поширюються [гарантії стабільності](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) для загальнодоступних API. Проєкт Kubernetes не планує видаляти Ingress із Kubernetes.
* API Ingress більше не розробляється і не буде зазнавати подальших змін або оновлень.
{{< /note >}}

<!-- body -->

## Термінологія

Для ясності цей посібник визначає наступні терміни:

* Вузол: Робоча машина в Kubernetes, що є частиною кластера.
* Кластер: Набір вузлів, на яких виконуються контейнеризовані застосунки, керовані Kubernetes. У прикладі та в більшості типових розгортань Kubernetes вузли кластера не є частиною відкритої мережі Інтернет.
* Edge маршрутизатор: Маршрутизатор, який застосовує політику брандмауера для вашого кластера. Це може бути шлюз, керований хмарним постачальником, або фізичний пристрій.
* Кластерна мережа: Набір зʼєднань, логічних або фізичних, які сприяють комунікації в межах кластера згідно з [мережевою моделлю Kubernetes](/docs/concepts/cluster-administration/networking/).
* Service: {{< glossary_tooltip term_id="service" >}} Kubernetes, що ідентифікує набір Podʼів за допомогою селекторів {{< glossary_tooltip text="label" term_id="label" >}}. Якщо не вказано інше, припускається, що служби мають віртуальні IP-адреси, які можна маршрутизувати лише в межах кластерної мережі.

## Що таке Ingress? {#what-is-ingress}

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io) відкриває маршрути HTTP та HTTPS із зовні кластера до {{< link text="Services" url="/uk/docs/concepts/services-networking/service/" >}} всередині кластера. Маршрутизацію трафіку контролюють правила, визначені в ресурсі Ingress.

Ось простий приклад, де Ingress спрямовує весь свій трафік на один Service:
{{< mermaid >}}
graph LR;
  client([клієнт])-. Балансувальник навантаження <br> яким керує Ingress  .->ingress[Ingress];
  ingress-->|правила <br> маршрутизації|service[Service];
  subgraph cluster["Кластер"]
  ingress;
  service-->pod1[Pod];
  service-->pod2[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service,pod1,pod2 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
Схема. Ingress

<!-- {{< figure src="/uk/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="Схема. Ingress" link="https://mermaid.live/edit#pako:eNqNks1q20AQx19lWV9akI0-bH1sik_podBCaW61fFhpV7WILAl9tEkdQ-pA6aEQCqGFPoUppDVJTF9h94060qpxTC89aGfnvzO_nR3NAocZ45hgP31T0HyGnr868FOEwiTmafVoIm7Erfwqr8RWrqaP-wMkvoi1uIVvKz_IC_Gj8eRnsRUbcYPArFsJomH9Ka5B2cpL9CQoxkheAm0j7hCYa3kuL-QVegbX8rJEaNAfx2o_6bRpW0gn9vvjM_Fbnrf8TVOAYoo7sQbUpxa3gpNf4H-Eir-dlbx4G4d8cqSswpV1oN4ZJnVZ8WLiY_G9wcFrVk1VPp4-uFblKACUkGfMmLzM2PRf3dzpPGWqhbQsD3mE8oTGKYriJCE9xphWVkV2zEkviqJu338Xs2pGhvmJFmZJVpCerusHe5Bjt-wQlmmHfPRfFDjbp3Sv7ki7VNILgmAfY-4w6sYd6W93tK4DWtOXZjGbMh_EqSlSDdiTVRWdhRM_xRqe82JOYwbDuGhifVzN-Jz7mMCW8YjWSeXDnC4hlNZVdnSahphURc01XOeMVvwwpvBz55hENCnv1acsrrLiXuSt-0JNfTv8Gs5p-jrLdongY7LAJ5gMB87IcIe2ZxqGZ9qeq-FTTAzbG9gj13FHnmF5um45Sw2_bwn6wHOMkT00LcvSLd3RjeUfkYFWVg" >}} -->

Ingress може бути налаштований таким чином, щоб надавати Service зовнішньодоступні URL, балансувати трафік, термінувати SSL/TLS та пропонувати іменований віртуальний хостинг. [Контролер Ingress](/docs/concepts/services-networking/ingress-controllers) відповідає за виконання Ingress, зазвичай з допомогою балансувальника навантаження, хоча він також може конфігурувати ваш edge маршрутизатор або додаткові фронтенди для допомоги в обробці трафіку.

Ingress не відкриває довільні порти або протоколи. Для експозиції служб, відмінних від HTTP та HTTPS, в Інтернет зазвичай використовується служба типу [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) або
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Передумови {#prerequisites}

Вам потрібно мати [контролер Ingress](/docs/concepts/services-networking/ingress-controllers), щоб виконувати Ingress. Лише створення ресурсу Ingress не має ефекту.

Ви можете вибрати з-поміж [контролерів Ingress](/docs/concepts/services-networking/ingress-controllers).

В ідеалі, всі контролери Ingress повинні відповідати вказаній специфікації. На практиці різні контролери Ingress працюють трошки по-різному.

{{< note >}}
Переконайтеся, що ви ознайомились з документацією вашого контролера Ingress, щоб зрозуміти його особливості.
{{< /note >}}

## Ресурс Ingress {#ingress-resource}

Мінімальний приклад ресурсу Ingress:

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

Для Ingress необхідні поля `apiVersion`, `kind`, `metadata` та `spec`.
Назва обʼєкта Ingress повинна бути дійсним [DNS-піддоменом](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names). Для загальної інформації щодо роботи з файлами конфігурації дивіться [розгортання застосунків](/docs/tasks/run-application/run-stateless-application-deployment/), [налаштування контейнерів](/docs/tasks/configure-pod-container/configure-pod-configmap/), [управління ресурсами](/docs/concepts/workloads/management/). Контролери Ingress часто використовують [анотації](/docs/concepts/overview/working-with-objects/annotations/) для налаштування поведінки. Ознайомтеся з документацією контролера ingress, який ви вибрали, щоб дізнатися, які анотації підтримуються.

У [специфікації Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec) міститься вся інформація, необхідна для налаштування балансувальника навантаження чи проксі-сервера. Важливою є наявність списку правил, які порівнюються з усіма вхідними запитами. Ресурс Ingress підтримує правила тільки для направлення трафіку HTTP(S).

Якщо `ingressClassName` відсутній, має бути визначений [типовий клас Ingress](#default-ingress-class).

Деякі контролери ingress працюють навіть без визначення стандартного IngressClass. Навіть якщо ви використовуєте контролер ingress, який може працювати без будь-якого IngressClass, проєкт Kubernetes все одно рекомендує визначити стандартний IngressClass.

### Правила Ingress {#ingress-rules}

Кожне правило HTTP містить наступну інформацію:

* Необовʼязковий хост. У цьому прикладі хост не вказаний, тому правило застосовується до всього вхідного HTTP-трафіку через вказану IP-адресу. Якщо вказано хост (наприклад, foo.bar.com), правила застосовуються до цього хосту.
* Список шляхів (наприклад, `/testpath`), кожен з яких має повʼязаний бекенд, визначений імʼям `service.name` та `service.port.name` або `service.port.number`. Як хост, так і шлях повинні відповідати вмісту вхідного запиту, перш ніж балансувальник навантаження направить трафік до зазначеного Service.
* Бекенд — це комбінація імені Service та порту, як описано в [документації Service](/docs/concepts/services-networking/service/) або [ресурсом бекенду користувача](#resource-backend) за допомогою {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}. HTTP (та HTTPS) запити до Ingress, які відповідають хосту та шляху правила, надсилаються до вказаного бекенду.

Зазвичай в Ingress контролері налаштований `defaultBackend`, який обслуговує будь-які запити, які не відповідають шляху в специфікації.

### DefaultBackend {#default-backend}

Ingress без правил спрямовує весь трафік до єдиного стандартного бекенду, і `.spec.defaultBackend` — це бекенд, який повинен обробляти запити в цьому випадку. Зазвичай `defaultBackend` — це опція конфігурації [контролера Ingress](/docs/concepts/services-networking/ingress-controllers) і не вказується в ресурсах вашого Ingress. Якщо не вказано `.spec.rules`, то повинен бути вказаний `.spec.defaultBackend`. Якщо `defaultBackend` не встановлено, обробка запитів, які не відповідають жодному з правил, буде покладена на контролер ingress (звертайтеся до документації свого контролера Ingress, щоб дізнатися, як він обробляє цей випадок).

Якщо жоден із хостів або шляхів не відповідає HTTP-запиту в обʼєктах Ingress, трафік направляється до вашого стандартного бекенду.

### Бекенд Resource {#resource-backend}

Бекенд `Resource` — це ObjectRef на інший ресурс Kubernetes всередині того ж простору імен, що й обʼєкт Ingress. `Resource` — є несумісним з Service, перевірка налаштувань виявить помилку, якщо вказані обидва. Звичайне використання для бекенду `Resource` — це направлення даних в обʼєкт зберігання зі статичними ресурсами.

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

Після створення Ingress вище, ви можете переглянути його за допомогою наступної команди:

```bash
kubectl describe ingress ingress-resource-backend
```

```none
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### Типи шляхів {#path-types}

Для кожного шляху в Ingress обовʼязково повинен бути відповідний тип шляху. Шляхи, які не включають явний `pathType`, не пройдуть валідацію. Існує три типи шляхів, що підтримуються:

* `ImplementationSpecific`: З цим типом шляху визначення відповідності залежить від IngressClass. Реалізації можуть розглядати це як окремий `pathType` або обробляти його так само як типи шляхів `Prefix` або `Exact`.

* `Exact`: Відповідає URL-шляху точно і з урахуванням регістрів.

* `Prefix`: Відповідає на основі префіксу URL-шляху, розділеному `/`. Відповідність визначається з урахуванням регістру і виконується поелементно за кожним елементом шляху. Елемент шляху вказує на список міток у шляху, розділених роздільником `/`. Запит відповідає шляху _p_, якщо кожен _p_ є префіксом елемента _p_ запиту.

  {{< note >}}
  Якщо останній елемент шляху є підрядком останнього елементу в шляху запиту, це не вважається відповідністю (наприклад: `/foo/bar` відповідає `/foo/bar/baz`, але не відповідає `/foo/barbaz`).
  {{< /note >}}

### Приклади {#examples}

| Тип    | Шлях(и)                          | Шлях запиту                     | Відповідає?                         |
|--------|---------------------------------|-------------------------------|------------------------------------|
| Префікс | `/`                             | (всі шляхи)                   | Так                                |
| Точний | `/foo`                          | `/foo`                        | Так                                |
| Точний | `/foo`                          | `/bar`                        | Ні                                 |
| Точний | `/foo`                          | `/foo/`                       | Ні                                 |
| Точний | `/foo/`                         | `/foo`                        | Ні                                 |
| Префікс | `/foo`                          | `/foo`, `/foo/`               | Так                                |
| Префікс | `/foo/`                         | `/foo`, `/foo/`               | Так                                |
| Префікс | `/aaa/bb`                       | `/aaa/bbb`                    | Ні                                 |
| Префікс | `/aaa/bbb`                      | `/aaa/bbb`                    | Так                                |
| Префікс | `/aaa/bbb/`                     | `/aaa/bbb`                    | Так, ігнорує кінцевий слеш      |
| Префікс | `/aaa/bbb`                      | `/aaa/bbb/`                   | Так, співпадає з кінцевим слешем|
| Префікс | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | Так, співпадає з підшляхом         |
| Префікс | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | Ні, не співпадає з префіксом рядка |
| Префікс | `/`, `/aaa`                     | `/aaa/ccc`                    | Так, співпадає з префіксом `/aaa`  |
| Префікс | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | Так, співпадає з префіксом `/aaa/bbb`|
| Префікс | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | Так, співпадає з префіксом `/`      |
| Префікс | `/aaa`                          | `/ccc`                        | Ні, використовується типовий backend|
| Змішаний| `/foo` (Префікс), `/foo` (Точний)| `/foo`                       | Так, віддає перевагу Точному         |

#### Декілька збігів {#multiple-matches}

У деяких випадках одночасно можуть збігатися кілька шляхів в межах Ingress. У цих випадках перевага буде надаватися спочатку найдовшому збігу шляху. Якщо два шляхи все ще однаково збігаються, перевага буде надаватися шляхам із точним типом шляху перед префіксним типом шляху.

## Шаблони імен хостів {#hostname-wildcards}

Хости можуть бути точними збігами (наприклад, "`foo.bar.com`") або містити шаблони (наприклад, "`*.foo.com`"). Точні збіги вимагають, щоб заголовок HTTP `host` відповідав полю `host`. Шаблони вимагають, щоб заголовок HTTP `host` був рівним суфіксу правила з символами підстановки.

| Хост         | Заголовок хоста  | Збіг?                                            |
| ------------ |-------------------| --------------------------------------------------------|
| `*.foo.com`  | `bar.foo.com`     | Збіг на основі спільного суфіксу                  |
| `*.foo.com`  | `baz.bar.foo.com` | Немає збігу, символ підстановки охоплює лише одну DNS-мітку |
| `*.foo.com`  | `foo.com`         | Немає збігу, символ підстановки охоплює лише одну DNS-мітку |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

## Клас Ingress

Ingressʼи можуть бути реалізовані різними контролерами, часто з різною конфігурацією. Кожен Ingress повинен вказати клас — посилання на ресурс IngressClass, який містить додаткову конфігурацію, включаючи імʼя контролера, який повинен реалізувати цей клас.

{{% code_sample file="service/networking/external-lb.yaml" %}}

Поле `.spec.parameters` класу IngressClass дозволяє посилатися на інший ресурс, який надає конфігурацію, повʼязану з цим класом IngressClass.

Конкретний тип параметрів для використання залежить від контролера Ingress, який ви вказуєте в полі `.spec.controller` IngressClass.

### Область застосування IngressClass {#ingressclass-scope}

Залежно від вашого контролера Ingress, ви можете використовувати параметри, які ви встановлюєте на рівні кластера, або лише для одного простору імен.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Кластер" %}}
Стандартна область застосування параметрів IngressClass — це весь кластер.

Якщо ви встановлюєте поле `.spec.parameters` і не встановлюєте `.spec.parameters.scope`, або ви встановлюєте `.spec.parameters.scope` на `Cluster`, тоді IngressClass посилається на ресурс, який є на рівні кластера. `kind` (в поєднанні з `apiGroup`) параметрів вказує на API на рівні кластера (можливо, власний ресурс), і `name` параметрів ідентифікує конкретний ресурс на рівні кластера для цього API.

Наприклад:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # Параметри для цього IngressClass вказані в ClusterIngressParameter
    # (API group k8s.example.net) імені "external-config-1".
    # Це визначення вказує Kubernetes шукати ресурс параметрів на рівні кластера.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Простір імен" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Якщо ви встановлюєте поле `.spec.parameters` і встановлюєте `.spec.parameters.scope` на `Namespace`, тоді IngressClass посилається на ресурс на рівні простору імен. Ви також повинні встановити поле `namespace` в межах `.spec.parameters` на простір імен, який містить параметри, які ви хочете використовувати.

`kind` (в поєднанні з `apiGroup`) параметрів вказує на API на рівні простору імен (наприклад: ConfigMap), і `name` параметрів ідентифікує конкретний ресурс у просторі імен, який ви вказали в `namespace`.

Параметри на рівні простору імен допомагають оператору кластера делегувати контроль над конфігурацією (наприклад: налаштування балансувальника трафіку, визначення шлюзу API) що використовується для робочого навантаження. Якщо ви використовуєте параметр на рівні кластера, то або:

* команда операторів кластера повинна схвалити зміни іншої команди кожен раз,
  коли застосовується нова конфігураційна зміна.
* оператор кластера повинен визначити конкретні засоби керування доступом, такі як [RBAC](/docs/reference/access-authn-authz/rbac/) ролі та привʼязки, що дозволяють команді застосунків вносити зміни в ресурс параметрів на рівні кластера.

Сам API IngressClass завжди має область застосування на рівні кластера.

Ось приклад IngressClass, який посилається на параметри на рівні простору імен:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # Параметри для цього IngressClass вказані в IngressParameter
    # (API group k8s.example.com) імені "external-config",
    # що знаходиться в просторі імен "external-configuration".
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### Застарілі анотації {#deprecated-annotation}

Перед тим, як в Kubernetes 1.18 були додані ресурс IngressClass та поле `ingressClassName`, класи Ingress вказувалися за допомогою анотації `kubernetes.io/ingress.class` в Ingress. Ця анотація ніколи не була формально визначена, але отримала широку підтримку контролерами Ingress.

Нове поле `ingressClassName` в Ingress — це заміна для цієї анотації, але не є прямим еквівалентом. Хоча анотація, як правило, використовувалася для посилання на імʼя контролера Ingress, який повинен реалізувати Ingress, поле є посиланням на ресурс IngressClass, який містить додаткову конфігурацію Ingress, включаючи
імʼя контролера Ingress.

### Стандартний IngressClass {#default-ingress-class}

Ви можете визначити певний IngressClass як стандартний для вашого кластера. Встановлення анотації `ingressclass.kubernetes.io/is-default-class` зі значенням `true` на ресурсі IngressClass забезпечить те, що новим Ingress буде призначений цей типовий IngressClass, якщо в них не вказано поле `ingressClassName`.

{{< caution >}}
Якщо у вас є більше одного IngressClass, відзначеного як стандартного для вашого кластера, контролер доступу завадить створенню нових обʼєктів Ingress, в яких не вказано поле `ingressClassName`. Ви можете вирішити це, забезпечивши, те що в вашому кластері визначено не більше 1 типового IngressClass.
{{< /caution >}}

Почніть з визначення стандартного класу IngressClass. Однак рекомендується вказати стандартний клас IngressClass:

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

## Типи Ingress {#types-of-ingress}

### Ingress з підтримкою одного Service {#single-service-ingress}

Існують концепції в Kubernetes, що дозволяють вам використовувати один Service (див. [альтернативи](#alternatives)). Ви також можете зробити це за допомогою Ingress, вказавши _стандартний бекенд_ без правил.

{{% code_sample file="service/networking/test-ingress.yaml" %}}

Якщо ви створите його за допомогою `kubectl apply -f`, ви повинні мати можливість переглядати стан доданого Ingress:

```bash
kubectl get ingress test-ingress
```

```none
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

Де `203.0.113.123` — це IP-адреса, яку надав контролер Ingress для виконання цього Ingress.

{{< note >}}
Для контролерів Ingress та балансувальників навантаження це може тривати хвилину або дві для виділення IP-адреси. Тож ви часто можете побачити, що адреса вказана як `<pending>`.
{{< /note >}}

### Простий розподіл {#simple-fanout}

Конфігурація розподілу дозволяє маршрутизувати трафік з одної IP-адреси до більше ніж одного сервісу, виходячи з HTTP URI, що запитується. Ingress дозволяє зберігати кількість балансувальників на мінімальному рівні. Наприклад, налаштування як:

{{< mermaid >}}
graph LR;
  client([клієнт])-. Балансувальник навантаження <br> яким керує Ingress .->ingress[Ingress, 178.91.123.132];
  ingress-->|/foo|service1[Service service1:4200];
  ingress-->|/bar|service2[Service service2:8080];
  subgraph cluster["Кластер"]
  ingress;
  service1-->pod1[Pod];
  service1-->pod2[Pod];
  service2-->pod3[Pod];
  service2-->pod4[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
Схема. Ingress Fan Out

<!-- {{< figure src="/uk/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="Схема. Ingress Fan Out" link="https://mermaid.live/edit#pako:eNqNU81q3DAQfhWhvbTgdSXZ6x9t2VN6KLRQmlvXe7AtOWvitYx_2qSbhTa5FkIh9NCnCIGEkHTfQX6jyj-bzTYt9GBp5pv5vhmNpSUMBeOQwoPcz-bgzfuxlwIQJjFPy2dTeSfv6x_1hVzXp7PnQx3I7_JS3qtvXX-tz-RV49Xf5FreyjugtssWUtlqvZHXClnX5-BlkE9Afa7UbuUvoLbr-kt9Vl-A1-lBzosC6MNJ3JnTHtIAth3dxTomho4NMmv76pOGw8nJi0iIk4LnH-OQ4-l-Z4ANQE2C0FNO4OcbDvmTQ6iDnJ5TVEE3jzCpipLnUw_Kn8251alPm-49OHuk3XH60qpQJhievhNs9pcAeRIgXcD4V8DcBnjKut_jF8Uej0CW-HEKojhJ6IAxphVlLg45HURR1NvDTzEr59TMjrRQJCKnA4TQeEfk0Cl6CYNYIR_9l4qK7ar0k-qVtlQ6CIJgV4ZsZbqKW6XNRLXN0DYG0ZqhNktrGc1iNq0_4na3thvKDtx11u9jqMEFzxd-zNS1XzZ5HiznfME9SJXJeORXSelBL12pVL8qxf5xGkJa5hXXYJUxv-R7sa8uyALSyE-KB_QVi0uRP4C8dd9276t9ZhrM_PSDEFui8iFdwiNITd0eYce0XIKxSyzX0eAxpNhydWvk2M7IxYaLkGGvNPi5VUC6a-ORZRLDMJCBbIRXvwGJq2hb" >}} -->

Для цього потрібно мати Ingress, наприклад:

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

Коли ви створюєте Ingress за допомогою `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```none
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

Контролер Ingress надає реалізаційно-специфічний балансувальник що влаштовує Ingress, за умови, що існують сервіси (`service1`, `service2`). Коли це сталося, ви можете побачити адресу балансувальника в полі Address.

{{< note >}}
Залежно від [контролера Ingress](/docs/concepts/services-networking/ingress-controllers/), який ви використовуєте, можливо, вам доведеться створити сервіс default-http-backend [Service](/docs/concepts/services-networking/service/).
{{< /note >}}

### Віртуальний хостинг на основі імен {#name-based-virtual-hosting}

Віртуальні хости на основі імен підтримують маршрутизацію HTTP-трафіку до кількох імен хостів за однією IP-адресою.

{{< mermaid >}}
graph LR;
  client([клієнт])-. Балансувальник навантаження <br> яким керує Ingress .->ingress[Ingress, 178.91.123.132];
  ingress-->|Host: foo.bar.com|service1[Service service1:80];
  ingress-->|Host: bar.foo.com|service2[Service service2:80];
  subgraph cluster["Кластер"]
  ingress;
  service1-->pod1[Pod];
  service1-->pod2[Pod];
  service2-->pod3[Pod];
  service2-->pod4[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
Схема. Ingress віртуального хостингу на основі імен

<!-- {{< figure src="/uk/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="Схема. Ingress віртуального хостингу на основі імен" link="https://mermaid.live/edit#pako:eNqNU8tq3DAU_RWh2bTgMZbs8UMps0qhhRZKs-t4FrYlZ0w8lpHtNulkoE22hVAIXfQrQiElJJ1_kP-o8mNebQNdWLo6956jq2NpASNOGSTwWAT5DLx6e-BnAERpwrLyyUTey4f6W30tV_XF9OlQB_KrvJEP6lvVn-tL-aNZ1V_kSt7Je6CmmxZS1Wr8KW8VsqqvwLNQjEF9pdTu5C-gptv6U31ZX4OX2bFgRQH04TjpwkkPaQA5ru4hHWFTRyaetn31RcPh-PwFL0oCYs71MBB6xOfnBRPvk4ihyVEXgDVAXOMRekNtJHbo-E863tCLKuxcitKqKJmY-FB-b9xQXlw0Z_LhdGebjtP3oPbMOUWTN5xO_5HAfyVwlzAfS1jbBMto99OCojhkMcjTIMlAnKQpGVBKtaIU_ISRQRzHfTz8kNByRqz8VIt4ygUZGIZxsCdy4ha9hIntiI3-S0Xl9lV6p3qlLZUMwjDcl8FbmW7HrdLaUW1t2jrAWmNqM7SR2QxW0_oOt7vLnSl7cNdZP6sM1OCciXmQUPUcFk2lD8sZmzMfEhVSFgdVWvrQz5aqNKhKfnSWRZCUomIarHIalOwwCdQVmUMSB2mxQZ_TpORiA7J2-bp7d-3z02AeZO843xLVGpIFPIXE0p0Rci3bwwh52PZcDZ5BgmxPt0eu4448ZHqGYTpLDX5sFQzdc9DItrBpmoZpOAZa_gbLzXGg" >}} -->

Наступний Ingress вказує балансувальнику направляти запити на основі [заголовка Host](https://tools.ietf.org/html/rfc7230#section-5.4).

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

Якщо ви створюєте ресурс Ingress без визначених хостів в правилах, то будь-який вебтрафік на IP-адресу вашого контролера Ingress може відповідати без необхідності в імені заснованому віртуальному хості.

Наприклад, наступний Ingress маршрутизує трафік спрямований для `first.bar.com` до `service1`, `second.bar.com` до `service2`, і будь-який трафік, який має заголовок запиту хоста, який не відповідає `first.bar.com` і `second.bar.com` до `service3`.

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS

Ви можете захистити Ingress, вказавши {{< glossary_tooltip term_id="secret" >}}, що містить приватний ключ TLS та сертифікат. Ресурс Ingress підтримує лише один TLS-порт, 443, та передбачає термінування TLS на точці входу (трафік до Service та його Podʼів передається у вигляді звичайного тексту). Якщо розділ конфігурації TLS в Ingress вказує різні хости, вони мультиплексуються на одному порту відповідно до імені хоста, вказаного через розширення TLS з SNI (за умови, що контролер Ingress підтримує SNI). TLS-секрет повинен містити ключі з іменами `tls.crt` та `tls.key`, які містять сертифікат та приватний ключ для використання TLS. Наприклад:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

Посилання на цей секрет в Ingress дозволяє контролеру Ingress захистити канал, що йде від клієнта до балансувальника навантаження за допомогою TLS. Вам потрібно переконатися, що TLS-секрет, який ви створили, містить сертифікат, який містить Common Name (CN), також Fully Qualified Domain Name (FQDN) для `https-example.foo.com`.

{{< note >}}
Майте на увазі, що TLS не працюватиме типове для правил, оскільки сертифікати повинні бути видані для всіх можливих піддоменів. Таким чином, `hosts` в розділі `tls` повинні явно відповідати `host` в розділі `rules`.
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
Існує розбіжність між функціями TLS, що підтримуються різними контролерами ingress. Вам слід ознайомитися з документацією до обраного контролера ingress, щоб зрозуміти, як TLS працює у вашому середовищі.
{{< /note >}}

### Балансування навантаження {#load-balancing}

Контролер Ingress створюється з певними параметрами політики балансування навантаження, які він застосовує до всіх Ingress, таких як алгоритм балансування навантаження, схема коефіцієнтів ваги бекенду та інші. Більш розширені концепції балансування навантаження (наприклад, постійні сесії, динамічні коефіцієнти ваги) наразі не експонуються через Ingress. Замість цього ви можете отримати ці функції через балансувальник, що використовується для Service.

Також варто зазначити, що навіть якщо перевірки стану не експоновані безпосередньо через Ingress, існують паралельні концепції в Kubernetes, такі як [перевірки готовності](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/), що дозволяють досягти того ж самого результату. Будь ласка, ознайомтеся з документацією конкретного контролера, щоб переглянути, як вони обробляють перевірки стану.

## Оновлення Ingress {#updating-an-ingress}

Щоб оновити існуючий Ingress і додати новий хост, ви можете відредагувати ресурс таким чином:

```shell
kubectl describe ingress test
```

```none
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

Це відкриє редактор з поточною конфігурацією у форматі YAML. Змініть її, щоб додати новий хост:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

Після збереження змін, `kubectl` оновлює ресурс у API-сервері, що повідомляє Ingress-контролеру переконфігурувати балансувальник.

Перевірте це:

```shell
kubectl describe ingress test
```

```none
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

Ви можете досягти того самого результату, викликавши `kubectl replace -f` із зміненим файлом YAML для Ingress.

## Збій у різних зонах доступності {#faling-across-availability-zones}

Методи розподілу трафіку між доменами відмови відрізняються між хмарними провайдерами. Будь ласка, перевірте документацію відповідного [контролера Ingress](/docs/concepts/services-networking/ingress-controllers) для отримання деталей.

## Альтернативи {#alternatives}

Ви можете використовувати різні способи надання доступу до Service, які безпосередньо не стосуються ресурсу Ingress:

* Використовуйте [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Використовуйте [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport)

## {{% heading "whatsnext" %}}

* Дізнайтеся про [API Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/)
* Дізнайтеся про [контролери Ingress](/docs/concepts/services-networking/ingress-controllers/)
