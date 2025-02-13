---
title: Szybki start generowania materiałów źródłowych
linkTitle: Szybki start
content_type: task
weight: 10
hide_summary: true
---

<!-- overview -->

Ta strona pokazuje, jak używać skryptu `update-imported-docs.py`
do generowania materiałów źródłowych Kubernetes. Skrypt
automatyzuje konfigurację budowania i generuje materiały źródłowe dla wydania.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Pobieranie repozytorium dokumentacji {#getting-the-docs-repository}

Upewnij się, że Twój fork `website` jest zaktualizowany do najnowszej wersji zdalnego
repozytorium `kubernetes/website` na GitHubie (gałąź `main`), a następnie sklonuj swój fork `website`.

```shell
mkdir github.com
cd github.com
git clone git@github.com:<your_github_username>/website.git
```

Określ katalog bazowy swojego klonu. Na przykład, jeśli
wykonałeś poprzedni krok, aby uzyskać repozytorium, Twoim
katalogiem bazowym jest `github.com/website.` Kolejne
kroki odnoszą się do Twojego katalogu bazowego jako `<web-base>`.

{{< note>}}
Jeśli chcesz wieść zmianę do narzędzi komponentu i materiałów źródłowych, zobacz
[Wkład w kod źródłowy Kubernetesa](/docs/contribute/generate-ref-docs/contribute-upstream).
{{< /note >}}

## Wprowadzenie do update-imported-docs {#overview-of-update-imported-docs}

Skrypt `update-imported-docs.py` znajduje się w
katalogu `<web-base>/update-imported-docs/`.

Skrypt tworzy następujące odniesienia:

* Materiały źródłowe komponentów i narzędzi
* Materiały źródłowe do polecenia `kubectl`
* Materiały źródłowe API Kubernetesa

Skrypt `update-imported-docs.py` generuje materiały źródłowe z
kodu źródłowego Kubernetesa. Skrypt tworzy tymczasowy
katalog w `/tmp` na Twoim komputerze i klonuje do tego katalogu wymagane
repozytoria: `kubernetes/kubernetes` oraz
`kubernetes-sigs/reference-docs`. Skrypt ustawia Twój `GOPATH` na
ten tymczasowy katalog. Ustawiane są trzy dodatkowe zmienne środowiskowe:

* `K8S_RELEASE`
* `K8S_ROOT`
* `K8S_WEBROOT`

Skrypt wymaga dwóch argumentów do prawidłowego działania:

* Plik konfiguracyjny YAML (`reference.yml`)
* Wersja wydania, na przykład: `1.17`

Plik konfiguracyjny zawiera pole
`generate-command`. Pole `generate-command` definiuje serię
instrukcji budowania z `kubernetes-sigs/reference-docs/Makefile`.
Zmienna `K8S_RELEASE` określa wersję wydania.

Skrypt `update-imported-docs.py` wykonuje następujące kroki:

1. Klonuje powiązane repozytoria określone w pliku
   konfiguracyjnym. W celu generowania materiałów źródłowych, repozytorium,
   które jest domyślnie klonowane, to `kubernetes-sigs/reference-docs`.
1. Uruchamia polecenia w klonowanych repozytoriach, aby
   przygotować generator dokumentacji, a następnie generuje pliki HTML i Markdown.
1. Kopiuje wygenerowane pliki HTML i Markdown do lokalnej kopii
   repozytorium `<web-base>` w lokalizacjach określonych w pliku konfiguracyjnym.
1. Aktualizacje odnośników do poleceń `kubectl` w `kubectl`.md, aby odnosiły
   się do sekcji w materiałach źródłowych polecenia `kubectl`.

Gdy wygenerowane pliki znajdują się w Twojej lokalnej kopii repozytorium
`<web-base>`, możesz je przesłać w
[pull requeście](/docs/contribute/new-content/open-a-pr/) do `<web-base>`.

## Format pliku konfiguracyjnego {#configuration-file-format}

Każdy plik konfiguracyjny może zawierać wiele repozytoriów, które będą
importowane razem. W razie potrzeby możesz dostosować plik konfiguracyjny, edytując
go ręcznie. Możesz tworzyć nowe pliki konfiguracyjne do importowania innych
grup dokumentów. Poniżej znajduje się przykład pliku konfiguracyjnego w formacie YAML:

```yaml
repos:
- name: community
  remote: https://github.com/kubernetes/community.git
  branch: master
  files:
  - src: contributors/devel/README.md
    dst: docs/imported/community/devel.md
  - src: contributors/guide/README.md
    dst: docs/imported/community/guide.md
```

Jednostronicowe dokumenty w formacie Markdown, importowane przez narzędzie, muszą
być zgodne z [Przewodnikiem Stylu Dokumentacji](/docs/contribute/style/style-guide/).

## Dostosowywanie pliku reference.yml {#customizing-referenceyml}

Otwórz `<web-base>/update-imported-docs/reference.yml` do edycji. Nie
zmieniaj zawartości pola `generate-command`, chyba że rozumiesz, jak
ta komenda jest używana do budowy materiałów źródłowych. Nie powinno
być konieczności aktualizowania `reference.yml`. Czasami zmiany w kodzie źródłowym
nadrzędnym mogą wymagać zmian w pliku konfiguracyjnym (na
przykład: zależności od wersji golang i zmiany w bibliotekach
zewnętrznych). Jeśli napotkasz problemy z budowaniem, skontaktuj się z zespołem SIG-Docs
na [kanale Slack #sig-docs Kubernetes](https://kubernetes.slack.com).

{{< note >}}
Pole `generate-command` jest opcjonalnym wpisem, który może być użyty do uruchomienia
określonego polecenia lub krótkiego skryptu w celu wygenerowania dokumentacji z poziomu repozytorium.
{{< /note >}}

W `reference.yml`, `files` zawiera listę pól `src` i `dst`.
Pole `src` zawiera lokalizację wygenerowanego pliku
Markdown w sklonowanym katalogu kompilacji
`kubernetes-sigs/reference-docs`, a pole `dst` określa, gdzie skopiować ten
plik w sklonowanym repozytorium `kubernetes/website`. Na przykład:

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-sigs/reference-docs.git
  files:
  - src: gen-compdocs/build/kube-apiserver.md
    dst: content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
  ...
```

Zauważ, że gdy istnieje wiele plików do skopiowania z tego
samego katalogu źródłowego do tego samego katalogu docelowego,
możesz użyć symboli wieloznacznych w wartości przekazywanej do
`src`. Musisz podać nazwę katalogu jako wartość dla `dst`. Na przykład:

```yaml
  files:
  - src: gen-compdocs/build/kubeadm*.md
    dst: content/en/docs/reference/setup-tools/kubeadm/generated/
```

## Uruchamianie narzędzia update-imported-docs {#running-the-update-imported-docs-tool}

Możesz uruchomić narzędzie `update-imported-docs.py` w następujący sposób:

```shell
cd <web-base>/update-imported-docs
./update-imported-docs.py <configuration-file.yml> <release-version>
```

Na przykład:

```shell
./update-imported-docs.py reference.yml 1.17
```

<!-- Revisit: is the release configuration used -->
## Naprawianie linków {#fixing-links}

Plik konfiguracyjny `release.yml` zawiera instrukcje do naprawienia względnych
odnośników. Aby naprawić względne odnośniki w zaimportowanych plikach, ustaw
właściwość `gen-absolute-links` na `true`. Przykład tego możesz znaleźć w
[`release.yml`](https://github.com/kubernetes/website/blob/main/update-imported-docs/release.yml).

## Dodawanie i zatwierdzanie zmian w kubernetes/website {#adding-and-committing-changes-in-kuberneteswebsite}

Wymień pliki, które zostały wygenerowane i skopiowane do `<web-base>`:

```shell
cd <web-base>
git status
```

Wynik pokazuje nowe i zmodyfikowane pliki. Generowane dane
wyjściowe różnią się w zależności od wprowadzonych zmian w kodzie źródłowym.

### Wygenerowane pliki materiałów źródłowych narzędzi {#generated-component-tool-files}

```
content/en/docs/reference/command-line-tools-reference/cloud-controller-manager.md
content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
content/en/docs/reference/command-line-tools-reference/kube-proxy.md
content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
content/en/docs/reference/setup-tools/kubeadm/generated/kubeadm.md
content/en/docs/reference/kubectl/kubectl.md
```

### Wygenerowane pliki materiałów źródłowych poleceń kubectl {#generated-kubectl-command-reference-files}

```
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
static/docs/reference/generated/kubectl/scroll.js
static/docs/reference/generated/kubectl/stylesheet.css
static/docs/reference/generated/kubectl/tabvisibility.js
static/docs/reference/generated/kubectl/node_modules/bootstrap/dist/css/bootstrap.min.css
static/docs/reference/generated/kubectl/node_modules/highlight.js/styles/default.css
static/docs/reference/generated/kubectl/node_modules/jquery.scrollto/jquery.scrollTo.min.js
static/docs/reference/generated/kubectl/node_modules/jquery/dist/jquery.min.js
static/docs/reference/generated/kubectl/css/font-awesome.min.css
```

### Wygenerowane katalogi i pliki materiałów źródłowych API Kubernetess {#generated-kubernetes-api-reference-directories-and-files}

```
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/index.html
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/navData.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/scroll.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/query.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff2
```

Uruchom `git add` i `git commit`, aby zatwierdzić pliki.

## Tworzenie pull requesta {#creating-a-pull-request}

Utwórz pull requesta do repozytorium `kubernetes/website`. Monitoruj swój pull
request i odpowiadaj na komentarze związane z przeglądem zgodnie z
potrzebą. Kontynuuj monitorowanie swojego pull requesta, aż zostanie scalony.

Kilka minut po scaleniu twojego pull requesta,
zaktualizowane tematy materiałów źródłowych będą
widoczne w [opublikowanej dokumentacji](/docs/home/).



## {{% heading "whatsnext" %}}


Materiały źródłowe można wygenerować ręcznie, konfigurując niezbędne repozytoria i uruchamiając
odpowiednie cele (ang. build targets). Szczegółowe instrukcje znajdują się w poniższych przewodnikach:

* [Generowanie materiałów źródłowych dla komponentów i narzędzi Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generowanie materiałów źródłowych dla poleceń kubectl](/docs/contribute/generate-ref-docs/kubectl/)
* [Generowanie materiałów źródłowych dla API Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-api/)

