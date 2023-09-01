---
title: Distribuer des données sensibles de manière sécurisée avec les Secrets
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->

Cette page montre comment injecter des données sensibles comme des mots de passe ou des clés de chiffrement dans des Pods.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

### Encoder vos données en format base64

Supposons que vous avez deux données sensibles: un identifiant `my-app` et un
mot de passe
`39528$vdg7Jb`. Premièrement, utilisez un outil capable d'encoder vos données
dans un format base64. Voici un exemple en utilisant le programme base64:
```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

Le résultat montre que la représentation base64 de l'utilisateur est `bXktYXBw`,
et que la représentation base64 du mot de passe est `Mzk1MjgkdmRnN0pi`.

{{< caution >}}
Utilisez un outil local approuvé par votre système d'exploitation 
afin de réduire les risques de sécurité liés à l'utilisation d'un outil externe.
{{< /caution >}}

<!-- steps -->

## Créer un Secret

Voici un fichier de configuration que vous pouvez utiliser pour créer un Secret
qui contiendra votre identifiant et mot de passe:

{{% codenew file="pods/inject/secret.yaml" %}}

1. Créez le Secret:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

1. Listez les informations du Secret:

   ```shell
   kubectl get secret test-secret
   ```

   Résultat:

   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

1. Affichez les informations détaillées du Secret:

   ```shell
   kubectl describe secret test-secret
   ```

   Résultat:

   ```
   Name:       test-secret
   Namespace:  default
   Labels:     <none>
   Annotations:    <none>

   Type:   Opaque

   Data
   ====
   password:   13 bytes
   username:   7 bytes
   ```

### Créer un Secret en utilisant kubectl

Si vous voulez sauter l'étape d'encodage, vous pouvez créer le même Secret 
en utilisant la commande `kubectl create secret`. Par exemple:

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

Cette approche est plus pratique. La façon de faire plus explicite 
montrée précédemment permet de démontrer et comprendre le fonctionnement des Secrets.


## Créer un Pod qui a accès aux données sensibles à travers un Volume

Voici un fichier de configuration qui permet de créer un Pod:

{{% codenew file="pods/inject/secret-pod.yaml" %}}

1. Créez le Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. Vérifiez que le Pod est opérationnel:

   ```shell
   kubectl get pod secret-test-pod
   ```

   Résultat:
   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. Exécutez une session shell dans le Container qui est dans votre Pod:
   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. Les données sont exposées au container à travers un Volume monté sur
`/etc/secret-volume`.

   Dans votre shell, listez les fichiers du dossier `/etc/secret-volume`:
   ```shell
   # À exécuter à l'intérieur du container
   ls /etc/secret-volume
   ```
   Le résultat montre deux fichiers, un pour chaque donnée du Secret:
   ```
   password username
   ```

1. Toujours dans le shell, affichez le contenu des fichiers 
   `username` et `password`:
   ```shell
   # À exécuter à l'intérieur du container
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```
   Le résultat doit contenir votre identifiant et mot de passe:
   ```
   my-app
   39528$vdg7Jb
   ```

Vous pouvez alors modifier votre image ou votre ligne de commande pour que le programme
recherche les fichiers contenus dans le dossier du champ `mountPath`.
Chaque clé du Secret `data` sera exposée comme un fichier à l'intérieur de ce dossier.

### Monter les données du Secret sur des chemins spécifiques

Vous pouvez contrôler les chemins sur lesquels les données des Secrets sont montées.
Utilisez le champ `.spec.volumes[].secret.items` pour changer le
chemin cible de chaque donnée:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

Voici ce qu'il se passe lorsque vous déployez ce Pod:

* La clé `username` du Secret `mysecret` est montée dans le container sur le chemin
  `/etc/foo/my-group/my-username` au lieu de `/etc/foo/username`.
* La clé `password` du Secret n'est pas montée dans le container.

Si vous listez de manière explicite les clés en utilisant le champ `.spec.volumes[].secret.items`,
il est important de prendre en considération les points suivants:

* Seules les clés listées dans le champ `items` seront montées.
* Pour monter toutes les clés du Secret, toutes doivent être 
  définies dans le champ `items`.
* Toutes les clés définies doivent exister dans le Secret. 
  Sinon, le volume ne sera pas créé.

### Appliquer des permissions POSIX aux données

Vous pouvez appliquer des permissions POSIX pour une clé d'un Secret. Si vous n'en configurez pas, les permissions seront par défaut `0644`.
Vous pouvez aussi définir des permissions pour tout un Secret, et redéfinir les permissions pour chaque clé si nécessaire.

Par exemple, il est possible de définir un mode par défaut:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

Le Secret sera monté sur `/etc/foo`; tous les fichiers créés par le secret
auront des permissions de type `0400`.

{{< note >}}
Si vous définissez un Pod en utilisant le format JSON, il est important de 
noter que la spécification JSON ne supporte pas le système octal, et qu'elle
comprendra la valeur `0400` comme la valeur _décimale_ `400`.
En JSON, utilisez plutôt l'écriture décimale pour le champ `defaultMode`.
Si vous utilisez le format YAML, vous pouvez utiliser le système octal 
pour définir `defaultMode`.
{{< /note >}}

## Définir des variables d'environnement avec des Secrets

Il est possible de monter les données des Secrets comme variables d'environnement dans vos containers.

Si un container consomme déja un Secret en variables d'environnement,
la mise à jour de ce Secret ne sera pas répercutée dans le container tant 
qu'il n'aura pas été redémarré. Il existe cependant des solutions tierces 
permettant de redémarrer les containers lors d'une mise à jour du Secret.

### Définir une variable d'environnement à partir d'un seul Secret

*  Définissez une variable d'environnement et sa valeur à l'intérieur d'un Secret:

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   ```

