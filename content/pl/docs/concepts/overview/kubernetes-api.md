---
title: API Kubernetesa
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

Większość operacji może zostać wykonana poprzez
interfejs linii komend (CLI) [kubectl](/docs/reference/kubectl/overview/) lub inne
programy, takie jak [kubeadm](/docs/reference/setup-tools/kubeadm/), które używają
API. Możesz też korzystać z API bezpośrednio przez wywołania typu REST.

Jeśli piszesz aplikację używającą API Kubernetesa,
warto rozważyć użycie jednej z [bibliotek klienckich](/docs/reference/using-api/client-libraries/).

<!-- body -->

## Specyfikacja OpenAPI {#api-specification}

Pełną specyfikację API udokumentowano za pomocą [OpenAPI](https://www.openapis.org/).

Serwer API Kubernetes API udostępnia specyfikację OpenAPI poprzez ścieżkę `/openapi/v2`.
Aby wybrać format odpowiedzi, użyj nagłówków żądania zgodnie z tabelą:

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

W Kubernetesie zaimplementowany jest alternatywny format serializacji na potrzeby API oparty o Protobuf,
który jest przede wszystkim przeznaczony na potrzeby wewnętrznej komunikacji w klastrze
i opisany w [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md).
Pliki IDL dla każdego ze schematów można znaleźć w pakietach Go, które definiują obiekty API.

## Zmiany API

Z naszego doświadczenia wynika, że każdy system, który odniósł sukces, musi się nieustająco rozwijać w miarę zmieniających się potrzeb.
Dlatego Kubernetes został tak zaprojektowany, aby API mogło się zmieniać i rozrastać.
Projekt Kubernetes dąży do tego, aby nie wprowadzać zmian niezgodnych z istniejącymi aplikacjami klienckimi
i utrzymywać zgodność przez wystarczająco długi czas, aby inne projekty zdążyły się dostosować do zmian.

W ogólności, nowe zasoby i pola definiujące zasoby API są dodawane stosunkowo często. Usuwanie zasobów lub pól
jest regulowane przez [API deprecation policy](/docs/reference/using-api/deprecation-policy/).
Definicja zmiany zgodnej (kompatybilnej) oraz metody wprowadzania zmian w API opisano w szczegółach
w [API change document](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md).

## Grupy i wersje API

Aby ułatwić usuwanie poszczególnych pól lub restrukturyzację reprezentacji zasobów, Kubernetes obsługuje
równocześnie wiele wersji API, każde poprzez osobną ścieżkę API, na przykład: `/api/v1` lub
`/apis/rbac.authorization.k8s.io/v1alpha1`.

Rozdział wersji wprowadzony jest na poziomie całego API, a nie na poziomach poszczególnych zasobów lub pól, aby być pewnym,
że API odzwierciedla w sposób przejrzysty i spójny zasoby systemowe i ich zachowania i pozwala
na kontrolowany dostęp do tych API, które są w fazie wycofywania lub fazie eksperymentalnej.

Aby ułatwić rozbudowę API Kubernetes, wprowadziliśmy [*grupy API*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md),
które mogą być [włączane i wyłączane](/docs/reference/using-api/#enabling-or-disabling).

Zasoby API są rozróżniane poprzez przynależność do grupy API, typ zasobu, przestrzeń nazw (_namespace_,  
o ile ma zastosowanie) oraz nazwę. Serwer API może obsługiwać
te same dane poprzez różne wersje API i przeprowadzać konwersję między
różnymi wersjami API w sposób niewidoczny dla użytkownika. Wszystkie te różne wersje
reprezentują w rzeczywistości ten sam zasób. Załóżmy przykładowo, że istnieją dwie
wersje `v1` i `v1beta1` tego samego zasobu. Obiekt utworzony przez
wersję `v1beta1` może być odczytany, zaktualizowany i skasowany zarówno przez wersję
`v1beta1`, jak i `v1`.

Zajrzyj do [API versions reference](/docs/reference/using-api/#api-versioning)
po szczegółowe informacje, jak definiuje się poziomy wersji API.

## Rozbudowa API

API Kubernetesa można rozbudowywać (rozszerzać) na dwa sposoby:

1. [Definicje zasobów własnych](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   pozwalają deklaratywnie określać, jak serwer API powinien dostarczać wybrane zasoby API.
1. Można także rozszerzać API Kubernetesa implementując
   [warstwę agregacji](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

## {{% heading "whatsnext" %}}

- Naucz się, jak rozbudowywać API Kubernetesa poprzez dodawanie własnych
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Controlling API Access](/docs/reference/access-authn-authz/controlling-access/) opisuje
  sposoby, jakimi klaster zarządza dostępem do API.
- Punkty dostępowe API _(endpoints)_, typy zasobów i przykłady zamieszczono w [API Reference](/docs/reference/kubernetes-api/).
