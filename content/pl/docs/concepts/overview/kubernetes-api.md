---
title: API Kubernetes
content_template: templates/concept
weight: 30
card:
  name: concepts
  weight: 30
---

{{% capture overview %}}

Ogólne reguły dotyczące API opisane są w dokumentacji [API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

Punkty dostępowe *(endpoints)* API, typy zasobów oraz przykłady są dostępne w [API Reference](/docs/reference).

Zdalny dostęp do API omówiono w dokumentacji [Controlling API Access](/docs/reference/access-authn-authz/controlling-access/).

API Kubernetes to także podstawa deklaratywnego schematu konfiguracji dla systemu. Obiekty API mogą być tworzone, zmieniane, kasowane i odpytywane sa pomocą narzędzia linii poleceń [kubectl](/docs/reference/kubectl/overview/).

Kubernetes przechowuje także swój serializowany stan (obecnie w [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/)) w postaci obiektów API.

Kubernetes jako taki składa się z wielu elementów składowych, które komunikują się ze sobą poprzez swoje API.

{{% /capture %}}


{{% capture body %}}

## Zmiany w API

Z naszego doświadczenia wynika, że każdy system, który odniósł sukces, musi się nieustająco rozwijać w miarę zmieniających się potrzeb. Dlatego oczekujemy, że API też będzie się zmieniało i rozrastało. W dłuższym horyzoncie nie planujemy jednak żadnych zmian, które mogą być niezgodne z istniejącymi klientami. W ogólności, nowe zasoby i pola definiujące zasoby API są dodawane stosunkowo często. Usuwanie zasobów lub pól jest regulowane przez [API deprecation policy](/docs/reference/using-api/deprecation-policy/).

Definicja zmiany zgodnej (kompatybilnej) oraz metody wprowadzania zmian w API opisano w szczegółach w [API change document](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md).

## Definicje OpenAPI i Swagger

Pełne szczegóły API są udokumentowane zgodnie z [OpenAPI](https://www.openapis.org/).

Począwszy od Kubernetes w wersji 1.10, serwer Kubernetes API dostarcza specyfikację OpenAPI poprzez punkt końcowy `/openapi/v2`.
Wymagany format określa się w nagłówkach HTTP:

Nagłówek | Dopuszczalne wartości
------ | ---------------
Accept | `application/json`, `application/com.github.proto-openapi.spec.v2@v1.0+protobuf` (domyślnie content-type to `application/json` dla `*/*` lub pominięcie tego nagłówka)
Accept-Encoding | `gzip` (pominięcie nagłówka jest dozwolone)

W wersjach wcześniejszych niż 1.14, punkty końcowe określone przez ich format (`/swagger.json`, `/swagger-2.0.0.json`, `/swagger-2.0.0.pb-v1`, `/swagger-2.0.0.pb-v1.gz`) udostępniały specyfikację OpenAPI zgodnie z tymi formatami. Te punkty końcowe były stopniowo wycofywane i ostatecznie usunięte w wersji 1.14 Kubernetes.

**Przykłady pobierania specyfikacji OpenAPI**:

Przed 1.10 | Kubernetes 1.10 i nowszy
----------- | -----------------------------
GET /swagger.json | GET /openapi/v2 **Accept**: application/json
GET /swagger-2.0.0.pb-v1 | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf
GET /swagger-2.0.0.pb-v1.gz | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf **Accept-Encoding**: gzip

W Kubernetes zaimplementowany jest alternatywny format serializacji na potrzeby API oparty o Protobuf, który jest przede wszystkim przeznaczony na potrzeby wewnętrznej komunikacji w klastrze i opisany w [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md). Pliki IDL dla każdego ze schematów można znaleźć w pakietach Go, które definiują obiekty API.

Przed wersją 1.14, apiserver Kubernetes udostępniał też specyfikację API [Swagger v1.2](http://swagger.io/) poprzez `/swaggerapi`.
Ten punkt końcowy został skierowany do wycofania i ostatecznie usunięty w wersji Kubernetes 1.14.

## Obsługa wersji API

Aby ułatwić usuwanie poszczególnych pól lub restrukturyzację reprezentacji zasobów, Kubernetes obsługuje równocześnie wiele wersji API, każde poprzez osobną ścieżkę API, na przykład: `/api/v1` lub
`/apis/extensions/v1beta1`.

Zdecydowaliśmy się na rozdział wersji na poziomie całego API, a nie na poziomie poszczególnych zasobów lub pól, aby być pewnym, że API odzwierciedla w sposób przejrzysty i spójny zasoby systemowe i ich zachowania i pozwala na kontrolowany dostęp do tych API, które są w fazie wycofywania lub fazie eksperymentalnej. Schematy serializacji JSON i Protobuf stosują się do tych samych reguł wprowadzania zmian schematów — cały opis poniżej odnosi się do obydwu z nich.

Należy mieć na uwadze, że wersje API i wersje oprogramowania są powiązane ze sobą w sposób niebezpośredni. [API and release
versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) opisuje związki pomiędzy zarządzaniem wersjami API i oprogramowania.

Różne wersje API oznaczają inną stabilność i poziom wsparcia. Kryteria dla każdego z tych poziomów opisano szczegółowo w [API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions). Podsumowanie zamieszczono poniżej poniżej:

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
  - Schemat lub semantyka obiektu może się zmienić w sposób niezgodny z poprzednimi wersjami w następnych wydaniach beta lub stabilnych. Jeśli taka zmiana będzie miała miejsce, dostarczymy instrukcję migracji do kolejnej wersji. Możemy wymagać skasowania, zmiany i odtworzenia obiektów API. Proces zmiany może wymagać dodatkowych wstępnych analiz. W czasie wprowadzania zmian mogą wystąpić przerwy w dostępności aplikacji, które z tej funkcjonalności korzystają.
  - Rekomendowane tylko dla zastosowań niekrytycznych dla biznesu ze względu na potencjalnie niezgodne zmiany w kolejnych wersjach oprogramowania. Jeśli masz wiele klastrów, które mogą być aktualizowane niezależnie, można to ograniczenie pominąć.
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

API może być rozbudowane na dwa sposoby przy użyciu [custom resources](/docs/concepts/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   jest przewidziana dla użytkowników z minimalnymi wymaganiami CRUD.
1. Użytkownicy, którzy potrzebują pełnej semantyki API Kubernetes, mogą zaimplementować własny apiserver
   i użyć [agregatora](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/),
   aby zintegrować je w sposób niezauważalny dla klientów.

## Włączanie i wyłączanie grup API

Określone zasoby i grupy API są włączone domyślnie. Włączanie i wyłączanie odbywa się poprzez ustawienie `--runtime-config`
w apiserwerze. `--runtime-config` przyjmuje wartości oddzielane przecinkami. Przykładowo, aby wyłączyć batch/v1, należy ustawić
`--runtime-config=batch/v1=false`, aby włączyć batch/v2alpha1, należy ustawić `--runtime-config=batch/v2alpha1`.
Ta opcja przyjmuje rozdzielony przecinkami zbiór par klucz=wartość, który opisuje konfigurację wykonawczą apiserwera.

{{< note >}}Włączenie lub wyłączenie grup lub zasobów wymaga restartu apiserver i controller-manager, aby zmiany w `--runtime-config` zostały wprowadzone.{{< /note >}}

## Jak włączać dostęp do grup zasobów extensions/v1beta1

DaemonSets, Deployments, HorizontalPodAutoscalers, Ingresses, Jobs i ReplicaSets znajdują się w grupie API `extensions/v1beta1` i są domyślnie włączone.
Przykładowo: aby włączyć deployments i daemonsets, ustaw
`--runtime-config=extensions/v1beta1/deployments=true,extensions/v1beta1/daemonsets=true`.

{{< note >}}Włączanie i wyłączanie pojedynczych zasobów możliwe jest jedynie w ramach grupy API `extensions/v1beta1` z przyczyn historycznych{{< /note >}}

{{% /capture %}}
