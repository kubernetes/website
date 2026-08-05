---
title: Récupération d'une image d'un registre privé
content_type: task
weight: 100
---

<!-- overview -->

Cette page montre comment créer un Pod qui utilise un Secret pour récupérer une image d'un registre privé.



## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Pour faire cet exercice, vous avez besoin d'un
[Docker ID](https://docs.docker.com/docker-id/) et un mot de passe.



<!-- steps -->

## Connectez-vous à Docker

Sur votre ordinateur, vous devez vous authentifier à un registre afin de récupérer une image privée :

```shell
docker login
```

Une fois que c'est fait, entrez votre nom d'utilisateur et votre mot de passe Docker.

Le processus de connexion crée ou met à jour un fichier `config.json` qui contient un token d'autorisation.

Consultez le fichier `config.json` :

```shell
cat ~/.docker/config.json
```

La sortie comporte une section similaire à celle-ci :

```json
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "c3R...zE2"
        }
    }
}
```

{{< note >}}
Si vous utilisez le credentials store de Docker, vous ne verrez pas cette entrée `auth` mais une entrée `credsStore` avec le nom du Store comme valeur. 
{{< /note >}}

## Créez un Secret basé sur les identifiants existants du Docker {#registry-secret-existing-credentials}

Le cluster Kubernetes utilise le type Secret de `docker-registry` pour s'authentifier avec
un registre de conteneurs pour y récupérer une image privée.

Si vous avez déjà lancé `docker login`, vous pouvez copier ces identifiants dans Kubernetes

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

Si vous avez besoin de plus de contrôle (par exemple, pour définir un Namespace ou un label sur le nouveau secret), vous pouvez alors personnaliser le secret avant de le stocker.
Assurez-vous de :

- Attribuer la valeur `.dockerconfigjson` dans le nom de l'élément data
- Encoder le fichier docker en base64 et colle cette chaîne, non interrompue, comme valeur du champ `data[".dockerconfigjson"]`. 
- Mettre `type` à `kubernetes.io/dockerconfigjson`.

Exemple:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
  namespace: awesomeapps
data:
  .dockerconfigjson: UmVhbGx5IHJlYWxseSByZWVlZWVlZWVlZWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGx5eXl5eXl5eXl5eXl5eXl5eXl5eSBsbGxsbGxsbGxsbGxsbG9vb29vb29vb29vb29vb29vb29vb29vb29vb25ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubmdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cgYXV0aCBrZXlzCg==
type: kubernetes.io/dockerconfigjson
```

Si vous obtenez le message d'erreur `error: no objects passed to create`, cela peut signifier que la chaîne encodée en base64 est invalide.
Si vous obtenez un message d'erreur comme `Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`, cela signifie que la chaîne encodée en base64 a été décodée avec succès, mais n'a pas pu être interprétée comme un fichier `.docker/config.json`.

## Créez un Secret en fournissant les identifiants sur la ligne de commande

Créez ce secret, en le nommant `regcred` :

```shell
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

où :

* `<your-registry-server>` est votre FQDN de registre de docker privé. (https://index.docker.io/v1/ for DockerHub)
* `<your-name>` est votre nom d'utilisateur Docker.
* `<your-pword>` est votre mot de passe Docker.
* `<your-email>` est votre email Docker.

Vous avez réussi à définir vos identifiants Docker dans le cluster comme un secret appelé `regcred`.

{{< note >}}
Saisir des secrets sur la ligne de commande peut les conserver dans l'historique de votre shell sans protection, et ces secrets peuvent également être visibles par d'autres utilisateurs sur votre ordinateur pendant l'exécution de `kubectl`.
{{< /note >}}


## Inspection du secret `regcred`

Pour comprendre le contenu du Secret `regcred` que vous venez de créer, commencez par visualiser le Secret au format YAML :

```shell
kubectl get secret regcred --output=yaml
```

La sortie est similaire à celle-ci :

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
  name: regcred
  ...
data:
  .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
type: kubernetes.io/dockerconfigjson
```

La valeur du champ `.dockerconfigjson` est une représentation en base64 de vos identifiants Docker.

Pour comprendre ce que contient le champ `.dockerconfigjson`, convertissez les données secrètes en un format lisible :

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

La sortie est similaire à celle-ci :

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

Pour comprendre ce qui se cache dans le champ `auth', convertissez les données encodées en base64 dans un format lisible :

```shell
echo "c3R...zE2" | base64 --decode
```

La sortie en tant que nom d'utilisateur et mot de passe concaténés avec un `:`, est similaire à ceci :

```none
janedoe:xxxxxxxxxxx
```

Remarquez que les données secrètes contiennent le token d'autorisation similaire à votre fichier local `~/.docker/config.json`.

Vous avez réussi à définir vos identifiants de Docker comme un Secret appelé `regcred` dans le cluster.

## Créez un Pod qui utilise votre Secret

Voici un fichier de configuration pour un Pod qui a besoin d'accéder à vos identifiants Docker dans `regcred` :

{{% codenew file="pods/private-reg-pod.yaml" %}}

Téléchargez le fichier ci-dessus :

```shell
wget -O my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

Dans le fichier `my-private-reg-pod.yaml`, remplacez `<your-private-image>` par le chemin d'accès à une image dans un registre privé tel que

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

Pour récupérer l'image du registre privé, Kubernetes a besoin des identifiants.
Le champ `imagePullSecrets` dans le fichier de configuration spécifie que Kubernetes doit obtenir les informations d'identification d'un Secret nommé `regcred`.

Créez un Pod qui utilise votre secret et vérifiez que le Pod est bien lancé :

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```



## {{% heading "whatsnext" %}}


* Pour en savoir plus sur les [Secrets](/docs/concepts/configuration/secret/).
* Pour en savoir plus sur l'[utilisation d'un registre privé](/docs/concepts/containers/images/#using-a-private-registry).
* Pour en savoir plus sur l'[ajout d'un imagePullSecrets à un compte de service](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* Voir [kubectl crée un Secret de registre de docker](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* Voir [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core).
* Voir le champ `imagePullSecrets` de [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).



