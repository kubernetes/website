---
title: Wkład w kod źródłowy Kubernetesa
content_type: task
weight: 20
---

<!-- overview -->

Ta strona pokazuje, jak wnieść wkład do projektu `kubernetes/kubernetes`. Możesz
naprawiać błędy znalezione w dokumentacji API Kubernetesa lub w treściach dla
komponentów Kubernetesa, takich jak `kubeadm`, `kube-apiserver` i `kube-controller-manager`.

Jeśli zamiast tego chcesz wygenerować ponownie materiały źródłowe dla API Kubernetesa lub
komponentów `kube-*` z kodu źródłowego, zapoznaj się z następującymi instrukcjami:

- [Generowanie materiałów źródłowych dla API Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Generowanie materiałów źródłowych dla komponentów i narzędzi Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-components/)

## {{% heading "prerequisites" %}}

- Musisz mieć zainstalowane następujące narzędzia:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Golang](https://go.dev/doc/install) wersja 1.13+
  - [Docker](https://docs.docker.com/engine/installation/)
  - [etcd](https://github.com/coreos/etcd/)
  - [make](https://www.gnu.org/software/make/)
  - [kompilator/linker gcc](https://gcc.gnu.org/)

- Twoja zmienna środowiskowa `GOPATH` musi być ustawiona, a
  lokalizacja `etcd` musi znajdować się w zmiennej środowiskowej `PATH`.

- Musisz wiedzieć, jak utworzyć pull requesta do repozytorium GitHub. Zwykle obejmuje to utworzenie
  forka tego repozytorium. Aby uzyskać więcej informacji, zobacz
  [Tworzenie pull requesta](https://help.github.com/articles/creating-a-pull-request/) oraz
  [Standardowy proces fork i pull request w GitHub](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

<!-- steps -->

## Ogólny zarys {#the-big-picture}

Materiały źródłowe dla API Kubernetesa oraz komponentów `kube-*`, takich jak
`kube-apiserver`, `kube-controller-manager`, są automatycznie generowane z kodu
źródłowego w [głównym repozytorium Kubernetes](https://github.com/kubernetes/kubernetes/).

Kiedy zauważysz błędy w wygenerowanej dokumentacji, możesz
rozważyć stworzenie poprawki, aby naprawić je w projekcie źródłowym.

## Sklonuj repozytorium Kubernetesa {#clone-the-kubernetes-repository}

Jeśli nie posiadasz jeszcze repozytorium kubernetes/kubernetes, pobierz je teraz:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Określ katalog bazowy swojej kopii repozytorium
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes). Na przykład, jeśli
wykonywano wcześniejszy krok w celu pobrania tego repozytorium, to
twój katalog bazowy to `$GOPATH/src/github.com/kubernetes/kubernetes`.
Pozostałe kroki odnoszą się do twojego katalogu bazowego jako `<k8s-base>`.

Określ katalog główny swojego klonu repozytorium
[kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs). Na
przykład, jeśli wykonałeś wcześniejszy krok, aby pobrać repozytorium, twój
katalog główny to `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
Pozostałe kroki odnoszą się do twojego katalogu głównego jako `<rdocs-base>`.

## Edytowanie kodu źródłowego Kubernetesa {#edit-the-kubernetes-source-code}

Dokumentacja materiałów źródłowych API Kubernetesa jest automatycznie
generowana z specyfikacji OpenAPI, która jest tworzona na podstawie kodu źródłowego
Kubernetesa. Jeśli chcesz zmienić dokumentację materiałów
źródłowych API, pierwszym krokiem jest zmiana w kodzie źródłowym Kubernetesa.

Dokumentacja dla komponentów `kube-*` jest także generowana z
oryginalnego kodu źródłowego. Musisz zmienić kod związany z
komponentem, który chcesz naprawić, aby naprawić generowaną dokumentację.

### Wprowadź zmiany do kodu źródłowego w repozytorium głównym {#make-changes-to-the-upstream-source-code}

{{< note >}}
Poniższe kroki są przykładowe, nie stanowią ogólnej
procedury. Szczegóły w Twojej sytuacji będą się różnić.
{{< /note >}}

Oto przykład edytowania komentarza w kodzie źródłowym Kubernetesa.

W swoim lokalnym repozytorium kubernetes/kubernetes,
przełącz się na domyślną gałąź i upewnij się, że jest aktualna:

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

Przypuśćmy, że ten plik źródłowy w tej domyślnej gałęzi zawiera literówkę "atmost":

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

W swoim lokalnym środowisku otwórz plik `types.go` i zmień "atmost" na "at most".

Zweryfikuj, czy zmieniłeś plik:

```shell
git status
```

Wynik pokazuje, że znajdujesz się na gałęzi
głównej, a plik źródłowy `types.go` został zmodyfikowany:

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

### Zatwierdź swój edytowany plik {#commit-your-edited-file}

Uruchom `git add` i `git commit`, aby zatwierdzić zmiany, które do tej pory wprowadziłeś. W
kolejnym kroku wykonasz drugi commit. Ważne jest, aby utrzymać zmiany rozdzielone na dwa commity.

### Generowanie specyfikacji OpenAPI i powiązanych plików {#generate-the-openapi-spec-and-related-files}

Przejdź do `<k8s-base>` i uruchom te skrypty:

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

Uruchom `git status`, aby zobaczyć, co zostało wygenerowane.

```shell
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/openapi-spec/v3/apis__apps__v1_openapi.json
    modified:   pkg/generated/openapi/zz_generated.openapi.go
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

Sprawdź zawartość pliku `api/openapi-spec/swagger.json`, aby upewnić
się, że literówka została poprawiona. Na przykład, możesz uruchomić
`git diff -a api/openapi-spec/swagger.json`. Jest to ważne, ponieważ
`swagger.json` jest wejściem do drugiego etapu procesu generowania materiałów źródłowych.

Uruchom `git add` i `git commit`, aby zatwierdzić swoje zmiany. Teraz masz dwa commity: jeden, który
zawiera edytowany plik `types.go`, oraz drugi, który zawiera wygenerowaną specyfikację
OpenAPI i powiązane pliki. Zachowaj te dwa commity oddzielnie. To znaczy, nie łącz tych commitów.

Prześlij swoje zmiany jako [pull request](https://help.github.com/articles/creating-a-pull-request/)
do gałęzi
master w repozytorium [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Monitoruj swój pull
request (PR) i odpowiadaj na uwagi recenzentów w miarę
potrzeby. Kontynuuj monitorowanie swojego PR, aż zostanie ono scalone.

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) jest
przykładem pull requesta, który naprawia literówkę w kodzie źródłowym Kubernetesa.

{{< note >}}
Określenie właściwego pliku źródłowego do zmiany może być
skomplikowane. W podanym przykładzie, główny plik źródłowy znajduje się w
katalogu `staging` w repozytorium `kubernetes/kubernetes`. Jednak w Twojej
sytuacji katalog `staging` może nie być właściwym miejscem do jego
znalezienia. Aby uzyskać wskazówki, sprawdź pliki `README` w
repozytorium [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
oraz w powiązanych repozytoriach, takich jak
[kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{{< /note >}}

### Zrób cherry pick swojego commita do gałęzi wydania {#cherry-pick-your-commit-into-a-release-branch}

W poprzednim rozdziale edytowałeś plik w głównej gałęzi (master branch) i uruchomiłeś
skrypty, aby wygenerować specyfikację OpenAPI oraz powiązane pliki. Następnie przesłałeś swoje
zmiany w PR (ang. pull request) do głównej gałęzi repozytorium kubernetes/kubernetes. Teraz
załóżmy, że chcesz wprowadzić swoją zmianę także do gałęzi wydania (release branch). Na przykład,
załóżmy, że główna gałąź jest używana do opracowywania wersji Kubernetesa
{{< skew latestVersion >}}, a Ty chcesz wprowadzić swoją zmianę również do gałęzi release-{{< skew prevMinorVersion >}}.

Przypomnij sobie, że twój pull request zawiera dwa commity: jeden dla edycji `types.go` i jeden dla
plików wygenerowanych przez skrypty. Następnym krokiem jest zaproponowanie cherry pick twojego
pierwszego commita do gałęzi release-{{< skew prevMinorVersion >}}. Chodzi o to, aby cherry pickować commit,
który edytował `types.go`, ale nie commit, który zawiera wyniki uruchomienia skryptów. Instrukcje
znajdziesz w [Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

{{< note >}}
Propozycja cherry pick wymaga posiadania uprawnienia do ustawienia etykiety i
kamienia milowego w swoim PR (ang. pull request). Jeśli nie masz tych uprawnień,
będziesz musiał współpracować z kimś, kto może ustawić etykietę i kamień milowy za Ciebie.
{{< /note >}}

Kiedy masz w toku swój pull request dla zastosowania cherry picka ze swoim jednym
commitem do gałęzi release-{{< skew prevMinorVersion >}}, kolejnym krokiem jest uruchomienie tych
skryptów w gałęzi release-{{< skew prevMinorVersion >}} w swoim lokalnym środowisku.

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

Teraz dodaj commit do swojego pull requesta związanego z cherry pickiem, który
zawiera niedawno wygenerowaną specyfikację OpenAPI i powiązane pliki. Monitoruj
swojego pull requesta, aż zostanie scalony z gałęzią release-{{< skew prevMinorVersion >}}.

W tym momencie zarówno gałąź master, jak i gałąź release-{{< skew prevMinorVersion >}} mają zaktualizowany plik
`types.go` oraz zestaw wygenerowanych plików, które odzwierciedlają zmiany wprowadzone do `types.go`. Należy zauważyć, że
wygenerowana specyfikacja OpenAPI i inne wygenerowane pliki w gałęzi release-{{< skew prevMinorVersion >}} niekoniecznie są
takie same jak wygenerowane pliki w gałęzi master. Wygenerowane pliki w gałęzi release-{{< skew prevMinorVersion >}}
zawierają elementy API wyłącznie z Kubernetesa {{< skew prevMinorVersion >}}. Wygenerowane pliki w gałęzi master mogą
zawierać elementy API, które nie znajdują się w {{< skew prevMinorVersion >}}, ale są w trakcie rozwoju dla {{< skew latestVersion >}}.

## Generowanie opublikowanych materiałów źródłowych {#generate-the-published-reference-docs}

Poprzednia sekcja pokazała, jak edytować plik
źródłowy, a następnie generować kilka plików, w tym
`api/openapi-spec/swagger.json` w repozytorium
`kubernetes/kubernetes`. Plik `swagger.json` to plik definicji
OpenAPI używany do generowania materiałów źródłowych API.

Jesteś teraz gotowy do zapoznania się z przewodnikiem
[generowania materiałów źródłowych dla API Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-api/) ,
aby wygenerować [opublikowane materiały źródłowe API
Kubernetesa](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

## {{% heading "whatsnext" %}}

* [Generowanie materiałów źródłowych dla API Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generowanie materiałów źródłowych dla komponentów i narzędzi Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generowanie materiałów źródłowych dla poleceń `kubectl`](/docs/contribute/generate-ref-docs/kubectl/)
