---
title: Etykiety i selektory
content_type: concept
weight: 40
---



<!-- overview -->

_Etykiety_ to pary klucz/wartość, które są dołączane do
{{< glossary_tooltip text="obiektów" term_id="object" >}} takich jak Pody. Etykiety służą do
określania identyfikacyjnych atrybutów obiektów, które są istotne i ważne dla
użytkowników, ale bezpośrednio nie wpływają na semantykę głównego systemu. Etykiety mogą
być używane do organizowania i wybierania podzbiorów obiektów. Etykiety mogą
być dołączane do obiektów w momencie ich tworzenia, a następnie mogą być dodawane i
modyfikowane w dowolnym momencie. Każdy obiekt może mieć zdefiniowany zestaw etykiet
w postaci par klucz/wartość. Każdy klucz musi być unikalny dla konkretnego obiektu.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Etykiety umożliwiają wydajne zapytania i obserwacje, co czyni je idealnym rozwiązaniem do użycia w
interfejsach użytkownika (UI) i interfejsach wiersza poleceń (CLI). Informacje nieidentyfikujące
powinny być rejestrowane przy użyciu [adnotacji](/docs/concepts/overview/working-with-objects/annotations/).

<!-- body -->

## Motywacja {#motivation}

Etykiety umożliwiają użytkownikom odwzorowanie własnych struktur organizacyjnych na obiekty
systemowe w sposób luźno powiązany, bez konieczności przechowywania tych odwzorowań przez klientów.

Rozmieszczanie usług i przetwarzanie wsadowe to często byty wielowymiarowe (np.
wiele partycji lub wdrożeń, wiele ścieżek wydania, wiele poziomów,
wiele mikrousług na poziom). Zarządzanie często wymaga operacji
przekrojowych, co łamie enkapsulację ściśle hierarchicznych reprezentacji, zwłaszcza
sztywnych hierarchii określanych przez infrastrukturę, a nie przez użytkowników.

Przykłady etykiet:

* `"release" : "stable"`, `"release" : "canary"`
* `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
* `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
* `"partition" : "customerA"`, `"partition" : "customerB"`
* `"track" : "daily"`, `"track" : "weekly"`

Oto przykłady [zalecanych etykiet](/docs/concepts/overview/working-with-objects/common-labels/)
;
możesz swobodnie opracowywać własne konwencje. Pamiętaj, że
klucz etykiety musi być unikalny dla danego obiektu.

## Składnia i zestaw znaków {#syntax-and-character-set}

_Etykiety_ to pary klucz/wartość. Prawidłowe klucze etykiet mają dwa segmenty: opcjonalny
prefiks i nazwę, oddzielone ukośnikiem (`/`). Segment nazwy jest
wymagany i musi mieć maksymalnie 63 znaki, zaczynając i kończąc się znakiem
alfanumerycznym (`[a-z0-9A-Z]`), z myślnikami (`-`), podkreśleniami (`_`),
kropkami (`.`) i znakami alfanumerycznymi pomiędzy. Prefiks jest opcjonalny. Jeśli
jest podany, prefiks musi być subdomeną DNS: serią etykiet DNS oddzielonych
kropkami (`.`), o długości nieprzekraczającej łącznie 253 znaków, zakończoną ukośnikiem (`/`).

Jeśli prefiks zostanie pominięty, uważa się, że klucz etykiety jest prywatny dla użytkownika.
Zautomatyzowane komponenty systemowe (np. `kube-scheduler`,
`kube-controller-manager`, `kube-apiserver`, `kubectl` lub inne zewnętrzne
automatyzacje), które dodają etykiety do obiektów końcowego użytkownika, muszą określać prefiks.

Prefiksy `kubernetes.io/` i `k8s.io/` są
[zarezerwowane](/docs/reference/labels-annotations-taints/) dla podstawowych komponentów Kubernetesa.

Prawidłowa wartość etykiety:

* musi mieć 63 znaki lub mniej (może być puste),
* o ile ciąg nie jest pusty, musi zaczynać się i kończyć znakiem alfanumerycznym (`[a-z0-9A-Z]`),
* może zawierać myślniki (`-`), podkreślenia (`_`), kropki (`.`) oraz znaki alfanumeryczne pomiędzy.

