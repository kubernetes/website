---
title: Accéder à l'API de Kubernetes depuis un Pod
content_type: task
weight: 120
---

<!-- overview -->

Ce guide explique comment accéder à l'API de Kubernetes depuis un Pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Accéder à l'API depuis un Pod

Lorsque l'on veut accéder à l'API depuis un Pod, localiser et s'authentifier
auprès du serveur API se passe différement que dans le cas d'un client externe.

Le moyen le plus simple pour interagir avec l'API Kubernetes depuis un Pod est d'utiliser l'une des 
[librairies clientes](/docs/reference/using-api/client-libraries/) officielles. 
Ces bibliothèques peuvent automatiquement découvrir le serveur API et s'authentifier.

### Utilisation des clients officiels

Depuis un Pod, les moyens recommandés pour se connecter à l'API Kubernetes sont:

- Pour un client Go, utilisez la bibliothèque client officielle 
  [Go](https://github.com/kubernetes/client-go/).
  La fonction `rest.InClusterConfig()` gère automatiquement 
  la découverte de l'hôte API et l'authentification. 
  Voir [un exemple ici](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

- Pour un client Python, utilisez la bibliothèque client officielle 
  [Python](https://github.com/kubernetes-client/python/). 
  La fonction `config.load_incluster_config()` gère automatiquement 
  la découverte de l'hôte API et l'authentification. 
  Voir [un exemple ici](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

- Il existe d'autres bibliothèques disponibles, vous pouvez vous référer à la page
  [Bibliothèques clientes](/docs/reference/using-api/client-libraries/).

Dans tous les cas, les informations d'identification du compte de service du Pod seront utilisées pour communiquer avec le serveur API.

### Accès direct à l'API REST

En s'exécutant dans un Pod, votre conteneur peut créer une URL HTTPS
pour le serveur API Kubernetes en récupérant les variables d'environnement
`KUBERNETES_SERVICE_HOST` et `KUBERNETES_SERVICE_PORT_HTTPS`.
L'adresse du serveur API dans le cluster est également publiée
dans un Service nommé `kubernetes` dans le namespace `default`
afin que les pods puissent référencer 
`kubernetes.default.svc` comme nom DNS pour le serveur API.

{{< note >}}
Kubernetes ne garantit pas que le serveur API dispose d'un certificat valide
pour le nom d'hôte `kubernetes.default.svc`;
cependant, le plan de contrôle **doit** présenter un certificat valide
pour le nom d'hôte ou l'adresse IP que `$KUBERNETES_SERVICE_HOST` représente.
{{< /note >}}

La manière recommandée pour s'authentifier auprès du serveur API 
est d'utiliser les identifiants d'un 
[compte de service](/docs/tasks/configure-pod-container/configure-service-account/). 
Par défaut, un Pod est associé à un compte de service,
et un identifiant pour ce compte de service est placé
dans le système de fichiers de chaque conteneur dans ce Pod,
dans `/var/run/secrets/kubernetes.io/serviceaccount/token`.

Si disponible, un lot de certificats est placé dans le système de fichiers de chaque conteneur dans `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`
et doit être utilisé pour vérifier le certificat du serveur API.

Enfin, le namespace courant dans lequel est déployé le Pod est 
placé dans un fichier `/var/run/secrets/kubernetes.io/serviceaccount/namespace` dans chaque container.

### Avec utilisation du proxy kubectl

Si vous souhaitez interroger l'API sans utiliser de bibliothèque client officielle,
vous pouvez exécuter `kubectl proxy` en tant que 
[commande](/docs/tasks/inject-data-application/define-command-argument-container/) 
d'un nouveau conteneur sidecar dans le Pod. 
De cette manière, `kubectl proxy` s'authentifiera auprès de l'API 
et l'exposera sur l'interface `localhost` du Pod, 
de sorte que les autres conteneurs dans le Pod puissent l'utiliser directement.

### Sans utiliser de proxy

Il est possible d'éviter l'utilisation du proxy kubectl en passant
directement les informations d'authentification au serveur API.
Le certificat interne sécurise la connexion.

```shell
# Pointe vers le nom d'hôte interne du serveur API.
APISERVER=https://kubernetes.default.svc

# Chemin du token pour le compte de service
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Lire le namespace du Pod
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Lire le token du compte de service
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Référence l'authorité de certificat interne 
CACERT=${SERVICEACCOUNT}/ca.crt

# Accéder à l'API avec le token
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

Le résultat sera similaire à:

```json
{
  "kind": "APIVersions",
  "versions": ["v1"],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
