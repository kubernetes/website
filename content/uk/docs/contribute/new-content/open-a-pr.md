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
**Розробники коду**: Якщо ви документуєте нову функцію для майбутнього релізу Kubernetes, дивіться [Документування нової функції](/docs/contribute/new-content/new-features/).
{{< /note >}}

Щоб створити нові сторінки або покращити наявні, відкрийте pull request (PR). Переконайтеся, що ви виконали всі вимоги у розділі [Перш ніж почати](/docs/contribute/new-content/).

Якщо ваша зміна невелика або ви незнайомі з git, прочитайте [Зміни за допомогою GitHub](#changes-using-github), щоб дізнатися, як редагувати сторінку.

Якщо ваші зміни значні, прочитайте [Робота з локальним форком](#fork-the-repo), щоб дізнатися, як внести зміни локально на вашому компʼютері.

<!-- body -->

## Зміни за допомогою GitHub {#changes-using-github}

Якщо ви менш досвідчені з робочими процесами git, ось легший спосіб відкрити pull request. На схемі 1 описані кроки, а деталі наведені нижче.

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

1. На сторінці, де ви бачите проблему, виберіть опцію **Відредагувати сторінку** на панелі праворуч.

1. Внесіть зміни у GitHub markdown редакторі.

1. Праворуч над редактором, оберіть **Commit changes**. У першому полі дайте заголовок вашому повідомленню коміту. У другому полі надайте опис.

   {{< note >}}
   Не використовуйте жодних [ключових слів GitHub](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) у повідомленні вашого коміту. Ви можете додати їх до опису pull request пізніше.
   {{< /note >}}

2. Оберіть **Propose changes**.

3. Оберіть **Create pull request**.

4. Зʼявиться екран **Open a pull request**. Заповніть форму:

   - Поле **Add a title** pull request стандартно містить заголовок коміту. Ви можете змінити його за потреби.
   - Поле **Add a description** містить розширене повідомлення коміту, якщо у вас є, і деякий текст шаблону. Додайте деталі, які вимагає текст шаблону, потім видаліть зайвий текст шаблону.
   - Залиште прапорець **Allow edits from maintainers** увімкненим.

   {{< note >}}
   Опис PR — це чудовий спосіб допомогти рецензентам зрозуміти ваші зміни.    Для отримання додаткової інформації див. [Відкриття PR](#open-a-pr).
   {{</ note >}}

5. Оберіть **Create pull request**.

### Робота з відгуками на GitHub {#addressing-feedback-in-github}

Перед злиттям pull request члени спільноти Kubernetes рецензують та схвалюють його. `k8s-ci-robot` пропонує рецензентів на основі найближчого власника, зазначеного на сторінках. Якщо у вас є конкретна людина на думці, залиште коментар із її імʼям користувача на GitHub.

Якщо рецензент попросить вас внести зміни:

1. Перейдіть на вкладку **Files changed**.
1. Виберіть іконку олівця (редагування) на будь-якому файлі, зміненому pull request.
1. Внесіть запитані зміни.
1. Збережіть зміни.

Якщо ви чекаєте на рецензента, виходьте на звʼязок хоча б раз на 7 днів. Ви також можете залишити повідомлення у каналі `#sig-docs` на Slack.

Коли рецензування буде завершено, рецензент зіллє ваш PR і ваші зміни стануть доступними через кілька хвилин.

## Робота з локальним форком {#fork-the-repo}

Якщо ви більш досвідчені з git або ваші зміни більші за кілька рядків, працюйте з локальним форком.

Переконайтеся, що на вашому компʼютері встановлений [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). Ви також можете використовувати застосунок, що є інтерфейсом користувача для git.

Схема 2 показує кроки, які слід виконати під час роботи з локальним форком. Деталі кожного кроку наведені нижче.

<!-- Див. https://github.com/kubernetes/website/issues/28808 для live-editor URL для цієї фігури -->
<!-- Ви також можете вставити код mermaid у live редактор на https://mermaid-js.github.io/mermaid-live-editor, щоб погратись з ним -->

{{< mermaid >}}
flowchart LR
1[Форк репо kubernetes/website] --> 2[Створіть локальну копію<br>і встановіть upstream]
subgraph changes[Ваші зміни]
direction TB
S[ ] -.-
3[Створіть гілку<br>наприклад: my_new_branch] --> 3a[Внесіть зміни за допомогою<br>текстового редактора] --> 4["Перегляньте зміни<br>локально за допомогою Hugo<br>(localhost:1313)<br>або створіть образ контейнера"]
end
subgraph changes2[Коміт / Push]
direction TB
T[ ] -.-
5[Збережіть коміт] --> 6[Надішліть коміт до<br>origin/my_new_branch]
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

### Форк репозиторію kubernetes/website {#fork-the-kubernetes-website-repository}

1. Перейдіть до репозиторію [`kubernetes/website`](https://github.com/kubernetes/website/).
1. Оберіть **Fork**.

### Створення локальної копії та встановлення upstream {#create-local-copy-and-set-the-upstream}

1. У вікні термінала, клонуйте ваш форк та оновіть тему [Docsy Hugo](https://github.com/google/docsy#readme):

   ```shell
   git clone git@github.com:<github_username>/website.git
   cd website
   ```

2. Перейдіть до нової теки `website`. Встановіть репозиторій `kubernetes/website` як `upstream` remote:

   ```shell
   cd website

   git remote add upstream https://github.com/kubernetes/website.git
   ```

3. перевірте ваші `origin` та `upstream` репозиторії:

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

4. Отримайте коміти з `origin/main` вашого форка та `upstream/main` з `kubernetes/website`:

   ```shell
   git fetch origin
   git fetch upstream
   ```

   Це забезпечить актуальність вашого локального репозиторію перед тим, як ви почнете вносити зміни.

   {{< note >}}
   Цей робочий процес відрізняється від [GitHub Workflow спільноти Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md). Вам не потрібно зливати вашу локальну копію `main` з `upstream/main` перед тим, як надсилати оновлення до вашого форка.
   {{< /note >}}

### Створення гілки {#create-a-branch}

1. Виберіть гілку, на якій буде базуватись ваша робота:

   - Для покращення наявного контенту використовуйте `upstream/main`.
   - Для нового контенту про наявні функції використовуйте `upstream/main`.
   - Для локалізованого контенту дотримуйтесь домовленостей з локалізації. Для додаткової інформації дивіться [локалізацію документації Kubernetes](/docs/contribute/localization/).
   - Для нових функцій у майбутньому випуску Kubernetes використовуйте гілку функцій. Для додаткової інформації дивіться [документування релізу](/docs/contribute/new-content/new-features/).
   - Для довготривалих ініціатив, над якими співпрацюють кілька учасників SIG Docs, таких як реорганізація контенту, використовуйте спеціальну гілку, створену для цього.

   Якщо вам потрібна допомога з вибором гілки, запитайте у каналі `#sig-docs` в Slack.

2. Створіть нову гілку на основі гілки, визначеної на кроці 1. Цей приклад передбачає, що базова гілка — `upstream/main`:

   ```shell
   git checkout -b <my_new_branch> upstream/main
   ```

3. Внесіть свої зміни за допомогою текстового редактора.

У будь-який час використовуйте команду `git status`, щоб побачити, які файли ви змінили.

### Збереження змін {#commit-your-changes}

Коли ви готові подати pull request, збережіть ваші зміни.

1. У вашому локальному репозиторії перевірте, які файли потрібно зберегти в репо:

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
   git commit -m "Ваше коміт-повідомлення"
   ```

   {{< note >}}
   Не використовуйте жодних [GitHub Keywords](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) у вашому повідомленні коміту. Ви можете додати їх до опису pull request пізніше.
   {{< /note >}}

2. Надішліть вашу локальну гілку та її новий коміт до вашого віддаленого форку:

   ```shell
   git push origin <my_new_branch>
   ```

### Попередній локальний перегляд змін {#preview-locally}

Перед тим, як відправити зміни або відкрити pull request, рекомендується попередньо переглянути їх локально. У статті [Попередній перегляд локально](/docs/contribute/new-content/preview-locally/) пояснюється, як запустити вебсайт локально та переглянути запропоновані зміни.

### Відкриття pull request з вашого форку в kubernetes/website {#open-a-pr}

На схемі 3 показано кроки для створення PR із вашого форку в [kubernetes/website](https://github.com/kubernetes/website). Подробиці наведені нижче.

Зверніть увагу, що учасники можуть також згадувати `kubernetes/website` як `k/website`.

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

1. У вебоглядачі перейдіть до репозиторію [`kubernetes/website`](https://github.com/kubernetes/website/).
2. Оберіть **New Pull Request**.
3. Оберіть **compare across forks**.
4. У спадному меню **head repository**, оберіть ваш форк.
5. У спадному меню **compare**, оберіть вашу гілку.
6. Оберіть **Create Pull Request**.
7. Додайте опис до вашого pull request:

    - **Title** (50 символів або менше): Стисло опишіть мету зміни.
    - **Description**: Опишіть зміну докладніше.

      - Якщо є повʼязаний GitHub issue, додайте `Fixes #12345` або `Closes #12345` в описі. Автоматизація GitHub закриває зазначений тікет після злиття PR, якщо це використано. Якщо є інші повʼязані PR, вкажіть їх також.
      - Якщо ви хочете отримати пораду щодо чогось конкретного, включіть будь-які питання, які б ви хотіли, щоб рецензенти розглянули в описі.

8. Оберіть кнопку **Create pull request**.

Вітаємо! Ваш pull request доступний у [Pull requests](https://github.com/kubernetes/website/pulls).

Після створення PR GitHub запускає автоматичні тести та намагається розгорнути попередній перегляд за допомогою [Netlify](https://www.netlify.com/).

- Якщо збірка Netlify не вдалася, оберіть **Details** для отримання додаткової інформації.
- Якщо збірка Netlify вдалася, вибір **Details** відкриває staged версію вебсайту Kubernetes із вашими змінами. Це те, як рецензенти перевіряють ваші зміни.

GitHub також автоматично призначає мітки PR, щоб допомогти рецензентам. Ви також можете додати їх, якщо це потрібно. Для отримання додаткової інформації дивіться [Додавання та видалення міток до тікетів](/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels).

### Робота з відгуками локально

1. Після внесення змін, відредагуйте свій попередній коміт:

   ```shell
   git commit -a --amend
   ```

   - `-a`: комітить усі зміни
   - `--amend`: редагує попередній коміт, замість створення нового

1. За потреби оновіть повідомлення коміту.

1. Використовуйте `git push origin <my_new_branch>` для надсилання змін і повторного запуску тестів Netlify.

   {{< note >}}
   Якщо ви використовуєте `git commit -m` замість редагування, вам потрібно виконати [злиття комітів](#squashing-commits) перед злиттям.
   {{< /note >}}

#### Зміни від рецензентів {#changes-from-reviewers}

Іноді рецензенти вносять зміни у ваш pull request. Перед внесенням будь-яких інших змін, отримайте ці коміти.

1. Отримайте коміти з вашого віддаленого форку та виконайте rebase вашої робочої гілки:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

1. Після rebase, зробить примусове надсилання нових змін до вашого форку:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

#### Конфлікти злиття та rebase {#merge-conflicts-and-rebasing}

{{< note >}}
Для отримання додаткової інформації див. [Галуження в git - Основи галуження та зливання](https://git-scm.com/book/uk/v2/Галуження-в-git-Основи-галуження-та-зливання#_basic_merge_conflicts), [Розширене злиття](https://git-scm.com/book/uk/v2/Інструменти-Git-Складне-злиття), або запитайте в каналі Slack `#sig-docs` по допомогу.
{{< /note >}}

Якщо інший учасник вносить зміни до того самого файлу в іншому PR, це може створити конфлікт злиття. Ви повинні розвʼязати всі конфлікти злиття у вашому PR.

1. Оновіть ваш форк та зробіть rebase вашої локальної гілки:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

   Після rebase, зробить примусове надсилання нових змін до вашого форку:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

2. Отримайте зміни з `upstream/main` репозиторію `kubernetes/website` та зробіть rebase у вашій гілці:

   ```shell
   git fetch upstream
   git rebase upstream/main
   ```

3. Перевірте результати rebase:

   ```shell
   git status
   ```

   Це призведе до позначення деяких файлів такими, що містять конфлікти.

4. Відкрийте кожен файл з конфліктами та знайдіть маркери конфліктів: `>>>`, `<<<` і `===`.
   Розвʼяжіть конфлікт і видаліть маркер конфлікту.

   {{< note >}}
   Для отримання додаткової інформації див. [Як представлені конфлікти](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
   {{< /note >}}

5. Додайте файли до набору змін:

   ```shell
   git add <filename>
   ```

6. Продовжіть rebase:

   ```shell
   git rebase --continue
   ```

7. Повторюйте кроки 2-5 за необхідності.

   Після застосування всіх комітів, команда `git status` показує, що rebase завершено.

8. Зробить примусове надсилання нових змін до вашого форку:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

   Пул реквест більше не показує жодних конфліктів.

### Обʼєднання комітів {#squashing-commits}

{{< note >}}
Для отримання додаткової інформації див. [Інструменти Git - Переписування історії](https://git-scm.com/book/uk/v2/Інструменти-Git-Переписування-історії), або запитайте в каналі Slack `#sig-docs` по допомогу.
{{< /note >}}

Якщо ваш PR має кілька комітів, ви повинні злити їх в один коміт перед злиттям вашого PR. Ви можете перевірити кількість комітів на вкладці **Commits** вашого PR або за допомогою команди `git log` локально.

{{< note >}}
Ця тема припускає використання текстового редактора `vim`.
{{< /note >}}

1. Розпочніть інтерактивний rebase:

   ```shell
   git rebase -i HEAD~<number_of_commits_in_branch>
   ```

   Злиття комітів є формою rebase. Параметр `-i` вказує git, що ви хочете виконати інтерактивний rebase.  `HEAD~<number_of_commits_in_branch>` вказує, скільки комітів розглядати для rebase.

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

2. Розпочніть редагування файлу.

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

   Це зливає коміти `4fa167b80 Address feedback 1` та `7d54e15ee Address feedback 2` у `d875112ca Original commit`, залишаючи тільки `d875112ca Original commit` як частину хронології.

3. Збережіть і вийдіть з файлу.

4. Надішліть ваш обʼєднаний коміт:

   ```shell
   git push --force-with-lease origin <branch_name>
   ```

## Беріть участь в інших репо {#contribute-to-other-repos}

Проєкт [Kubernetes](https://github.com/kubernetes) містить понад 50 репозиторіїв. Багато з цих репозиторіїв містять документацію: текст довідки для користувачів, повідомлення про помилки, довідку API або коментарі в коді.

Якщо ви бачите текст, який хочете покращити, скористайтеся GitHub для пошуку по всіх репозиторіях в організації Kubernetes. Це допоможе вам зрозуміти, куди подати ваш тікет або PR.

Кожен репозиторій має свої процеси та процедури. Перед тим як подати тікет або PR, прочитайте `README.md`, `CONTRIBUTING.md` та `code-of-conduct.md`, якщо вони існують.

Більшість репозиторіїв використовують шаблони для тікетів і PR. Подивіться на кілька відкритих тікетів та PR, щоб зрозуміти процеси команди. Обов’язково заповнюйте шаблони з якомога більшою детальністю, коли подаєте тікет або PR.

## {{% heading "whatsnext" %}}

- Прочитайте [Рецензування](/docs/contribute/review/reviewing-prs), щоб дізнатися більше про процес рецензування.