Na przykład, oto manifest dla Poda, który ma dwie
etykiety `environment: production` oraz `app: nginx`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## Selektory etykiet {#label-selectors}

W przeciwieństwie do [nazw i identyfikatorów UID](/docs/concepts/overview/working-with-objects/names/),
etykiety nie zapewniają unikalności. To oznacza, że wiele obiektów może mieć te same etykiety.

Za pomocą _selektora etykiet_ klient/użytkownik może zidentyfikować zestaw
obiektów. Selektor etykiet jest podstawowym mechanizmem grupującym w Kubernetesie.

API obecnie obsługuje dwa typy selektorów: _oparte na równości_ i
_oparte na zbiorach_. Selektor etykiet może składać się z wielu _wymagań_, które
są oddzielone przecinkami. W przypadku wielu wymagań, wszystkie muszą być
spełnione, więc separator przecinka działa jako logiczny operator _AND_ (`&&`).

Interpretacja pustych lub niepodanych selektorów zależy
od kontekstu. Każdy typ API, który je wykorzystuje,
powinien jasno udokumentować ich dopuszczalność i sposób działania.

{{< note >}}
Dla niektórych typów API, takich jak ReplicaSets, selektory etykiet dwóch instancji
nie mogą się nakładać w obrębie jednej przestrzeni nazw, ponieważ kontroler może to
uznać za sprzeczne polecenia i nie będzie w stanie określić, ile replik powinno być obecnych.
{{< /note >}}

{{< caution >}}
Zarówno dla warunków opartych na równości, jak i warunków opartych na zbiorach nie istnieje operator logiczny _OR_ (`||`).
Upewnij się, że twoje instrukcje filtrujące są odpowiednio skonstruowane.
{{< /caution >}}

### _Wymóg oparty na równości_ {#equality-based-requirement}

_Wymagania_ oparte na _równości_ lub _nierówności_ umożliwiają filtrowanie
według kluczy i wartości etykiet. Pasujące obiekty muszą spełniać wszystkie
określone ograniczenia etykiet, chociaż mogą mieć również dodatkowe etykiety.
Dopuszczalne są trzy rodzaje operatorów: `=`,`==`,`!=`. Pierwsze dwa reprezentują
_równość_ (i są synonimami), podczas gdy ostatni reprezentuje _nierówność_. Na przykład:

```
environment = production
tier != frontend
```

Poprzedni wybiera wszystkie zasoby, których klucz jest równy `environment`, a wartość równa się
`production`. Drugi wybiera wszystkie zasoby, których klucz jest równy `tier`, a wartość różni się od
`frontend`, oraz wszystkie zasoby bez etykiet z kluczem `tier`. Można filtrować zasoby w
`production` wyłączając `frontend` przy użyciu operatora przecinka: `environment=production,tier!=frontend`

Jednym ze scenariuszy użycia dla wymagań etykiet opartych na równości jest
specyfikacja kryteriów wyboru węzła przez Pody. Na przykład, poniższy przykładowy Pod wybiera
węzły, na których etykieta `accelerator` istnieje i jest ustawiona na `nvidia-tesla-p100`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### _Wymagania oparte na zbiorach_ {#set-based-requirement}

Wymagania dotyczące etykiet bazujących na zbiorach (_Set-based_)
umożliwiają filtrowanie kluczy według zbioru wartości. Obsługiwane są trzy rodzaje
operatorów: `in`, `notin` oraz `exists` (tylko identyfikator klucza). Na przykład:

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

- Pierwszy przykład wybiera wszystkie zasoby z kluczem
  równym `environment` i wartością równą `production` lub `qa`.
- Drugi przykład wybiera wszystkie zasoby z kluczem równym `tier` i wartościami
  innymi niż `frontend` i `backend`, oraz wszystkie zasoby bez etykiet z kluczem `tier`.
- Trzeci przykład wybiera wszystkie zasoby zawierające
  etykietę z kluczem `partition`; wartości nie są sprawdzane.
