---
title: Generowanie materiałów źródłowych dla API Kubernetesa
content_type: task
weight: 50
---

<!-- overview -->

Ta strona pokazuje, jak zaktualizować materiały źródłowe API Kubernetes.

Dokumentacja materiałów źródłowych API Kubernetesa jest tworzona na podstawie
[specyfikacji OpenAPI Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json) przy
użyciu kodu generującego [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs).

Jeśli znajdziesz błędy w wygenerowanej dokumentacji, musisz je
[naprawić w pierwotnym źródle](/docs/contribute/generate-ref-docs/contribute-upstream/).

Jeśli potrzebujesz jedynie wygenerować na nowo
materiały źródłowe z [OpenAPI](https://github.com/OAI/OpenAPI-Specification)
specyfikacji, kontynuuj czytanie tej strony.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Skonfiguruj lokalne repozytoria {#set-up-the-local-repositories}

Utwórz lokalne środowisko robocze i ustaw `GOPATH`:

```shell
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

Pobierz lokalną kopię następujących repozytoriów:

```shell
go get -u github.com/kubernetes-sigs/reference-docs

go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

Jeśli nie masz jeszcze repozytorium kubernetes/website, pobierz je teraz:

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

Zrób klon repozytorium kubernetes/kubernetes jako k8s.io/kubernetes:

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

* Główny katalog twojego klonu repozytorium
  [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) to
  `$GOPATH/src/k8s.io/kubernetes.` Kolejne kroki odnoszą
  się do twojego głównego katalogu jako `<k8s-base>`.

* Główny katalog klonu repozytorium
  [kubernetes/website](https://github.com/kubernetes/website) znajduje się w
  `$GOPATH/src/github.com/<twoja nazwa użytkownika>/website`. W
  kolejnych krokach główny katalog będzie określany jako `<web-base>`.

* Główny katalog twojego klonu repozytorium
  [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) znajduje się
  w `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
  W dalszych krokach główny katalog będzie oznaczany jako `<rdocs-base>`.

## Generuj materiały źródłowe API {#generate-the-api-reference-docs}

Ta sekcja pokazuje, jak wygenerować [opublikowane materiały źródłowe API
Kubernetesa](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

### Ustaw zmienne budowania {#set-build-variables}

* Ustaw `K8S_ROOT` na `<k8s-base>`.
* Ustaw `K8S_WEBROOT` na `<web-base>`.
* Ustaw `K8S_RELEASE` na wersję dokumentacji, którą chcesz zbudować. Na przykład,
  jeśli chcesz zbudować dokumentację dla Kubernetesa 1.17.0, ustaw `K8S_RELEASE` na 1.17.0.

Na przykład:

```shell
export K8S_WEBROOT=${GOPATH}/src/github.com/<your-username>/website
export K8S_ROOT=${GOPATH}/src/k8s.io/kubernetes
export K8S_RELEASE=1.17.0
```

### Utwórz wersjonowany katalog i pobierz specyfikację Open API {#create-versioned-directory-and-fetch-open-api-spec}

Celem kompilacji `updateapispec` jest stworzenie wersjonowanego
katalogu kompilacji. Po utworzeniu katalogu, specyfikacja Open API pobierana jest
z repozytorium `<k8s-base>`. Te kroki gwarantują, że wersje
plików konfiguracyjnych i specyfikacji Open API Kubernetes są zgodne z
wersją wydania. Nazwa wersjonowanego katalogu przyjmuje wzór `v<major>_<minor>`.

W katalogu `<rdocs-base>`, uruchom następujący cel buildowania (ang. build target):

```shell
cd <rdocs-base>
make updateapispec
```

### Zbuduj materiały źródłowe API {#build-the-api-reference-docs}

Celem `copyapi` jest zbudowanie materiałów źródłowych
API i skopiowanie wygenerowanych plików do katalogów w
`<web-base>`. Wykonaj następujące polecenie w `<rdocs-base>`:

```shell
cd <rdocs-base>
make copyapi
```

Zweryfikuj, czy te dwa pliki zostały wygenerowane:

```shell
[ -e "<rdocs-base>/gen-apidocs/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

Przejdź do podstawowej lokalizacji lokalnego
`<web-base>` i sprawdź, które pliki zostały zmodyfikowane:

```shell
cd <web-base>
git status
```

Wynik jest podobny do:

```
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff2
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/index.html
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/jquery.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/navData.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/scroll.js
```

## Zaktualizuj strony indeksu materiałów źródłowych API {#update-the-api-reference-index-pages}

Podczas generowania materiałów źródłowych dla nowego
wydania, zaktualizuj plik `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md`
o nowy numer wersji.

* Otwórz `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` do
  edycji i zaktualizuj numer wersji materiałów źródłowych API. Na przykład:

  ```
  ---
  title: v1.17
  ---

  [Kubernetes API v1.17](/docs/reference/generated/kubernetes-api/v1.17/)
  ```

* Otwórz `<web-base>/content/en/docs/reference/_index.md` do edycji i dodaj nowe łącze
  do najnowszych materiałów źródłowych API. Usuń najstarszą wersję
  materiałów źródłowych API. Powinno być pięć łączy do najnowszych materiałów źródłowych API.

## Lokalne testowanie materiałów źródłowych API {#locally-test-the-api-reference}

Opublikuj lokalną wersję materiałów źródłowych API. Zweryfikuj [lokalny
podgląd](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/).

```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # if not already done
make container-serve
```

## Zatwierdź zmiany {#commit-the-changes}

W `<web-base>` uruchom `git add` oraz `git commit`, aby zatwierdzić zmiany.

Prześlij swoje zmiany jako [pull request](/docs/contribute/new-content/open-a-pr/)
do repozytorium
[kubernetes/website](https://github.com/kubernetes/website). Monitoruj swój pull
request i odpowiadaj na komentarze recenzentów według potrzeb.
Kontynuuj monitorowanie swojego pull requesta do momentu jego scalenia.

## {{% heading "whatsnext" %}}

* [Szybki start generowania materiałów źródłowych](/docs/contribute/generate-ref-docs/quickstart/)
* [Generowanie materiałów źródłowych dla komponentów i narzędzi Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generowanie materiałów źródłowych dla komend kubectl](/docs/contribute/generate-ref-docs/kubectl/)
