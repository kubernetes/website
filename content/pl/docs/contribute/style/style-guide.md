---
title: Przewodnik stylu
linktitle: Przewodnik stylu
content_type: concept
weight: 40
---

<!-- overview -->
Ta strona zawiera wytyczne dotyczące stylu pisania dokumentacji
Kubernetesa.  Są to wytyczne, a nie zasady. Użyj swojego najlepszego
osądu i śmiało proponuj zmiany w tym dokumencie za pomocą pull requesta.

Aby uzyskać dodatkowe informacje na temat tworzenia nowej zawartości dokumentacji Kubernetesa,
przeczytaj [Przewodnik treści](/docs/contribute/style/content-guide/).

Zmiany w przewodniku stylu są dokonywane przez grupę SIG Docs. Aby zaproponować zmianę
lub dodatek, [dodaj go do agendy](https://bit.ly/sig-docs-agenda) na
nadchodzące spotkanie SIG Docs i weź udział w spotkaniu, aby uczestniczyć w dyskusji.

<!-- body -->

{{< note >}}
Dokumentacja Kubernetesa wykorzystuje
[Goldmark Markdown Renderer](https://github.com/yuin/goldmark) z pewnymi
modyfikacjami oraz kilkoma
[Kody Hugo](/docs/contribute/style/hugo-shortcodes/) do obsługi
wpisów słownikowych, zakładek i przedstawiania stanu funkcji.
{{< /note >}}

## Język {#language}

Dokumentacja Kubernetesa została przetłumaczona na wiele języków (zobacz
[Localization READMEs](https://github.com/kubernetes/website/blob/main/README.md#localization-readmemds)).

Sposób lokalizacji dokumentacji na inny język jest opisany w [Lokalizowanie dokumentacji Kubernetesa](/docs/contribute/localization/).

Anglojęzyczna dokumentacja używa amerykańskiej pisowni i gramatyki.

{{< comment >}}[Jeśli tłumaczysz tę stronę, możesz pominąć punkt dotyczący języka angielskiego w wersji US.]{{< /comment >}}

## Standardy formatowania dokumentacji {#documentation-formatting-standards}

### Używaj wielbłądziego zapisu z dużą literą na początku dla obiektów API {#use-upper-camel-case-for-api-objects}

Kiedy odnosisz się konkretnie do interakcji z obiektem API, używaj
[UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case), znanej również jako
Pascal case. Możesz zobaczyć różne formaty wielkości liter, takie jak
„configMap”, w [Dokumentacji API](/docs/reference/kubernetes-api/). Pisząc
ogólną dokumentację, lepiej używać formatu Upper Camel Case, nazywając to „ConfigMap”.

Kiedy ogólnie omawiasz obiekt API, używaj [stylu kapitalizacji zdań](https://docs.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization).


Poniższe przykłady koncentrują się na kapitalizacji. Aby uzyskać więcej informacji na temat formatowania
nazw obiektów API, zapoznaj się z powiązanymi wskazówkami dotyczącymi [Stylu Kodowania](#code-style-inline-code).

{{< table caption = "Zalecane i niezalecane - Używaj notacji PascalCase dla obiektów API" >}}
Zalecane | Niezalecane
:--| :-----
The HorizontalPodAutoscaler resource is responsible for ... | The Horizontal pod autoscaler is responsible for ...
A PodList object is a list of pods. | A Pod List object is a list of pods.
Obiekt Volume zawiera pole `hostPath`. | Obiekt Volume zawiera pole hostPath.
Każdy obiekt ConfigMap jest częścią przestrzeni nazw. | Każdy obiekt configMap jest częścią przestrzeni nazw.
Do zarządzania poufnymi danymi rozważ użycie API Secret. | Do zarządzania poufnymi danymi rozważ użycie API secret.
{{< /table >}}

### Użyj nawiasów trójkątnych dla symboli zastępczych {#use-angle-brackets-for-placeholders}

Użyj nawiasów trójkątnych do symboli zastępczych. Powiedz
czytelnikowi, co symbol zastępczy reprezentuje, na przykład:

Pokaż informacje o podzie:

```shell
kubectl describe pod <pod-name> -n <namespace>
```

Jeśli przestrzeń nazw poda to `default`, możesz pominąć parametr '-n'.

### Użyj pogrubienia dla elementów interfejsu użytkownika. {#use-bold-for-user-interface-elements}

{{< table caption = "Zalecane i niezalecane - Elementy interfejsu wyróżnione pogrubioną czcionką" >}}
Zalecane | Niezalecane
:--| :-----
Kliknij **Fork**. | Kliknij "Fork".
Wybierz **Inne**. | Wybierz "Inne".
{{< /table >}}

### Użyj kursywy, aby zdefiniować lub wprowadzić nowe terminy. {#use-italics-to-define-or-introduce-new-terms}

{{< table caption = "Rób i nie rób - Używaj kursywy dla nowych terminów" >}}
Zalecane | Niezalecane
:--| :-----
Ten _klaster_ jest zbiorem węzłów ... | "Klaster" to zestaw węzłów ...
Te komponenty tworzą _control plane_. | Te komponenty tworzą **control plane**.
{{< /table >}}

### Użyj stylu kodu dla nazw plików, katalogów i ścieżek {#use-code-style-for-filenames-directories-and-paths}

{{< table caption = "Rób i nie rób - Używaj stylu kodu dla nazw plików, katalogów i ścieżek" >}}
Zalecane | Niezalecane
:--| :-----
Otwórz plik `envars.yaml`. | Otwórz plik envars.yaml.
Przejdź do katalogu `/docs/tutorials`. | Przejdź do katalogu /docs/tutorials.
Otwórz plik `/_data/concepts.yaml`. | Otwórz plik /\_data/concepts.yaml.
{{< /table >}}

### Używaj międzynarodowego standardu dla interpunkcji wewnątrz cudzysłowów. {#use-the-international-standard-for-punctuation-inside-quotes}

{{< table caption = "Rób i Nie Rób - Używaj międzynarodowego standardu dla interpunkcji wewnątrz cudzysłowów" >}}
Zalecane | Niezalecane
:--| :-----
zdarzenia są rejestrowane z przypisanym "etapem". | zdarzenia są rejestrowane z przypisanym "etapem."
Kopia nazywana jest "fork". | Kopia nazywana jest "fork".
{{< /table >}}

## Formatowanie kodu w linii {#inline-code-formatting}

### Używaj stylu kodu dla poleceń i kodu w linii {#code-style-inline-code}

Dla kodu w linii w dokumencie HTML użyj znacznika `<code>`. W
dokumencie Markdown użyj odwrotnego cudzysłowu (`` ` ``). Jednak rodzaje
API, takie jak StatefulSet lub ConfigMap, są zapisywane dosłownie
(bez odwrotnego cudzysłowu); pozwala to na używanie apostrofów dzierżawczych.

{{< table caption = "Rób i Nie Rób - Używaj stylu kodu dla kodu w tekście, poleceń i obiektów API" >}}
Zalecane | Niezalecane
:--| :-----
Polecenie `kubectl run` tworzy Pod. | Polecenie "kubectl run" tworzy Pod.
Kubelet na każdym węźle uzyskuje Lease... | Kubelet na każdym węźle uzyskuje `Lease`...
PersistentVolume reprezentuje trwałą pamięć… | A `PersistentVolume` reprezentuje trwałą pamięć…
Pole `.spec.group` elementu CustomResourceDefinition… | Pole `CustomResourceDefinition.spec.group` elementu…
Dla zarządzania deklaratywnego, użyj `kubectl apply`. | Dla zarządzania deklaratywnego, użyj "kubectl apply".
Umieść przykłady kodu w trzech odwrotnych apostrofach (\`\`\`). | Umieść przykłady kodu w dowolnej innej składni.
Użyj pojedynczych backticków do zamknięcia kodu w linii. Na przykład, `var example = true`. | Użyj dwóch gwiazdek (`**`) lub podkreślenia (`_`) do zamknięcia kodu w linii. Na przykład, **var example = true**.
Użyj trzech odwrotnych apostrofów przed i po wieloliniowym bloku kodu, aby utworzyć ogrodzony blok kodu. | Używaj wieloliniowych bloków kodu do tworzenia diagramów, schematów blokowych lub innych ilustracji.
Używaj znaczących nazw zmiennych, które mają kontekst. | Używaj nazw zmiennych takich jak 'foo', 'bar' i 'baz', które nie są znaczące i nie mają kontekstu.
Usuń końcowe spacje w kodzie. | Dodaj końcowe spacje w kodzie, tam gdzie są one ważne, ponieważ czytnik ekranowy odczyta również spacje.
{{< /table >}}

{{< note >}}
Strona internetowa obsługuje podświetlanie składni w przykładach kodu, ale określenie języka jest opcjonalne.
Podświetlanie składni w bloku kodu powinno być zgodne z wytycznymi
[contrast guidelines.](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
{{< /note >}}

### Użyj stylu kodu dla nazw pól obiektów i przestrzeni nazw {#use-code-style-for-object-field-names-and-namespaces}

{{< table caption = "Zalecenia i Przestrogi - Używaj stylu kodu dla nazw pól obiektów" >}}
Zalecane | Niezalecane
:--| :-----
Ustaw wartość pola `replicas` w pliku konfiguracyjnym. | Ustaw wartość pola "replicas" w pliku konfiguracyjnym.
Wartość pola `exec` jest obiektem ExecAction. | Wartość pola "exec" jest obiektem ExecAction.
Uruchom proces jako DaemonSet w przestrzeni nazw `kube-system`. | Uruchom proces jako DaemonSet w przestrzeni nazw kube-system.
{{< /table >}}

### Użyj stylu kodu dla narzędzi poleceń i nazw komponentów Kubernetesa. {#use-code-style-for-kubernetes-command-tool-and-component-names}

{{< table caption = "Zalecane i niezalecane - Używaj stylu kodu dla narzędzi i nazw komponentów Kubernetesa" >}}
Zalecane | Niezalecane
:--| :-----
`kubelet` zachowuje stabilność węzła. | kubelet zachowuje stabilność węzła.
`kubectl` zajmuje się lokalizowaniem i uwierzytelnianiem do serwera API. | kubectl zajmuje się lokalizowaniem i uwierzytelnianiem do serwera API.
Uruchom proces z certyfikatem, `kube-apiserver --client-ca-file=FILENAME`. | Uruchom proces z certyfikatem, kube-apiserver --client-ca-file=FILENAME. |
{{< /table >}}

### Rozpoczęcie zdania nazwą narzędzia składowego lub elementu składowego. {#starting-a-sentence-with-a-component-tool-or-component-name}

{{< table caption = "Rób i nie rób - Rozpoczynanie zdania od narzędzia składowego lub nazwy komponentu" >}}
Zalecane | Niezalecane
:--| :-----
Narzędzie `kubeadm` inicjuje i konfiguruje maszyny w klastrze. | `kubeadm` inicjuje i konfiguruje maszyny w klastrze.
Domyślnym schedulerem dla Kubernetesa jest kube-scheduler. | kube-scheduler jest domyślnym schedulerem dla Kubernetesa.
{{< /table >}}

### Użyj ogólnego deskryptora zamiast nazwy komponentu (ang.). {#use-a-general-descriptor-over-a-component-name}

{{< table caption = "Zalecane i niezalecane - Używaj ogólnego opisu zamiast nazwy komponentu" >}}
Zalecane | Niezalecane
:--| :-----
The Kubernetes API server offers an OpenAPI spec. | The apiserver offers an OpenAPI spec.
Aggregated APIs are subordinate API servers. | Aggregated APIs are subordinate APIServers.
{{< /table >}}

### Użyj normalnego stylu dla wartości pól typu string i integer. {#use-normal-style-for-string-and-integer-field-values}

Dla wartości pól typu string lub integer, używaj normalnego stylu bez cudzysłowów.

{{< table caption = "Rób i Nie Rób - Używaj normalnego stylu dla wartości pól typu string i integer" >}}
Zalecane | Niezalecane
:--| :-----
Ustaw wartość `imagePullPolicy` na Always. | Ustaw wartość `imagePullPolicy` na "Always".
Ustaw wartość `image` na nginx:1.16. | Ustaw wartość `image` na `nginx:1.16`.
Ustaw wartość pola `replicas` na 2. | Ustaw wartość pola `replicas` na `2`.
{{< /table >}}

Jednak rozważ umieszczenie wartości w cudzysłowie, jeśli
istnieje ryzyko, że czytelnicy mogą pomylić wartość z rodzajem API.

## Odwoływanie się do zasobów API Kubernetesa {#referring-to-kubernetes-api-resources}

Ta sekcja omawia, jak odwołujemy się do zasobów API w dokumentacji.

### Wyjaśnienie dotyczące "zasobu" (ang. resource) {#clarification-about-resource}

Kubernetes używa słowa _zasób_ w odniesieniu do zasobów API. Na
przykład, ścieżka URL `/apis/apps/v1/namespaces/default/deployments/my-app`
reprezentuje Deployment o nazwie "my-app" w "default"
{{< glossary_tooltip text="namespace" term_id="namespace" >}}. W żargonie HTTP,
{{< glossary_tooltip text="namespace" term_id="namespace" >}} jest
zasobem - w taki sam sposób, w jaki wszystkie adresy URL w sieci identyfikują zasób.

Dokumentacja Kubernetesa również używa "zasób" w kontekście żądań i
ograniczeń CPU oraz pamięci. Bardzo często dobrym pomysłem
jest odniesienie się do zasobów API jako "zasoby API"; to pomaga
uniknąć pomyłki z zasobami CPU i pamięci, lub z innymi rodzajami zasobów.

Jeśli używasz nazwy zasobu w formie mnogiej pisanej małymi literami, takiej
jak `deployments` lub `configmaps`, dostarcz dodatkowe pisemne wyjaśnienia,
aby pomóc czytelnikom zrozumieć, co masz na myśli. Jeśli używasz tego terminu w kontekście,
w którym nazwa UpperCamelCase również mogłaby się sprawdzić i
istnieje ryzyko niejednoznaczności, rozważ użycie rodzaju API w formacie UpperCamelCase.

### Kiedy używać terminologii API Kubernetes {#when-to-use-kubernetes-api-terminologies}

Różne terminologie API Kubernetes to:

- _Rodzaje API_: nazwa używana w URL API (takie jak `pods`,
  `namespaces`). Rodzaje API są czasami nazywane także _typami zasobów_.
- _Zasób API_: pojedyncza instancja rodzaju API (takiego jak `pod`, `secret`).
- _Obiekt_: zasób, który służy jako "zamierzony stan". Obiekt to pożądany stan dla konkretnej
  części Twojego klastra, który warstwa serowania (ang. control plane)
  Kubernetesa stara się utrzymać. Wszystkie obiekty w API Kubernetes są również zasobami.

Dla jasności, możesz dodać "zasób" lub "obiekt", gdy odnosisz
się do zasobu API w dokumentacji Kubernetesa. Przykład: napisz
"obiekt typu Secret" zamiast "Secret". Jeśli jest to jasne
wystarczy tylko z wielkiej litery, nie musisz dodawać dodatkowego słowa.

Rozważ przeformułowanie, gdy taka zmiana pomaga uniknąć nieporozumień. Częsta sytuacja
występuje, gdy chcesz rozpocząć zdanie od typu API, takiego jak „Secret”; ponieważ w języku
angielskim i innych językach używa się wielkich liter na początku zdań, czytelnicy nie mogą stwierdzić,
czy masz na myśli typ API, czy ogólne pojęcie. Przekształcenie zdania może pomóc.

### Nazwy zasobów API {#api-resource-names}

Zawsze formatuj nazwy zasobów API używając [UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case),
znanego również jako PascalCase. Nie zapisuj rodzajów API z formatowaniem kodu.

Nie dziel nazwy obiektu API na oddzielne słowa. Na przykład, użyj PodTemplateList, a nie Pod Template List.

Aby uzyskać więcej informacji na temat PascalCase i formatowania kodu, zapoznaj się z powiązanymi wytycznymi dotyczącymi
[Używaj wielbłądziego zapisu z wielkiej litery dla obiektów API](/docs/contribute/style/style-guide/#use-upper-camel-case-for-api-objects) i
[Używaj stylu kodu dla wierszowego kodu (ang. inline code), poleceń i obiektów API](/docs/contribute/style/style-guide/#code-style-inline-code).

Aby uzyskać więcej informacji na temat terminologii interfejsu API Kubernetes, zapoznaj się z odpowiednimi
wytycznymi dotyczącymi [terminologii Kubernetes API](/docs/reference/using-api/api-concepts/#standard-api-terminology).

## Formatowanie fragmentu kodu {#code-snippet-formatting}

### Nie dołączaj symbolu zachęty (prompt) w poleceniu {#dont-include-the-command-prompt}

{{< table caption = "Rób i Nie Rób - Nie dołączaj znaku zachęty wiersza poleceń" >}}
Zalecane | Niezalecane
:--| :-----
`kubectl get pods` | `$ kubectl get pods`
{{< /table >}}

### Oddziel polecenia od wyników. {#separate-commands-from-output}

Zweryfikuj, czy pod działa na wybranym węźle:

```shell
kubectl get pods --output=wide
```

Wyjście jest podobny do tego:

```console
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

### Wersjonowanie przykładów Kubernetesa {#versioning-kubernetes-examples}

Przykłady kodu i przykłady konfiguracji zawierające
informacje o wersji powinny być zgodne z towarzyszącym tekstem.

Jeśli informacje są specyficzne dla wersji, wersja Kubernetesa musi być zdefiniowana w sekcji
`prerequisites` szablonu [Task template](/docs/contribute/style/page-content-types/#task) lub
szablonu [Tutorial template](/docs/contribute/style/page-content-types/#tutorial). Po zapisaniu
strony, sekcja `prerequisites` jest pokazywana jako **Zanim zaczniesz** (ang. **Before you begin**).

Aby określić wersję Kubernetesa dla zadania lub strony
tutoriala, umieść `min-kubernetes-server-version` w przedmowie strony.

Jeśli przykładowy plik YAML znajduje się w osobnym pliku, znajdź i przejrzyj tematy, które go zawierają jako
odniesienie. Zweryfikuj, czy wszystkie tematy używające samodzielnego pliku YAML mają zdefiniowane odpowiednie informacje o
wersji. Jeśli samodzielny plik YAML nie jest odniesieniem w żadnym temacie, rozważ jego usunięcie zamiast aktualizowania.

Na przykład, jeśli piszesz samouczek, który jest odpowiedni dla Kubernetesa
w wersji 1.8, główna część twojego pliku markdown powinna wyglądać następująco:

```yaml
---
title: <your tutorial title here>
min-kubernetes-server-version: v1.8
---
```

W przykładach kodu i konfiguracji, nie zamieszczaj komentarzy na temat alternatywnych wersji.
Uważaj, aby nie zamieszczać niepoprawnych stwierdzeń w swoich przykładach jako komentarzy, takich jak:

```yaml
apiVersion: v1 # earlier versions use...
kind: Pod
...
```

## Kubernetes.io lista słów {#kubernetesio-word-list}

Lista terminów i słów specyficznych dla Kubernetesa, które należy stosować konsekwentnie w całej witrynie.

{{< table caption = "Kubernetes.io lista słów" >}}
Termin | Użycie
:--- | :----
Kubernetes | Kubernetes zawsze powinno być pisane wielką literą.
Docker | Docker powinien zawsze być pisany wielką literą.
SIG Docs | SIG Docs zamiast SIG-DOCS lub innych wariantów.
On-premises | On-premises lub On-prem zamiast On-premise lub innych wariantów.
cloud native | Cloud native lub cloud native, w zależności od odpowiedniej struktury zdania, zamiast cloud-native lub Cloud Native.
open source | Otwarty kod źródłowy lub otwarty kod źródłowy, odpowiednio do struktury zdania, zamiast open-source lub Open Source.
{{< /table >}}

## Kody {#shortcodes}

[Shortcody](https://gohugo.io/content-management/shortcodes) Hugo
pomagają tworzyć różne poziomy przekazu. Nasza dokumentacja obsługuje
trzy różne skróty w tej kategorii: **Informacja** `{{</* note */>}}`,
**Uwaga** `{{</* caution */>}}`, oraz **Ostrzeżenie** `{{</* warning */>}}`.

1. Otocz tekst otwierającym i zamykającym kodem.

2. Użyj następującej składni, aby zastosować styl:

   ```none
   {{</* note */>}}
   Nie musisz dodawać prefiksu - shortcode generuje go automatycznie (Note:, Caution:, itp.)
   {{</* /note */>}}
   ```

   Wynik to:

   {{< note >}}
   Nie musisz dodawać prefiksu - kod generuje go automatycznie (Note:, Caution:, itp.)
   {{< /note >}}

### Note {#note}

Użyj `{{</* note */>}}`, aby wyróżnić wskazówkę lub informację, która może być przydatna do poznania.

Na przykład:

```
{{</* note */>}}
Możesz _nadal_ używać składni Markdown wewnątrz tych komunikatów.
{{</* /note */>}}
```

Wynik to:

{{< note >}}
Możesz _nadal_ używać składni Markdown wewnątrz tych komunikatów.
{{< /note >}}

Możesz użyć `{{</* note */>}}` w liście:

```
1. Użyj shortcode'u note na liście

1. Drugi element z osadzoną notatką

    {{</* note */>}}
    Shortcody Warning, Caution i Note, osadzone w listach, muszą być wcięte o cztery spacje. Zobacz [Typowe problemy ze shortcode'ami](#common-shortcode-issues).
    {{</* /note */>}}

1. Trzecia pozycja na liście

1. Czwarty element na liście
```

Wynik to:

1. Użyj kodu note na liście

1. Drugi element z osadzoną notatką

    {{< note >}}
    Shortcody Warning, Caution i Note, osadzone w listach, muszą być wcięte o cztery spacje. Zobacz [Typowe problemy ze kodami](#common-shortcode-issues).
    {{< /note >}}

1. Trzecia pozycja na liście

1. Czwarty element na liście

### Caution {#caution}

Użyj `{{</* caution */>}}`, aby zwrócić uwagę na ważną informację w celu uniknięcia pułapek.

Na przykład:

```
{{</* caution */>}}
Styl wyróżnienia ma zastosowanie tylko do linii bezpośrednio powyżej tagu.
{{</* /caution */>}}
```

Wynik to:

{{< caution >}}
Styl wyróżnienia ma zastosowanie tylko do linii bezpośrednio powyżej tagu.
{{< /caution >}}

### Warning {#warning}

Użyj `{{</* warning */>}}`, aby wskazać niebezpieczeństwo lub kluczową informację, której należy przestrzegać.

Na przykład:

```
{{</* warning */>}}
Uwaga.
{{</* /warning */>}}
```

Wynik to:

{{< warning >}}
Uwaga.
{{< /warning >}}

## Typowe problemy z kodami {#common-shortcode-issues}

### Listy uporządkowane {#ordered-lists}

Kody przerwą numerowane listy, chyba że dodasz wcięcie na cztery spacje przed `{{ note }}` i tagiem.

Na przykład:

    1. Rozgrzej piekarnik do 350˚F.

    1. Przygotuj ciasto i wlej do tortownicy.
       {{</* note */>}}Nasmaruj patelnię dla najlepszych rezultatów.{{</* /note */>}}

    1. Piecz przez 20-25 minut lub do momentu, aż się zetnie.

Wynik to:

1. Rozgrzej piekarnik do 350˚F

1. Przygotuj ciasto i wlej do tortownicy.

   {{< note >}}Nasmaruj patelnię dla najlepszych rezultatów.{{< /note >}}

1. Piecz przez 20-25 minut lub do momentu, aż się zetnie.

### Dołącz instrukcje {#include-statements}

Umieszczanie kodów w instrukcjach include spowoduje błąd kompilacji.
Należy je dodać w dokumencie nadrzędnym - przed i po wywołaniu include. Przykład:

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```

## Elementy Markdown {#markdown-elements}

### Przerwy w wierszach {#line-breaks}

Użyj pojedynczego znaku nowej linii do oddzielenia treści blokowej, takiej jak
nagłówki, listy, obrazy, bloki kodu i inne. Wyjątkiem są nagłówki drugiego poziomu,
gdzie powinny być dwa znaki nowej linii. Nagłówki drugiego poziomu następują po
nagłówkach pierwszego poziomu (lub tytule) bez żadnych poprzedzających akapitów lub
tekstów. Dwuliniowy odstęp pomaga lepiej wizualizować ogólną strukturę treści w edytorze kodu.

W odpowiednich miejscach ręcznie łam wiersze w plikach Markdown.
Ponieważ Git i GitHub generują różnice w plikach w oparciu o
pojedyncze linie, dzielenie długich linii ułatwia recenzentom
przeglądanie zmian w pull requeście i dodawanie komentarzy. Jest to także
pomocne dla zespołów lokalizacyjnych, które śledzą zmiany w
oryginalnym tekście na poziomie pojedynczych linii. Łamanie linii może
następować na końcu zdania lub po znaku interpunkcyjnym. Wyjątkiem od tej
zasady są linki Markdown oraz kody, które powinny pozostawać w jednej linii.

### Nagłówki i tytuły {#headings}

Osoby korzystające z tej dokumentacji mogą używać czytnika ekranu lub innej technologii
wspomagającej (AT). [Czytniki ekranu](https://en.wikipedia.org/wiki/Screen_reader) to urządzenia liniowego
odczytu - przetwarzają zawartość strony sekwencyjnie, element po elemencie. Jeśli strona zawiera dużą
ilość treści, warto używać nagłówków do organizacji wewnętrznej struktury dokumentu. Dobrze zaplanowana struktura
strony ułatwia wszystkim użytkownikom nawigację oraz szybkie wyszukiwanie interesujących tematów.

{{< table caption = "Co robić, a czego unikać – Nagłówki" >}}
Zalecane | Niezalecane
:--| :-----
Zaktualizuj tytuł w sekcji front matter strony lub wpisu na blogu. | Użyj nagłówka pierwszego poziomu, ponieważ Hugo automatycznie konwertuje tytuł w sekcji front matter strony na nagłówek pierwszego poziomu.
Używaj uporządkowanych nagłówków, aby zapewnić sensowny, ogólny zarys swojej treści. | Używaj nagłówków poziomu od 4 do 6, chyba że jest to absolutnie konieczne. Jeśli Twoje treści są tak szczegółowe, mogą wymagać podziału na oddzielne artykuły.
Używaj znaków funta lub hash (`#`) do treści niebędącej wpisami na blogu. | Używaj podkreślników (`---` lub `===`) do oznaczania nagłówków pierwszego poziomu.
Używaj pisowni zdania dla nagłówków w treści strony. Na przykład, **Rozszerz kubectl za pomocą wtyczek** | Używaj pisowni tytułowej dla nagłówków w treści strony. Na przykład, **Rozszerz Kubectl Za Pomocą Wtyczek**
Użyj pisowni tytułów z wielkich liter dla tytułu strony w części _front matter_. Na przykład, `title: Kubernetes API Server Bypass Risks` | Użyj pisowni tytułów z małych liter dla tytułów stron w części _front matter_. Na przykład, nie używaj `title: Kubernetes API server bypass risks`
Umieść odpowiednie linki w treści. | Uwzględnij hiperłącza (`<a href=""></a>`) w nagłówkach.
Używaj znaków funta lub krzyżyka (`#`) do oznaczania nagłówków. | Używaj **pogrubionego** tekstu lub innych znaczników do dzielenia akapitów.
{{< /table >}}

### Akapity {#paragraphs}

{{< table caption = "Zrób i nie rób - Akapity" >}}
Zalecane | Niezalecane
:--| :-----
Spróbuj utrzymać akapity poniżej 6 zdań. | Wcięcie pierwszego akapitu za pomocą znaków spacji. Na przykład, ⋅⋅⋅Trzy spacje przed akapitem spowodują wcięcie.
Użyj trzech myślników (`---`), aby utworzyć poziomą linię. Używaj poziomych linii do przerw w treści akapitu. Na przykład, zmiana tematu w ramach sekcji. | Używaj poziomych linii do dekoracji.
{{< /table >}}

### Linki {#links}

{{< table caption = "Zalecane i niezalecane - Linki" >}}
Zalecane | Niezalecane
:--| :-----
Rób hiperłącza, które dostarczają kontekstu do treści, do której prowadzą. Na przykład: Niektóre porty są otwarte na twoich maszynach. Zobacz <a href="#check-required-ports">Sprawdź wymagane porty</a> aby uzyskać więcej szczegółów. | Używaj niejasnych określeń, takich jak "kliknij tutaj". Na przykład: Niektóre porty są otwarte na twoich maszynach. Zobacz <a href="#check-required-ports">tutaj</a> aby uzyskać więcej szczegółów.
Napisz linki w stylu Markdown: `[tekst linku](URL)`. Na przykład: `[Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions)` a wynik to [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions). | Napisz linki w stylu HTML: `<a href="/media/examples/link-element-example.css" target="_blank">Odwiedź nasz tutorial!</a>`, lub twórz linki otwierające się w nowych kartach lub oknach. Na przykład: `[przykładowa strona](https://example.com){target="_blank"}`
{{< /table >}}

### Listy {#lists}

Grupuj elementy na liście, które są ze sobą powiązane i muszą pojawić się w określonej
kolejności lub aby wskazać korelację między wieloma elementami. Gdy czytnik ekranowy natknie się na
listę—czy to listę uporządkowaną, czy nieuporządkowaną—zostanie ogłoszone użytkownikowi, że
istnieje grupa elementów listy. Użytkownik może następnie użyć klawiszy strzałek, aby poruszać
się w górę i w dół między różnymi elementami na liście. Linki nawigacyjne witryny internetowej
mogą być również oznaczone jako elementy listy; w końcu są one niczym innym jak grupą powiązanych linków.

- Zakończ każdy element listy kropką, jeśli jeden lub więcej elementów na liście to pełne zdania.
  Dla zachowania spójności, zazwyczaj wszystkie elementy lub żaden z nich powinny być pełnymi zdaniami.

  {{< note >}}
  Uporządkowane listy będące kontynuacją niepełnego zdania wprowadzającego mogą być zapisane małymi
  literami i powinny być interpunkcyjnie traktowane tak, jakby każdy element stanowił część tego zdania.
  {{< /note >}}

- Użyj cyfry jeden (`1.`) dla list numerowanych.

- Użyj (`+`), (`*`), lub (`-`) dla list nieuporządkowanych.

- Pozostaw pustą linię po każdej liście.

- Wcięcie zagnieżdżonych list za pomocą czterech spacji (na przykład, ⋅⋅⋅⋅).

- Elementy list mogą składać się z wielu akapitów. Każdy kolejny
  akapit w elemencie listy musi być wcięty o cztery spacje lub jeden tabulator.

### Tabele {#tables}

Semantycznym celem tabeli danych jest przedstawienie danych tabelarycznych. Użytkownicy widzący mogą
szybko przeglądać tabelę, ale czytnik ekranu przechodzi przez nią linia po linii. Do
stworzenia opisu tabeli danych używa się podpisu tabeli. Technologie wspomagające (AT) używają
elementu podpisu tabeli HTML, aby zidentyfikować zawartość tabeli użytkownikowi w ramach struktury strony.

- Dodaj podpisy tabel, używając [Kody Hugo](/docs/contribute/style/hugo-shortcodes/#table-captions) dla tabel.

## Najlepsze praktyki dotyczące treści {#content-best-practices}

Ta sekcja zawiera sugerowane najlepsze praktyki dotyczące jasnej, zwięzłej i spójnej treści.

### Używaj czasu teraźniejszego {#use-present-tense}

{{< table caption = "Rób i nie rób - Używaj czasu teraźniejszego" >}}
Zalecane | Niezalecane
:--| :-----
Ta komenda uruchamia proxy. | Ta komenda uruchomi proxy.
 {{< /table >}}

Wyjątek: Używaj czasu przyszłego lub przeszłego,
jeśli jest to konieczne do przekazania poprawnego znaczenia.

### Używaj strony czynnej. {#use-active-voice}

{{< table caption = "Rób i Nie Rób - Używaj strony czynnej" >}}
Zalecane | Niezalecane
:--| :-----
Możesz eksplorować API za pomocą przeglądarki. | API można eksplorować za pomocą przeglądarki.
Plik YAML określa liczbę replik. | Liczba replik jest określona w pliku YAML.
{{< /table >}}

Wyjątek: Użyj strony biernej, jeśli strona czynna prowadzi do niezręcznej konstrukcji zdania.

### Używaj prostego i bezpośredniego języka {#use-simple-and-direct-language}

Używaj prostego i bezpośredniego języka. Unikaj używania zbędnych fraz, takich jak mówienie „proszę”.

{{< table caption = "Rób i nie rób - Używaj prostego i bezpośredniego języka" >}}
Zalecane | Niezalecane
:--| :-----
To create a ReplicaSet, ... | In order to create a ReplicaSet, ...
Zobacz plik konfiguracyjny. | Proszę zobaczyć plik konfiguracyjny.
Wyświetl zasobniki. | Następnym poleceniem wyświetlimy zasobniki.
{{< /table >}}

### Zwracaj się do czytelnika jako "ty" {#address-the-reader-as-you}

{{< table caption = "Zalecenia i Przestrogi - Zwracanie się do czytelnika" >}}
Zalecane | Niezalecane
:--| :-----
Możesz utworzyć Deployment, wykonując ... | Utworzymy Deployment, wykonując ...
W poprzednim wyniku możesz zobaczyć... | W poprzednim wyniku widzimy ...
{{< /table >}}

### Unikaj łacińskich zwrotów {#avoid-latin-phrases}

Preferuj angielskie terminy nad łacińskimi skrótami.

{{< table caption = "Zalecane i niezalecane - Unikaj fraz łacińskich" >}}
Zalecane | Niezalecane
:--| :-----
Na przykład, ... | np., ...
To znaczy, ...| tj., ...
{{< /table >}}

Wyjątek: Użyj "itp." dla et cetera.

## Wzorce do unikania {#patterns-to-avoid}

### Unikaj używania "my" {#avoid-using-we}

Użycie "my" w zdaniu może być mylące, ponieważ
czytelnik może nie wiedzieć, czy jest częścią opisywanego "my".

{{< table caption = "Zalecane i niezalecane - Wzorce do unikania" >}}
Zalecane | Niezalecane
:--| :-----
Wersja 1.4 zawiera ... | W wersji 1.4 dodaliśmy ...
Kubernetes oferuje nową funkcję ... | Oferujemy nową funkcję ...
Ta strona uczy, jak używać podów. | Na tej stronie nauczymy się o podach.
{{< /table >}}

### Unikaj żargonu i idiomów (ang.) {#avoid-jargon-and-idioms}

Niektórzy czytelnicy mówią po angielsku jako w drugim języku. Unikaj żargonu i idiomów, aby pomóc im zrozumieć lepiej.

{{< table caption = "Rób i Nie Rób - Unikaj żargonu i idiomów" >}}
Zalecane | Niezalecane
:--| :-----
Internally, ... | Under the hood, ...
Create a new cluster. | Turn up a new cluster.
{{< /table >}}

### Unikaj stwierdzeń dotyczących przyszłości {#avoid-statements-about-the-future}

Unikaj składania obietnic lub dawania wskazówek dotyczących przyszłości.
Jeśli musisz mówić o funkcji alfa, umieść
tekst pod nagłówkiem, który identyfikuje go jako informację alfa.

Wyjątkiem od tej zasady jest dokumentacja dotycząca ogłoszonych przestarzałych funkcji
przeznaczonych do usunięcia w przyszłych wersjach. Przykładem takiej dokumentacji jest
[Przewodnik migracji przestarzałych interfejsów API](/docs/reference/using-api/deprecation-guide/).

### Unikaj stwierdzeń, które wkrótce staną się nieaktualne. {#avoid-statements-that-will-soon-be-out-of-date}

Unikaj słów takich jak "obecnie" i "nowy". Funkcja, która
jest nowa dzisiaj, za kilka miesięcy może nie być uważana za nową.

{{< table caption = "Zalecane i niezalecane - Unikaj stwierdzeń, które wkrótce staną się nieaktualne" >}}
Zalecane | Niezalecane
:--| :-----
W wersji 1.4, ... | W obecnej wersji, ...
Funkcja Federation oferuje ... | Nowa funkcja Federation oferuje ...
{{< /table >}}

### Unikaj słów, które zakładają określony poziom zrozumienia. {#avoid-words-that-assume-a-specific-level-of-understanding}

Unikaj słów takich jak "po prostu", "łatwo", "łatwy", "prosty" czy "łatwy". Te słowa nie dodają wartości.

{{< table caption = "Zrobić i Nie robić - Unikaj niewrażliwych słów" >}}
Zalecane | Niezalecane
:--| :-----
Uwzględnij jedną komendę w ... | Uwzględnij tylko jedną komendę w ...
Uruchom kontener ... | Po prostu uruchom kontener ...
Możesz usunąć ... | Możesz łatwo usunąć ...
Te kroki ... | Te proste kroki ...
{{< /table >}}

### Plik EditorConfig {#editorconfig-file}
Projekt Kubernetesa utrzymuje plik EditorConfig, który ustawia wspólne preferencje stylu w edytorach
tekstu, takich jak VS Code. Możesz użyć tego pliku, jeśli chcesz zapewnić, że
twoje wkłady są spójne z resztą projektu. Aby zobaczyć plik, zajrzyj do
[`.editorconfig`](https://github.com/kubernetes/website/blob/main/.editorconfig) w głównym katalogu repozytorium.

## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [pisaniu nowego tematu](/docs/contribute/style/write-new-topic/).
* Dowiedz się więcej o [korzystaniu z szablonów stron](/docs/contribute/style/page-content-types/).
* Dowiedz się więcej o [niestandardowych kodach hugo](/docs/contribute/style/hugo-shortcodes/).
* Dowiedz się więcej o [tworzeniu pull requesta](/docs/contribute/new-content/open-a-pr/).