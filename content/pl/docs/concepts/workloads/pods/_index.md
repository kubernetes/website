---
title: Pod
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 10
no_list: true
---



<!-- overview -->

_Pod_ jest najmniejszą jednostką obliczeniową, którą można utworzyć i zarządzać nią w Kubernetesie.

_Pod_ (w języku angielskim: jak w odniesieniu do grupy wielorybów lub strąka grochu) to grupa jednego lub więcej
{{< glossary_tooltip text="kontenerów" term_id="container" >}}, z współdzielonymi zasobami pamięci i sieci, oraz specyfikacją
dotyczącą sposobu uruchamiania kontenerów. Wszystkie komponenty Poda są uruchamiane razem, współdzielą ten sam kontekst i są
planowane do uruchomienia na tym samym węźle. Pod modeluje specyficznego dla aplikacji "logicznego hosta": zawiera jeden lub więcej
kontenerów aplikacji, które są stosunkowo ściśle ze sobą powiązane. W kontekstach niechmurowych, aplikacje
wykonane na tej samej maszynie fizycznej lub wirtualnej są analogiczne do aplikacji chmurowych wykonanych na tym samym logicznym hoście.

Oprócz kontenerów aplikacyjnych, Pod może zawierać
{{< glossary_tooltip text="kontenery inicjalizujące" term_id="init-container" >}} uruchamiane
podczas startu Pod. Możesz również
wstrzyknąć {{< glossary_tooltip text="kontenery efemeryczne" term_id="ephemeral-container" >}}
do debugowania działającego Poda.

<!-- body -->

## Czym jest Pod? {#what-is-a-pod}

{{< note >}}
Musisz zainstalować [środowisko uruchomieniowe kontenerów](/docs/setup/production-environment/container-runtimes/)
na każdym węźle w klastrze, aby mogły tam działać Pody.
{{< /note >}}

Wspólny kontekst Poda to zestaw przestrzeni nazw Linux, cgroups i potencjalnie innych aspektów izolacji - te
same elementy, które izolują {{< glossary_tooltip text="kontener (ang. container)" term_id="container" >}}.
W obrębie kontekstu Poda, poszczególne aplikacje mogą mieć dodatkowo zastosowane dalsze sub-izolacje.

Pod jest podobny do zestawu kontenerów z współdzielonymi przestrzeniami nazw i współdzielonymi woluminami systemu plików.

Pody w klastrze Kubernetesa są używane na dwa główne sposoby:

* **Pody, które uruchamiają pojedynczy kontener**. Model
  "jeden-kontener-na-Poda" jest najczęstszym przypadkiem użycia; w tym przypadku
  możesz myśleć o Podzie jako o obudowie wokół pojedynczego kontenera; Kubernetes
  zarządza Podami, zamiast zarządzać kontenerami bezpośrednio.
