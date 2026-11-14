---
title: Створення pull request
content_type: concept
weight: 10
card:
  name: contribute
  weight: 40
---

<!-- overview -->

{{< note >}}
**Розробники коду**: якщо ви документуєте нову можливість для майбутнього випуску Kubernetes, див. [Документування нової можливості](/docs/contribute/new-content/new-features/).
{{< /note >}}

Щоб додати нові сторінки вмісту або покращити наявні, відкрийте pull request (PR). Переконайтеся, що виконали всі вимоги з розділу [Перш ніж почати](/docs/contribute/new-content/).

Якщо ваша зміна невелика або ви не знайомі з git, прочитайте [Зміни за допомогою GitHub](#changes-using-github), щоб дізнатися, як редагувати сторінку.

Якщо ваші зміни значні, прочитайте [Робота з локальним форком](#fork-the-repo), щоб дізнатися, як внести зміни локально на вашому компʼютері.

<!-- body -->

## Зміни за допомогою GitHub {#changes-using-github}

Якщо ви маєте менше досвіду з робочими процесами git, ось простіший спосіб відкрити pull request. На схемі 1 показано кроки, а подробиці наведено нижче.

<!-- Див. https://github.com/kubernetes/website/issues/28808 для live-editor URL для цієї схеми -->
<!-- Ви також можете вставити код mermaid у live редактор на https://mermaid-js.github.io/mermaid-live-editor, щоб погратись з ним -->

{{< mermaid >}}
flowchart LR
A([fa:fa-user Новий<br>учасник]) --- id1[(kubernetes/website<br>GitHub)]
subgraph tasks[Зміни за допомогою GitHub]
direction TB
    0[ ] -.-
    1[1. Редагувати цю сторінку] --> 2[2. Використовуйте GitHub markdown<br>редактор для внесення змін]
    2 --> 3[3. Виберіть Commit changes...]

end
subgraph tasks2[ ]
direction TB
4[4. Оберіть Propose changes] --> 5[5. Оберіть Create pull request] --> 6[6. Заповніть форму Open a pull request]
6 --> 7[7. Оберіть Create pull request]
end

id1 --> tasks --> tasks2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,1,2,3,4,5,6,7 grey
class 0 spacewhite
class tasks,tasks2 white
class id1 k8s
{{</ mermaid >}}

Схема 1. Кроки для відкриття PR за допомогою GitHub.

1. На сторінці, де ви бачите проблему, виберіть **Відредагувати сторінку** на панелі навігації праворуч.

1. Внесіть зміни у GitHub markdown редакторі.

1. Праворуч над редактором виберіть **Commit changes**. У першому полі вкажіть заголовок повідомлення коміту. У другому полі додайте опис.

   {{< note >}}
   Не використовуйте в повідомленні коміту жодних [ключових слів GitHub](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword). Їх можна додати до опису pull request пізніше.
   {{< /note >}}

1. Оберіть **Propose changes**.

1. Оберіть **Create pull request**.

1. Зʼявиться екран **Open a pull request**. Заповніть форму:

   - Поле **Add a title** pull request стандартно містить заголовок коміту. Ви можете змінити його за потреби.
   - Поле **Add a description** містить розширене повідомлення коміту, якщо воно є, і текст шаблону. Додайте подробиці, які просить шаблон, а потім видаліть зайвий текст шаблону.
   - Залиште прапорець **Allow edits from maintainers** увімкненим.

   {{< note >}}
   Опис PR — чудовий спосіб допомогти рецензентам зрозуміти вашу зміну. Докладніше див. [Відкриття PR](#open-a-pr).
   {{</ note >}}

1. Оберіть **Create pull request**.

### Робота з відгуками на GitHub {#addressing-feedback-in-github}

Перш ніж pull request буде злито, члени спільноти Kubernetes рецензують і затверджують його. `k8s-ci-robot` пропонує рецензентів на основі найближчого власника, зазначеного на сторінках. Якщо ви маєте на думці конкретну людину, залиште коментар із її імʼям користувача GitHub.

Якщо рецензент попросить вас внести зміни:

1. Перейдіть на вкладку **Files changed**.
1. Виберіть іконку олівця (редагування) на будь-якому файлі, зміненому pull request.
1. Внесіть запитані зміни.
1. Зробіть коміт змін.

Якщо ви чекаєте на рецензента, нагадуйте про себе раз на 7 днів. Також можна написати в Slack-каналі `#sig-docs`.

Коли рецензування буде завершено, рецензент зіллє ваш PR і ваші зміни стануть доступними через кілька хвилин.

## Робота з локальним форком {#fork-the-repo}

Якщо ви більш досвідчені з git або ваші зміни більші за кілька рядків, працюйте з локальним форком.

Переконайтеся, що на вашому компʼютері встановлено [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). Також можна використовувати застосунок із графічним інтерфейсом для git.

Схема 2 показує кроки, які слід виконати під час роботи з локальним форком. Деталі кожного кроку наведені нижче.

<!-- Див. https://github.com/kubernetes/website/issues/28808 для live-editor URL для цієї фігури -->
<!-- Ви також можете вставити код mermaid у live редактор на https://mermaid-js.github.io/mermaid-live-editor, щоб погратись з ним -->

{{< mermaid >}}
flowchart LR
1[Створіть форк репозиторію<br>kubernetes/website] --> 2[Створіть локальний клон<br>і налаштуйте upstream]
subgraph changes[Ваші зміни]
direction TB
S[ ] -.-
3[Створіть гілку<br>наприклад: my_new_branch] --> 3a[Внесіть зміни за допомогою<br>текстового редактора] --> 4["Перегляньте зміни<br>локально за допомогою Hugo<br>(localhost:1313)<br>або створіть образ контейнера"]
end
subgraph changes2[Коміт / Push]
direction TB
T[ ] -.-
5[Зробіть коміт змін] --> 6[Надішліть коміт до<br>origin/my_new_branch]
end

2 --> changes --> changes2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class 1,2,3,3a,4,5,6 grey
class S,T spacewhite
class changes,changes2 white
{{</ mermaid >}}

Схема 2. Робота з локальним форком для внесення змін.

### Створення форку репозиторію kubernetes/website {#fork-the-kubernetes-website-repository}

1. Перейдіть до репозиторію [`kubernetes/website`](https://github.com/kubernetes/website/).
1. Оберіть **Fork**.

### Створення локального клону та налаштування upstream {#create-a-local-clone-and-set-the-upstream}

1. У вікні термінала клонуйте свій форк і оновіть [тему Docsy для Hugo](https://github.com/google/docsy#readme):

   ```shell
   git clone git@github.com:<github_username>/website
   cd website
   ```

1. Перейдіть до нової теки `website`. Встановіть репозиторій `kubernetes/website` як віддалений репозиторій (remote) `upstream`:

   ```shell
   cd website

   git remote add upstream https://github.com/kubernetes/website.git
   ```

1. Перевірте свої репозиторії `origin` і `upstream`:

   ```shell
   git remote -v
   ```

   Вихід буде подібним до:

   ```none
   origin	git@github.com:<github_username>/website.git (fetch)
   origin	git@github.com:<github_username>/website.git (push)
   upstream	https://github.com/kubernetes/website.git (fetch)
   upstream	https://github.com/kubernetes/website.git (push)
   ```

1. Отримайте коміти з `origin/main` вашого форку та `upstream/main` репозиторію `kubernetes/website`:

   ```shell
   git fetch origin
   git fetch upstream
   ```

   Це забезпечить актуальність вашого локального репозиторію перед тим, як ви почнете вносити зміни.

   {{< note >}}
   Цей робочий процес відрізняється від [GitHub Workflow спільноти Kubernetes](https://github.com/kubernetes/community/blob/main/contributors/guide/github-workflow.md). Вам не потрібно зливати свою локальну копію `main` з `upstream/main` перед надсиланням оновлень у свій форк.
   {{< /note >}}

### Створення гілки {#create-a-branch}

1. Виберіть гілку, на якій буде базуватись ваша робота:

   - Для покращення наявного вмісту використовуйте `upstream/main`.
   - Для нового вмісту про наявні можливості використовуйте `upstream/main`.
   - Для локалізованого вмісту дотримуйтеся домовленостей локалізації. Докладніше див. [Локалізація документації Kubernetes](/docs/contribute/localization/).
   - Для нових можливостей у майбутньому випуску Kubernetes використовуйте гілку можливості (feature branch). Докладніше див. [документування для випуску](/docs/contribute/new-content/new-features/).
   - Для довготривалої роботи, над якою співпрацюють кілька учасників SIG Docs, як-от реорганізація вмісту, використовуйте спеціальну гілку, створену для цієї роботи.

   Якщо вам потрібна допомога з вибором гілки, запитайте у каналі `#sig-docs` в Slack.

1. Створіть нову гілку на основі гілки, визначеної на кроці 1. У цьому прикладі базова гілка — `upstream/main`:

   ```shell
   git checkout -b <my_new_branch> upstream/main
   ```

1. Внесіть свої зміни за допомогою текстового редактора.

У будь-який час використовуйте команду `git status`, щоб побачити, які файли ви змінили.

### Коміт змін {#commit-your-changes}

Коли будете готові подати pull request, зробіть коміт змін.

1. У локальному репозиторії перевірте, які файли потрібно закомітити:

   ```shell
   git status
   ```

   Вихід буде подібним до:

   ```none
   On branch <my_new_branch>
   Your branch is up to date with 'origin/<my_new_branch>'.

   Changes not staged for commit:
   (use "git add <file>..." to update what will be committed)
   (use "git checkout -- <file>..." to discard changes in working directory)

   modified:   content/en/docs/contribute/new-content/contributing-content.md

   no changes added to commit (use "git add" and/or "git commit -a")
   ```

1. Додайте файли, зазначені під **Changes not staged for commit**, до коміту:

   ```shell
   git add <your_file_name>
   ```

   Повторіть це для кожного файлу.

1. Після додавання всіх файлів створіть коміт:

   ```shell
   git commit -m "Your commit message"
   ```

   {{< note >}}
   Не використовуйте в повідомленні коміту жодних [ключових слів GitHub](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword). Їх можна додати до опису pull request пізніше.
   {{< /note >}}

1. Надішліть (push) свою локальну гілку та її новий коміт до свого віддаленого форку:

   ```shell
   git push origin <my_new_branch>
   ```

### Попередній локальний перегляд змін {#preview-locally}

Перш ніж надсилати зміни або відкривати pull request, варто попередньо переглянути їх локально. У статті [Попередній локальний перегляд змін](/docs/contribute/new-content/preview-locally/) пояснено, як запустити вебсайт локально й переглянути запропоновані зміни.

### Відкриття pull request з вашого форку в kubernetes/website {#open-a-pr}

На схемі 3 показано кроки для створення PR із вашого форку в [kubernetes/website](https://github.com/kubernetes/website). Подробиці наведені нижче.

Зверніть увагу, що учасники можуть згадувати `kubernetes/website` як `k/website`.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
subgraph first[ ]
direction TB
1[1. Перейдіть до репозиторію kubernetes/website] --> 2[2. Оберіть New Pull Request]
2 --> 3[3. Оберіть compare across forks]
3 --> 4[4. Оберіть ваш форк з<br>меню head repository]
end
subgraph second [ ]
direction TB
5[5. Оберіть вашу гілку з<br>меню compare] --> 6[6. Оберіть Create Pull Request]
6 --> 7[7. Додайте опис<br>до вашого PR]
7 --> 8[8. Оберіть Create pull request]
end

first --> second

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
class 1,2,3,4,5,6,7,8 grey
class first,second white
{{</ mermaid >}}

Схема 3. Кроки для створення PR з вашого форка в [kubernetes/website](https://github.com/kubernetes/website).

1. У браузері перейдіть до репозиторію [`kubernetes/website`](https://github.com/kubernetes/website/).
1. Оберіть **New Pull Request**.
1. Оберіть **compare across forks**.
1. У спадному меню **head repository**, оберіть ваш форк.
1. У спадному меню **compare**, оберіть вашу гілку.
1. Оберіть **Create Pull Request**.
1. Додайте опис pull request:

    - **Title** (50 символів або менше): стисло опишіть мету зміни.
    - **Description**: опишіть зміну докладніше.

      - Якщо є повʼязаний тікет GitHub, додайте в опис `Fixes #12345` або `Closes #12345`. Якщо їх використано, автоматизація GitHub закриє згаданий тікет після злиття PR. Якщо є інші повʼязані PR, також дайте на них посилання.
      - Якщо вам потрібна порада щодо чогось конкретного, додайте в опис запитання, над якими ви хотіли б, щоб подумали рецензенти.

1. Натисніть кнопку **Create pull request**.

Вітаємо! Ваш pull request доступний у [Pull requests](https://github.com/kubernetes/website/pulls).

Після створення PR GitHub запускає автоматичні тести та намагається розгорнути попередній перегляд за допомогою [Netlify](https://www.netlify.com/).

- Якщо збірка Netlify не вдалася, оберіть **Details** для отримання додаткової інформації.
- Якщо збірка Netlify вдалася, вибір **Details** відкриває staged-версію вебсайту Kubernetes із застосованими змінами. Так рецензенти перевіряють ваші зміни.

GitHub також автоматично додає до PR мітки, щоб допомогти рецензентам. За потреби ви теж можете їх додати. Докладніше див. [Додавання та видалення міток тікетів](/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels).

### Робота з відгуками локально {#addressing-feedback-locally}

1. Після внесення змін виправте (amend) свій попередній коміт:

   ```shell
   git commit -a --amend
   ```

   - `-a`: додає до коміту всі зміни
   - `--amend`: змінює попередній коміт замість створення нового

1. За потреби оновіть повідомлення коміту.

1. Використовуйте `git push origin <my_new_branch>` для надсилання змін і повторного запуску тестів Netlify.

   {{< note >}}
   Якщо замість amend ви використовуєте `git commit -m`, перед злиттям потрібно [обʼєднати (squash) свої коміти](#squashing-commits).
   {{< /note >}}

#### Зміни від рецензентів {#changes-from-reviewers}

Іноді рецензенти роблять коміти у ваш pull request. Перш ніж вносити інші зміни, отримайте ці коміти.

1. Отримайте коміти з вашого віддаленого форку та виконайте rebase вашої робочої гілки:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

1. Після rebase примусово надішліть (force-push) нові зміни до свого форку:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

#### Конфлікти злиття та rebase {#merge-conflicts-and-rebasing}

{{< note >}}
Докладніше див. [Галуження в Git — основи галуження та злиття](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts), [Розширене злиття](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging) або попросіть допомоги в Slack-каналі `#sig-docs`.
{{< /note >}}

Якщо інший учасник вносить зміни до того самого файлу в іншому PR, це може створити конфлікт злиття. Ви повинні розвʼязати всі конфлікти злиття у вашому PR.

1. Оновіть свій форк і зробіть rebase локальної гілки:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

   Потім примусово надішліть (force-push) зміни до свого форку:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

1. Отримайте зміни з `upstream/main` репозиторію `kubernetes/website` і зробіть rebase своєї гілки:

   ```shell
   git fetch upstream
   git rebase upstream/main
   ```

1. Перевірте результати rebase:

   ```shell
   git status
   ```

   У результаті кілька файлів буде позначено як конфліктні.

1. Відкрийте кожен файл із конфліктами й знайдіть маркери конфліктів: `>>>`, `<<<` і `===`. Розвʼяжіть конфлікт і видаліть маркер конфлікту.

   {{< note >}}
   Для отримання додаткової інформації див. [Як представлені конфлікти](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
   {{< /note >}}

1. Додайте файли до набору змін:

   ```shell
   git add <filename>
   ```

1. Продовжіть rebase:

   ```shell
   git rebase --continue
   ```

1. За потреби повторіть кроки 2–5.

   Після застосування всіх комітів, команда `git status` показує, що rebase завершено.

1. Примусово надішліть (force-push) гілку до свого форку:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

   Pull request більше не показує конфліктів.

### Обʼєднання (squash) комітів {#squashing-commits}

{{< note >}}
Докладніше див. [Інструменти Git — переписування історії](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) або попросіть допомоги в Slack-каналі `#sig-docs`.
{{< /note >}}

Якщо ваш PR має кілька комітів, перед його злиттям їх потрібно обʼєднати (squash) в один коміт. Кількість комітів можна перевірити на вкладці **Commits** вашого PR або локально командою `git log`.

{{< note >}}
У цьому розділі передбачено, що текстовим редактором командного рядка є `vim`.
{{< /note >}}

1. Розпочніть інтерактивний rebase:

   ```shell
   git rebase -i HEAD~<number_of_commits_in_branch>
   ```

   Обʼєднання комітів — це різновид rebase. Параметр `-i` вказує git, що ви хочете виконати інтерактивний rebase. `HEAD~<number_of_commits_in_branch` вказує, скільки комітів розглядати для rebase.

   Результат буде схожий на:

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2

   # Rebase 3d18sf680..7d54e15ee onto 3d183f680 (3 commands)

   ...

   # These lines can be re-ordered; they are executed from top to bottom.
   ```

   Перша частина результату виводить перелік комітів для rebase. Друга частина має параметри для кожного коміту. Заміна слова `pick` змінює статус коміту після завершення rebase.

   Для цілей rebase зосередьтесь на `squash` і `pick`.

   {{< note >}}
   Для отримання додаткової інформації див. [Інтерактивний режим](https://git-scm.com/docs/git-rebase#_interactive_mode).
   {{< /note >}}

1. Розпочніть редагування файлу.

   Змініть початковий текст:

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2
   ```

   На:

   ```none
   pick d875112ca Original commit
   squash 4fa167b80 Address feedback 1
   squash 7d54e15ee Address feedback 2
   ```

   Це обʼєднує коміти `4fa167b80 Address feedback 1` і `7d54e15ee Address feedback 2` у `d875112ca Original commit`, залишаючи в історії лише `d875112ca Original commit`.

1. Збережіть файл і вийдіть.

1. Надішліть обʼєднаний коміт:

   ```shell
   git push --force-with-lease origin <branch_name>
   ```

## Внесок в інші репозиторії {#contribute-to-other-repos}

[Проєкт Kubernetes](https://github.com/kubernetes) містить понад 50 репозиторіїв. Багато з них містять документацію: текст довідки для користувачів, повідомлення про помилки, довідник API або коментарі в коді.

Якщо ви бачите текст, який хочете покращити, скористайтеся GitHub для пошуку по всіх репозиторіях в організації Kubernetes. Це допоможе вам зрозуміти, куди подати ваш тікет або PR.

Кожен репозиторій має власні процеси та процедури. Перш ніж створювати тікет або подавати PR, прочитайте `README.md`, `CONTRIBUTING.md` і `code-of-conduct.md` цього репозиторію, якщо вони є.

Більшість репозиторіїв використовують шаблони для тікетів і PR. Подивіться на кілька відкритих тікетів та PR, щоб зрозуміти процеси команди. Обовʼязково заповнюйте шаблони з якомога більшою детальністю, коли подаєте тікет або PR.

## {{% heading "whatsnext" %}} {#what-s-next}

- Прочитайте [Рецензування](/docs/contribute/review/reviewing-prs), щоб дізнатися більше про процес рецензування.
