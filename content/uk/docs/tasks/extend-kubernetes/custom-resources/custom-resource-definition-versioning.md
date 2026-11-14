---
title: Версії у CustomResourceDefinitions
content_type: task
weight: 30
min-kubernetes-server-version: v1.16
---

<!-- overview -->
На цій сторінці пояснено, як додати інформацію про версії до [CustomResourceDefinitions](/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/), щоб вказати рівень стабільності ваших CustomResourceDefinitions або перевести API на нову версію з конвертацією між поданнями API. Також описано, як оновити обʼєкт з однієї версії до іншої.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Ви повинні мати початкове уявлення про [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

{{< version-check >}}

<!-- steps -->

## Огляд {#overview}

API CustomResourceDefinition надає робочий процес для впровадження нових версій CustomResourceDefinition й оновлення до них.

Коли створюється CustomResourceDefinition, у списку `spec.versions` CustomResourceDefinition для першої версії встановлюється відповідний рівень стабільності та номер версії. Наприклад, `v1beta1` вказує, що перша версія ще не стабільна. Усі обʼєкти власних ресурсів спочатку зберігатимуться в цій версії.

Після створення CustomResourceDefinition клієнти можуть почати використовувати API `v1beta1`.

Пізніше може знадобитися додати нову версію, наприклад `v1`.

Додавання нової версії:

1. Виберіть стратегію конвертації. Оскільки обʼєкти власних ресурсів мають обслуговуватися в обох версіях, іноді вони обслуговуватимуться у версії, відмінній від збереженої. Для цього обʼєкти власних ресурсів іноді потрібно конвертувати між версією, у якій вони зберігаються, і версією, у якій вони обслуговуються. Якщо конвертація передбачає зміни схеми й потребує власної логіки, слід використовувати вебхук конвертації. Якщо змін схеми немає, можна використати стандартну стратегію конвертації `None`, і під час обслуговування різних версій змінюватиметься лише поле `apiVersion`.
1. Якщо використовуються вебхуки конвертації, створіть і розгорніть вебхук конвертації. Докладніше дивіться в розділі [Конвертація за допомогою вебхука](#webhook-conversion).
1. Оновіть CustomResourceDefinition, додавши нову версію до списку `spec.versions` із `served:true`. Також встановіть у полі `spec.conversion` вибрану стратегію конвертації. Якщо використовується вебхук конвертації, налаштуйте поле `spec.conversion.webhookClientConfig` для виклику вебхука.

Після додавання нової версії клієнти можуть поступово перейти на неї. Цілком безпечно, коли одні клієнти використовують стару версію, а інші — нову.

Міграція збережених обʼєктів до нової версії:

1. Дивіться розділ [Оновлення наявних обʼєктів до нової збереженої версії](#upgrade-existing-objects-to-a-new-stored-version).

Клієнти можуть безпечно використовувати як стару, так і нову версію до, під час і після оновлення обʼєктів до нової збереженої версії.

Видалення старої версії:

1. Переконайтеся, що всі клієнти повністю перейшли на нову версію. Логи kube-apiserver можна переглянути для виявлення клієнтів, які все ще використовують стару версію.
1. Встановіть `served` у `false` для старої версії у списку `spec.versions`. Якщо якісь клієнти все ще несподівано використовують стару версію, вони можуть почати повідомляти про помилки під час спроби доступу до обʼєктів власних ресурсів у старій версії. У такому разі поверніться до `served:true` у старій версії, перенесіть решту клієнтів на нову версію й повторіть цей крок.
1. Переконайтеся, що крок [оновлення наявних обʼєктів до нової збереженої версії](#upgrade-existing-objects-to-a-new-stored-version) завершено.
   1. Перевірте, що `storage` встановлено в `true` для нової версії у списку `spec.versions` у CustomResourceDefinition.
   1. Перевірте, що стара версія більше не згадується в `status.storedVersions` CustomResourceDefinition.
1. Видаліть стару версію зі списку `spec.versions` CustomResourceDefinition.
1. Припиніть підтримку конвертації для старої версії у вебхуках конвертації.

## Зазначення кількох версій {#specify-multiple-versions}

Поле `versions` в API CustomResourceDefinition можна використовувати для підтримки кількох версій розроблених вами власних ресурсів. Версії можуть мати різні схеми, а вебхуки конвертації можуть конвертувати власні ресурси між версіями. Конвертації за допомогою вебхуків мають дотримуватися [угод API Kubernetes](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api-conventions.md) там, де це застосовно. Зокрема, дивіться [документацію щодо змін API](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api_changes.md), де є набір корисних застережень і порад.

{{< note >}}
У `apiextensions.k8s.io/v1beta1` було поле `version` замість `versions`. Поле `version` є застарілим і необовʼязковим, але якщо воно не порожнє, воно повинно відповідати першому елементу у полі `versions`.
{{< /note >}}

У цьому прикладі показано CustomResourceDefinition із двома версіями. У першому прикладі припускається, що всі версії мають однакову схему без конвертації між ними. Коментарі в YAML надають додатковий контекст.

{{< tabs name="CustomResourceDefinition_versioning_example_1" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # назва має збігатися з полями spec нижче й мати форму: <plural>.<group>
  name: crontabs.example.com
spec:
  # назва групи для REST API: /apis/<group>/<version>
  group: example.com
  # список версій, які підтримує цей CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожну версію можна увімкнути або вимкнути прапорцем Served.
    served: true
    # Одна й лише одна версія має бути позначена як версія зберігання.
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
  # Розділ conversion зʼявився в Kubernetes 1.13+ зі стандартним значенням
  # конвертації None (підполе strategy встановлено в None).
  conversion:
    # Конвертація None передбачає однакову схему для всіх версій і лише встановлює поле apiVersion
    # власних ресурсів у відповідне значення
    strategy: None
  # або Namespaced, або Cluster
  scope: Namespaced
  names:
    # назва в множині для URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # назва в однині для використання як псевдонім у CLI і для показу
    singular: crontab
    # kind — зазвичай тип в однині у CamelCase. Це використовують ваші маніфести ресурсів.
    kind: CronTab
    # shortNames дають змогу вказувати ресурс у CLI коротшим рядком
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
  # назва має збігатися з полями spec нижче й мати форму: <plural>.<group>
  name: crontabs.example.com
spec:
  # назва групи для REST API: /apis/<group>/<version>
  group: example.com
  # список версій, які підтримує цей CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожну версію можна увімкнути або вимкнути прапорцем Served.
    served: true
    # Одна й лише одна версія має бути позначена як версія зберігання.
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
  # Розділ conversion зʼявився в Kubernetes 1.13+ зі стандартним значенням
  # конвертації None (підполе strategy встановлено в None).
  conversion:
    # Конвертація None передбачає однакову схему для всіх версій і лише встановлює поле apiVersion
    # власних ресурсів у відповідне значення
    strategy: None
  # або Namespaced, або Cluster
  scope: Namespaced
  names:
    # назва в множині для URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # назва в однині для використання як псевдонім у CLI і для показу
    singular: crontab
    # kind — зазвичай тип в однині у PascalCase. Це використовують ваші маніфести ресурсів.
    kind: CronTab
    # shortNames дають змогу вказувати ресурс у CLI коротшим рядком
    shortNames:
    - ct
```

{{% /tab %}}
{{< /tabs >}}

Ви можете зберегти CustomResourceDefinition у YAML-файлі, а потім використати `kubectl apply`, щоб створити його.

```shell
kubectl apply -f my-versioned-crontab.yaml
```

Після створення API-сервер починає обслуговувати кожну увімкнену версію за точкою доступу HTTP REST. У наведеному вище прикладі версії API доступні за адресами `/apis/example.com/v1beta1` і `/apis/example.com/v1`.

### Пріоритет версії {#version-priority}

Незалежно від порядку, в якому версії визначені в CustomResourceDefinition, версія з найвищим пріоритетом використовується kubectl як стандартна версія для доступу до обʼєктів. Пріоритет визначається шляхом аналізу поля _name_ для визначення номера версії, стабільності (GA, Beta або Alpha) та послідовності в межах цього рівня стабільності.

Алгоритм сортування версій побудовано так, щоб сортувати їх так само, як проєкт Kubernetes сортує версії Kubernetes. Версії починаються з `v`, за яким ідуть число, необовʼязкове позначення `beta` або `alpha` і необовʼязкова додаткова числова інформація про версію. Загалом рядок версії може мати вигляд `v2` або `v2beta1`. Версії сортуються за таким алгоритмом:

- Записи, що відповідають шаблонам версій Kubernetes, сортуються перед тими, що не відповідають шаблонам.
- Для записів, що відповідають шаблонам версій Kubernetes, числові частини рядка версії сортуються від більшого до меншого.
- Якщо після першої числової частини йдуть рядки `beta` або `alpha`, вони сортуються в такому порядку після еквівалентного рядка без суфікса `beta` або `alpha` (який вважається GA версією).
- Якщо після `beta` або `alpha` йде ще одне число, ці числа також сортуються від більшого до меншого.
- Рядки, що не відповідають наведеному формату, сортуються за алфавітом, і числові частини не обробляються особливим чином. Зверніть увагу, що в наведеному нижче прикладі `foo1` розташовано вище за `foo10`. Це відрізняється від сортування числових частин записів, що відповідають шаблонам версій Kubernetes.

Це може стати зрозумілішим, якщо подивитися на такий відсортований список версій:

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

Для прикладу з розділу [Зазначення кількох версій](#specify-multiple-versions) порядок сортування версій — `v1`, потім `v1beta1`. Через це команда kubectl використовує `v1` як стандартну версію, якщо в наданому обʼєкті не вказано версію.

### Застарівання версій {#version-deprecation}

{{< feature-state state="stable" for_k8s_version="v1.19" >}}

Починаючи з v1.19, CustomResourceDefinition може вказувати, що певна версія визначеного ним ресурсу застаріла. Коли надходять запити API до застарілої версії цього ресурсу, у відповіді API повертається попереджувальне повідомлення в заголовку. Попереджувальне повідомлення для кожної застарілої версії ресурсу можна налаштувати.

Налаштоване попереджувальне повідомлення має вказувати застарілу групу API, версію та kind, а також, якщо застосовно, яку групу API, версію та kind слід використовувати натомість.

{{< tabs name="CustomResourceDefinition_versioning_deprecated" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
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
  versions:
  - name: v1alpha1
    served: true
    storage: false
    # Це вказує, що версія v1alpha1 власного ресурсу застаріла.
    # Запити API до цієї версії отримують заголовок із попередженням у відповіді сервера.
    deprecated: true
    # Це перевизначає стандартне попередження, яке повертається клієнтам API, що надсилають запити до API v1alpha1.
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
    
    schema: ...
  - name: v1beta1
    served: true
    # Це вказує, що версія v1beta1 власного ресурсу застаріла.
    # Запити API до цієї версії отримують заголовок із попередженням у відповіді сервера.
    # Для цієї версії повертається стандартне попереджувальне повідомлення.
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
    # Це вказує, що версія v1alpha1 власного ресурсу застаріла.
    # Запити API до цієї версії отримують заголовок із попередженням у відповіді сервера.
    deprecated: true
    # Це перевизначає стандартне попередження, яке повертається клієнтам API, що надсилають запити до API v1alpha1.
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
  - name: v1beta1
    served: true
    # Це вказує, що версія v1beta1 власного ресурсу застаріла.
    # Запити API до цієї версії отримують заголовок із попередженням у відповіді сервера.
    # Для цієї версії повертається стандартне попереджувальне повідомлення.
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
metadata:
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
    # Запити API до цієї версії отримують у відповіді сервера помилку not found.
    served: false
    schema: ...
  - name: v1
    served: true
    # Нову обслуговувану версію слід встановити як версію зберігання
    storage: true
    schema: ...
```

## Конвертація за допомогою вебхука {#webhook-conversion}

{{< feature-state state="stable" for_k8s_version="v1.16" >}}

{{< note >}}
Конвертація за допомогою вебхука доступна як бета з версії 1.15 і як альфа з Kubernetes 1.13. Потрібно увімкнути можливість `CustomResourceWebhookConversion`, що для бета-можливостей у багатьох кластерах відбувається автоматично. Докладніше дивіться в документації про [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/).
{{< /note >}}

Наведений вище приклад використовує конвертацію None між версіями, яка під час конвертації лише встановлює поле `apiVersion` і не змінює решту обʼєкта. API-сервер також підтримує конвертації за допомогою вебхуків, які викликають зовнішній сервіс, коли потрібна конвертація. Наприклад, коли:

* власний ресурс запитується у версії, яка відрізняється від збереженої версії.
* Watch створюється в одній версії, але змінений обʼєкт зберігається в іншій версії.
* запит PUT для власного ресурсу надходить у версії, відмінній від версії зберігання.

Щоб охопити всі ці випадки й оптимізувати конвертацію з боку API-сервера, запити на конвертацію можуть містити кілька обʼєктів, щоб мінімізувати зовнішні виклики. Вебхук має виконувати ці конвертації незалежно.

### Написання сервера вебхука конвертації {#write-a-conversion-webhook-server}

Зверніться до реалізації [сервера вебхука конвертації власних ресурсів](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/main.go), яку перевірено в тесті e2e Kubernetes. Вебхук обробляє запити `ConversionReview`, надіслані API-серверами, і повертає результати конвертації, загорнуті в `ConversionResponse`. Зверніть увагу, що запит містить список власних ресурсів, які потрібно конвертувати незалежно, не змінюючи порядку обʼєктів. Приклад сервера організовано так, щоб його можна було повторно використовувати для інших конвертацій. Більшість спільного коду міститься у [файлі фреймворку](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/framework.go), тож для різних конвертацій потрібно реалізувати лише [одну функцію](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/example_converter.go#L29-L80).

{{< note >}}
Приклад сервера вебхука конвертації залишає поле `ClientAuth` [порожнім](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/config.go#L47-L48), що стандартно означає `NoClientCert`. Це означає, що сервер вебхука не автентифікує клієнтів, якими, ймовірно, є API-сервери. Якщо вам потрібен взаємний TLS або інші способи автентифікації клієнтів, дивіться, як [автентифікувати API-сервери](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
{{< /note >}}

#### Допустимі зміни {#permissible-mutations}

Вебхук конвертації не повинен змінювати нічого в `metadata` конвертованого обʼєкта, крім `labels` і `annotations`. Спроби змінити `name`, `UID` і `namespace` відхиляються й призводять до збою запиту, що спричинив конвертацію. Усі інші зміни ігноруються.

### Розгортання сервісу вебхука конвертації {#deploy-the-conversion-webhook-service}

Документація з розгортання вебхука конвертації така сама, як для [прикладу сервісу вебхука допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy-the-admission-webhook-service). У наступних розділах припускається, що сервер вебхука конвертації розгорнуто як сервіс з назвою `example-conversion-webhook-server` у просторі імен `default` і він обслуговує трафік за шляхом `/crdconvert`.

{{< note >}}
Коли сервер вебхука розгорнуто в кластері Kubernetes як сервіс, доступ до нього потрібно відкрити через сервіс на порту 443 (сам сервер може мати довільний порт, але обʼєкт сервісу має зіставити його з портом 443). Якщо для сервісу використовується інший порт, звʼязок між API-сервером і сервісом вебхука може не вдатися.
{{< /note >}}

### Налаштування CustomResourceDefinition для використання вебхуків конвертації {#configure-customresourcedefinition-to-use-conversion-webhooks}

Приклад конвертації `None` можна розширити для використання вебхука конвертації, змінивши розділ `conversion` у `spec`:

{{< tabs name="CustomResourceDefinition_versioning_example_2" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # назва має збігатися з полями spec нижче й мати форму: <plural>.<group>
  name: crontabs.example.com
spec:
  # назва групи для REST API: /apis/<group>/<version>
  group: example.com
  # список версій, які підтримує цей CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожну версію можна увімкнути або вимкнути прапорцем Served.
    served: true
    # Одна й лише одна версія має бути позначена як версія зберігання.
    storage: true
    # Кожна версія може визначати власну схему, коли немає схеми верхнього
    # рівня.
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
    # стратегія Webhook вказує API-серверу викликати зовнішній вебхук для будь-якої конвертації між власними ресурсами.
    strategy: Webhook
    # webhook є обовʼязковим, коли strategy дорівнює `Webhook`, і налаштовує точку доступу вебхука, яку викликає API-сервер.
    webhook:
      # conversionReviewVersions вказує, які версії ConversionReview вебхук розуміє або яким надає перевагу.
      # Вебхуку надсилається перша версія зі списку, яку розуміє API-сервер.
      # Вебхук має відповісти обʼєктом ConversionReview у тій самій версії, яку отримав.
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
    # назва в множині для URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # назва в однині для використання як псевдонім у CLI і для показу
    singular: crontab
    # kind — зазвичай тип в однині у CamelCase. Це використовують ваші маніфести ресурсів.
    kind: CronTab
    # shortNames дають змогу вказувати ресурс у CLI коротшим рядком
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
  # назва має збігатися з полями spec нижче й мати форму: <plural>.<group>
  name: crontabs.example.com
spec:
  # назва групи для REST API: /apis/<group>/<version>
  group: example.com
  # обрізає поля обʼєктів, не вказані в наведених нижче схемах OpenAPI.
  preserveUnknownFields: false
  # список версій, які підтримує цей CustomResourceDefinition
  versions:
  - name: v1beta1
    # Кожну версію можна увімкнути або вимкнути прапорцем Served.
    served: true
    # Одна й лише одна версія має бути позначена як версія зберігання.
    storage: true
    # Кожна версія може визначати власну схему, коли немає схеми верхнього
    # рівня.
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
    # стратегія Webhook вказує API-серверу викликати зовнішній вебхук для будь-якої конвертації між власними ресурсами.
    strategy: Webhook
    # webhookClientConfig є обовʼязковим, коли strategy дорівнює `Webhook`, і налаштовує точку доступу вебхука, яку викликає API-сервер.
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        path: /crdconvert
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # або Namespaced, або Cluster
  scope: Namespaced
  names:
    # назва в множині для URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # назва в однині для використання як псевдонім у CLI і для показу
    singular: crontab
    # kind — зазвичай тип в однині у CamelCase. Це використовують ваші маніфести ресурсів.
    kind: CronTab
    # shortNames дають змогу вказувати ресурс у CLI коротшим рядком
    shortNames:
    - ct
```

{{% /tab %}}
{{< /tabs >}}

Ви можете зберегти опис CustomResourceDefinition у файлі YAML, а потім використовувати
`kubectl apply`, щоб застосувати його.

```shell
kubectl apply -f my-versioned-crontab-with-conversion.yaml
```

Переконайтеся, що сервіс конвертації працює, перш ніж застосовувати нові зміни.

### Звʼязок з вебхуком {#contacting-the-webhook}

Коли API-сервер визначив, що запит потрібно надіслати до вебхука конвертації, йому потрібно знати, як звʼязатися з вебхуком. Це вказується в розділі `webhookClientConfig` конфігурації вебхука.

Вебхуки конвертації можна викликати через URL або посилання на сервіс, і вони можуть за потреби містити власний набір CA для перевірки зʼєднання TLS.

### URL

`url` вказує розташування вебхука у стандартній формі URL (`scheme://host:port/path`).

`host` не повинен посилатися на сервіс, що працює в кластері; натомість використовуйте посилання на сервіс, вказавши поле `service`. Хост може розвʼязуватися через зовнішній DNS у деяких API-серверах (тобто `kube-apiserver` не може розвʼязувати внутрішньокластерний DNS, оскільки це порушило б рівні). `host` також може бути IP-адресою.

Зверніть увагу, що використання `localhost` або `127.0.0.1` як `host` є ризикованим, якщо ви ретельно не подбаєте про запуск цього вебхука на всіх хостах з API-сервером, якому можуть знадобитися виклики цього вебхука. Такі встановлення, ймовірно, не будуть переносними або їх буде нелегко запустити в новому кластері.

Схема повинна бути "https"; URL повинен починатися з "https://".

Спроба використати користувача або базову автентифікацію (наприклад, "user:password@") заборонена. Фрагменти ("#...") та параметри запиту ("?...") також заборонені.

Ось приклад вебхука конвертації, налаштованого на виклик URL (очікується, що сертифікат TLS перевіряється за допомогою системних коренів довіри, тому caBundle не вказано):

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

Розділ `service` у `webhookClientConfig` — це посилання на сервіс вебхука конвертації. Якщо вебхук працює в кластері, слід використовувати `service` замість `url`. Простір імен і назва сервісу обовʼязкові. Порт необовʼязковий, стандартно 443. Шлях необовʼязковий, стандартно "/".

Ось приклад вебхука, налаштованого на виклик сервісу на порту "1234" за підшляхом "/my-path" і на перевірку зʼєднання TLS за ServerName `my-service-name.my-service-namespace.svc` з використанням власного набору CA.

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

## Запит і відповідь вебхука {#webhook-request-and-response}

### Запит {#request}

Вебхукам надсилається запит POST із `Content-Type: application/json`, тілом якого є обʼєкт API `ConversionReview` із групи API `apiextensions.k8s.io`, серіалізований у JSON.

Вебхуки можуть вказувати, які версії обʼєктів `ConversionReview` вони приймають, за допомогою поля `conversionReviewVersions` у своєму CustomResourceDefinition:

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

`conversionReviewVersions` — обовʼязкове поле під час створення custom resource definitions `apiextensions.k8s.io/v1`. Вебхуки мають підтримувати принаймні одну версію `ConversionReview`, яку розуміють поточний і попередній API-сервер.
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

Якщо `conversionReviewVersions` не вказано, стандартне значення під час створення custom resource definitions `apiextensions.k8s.io/v1beta1` — `v1beta1`.
{{% /tab %}}
{{< /tabs >}}

API-сервери надсилають першу версію `ConversionReview` зі списку `conversionReviewVersions`, яку вони підтримують. Якщо API-сервер не підтримує жодної версії зі списку, створення custom resource definition не буде дозволено. Якщо API-сервер натрапляє на раніше створену конфігурацію вебхука конвертації, яка не підтримує жодної з версій `ConversionReview`, які API-сервер уміє надсилати, спроби викликати вебхук завершаться збоєм.

Цей приклад показує дані, що містяться в обʼєкті `ConversionReview` для запиту на конвертацію обʼєктів `CronTab` до `example.com/v1`:

{{< tabs name="ConversionReview_request" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "request": {
    # Випадковий uid, що унікально ідентифікує цей виклик конвертації
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # Група API та версія, до яких слід конвертувати обʼєкти
    "desiredAPIVersion": "example.com/v1",
    
    # Список обʼєктів для конвертації.
    # Може містити один або кілька обʼєктів в одній або кількох версіях.
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
    # Випадковий uid, що унікально ідентифікує цей виклик конвертації
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # Група API та версія, до яких слід конвертувати обʼєкти
    "desiredAPIVersion": "example.com/v1",
    
    # Список обʼєктів для конвертації.
    # Може містити один або кілька обʼєктів в одній або кількох версіях.
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

Вебхуки відповідають кодом статусу HTTP 200, `Content-Type: application/json` і тілом, що містить обʼєкт `ConversionReview` (у тій самій версії, у якій його надіслано) із заповненим розділом `response`, серіалізованим у JSON.

Якщо конвертація успішна, вебхук має повернути розділ `response`, що містить такі поля:

* `uid`, скопійований з `request.uid`, надісланого до вебхука
* `result`, встановлений на `{"status":"Success"}`
* `convertedObjects`, що містить всі обʼєкти з `request.objects`, конвертовані до `request.desiredAPIVersion`

Приклад мінімальної успішної відповіді вебхука:

{{< tabs name="ConversionReview_response_success" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    # має збігатися з <request.uid>
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Success"
    },
    # Обʼєкти мають відповідати порядку request.objects і мати apiVersion зі значенням <request.desiredAPIVersion>.
    # Вебхук не повинен змінювати поля kind, metadata.uid, metadata.name і metadata.namespace.
    # Вебхук може змінювати поля metadata.labels і metadata.annotations.
    # Усі інші зміни полів metadata вебхуком ігноруються.
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
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
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
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
  # Застаріло у v1.16 на користь apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    # має збігатися з <request.uid>
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Failed"
    },
    # Обʼєкти мають відповідати порядку request.objects і мати apiVersion зі значенням <request.desiredAPIVersion>.
    # Вебхук не повинен змінювати поля kind, metadata.uid, metadata.name і metadata.namespace.
    # Вебхук може змінювати поля metadata.labels і metadata.annotations.
    # Усі інші зміни полів metadata вебхуком ігноруються.
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
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
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
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

Якщо конвертація не вдалася, вебхук має повернути розділ `response`, що містить такі поля:

* `uid`, скопійований з `request.uid`, надісланого до вебхука
* `result`, встановлений на `{"status":"Failed"}`

{{< warning >}}
Збій конвертації може порушити доступ для читання й запису до власних ресурсів, зокрема можливість оновлювати або видаляти ресурси. Збоїв конвертації слід уникати всюди, де можливо, і не слід використовувати їх для забезпечення обмежень валідації (натомість використовуйте схеми валідації або webhook admission).
{{< /warning >}}

Приклад відповіді вебхука, що вказує на збій запиту конвертації, з необовʼязковим повідомленням:

{{< tabs name="ConversionReview_response_failure" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
    }
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
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
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

- якщо вказано стандартне значення `strategy` `None`, єдині зміни обʼєкта — це зміна рядка `apiVersion` і, можливо, [обрізання невідомих полів](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning) (залежно від конфігурації). Зверніть увагу, що це навряд чи дасть добрі результати, якщо схеми версії зберігання та запитаної версії різняться. Зокрема, не слід використовувати цю стратегію, якщо ті самі дані подано в різних полях у різних версіях.
- якщо вказано [конвертацію за допомогою вебхука](#webhook-conversion), конвертацією керує цей механізм.

Якщо ви оновлюєте наявний обʼєкт, він перезаписується у версії, яка наразі є версією зберігання. Це єдиний спосіб, у який обʼєкти можуть змінювати версію.

Щоб проілюструвати це, розгляньмо таку гіпотетичну послідовність подій:

1. Версія зберігання — `v1beta1`. Ви створюєте обʼєкт. Він зберігається у версії `v1beta1`.
2. Ви додаєте версію `v1` до свого CustomResourceDefinition і призначаєте її версією зберігання. Тут схеми `v1` і `v1beta1` ідентичні, що зазвичай трапляється під час переведення API в стабільний стан в екосистемі Kubernetes.
3. Ви читаєте свій обʼєкт у версії `v1beta1`, потім читаєте обʼєкт знову у версії `v1`. Обидва отримані обʼєкти є ідентичними, за винятком поля apiVersion.
4. Ви створюєте новий обʼєкт. Він зберігається у версії `v1`. Тепер у вас є два обʼєкти: один у версії `v1beta1`, інший у версії `v1`.
5. Ви оновлюєте перший обʼєкт. Тепер він зберігається у версії `v1`, оскільки це поточна версія зберігання.

### Попередні версії зберігання {#previous-storage-versions}

API-сервер записує кожну версію, яку будь-коли було позначено як версію зберігання, у поле статусу `storedVersions`. Обʼєкти могли бути збережені в будь-якій версії, яку будь-коли було визначено як версію зберігання. У сховищі не може бути обʼєктів у версії, яка ніколи не була версією зберігання.

## Оновлення наявних обʼєктів до нової збереженої версії {#upgrade-existing-objects-to-a-new-stored-version}

Коли ви оголошуєте версії застарілими й припиняєте їх підтримку, виберіть процедуру оновлення зберігання.

_Варіант 1:_ Використання Storage Version Migration

1. Запустіть [Storage Version Migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/) для власного ресурсу.

   Наприклад, ви можете включити ресурс `StorageVersionMigration` у той самий маніфест, що й ваш оновлений `CustomResourceDefinition`:

   ```yaml
   apiVersion: apiextensions.k8s.io/v1
   kind: CustomResourceDefinition
   metadata:
     name: crontabs.example.com
   spec:
     group: example.com
     ...
   ---
   apiVersion: storagemigration.k8s.io/v1
   kind: StorageVersionMigration
   metadata:
     name: crontabs-migration
   spec:
     resource:
       group: example.com
       resource: crontabs
   ```

2. Після успішної міграції стара версія буде видалена з поля `status.storedVersions` CustomResourceDefinition.

_Варіант 2:_ Ручне оновлення наявних обʼєктів до нової версії зберігання

Нижче наведено приклад процедури оновлення з `v1beta1` до `v1`.

1. Встановіть `v1` як версію зберігання у файлі CustomResourceDefinition та застосуйте це за допомогою kubectl. Тепер `storedVersions` містить `v1beta1, v1`.
2. Напишіть процедуру оновлення, яка отримує всі наявні обʼєкти й записує їх з тим самим вмістом. Це змушує бекенд записати обʼєкти в поточній версії зберігання, тобто `v1`.
3. Видаліть `v1beta1` з поля `status.storedVersions` CustomResourceDefinition.

{{< note >}}
Ось приклад того, як накладати патч на субресурс `status` обʼєкта CRD за допомогою `kubectl`:

```bash
kubectl patch customresourcedefinitions <CRD_Name> --subresource='status' --type='merge' -p '{"status":{"storedVersions":["v1"]}}'
```

{{< /note >}}
