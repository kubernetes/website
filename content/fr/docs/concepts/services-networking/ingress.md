---
reviewers:
- remyleone
- feloy
- rekcah78
- rbenzair
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  Rendez votre service réseau HTTP (ou HTTPS) accessible grâce à un mécanisme de configuration
  sensible au protocole et comprend les concepts du web comme les URI, les noms d'hôte, les chemins, etc.
  Le concept d'Ingress vous permet d'acheminer le trafic vers différents backends selon des règles
  que vous définissez via l'API Kubernetes.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
Le projet Kubernetes recommande d'utiliser [Gateway](https://gateway-api.sigs.k8s.io/) plutôt
qu'[Ingress](/docs/concepts/services-networking/ingress/).
L'API Ingress est figée.

Cela signifie que :
* L'API Ingress est en disponibilité générale (GA) et soumise aux [garanties de stabilité](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) prévues pour les API GA.
  Le projet Kubernetes n'a pas l'intention de retirer Ingress de Kubernetes.
* L'API Ingress n'est plus développée et ne recevra plus aucune modification
  ni mise à jour.
{{< /note >}}

<!-- body -->


## Terminologie {#terminology}

Par souci de clarté, ce guide définit les termes suivants :

* Nœud (Node) : une machine de travail de Kubernetes, qui fait partie d'un cluster.
* Cluster : un ensemble de nœuds qui exécutent des applications conteneurisées gérées par Kubernetes.
  Dans cet exemple, comme dans la plupart des déploiements Kubernetes courants, les nœuds du cluster
  ne sont pas exposés sur l'Internet public.
* Routeur de bordure (edge router) : un routeur qui applique la politique de pare-feu de votre cluster.
  Il peut s'agir d'une passerelle gérée par un fournisseur de cloud ou d'un équipement physique.
* Réseau du cluster : un ensemble de liens, logiques ou physiques, qui permettent la communication
  au sein d'un cluster selon le [modèle réseau](/docs/concepts/cluster-administration/networking/) de Kubernetes.
* Service : un {{< glossary_tooltip term_id="service" >}} Kubernetes qui identifie
  un ensemble de Pods à l'aide de sélecteurs de {{< glossary_tooltip text="labels" term_id="label" >}}.
  Sauf mention contraire, on suppose que les Services ont des adresses IP virtuelles routables uniquement dans le réseau du cluster.

## Qu'est-ce qu'un Ingress ? {#what-is-ingress}

Un [Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
expose des routes HTTP et HTTPS depuis l'extérieur du cluster vers des
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} du cluster.
Le routage du trafic est contrôlé par des règles définies sur la ressource Ingress.

Voici un exemple simple dans lequel un Ingress envoie tout son trafic vers un seul Service :

