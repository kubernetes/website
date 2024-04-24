---
title: Configurer l'accès à plusieurs clusters
content_type: task
weight: 30
card:
  name: tasks
  weight: 40
---


<!-- overview -->

Cette page montre comment configurer l'accès à plusieurs clusters à l'aide de fichiers de configuration.
Une fois vos clusters, utilisateurs et contextes définis dans un ou plusieurs fichiers de configuration, vous pouvez basculer rapidement entre les clusters en utilisant la commande `kubectl config use-context`.

{{< note >}}
Un fichier utilisé pour configurer l'accès à un cluster est parfois appelé *fichier kubeconfig*.
C'est une manière générique de se référer aux fichiers de configuration.
Cela ne signifie pas qu'il existe un fichier nommé `kubeconfig`.
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Pour vérifier que {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} est installé, executez `kubectl version --client`.
La version kubectl doit être [dans une version mineure](/docs/setup/release/version-skew-policy/#kubectl) de votre
serveur API du cluster.

<!-- steps -->

## Définir des clusters, des utilisateurs et des contextes

Supposons que vous ayez deux clusters, un pour le développement et un pour le travail `scratch`.
Dans le cluster `development`, vos développeurs frontend travaillent dans un espace de noms appelé `frontend`, et vos développeurs de stockage travaillent dans un espace de noms appelé `storage`.
Dans votre cluster `scratch`, les développeurs travaillent dans le namespace par défaut ou créent des namespaces auxiliaires comme bon leur semble.
L'accès au cluster `development` nécessite une authentification par certificat.
L'accès au cluster `scratch` nécessite une authentification par nom d'utilisateur et mot de passe.

Créez un répertoire nommé `config-exercice`.
Dans votre répertoire `config-exercice`, créez un fichier nommé `config-demo` avec ce contenu:

```shell
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: scratch

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-scratch
```

Un fichier de configuration décrit les clusters, les utilisateurs et les contextes.
Votre fichier `config-demo` a le cadre pour décrire deux clusters, deux utilisateurs et trois contextes.

Allez dans votre répertoire `config-exercice`.
Entrez ces commandes pour ajouter les détails du cluster à votre fichier de configuration:

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster scratch --server=https://5.6.7.8 --insecure-skip-tls-verify
```

Ajoutez les détails de l'utilisateur à votre fichier de configuration:

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

{{< note >}}

- Pour supprimer un utilisateur, vous pouvez exécuter `kubectl --kubeconfig=config-demo config unset users.<name>`
- Pour supprimer un cluster, vous pouvez exécuter `kubectl --kubeconfig=config-demo config unset clusters.<name>`
- Pour supprimer un contexte, vous pouvez exécuter `kubectl --kubeconfig=config-demo config unset contexts.<name>`
{{< /note >}}

Ajoutez des détails de contexte à votre fichier de configuration:

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-scratch --cluster=scratch --namespace=default --user=experimenter
```

Ouvrez votre fichier `config-demo` pour voir les détails ajoutés.
Au lieu d'ouvrir le fichier `config-demo`, vous pouvez utiliser la commande `kubectl config view`.

```shell
kubectl config --kubeconfig=config-demo view
```

La sortie montre les deux clusters, deux utilisateurs et trois contextes:

```shell
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: scratch
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: scratch
    namespace: default
    user: experimenter
  name: exp-scratch
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    password: some-password
    username: exp
```

Le `fake-ca-file`, `fake-cert-file` et `fake-key-file` ci-dessus sont les espaces réservés pour les noms de chemin des fichiers de certificat.
Vous devez les remplacer par les noms de chemin réels des fichiers de certificat dans votre environnement.

Parfois, vous souhaiterez peut-être utiliser des données encodées en Base64 incorporées ici au lieu de fichiers de certificat séparés; dans ce cas, vous devez ajouter le suffixe `-data` aux clés, par exemple, `certificate-Authority-data`, `client-certificate-data`, `client-key-data`.

Chaque contexte est un triplet (cluster, utilisateur, namespace).
Par exemple, le contexte `dev-frontend` dit, "Utilisez les informations d'identification de l'utilisateur `developer` pour accéder au namespace `frontend` du cluster `development`".

Définissez le contexte actuel:

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

Maintenant, chaque fois que vous entrez une commande `kubectl`, l'action s'appliquera au cluster et au namespace répertorié dans le contexte `dev-frontend`.
Et la commande utilisera les informations d'identification de l'utilisateur répertoriées dans le contexte `dev-frontend`.

Pour voir uniquement les informations de configuration associées au contexte actuel, utilisez l'indicateur `--minify`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

La sortie affiche les informations de configuration associées au contexte `dev-frontend`:

```shell
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

Supposons maintenant que vous souhaitiez travailler pendant un certain temps dans le cluster scratch.

Changez le contexte actuel en `exp-scratch`:

```shell
kubectl config --kubeconfig=config-demo use-context exp-scratch
```

Maintenant, toute commande `kubectl` que vous donnez s'appliquera au namespace par défaut du cluster `scratch`.
Et la commande utilisera les informations d'identification de l'utilisateur répertoriées dans le contexte `exp-scratch`.

Afficher la configuration associée au nouveau contexte actuel, `exp-scratch`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

Enfin, supposons que vous vouliez travailler pendant un certain temps dans le namespace `storage` du cluster `development`.

Changez le contexte actuel en `dev-storage`:

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

Afficher la configuration associée au nouveau contexte actuel, `dev-storage`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

## Créer un deuxième fichier de configuration

Dans votre répertoire `config-exercice`, créez un fichier nommé `config-demo-2` avec ce contenu:

```shell
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

Le fichier de configuration précédent définit un nouveau contexte nommé `dev-ramp-up`.

## Définissez la variable d'environnement KUBECONFIG

Vérifiez si vous avez une variable d'environnement nommée `KUBECONFIG`.
Si tel est le cas, enregistrez la valeur actuelle de votre variable d'environnement `KUBECONFIG`, afin de pouvoir la restaurer ultérieurement.
Par exemple:

### Linux

```shell
export KUBECONFIG_SAVED=$KUBECONFIG
```

### Windows PowerShell

```shell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

La variable d'environnement `KUBECONFIG` est une liste de chemins vers les fichiers de configuration.
La liste est délimitée par deux-points pour Linux et Mac et par des points-virgules pour Windows.
Si vous avez une variable d'environnement `KUBECONFIG`, familiarisez-vous avec les fichiers de configuration de la liste.

Ajoutez temporairement deux chemins à votre variable d'environnement `KUBECONFIG`.
Par exemple:

### Linux

```shell
export KUBECONFIG=$KUBECONFIG:config-demo:config-demo-2
```

### Windows PowerShell

```shell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

Dans votre répertoire `config-exercice`, entrez cette commande:

```shell
kubectl config view
```

La sortie affiche les informations fusionnées de tous les fichiers répertoriés dans votre variable d'environnement `KUBECONFIG`.
En particulier, notez que les informations fusionnées ont le contexte `dev-ramp-up` du fichier `config-demo-2` et les trois contextes du fichier `config-demo`:

```shell
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: scratch
    namespace: default
    user: experimenter
  name: exp-scratch
```

Pour plus d'informations sur la manière dont les fichiers kubeconfig sont fusionnés, consultez [Organisation de l'accès au cluster à l'aide des fichiers kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

## Explorez le répertoire $HOME/.kube

Si vous avez déjà un cluster, et vous pouvez utiliser `kubectl` pour interagir avec le cluster, alors vous avez probablement un fichier nommé `config` dans le repertoire `$HOME/.kube`.

Allez dans `$ HOME/.kube`, et voyez quels fichiers sont là.
En règle générale, il existe un fichier nommé `config`.
Il peut également y avoir d'autres fichiers de configuration dans ce répertoire.
Familiarisez-vous brièvement avec le contenu de ces fichiers.

## Ajoutez $HOME/.kube/config à votre variable d'environnement KUBECONFIG

Si vous avez un fichier `$ HOME/.kube/config`, et qu'il n'est pas déjà répertorié dans votre variable d'environnement `KUBECONFIG`, ajoutez-le maintenant à votre variable d'environnement `KUBECONFIG`.
Par exemple:

### Linux

```shell
export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config
```

### Windows Powershell

```shell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

Affichez les informations de configuration fusionnées à partir de tous les fichiers qui sont maintenant répertoriés dans votre variable d'environnement `KUBECONFIG`.
Dans votre répertoire config-exercice, entrez:

```shell
kubectl config view
```

## Nettoyage

Remettez votre variable d'environnement `KUBECONFIG` à sa valeur d'origine.

Par exemple:

### Linux

```shell
export KUBECONFIG=$KUBECONFIG_SAVED
```

### Windows PowerShell

```shell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```

## {{% heading "whatsnext" %}}

- [Organisation de l'accès au cluster à l'aide des fichiers kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
- [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)
