---
title: Gestion des Secrets avec un fichier de configuration
content_type: task
weight: 20
description: Créer des Secrets en utilisant un fichier de configuration de ressources.
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Créer le Secret {#create-the-config-file}

Vous pouvez d'abord définir l'objet `Secret` dans un fichier, au format JSON ou YAML,
puis créer cet objet. La ressource
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
contient deux clé : `data` et `stringData`.
Le champ `data` est utilisé pour stocker des données encodées en base64. Le
champ `stringData` est fourni par commodité et permet de fournir
les mêmes données sous forme de texte non encodé.
Les valeurs de `data` et `stringData` doivent être composées de caractères alphanumériques,
`-`, `_` ou `.`.

L'exemple suivant stocke deux chaînes de caractères dans un Secret en utilisant le champ `data`.

1. Convertissez le texte en base64 :

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

   {{< note >}}
   Les valeurs JSON et YAML du Secret sont sérialisées puis encodées en base64. Les sauts de ligne ne sont pas valides à l'intérieur de ces chaînes et doivent être omis. Lors de l'utilisation de l'utilitaire `base64` sur Darwin/macOS, les utilisateurs doivent éviter d'utiliser l'option `-b` pour diviser les lignes longues. En revanche, les utilisateurs Linux *doivent* ajouter l'option `-w 0` à la commande `base64` ou alors utiliser `base64 | tr -d '\n'` si l'option `-w` n'est pas disponible.
   {{< /note >}}

   Le résultat sera similaire à :

   ```
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```

1. Créez le manifeste :

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: MWYyZDFlMmU2N2Rm
   ```

   Notez que le nom d'un objet Secret doit être un
   [nom de sous-domaine DNS valide](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

1. Créez le Secret en utilisant [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Le résultat sera similaire à :

   ```
   secret/mysecret created
   ```

Pour vérifier que le Secret a été créé et pour décoder les données du Secret, référez-vous à la page sur la 
[Gestion des secrets à l'aide de kubectl](/fr/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret).

### Spécifier des données non encodées lors de la création d'un Secret

Pour certains cas, vous pouvez
utiliser le champ `stringData` à la place. Ce
champ vous permet d'ajouter du texte non encodé directement dans le Secret,
et il sera encodé pour vous lors de la création ou de la mise à jour du Secret.

Un exemple pratique de ce besoin pourrait être lorsque vous déployez une application
qui utilise un Secret pour stocker un fichier de configuration, et que vous voulez configurer
certaines parties de ce fichier de configuration pendant votre processus de déploiement.

Par exemple, si votre application utilise le fichier de configuration suivant :

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

Vous pourriez le stocker dans un Secret en utilisant la définition suivante :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

{{< note >}}
Le champ `stringData` pour un Secret ne fonctionne pas bien avec le traitement des modifications coté serveur (Server Side Apply).
{{< /note >}}

Lorsque vous récupérez les données du Secret, la commande retourne les valeurs encodées,
et non les valeurs en texte brut que vous avez fournies dans `stringData`.

Par exemple, si vous exécutez la commande suivante :

```shell
kubectl get secret mysecret -o yaml
```

Le résultat sera similaire à :

```yaml
apiVersion: v1
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
```

### Spécifier à la fois `data` et `stringData`

Si vous spécifiez un champ à la fois dans `data` et `stringData`, la valeur de `stringData` sera utilisée.

Par exemple, si vous définissez le Secret suivant :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

{{< note >}}
Le champ `stringData` pour un Secret ne fonctionne pas bien avec le traitement des modifications coté serveur (Server Side Apply).
{{< /note >}}

L'objet `Secret` sera créé comme ceci :

```yaml
apiVersion: v1
data:
  username: YWRtaW5pc3RyYXRvcg==
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
```

`YWRtaW5pc3RyYXRvcg==` décodé devient `administrator`.

## Modifier un Secret {#edit-secret}

Pour éditer les données du Secret que vous avez créé à l'aide d'un manifeste, modifiez le champ `data`
ou `stringData` dans votre manifeste et appliquez le fichier à votre
cluster. Vous pouvez éditer un objet Secret existant à moins qu'il ne soit
[immuable](/docs/concepts/configuration/secret/#secret-immutable).

Par exemple, si vous souhaitez changer le mot de passe de l'exemple précédent pour 
`birdsarentreal`, procédez comme suit :

1. Encodez le nouveau mot de passe:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   Le résultat sera similaire à :

   ```
   YmlyZHNhcmVudHJlYWw=
   ```

1. Mettre à jour le champ `data` avec votre nouvelle valeur :

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: YmlyZHNhcmVudHJlYWw=
   ```

1. Appliquer la configuration sur votre cluster :

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Le résultat sera similaire à :

   ```
   secret/mysecret configured
   ```

Kubernetes met à jour l'objet Secret existant. Pour être précis, l'outil `kubectl`
remarque qu'il existe déja un `Secret` existant avec le même nom. `kubectl`
récupère l'objet existant, planifie les modifications dessus et soumet le `Secret` modifié au plan de contrôle du cluster.

Si vous utilisez `kubectl apply --server-side`, `kubectl` utilisera plutôt
[le traitement coté serveur (Server Side Apply)](/docs/reference/using-api/server-side-apply/).

## Nettoyage

Pour supprimer le Secret que vous venez de créer :

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- En savoir plus sur les [Secrets](/fr/docs/concepts/configuration/secret/)
- Apprendre comment [gérer les Secrets avec kubectl](/fr/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Apprendre à [gérer les Secrets avec kustomize](/fr/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
