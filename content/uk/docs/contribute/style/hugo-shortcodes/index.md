---
title: Власні shortcodes Hugo
content_type: concept
weight: 120
---

<!-- overview -->

На цій сторінці пояснено власні shortcodes Hugo, які можна використовувати в документації Kubernetes у Markdown.

Докладніше про shortcodes див. у [документації Hugo](https://gohugo.io/content-management/shortcodes).

<!-- body -->

## Стан можливості {#feature-state}

На сторінці Markdown (файл `.md`) на цьому сайті можна додати shortcode, щоб показати версію та стан документованої можливості.

### Демонстрація стану можливості {#feature-state-demo}

Нижче наведено демонстрацію фрагмента стану можливості, який показує можливість як стабільну в останній версії Kubernetes.

```
{{</* feature-state state="stable" */>}}
```

Показується як:

{{< feature-state state="stable" >}}

Допустимі значення для `state`:

* alpha
* beta
* deprecated
* stable

### Код стану можливості {#feature-state-code}

Показана версія Kubernetes стандартно відповідає версії сторінки або сайту. Версію стану можливості можна змінити, передавши shortcode параметр `for_k8s_version`. Наприклад:

```
{{</* feature-state for_k8s_version="v1.10" state="beta" */>}}
```

Показується як:

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

### Отримання стану можливості з файлу опису {#feature-state-retrieval-from-description-file}

Щоб динамічно визначити стан можливості, використовуйте параметр shortcode `feature_gate_name`. Подробиці стану можливості буде взято з відповідного файлу опису функціональної можливості в `content/en/docs/reference/command-line-tools-reference/feature-gates/`. Наприклад:

```
{{</* feature-state feature_gate_name="NodeSwap" */>}}
```

Показується як:

{{< feature-state feature_gate_name="NodeSwap" >}}

## Опис функціональної можливості {#feature-gate-description}

На сторінці Markdown (файл `.md`) на цьому сайті можна додати shortcode, щоб показати опис функціональної можливості.

### Демонстрація опису функціональної можливості {#feature-gate-description-demo}

Нижче наведено демонстрацію фрагмента стану можливості, який показує можливість як стабільну в останній версії Kubernetes.

```
{{</* feature-gate-description name="DryRun" */>}}
```

Показується як:

{{< feature-gate-description name="DryRun" >}}

## Глосарій {#glossary}

Є два shortcodes для глосарія: `glossary_tooltip` і `glossary_definition`.

На терміни глосарія можна посилатися за допомогою включення, яке автоматично оновлює та замінює вміст відповідними посиланнями з [нашого глосарія](/docs/reference/glossary/). Коли навести вказівник миші на термін глосарія, запис глосарія показується як підказка. Термін глосарія також показується як посилання.

Окрім включень з підказками, ви можете повторно використовувати визначення з глосарія у вмісті сторінки.

Вихідні дані термінів глосарія зберігаються в [теці глосарія](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary), по одному файлу вмісту на кожен термін.

### Демонстрація глосарія {#glossary-demo}

Наприклад, таке включення в Markdown показується як {{< glossary_tooltip text="кластер" term_id="cluster" >}} з підказкою:

```
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
```

Ось коротке визначення глосарія:

```
{{</* glossary_definition prepend="Кластер — " term_id="cluster" length="short" */>}}
```

яке показується як:
{{< glossary_definition prepend="Кластер — " term_id="cluster" length="short" >}}

Ви також можете включити повне визначення:

```
{{</* glossary_definition term_id="cluster" length="all" */>}}
```

яке показується як:
{{< glossary_definition term_id="cluster" length="all" >}}

## Посилання на довідник API {#links-to-api-reference}

Ви можете послатися на сторінку довідника API Kubernetes за допомогою shortcode `api-reference`, наприклад на довідник {{< api-reference page="core/pod-v1" >}}:
{{< api-reference page="core/pod-v1" >}}:

```
{{</* api-reference page="core/pod-v1" */>}}
```

Вміст параметра `page` є суфіксом URL сторінки довідника API.

Ви можете посилатися на конкретне місце на сторінці, вказавши параметр `anchor`, наприклад, на довідник {{< api-reference page="core/pod-v1" anchor="PodSpec" >}} або розділ {{< api-reference page="core/pod-v1" anchor="environment-variables" >}}
сторінки:

```
{{</* api-reference page="core/pod-v1" anchor="PodSpec" */>}}
{{</* api-reference page="core/pod-v1" anchor="environment-variables" */>}}
```

Ви можете змінити текст посилання, вказавши параметр `text`, наприклад, посилаючись на {{< api-reference page="core/pod-v1" anchor="environment-variables" text="Змінні оточення">}}
розділ сторінки:

```
{{</* api-reference page="core/pod-v1" anchor="environment-variables" text="Змінні оточення" */>}}
```

## Підписи таблиць {#table-captions}

Таблиці можна зробити доступнішими для програм зчитування з екрана, додавши підпис таблиці. Щоб додати [підпис](https://www.w3schools.com/tags/tag_caption.asp) до таблиці, обгорніть таблицю shortcode `table` і задайте підпис параметром `caption`.

{{< note >}}
Підписи таблиць видимі для програм зчитування з екрана, але невидимі під час звичайного перегляду HTML.
{{< /note >}}

Ось приклад:

```go-html-template
{{</* table caption="Configuration parameters" >}}
Parameter | Description | Default
:---------|:------------|:-------
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table */>}}
```

Показується як:

{{< table caption="Configuration parameters" >}}
Parameter | Description | Default
:---------|:------------|:-------
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table >}}

