---
title: Adnotatcje
content_type: concept
weight: 60
---

<!-- overview -->
Możesz używać Kubernetesowych adnotacji do dołączania dodatkowych (czyli takich,
które nie są wykorzystywane przy identyfikacji) metadanych do
{{< glossary_tooltip text="obiektów" term_id="object" >}}. Narzędzia i biblioteki mogą odczytywać te metadane.

<!-- body -->
## Dołączanie metadanych do obiektów {#attaching-metadata-to-objects}

Możesz używać etykiet (ang. labels) lub adnotacji (ang. annotations), aby dołączać
metadane do obiektów Kubernetesa. Etykiety pomagają w
wybieraniu obiektów i wyszukiwaniu ich zbiorów na podstawie określonych warunków.
Z kolei adnotacje nie są używane do identyfikacji ani selekcji obiektów.
Metadane w adnotacjach mogą mieć dowolny rozmiar i strukturę - mogą być
małe lub duże, uporządkowane lub nie, i zawierać znaki niedozwolone w
etykietach. Dopuszczalne jest jednoczesne użycie etykiet i adnotacji w tym samym obiekcie.

Adnotacje, podobnie jak etykiety, są mapami klucz/wartość:

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

{{<note>}}
Klucze i wartości w mapie muszą być ciągami znaków. Innymi słowy, nie można używać
wartości numerycznych, logicznych, list ani innych typów ani dla kluczy, ani dla wartości.
{{</note>}}

Oto przykłady informacji, które mogą być zapisane w adnotacjach:

* Pola zarządzane przez warstwę konfiguracji deklaratywnej. Dołączanie tych
  pól jako adnotacji odróżnia je od wartości domyślnych ustawianych przez
  klientów lub serwery, oraz od pól generowanych automatycznie i pól ustawianych
  przez systemy automatycznego skalowania lub automatycznego dopasowywania rozmiaru.

* Informacje dotyczące kompilacji, wersji lub obrazów, takie jak znaczniki
  czasu, identyfikatory wersji, gałąź git, numery PR, skróty obrazów i adres rejestru.

* Referencje do zewnętrznych źródeł danych takich jak logi, metryki monitorujące, wyniki analiz czy dane audytowe.

* Informacje o bibliotece klienckiej lub narzędziu, które mogą być
  wykorzystane do debugowania - na przykład nazwa, wersja i dane o kompilacji.

* Informacje o pochodzeniu użytkownika, narzędzia lub systemu,
  takie jak adresy URL powiązanych obiektów z innych komponentów ekosystemu.

* Metadane wykorzystywane przez proste narzędzia do wdrażania zmian (rollout), takie jak zapis stanu konfiguracji lub punktów kontrolnych służących do śledzenia postępu wdrożenia.

* Numery telefonów lub pagerów osób odpowiedzialnych, lub wpisy do katalogu
  określające, gdzie można znaleźć te informacje, takie jak strona internetowa zespołu.

* Instrukcje od użytkownika końcowego kierowane do implementacji, mające
  na celu zmianę zachowania systemu lub uruchomienie niestandardowych funkcji.

Zamiast używać adnotacji, można przechowywać tego typu
informacje w zewnętrznej bazie danych lub katalogu, ale to znacznie utrudniłoby
tworzenie wspólnych bibliotek klienckich i
narzędzi do wdrażania, zarządzania, introspekcji i tym podobnych działań.

## Składnia i zestaw znaków {#syntax-and-character-set}

_Adnotacje_ są parami klucz/wartość. Prawidłowe klucze adnotacji mają dwa segmenty: opcjonalny prefiks oraz nazwę, oddzielone ukośnikiem (`/`). Segment nazwy jest wymagany i musi mieć maksymalnie 63 znaki, zaczynać się i kończyć znakiem alfanumerycznym (`[a-z0-9A-Z]`) oraz może zawierać myślniki (`-`), podkreślenia (`_`), kropki (`.`) i znaki alfanumeryczne pomiędzy nimi. Prefiks jest opcjonalny. Jeśli zostanie określony, prefiks musi być subdomeną DNS: serią etykiet DNS oddzielonych kropkami (`.`), nie dłuższą w sumie niż 253 znaki, zakończoną ukośnikiem (`/`).

Jeśli prefiks jest pominięty, zakłada się, że klucz adnotacji należy wyłącznie do użytkownika. Zautomatyzowane komponenty systemowe (np. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl` lub inna automatyzacja firm trzecich), które dodają adnotacje do obiektów końcowego użytkownika, muszą określić prefiks.

Prefiksy `kubernetes.io/` i `k8s.io/` są zarezerwowane dla podstawowych komponentów Kubernetesa.

Na przykład, oto manifest dla Poda, który posiada adnotację `imageregistry: https://hub.docker.com/` :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## {{% heading "whatsnext" %}}

- Dowiedz się więcej o [Etykietach i Selektorach](/docs/concepts/overview/working-with-objects/labels/).
- Znajdź [Typowe etykiety, Adnotacje i Tainty (ang. Taints)](/docs/reference/labels-annotations-taints/)
