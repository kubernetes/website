---
title: Менеджери випусків
type: docs
weight: 40
---

"Менеджери Випусків" — це загальний термін, що охоплює групу учасників Kubernetes, відповідальних
за підтримку гілок випусків та створення випусків, використовуючи інструменти, надані SIG Release.

Обовʼязки кожної ролі описані нижче.

- [Контакти](#contact)
  - [Політика закритості за для безпеки](#security-embargo-policy)
- [Довідники](#handbooks)
- [Менеджери випусків](#release-managers)
  - [Як стати менеджером випусків](#becoming-a-release-manager)
- [Асистенти менеджерів випусків](#release-manager-associates)
  - [Як стати асистентом менеджера випусків](#becoming-a-release-manager-associate)
- [Лідери SIG Release](#sig-release-leads)
  - [Голови](#chairs)
  - [Технічні лідери](#technical-leads)

## Контакти {#contact}

| Список Розсилки | Slack | Видимість | Використання | Членство |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (канал) / @release-managers (група користувачів) | Публічний | Публічні обговорення для Менеджерів Випусків | Усі Менеджери Випусків (включаючи Асистентів та Голов SIG) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Приватний | Приватні обговорення для привілейованих Менеджерів Випусків | Менеджери Випусків, лідерство SIG Release |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (канал) / @security-rel-team (група користувачів) | Приватний | Координація безпеки випусків з Комітетом з Відповіді на Безпеку | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### Політика закритості за для безпеки {#security-embargo-policy}

Деяка інформація про випуски підлягає закритості, і ми визначили політику щодо того, як ці обмеження встановлюються. Будь ласка, зверніться до [Політики закритості за для безпеки](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy) для отримання додаткової інформації.

## Довідники {#handbooks}

**Примітка: Довідники для Команди Патч-Випусків та Менеджерів Гілок будуть уніфіковані пізніше.**

- [Команда Патч-Випусків][handbook-patch-release]
- [Менеджери Гілок][handbook-branch-mgmt]

## Менеджери випусків {#release-managers}

**Примітка:** У документації можуть згадуватися Команда Патч-Випусків та роль Менеджера Гілок. Ці дві ролі були обʼєднані у роль Менеджерів Випусків.

Мінімальні вимоги до Менеджерів Випусків та Асистентів Менеджерів Випусків:

- Знайомство з основними командами Unix та здатність налагоджувати shell скрипти.
- Знайомство з розгалуженими робочими процесами з кодом в `git` та відповідними командами командного рядка `git`.
- Загальні знання про Google Cloud (Cloud Build та Cloud Storage).
- Готовність звертатися за допомогою та чітко спілкуватися.
- Членство в спільноті Kubernetes [membership][community-membership]

Менеджери Випусків відповідають за:

- Координацію та проведення випусків Kubernetes:
  - Патч-випуски (`x.y.z`, де `z` > 0)
  - Мінорні випуски (`x.y.z`, де `z` = 0)
  - Попередні випуски (alpha, beta та реліз-кандидати)
  - Роботу з [Командою Випуску][release-team] протягом кожного циклу випуску
  - Встановлення [графіку та періодичності патч-випусків][patches]
- Підтримку гілок випусків:
  - Перегляд cherry picks
  - Забезпечення справності гілки випуску та недопущення непередбачених патчів
- Наставництво для [групи Асистентів Менеджерів Випусків](#асистенти-менеджерів-випусків)
- Активну розробку функцій та підтримку коду в k/release
- Підтримку Асистентів Менеджерів Випусків та учасників через активну участь у програмі наставництва
  - Щомісячні перевірки з Асистентами та делегування завдань, надання можливості їм проводити
    випуски та наставництво
  - Бути доступним для підтримки Асистентів у інтеграції нових учасників, наприклад, відповідаючи на питання та пропонуючи відповідні завдання для них

Ця команда іноді працює у тісному контакті з [Security Response Committee][src] і тому повинна дотримуватися рекомендацій, викладених у [Процесі Безпеки Випуску][security-release-process].

Контроль доступу GitHub: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

Посилання на GitHub: @kubernetes/release-engineering

- [Adolfo García Veytia] ([@puerco](https://github.com/puerco))
- [Cici Huang] ([@cici37](https://github.com/cici37))
- [Carlos Panato] ([@cpanato](https://github.com/cpanato))
- [Jeremy Rickard] ([@jeremyrickard](https://github.com/jeremyrickard))
- [Marko Mudrinić] ([@xmudrii](https://github.com/xmudrii))
- [Nabarun Pal] ([@palnabarun](https://github.com/palnabarun))
- [Sascha Grunert] ([@saschagrunert](https://github.com/saschagrunert))
- [Stephen Augustus] ([@justaugustus](https://github.com/justaugustus))
- [Verónica López] ([@verolop](https://github.com/verolop))

### Як стати менеджером випусків {#becoming-a-release-manager}

Щоб стати Менеджером Випусків, необхідно спочатку бути Асистентом Менеджера Випусків. Асистенти переходять до ролі Менеджера Випусків, активно працюючи над випусками протягом кількох циклів та:

- демонструючи готовність до лідерства
- працюючи разом з Менеджерами Випусків над патчами, щоб у результаті провести випуск самостійно
  - оскільки випуски мають обмежувальну функцію, ми також розглядаємо значні внески у просування образів та інші основні завдання Інженерії Випусків
- ставлячи питання про роботу Асистентів, пропонуючи покращення, збираючи відгуки та впроваджуючи зміни
- будучи надійними та відповідальними
- займаючись складними завданнями, які вимагають доступу та привілеїв рівня Менеджера Випусків для завершення

## Асистенти менеджерів випусків {#release-manager-associates}

Асистенти Менеджерів Випусків є стажерами Менеджерів Випусків, раніше відомими як тіні Менеджерів Випусків. Вони відповідають за:

- Роботу над патч-випусками, перегляд cherry picks
- Внесок у k/release: оновлення залежностей та ознайомлення з кодовою базою
- Внесок у документацію: підтримку довідників, забезпечення документування процесів випуску
- За допомогою Менеджера Випусків: роботу з Командою Випуску протягом циклу випуску та проведення випусків Kubernetes
- Пошук можливостей для допомоги у пріоритизації та комунікації
  - Надсилання попередніх оголошень та оновлень про патч-випуски
  - Оновлення календаря, допомога з датами випуску та віхами з [графіку циклу випуску][k-sig-release-releases]
- Через програму Buddy, інтеграція нових учасників та співпраця з ними над завданнями

Посилання на GitHub: @kubernetes/release-engineering

- [Arnaud Meukam] ([@ameukam](https://github.com/ameukam))
- [Jim Angel] ([@jimangel](https://github.com/jimangel))
- [Joseph Sandoval] ([@jrsapi](https://github.com/jrsapi))
- [Xander Grzywinski] ([@salaxander](https://github.com/salaxander))

### Як стати асистентом менеджера випусків {#becoming-a-release-manager-associate}

Учасники можуть стати Асистентами, демонструючи наступне:

- послідовну участь, включаючи 6-12 місяців активної роботи, повʼязаної з інженерною роботою, повʼязаною з випусками
- досвід виконання ролі технічного лідера у Команді Випуску протягом циклу випуску
  - цей досвід надає міцну базу для розуміння роботи SIG Release загалом — включаючи наші очікування щодо технічних навичок, комунікацій/відповідальності та надійності
- роботу над завданнями k/release, що покращують взаємодію з Testgrid, очищення бібліотек тощо
  - ці зусилля вимагають взаємодії та співпраці з Менеджерами Випусків та Асистентами

## Лідери SIG Release {#sig-release-leads}

Голови та Технічні Лідери SIG Release відповідають за:

- Управління SIG Release
- Проведення сесій обміну знаннями для Менеджерів Випусків та Асистентів
- Наставництво з питань лідерства та пріоритизації

Вони згадуються тут, оскільки є власниками різних каналів спілкування та груп дозволів (команди GitHub, доступ GCP) для кожної ролі. Таким чином, вони є високопривілейованими членами спільноти та мають доступ до деяких приватних комунікацій, які іноді можуть стосуватися розголошення безпеки Kubernetes.

Команда GitHub: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### Голови {#chairs}

- [Jeremy Rickard] ([@jeremyrickard](https://github.com/jeremyrickard))
- [Sascha Grunert] ([@saschagrunert](https://github.com/saschagrunert))
- [Stephen Augustus] ([@justaugustus](https://github.com/justaugustus))

### Технічні Лідери {#technical-leads}

- [Adolfo García Veytia] ([@puerco](https://github.com/puerco))
- [Carlos Panato] ([@cpanato](https://github.com/cpanato))
- [Verónica López] ([@verolop](https://github.com/verolop))

---

Колишніх Менеджерів Гілок можна знайти в [теці releases][k-sig-release-releases] репозиторію kubernetes/sig-release у файлах `release-x.y/release_team.md`.

Приклад: [Команда Випуску 1.15](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
