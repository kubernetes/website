---
linktitle: Історія випусків
title: Випуски
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

Проєкт Kubernetes підтримує гілки випусків для трьох останніх мінорних випусків ({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}). Kubernetes 1.19 та новіші отримують [приблизно 1 рік патчі підтримки](/releases/patch-releases/#support-period). Kubernetes 1.18 та старіші отримували патчі приблизно впродовж 9 місяців.

Версії Kubernetes зазначаються у вигляді **x.y.z**, де

- **x** — номер головної версії,
- **y** — мінорна версія, а
- **z** — версія патча, відповідно до термінології [Semantic Versioning](https://semver.org/lang/uk/).

Докладніше про політику розбіжностей між версіями у документі — [Політика версійної розбіжності](/releases/version-skew-policy/).

<!-- body -->

## Історія випусків {#release-history}

{{< release-data >}}

## Випуски, термін підтримки яких закінчився {#end-of-life-releases}

Нижче наведено перелік старих випусків Kubernetes, підтримка яких більше не здійснюється.

<details>
  <summary>Випуски, термін підтримки яких закінчився</summary>
  {{< note >}}
  Ці версії більше не підтримуються і не отримують оновлень безпеки та виправлень помилок. Якщо ви використовуєте одну з цих версій, проєкт Kubernetes наполегливо рекомендує перейти на [підтримувану версію](#release-history).
  {{< /note >}}

  {{< eol-releases >}}
</details>

## Майбутні випуски {#upcoming-releases}

Ознайомтесь з [графіком](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}}) виходу майбутнього випуску **{{< skew nextMinorVersion >}}** Kubernetes!

{{< note >}}
Цей посилання на графік може бути тимчасово недоступним на ранніх етапах планування випуску. Перевіряйте [репозиторій випусків SIG](https://github.com/kubernetes/sig-release/tree/master/releases) для отримання останніх оновлень.
{{< /note >}}

## Додаткові ресурси {#helpful-resources}

Зверніться до [ресурсів команди випуску Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team) для ключової інформації про ролі та процес випуску.
