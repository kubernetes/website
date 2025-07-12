---
title: API Kubernetesa
content_type: concept
weight: 40
description: >
  API Kubernetesa służy do odpytywania i zmiany stanu obiektów Kubernetesa.
  Sercem warstwy sterowania Kubernetesa jest serwer API i udostępniane po HTTP API. Przez ten serwer odbywa się komunikacja pomiędzy użytkownikami, różnymi częściami składowymi klastra oraz komponentami zewnętrznymi.
card:
  name: concepts
  weight: 30
---



<!-- overview -->

Sercem {{< glossary_tooltip text="warstwy sterowania" term_id="control-plane" >}}
Kubernetesa jest {{< glossary_tooltip text="serwer API" term_id="kube-apiserver" >}}.
Serwer udostępnia API poprzez HTTP, umożliwiając wzajemną
komunikację pomiędzy użytkownikami, częściami składowymi klastra i komponentami zewnętrznymi.

API Kubernetesa pozwala na sprawdzanie i zmianę stanu
obiektów (przykładowo: pody, _Namespaces_, _ConfigMaps_, _Events_).

Większość operacji może zostać wykonana poprzez interfejs
linii komend (CLI) [kubectl](/docs/reference/kubectl/) lub
inne programy, takie jak [kubeadm](/docs/reference/setup-tools/kubeadm/),
które używają API. Możesz też korzystać z API
bezpośrednio przez wywołania typu REST. Jeśli piszesz aplikację używającą
API Kubernetesa, warto rozważyć użycie jednej z
[bibliotek klienckich](/docs/reference/using-api/client-libraries/).

Każdy klaster Kubernetesa publikuje specyfikację dostępnych interfejsów API. Dostępne
są dwa mechanizmy udostępniania tych specyfikacji, które
umożliwiają automatyczną integrację i interoperacyjność z narzędziami zewnętrznymi.
Na przykład narzędzie `kubectl` pobiera i buforuje specyfikację API w celu
umożliwienia autouzupełniania wiersza poleceń i innych funkcji. Te dwa mechanizmy to:

