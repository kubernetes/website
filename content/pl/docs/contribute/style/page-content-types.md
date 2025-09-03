---
title: Typy treści
content_type: concept
weight: 80
---

<!-- overview -->

Dokumentacja Kubernetesa obejmuje kilka typów treści stron:

- Pojęcia i koncepcje (ang. Concept)
- Zadanie (ang. Task)
- Samouczek (ang. Tutorial)
- Materiały źródłowe (ang. Reference)

<!-- body -->

## Sekcje treści {#content-sections}

Każdy typ strony zawiera szereg sekcji zdefiniowanych przez
komentarze Markdown i nagłówki HTML. Możesz dodać nagłówki
do swojej strony za pomocą kodu `heading`. Komentarze i
nagłówki pomagają utrzymać odpowiednią strukturę strony dla danego typu.

Przykłady komentarzy w Markdown definiujących sekcje strony:

```markdown
<!-- overview -->
```

```markdown
<!-- body -->
```

Aby utworzyć typowe nagłówki na swoich
stronach, użyj kodu `heading` z nazwą nagłówka.

Przykłady nazw nagłówków:

- whatsnext - co dalej
- prerequisites - wymagania wstępne
- objectives - cele
- cleanup - sprzątanie
- synopsis - streszczenie
- seealso - zobacz także
- options - opcje

Na przykład, aby utworzyć nagłówek `whatsnext`, dodaj kod nagłówka z nazwą "whatsnext":

```none
## {{%/* heading "whatsnext" */%}}
```

Możesz zadeklarować nagłówek `prerequisites` w następujący sposób:

```none
## {{%/* heading "prerequisites" */%}}
```

Kod `heading` oczekuje jednego parametru typu
string. Ten parametr nagłówka odpowiada prefiksowi zmiennej
w plikach `i18n/<lang>/<lang>.toml`. Na przykład:

`i18n/en/en.toml`:

```toml
[whatsnext_heading]
other = "What's next"
```

`i18n/ko/ko.toml`:

```toml
[whatsnext_heading]
other = "다음 내용"
```

## Typy zawartości {#content-types}

Każdy typ zawartości nieformalnie definiuje swoją oczekiwaną strukturę
strony. Twórz zawartość strony, korzystając z sugerowanych sekcji strony.

### Pojęcie (ang. Concept) {#concept}

Strona z pojęciami wyjaśnia określony aspekt Kubernetesa. Na
przykład, strona koncepcyjna może opisywać obiekt Deployment w
Kubernetesie i wyjaśniać jego rolę jako aplikacji po wdrożeniu,
skalowaniu i aktualizacji. Zazwyczaj strony koncepcyjne nie
zawierają instrukcji krok po kroku, lecz odsyłają do zadań lub samouczków.

Aby napisać nową stronę z pojęciem, utwórz plik Markdown w
podkatalogu katalogu `/content/en/docs/concepts`, z następującymi sekcjami:

Strony koncepcyjne są podzielone na trzy sekcje:

| Sekcja strony                |
|------------------------------|
| overview - przegląd     |
| body - treść            |
| whatsnext - co dalej    |

Sekcje `overview` i `body` pojawiają się jako komentarze na stronie z
koncepcjami. Możesz dodać sekcję `whatsnext` do swojej strony za pomocą kodu `heading`.

Wypełnij każdą sekcję treścią. Postępuj zgodnie z tymi wytycznymi:

- Organizuj treści za pomocą nagłówków H2 i H3.
- Dla `overview`, ustaw kontekst tematu za pomocą pojedynczego akapitu.
- Dla `body` wyjaśnij koncepcję.
- Dla `whatsnext`, podaj wypunktowaną listę tematów (maksymalnie 5), aby dowiedzieć się więcej o koncepcji.

Strona [adnotacje](/docs/concepts/overview/working-with-objects/annotations/) jest opublikowanym przykładem strony koncepcyjnej.

### Zadanie (ang. Task) {#task}

Strony opisujące wykonywanie zadań zawierają minimum
wyjaśnień, ale zwykle podają odnośniki do
dokumentacji objaśniającej pojęcia i szerszy kontekst danego tematu.

Aby napisać nową stronę zadania, utwórz plik Markdown w
podkatalogu katalogu `/content/en/docs/tasks`, z następującymi sekcjami:

| Sekcja strony                |
|------------------------------|
| overview - przegląd     |
| prerequisites - wymagania wstępne |
| steps - kroki         |
| discussion - dyskusja    |
| whatsnext - co dalej    |

Sekcje `overview`, `steps` i `discussion` pojawiają się jako komentarze
na stronie zadania. Możesz dodać sekcje
`prerequisites` i `whatsnext` do swojej strony za pomocą kodu `heading`.

