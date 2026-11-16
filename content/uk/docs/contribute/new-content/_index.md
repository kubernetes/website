---
title: Внесення нового вмісту
content_type: concept
main_menu: true
weight: 25
simple_list: true
---

<!-- overview -->

У цьому розділі наведено інформацію, яку слід знати, перш ніж додавати новий вміст.

Також є окремі сторінки про подання [прикладів використання](/docs/contribute/new-content/case-studies) і [статей для блогу](/docs/contribute/blog/).

<!-- body -->

## Процес внесення нового вмісту {#new-content-task-flow}

<!-- Див. https://github.com/kubernetes/website/issues/28808 для live-editor URL для цієї діаграми -->
<!-- Ви також можете вставити код mermaid у live редактор на https://mermaid-js.github.io/mermaid-live-editor, щоб погратись з ним -->

{{< mermaid >}}
flowchart LR
    subgraph second[Перш ніж розпочати]
    direction TB
    S[ ] -.-
    A[Підпишіть CNCF CLA] --> B[Оберіть гілку Git]
    B --> C[Одна мова на PR]
    C --> F[Ознайомтесь з<br>інструментами для участі]
    end
    subgraph first[Основи участі]
    direction TB
       T[ ] -.-
       D[Пишіть документи в markdown<br>та збирайте сайт за допомогою Hugo] --- E[сирці на GitHub]
       E --- G[Тека '/content/../docs' містить документи<br>для кількох мов]
       G --- H[Ознайомтесь з типом вмісту сторінок Hugo<br>та shortcodes]
    end

    first ----> second

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

***Схема — підготовка до внесення нового вмісту***

На схемі вище показано інформацію, яку слід знати, перш ніж подавати новий вміст. Подробиці наведено нижче.

<!-- body -->

## Основи участі {#contributing-basics}

- Пишіть документацію Kubernetes у Markdown та збирайте сайт Kubernetes за допомогою [Hugo](https://gohugo.io/).
- Документація Kubernetes використовує [CommonMark](https://commonmark.org/) як свій варіант Markdown.
- Вихідний код розміщено на [GitHub](https://github.com/kubernetes/website). Документацію Kubernetes можна знайти в `/content/en/docs/`. Частина довідкової документації автоматично генерується скриптами в теці `update-imported-docs/`.
- [Типи контенту сторінок](/docs/contribute/style/page-content-types/) описують подання вмісту документації в Hugo.
- Для внеску в документацію Kubernetes можна використовувати [shortcodes Docsy](https://www.docsy.dev/docs/adding-content/shortcodes/) або [власні shortcodes Hugo](/docs/contribute/style/hugo-shortcodes/).
- Крім стандартних shortcodes Hugo, ми використовуємо в документації низку [власні shortcodes Hugo](/docs/contribute/style/hugo-shortcodes/) для керування поданням вмісту.
- Вихідний код документації доступний кількома мовами в `/content/`. Кожна мова має власну теку з дволітерним кодом, визначеним [стандартом ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php). Наприклад, вихідний код англійської документації зберігається в `/content/en/docs/`.
- Докладніше про внесок у документацію кількома мовами або початок нового перекладу див. [локалізацію](/docs/contribute/localization).

## Перш ніж розпочати {#before-you-begin}

### Підпишіть CNCF CLA {#sign-the-cla}

Усі учасники Kubernetes **мають** прочитати [Посібник для учасників](https://github.com/kubernetes/community/blob/main/contributors/guide/README.md) і [підписати Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/main/CLA.md).

Pull request від учасників, які не підписали CLA, не проходять автоматизовані тести. Імʼя та електронна адреса, які ви вказуєте, мають збігатися з тими, що є у вашому `git config`, а ваші імʼя та електронна адреса в git мають збігатися з тими, що використовуються для CNCF CLA.

### Вибір гілки Git {#choose-which-git-branch-to-use}

Відкриваючи pull request, потрібно заздалегідь знати, на якій гілці базувати свою роботу.

Сценарій | Гілка
:---------|:------------
Наявний або новий вміст англійською для поточного випуску | `main`
Вміст для випуску зі зміною можливостей | Гілка, що відповідає major- і minor-версії, у якій відбувається зміна можливості, за шаблоном `dev-<version>`. Наприклад, якщо можливість змінюється у випуску `v{{< skew nextMinorVersion >}}`, то додайте зміни до документації у гілку ``dev-{{< skew nextMinorVersion >}}``.
Вміст іншими мовами (локалізації) | Дотримуйтеся домовленостей локалізації. Докладніше див. [Стратегія створення гілок](/docs/contribute/localization/#branch-strategy).

Якщо ви досі не впевнені, яку гілку вибрати, запитайте в `#sig-docs` у Slack.

{{< note >}} Якщо ви вже подали свій pull request і знаєте, що базова гілка неправильна, ви (і лише ви, автор PR) можете її змінити. {{<
/note >}}

### Мови в одному PR {#languages-per-pr}

Обмежуйте pull request однією мовою. Якщо потрібно внести однакову зміну в той самий приклад коду кількома мовами, відкрийте окремий PR для кожної мови.

## Інструменти для учасників {#tools-for-contributors}

Тека [інструментів для учасників](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools) у репозиторії `kubernetes/website` містить інструменти, які допоможуть вам робити внесок легше.

## {{% heading "whatsnext" %}} {#what-s-next}

<!-- relies on simple_list: true in front matter for remaining links -->
- Прочитайте про подання [статей для блогу](/docs/contribute/blog/article-submission/).
