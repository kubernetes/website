---
title: Zarządzanie obiektami Kubernetesa
content_type: concept
weight: 20
---

<!-- overview -->
Narzędzie wiersza poleceń `kubectl` obsługuje kilka różnych sposobów tworzenia i
zarządzania {{< glossary_tooltip text="obiektami" term_id="object" >}} Kubernetesa. Ten dokument
zawiera przegląd różnych podejść. Przeczytaj [Księgę Kubectl](https://kubectl.docs.kubernetes.io)
aby uzyskać szczegółowe informacje na temat zarządzania obiektami za pomocą Kubectl.

<!-- body -->

## Techniki zarządzania {#management-techniques}

{{< warning >}}
Obiekt Kubernetesa powinien być zarządzany tylko jedną metodą. Mieszanie i
dopasowywanie różnych metod dla tego samego obiektu prowadzi do nieokreślonego zachowania.
{{< /warning >}}

| Technika zarządzania           | Działa na                | Rekomendowane środowisko | Obsługiwani autorzy | Krzywa uczenia się |
|----------------------------------|----------------------|------------------------|--------------------|----------------|
| Polecenia imperatywne             | Obiekty na żywo       | Projekty rozwojowe    | 1+                 | Najniższy       |
| Imperatywna konfiguracja obiektów  | Pojedyncze pliki     | Projekty produkcyjne    | 1                  | Umiarkowane       |
| Deklaratywna konfiguracja obiektów | Katalogi plików | Projekty produkcyjne | 1+ | Najwyższy |

## Polecenia imperatywne {#imperative-commands}

Podczas korzystania z poleceń imperatywnych, użytkownik operuje bezpośrednio
na obiektach działających w klastrze. Użytkownik
dostarcza operacje do polecenia `kubectl` jako argumenty lub flagi.

To jest zalecany sposób rozpoczęcia pracy lub uruchomienia
jednorazowego zadania w klastrze. Ponieważ ta technika działa bezpośrednio
na żywych obiektach, nie zapewnia historii wcześniejszych konfiguracji.

### Przykłady {#examples}

Uruchom instancję kontenera nginx, tworząc obiekt Deployment:

```sh
kubectl create deployment nginx --image nginx
```

### Kompromisy {#trade-offs}

Zalety w porównaniu do konfiguracji obiektów:

- Polecenia są wyrażane jako pojedyncze słowo akcji.
- Polecenia wymagają tylko jednego kroku, aby wprowadzić zmiany w klastrze.

Wady w porównaniu do konfiguracji obiektów:

- Polecenia nie integrują się z procesami przeglądu zmian.
- Polecenia nie zapewniają śladu audytu związanego ze zmianami.
- Polecenia nie dostarczają źródła zapisów poza tym, co jest aktywne.
- Polecenia nie zapewniają szablonu do tworzenia nowych obiektów.

## Imperatywna konfiguracja obiektów {#imperative-object-configuration}

W trybie imperatywnej konfiguracji obiektów polecenie
kubectl określa operację (np. create, replace), opcjonalne flagi
oraz co najmniej jedną nazwę pliku. Podany plik
musi zawierać pełną definicję obiektu w formacie YAML lub JSON.

Zobacz [dokumentację API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/),
aby uzyskać więcej szczegółów na temat definicji obiektów.

{{< warning >}}
Polecenie imperatywne `replace` zastępuje istniejącą specyfikację nowo dostarczoną,
porzucając wszystkie zmiany obiektu, których nie ma w
pliku konfiguracyjnym. Takie podejście nie powinno być stosowane w
przypadku typów zasobów, których specyfikacje są aktualizowane niezależnie
od pliku konfiguracyjnego. Usługi typu `LoadBalancer`, na przykład,
mają pole `externalIPs` aktualizowane niezależnie od konfiguracji przez klaster.
{{< /warning >}}

### Przykłady {#examples}

Utwórz obiekty zdefiniowane w pliku konfiguracyjnym:

```sh
kubectl create -f nginx.yaml
```

Usuń obiekty zdefiniowane w dwóch plikach konfiguracyjnych:

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

Zaktualizuj obiekty zdefiniowane w pliku
konfiguracyjnym poprzez nadpisanie aktualnej konfiguracji:

```sh
kubectl replace -f nginx.yaml
```

### Kompromisy {#trade-offs}

Zalety w porównaniu z komendami imperatywnymi:

- Konfiguracja obiektów może być przechowywana w systemie kontroli wersji, takim jak Git.
- Konfiguracja obiektów może być zintegrowana z procesami takimi jak przeglądanie zmian przed ich wprowadzeniem oraz ścieżki audytu.
- Konfiguracja obiektu dostarcza szablon do tworzenia nowych obiektów.

Wady w porównaniu do poleceń imperatywnych:

- Konfiguracja obiektu wymaga podstawowego zrozumienia schematu obiektu.
- Konfiguracja obiektu wymaga dodatkowego kroku w postaci napisania pliku YAML.

Zalety w porównaniu do deklaratywnej konfiguracji obiektów:

- Zachowanie imperatywnej konfiguracji obiektów jest prostsze i łatwiejsze do zrozumienia.
- Od wersji Kubernetes 1.5, imperatywna konfiguracja obiektów jest bardziej rozwinięta.

Wady w porównaniu do deklaratywnej konfiguracji obiektów:

- Imperatywna konfiguracja obiektów działa najlepiej na plikach, a nie na katalogach.
- Wszelkie aktualizacje obiektów w systemie muszą być przeniesione do plików konfiguracyjnych, inaczej zostaną utracone podczas następnej operacji replace.

## Deklaratywna konfiguracja obiektów {#declarative-object-configuration}

Podczas korzystania z deklaratywnej konfiguracji obiektów, użytkownik operuje na
plikach konfiguracyjnych obiektów przechowywanych lokalnie, jednakże użytkownik nie
definiuje operacji do wykonania na tych plikach. Operacje tworzenia, aktualizacji i
usuwania są automatycznie wykrywane dla każdego obiektu przez `kubectl`. Dzięki
temu można pracować na całych katalogach, w których różne obiekty wymagają różnych operacji.

{{< note >}}
Deklaratywna konfiguracja obiektów zachowuje zmiany wprowadzone
przez innych autorów, nawet jeśli te zmiany nie zostaną scalone z
plikiem konfiguracyjnym obiektu. Jest to możliwe dzięki użyciu operacji API
`patch` do zapisywania jedynie zaobserwowanych różnic, zamiast używania
operacji API `replace` do zastąpienia całej konfiguracji obiektu.
{{< /note >}}

### Przykłady {#examples}

Przetwórz wszystkie pliki konfiguracyjne obiektów w katalogu `configs`, a
następnie utwórz lub zastusuj zmiany do obiektów istniejących w systemie. Możesz
najpierw użyć `diff`, aby zobaczyć, jakie zmiany zostaną wprowadzone, a następnie zastosować:

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

Rekursywne przetwarzanie katalogów:

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

### Kompromisy {#trade-offs}

Zalety w porównaniu z imperatywną konfiguracją obiektów:

- Zmiany wprowadzone bezpośrednio do obiektów działających są zachowywane, nawet jeśli nie zostaną scalone z plikami konfiguracyjnymi.
- Deklaratywna konfiguracja obiektów lepiej wspiera operacje na katalogach i automatyczne wykrywanie typów operacji (tworzenie, łatanie, usuwanie) dla każdego obiektu.

Wady w porównaniu z imperatywną konfiguracją obiektów:

- Konfiguracja obiektów deklaratywnych jest trudniejsza do debugowania i zrozumienia wyników w sytuacjach nieoczekiwanych.
- Częściowe aktualizacje przy użyciu różnic tworzą złożone operacje scalania i łatania.

## {{% heading "whatsnext" %}}

- [Zarządzanie obiektami Kubernetesa za pomocą komend imperatywnych](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Imperatywne zarządzanie obiektami Kubernetesa za pomocą plików konfiguracyjnych](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Deklaratywne zarządzanie obiektami Kubernetesa przy użyciu plików konfiguracyjnych](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Deklaracyjne zarządzanie obiektami Kubernetesa za pomocą Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Dokumentacja poleceń Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
- [Książka o Kubectl](https://kubectl.docs.kubernetes.io)
- [Dokumentacja API Kubernetesa](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

