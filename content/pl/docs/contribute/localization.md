---
title: Tłumaczenie i adaptacja językowa dokumentacji Kubernetes
content_type: concept
weight: 50
card:
  name: contribute
  weight: 50
  title: Lokalizacowanie dokumentacji
---




<!-- overview -->

Ta strona pokazuje, jak
[zlokalizować](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/) dokumentację
na inny język.

<!-- body -->

## Kontrybucja do istniejącej lokalizacji {#contribute-to-an-existing-localization}

Możesz pomóc w dodaniu lub poprawieniu treści istniejącej
lokalizacji. W [Kubernetes Slack](https://slack.k8s.io/), możesz
znaleźć kanał dla każdej lokalizacji. Istnieje również ogólny
[kanal Slack dla lokalizacji dokumentacji SIG](https://kubernetes.slack.com/messages/sig-docs-localizations),
gdzie możesz się przywitać.

{{< note >}}
Aby uzyskać dodatkowe szczegóły dotyczące kontrybucji do
konkretnej lokalizacji, poszukaj zlokalizowanej wersji tej strony.
{{< /note >}}

### Znajdź swój dwuliterowy kod języka {#find-your-two-letter-language-code}

Najpierw zapoznaj się ze [standardem ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php)
w
celu znalezienia dwuliterowego kodu języka dla
lokalizacji. Na przykład dwuliterowy kod dla języka polskiego to `pl`.

Niektóre języki używają małej wersji kodu kraju, jak
zdefiniowano w ISO-3166, wraz z ich kodami językowymi. Na
przykład kod języka portugalskiego (brazylijskiego) to `pt-br`.

### Zrób fork i clone na repozytorium {#fork-and-clone-the-repo}

Najpierw, [utwórz własny fork](/docs/contribute/new-content/open-a-pr/#fork-the-repo)
repozytorium [kubernetes/website](https://github.com/kubernetes/website).

Następnie, sklonuj swój fork i przejdź do niego za pomocą `cd`:

```shell
git clone https://github.com/<nazwa-użytkownika>/website
cd website
```

Katalog zawartości witryny zawiera podkatalogi dla każdego języka.
Lokalizacja, przy której chcesz pomóc, znajduje się w `content/<kod-dwuliterowy>`.

### Zaproponuj zmiany {#suggest-changes}

Stwórz lub zaktualizuj wybraną przez Ciebie zlokalizowaną stronę na podstawie
oryginału w języku angielskim. Zobacz [zlokalizuj treść](#localize-content) po więcej szczegółów.

Jeśli zauważysz błąd techniczny lub inny problem z dokumentacją źródłową
(angielską), najpierw powinieneś naprawić dokumentację źródłową, a
następnie powtórzyć równoważną poprawkę, aktualizując lokalizację, nad którą pracujesz.

Limituj zmiany w pull requestach do jednej lokalizacji. Przeglądanie pull
requestów, które zmieniają zawartość w wielu lokalizacjach, jest problematyczne.

Postępuj zgodnie z [Sugestie dotyczące ulepszenia treści](/docs/contribute/suggesting-improvements/),
aby zaproponować zmiany w tej lokalizacji.
Proces jest podobny do proponowania zmian w oryginalnej (angielskiej) treści.

## Rozpocznij nową lokalizację {#start-a-new-localization}

Jeśli chcesz, aby dokumentacja Kubernetes została przetłumaczona
na nowy język, oto co musisz zrobić:

Ponieważ współtwórcy nie mogą zatwierdzać własnych pull request,
potrzebujesz _co najmniej dwóch współtwórców_, aby rozpocząć lokalizację.

Wszystkie zespoły zajmujące się lokalizacją muszą być samowystarczalne.
Strona internetowa Kubernetes chętnie udostępni Twoje prace, ale to do Ciebie
należy ich przetłumaczenie oraz aktualizowanie istniejących zlokalizowanych treści.

Będziesz musiał znać dwuliterowy kod językowy dla swojego języka.
Zapoznaj się z [standardem ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php),
aby znaleźć dwuliterowy kod językowy dla
swojej lokalizacji. Na przykład dwuliterowy kod dla języka polskiego to `pl`.

Jeśli język, dla którego zaczynasz lokalizację, jest używany w różnych
miejscach z istotnymi różnicami między wariantami, może mieć sens
połączenie małej litery kodu kraju ISO-3166 z dwuliterowym kodem językowym. Na
przykład, brazylijska odmiana języka portugalskiego jest lokalizowana jako `pt-br`.

Gdy rozpoczynasz nową lokalizację, musisz
przetłumaczyć całą [minimalnie wymaganą zawartość](#minimum-required-content),
zanim projekt Kubernetesa
będzie mógł opublikować zmiany na stronie internetowej.

SIG Docs może pomóc Ci pracować na osobnej gałęzi, abyś
mógł stopniowo dążyć do osiągnięcia tego celu.

### Znajdź społeczność {#find-community}

Daj znać zespołowi Kubernetes SIG Docs, jeśli jesteś zainteresowany
tworzeniem lokalizacji! Dołącz do [kanłu Slack SIG Docs](https://kubernetes.slack.com/messages/sig-docs)
oraz [kanłu Slack SIG Docs Localizations](https://kubernetes.slack.com/messages/sig-docs-localizations).
Inne zespoły
zajmujące się lokalizacją chętnie pomogą Ci zacząć i odpowiedzą na Twoje pytania.

Proszę również rozważyć udział w [spotkaniu podgrupy lokalizacyjnej SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs).
Misją
podgrupy lokalizacyjnej SIG Docs jest współpraca z zespołami lokalizacyjnymi SIG
Docs w celu współpracy nad definiowaniem i dokumentowaniem procesów tworzenia
zlokalizowanych przewodników wkładu. Ponadto, podgrupa lokalizacyjna SIG Docs
poszukuje możliwości tworzenia i udostępniania wspólnych narzędzi wśród
zespołów lokalizacyjnych oraz identyfikuje nowe wymagania dla zespołu kierowniczego SIG
Docs. Jeśli masz pytania dotyczące tego spotkania, zapytaj na kanale
[Slack SIG Docs Localizations](https://kubernetes.slack.com/messages/sig-docs-localizations).

Możesz również utworzyć kanał Slack dla swojej lokalizacji w repozytorium
`kubernetes/community`. Przykład dodawania kanału Slack znajdziesz w PR dla
[dodawania kanału dla perskiego](https://github.com/kubernetes/community/pull/4980).

### Dołącz do organizacji Kubernetesa na GitHubie {#join-the-kubernetes-github-organization}

Kiedy otworzysz PR lokalizacyjny, możesz zostać członkiem
organizacji Kubernetesa na GitHubie. Każda osoba w zespole musi
utworzyć własne [Żądanie Członkostwa w Organizacji](https://github.com/kubernetes/org/issues/new/choose)
w repozytorium `kubernetes/org`.

### Dodaj swój zespół lokalizacyjny w GitHub {#add-your-localization-team-in-github}

Następnie dodaj swój zespół lokalizacyjny Kubernetesa do
[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/main/config/kubernetes/sig-docs/teams.yaml).
Aby uzyskać przykład dodawania zespołu lokalizacyjnego, zobacz PR
dodający [hiszpański zespół lokalizacyjny](https://github.com/kubernetes/org/pull/685).

Członkowie `@kubernetes/sig-docs-**-owners` mogą zatwierdzać PRy, które zmieniają zawartość
w (i tylko w) twoim katalogu lokalizacyjnym: `/content/**/`. Dla
każdej lokalizacji, zespół `@kubernetes/sig-docs-**-reviews` automatyzuje
przypisywanie recenzji dla nowych PRów. Członkowie `@kubernetes/website-maintainers` mogą
tworzyć nowe gałęzie lokalizacyjne, aby koordynować wysiłki tłumaczeniowe.
Członkowie `@kubernetes/website-milestone-maintainers` mogą używać
[komendy Prow](https://prow.k8s.io/command-help) `/milestone`, aby przypisać kamień milowy do problemów lub PRów.

### Skonfiguruj przepływ pracy {#configure-the-workflow}

Następnie dodaj etykietę GitHub dla swojej lokalizacji w
repozytorium `kubernetes/test-infra`. Etykieta pozwala
filtrować zgłoszenia i pull requesty dla Twojego konkretnego języka.

Aby uzyskać przykład dodawania etykiety, zobacz PR dotyczący dodawania
[etykiety języka włoskiego](https://github.com/kubernetes/test-infra/pull/11316).

### Modyfikacja konfiguracji witryny {#modify-the-site-configuration}

Strona internetowa Kubernetesa wykorzystuje Hugo jako swoją strukturę
sieciową. Konfiguracja Hugo dla strony internetowej znajduje się w pliku [`hugo.toml`](https://github.com/kubernetes/website/tree/main/hugo.toml).
Trzeba
będzie zmodyfikować `hugo.toml`, aby obsługiwać nową lokalizację.

Dodaj blok konfiguracyjny dla nowego języka do `hugo.toml` pod istniejącym blokiem
`[languages]`. Blok dla języka niemieckiego wygląda na przykład tak:

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch (German)"
languageNameLatinScript = "Deutsch"
contentDir = "content/de"
weight = 8
```

Pasek wyboru języka wyświetla wartość dla `languageName`.
Przypisz "nazwa języka w ojczystym piśmie i języku (angielska nazwa
języka w łacińskim piśmie)" do `languageName`. Na przykład,
`languageName = "한국어 (Korean)"` lub `languageName = "Deutsch (German)"`.

`languageNameLatinScript` można użyć do uzyskania nazwy języka w
alfabecie łacińskim i użycia jej w motywie. Przypisz "nazwa języka w
alfabecie łacińskim" do `languageNameLatinScript`. Na przykład,
`languageNameLatinScript ="Korean"` lub `languageNameLatinScript = "Deutsch"`.

Parametr `weight` określa kolejność języków na pasku wyboru języka. Niższa
wartość `weight` ma pierwszeństwo, co skutkuje tym, że język pojawia się jako pierwszy.
Przy przypisywaniu parametru `weight` ważne jest, aby zbadać
istniejący blok języków i dostosować ich wartości, aby zapewnić, że są w
uporządkowanej kolejności względem wszystkich języków, w tym każdego nowo dodanego języka.

Aby uzyskać więcej informacji na temat wsparcia wielojęzycznego Hugo,
zobacz [Multilingual mode](https://gohugo.io/content-management/multilingual/).

### Dodaj nowy katalog lokalizacyjny {#add-a-new-localization-directory}

Dodaj podkatalog specyficzny dla języka do folderu
[`content`](https://github.com/kubernetes/website/tree/main/content) w
repozytorium. Na przykład dwuliterowy kod dla języka niemieckiego to `de`:

```shell
mkdir content/de
```

Musisz również utworzyć katalog wewnątrz `data/i18n` dla
[zlokalizowanych ciągów](#site-strings-in-i18n); spójrz na istniejące
lokalizacje jako przykład. Aby użyć tych nowych ciągów, musisz również
utworzyć dowiązanie symboliczne (ang. symbolic link) z
`i18n/<localization>.toml` do rzeczywistej konfiguracji ciągów w
`data/i18n/<localization>/<localization>.toml` (pamiętaj o zatwierdzeniu dowiązania symbolicznego).

Na przykład, dla języka niemieckiego ciągi znaków znajdują się w
`data/i18n/de/de.toml`, a `i18n/de.toml` jest dowiązaniem symbolicznym do `data/i18n/de/de.toml`.

### Zlokalizuj kodeks postępowania społeczności {#localize-the-community-code-of-conduct}

Otwórz PR w repozytorium [`cncf/foundation`](https://github.com/cncf/foundation/tree/main/code-of-conduct-languages),
aby
dodać kodeks postępowania w swoim języku.

### Skonfiguruj pliki OWNERS {#set-up-the-owners-files}

Aby ustawić role każdego użytkownika wnoszącego wkład do
lokalizacji, utwórz plik `OWNERS` w podkatalogu specyficznym dla języka za pomocą:

- **reviewers**: Lista zespołów Kubernetesa z rolami recenzentów, w tym przypadku,
- zespół `sig-docs-**-reviews` utworzony w [Dodaj swój zespół lokalizacyjny w GitHub](#add-your-localization-team-in-github).
- **approvers**: Lista zespołów Kubernetesa z rolami aprobatowymi, w tym przypadku,
- zespół `sig-docs-**-owners` utworzony w [Dodaj swój zespół lokalizacyjny w GitHub](#add-your-localization-team-in-github).
- **labels**: Lista etykiet GitHub, które zostaną automatycznie zastosowane do PR, w tym
  przypadku etykieta językowa utworzona w [Konfiguracja przepływu pracy](#configure-the-workflow).

Więcej informacji na temat pliku `OWNERS` można znaleźć na
stronie [go.k8s.io/owners](https://go.k8s.io/owners).

Plik [Spanish OWNERS](https://git.k8s.io/website/content/es/OWNERS)
z kodem języka `es` wygląda następująco:

```yaml
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- language/es
```

Po dodaniu pliku `OWNERS` specyficznego dla danego języka, zaktualizuj
[główny plik `OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES)
z nowymi zespołami
Kubernetesa dla lokalizacji, `sig-docs-**-owners` i `sig-docs-**-reviews`.

Dla każdego zespołu dodaj listę użytkowników GitHub, o
której mowa w [Dodaj swój zespół lokalizacyjny w GitHub](#add-your-localization-team-in-github),
w porządku alfabetycznym.

```diff
--- a/OWNERS_ALIASES
+++ b/OWNERS_ALIASES
@@ -48,6 +48,14 @@ aliases:
     - stewart-yu
     - xiangpengzhao
     - zhangxiaoyu-zidif
+  sig-docs-es-owners: # Admins for Spanish content
+    - alexbrand
+    - raelga
+  sig-docs-es-reviews: # PR reviews for Spanish content
+    - alexbrand
+    - electrocucaracha
+    - glo-pena
+    - raelga
   sig-docs-fr-owners: # Admins for French content
     - perriea
     - remyleone
```

### Otwórz pull request {#open-a-pull-request}

Następnie, [otwórz pull request](/docs/contribute/new-content/open-a-pr/#open-a-pr)
(PR), aby dodać lokalizację do repozytorium
`kubernetes/website`. PR musi zawierać całą
[wymaganą minimalną zawartość](#minimum-required-content), zanim może zostać zatwierdzony.

Aby uzyskać przykład dodawania nowej lokalizacji, zobacz PR umożliwiający
[dokumentację w języku francuskim](https://github.com/kubernetes/website/pull/12548).

### Dodaj zlokalizowany plik README {#add-a-localized-readme-file}

Aby poprowadzić innych współtwórców lokalizacji, dodaj nowy
plik [`README-**.md`](https://help.github.com/articles/about-readmes/)
na najwyższym poziomie [kubernetes/website](https://github.com/kubernetes/website/),
gdzie `**` to dwuliterowy kod
języka. Na przykład, niemiecki plik README nosiłby nazwę `README-de.md`.

Prowadź współtwórców lokalizacji w zlokalizowanym pliku `README-**.md`.
Zawieraj te same informacje, które znajdują się w `README.md`, a także:

- Punkt kontaktowy dla projektu lokalizacyjnego
- Wszelkie informacje specyficzne dla lokalizacji

Po utworzeniu zlokalizowanego pliku README, dodaj link do tego
pliku z głównego angielskiego `README.md` i dołącz informacje
kontaktowe w języku angielskim. Możesz podać ID GitHub, adres e-mail,
[kanał Slack](https://slack.com/), lub inną metodę kontaktu. Musisz
również podać link do zlokalizowanego Kodeksu Postępowania Społeczności.

### Uruchom swoje nowe lokalizacje {#launch-your-new-localization}

Gdy lokalizacja spełnia wymagania dotyczące przepływu pracy i
minimalnej wymaganej zawartości, SIG Docs wykonuje następujące czynności:

- Umożliwia wybór języka na stronie internetowej.
- Publikuje dostępność lokalizacji poprzez kanały
  [Cloud Native Computing Foundation](https://www.cncf.io/about/)(CNCF),
  w tym [blog Kubernetesa](/blog/).

## Zlokalizuj treść {#localize-content}

Lokalizowanie *całej* dokumentacji Kubernetes to ogromne
zadanie. Można zacząć od małych kroków i z czasem się rozwijać.

### Minimalna wymagana zawartość {#minimum-required-content}

W minimalnym zakresie wszystkie lokalizacje muszą zawierać:

Opis | URL
-----|-----
Strona główna | [Wszystkie adresy URL nagłówków i podnagłówków](/docs/home/)
Konfiguracja | [Wszystkie adresy URL nagłówków i podnagłówków](/docs/setup/)
Samouczki | [Podstawy Kubernetesa](/docs/tutorials/kubernetes-basics/), [Witaj Minikube](/docs/tutorials/hello-minikube/)
Ciągi znaków strony | [Wszystkie ciągi znaków strony](#site-strings-in-i18n) w nowym zlokalizowanym pliku TOML
Wydania | [Wszystkie URL-e nagłówków i podnagłówków](/releases)

Przetłumaczone dokumenty muszą znajdować się we własnym podkatalogu `content/**/`, ale
powinny podążać tą samą ścieżką URL co źródła dla języka angielskiego. Na przykład, aby
przygotować samouczek [Podstawy Kubernetesa](/docs/tutorials/kubernetes-basics/) do tłumaczenia na
język niemiecki, utwórz podkatalog w katalogu `content/de/` i skopiuj angielskie źródło lub katalog:

```shell
mkdir -p content/de/docs/tutorials
cp -ra content/en/docs/tutorials/kubernetes-basics/ content/de/docs/tutorials/
```

Narzędzia tłumaczeniowe mogą przyspieszyć proces tłumaczenia. Na
przykład, niektórzy edytorzy oferują wtyczki do szybkiego tłumaczenia tekstu.

{{< caution >}}
Tłumaczenia generowane maszynowo nie są wystarczające same w sobie.
Lokalizacja wymaga rozbudowanej recenzji ludzkiej, aby spełnić minimalne standardy jakości.
{{< /caution >}}

Aby zapewnić dokładność gramatyczną i znaczeniową, członkowie Twojego zespołu ds.
lokalizacji powinni dokładnie przejrzeć wszystkie tłumaczenia generowane maszynowo przed publikacją.

### Lokalizuj obrazy SVG {#localize-svg-images}

Projekt Kubernetes zaleca używanie obrazów wektorowych (SVG), gdy to możliwe, ponieważ zespołowi
zajmującemu się lokalizacją znacznie łatwiej jest je edytować. Jeśli
znajdziesz obraz rastrowy (ang. a raster image), który wymaga lokalizacji, rozważ najpierw
przerysowanie wersji angielskiej jako obrazu wektorowego, a następnie dokonanie lokalizacji.

Kiedy tłumaczysz tekst w obrazach SVG (Scalable Vector
Graphics), należy przestrzegać pewnych wytycznych, aby
zapewnić dokładność i zachować spójność między wersjami
językowymi. Obrazy SVG są powszechnie używane w dokumentacji
Kubernetesa do ilustrowania koncepcji, przepływów pracy i diagramów.

1. **Identyfikacja tekstu do przetłumaczenia**: Zacznij od zidentyfikowania
   elementów tekstowych wewnątrz obrazu SVG, które wymagają tłumaczenia. Elementy te
   zazwyczaj obejmują etykiety, podpisy, adnotacje lub jakikolwiek tekst przekazujący informacje.

1. **Edycja plików SVG**: Pliki SVG opierają się na XML, co oznacza, że można je
   edytować za pomocą edytora tekstu. Jednak warto zauważyć, że większość
   obrazów w dokumentacji Kubernetes konwertuje już tekst na krzywe w celu
   uniknięcia problemów z kompatybilnością czcionek. W takich przypadkach zaleca się
   użycie specjalistycznego oprogramowania do edycji SVG, takiego jak Inkscape,
   aby edytować, otworzyć plik SVG i zlokalizować elementy tekstowe wymagające tłumaczenia.

1. **Tłumaczenie tekstu**: Zamień oryginalny tekst na przetłumaczoną
   wersję w wybranym języku. Upewnij się, że przetłumaczony tekst dokładnie
   oddaje zamierzone znaczenie i mieści się w dostępnej przestrzeni
   obrazu. Rodzina czcionek Open Sans powinna być używana przy pracy z językami, które
   korzystają z alfabetu łacińskiego. Możesz pobrać krój pisma Open Sans
   stąd: [Open Sans Typeface](https://fonts.google.com/specimen/Open+Sans).

1. **Konwersja tekstu na krzywe**: Jak już wspomniano, aby rozwiązać
   problemy z kompatybilnością czcionek, zaleca się konwersję przetłumaczonego
   tekstu na krzywe lub ścieżki. Konwersja tekstu na krzywe zapewnia, że
   końcowy obraz wyświetla przetłumaczony tekst poprawnie, nawet jeśli system
   użytkownika nie posiada dokładnie tej samej czcionki użytej w oryginalnym pliku SVG.

1. **Przeglądanie i testowanie**: Po dokonaniu niezbędnych tłumaczeń i
   konwersji tekstu na krzywe, zapisz i przejrzyj zaktualizowany obraz SVG, aby
   upewnić się, że tekst jest prawidłowo wyświetlany i wyrównany. Sprawdź
   [Podglądaj swoje zmiany lokalnie](/docs/contribute/new-content/open-a-pr/#preview-locally).

### Pliki źródłowe {#source-files}

Localizacje muszą być oparte na angielskich plikach z konkretnego wydania
wybranego przez zespół lokalizacyjny. Każdy zespół lokalizacyjny może
zdecydować, które wydanie będzie celem, określane poniżej jako _docelowa wersja_.

Aby znaleźć pliki źródłowe dla docelowej wersji:

1. Przejdź do repozytorium strony internetowej
   Kubernetes pod adresem https://github.com/kubernetes/website.

1. Wybierz gałąź dla swojej docelowej wersji z poniższej tabeli:

Wersja docelowa | Gałąź
-----|-----
Najnowsza wersja | [`main`](https://github.com/kubernetes/website/tree/main)
Poprzednia wersja | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
Następna wersja | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

Gałąź `main` zawiera treści dla bieżącego wydania
`{{< latest-version >}}`. Zespół wydawniczy tworzy gałąź
`{{< release-branch >}}` przed następnym wydaniem: v{{< skew nextMinorVersion >}}.

### Ciągi znaków strony (ang. site strings) w i18n {#site-strings-in-i18n}

Lokalizacje muszą zawierać treści
[`data/i18n/en/en.toml`](https://github.com/kubernetes/website/blob/main/data/i18n/en/en.toml) w
nowym pliku specyficznym dla danego języka. Na przykład
używając języka niemieckiego: `data/i18n/de/de.toml`.

Dodaj nowy katalog lokalizacyjny i plik do
`data/i18n/`. Na przykład, z niemieckim (`de`):

```bash
mkdir -p data/i18n/de
cp data/i18n/en/en.toml data/i18n/de/de.toml
```

Przejrzyj komentarze na początku pliku, aby dostosować je do
swojego lokalnego języka, a następnie przetłumacz wartość każdego ciągu.
Na przykład, oto niemiecki tekst zastępczy dla formularza wyszukiwania:

```toml
[ui_search_placeholder]
other = "Suchen"
```

Lokalizacja ciągów tekstowych witryny pozwala dostosować tekst i funkcje w całej
witrynie: na przykład prawny tekst dotyczący praw autorskich w stopce na każdej stronie.

### Przewodnik lokalizacyjny specyficzny dla języka {#language-specific-localization-guide}

Jako zespół lokalizacyjny, możesz sformalizować najlepsze praktyki, które
stosuje twój zespół, tworząc przewodnik lokalizacyjny specyficzny dla danego języka.

Na przykład, zapoznaj się z
[Koreańskiego przedownika lokalizacji](/ko/docs/contribute/localization_ko/),
który zawiera treści na następujące tematy:

- Kadencja sprintów i wydania
- Strategia gałęzi
- Przepływ pracy zgłoszenia pull request
- Przewodnik stylu
- Słownik terminów zlokalizowanych i niezlokalizowanych
- Konwencje Markdown
- Terminologia obiektów API Kubernetesa

### Spotkania Zoom specyficzne dla języka {#language-specific-zoom-meetings}

Jeśli projekt lokalizacyjny wymaga osobnego terminu spotkania, skontaktuj się z
współprzewodniczącym SIG Docs lub liderem technicznym, aby utworzyć nowe
cykliczne spotkanie w Zoomie i zaproszenie do kalendarza. Jest to potrzebne tylko
wtedy, gdy zespół jest wystarczająco duży, aby utrzymać i potrzebować osobnego spotkania.

Zgodnie z polityką CNCF, zespoły lokalizacyjne muszą przesyłać swoje
spotkania na playlistę YouTube SIG Docs. Współprzewodniczący SIG Docs lub Tech
Lead mogą pomóc w tym procesie, dopóki SIG Docs go nie zautomatyzuje.

## Strategia gałęzi {#branch-strategy}

Ponieważ projekty lokalizacyjne są wysoko współpracującymi
przedsięwzięciami, zachęcamy zespoły do pracy we wspólnych gałęziach
lokalizacyjnych - zwłaszcza na początku, kiedy lokalizacja nie jest jeszcze aktywna.

Aby współpracować nad gałęzią lokalizacyjną:

1. Członek zespołu [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)
   otwiera
   gałąź lokalizacyjną z
   gałęzi źródłowej na https://github.com/kubernetes/website.

   Twój zespół zatwierdzający dołączył do zespołu
   `@kubernetes/website-maintainers`, gdy [dodałeś swój zespół ds. lokalizacji](#add-your-localization-team-in-github)
   do repozytorium [`kubernetes/org`](https://github.com/kubernetes/org).

   Zalecamy następujący schemat nazywania gałęzi:

   `dev-<wersja źródłowa>-<kod języka>.<kamień milowy zespołu>`

   Na przykład, osoba zatwierdzająca w niemieckim zespole lokalizacyjnym
   otwiera gałąź lokalizacyjną `dev-1.12-de.1` bezpośrednio w
   repozytorium `kubernetes/website`, bazując na gałęzi źródłowej dla Kubernetes v1.12.

1. Indywidualni współtwórcy otwierają
   gałęzie z funkcjami w oparciu o gałąź lokalizacyjną.

   Na przykład, niemiecki współtwórca otwiera pull request z
   zmianami do `kubernetes:dev-1.12-de.1` z `username:local-branch-name`.

1. Osoby zatwierdzające przeglądają i scalają gałęzie funkcji z gałęzią lokalizacji.

1. Okresowo, zatwierdzający łączy gałąź lokalizacyjną z jej
   gałęzią źródłową, otwierając i zatwierdzając nowy pull request.
   Upewnij się, że scaliłeś commity przed zatwierdzeniem pull request.

Powtarzaj kroki od 1 do 4 według potrzeb, aż lokalizacja zostanie
ukończona. Na przykład, kolejne niemieckie
gałęzie lokalizacyjne to: `dev-1.12-de.2`, `dev-1.12-de.3`, itd.

Zespoły muszą scalić zlokalizowane treści do tej
samej gałęzi, z której pochodziła treść. Na przykład:

- Gałąź lokalizacji pochodząca z `main` musi zostać scalona z `main`.
- Gałąź lokalizacyjna pochodząca z
  `release-{{% skew "prevMinorVersion" %}}` musi być scalona z `release-{{% skew "prevMinorVersion" %}}`.

{{< note >}}
Jeśli Twoja gałąź lokalizacyjna została utworzona z gałęzi `main`, ale
nie została scalona z `main` przed utworzeniem nowej gałęzi wydania
`{{< release-branch >}}`, scal ją zarówno z `main`, jak i z nową gałęzią
wydania `{{< release-branch >}}`. Aby scalić swoją gałąź lokalizacyjną z
nową gałęzią wydania `{{< release-branch >}}`, musisz przełączyć gałąź
(ang. upstream branch) dla swojej gałęzi lokalizacyjnej na `{{< release-branch >}}`.
{{< /note >}}

Na początku każdego kamienia milowego zespołu warto
otworzyć zgłoszenie porównujące zmiany w upstream pomiędzy
poprzednią gałęzią lokalizacyjną a obecną gałęzią
lokalizacyjną. Istnieją dwa skrypty do porównywania zmian upstream.

- [`upstream_changes.py`](https://github.com/kubernetes/website/tree/main/scripts#upstream_changespy)
  jest przydatne do sprawdzania zmian wprowadzonych do konkretnego pliku. I
- [`diff_l10n_branches.py`](https://github.com/kubernetes/website/tree/main/scripts#diff_l10n_branchespy)
  jest przydatny do
  tworzenia listy nieaktualnych plików dla konkretnej gałęzi lokalizacyjnej.

Podczas gdy tylko zatwierdzający mogą otworzyć nową gałąź
lokalizacyjną i scalać pull requesty, każdy może otworzyć pull request dla
nowej gałęzi lokalizacyjnej. Nie są wymagane żadne specjalne uprawnienia.

Aby uzyskać więcej informacji na temat pracy z forków lub bezpośrednio z
repozytorium, zobacz ["fork and clone the repo"](#fork-and-clone-the-repo).

## Kontrybucje do projektu głównego {#upstream-contributions}

SIG Docs chętnie przyjmuje nową treść oraz korekty w angielskiej wersji źródłowej.
