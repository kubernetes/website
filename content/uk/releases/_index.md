---
linktitle: Історія випусків
title: Випуски
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

Проєкт Kubernetes підтримує гілки випусків для трьох останніх мінорних випусків ({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}). Kubernetes 1.19 та новіші отримують [приблизно 1 рік патч-підтримки](/releases/patch-releases/#support-period). Kubernetes 1.18 та старіші отримували патчі приблизно впродовж 9 місяців.

Версії Kubernetes зазначаються у вигляді **x.y.z**, де **x** — номер головної версії, **y** — мінорна версія, а **z** — версія патча, відповідно до термінології [Semantic Versioning](https://semver.org/).

Докладніше про політику розбіжностей між версіями у документі — [Політика версійної розбіжності](/releases/version-skew-policy/).

<!-- body -->

## Історія випусків {#release-history}

{{< release-data >}}

## Випуски, підтримку яких завершено {#end-of-life-releases}

Нижче наведено перелік старих випусків Kubernetes, підтримка яких більше не здійснюється.

<details>
  <summary>Випуски, підтримку яких завершено</summary>
  {{< note >}}
  Ці випуски більше не підтримуються й не отримують оновлень безпеки та виправлень помилок.
  Якщо ви використовуєте один із цих випусків, проєкт Kubernetes наполегливо рекомендує оновитися до [підтримуваної версії](#release-history).
  {{< /note >}}
  
  {{< eol-releases >}}
</details>

## Майбутній випуск {#upcoming-release}

Ознайомтесь з [графіком](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}}) виходу майбутнього випуску **{{< skew nextMinorVersion >}}** Kubernetes!

{{< note >}}
Це посилання на графік може бути тимчасово недоступним на ранніх етапах планування випуску.  
Найновіші оновлення дивіться в [репозиторії SIG Release](https://github.com/kubernetes/sig-release/tree/master/releases).
{{< /note >}}

## Додаткові ресурси {#helpful-resources}

Зверніться до [ресурсів команди випуску Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team) для ключової інформації про ролі та процес випуску.
