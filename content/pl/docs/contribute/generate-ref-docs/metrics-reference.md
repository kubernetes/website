---
title: Generowanie materiałów źródłowych dla metryk
content_type: task
weight: 100
---

<!-- overview -->

Ta strona demonstruje generowanie materiałów źródłowych dotyczących metryk.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Sklonuj repozytorium Kubernetesa {#clone-the-kubernetes-repository}

Generowanie metryk odbywa się w repozytorium Kubernetesa. Aby
sklonować repozytorium, przejdź do katalogu, w którym chcesz, aby klon istniał.

Następnie wykonaj następujące polecenie:

```shell
git clone https://www.github.com/kubernetes/kubernetes 
```

To tworzy folder `kubernetes` w bieżącym katalogu roboczym.

## Generowanie metryk {#generate-the-metrics}

W sklonowanym repozytorium Kubernetesa
zlokalizuj katalog `test/instrumentation/documentation`.
Dokumentacja metryk jest generowana w tym katalogu.

Przy każdej wersji dodawane są nowe metryki. Po
uruchomieniu skryptu generatora dokumentacji metryk,
skopiuj dokumentację metryk na stronę internetową
Kubernetesa i opublikuj zaktualizowaną dokumentację metryk.

Aby wygenerować najnowsze metryki, upewnij się, że znajdujesz się w katalogu
głównym sklonowanego katalogu Kubernetesa. Następnie wykonaj następujące polecenie:

```shell
./test/instrumentation/update-documentation.sh
```

Aby sprawdzić zmiany, wykonaj:

```shell
git status
```

Wynik jest podobny do:

```
./test/instrumentation/documentation/documentation.md
./test/instrumentation/documentation/documentation-list.yaml
```

## Skopiuj wygenerowany plik dokumentacji metryk do repozytorium strony internetowej Kubernetesa {#copy-the-generated-metrics-documentation-file-to-the-kubernetes-website-repository}

1. Ustaw zmienną środowiskową głównego katalogu strony Kubernetesa.

   Wykonaj następujące polecenie, aby ustawić główny katalog witryny:

   ```shell
   export WEBSITE_ROOT=<path to website root>
   ```

2. Skopiuj wygenerowany plik metryk do repozytorium witryny Kubernetesa.

   ```shell
   cp ./test/instrumentation/documentation/documentation.md "${WEBSITE_ROOT}/content/en/docs/reference/instrumentation/metrics.md"
   ```

   {{< note >}}
   Jeśli pojawi się błąd, sprawdź, czy masz uprawnienia do skopiowania
   pliku. Możesz użyć `chown`, aby zmienić własność pliku na swojego użytkownika.
   {{< /note >}}

## Utwórz pull requesta {#create-a-pull-request}

Aby utworzyć pull request, postępuj zgodnie z instrukcjami w [Otwarcie pull requesta](/docs/contribute/new-content/open-a-pr/).

## {{% heading "whatsnext" %}}

* [Współpraca z głównym projektem](/docs/contribute/generate-ref-docs/contribute-upstream/)
* [Generowanie materiałów źródłowych dla komponentów i narzędzi Kubernetesa](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generowanie materiałów źródłowych dla poleceń kubectl](/docs/contribute/generate-ref-docs/kubectl/)
