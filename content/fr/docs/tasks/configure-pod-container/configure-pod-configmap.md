---
title: Configurer un pod pour utiliser un ConfigMap
content_template: templates/task
weight: 150
card:
  name: tasks
  weight: 50
---

{{% capture overview %}}
Les ConfigMaps permettent de découpler les artefacts de configuration des contenus d'images pour que les applications conteneurisées restent portables. Cette page fournit une série d'exemples d'utilisation démontrant comment créer des ConfigMaps et configurer des pods en utilisant les données stockées dans les ConfigMaps.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}


## Créer une ConfigMap
Vous pouvez utiliser soit `kubectl create configmap`, soit un générateur de ConfigMap dans `kustomization.yaml` pour créer une ConfigMap. Notez que `kubectl` supporte `kustomization.yaml` depuis la version 1.14.

### Créer un ConfigMap en utilisant kubectl create configmap

Utilisez la commande `kubectl create configmap` pour créer des ConfigMaps à partir de [répertoires](#create-configmaps-from-directories), [fichiers](#create-configmaps-from-files), ou [valeurs littérales](#create-configmaps-from-literal-values):

```shell
kubectl create configmap <map-name> <data-source>
```

où \<map-name> est le nom que vous voulez attribuer à la ConfigMap et \<data-source> est le répertoire, le fichier ou la valeur littérale à partir de laquelle les données seront tirées.
Le nom d'un objet ConfigMap doit être un [nom de sous-domaine DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Lorsque vous créez une ConfigMap basée sur un fichier, la clé dans la section \<data-source> prend par défaut le nom de base du fichier, et la valeur prend par défaut le contenu du fichier.

Vous pouvez utiliser [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) ou
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) pour récupérer des informations à propos d'une ConfigMap.

#### Créer des ConfigMaps à partir de répertoires

Vous pouvez utiliser `kubectl create configmap` pour créer une ConfigMap à partir de plusieurs fichiers dans le même répertoire. Lorsque vous créez une ConfigMap basé sur un répertoire, kubectl identifie les fichiers dont le nom de base est une clé valide dans le répertoire et rassemble chacun de ces fichiers dans la nouvelle ConfigMap. Toutes les entrées de répertoire, à l'exception des fichiers ordinaires, sont ignorées (par exemple, les sous-répertoires, les liens symboliques, les périphériques, les tuyaux, etc.)

Par exemple :

```shell
# Créez un répertoire
mkdir -p configure-pod-container/configmap/

# Téléchargez les fichiers d'exemple dans le répertoire `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Créez la configmap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

La commande ci-dessus emballe chaque fichier. Dans notre cas, les deux fichiers `game.properties` et `ui.properties` du répertoire `configure-pod-container/configmap/` seront emballés dans la ConfigMap. Vous pouvez afficher les détails de la ConfigMap en utilisant la commande suivante :

```shell
kubectl describe configmaps game-config
```

Le résultat est similaire à celui-ci :
```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

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
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Les fichiers `game.properties` et `ui.properties` dans le répertoire `configure-pod-container/configmap/` sont présentés dans la section `data` de la ConfigMap.

```shell
kubectl get configmaps game-config -o yaml
```
Le résultat est similaire à celui-ci :

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

Vous pouvez utiliser `kubectl create configmap` pour créer une ConfigMap à partir d'un fichier individuel, ou de plusieurs fichiers.

Par exemple,

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

créerait la ConfigMap suivante :

```shell
kubectl describe configmaps game-config-2
```

où le résultat est similaire à celui-ci :

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

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
```

Vous pouvez passer plusieurs fois dans l'argument `--from-file` pour créer une ConfigMap à partir de plusieurs sources de données.

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

Vous pouvez afficher les détails du ConfigMap de `game-config-2` en utilisant la commande suivante :

```shell
kubectl describe configmaps game-config-2
```

Le résultat est similaire à celui-ci :

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

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
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Utilisez l'option `--from-env-file` pour créer une ConfigMap à partir d'un fichier d'environnement, par exemple :

```shell
# Les fichiers d'environnement contiennent une liste de variables d'environnement.
# Ces règles syntaxiques s'appliquent :
# Chaque ligne d'un fichier d'environnement doit être au format VAR=VAL.
# Les lignes commençant par # (c'est-à-dire les commentaires) sont ignorées.
# Les lignes vierges sont ignorées.
# Il n'y a pas de traitement spécial des guillemets (c'est-à-dire qu'ils feront partie de la valeur ConfigMap).

#Téléchargez les fichiers d'exemple dans le répertoire `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties

