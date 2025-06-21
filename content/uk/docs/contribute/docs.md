---
content_type: concept
title: Покращення документації Kubernetes
weight: 09
card:
  name: contribute
  weight: 11
  title: Розбудова документації
---

Цей вебсайт підтримується робочою групою [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs). Проєкт Kubernetes вітає допомогу від усіх учасників, незалежно від їхнього досвіду!

Учасники, які мають намір працювати з документацією Kubernetes можуть:

- Вдосконалювати наявний вміст
- Створювати новий вміст
- Перекладати документацію
- Керувати та публікувати документацію під час релізного циклу Kubernetes

Команда блогів, частина SIG Docs, допомагає керувати офіційними блогами. Щоб дізнатися більше, прочитайте [участь у блогах Kubernetes](/docs/contribute/blog/).

---

{{< note >}}
Щоб дізнатися більше про те, як зробити свій внесок в Kubernetes загалом, перегляньте загальний [сайт документації для учасників](https://www.kubernetes.dev/docs/).
{{< /note >}}

<!-- body -->

## Початок роботи {#getting-started}

Будь-хто може відкрити тікет щодо документації або внести зміни через запит на злиття (PR) в [репозиторій GitHub `kubernetes/website`](https://github.com/kubernetes/website). Для ефективної роботи в спільноті Kubernetes вам слід вміти працювати з
[git](https://git-scm.com/) та [GitHub](https://skills.github.com/).

Для того, щоб долучитись до роботи з документацією:

1. Ознайомтесь та підпишіть CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md).
2. Ознайомтесь з [репозиторієм документації](https://github.com/kubernetes/website) та генератором [статичних вебсайтів](https://gohugo.io).
3. Переконайтесь, що ви розумієте базові вимоги щодо [відкриття запиту на злиття](/docs/contribute/new-content/open-a-pr/) та процесу [рецензування змін](/docs/contribute/review/reviewing-prs/).

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[Створення PR]
direction TB
U[ ] -.-
Q[Зробіть покращення] --- N[Створіть новий<br>вміст]
N --- O[Перекладіть<br>документацію]
O --- P[Керуйте/Публікуйте<br>документацію релізного<br>циклу K8s]

end

subgraph second[Огляд]
direction TB
   T[ ] -.-
   D[Огляньте репозиторій<br>kubernetes/website] --- E[Ознайомтесь з<br>генератором статичних<br>сайтів Hugo]
   E --- F[Оновіть відомості про<br>основні команди GitHub]
   F --- G[Робіть огляд<br>відкритих PR<br>та змін]
end

subgraph first[Реєстрація]
    direction TB
    S[ ] -.-
    B[Підпишіть CNCF<br>Contributor<br>License Agreement] --- C[Приєднайтесь до<br>каналу sig-docs<br>в Slack]
    C --- V[Приєднайтесь до<br> списку розсилки<br> kubernetes-sig-docs]
    V --- M[Відвідуйте тижневі<br>заходи sig-docs<br>чи зустрічі в slack]
end

A([fa:fa-user Новий<br>учасник]) --> first
A --> second
A --> third
A --> H[Ставте питання!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
Схема 1. Початок роботи для нового учасника.

На схемі 1 зображено шлях для нового учасника. Ви можете виконати деякі або всі етапи з `Реєстрації` та `Огляду`. Тепер ви готові відкривати PR (запити на злиття), щоб досягти своїх цілей, деякі з яких перелічені в `Створення PR`. Знову ж таки, не соромтесь ставити питання, питання завжди вітаються!

Деякі завдання вимагають більшого рівня довіри та більшого доступу в організації Kubernetes. Докладнішу інформацію щодо ролей та дозволів дивіться в розділі [Участь в SIG Docs](/docs/contribute/participate/).

## Ваш перший внесок {#your-first-contribution}

Ви можете підготуватися до свого першого внеску, розглянувши кілька кроків перед тим. Схема 2 описує кроки, а опис міститься далі.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[Перший внесок]
    direction TB
    S[ ] -.-
    G[Зробіть огляд PR<br>від інших учасників K8s] -->
    A[Ознайомтесь з переліком тікетів<br>на  kubernetes/website<br>щоб знайти щось для першого PR] --> B[Створіть PR!!]
    end
    subgraph first[Підготовчі кроки]
    direction TB
       T[ ] -.-
       D[Ознайомтесь з описом внеску] -->E[Ознайомтесь з настановами<br>щодо вмісту та стилю K8s]
       E --> F[Дізнайтесь про типи вмісту<br>сторінок Hugo та<br>їх shortcodes]
    end


    first ----> second


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
Схема 2. Підготовка до першого внеску.

- Прочитайте [Як робити внесок](/docs/contribute/new-content/), щоб дізнатися про різні способи, якими ви можете зробити свій внесок.
- Ознайомтесь зі списком тікетів на [`kubernetes/website`](https://github.com/kubernetes/website/issues/) на предмет наявності питань, які можуть бути гарними точками входу.
- [Відкрийте запит на злиття на GitHub](/docs/contribute/new-content/open-a-pr/#changes-using-github) до наявної документації та дізнайтеся більше про створення тікетів на GitHub.
- [Рецензуйте запити на злиття](/docs/contribute/review/reviewing-prs/) від інших учасників спільноти Kubernetes на предмет точності та мови.
- Прочитайте поради щодо [вмісту](/docs/contribute/style/content-guide/) та [стилю](/docs/contribute/style/style-guide/) Kubernetes, щоб залишати обґрунтовані коментарі.
- Дізнайтеся про [типи вмісту сторінок](/docs/contribute/style/page-content-types/) та [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/).

## Отримання допомоги щодо участі {#getting-help-with-contributing}

Зробити перший внесок може бути дуже складно. [Помічники для нових учасників](https://github.com/kubernetes/website#new-contributor-ambassadors) (New Contributor Ambassador) готові провести вас через створення вашого першого внеску. Ви можете звертатися до них в [Slack Kubernetes](https://slack.k8s.io/), переважно в каналі `#sig-docs`. Також є [Зустрічі з новими учасниками](https://www.kubernetes.dev/resources/calendar/), яка відбувається першого вівторка кожного місяця. Ви можете спілкуватися з помічниками для нових учасників та отримати відповіді на свої запитання там.

## Наступні кроки {#next-steps}

- Навчіться [працювати з локальним клоном](/docs/contribute/new-content/open-a-pr/#fork-the-repo) репозиторію.
- Документуйте [функції у випуску](/docs/contribute/new-content/new-features/).
- Беріть участь в [SIG Docs](/docs/contribute/participate/) і станьте [учасником або рецензентом](/docs/contribute/participate/roles-and-responsibilities/).
- Розпочинайте або допомагайте з [локалізацією](/docs/contribute/localization/).

## Приєднуйтеся до SIG Docs {#get-involved-with-sig-docs}

[SIG Docs](/docs/contribute/participate/) — це група учасників, які публікують та підтримують документацію Kubernetes та цей вебсайт. Участь в SIG Docs — це гарний спосіб для учасників Kubernetes (розробка функцій чи інше) зробити значний внесок у проєкт Kubernetes.

SIG Docs спілкується за допомогою різних інструментів:

- [Приєднуйтесь до `#sig-docs` в Kubernetes Slack](https://slack.k8s.io/). Не забудьте представитися!
- [Приєднуйтесь до списку розсилки `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs), де відбуваються ширші обговорення та записуються офіційні рішення.
- Приєднуйтесь до [відеозустрічей SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) щотижня. Зустрічі завжди оголошуються в `#sig-docs` та додаються до [календаря зустрічей спільноти Kubernetes](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles). Вам слід завантажити [клієнт Zoom](https://zoom.us/download) або долучитися за допомоги телефону.
- Приєднуйтесь до асинхронних зустрічей в Slack SIG Docs в ті тижні, коли відбувається відеозустріч віч-на-віч. Зустрічі завжди оголошуються в `#sig-docs`. Ви можете зробити внесок до будь-якого з тредів протягом 24 годин після оголошення зустрічі.

## Інші способи зробити внесок {#other-ways-to-contribute}

- Відвідайте [сайт спільноти Kubernetes](/community/). Беріть участь в Twitter або Stack Overflow, дізнайтеся про місцеві зустрічі та події Kubernetes та інше.
- Прочитайте [шпаргалку для учасників](https://www.kubernetes.dev/docs/contributor-cheatsheet/) для участі у розробці функцій Kubernetes.
- Відвідайте сайт учасника, щоб дізнатися більше про [учасників Kubernetes](https://www.kubernetes.dev/) та [додаткові ресурси для учасників](https://www.kubernetes.dev/resources/).
- Пишіть [пости в блог](/docs/contribute/new-content/blogs-case-studies/)
- Подавайте [приклади використання](/docs/contribute/new-content/case-studies/)
