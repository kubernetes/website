---
title: Przestrzenie nazw (ang. Namespaces)
api_metadata:
- apiVersion: "v1"
  kind: "Namespace"
content_type: concept
weight: 45
---





<!-- overview -->

W Kubernetesie _przestrzenie nazw_ zapewniają mechanizm izolowania grup zasobów w ramach jednego klastra. Nazwy zasobów muszą być unikalne w obrębie danej przestrzeni nazw, ale nie muszą być unikalne w całym klastrze. Zakres oparty na przestrzeniach nazw dotyczy tylko {{< glossary_tooltip text="obiektów" term_id="object" >}} _(np. Deploymentów, Service'ów, itp.)_, a nie dla obiektów dotyczących całego klastra _(np. StorageClass, Nodes, PersistentVolumes, itp.)_.

<!-- body -->

## Kiedy używać wielu przestrzeni nazw {#when-to-use-multiple-namespaces}

Przestrzenie nazw są przeznaczone do użycia w środowiskach z wieloma użytkownikami
rozproszonymi w różnych zespołach lub projektach. Dla klastrów z użytkownikami w
ilości od kilku do kilkunastu nie powinieneś potrzebować tworzyć ani myśleć o
przestrzeniach nazw. Zacznij używać przestrzeni nazw, gdy potrzebujesz funkcji, które one oferują.

Namespace'y zapewniają zakres dla nazw. Nazwy zasobów muszą być unikalne w obrębie jednego
namespace'u, ale nie muszą być unikalne w różnych namespace'ach. Namespace'y nie mogą być
zagnieżdżane w sobie wzajemnie, a każdy zasób Kubernetesa może znajdować się tylko w jednym namespace'ie.

Namespacey są sposobem na podział zasobów klastra pomiędzy wielu użytkowników (przez [resource quotas](/docs/concepts/policy/resource-quotas/)).

Nie ma potrzeby używania wielu przestrzeni nazw do oddzielania
nieznacznie różniących się zasobów, takich jak różne wersje tego samego
oprogramowania: zamiast tego wykorzystaj {{< glossary_tooltip text="etykiety" term_id="label" >}},
aby rozróżnić zasoby w obrębie jednej przestrzeni nazw.

{{< note >}}
Dla klastra produkcyjnego, rozważ _nie_ używanie przestrzeni nazw `default`. Zamiast tego stwórz inne przestrzenie nazw i używaj ich.
{{< /note >}}

## Początkowe przestrzenie nazw {#initial-namespaces}

Kubernetes rozpoczyna z czterema początkowymi przestrzeniami nazw:

`default` : Kubernetes zawiera tę przestrzeń nazw, aby umożliwić rozpoczęcie
korzystania z nowego klastra bez konieczności wcześniejszego tworzenia przestrzeni nazw.

`kube-node-lease` : Ta przestrzeń nazw przechowuje obiekty [Lease](/docs/concepts/architecture/leases/) powiązane z każdym węzłem. Pozwalają one kubeletowi
na wysyłanie [sygnałów życia (ang. heartbeats)](/docs/concepts/architecture/nodes/#node-heartbeats), dzięki czemu warstwa sterowania może wykryć awarię węzła.

`kube-public` : Ta przestrzeń nazw jest możliwa do odczytu przez *wszystkich* klientów (w tym tych, którzy nie są uwierzytelnieni). Ta przestrzeń nazw jest głównie zarezerwowana do
użytku klastra, na wypadek gdyby niektóre zasoby miały być widoczne i czytelne publicznie w całym klastrze. Publiczny aspekt tej przestrzeni nazw jest jedynie konwencją, a nie wymogiem.

`kube-system` : Przestrzeń nazw dla
obiektów tworzonych przez system Kubernetesa.

## Praca z przestrzeniami nazw {#working-with-namespaces}

Tworzenie i usuwanie przestrzeni nazw zostało opisane w
[dokumentacji Przewodnika Administratora dotyczącej przestrzeni nazw](/docs/tasks/administer-cluster/namespaces).

{{< note >}}
Unikaj tworzenia przestrzeni nazw z prefiksem `kube-`, ponieważ jest on zarezerwowany dla przestrzeni nazw systemu Kubernetes.
{{< /note >}}

### Przeglądanie przestrzeni nazw {#viewing-namespaces}

Możesz wyświetlić listę bieżących przestrzeni nazw w klastrze za pomocą:

```shell
kubectl get namespace
```
```
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```


### Ustawianie przestrzeni nazw dla żądania {#setting-the-namespace-for-a-request}

Aby ustawić przestrzeń nazw dla bieżącego żądania, użyj flagi `--namespace`.

Na przykład:

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### Ustawianie preferencji przestrzeni nazw {#setting-the-namespace-preference}

Możesz na stałe zapisać przestrzeń nazw dla
wszystkich kolejnych poleceń kubectl w tym kontekście.

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validate it
kubectl config view --minify | grep namespace:
```

## Przestrzenie nazw i DNS {#namespaces-and-dns}

Kiedy tworzysz [Service](/docs/concepts/services-networking/service/), tworzy on
odpowiadający mu [rekord DNS](/docs/concepts/services-networking/dns-pod-service/).
Ten wpis ma postać `<service-name>.<namespace-name>.svc.cluster.local`, co oznacza,
że jeśli kontener używa tylko `<service-name>`, odwołuje się on do usługi lokalnej
dla danego namespace'a. Jest to przydatne do używania tej samej konfiguracji w
wielu namespace'ach, takich jak Development, Staging i Production. Jeśli chcesz uzyskać dostęp
do zasobów między namespace'ami, musisz użyć w pełni kwalifikowanej nazwy domeny (FQDN).

W związku z tym, wszystkie nazwy przestrzeni nazw muszą być zgodne z
[etykietami DNS RFC 1123](/docs/concepts/overview/working-with-objects/names/#dns-label-names).

{{< warning >}}
Poprzez tworzenie przestrzeni nazw o takiej samej nazwie jak
[publiczne domeny najwyższego poziomu](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), usługi w tych przestrzeniach nazw mogą mieć krótkie
nazwy DNS, które pokrywają się z publicznymi rekordami DNS. Zapytania DNS wykonywane
przez workloady z dowolnej przestrzeni nazw, bez [kończącej kropki](https://datatracker.ietf.org/doc/html/rfc1034#page-8),
będą przekierowane do tych usług, mając pierwszeństwo przed publicznym wpisem DNS.

Aby temu zapobiec, ogranicz uprawnienia do tworzenia przestrzeni nazw dla
zaufanych użytkowników. Jeśli to konieczne, możesz dodatkowo skonfigurować
zewnętrzne mechanizmy kontroli bezpieczeństwa, takie jak
[admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/), aby zablokować
tworzenie jakiejkolwiek przestrzeni nazw o nazwie z listy
[domen najwyższego poziomu (ang. TLD - Top-Level Domain)](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
{{< /warning >}}

## Nie wszystkie obiekty znajdują się w przestrzeni nazw. {#not-all-objects-are-in-a-namespace}

Większość zasobów Kubernetesa (np. pody, usługi, kontrolery replikacji i
inne) znajduje się w jakiś przestrzeniach nazw. Jednak zasoby przestrzeni
nazw nie są same w sobie w przestrzeni nazw. Zasoby niskiego poziomu, takie
jak [węzły](/docs/concepts/architecture/nodes/) i
[persistentVolumes](/docs/concepts/storage/persistent-volumes/), nie znajdują się w żadnej przestrzeni nazw.

Aby zobaczyć, które zasoby Kubernetesa znajdują się w przestrzeni nazw, a które nie:

```shell
# In a namespace
kubectl api-resources --namespaced=true

# Not in a namespace
kubectl api-resources --namespaced=false
```

## Automatyczne etykietowanie {#automatic-labelling}

{{< feature-state for_k8s_version="1.22" state="stable" >}}

Warstwa sterowania Kubernetesa ustawia niezmienną
{{< glossary_tooltip text="etykietę" term_id="label" >}} `kubernetes.io/metadata.name` na
wszystkich przestrzeniach nazw. Wartością etykiety jest nazwa przestrzeni nazw.


## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [tworzeniu przestrzeni nazw](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* Dowiedz się więcej o [usuwaniu przestrzeni nazw](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).

