---
content_type: concept
title: Покращення документації Kubernetes
weight: 09
card:
  name: contribute
  weight: 11
  title: Внесок у документацію
---

Цей вебсайт підтримує [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs). Проєкт Kubernetes вітає допомогу від усіх учасників, як нових, так і досвідчених!

Учасники, які працюють над документацією Kubernetes:

- Покращують наявний вміст
- Створюють новий вміст
- Перекладають документацію
- Керують частинами документації в циклі випуску Kubernetes і публікують їх

Команда блогу, що входить до SIG Docs, допомагає керувати офіційними блогами. Щоб дізнатися більше, прочитайте [Дописи у блог Kubernetes](/docs/contribute/blog/).

---

{{< note >}}
Щоб дізнатися більше про внесок у Kubernetes загалом, перегляньте загальний [сайт документації для учасників](https://www.kubernetes.dev/docs/).
{{< /note >}}

<!-- body -->

## Початок роботи {#getting-started}

Будь-хто може відкрити тікет щодо документації або запропонувати зміну через pull request (PR) до [репозиторію GitHub `kubernetes/website`](https://github.com/kubernetes/website). Щоб ефективно працювати в спільноті Kubernetes, вам потрібно впевнено користуватися [git](https://git-scm.com/) і [GitHub](https://skills.github.com/).

Щоб долучитися до роботи з документацією:

1. Підпишіть CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/main/CLA.md).
2. Ознайомтеся з [репозиторієм документації](https://github.com/kubernetes/website) і [генератором статичних сайтів](https://gohugo.io), яким користується вебсайт.
3. Переконайтеся, що розумієте основні процеси [відкриття pull request](/docs/contribute/new-content/open-a-pr/) і [рецензування змін](/docs/contribute/review/reviewing-prs/).

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
   E --- F[Зрозумійте основні<br>команди GitHub]
   F --- G[Ознайомтеся з відкритими PR<br>і процесами<br>рецензування змін]
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

На схемі 1 показано дорожню карту для нових учасників. Ви можете виконати деякі або всі кроки з `Реєстрація` та `Огляд`. Після цього ви готові відкривати PR, які досягають ваших цілей внеску, — деякі з них наведено в `Створення PR`. І знову: запитання завжди вітаються!

Деякі завдання потребують більшої довіри та ширшого доступу в організації Kubernetes. Докладніше про ролі й дозволи див. [Участь у SIG Docs](/docs/contribute/participate/).

## Ваш перший внесок {#your-first-contribution}

Підготуватися до першого внеску можна, заздалегідь ознайомившись із кількома кроками. На схемі 2 показано ці кроки, а подробиці наведено далі.

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

- Прочитайте [огляд внеску](/docs/contribute/new-content/), щоб дізнатися про різні способи зробити внесок.
- Перегляньте [список тікетів `kubernetes/website`](https://github.com/kubernetes/website/issues/), щоб знайти тікети, які добре підходять для початку.
- [Відкрийте pull request за допомогою GitHub](/docs/contribute/new-content/open-a-pr/#changes-using-github) до наявної документації та дізнайтеся більше про створення тікетів на GitHub.
- [Рецензуйте pull request](/docs/contribute/review/reviewing-prs/) інших учасників спільноти Kubernetes на точність і мову.
- Прочитайте [настанови щодо вмісту](/docs/contribute/style/content-guide/) і [стилю](/docs/contribute/style/style-guide/) Kubernetes, щоб залишати обґрунтовані коментарі.
- Дізнайтеся про [типи контенту сторінок](/docs/contribute/style/page-content-types/) і [shortcodes Hugo](/docs/contribute/style/hugo-shortcodes/).

## Допомога під час внеску {#getting-help-when-contributing}

Перший внесок може здатися надто складним. [New Contributor Ambassadors](https://github.com/kubernetes/website#new-contributor-ambassadors) готові допомогти вам із першими кількома внесками. Звернутися до них можна в [Kubernetes Slack](https://slack.k8s.io/), бажано в каналі `#sig-docs`. Також першого вівторка кожного місяця відбувається [New Contributors Meet and Greet call](https://www.kubernetes.dev/resources/calendar/). Там можна поспілкуватися з New Contributor Ambassadors і отримати відповіді на свої запитання.

## Приєднуйтеся до SIG Docs {#get-involved-with-sig-docs}

[SIG Docs](/docs/contribute/participate/) — це група учасників, які публікують і підтримують документацію Kubernetes та вебсайт. Участь у SIG Docs — чудовий спосіб для учасників Kubernetes (і розробників можливостей, і інших) суттєво вплинути на проєкт Kubernetes.

SIG Docs спілкується різними способами:

- [Приєднайтеся до `#sig-docs` у Kubernetes Slack](https://slack.k8s.io/). Не забудьте представитися!
- [Приєднайтеся до списку розсилки `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs), де відбуваються ширші обговорення й фіксуються офіційні рішення.
- Приєднуйтеся до [відеозустрічі SIG Docs](https://github.com/kubernetes/community/tree/main/sig-docs), яка відбувається раз на два тижні. Про зустрічі завжди оголошують у `#sig-docs`, і їх додають до [календаря зустрічей спільноти Kubernetes](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles). Вам потрібно буде завантажити [клієнт Zoom](https://zoom.us/download) або підʼєднатися телефоном.
- Приєднуйтеся до асинхронної стендап-зустрічі SIG Docs у Slack у ті тижні, коли відеозустріч у Zoom наживо не проводиться. Про зустрічі завжди оголошують у `#sig-docs`. Долучитися до будь-якого з тредів можна протягом 24 годин після оголошення зустрічі.

## Інші способи зробити внесок {#other-ways-to-contribute}

- Відвідайте [сайт спільноти Kubernetes](/community/). Беріть участь в Twitter або Stack Overflow, дізнайтеся про місцеві зустрічі та події Kubernetes та інше.
- Прочитайте [шпаргалку для учасників](https://www.kubernetes.dev/docs/contributor-cheatsheet/), щоб долучитися до розробки можливостей Kubernetes.
- Відвідайте сайт для учасників, щоб дізнатися більше про [учасників Kubernetes](https://www.kubernetes.dev/) і [додаткові ресурси для учасників](https://www.kubernetes.dev/resources/).
- Дізнайтеся, як [робити внесок в офіційні блоги](/docs/contribute/blog/)
- Подайте [приклад використання](/docs/contribute/new-content/case-studies/)

## Наступні кроки {#next-steps}

- Навчіться [працювати з локальним клоном](/docs/contribute/new-content/open-a-pr/#fork-the-repo) репозиторію.
- Документуйте [можливості у випуску](/docs/contribute/new-content/new-features/).
- Беріть участь у [SIG Docs](/docs/contribute/participate/) і станьте [членом або рецензентом](/docs/contribute/participate/roles-and-responsibilities/).
- Розпочинайте або допомагайте з [локалізацією](/docs/contribute/localization/).