- Czwarty przykład wybiera wszystkie zasoby bez
  etykiety z kluczem `partition`; wartości nie są sprawdzane.

Podobnie separator przecinka działa jako operator _AND_.
Filtrowanie zasobów z kluczem `partition` (bez względu na wartość) i z
`environment` innym niż `qa` można osiągnąć używając
`partition,environment notin (qa)`. _Selekcja etykiet oparta na zbiorach_
jest ogólną formą równości, ponieważ `environment=production`
jest równoważne `environment in (production)`; podobnie dla `!=` i `notin`.

Wymagania oparte na _zbiorach_ mogą być mieszane z wymaganiami opartymi na
_równości_. Na przykład: `partition in (customerA, customerB),environment!=qa`.

## API {#api}

### Filtrowanie LIST i WATCH {#list-and-watch-filtering}

Dla operacji **list** i **watch** można określić selektory etykiet, aby filtrować
zestawy zwracanych obiektów; filtr określasz za pomocą
parametru zapytania. (Aby dowiedzieć się więcej o mechanizmie watch w
Kubernetesie, przeczytaj o [wydajnym wykrywaniu zmian](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)
). Oba wymagania są
dozwolone (przedstawione tutaj tak, jak mogą się pojawić w ciągu zapytania URL):

* _wymagania oparte na równości_: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* _wymagania oparte na zbiorach: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

Oba style selektorów etykiet mogą być używane do wylistowania lub obserwacji zasobów za pomocą klienta
REST. Na przykład, kierując się na `apiserver` z `kubectl` i używając selekcji opartej na równości, można napisać:

```shell
kubectl get pods -l environment=production,tier=frontend
```

lub używając wymagań opartych na _zbiorach_:

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

Jak już wspomniano, wymagania oparte na _zbiorach_ są bardziej
wyraziste. Na przykład mogą implementować operator _LUB_ na wartościach:

```shell
kubectl get pods -l 'environment in (production, qa)'
```

lub ograniczenie dopasowywania negatywnego za pomocą operatora _notin_:

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### Ustaw referencje w obiektach API {#set-references-in-api-objects}

Niektóre obiekty Kubernetesa, takie jak
[`services`](/docs/concepts/services-networking/service/) i [`replicationcontrollers`](/docs/concepts/workloads/controllers/replicationcontroller/),
również używają selektorów etykiet do
określania zbiorów innych zasobów, takich jak [pods](/docs/concepts/workloads/pods/).

#### Usługa i Kontroler Replikacji {#service-and-replicationcontroller}

Zestaw podów, na które skierowana jest usługa (`service`), jest określany za pomocą selektora
etykiet. Podobnie, populacja podów, którą powinien zarządzać kontroler
replikacji (`replicationcontroller`), jest również określana za pomocą selektora etykiet.

Selektory etykiet dla obu obiektów są definiowane w plikach `json` lub
`yaml` za pomocą map, i obsługiwane są tylko selektory wymagań oparte na _równości_:

```json
"selector": {
    "component" : "redis",
}
```

lub

```yaml
selector:
  component: redis
```

Ten selektor (odpowiednio w formacie `json` lub `yaml`)
jest równoważny z `component=redis` lub `component in (redis)`.

#### Zasoby, które obsługują wymagania oparte na zbiorach {#resources-that-support-set-based-requirements}

Nowsze zasoby, takie jak [`Job`](/docs/concepts/workloads/controllers/job/),
[`Deployment`](/docs/concepts/workloads/controllers/deployment/),
[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/)
oraz [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/),
obsługują również wymagania _oparte na zbiorach_.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - { key: tier, operator: In, values: [cache] }
    - { key: environment, operator: NotIn, values: [dev] }