*  Assignez la valeur de `backend-username` définie dans le Secret 
   à la variable d'environnement `SECRET_USERNAME` dans la configuration du Pod.

   {{% codenew file="pods/inject/pod-single-secret-env-variable.yaml" %}}

*  Créez le Pod:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
   ```

*  À l'intérieur d'une session shell, affichez le contenu de la variable
   d'environnement `SECRET_USERNAME`:

   ```shell
   kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
   ```

   Le résultat est:
   ```
   backend-admin
   ```

### Définir des variables d'environnement à partir de plusieurs Secrets

*  Comme précédemment, créez d'abord les Secrets:

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   kubectl create secret generic db-user --from-literal=db-username='db-admin'
   ```

*  Définissez les variables d'environnement dans la configuration du Pod.

   {{% codenew file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

*  Créez le Pod:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
   ```

*  Dans un shell, listez les variables d'environnement du container:

   ```shell
   kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
   ```
   Le résultat est:
   ```
   DB_USERNAME=db-admin
   BACKEND_USERNAME=backend-admin
   ```


## Configurez toutes les paires de clé-valeur d'un Secret comme variables d'environnement

{{< note >}}
Cette fonctionnalité n'est disponible que dans les versions de Kubernetes
égales ou supérieures à v1.6.
{{< /note >}}

*  Créez un Secret contenant plusieurs paires de clé-valeur:

   ```shell
   kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
   ```

*  Utilisez `envFrom` pour définir toutes les données du Secret comme variables
   d'environnement. Les clés du Secret deviendront les noms des variables
   d'environnement à l'intérieur du Pod.

    {{% codenew file="pods/inject/pod-secret-envFrom.yaml" %}}

*  Créez le Pod:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
   ```

* Dans votre shell, affichez les variables d'environnement `username` et `password`:

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  Le résultat est:
  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

### Références

* [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

* En savoir plus sur les [Secrets](/docs/concepts/configuration/secret/).
* En savoir plus sur les [Volumes](/docs/concepts/storage/volumes/).