# Le fichier d'environnement `game-env-file.properties` ressemble à ceci
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# Ce commentaire et la ligne vide qui le précède sont ignorés
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

créerait la ConfigMap suivante :

```shell
kubectl get configmap game-config-env-file -o yaml
```

où le résultat est similaire à celui-ci :
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
Lorsque vous passez plusieurs fois le paramètre `--from-env-file` pour créer une ConfigMap à partir de plusieurs sources de données, seul le dernier fichier d'environnement est utilisé.
{{< /caution >}}

Le comportement consistant à passer plusieurs fois `--from-env-file` est démontré par :

```shell
# Téléchargez les fichiers d'exemple dans le répertoire `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Créer la configmap
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

créerait la ConfigMap suivante :

```shell
kubectl get configmap config-multi-env-files -o yaml
```

où le résultat est similaire à celui-ci :
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

#### Définir la clé à utiliser lors de la création d'une ConfigMap à partir d'un fichier

Vous pouvez définir une clé autre que le nom du fichier à utiliser dans la section `data` de votre ConfigMap lorsque vous utilisez l'argument `--from-file` :

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

où `<my-key-name>`  est la clé que vous voulez utiliser dans le ConfigMap et `<path-to-file>` est l'emplacement du fichier source de données que vous voulez que la clé représente.

Par exemple :

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

créerait la ConfigMap suivante :
```
kubectl get configmaps game-config-3 -o yaml
```

où le résultat est similaire à celui-ci :
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

Vous pouvez utiliser `kubectl create configmap` avec l'argument `--from-literal` pour définir une valeur littérale à partir de la ligne de commande :

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

Vous pouvez transmettre plusieurs paires clé-valeur. Chaque paire fournie sur la ligne de commande est représentée par une entrée séparée dans la section `data` du ConfigMap.

```shell
kubectl get configmaps special-config -o yaml
```

Le résultat est similaire à celui-ci :
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

### Créer une ConfigMap à partir d'un générateur
`kubectl` supporte `kustomization.yaml` depuis la version 1.14.
Vous pouvez également créer une ConfigMap à partir de générateurs et l'appliquer pour créer l'objet sur l'Apiserver. Les générateurs doivent être spécifiées dans un fichier `kustomization.yaml` à l'intérieur d'un répertoire.

#### Générer des ConfigMaps à partir de fichiers
Par exemple, pour générer une ConfigMap à partir des fichiers `configure-pod-container/configmap/game.properties`.
```shell
# Créez un fichier kustomization.yaml avec ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

Appliquez le répertoire de kustomization pour créer l'objet ConfigMap.
```shell
kubectl apply -k .
configmap/game-config-4-m9dm2f92bt created
```

Vous pouvez vérifier que la ConfigMap a été créé :

```shell
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

Notez que le nom ConfigMap généré a un suffixe ajouté en hachant le contenu. Cela garantit qu'une une nouvelle ConfigMap est générée à chaque fois que le contenu est modifié.

#### Définissez la clé à utiliser lors de la génération d'une ConfigMap à partir d'un fichier
Vous pouvez définir une clé autre que le nom du fichier à utiliser dans le générateur ConfigMap.
Par exemple, pour générer une ConfigMap à partir des fichiers `configure-pod-container/configmap/game.properties`, il faut définir une clé autre que le nom du fichier à utiliser dans le générateur de ConfigMap, par exemple `game-special-key`.

```shell
# Créer un fichier kustomization.yaml avec ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

Appliquez le répertoire kustomization pour créer l'objet ConfigMap.
```shell
kubectl apply -k .
configmap/game-config-5-m67dt67794 created
```

#### Générer des ConfigMaps à partir de littéraux
Pour générer une ConfigMap à partir des littéraux `special.type=charm` et `special.how=very`, vous pouvez spécifier le générateur de ConfigMap dans `kustomization.yaml` comme suit : 
```shell
# Créer un fichier kustomization.yaml avec ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```
Appliquez le répertoire kustomization pour créer l'objet ConfigMap.
```shell
kubectl apply -k .
configmap/special-config-2-c92b5mmcf2 created
```

## Définir les variables d'environnement des conteneurs à l'aide des données ConfigMap

### Définir une variable d'environnement de conteneur avec des données provenant d'une seule ConfigMap

