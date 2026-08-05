---
linktitle: История релизов
title: Релизы
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

Проект Kubernetes поддерживает ветки с релизами для трёх последних минорных версий
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 и более новые версии поддерживаются патч-релизами на протяжении
[примерно одного года](/releases/patch-releases/#support-period).
Kubernetes 1.18 и более старые версии поддерживаются патч-релизами около 9 месяцев.

Версии Kubernetes обозначаются как **x.y.z**,
где **x** — это мажорная (major) версия, **y** — минорная (minor), а **z** — патч-версия 
(patch), в соответствии с терминологией [семантического версионирования](https://semver.org/lang/ru/).

Больше информации можно найти в документе [Version Skew Policy](/releases/version-skew-policy/).

<!-- body -->

## История релизов

{{< release-data >}}

## Следующий релиз

Смотрите [план](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
по следующему релизу Kubernetes — **{{< skew nextMinorVersion >}}**.

## Полезные ресурсы

В документе [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
можно найти основную информацию о ролях людей, задействованных в подготовке релизов, и процессе их выпуска.