{{< figure src="/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="Figure. Ingress" link="https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxcix-qmGwbuXA7DwAEzzQETXKutof0Ovb4vaoUQkwKUu6pi3FwXM_QSHGBt0VFFt8DRU2OWSGrKUUMlVQwMmhVLEV1Vcm9-aUksiuXRaO_CEhkv4WjBfAgG1TrGaLa-iaUw6a0DcwGI-WgOsF7zm-pN881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEpuNuRu_4rZ1pqQ7L5fL6YQPaPNiFuywcG9_-ihNyUkm6YSONWkjVNM8WUIyaeOJLO3clTB_KhL8NQDmVe-OJjxgZM5FhFiiFTK5zjDkxHBQ9_4zB4a-x20EGNSZhyaKmXrg7f5hSsvufUwTMXThtMWiot5Jh6p9ffimHijIezaSVoeN0uiqcfMJvf7w" >}}

Un Ingress peut être configuré pour donner aux Services des URL accessibles de l'extérieur,
équilibrer la charge du trafic, assurer la terminaison SSL / TLS et proposer un hébergement virtuel basé sur le nom.
Un [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers)
est chargé de mettre en œuvre l'Ingress, généralement avec un équilibreur de charge (load balancer),
mais il peut aussi configurer votre routeur de bordure ou des frontaux supplémentaires pour aider à gérer le trafic.

Un Ingress n'expose pas de ports ni de protocoles arbitraires. Pour exposer à Internet des services autres que HTTP et HTTPS,
on utilise généralement un Service de type [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) ou
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Prérequis {#prerequisites}

Vous devez disposer d'un [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers)
pour qu'un Ingress soit pris en compte. La simple création d'une ressource Ingress n'a aucun effet.

Vous avez le choix entre de nombreux [contrôleurs d'Ingress](/docs/concepts/services-networking/ingress-controllers).

Idéalement, tous les contrôleurs d'Ingress devraient respecter la spécification de référence. En pratique,
les différents contrôleurs d'Ingress fonctionnent de manière légèrement différente.

{{< note >}}
Consultez bien la documentation de votre contrôleur d'Ingress pour connaître les limites à prendre en compte avant de le choisir.
{{< /note >}}

## La ressource Ingress {#the-ingress-resource}

Exemple de ressource Ingress minimale :

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

Un Ingress a besoin des champs `apiVersion`, `kind`, `metadata` et `spec`.
Le nom d'un objet Ingress doit être un
[nom de sous-domaine DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) valide.
Pour des informations générales sur l'utilisation des fichiers de configuration, consultez
[déployer des applications](/docs/tasks/run-application/run-stateless-application-deployment/),
[configurer des conteneurs](/docs/tasks/configure-pod-container/configure-pod-configmap/) et
[gérer des ressources](/docs/concepts/workloads/management/).
Les contrôleurs d'Ingress utilisent souvent des [annotations](/docs/concepts/overview/working-with-objects/annotations/) pour configurer leur comportement.
Consultez la documentation du contrôleur d'Ingress que vous avez choisi pour savoir quelles annotations sont attendues ou prises en charge.

La [spec de l'Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
contient toutes les informations nécessaires pour configurer un équilibreur de charge ou un serveur proxy. Elle contient
surtout une liste de règles comparées à toutes les requêtes entrantes. La ressource Ingress ne prend en charge
que des règles pour diriger du trafic HTTP(S).

Si `ingressClassName` est omis, une [classe d'Ingress par défaut](#default-ingress-class)
devrait être définie.

Certains contrôleurs d'Ingress fonctionnent même sans définition
d'une IngressClass par défaut. Même si vous utilisez un contrôleur d'Ingress capable
de fonctionner sans IngressClass, le projet Kubernetes recommande tout de même
de définir une IngressClass par défaut.

### Règles d'Ingress {#ingress-rules}

Chaque règle HTTP contient les informations suivantes :

* Un hôte facultatif. Dans cet exemple, aucun hôte n'est indiqué : la règle s'applique donc à tout
  le trafic HTTP entrant par l'adresse IP indiquée. Si un hôte est fourni (par exemple
  foo.bar.com), les règles s'appliquent à cet hôte.
* Une liste de chemins (par exemple `/testpath`), chacun associé à un
  backend défini par un `service.name` et un `service.port.name` ou un
  `service.port.number`. L'hôte et le chemin doivent tous deux correspondre au contenu
  d'une requête entrante pour que l'équilibreur de charge dirige le trafic vers le
  Service référencé.
* Un backend est une combinaison d'un nom de Service et d'un port, comme décrit dans la
  [documentation des Services](/docs/concepts/services-networking/service/), ou un [backend de ressource personnalisée](#resource-backend)
  défini au moyen d'une {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}. Les requêtes HTTP (et HTTPS) adressées à
  l'Ingress qui correspondent à l'hôte et au chemin de la règle sont envoyées au backend indiqué.

Un `defaultBackend` est souvent configuré dans un contrôleur d'Ingress pour traiter toutes les requêtes
qui ne correspondent à aucun chemin de la spec.

### DefaultBackend {#default-backend}

Un Ingress sans règles envoie tout le trafic vers un unique backend par défaut, et `.spec.defaultBackend`
est le backend qui doit traiter les requêtes dans ce cas.
Le `defaultBackend` est habituellement une option de configuration du
[contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers) et
n'est pas indiqué dans vos ressources Ingress.
Si `.spec.rules` n'est pas défini, `.spec.defaultBackend` doit l'être.
Si `defaultBackend` n'est pas défini, c'est le contrôleur d'Ingress qui décide du traitement des requêtes
qui ne correspondent à aucune règle (consultez la documentation de votre contrôleur d'Ingress pour savoir comment il gère ce cas).

Si aucun des hôtes ou chemins des objets Ingress ne correspond à la requête HTTP, le trafic est
acheminé vers votre backend par défaut.

### Backends de ressource {#resource-backend}

Un backend `Resource` est une référence (ObjectRef) vers une autre ressource Kubernetes du
même namespace que l'objet Ingress. `Resource` et Service s'excluent mutuellement :
la validation échoue si les deux sont indiqués. Un backend `Resource` sert
couramment à faire entrer des données dans un backend de stockage objet
contenant des ressources statiques.

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

Après avoir créé l'Ingress ci-dessus, vous pouvez l'afficher avec la commande suivante :

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### Types de chemins {#path-types}

Chaque chemin d'un Ingress doit avoir un type de chemin correspondant. Les chemins
sans `pathType` explicite échouent à la validation. Trois types de chemins
sont pris en charge :

* `ImplementationSpecific` : avec ce type de chemin, la correspondance dépend de
  l'IngressClass. Les implémentations peuvent le traiter comme un `pathType` distinct ou
  de la même manière que les types de chemins `Prefix` ou `Exact`.

* `Exact` : correspond exactement au chemin de l'URL, en tenant compte de la casse.

* `Prefix` : correspond selon un préfixe du chemin de l'URL découpé par `/`. La correspondance
  tient compte de la casse et se fait élément par élément. Un élément de chemin désigne
  la liste des libellés du chemin découpé par le séparateur `/`. Une requête correspond
  au chemin _p_ si chaque _p_ est un préfixe, élément par élément, de _p_ dans le
  chemin de la requête.

  {{< note >}}
  Si le dernier élément du chemin est une sous-chaîne du dernier
  élément du chemin de la requête, il n'y a pas de correspondance (par exemple, `/foo/bar`
  correspond à `/foo/bar/baz`, mais pas à `/foo/barbaz`).
  {{< /note >}}

### Exemples {#examples}

| Type   | Chemin(s)                       | Chemin(s) de la requête       | Correspondance ?                   |
|--------|---------------------------------|-------------------------------|------------------------------------|
| Prefix | `/`                             | (tous les chemins)            | Oui                                |
| Exact  | `/foo`                          | `/foo`                        | Oui                                |
| Exact  | `/foo`                          | `/bar`                        | Non                                |
| Exact  | `/foo`                          | `/foo/`                       | Non                                |
| Exact  | `/foo/`                         | `/foo`                        | Non                                |
| Prefix | `/foo`                          | `/foo`, `/foo/`               | Oui                                |
| Prefix | `/foo/`                         | `/foo`, `/foo/`               | Oui                                |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`                    | Non                                |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`                    | Oui                                |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`                    | Oui, ignore la barre oblique finale |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`                   | Oui, correspond avec la barre oblique finale |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | Oui, correspond au sous-chemin     |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | Non, ne correspond pas au préfixe de chaîne |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`                    | Oui, correspond au préfixe `/aaa`  |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | Oui, correspond au préfixe `/aaa/bbb` |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | Oui, correspond au préfixe `/`     |
| Prefix | `/aaa`                          | `/ccc`                        | Non, utilise le backend par défaut |
| Mixte  | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | Oui, préfère Exact                 |

#### Correspondances multiples {#multiple-matches}

Dans certains cas, plusieurs chemins d'un Ingress correspondent à une requête. La priorité
est alors donnée au chemin correspondant le plus long. Si deux chemins
correspondent toujours à égalité, la priorité est donnée aux chemins de type exact
plutôt qu'aux chemins de type préfixe.

## Jokers dans les noms d'hôte {#hostname-wildcards}

Les hôtes peuvent être des correspondances précises (par exemple « `foo.bar.com` ») ou un joker (par
exemple « `*.foo.com` »). Une correspondance précise exige que l'en-tête HTTP `host`
corresponde au champ `host`. Une correspondance avec joker exige que l'en-tête HTTP `host`
soit égal au suffixe de la règle avec joker.

| Hôte        | En-tête Host      | Correspondance ?                                  |
| ----------- |-------------------| --------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Correspond grâce au suffixe commun                |
| `*.foo.com` | `baz.bar.foo.com` | Pas de correspondance, le joker ne couvre qu'un seul libellé DNS |
| `*.foo.com` | `foo.com`         | Pas de correspondance, le joker ne couvre qu'un seul libellé DNS |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

## Classe d'Ingress {#ingress-class}

Les Ingress peuvent être mis en œuvre par différents contrôleurs, souvent avec des
configurations différentes. Chaque Ingress devrait indiquer une classe, c'est-à-dire une référence à une
ressource IngressClass qui contient une configuration supplémentaire, dont le nom
du contrôleur chargé de mettre en œuvre la classe.

{{% code_sample file="service/networking/external-lb.yaml" %}}

Le champ `.spec.parameters` d'une IngressClass vous permet de référencer une autre
ressource qui fournit la configuration associée à cette IngressClass.

Le type précis de paramètres à utiliser dépend du contrôleur d'Ingress
que vous indiquez dans le champ `.spec.controller` de l'IngressClass.

### Portée d'une IngressClass {#ingressclass-scope}

Selon votre contrôleur d'Ingress, vous pourrez peut-être utiliser des paramètres
définis pour tout le cluster, ou pour un seul namespace.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Cluster" %}}
Par défaut, les paramètres d'une IngressClass ont une portée à l'échelle du cluster.

Si vous définissez le champ `.spec.parameters` sans définir
`.spec.parameters.scope`, ou si vous définissez `.spec.parameters.scope` sur
`Cluster`, l'IngressClass fait référence à une ressource à portée cluster.
Le `kind` (combiné à l'`apiGroup`) des paramètres
fait référence à une API à portée cluster (éventuellement une ressource personnalisée), et
le `name` des paramètres identifie une ressource précise à portée cluster
de cette API.

Par exemple :

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in a
    # ClusterIngressParameter (API group k8s.example.net) named
    # "external-config-1". This definition tells Kubernetes to
    # look for a cluster-scoped parameter resource.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Namespace" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Si vous définissez le champ `.spec.parameters` et définissez
`.spec.parameters.scope` sur `Namespace`, l'IngressClass fait référence
à une ressource à portée namespace. Vous devez aussi définir le champ `namespace`
de `.spec.parameters` avec le namespace qui contient
les paramètres que vous voulez utiliser.

Le `kind` (combiné à l'`apiGroup`) des paramètres
fait référence à une API à portée namespace (par exemple : ConfigMap), et
le `name` des paramètres identifie une ressource précise
dans le namespace indiqué dans `namespace`.

Les paramètres à portée namespace aident l'opérateur du cluster à déléguer le contrôle de la
configuration (par exemple : réglages de l'équilibreur de charge, définition de la passerelle d'API)
utilisée pour une charge de travail. Avec un paramètre à portée cluster, soit :

- l'équipe qui exploite le cluster doit approuver les modifications d'une autre équipe
  chaque fois qu'un nouveau changement de configuration est appliqué ;
- l'équipe qui exploite le cluster doit définir des contrôles d'accès spécifiques, comme des
  rôles et des liaisons [RBAC](/docs/reference/access-authn-authz/rbac/), qui permettent
  à l'équipe applicative de modifier la ressource de paramètres à portée cluster.

L'API IngressClass elle-même a toujours une portée cluster.

Voici un exemple d'IngressClass qui fait référence à des paramètres
à portée namespace :

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in an
    # IngressParameter (API group k8s.example.com) named "external-config",
    # that's in the "external-configuration" namespace.
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### Annotation obsolète {#deprecated-annotation}

Avant l'ajout de la ressource IngressClass et du champ `ingressClassName` dans
Kubernetes 1.18, les classes d'Ingress étaient indiquées par une annotation
`kubernetes.io/ingress.class` sur l'Ingress. Cette annotation n'a jamais été
définie formellement, mais elle était largement prise en charge par les contrôleurs d'Ingress.

Le champ `ingressClassName`, plus récent, remplace cette
annotation, sans en être un équivalent direct. Alors que l'annotation servait
généralement à référencer le nom du contrôleur d'Ingress chargé de mettre en œuvre
l'Ingress, le champ est une référence à une ressource IngressClass qui contient
une configuration d'Ingress supplémentaire, dont le nom du contrôleur d'Ingress.

### IngressClass par défaut {#default-ingress-class}

Vous pouvez marquer une IngressClass donnée comme classe par défaut de votre cluster. Définir
l'annotation `ingressclass.kubernetes.io/is-default-class` sur `true` sur une
ressource IngressClass garantit que cette IngressClass par défaut sera attribuée
aux nouveaux Ingress qui n'indiquent pas de champ `ingressClassName`.

{{< caution >}}
Si plusieurs IngressClass sont marquées comme classe par défaut de votre cluster,
le contrôleur d'admission empêche la création de nouveaux objets Ingress qui n'indiquent pas
d'`ingressClassName`. Pour résoudre ce problème, assurez-vous qu'au plus une
IngressClass est marquée comme classe par défaut dans votre cluster.
{{< /caution >}}

Commencez par définir une
IngressClass par défaut. Il est toutefois recommandé d'indiquer l'IngressClass
par défaut :

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

## Types d'Ingress {#types-of-ingress}

### Ingress reposant sur un seul Service {#single-service-ingress}

Il existe déjà des concepts Kubernetes qui permettent d'exposer un seul Service
(voir les [alternatives](#alternatives)). Vous pouvez aussi le faire avec un Ingress en indiquant un
*backend par défaut* sans règles.

{{% code_sample file="service/networking/test-ingress.yaml" %}}

Si vous le créez avec `kubectl apply -f`, vous devriez pouvoir afficher l'état
de l'Ingress que vous avez ajouté :

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

`203.0.113.123` est l'adresse IP allouée par le contrôleur d'Ingress pour satisfaire
cet Ingress.

{{< note >}}
Les contrôleurs d'Ingress et les équilibreurs de charge peuvent mettre une minute ou deux à allouer une adresse IP.
En attendant, l'adresse s'affiche souvent sous la forme `<pending>`.
{{< /note >}}

### Fanout simple {#simple-fanout}

Une configuration en fanout achemine le trafic d'une seule adresse IP vers plusieurs Services,
en fonction de l'URI HTTP demandée. Un Ingress vous permet de réduire au minimum le nombre
d'équilibreurs de charge. Prenons par exemple la configuration suivante :

{{< figure src="/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="Figure. Fanout d'Ingress" link="https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ" >}}

Elle nécessiterait un Ingress comme celui-ci :

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

Une fois l'Ingress créé avec `kubectl apply -f` :

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

Le contrôleur d'Ingress provisionne un équilibreur de charge propre à son implémentation
qui satisfait l'Ingress, à condition que les Services (`service1`, `service2`) existent.
Une fois que c'est fait, vous pouvez voir l'adresse de l'équilibreur de charge dans le
champ Address.

{{< note >}}
Selon le [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers/)
que vous utilisez, vous devrez peut-être créer un
[Service](/docs/concepts/services-networking/service/) default-http-backend.
{{< /note >}}

### Hébergement virtuel basé sur le nom {#name-based-virtual-hosting}

Les hôtes virtuels basés sur le nom permettent d'acheminer le trafic HTTP vers plusieurs noms d'hôte partageant la même adresse IP.

{{< figure src="/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="Figure. Hébergement virtuel basé sur le nom" link="https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu" >}}

L'Ingress suivant indique à l'équilibreur de charge sous-jacent d'acheminer les requêtes en fonction de
l'[en-tête Host](https://tools.ietf.org/html/rfc7230#section-5.4).

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

Si vous créez une ressource Ingress sans définir d'hôte dans les règles, tout
trafic web adressé à l'adresse IP de votre contrôleur d'Ingress peut correspondre sans qu'un hôte virtuel
basé sur le nom soit nécessaire.

Par exemple, l'Ingress suivant achemine le trafic
demandé pour `first.bar.com` vers `service1`, celui pour `second.bar.com` vers `service2`,
et tout trafic dont l'en-tête Host de la requête ne correspond ni à `first.bar.com`
ni à `second.bar.com` vers `service3`.

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS {#tls}

Vous pouvez sécuriser un Ingress en indiquant un {{< glossary_tooltip term_id="secret" >}}
qui contient une clé privée et un certificat TLS. La ressource Ingress ne prend en charge
qu'un seul port TLS, le 443, et suppose que la terminaison TLS se fait au point d'entrée
(le trafic vers le Service et ses Pods circule en clair).
Si la section de configuration TLS d'un Ingress indique plusieurs hôtes, ils sont
multiplexés sur le même port selon le nom d'hôte indiqué via
l'extension TLS SNI (à condition que le contrôleur d'Ingress prenne en charge SNI). Le Secret TLS
doit contenir des clés nommées `tls.crt` et `tls.key`, qui contiennent le certificat
et la clé privée à utiliser pour TLS. Par exemple :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

Référencer ce Secret dans un Ingress indique au contrôleur d'Ingress de
sécuriser avec TLS le canal entre le client et l'équilibreur de charge. Vous devez vous
assurer que le Secret TLS que vous avez créé provient d'un certificat contenant un Common
Name (CN), aussi appelé nom de domaine complet (FQDN), pour `https-example.foo.com`.

{{< note >}}
Gardez à l'esprit que TLS ne fonctionnera pas sur la règle par défaut, car les
certificats devraient être émis pour tous les sous-domaines possibles. C'est pourquoi
les `hosts` de la section `tls` doivent correspondre explicitement au `host` de la section
`rules`.
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
Les fonctionnalités TLS prises en charge varient d'un contrôleur d'Ingress à l'autre.
Consultez la documentation du ou des contrôleurs d'Ingress que vous avez choisis pour
comprendre le fonctionnement de TLS dans votre environnement.
{{< /note >}}

### Équilibrage de charge {#load-balancing}

Un contrôleur d'Ingress démarre avec des réglages de politique d'équilibrage de charge
qu'il applique à tous les Ingress, comme l'algorithme d'équilibrage de charge, le schéma de pondération
des backends, etc. Les concepts d'équilibrage de charge plus avancés
(par exemple les sessions persistantes ou les pondérations dynamiques) ne sont pas encore exposés via
l'Ingress. Vous pouvez en revanche obtenir ces fonctionnalités grâce à l'équilibreur de charge utilisé pour
un Service.

Notez aussi que, même si les contrôles de santé (health checks) ne sont pas exposés directement
via l'Ingress, il existe dans Kubernetes des concepts parallèles, comme les
[sondes de disponibilité (readiness probes)](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/),
qui permettent d'obtenir le même résultat. Consultez la documentation propre
à votre contrôleur pour savoir comment il gère les contrôles de santé.

## Mettre à jour un Ingress {#updating-an-ingress}

Pour mettre à jour un Ingress existant afin d'ajouter un nouvel hôte, vous pouvez modifier la ressource :

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

Un éditeur s'ouvre avec la configuration existante au format YAML.
Modifiez-la pour ajouter le nouvel hôte :

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

Une fois vos modifications enregistrées, kubectl met à jour la ressource dans le serveur d'API, ce qui indique
au contrôleur d'Ingress de reconfigurer l'équilibreur de charge.

Vérifiez-le :

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

Vous pouvez obtenir le même résultat en exécutant `kubectl replace -f` sur un fichier YAML d'Ingress modifié.

## Basculement entre zones de disponibilité {#failing-across-availability-zones}

Les techniques de répartition du trafic entre domaines de défaillance diffèrent d'un fournisseur de cloud à l'autre.
Consultez la documentation du [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers) concerné pour plus de détails.

## Alternatives {#alternatives}

Vous pouvez exposer un Service de plusieurs manières qui n'impliquent pas directement la ressource Ingress :

* Utilisez [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Utilisez [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport)

## {{% heading "whatsnext" %}}

* En savoir plus sur l'API [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/)
* En savoir plus sur les [contrôleurs d'Ingress](/docs/concepts/services-networking/ingress-controllers/)
