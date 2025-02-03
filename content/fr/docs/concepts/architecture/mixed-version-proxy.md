---
reviewers:
title: Proxy de version mixte
content_type: concept
weight: 220
---

<!-- overview -->

{{< feature-state feature_gate_name="UnknownVersionInteroperabilityProxy" >}}

Kubernetes {{< skew currentVersion >}} inclut une fonctionnalité alpha qui permet à un
{{< glossary_tooltip text="Serveur API" term_id="kube-apiserver" >}}
de faire proxy des demandes de ressources vers d'autres serveurs API _pairs_. Cela est utile lorsqu'il y a plusieurs
serveurs API exécutant différentes versions de Kubernetes dans un même cluster
(par exemple, pendant un déploiement à long terme vers une nouvelle version de Kubernetes).

Cela permet aux administrateurs de cluster de configurer des clusters hautement disponibles qui peuvent être mis à niveau
plus en toute sécurité, en redirigeant les demandes de ressources (effectuées pendant la mise à niveau) vers le kube-apiserver correct.
Ce proxy empêche les utilisateurs de voir des erreurs 404 Not Found inattendues qui découlent
du processus de mise à niveau.

Ce mécanisme est appelé le _Proxy de Version Mixte_.

## Activation du Proxy de Version Mixte

Assurez-vous que la fonctionnalité `UnknownVersionInteroperabilityProxy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
est activée lorsque vous démarrez le {{< glossary_tooltip text="Serveur API" term_id="kube-apiserver" >}} :

```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# arguments de ligne de commande requis pour cette fonctionnalité
--peer-ca-file=<chemin vers le certificat CA de kube-apiserver>
--proxy-client-cert-file=<chemin vers le certificat proxy de l'agrégateur>,
--proxy-client-key-file=<chemin vers la clé proxy de l'agrégateur>,
--requestheader-client-ca-file=<chemin vers le certificat CA de l'agrégateur>,
# requestheader-allowed-names peut être laissé vide pour autoriser n'importe quel nom commun
--requestheader-allowed-names=<noms communs valides pour vérifier le certificat client du proxy>,

# indicateurs facultatifs pour cette fonctionnalité
--peer-advertise-ip=`IP de ce kube-apiserver qui doit être utilisée par les pairs pour faire proxy des demandes`
--peer-advertise-port=`port de ce kube-apiserver qui doit être utilisé par les pairs pour faire proxy des demandes`

# ...et d'autres indicateurs comme d'habitude
```

### Transport et authentification du proxy entre les serveurs API {#transport-and-authn}

* Le kube-apiserver source réutilise les
  [indicateurs d'authentification client du serveur API existant](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)
  `--proxy-client-cert-file` et `--proxy-client-key-file` pour présenter son identité qui
  sera vérifiée par son pair (le kube-apiserver de destination). Le serveur API de destination
  vérifie cette connexion pair en fonction de la configuration que vous spécifiez en utilisant l'argument de ligne de commande
  `--requestheader-client-ca-file`.

* Pour authentifier les certificats de service du serveur de destination, vous devez configurer un ensemble de certificats
  d'autorité de certification en spécifiant l'argument de ligne de commande `--peer-ca-file` au serveur API **source**.

### Configuration pour la connectivité des serveurs API pairs

Pour définir l'emplacement réseau d'un kube-apiserver que les pairs utiliseront pour faire proxy des demandes, utilisez les
arguments de ligne de commande `--peer-advertise-ip` et `--peer-advertise-port` pour kube-apiserver ou spécifiez
ces champs dans le fichier de configuration du serveur API.
Si ces indicateurs ne sont pas spécifiés, les pairs utiliseront la valeur de `--advertise-address` ou
`--bind-address` comme argument de ligne de commande pour le kube-apiserver.
Si ceux-ci ne sont pas définis non plus, l'interface par défaut de l'hôte est utilisée.

## Proxy de version mixte

Lorsque vous activez le proxy de version mixte, la [couche d'agrégation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
charge un filtre spécial qui effectue les opérations suivantes :

* Lorsqu'une demande de ressource atteint un serveur API qui ne peut pas servir cette API
  (soit parce qu'il s'agit d'une version antérieure à l'introduction de l'API, soit parce que l'API est désactivée sur le serveur API),
  le serveur API tente d'envoyer la demande à un serveur API pair qui peut servir l'API demandée.
  Il le fait en identifiant les groupes d'API / versions / ressources que le serveur local ne reconnaît pas,
  et essaie de faire proxy de ces demandes vers un serveur API pair capable de traiter la demande.
* Si le serveur API pair ne parvient pas à répondre, le serveur API source répond avec une erreur 503 ("Service Unavailable").

### Comment cela fonctionne en interne

Lorsqu'un serveur API reçoit une demande de ressource, il vérifie d'abord quels serveurs API peuvent
servir la ressource demandée. Cette vérification se fait en utilisant l'API interne
[`StorageVersion`](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#storageversioncondition-v1alpha1-internal-apiserver-k8s-io).

* Si la ressource est connue du serveur API qui a reçu la demande
  (par exemple, `GET /api/v1/pods/quelque-pod`), la demande est traitée localement.

* S'il n'y a pas d'objet `StorageVersion` interne trouvé pour la ressource demandée
  (par exemple, `GET /my-api/v1/my-resource`) et que l'APIService configuré spécifie le proxy
  vers un serveur API d'extension, ce proxy se fait en suivant le flux habituel
  [flow](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) pour les API d'extension.

* Si un objet `StorageVersion` interne valide est trouvé pour la ressource demandée
  (par exemple, `GET /batch/v1/jobs`) et que le serveur API qui essaie de traiter la demande
  (le serveur API de traitement) a l'API `batch` désactivée, alors le serveur API de traitement
  récupère les serveurs API pairs qui servent le groupe d'API / version / ressource pertinent
  (`api/v1/batch` dans ce cas) en utilisant les informations de l'objet `StorageVersion` récupéré.
  Le serveur API de traitement fait ensuite proxy de la demande vers l'un des serveurs kube-apiservers pairs correspondants
  qui sont conscients de la ressource demandée.

  * S'il n'y a aucun pair connu pour ce groupe d'API / version / ressource, le serveur API de traitement
    transmet la demande à sa propre chaîne de traitement qui devrait finalement renvoyer une réponse 404 ("Not Found").

  * Si le serveur API de traitement a identifié et sélectionné un serveur API pair, mais que ce pair échoue
    à répondre (pour des raisons telles que des problèmes de connectivité réseau ou une course de données entre la demande
    étant reçue et un contrôleur enregistrant les informations du pair dans le plan de contrôle), alors le serveur de traitement
    API répond avec une erreur 503 ("Service Unavailable").
    
