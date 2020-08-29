---
title: API Kubernetes
content_type: concept
weight: 30
description: >
  API Kubernetesa służy do odpytywania i zmiany stanu obiektów Kubernetesa.
  Sercem warstwy sterowania Kubernetesa jest serwer API i udostępniane przez niego HTTP API. Przez ten serwer odbywa się komunikacja pomiędzy użytkownikami, różnymi częściami składowymi klastra oraz komponentami zewnętrznymi.
card:
  name: concepts
  weight: 30
---

<!-- overview -->

Sercem {{< glossary_tooltip text="warstwy sterowania" term_id="control-plane" >}} Kubernetes
jest {{< glossary_tooltip text="serwer API" term_id="kube-apiserver" >}}. Serwer udostępnia
API poprzez HTTP, umożliwiając wzajemną komunikację pomiędzy użytkownikami, częściami składowymi klastra i komponentami zewnętrznymi.

API Kubernetes pozwala na sprawdzanie i zmianę stanu obiektów (przykładowo: pody, _Namespaces_, _ConfigMaps_, _Events_).

Punkt dostępowe _(endpoints)_ API, typy zasobów i przykłady opisane są w [API Reference](/docs/reference/kubernetes-api/).

<!-- body -->

## Zmiany w API

Jednym z wymagań, które odnoszą się do każdego systemu, który odniósł sukces, jest zdolność do rozwoju i ewolucji w miarę pojawiających się i zmieniających potrzeb.
Dlatego Kubernetes został zaprojektowany tak, aby umożliwić ciągły rozwój i zmiany w API.
Celem projektu Kubernetes jest _zachowanie_ zgodności z istniejącymi klientami i utrzymanie tej zgodności
przez odpowiednio długi czas, pozwalający innym projektom na stopniowe dostosowanie.

W skrócie, nowe zasoby API i nowe pola dla konkretnych zasobów mogą być dodawane stosunkowo często.
Usunięcie zasobów lub pól wymaga stosowania
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).

Szczegółowe objaśnienia, jak wygląda zmiana, która zachowuje zgodność i jak zmieniać API, znajdują się w dokumencie
[API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).

## Specyfikacja OpenAPI {#api-specification}

