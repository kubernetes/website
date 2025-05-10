---
title: Відповідальні за PR
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs [затверджувачі](/docs/contribute/participate/roles-and-responsibilities/#approvers) беруть участь у тижневих чергуваннях стосовно [управління pull request'ами](https://github.com/kubernetes/website/wiki/PR-Wranglers) для репозиторію.

Цей розділ охоплює обовʼязки відповідальних за PR. Для отримання додаткової інформації щодо якісного рецензування, дивіться [Рецензування змін](/docs/contribute/review/).

<!-- body -->

## Обовʼязки {#duties}

Кожного дня під час тижневого чергування відповідальний за PR:

- Робить огляд [відкритих pull request'ів](https://github.com/kubernetes/website/pulls) на відповідність [стилю](/docs/contribute/style/style-guide/) та [змісту](/docs/contribute/style/content-guide/).
  - Почніть з найменших PRʼів (`size/XS`), і закінчіть найбільшими (`size/XXL`). Огляньте стільки PRʼів, скільки зможете.
- Переконайтеся, що учасники PR підписали [CLA](https://github.com/kubernetes/community/blob/master/CLA.md).
  - Використовуйте [цей](https://github.com/zparnold/k8s-docs-pr-botherer) скрипт, щоб нагадати учасникам, які не підписали CLA, зробити це.
- Надання відгуків про зміни та запит технічних оглядів від членів інших SIG.
  - Надання своїх пропозицій щодо запропонованих змін у PR.
  - Якщо вам потрібно перевірити зміст, залиште коментар у PR і запросіть більше деталей.
  - Призначте відповідну мітку(и) `sig/`.
  - Якщо необхідно, призначте рецензентів з блоку `reviewers:` у метаданих файлу.
  - Ви також можете позначити [SIG](https://github.com/kubernetes/community/blob/master/sig-list.md) для огляду, коментуючи `@kubernetes/<sig>-pr-reviews` у PR.
- Використовуйте коментар `/approve` для затвердження PR для злиття. Зливайте PR, коли він готовий.
  - PRʼи повинні мати коментар `/lgtm` від іншого члена перед злиттям.
  - Розгляньте можливість прийняття технічно правильного змісту, який не відповідає [настановам зі стилю](/docs/contribute/style/style-guide/). Під час затвердження змін відкрийте новий тікет для розвʼязання питання стилю. Зазвичай такі питання стилю можна описати як [гарні перші завдання](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue).
  - Використання виправлень стилю як гарних перших завдань — це хороший спосіб забезпечити наявність легших завдань для допомоги в адаптації нових учасників.
- Також перевіряйте pull requestʼи до коду [генератора довідкової документації](https://github.com/kubernetes-sigs/reference-docs) та оглядайте їх (або залучайте допомогу).
- Підтримуйте [відповідального за тікети](/docs/contribute/participate/issue-wrangler/) у розгляді та теґуванні нових тікетів щодня. Дивіться [Розгляд та категоризація тікетів](/docs/contribute/review/for-approvers/#triage-and-categorize-issues) для керівництва з використання метаданих SIG Docs.

{{< note >}}
Обовʼязки відповідального за PR не застосовуються до PRʼів локалізації (неангломовних PRʼів). Команди локалізації мають свої власні процеси та команди для огляду своїх PRʼів. Однак часто корисно переконатися, що PRʼи локалізації правильно позначені, переглянути невеликі PRʼи, що не залежать від мови (наприклад, оновлення посилань), або позначити рецензентів чи учасників у довготривалих PRʼах (тих, що відкриті понад 6 місяців і не оновлювалися більше як місяць).
{{< /note >}}

### Корисні запити GitHub для відповідальних {#helpful-github-queries-for-wranglers}

Наступні запити корисні під час роботи з PRʼами. Після обробки цих запитів зазвичай залишається невеликий список PRʼів для огляду. Ці запити виключають PRʼи локалізації. Усі запити стосуються основної гілки, крім останнього.

- [Без CLA, не допускається до злиття](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen): Нагадуйте учаснику підписати CLA. Якщо і бот, і людина нагадали їм, закрийте PR і нагадайте їм, що вони можуть відкрити його після підписання CLA. **Не оглядайте PRʼи, автори яких не підписали CLA!**
- [Потребує LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm): Перелік PRʼів, які потребують LGTM від члена. Якщо PR потребує технічного огляду, залучайте одного з рецензентів, запропонованих ботом. Якщо зміст потребує доопрацювання, додайте пропозиції та відгуки безпосередньо.
- [Має LGTM, потребує затвердження документації](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+): Перелік PRʼів, які потребують коментаря `/approve` для злиття.
- [Швидкі виграші](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22): Перелік PRʼів до основної гілки без явних блокувань. (змініть "XS" у розмірі мітки, коли будете працювати з PRʼами [XS, S, M, L, XL, XXL]).
- [Не для основної гілки](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3Alanguage%2Fen+-base%3Amain): Якщо PR для гілки `dev-`, це для майбутнього випуску. Призначте [менеджера випуску документації](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles) використовуючи: `/assign @<github-ім'я_менеджера>`. Якщо PR для старої гілки, допоможіть автору визначити кращу гілку.

### Корисні команди Prow для відповідальних {#helpful-prow-commands-for-wranglers}

```none
# додати мітку англійської мови
/language en

# додати мітку squash до PR, якщо твм більше одного коміту
/label tide/merge-method-squash

# перейменувати PR через Prow (наприклад, робота в процесі [WIP] або кращий опис PR)
/retitle [WIP] <TITLE>
```

### Коли закривати Pull Request'и {#when-to-close-pull-requests}

Огляди та затвердження є одним з інструментів для утримання нашої черги PR короткою та актуальною. Іншим інструментом є закриття.

Закрийте PRʼи, де:

- Автор не підписав CLA протягом двох тижнів.

    Автори можуть відкрити PR знову після підписання CLA. Це малоризикований спосіб переконатися, що нічого не зливається без підписаного CLA.

- Автор не відповів на коментарі чи відгуки протягом 2 або більше тижнів.

Не бійтеся закривати pull request'и. Учасники можуть легко відкрити знову та продовжити роботу. Часто повідомлення про закриття є тим, що спонукає автора продовжити та завершити свій внесок.

Щоб закрити pull request, залиште коментар `/close` у PR.

{{< note >}}

Бот [`k8s-triage-robot`](https://github.com/k8s-triage-robot) позначає тікети як застарілі через 90 днів неактивності. Через 30 днів він позначає питання як "протухлі" та закриває їх. Відповідальні за PR повинні закривати їх через 14-30 днів неактивності.

{{< /note >}}

## Програма тіньового відповідального за PR {#pr-wrangler-shadow-program}

У кінці 2021 року SIG Docs представив PR Wrangler Shadow Program. Програма була введена для допомоги новим учасникам зрозуміти процес управління PR.

### Як стати тіньовим відповідальним за PR {#become-a-shadow}

- Якщо ви зацікавлені у тому, щоби стати тіньовим відповідальним за PR, будь ласка, відвідайте [сторінку Wiki PR Wrangler'ів](https://github.com/kubernetes/website/wiki/PR-Wranglers), щоб побачити графік управління PR на цей рік та зареєструватися.

- Інші можуть звернутися до [Slack-каналу #sig-docs](https://kubernetes.slack.com/messages/sig-docs) для запиту на участь у підтримці відповідальних за PR на конкретний тиждень. Не соромтеся звертатися до одного зі [співголів/лідерів SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs#leadership).

- Після реєстрації на підтримку відповідального за PR, представте себе відповідальному за PR у [Kubernetes Slack](https://slack.k8s.io).
