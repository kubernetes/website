---
title: Pisanie nowego tematu
content_type: task
weight: 70
---

<!-- overview -->
Ta strona pokazuje, jak utworzyć nowy temat dla dokumentacji Kubernetesa.


## {{% heading "prerequisites" %}}

Utwórz fork repozytorium dokumentacji Kubernetesa, jak opisano w
[Otwieranie pull requesta](/docs/contribute/new-content/open-a-pr/).


<!-- steps -->

## Wybieranie typu strony {#choosing-a-page-type}

Przygotowując się do napisania nowego tematu, zastanów się nad typem strony, który najlepiej pasowałby do Twojej treści:

{{< table caption = "Wytyczne dotyczące wyboru typu strony" >}}
Typ | Opis
:--- | :----------
Pojecia (ang. Concept) | Strona o koncepcyjach (pojęciach) przedstawia różne aspekty Kubernetesa. Przykładowo, może opisywać obiekt Deployment w Kubernetes, wyjaśniając jego funkcję w aplikacji podczas jej wdrażania, skalowania i aktualizacji. Zazwyczaj strony koncepcyjne nie zawierają sekwencji kroków, lecz zamiast tego zapewniają linki do zadań lub samouczków. Dla przykładu tematu koncepcyjnego zobacz <a href="/docs/concepts/architecture/nodes/">Węzły</a>.
Zadanie (ang. Task) | Strona zadania to instrukcja, która pokazuje, jak wykonać konkretną czynność. Jej celem jest przedstawienie czytelnikowi kroków, które może realizować na bieżąco podczas lektury. Strona zadania może mieć różną długość, o ile pozostaje skupiona na jednym zagadnieniu. Można na niej łączyć krótkie wyjaśnienia z instrukcjami krok po kroku, ale jeśli konieczne jest szersze omówienie tematu, lepiej umieścić je na stronie koncepcyjnej. Powiązane strony zadań i koncepcji powinny odsyłać do siebie nawzajem. Przykład krótkiej strony zadania można znaleźć w <a href="/docs/tasks/configure-pod-container/configure-volume-storage/">Konfiguracja Pod do korzystania z Volumenu jako pamięci</a>. Przykład dłuższej strony zadania można znaleźć w <a href="/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">Konfiguracja Liveness i Readiness Probes</a>.
Samouczek (ang. Tutorial) | Strona z samouczkiem pokazuje, jak osiągnąć cel, który łączy ze sobą kilka funkcji Kubernetesa. Samouczek może zawierać kilka sekwencji kroków, które czytelnicy mogą faktycznie wykonać podczas czytania strony. Może również zawierać wyjaśnienia dotyczące powiązanych fragmentów kodu. Na przykład, samouczek może zapewniać przeprowadzenie przez przykładowy kod. Samouczek może zawierać krótkie wyjaśnienia funkcji Kubernetes, które są ze sobą łączone, ale powinien odsyłać do powiązanych tematów koncepcyjnych w celu dogłębnych wyjaśnień poszczególnych funkcji.
{{< /table >}}

### Tworzenie nowej strony {#creating-a-new-page}

