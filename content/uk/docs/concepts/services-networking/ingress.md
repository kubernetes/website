---
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  Робить ваш мережевий сервіс HTTP (або HTTPS) доступним за допомогою механізму конфігурації,
  що враховує протокол і розуміє вебконцепції, такі як URI, імена хостів, шляхи тощо.
  Концепція Ingress дозволяє вам спрямовувати трафік на різні бекенди на основі правил,
  які ви визначаєте через API Kubernetes.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
Проєкт Kubernetes рекомендує використовувати [Gateway](https://gateway-api.sigs.k8s.io/) замість [Ingress](/docs/concepts/services-networking/ingress/). API Ingress заморожено.

Це означає, що:
* API Ingress є загальнодоступним, і на нього поширюються [гарантії стабільності](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) для загальнодоступних API. Проєкт Kubernetes не планує видаляти Ingress із Kubernetes.
* API Ingress більше не розробляється, і до нього не вноситимуться подальші зміни чи оновлення.
{{< /note >}}

<!-- body -->

## Термінологія {#terminology}

Для ясності цей посібник визначає такі терміни:

* Вузол: Робоча машина в Kubernetes, що є частиною кластера.
* Кластер: Набір вузлів, на яких виконуються контейнеризовані застосунки, керовані Kubernetes. У цьому прикладі та в більшості типових розгортань Kubernetes вузли кластера не є частиною публічного інтернету.
* Граничний маршрутизатор (edge router): Маршрутизатор, який застосовує політику брандмауера для вашого кластера. Це може бути шлюз, керований хмарним провайдером, або фізичний пристрій.
* Кластерна мережа: Набір зʼєднань, логічних або фізичних, які забезпечують комунікацію в межах кластера згідно з [мережевою моделлю](/docs/concepts/cluster-administration/networking/) Kubernetes.
* Service: {{< glossary_tooltip term_id="service" >}} Kubernetes, що ідентифікує набір Podʼів за допомогою селекторів {{< glossary_tooltip text="міток" term_id="label" >}}. Якщо не зазначено інше, вважається, що сервіси мають віртуальні IP-адреси, які маршрутизуються лише в межах кластерної мережі.

## Що таке Ingress? {#what-is-ingress}

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io) відкриває маршрути HTTP та HTTPS ззовні кластера до {{< link text="сервісів" url="/docs/concepts/services-networking/service/" >}} всередині кластера. Маршрутизацію трафіку контролюють правила, визначені в ресурсі Ingress.

Ось простий приклад, де Ingress спрямовує весь свій трафік на один Service:

{{< mermaid >}}
graph LR;
  client([клієнт])-. Балансувальник навантаження, <br> яким керує Ingress .->ingress[Ingress];
  ingress-->|правило маршрутизації|service[Service];
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
{{< /mermaid >}}

*Схема. Ingress*

Ingress можна налаштувати так, щоб він надавав сервісам зовнішньодоступні URL, балансував навантаження трафіку, виконував термінацію SSL / TLS та пропонував віртуальний хостинг на основі імен. [Контролер Ingress](/docs/concepts/services-networking/ingress-controllers) відповідає за виконання Ingress, зазвичай за допомогою балансувальника навантаження, хоча він також може налаштовувати ваш граничний маршрутизатор або додаткові фронтенди, щоб допомогти обробляти трафік.

