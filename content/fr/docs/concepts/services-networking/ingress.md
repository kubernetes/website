---
reviewers:
- remyleone
- feloy
- rekcah78
- rbenzair
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

{{% /capture %}}

{{% capture body %}}

## Terminologie

Par souci de clarté, ce guide définit les termes suivants :

* Nœud (Node) : une seule machine virtuelle ou physique dans un cluster Kubernetes.
* Cluster : groupe de nœuds protégés par un pare-feu provenant d'Internet et constituant les principales ressources de calcul gérées par Kubernetes.
* Routeur Edge : routeur appliquant la stratégie de pare-feu pour votre cluster. Il peut s’agir d’une passerelle gérée par un fournisseur de cloud ou d’un matériel physique.
* Réseau de cluster : ensemble de liens, logiques ou physiques, facilitant la communication au sein d'un cluster selon le [modèle de réseau Kubernetes](/docs/concepts/cluster-administration/networking/).
* Service : un Kubernetes [Service](/docs/concepts/services-networking/service/) identifiant un ensemble de pods à l'aide de sélecteurs d'étiquettes. Sauf indication contraire, les services sont supposés avoir des adresses IP virtuelles routables uniquement dans le réseau du cluster.

## Qu'est-ce qu'un ingress ?

Ingress (ou une entrée réseau), ajouté à Kubernetes v1.1, expose les routes HTTP et HTTPS de l'extérieur du cluster à
{{<link text = "services" url = "/docs/concepts/services-networking/service/">}} au sein du cluster.
Le routage du trafic est contrôlé par des règles définies sur la ressource Ingress.

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

Un Ingress peut être configuré pour donner aux services des URLs accessibles de l'extérieur, du trafic de charge équilibrée, la terminaison SSL/TLS et un hébergement virtuel basé sur le nom. Un [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers) est responsable de l'exécution de l'Ingress, généralement avec un load-balancer (équilibreur de charge), bien qu'il puisse également configurer votre routeur périphérique ou des interfaces supplémentaires pour aider à gérer le trafic.

Un Ingress n'expose pas de ports ni de protocoles arbitraires. Exposer des services autres que HTTP et HTTPS à Internet généralement utilise un service de type [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) ou [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Conditions préalables

{{<feature-state for_k8s_version = "v1.1" state = "beta">}}

Avant de commencer à utiliser un Ingress, vous devez comprendre certaines choses. Un Ingress est une ressource en "version Beta".

{{< note >}}
Vous devez avoir un [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers) pour lancer un Ingress. Seule la création d'une ressource Ingress n'a aucun effet.
{{< /note >}}

GCE/GKE (Google Cloud Engine / Google Kubernetes Engine) déploie un contrôleur d’Ingress sur le master (le maître de kubernetes). Revoir les [limitations beta](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations) de ce contrôleur si vous utilisez GCE/GKE.

Dans les environnements autres que GCE/GKE, vous devrez peut-être [déployer un contrôleur d'Ingress](https://kubernetes.github.io/ingress-nginx/deploy/). Il y a un certain nombre de [contrôleurs d'Ingress](/docs/concepts/services-networking/ingress-controllers) parmi lesquels vous pouvez choisir.

### Avant de commencer

Dans l’idéal, tous les contrôleurs d’Ingress devraient correspondre à cette spécification. Cependant le fonctionnement est légèrement différent d'un contrôleur à un autre (en fonction de son implémentation).

{{< note >}}
Assurez-vous de consulter la documentation de votre contrôleur d’Ingress pour bien comprendre les mises en garde qu’il ya à faire pour le choisir.
{{< /note >}}

## La ressource Ingress

