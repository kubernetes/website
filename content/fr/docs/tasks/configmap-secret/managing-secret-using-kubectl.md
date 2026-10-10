---
title: Gestion des secrets avec kubectl
content_type: task
weight: 10
description: Créer des Secrets via la ligne de commande kubectl.
---

<!-- overview -->

Cette page vous montre comment créer, éditer, gérer et supprimer des
{{<glossary_tooltip text="Secrets" term_id="secret">}} Kubernetes en utilisant l'outil de ligne de commande `kubectl`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Créer un Secret

Un objet `Secret` stocke des données sensibles telles que des informations d'identification
utilisées par des Pods pour accéder à des services. Par exemple, vous pourriez avoir besoin d'un Secret pour stocker
le nom d'utilisateur et le mot de passe nécessaires pour accéder à une base de données.

Vous pouvez créer le Secret en passant les données brutes dans la commande, ou en stockant
les informations d'identification dans des fichiers que vous transmettez à la commande. Les commandes suivantes
créent un Secret qui stocke le nom d'utilisateur `admin` et le mot de passe `S!B\*d$zDsb=`.

### Utiliser des données brutes

Exécutez la commande suivante :

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```

Vous devez utiliser des guillemets simples `''` pour échapper les caractères spéciaux tels que `$`, `\`,
`*`, `=`, et `!` dans vos chaînes de caractères. Sinon, votre shell 
interprétera ces caractères.

{{< note >}}
Le champ `stringData` pour un Secret ne fonctionne pas bien avec le traitement des modifications coté serveur (Server Side Apply).
{{< /note >}}

### Utiliser des fichiers sources

1. Stockez les informations d'identification dans des fichiers :

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n 'S!B\*d$zDsb=' > ./password.txt
   ```

   L'argument `-n` garantit que les fichiers générés n'ont pas de saut de ligne supplémentaire
   à la fin du texte. C'est important car lorsque `kubectl` lit un fichier et encode le contenu dans une chaîne base64, le saut de ligne supplémentaire
   sera également encodé. Vous n'avez pas besoin d'échapper les caractères spéciaux
   dans les chaînes que vous incluez dans un fichier.

1. Passez les chemins des fichiers dans la commande `kubectl` :

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   Par défaut, le nom de la clé sera le nom du fichier. Vous pouvez éventuellement définir le nom de la clé
   en utilisant `--from-file=[key=]source`. Par exemple :

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

Avec l'une ou l'autre méthode, le résultat est similaire à :

```
secret/db-user-pass created
```

### Vérifier le Secret {#verify-the-secret}

Vérifiez que le Secret a été créé :

```shell
kubectl get secrets
```

Le résultat est similaire à :

```
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

Affichez les détails du Secret :

```shell
kubectl describe secret db-user-pass
```

Le résultat est similaire à :

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

Les commandes `kubectl get` et `kubectl describe` n'affichent pas le contenu
d'un `Secret` par défaut. Cela protège le `Secret` contre une exposition
accidentelle, ou d'être stocké dans un historique de terminal.

### Décoder le Secret {#decoding-secret}

1. Affichez le contenu du Secret que vous avez créé :

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   Le résultat est similaire à :

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

1. Décodez les données de `password` :

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   Le résultat est similaire à :

   ```
   S!B\*d$zDsb=
   ```

   {{< caution >}}
   Ceci est un exemple à des fins de documentation. En pratique,
   cette méthode pourrait entraîner l'enregistrement de la commande avec les données encodées
   dans l'historique de votre shell. Toute personne ayant accès à votre ordinateur pourrait trouver la
   commande et décoder le secret. Une meilleure approche consiste à combiner les commandes d'affichage et de décodage.
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

## Modifier un Secret {#edit-secret}

Vous pouvez éditer un objet `Secret` existant sauf s'il est
[immuable](/docs/concepts/configuration/secret/#secret-immutable). Pour éditer un
Secret, exécutez la commande suivante :

```shell
kubectl edit secrets <secret-name>
```

Cela ouvre votre éditeur par défaut et vous permet de mettre à jour les valeurs base64 encodées
du Secret dans le champ `data`, comme dans l'exemple suivant :

```yaml
# Éditez l'objet ci-dessous. Les lignes commençant par '#' seront ignorées,
# et un fichier vide interrompra l'édition. Si une erreur se produit lors de l'enregistrement du fichier, il sera
# re ouvert en affichant les erreurs.
#
apiVersion: v1
data:
  password: UyFCXCpkJHpEc2I9
  username: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: "2022-06-28T17:44:13Z"
  name: db-user-pass
  namespace: default
  resourceVersion: "12708504"
  uid: 91becd59-78fa-4c85-823f-6d44436242ac
type: Opaque
```

## Nettoyer

Pour supprimer un Secret, exécutez la commande suivante :

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- En savoir plus sur le [concept de Secret](/fr/docs/concepts/configuration/secret/)
- Apprendre comment [gérer les Secrets avec des fichiers de configuration](/fr/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Apprendre à [gérer les Secrets avec kustomize](/fr/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