Dla każdej nowej strony, którą tworzysz, zastosuj odpowiedni
[typ treści](/docs/contribute/style/page-content-types/). Strona dokumentacji
zapewnia szablony lub [archetypy Hugo](https://gohugo.io/content-management/archetypes/)
do tworzenia nowych stron z treścią. Aby utworzyć nowy typ
strony, uruchom `hugo new` z ścieżką do pliku, który chcesz utworzyć. Na przykład:

```
hugo new docs/concepts/my-first-concept.md
```

## Wybór tytułu i nazwy pliku {#choosing-a-title-and-filename}

Wybierz tytuł zawierający słowa kluczowe, które mają być łatwo
odnajdywane przez wyszukiwarki. Utwórz nazwę pliku, która
wykorzystuje słowa z tytułu oddzielone myślnikami. Na przykład, temat o
tytule [Korzystanie z HTTP Proxy do uzyskania dostępu do Kubernetes API](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
ma
nazwę pliku `http-proxy-access-api.md`. Nie musisz dodawać "słowa"
w nazwie pliku, ponieważ "kubernetes" jest już w URL dla tematu, na przykład:

       /docs/tasks/extend-kubernetes/http-proxy-access-api/

## Dodawanie tytułu tematu do sekcji wprowadzającej {#adding-the-topic-title-to-the-front-matter}

W swoim temacie umieść pole `title` we
[front matter](https://gohugo.io/content-management/front-matter/). _Front matter_
to blok YAML, który znajduje się
między linami z trzema myślnikami na górze strony. Oto przykład:

    ---
    title: Using an HTTP Proxy to Access the Kubernetes API
    ---

## Wybieranie katalogu {#choosing-a-directory}

W zależności od rodzaju strony umieść nowy plik w podfolderze jednego z tych katalogów:

* /content/en/docs/tasks/
* /content/en/docs/tutorials/
* /content/en/docs/concepts/

Możesz umieścić swój plik w istniejącym
podkatalogu albo utworzyć nowy podkatalog.

## Umieszczenie swojego tematu w spisie treści {#placing-your-topic-in-the-table-of-contents}

Spis treści tworzony jest dynamicznie przy użyciu
struktury katalogów dokumentacji. Katalogi najwyższego
poziomu pod `/content/en/docs/` tworzą nawigację
najwyższego poziomu, a podkatalogi mają swoje wpisy w spisie treści.

Każdy podkatalog zawiera plik `_index.md`, który reprezentuje stronę
główną dla zawartości danego podkatalogu. Plik `_index.md` nie wymaga szablonu.
Może zawierać poglądową treść dotyczącą tematów w podkatalogu.

Inne pliki w katalogu są domyślnie sortowane alfabetycznie. To prawie nigdy
nie jest najlepszy porządek. Aby kontrolować sortowanie
tematów w podkatalogu, ustaw klucz `weight:` we front-matter na liczbę
całkowitą. Zazwyczaj używamy wielokrotności 10, aby móc później dodać
inne tematy. Na przykład temat z wagą `10` znajdzie się przed tym z wagą `20`.

## Osadzanie kodu w swoim temacie {#embedding-code-in-your-topic}

Jeśli chcesz umieścić jakiś kod w swoim temacie, możesz umieścić kod
bezpośrednio w swoim pliku, używając składni bloku kodu markdown. Jest
to zalecane w następujących przypadkach (nie jest to lista wyczerpująca):

- Kod pokazuje wynik polecenia takiego jak
  `kubectl get deploy mydeployment -o json | jq '.status'`.
- Kod nie jest wystarczająco ogólny, aby użytkownicy
  mogli go wypróbować. Jako przykład, możesz osadzić plik
  YAML do tworzenia Poda, który zależy od konkretnej
  implementacji [FlexVolume](/docs/concepts/storage/volumes/#flexvolume).
- Kod jest niekompletnym przykładem, ponieważ jego celem jest
  wyróżnienie fragmentu większego pliku. Na przykład, opisując sposoby
  dostosowywania [RoleBinding](/docs/reference/access-authn-authz/rbac/#role-binding-examples),
  możesz zamieścić krótki fragment bezpośrednio w pliku tematu.
- Kod nie jest przeznaczony dla użytkowników do
  wypróbowania z innych powodów. Na przykład, opisując, jak dodać nowy atrybut
  do zasobu za pomocą polecenia `kubectl edit`,
  można podać krótki przykład, który zawiera tylko atrybut do dodania.

## Włączanie kodu z innego pliku {#including-code-from-another-file}

Innym sposobem na umieszczenie kodu w swoim temacie jest utworzenie nowego,
kompletnego przykładowego pliku (lub grupy plików), a następnie odwołanie się do
niego w swoim pliku tematu. Użyj tej metody, aby dołączyć przykładowe pliki YAML,
gdy są one ogólne i wielokrotnego użytku, a Ty chcesz, aby czytelnik sam ją wypróbował.

Gdy dodajesz nowy samodzielny przykładowy plik, taki jak plik YAML,
umieść kod w jednym z podkatalogów `<LANG>/examples/`, gdzie `<LANG>`
oznacza język dla danego tematu. W pliku tematu użyj skrótu `code_sample`:

```none
{{%/* code_sample file="<RELPATH>/my-example-yaml>" */%}}
```
gdzie `<RELPATH>` jest ścieżką do pliku do dołączenia, względną do
katalogu `examples`. Następujący kod Hugo odnosi się do pliku YAML
znajdującego się w `/content/en/examples/pods/storage/gce-volume.yaml`.

```none
{{%/* code_sample file="pods/storage/gce-volume.yaml" */%}}
```

## Pokazuje, jak utworzyć obiekt API z pliku konfiguracyjnego {#showing-how-to-create-an-api-object-from-a-configuration-file}

Jeśli musisz zademonstrować, jak utworzyć obiekt API
na podstawie pliku konfiguracyjnego, umieść plik
konfiguracyjny w jednym z podkatalogów pod `<LANG>/examples`.

W twoim temacie, pokaż to polecenie:

```
kubectl create -f https://k8s.io/examples/pods/storage/gce-volume.yaml
```

{{< note >}}
Podczas dodawania nowych plików YAML do katalogu `<LANG>/examples`,
upewnij się, że plik jest również dołączony do pliku
`<LANG>/examples_test.go`. Travis CI dla witryny automatycznie uruchamia ten przypadek testowy, gdy
zgłaszane są PR, aby upewnić się, że wszystkie przykłady przechodzą testy.
{{< /note >}}

Aby zapoznać się z przykładem tematu, który używa tej techniki, zobacz
[Uruchomienie aplikacji stateful z jednym instancją](/docs/tasks/run-application/run-single-instance-stateful-application/).

## Dodawanie obrazów do tematu {#adding-images-to-a-topic}

Umieść pliki obrazów w katalogu
`/images`. Preferowanym formatem obrazu jest SVG.



## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [używaniu typów zawartości strony](/docs/contribute/style/page-content-types/).
* Dowiedz się więcej o [tworzeniu pull requestu](/docs/contribute/new-content/open-a-pr/).