1.  Définissez une variable d'environnement comme une paire clé-valeur dans une ConfigMap :

    ```shell
    kubectl create configmap special-config --from-literal=special.how=very
    ```

2.  Assignez la valeur `special.how` définie dans la ConfigMap à la variable d'environnement `SPECIAL_LEVEL_KEY` dans la spécification du pod.

   {{< codenew file="pods/pod-single-configmap-env-variable.yaml" >}}

   Créer le pod : 

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
 ```

   Maintenant, l'output du Pod comprend la variable d'environnement `SPECIAL_LEVEL_KEY=very`.

### Définissez les variables d'environnement du conteneur avec des données provenant de plusieurs ConfigMaps

 * Comme dans l'exemple précédent, créez d'abord les ConfigMaps.

   {{< codenew file="configmap/configmaps.yaml" >}}

   Créez la ConfigMap :

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
 ```

* Définissez les variables d'environnement dans la spécification Pod.

  {{< codenew file="pods/pod-multiple-configmap-env-variable.yaml" >}}

  Créez le Pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
 ```

   Maintenant, l'output du Pod comprend les variables d'environnement `SPECIAL_LEVEL_KEY=very` et `LOG_LEVEL=INFO`.

## Configurer toutes les paires clé-valeur dans une ConfigMap en tant que variables d'environnement de conteneur

{{< note >}}
Cette fonctionnalité est disponible dans Kubernetes v1.6 et ultérieures.
{{< /note >}}

* Créez une ConfigMap contenant plusieurs paires clé-valeur.

  {{< codenew file="configmap/configmap-multikeys.yaml" >}}

  Créez la ConfigMap :

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
 ```

