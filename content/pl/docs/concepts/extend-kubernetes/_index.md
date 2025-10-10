---
title: Rozszerzanie Kubernetesa
weight: 999 # this section should come last
description: Różne sposoby na modyfikację działania klastra Kubernetesa.
feature:
  title: Zaprojektowany z myślą o rozszerzalności
  description: >
    Rozszerzanie funkcjonalności Kubernetesa bez ingerencji w oryginalny kod źródłowy.
content_type: concept
no_list: true
---






<!-- overview -->

Kubernetes jest wysoce konfigurowalny i rozbudowywalny. W rezultacie
rzadko istnieje potrzeba robienia forka lub przesyłania poprawek do kodu projektu.

Ten przewodnik opisuje opcje dostosowywania klastra Kubernetesa. Jest skierowany do
{{< glossary_tooltip text="operatorów klastrów" term_id="cluster-operator" >}}, którzy chcą
zrozumieć, jak dostosować swój klaster Kubernetesa do potrzeb środowiska
pracy. Programiści, którzy są potencjalnymi {{< glossary_tooltip text="Deweloperami Platformy" term_id="platform-developer" >}}
lub
{{< glossary_tooltip text="Współtwórcami" term_id="contributor" >}} projektu Kubernetes również uznają go za przydatny jako wprowadzenie
do istniejących punktów rozszerzeń i wzorców oraz ich kompromisów i ograniczeń.

