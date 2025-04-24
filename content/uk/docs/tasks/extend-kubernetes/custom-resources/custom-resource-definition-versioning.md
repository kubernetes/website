---
title: Версії у CustomResourceDefinitions
content_type: task
weight: 30
min-kubernetes-server-version: v1.16
---

<!-- overview -->
Ця сторінка пояснює, як додати інформацію про версії до [CustomResourceDefinitions](/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/), щоб вказати рівень стабільності ваших CustomResourceDefinitions або перейти на нову версію з конвертацією між представленнями API. Також описується, як оновити обʼєкт з однієї версії до іншої.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Ви вже повинні розуміти що таке [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

{{< version-check >}}

<!-- steps -->

## Огляд {#overview}

API CustomResourceDefinition надає робочий процес для впровадження та оновлення нових версій CustomResourceDefinition.

Коли створюється CustomResourceDefinition, перша версія встановлюється в списку `spec.versions` CustomResourceDefinition на відповідний рівень стабільності та номер версії. Наприклад, `v1beta1` буде вказувати, що перша версія ще не стабільна. Всі обʼєкти власних ресурсів спочатку будуть зберігатися в цій версії.

Після створення CustomResourceDefinition, клієнти можуть почати використовувати API `v1beta1`.

Пізніше може знадобитися додати нову версію, наприклад `v1`.

Додавання нової версії:

1. Виберіть стратегію конвертації. Оскільки обʼєкти власних ресурсів повинні мати можливість обслуговуватися в обох версіях, це означає, що вони іноді будуть обслуговуватися у версії, відмінній від тієї, в якій зберігаються. Для цього іноді потрібно конвертувати обʼєкти власних ресурсів між версією, в якій вони зберігаються, та версією, в якій вони обслуговуються. Якщо конвертація передбачає зміни схеми та вимагає власної логіки, слід використовувати конвертаційний webhook. Якщо змін схеми немає, можна використовувати стратегію конвертації `None`, і при обслуговуванні різних версій буде змінено лише поле `apiVersion`.
1. Якщо використовуються конвертаційні webhook'и, створіть і розгорніть конвертаційний webhook. Див. [Конвертація через webhook](#webhook-conversion) для отримання більш детальної інформації.
1. Оновіть CustomResourceDefinition, включивши нову версію в список `spec.versions` з `served:true`. Також встановіть поле `spec.conversion` на вибрану стратегію конвертації. Якщо використовується конвертаційний webhook, налаштуйте поле `spec.conversion.webhookClientConfig` для виклику webhook.

Після додавання нової версії клієнти можуть поступово перейти на нову версію. Цілком безпечно для деяких клієнтів використовувати стару версію, тоді як інші використовують нову версію.

Міграція збережених обʼєктів до нової версії:

1. Див. розділ [оновлення наявних обʼєктів до нової збереженої версії](#upgrade-existing-objects-to-a-new-stored-version).

Клієнти можуть безпечно використовувати як стару, так і нову версію до, під час і після оновлення обʼєктів до нової збереженої версії.

Видалення старої версії:

1. Переконайтеся, що всі клієнти повністю перейшли на нову версію. Логи kube-apiserver можна переглянути для виявлення клієнтів, які все ще використовують стару версію.
1. Встановіть `served` на `false` для старої версії в списку `spec.versions`. Якщо якісь клієнти все ще несподівано використовують стару версію, вони можуть почати повідомляти про помилки при спробі доступу до обʼєктів власних ресурсів у старій версії. У такому випадку поверніться до використання `served:true` на старій версії, мігруйте залишкових клієнтів на нову версію та повторіть цей крок.
1. Переконайтеся, що крок [оновлення поточних обʼєктів до нової збереженої версії](#upgrade-existing-objects-to-a-new-stored-version) завершено.
   1. Перевірте, що `storage` встановлено на `true` для нової версії в списку `spec.versions` в CustomResourceDefinition.
   1. Перевірте, що стара версія більше не згадується в `status.storedVersions` CustomResourceDefinition.
1. Видаліть стару версію зі списку `spec.versions` CustomResourceDefinition.
1. Припиніть підтримку конвертації для старої версії в конвертаційних webhook'ах.

## Зазначення кількох версій {#specify-multiple-versions}

Поле `versions` в CustomResourceDefinition API може бути використане для підтримки кількох версій розроблених вами власних ресурсів. Версії можуть мати різні схеми, а конвертаційні webhook'и можуть конвертувати власні ресурси між версіями. Конвертації через webhook повинні дотримуватися [конвенцій Kubernetes API](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md) в тих випадках, де це застосовується. Зокрема, дивіться [документацію по змінах API](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) для набору корисних порад та рекомендацій.

{{< note >}}
У `apiextensions.k8s.io/v1beta1` було поле `version` замість `versions`. Поле `version` є застарілим і необовʼязковим, але якщо воно не пусте, воно повинно відповідати першому елементу у полі `versions`.
{{< /note >}}

У цьому прикладі показано CustomResourceDefinition з двома версіями. У першому прикладі припускається, що всі версії мають однакову схему без конвертації між ними. У YAML-файлах наведено коментарі, які надають додатковий контекст.

{{< tabs name="Приклад_1_вибірки_версій_CustomResourceDefinition" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # назва повинна відповідати полям spec нижче, і бути у формі: <plural>.<group>
  name: crontabs.example.com
spec:
  # імʼя групи, яке буде використовуватися для REST API: /apis/<group>/<version>
  group: example.com
  # список версій, підтримуваних цим CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожна версія може бути увімкнена/вимкнена прапорцем Served.
    served: true
    # Лише одна версія повинна бути позначена як версія зберігання.
    storage: true
    # Схема обовʼязкова
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  # Секція конвертації була введена в Kubernetes 1.13+ зі стандартним значенням
  # конвертації None (стратегії встановленя субполів None).
  conversion:
    # Конвертація None передбачає ту ж саму схему для всіх версій, і лише встановлює apiVersion
    # поле власних ресрів у відповідне значення
    strategy: None
  # або Namespaced або Cluster
  scope: Namespaced
  names:
    # plural, назва ресрусу в що використовується в URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular, назва ресурсу в що буде використовуватись як аліас в CLI та у виводі
    singular: crontab
    # kind, зазвичай тип в однині в CamelCase. Ваші маніфести будуть використовувати це.
    kind: CronTab
    # shortNames, дозволяють коротше звертатися до ресурсу в CLI
    shortNames:
    - ct
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# Застаріло у версії v1.16 на користь apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # імʼя має збігатися з полями spec нижче і бути у формі: <plural>.<group>
  name: crontabs.example.com
spec:
  # імʼя групи для використання в REST API: /apis/<group>/<version>
  group: example.com
  # список версій, які підтримуються цим CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожна версія може бути увімкненна/вимкнена за допомогою прапорця Served.
    served: true
    # Лише одна версія повинна бути позначена як версія зберігання.
    storage: true
  - name: v1
    served: true
    storage: false
  validation:
    openAPIV3Schema:
      type: object
      properties:
        host:
          type: string
        port:
          type: string
  # Розділ конвертації введений у Kubernetes 1.13+ зі стандартним значенням конвертації
  # None (підполе strategy встановлено на None).
  conversion:
    # None конфертація передбачає однакову схему для всіх версій і лише встановлює поле apiVersion
    # власних ресурсів у правильне значення
    strategy: None
  # або Namespaced, або Cluster
  scope: Namespaced
  names:
    # plural, назва ресрусу в що використовується в URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular, назва ресурсу в що буде використовуватись як аліас в CLI та у виводі
    singular: crontab
    # kind, зазвичай тип в однині в PascalCased. Ваші маніфести будуть використовувати це.
    kind: CronTab
    # shortNames, дозволяють коротше звертатися до ресурсу в CLI
    shortNames:
    - ct
```

{{% /tab %}}
{{< /tabs >}}

Ви можете зберегти CustomResourceDefinition у YAML-файлі, а потім використати `kubectl apply`, щоб створити його.

```shell
kubectl apply -f my-versioned-crontab.yaml
```

Після створення API-сервер починає обслуговувати кожну включену версію за HTTP REST-точкою доступу. У наведеному вище прикладі, версії API доступні за адресами `/apis/example.com/v1beta1` та `/apis/example.com/v1`.

### Пріоритет версії {#version-priority}

Незалежно від порядку, в якому версії визначені в CustomResourceDefinition, версія з найвищим пріоритетом використовується kubectl як стандартна версія для доступу до обʼєктів. Пріоритет визначається шляхом аналізу поля _name_ для визначення номера версії, стабільності (GA, Beta або Alpha) та послідовності в межах цього рівня стабільності.

Алгоритм, який використовується для сортування версій, розроблений для сортування версій таким же чином, як проєкт Kubernetes сортує версії Kubernetes. Версії починаються з `v`, за яким слідує число, опціональне позначення `beta` або `alpha`, та опціональна додаткова числова інформація про версію. В загальному вигляді рядок версії може виглядати як `v2` або `v2beta1`. Версії сортуються за таким алгоритмом:

- Записи, що відповідають шаблонам версій Kubernetes, сортуються перед тими, що не відповідають шаблонам.
- Для записів, що відповідають шаблонам версій Kubernetes, числові частини рядка версії сортуються від більшого до меншого.
- Якщо після першої числової частини йдуть рядки `beta` або `alpha`, вони сортуються в такому порядку після еквівалентного рядка без суфікса `beta` або `alpha` (який вважається GA версією).
- Якщо після `beta` або `alpha` йде ще одне число, ці числа також сортуються від більшого до меншого.
- Рядки, що не відповідають зазначеному формату, сортуються за алфавітом, і числові частини не мають спеціального порядку. Зауважте, що в наведеному нижче прикладі `foo1` сортується вище за `foo10`. Це відрізняється від сортування числових частин записів, що відповідають шаблонам версій Kubernetes.

Це може бути зрозуміло, якщо подивитися на наступний відсортований список версій:

```none
- v10
- v2
- v1
- v11beta2
- v10beta3
- v3beta1
- v12alpha1
- v11alpha2
- foo1
- foo10
```

Для прикладу у розділі [Зазначення кількох версій](#specify-multiple-versions), порядок сортування версій — `v1`, за яким слідує `v1beta1`. Це змушує команду kubectl використовувати `v1` як стандартну версію, якщо у наданому обʼєкті не вказано версію.

### Застарівання версій {#version-deprecation}

{{< feature-state state="stable" for_k8s_version="v1.19" >}}

Починаючи з версії v1.19, CustomResourceDefinition може вказувати, що певна версія ресурсу, який він визначає, є застарілою. Коли API-запити до застарілої версії цього ресурсу здійснюються, у відповідь API повертається попереджувальне повідомлення в заголовку. Попереджувальне повідомлення для кожної застарілої версії ресурсу можна налаштувати за бажанням.

Налаштоване попереджувальне повідомлення повинно вказувати застарілу API-групу, версію та тип (kind), і, якщо це можливо, вказувати, яку API-групу, версію та тип слід використовувати замість цього.

{{< tabs name="CustomResourceDefinition_versioning_deprecated" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  versions:
  - name: v1alpha1
    served: true
    storage: false
    # Це вказує, що версія v1alpha1 власного ресурсу є застарілою.
    # API-запити до цієї версії отримують попереджувальний заголовок у відповіді сервера.
    deprecated: true
    # Це перевизначає стандартне попереджувальне повідомлення, яке повертається клієнтам API, що здійснюють запити до v1alpha1.
    deprecationWarning: "example.com/v1alpha1 CronTab застарілий; див. http://example.com/v1alpha1-v1 для інструкцій щодо переходу на example.com/v1 CronTab"

    schema: ...
  - name: v1beta1
    served: true
    # Це вказує, що версія v1beta1 власного ресурсу є застарілою.
    # API-запити до цієї версії отримують попереджувальний заголовок у відповіді сервера.
    # Стандартне попереджувальне повідомлення повертається для цієї версії.
    deprecated: true
    schema: ...
  - name: v1
    served: true
    storage: true
    schema: ...
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# Застаріло у v1.16 на користь apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  validation: ...
  versions:
  - name: v1alpha1
    served: true
    storage: false
    # Це вказує, що версія v1alpha1 власного ресурсу є застарілою.
    # API-запити до цієї версії отримують попереджувальний заголовок у відповіді сервера.
    deprecated: true
    # Це перевизначає стандартне попереджувальне повідомлення, яке повертається клієнтам API, що здійснюють запити до v1alpha1.
    deprecationWarning: "example.com/v1alpha1 CronTab застарілий; див. http://example.com/v1alpha1-v1 для інструкцій щодо переходу на example.com/v1 CronTab"
  - name: v1beta1
    served: true
    # Це вказує, що версія v1beta1 власного ресурсу є застарілою.
    # API-запити до цієї версії отримують попереджувальний заголовок у відповіді сервера.
    # Стандартне попереджувальне повідомлення повертається для цієї версії.
    deprecated: true
  - name: v1
    served: true
    storage: true
```

{{% /tab %}}
{{< /tabs >}}

### Видалення версії {#version-removal}

Стара версія API не може бути видалена з маніфесту CustomResourceDefinition, доки наявні збережені дані не будуть мігровані до новішої версії API для всіх кластерів, які обслуговували стару версію власного ресурсу, та поки стара версія не буде видалена зі списку `status.storedVersions` у CustomResourceDefinition.

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  versions:
  - name: v1beta1
    # Це вказує, що версія v1beta1 власного ресурсу більше не обслуговується.
    # API-запити до цієї версії отримують помилку "не знайдено" у відповіді сервера.
    served: false
    schema: ...
  - name: v1
    served: true
    # Нова версія, що обслуговується повинна бути встановлена як версія зберігання
    storage: true
    schema: ...
```

## Конвертація за допомогою вебхука {#webhook-conversion}

{{< feature-state state="stable" for_k8s_version="v1.16" >}}

{{< note >}}
Конвертація за допомогою вебхука доступна як бета-версія з версії 1.15, і як альфа-версія з Kubernetes 1.13. Функція `CustomResourceWebhookConversion` повинна бути увімкнена, що автоматично відбувається для багатьох кластерів з бета-функціями. Будь ласка, зверніться до документації [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) для отримання додаткової інформації.
{{< /note >}}

Наведений вище приклад має None-конвертацію між версіями, яка лише встановлює поле `apiVersion` під час конвертації та не змінює решту обʼєкта. API-сервер також підтримує конвертації за допомогою вебхука, які викликають зовнішній сервіс у випадку, коли потрібна конвертація. Наприклад, коли:

- власний ресурс запитується у версії, яка відрізняється від збереженої версії.
- створюється спостереження (Watch) в одній версії, але змінений обʼєкт зберігається в іншій версії.
- запит на PUT для власного ресурсу здійснюється в іншій версії, ніж версія зберігання.

Щоб охопити всі ці випадки та оптимізувати конвертацію за допомогою API-сервера, запити на конвертацію можуть містити кілька обʼєктів з метою мінімізації зовнішніх викликів. Вебхук повинен виконувати ці конвертації незалежно.

### Написання сервера для конвертації за допомогою вебхука {#write-a-webhook-conversion-server}

Будь ласка, зверніться до реалізації [сервера вебхука для конвертації власних ресурсів](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/main.go), який проходить перевірку в e2e тесті Kubernetes. Вебхук обробляє запити `ConversionReview`, що надсилаються API-серверами, і надсилає назад результати конвертації, загорнуті в `ConversionResponse`. Зверніть увагу, що запит містить список власних ресурсів, які потрібно конвертувати незалежно, не змінюючи порядок обʼєктів. Приклад сервера організований таким чином, щоб його можна було повторно використовувати для інших конвертацій. Більшість загального коду знаходиться у [файлі фреймворку](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/framework.go), залишаючи лише [одну функцію](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/example_converter.go#L29-L80) для реалізації різних конвертацій.

{{< note >}}
Приклад сервера вебхука для конвертації залишає поле `ClientAuth` [порожнім](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/config.go#L47-L48), що стандартно встановлюється в `NoClientCert`. Це означає, що сервер вебхука не автентифікує особу клієнтів, ймовірно API-серверів. Якщо вам потрібен взаємний TLS або інші способи автентифікації клієнтів, дивіться, як [автентифікувати API-сервери](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
{{< /note >}}

#### Допустимі зміни {#permisible-changes}

Вебхук для конвертації не повинен змінювати нічого в полі `metadata` обʼєкта, окрім `labels` та `annotations`. Спроби змінити `name`, `UID` та `namespace` відхиляються і призводять до помилки запиту, що спричинив конвертацію. Усі інші зміни ігноруються.

### Розгортання сервера вебхука для конвертації {#deploy-webhook-conversion-server}

Документація для розгортання вебхука для конвертації аналогічна документації для [прикладу сервісу вебхука для допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy-the-admission-webhook-service). Наступні секції передбачають, що сервер вебхука для конвертації розгорнутий як сервіс з іменем `example-conversion-webhook-server` у просторі імен `default` та обслуговує трафік за шляхом `/crdconvert`.

{{< note >}}
Коли сервер вебхука розгорнуто в кластер Kubernetes як сервіс, він має бути доступний через сервіс на порту 443 (сам сервер може використовувати довільний порт, але обʼєкт сервісу повинен зіставити його з портом 443). Комунікація між API-сервером і сервісом вебхука може не вдатися, якщо використовується інший порт для сервісу.
{{< /note >}}

### Налаштування CustomResourceDefinition для використання вебхуків конвертації {#configure-customeresourcedefinition-to-use-conversion-webhooks}

Приклад `None` конвертації можна розширити для використання вебхука конвертації, змінивши розділ `conversion` в розділі `spec`:

{{< tabs name="CustomResourceDefinition_versioning_example_2" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # імʼя повинно відповідати полям spec нижче, і мати форму: <plural>.<group>
  name: crontabs.example.com
spec:
  # назва групи, яку використовувати для REST API: /apis/<group>/<version>
  group: example.com
  # список версій, які підтримуються цим CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожну версію можна увімкнути/вимкнути за допомогою прапорця Served.
    served: true
    # Одна і тільки одна версія повинна бути позначена як версія для зберігання.
    storage: true
    # Кожна версія може визначити свою власну схему, коли немає визначеної схеми верхнього рівня.
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # стратегія Webhook інструктує сервер API викликати зовнішній вебхук для будь-якої конвертації між власними ресурсами.
    strategy: Webhook
    # вебхук необхідний, коли стратегія - `Webhook`, і він налаштовує точку доступу вебхука для виклику сервером API.
    webhook:
      # conversionReviewVersions вказує, які версії ConversionReview розуміються/надається  перевага вебхуком.
      # Перша версія у списку, яку розуміє сервер API, надсилається до вебхуку.
      # Вебхук повинен відповісти обʼєктом ConversionReview в тій самій версії, що й отримана.
      conversionReviewVersions: ["v1","v1beta1"]
      clientConfig:
        service:
          namespace: default
          name: example-conversion-webhook-server
          path: /crdconvert
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # або Namespaced, або Cluster
  scope: Namespaced
  names:
    # plural, назва ресурсу в що використовується в URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular, назва ресурсу в що буде використовуватись як аліас в CLI та у виводі
    singular: crontab
    # kind, зазвичай тип в однині в CamelCased. Ваші маніфести будуть використовувати це.
    kind: CronTab
    # shortNames, дозволяють коротше звертатися до ресурсу в CLI
    shortNames:
    - ct
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# Застаріло у v1.16 на користь apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # імʼя повинно відповідати полям spec нижче, і мати форму: <plural>.<group>
  name: crontabs.example.com
spec:
  # назва групи, яку використовувати для REST API: /apis/<group>/<version>
  group: example.com
  # обрізає поля обʼєктів, які не вказані у схемах OpenAPI нижче.
  preserveUnknownFields: false
  # список версій, які підтримуються цим CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожну версію можна включити/вимкнути за допомогою прапорця Served.
    served: true
    # Одна і тільки одна версія повинна бути позначена як версія зберігання.
    storage: true
    # Кожна версія може визначити свою власну схему, коли немає визначеної схеми верхнього рівня.
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # стратегія Webhook інструктує сервер API викликати зовнішній вебхук для будь-якої конвертації між власними ресурсами.
    strategy: Webhook
    # webhookClientConfig необхідний, коли стратегія - `Webhook`, і він налаштовує точку доступу вебхука для виклику сервером API.
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        path: /crdconvert
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # або Namespaced, або Cluster
  scope: Namespaced
  names:
    # plural, назва ресурсу в що використовується в URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular, назва ресурсу в що буде використовуватись як аліас в CLI та у виводі
    singular: crontab
    # kind, зазвичай тип в однині в CamelCased. Ваші маніфести будуть використовувати це.
    kind: CronTab
    # shortNames, дозволяють коротше звертатися до ресурсу в CLI
    shortNames:
    - ct
```

{{% /tab %}}
{{< /tabs >}}

Ви можете зберегти опис CustomResourceDefinition у файлі YAML, а потім використовувати
`kubectl apply`, щоб застосувати його.

```shell
kubectl apply -f мій-версійний-crontab-з-конвертацією.yaml
```

Переконайтеся, що сервіс конвертації працює, перш ніж застосовувати нові зміни.

### Звʼязок з вебхуком {#contacting-the-webhook}

Після того, як сервер API визначив, що запит потрібно надіслати до вебхуку конвертації, йому потрібно знати, як звʼязатися з вебхуком. Це вказується в розділі `webhookClientConfig` конфігурації вебхука.

Вебхуки конвертації можуть бути викликані або через URL, або через посилання на сервіс, і можуть додатково містити власний пакет CA для перевірки TLS-зʼєднання.

### URL

`url` вказує знаходження вебхука, у стандартній формі URL (`scheme://host:port/path`).

`host` не повинен посилатися на сервіс, що працює в кластері; використовуйте посилання на сервіс, вказавши замість цього поле `service`. Хост може бути вирішений через зовнішній DNS в деяких apiserver-ах (тобто `kube-apiserver` не може виконувати внутрішній DNS, оскільки це було б порушенням рівня). `host` також може бути IP-адресою.

Зверніть увагу, що використання `localhost` або `127.0.0.1` як `host` є ризикованим, якщо ви не приділяєте велику увагу тому, щоб запустити цей вебхук на всіх хостах, на яких працює apiserver, який може потребувати звернень до цього вебхука. Такі установки, швидше за все, не будуть переносними або не можуть бути легко запущені в новому кластері.

Схема повинна бути "https"; URL повинен починатися з "https://".

Спроба використання автентифікації користувача або базової автентифікації (наприклад, "user:password@") заборонена. Фрагменти ("#...") та параметри запиту ("?...") також не дозволені.

Ось приклад вебхука конвертації, налаштованого на виклик URL (і очікується, що сертифікат TLS буде перевірений за допомогою коренів довіри системи, тому не вказується `caBundle`):

{{< tabs name="CustomResourceDefinition_versioning_example_3" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# Застаріло у v1.16 на користь apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```

{{% /tab %}}
{{< /tabs >}}

### Посилання на сервіс {#service-reference}

Розділ `service` всередині `webhookClientConfig` є посиланням на сервіс для вебхука конвертації. Якщо вебхук працює всередині кластера, то ви повинні використовувати `service` замість `url`. Простір імен та імʼя сервісу є обовʼязковими. Порт є необовʼязковим і типово дорівнює 443. Шлях є необовʼязковим і типово дорівнює "/".

Ось приклад вебхука, який налаштований на виклик сервісу на порту "1234" з шляхом "/my-path", і для перевірки TLS-зʼєднання на ServerName `my-service-name.my-service-namespace.svc` з використанням власного пакету CA.

{{< tabs name="CustomResourceDefinition_versioning_example_4" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        service:
          namespace: my-service-namespace
          name: my-service-name
          path: /my-path
          port: 1234
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# Застаріло у v1.16 на користь apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      service:
        namespace: my-service-namespace
        name: my-service-name
        path: /my-path
        port: 1234
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```

{{% /tab %}}
{{< /tabs >}}

## Запити та відповіді вебхуків {#webhook-requests-and-responses}

### Запит {#request}

Вебхуки надсилають POST-запит з `Content-Type: application/json`, з обʼєктом API `ConversionReview` з API-групи `apiextensions.k8s.io`, який серіалізується в JSON як тіло запиту.

Вебхуки можуть вказати, які версії обʼєктів `ConversionReview` вони приймають, за допомогою поля `conversionReviewVersions` у своїй CustomResourceDefinition:

{{< tabs name="conversionReviewVersions" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      conversionReviewVersions: ["v1", "v1beta1"]
      ...
```

Поле `conversionReviewVersions` є обовʼязковим при створенні custom resource definitions `apiextensions.k8s.io/v1`. Вебхуки повинні підтримувати принаймні одну версію `ConversionReview`, яку розуміє поточний та попередній API сервер.
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# Застаріло у v1.16 на користь apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    conversionReviewVersions: ["v1", "v1beta1"]
    ...
```

Якщо `conversionReviewVersions` не вказано, стандартно при створенні  custom resource definitions `apiextensions.k8s.io/v1beta1` використовується `v1beta1`.
{{% /tab %}}
{{< /tabs >}}

API сервери надсилають першу версію `ConversionReview` у списку `conversionReviewVersions`, яку вони підтримують. Якщо жодна з версій у списку не підтримується API сервером, створення custom resource definition не буде дозволено. Якщо API сервер зустрічає конфігурацію вебхука конвертації, яка була створена раніше і не підтримує жодної з версій `ConversionReview`, які сервер може надіслати, спроби виклику вебхука завершаться невдачею.

Цей приклад показує дані, що містяться в обʼєкті `ConversionReview` для запиту на конверсію обʼєктів `CronTab` до `example.com/v1`:

{{< tabs name="ConversionReview_request" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "request": {
    # Випадковий uid, який унікально ідентифікує цей виклик конвертації
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # API група та версія, до якої повинні бути конвертовані обʼєкти
    "desiredAPIVersion": "example.com/v1",

    # Список обʼєктів для конвертації.
    # Може містити один або більше обʼєктів, у одній або більше версіях.
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
{
  # Застаріло у v1.16 на користь apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "request": {
    # Випадковий uid, який унікально ідентифікує цей виклик конвертації
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # API група та версія, до якої повинні бути конвертовані обʼєкти
    "desiredAPIVersion": "example.com/v1",

    # Список обʼєктів для конвертації.
    # Може містити один або більше обʼєктів, у одній або більше версіях.
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```

{{% /tab %}}
{{< /tabs >}}

### Відповідь {#response}

Вебхуки відповідають зі статусом HTTP 200, `Content-Type: application/json` та тілом, що містить обʼєкт `ConversionReview` (у тій самій версії, у якій вони були надіслані), з заповненим розділом `response`, серіалізованим у JSON.

Якщо конвертація успішна, вебхук має повернути розділ `response`, що містить наступні поля:

- `uid`, скопійований з `request.uid`, надісланого до вебхука
- `result`, встановлений на `{"status":"Success"}`
- `convertedObjects`, що містить всі обʼєкти з `request.objects`, конвертовані до `request.desiredAPIVersion`

Приклад мінімально успішної відповіді від вебхука:

{{< tabs name="ConversionReview_response_success" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    # має збігатись з <request.uid>
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Success"
    },
    # Обʼєкти мають відповідати порядку request.objects та мати apiVersion, встановлений у <request.desiredAPIVersion>.
    # поля kind, metadata.uid, metadata.name та metadata.namespace не повинні змінюватися вебхуком.
    # поля metadata.labels та metadata.annotations можуть бути змінені вебхуком.
    # всі інші зміни полів metadata, зроблені вебхуком, ігноруються.
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-б5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-б553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
{
  # Застаріло у версії v1.16 на користь apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    # має відповідати <request.uid>
    "uid": "705ab4f5-6393-11e8-б7cc-42010a800002",
    "result": {
      "status": "Failed"
    },
    # Обʼєкти мають відповідати порядку request.objects та мати apiVersion, встановлений у <request.desiredAPIVersion>.
    # поля kind, metadata.uid, metadata.name та metadata.namespace не повинні змінюватися вебхуком.
    # поля metadata.labels та metadata.annotations можуть бути змінені вебхуком.
    # всі інші зміни полів metadata, зроблені вебхуком, ігноруються.
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-б5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-б575-460d-б553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```

{{% /tab %}}
{{< /tabs >}}

Якщо конвертація не вдалася, вебхук має повернути розділ `response`, що містить наступні поля:

- `uid`, скопійований з `request.uid`, надісланого до вебхуку
- `result`, встановлений на `{"status":"Failed"}`

{{< warning >}}
Невдала конвертація може порушити доступ для читання та запису до власних ресурсів, включаючи можливість оновлення або видалення ресурсів. Збоїв у конвертації слід уникати за будь-якої можливості, і не слід використовувати їх для забезпечення дотримання обмежень на валідацію (використовуйте схеми валідації або admission webhook).
{{< /warning >}}

Приклад відповіді від вебхуку, що вказує на невдачу запиту конвертації, з додатковим повідомленням:

{{< tabs name="ConversionReview_response_failure" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<значення з request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort не вдалося розділити на окремі host та port"
    }
  }
}
```

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
{
  # Застаріло у версії v1.16 на користь apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<значення з request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort не вдалося розділити на окремі host та port"
    }
  }
}
```

{{% /tab %}}
{{< /tabs >}}

## Запис, читання та оновлення обʼєктів CustomResourceDefinition з версіями {#writing-reading-and-updating-versioned-customresourcedefinition-objects}

Коли обʼєкт записується, він зберігається у версії, визначеній як версія зберігання на момент запису. Якщо версія зберігання змінюється, наявні обʼєкти ніколи не конвертуються автоматично. Проте новостворені або оновлені обʼєкти записуються у новій версії зберігання. Можливо, що обʼєкт було записано у версії, яка більше не обслуговується.

Коли ви зчитуєте обʼєкт, ви вказуєте версію як частину шляху. Ви можете запитати обʼєкт у будь-якій версії, яка наразі обслуговується. Якщо ви вказуєте версію, яка відрізняється від версії, у якій зберігається обʼєкт, Kubernetes повертає вам обʼєкт у запитуваній версії, але збережений обʼєкт не змінюється на диску.

Що відбувається з обʼєктом, який повертається під час обслуговування запиту на читання, залежить від того, що вказано у `spec.conversion` CRD:

- Якщо вказано стандартне значення стратегії `None`, єдині зміни обʼєкта — це зміна рядка `apiVersion` і, можливо, [обрізання невідомих полів](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning) (залежно від конфігурації). Зазначимо, що це навряд чи призведе до хороших результатів, якщо схеми відрізняються між версіями зберігання та запитуваною версією. Зокрема, не слід використовувати цю стратегію, якщо ті самі дані представлені у різних полях між версіями.
- Якщо вказано [конвретацію за допомогою вебхуку](#webhook-conversion), тоді цей механізм контролює конверсію.

Якщо ви оновлюєте існуючий обʼєкт, він перезаписується у версії, яка наразі є версією зберігання. Це єдиний спосіб, за допомогою якого обʼєкти можуть змінюватися з однієї версії на іншу.

Щоб проілюструвати це, розглянемо наступну гіпотетичну послідовність подій:

1. Версія зберігання — `v1beta1`. Ви створюєте обʼєкт. Він зберігається у версії `v1beta1`.
2. Ви додаєте версію `v1` до вашого CustomResourceDefinition і призначаєте її версією зберігання. Схеми для `v1` та `v1beta1` є ідентичними, що зазвичай має місце під час підвищення API до стабільного стану в екосистемі Kubernetes.
3. Ви читаєте свій обʼєкт у версії `v1beta1`, потім читаєте обʼєкт знову у версії `v1`. Обидва отримані обʼєкти є ідентичними, за винятком поля apiVersion.
4. Ви створюєте новий обʼєкт. Він зберігається у версії `v1`. Тепер у вас є два обʼєкти: один у версії `v1beta1`, інший у версії `v1`.
5. Ви оновлюєте перший обʼєкт. Тепер він зберігається у версії `v1`, оскільки це поточна версія зберігання.

### Попередні версії зберігання {#previous-stored-versions}

API сервер записує кожну версію, яка коли-небудь була позначена як версія зберігання у полі статусу `storedVersions`. Обʼєкти можуть бути збережені у будь-якій версії, яка коли-небудь була визначена як версія зберігання. Ніякі обʼєкти не можуть існувати у зберіганні у версії, яка ніколи не була версією зберігання.

## Оновлення існуючих обʼєктів до нової версії зберігання {#updating-existing-objects-to-a-new-storage-version}

При застаріванні версій та припиненні підтримки виберіть процедуру оновлення зберігання.

_Варіант 1:_ Використання Storage Version Migrator

1. Запустіть [Storage Version Migrator](https://github.com/kubernetes-sigs/kube-storage-version-migrator).
2. Видаліть стару версію з поля `status.storedVersions` CustomResourceDefinition.

_Варіант 2:_ Ручне оновлення наявних обʼєктів до нової версії зберігання

Наведено приклад процедури оновлення з `v1beta1` до `v1`.

1. Встановіть `v1` як версію зберігання у файлі CustomResourceDefinition та застосуйте це за допомогою kubectl. Тепер `storedVersions` містить `v1beta1, v1`.
2. Напишіть процедуру оновлення для отримання всіх наявних обʼєктів і запишіть їх з тим самим вмістом. Це змушує бекенд записувати обʼєкти у поточній версії зберігання, якою є `v1`.
3. Видаліть `v1beta1` з поля `status.storedVersions` CustomResourceDefinition.

{{< note >}}
Ось приклад того, як накладати патч на субресурс `status` обʼєкта CRD за допомогою `kubectl`:

```bash
kubectl patch customresourcedefinitions <CRD_Name> --subresource='status' --type='merge' -p '{"status":{"storedVersions":["v1"]}}'
```

{{< /note >}}
