---
title: Generowanie materiałów źródłowych dla polecenia kubectl
content_type: task
weight: 90
---

<!-- overview -->

Ta strona pokazuje, jak wygenerować materiały źródłowe polecenia `kubectl`.

{{< note >}}
Ten temat pokazuje, jak wygenerować materiały źródłowe dla
[poleceń kubectl](/docs/reference/generated/kubectl/kubectl-commands) takich jak
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) i
[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
Ten temat nie pokazuje, jak wygenerować stronę materiałów źródłowych opcji [kubectl](/docs/reference/generated/kubectl/kubectl-commands/).
Aby
uzyskać instrukcje dotyczące generowania strony materiałów źródłowych opcji
kubectl, zobacz [Generowanie stron materiałów źródłowych dla komponentów i narzędzi Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-components/).

{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Skonfiguruj lokalne repozytoria {#set-up-the-local-repositories}

Utwórz lokalną przestrzeń roboczą i ustaw swoje `GOPATH`:

```shell
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

Utwórz lokalną kopię następujących repozytoriów:

```shell
go get -u github.com/spf13/pflag
go get -u github.com/spf13/cobra
go get -u gopkg.in/yaml.v2
go get -u github.com/kubernetes-sigs/reference-docs
```

Jeśli nie masz jeszcze repozytorium kubernetes/website, pobierz je teraz:

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

Zrób klon repozytorium kubernetes/kubernetes jako k8s.io/kubernetes:

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

Usuń pakiet spf13 z `$GOPATH/src/k8s.io/kubernetes/vendor/github.com`:

```shell
rm -rf $GOPATH/src/k8s.io/kubernetes/vendor/github.com/spf13
```

Repozytorium kubernetes/kubernetes dostarcza kod źródłowy `kubectl` oraz `kustomize`.

* Określ katalog bazowy twojej kopii repozytorium
  [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes). Na przykład,
  jeśli postępowałeś zgodnie z poprzednim krokiem, aby pobrać
  repozytorium, twój katalog bazowy to `$GOPATH/src/k8s.io/kubernetes`.
  Kolejne kroki odwołują się do twojego katalogu bazowego jako `<k8s-base>`.

* Określ katalog bazowy klonu Twojego repozytorium
  [kubernetes/website](https://github.com/kubernetes/website). Na przykład, jeśli
  wykonałeś poprzedni krok, aby pobrać repozytorium, Twoim katalogiem bazowym
  jest `$GOPATH/src/github.com/<your-username>/website`.
  Kolejne kroki odnoszą się do Twojego katalogu bazowego jako `<web-base>`.

* Określ katalog główny dla Twojej kopii repozytorium
  [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs). Na przykład,
  jeśli postępowałeś zgodnie z poprzednim krokiem, aby uzyskać repozytorium,
  Twoim katalogiem głównym będzie `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
  Dalsze kroki odnoszą się do Twojego katalogu głównego jako `<rdocs-base>`.

W swoim lokalnym repozytorium k8s.io/kubernetes przejdź do interesującej Cię
gałęzi i upewnij się, że jest ona aktualna. Na przykład, jeśli chcesz wygenerować
dokumentację dla Kubernetesa {{< skew prevMinorVersion >}}.0, możesz użyć tych poleceń:

```shell
cd <k8s-base>
git checkout v{{< skew prevMinorVersion >}}.0
git pull https://github.com/kubernetes/kubernetes {{< skew prevMinorVersion >}}.0
```

Jeśli nie musisz edytować kodu źródłowego `kubectl`, postępuj zgodnie z
instrukcjami dotyczącymi [Ustawiania zmiennych kompilacji](#set-build-variables).

## Edytowanie kodu źródłowego kubectl {#edit-the-kubectl-source-code}

Materiały źródłowe polecenia kubectl są automatycznie generowana z kodu źródłowego kubectl.
Jeśli chcesz zmienić materiały źródłowe, pierwszym krokiem jest zmiana
jednego lub więcej komentarzy w kodzie źródłowym kubectl. Wprowadź zmianę w swoim
lokalnym repozytorium kubernetes/kubernetes, a następnie zgłoś pull requesta do
gałęzi master na [github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files) jest
przykładem pull requesta, który poprawia literówkę w kodzie źródłowym kubectl.

Monitoruj swój pull request (PR) i odpowiadaj na komentarze recenzentów. Kontynuuj
monitorowanie swojego PR, aż zostanie scalony z docelową gałęzią w repozytorium kubernetes/kubernetes.

## Zrób cherry pick do gałęzi wydania {#cherry-pick-your-change-into-a-release-branch}

Twoja zmiana znajduje się teraz w głównej gałęzi, która jest używana do
rozwoju następnego wydania Kubernetesa. Jeśli chcesz, aby twoja
zmiana pojawiła się w wersji dokumentacji Kubernetesa, która została już
wydana, musisz zaproponować włączenie twojej zmiany do gałęzi wydania.

Na przykład, załóżmy, że gałąź master jest używana do rozwijania Kubernetes
{{< skew currentVersion >}} i chcesz przenieść swoją zmianę do gałęzi
release-{{< skew prevMinorVersion >}}. Aby uzyskać instrukcje, jak to zrobić, zobacz
[Proponowanie Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

Monitoruj swój cherry pick pull request, aż zostanie scalone z gałęzią wydania.

{{< note >}}
Proponowanie cherry pick wymaga posiadania uprawnień do ustawiania etykiety oraz
kamienia milowego w swoim pull requeście. Jeśli nie posiadasz tych uprawnień,
będziesz musiał współpracować z kimś, kto może ustawić etykietę i kamień milowy za Ciebie.
{{< /note >}}

## Ustaw zmienne budowania {#set-build-variables}

Przejdź do `<rdocs-base>`. W swoim wierszu poleceń ustaw następujące zmienne środowiskowe.

* Ustaw `K8S_ROOT` na `<k8s-base>`.
* Ustaw `K8S_WEBROOT` na `<web-base>`.
* Ustaw `K8S_RELEASE` na wersję dokumentacji, którą chcesz zbudować. Na przykład,
  jeśli chcesz zbudować dokumentację dla Kubernetesa
  {{< skew prevMinorVersion >}}, ustaw `K8S_RELEASE` na {{< skew prevMinorVersion >}}.

Na przykład:

```shell
export K8S_WEBROOT=$GOPATH/src/github.com/<your-username>/website
export K8S_ROOT=$GOPATH/src/k8s.io/kubernetes
export K8S_RELEASE={{< skew prevMinorVersion >}}
```

## Tworzenie katalogu wersjonowanego {#creating-a-versioned-directory}

Uruchomienie budowania (ang. build target) `createversiondirs` tworzy katalog z
wersjonowaniem i kopiuje pliki konfiguracyjne kubectl dotyczące materiałów źródłowych do tego
katalogu. Nazwa katalogu z wersjonowaniem jest zgodna z wzorcem `v<major>_<minor>`.

W katalogu `<rdocs-base>`, uruchom następujący cel budowania:

```shell
cd <rdocs-base>
make createversiondirs
```

## Sprawdź tag wydania w k8s.io/kubernetes {#check-out-a-release-tag-in-k8siokubernetes}

W swoim lokalnym repozytorium `<k8s-base>`, przejdź do gałęzi, która zawiera
wersję Kubernetesa, którą chcesz udokumentować. Na przykład, jeśli chcesz
wygenerować dokumentację dla Kubernetesa {{< skew prevMinorVersion >}}.0, przejdź do tagu `v{{< skew prevMinorVersion >}}`.
Upewnij się, że Twoja lokalna gałąź jest aktualna.

```shell
cd <k8s-base>
git checkout v{{< skew prevMinorVersion >}}.0
git pull https://github.com/kubernetes/kubernetes v{{< skew prevMinorVersion >}}.0
```

## Uruchom kod generowania dokumentacji {#run-the-doc-generation-code}

W lokalnym katalogu `<rdocs-base>`, uruchom cel budowania (ang. build target) `copycli`. Komenda działa z uprawnieniami `root`:

```shell
cd <rdocs-base>
make copycli
```

Polecenie `copycli` czyści tymczasowy katalog kompilacji, generuje pliki poleceń kubectl i
kopiuje zbiorczą stronę HTML materiałów źródłowych poleceń kubectl oraz zasoby do `<web-base>`.

## Zlokalizuj wygenerowane pliki {#locate-the-generated-files}

Zweryfikuj, czy te dwa pliki zostały wygenerowane:

```shell
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

## Zlokalizuj skopiowane pliki {#locate-the-copied-files}

Zweryfikuj, czy wszystkie wygenerowane pliki zostały skopiowane do Twojego `<web-base>`:

```shell
cd <web-base>
git status
```

Wynik powinien zawierać zmodyfikowane pliki:

```
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
```

Wynik może również zawierać:

```
static/docs/reference/generated/kubectl/scroll.js
static/docs/reference/generated/kubectl/stylesheet.css
static/docs/reference/generated/kubectl/tabvisibility.js
static/docs/reference/generated/kubectl/node_modules/bootstrap/dist/css/bootstrap.min.css
static/docs/reference/generated/kubectl/node_modules/highlight.js/styles/default.css
static/docs/reference/generated/kubectl/node_modules/jquery.scrollto/jquery.scrollTo.min.js
static/docs/reference/generated/kubectl/node_modules/jquery/dist/jquery.min.js
static/docs/reference/generated/kubectl/node_modules/font-awesome/css/font-awesome.min.css
```

## Lokalne testowanie dokumentacji {#locally-test-the-documentation}

Zbuduj dokumentację Kubernetes w lokalnym `<web-base>`.

```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # if not already done
make container-serve
```

Zobacz [podgląd lokalny](https://localhost:1313/docs/reference/generated/kubectl/kubectl-commands/).

## Dodaj i zatwierdź zmiany w kubernetes/website {#add-and-commit-changes-in-kuberneteswebsite}

Uruchom `git add` i `git commit`, aby zatwierdzić pliki.

## Utwórz pull requesta {#create-a-pull-request}

Utwórz pull requesta do repozytorium `kubernetes/website`.
Monitoruj swój pull request i odpowiadaj na komentarze z przeglądu.
Kontynuuj monitorowanie swojego pull requesta aż do momentu jego włączenia do głównej gałęzi kodu.

Kilka minut po włączeniu twojego pull requesta, zaktualizowane tematy
materiałów źródłowych będą widoczne w [opublikowanej dokumentacji](/docs/home).

## {{% heading "whatsnext" %}}

* [Szybki start generowania materiałów źródłowych](/docs/contribute/generate-ref-docs/quickstart/)
* [Generowanie materiałów źródłowych dla komponentów i narzędzi Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generowanie materiałów źródłowych dla Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