- [Discovery API](#discovery-api) dostarcza informacji o interfejsach API
  Kubernetesa: nazwach API, zasobach, wersjach i obsługiwanych operacjach. W
  Kubernetesie ten termin ma szczególne znaczenie, ponieważ to odrębny
  interfejs od OpenAPI i jest traktowany jako osobna część systemu. Jest to zwięzłe
  podsumowanie dostępnych zasobów i nie obejmuje szczegółowych definicji
  schematów. Szczegółowe informacje o strukturze zasobów można znaleźć w dokumencie OpenAPI.

- [Kubernetes OpenAPI Document](#openapi-interface-definition)
  dostarcza (pełne) [schematy OpenAPI v2.0 i 3.0](https://www.openapis.org/)
  dla wszystkich endpointów API
  Kubernetesa. OpenAPI v3 to zalecany sposób uzyskiwania dostępu do
  specyfikacji API, ponieważ zapewnia pełniejszy i
  dokładniejszy obraz. Zawiera wszystkie ścieżki API oraz komplet danych
  wejściowych i wyjściowych dla każdej operacji na wszystkich endpointach.
  Specyfikacja obejmuje także wszystkie
  rozszerzenia wspierane przez klaster. Jest to pełna definicja API, która
  znacząco przewyższa pod względem szczegółowości dane z Discovery API.

## Discovery API {#discovery-api}

Kubernetes przez Discovery API udostępnia pełną listę obsługiwanych grup
API, ich wersji oraz zasobów. Dla każdego zasobu można uzyskać następujące dane:

- Nazwa
- Klaster lub zasięg w przestrzeni nazw
- URL endpointu oraz obsługiwane metody HTTP
- Alternatywne nazwy
- Grupa, wersja, typ

API jest dostępne zarówno w formie zagregowanej, jak i niezagregowanej.
W trybie zagregowanym Discovery API udostępnia dwa endpointy, natomiast
w trybie niezagregowanym jest to oddzielny endpoint dla każdej wersji grupy.

### Zagregowane Discovery API {#aggregated-discovery}

{{< feature-state feature_gate_name="AggregatedDiscoveryEndpoint" >}}

Kubernetes zapewnia stabilne wsparcie dla zagregowanego
Discovery API, publikując wszystkie zasoby obsługiwane przez klaster za
pośrednictwem dwóch endpointów (`/api` i `/apis`).
Korzystanie z tych endpointów znacząco ogranicza liczbę zapytań
potrzebnych do pobrania danych z klastra. Dostęp do tych danych
uzyskuje się, wysyłając żądanie na odpowiedni endpoint z
nagłówkiem `Accept`, który wskazuje na zagregowany zasób Discovery:
`Accept: application/json;v=v2;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`.

W przypadku braku nagłówka `Accept` wskazującego
typ zasobu, zapytania do endpointów `/api` i
`/apis` zwracają domyślnie dane w formacie niezagregowanym.

[Discovery document](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2.json)
znajduje się w oficjalnym repozytorium
GitHub Kubernetesa. Może on służyć jako odniesienie do podstawowego zestawu zasobów
dostępnych w Kubernetesie, gdy nie masz możliwości wykonania zapytania do rzeczywistego klastra.

Endpoint obsługuje także mechanizm ETag oraz możliwość przesyłania danych w formacie protobuf.

### Niezagregowane Discovery API {#unaggregated-discovery}

W przypadku braku agregacji Discovery API, dane udostępniane są w strukturze
wielopoziomowej, w której główne endpointy publikują informacje prowadzące do podrzędnych dokumentów.

Wszystkie wersje grup API dostępnych w klastrze są
udostępniane pod endpointami /api i /apis. Oto przykład:

```
{
  "kind": "APIGroupList",
  "apiVersion": "v1",
  "groups": [
    {
      "name": "apiregistration.k8s.io",
      "versions": [
        {
          "groupVersion": "apiregistration.k8s.io/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apiregistration.k8s.io/v1",
        "version": "v1"
      }
    },
    {
      "name": "apps",
      "versions": [
        {
          "groupVersion": "apps/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apps/v1",
        "version": "v1"
      }
    },
    ...
}
```

Żeby pobrać informacje o zasobach dostępnych w konkretnej
wersji API, trzeba wysłać osobne zapytanie pod
`/apis/<group>/<version>` - np. `/apis/rbac.authorization.k8s.io/v1alpha1`. Ten
endpoint zawiera listę typów zasobów w danej grupie. Używa go
polecenie kubectl, żeby dowiedzieć się, jakie zasoby są dostępne w klastrze.

<!-- body -->

<a id="#api-specification" />

## Interfejs OpenAPI {#openapi-interface-definition}

Pełną specyfikację API udokumentowano za pomocą [OpenAPI](https://www.openapis.org/).

Kubernetes obsługuje zarówno OpenAPI 2.0, jak i 3.0. Wersja
3 jest preferowana, ponieważ umożliwia
dokładniejszy i kompletny opis zasobów (bez utraty
informacji). W OpenAPI 2 niektóre pola, np. `default`,
`nullable`, `oneOf`, są pomijane z powodu ograniczeń formatu.
### OpenAPI V2 {#openapi-v2}

Serwer API Kubernetesa udostępnia specyfikację
OpenAPI poprzez ścieżkę `/openapi/v2`. Aby wybrać
format odpowiedzi, użyj nagłówków żądania zgodnie z tabelą:

<table>
<caption style="display:none">Dopuszczalne wartości nagłówka żądania dla zapytań OpenAPI v2</caption>
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
</table>

{{< warning >}}
Reguły walidacyjne publikowane w ramach schematów OpenAPI mogą być niekompletne – i zazwyczaj nie
zawierają wszystkich warunków. Dodatkowa walidacja realizowana jest przez serwer API. Aby uzyskać pełną i
precyzyjną weryfikację, zaleca się użycie polecenia `kubectl apply --dry-run=server`, które uruchamia wszystkie
mechanizmy walidacji, również te wykonujące się podczas przyjmowania zasobów do klastra (ang. admission checks).
{{< /warning >}}

### OpenAPI V3 {#openapi-v3}

{{< feature-state feature_gate_name="OpenAPIV3" >}}

Kubernetes publikuje własne API zgodnie ze specyfikacją OpenAPI v3.

Pod adresem `/openapi/v3` można znaleźć listę wszystkich
dostępnych grup/wersji. Zwracane wartości są dostępne tylko w formacie
JSON. Grupy/wersje opisane są następującym schematem:

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

Względne adresy URL wskazują na niezmieniające się opisy OpenAPI, aby umożliwić
trzymanie cache po stronie klienta. Serwer API zwraca
również odpowiednie nagłówki HTTP dla cache (`Expires` ustawione na 1 rok wprzód,
`Cache-Control` jako `immutable`). Wysłanie zapytania do
nieaktualnego URL spowoduje przekierowanie przez serwer API do wersji najnowszej.

Serwer API Kubernetesa udostępnia specyfikację
OpenAPI v3 pod adresem `/openapi/v3/apis/<group>/<version>?hash=<hash>`,
zgodnie z podziałem na grupy i wersje.

Tabela poniżej podaje dopuszczalne wartości nagłówków żądania.

<table>
  <caption style="display:none">Dopuszczalne wartości nagłówka żądania dla zapytań OpenAPI v3</caption>
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
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
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
</table>

W pakiecie [`k8s.io/client-go/openapi3`](https://pkg.go.dev/k8s.io/client-go/openapi3)
znajduje się implementacja w Golang do pobierania OpenAPI V3.

Kubernetes {{< skew currentVersion >}} publikuje OpenAPI w wersji
2.0 i 3.0; nie ma planów wsparcia wersji 3.1 w najbliższej przyszłości.

### Serializacja Protobuf {#protobuf-serialization}

Kubernetes implementuje alternatywny format serializacji oparty na
Protobuf, który jest głównie przeznaczony do komunikacji w obrębie klastra. Aby
uzyskać więcej informacji na temat tego formatu, zobacz
[Kubernetes Protobuf serialization](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md) propozycję
projektową oraz pliki Interface Definition Language
(IDL) dla każdego schematu znajdujące się w pakietach Go, które definiują obiekty API.

## Przechowywanie stanu {#persistence}

Kubernetes przechowuje serializowany stan swoich
obiektów w {{< glossary_tooltip term_id="etcd" >}}.

## Grupy i wersje API {#api-groups-and-versioning}

Aby ułatwić usuwanie poszczególnych pól lub restrukturyzację reprezentacji
zasobów, Kubernetes obsługuje równocześnie wiele wersji API, każde poprzez osobną
ścieżkę API, na przykład: `/api/v1` lub `/apis/rbac.authorization.k8s.io/v1alpha1`.

Rozdział wersji wprowadzony jest na poziomie całego API, a nie na poziomach
poszczególnych zasobów lub pól, aby być pewnym, że API odzwierciedla w sposób
przejrzysty i spójny zasoby systemowe i ich zachowania  oraz pozwala na
kontrolowany dostęp do tych API, które są w fazie wycofywania lub fazie eksperymentalnej.

Aby ułatwić rozbudowę API Kubernetes, wprowadziliśmy
[*grupy API*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md), które mogą
być [włączane i wyłączane](/docs/reference/using-api/#enabling-or-disabling).

Zasoby API są rozróżniane poprzez przynależność do grupy API, typ zasobu,
przestrzeń nazw (_namespace_, o ile ma zastosowanie) oraz nazwę. Serwer API może przeprowadzać
konwersję między różnymi wersjami API w sposób niewidoczny dla użytkownika:
wszystkie te różne wersje reprezentują w rzeczywistości ten sam zasób.
Serwer API może udostępniać te same dane poprzez kilka różnych wersji API.

Załóżmy przykładowo, że istnieją dwie wersje `v1` i `v1beta1` tego
samego zasobu. Obiekt utworzony przez wersję `v1beta1` może być
odczytany, zaktualizowany i skasowany zarówno przez wersję `v1beta1`,
jak i `v1`, do czasu aż wersja `v1beta1` będzie przestarzała i
usunięta. Wtedy możesz dalej korzystać i modyfikować obiekt poprzez wersję `v1`.

### Zmiany w API {#api-changes}

Z naszego doświadczenia wynika, że każdy system, który odniósł sukces, musi się nieustająco rozwijać w
miarę zmieniających się potrzeb. Dlatego Kubernetes został tak zaprojektowany, aby API mogło się zmieniać i
rozrastać. Projekt Kubernetes dąży do tego, aby nie wprowadzać zmian niezgodnych z istniejącymi aplikacjami
klienckimi i utrzymywać zgodność przez wystarczająco długi czas, aby inne projekty zdążyły się dostosować do zmian.

W ogólności, nowe zasoby i pola definiujące zasoby API są dodawane
stosunkowo często. Usuwanie zasobów lub pól jest regulowane przez
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).

Po osiągnięciu przez API statusu ogólnej dostępności (_general availability_ - GA), oznaczanej
zazwyczaj jako wersja API `v1`, bardzo zależy nam na utrzymaniu jej zgodności w kolejnych wydaniach.
Dodatkowo, Kubernetes zachowuje kompatybilność z danymi zapisanymi za pomocą wersji _beta_. Gdy dana
funkcja osiąga stabilność (GA), dane te mogą być automatycznie konwertowane i dostępne w docelowej wersji API.

Jeśli korzystasz z wersji beta API, musisz przejść na kolejną wersję beta lub stabilną, gdy
dana wersja zostanie wycofana. Najlepszy moment na migrację to okres wycofywania
wersji beta - wtedy obiekty są dostępne równocześnie w obu wersjach API. Po zakończeniu
tego okresu wersja beta przestaje być obsługiwana i konieczne jest użycie wersji docelowej.

{{< note >}}
Mimo, że Kubernetes stara się także zachować zgodność dla API w wersji _alpha_, zdarzają się przypadki, kiedy
nie jest to możliwe. Jeśli korzystasz z API w wersji alfa, przed aktualizacją klastra do nowej wersji zalecamy
sprawdzenie w informacjach o wydaniu, czy nie nastąpiła jakaś zmiana w tej części API. Może się okazać, że API
uległo niekompatybilnym zmianom, co wymaga usunięcia wszystkich istniejących obiektów alfa przed wykonaniem aktualizacji.
{{< /note >}}

Zajrzyj do [API versions reference](/docs/reference/using-api/#api-versioning)
po szczegółowe definicje różnych poziomów wersji API.

## Rozbudowa API {#api-extension}

API Kubernetesa można rozszerzać na dwa sposoby:

1. [Definicje zasobów własnych (_custom resources_)](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   pozwalają deklaratywnie określać, jak serwer API powinien dostarczać wybrane przez Ciebie zasoby API.
1. Można także rozszerzać API Kubernetesa implementując
   [warstwę agregacji](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

## {{% heading "whatsnext" %}}

- Naucz się, jak rozbudowywać API Kubernetesa poprzez dodawanie własnych
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Controlling Access To The Kubernetes API](/docs/concepts/security/controlling-access/)
  opisuje sposoby, jakimi klaster zarządza dostępem do API.
- Punkty dostępowe API _(endpoints)_, typy zasobów i przykłady zamieszczono
  w [API Reference](/docs/reference/kubernetes-api/).
- Aby dowiedzieć się, jaki rodzaj zmian można określić jako zgodne i jak zmieniać API, zajrzyj do
  [API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).
