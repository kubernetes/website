---
title: Przewodnik treści
linktitle: Przewodnik treści
content_type: concept
weight: 10
---

<!-- overview -->

Ta strona zawiera wytyczne dotyczące dokumentacji Kubernetes.

Jeśli masz pytania dotyczące tego, co jest dozwolone, dołącz do
kanału #sig-docs w [Kubernetes Slack](https://slack.k8s.io/) i zapytaj!

Możesz zarejestrować się na Kubernetes Slack pod adresem https://slack.k8s.io/.

Aby uzyskać informacje na temat tworzenia nowych treści do dokumentacji
Kubernetes, postępuj zgodnie z [przewodnikiem stylu](/docs/contribute/style/style-guide).

<!-- body -->

## Przegląd {#overview}

Źródło dla strony internetowej Kubernetes, w tym dokumentacji, znajduje
się w repozytorium [kubernetes/website](https://github.com/kubernetes/website).

Znajdująca się w folderze `kubernetes/website/content/<language_code>/docs`,
większość dokumentacji Kubernetes jest specyficzna
dla [projektu Kubernetes](https://github.com/kubernetes/kubernetes).

## Co jest dozwolone {#whats-allowed}

Dokumentacja Kubernetes akceptuje materiały o projektach firm trzecich tylko pod warunkiem, że:

- Zawartość dokumentuje oprogramowanie w projekcie Kubernetes
- Zawartość dokumentuje oprogramowanie, które znajduje się poza projektem, ale jest niezbędne do działania Kubernetes.
- Treści są kanoniczne na kubernetes.io lub odsyłają do kanonicznych treści w innym miejscu

### Treści firm trzecich {#third-party-content}

Dokumentacja Kubernetes zawiera zastosowane przykłady projektów w projekcie
Kubernetes&mdash;projektów znajdujących się w organizacjach GitHub
[kubernetes](https://github.com/kubernetes) i [kubernetes-sigs](https://github.com/kubernetes-sigs).

Linki do aktywnej zawartości w projekcie Kubernetes są zawsze dozwolone.

Kubernetes wymaga pewnych zewnętrznych treści, aby działać. Przykłady obejmują środowiska
uruchomieniowe kontenerów (containerd, CRI-O, Docker), [zasady sieciowe](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
(wtyczki CNI),
[kontrolery Ingress](/docs/concepts/services-networking/ingress-controllers/) oraz [logowanie](/docs/concepts/cluster-administration/logging/).

Dokumentacja może odnosić się do zewnętrznego oprogramowania open source (OSS)
spoza projektu Kubernetes tylko wtedy, gdy jest to niezbędne do działania Kubernetes.

### Zduplikowane treści {#dual-sourced-content}

W miarę możliwości dokumentacja Kubernetes odsyła do
kanonicznych źródeł zamiast hostować zduplikowaną treść.

Zduplikowana treść wymaga podwójnego wysiłku (lub
więcej!) do utrzymania i szybciej staje się nieaktualna.

{{< note >}}
Jeśli jesteś opiekunem projektu Kubernetes i potrzebujesz pomocy w hostowaniu własnej dokumentacji, poproś
o pomoc na [#sig-docs na Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/).
{{< /note >}}

### Więcej informacji {#more-information}

Jeśli masz pytania dotyczące dozwolonej treści, dołącz do kanału [Kubernetes Slack](https://slack.k8s.io/) #sig-docs i zapytaj!

## {{% heading "whatsnext" %}}

* Przeczytaj [Przewodnik stylu](/docs/contribute/style/style-guide).