Exemple de ressource Ingress minimale :

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```

Comme pour toutes les autres ressources Kubernetes, un ingress (une entrée) a besoin des champs `apiVersion`,` kind` et `metadata`.
 Pour des informations générales sur l'utilisation des fichiers de configuration, voir [déployer des applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configurer des conteneurs](/docs/tasks/configure-pod-container/configure-pod-configmap/), [gestion des ressources](/docs/ concepts/cluster-administration/manage-deployment/).
 Ingress utilise fréquemment des annotations pour configurer certaines options en fonction du contrôleur Ingress, dont un exemple
 est l'annotation [rewrite-target](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
 Différents [Ingress controller](/docs/concepts/services-networking/ingress-controllers) prennent en charge différentes annotations. Consultez la documentation de votre choix de contrôleur Ingress pour savoir quelles annotations sont prises en charge.

La [spécification de la ressource Ingress](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) dispose de toutes les informations nécessaires pour configurer un loadbalancer ou un serveur proxy. Plus important encore, il
contient une liste de règles appariées à toutes les demandes entrantes. La ressource ingress ne supporte que les règles pour diriger le trafic HTTP.


### Ingress rules

Chaque règle http contient les informations suivantes :

* Un hôte optionnel. Dans cet exemple, aucun hôte n'est spécifié. La règle s'applique donc à tous les appels entrants.
  Le trafic HTTP via l'adresse IP est spécifié. Si un hôte est fourni (par exemple,
  foo.bar.com), les règles s’appliquent à cet hôte.
* une liste de chemins (par exemple, /testpath), chacun étant associé à un backend associé défini par un `serviceName` et `servicePort`. L’hôte et le chemin doivent correspondre au contenu d’une demande entrante avant que le load-balancer dirige le trafic vers le service référencé.
* Un backend est une combinaison de noms de services et de ports, comme décrit dans
  [services doc](/docs/concepts/services-networking/service/). Les requêtes HTTP (et HTTPS) envoyées à l'Ingress correspondant aux hôtes et au chemin de la règle seront envoyées au backend indiqué.

Un backend par défaut est souvent configuré dans un contrôleur d’Ingress qui traite toutes les demandes qui ne corresponds à aucun chemin dans la spécification.

### Backend par défaut

Un Ingress sans règles envoie tout le trafic à un seul backend par défaut. Le backend par défaut est généralement une option de configuration du [Contrôleur d'ingress](/docs/concepts/services-networking/ingress-controllers) et n'est pas spécifié dans vos ressources Ingress.

Si aucun des hôtes ou chemins ne correspond à la demande HTTP dans les objets Ingress, le trafic est routé vers votre backend par défaut.

## Types d'Ingress

### Ingress pour service unique

Il existe des concepts Kubernetes qui vous permettent d’exposer un seul service.
(voir [alternatives](#alternatives)). Vous pouvez également le faire avec un ingress en spécifiant un *backend par défaut* sans règles.


```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
spec:
  backend:
    serviceName: testsvc
    servicePort: 80
```

Si vous le créez en utilisant `kubectl create -f`, vous devriez voir :

```shell
kubectl get ingress test-ingress
```

```shell
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

Où `107.178.254.228` est l’adresse IP allouée par le contrôleur d’Ingress pour satisfaire cette entrée.

{{< note >}}
Les contrôleurs d'Ingress et les load-balancers peuvent prendre une minute ou deux pour allouer une adresse IP.
Jusque-là, vous verrez souvent l’adresse listée sous la forme `<pending>` (en attente).
{{</ note >}}

### Fanout simple

Une configuration d'un fanout achemine le trafic d'une adresse IP unique vers plusieurs services, en se basant sur l'URI HTTP demandé. Une entrée vous permet de garder le nombre de loadbalancers au minimum. Par exemple, une configuration comme :

```shell
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

ceci nécessitera un Ingress défini comme suit :

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: simple-fanout-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: service1
          servicePort: 4200
      - path: /bar
        backend:
          serviceName: service2
          servicePort: 8080
```

Lorsque vous créez l'ingress avec `kubectl create -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```shell
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
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

Le contrôleur d’ingress fournit une implémentation spécifique aux load-balancers qui satisfait l'Ingress, tant que les services (`s1`,` s2`) existent.
Lorsque cela est fait, vous pouvez voir l’adresse du load-balancer sur le champ d'adresse.

{{< note >}}
En fonction du [Contrôleur d'ingress](/docs/concepts/services-networking/ingress-controllers) vous utilisez, vous devrez peut-être
créer un backend http par défaut [Service](/docs/concepts/services-networking/service/).
{{< /note >}}

### Hébergement virtuel basé sur le nom

Les hôtes virtuels basés sur des noms prennent en charge le routage du trafic HTTP vers plusieurs noms d'hôte à la même adresse IP.

```none
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

L’ingress suivant indique au load-balancer de router les requêtes en fonction de [En-tête du hôte](https://tools.ietf.org/html/rfc7230#section-5.4).

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
```

Si vous créez une ressource Ingress sans aucun hôte défini dans les règles, tout trafic Web à destination de l'adresse IP de votre contrôleur d'Ingress peut être mis en correspondance sans qu'un hôte virtuel basé sur le nom ne soit requis. Par exemple, la ressource Ingress suivante acheminera le trafic demandé pour `first.bar.com` au `service1` `second.foo.com` au `service2`, et à tout trafic à l'adresse IP sans nom d'hôte défini dans la demande (c'est-à-dire sans en-tête de requête présenté) au `service3`.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: first.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: second.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
  - http:
      paths:
      - backend:
          serviceName: service3
          servicePort: 80
