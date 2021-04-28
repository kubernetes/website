---
title: API Kubernetesa
content_type: concept
weight: 30
description: >
  API Kubernetesa służy do odpytywania i zmiany stanu obiektów Kubernetesa.
  Sercem warstwy sterowania Kubernetesa jest serwer API i udostępniane po HTTP API. Przez ten serwer odbywa się komunikacja pomiędzy użytkownikami, różnymi częściami składowymi klastra oraz komponentami zewnętrznymi.
card:
  name: concepts
  weight: 30
---

<!-- overview -->

Sercem {{< glossary_tooltip text="warstwy sterowania" term_id="control-plane" >}} Kubernetes
jest {{< glossary_tooltip text="serwer API" term_id="kube-apiserver" >}}. Serwer udostępnia
API poprzez HTTP, umożliwiając wzajemną komunikację pomiędzy użytkownikami, częściami składowymi klastra
i komponentami zewnętrznymi.

API Kubernetesa pozwala na sprawdzanie i zmianę stanu obiektów
(przykładowo: pody, _Namespaces_, _ConfigMaps_, _Events_).

Większość operacji może zostać wykonana poprzez
interfejs linii komend (CLI) [kubectl](/docs/reference/kubectl/overview/) lub inne
programy, takie jak
[kubeadm](/docs/reference/setup-tools/kubeadm/), które używają
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

W Kubernetesie zaimplementowany jest alternatywny format serializacji na potrzeby API oparty o
Protobuf, który jest przede wszystkim przeznaczony na potrzeby wewnętrznej komunikacji w klastrze.
Więcej szczegółów znajduje się w dokumencie [Kubernetes Protobuf serialization](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md).
oraz w plikach *Interface Definition Language* (IDL) dla każdego ze schematów
zamieszczonych w pakietach Go, które definiują obiekty API.

## Przechowywanie stanu

Kubernetes przechowuje serializowany stan swoich obiektów w
{{< glossary_tooltip term_id="etcd" >}}.

## Grupy i wersje API

Aby ułatwić usuwanie poszczególnych pól lub restrukturyzację reprezentacji zasobów, Kubernetes obsługuje
równocześnie wiele wersji API, każde poprzez osobną ścieżkę API,
na przykład: `/api/v1` lub `/apis/rbac.authorization.k8s.io/v1alpha1`.

Rozdział wersji wprowadzony jest na poziomie całego API, a nie na poziomach poszczególnych zasobów lub pól,
aby być pewnym, że API odzwierciedla w sposób przejrzysty i spójny zasoby systemowe
i ich zachowania  oraz pozwala na kontrolowany dostęp do tych API, które są w fazie wycofywania
lub fazie eksperymentalnej.

Aby ułatwić rozbudowę API Kubernetes, wprowadziliśmy
[*grupy API*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md), które mogą
być [włączane i wyłączane](/docs/reference/using-api/#enabling-or-disabling).

Zasoby API są rozróżniane poprzez przynależność do grupy API, typ zasobu, przestrzeń nazw (_namespace_,  
o ile ma zastosowanie) oraz nazwę. Serwer API może przeprowadzać konwersję między
różnymi wersjami API w sposób niewidoczny dla użytkownika: wszystkie te różne wersje
reprezentują w rzeczywistości ten sam zasób. Serwer API może udostępniać te same dane
poprzez kilka różnych wersji API.

Załóżmy przykładowo, że istnieją dwie wersje `v1` i `v1beta1` tego samego zasobu.
Obiekt utworzony przez wersję `v1beta1` może być odczytany, 
zaktualizowany i skasowany zarówno przez wersję
`v1beta1`, jak i `v1`.

## Trwałość API

Z naszego doświadczenia wynika, że każdy system, który odniósł sukces, musi się nieustająco rozwijać w miarę zmieniających się potrzeb.
Dlatego Kubernetes został tak zaprojektowany, aby API mogło się zmieniać i rozrastać.
Projekt Kubernetes dąży do tego, aby nie wprowadzać zmian niezgodnych z istniejącymi aplikacjami klienckimi
i utrzymywać zgodność przez wystarczająco długi czas, aby inne projekty zdążyły się dostosować do zmian.

W ogólności, nowe zasoby i pola definiujące zasoby API są dodawane stosunkowo często.
Usuwanie zasobów lub pól jest regulowane przez
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).

Po osiągnięciu przez API statusu ogólnej dostępności (_general availability_ - GA),
oznaczanej zazwyczaj jako wersja API `v1`, bardzo zależy nam na utrzymaniu jej zgodności w kolejnych wydaniach.
Kubernetes utrzymuje także zgodność dla wersji _beta_ API tam, gdzie jest to możliwe:
jeśli zdecydowałeś się używać API w wersji beta, możesz z niego korzystać także później,
kiedy dana funkcjonalność osiągnie status stabilnej.

{{< note >}}
Mimo, że Kubernetes stara się także zachować zgodność dla API w wersji _alpha_, zdarzają się przypadki,
kiedy nie jest to możliwe. Jeśli korzystasz z API w wersji alfa, przed aktualizacją klastra do nowej wersji
zalecamy sprawdzenie w informacjach o wydaniu, czy nie nastąpiła jakaś zmiana w tej części API.
{{< /note >}}

Zajrzyj do [API versions reference](/docs/reference/using-api/#api-versioning)
po szczegółowe definicje różnych poziomów wersji API.



## Rozbudowa API

API Kubernetesa można rozszerzać na dwa sposoby:

1. [Definicje zasobów własnych (_custom resources_)](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   pozwalają deklaratywnie określać, jak serwer API powinien dostarczać wybrane przez Ciebie zasoby API.
1. Można także rozszerzać API Kubernetesa implementując
   [warstwę agregacji](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

## {{% heading "whatsnext" %}}

- Naucz się, jak rozbudowywać API Kubernetesa poprzez dodawanie własnych
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Controlling Access To The Kubernetes API](/docs/concepts/security/controlling-access/) opisuje
  sposoby, jakimi klaster zarządza dostępem do API.
- Punkty dostępowe API _(endpoints)_, typy zasobów i przykłady zamieszczono w
  [API Reference](/docs/reference/kubernetes-api/).
- Aby dowiedzieć się, jaki rodzaj zmian można określić jako zgodne i jak zmieniać API, zajrzyj do
  [API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).