Якщо переглянути HTML таблиці, одразу після відкривального елемента `<table>` ви побачите такий елемент:

```html
<caption style="display: none;">Configuration parameters</caption>
```

## Вкладки {#tabs}

На сторінці Markdown (`.md` файл) на цьому сайті ви можете додати набір вкладок для показу різних варіантів рішення.

Shortcode `tabs` приймає такі параметри:

* `name`: Імʼя, яке відображається на вкладці.
* `codelang`: якщо ви передаєте внутрішній вміст до shortcode `tab`, можна вказати Hugo, яку мову використовувати для підсвічування коду.
* `include`: файл, який потрібно включити у вкладку. Якщо вкладка розташована в [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles) Hugo, файл — будь-якого типу MIME, який підтримує Hugo, — шукається в самому пакеті. Якщо ні, сторінка вмісту, яку потрібно включити, шукається відносно поточної сторінки. Зверніть увагу, що з `include` shortcode не має внутрішнього вмісту й потрібно використовувати самозакривний синтаксис. Наприклад, `{{</* tab name="Content File #1" include="example1" /*/>}}`. Мову потрібно вказати в `codelang`, інакше її буде визначено за іменем файлу. Файли, що не є вмістом (non-content), стандартно підсвічуються як код.
* Якщо внутрішній вміст — Markdown, вкладку потрібно обгорнути роздільником `%`. Наприклад, `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* Усередині набору вкладок можна поєднувати наведені вище варіанти.

Нижче наведено демонстрацію shortcode tabs.

{{< note >}}
**Імʼя** вкладки у визначенні `tabs` має бути унікальним у межах сторінки вмісту.
{{< /note >}}

### Демонстрація вкладок: підсвічування коду {#tabs-demo-code-highlighting}

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs */>}}
```

Показується як:

{{< tabs name="tab_with_code" >}}
{{< tab name="Tab A" codelang="bash" >}}
echo "This is tab A."
{{< /tab >}}
{{< tab codelang="go" >}}
// If you don't set a tab name, the site supplies one.
println "This tab has a default name";
{{< /tab >}}
{{< /tabs >}}

### Демонстрація вкладок: вбудовані Markdown і HTML {#tabs-demo-inline-markdown-and-html}

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
This is **some markdown.**
{{< note >}}
It can even contain shortcodes.
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Plain HTML</h3>
	<p>This is some <i>plain</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

Показується як:

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
This is **some markdown.**

{{< note >}}
It can even contain shortcodes.
{{< /note >}}

{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Plain HTML</h3>
	<p>This is some <i>plain</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs >}}