Pełną specyfikację API udokumentowano za pomocą [OpenAPI](https://www.openapis.org/).

Serwer API Kubernetes API udostępnia specyfikację OpenAPI poprzez ścieżkę `/openapi/v2`.
Aby wybrać format odpowiedzi, użyj nagłówków żądania zgodnie z:

<table>
  <thead>
     <tr>
        <th>Nagłówek</th>
        <th style="min-width: 50%;">Dopuszczalne wartości</th>
        <th>Uwagi</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>pominięcie tego nagłówka jest dozwolone</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>głównie do celu komunikacji wewnątrz klastra</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>domyślne</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>udostępnia </em><code>application/json</code></td>
     </tr>
  </tbody>
  <caption>Dozwolone nagłówki żądań dla zapytania OpenAPI v2</caption>
</table>

W Kubernetes zaimplementowany jest alternatywny format serializacji na potrzeby API oparty o Protobuf, który jest przede wszystkim przeznaczony na potrzeby wewnętrznej komunikacji w klastrze i opisany w [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md). Pliki IDL dla każdego ze schematów można znaleźć w pakietach Go, które definiują obiekty API.

## Obsługa wersji API

Aby ułatwić usuwanie poszczególnych pól lub restrukturyzację reprezentacji zasobów, Kubernetes obsługuje
równocześnie wiele wersji API, każde poprzez osobną ścieżkę API, na przykład: `/api/v1` lub
`/apis/rbac.authorization.k8s.io/v1alpha1`.

Zdecydowaliśmy się na rozdział wersji na poziomie całego API, a nie na poziomie poszczególnych zasobów lub pól, aby być pewnym,
że API odzwierciedla w sposób przejrzysty i spójny zasoby systemowe i ich zachowania i pozwala
na kontrolowany dostęp do tych API, które są w fazie wycofywania lub fazie eksperymentalnej.

Schematy serializacji JSON i Protobuf stosują się do tych samych reguł wprowadzania zmian schematów — cały opis poniżej odnosi się do obydwu z nich.

Należy mieć na uwadze, że wersje API i wersje oprogramowania są powiązane ze sobą w sposób niebezpośredni. Proponowany
[Kubernetes Release Versioning](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) opisuje związki pomiędzy zarządzaniem wersjami API i oprogramowania.

Różne wersje API oznaczają inną stabilność i poziom wsparcia. Kryteria dla każdego z tych poziomów opisano szczegółowo
w [API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions).
Podsumowanie zamieszczono poniżej:

- Poziom Alfa:
  - Nazwa wersji zawiera słowo `alpha` (np. `v1alpha1`).
  - Może zawierać błędy. Włączenie tej funkcjonalności może wyeksponować różne błędy. Domyślnie jest wyłączona.
  - Wsparcie dla tej funkcjonalności może być zakończone w dowolnej chwili bez uprzedniego powiadomienia.
  - W kolejnych wersjach API może zostać zmienione w sposób niezgodny z wersjami wcześniejszymi.
  - Rekomendowana do użycia tylko na często przebudowywanych klastrach testowych ze względu na duże ryzyko wystąpienia błędów i brak gwarancji  wsparcia w dalszym horyzoncie.
- Poziom Beta:
  - Nazwa wersji zawiera słowo `beta` (np. `v2beta3`).
  - Oprogramowanie jest dobrze przetestowane. Włączenie tej funkcjonalności uznaje się za bezpieczne. Funkcjonalność domyślnie włączona.
  - Wsparcie dla funkcjonalności będzie utrzymywane, choć może zmieniać się w niektórych szczegółach.
  - Schemat lub semantyka obiektu może się zmienić w sposób niezgodny z poprzednimi wersjami w następnych wydaniach beta lub stabilnych. Jeśli taka zmiana będzie miała miejsce,
    dostarczymy instrukcję migracji do kolejnej wersji. Możemy wymagać skasowania, zmiany i odtworzenia obiektów API.
    Proces zmiany może wymagać dodatkowych wstępnych analiz. W czasie wprowadzania zmian mogą wystąpić przerwy w dostępności aplikacji, które z tej funkcjonalności korzystają.
  - Rekomendowane tylko dla zastosowań niekrytycznych dla biznesu ze względu na potencjalnie niezgodne zmiany w kolejnych wersjach oprogramowania.
    Jeśli masz wiele klastrów, które mogą być aktualizowane niezależnie, można to ograniczenie pominąć.
  - **Testuj nasze funkcjonalności w fazie beta i zgłaszaj swoje uwagi! Po wyjściu z fazy beta, możemy nie mieć już możliwości — ze względów praktycznych — wprowadzać w nich żadnych zmian.**
- Poziom Stabilny:
  - Nazwa wersji jest w postaci `vX`, gdzie `X` jest liczbą naturalną.
  - Stabilne funkcjonalności będą dostępne w wielu kolejnych wersjach oprogramowania.

## Grupy API

Aby ułatwić rozbudowę API Kubernetes, wprowadziliśmy [*grupy API*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md).
Grupa API jest określona przez ścieżkę API i pole `apiVersion` serializowanego obiektu.

Obecne w użyciu jest kilka grup API:

1. Grupa *podstawowa* (*core*), nazywana także *legacy group*, jest dostępna przez ścieżkę REST `/api/v1` i używa `apiVersion: v1`.

1. Nazwane grupy udostępnione są przez ścieżkę REST `/apis/$GROUP_NAME/$VERSION` i używają `apiVersion: $GROUP_NAME/$VERSION`
   (np. `apiVersion: batch/v1`). Pełna lista wpieranych grup API jest dostępna w [Kubernetes API reference](/pl/docs/reference/).

API może być rozbudowane na dwa sposoby przy użyciu [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   jest przewidziana dla użytkowników z minimalnymi wymaganiami CRUD.
1. Użytkownicy, którzy potrzebują pełnej semantyki API Kubernetes, mogą zaimplementować własny apiserver
   i użyć [agregatora](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/),
   aby zintegrować je w sposób niezauważalny dla klientów.

## Włączanie i wyłączanie grup API

Określone zasoby i grupy API są włączone domyślnie. Włączanie i wyłączanie odbywa się poprzez ustawienie `--runtime-config`
w kube-apiserver.

`--runtime-config` przyjmuje wartości oddzielane przecinkami. Przykładowo, aby wyłączyć batch/v1, należy ustawić
`--runtime-config=batch/v1=false`, aby włączyć batch/v2alpha1, należy ustawić `--runtime-config=batch/v2alpha1`.
Ta opcja przyjmuje rozdzielony przecinkami zbiór par klucz=wartość, który opisuje konfigurację wykonawczą serwera API.

{{< note >}}Włączenie lub wyłączenie grup lub zasobów wymaga restartu kube-apiserver i kube-controller-manager,
aby zmiany w `--runtime-config` zostały wprowadzone.{{< /note >}}

## Trwałość

Kubernetes przechowuje swój stan w postaci serializowanej jako zasoby API zapisywane w
{{< glossary_tooltip term_id="etcd" >}}.

## {{% heading "whatsnext" %}}

[Controlling API Access](/docs/reference/access-authn-authz/controlling-access/) opisuje
sposoby, jakimi klaster zarządza dostępem do API.

Ogólne wytyczne dotyczące API opisano w
[API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions).

Punkty dostępowe API _(endpoints)_, typy zasobów i przykłady zamieszczono w [API Reference](/docs/reference/kubernetes-api/).
