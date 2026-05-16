---
title: Власні shortcodes Hugo
content_type: concept
weight: 120
---

<!-- overview -->

Ця сторінка пояснює, як використовувати shortcodes Hugo в документації Markdown для Kubernetes.

Детальніше про shortcodes можна дізнатися в [документації Hugo](https://gohugo.io/content-management/shortcodes).

<!-- body -->

## Стан функції {#feature-state}

На сторінці Markdown (`.md` файл) на цьому сайті ви можете додати shortcodes для відображення версії та стану документованої функції.

### Демонстрація стану функції {#feature-state-demo}

Нижче наведено демонстрацію фрагмента стану функції, який відображає функцію як
стабільну в останній версії Kubernetes.

```hugo
{{</* feature-state state="stable" */>}}
```

Показується як:

{{< feature-state state="stable" >}}

Дійсні значення для `state`:

* alpha
* beta
* deprecated
* stable

### Код стану функції {#feature-state-code}

Показана версія Kubernetes типово є версією сторінки або сайту. Ви можете змінити версію стану функції, передавши параметр `for_k8s_version` для shortcode. Наприклад:

```hugo
{{</* feature-state for_k8s_version="v1.10" state="beta" */>}}
```

Показується як:

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

### Отримання стану функції з файлу опису {#feature-state-retrieval-from-description-file}

Щоб динамічно визначити стан функції, використовуйте параметр `feature_gate_name`. Деталі стану функції будуть витягнуті з відповідного файлу опису функціональних можливостей розташованого в `content/en/docs/reference/command-line-tools-reference/feature-gates/`. Наприклад:

```hugo
{{</* feature-state feature_gate_name="NodeSwap" */>}}
```

Показується як:

{{< feature-state feature_gate_name="NodeSwap" >}}

## Опис функціональних можливостей {#feature-gate-description}

На сторінці Markdown (`.md` файл) на цьому сайті ви можете додати код для показу опису функціональної можливості.

### Демонстрація опису функціональної можливості {#feature-gate-description-demo}

Нижче наведено демонстрацію фрагмента опису функціональної можливості, який показує функцію як стабільну в останній версії Kubernetes.

```hugo
{{</* feature-gate-description name="DryRun" */>}}
```

Показується як:

{{< feature-gate-description name="DryRun" >}}

## Глосарій {#glossary}

Існують два коротких коди для глосарія: `glossary_tooltip` та `glossary_definition`.

Ви можете посилатися на терміни глосарія з включенням, яке автоматично оновлюється і замінює вміст відповідними посиланнями з [нашого глосарія](/docs/reference/glossary/). Коли вказівник миші знаходиться над терміном з глосарія, опис терміна з глосарія відобразиться у вигляді підказки. Термін глосарія також відображається як посилання.

Окрім включень з підказками, ви можете повторно використовувати визначення з глосарія у вмісті сторінки.

Дані для термінів глосарія зберігаються в [теці глосарія](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary), з файлом вмісту для кожного терміна глосарія.

### Демонстрація глосарія

Наприклад, наступне включення в Markdown показується для терміна
{{< glossary_tooltip text="кластер" term_id="cluster" >}} з підказкою:

```hugo
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
```

Ось коротке визначення глосарія:

```hugo
{{</* glossary_definition prepend="Кластер — " term_id="cluster" length="short" */>}}
```

яке показується як:
{{< glossary_definition prepend="Кластер — " term_id="cluster" length="short" >}}

Ви також можете включити повне визначення:

```hugo
{{</* glossary_definition term_id="cluster" length="all" */>}}
```

яке показується як:
{{< glossary_definition term_id="cluster" length="all" >}}

## Посилання на довідник API {#link-to-api-reference}

Ви можете створити посилання на сторінку довідника API Kubernetes, використовуючи короткий код `api-reference`, наприклад, на довідник
{{< api-reference page="workload-resources/pod-v1" >}}:

```hugo
{{</* api-reference page="workload-resources/pod-v1" */>}}
```

Вміст параметра `page` є суфіксом URL сторінки довідника API.

Ви можете посилатися на конкретне місце на сторінці, вказавши параметр `anchor`, наприклад, на довідник {{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}} або розділ {{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" >}}
сторінки:

```hugo
{{</* api-reference page="workload-resources/pod-v1" anchor="PodSpec" */>}}
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" */>}}
```

Ви можете змінити текст посилання, вказавши параметр `text`, наприклад, посилаючись на {{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="Змінні оточення">}}
розділ сторінки:

```
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="Змінні оточення" */>}}
```

## Заголовки таблиць {#table-captions}

Ви можете зробити таблиці більш доступними для екранних зчитувачів, додавши заголовок таблиці. Щоб додати [заголовок](https://www.w3schools.com/tags/tag_caption.asp) до таблиці, оберніть таблицю кодом `table` і вкажіть заголовок за допомогою параметра `caption`.

{{< note >}}
Заголовки таблиць видимі для екранних зчитувачів, але невидимі при перегляді в стандартному HTML.
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

Якщо ви переглянете HTML для таблиці, ви повинні побачити цей елемент одразу
після відкриваючого елемента `<table>`:

```html
<caption style="display: none;">Configuration parameters</caption>
```

## Вкладки {#tabs}

На сторінці Markdown (`.md` файл) на цьому сайті ви можете додати набір вкладок для показу різних варіантів рішення.

Короткий код `tabs` приймає такі параметри:

* `name`: Ім’я, яке відображається на вкладці.
* `codelang`: Якщо ви надаєте внутрішній вміст для короткого коду `tab`, ви можете вказати Hugo, яку мову коду використовувати для підсвічування.
* `include`: Файл для включення у вкладку. Якщо вкладка знаходиться в Hugo [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), файл, який може бути будь-якого MIME типу, підтримуваного Hugo, шукається у самому пакеті. Якщо ні, сторінка вмісту, яку потрібно включити, шукається відносно поточної сторінки. Зверніть увагу, що з `include` у вас немає внутрішнього вмісту shortcode і ви повинні використовувати синтаксис самозакриваючих теґів. Наприклад, `{{</* tab name="Content File #1" include="example1" /*/>}}`. Мову потрібно вказати у `codelang`, або мова буде визначена на основі імені файлу. Ффайли non-content стандартно підсвічуються як код.
* Якщо ваш внутрішній вміст є Markdown, ви повинні використовувати роздільник `%` для оточення вкладки. Наприклад, `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* Ви можете комбінувати зазначені вище варіації всередині набору вкладок.

Нижче наведено демонстрацію shortcode вкладок.

{{< note >}}
Ім’я вкладки в `tabs` визначенні повинно бути унікальним на сторінці вмісту.
{{< /note >}}

### Демонстрація вкладок: Підсвічування коду {#tabs-demo-code-highlighting}

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs */>}}
```

Показується як:

{{< tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs >}}

### Демонстрація вкладок: Вбудований Markdown та HTML {#tabs-demo-inline-markdown-and-html}

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

### Демонстрація вкладок: Включення файлів {#tabs-demo-file-includes}

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

Ви можете використовувати код `{{%/* code_sample */%}}` для вбудовування вмісту файлу в кодовий блок, щоб користувачі могли завантажити або скопіювати його вміст у буфер обміну. Цей код використовується, коли вміст зразкового файлу є загальним і багаторазовим, і ви хочете, щоб користувачі могли спробувати його самостійно.

Цей короткий код приймає два іменованих параметри: `language` та `file`. Обов’язковий параметр `file` використовується для вказання шляху до файлу, який відображається. Опційний параметр `language` використовується для вказання мови програмування файлу. Якщо параметр `language` не надано, код намагатиметься вгадати мову на основі розширення файлу.

Наприклад:

```none
{{%/* code_sample language="yaml" file="application/deployment-scale.yaml" */%}}
```

Вихідний результат:

{{% code_sample language="yaml" file="application/deployment-scale.yaml" %}}

Коли ви додаєте новий зразковий файл, наприклад YAML файл, створіть файл в одній з підтек `<LANG>/examples/`, де `<LANG>` — це мова для сторінки. У Markdown вашої сторінки використовуйте код `code`:

```none
{{%/* code_sample file="<RELATIVE-PATH>/example-yaml>" */%}}
```

де `<RELATIVE-PATH>` — шлях до зразкового файлу, який потрібно включити, відносно теки `examples`. Наступний код посилається на YAML файл, розташований за адресою `/content/en/examples/configmap/configmaps.yaml`.

```none
{{%/* code_sample file="configmap/configmaps.yaml" */%}}
```

Застарілий код `{{%/* codenew */%}}` замінюється на `{{%/* code_sample */%}}`. Використовуйте `{{%/* code_sample */%}}` (а не `{{%/* codenew */%}}` чи `{{%/* code */%}}`) у новій документації.

## Маркер контенту третіх сторін {#third-party-content-marker}

Для роботи з Kubernetes потрібно стороннє програмне забезпечення. Наприклад, вам зазвичай потрібно додати [DNS-сервер](/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction) до вашого кластера, щоб забезпечити правильну роботу розпізнавання імен.

Коли ми посилаємося на стороннє програмне забезпечення або згадуємо про нього,
ми дотримуємося [керівництва з контенту](/docs/contribute/style/content-guide/) і також позначаємо ці сторонні елементи.

Використання цих shortcodes додає відмову від відповідальності до будь-якої сторінки документації, яка їх використовує.

### Списки {#third-party-content-list}

Для списку кількох сторонніх елементів додайте:

```hugo
{{%/* thirdparty-content */%}}
```

відразу після заголовка розділу, що включає всі елементи.

### Елементи {#third-party-content-item}

Якщо у вас є список, в якому більшість елементів належать до програмного забезпечення проєкту (наприклад: сам Kubernetes, і окремий компонент [Descheduler](https://github.com/kubernetes-sigs/descheduler)), то є інша форма для використання.

Додайте короткий код:

```hugo
{{%/* thirdparty-content single="true" */%}}
```

перед елементом або відразу після заголовка для конкретного елемента.

## Деталі {#details}

Ви можете відобразити HTML елемент `<details>` за допомогою шорткоду:

```markdown
{{</* details summary="Детальніше про віджети" */>}}
API розширення frobnicator реалізує _віджети_ із використанням тексту прикладу.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
{{</* /details */>}}
```

Це буде показано так:
{{< details summary="Детальніше про віджети" >}}
API розширення frobnicator реалізує _віджети_ із використанням тексту прикладу.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
{{< /details >}}

{{< note >}}
Використовуйте цей шорткод помірно; зазвичай краще, коли весь текст показується читачам безпосередньо.
{{< /note >}}

## Рядки версій {#version-strings}

Щоб створити рядок версії для включення в документацію, ви можете вибрати з кількох shortcode для версії. Кожен код версії відображає рядок версії, отриманий зі значення параметра версії, знайденого у файлі конфігурації сайту, `hugo.toml`. Два найбільш часто використовуваних параметри версії — це `latest` і `version`.

### `{{</* param "version" */>}}`

Код `{{</* param "version" */>}}` генерує значення поточної версії документації Kubernetes з параметра сайту `version`. Код `param` приймає назву одного параметра сайту, в цьому випадку: `version`.

{{< note >}}
В раніше випущеній документації значення параметрів `latest` і `version` не є еквівалентними. Після випуску нової версії, `latest` інкрементується і значення `version` для набору документації залишається незмінним. Наприклад, раніше випущена версія документації відображає `version` як `v1.19` і `latest` як `v1.20`.
{{< /note >}}

Показується як:

{{< param "version" >}}

### `{{</* latest-version */>}}`

Код `{{</* latest-version */>}}` повертає значення параметра сайту `latest`. Параметр сайту `latest` оновлюється, коли випускається нова версія документації. Цей параметр не завжди відповідає значенню `version` у наборі документації.

Показується як:

{{< latest-version >}}

### `{{</* latest-semver */>}}`

Короткий код `{{</* latest-semver */>}}` генерує значення `latest` без префікса "v".

Показується як:

{{< latest-semver >}}

### `{{</* version-check */>}}`

Код `{{</* version-check */>}}` перевіряє, чи присутній параметр `min-kubernetes-server-version` на сторінці, а потім використовує це значення для порівняння з `version`.

Показується як:

{{< version-check >}}

### `{{</* latest-release-notes */>}}`

Код `{{</* latest-release-notes */>}}` генерує рядок версії з `latest` і видаляє префікс "v". Короткий код друкує нове посилання на сторінку з нотатками про випуски з модифікованим рядком версії.

Показується як:

{{< latest-release-notes >}}

## {{% heading "whatsnext" %}}

* Дізнайтеся про [Hugo](https://gohugo.io/).
* Дізнайтеся про [створення нової теми](/docs/contribute/style/write-new-topic/).
* Дізнайтеся про [типи вмісту сторінок](/docs/contribute/style/page-content-types/).
* Дізнайтеся про [відкриття pull request](/docs/contribute/new-content/open-a-pr/).
* Дізнайтеся про [розширений варіант участі](/docs/contribute/advanced/).