* Utilisez `envFrom` pour définir toutes les données du ConfigMap comme des variables d'environnement de conteneur. La clé du ConfigMap devient le nom de la variable d'environnement dans le pod.

 {{< codenew file="pods/pod-configmap-envFrom.yaml" >}}

 Créez le pod :

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
 ```

 Maintenant, l'output du Pod comprend les variables d'environnement `SPECIAL_LEVEL=very` et `SPECIAL_TYPE=charm`.


## Utiliser les variables d'environnement définies par ConfigMap dans la sections command du pod

Vous pouvez utiliser les variables d'environnement définies par ConfigMap dans la section `command` de la spécification Pod en utilisant la syntaxe de substitution `$(VAR_NAME)` de Kubernetes.

Voici par exemple la spécification d'un pod

{{< codenew file="pods/pod-configmap-env-var-valueFrom.yaml" >}}

créé par l'exécution

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

produit le résultat suivant dans le conteneur `test-container` :

```shell
very charm
```

## Ajouter des données ConfigMap à un volume

Comme expliqué dans la section [Créer des ConfigMaps à partir de fichiers](#create-configmaps-from-files), lorsque vous créez une ConfigMap en utilisant ``--from-file``, le nom du fichier devient une clé stockée dans la section `data` de la ConfigMap. Le contenu du fichier devient la valeur de la clé.

Les exemples de cette section montrent une ConfigMap nommé special-config, illustré ci-dessous.

{{< codenew file="configmap/configmap-multikeys.yaml" >}}

Créez la ConfigMap :

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### Remplir un volume avec des données stockées dans une ConfigMap

Ajoutez le nom du ConfigMap sous la section `volumes` de la spécification Pod. 
Cela ajoute les données de ConfigMap au répertoire spécifié comme `volumeMounts.mountPath` (dans ce cas, `/etc/config`).
La section `command` énumère les fichiers de répertoire dont les noms correspondent aux clés de ConfigMap.

{{< codenew file="pods/pod-configmap-volume.yaml" >}}

Créez le pod :

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

Lorsque le pod fonctionne, la commande `ls /etc/config/` affiche le résultat ci-dessous :

```shell
SPECIAL_LEVEL
SPECIAL_TYPE
```

{{< caution >}}
S'il y a des fichiers dans le répertoire `/etc/config/`, ils seront supprimés.
{{< /caution >}}

### Ajouter les données ConfigMap à un chemin spécifique dans le volume

Utilisez le champ `path` pour spécifier le chemin d'accès au fichier souhaité pour des éléments spécifiques de ConfigMap.
Dans ce cas, l'élément `SPECIAL_LEVEL` sera monté dans le volume `config-volume` sur le chemin `/etc/config/keys`.

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

Créer le pod :

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

Lorsque le pod fonctionne, la commande `cat /etc/config/keys` donne le résultat suivant :

```shell
very
```

{{< caution >}}
Comme auparavant, tous les fichiers antérieurs dans le répertoire `/etc/config/` seront supprimés.
{{< /caution >}}

### Projeter des clés pour des chemins d'accès spécifiques et des autorisations de fichiers

Vous pouvez projeter les clés de chemins spécifiques et de permissions spécifiques pour chaque fichier. Le guide de l'utilisation des  [Secrets](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) explique la syntaxe.

### Les ConfigMaps montées sont mises à jour automatiquement

Lorsqu'une ConfigMap déjà sollicité par un volume est mis à jour, les clés projetées sont finalement mises à jour également. Le Kubelet vérifie si la ConfigMap monté est actualisé à chaque synchronisation périodique. Cependant, il utilise son cache local basé sur ttl pour obtenir la valeur actuelle du ConfigMap. En conséquence, le délai total entre le moment où la ConfigMap est mis à jour et le moment où de nouvelles clés sont projetées sur le pod peut être aussi long que la période de synchronisation kubelet (1 minute par défaut) + ttl du cache du ConfigMaps (1 minute par défaut). Vous pouvez déclencher un rafraîchissement immédiat en mettant à jour l'une des annotations du pod.

{{< note >}}
Un conteneur utilisant une ConfigMap comme un [subPath](/docs/concepts/storage/volumes/#using-subpath) ne recevra pas les mises à jour du ConfigMap.
{{< /note >}}

{{% /capture %}}

{{% capture discussion %}}

## Comprendre les ConfigMaps et les pods

La ressource API ConfigMap stocke les données de configuration sous forme de paires clé-valeur. Les données peuvent être consommées dans des pods ou fournir les configurations des composants du système tels que les contrôleurs. La ConfigMap est similaire aux [Secrets](/docs/concepts/configuration/secret/), mais permet de travailler avec des chaînes qui ne contiennent pas d'informations sensibles. Les utilisateurs et les composants du système peuvent stocker des données de configuration dans des ConfigMaps.

{{< note >}}
ConfigMaps doit référencer les fichiers de propriétés, et non les remplacer. Considérez que la ConfigMap représente quelque chose de similaire au répertoire `/etc` de Linux et à son contenu. Par exemple, si vous créez un [volume Kubernetes] (/docs/concepts/storage/volumes/) à partir d'une ConfigMap, chaque élément de données dans la ConfigMap est représenté par un fichier individuel dans le volume.
{{< /note >}}

Le champ `data` du ConfigMap contient les données de configuration. Comme le montre l'exemple ci-dessous, cela peut être simple -- comme des fichiers de propriétés individuelles définies à l'aide de `--from-literal` -- ou complexe -- comme des fichiers de configuration ou des blobs JSON définis à l'aide de `--from-file`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # exemple d'une propriété simple définie à l'aide de --from-literal
  example.property.1: hello
  example.property.2: world
  # exemple d'une propriété complexe définie à l'aide de --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

### Restrictions

- Vous devez créer une ConfigMap avant de la référencer dans une spécification de pod (sauf si vous marquez la ConfigMap comme "optionnelle"). Si vous référencez une ConfigMap qui n'existe pas, le pod ne démarrera pas. De même, les références à des clés qui n'existent pas dans la ConfigMap empêcheront le pod de se lancer.

- Si vous utilisez `envFrom` pour définir des variables d'environnement à partir de ConfigMaps, les clés qui sont considérées comme invalides seront ignorées. Le pod sera autorisé à démarrer, mais les noms invalides seront enregistrés dans le journal des événements (`InvalidVariableNames`). Le message du journal contient la liste de chaque clé ignorée. Par exemple :

   ```shell
   kubectl get events
   ```

    Le résultat est similaire à celui-ci :

   ```
   LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
   0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
   ```

- Les ConfigMaps résident dans un {{< glossary_tooltip term_id="namespace" >}} spécifique. Une ConfigMap ne peut être référencée que par des pods résidant dans le même espace de noms.

- Vous ne pouvez pas utiliser les ConfigMaps pour un {{< glossary_tooltip text="static pods" term_id="static-pod" >}}, car le Kubelet ne le prend pas en charge.

{{% /capture %}}

{{% capture whatsnext %}}
* Suivez l'exemple de [Configurer Redis en utilisant une ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).

{{% /capture %}}
