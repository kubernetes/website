---
title: Участь у SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

SIG Docs є однією з [робочих груп](https://github.com/kubernetes/community/blob/master/sig-list.md) в проєкті Kubernetes, яка зосереджена на написанні, оновленні та підтримці документації для Kubernetes в цілому. Дивіться [SIG Docs в репозиторії спільноти GitHub](https://github.com/kubernetes/community/tree/master/sig-docs) для отримання додаткової інформації про SIG.

SIG Docs вітає контент та рецензування від усіх учасників. Будь-хто може відкрити pull request (PR), і будь-хто може подавати питання щодо контенту або коментувати pull request'и, що знаходяться в процесі.

Ви також можете стати [членом](/docs/contribute/participate/roles-and-responsibilities/#members), [рецензентом](/docs/contribute/participate/roles-and-responsibilities/#reviewers) або [затверджувачем](/docs/contribute/participate/roles-and-responsibilities/#approvers). Ці ролі вимагають більшого доступу і несуть певні обов’язки щодо затвердження та прийняття змін. Дивіться [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md) для отримання додаткової інформації про те, як працює членство в спільноті Kubernetes.

Решта цього документа описує деякі унікальні способи функціонування цих ролей у SIG Docs, яка відповідає за підтримку одного з найбільш публічно орієнтованих аспектів Kubernetes — вебсайту та документації Kubernetes.

<!-- body -->

## Голова SIG Docs {#sig-docs-chairperson}

Кожна SIG, включаючи SIG Docs, обирає одного або кількох членів SIG для виконання ролі голови. Ці особи є контактними точками між SIG Docs та іншими частинами організації Kubernetes. Від них вимагається глибоке знання структури проєкту Kubernetes в цілому та того, як SIG Docs працює в ньому. Дивіться [Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership) для ознайомлення з актуальним списку голів.

## Команди та автоматизація SIG Docs {#sig-docs-teams-and-automation}

Автоматизація в SIG Docs покладається на два різних механізми: GitHub команди та файли OWNERS.

### Команди GitHub {#github-teams}

Існує дві категорії [команд](https://github.com/orgs/kubernetes/teams?query=sig-docs) SIG Docs у GitHub:

- `@sig-docs-{language}-owners` є затверджувачами та лідерами
- `@sig-docs-{language}-reviews` є рецензентами

Кожну з них можна згадати за допомогою їхнього `@name` в коментарях на GitHub, щоб спілкуватися з усіма в цій групі.

Іноді Prow та команди GitHub збігаються без точного відповідності. Для призначення тікетів, pull request'ів та підтримки затвердження PR автоматизація використовує інформацію з файлів `OWNERS`.

### Файли OWNERS та front-matter {#owners-files-and-front-matter}

Проєкт Kubernetes використовує автоматизаційний інструмент під назвою prow для автоматизації, повʼязаної з тікетами та pull requestʼами на GitHub. [Репозиторій вебсайту Kubernetes](https://github.com/kubernetes/website) використовує два [втулки prow](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):

- blunderbuss
- approve

Ці два втулки використовують файли [OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) та [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) на верхньому рівні репозиторію `kubernetes/website` GitHub для контролю роботи prow у репозиторії.

Файл OWNERS містить список людей, які є рецензентами та затверджувачами SIG Docs. Файли OWNERS також можуть існувати в підтеках та можуть перевизначати, хто може виступати як рецензент або затверджувач файлів у цій теці та вкладених теках. Для отримання додаткової інформації про файли OWNERS в цілому дивіться [OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

Крім того, сам Markdown файл може містити список рецензентів та затверджувачів у його front-matter, вказуючи індивідуальні імена користувачів GitHub або групи GitHub.

Комбінація файлів OWNERS та front-matter у файлах Markdown визначає поради, які отримують власники PR від автоматизованих систем щодо того, кого попросити про технічний та редакційний огляд їх PR.

## Як працює злиття {#how-merging-works}

Коли pull request зливається з гілкою, що використовується для публікації контенту, цей контент публікується на https://kubernetes.io. Щоб забезпечити високу якість нашого опублікованого контенту, ми обмежуємо злиття pull requestʼів до затверджувачів SIG Docs. Ось як це працює.

- Коли pull request має обидві мітки `lgtm` та `approve`, не має міток `hold` та всі тести проходять успішно, pull request зливається автоматично.
- Члени організації Kubernetes та затверджувачі SIG Docs можуть додавати коментарі для запобігання автоматичного злиття конкретного pull request (додавши коментар `/hold` або утримуючись від додавання коментаря `/lgtm`).
- Будь-який член Kubernetes може додати мітку `lgtm`, додавши коментар `/lgtm`.
- Тільки затверджувачі SIG Docs можуть зливати pull request, додаючи коментар `/approve`. Деякі затверджувачі також виконують додаткові ролі, такі як [PR Wrangler](/docs/contribute/participate/pr-wranglers/) або [голова SIG Docs](#sig-docs-chairperson).

## {{% heading "whatsnext" %}}

Для отримання додаткової інформації про внесок до документації Kubernetes дивіться:

- [Внесення нового контенту](/docs/contribute/new-content/)
- [Огляд контенту](/docs/contribute/review/reviewing-prs)
- [Настанови зі стилю](/docs/contribute/style/)
