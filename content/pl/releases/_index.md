---
linktitle: Historia wydań
title: Wydania
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

Projekt Kubernetes zapewnia wsparcie dla trzech ostatnich wydań _minor_ 
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Poprawki do wydania 1.19 i nowszych [będą publikowane przez około rok](/releases/patch-releases/#support-period).
Kubernetes w wersji 1.18 i wcześniejszych otrzymywał poprawki przez 9 miesięcy.


Wersje Kubernetesa oznaczane są jako **x.y.z**,
gdzie **x** jest oznaczeniem wersji głównej (_major_), **y** — podwersji (_minor_), a **z** — numer poprawki (_patch_),
zgodnie z terminologią [Semantic Versioning](https://semver.org/).

Więcej informacji można z znaleźć w dokumencie [version skew policy](/releases/version-skew-policy/).

<!-- body -->

## Historia wydań {#release-history}

{{< release-data >}}

## Wersje, które osiągnęły koniec wsparcia {#end-of-life-releases}

Poniżej znajdują się starsze wersje Kubernetesa, które nie są już utrzymywane.

<details>
  <summary>Wersje o zakończonym cyklu życia</summary>
  {{< note >}}
  Te wersje nie są już wspierane i nie otrzymują aktualizacji zabezpieczeń ani poprawek błędów. Jeśli używasz
  jednej z tych wersji, projekt Kubernetes stanowczo zaleca uaktualnienie do [wspieranej wersji](#release-history).
  {{< /note >}}

{{< eol-releases >}}
</details>

## Nadchodzące wydania {#upcoming-release}

Zajrzyj na [harmonogram](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
nadchodzącego wydania Kubernetesa numer **{{< skew nextMinorVersion >}}**!

{{< note >}}
Ten link do harmonogramu może być tymczasowo niedostępny podczas wczesnych faz planowania wydania. Sprawdź
[SIG Release repository](https://github.com/kubernetes/sig-release/tree/master/releases) aby uzyskać informacje o najnowszych aktualizacjach.
{{< /note >}}

## Przydatne zasoby {#helpful-resources}

Zajrzyj do zasobów zespołu [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
w celu uzyskania kluczowych informacji na temat ról i procesu wydawania wersji.