* **Pody, które uruchamiają wiele kontenerów, które muszą współdziałać**.
  Pod może zawierać aplikację składającą się z
  [wielu współlokalizowanych kontenerów](#how-pods-manage-multiple-containers),
  które są ściśle powiązane i muszą współdzielić
  zasoby. Te współlokalizowane kontenery tworzą jedną spójną jednostkę.

  Grupowanie wielu współlokalizowanych i współzarządzanych kontenerów w jednym
  Podzie jest stosunkowo zaawansowanym przypadkiem użycia. Ten wzorzec powinieneś używać
  tylko w określonych przypadkach, gdy twoje kontenery są ściśle powiązane.

  Nie musisz uruchamiać wielu kontenerów, aby zapewnić replikację
  (dla odporności lub pojemności); jeśli potrzebujesz wielu replik,
  zobacz [zarządzanie workloadami](/docs/concepts/workloads/controllers/).

## Używanie Podów {#using-pods}

Poniżej znajduje się przykład Poda, który składa się z kontenera uruchamiającego obraz `nginx:1.14.2`.

{{% code_sample file="pods/simple-pod.yaml" %}}

Aby utworzyć Pod pokazany powyżej, uruchom następujące polecenie:
```shell
kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

Pody zazwyczaj nie są tworzone bezpośrednio tylko przy użyciu
specjalnych zadań (workload). Zobacz [Praca z Podami](#working-with-pods) aby
uzyskać więcej informacji na temat tego, jak Pody są używane z zasobami workload.

### Zasoby workload do zarządzania podami {#workload-resources-for-managing-pods}

Zazwyczaj nie musisz tworzyć Podów bezpośrednio, nawet pojedynczych Podów. Zamiast tego,
twórz je używając zasobów workload, takich jak {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
lub {{< glossary_tooltip text="Job" term_id="job" >}}. Jeśli Twoje Pody muszą
śledzić stan, rozważ użycie zasobu {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}.


Każdy Pod ma na celu uruchomienie pojedynczej instancji danej aplikacji. Jeśli
chcesz skalować swoją aplikację horyzontalnie (aby zapewnić więcej zasobów ogółem
poprzez uruchomienie większej liczby instancji), powinieneś użyć wielu Podów,
jednego dla każdej instancji. W Kubernetesie, operację tę zazwyczaj określa się
mianem _replikacji_. Replikowane Pody są zazwyczaj tworzone i zarządzane jako grupa
przez zasób workload i jego {{< glossary_tooltip text="kontroler" term_id="controller" >}}.

Zobacz [Pody i kontrolery](#pods-and-controllers), aby uzyskać więcej
informacji na temat tego, jak Kubernetes wykorzystuje zasoby workload oraz ich kontrolery
do implementacji skalowania aplikacji i automatycznego naprawiania.

Pody natywnie zapewniają dwa rodzaje zasobów współdzielonych dla ich
składowych kontenerów: [sieć](#pod-networking) i [przechowywanie](#pod-storage).


## Praca z Podami {#working-with-pods}

Rzadko będziesz tworzyć indywidualne Pody bezpośrednio w Kubernetesie - nawet
pojedyncze Pody. Dzieje się tak, ponieważ Pody są zaprojektowane jako stosunkowo efemeryczne,
jednorazowe obiekty. Kiedy Pod zostaje utworzony (bezpośrednio przez Ciebie lub pośrednio przez
{{< glossary_tooltip text="kontroller" term_id="controller" >}}), nowy Pod jest
planowany do uruchomienia na {{< glossary_tooltip text="węźle" term_id="node" >}} w
Twoim klastrze. Pod pozostaje na tym węźle, dopóki nie zakończy wykonywania, obiekt Poda
nie zostanie usunięty, Pod nie zostanie *usunięty* z powodu braku zasobów lub węzeł ulegnie awarii.

{{< note >}}
Restartowanie kontenera w Podzie nie powinno być mylone z
restartowaniem Poda. Pod nie jest procesem, ale środowiskiem do
uruchamiania kontenera(-ów). Pod trwa, dopóki nie zostanie usunięty.
{{< /note >}}

Nazwa Poda musi być prawidłową wartością
[poddomeny DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names), ale może to
powodować nieoczekiwane skutki w odniesieniu do jego nazwy hosta. Dla najlepszej kompatybilności,
nazwa powinna spełniać bardziej restrykcyjne zasady dla
[etykiety DNS](/docs/concepts/overview/working-with-objects/names#dns-label-names).

### System operacyjny Poda {#pod-os}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

Powinieneś ustawić pole `.spec.os.name` na `windows` lub `linux`, aby wskazać system
operacyjny, na którym chcesz uruchomić swojego Poda. Są to jedyne obsługiwane systemy
operacyjne przez Kubernetesa w chwili obecnej. W przyszłości lista ta może zostać rozszerzona.

W Kubernetesie v{{< skew currentVersion >}}, wartość `.spec.os.name` nie wpływa na to, w jaki
sposób {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
wybiera węzeł do uruchomienia Poda. W każdym klastrze, w którym istnieje więcej niż jeden
system operacyjny dla działających węzłów, powinieneś poprawnie ustawić etykietę
[kubernetes.io/os](/docs/reference/labels-annotations-taints/#kubernetes-io-os) na każdym węźle
i zdefiniować Pody z `nodeSelector` opartym na etykiecie systemu operacyjnego.
Kube-scheduler przypisuje Pody do węzłów na podstawie określonych kryteriów, ale nie zawsze
gwarantuje wybór węzła z właściwym systemem operacyjnym dla uruchamianych kontenerów.
[Standardy bezpieczeństwa Pod](/docs/concepts/security/pod-security-standards/) również używają tego
pola, aby uniknąć wymuszania polityk, które nie mają zastosowania dla danego systemu operacyjnego.

### Pody i kontrolery {#pods-and-controllers}

Możesz użyć zasobów workload do tworzenia i zarządzania wieloma Podami. Kontroler
dla zasobu obsługuje replikację, wdrażanie oraz automatyczne naprawianie
w przypadku awarii Poda. Na przykład, jeśli węzeł ulegnie
awarii, kontroler zauważa, że Pody na tym węźle przestały działać i
tworzy zastępczego Poda. Scheduler umieszcza zastępczego Poda na zdrowym węźle.

Oto kilka przykładów zasobów workload, które zarządzają Podami:

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} - komponent Kubernetesa służący do zarządzania aplikacjami stateful. StatefulSet zapewnia zachowanie kolejności i spójności danych w ramach aplikacji, co jest kluczowe dla usług wymagających takiego funkcjonowania. StatefulSet śledzi, które identyfikatory Podów są skojarzone z określonymi zasobami pamięci masowej i w jakiej kolejności powinny być tworzone oraz usuwane.
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

### Szablony Poda {#pod-templates}

Kontrolery zasobów {{< glossary_tooltip text="workload" term_id="workload" >}}
tworzą Pody z _szablonu poda_ i zarządzają tymi Podami w Twoim imieniu.

PodTemplates to specyfikacje do tworzenia Podów, które są
uwzględniane w zasobach workload, takich jak [Deployments](/docs/concepts/workloads/controllers/deployment/),
[Jobs](/docs/concepts/workloads/controllers/job/)
i [DaemonSets](/docs/concepts/workloads/controllers/daemonset/).

Każdy kontroler dla zasobu workload używa `PodTemplate` wewnątrz obiektu
workload do tworzenia rzeczywistych Podów. `PodTemplate` jest częścią pożądanego
stanu dowolnego zasobu workload, którego użyłeś do uruchomienia swojej aplikacji.

Gdy tworzysz Pod, możesz uwzględnić
[zmienne środowiskowe](/docs/tasks/inject-data-application/define-environment-variable-container/) w
szablonie Poda dla kontenerów, które działają w Podzie.

Poniższy przykład to manifest dla prostego zadania (Job) z `szablonem (template)`, który
uruchamia jeden kontener. Kontener w tym Podzie wyświetla komunikat, a następnie się zatrzymuje.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # This is the pod template
    spec:
      containers:
      - name: hello
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # The pod template ends here
```

Modyfikacja szablonu poda lub przejście na nowy szablon poda nie ma bezpośredniego
wpływu na już istniejące Pody. Jeśli zmienisz szablon poda dla zasobu workload, ten zasób
musi utworzyć nowe, zamienne Pody, które korzystają ze zaktualizowanego szablonu.

Na przykład kontroler StatefulSet zapewnia, że uruchomione Pody odpowiadają bieżącemu
szablonowi Poda dla każdego obiektu StatefulSet. Jeśli edytujesz StatefulSet, aby zmienić jego szablon,
StatefulSet zaczyna tworzyć nowe Pody na podstawie zaktualizowanego szablonu.
Ostatecznie, wszystkie stare Pody zostają zastąpione nowymi Podami, a aktualizacja jest zakończona.

Każdy zasób workload implementuje własne zasady dotyczące obsługi zmian w szablonie Pod. Jeśli
chcesz dowiedzieć się więcej o StatefulSet, zapoznaj się z
[strategią aktualizacji](/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets) w samouczku podstawy StatefulSet.

Na poziomie węzłów {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}
nie kontroluje bezpośrednio szczegółów dotyczących
szablonów Podów ani ich aktualizacji – są one zarządzane na wyższym
poziomie abstrakcji. Taka separacja upraszcza działanie systemu i
pozwala na rozszerzanie funkcjonalności klastra bez ingerencji w istniejący kod.

## Aktualizacja i wymiana Poda {#pod-update-and-replacement}

Jak wspomniano w poprzedniej sekcji, gdy szablon Poda dla zasobu
workload zostaje zmieniony, kontroler tworzy nowe Pody na podstawie
zaktualizowanego szablonu zamiast aktualizować lub łatać istniejące Pody.

Kubernetes nie uniemożliwia bezpośredniego zarządzania Podami.
Możliwe jest aktualizowanie niektórych pól działającego Poda, na
miejscu. Jednak operacje aktualizacji Poda, takie jak
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core), oraz
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
mają pewne ograniczenia:

