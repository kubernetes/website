---
title: Gestion des secrets avec Kustomize
content_type: task
weight: 30
description: Créer des Secrets à l'aide du fichier kustomization.yaml.
---

<!-- overview -->

`kubectl` prend en charge l'utilisation de l'outil de gestion des objets [Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/) pour gérer les Secrets
et ConfigMaps. Vous créez un *générateur de ressources* avec Kustomize, qui
génère un Secret que vous pouvez appliquer au serveur API à l'aide de `kubectl`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Créer un Secret

Vous pouvez générer un Secret en définissant un `secretGenerator` dans un
fichier `kustomization.yaml` qui référence d'autres fichiers existants, des fichiers `.env`, ou
des valeurs littérales. Par exemple, les instructions suivantes créent un fichier Kustomization
pour le nom d'utilisateur `admin` et le mot de passe `1f2d1e2e67df`.

{{< note >}}
Le champ `stringData` pour un Secret ne fonctionne pas bien avec le traitement des modifications coté serveur (Server Side Apply).
{{< /note >}}

### Créer le fichier Kustomization

{{< tabs name="Secret data" >}}
{{< tab name="Données brutes" codelang="yaml" >}}
secretGenerator:
- name: database-creds
  literals:
  - username=admin
  - password=1f2d1e2e67df
{{< /tab >}}
{{% tab name="Fichiers" %}}
1.  Stockez les informations d'identification dans des fichiers. Les noms de fichiers sont les clés du secret :

    ```shell
    echo -n 'admin' > ./username.txt
    echo -n '1f2d1e2e67df' > ./password.txt
    ```
    L'argument `-n` garantit qu'il n'y a pas de saut de ligne supplémentaire
    à la fin de vos fichiers.

1.  Créez le fichier `kustomization.yaml` :

    ```yaml
    secretGenerator:
    - name: database-creds
      files:
      - username.txt
      - password.txt
    ```
{{% /tab %}}
{{% tab name="Fichiers .env" %}}
Vous pouvez également définir le générateur de secret dans le fichier `kustomization.yaml` en
fournissant des fichiers `.env`. Par exemple, le fichier `kustomization.yaml` suivant
récupère les données du fichier `.env.secret` :

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```
{{% /tab %}}
{{< /tabs >}}

Dans tous les cas, vous n'avez pas besoin d'encoder les valeurs en base64. Le nom du fichier YAML
**doit** être `kustomization.yaml` ou `kustomization.yml`.

### Appliquer le fichier kustomization

Pour créer le Secret, appliquez le répertoire contenant le fichier kustomization :

```shell
kubectl apply -k <directory-path>
```

Le résutat est similaire à :

```
secret/database-creds-5hdh7hhgfk created
```

Lorsqu'un Secret est généré, le nom du Secret est créé en hashant
les données du Secret et en ajoutant la valeur de hachage au nom. Cela garantit qu'un 
nouveau Secret sera généré à chaque fois que les données sont modifiées.

Pour vérifier que le Secret a été créé et décoder les données du Secret, 

```shell
kubectl get -k <directory-path> -o jsonpath='{.data}' 
```

Le résutat est similaire à :

```
{ "password": "MWYyZDFlMmU2N2Rm", "username": "YWRtaW4=" }
```

```
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

Le résultat est similaire à :

```
1f2d1e2e67df
```

Pour en savor plus, consultez
[la gestion des secrets avec kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) et la
[Gestion déclarative des objets Kubernetes avec Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).

## Modifier un Secret {#edit-secret}

1.  Dans votre fichier `kustomization.yaml`, modifiez les données, par exemple `password`.
2.  Appliquez le dossier contenant le fichier kustomization :

    ```shell
    kubectl apply -k <directory-path>
    ```

    Le résultat sera similaire à :

    ```
    secret/db-user-pass-6f24b56cc8 created
    ```

Le Secret modifié est créé en tant que nouvel objet `Secret`, au lieu de mettre à jour 
le `Secret` existant. Il sera peut-être nécessaire de 
mettre à jour les références au Secret dans vos Pods.

## Nettoyage

Pour supprimer un Secret, utilisez `kubectl` :

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- En savoir plus sur le [concept de Secret](/fr/docs/concepts/configuration/secret/)
- Apprendre comment [gérer les Secrets avec kubectl](/fr/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Apprendre à [gérer les Secrets avec un fichier de configuration](/fr/docs/tasks/configmap-secret/managing-secret-using-config-file/)
