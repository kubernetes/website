---
title: Objekty w Kubernetesie
content_type: concept
weight: 30
description: >
  Obiekty Kubernetesa to trwałe jednostki w systemie Kubernetes.
  Służą one do odwzorowania stanu klastra.
  Poznaj, czym jest model obiektów Kubernetesa i jak z nimi pracować.
simple_list: true
card:
  name: concepts
  weight: 40
---

<!-- overview -->

Ta strona wyjaśnia, jak obiekty Kubernetesa są reprezentowane w
API Kubernetesa oraz jak można je wyrazić w formacie `.yaml`.

<!-- body -->

## Czym są obiekty Kubernetesa {#kubernetes-objects}

*Obiekty Kubernetesa* to trwałe byty w systemie Kubernetes. Kubernetes
wykorzystuje te byty do reprezentowania stanu klastra. Konkretne zastosowania to m.in.:

* Jakie aplikacje kontenerowe są uruchomione (i na których węzłach)
* Zasoby dostępne dla tych aplikacji
* Polityki dotyczące zachowania tych aplikacji, takie jak polityki restartu, aktualizacje i tolerancja na błędy

Obiekt Kubernetesa to "zapis zamiaru" - gdy go utworzysz,
Kubernetes będzie stale pilnować, aby taki obiekt faktycznie
istniał. Tworząc obiekt, efektywnie informujesz Kubernetesa, jak ma wyglądać
workload klastra; to jest *pożądany stan* twojego klastra.

Aby pracować z obiektami Kubernetesa-czy to w celu ich tworzenia, modyfikacji, czy
usuwania—musisz użyć [API Kubernetesa](/docs/concepts/overview/kubernetes-api/). Na przykład, kiedy używasz
interfejsu wiersza poleceń `kubectl`, CLI wykonuje dla ciebie niezbędne wywołania
do API Kubernetesa. Możesz także używać API Kubernetesa bezpośrednio w swoich własnych
programach, korzystając z jednej z [bibliotek klienckich](/docs/reference/using-api/client-libraries/).

### Specyfikacja i status obiektu {#object-spec-and-status}

Prawie każdy obiekt Kubernetesa zawiera dwa zagnieżdżone pola obiektowe,
które zarządzają konfiguracją obiektu: obiekt
*`spec`* i obiekt *`status`*. W przypadku obiektów, które mają
`spec`, musisz go ustawić podczas tworzenia obiektu,
dostarczając opis cech, jakie chcesz, aby zasób posiadał: jego _pożądany stan_.

`Status` opisuje _aktualny stan_ obiektu, dostarczany i
aktualizowany przez system Kubernetes i jego komponenty. Kubernetes
{{< glossary_tooltip text="warstwa sterowania" term_id="control-plane" >}} stale
i aktywnie zarządza rzeczywistym stanem
każdego obiektu, aby dopasować go do pożądanego stanu, który dostarczyłeś.

Na przykład: w Kubernetesie, Deployment jest obiektem, który
może reprezentować aplikację działającą na twoim klastrze.
Kiedy tworzysz Deployment, możesz ustawić `spec` Deploymentu, aby
określić, że chcesz, aby uruchomione były trzy repliki
aplikacji. System Kubernetes odczytuje spec Deploymentu i uruchamia
trzy instancje twojej pożądanej aplikacji—aktualizując status,
aby dopasować go do twojego spec. Jeśli któraś z instancji
ulegnie awarii (czyli zmieni się status), Kubernetes zareaguje na różnicę
między spec a status - w tym przypadku, uruchamiając nową instancję.

