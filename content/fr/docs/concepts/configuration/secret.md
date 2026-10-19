---
title: Secrets
content_type: concept
feature:
  title: Gestion du secret et de la configuration
  description: >
    Déployez et mettez à jour les secrets et la configuration des applications sans reconstruire votre image et sans dévoiler les secrets de la configuration de vos applications.
weight: 50
---


<!-- overview -->

Les objets `secret` de Kubernetes vous permettent de stocker et de gérer des informations sensibles, telles que les mots de passe, les jetons OAuth et les clés ssh.
Mettre ces informations dans un `secret` est plus sûr et plus flexible que de le mettre en dur dans la définition d'un {{< glossary_tooltip term_id="pod" >}} ou dans une {{< glossary_tooltip text="container image" term_id="image" >}}.
Voir [Document de conception des secrets](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/secrets.md) pour plus d'informations.



<!-- body -->

## Présentation des secrets

Un secret est un objet qui contient une petite quantité de données sensibles telles qu'un mot de passe, un jeton ou une clé.
De telles informations pourraient autrement être placées dans une spécification de pod ou dans une image; le placer dans un objet secret permet de mieux contrôler la façon dont il est utilisé et réduit le risque d'exposition accidentelle.

Les utilisateurs peuvent créer des secrets et le système crée également des secrets.

Pour utiliser un secret, un pod doit référencer le secret.
Un secret peut être utilisé avec un pod de deux manières: sous forme de fichiers dans un {{< glossary_tooltip text="volume" term_id="volume" >}} monté sur un ou plusieurs de ses conteneurs, ou utilisé par kubelet lorsque vous récupérez des images pour le pod.

### Secrets intégrés

#### Les comptes de service créent et attachent automatiquement des secrets avec les informations d'identification de l'API

Kubernetes crée automatiquement des secrets qui contiennent des informations d'identification pour accéder à l'API et il modifie automatiquement vos pods pour utiliser ce type de secret.

La création et l'utilisation automatiques des informations d'identification de l'API peuvent être désactivées ou remplacées si vous le souhaitez.
Cependant, si tout ce que vous avez à faire est d'accéder en toute sécurité à l'apiserver, il s'agit de la méthode recommandée.

Voir la documentation des [Compte de service](/docs/tasks/configure-pod-container/configure-service-account/) pour plus d'informations sur le fonctionnement des comptes de service.

### Créer vos propres secrets

#### Créer un secret avec kubectl create secret

Supposons que certains pods doivent accéder à une base de données.
Le nom d'utilisateur et le mot de passe que les pods doivent utiliser se trouvent dans les fichiers `./username.txt` et `./password.txt` sur votre machine locale.

```shell
# Create files needed for rest of example.
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

La commande `kubectl create secret` regroupe ces fichiers dans un secret et crée l'objet sur l'Apiserver.

```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```

```text
secret "db-user-pass" created
```

{{< note >}}
Les caractères spéciaux tels que `$`, `\`, `*`, et `!` seront interprétés par votre [shell](https://en.wikipedia.org/wiki/Shell_\(computing\)) et nécessitent d'être échappés.
Dans les shells les plus courants, le moyen le plus simple d'échapper au mot de passe est de l'entourer de guillemets simples (`'`).
Par exemple, si votre mot de passe réel est `S!B\*d$zDsb`, vous devez exécuter la commande de cette façon:

```text
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb'
```

Vous n'avez pas besoin d'échapper les caractères spéciaux dans les mots de passe des fichiers (`--from-file`).
{{< /note >}}

Vous pouvez vérifier que le secret a été créé comme ceci:

```shell
kubectl get secrets
```

```text
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

```text
kubectl describe secrets/db-user-pass
```

```text
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

{{< note >}}
`kubectl get` et `kubectl describe` évitent d'afficher le contenu d'un secret par défaut.
Il s'agit de protéger le secret contre une exposition accidentelle à un spectateur de l'écran ou contre son stockage dans un journal de terminal.
{{< /note >}}

