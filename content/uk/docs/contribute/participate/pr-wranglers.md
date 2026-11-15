---
title: Відповідальні за PR
content_type: concept
weight: 20
---

<!-- overview -->

[Затверджувачі](/docs/contribute/participate/roles-and-responsibilities/#approvers) SIG Docs по черзі тижневими змінами займаються [керуванням pull request](https://github.com/kubernetes/website/wiki/PR-Wranglers) у репозиторії.

У цьому розділі описано обовʼязки відповідального за PR. Докладніше про якісне рецензування див. [Рецензування змін](/docs/contribute/review/).

<!-- body -->

## Обовʼязки {#duties}

Кожного дня тижневої зміни як відповідальний за PR:

- Рецензуйте [відкриті pull request](https://github.com/kubernetes/website/pulls) на якість і відповідність [Посібнику зі стилю](/docs/contribute/style/style-guide/) та [Посібнику з вмісту](/docs/contribute/style/content-guide/).
  - Починайте з найменших PR (`size/XS`) і закінчуйте найбільшими (`size/XXL`). Рецензуйте стільки PR, скільки зможете.
- Переконайтеся, що учасники PR підписали [CLA](https://github.com/kubernetes/community/blob/main/CLA.md).
  - Використовуйте [цей](https://github.com/zparnold/k8s-docs-pr-botherer) скрипт, щоб нагадати учасникам, які не підписали CLA, зробити це.
- Надавайте відгуки щодо змін і просіть членів інших SIG про технічне рецензування.
  - Пропонуйте зміни вмісту безпосередньо в рядках PR (inline suggestions).
  - Якщо потрібно перевірити вміст, залиште коментар у PR і попросіть більше подробиць.
  - Призначте відповідні мітки `sig/`.
  - За потреби призначте рецензентів із блоку `reviewers:` у front matter файлу.
  - Також можна позначити [SIG](https://github.com/kubernetes/community/blob/main/sig-list.md) для рецензування, залишивши в PR коментар `@kubernetes/<sig>-pr-reviews`.
- Використовуйте коментар `/approve`, щоб затвердити PR для злиття. Зливайте PR, коли він готовий.
  - PR мають отримати коментар `/lgtm` від іншого члена перед злиттям.
  - Розгляньте можливість прийняти технічно точний вміст, який не відповідає [настановам зі стилю](/docs/contribute/style/style-guide/). Затверджуючи зміну, відкрийте новий тікет щодо проблеми зі стилем. Зазвичай такі тікети з виправлення стилю можна оформити як [good first issue](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue).
  - Використання виправлень стилю як good first issue — хороший спосіб мати запас простіших завдань, які допомагають залучати нових учасників.
- Також перевіряйте pull request до коду [генератора довідкової документації](https://github.com/kubernetes-sigs/reference-docs) і рецензуйте їх (або залучайте допомогу).
- Допомагайте [відповідальному за тікети](/docs/contribute/participate/issue-wrangler/) щодня розглядати й позначати мітками нові тікети. Настанови щодо того, як SIG Docs використовує метадані, див. у [Класифікація та категоризація проблем](/docs/contribute/review/for-approvers/#triage-and-categorize-issues).

{{< note >}}
Обовʼязки відповідального за PR не стосуються PR локалізації (неанглійських PR). Команди локалізації мають власні процеси й команди для рецензування PR своєю мовою. Однак часто корисно перевірити, чи правильно позначено мовні PR, рецензувати невеликі PR, що не залежать від мови (як-от оновлення посилань), або позначати рецензентів чи учасників у довготривалих PR (відкритих понад 6 місяців тому, які не оновлювалися місяць або довше).
{{< /note >}}

### Корисні запити GitHub для відповідальних {#helpful-github-queries-for-wranglers}

Такі запити корисні під час роботи відповідального. Після опрацювання цих запитів список PR для рецензування зазвичай невеликий. Ці запити виключають PR локалізації. Усі запити стосуються гілки main, крім останнього.

- [Без CLA, не можна зливати](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen): Нагадайте учаснику підписати CLA. Якщо і бот, і людина вже нагадали, закрийте PR і нагадайте, що його можна відкрити знову після підписання CLA. **Не рецензуйте PR, автори яких не підписали CLA!**
- [Потребує LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm): Перелік PR, яким потрібен LGTM від члена. Якщо PR потребує технічного рецензування, залучіть одного з рецензентів, запропонованих ботом. Якщо вміст потребує доопрацювання, додайте пропозиції та відгуки в рядках.
- [Має LGTM, потребує затвердження docs](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+): Перелік PR, яким для злиття потрібен коментар `/approve`.
- [Швидкі виграші](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22): Перелік PRʼів до основної гілки без явних блокувань. (змініть "XS" у мітці розміру, коли будете працювати з PRʼами [XS, S, M, L, XL, XXL]).
- [Не до основної гілки](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3Alanguage%2Fen+-base%3Amain): Якщо PR до гілки `dev-`, він для майбутнього випуску. Призначте [менеджера випуску документації](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles) командою `/assign @<manager's_github-username>`. Якщо PR до старої гілки, допоможіть автору зʼясувати, чи спрямовано його на найкращу гілку.

### Корисні команди Prow для відповідальних {#helpful-prow-commands-for-wranglers}

```
# додати мітку англійської мови
/language en

# додати мітку squash до PR, якщо в ньому більше одного коміту
/label tide/merge-method-squash

# перейменувати PR через Prow (наприклад, робота в процесі [WIP] або кращий опис PR)
/retitle [WIP] <TITLE>
```

### Коли закривати pull request {#when-to-close-pull-requests}

Рецензування й затвердження — один з інструментів, що допомагають тримати чергу PR короткою та актуальною. Ще один інструмент — закриття.

Закривайте PR, якщо:

- Автор не підписав CLA протягом двох тижнів.

    Автори можуть відкрити PR знову після підписання CLA. Це малоризикований спосіб переконатися, що нічого не зливається без підписаного CLA.

- Автор не відповів на коментарі чи відгуки протягом 2 або більше тижнів.

Не бійтеся закривати pull request. Учасники можуть легко відкрити їх знову й продовжити незавершену роботу. Часто саме повідомлення про закриття спонукає автора повернутися й завершити свій внесок.

Щоб закрити pull request, залиште коментар `/close` у PR.

{{< note >}}
Бот [`k8s-triage-robot`](https://github.com/k8s-triage-robot) позначає тікети як застарілі (stale) після 90 днів неактивності. Ще через 30 днів він позначає їх як покинуті (rotten) і закриває. Відповідальні за PR мають закривати тікети після 14–30 днів неактивності.
{{< /note >}}

## Програма тіньового відповідального за PR {#pr-wrangler-shadow-program}

Наприкінці 2021 року SIG Docs запровадила PR Wrangler Shadow Program. Програму запроваджено, щоб допомогти новим учасникам зрозуміти процес роботи відповідального за PR.

### Як стати тіньовим відповідальним за PR {#become-a-shadow}

- Якщо ви хочете бути тіньовим відповідальним за PR, перейдіть на [вікі-сторінку PR Wranglers](https://github.com/kubernetes/website/wiki/PR-Wranglers), щоб переглянути графік відповідальних за PR на цей рік і зареєструватися.

- Інші можуть звернутися в [Slack-канал #sig-docs](https://kubernetes.slack.com/messages/sig-docs) із запитом бути тінню призначеного відповідального за PR на певний тиждень. Не соромтеся звертатися до одного зі [співголів/лідерів SIG Docs](https://github.com/kubernetes/community/tree/main/sig-docs#leadership).

- Після реєстрації як тінь відповідального за PR представтеся цьому відповідальному в [Kubernetes Slack](https://slack.k8s.io).
