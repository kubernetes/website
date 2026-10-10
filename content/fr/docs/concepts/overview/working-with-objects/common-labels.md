---
title: labels recommandées
content_type: concept
weight: 100
---

<!-- overview -->
Vous pouvez visualiser et gérer les objets Kubernetes avec plus d'outils que kubectl et le tableau de bord. Un ensemble commun de labels permet aux outils de fonctionner de manière interopérable, en décrivant les objets de manière commune que tous les outils peuvent comprendre.

En plus de prendre en charge les outils, les labels recommandées décrivent les applications de manière à pouvoir être interrogées.


<!-- body -->
Les métadonnées sont organisées autour du concept d'une _application_. Kubernetes n'est pas une plateforme en tant que service (PaaS) et n'a pas de notion formelle d'une application. Au lieu de cela, les applications sont informelles et décrites avec des métadonnées. La définition de ce qu'une application contient est vague.

{{< note >}}
Ce sont des labels recommandées. Elles facilitent la gestion des applications mais ne sont pas requises pour les outils principaux.
{{< /note >}}

Les labels et annotations partagées ont un préfixe commun : `app.kubernetes.io`. Les labels sans préfixe sont privées aux utilisateurs. Le préfixe partagé garantit que les labels partagées n'interfèrent pas avec les labels personnalisées des utilisateurs.


## labels

Afin de tirer pleinement parti de l'utilisation de ces labels, elles doivent être appliquées à chaque objet de ressource.

| Clé                                 | Description           | Exemple  | Type |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | Le nom de l'application | `mysql` | string |
| `app.kubernetes.io/instance`        | Un nom unique identifiant l'instance d'une application | `mysql-abcxyz` | string |
| `app.kubernetes.io/version`         | La version actuelle de l'application (par exemple, un [SemVer 1.0](https://semver.org/spec/v1.0.0.html), un hachage de révision, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | Le composant au sein de l'architecture | `database` | string |
| `app.kubernetes.io/part-of`         | Le nom d'une application de niveau supérieur dont celle-ci fait partie | `wordpress` | string |
| `app.kubernetes.io/managed-by`      | L'outil utilisé pour gérer le fonctionnement d'une application | `Helm` | string |

Pour illustrer ces labels en action, considérez l'objet {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} suivant :

```yaml
# Ceci est un extrait
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

## Applications et instances d'applications

Une application peut être installée une ou plusieurs fois dans un cluster Kubernetes et, dans certains cas, dans le même namespace. Par exemple, WordPress peut être installé plusieurs fois où différents sites Web sont différentes installations de WordPress.

Le nom d'une application et le nom de l'instance sont enregistrés séparément. Par exemple, WordPress a un `app.kubernetes.io/name` de `wordpress` tandis qu'il a un nom d'instance, représenté par `app.kubernetes.io/instance` avec une valeur de `wordpress-abcxyz`. Cela permet d'identifier l'application et l'instance de l'application. Chaque instance d'une application doit avoir un nom unique.

## Exemples

Pour illustrer les différentes façons d'utiliser ces labels, les exemples suivants ont une complexité variable.

### Un service simple sans état

Considérez le cas d'un service simple sans état déployé à l'aide d'objets `Deployment` et `Service`. Les deux extraits suivants représentent comment les labels pourraient être utilisées dans leur forme la plus simple.

Le `Deployment` est utilisé pour superviser les pods exécutant l'application elle-même.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```
Le `Service` est utilisé pour exposer l'application.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```
### Application Web avec une base de données

Considérez une application légèrement plus complexe : une application web (WordPress) utilisant une base de données (MySQL), installée à l'aide de Helm. Les extraits suivants illustrent le début des objets utilisés pour déployer cette application.

Le début du `Deployment` suivant est utilisé pour WordPress :

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
Le `Service` est utilisé pour exposer WordPress :

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

MySQL est exposé en tant que `StatefulSet` avec des métadonnées à la fois pour lui-même et pour l'application plus large à laquelle il appartient :

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
Le `Service` est utilisé pour exposer MySQL en tant que partie de WordPress:

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

Avec le `StatefulSet` MySQL et le `Service`, vous remarquerez que des informations sur à la fois MySQL et WordPress, l'application plus large, sont incluses.
