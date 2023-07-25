---
title: Configurer un pod pour utiliser une ConfigMap
content_template: templates/task
weight: 150
card:
  name: tasks
  weight: 50
---

<!-- overview -->

Les ConfigMaps vous permettent de découpler les artefacts de configuration du contenu de l'image pour garder les applications conteneurisées portables.
Cette page fournit une série d'exemples d'utilisation montrant comment créer des ConfigMaps et configurer des pods à l'aide des données stockées dans des ConfigMaps.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

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

### Ajouter un configmap à un chemin spécifique dans un volume

Utilisez le champ `path` pour spécifier le chemin de fichier souhaité pour les éléments de configmap spécifiques.
Dans ce cas, le `SPECIAL_LEVEL` sera monté dans le volume `config-volume` au chemin `/etc/config/keys`.

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

Créez le Pod :

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

Lorsque le pod fonctionne, la commande `cat /etc/config/keys` produit la sortie ci-dessous :

```shell
very
```

{{< caution >}}
Comme avant, tous les fichiers précédents dans le répertoire `/etc/config/` seront supprimés.
{{< /caution >}}

### Projections de clés pour des chemins et des autorisations de fichiers spécifiques

Vous pouvez projeter des clés vers des chemins spécifiques avec des autorisations spécifiques fichiers par fichiers.
Le guide de l'utilisateur [Secrets](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) explique la syntaxe.

### Les ConfigMaps montées sont mises à jour automatiquement

Lorsqu'une ConfigMap déjà consommée dans un volume est mise à jour, les clés projetées sont éventuellement mises à jour elles aussi.
Kubelet vérifie si la ConfigMap montée est fraîche à chaque synchronisation périodique.
Cependant, il utilise son cache local basé sur le ttl pour obtenir la valeur actuelle de la ConfigMap.
Par conséquent, le délai total entre le moment où la ConfigMap est mise à jour et le moment où les nouvelles clés sont projetées vers le pod peut être aussi long que la période de synchronisation de kubelet (1 minute par défaut) + le ttl du cache ConfigMaps (1 minute par défaut) dans kubelet.
Vous pouvez déclencher un rafraîchissement immédiat en mettant à jour l'une des annotations du pod.

{{< note >}}
Un conteneur utilisant un ConfigMap comme volume [subPath](/docs/concepts/storage/volumes/#using-subpath) ne recevra pas les mises à jour de ConfigMap.
{{< /note >}}

<!-- discussion -->

## Comprendre le lien entre les ConfigMaps et les Pods

La ressource API ConfigMap stocke les données de configuration sous forme de paires clé-valeur.
Les données peuvent être consommées dans des pods ou fournir les configurations des composants du système tels que les contrôleurs.
ConfigMap est similaire à [Secrets](/docs/concepts/configuration/secret/), mais fournit un moyen de travailler avec des chaînes de caractères qui ne contiennent pas d'informations sensibles.
Les utilisateurs comme les composants du système peuvent stocker des données de configuration dans un ConfigMap.

{{< note >}}
Les ConfigMaps doivent faire référence aux fichiers de propriétés, et non les remplacer.
Pensez à la ConfigMap comme représentant quelque chose de similaire au répertoire `/etc` de Linux et à son contenu.
Par exemple, si vous créez un [volume Kubernetes](/docs/concepts/storage/volumes/) à partir d'une ConfigMap, chaque élément de données de la ConfigMap est représenté par un fichier individuel dans le volume.
{{< /note >}}

Le champ `data` de la ConfigMap contient les données de configuration.
Comme le montre l'exemple ci-dessous, cela peut être simple -- comme des propriétés individuelles définies à l'aide de `--from-literal` -- ou complexe -- comme des fichiers de configuration ou des blobs JSON définis à l'aide de `--from-file`.

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

* Vous devez créer un ConfigMap avant de le référencer dans une spécification de Pod (sauf si vous marquez le ConfigMap comme "facultatif").
  Si vous faites référence à un ConfigMap qui n'existe pas, le Pod ne démarrera pas.
  De même, les références à des clés qui n'existent pas dans la ConfigMap empêcheront le pod de démarrer.

* Si vous utilisez `envFrom` pour définir des variables d'environnement à partir de ConfigMaps, les clés considérées comme invalides seront ignorées.
  Le pod sera autorisé à démarrer, mais les noms invalides seront enregistrés dans le journal des événements (`InvalidVariableNames`).
  Le message du journal énumère chaque clé sautée.
  Par exemple :

  ```shell
  kubectl get events
  ```

  Le résultat est similaire à celui-ci :
  
  ```text
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

* Les ConfigMaps résident dans un {{< glossary_tooltip term_id="namespace" >}}.
  Un ConfigMap ne peut être référencé que par des pods résidant dans le même namespace.

* Vous ne pouvez pas utiliser des ConfigMaps pour {{< glossary_tooltip text="static pods" term_id="static-pod" >}}, car le Kubelet ne le supporte pas.

{{% heading "whatsnext" %}}

* Suivez un exemple concret de [Configurer Redis en utilisant un ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
