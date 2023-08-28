---
approvers:
- chenopis
title: Пользовательские макрокоды Hugo
content_type: concept
---

<!-- overview -->
На этой странице объясняются пользовательские макрокоды Hugo, которые можно использовать в Markdown-файлах документации Kubernetes.

Узнать подробнее про макрокоды можно в [документации Hugo](https://gohugo.io/content-management/shortcodes).


<!-- body -->

## Состояние функциональности

В Markdown странице (файл с расширением `.md`) вы можете добавить макрокод, чтобы отобразить версию и состояние документированной функциональной возможности.

### Демонстрация состояния функциональности

Ниже показан фрагмент кода для вывода состояния функциональности, который сообщает о функциональности в стабильной версии Kubernetes 1.10.

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

Результат:

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

Допустимые значения для `state`:

* alpha
* beta
* deprecated
* stable

### Код состояния функциональности

По умолчанию отображается версия Kubernetes, соответствующая версии страницы или сайта. Это значение можно переопределить, передав параметр макрокода <code>for_k8s_version</code>.

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

Результат:

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

#### Функциональность в альфа-версии

```
{{</* feature-state state="alpha" */>}}
```

Результат:

{{< feature-state state="alpha" >}}

#### Функциональность в бета-версии

```
{{</* feature-state state="beta" */>}}
```

Результат:

{{< feature-state state="beta" >}}

#### Функциональность в стабильной версии

```
{{</* feature-state state="stable" */>}}
```

Результат:

{{< feature-state state="stable" >}}

#### Устаревшая функциональность

```
{{</* feature-state state="deprecated" */>}}
```

Результат:

{{< feature-state state="deprecated" >}}

## Глоссарий

Вы можете сослаться на термины из [глоссария](/docs/reference/glossary/) в виде всплывающей (при наведении мыши) подсказки, что удобно при чтении документации через интернет.

Исходные файлы терминов глоссария хранятся в отдельной директории по URL-адресу [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary).

### Демонстрация глоссария

Например, следующий фрагмент кода в Markdown будет отображен в виде всплывающей подсказки — {{< glossary_tooltip text="cluster" term_id="cluster" >}}:

```liquid
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
```

## Заголовки таблиц

Для улучшения доступности таблиц для программ для чтения с экрана, добавьте заголовок к таблице. Чтобы добавить [заголовок](https://www.w3schools.com/tags/tag_caption.asp) таблицы, поместите таблицу в макрокод `table` и определите значение заголовка в параметре` caption`.

{{< note >}}
Заголовки таблиц предназначены только для программ чтения с экрана, поэтому в браузере они не будут отображаться.
{{< /note >}}

Пример:

```go-html-template
{{</* table caption="Конфигурационные параметры" >}}
Параметр | Описание | Значение по умолчанию
:---------|:------------|:-------
`timeout` | Тайм-аут для запросов | `30s`
`logLevel` | Уровень логирования | `INFO`
{{< /table */>}}
```

Результат:

{{</* table caption="Конфигурационные параметры" >}}
Параметр | Описание | Значение по умолчанию
:---------|:------------|:-------
`timeout` | Тайм-аут для запросов | `30s`
`logLevel` | Уровень логирования | `INFO`
{{< /table >}}

Если вы изучите HTML-код таблицы, вы заметите следующий ниже элемент сразу после открывающего элемента `<table>`:

```html
<caption style="display: none;"></caption>
```

## Вкладки

Страница в формате Markdown (файл с расширением `.md`) на этом сайте может содержать набор вкладок для отображения нескольких разновидностей определённого решения.

Макрокод `tabs` принимает следующие параметры:

* `name`: имя, отображаемое на вкладке.
* `codelang`: если вы указываете встроенный контент для макрокода `tab`, вы можете сообщить Hugo, какой язык использовать для подсветки синтаксиса.
* `include`: включаемый файл в вкладку. Если вкладка находится в [узле пакета (leaf bundle)](https://gohugo.io/content-management/page-bundles/#leaf-bundles) Hugo, то файл (может быть любым MIME-типом, который поддерживает Hugo) ищется в самом пакете. Если нет, то включаемое содержимое ищется относительно текущей страницы. Обратите внимание, что при использовании `include` вам следует использовать самозакрывающийся синтаксис. Например, <code>{{</* tab name="Content File #1" include="example1" /*/>}}</code>. Язык может быть указан в `codelang`, в противном случае язык определяется из имени файла.
* Если содержимое вкладки это Markdown, вам нужно использовать символ `%`. Например, `{{%/* tab name="Вкладка 1" %}}This is **markdown**{{% /tab */%}}`
* Вы можете совместно использовать перечисленные выше параметры.
Ниже приведена демонстрация шорткода вкладок.

Ниже приведены примеры вкладок.

{{< note >}}
**Имя** вкладки в элементе `tabs` должно быть уникальным на странице.
{{< /note >}}

### Демонстрация вкладок: подсветка синтаксиса в блоках кода

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{{< tab name="Вкладка 1" codelang="bash" >}}
echo "Это вкладка 1."
{{< /tab >}}
{{< tab name="Вкладка 2" codelang="go" >}}
println "Это вкладка 2."
{{< /tab >}}}
{{< /tabs */>}}
```

Результат:

{{< tabs name="tab_with_code" >}}
{{< tab name="Вкладка 1" codelang="bash" >}}
echo "Это вкладка 1."
{{< /tab >}}
{{< tab name="Вкладка 2" codelang="go" >}}
println "Это вкладка 2."
{{< /tab >}}
{{< /tabs >}}

### Демонстрация вкладок: встроенный Markdown и HTML

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
Это **разметка Markdown.**
{{< note >}}
Также можно использовать макрокоды.
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Обычный HTML</h3>
	<p>Это <i>обычный</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

Результат:

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
Это **разметка Markdown.**

{{< note >}}
Также можно использовать макрокоды.
{{< /note >}}

{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Обычный HTML</h3>
	<p>Это <i>обычный</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs >}}

### Демонстрация вкладок: включение файлов

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs */>}}
```

Результат:

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* Подробнее про [Hugo](https://gohugo.io/).
* Подробнее про [написание новой темы](/ru/docs/contribute/style/write-new-topic/).
* Подробнее про [использование шаблонов страниц](/ru/docs/contribute/style/page-templates/).
* Подробнее про [создание пулреквеста](/ru/docs/contribute/start/#отправка-пулреквеста).