- Większość metadanych o Podzie jest niezmienna. Na
  przykład, nie można zmienić pól `namespace`, `name`, `uid` ani
  `creationTimestamp`; pole `generation` jest unikalne.
  Akceptuje tylko aktualizacje, które zwiększają bieżącą wartość pola.
- Jeśli parametr `metadata.deletionTimestamp` jest
  ustawiony, nie można dodać nowego wpisu do listy `metadata.finalizers`.
- Aktualizacje Podów nie mogą zmieniać pól innych niż
  `spec.containers[*].image`, `spec.initContainers[*].image`, `spec.activeDeadlineSeconds` lub `spec.tolerations`.
  Dla `spec.tolerations` można jedynie dodawać nowe wpisy.
- Podczas aktualizacji pola
  `spec.activeDeadlineSeconds` dozwolone są dwa typy aktualizacji:

  1. ustawienie nieprzypisanego pola na liczbę dodatnią;
  1. aktualizacja pola z liczby
     dodatniej do mniejszej, nieujemnej liczby.

## Udostępnianie zasobów i komunikacja {#resource-sharing-and-communication}

Pody umożliwiają udostępnianie danych i
komunikację pomiędzy swoimi składowymi kontenerami.

### Pamięć masowa w Podach {#pod-storage}

Pod może określić zestaw współdzielonych zasobów pamięci masowej
({{< glossary_tooltip text="woluminów" term_id="volume" >}}). Wszystkie
kontenery w Podzie mają dostęp do tych woluminów, co umożliwia im
współdzielenie danych. Woluminy pozwalają również na utrzymanie danych w Podzie,
nawet jeśli jeden z jego kontenerów wymaga ponownego uruchomienia. Zobacz
sekcję [Storage](/docs/concepts/storage/), aby dowiedzieć się więcej o
tym, jak Kubernetes implementuje współdzieloną pamięć masową i udostępnia ją Podom.

