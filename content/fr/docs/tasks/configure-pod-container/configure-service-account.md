---
title: Configurer les comptes de service pour les pods
content_type: task
weight: 90
---

<!-- overview -->
Un ServiceAccount (compte de service) fournit une identité pour les processus qui s'exécutent dans un Pod.

*Ceci est une introduction aux comptes de service pour les utilisateurs. Voir aussi
[Guide de l'administrateur du cluster des comptes de service](/docs/reference/access-authn-authz/service-accounts-admin/).*

{{< note >}}
Ce document décrit le comportement des comptes de service dans un cluster mis en place conformément aux recommandations du projet Kubernetes. L'administrateur de votre cluster a peut-être personnalisé le comportement dans votre cluster, dans ce cas cette documentation pourrait être non applicable.
{{< /note >}}

Lorsque vous (un humain) accédez au cluster (par exemple, en utilisant `kubectl`), vous êtes
authentifié par l'apiserver en tant que compte d'utilisateur particulier (actuellement, il s'agit 
généralement de l'utilisateur `admin`, à moins que votre administrateur de cluster n'ait personnalisé votre cluster). Les processus dans les conteneurs dans les Pods peuvent également contacter l'apiserver. Dans ce cas, ils sont authentifiés en tant que compte de service particulier (par exemple, `default`).




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Utiliser le compte de service par défaut pour accéder au API server.

Si vous obtenez le raw json ou yaml pour un Pod que vous avez créé (par exemple, `kubectl get pods/<podname> -o yaml`), vous pouvez voir que le champ `spec.serviceAccountName` a été [automatiquement assigné](/docs/user-guide/working-with-resources/#resources-are-automatically-modified).

Vous pouvez accéder à l'API depuis l'intérieur d'un Pod en utilisant les identifiants de compte de service montés automatiquement, comme décrit dans [Accès au cluster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod).
Les permissions API du compte de service dépendent du [plugin d'autorisation et de la politique](/docs/reference/access-authn-authz/authorization/#authorization-modules) en usage.

Dans la version 1.6+, vous pouvez choisir de ne pas utiliser le montage automatique des identifiants API pour un compte de service en définissant `automountServiceAccountToken: false` sur le compte de service :

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

Dans la version 1.6+, vous pouvez également choisir de ne pas monter automatiquement les identifiants API pour un Pod particulier :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

La spéc de Pod a prépondérance par rapport au compte de service si les deux spécifient la valeur `automountServiceAccountToken`.

## Utiliser plusieurs comptes de services.

Chaque Namespace possède une ressource ServiceAccount par défaut appelée `default`.
Vous pouvez lister cette ressource et toutes les autres ressources de ServiceAccount dans le Namespace avec cette commande :

```shell
kubectl get serviceAccounts
```
La sortie est comme la suivante :

```
NAME      SECRETS    AGE
default   1          1d
```

Vous pouvez créer des objets ServiceAccount supplémentaires comme ceci :

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

Si vous obtenez un dump complet de l'objet compte de service, par exemple :

```shell
kubectl get serviceaccounts/build-robot -o yaml
```
La sortie est comme la suivante :

```
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-06-16T00:12:59Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  selfLink: /api/v1/namespaces/default/serviceaccounts/build-robot
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```

vous verrez alors qu'un token a été automatiquement créé et est référencé par le compte de service.

Vous pouvez utiliser des plugins d'autorisation pour [définir les permissions sur les comptes de service](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Pour utiliser un compte de service autre que par défaut, il suffit de spécifier le `spec.serviceAccountName` d'un Pod au nom du compte de service que vous souhaitez utiliser.

Le compte de service doit exister au moment de la création du Pod, sinon il sera rejeté.

Vous ne pouvez pas mettre à jour le compte de service d'un Pod déjà créé.

Vous pouvez supprimer le compte de service de cet exemple comme ceci :

```shell
kubectl delete serviceaccount/build-robot
```

## Créez manuellement un API token de compte de service.

Supposons que nous ayons un compte de service existant nommé "build-robot" comme mentionné ci-dessus,et que nous allons créer un nouveau Secret manuellement.

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

Vous pouvez maintenant confirmer que le Secret nouvellement construit est rempli d'un API token pour le compte de service "build-robot".

Tous les tokens pour des comptes de service non-existants seront nettoyés par le contrôleur de token.

```shell
kubectl describe secrets/build-robot-secret
```
La sortie est comme la suivante :

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account: name=build-robot
                kubernetes.io/service-account: uid=da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
Le contenu de `token` est éludé ici.
{{< /note >}}

## Ajouter ImagePullSecrets à un compte de service

Tout d'abord, créez un imagePullSecret, comme décrit [ici](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
Puis, vérifiez qu'il a été créé. Par exemple :

```shell
kubectl get secrets myregistrykey
```

La sortie est comme la suivante :

```
NAME             TYPE                              DATA    AGE
myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
```

Ensuite, modifiez le compte de service par défaut du Namespace pour utiliser ce Secret comme un `imagePullSecret`.

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

La version interactive nécessite un traitement manuel :

```shell
kubectl get serviceaccounts default -o yaml > ./sa.yaml
```

La sortie du fichier `sa.yaml` est similaire à celle-ci :

```shell
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
```

En utilisant l'éditeur de votre choix (par exemple `vi`), ouvrez le fichier `sa.yaml`, supprimez la ligne avec la clé `resourceVersion`, ajoutez les lignes avec `imagePullSecrets:` et sauvegardez.

La sortie du fichier `sa.yaml` est similaire à celle-ci :

```shell
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey
```

Enfin, remplacez le compte de service par le nouveau fichier `sa.yaml` mis à jour.

```shell
kubectl replace serviceaccount default -f ./sa.yaml
```

Maintenant, tous les nouveaux Pods créés dans le Namespace courant auront ceci ajouté à leurs spécifications :

```yaml
spec:
  imagePullSecrets:
  - name: myregistrykey
```

## Projection du volume des tokens de compte de service

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

{{< note >}}
Ce ServiceAccountTokenVolumeProjection est __beta__ en 1.12 et
activé en passant tous les paramètres suivants au serveur API :

* `--service-account-issuer`
* `--service-account-signing-key-file`
* `--service-account-api-audiences`

{{< /note >}}

Kubelet peut également projeter un token de compte de service dans un Pod. Vous pouvez spécifier les propriétés souhaitées du token, telles que l'audience et la durée de validité.
Ces propriétés ne sont pas configurables sur le compte de service par défaut. Le token de compte de service devient également invalide par l'API lorsque le Pod ou le ServiceAccount est supprimé

Ce comportement est configuré sur un PodSpec utilisant un type de ProjectedVolume appelé
[ServiceAccountToken](/docs/concepts/storage/volumes/#projected). Pour fournir un
Pod avec un token avec une audience de "vault" et une durée de validité de deux heures, vous devriez configurer ce qui suit dans votre PodSpec :

{{% codenew file="pods/pod-projected-svc-token.yaml" %}}

Créez le Pod

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

Kubelet demandera et stockera le token a la place du Pod, rendra le token disponible pour le Pod à un chemin d'accès configurable, et rafraîchissez le token à l'approche de son expiration. Kubelet fait tourner le token de manière proactive s'il est plus vieux que 80% de son TTL total, ou si le token est plus vieux que 24 heures.

L'application est responsable du rechargement du token lorsque celui ci est renouvelé. Un rechargement périodique (par ex. toutes les 5 minutes) est suffisant pour la plupart des cas d'utilisation.