Ingress не відкриває довільні порти чи протоколи. Для відкриття в інтернет доступу до сервісів, відмінних від HTTP та HTTPS, зазвичай використовується сервіс типу [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) або [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Передумови {#prerequisites}

Вам потрібно мати [контролер Ingress](/docs/concepts/services-networking/ingress-controllers), щоб забезпечити роботу Ingress. Саме лише створення ресурсу Ingress нічого не дає.

Ви можете вибрати з-поміж низки [контролерів Ingress](/docs/concepts/services-networking/ingress-controllers).

В ідеалі всі контролери Ingress мають відповідати еталонній специфікації. На практиці різні контролери Ingress працюють трошки по-різному.

{{< note >}}
Обовʼязково ознайомтеся з документацією вашого контролера Ingress, щоб зрозуміти застереження щодо його вибору.
{{< /note >}}

## Ресурс Ingress {#the-ingress-resource}

Мінімальний приклад ресурсу Ingress:

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

Для Ingress необхідні поля `apiVersion`, `kind`, `metadata` та `spec`. Назва обʼєкта Ingress повинна бути дійсним [імʼям DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names). Загальну інформацію про роботу з файлами конфігурації дивіться в розділах [розгортання застосунків](/docs/tasks/run-application/run-stateless-application-deployment/), [налаштування контейнерів](/docs/tasks/configure-pod-container/configure-pod-configmap/), [управління ресурсами](/docs/concepts/workloads/management/). Контролери Ingress часто використовують [анотації](/docs/concepts/overview/working-with-objects/annotations/) для налаштування поведінки. Ознайомтеся з документацією обраного вами контролера Ingress, щоб дізнатися, які анотації очікуються та/або підтримуються.

[Специфікація Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec) містить усю інформацію, необхідну для налаштування балансувальника навантаження чи проксі-сервера. Найважливіше те, що вона містить список правил, які зіставляються з усіма вхідними запитами. Ресурс Ingress підтримує правила лише для спрямування трафіку HTTP(S).

Якщо `ingressClassName` не вказано, має бути визначений [типовий клас Ingress](#default-ingress-class).

Деякі контролери Ingress працюють навіть без визначення типового IngressClass. Навіть якщо ви використовуєте контролер Ingress, який може працювати без будь-якого IngressClass, проєкт Kubernetes все одно рекомендує визначити типовий IngressClass.

### Правила Ingress {#ingress-rules}

Кожне правило HTTP містить таку інформацію:

* Необовʼязковий хост. У цьому прикладі хост не вказано, тому правило застосовується до всього вхідного HTTP-трафіку через вказану IP-адресу. Якщо вказано хост (наприклад, foo.bar.com), правила застосовуються до цього хосту.
* Список шляхів (наприклад, `/testpath`), кожен з яких має повʼязаний бекенд, визначений за допомогою `service.name` та `service.port.name` або `service.port.number`. Як хост, так і шлях мають відповідати вмісту вхідного запиту, перш ніж балансувальник навантаження спрямує трафік до вказаного Service.
* Бекенд — це комбінація імен Service та порту, як описано в [документації Service](/docs/concepts/services-networking/service/), або [бекенд власного ресурсу](#resource-backend) за допомогою {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}. HTTP (та HTTPS) запити до Ingress, які відповідають хосту та шляху правила, надсилаються до вказаного бекенду.

`defaultBackend` часто налаштовують у контролері Ingress для обслуговування будь-яких запитів, які не відповідають жодному шляху в специфікації.

### DefaultBackend {#default-backend}

Ingress без правил спрямовує весь трафік до єдиного типового бекенду, і `.spec.defaultBackend` — це бекенд, який має обробляти запити в цьому випадку. Зазвичай `defaultBackend` — це опція конфігурації [контролера Ingress](/docs/concepts/services-networking/ingress-controllers), і його не вказують у ваших ресурсах Ingress. Якщо не вказано `.spec.rules`, то має бути вказаний `.spec.defaultBackend`. Якщо `defaultBackend` не встановлено, обробка запитів, які не відповідають жодному з правил, залежить від контролера Ingress (зверніться до документації вашого контролера Ingress, щоб дізнатися, як він обробляє цей випадок).

Якщо жоден із хостів або шляхів в обʼєктах Ingress не відповідає HTTP-запиту, трафік спрямовується до вашого типового бекенду.

### Бекенди Resource {#resource-backend}

Бекенд `Resource` — це ObjectRef на інший ресурс Kubernetes у тому ж просторі імен, що й обʼєкт Ingress. `Resource` — це налаштування, взаємовиключне з Service: якщо вказано обидва, перевірка не буде пройдена. Поширене використання бекенду `Resource` — спрямування вхідних даних до бекенду обʼєктного сховища зі статичними ресурсами.

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

Після створення Ingress, наведеного вище, ви можете переглянути його за допомогою такої команди:

```bash
kubectl describe ingress ingress-resource-backend
```

```
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

Кожен шлях в Ingress повинен мати відповідний тип шляху. Шляхи, які не містять явного `pathType`, не пройдуть перевірку. Підтримуються три типи шляхів:

* `ImplementationSpecific`: З цим типом шляху визначення відповідності залежить від IngressClass. Реалізації можуть розглядати його як окремий `pathType` або обробляти його так само, як типи шляхів `Prefix` або `Exact`.

* `Exact`: Точно відповідає URL-шляху з урахуванням регістру.

* `Prefix`: Відповідність визначається за префіксом URL-шляху, розділеного `/`. Зіставлення виконується з урахуванням регістру і поелементно, за кожним елементом шляху. Елемент шляху — це список міток у шляху, розділених роздільником `/`. Запит відповідає шляху _p_, якщо кожен _p_ є поелементним префіксом _p_ шляху запиту.

  {{< note >}}
  Якщо останній елемент шляху є підрядком останнього елемента в шляху запиту, це не вважається відповідністю (наприклад: `/foo/bar` відповідає `/foo/bar/baz`, але не відповідає `/foo/barbaz`).
  {{< /note >}}

### Приклади {#examples}

| Тип      | Шлях(и)                         | Шлях(и) запиту                | Відповідає?                            |
|----------|---------------------------------|-------------------------------|----------------------------------------|
| Prefix   | `/`                             | (всі шляхи)                   | Так                                    |
| Exact    | `/foo`                          | `/foo`                        | Так                                    |
| Exact    | `/foo`                          | `/bar`                        | Ні                                     |
| Exact    | `/foo`                          | `/foo/`                       | Ні                                     |
| Exact    | `/foo/`                         | `/foo`                        | Ні                                     |
| Prefix   | `/foo`                          | `/foo`, `/foo/`               | Так                                    |
| Prefix   | `/foo/`                         | `/foo`, `/foo/`               | Так                                    |
| Prefix   | `/aaa/bb`                       | `/aaa/bbb`                    | Ні                                     |
| Prefix   | `/aaa/bbb`                      | `/aaa/bbb`                    | Так                                    |
| Prefix   | `/aaa/bbb/`                     | `/aaa/bbb`                    | Так, ігнорує кінцевий слеш             |
| Prefix   | `/aaa/bbb`                      | `/aaa/bbb/`                   | Так, збігається з кінцевим слешем      |
| Prefix   | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | Так, збігається з підшляхом            |
| Prefix   | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | Ні, не збігається з префіксом рядка    |
| Prefix   | `/`, `/aaa`                     | `/aaa/ccc`                    | Так, збігається з префіксом `/aaa`     |
| Prefix   | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | Так, збігається з префіксом `/aaa/bbb` |
| Prefix   | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | Так, збігається з префіксом `/`        |
| Prefix   | `/aaa`                          | `/ccc`                        | Ні, використовується типовий бекенд    |
| Змішаний | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | Так, перевага надається Exact          |

#### Декілька збігів {#multiple-matches}

У деяких випадках запиту можуть відповідати кілька шляхів у межах Ingress. У таких випадках перевага надається насамперед найдовшому шляху, що збігається. Якщо два шляхи все ще збігаються однаково, перевага надається шляхам із точним типом шляху перед префіксним типом шляху.

## Шаблони імен хостів {#hostname-wildcards}

Хости можуть бути точними збігами (наприклад, «`foo.bar.com`») або шаблонами (наприклад, «`*.foo.com`»). Точні збіги вимагають, щоб HTTP-заголовок `host` відповідав полю `host`. Збіги за шаблоном вимагають, щоб HTTP-заголовок `host` дорівнював суфіксу правила із шаблоном.

| Хост        | Заголовок host    | Збіг?                                                       |
| ----------- |-------------------| ------------------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Збіг на основі спільного суфікса                            |
| `*.foo.com` | `baz.bar.foo.com` | Немає збігу, шаблон охоплює лише одну DNS-мітку             |
| `*.foo.com` | `foo.com`         | Немає збігу, шаблон охоплює лише одну DNS-мітку             |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

## Клас Ingress {#ingress-class}

Ingressʼи можуть бути реалізовані різними контролерами, часто з різною конфігурацією. Кожен Ingress повинен вказувати клас — посилання на ресурс IngressClass, який містить додаткову конфігурацію, зокрема імʼя контролера, що має реалізувати цей клас.

{{% code_sample file="service/networking/external-lb.yaml" %}}

Поле `.spec.parameters` в IngressClass дозволяє посилатися на інший ресурс, який надає конфігурацію, повʼязану з цим IngressClass.

Конкретний тип параметрів залежить від контролера Ingress, який ви вказуєте в полі `.spec.controller` в IngressClass.

### Область застосування IngressClass {#ingressclass-scope}

Залежно від вашого контролера Ingress, ви можете використовувати параметри, які встановлюєте на рівні всього кластера або лише для одного простору імен.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Кластер" %}}
Типова область застосування параметрів IngressClass — весь кластер.

Якщо ви встановлюєте поле `.spec.parameters` і не встановлюєте `.spec.parameters.scope`, або встановлюєте `.spec.parameters.scope` у `Cluster`, тоді IngressClass посилається на ресурс на рівні кластера. `kind` (у поєднанні з `apiGroup`) параметрів вказує на API на рівні кластера (можливо, власний ресурс), а `name` параметрів ідентифікує конкретний ресурс на рівні кластера для цього API.

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
    # Параметри для цього IngressClass вказані в
    # ClusterIngressParameter (група API k8s.example.net) з назвою
    # "external-config-1". Це визначення вказує Kubernetes
    # шукати ресурс параметрів на рівні кластера.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Простір імен" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Якщо ви встановлюєте поле `.spec.parameters` і встановлюєте `.spec.parameters.scope` у `Namespace`, тоді IngressClass посилається на ресурс на рівні простору імен. Ви також повинні встановити поле `namespace` у `.spec.parameters` на простір імен, який містить параметри, що ви хочете використовувати.

`kind` (у поєднанні з `apiGroup`) параметрів вказує на API на рівні простору імен (наприклад: ConfigMap), а `name` параметрів ідентифікує конкретний ресурс у просторі імен, який ви вказали в `namespace`.

Параметри на рівні простору імен допомагають оператору кластера делегувати контроль над конфігурацією (наприклад: налаштування балансувальника навантаження, визначення API-шлюзу), що використовується для робочого навантаження. Якби ви використовували параметр на рівні кластера, то або:

- команді операторів кластера довелося б схвалювати зміни іншої команди щоразу, коли застосовується нова зміна конфігурації;
- оператору кластера довелося б визначити спеціальні засоби контролю доступу, як-от ролі та привʼязки [RBAC](/docs/reference/access-authn-authz/rbac/), що дозволяють команді застосунку вносити зміни в ресурс параметрів на рівні кластера.

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
    # Параметри для цього IngressClass вказані в
    # IngressParameter (група API k8s.example.com) з назвою "external-config",
    # що знаходиться в просторі імен "external-configuration".
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### Застаріла анотація {#deprecated-annotation}

До того, як у Kubernetes 1.18 було додано ресурс IngressClass та поле `ingressClassName`, класи Ingress вказувалися за допомогою анотації `kubernetes.io/ingress.class` в Ingress. Ця анотація ніколи не була формально визначена, але отримала широку підтримку контролерами Ingress.

Новіше поле `ingressClassName` в Ingress є заміною цієї анотації, але не є її прямим еквівалентом. Тоді як анотація зазвичай використовувалася для посилання на імʼя контролера Ingress, який має реалізувати Ingress, поле є посиланням на ресурс IngressClass, що містить додаткову конфігурацію Ingress, зокрема імʼя контролера Ingress.

### Типовий IngressClass {#default-ingress-class}

Ви можете позначити певний IngressClass як типовий для вашого кластера. Встановлення анотації `ingressclass.kubernetes.io/is-default-class` у значення `true` на ресурсі IngressClass забезпечить, що новим Ingress без вказаного поля `ingressClassName` буде призначено цей типовий IngressClass.

{{< caution >}}
Якщо у вашому кластері як типовий позначено більше одного IngressClass, контролер допуску не дозволяє створювати нові обʼєкти Ingress, в яких не вказано `ingressClassName`. Ви можете розвʼязати цю проблему, переконавшись, що у вашому кластері як типовий позначено щонайбільше 1 IngressClass.
{{< /caution >}}

Почніть з визначення типового IngressClass. Втім, рекомендується вказувати типовий IngressClass:

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

## Типи Ingress {#types-of-ingress}

### Ingress з одним Service у бекенді {#single-service-ingress}

У Kubernetes існують концепції, які дозволяють відкрити доступ до одного Service (див. [альтернативи](#alternatives)). Ви також можете зробити це за допомогою Ingress, вказавши *типовий бекенд* без правил.

{{% code_sample file="service/networking/test-ingress.yaml" %}}

Якщо ви створите його за допомогою `kubectl apply -f`, ви зможете переглянути стан доданого Ingress:

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

Де `203.0.113.123` — це IP-адреса, яку виділив контролер Ingress для виконання цього Ingress.

{{< note >}}
Контролерам Ingress та балансувальникам навантаження може знадобитися хвилина або дві, щоб виділити IP-адресу. До того часу ви часто бачитимете адресу у вигляді `<pending>`.
{{< /note >}}

### Просте розгалуження (fanout) {#simple-fanout}

Конфігурація розгалуження (fanout) маршрутизує трафік з однієї IP-адреси до більш ніж одного Service на основі запитуваного HTTP URI. Ingress дозволяє звести кількість балансувальників навантаження до мінімуму. Наприклад, таке налаштування:

{{< mermaid >}}
graph LR;
  client([клієнт])-. Балансувальник навантаження, <br> яким керує Ingress .->ingress[Ingress, 178.91.123.132];
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
{{< /mermaid >}}

*Схема. Розгалуження (fanout) Ingress*

Для цього знадобиться Ingress такого вигляду:

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

Коли ви створите Ingress за допомогою `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```
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

Контролер Ingress створює специфічний для реалізації балансувальник навантаження, який задовольняє Ingress, за умови, що існують сервіси (`service1`, `service2`). Коли це зроблено, ви можете побачити адресу балансувальника навантаження в полі Address.

{{< note >}}
Залежно від [контролера Ingress](/docs/concepts/services-networking/ingress-controllers/), який ви використовуєте, можливо, вам доведеться створити [Service](/docs/concepts/services-networking/service/) default-http-backend.
{{< /note >}}

### Віртуальний хостинг на основі імен {#name-based-virtual-hosting}

Віртуальні хости на основі імен підтримують маршрутизацію HTTP-трафіку до кількох імен хостів за однією IP-адресою.

{{< mermaid >}}
graph LR;
  client([клієнт])-. Балансувальник навантаження, <br> яким керує Ingress .->ingress[Ingress, 178.91.123.132];
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
{{< /mermaid >}}

*Схема. Віртуальний хостинг на основі імен з Ingress*

Наступний Ingress вказує балансувальнику навантаження, що стоїть за ним, маршрутизувати запити на основі [заголовка Host](https://tools.ietf.org/html/rfc7230#section-5.4).

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

Якщо ви створюєте ресурс Ingress без визначених у правилах хостів, то будь-який вебтрафік на IP-адресу вашого контролера Ingress може бути зіставлений без потреби у віртуальному хості на основі імен.

Наприклад, наступний Ingress маршрутизує трафік, запитаний для `first.bar.com`, до `service1`, для `second.bar.com` — до `service2`, а будь-який трафік, заголовок host запиту якого не відповідає `first.bar.com` і `second.bar.com`, — до `service3`.

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS {#tls}

Ви можете захистити Ingress, вказавши {{< glossary_tooltip term_id="secret" >}}, що містить приватний ключ і сертифікат TLS. Ресурс Ingress підтримує лише один TLS-порт, 443, і передбачає термінацію TLS у точці входу (трафік до Service та його Podʼів передається відкритим текстом). Якщо розділ конфігурації TLS в Ingress вказує різні хости, вони мультиплексуються на одному порту відповідно до імені хоста, вказаного через розширення TLS SNI (за умови, що контролер Ingress підтримує SNI). Секрет TLS повинен містити ключі з іменами `tls.crt` та `tls.key`, які містять сертифікат та приватний ключ для використання з TLS. Наприклад:

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

Посилання на цей секрет в Ingress вказує контролеру Ingress захистити канал від клієнта до балансувальника навантаження за допомогою TLS. Вам потрібно переконатися, що створений вами секрет TLS походить із сертифіката, який містить Common Name (CN), також відоме як Fully Qualified Domain Name (FQDN), для `https-example.foo.com`.

{{< note >}}
Майте на увазі, що TLS не працюватиме для типового правила, оскільки сертифікати довелося б видавати для всіх можливих піддоменів. Тому `hosts` у розділі `tls` мають явно відповідати `host` у розділі `rules`.
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
Між функціями TLS, які підтримують різні контролери Ingress, існують розбіжності. Ознайомтеся з документацією обраного вами контролера (чи контролерів) Ingress, щоб зрозуміти, як TLS працює у вашому середовищі.
{{< /note >}}

### Балансування навантаження {#load-balancing}

Контролер Ingress запускається з певними налаштуваннями політики балансування навантаження, які він застосовує до всіх Ingress, як-от алгоритм балансування навантаження, схема ваг бекендів тощо. Складніші концепції балансування навантаження (наприклад, постійні сесії, динамічні ваги) поки що недоступні через Ingress. Натомість ці функції можна отримати через балансувальник навантаження, що використовується для Service.

Також варто зазначити, що хоча перевірки стану не доступні безпосередньо через Ingress, у Kubernetes існують паралельні концепції, як-от [проби готовності](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/), які дозволяють досягти того самого результату. Ознайомтеся з документацією конкретного контролера, щоб дізнатися, як він обробляє перевірки стану.

## Оновлення Ingress {#updating-an-ingress}

Щоб оновити наявний Ingress і додати новий хост, ви можете відредагувати ресурс:

```shell
kubectl describe ingress test
```

```
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

Після збереження змін kubectl оновлює ресурс в API-сервері, що повідомляє контролеру Ingress, що потрібно переналаштувати балансувальник навантаження.

Перевірте це:

```shell
kubectl describe ingress test
```

```
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

Ви можете досягти того самого результату, викликавши `kubectl replace -f` зі зміненим YAML-файлом Ingress.

## Перемикання між зонами доступності в разі збою {#failing-across-availability-zones}

Методи розподілу трафіку між доменами відмови відрізняються в різних хмарних провайдерів. Подробиці дивіться в документації відповідного [контролера Ingress](/docs/concepts/services-networking/ingress-controllers).

## Альтернативи {#alternatives}

Ви можете відкрити доступ до Service різними способами, які безпосередньо не стосуються ресурсу Ingress:

* Використовуйте [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Використовуйте [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport)

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся про API [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/)
* Дізнайтеся про [контролери Ingress](/docs/concepts/services-networking/ingress-controllers/)
