---
title: Zalecane etykiety
content_type: concept
weight: 100
---

<!-- overview -->
Obiektami Kubernetesa można zarządzać i je wizualizować nie tylko za pomocą kubectl
i dashboardu. Wspólny zestaw etykiet umożliwia narzędziom
współdziałanie, opisując obiekty w jednolity sposób zrozumiały dla wszystkich narzędzi.

Oprócz wsparcia dla narzędzi, zalecane etykiety opisują
aplikacje w sposób umożliwiający ich wyszukiwanie i filtrowanie.


<!-- body -->
Metadane są zorganizowane wokół pojęcia _aplikacji_. Kubernetes nie
jest platformą jako usługa (PaaS) i nie posiada ani nie narzuca
formalnego pojęcia aplikacji. Zamiast tego aplikacje są nieformalne i
opisane za pomocą metadanych. Definicja tego, co zawiera aplikacja, jest luźna.

{{< note >}}
Są to zalecane etykiety. Ułatwiają zarządzanie
aplikacjami, ale nie są wymagane dla żadnych podstawowych narzędzi.
{{< /note >}}

Współdzielone etykiety i adnotacje mają prefiks: `app.kubernetes.io`.
Etykiety bez prefiksu są traktowane jako prywatne. Dzięki prefiksowi
etykiety współdzielone nie kolidują z etykietami definiowanymi przez użytkownika.

## Etykiety {#labels}

Żeby w pełni skorzystać z zalet etykiet,
warto dodawać je do każdego obiektu w systemie.

| Klucz                               | Opis                 | Przykład | Typ |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | Nazwa aplikacji | `mysql` | string |
| `app.kubernetes.io/instance`        | Unikalna nazwa identyfikująca instancję aplikacji | `mysql-abcxyz` | string |
| `app.kubernetes.io/version`         | Aktualna wersja aplikacji (np. [SemVer 1.0](https://semver.org/spec/v1.0.0.html), hash rewizji, itp.) | `5.7.21` | ciąg znaków |
| `app.kubernetes.io/component`       | Komponent w ramach architektury | `baza danych` | string |
| `app.kubernetes.io/part-of`         | Nazwa nadrzędnej aplikacji, do której należy ten element | `wordpress` | string |
| `app.kubernetes.io/managed-by`      | Narzędzie używane do zarządzania operacjami aplikacji | `Helm` | string |

Aby zilustrować działanie tych etykiet, rozważ następujący obiekt {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}:

```yaml
# This is an excerpt
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: Helm
```

## Aplikacje i instancje aplikacji {#applications-and-instances-of-applications}

Aplikacja może być zainstalowana jeden lub więcej razy w klastrze Kubernetesa, a w
niektórych przypadkach w tej samej przestrzeni nazw. Na przykład WordPress może być
zainstalowany więcej niż raz, gdzie różne strony internetowe to różne instalacje WordPressa.

Nazwa aplikacji i nazwa instancji są rejestrowane oddzielnie. Na
przykład, WordPress ma `app.kubernetes.io/name` o wartości `wordpress`,
natomiast nazwa instancji jest reprezentowana jako
`app.kubernetes.io/instance` z wartością `wordpress-abcxyz`. Umożliwia to identyfikację
aplikacji oraz jej instancji. Każda instancja aplikacji musi mieć unikalną nazwę.

## Przykłady {#examples}

Aby zilustrować różne sposoby wykorzystania tych etykiet, poniższe przykłady mają różny stopień złożoności.

### Prosta usługa bezstanowa (ang. Stateless Service) {#a-simple-stateless-service}

Rozważmy przypadek prostego serwisu bezstanowego wdrożonego przy użyciu obiektów `Deployment` i `Service`. Poniższe dwa fragmenty przedstawiają, jak etykiety mogą być używane w najprostszej formie.

`Deployment` jest używany do nadzorowania podów uruchamiających samą aplikację.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

`Service` służy do udostępniania aplikacji.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

### Aplikacja webowa z bazą danych {#web-application-with-a-database}

Rozważmy nieco bardziej skomplikowaną aplikację: aplikację webową
(WordPress) korzystającą z bazy danych (MySQL), zainstalowaną za pomocą Helm.
Poniższe fragmenty ilustrują początek obiektów użytych do wdrożenia tej aplikacji.

Początek następującego `Deployment` jest używany dla WordPressa:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxyz
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

`Service` jest używany do udostępniania WordPressa:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxyz
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

MySQL jest udostępniany jako `StatefulSet` z metadanymi zarówno dla niego, jak i dla nadrzędnej aplikacji, do której należy:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

`Serwis` jest używany do udostępniania MySQL jako część WordPressa:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

W `StatefulSet` i `Service` dla MySQL zawarte są informacje zarówno o MySQL, jak i o WordPressie, czyli nadrzędnej aplikacji.