```

`matchLabels` to mapa par `{klucz,wartość}`. Pojedyncza para `{klucz,wartość}` w
mapie `matchLabels` jest równoważna elementowi `matchExpressions`, którego pole
`key` to "klucz", `operator` to "In", a tablica `values` zawiera wyłącznie "wartość". `matchExpressions`
to lista wymagań selektora podów. Prawidłowe operatory to In,
NotIn, Exists i DoesNotExist. Zbiór wartości musi być niepusty w przypadku In i
NotIn. Wszystkie wymagania zarówno z `matchLabels`, jak i `matchExpressions` są
łączone za pomocą operatora AND - muszą być wszystkie spełnione, aby dopasowanie było możliwe.

#### Wybieranie zestawów węzłów {#selecting-sets-of-nodes}

Jednym z przypadków użycia wybierania w oparciu o etykiety jest ograniczenie
zestawu węzłów, na które można umieścić pod. Więcej informacji można znaleźć w
dokumentacji na temat [wyboru węzła](/docs/concepts/scheduling-eviction/assign-pod-node/).

## Skuteczne wykorzystywanie etykiet {#using-labels-effectively}

Możesz zastosować pojedynczą etykietę do dowolnych zasobów, ale nie
zawsze jest to najlepsza praktyka. Istnieje wiele scenariuszy, w których
należy użyć wielu etykiet, aby odróżnić zestawy zasobów od siebie nawzajem.

Na przykład różne aplikacje mogą używać różnych wartości dla etykiety `app`, ale aplikacja
wielowarstwowa, taka jak [przykład książki gości](https://github.com/kubernetes/examples/tree/master/guestbook/),
będzie dodatkowo musiała rozróżniać każdą warstwę. Frontend mógłby nosić następujące etykiety:

```yaml
labels:
  app: guestbook
  tier: frontend
```

podczas gdy instancje master i replica Redis miałyby różne etykiety
`tier`, a być może nawet dodatkową etykietę `role`:

```yaml
labels:
  app: guestbook
  tier: backend
  role: master
```

i

```yaml
labels:
  app: guestbook
  tier: backend
  role: replica
```

Etykiety umożliwiają sortowanie i filtrowanie zasobów według dowolnego wymiaru określonego przez etykietę:

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```none
NAME                           READY  STATUS    RESTARTS   AGE   APP         TIER       ROLE
guestbook-fe-4nlpb             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-ght6d             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-jpy62             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1    Running   0          1m    guestbook   backend    master
guestbook-redis-replica-2q2yf  1/1    Running   0          1m    guestbook   backend    replica
guestbook-redis-replica-qgazl  1/1    Running   0          1m    guestbook   backend    replica
my-nginx-divi2                 1/1    Running   0          29m   nginx       <none>     <none>
my-nginx-o0ef1                 1/1    Running   0          29m   nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=replica
```

```none
NAME                           READY  STATUS   RESTARTS  AGE
guestbook-redis-replica-2q2yf  1/1    Running  0         3m
guestbook-redis-replica-qgazl  1/1    Running  0         3m
```

## Aktualizacja etykiet {#updating-labels}

Czasami możesz chcieć zmienić etykiety istniejących podów i innych zasobów przed
utworzeniem nowych zasobów. Można to zrobić za pomocą `kubectl label`. Na
przykład, jeśli chcesz oznaczyć wszystkie swoje pody NGINX jako warstwę frontendową, wykonaj:

```shell
kubectl label pods -l app=nginx tier=fe
```

```none
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Najpierw filtruje wszystkie pody z etykietą "app=nginx", a następnie nadaje im
etykietę "tier=fe". Aby zobaczyć pody, które zostały oznaczone etykietą, uruchom:

```shell
kubectl get pods -l app=nginx -L tier
```

```none
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

To wyświetla wszystkie pody z etykietą "app=nginx", z dodatkową kolumną
etykiet reprezentującą warstwę podów (określoną za pomocą `-L` lub `--label-columns`).

Aby uzyskać więcej informacji, zobacz [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).

## {{% heading "whatsnext" %}}

- Dowiedz się, jak [dodać etykietę do węzła](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
- Zobacz [Well-known labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
- Zobacz [Zalecane etykiety](/docs/concepts/overview/working-with-objects/common-labels/)
- [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- Przeczytaj blog [Writing a Controller for Pod Labels](/blog/2021/06/21/writing-a-controller-for-pod-labels/)

