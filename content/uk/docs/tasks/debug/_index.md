---
title: Моніторинг, логування та налагодження
description: Налаштуйте моніторинг та логування для розвʼязання проблем кластера або налагодження контейнеризованих застосунків.
weight: 40
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: Отримання допомоги
---

<!-- overview -->

Іноді трапляються неприємності. Цей посібник допоможе вам зібрати необхідну інформацію та вирішити проблеми. Він складається з чотирьох розділів:

* [Налагодження вашого застосунку](/docs/tasks/debug/debug-application/) — корисно для користувачів, які розгортають код у Kubernetes та цікавляться причиною його непрацездатності.
* [Налагодження вашого кластера](/docs/tasks/debug/debug-cluster/) — корисно для адміністраторів та операторів кластерів, які усувають несправності у самому кластері Kubernetes.
* [Логи в Kubernetes](/docs/tasks/debug/logging/) — корисно для адміністраторів кластерів, які хочуть налаштувати та керувати логами у Kubernetes.
* [Моніторинг в Kubernetes](/docs/tasks/debug/monitoring/) — корисно для адміністраторів кластерів, які хочуть увімкнути моніторинг у кластері Kubernetes.

Вам також слід перевірити відомі проблеми для [випуску](https://github.com/kubernetes/kubernetes/releases), який ви використовуєте.

<!-- body -->

## Отримання допомоги {#getting-help}

Якщо жоден із наведених вище посібників не відповідає на ваше питання, є різні способи отримати допомогу від спільноти Kubernetes.

### Питання {#questions}

Документацію на цьому сайті структуровано так, щоб відповідати на широке коло питань. [Концепції](/docs/concepts/) пояснюють архітектуру Kubernetes і роботу кожного компонента, а [Налаштування](/docs/setup/) містить практичні інструкції для початку роботи. [Завдання](/docs/tasks/) показують, як виконувати поширені завдання, а [Навчальні матеріали](/docs/tutorials/) — це докладніші покрокові розбори реальних, галузевих або наскрізних сценаріїв розробки. Розділ [Довідник](/docs/reference/) містить докладну документацію з [API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) та інтерфейсів командного рядка (CLI), таких як [`kubectl`](/docs/reference/kubectl/).

## Допоможіть! Моє питання не розглянуто! Мені потрібна допомога зараз! {#help-my-question-isn-t-covered-i-need-help-now}

### Stack Exchange, Stack Overflow або Server Fault {#stack-exchange}

Якщо у вас є питання, повʼязане з *розробкою програмного забезпечення* для вашого контейнеризованого застосунку, ви можете задати його на [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

Якщо у вас є питання про Kubernetes, повʼязані з *керуванням кластером* або *конфігурацією*, ви можете поставити їх на [Server Fault](https://serverfault.com/questions/tagged/kubernetes).

Також існують кілька більш конкретних сайтів мережі Stack Exchange, які можуть бути відповідним місцем для питань про Kubernetes в таких областях, як [DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), [Software Engineering](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes) або [InfoSec](https://security.stackexchange.com/questions/tagged/kubernetes).

Можливо, хтось зі спільноти вже ставив схоже питання або може допомогти з вашою проблемою.

Команда Kubernetes також слідкуватиме за [постами з теґом Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes). Якщо немає наявних питань, які можуть допомогти, **будь ласка, переконайтеся, що ваше питання відповідає [правилам Stack Overflow](https://stackoverflow.com/help/on-topic), [Server Fault](https://serverfault.com/help/on-topic) або сайту мережі Stack Exchange, на якому ви його ставите**, і ознайомтеся з інструкцією [як поставити нове питання](https://stackoverflow.com/help/how-to-ask), перед тим як задавати нове!

### Slack {#slack}

Багато людей зі спільноти Kubernetes спілкуються у Kubernetes Slack в каналі `#kubernetes-users`. Slack потребує реєстрації; ви можете [надіслати запит на запрошення](https://slack.kubernetes.io), реєстрація відкрита для всіх. Запрошуємо приходити й ставити будь-які питання. Після реєстрації відкрийте [організацію Kubernetes у Slack](https://kubernetes.slack.com) у браузері або у власному застосунку Slack.

Після реєстрації переглядайте список каналів для різних тем. Наприклад, люди, які тільки вчаться Kubernetes, також можуть приєднатися до каналу [`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice). Як ще один приклад, розробникам корисно приєднатися до каналу [`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors).

Також існують багато каналів, специфічних для країн / мов. Запрошуємо приєднатися до цих каналів для локалізованої підтримки та інформації:

{{< table caption="Канали Slack для окремих країн і мов" >}}
Країна | Канали
:---------|:------------
Китай | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Фінляндія | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
Франція | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Німеччина | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
Індія | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Італія | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Японія | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Корея | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Нідерланди | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Норвегія | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Польща | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Росія | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Іспанія | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Швеція | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Туреччина | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### Форум {#forum}

Вас раді бачити на офіційному форумі Kubernetes: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Помилки та запити на нові можливості {#bugs-and-feature-requests}

Якщо ви натрапили на щось схоже на помилку або хочете запросити нову можливість, скористайтеся [системою відстеження issue на GitHub](https://github.com/kubernetes/kubernetes/issues).

Перш ніж створювати issue, пошукайте серед наявних issue, чи вашу проблему вже описано.

Якщо ви повідомляєте про помилку, додайте докладну інформацію про те, як відтворити проблему, наприклад:

* Версія Kubernetes: `kubectl version`
* Хмарний провайдер, дистрибутив ОС, конфігурація мережі та версія середовища виконання контейнерів
* Кроки для відтворення проблеми
