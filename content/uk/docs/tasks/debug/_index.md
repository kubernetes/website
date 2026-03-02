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
* [Налагодження вашого кластера](/docs/tasks/debug/debug-cluster/) — корисно для адміністраторів кластерів та людей, чиї кластери Kubernetes не перебувають у найкращому стані.
* [Логи в Kubernetes](/docs/tasks/debug/logging/) — Корисно для адміністраторів кластерів, які хочуть налаштувати та керувати логами у Kubernetes.
* [Моніторинг в Kubernetes](/docs/tasks/debug/monitoring/) — Корисно для адміністраторів кластерів, які хочуть увімкнути моніторинг у кластері Kubernetes.

Вам також слід перевірити відомі проблеми для [випуску](https://github.com/kubernetes/kubernetes/releases), який ви використовуєте.

<!-- body -->

## Отримання допомоги {#getting-help}

Якщо вашу проблему не вдається вирішити жодною з інструкцій вище, існує ряд способів, як отримати допомогу від спільноти Kubernetes.

### Питання {#questions}

Документація на цьому сайті структурована таким чином, щоб надавати відповіді на широкий спектр питань. [Концепції](/docs/concepts/) пояснюють архітектуру Kubernetes та роботу кожного компонента, в той час, як [Налаштування](/docs/setup/) надає практичні інструкції для початку роботи. [Завдання](/docs/tasks/) показують, як виконати широке коло завдань, а [Посібники](/docs/tutorials/) — це більш комплексні огляди сценаріїв реального життя, специфічних для галузей або розробки з початку до кінця. Розділ [Довідник](/docs/reference/) надає детальну документацію з [API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) та інтерфейсів командного рядка (CLI), таких як [`kubectl`](/docs/reference/kubectl/).

## Допоможіть! Моє питання не розглянуто! Мені потрібна допомога зараз!

### Stack Exchange, Stack Overflow або Server Fault {#stack-exchange}

Якщо у вас є питання, повʼязане з *розробкою програмного забезпечення* для вашого контейнеризованого застосунку, ви можете задати його на [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

Якщо у вас є питання про Kubernetes, повʼязані з *управлінням кластером* або *конфігурацією*, ви можете задати їх на [Server Fault](https://serverfault.com/questions/tagged/kubernetes).

Також існують кілька більш конкретних сайтів мережі Stack Exchange, які можуть бути відповідним місцем для питань про Kubernetes в таких областях, як [DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), [Software Engineering](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes) або [InfoSec](https://security.stackexchange.com/questions/tagged/kubernetes).

Хтось зі спільноти може вже ставив схоже питання або може допомогти з вашою проблемою.

Команда Kubernetes також слідкуватиме за [постами з теґом Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes). Якщо немає наявних питань, які можуть допомогти, **будь ласка, переконайтеся, що ваше питання відповідає [правилам Stack Overflow](https://stackoverflow.com/help/on-topic), [Server Fault](https://serverfault.com/help/on-topic) або сайту мережі Stack Exchange, на якому ви його ставите**, і ознайомтеся з інструкцією [як поставити нове питання](https://stackoverflow.com/help/how-to-ask), перед тим як задавати нове!

### Slack {#slack}

Багато людей зі спільноти Kubernetes збираються у Kubernetes Slack в каналі `#kubernetes-users`. Slack вимагає реєстрації; ви можете [запросити запрошення](https://slack.kubernetes.io), і реєстрація відкрита для всіх). Запрошуємо приходити та ставити будь-які питання. Після реєстрації ви отримайте доступ до [організації Kubernetes у Slack](https://kubernetes.slack.com) у вебоглядачі або в застосунку Slack.

Після реєстрації переглядайте список каналів для різних тем. Наприклад, люди, які тільки вчаться Kubernetes, також можуть приєднатися до каналу [`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice). Як ще один приклад, розробникам корисно приєднатися до каналу [`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors).

Також існують багато каналів, специфічних для країн / мов. Запрошуємо приєднатися до цих каналів для локалізованої підтримки та інформації:

{{< table caption="Країна / канал Slack" >}}

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

### Помилки та запитання щодо функціонала {#bugs-and-feature-requests}

Якщо у вас є ознаки помилки або ви хочете подати запит на новий функціонал, будь ласка, скористайтесь [тікетами GitHub](https://github.com/kubernetes/kubernetes/issues).

Перед тим як створити тікет, будь ласка, перегляньте наявні проблеми, щоб переконатися, чи є вже вирішення для вашої проблеми.

Якщо ви подаєте звіт про помилку, будь ласка, включіть детальні відомості про те, як відтворити проблему, таку як:

* Версія Kubernetes: `kubectl version`
* Хмарний провайдер, дистрибутив ОС, конфігурація мережі та версія оточення виконання контейнерів
* Кроки для відтворення проблеми
