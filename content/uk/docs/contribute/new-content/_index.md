---
title: Створення нового контенту
content_type: concept
main_menu: true
weight: 25
simple_list: true
---

<!-- overview -->

Цей розділ містить інформацію, яку слід знати перед тим, як створювати новий контент.

Також є спеціальні сторінки для подання [прикладів використання](/docs/contribute/new-content/case-studies) та [статей для блогу](/docs/contribute/blog/).

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

***Схема — Підготовка до створення нового контенту***

Вище показана інформація, яку слід знати перед надсиланням нового контенту. Деталі наведені нижче.

<!-- body -->

## Основи участі {#contributing-basics}

- Пишіть документацію Kubernetes у Markdown та збирайте сайт Kubernetes за допомогою [Hugo](https://gohugo.io/).
- Документація Kubernetes використовує [CommonMark](https://commonmark.org/) варіант Markdown.
- Сирці знаходяться на [GitHub](https://github.com/kubernetes/website). Ви можете знайти документацію Kubernetes в `/content/en/docs/`. Частина довідкової документації автоматично генерується зі скриптів у теці `update-imported-docs/`.
- [Типи вмісту сторінок](/docs/contribute/style/page-content-types/) описують вигляд вмісту документації в Hugo.
- Ви можете використовувати [Docsy shortcodes](https://www.docsy.dev/docs/adding-content/shortcodes/) або [власні Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/), щоб зробити внесок у документацію Kubernetes.
- Крім стандартних Hugo shortcodes, ми використовуємо кілька [власних Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/) у нашій документації для керування процесом обробки вмісту.
- Сирці документації доступні кількома мовами в `/content/`. Кожна мова має свою теку з дволітерним кодом, визначеним [ISO 639-1 стандартом](https://www.loc.gov/standards/iso639-2/php/code_list.php). Наприклад, сирці документації англійською мовою зберігається в `/content/en/docs/`, української — `/content/uk/docs/`, відповідно.
- Для отримання додаткової інформації про роботу з документацією кількома мовами або початку нової локалізації, див. [локалізація](/docs/contribute/localization).

## Перш ніж розпочати {#before-you-begin}

### Підпишіть CNCF CLA {#sign-the-cla}

Усі учасники Kubernetes **повинні** ознайомитись з [Настановами для учасників](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) та [підписати Угоду про ліцензування внесків (CLA, Contributor License Agreement)](https://github.com/kubernetes/community/blob/master/CLA.md).

Pull requests від учасників, які не підписали CLA, не пройдуть автоматизовані
тести. Імʼя та електронна адреса, які ви надаєте, повинні збігатися з тими, що знаходяться у вашій конфігурації `git config`, а ваше імʼя та електронна адреса в git повинні збігатися з тими, що використовуються для CNCF CLA.

### Оберіть гілку Git для використання {#choose-which-git-branch-to-use}

Відкриваючи pull request, ви повинні заздалегідь знати, яку гілку взяти за основу для своєї роботи.

Сценарій | Гілка
:---------|:------------
Поточний або новий контент англійською мовою для поточного випуску | `main`
Контент для випуску змін функцій | Гілка, яка відповідає основній та мінорній версії, у якій відбувається зміна функцій, використовуючи шаблон `dev-<version>`. Наприклад, якщо функція змінюється у випуску `v{{< skew nextMinorVersion >}}`, то додайте зміни до документації у гілку ``dev-{{< skew nextMinorVersion >}}``.
Контент іншими мовами (локалізація) | Використовуйте домовленості локалізації. Див. [Стратегію створення гілок локалізації](/docs/contribute/localization/#branch-strategy) для отримання додаткової інформації.

Якщо ви все ще не впевнені, яку гілку обрати, запитайте у `#sig-docs` в Slack.

{{< note >}} Якщо ви вже подали свій pull request і знаєте, що базова гілка була неправильною, ви (і тільки ви, відправник) можете змінити її. {{<
/note >}}

### Мови в одному PR {#languages-per-pr}

Обмежуйте pull requests однією мовою на PR. Якщо вам потрібно внести однакові
зміни до одного і того ж зразка коду кількома мовами, відкрийте окремий PR для
кожної мови.

## Інструменти {#contributing-tools}

Тека [інструменти для учасників](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools) в репозиторії `kubernetes/website` містить інструменти, які допоможуть зробити вашу участь в створенні документації простішою.

## {{% heading "whatsnext" %}}

- Прочитайте про [подання статей до блогу](/docs/contribute/blog/article-submission/).
