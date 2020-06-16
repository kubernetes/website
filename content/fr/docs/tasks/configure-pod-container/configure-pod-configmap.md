---
title: Configure a Pod to Use a ConfigMap
content_template: templates/task
weight: 150
card:
  name: tasks
  weight: 50
---

{{% capture overview %}}
Les ConfigMaps vous permettent de découpler les artefacts de configuration du contenu de l'image pour garder les applications conteneurisées portables.
Cette page fournit une série d'exemples d'utilisation montrant comment créer des ConfigMaps et configurer des pods à l'aide des données stockées dans des ConfigMaps.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Créer un ConfigMap

Vous pouvez utiliser soit `kubectl create configmap` ou un générateur ConfigMap dans `kustomization.yaml` pour créer un ConfigMap.
Notez que `kubectl` prends en charge `kustomization.yaml` à partir de la version 1.14.

### Créer un ConfigMap à l'aide de kubectl create configmap

Utilisez la commande `kubectl create configmap` pour créer des Configmaps depuis des [dossiers](#create-configmaps-from-directories), [fichiers](#create-configmaps-from-files), ou des [valeurs littérales](#create-configmaps-from-literal-values):

```shell
kubectl create configmap <map-name> <data-source>
```

où \<map-name> est le nom que vous souhaitez attribuer à ConfigMap et \<data-source> est le répertoire, le fichier ou la valeur littérale à partir de laquelle récupérer les données.

La source de données correspond à une paire clé-valeur dans ConfigMap, où

* clé = le nom du fichier ou la clé que vous avez fournie sur la ligne de commande, et
* valeur = le contenu du fichier ou la valeur littérale que vous avez fournie sur la ligne de commande.

Vous pouvez utiliser [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) ou [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) pour récupérer des informations sur un ConfigMap.

#### Créer des ConfigMaps à partir de répertoires

Vous pouvez utiliser `kubectl create configmap` pour créer un ConfigMap à partir de plusieurs fichiers dans le même répertoire.

Par exemple:

```shell
# Créez le répertoire local
mkdir -p configure-pod-container/configmap/

# Téléchargez les exemples de fichiers dans le répertoire `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Créer la configmap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

combine le contenu du répertoire `configure-pod-container/configmap/`

```shell
game.properties
ui.properties
```

dans le ConfigMap suivant:

```shell
kubectl describe configmaps game-config
```

où la sortie est similaire à ceci:

```text
Name:           game-config
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
ui.properties:          83 bytes
```

Les fichiers `game.properties` et `ui.properties` dans le répertoire `configure-pod-container/configmap/` sont représentés dans la section `data` de la ConfigMap.

```shell
kubectl get configmaps game-config -o yaml
```

La sortie est similaire à ceci:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

#### Créer des ConfigMaps à partir de fichiers

Vous pouvez utiliser `kubectl create configmap` pour créer un ConfigMap à partir d'un fichier individuel ou de plusieurs fichiers.

Par exemple,

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

produirait le ConfigMap suivant:

```shell
kubectl describe configmaps game-config-2
```

où la sortie est similaire à ceci:

```text
Name:           game-config-2
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
```

Vous pouvez passer l'argument `--from-file` plusieurs fois pour créer un ConfigMap à partir de plusieurs sources de données.

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

Décrivez la ConfigMap crée `game-config-2`:

```shell
kubectl describe configmaps game-config-2
```

La sortie est similaire à ceci:

```text
Name:           game-config-2
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
ui.properties:          83 bytes
```

Utilisez l'option `--from-env-file` pour créer un ConfigMap à partir d'un fichier env, par exemple:

```shell
# Les fichiers env contiennent une liste de variables d'environnement.
# Ces règles de syntaxe s'appliquent:
#   Chaque ligne d'un fichier env doit être au format VAR=VAL.
#   Les lignes commençant par # (c'est-à-dire les commentaires) sont ignorées.
#   Les lignes vides sont ignorées.
#   Il n'y a pas de traitement spécial des guillemets (c'est-à-dire qu'ils feront partie de la valeur ConfigMap)).

# Téléchargez les exemples de fichiers dans le dossier `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties

# Le fichier env `game-env-file.properties` ressemble à ceci
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# Ce commentaire et la ligne vide au-dessus sont ignorés
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

produirait le ConfigMap suivant:

```shell
kubectl get configmap game-config-env-file -o yaml
```

où la sortie est similaire à ceci:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

{{< caution >}}
Lorsque vous passez plusieurs fois `--from-env-file` pour créer un ConfigMap à partir de plusieurs sources de données, seul le dernier fichier env est utilisé.
{{< /caution >}}

Le comportement consistant à passer plusieurs fois `--from-env-file` est démontré par:

```shell
# Téléchargez les exemples de fichiers dans le répertoire `configure-pod-container/configmap/`
wget https://k8s.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Créez le configmap
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

produirait le ConfigMap suivant:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

où la sortie est similaire à ceci:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  color: purple
  how: fairlyNice
  textmode: "true"
```

#### Définissez la clé à utiliser lors de la création d'un ConfigMap à partir d'un fichier

Vous pouvez définir une clé autre que le nom de fichier à utiliser dans la section `data` de votre ConfigMap lorsque vous utilisez l'argument `--from-file`:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

où `<my-key-name>` est la clé que vous souhaitez utiliser dans la ConfigMap et `<path-to-file>` est l'emplacement du fichier de source de données que vous souhaitez que la clé représente.

Par exemple:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

produirait la ConfigMap suivante:

```shell
kubectl get configmaps game-config-3 -o yaml
```

où la sortie est similaire à ceci:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

#### Créer des ConfigMaps à partir de valeurs littérales

Vous pouvez utiliser `kubectl create configmap` avec l'argument `--from-literal` définir une valeur littérale à partir de la ligne de commande:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

Vous pouvez transmettre plusieurs paires clé-valeur.
Chaque paire fournie sur la ligne de commande est représentée comme une entrée distincte dans la section `data` de la ConfigMap.

```shell
kubectl get configmaps special-config -o yaml
```

La sortie est similaire à ceci:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

### Créer un ConfigMap à partir du générateur

`kubectl` supporte `kustomization.yaml` depuis 1.14.
Vous pouvez également créer un ConfigMap à partir de générateurs, puis l'appliquer pour créer l'objet sur l'Apiserver.
Les générateurs doivent être spécifiés dans un `kustomization.yaml` à l'intérieur d'un répertoire.

#### Générer des ConfigMaps à partir de fichiers

Par exemple, pour générer un ConfigMap à partir de fichiers `configure-pod-container/configmap/game.properties`

```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

Appliquer le dossier kustomization pour créer l'objet ConfigMap.

```shell
kubectl apply -k .
configmap/game-config-4-m9dm2f92bt created
```

Vous pouvez vérifier que le ConfigMap a été créé comme ceci:

```text
kubectl get configmap
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s


kubectl describe configmaps/game-config-4-m9dm2f92bt
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

Notez que le nom ConfigMap généré a un suffixe obtenu par hachage de son contenu.
Cela garantit qu'un nouveau ConfigMap est généré chaque fois que le contenu est modifié.

#### Définissez la clé à utiliser lors de la génération d'un ConfigMap à partir d'un fichier

Vous pouvez définir une clé autre que le nom de fichier à utiliser dans le générateur ConfigMap.
Par exemple, pour générer un ConfigMap à partir du fichier `configure-pod-container/configmap/game.properties`
avec la clé `game-special-key`

```shell
# Créer un fichier kustomization.yaml avec ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

Appliquer le dossier kustomization pour créer l'objet ConfigMap.

```text
kubectl apply -k .
configmap/game-config-5-m67dt67794 created
```

#### Générer des ConfigMaps à partir de littéraux

Pour générer un ConfigMap à partir de littéraux `special.type=charm` et `special.how=very`, vous pouvez spécifier le générateur ConfigMap dans `kustomization.yaml` comme

```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```

Appliquez le dossier kustomization pour créer l'objet ConfigMap.

```text
kubectl apply -k .
configmap/special-config-2-c92b5mmcf2 created
```

## Définir des variables d'environnement de conteneur à l'aide des données ConfigMap

### Définissez une variable d'environnement de conteneur avec les données d'une seule ConfigMap

1. Définissez une variable d'environnement comme paire clé-valeur dans un ConfigMap:

    ```shell
    kubectl create configmap special-config --from-literal=special.how=very
    ```

1. Attribuez la valeur `special.how` défini dans ConfigMap à la variable d'environnement `SPECIAL_LEVEL_KEY` dans la spécification du Pod.

   {{< codenew file="pods/pod-single-configmap-env-variable.yaml" >}}

   Créez le pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
 ```

   Maintenant, la sortie du Pod comprend une variable d'environnement `SPECIAL_LEVEL_KEY=very`.

### Définir des variables d'environnement de conteneur avec des données de plusieurs ConfigMaps

* Comme avec l'exemple précédent, créez d'abord les ConfigMaps.

   {{< codenew file="configmap/configmaps.yaml" >}}

   Créez le ConfigMap:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
 ```

* Définissez les variables d'environnement dans la spécification Pod.

  {{< codenew file="pods/pod-multiple-configmap-env-variable.yaml" >}}

  Créez le pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
 ```

  Maintenant, la sortie du Pod comprend des variables d'environnement `SPECIAL_LEVEL_KEY=very` et `LOG_LEVEL=INFO`.

## Configurer toutes les paires clé-valeur dans un ConfigMap en tant que variables d'environnement de conteneur

{{< note >}}
Cette fonctionnalité est disponible dans Kubernetes v1.6 et versions ultérieures.
{{< /note >}}

* Créez un ConfigMap contenant plusieurs paires clé-valeur.

  {{< codenew file="configmap/configmap-multikeys.yaml" >}}

  Créez le ConfigMap:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
 ```

* Utilisez `envFrom` pour définir toutes les données du ConfigMap en tant que variables d'environnement du conteneur.
  La clé de ConfigMap devient le nom de la variable d'environnement dans le pod.

 {{< codenew file="pods/pod-configmap-envFrom.yaml" >}}

 Créez le pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
 ```

 Maintenant, la sortie du Pod comprend les variables d'environnement `SPECIAL_LEVEL=very` et `SPECIAL_TYPE=charm`.

## Utiliser des variables d'environnement définies par ConfigMap dans les commandes du Pod

Vous pouvez utiliser des variables d'environnement définies par ConfigMap dans la section `command` de la spécification du Pod en utilisant la syntaxe de substitution Kubernetes `$(VAR_NAME)`.

Par exemple, la spécification de pod suivante

{{< codenew file="pods/pod-configmap-env-var-valueFrom.yaml" >}}

créé en exécutant

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

produit la sortie suivante dans le conteneur `test-container`:

```shell
very charm
```

## Ajouter des données ConfigMap à un volume

Comme expliqué dans [Créer des ConfigMaps à partir de fichiers](#create-configmaps-from-files), lorsque vous créez un ConfigMap à l'aide `--from-file`, le nom de fichier devient une clé stockée dans la section `data` du ConfigMap.
Le contenu du fichier devient la valeur de la clé.

Les exemples de cette section se réfèrent à un ConfigMap nommé special-config, illustré ci-dessous.

{{< codenew file="configmap/configmap-multikeys.yaml" >}}

Créez le ConfigMap:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### Remplissez un volume avec des données stockées dans un ConfigMap

Ajoutez le nom ConfigMap sous la section `volumes` de la spécification Pod.
Ceci ajoute les données ConfigMap au répertoire spécifié comme `volumeMounts.mountPath` (dans ce cas, `/etc/config`).
La section `command` répertorie les fichiers de répertoire dont les noms correspondent aux clés de ConfigMap.

{{< codenew file="pods/pod-configmap-volume.yaml" >}}

Créez le pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

Lorsque le pod s'exécute, la commande `ls /etc/config/` produit la sortie ci-dessous:

```shell
SPECIAL_LEVEL
SPECIAL_TYPE
```

{{< caution >}}
S'il y a des fichiers dans le dossier `/etc/config/`, ils seront supprimés.
{{< /caution >}}

### Add ConfigMap data to a specific path in the Volume

Use the `path` field to specify the desired file path for specific ConfigMap items.
In this case, the `SPECIAL_LEVEL` item will be mounted in the `config-volume` volume at `/etc/config/keys`.

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

Create the Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

When the pod runs, the command `cat /etc/config/keys` produces the output below:

```shell
very
```

{{< caution >}}
Like before, all previous files in the `/etc/config/` directory will be deleted.
{{< /caution >}}

### Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) user guide explains the syntax.

### Mounted ConfigMaps are updated automatically

When a ConfigMap already being consumed in a volume is updated, projected keys are eventually updated as well. Kubelet is checking whether the mounted ConfigMap is fresh on every periodic sync. However, it is using its local ttl-based cache for getting the current value of the ConfigMap. As a result, the total delay from the moment when the ConfigMap is updated to the moment when new keys are projected to the pod can be as long as kubelet sync period (1 minute by default) + ttl of ConfigMaps cache (1 minute by default) in kubelet. You can trigger an immediate refresh by updating one of the pod's annotations.

{{< note >}}
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes/#using-subpath) volume will not receive ConfigMap updates.
{{< /note >}}

{{% /capture %}}

{{% capture discussion %}}

## Understanding ConfigMaps and Pods

The ConfigMap API resource stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in ConfigMap.

{{< note >}}
ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as representing something similar to the Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.
{{< /note >}}

The ConfigMap's `data` field contains the configuration data. As shown in the example below, this can be simple -- like individual properties defined using `--from-literal` -- or complex -- like configuration files or JSON blobs defined using `--from-file`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # example of a simple property defined using --from-literal
  example.property.1: hello
  example.property.2: world
  # example of a complex property defined using --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

### Restrictions

* You must create a ConfigMap before referencing it in a Pod specification (unless you mark the ConfigMap as "optional").
  If you reference a ConfigMap that doesn't exist, the Pod won't start.
  Likewise, references to keys that don't exist in the ConfigMap will prevent the pod from starting.

* If you use `envFrom` to define environment variables from ConfigMaps, keys that are considered invalid will be skipped.
  The pod will be allowed to start, but the invalid names will be recorded in the event log (`InvalidVariableNames`).
  The log message lists each skipped key.
  For example:

  ```shell
  kubectl get events
  ```

  The output is similar to this:
  
  ```text
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

* ConfigMaps reside in a specific {{< glossary_tooltip term_id="namespace" >}}.
  A ConfigMap can only be referenced by pods residing in the same namespace.

* You can't use ConfigMaps for {{< glossary_tooltip text="static pods" term_id="static-pod" >}}, because the Kubelet does not support this.

{{% /capture %}}

{{% capture whatsnext %}}

* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).

{{% /capture %}}