Voir [décoder un secret](#decoding-a-secret) pour voir le contenu d'un secret.

#### Création manuelle d'un secret

Vous pouvez également créer un secret dans un fichier d'abord, au format json ou yaml, puis créer cet objet.
Le [secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core) contient deux table de hachage: `data` et `stringData`.
Le champ `data` est utilisé pour stocker des données arbitraires, encodées en base64.
Le champ `stringData` est fourni pour plus de commodité et vous permet de fournir des données secrètes sous forme de chaînes non codées.

Par exemple, pour stocker deux chaînes dans un secret à l'aide du champ `data`, convertissez-les en base64 comme suit:

```shell
echo -n 'admin' | base64
YWRtaW4=
echo -n '1f2d1e2e67df' | base64
MWYyZDFlMmU2N2Rm
```

Écrivez un secret qui ressemble à ceci:

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

Maintenant, créez le secret en utilisant [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

```text
kubectl apply -f ./secret.yaml
```

```text
secret "mysecret" created
```

Pour certains scénarios, vous pouvez utiliser le champ `stringData` à la place.
Ce champ vous permet de mettre une chaîne non codée en base64 directement dans le secret, et la chaîne sera codée pour vous lorsque le secret sera créé ou mis à jour.

Un exemple pratique de cela pourrait être le suivant: vous déployez une application qui utilise un secret pour stocker un fichier de configuration.
Vous souhaitez remplir des parties de ce fichier de configuration pendant votre processus de déploiement.

Si votre application utilise le fichier de configuration suivant:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

Vous pouvez stocker cela dans un secret en utilisant ce qui suit:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: {{username}}
    password: {{password}}
```

Votre outil de déploiement pourrait alors remplacer les variables de modèle `{{username}}` et `{{password}}` avant d'exécuter `kubectl apply`.

`stringData` est un champ de commodité en écriture seule.
Il n'est jamais affiché lors de la récupération des secrets.
Par exemple, si vous exécutez la commande suivante:

```text
kubectl get secret mysecret -o yaml
```

La sortie sera similaire à:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
```

Si un champ est spécifié à la fois dans `data` et `stringData`, la valeur de `stringData` est utilisée.
Par exemple, la définition de secret suivante:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrateur
```

Donnera le secret suivant:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
data:
  username: YWRtaW5pc3RyYXRldXI=
```

Où `YWRtaW5pc3RyYXRldXI=` décode en `administrateur`.

Les clés de `data` et `stringData` doivent être composées de caractères alphanumériques, '-', '_' ou '.'.

**Encoding Note:** Les valeurs JSON et YAML sérialisées des données secrètes sont codées sous forme de chaînes base64.
Les sauts de ligne ne sont pas valides dans ces chaînes et doivent être omis.
Lors de l'utilisation de l'utilitaire `base64` sur Darwin / macOS, les utilisateurs doivent éviter d'utiliser l'option `-b` pour diviser les longues lignes.
Inversement, les utilisateurs Linux *devraient* ajouter l'option `-w 0` aux commandes `base64` ou le pipeline `base64 | tr -d '\ n'` si l'option `-w` n'est pas disponible.

#### Création d'un secret à partir du générateur

Kubectl prend en charge [la gestion des objets à l'aide de Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/) depuis 1.14.
Avec cette nouvelle fonctionnalité, vous pouvez également créer un secret à partir de générateurs, puis l'appliquer pour créer l'objet sur l'Apiserver.
Les générateurs doivent être spécifiés dans un `kustomization.yaml` à l'intérieur d'un répertoire.

Par exemple, pour générer un secret à partir des fichiers `./username.txt` et `./password.txt`

```shell
# Create a kustomization.yaml file with SecretGenerator
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```

Appliquez le répertoire de personnalisation pour créer l'objet secret.

```text
$ kubectl apply -k .
secret/db-user-pass-96mffmfh4k created
```

Vous pouvez vérifier que le secret a été créé comme ceci:

```text
$ kubectl get secrets
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s

$ kubectl describe secrets/db-user-pass-96mffmfh4k
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

Par exemple, pour générer un secret à partir des littéraux `username=admin` et `password=secret`, vous pouvez spécifier le générateur de secret dans `kustomization.yaml` comme:

```shell
# Create a kustomization.yaml file with SecretGenerator
$ cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```

Appliquer le repertoire kustomization pour créer l'objet secret.

```shell
$ kubectl apply -k .
secret/db-user-pass-dddghtt9b5 created
```

{{< note >}}
Le nom des secrets généré a un suffixe ajouté en hachant le contenu.
Cela garantit qu'un nouveau secret est généré chaque fois que le contenu est modifié.
{{< /note >}}

#### Décoder un secret

Les secrets peuvent être récupérés via la command `kubectl get secret`.
Par exemple, pour récupérer le secret créé dans la section précédente:

```shell
kubectl get secret mysecret -o yaml
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Décodez le champ du mot de passe:

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

```text
1f2d1e2e67df
```

#### Modification d'un secret

Un secret existant peut être modifié avec la commande suivante:

```text
kubectl edit secrets mysecret
```

Cela ouvrira l'éditeur configuré par défaut et permettra de mettre à jour les valeurs secrètes codées en base64 dans le champ `data`:

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: { ... }
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
```

## Utiliser les secrets

Les secrets peuvent être montés en tant que volumes de données ou être exposés en tant que {{< glossary_tooltip text="variables d'environnement" term_id="container-env-variables" >}} à utiliser par un conteneur dans un Pod.
Ils peuvent également être utilisés par d'autres parties du système, sans être directement exposés aux Pods.
Par exemple, ils peuvent détenir des informations d'identification que d'autres parties du système doivent utiliser pour interagir avec des systèmes externes en votre nom.

### Utilisation de secrets comme fichiers d'un pod

Pour consommer un secret dans un volume dans un pod:

1. Créez un secret ou utilisez-en un déjà existant.
   Plusieurs Pods peuvent référencer le même secret.
1. Modifiez la définition de votre Pod pour ajouter un volume sous `.spec.volumes[]`.
   Nommez le volume et ayez un champ `.spec.volumes[].secret.secretName` égal au nom de l'objet secret.
1. Ajouter un `.spec.containers[].volumeMounts[]` à chaque conteneur qui a besoin du secret.
   Spécifier `.spec.containers[].volumeMounts[].readOnly = true` et `.spec.containers[].volumeMounts[].mountPath` à un nom de répertoire inutilisé où vous souhaitez que les secrets apparaissent.
1. Modifiez votre image et/ou votre ligne de commande pour que le programme recherche les fichiers dans ce répertoire.
   Chaque clé de la carte secrète `data` devient le nom de fichier sous `mountPath`.

Voici un exemple de pod qui monte un secret dans un volume:

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
```

Chaque secret que vous souhaitez utiliser doit être mentionné dans `.spec.volumes`.

S'il y a plusieurs conteneurs dans le pod, alors chaque conteneur a besoin de son propre bloc `volumeMounts`, mais un seul `.spec.volumes` est nécessaire par secret.

Vous pouvez regrouper de nombreux fichiers en un seul secret ou utiliser de nombreux secrets, selon le cas.

### Projection de clés secrètes vers des chemins spécifiques

Nous pouvons également contrôler les chemins dans le volume où les clés secrètes sont projetées.
Vous pouvez utiliser le champ `.spec.volumes []. Secret.items` pour changer le chemin cible de chaque clé:

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

Que se passera-t-il:

* `username` est stocké dans le fichier `/etc/foo/my-group/my-username` au lieu de `/etc/foo/username`.
* `password` n'est pas projeté

Si `.spec.volumes[].secret.items` est utilisé, seules les clés spécifiées dans `items` sont projetées.
Pour consommer toutes les clés du secret, toutes doivent être répertoriées dans le champ `items`.
Toutes les clés répertoriées doivent exister dans le secret correspondant.
Sinon, le volume n'est pas créé.

### Autorisations de fichiers secrets

Vous pouvez également spécifier les bits de mode d'autorisation des fichiers contenant les parties d'un secret.
Si vous n'en spécifiez pas, `0644` est utilisé par défaut.
Vous pouvez spécifier un mode par défaut pour tout le volume secret et remplacer par clé si nécessaire.

Par exemple, vous pouvez spécifier un mode par défaut comme celui-ci:

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
      defaultMode: 256
```

Ensuite, le secret sera monté sur `/etc/foo` et tous les fichiers créés par le montage de volume secret auront la permission `0400`.

Notez que la spécification JSON ne prend pas en charge la notation octale, utilisez donc la valeur 256 pour les autorisations 0400.
Si vous utilisez yaml au lieu de json pour le pod, vous pouvez utiliser la notation octale pour spécifier les autorisations de manière plus naturelle.

Vous pouvez aussi utiliser un mapping, comme dans l'exemple précédent, et spécifier des autorisations différentes pour différents fichiers comme celui-ci:

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
      items:
      - key: username
        path: my-group/my-username
        mode: 511
```

Dans ce cas, le fichier résultant `/etc/foo/my-group/my-username` aura la valeur d'autorisation de `0777`.
En raison des limitations JSON, vous devez spécifier le mode en notation décimale.

Notez que cette valeur d'autorisation peut être affichée en notation décimale si vous la lisez plus tard.

### Consommer des valeurs secrètes à partir de volumes

À l'intérieur du conteneur qui monte un volume secret, les clés secrètes apparaissent sous forme de fichiers et les valeurs secrètes sont décodées en base 64 et stockées à l'intérieur de ces fichiers.
C'est le résultat des commandes exécutées à l'intérieur du conteneur de l'exemple ci-dessus:

```shell
ls /etc/foo/
```

```text
username
password
```

```shell
cat /etc/foo/username
```

```text
admin
```

```shell
cat /etc/foo/password
```

```text
1f2d1e2e67df
```

Le programme dans un conteneur est responsable de la lecture des secrets des fichiers.

### Les secrets montés sont mis à jour automatiquement

Lorsqu'un secret déjà consommé dans un volume est mis à jour, les clés projetées sont finalement mises à jour également.
Kubelet vérifie si le secret monté est récent à chaque synchronisation périodique.
Cependant, il utilise son cache local pour obtenir la valeur actuelle du Secret.
Le type de cache est configurable à l'aide de le champ `ConfigMapAndSecretChangeDetectionStrategy` dans la structure [KubeletConfiguration](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/kubelet/config/v1beta1/types.go).
Il peut être soit propagé via watch (par défaut), basé sur ttl, ou simplement redirigé toutes les requêtes vers directement kube-apiserver.
Par conséquent, le délai total entre le moment où le secret est mis à jour et le moment où de nouvelles clés sont projetées sur le pod peut être aussi long que la période de synchronisation du kubelet + le délai de propagation du cache, où le délai de propagation du cache dépend du type de cache choisi (cela équivaut au delai de propagation du watch, ttl du cache, ou bien zéro).

{{< note >}}
Un conteneur utilisant un secret comme un volume [subPath](/docs/concepts/storage/volumes#using-subpath) monté ne recevra pas de mises à jour secrètes.
{{< /note >}}

### Utilisation de secrets comme variables d'environnement

Pour utiliser un secret dans une {{< glossary_tooltip text="variable d'environnement" term_id="container-env-variables" >}} dans un pod:

1. Créez un secret ou utilisez-en un déjà existant.
   Plusieurs pods peuvent référencer le même secret.
1. Modifiez la définition de votre pod dans chaque conteneur où vous souhaitez utiliser la valeur d'une clé secrète pour ajouter une variable d'environnement pour chaque clé secrète que vous souhaitez consommer.
   La variable d'environnement qui consomme la clé secrète doit remplir le nom et la clé du secret dans `env[].valueFrom.secretKeyRef`.
1. Modifiez votre image et/ou votre ligne de commande pour que le programme recherche des valeurs dans les variables d'environnement spécifiées

Voici un exemple de pod qui utilise des secrets de variables d'environnement:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```

### Consommation de valeurs secrètes à partir de variables d'environnement

À l'intérieur d'un conteneur qui consomme un secret dans des variables d'environnement, les clés secrètes apparaissent comme des variables d'environnement normales contenant les valeurs décodées en base64 des données secrètes.
C'est le résultat des commandes exécutées à l'intérieur du conteneur de l'exemple ci-dessus:

```shell
echo $SECRET_USERNAME
```

```text
admin
```

```shell
echo $SECRET_PASSWORD
```

```text
1f2d1e2e67df
```

### Utilisation des imagePullSecrets

Un `imagePullSecret` est un moyen de transmettre un secret qui contient un mot de passe de registre d'images Docker (ou autre) au Kubelet afin qu'il puisse extraire une image privée au nom de votre Pod.

#### Spécification manuelle d'une imagePullSecret

L'utilisation de `imagePullSecrets` est décrite dans la [documentation des images](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)

### Arranging for imagePullSecrets to be Automatically Attached

Vous pouvez créer manuellement un `imagePullSecret` et le référencer à partir d'un `serviceAccount`.
Tous les pods créés avec ce `serviceAccount` ou cette valeur par défaut pour utiliser ce `serviceAccount`, verront leur champ `imagePullSecret` défini sur celui du compte de service.
Voir [Ajouter ImagePullSecrets à un compte de service](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) pour une explication détaillée de ce processus.

### Montage automatique de secrets créés manuellement

Les secrets créés manuellement (par exemple, un contenant un jeton pour accéder à un compte github) peuvent être automatiquement associés aux pods en fonction de leur compte de service.
Voir [Injection d'informations dans des pods à l'aide d'un PodPreset](/docs/tasks/inject-data-application/podpreset/) pour une explication détaillée de ce processus.

## Details

### Restrictions

Les sources de volume secrètes sont validées pour garantir que la référence d'objet spécifiée pointe réellement vers un objet de type Secret.
Par conséquent, un secret doit être créé avant tous les pods qui en dépendent.

Les objets API secrets résident dans un {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
Ils ne peuvent être référencés que par des pods dans le même espace de noms.

Les secrets individuels sont limités à 1 Mo de taille.
C'est pour décourager la création de très grands secrets qui épuiseraient la mémoire de l'apiserver et du kubelet.
Cependant, la création de nombreux petits secrets pourrait également épuiser la mémoire.
Des limites plus complètes sur l'utilisation de la mémoire en raison de secrets sont une fonctionnalité prévue.

Kubelet prend uniquement en charge l'utilisation des secrets pour les pods qu'il obtient du serveur API.
Cela inclut tous les pods créés à l'aide de kubectl, ou indirectement via un contrôleur de réplication.
Il n'inclut pas les pods créés via les drapeaux kubelet `--manifest-url`, ou `--config`, ou son API REST (ce ne sont pas des moyens courants de créer des Pods).

Les secrets doivent être créés avant d'être consommés dans les pods en tant que variables d'environnement, sauf s'ils sont marqués comme facultatifs.
Les références à des secrets qui n'existent pas empêcheront le pod de démarrer.

Les références via `secretKeyRef` à des clés qui n'existent pas dans un Secret nommé empêcheront le pod de démarrer.

Les secrets utilisés pour remplir les variables d'environnement via `envFrom` qui ont des clés considérées comme des noms de variables d'environnement non valides verront ces clés ignorées.
Le pod sera autorisé à démarrer.
Il y aura un événement dont la raison est `InvalidVariableNames` et le message contiendra la liste des clés invalides qui ont été ignorées.
L'exemple montre un pod qui fait référence au / mysecret par défaut qui contient 2 clés invalides, 1badkey et 2alsobad.

```shell
kubectl get events
```

```text
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```

### Cycle de vie de l'intéraction Secret et Pod

Lorsqu'un pod est créé via l'API, il n'est pas vérifié s'il existe un secret référencé.
Une fois qu'un pod est programmé, le kubelet tentera de récupérer la valeur secrète.
Si le secret ne peut pas être récupéré parce qu'il n'existe pas ou en raison d'un manque temporaire de connexion au serveur API, kubelet réessayera périodiquement.
Il rapportera un événement sur le pod expliquant la raison pour laquelle il n'a pas encore démarré.
Une fois le secret récupéré, le kubelet créera et montera un volume le contenant.
Aucun des conteneurs du pod ne démarre tant que tous les volumes du pod ne sont pas montés.

## Cas d'utilisation

### Cas d'utilisation: pod avec clés SSH

Créez un kustomization.yaml avec un `SecretGenerator` contenant quelques clés SSH:

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

```text
secret "ssh-key-secret" created
```

{{< caution >}}
Réfléchissez bien avant d'envoyer vos propres clés SSH: d'autres utilisateurs du cluster peuvent avoir accès au secret.
Utilisez un compte de service que vous souhaitez rendre accessible à tous les utilisateurs avec lesquels vous partagez le cluster Kubernetes et que vous pouvez révoquer s'ils sont compromis.
{{< /caution >}}

Nous pouvons maintenant créer un pod qui référence le secret avec la clé SSH et le consomme dans un volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

Lorsque la commande du conteneur s'exécute, les morceaux de la clé seront disponibles dans:

```shell
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

Le conteneur est alors libre d'utiliser les données secrètes pour établir une connexion SSH.

### Cas d'utilisation: pods avec informations d'identification de prod/test

Faites un fichier kustomization.yaml avec un SecretGenerator.

Cet exemple illustre un Pod qui consomme un secret contenant des informations d'identification de prod et un autre Pod qui consomme un secret avec des informations d'identification d'environnement de test.

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

```text
secret "prod-db-secret" created
```

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```

```text
secret "test-db-secret" created
```

{{< note >}}
Caractères spéciaux tels que `$`, `\`, `*`, et `!` seront interprétés par votre [shell](https://en.wikipedia.org/wiki/Shell_\(computing\)) et nécessitent d'être échappés.
Dans les shells les plus courants, le moyen le plus simple d'échapper au mot de passe est de l'entourer de guillemets simples (`'`).
Par exemple, si votre mot de passe réel est `S!B\*d$zDsb`, vous devez exécuter la commande de cette façon:

```text
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb'
```

Vous n'avez pas besoin d'échapper les caractères spéciaux dans les mots de passe des fichiers (`--from-file`).
{{< /note >}}

Maintenant, faites les pods:

```shell
$ cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

Ajoutez les pods à la même kustomization.yaml

```shell
$ cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

Appliquez tous ces objets sur l'Apiserver avec

```shell
kubectl apply -k .
```

Les deux conteneurs auront les fichiers suivants présents sur leurs systèmes de fichiers avec les valeurs pour l'environnement de chaque conteneur:

```shell
/etc/secret-volume/username
/etc/secret-volume/password
```

Notez comment les spécifications pour les deux pods ne diffèrent que dans un champ; cela facilite la création de pods avec différentes capacités à partir d'un template de pod commun.

Vous pouvez encore simplifier la spécification du pod de base en utilisant deux comptes de service: un appelé, disons, `prod-user` avec le secret `prod-db-secret`, et un appelé, `test-user` avec le secret `test-db-secret`.
Ensuite, la spécification du pod peut être raccourcie, par exemple:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### Cas d'utilisation: Dotfiles dans un volume secret

Afin de masquer des données (c'est-à-dire dans un fichier dont le nom commence par un point), il suffit de faire commencer cette clé par un point.
Par exemple, lorsque le secret suivant est monté dans un volume:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: registry.k8s.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

Le `secret-volume` contiendra un seul fichier, appelé `.secret-file`, et le `dotfile-test-container` aura ce fichier présent au chemin `/etc/secret-volume/.secret-file`.

{{< note >}}
Les fichiers commençant par des points sont masqués de la sortie de `ls -l`; vous devez utiliser `ls -la` pour les voir lors de la liste du contenu du répertoire.
{{< /note >}}

### Cas d'utilisation: secret visible pour un conteneur dans un pod

Envisagez un programme qui doit gérer les requêtes HTTP, effectuer une logique métier complexe, puis signer certains messages avec un HMAC.
Parce qu'il a une logique d'application complexe, il pourrait y avoir un exploit de lecture de fichier à distance inaperçu dans le serveur, qui pourrait exposer la clé privée à un attaquant.

Cela pourrait être divisé en deux processus dans deux conteneurs: un conteneur frontal qui gère l'interaction utilisateur et la logique métier, mais qui ne peut pas voir la clé privée; et un conteneur de signataire qui peut voir la clé privée, et répond aux demandes de signature simples du frontend (par exemple sur le réseau localhost).

Avec cette approche partitionnée, un attaquant doit maintenant inciter le serveur d'applications à faire quelque chose d'assez arbitraire, ce qui peut être plus difficile que de lui faire lire un fichier.

<!-- TODO: explain how to do this while still using automation. -->

## Les meilleures pratiques

### Clients qui utilisent l'API secrets

Lors du déploiement d'applications qui interagissent avec l'API secrets, l'accès doit être limité à l'aide de [politiques d'autorisation](/docs/reference/access-authn-authz/authorization/) telles que [RBAC](/docs/reference/access-authn-authz/rbac/).

Les secrets contiennent souvent des valeurs qui couvrent un spectre d'importance, dont beaucoup peuvent provoquer des escalades au sein de Kubernetes (par exemple, les jetons de compte de service) et vers les systèmes externes.
Même si une application individuelle peut raisonner sur la puissance des secrets avec lesquels elle s'attend à interagir, d'autres applications dans le même namespace peuvent rendre ces hypothèses invalides.

Pour ces raisons, les requêtes `watch` et `list` pour les secrets dans un namespace sont des capacités extrêmement puissantes et doivent être évitées, puisque la liste des secrets permet aux clients d'inspecter les valeurs de tous les secrets qui se trouvent dans ce namespace.
La capacité à effectuer un `watch` ou `list` des secrets dans un cluster doit être réservé uniquement aux composants les plus privilégiés au niveau du système.

Les applications qui ont besoin d'accéder à l'API secrets doivent effectuer des requêtes `get` sur les secrets dont elles ont besoin.
Cela permet aux administrateurs de restreindre l'accès à tous les secrets tout en donnant [accès en liste blanche aux instances individuelles](/docs/reference/access-authn-authz/rbac/#referring-to-resources) dont l'application a besoin.

Pour des performances améliorées sur une boucle `get`, les clients peuvent concevoir des ressources qui font référence à un secret puis `watch` la ressource, demandant à nouveau le secret lorsque la ressource change.
De plus, un ["bulk watch" API](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/bulk_watch.md) laisse les clients `watch` des ressources individuelles ont également été proposées et seront probablement disponibles dans les prochaines versions de Kubernetes.

## Propriétés de sécurité

### Protections

Étant donné que les objets secrets peuvent être créés indépendamment des Pods qui les utilisent, il y a moins de risques que le secret soit exposé pendant la création, la visualisation et la modification des Pods.
Le système peut également prendre des précautions supplémentaires avec les objets secrets, comme éviter de les écrire sur le disque lorsque cela est possible.

Un secret n'est envoyé à un nœud que si un module sur ce nœud l'exige.
Kubelet stocke le secret dans un `tmpfs` afin que le secret ne soit pas écrit sur le stockage sur disque.
Une fois que le pod qui dépend du secret est supprimé, kubelet supprimera également sa copie locale des données secrètes.

Il peut y avoir des secrets pour plusieurs pods sur le même nœud.
Cependant, seuls les secrets qu'un pod demande sont potentiellement visibles dans ses conteneurs.
Par conséquent, un pod n'a pas accès aux secrets d'un autre pod.

Il peut y avoir plusieurs conteneurs dans un pod.
Cependant, chaque conteneur d'un pod doit demander le volume secret dans ses `volumesMounts` pour qu'il soit visible dans le conteneur.
Cela peut être utilisé pour construire des [partitions de sécurité au niveau du pod](#use-case-secret-visible-to-one-container-in-a-pod).

Sur la plupart des distributions gérées par le projet Kubernetes, la communication entre l'utilisateur vers l'apiserver et entre l'apiserver et les kubelets est protégée par SSL/TLS.
Les secrets sont protégés lorsqu'ils sont transmis sur ces canaux.

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Vous pouvez activer le [chiffrement au repos](/docs/tasks/administer-cluster/encrypt-data/) pour les données secrètes, afin que les secrets ne soient pas stockés en clair dans {{< glossary_tooltip term_id="etcd" >}}.

### Risques

* Dans le serveur API, les données secrètes sont stockées dans {{< glossary_tooltip term_id="etcd" >}}; par conséquent:
  * Les administrateurs doivent activer le chiffrement au repos pour les données du cluster (nécessite la version 1.13 ou ultérieure)
  * Les administrateurs devraient limiter l'accès à etcd aux utilisateurs administrateurs
  * Les administrateurs peuvent vouloir effacer/détruire les disques utilisés par etcd lorsqu'ils ne sont plus utilisés
  * Si vous exécutez etcd dans un cluster, les administrateurs doivent s'assurer d'utiliser SSL/TLS pour la communication peer-to-peer etcd.
* Si vous configurez le secret via un fichier manifeste (JSON ou YAML) qui a les données secrètes codées en base64, partager ce fichier ou l'archiver dans un dépot de source signifie que le secret est compromis.
  L'encodage Base64 _n'est pas_ une méthode de chiffrement, il est considéré comme identique au texte brut.
* Les applications doivent toujours protéger la valeur du secret après l'avoir lu dans le volume, comme ne pas le mettre accidentellement dans un journal ou le transmettre à une partie non fiable.
* Un utilisateur qui peut créer un pod qui utilise un secret peut également voir la valeur de ce secret.
  Même si la stratégie apiserver ne permet pas à cet utilisateur de lire l'objet secret, l'utilisateur peut créer un pod qui expose le secret.
* Actuellement, toute personne disposant des droit root sur n'importe quel nœud peut lire _n'importe quel_ secret depuis l'apiserver, en usurpant l'identité du kubelet.
  Il est prévu de n'envoyer des secrets qu'aux nœuds qui en ont réellement besoin, pour limiter l'impact d'un exploit root sur un seul nœud.

## {{% heading "whatsnext" %}}