Aby uzyskać więcej informacji na temat specyfikacji obiektu, statusu i metadanych, zobacz
[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Opis obiektu w Kubernetesie {#describing-a-kubernetes-object}

Kiedy tworzysz obiekt w Kubernetesie, musisz dostarczyć specyfikację obiektu,
która opisuje jego pożądany stan, a także podstawowe informacje o obiekcie (takie
jak nazwa). Gdy używasz API Kubernetesa do tworzenia obiektu (bezpośrednio lub za
pośrednictwem `kubectl`), żądanie API musi zawierać te informacje w formacie JSON
w treści żądania. Najczęściej dostarczasz informacje do `kubectl` w pliku znanym
jako _manifest_. Zgodnie z konwencją, manifesty są w formacie YAML (możesz
również użyć formatu JSON). Narzędzia takie jak `kubectl` konwertują informacje z
manifestu na JSON lub inny obsługiwany format serializacji podczas wysyłania żądania API przez HTTP.

Oto przykład manifestu pokazujący wymagane pola
oraz specyfikację obiektu dla Deployment w Kubernetesie:

{{% code_sample file="application/deployment.yaml" %}}

Jednym ze sposobów utworzenia Deploymentu przy użyciu pliku manifestu, takiego jak powyżej,
jest użycie polecenia [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply)
w interfejsie wiersza poleceń `kubectl`, przekazując plik `.yaml` jako argument. Oto przykład:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Wynik jest podobny do tego:

```
deployment.apps/nginx-deployment created
```

### Wymagane pola {#required-fields}

W manifeście (pliku YAML lub JSON) dla obiektu Kubernetesa,
który chcesz utworzyć, musisz ustawić wartości dla następujących pól:

* `apiVersion` - Której wersji API Kubernetesa używasz do utworzenia tego obiektu
* `kind` - Jakiego rodzaju obiekt chcesz utworzyć
* `metadata` - Dane pomagające jednoznacznie zidentyfikować obiekt, w tym łańcuch znaków `name`, `UID` oraz opcjonalnie `namespace`.
* `spec` - Jaki stan jest pożądany dla obiektu

Dokładny format obiektu `spec` jest inny dla każdego obiektu Kubernetesa i zawiera zagnieżdżone
pola specyficzne dla tego obiektu. [Kubernetes API Reference](/docs/reference/kubernetes-api/)
może pomóc ci znaleźć format spec dla wszystkich obiektów, które możesz utworzyć przy użyciu Kubernetesa.

Na przykład, zobacz [pole `spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
w odniesieniu do API Poda. Dla
każdego Poda, pole `.spec` określa pod i jego pożądany stan (taki jak nazwa obrazu
kontenera dla każdego kontenera w ramach tego poda). Innym
przykładem specyfikacji obiektu jest [pole `spec`](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)
dla
API StatefulSet. Dla StatefulSet, pole `.spec` określa StatefulSet i
jego pożądany stan. W ramach `.spec` dla StatefulSet znajduje się
[szablon](/docs/concepts/workloads/pods/#pod-templates) dla obiektów Pod. Ten
szablon opisuje Pody, które kontroler StatefulSet utworzy w celu spełnienia
specyfikacji StatefulSet. Różne rodzaje obiektów mogą
również mieć różne `.status`; ponownie, strony referencyjne API
szczegółowo opisują strukturę tego pola `.status` i jego zawartość dla każdego rodzaju obiektu.

Zobacz [Najlepsze Praktyki Konfiguracji](/blog/2025/11/25/configuration-good-practices/)
aby uzyskać dodatkowe informacje na temat pisania plików konfiguracyjnych YAML.

## Walidacja pól po stronie serwera {#server-side-field-validation}

Począwszy od wersji Kubernetesa v1.25, serwer API oferuje
[walidację pól](/docs/reference/using-api/api-concepts/#field-validation) po
stronie serwera, która wykrywa nierozpoznane lub zduplikowane pola w
obiekcie. Zapewnia ona całą funkcjonalność `kubectl --validate` po stronie serwera.

Narzędzie `kubectl` używa flagi `--validate` do ustawiania poziomu walidacji pól. Akceptuje
wartości `ignore`, `warn` oraz `strict`, a także akceptuje wartości `true` (równoważne `strict`) i
`false` (równoważne `ignore`). Domyślne ustawienie walidacji dla `kubectl` to `--validate=true`.

`Strict` : Ścisła walidacja pól,
błędy w przypadku niepowodzenia walidacji

`Warn` : Walidacja pola jest przeprowadzana, ale błędy są
zgłaszane jako ostrzeżenia zamiast powodować niepowodzenie żądania.

`Ignore` : Nie jest wykonywana
żadna walidacja pola po stronie serwera

Kiedy `kubectl` nie może połączyć się z serwerem API, który obsługuje walidację pól,
przełączy się na użycie walidacji po stronie klienta. Kubernetes 1.27 i nowsze wersje zawsze
oferują walidację pól; starsze wydania Kubernetesa mogą tego nie robić. Jeśli twój
klaster jest starszy niż v1.27, sprawdź dokumentację dla swojej wersji Kubernetesa.

## {{% heading "whatsnext" %}}

Jeśli dopiero zaczynasz swoją przygodę z Kubernetesem, przeczytaj więcej na temat:

* [Pody](/docs/concepts/workloads/pods/), które są najważniejszymi podstawowymi obiektami Kubernetesa.
* Obiekty [Deployment](/docs/concepts/workloads/controllers/deployment/).
* [Kontrolery](/docs/concepts/architecture/controller/) w Kubernetesie.
* [kubectl](/docs/reference/kubectl/) i [kubectl commands](/docs/reference/generated/kubectl/kubectl-commands).

[Zarządzanie obiektami Kubernetesa](/docs/concepts/overview/working-with-objects/object-management/)
wyjaśnia, jak używać `kubectl` do zarządzania obiektami. Możesz
potrzebować [zainstalować kubectl](/docs/tasks/tools/#kubectl), jeśli jeszcze go nie masz.

Aby dowiedzieć się więcej ogólnie o API Kubernetesa, odwiedź:

* [Kubernetes API overview](/docs/reference/using-api/)

Aby dowiedzieć się więcej o obiektach w Kubernetesie, przeczytaj inne strony w tej sekcji:
<!-- Docsy automatically includes a list of pages in the section -->