```

### TLS

Vous pouvez sécuriser un ingress en définissant un [secret](/docs/concepts/configuration/secret) qui contient une clé privée et un certificat TLS. Actuellement, l'ingress prend seulement en charge un seul port TLS, 443, et suppose une terminaison TLS. Si la section de configuration TLS dans un ingress spécifie différents hôtes, ils seront multiplexés sur le même port en fonction du nom d’hôte spécifié via l'extension SNI TLS (à condition que le contrôleur d’Ingress prenne en charge SNI). Le secret de TLS doit contenir les clés `tls.crt` et `tls.key` contenant le certificat et clé privée à utiliser pour TLS, par exemple :

```yaml
apiVersion: v1
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
type: kubernetes.io/tls
```

Référencer ce secret dans un ingress indiquera au contrôleur d'ingress de sécuriser le canal du client au load-balancer à l'aide de TLS. Vous devez vous assurer que le secret TLS que vous avez créé provenait d'un certificat contenant un CN pour `sslexample.foo.com`.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
    - sslexample.foo.com
    secretName: testsecret-tls
  rules:
    - host: sslexample.foo.com
      http:
        paths:
        - path: /
          backend:
            serviceName: service1
            servicePort: 80
```

{{< note >}}
Les fonctionnalités TLS prisent en charge par les différents contrôleurs peuvent être différentes. Veuillez vous référer à la documentation sur
[nginx](https://git.k8s.io/ingress-nginx/README.md#https),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https),
ou tout autre contrôleur d’Ingress spécifique à la plate-forme pour comprendre le fonctionnement de TLS dans votre environnement.
{{< /note >}}

### L'équilibrage de charge

Un contrôleur d’Ingress est démarré avec certains paramètres de politique d’équilibrage de charge
qui s'applique à toutes les entrées, telles que l'algorithme d'équilibrage de la charge, régime de pondérations des backends, et d'autres.
Les concepts un peu plus avancés d'équilibrage de charge  (p. ex. sessions persistantes, pondérations dynamiques) ne sont pas encore exposés pour l'ingress. Vous pouvez toujours obtenir ces fonctionnalités via le [service loadbalancer](https://github.com/kubernetes/ingress-nginx).

Il est également intéressant de noter que même si les health checks (contrôles de santé) ne sont pas exposés directement via l'Ingress, il existe des concepts parallèles dans Kubernetes, tels que [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) qui vous permettent d'obtenir le même résultat final. Veuillez consulter les documents spécifiques au contrôleur pour voir comment ils gèrent les health checks. ([nginx](https://git.k8s.io/ingress-nginx/README.md),[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Mise à jour d'un ingress

Pour mettre à jour un ingress existant afin d'ajouter un nouvel hôte, vous pouvez le mettre à jour en modifiant la ressource :

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

Cela devrait faire apparaître un éditeur avec le yaml existant, modifiez-le pour inclure le nouvel hôte :

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: s1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: s2
          servicePort: 80
        path: /foo
..
```

L'enregistrement du yaml mettra à jour la ressource dans le serveur d'API, ce qui devrait indiquer au contrôleur d'ingress de reconfigurer le load-balancer.

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   s2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

Vous pouvez obtenir le même résultat en appelant `kubectl replace -f` sur un fichier Ingress yaml modifié.

## Échec dans les zones de disponibilité

Les techniques permettant de répartir le trafic sur plusieurs domaines de défaillance qui diffère d'un fournisseur de cloud à l'autre.
Veuillez consulter la documentation du [Contrôleur d'ingress](/docs/concepts/services-networking/ingress-controllers) pour plus de détails. Vous pouvez également vous référer à la [documentation de la fédération](/docs/concepts/cluster-administration/federation/) pour plus d'informations sur le déploiement d'Ingress dans un cluster fédéré.

## Travail futur

Suivez [SIG network](https://github.com/kubernetes/community/tree/master/sig-network) (groupe d'intérêt spécial Réseau) pour plus de détails sur l'évolution de l'entrée et des ressources associées. Vous pouvez également suivre le [Dépôt Ingress](https://github.com/kubernetes/ingress/tree/master) pour plus de détails sur l'évolution des différents contrôleurs d’ingress.

## Alternatives

Vous pouvez exposer un service de plusieurs manières sans impliquer directement la ressource Ingress :

* Utilisez [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Utilisez [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
* Utilisez un [Proxy du port](https://git.k8s.io/contrib/for-demos/proxy-to-service)

{{% /capture %}}

{{% capture whatsnext %}}
* [Configurer Ingress sur Minikube avec le contrôleur NGINX](/docs/tasks/access-application-cluster/ingress-minikube)
{{% /capture %}}
