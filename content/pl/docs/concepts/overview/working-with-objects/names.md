---
title: Nazwy i identyfikatory objektów
content_type: concept
weight: 30
---




<!-- overview -->

Każdy {{< glossary_tooltip text="obiekt" term_id="object" >}} w Twoim klastrze ma [_Nazwę_](#names), która jest unikalna dla
tego typu zasobu. Każdy obiekt Kubernetesa posiada również [_UID_](#uids), który jest unikalny w całym Twoim klastrze.

Na przykład, w jednym [namespace](/docs/concepts/overview/working-with-objects/namespaces/) można mieć tylko jeden Pod o nazwie `myapp-1234`, ale można mieć jeden Pod i jeden Deployment, które są nazwane `myapp-1234`.

Dla nieunikalnych atrybutów dostarczonych przez użytkownika, Kubernetes udostępnia [etykiety](/docs/concepts/overview/working-with-objects/labels/) oraz [adnotacje](/docs/concepts/overview/working-with-objects/annotations/).



<!-- body -->

## Nazwy {#names}

{{< glossary_definition term_id="name" length="all" >}}

**Nazwy muszą być unikalne we wszystkich [wersjach API](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)
dla tego samego zasobu. Zasoby API są rozróżniane na podstawie grupy API, typu zasobu,
przestrzeni nazw (dla zasobów przestrzeniozależnych) oraz nazwy. Innymi słowy, wersja API jest nieistotna w tym kontekście.**

{{< note >}}
W przypadkach, gdy obiekty reprezentują fizyczną jednostkę, jak Node reprezentujący fizycznego hosta, jeśli host jest odtworzony pod tą samą nazwą bez usuwania i ponownego tworzenia Node, Kubernetes traktuje nowy host jako stary, co może prowadzić do niespójności.
{{< /note >}}

Serwer może wygenerować nazwę, gdy zamiast `name` w żądaniu utworzenia zasobu podano `generateName`.
Gdy używane jest `generateName`, podana wartość służy jako prefiks nazwy, do którego serwer dodaje
wygenerowany sufiks. Nawet jeśli nazwa jest generowana, może wystąpić konflikt z istniejącymi nazwami, co
skutkuje odpowiedzią HTTP 409. W Kubernetes v1.31 i nowszych wersjach jest to znacznie mniej
prawdopodobne, ponieważ serwer podejmuje do 8 prób wygenerowania unikalnej nazwy przed zwróceniem odpowiedzi HTTP 409.

Poniżej znajdują się cztery typy często używanych ograniczeń nazw dla zasobów.

### Nazwy subdomen DNS {#dns-subdomain-names}

Większość typów zasobów wymaga nazwy, która może być używana jako
nazwa poddomeny DNS, zgodnie z definicją w
[RFC 1123](https://tools.ietf.org/html/rfc1123). Oznacza to, że nazwa musi:

- zawierać nie więcej niż 253 znaki
- zawierać tylko małe litery alfanumeryczne, '-' lub '.'
- zaczynać się od znaku alfanumerycznego
- kończyć się znakiem alfanumerycznym

### Nazwy etykiet zgodnie z RFC 1123 {#dns-label-names}

Niektóre typy zasobów wymagają, aby ich nazwy były zgodne
ze standardem etykiet DNS, jak zdefiniowano w
[RFC 1123](https://tools.ietf.org/html/rfc1123). Oznacza to, że nazwa musi:

- zawierać maksymalnie 63 znaków
- zawierać tylko małe litery alfanumeryczne lub '-'
- zaczynać się od litery alfabetu
- kończyć się znakiem alfanumerycznym

{{< note >}}
Gdy bramka funkcji `RelaxedServiceNameValidation` jest włączona,
nazwy obiektów usługi (ang. Service) mogą rozpoczynać się od cyfry.
{{< /note >}}

### Nazwy etykiet zgodne z RFC 1035 {#rfc-1035-label-names}

Niektóre typy zasobów wymagają, aby ich nazwy spełniały
standardy etykiet DNS zgodnie z definicją w
[RFC 1035](https://tools.ietf.org/html/rfc1035). Oznacza to, że nazwa musi:

- zawierać maksymalnie 63 znaków
- zawierać tylko małe litery alfanumeryczne lub '-'
- zaczynać się od litery alfabetu
- kończyć się znakiem alfanumerycznym

{{< note >}}
Chociaż RFC 1123 technicznie pozwala, aby etykiety zaczynały się od cyfr, obecna implementacja
Kubernetes wymaga, aby zarówno etykiety (ang. label) zgodne z RFC 1035, jak i RFC 1123 zaczynały
się od znaku alfabetycznego. Wyjątkiem jest sytuacja, gdy dla obiektów typu Service jest włączona
brama funkcji `RelaxedServiceNameValidation`, co pozwala na to, aby nazwy usług zaczynały się od cyfr.
{{< /note >}}

### Nazwy segmentów ścieżki {#path-segment-names}

Niektóre typy zasobów wymagają, aby ich nazwy mogły być
bezpiecznie kodowane jako segment ścieżki. Innymi słowy, nazwa nie
może być "." ani ".." oraz nie może zawierać "/" ani "%".

Oto przykładowy manifest dla Poda o nazwie `nginx-demo`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```


{{< note >}}
Niektóre typy zasobów mają dodatkowe ograniczenia dotyczące ich nazw.
{{< /note >}}

## UIDy {#uids}

{{< glossary_definition term_id="uid" length="all" >}}

UID-y Kubernetesa to uniwersalne unikalne identyfikatory (znane również
jako UUID). UUID są ustandaryzowane jako ISO/IEC 9834-8 oraz jako ITU-T X.667.


## {{% heading "whatsnext" %}}

* Przeczytaj o [etykietach](/docs/concepts/overview/working-with-objects/labels/) i [adnotacjach](/docs/concepts/overview/working-with-objects/annotations/) w Kubernetesie.
* Zobacz [Identyfikatory i nazwy w Kubernetesie](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md).