Każdą sekcję uzupełnij treścią. Użyj następujących wytycznych:

- Użyj nagłówków poziomu H2 lub niższego (z dwoma wiodącymi
  znakami `#`). Sekcje są automatycznie tytułowane przez szablon.
- Dla `overview` użyj akapitu, aby ustawić kontekst dla całego tematu.
- Dla `prerequisites` używaj list punktowanych, kiedy to możliwe. Zaczynaj dodawać dodatkowe
  wymagania wstępne poniżej `include`. Domyślne wymagania wstępne obejmują działający klaster Kubernetesa.
- Dla `steps` używaj numerowanych list.
- Do omówienia użyj standardowej treści, aby rozwinąć
  informacje zawarte w sekcji `steps`.
- Dla `whatsnext`, podaj listę punktowaną z maksymalnie 5 tematami,
  które mogą zainteresować czytelnika jako kolejne tematy do przeczytania.

Przykład opublikowanego tematu zadania to [Korzystanie z proxy HTTP do uzyskania dostępu do API Kubernetesa](/docs/tasks/extend-kubernetes/http-proxy-access-api/).

### Samouczek (ang. Tutorial) {#tutorial}

Strona samouczka pokazuje, jak osiągnąć cel, który jest bardziej złożony
niż pojedyncze zadanie. Zazwyczaj strona samouczka składa się z kilku
sekcji, z których każda zawiera sekwencję kroków. Na przykład samouczek może
przeprowadzać użytkownika przez przykładowy kod ilustrujący określoną
funkcję Kubernetesa. Samouczki mogą zawierać ogólne wyjaśnienia, ale powinny
odsyłać do powiązanych tematów koncepcyjnych w celu dogłębnego omówienia zagadnienia.

Aby napisać nową stronę samouczka, utwórz plik Markdown w
podkatalogu katalogu `/content/en/docs/tutorials`, z następującymi sekcjami:

| Sekcja strony                |
|------------------------------|
| overview - przegląd     |
| prerequisites - wymagania wstępne |
| objectives - cele         |
| lessoncontent - treść lekcji |
| cleanup - sprzątanie    |
| whatsnext - co dalej    |

Sekcje `overview`, `objectives` i `lessoncontent` pojawiają się
jako komentarze na stronie samouczka. Możesz dodać sekcje
`prerequisites`, `cleanup` i `whatsnext` do swojej strony za pomocą kodu `heading`.

Każdą sekcję uzupełnij treścią. Użyj następujących wytycznych:

- Użyj nagłówków poziomu H2 lub niższego (z dwoma wiodącymi
  znakami `#`). Sekcje są automatycznie tytułowane przez szablon.
- Dla `overview` użyj akapitu, aby ustawić kontekst dla całego tematu.
- W przypadku `prerequisites` używaj, jeśli to możliwe, list
  punktowanych. Dodaj dodatkowe wymagania wstępne poniżej tych domyślnie uwzględnionych.
- Dla `objectives`, używaj list wypunktowanych.
- Dla `lessoncontent`, użyj mieszanki list
  numerowanych i treści narracyjnej w zależności od potrzeb.
- W przypadku `cleanup`, użyj numerowanych list, aby opisać
  kroki niezbędne do posprzątania stanu klastra po zakończeniu zadania.
- Dla `whatsnext`, podaj listę punktowaną z maksymalnie 5 tematami,
  które mogą zainteresować czytelnika jako kolejne tematy do przeczytania.

Przykładem opublikowanego tematu samouczka jest
[Uruchamianie aplikacji bezstanowej przy użyciu Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).

### Materiały źródłowe (ang. Reference) {#reference}

Każde narzędzie Kubernetesa ma swoją stronę materiałów źródłowych (ang. reference page), gdzie można znaleźć jego opis i
listę dostępnych opcji. Dokumentacja ta jest generowana przez skrypty, które automatycznie pobierają informacje z poleceń narzędzia.

Strona z odniesieniem do narzędzia ma kilka możliwych sekcji:

| Sekcja strony                 |
|------------------------------|
| streszczenie                 |
| opcje                         |
| opcje z nadrzędnych poleceń |
| przykłady                    |
| zobacz także                  |

Przykłady opublikowanych stron referencyjnych narzędzi to:

- [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/)
- [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
- [kubectl](/docs/reference/kubectl/kubectl/)

## {{% heading "whatsnext" %}}

- Dowiedz się więcej o [Przewodniku stylu](/docs/contribute/style/style-guide/)
- Dowiedz się więcej o [Przewodniku treści](/docs/contribute/style/content-guide/)
- Dowiedz się więcej o [organizacji treści](/docs/contribute/style/content-organization/)