### Демонстрація вкладок: включення файлу {#tabs-demo-file-include}

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs */>}}
```

Показується як:

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate.json" />}}
{{< /tabs >}}

## Файли вихідного коду {#source-code-files}

Shortcode `{{%/* code_sample */%}}` дає змогу вбудувати вміст файлу в блок коду, щоб користувачі могли завантажити його або скопіювати в буфер обміну. Цей shortcode використовують, коли вміст файлу прикладу загальний і придатний для повторного використання, і ви хочете, щоб користувачі спробували його самі.

Цей shortcode приймає два іменовані параметри: `language` і `file`. Обовʼязковий параметр `file` задає шлях до файлу, який показується. Необовʼязковий параметр `language` задає мову програмування файлу. Якщо параметр `language` не задано, shortcode спробує визначити мову за розширенням файлу.

Наприклад:

```none
{{%/* code_sample language="yaml" file="application/deployment-scale.yaml" */%}}
```

Результат:

{{% code_sample language="yaml" file="application/deployment-scale.yaml" %}}

Додаючи новий файл прикладу, як-от файл YAML, створіть його в одній з підтек `<LANG>/examples/`, де `<LANG>` — мова сторінки. У Markdown сторінки використовуйте shortcode `code`:

```none
{{%/* code_sample file="<RELATIVE-PATH>/example-yaml>" */%}}
```

де `<RELATIVE-PATH>` — шлях до файлу прикладу, який потрібно включити, відносно теки `examples`. Такий shortcode посилається на файл YAML, розташований у `/content/en/examples/configmap/configmaps.yaml`.

```none
{{%/* code_sample file="configmap/configmaps.yaml" */%}}
```

Застарілий shortcode `{{%/* codenew */%}}` замінюється на `{{%/* code_sample */%}}`. У новій документації використовуйте `{{%/* code_sample */%}}` (а не `{{%/* codenew */%}}` чи `{{%/* code */%}}`).

## Маркер стороннього вмісту {#third-party-content-marker}

Для роботи Kubernetes потрібне стороннє програмне забезпечення. Наприклад, зазвичай до кластера потрібно додати [DNS-сервер](/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction), щоб працювало розвʼязання імен.

Коли ми посилаємося на стороннє програмне забезпечення або іншим чином згадуємо його, ми дотримуємося [посібника з вмісту](/docs/contribute/style/content-guide/) і також позначаємо такі сторонні елементи.

Використання цих shortcodes додає застереження (disclaimer) на будь-яку сторінку документації, що їх використовує.

### Списки {#third-party-content-list}

Для списку кількох сторонніх елементів додайте:

```
{{%/* thirdparty-content */%}}
```

одразу під заголовком розділу, що містить усі елементи.

### Елементи {#third-party-content-item}

Якщо у вас список, у якому більшість елементів стосується програмного забезпечення в межах проєкту (наприклад, самого Kubernetes і окремого компонента [Descheduler](https://github.com/kubernetes-sigs/descheduler)), використовуйте іншу форму.

Додайте shortcode:

```
{{%/* thirdparty-content single="true" */%}}
```

перед елементом або одразу під заголовком конкретного елемента.

## Деталі {#details}

HTML-елемент `<details>` можна показати за допомогою shortcode:

```markdown
{{</* details summary="Детальніше про віджети" */>}}
API розширення frobnicator реалізує _віджети_ із використанням тексту прикладу.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
dolore magnam aliquam quaerat voluptatem.
{{</* /details */>}}
```

Це буде показано так:
{{< details summary="Детальніше про віджети" >}}
API розширення frobnicator реалізує _віджети_ із використанням тексту прикладу.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
{{< /details >}}

{{< note >}}
Використовуйте цей shortcode помірно; зазвичай краще, щоб увесь текст було показано читачам безпосередньо.
{{< /note >}}

## Рядки версій {#version-strings}

Щоб згенерувати рядок версії для документації, можна вибрати один із кількох shortcodes версій. Кожен shortcode версії показує рядок версії, отриманий зі значення параметра версії у файлі конфігурації сайту `hugo.toml`. Два найуживаніші параметри версії — `latest` і `version`.

### `{{</* param "version" */>}}` {#param-version}

Shortcode `{{</* param "version" */>}}` генерує значення поточної версії документації Kubernetes з параметра сайту `version`. Shortcode `param` приймає назву одного параметра сайту, у цьому випадку `version`.

{{< note >}}
У раніше випущеній документації значення параметрів `latest` і `version` не еквівалентні. Після випуску нової версії `latest` збільшується, а значення `version` для набору документації лишається незмінним. Наприклад, раніше випущена версія документації показує `version` як `v1.19`, а `latest` — як `v1.20`.
{{< /note >}}

Показується як:

{{< param "version" >}}

### `{{</* latest-version */>}}` {#latest-version}

Shortcode `{{</* latest-version */>}}` повертає значення параметра сайту `latest`. Параметр сайту `latest` оновлюється, коли випускається нова версія документації. Цей параметр не завжди збігається зі значенням `version` у наборі документації.

Показується як:

{{< latest-version >}}

### `{{</* latest-semver */>}}` {#latest-semver}

Shortcode `{{</* latest-semver */>}}` генерує значення `latest` без префікса "v".

Показується як:

{{< latest-semver >}}

### `{{</* version-check */>}}` {#version-check}

Shortcode `{{</* version-check */>}}` перевіряє, чи є на сторінці параметр `min-kubernetes-server-version`, і потім порівнює це значення з `version`.

Показується як:

{{< version-check >}}

### `{{</* latest-release-notes */>}}` {#latest-release-notes}

Shortcode `{{</* latest-release-notes */>}}` генерує рядок версії з `latest` і прибирає префікс "v". Shortcode виводить нову URL-адресу сторінки CHANGELOG приміток до випуску зі зміненим рядком версії.

Показується як:

{{< latest-release-notes >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся про [Hugo](https://gohugo.io/).
* Дізнайтеся про [написання нової теми](/docs/contribute/style/write-new-topic/).
* Дізнайтеся про [типи контенту сторінок](/docs/contribute/style/page-content-types/).
* Дізнайтеся про [відкриття pull request](/docs/contribute/new-content/open-a-pr/).
* Дізнайтеся про [розширену участь](/docs/contribute/advanced/).