Podejścia do dostosowywania można ogólnie podzielić na [konfigurację](#configuration),
która obejmuje tylko zmiany argumentów wiersza poleceń, lokalnych plików konfiguracyjnych lub
zasobów API; oraz [rozszerzenia](#extensions), które obejmują uruchamianie dodatkowych
programów, dodatkowych usług sieciowych lub obu. Ten dokument dotyczy przede wszystkim _rozszerzeń_.

<!-- body -->

## Konfiguracja {#configuration}

*Pliki konfiguracyjne* i *argumenty poleceń* są udokumentowane w sekcji
[Materiały źródłowe (ang. Reference)](/docs/reference/) dokumentacji online, z osobną stroną dla każdego pliku binarnego:

* [`kube-apiserver`](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/docs/reference/command-line-tools-reference/kube-proxy/)

Argumenty poleceń i pliki konfiguracyjne mogą nie zawsze być możliwe do zmiany w
hostowanej usłudze Kubernetesa lub w dystrybucji z zarządzaną instalacją. Kiedy są możliwe do zmiany,
zazwyczaj mogą być zmieniane tylko przez operatora klastra. Dodatkowo, mogą
ulegać zmianom w przyszłych wersjach Kubernetesa, a ich ustawienie może wymagać ponownego uruchomienia
procesów. Z tych powodów należy je używać tylko wtedy, gdy nie ma innych opcji.

Wbudowane *interfejsy API polityk*, takie jak [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) i Role-based Access Control (
[RBAC](/docs/reference/access-authn-authz/rbac/)), to natywne API Kubernetesa umożliwiające deklaratywną konfigurację polityk. Interfejsy
API są zazwyczaj użyteczne nawet w przypadku hostowanych usług Kubernetesa i zarządzanych instalacji Kubernetesa.
Wbudowane interfejsy API polityk przestrzegają tych samych konwencji co inne zasoby Kubernetesa, takie jak Pody. Gdy korzystasz
z API polityk, które są [stabilne](/docs/reference/using-api/#api-versioning), masz zapewnione
[określone wsparcie](/docs/reference/using-api/deprecation-policy/), zgodnie z ogólną polityką wsparcia API Kubernetesa.
Z tych powodów interfejsy API polityk są zalecane zamiast *plików konfiguracyjnych* i *argumentów poleceń*, tam gdzie to możliwe.

## Rozszerzenia {#extensions}

Rozszerzenia to komponenty oprogramowania, które rozszerzają i głęboko integrują
się z Kubernetesem. Dostosowują go do obsługi nowych typów i nowych rodzajów sprzętu.

Wielu administratorów klastra korzysta z hostowanej lub dystrybucyjnej instancji Kubernetesa.
Te klastry mają zainstalowane rozszerzenia. W rezultacie, większość użytkowników Kubernetesa
nie będzie musiała instalować rozszerzeń, a jeszcze mniej użytkowników będzie musiało tworzyć nowe.

### Wzorce rozszerzeń {#extension-patterns}

Kubernetes jest zaprojektowany tak, aby można go było zautomatyzować poprzez pisanie programów
klienckich. Każdy program, który odczytuje i/lub zapisuje do API
Kubernetesa, może zapewnić użyteczną automatyzację. *Automatyzacja* może działać zarówno na
klastrze, jak i poza nim. Postępując zgodnie z wytycznymi zawartymi w tym
dokumencie, możesz napisać wysoce dostępną i solidną automatyzację. Automatyzacja generalnie
działa z dowolnym klastrem Kubernetesa, w tym klastrami hostowanymi i zarządzanymi instalacjami.

Istnieje specyficzny wzorzec pisania programów klienckich, które dobrze
współpracują z Kubernetesem, zwany wzorcem
{{< glossary_tooltip term_id="controller" text="kontrolera" >}}. Kontrolery zazwyczaj odczytują `.spec` obiektu,
ewentualnie wykonują pewne czynności, a następnie aktualizują `.status` obiektu.

Kontroler jest klientem API Kubernetesa. Gdy Kubernetes działa jako klient i wywołuje zdalną
usługę, nazywa to *webhookiem*. Zdalna usługa nazywana jest *backendem webhooka*. Podobnie
jak w przypadku niestandardowych kontrolerów, webhooki stanowią dodatkowy potencjalny punkt awarii.

{{< note >}}
Poza Kubernetesen, termin "webhook" zazwyczaj odnosi się do mechanizmu
asynchronicznych powiadomień, gdzie wywołanie webhooka służy jako
jednostronne powiadomienie do innego systemu lub komponentu. W ekosystemie
Kubernetesa, nawet synchroniczne wywołania HTTP są często opisywane jako "webhooki".
{{< /note >}}

W modelu webhook Kubernetes wykonuje żądanie sieciowe do zdalnej usługi. W alternatywnym
modelu *binarnej wtyczki*, Kubernetes wykonuje program binarny. Wtyczki binarne są używane przez
kubelet (na przykład, [wtyczki magazynu CSI](https://kubernetes-csi.github.io/docs/) i
[wtyczki sieciowe CNI](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)), oraz
przez kubectl (zobacz [Rozszerz kubectl za pomocą wtyczek](/docs/tasks/extend-kubectl/kubectl-plugins/)).

### Punkty rozszerzeń {#extension-points}

Ten diagram pokazuje punkty rozszerzeń w klastrze
Kubernetesa oraz klientów, którzy uzyskują do niego dostęp.

<!-- image source: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

{{< figure src="/docs/concepts/extend-kubernetes/extension-points.png" alt="Symboliczne przedstawienie siedmiu ponumerowanych punktów rozszerzeń dla Kubernetesa" class="diagram-large" caption="Punkty rozszerzeń Kubernetesa" >}}


#### Klucz do rysunku {#key-to-the-figure}

1. Użytkownicy często wchodzą w interakcję z API Kubernetesa za pomocą `kubectl`.
   [Wtyczki](#client-extensions) dostosowują zachowanie klientów. Istnieją ogólne rozszerzenia,
   które mogą być stosowane do różnych klientów, a także specyficzne sposoby rozszerzania `kubectl`.

1. Serwer API obsługuje wszystkie żądania. Kilka typów punktów rozszerzeń w serwerze API
   umożliwia uwierzytelnianie żądań, blokowanie ich na podstawie ich treści, edytowanie treści oraz
   obsługę usuwania. Są one opisane w sekcji [Rozszerzenia dostępu do API](#api-access-extensions).

1. Serwer API obsługuje różne rodzaje *zasobów*. *Wbudowane rodzaje zasobów*, takie jak
   `pods`, są definiowane przez projekt Kubernetesa i nie mogą być modyfikowane. Przeczytaj
   [Rozszerzenia API](#api-extensions), aby dowiedzieć się więcej o rozszerzaniu API Kubernetesa.

1. Scheduler Kubernetesa [decyduje](/docs/concepts/scheduling-eviction/assign-pod-node/),
   na których węzłach umieścić pody. Istnieje kilka sposobów na rozszerzenie
   harmonogramowania, które są opisane w sekcji [Rozszerzenia harmonogramowania](#scheduling-extensions).

1. Duża część zachowań Kubernetesa jest realizowana przez programy zwane
   {{< glossary_tooltip term_id="controller" text="kontrolerami" >}}, które są klientami serwera API.
   Kontrolery są często używane w połączeniu z niestandardowymi zasobami.
   Przeczytaj [łączenie nowych API z automatyzacją](#combining-new-apis-with-automation)
   oraz [Zmiana wbudowanych zasobów](#changing-built-in-resources), aby dowiedzieć się więcej.

1. Kubelet działa na serwerach (węzłach) i pomaga podom wyglądać jak
   wirtualne serwery z własnymi adresami IP w sieci klastra.
   [Wtyczki sieciowe](#network-plugins) umożliwiają różne implementacje sieciowania podów.

1. Możesz użyć [Pluginów Urządzeń](#device-plugins), aby zintegrować
   niestandardowy sprzęt lub inne specjalne lokalne dla węzła funkcje i udostępnić je Podom
   działającym w Twoim klastrze. Kubelet zawiera wsparcie dla pracy z pluginami urządzeń.

   Kubelet również montuje i odmontowuje
   {{< glossary_tooltip text="volume" term_id="volume" >}} dla podów i ich kontenerów. Możesz użyć
   [wtyczek magazynowania](#storage-plugins), aby dodać
   obsługę nowych rodzajów magazynu (ang. storage) i innych typów wolumenów.


#### Schemat przepływu wyboru punktu rozszerzenia {#extension-flowchart}

Jeśli nie jesteś pewien, od czego zacząć, ten schemat blokowy może pomóc. Zwróć
uwagę, że niektóre rozwiązania mogą obejmować kilka typów rozszerzeń.

<!-- image source for flowchart: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

{{< figure src="/docs/concepts/extend-kubernetes/flowchart.svg" alt="Schemat blokowy z pytaniami o przypadki użycia i wskazówki dla wdrażających. Zielone koła oznaczają tak; czerwone koła oznaczają nie." class="diagram-large" caption="Przewodnik do wyboru metody rozszerzenia" >}}


---

## Rozszerzenia klienta {#client-extensions}

Wtyczki do `kubectl` to oddzielne pliki binarne, które dodają lub zastępują działanie określonych poleceń. Narzędzie `kubectl`
może również integrować się z [wtyczkami uwierzytelniania](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins).
Te rozszerzenia wpływają tylko na lokalne środowisko danego użytkownika, dlatego nie mogą wymuszać polityk dla całego serwisu.

Jeśli chcesz rozszerzyć narzędzie `kubectl`, przeczytaj [Rozszerzanie kubectl za pomocą wtyczek](/docs/tasks/extend-kubectl/kubectl-plugins/).

## Rozszerzenia API {#api-extensions}

### Definicje zasobów niestandardowych (ang. custom resource) {#custom-resource-definitions}

Rozważ dodanie _Custom Resource_ do Kubernetesa, jeśli chcesz zdefiniować
nowe kontrolery, obiekty konfiguracji aplikacji lub inne deklaratywne
interfejsy API i zarządzać nimi za pomocą narzędzi Kubernetesa, takich jak `kubectl`.

Aby dowiedzieć się więcej o zasobach niestandardowych, zapoznaj się z przewodnikiem po
[zasobach niestandardowych](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

### Warstwa agregacji API {#api-aggregation-layer}

Możesz użyć [warstwy agregacji API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) Kubernetesa, aby
zintegrować API Kubernetesa z dodatkowymi usługami, takimi jak [metryki](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/).

### Łączenie nowych interfejsów API z automatyzacją {#combining-new-apis-with-automation}

Kombinacja niestandardowego API zasobu i pętli sterowania nazywana jest wzorcem
{{< glossary_tooltip term_id="controller" text="controllers" >}}. Jeśli Twój kontroler zastępuje ludzkiego
operatora wdrażającego infrastrukturę na podstawie pożądanego stanu,
kontroler może również podążać za {{< glossary_tooltip text="wzorcem operatora" term_id="operator-pattern" >}}.
Wzorzec operatora jest używany do zarządzania specyficznymi aplikacjami; zazwyczaj
są to aplikacje, które utrzymują stan i wymagają uwagi w sposobie zarządzania nimi.

Możesz także tworzyć własne niestandardowe interfejsy API i pętle sterujące, które zarządzają
innymi zasobami, takimi jak storage, lub definiować polityki (takie jak ograniczenia kontroli dostępu).

### Zmiana wbudowanych zasobów {#changing-built-in-resources}

Kiedy rozszerzasz API Kubernetesa poprzez dodanie zasobów niestandardowych, dodane zasoby
zawsze trafiają do nowych grup API. Nie możesz zastąpić ani zmienić
istniejących grup API. Dodanie API nie pozwala bezpośrednio wpłynąć na zachowanie
istniejących API (takich jak Pody), podczas gdy _Rozszerzenia Dostępu do API_ mogą to zrobić.

## Rozszerzenia dostępu do API {#api-access-extensions}

Gdy żądanie trafia do serwera API Kubernetesa, najpierw jest
_uwierzytelniane_, następnie _autoryzowane_, i podlega różnym typom
_kontroli dostępu_ (niektóre żądania nie są uwierzytelniane i podlegają specjalnemu
przetwarzaniu). Zobacz [Kontrolowanie dostępu do API Kubernetesa](/docs/concepts/security/controlling-access/)
aby dowiedzieć się więcej o tym procesie.

Każdy z kroków w przepływie uwierzytelniania / autoryzacji Kubernetesa oferuje punkty rozszerzeń.

### Uwierzytelnianie {#authentication}

[Uwierzytelnianie](/docs/reference/access-authn-authz/authentication/) mapuje nagłówki
lub certyfikaty we wszystkich żądaniach do nazwy użytkownika dla klienta składającego żądanie.

Kubernetes ma kilka wbudowanych metod uwierzytelniania, które obsługuje. Może również
działać za proxy uwierzytelniającym, a także może wysyłać token z nagłówka `Authorization:` do
zdalnej usługi w celu weryfikacji (przez [authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
), jeśli te metody nie spełniają Twoich potrzeb.

### Autoryzacja {#authorization}

[Authorization](/docs/reference/access-authn-authz/authorization/) określa, czy
konkretni użytkownicy mogą odczytywać, zapisywać i wykonywać inne operacje na zasobach
API. Działa na poziomie całych zasobów -- nie rozróżnia na podstawie dowolnych pól obiektu.

Jeśli wbudowane opcje autoryzacji nie spełniają Twoich potrzeb,
[webhook autoryzacji](/docs/reference/access-authn-authz/webhook/) umożliwia wywołanie
niestandardowego kodu, który podejmuje decyzję autoryzacyjną.

### Dynamiczne sterowanie dostępem {#dynamic-admission-control}

Po autoryzacji żądania, jeśli jest to operacja zapisu, przechodzi również przez
kroki [Kontroli Przyjęć (ang. Admission Control)](/docs/reference/access-authn-authz/admission-controllers/).
Oprócz wbudowanych kroków, istnieje kilka rozszerzeń:

* [Webhook polityki obrazów](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  ogranicza, jakie obrazy mogą być uruchamiane w kontenerach.
* Aby podejmować dowolne decyzje dotyczące kontroli dostępu, można użyć ogólnego
  [webhooka dopuszczenia (ang. Admission webhook)](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks).
  Webhooki dopuszczenia mogą odrzucać żądania tworzenia lub aktualizacji.
  Niektóre webhooki modyfikują dane przychodzącego żądania, zanim zostaną one dalej obsłużone przez Kubernetesa.

## Rozszerzenia infrastruktury {#infrastructure-extensions}

### Wtyczki urządzeń {#device-plugins}

_Device plugins_ pozwalają węzłowi na odkrywanie nowych zasobów Węzła (oprócz
wbudowanych, takich jak CPU i pamięć) za pomocą
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).

### Wtyczki magazynowe (ang. Storage plugins) {#storage-plugins}

Wtyczki {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI)
dostarczają sposób na rozszerzenie Kubernetesa o wsparcie dla nowych rodzajów wolumenów.
Wolumeny mogą być obsługiwane przez trwałe zewnętrzne magazyny danych, dostarczać pamięć ulotną
lub oferować interfejs tylko do odczytu do informacji z wykorzystaniem paradygmatu systemu plików.

Kubernetes zawiera również wsparcie dla wtyczek
[FlexVolume](/docs/concepts/storage/volumes/#flexvolume), które są przestarzałe od wersji Kubernetes v1.23 (na rzecz CSI).

Wtyczki FlexVolume umożliwiają użytkownikom podłączanie typów woluminów, które nie są natywnie
obsługiwane przez Kubernetesa. Kiedy uruchamiasz Pod, który polega na magazynie FlexVolume, kubelet wywołuje
wtyczkę binarną, aby zamontować wolumin. Zarchiwizowany
[FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md) projekt wstępny zawiera więcej szczegółów na temat tego podejścia.

[FAQ dotyczące Wtyczki Wolumenów Kubernetesa dla Dostawców Pamięci](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
zawiera ogólne informacje na temat wtyczek do pamięci.

### Wtyczki sieciowe {#network-plugins}

Twój klaster Kubernetesa potrzebuje _wtyczki sieciowej_, aby mieć
działającą sieć Podów i wspierać inne aspekty modelu sieciowego Kubernetesa.

[Wtyczki sieciowe](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
pozwalają Kubernetesowi na współpracę z różnymi topologiami i technologiami sieciowymi.

### Wtyczki dostawcy poświadczeń obrazu dla Kubeleta {#kubelet-image-credential-provider-plugins}

{{< feature-state for_k8s_version="v1.26" state="stable" >}} Dostawcy
poświadczeń obrazów dla kubeleta to wtyczki dla kubeleta, które dynamicznie pobierają
poświadczenia rejestru obrazów. Poświadczenia te są następnie używane podczas
pobierania obrazów z rejestrów obrazów kontenerów, które odpowiadają konfiguracji.

Wtyczki mogą komunikować się z zewnętrznymi usługami lub korzystać z lokalnych
plików w celu uzyskania poświadczeń. W ten sposób kubelet nie musi mieć statycznych
poświadczeń dla każdego rejestru i może obsługiwać różne metody i protokoły uwierzytelniania.

Aby uzyskać szczegóły dotyczące konfiguracji wtyczki, zobacz
[Konfigurowanie dostawcy poświadczeń obrazu kubelet](/docs/tasks/administer-cluster/kubelet-credential-provider/).

## Rozszerzenia harmonogramowania {#scheduling-extensions}

Scheduler to specjalny typ kontrolera, który obserwuje pody i
przypisuje pody do węzłów. Domyślny scheduler może być całkowicie
zastąpiony, przy jednoczesnym dalszym korzystaniu z innych
komponentów Kubernetesa, lub [wielokrotne schedulery](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
mogą działać jednocześnie.

Jest to duże przedsięwzięcie i prawie wszyscy użytkownicy
Kubernetesa stwierdzają, że nie muszą modyfikować schedulera.

Możesz kontrolować, które [wtyczki planowania](/docs/reference/scheduling/config/#scheduling-plugins) są
aktywne, lub kojarzyć zestawy wtyczek z różnymi nazwanymi
[profilami schedulera](/docs/reference/scheduling/config/#multiple-profiles). Możesz również napisać własną wtyczkę, która integruje się z jednym lub więcej
[punktami rozszerzeń](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points) kube-schedulera.

Wreszcie, wbudowany komponent `kube-scheduler` obsługuje
[webhook](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md),
który pozwala zdalnemu backendowi HTTP (rozszerzenie schedulera) na
filtrowanie i/lub priorytetyzowanie węzłów, które kube-scheduler wybiera dla poda.

{{< note >}}
Za pomocą webhooka rozszerzającego harmonogram można wpływać
jedynie na filtrowanie węzłów i priorytetyzację węzłów; inne
punkty rozszerzenia nie są dostępne poprzez integrację webhooków.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Dowiedz się więcej o rozszerzeniach infrastruktury
  * [Wtyczki Urządzeń](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [Wtyczki sieciowe](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * Wtyczki do przechowywania CSI [storage plugins](https://kubernetes-csi.github.io/docs/)
* Dowiedz się więcej o [wtyczkach kubectl](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Dowiedz się więcej o [zasobach niestandardowych (ang. Custom Resources)](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Dowiedz się więcej o [serwerach API rozszerzeń](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* Dowiedz się więcej o [dynamicznym kontrolowaniu dostępu](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Dowiedz się więcej o [wzorcu Operatora](/docs/concepts/extend-kubernetes/operator/)
