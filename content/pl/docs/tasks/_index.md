---
title: Zadania
main_menu: true
weight: 50
content_template: templates/concept
---

{{< toc >}}

{{% capture overview %}}

W tej części dokumentacji Kubernetesa znajdują się opisy
sposobu realizacji różnych zadań. Przedstawione są one zazwyczaj jako
krótka sekwencja kilku kroków związanych z pojedynczym zadaniem.

{{% /capture %}}

{{% capture body %}}

## Graficzny interfejs użytkownika _(Dashboard)_

Instalacja i użycie graficznego interfejsu użytkownika z poziomu przeglądarki do zarządzania aplikacjami w kontenerach uruchomionymi na klastrze Kubernetes.

## Jak używać polecenia kubectl

Instalacja i konfiguracja polecenia `kubectl` do bezpośredniego zarządzania klastrami Kubernetes.

## Konfigurowanie podów i kontenerów

Najpopularniejsze czynności związane z konfiguracją podów i kontenerów.

## Uruchamianie aplikacji

Standardowe metody zarządzania aplikacjami, m. in. prowadzenie stopniowych aktualizacji _(rolling updates)_, przekazywanie konfiguracji oraz skalowanie horyzontalne podów.

## Uruchamianie zadań

Uruchamianie zadań w trybie równoległym.

## Dostęp do aplikacji na klastrze

Rozkładanie obciążenia i przekierowywanie ruchu sieciowego, konfigurowanie firewalla i usług DNS w celu zapewnienia dostępu do aplikacji w klastrze.

## Monitoring, rejestracja i znajdowanie błędów

Konfigurowanie monitoringu oraz rejestrowanie zdarzeń i komunikatów, pomagające rozwiązywać problemy związane z pracą klastra lub aplikacji uruchamianych w kontenerach.

## Dostęp do API Kubernetes

Różne metody bezpośredniego dostępu do API Kubernetes.

## Używanie TLS

Konfigurowanie aplikacji w taki sposób, aby korzystała i ufała łańcuchowi certyfikatów wydawanych przez Urząd Certyfikacji (CA) klastra.

## Administracja klastrem

Standardowe metody zarządzania klasterem.

## Zarządzanie aplikacjami ze stanem (_Stateful_)

Popularne zadania związane z zarządzaniem aplikacjami stanowymi _(Stateful)_, w tym: skalowanie, usuwanie i rozwiązywanie problemów dotyczących _StatefulSets_.

## Procesy klastra typu _daemon_

Standardowe metody zarządzania _DaemonSet_, włączając sposoby prowadzenia stopniowej aktualizacji (_rolling update_).

## Zarządzanie procesorami graficznymi (GPU)

Konfiguracja i przydzielanie węzłom klastra procesorów GPU NVIDIA jako zasobów.

## Zarządzanie HugePages

Konfiguracja i dysponowanie _huge pages_ jako zasobu klastra.

{{% /capture %}}

{{% capture whatsnext %}}

Jeśli chciałbyś stworzyć nową stronę poświęconą jakiemuś zadaniu, przeczytaj
[Jak przygotować propozycję zmian (PR)](/docs/home/contribute/create-pull-request/).

{{% /capture %}}