### Sieci Poda {#pod-networking}

Każdy Pod ma przypisany unikalny adres IP dla każdej rodziny adresów. Każdy kontener
w Podzie dzieli przestrzeń nazw sieci, w tym adres IP i porty
sieciowe. Wewnątrz Poda (i **tylko** wtedy) kontenery, które należą do Poda
mogą komunikować się ze sobą za pomocą `localhost`. Kiedy kontenery w Podzie
komunikują się z jednostkami *poza Podem*, muszą koordynować sposób
korzystania ze wspólnych zasobów sieciowych (takich jak porty). W ramach Poda,
kontenery dzielą adres IP i przestrzeń portów, i mogą znaleźć się nawzajem za
pośrednictwem `localhost`. Kontenery w Podzie mogą również komunikować się
między sobą za pomocą standardowych komunikatów międzyprocesowych, takich
jak semafory SystemV lub współdzielona pamięć POSIX. Kontenery w różnych
Podach mają różne adresy IP i nie mogą komunikować się poprzez IPC na poziomie systemu
operacyjnego bez specjalnej konfiguracji. Kontenery, które chcą
nawiązać interakcję z kontenerem działającym w innym Podzie, mogą używać sieci IP do komunikacji.

Kontenery w ramach Pod mają tę samą nazwę hosta systemowego, co
skonfigurowane `name` dla Pod. Więcej na ten temat znajduje się w sekcji
[sieci](https://kubernetes.io/docs/concepts/cluster-administration/networking/).

## Ustawienia zabezpieczeń Poda {#pod-security}

Aby ustawić ograniczenia bezpieczeństwa na Podach i kontenerach, używasz
pola `securityContext` w specyfikacji Poda. To pole daje Ci szczegółową
kontrolę nad tym, co Pody lub poszczególne kontenery mogą robić. Na przykład:

* Usunąć specyficzne uprawnienia Linuxa, aby uniknąć podatności CVE.
* Wymusić, aby wszystkie procesy w Podzie były uruchamiane jako użytkownik
  nie-root lub jako określony ID użytkownika lub grupy.
* Ustawić konkretny profil seccomp.
* Ustawić opcje bezpieczeństwa systemu Windows, takie jak to, czy kontenery działają jako HostProcess.

{{< caution >}}
Możesz również użyć `securityContext` dla Poda, aby włączyć
[_tryb uprzywilejowany_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers) w
kontenerach Linux. Tryb uprzywilejowany nadpisuje wiele innych ustawień
bezpieczeństwa w `securityContext`. Unikaj używania tego ustawienia, chyba że nie
możesz przyznać równoważnych uprawnień, korzystając z innych pól w `securityContext`. W Kubernetesie
1.26 i nowszych, możesz uruchamiać kontenery Windows w podobnie
uprzywilejowanym trybie, ustawiając flagę `windowsOptions.hostProcess` w kontekście
bezpieczeństwa w specyfikacji Poda. Aby uzyskać szczegóły i instrukcje, zobacz
[Utwórz Pod HostProcess w Windows](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
{{< /caution >}}

* Aby dowiedzieć się o ograniczeniach bezpieczeństwa na poziomie jądra, które można użyć, zobacz
  [Ograniczenia bezpieczeństwa jądra Linux dla Podów i kontenerów](/docs/concepts/security/linux-kernel-security-constraints).
* Aby dowiedzieć się więcej na temat kontekstu bezpieczeństwa Poda, zobacz
  [Konfigurowanie kontekstu bezpieczeństwa dla Poda lub kontenera](/docs/tasks/configure-pod-container/security-context/).

## Statyczne Pody {#static-pods}

_Statyczne Pody_ są zarządzane bezpośrednio przez demona kubelet na
określonym węźle, bez nadzoru przez {{< glossary_tooltip text="serwer API" term_id="kube-apiserver" >}}.
Podczas gdy większość Podów jest zarządzana przez warstwę
sterowania (na przykład przez
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}), w przypadku statycznych Podów to kubelet
bezpośrednio nadzoruje każdy statyczny Pod (i restartuje go, jeśli ulegnie awarii).

Statyczne Pody są zawsze powiązane z jednym komponentem {{< glossary_tooltip term_id="kubelet" >}} na konkretnym węźle.
Głównym zastosowaniem statycznych Podów jest uruchamianie samodzielnie hostowanej warstwy sterowania: innymi słowy, użycie
kubeleta do nadzorowania poszczególnych [komponentów warstwy sterowania](/docs/concepts/architecture/#control-plane-components).

Kubelet automatycznie próbuje utworzyć {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
na serwerze API Kubernetesa dla każdego statycznego Poda. Oznacza to, że Pody działające
na węźle są widoczne na serwerze API, ale nie mogą być z niego kontrolowane. Więcej informacji
znajdziesz w przewodniku [Tworzenie statycznych Podów](/docs/tasks/configure-pod-container/static-pod).

{{< note >}}
`spec` statycznego Poda nie może odwoływać się do innych obiektów
API (np. {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, itp.).
{{< /note >}}

## Pody z wieloma kontenerami {#how-pods-manage-multiple-containers}

Pody są zaprojektowane do obsługi wielu współpracujących procesów (jako
kontenery), które tworzą spójną jednostkę usługi. Kontenery w Podzie są
automatycznie współlokowane i współharmonogramowane na tej samej fizycznej
lub wirtualnej maszynie w klastrze. Kontenery mogą współdzielić zasoby i
zależności, komunikować się ze sobą oraz koordynować, kiedy i jak są zakończane.

<!--intentionally repeats some text from earlier in the page, with more detail -->
Pody w klastrze Kubernetesa są używane na dwa główne sposoby:

* **Pody, które uruchamiają pojedynczy kontener**. Model
  "jeden-kontener-na-Poda" jest najczęstszym przypadkiem użycia; w tym przypadku
  możesz myśleć o Podzie jako o obudowie wokół pojedynczego kontenera; Kubernetes
  zarządza Podami, zamiast zarządzać kontenerami bezpośrednio.
* **Pody, które uruchamiają wiele kontenerów, które muszą współpracować**.
  Pod może zawierać aplikację składającą się z
  wielu współlokalizowanych kontenerów, które są ściśle
  powiązane i muszą współdzielić zasoby. Te współlokalizowane
  kontenery tworzą jedną spójną jednostkę usługi - na przykład,
  jeden kontener udostępniający dane przechowywane we
  współdzielonym wolumenie publicznym, podczas gdy osobny
  {{< glossary_tooltip text="kontener sidecar" term_id="sidecar-container" >}} odświeża
  lub aktualizuje te pliki. Pod łączy te kontenery,
  zasoby pamięci, oraz efemeryczną tożsamość sieciową razem jako jedną jednostkę.

Na przykład, możesz mieć kontener, który działa jako serwer webowy dla
plików we współdzielonym wolumenie oraz oddzielny
[kontener pomocniczy (ang. sidecar container)](/docs/concepts/workloads/pods/sidecar-containers/), który aktualizuje
te pliki z zewnętrznego źródła, jak pokazano na poniższym diagramie:

{{< figure src="/images/docs/pod.svg" alt="Diagram tworzenia Pod" class="diagram-medium" >}}

Niektóre Pody mają {{< glossary_tooltip text="kontenery inicjujące" term_id="init-container" >}}
oraz {{< glossary_tooltip text="kontenery aplikacji" term_id="app-container" >}}. Domyślnie,
kontenery inicjujące uruchamiają się i kończą przed startem kontenerów aplikacji.

Możesz również mieć [kontenery pomocnicze](/docs/concepts/workloads/pods/sidecar-containers/),
które świadczą usługi pomocnicze dla głównej aplikacji w Podzie.

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

Domyślnie włączona bramka funkcji `SidecarContainers`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) pozwala na określenie
`restartPolicy: Always` dla kontenerów inicjalizacyjnych. Ustawienie
polityki restartu `Always` zapewnia, że kontenery, dla których ją ustawisz, są
traktowane jako _sidecar_ i są utrzymywane w działaniu przez cały czas życia
Poda. Kontenery, które określisz jako kontenery sidecar, uruchamiają się przed
główną aplikacją w Podzie i pozostają uruchomione do momentu, gdy Pod zostanie zamknięty.


## Kontenerowe sondy (ang. Container probes) {#container-probes}

_Sonda (ang. probe)_ to diagnostyka wykonywana okresowo przez kubelet na kontenerze. Aby przeprowadzić diagnostykę, kubelet może wywoływać różne akcje:

- `ExecAction` (wykonywane za pomocą środowiska uruchomieniowego kontenera)
- `TCPSocketAction` (sprawdzane bezpośrednio przez kubelet)
- `HTTPGetAction` (sprawdzane bezpośrednio przez kubelet)

Możesz przeczytać więcej o [sondach](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
w dokumentacji cyklu życia Poda.

## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [cyklu życia Poda](/docs/concepts/workloads/pods/pod-lifecycle/).
* Dowiedz się o [RuntimeClass](/docs/concepts/containers/runtime-class/) i o tym, jak
  możesz go użyć do konfigurowania różnych Podów z różnymi konfiguracjami runtime kontenerów.
* Przeczytaj o [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) i dowiedz się, jak możesz go używać do zarządzania dostępnością aplikacji podczas zakłóceń.
* Pod jest zasobem najwyższego poziomu w REST API
  Kubernetesa. Definicja obiektu {{< api-reference page="workload-resources/pod-v1" >}}
  opisuje szczegółowo ten obiekt.
* [Toolkit systemu rozproszonego: Wzorce dla kontenerów złożonych](/blog/2015/06/the-distributed-system-toolkit-patterns/) wyjaśnia typowe układy dla Podów z więcej niż jednym kontenerem.
* Przeczytaj o [ograniczeniach topologii Podów](/docs/concepts/scheduling-eviction/topology-spread-constraints/)

Aby zrozumieć kontekst, dlaczego Kubernetes opakowuje wspólne API Poda w inne zasoby (takie jak {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} lub {{< glossary_tooltip text="Deployments" term_id="deployment" >}}), możesz przeczytać o wcześniejszych rozwiązaniach, w tym:

* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)
* [Marathon](https://github.com/d2iq-archive/marathon)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).
