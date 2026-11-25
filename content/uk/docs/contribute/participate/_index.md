---
title: Участь у SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
no_list: true
---

<!-- overview -->

SIG Docs — одна з [груп за інтересами](https://github.com/kubernetes/community/blob/main/sig-list.md) (special interest groups) у проєкті Kubernetes, яка займається написанням, оновленням і підтримкою документації Kubernetes загалом. Докладніше про цю SIG див. [SIG Docs у репозиторії спільноти на GitHub](https://github.com/kubernetes/community/tree/main/sig-docs).

SIG Docs вітає вміст і рецензії від усіх учасників. Будь-хто може відкрити pull request (PR), і будь-хто може створювати тікети щодо вмісту або коментувати pull request, над якими ще триває робота.

Ви також можете стати [членом](/docs/contribute/participate/roles-and-responsibilities/#members), [рецензентом](/docs/contribute/participate/roles-and-responsibilities/#reviewers) або [затверджувачем](/docs/contribute/participate/roles-and-responsibilities/#approvers). Ці ролі потребують ширшого доступу й передбачають певні обовʼязки щодо затвердження та внесення змін. Докладніше про те, як працює членство в спільноті Kubernetes, див. [community-membership](https://github.com/kubernetes/community/blob/main/community-membership.md).

Решта цього документа описує деякі унікальні способи функціонування цих ролей у SIG Docs, яка відповідає за підтримку одного з найбільш публічно орієнтованих аспектів Kubernetes — вебсайту та документації Kubernetes.

<!-- body -->

## Голова SIG Docs {#sig-docs-chairperson}

Кожна SIG, зокрема SIG Docs, обирає одного або кількох членів SIG на роль голів. Вони є контактними особами між SIG Docs та іншими частинами організації Kubernetes. Від них вимагається глибоке знання структури проєкту Kubernetes загалом і того, як у ньому працює SIG Docs. Актуальний список голів див. у [Leadership](https://github.com/kubernetes/community/tree/main/sig-docs#leadership).

## Команди та автоматизація SIG Docs {#sig-docs-teams-and-automation}

Автоматизація в SIG Docs спирається на два різні механізми: команди GitHub і файли OWNERS.

### Команди GitHub {#github-teams}

Існує дві категорії [команд](https://github.com/orgs/kubernetes/teams?query=sig-docs) SIG Docs у GitHub:

- `@sig-docs-{language}-owners` — затверджувачі та лідери
- `@sig-docs-{language}-reviews` — рецензенти

До кожної з них можна звернутися через її `@name` у коментарях на GitHub, щоб написати всім у цій групі.

Іноді команди Prow і GitHub перетинаються, але не збігаються повністю. Для призначення тікетів і pull request, а також для підтримки затвердження PR автоматизація використовує інформацію з файлів `OWNERS`.

### Файли OWNERS та front-matter {#owners-files-and-front-matter}

Проєкт Kubernetes використовує інструмент автоматизації prow для автоматизації, повʼязаної з тікетами та pull request на GitHub. [Репозиторій вебсайту Kubernetes](https://github.com/kubernetes/website) використовує два [втулки prow](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):

- blunderbuss
- approve

Ці два втулки використовують файли [OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) та [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) на верхньому рівні репозиторію `kubernetes/website` GitHub для контролю роботи prow у репозиторії.

Файл OWNERS містить список людей, які є рецензентами та затверджувачами SIG Docs. Файли OWNERS також можуть існувати в підтеках та можуть перевизначати, хто може виступати як рецензент або затверджувач файлів у цій теці та вкладених теках. Для отримання додаткової інформації про файли OWNERS в цілому дивіться [OWNERS](https://github.com/kubernetes/community/blob/main/contributors/guide/owners.md).

Крім того, окремий файл Markdown може містити у своєму front-matter список рецензентів і затверджувачів — окремі імена користувачів GitHub або групи GitHub.

Комбінація файлів OWNERS і front-matter у файлах Markdown визначає поради, які власники PR отримують від автоматизованих систем щодо того, кого попросити про технічне та редакторське рецензування їхнього PR.

## Як працює злиття {#how-merging-works}

Коли pull request зливають у гілку, з якої публікується вміст, цей вміст публікується на https://kubernetes.io. Щоб забезпечити високу якість опублікованого вмісту, ми дозволяємо зливати pull request лише затверджувачам SIG Docs. Ось як це працює.

- Коли pull request має обидві мітки `lgtm` та `approve`, не має міток `hold` та всі тести проходять успішно, pull request зливається автоматично.
- Члени організації Kubernetes і затверджувачі SIG Docs можуть додавати коментарі, щоб запобігти автоматичному злиттю певного pull request (додавши коментар `/hold` або утримуючись від коментаря `/lgtm`).
- Будь-який член Kubernetes може додати мітку `lgtm`, додавши коментар `/lgtm`.
- Лише затверджувачі SIG Docs можуть злити pull request, додавши коментар `/approve`. Деякі затверджувачі також виконують додаткові ролі, як-от [відповідальний за PR](/docs/contribute/participate/pr-wranglers/) або [голова SIG Docs](#sig-docs-chairperson).

## {{% heading "whatsnext" %}} {#what-s-next}

Щоб дізнатися більше про участь у SIG Docs, див.:

- [Ролі та обовʼязки](/docs/contribute/participate/roles-and-responsibilities/)
- [Відповідальні за тікети](/docs/contribute/participate/issue-wrangler/)
- [Відповідальні за PR](/docs/contribute/participate/pr-wranglers/)

Докладніше про внесок у документацію Kubernetes див.:

- [Внесення нового вмісту](/docs/contribute/new-content/)
- [Рецензування вмісту](/docs/contribute/review/reviewing-prs)
- [Посібник зі стилю документації](/docs/contribute/style/)
