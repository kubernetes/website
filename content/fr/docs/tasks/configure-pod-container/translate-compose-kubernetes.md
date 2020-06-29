---
title: Convertir un fichier Docker Compose en ressources Kubernetes
content_type: task
weight: 200
---

<!-- overview -->

C'est quoi Kompose ? C'est un outil de conversion de tout ce qui compose (notamment Docker Compose) en orchestrateurs de conteneurs (Kubernetes ou OpenShift).
Vous trouverez plus d'informations sur le site web de Kompose à [http://kompose.io](http:/kompose.io).



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Installer Kompose

Nous disposons de plusieurs façons d'installer Kompose. Notre méthode préférée est de télécharger le binaire de la dernière version de GitHub.

{{< tabs name="install_ways" >}}
{{% tab name="GitHub download" %}}

Kompose est publié via GitHub sur un cycle de trois semaines, vous pouvez voir toutes les versions actuelles sur [la page des releases de Github](https://github.com/kubernetes/kompose/releases).

```sh
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.16.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.16.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.16.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

Alternativement, vous pouvez télécharger le [tarball](https://github.com/kubernetes/kompose/releases).


{{% /tab %}}
{{% tab name="Build from source" %}}

L'installation en utilisant `go get` extrait de la branche master avec les derniers changements de développement.

```sh
go get -u github.com/kubernetes/kompose
```

{{% /tab %}}
{{% tab name="CentOS package" %}}

Kompose est dans le dépôt CentOS [EPEL](https://fedoraproject.org/wiki/EPEL).
Si vous n'avez pas le dépôt [EPEL](https://fedoraproject.org/wiki/EPEL) déjà installé et activé, vous pouvez le faire en lançant `sudo yum install epel-release`

Si vous avez [EPEL](https://fedoraproject.org/wiki/EPEL) activé dans votre système, vous pouvez installer Kompose comme n'importe quel autre logiciel.

```bash
sudo yum -y install kompose
```

{{% /tab %}}
{{% tab name="Fedora package" %}}

Kompose est dans les dépôts Fedora 24, 25 et 26. Vous pouvez l'installer comme n'importe quel autre paquetage.

```bash
sudo dnf -y install kompose
```

{{% /tab %}}
{{% tab name="Homebrew (macOS)" %}}

Sur macOS, vous pouvez installer la dernière version via [Homebrew](https://brew.sh):

```bash
brew install kompose

```
{{% /tab %}}
{{< /tabs >}}

## Utiliser Kompose

En quelques étapes, nous vous emmenons de Docker Compose à Kubernetes. Tous dont vous avez besoin est un fichier `docker-compose.yml`.

1.  Allez dans le répertoire contenant votre fichier `docker-compose.yml`. Si vous n'en avez pas, faites un test en utilisant celui-ci.

      ```yaml
      version: "2"

      services:

        redis-master:
          image: k8s.gcr.io/redis:e2e
          ports:
            - "6379"

        redis-slave:
          image: gcr.io/google_samples/gb-redisslave:v3
          ports:
            - "6379"
          environment:
            - GET_HOSTS_FROM=dns

        frontend:
          image: gcr.io/google-samples/gb-frontend:v4
          ports:
            - "80:80"
          environment:
            - GET_HOSTS_FROM=dns
          labels:
            kompose.service.type: LoadBalancer
      ```

2.  Lancez la commande `kompose up` pour déployer directement sur Kubernetes, ou passez plutôt à l'étape suivante pour générer un fichier à utiliser avec `kubectl`.

      ```bash
      $ kompose up
      We are going to create Kubernetes Deployments, Services and PersistentVolumeClaims for your Dockerized application.
      If you need different kind of resources, use the 'kompose convert' and 'kubectl apply -f' commands instead.

      INFO Successfully created Service: redis          
      INFO Successfully created Service: web            
      INFO Successfully created Deployment: redis       
      INFO Successfully created Deployment: web         

      Your application has been deployed to Kubernetes. You can run 'kubectl get deployment,svc,pods,pvc' for details.
      ```

3.  Pour convertir le fichier `docker-compose.yml` en fichiers que vous pouvez utiliser avec `kubectl`, lancez `kompose convert` et ensuite `kubectl apply -f <output file>`.

      ```bash
      $ kompose convert                           
      INFO Kubernetes file "frontend-service.yaml" created         
      INFO Kubernetes file "redis-master-service.yaml" created     
      INFO Kubernetes file "redis-slave-service.yaml" created      
      INFO Kubernetes file "frontend-deployment.yaml" created      
      INFO Kubernetes file "redis-master-deployment.yaml" created  
      INFO Kubernetes file "redis-slave-deployment.yaml" created   
      ```

      ```bash
      $ kubectl apply -f frontend-service.yaml,redis-master-service.yaml,redis-slave-service.yaml,frontend-deployment.yaml,redis-master-deployment.yaml,redis-slave-deployment.yaml
      service/frontend created
      service/redis-master created
      service/redis-slave created
      deployment.apps/frontend created
      deployment.apps/redis-master created
      deployment.apps/redis-slave created
      ```

      Vos déploiements fonctionnent sur Kubernetes.

4.  Accédez à votre application.

      Si vous utilisez déjà `minikube` pour votre processus de développement :

      ```bash
      $ minikube service frontend
      ```

      Sinon, regardons quelle IP votre service utilise !

      ```sh
      $ kubectl describe svc frontend
      Name:                   frontend
      Namespace:              default
      Labels:                 service=frontend
      Selector:               service=frontend
      Type:                   LoadBalancer
      IP:                     10.0.0.183
      LoadBalancer Ingress:   192.0.2.89
      Port:                   80      80/TCP
      NodePort:               80      31144/TCP
      Endpoints:              172.17.0.4:80
      Session Affinity:       None
      No events.

      ```

      Si vous utilisez un fournisseur de cloud computing, votre IP sera listée à côté de `LoadBalancer Ingress`.

      ```sh
      $ curl http://192.0.2.89
      ```



<!-- discussion -->

## Guide de l'utilisateur

- CLI
  - [`kompose convert`](#kompose-convert)
  - [`kompose up`](#kompose-up)
  - [`kompose down`](#kompose-down)
- Documentation
  - [Construire et pousser des images de docker](#build-and-push-docker-images)
  - [Conversions alternatives](#alternative-conversions)
  - [Etiquettes](#labels)
  - [Redémarrage](#restart)
  - [Les Versions de Docker Compose](#docker-compose-versions)

Kompose supporte deux fournisseurs : OpenShift et Kubernetes.
Vous pouvez choisir un fournisseur ciblé en utilisant l'option globale `--provider`. Si aucun fournisseur n'est spécifié, Kubernetes est défini par défaut.


## `kompose convert`

Kompose prend en charge la conversion des fichiers Docker Compose V1, V2 et V3 en objets Kubernetes et OpenShift.

### Kubernetes

```sh
$ kompose --file docker-voting.yml convert
WARN Unsupported key networks - ignoring
WARN Unsupported key build - ignoring
INFO Kubernetes file "worker-svc.yaml" created
INFO Kubernetes file "db-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "result-svc.yaml" created
INFO Kubernetes file "vote-svc.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
INFO Kubernetes file "result-deployment.yaml" created
INFO Kubernetes file "vote-deployment.yaml" created
INFO Kubernetes file "worker-deployment.yaml" created
INFO Kubernetes file "db-deployment.yaml" created

$ ls
db-deployment.yaml  docker-compose.yml         docker-gitlab.yml  redis-deployment.yaml  result-deployment.yaml  vote-deployment.yaml  worker-deployment.yaml
db-svc.yaml         docker-voting.yml          redis-svc.yaml     result-svc.yaml        vote-svc.yaml           worker-svc.yaml
```

Vous pouvez également fournir plusieurs fichiers de composition du Docker en même temps :

```sh
$ kompose -f docker-compose.yml -f docker-guestbook.yml convert
INFO Kubernetes file "frontend-service.yaml" created         
INFO Kubernetes file "mlbparks-service.yaml" created         
INFO Kubernetes file "mongodb-service.yaml" created          
INFO Kubernetes file "redis-master-service.yaml" created     
INFO Kubernetes file "redis-slave-service.yaml" created      
INFO Kubernetes file "frontend-deployment.yaml" created      
INFO Kubernetes file "mlbparks-deployment.yaml" created      
INFO Kubernetes file "mongodb-deployment.yaml" created       
INFO Kubernetes file "mongodb-claim0-persistentvolumeclaim.yaml" created
INFO Kubernetes file "redis-master-deployment.yaml" created  
INFO Kubernetes file "redis-slave-deployment.yaml" created   

$ ls
mlbparks-deployment.yaml  mongodb-service.yaml                       redis-slave-service.jsonmlbparks-service.yaml  
frontend-deployment.yaml  mongodb-claim0-persistentvolumeclaim.yaml  redis-master-service.yaml
frontend-service.yaml     mongodb-deployment.yaml                    redis-slave-deployment.yaml
redis-master-deployment.yaml
```

Lorsque plusieurs fichiers de docker-compose sont fournis, la configuration est fusionnée. Toute configuration qui est commune sera surchargée par le fichier suivant.

### OpenShift

```sh
$ kompose --provider openshift --file docker-voting.yml convert
WARN [worker] Service cannot be created because of missing port.
INFO OpenShift file "vote-service.yaml" created             
INFO OpenShift file "db-service.yaml" created               
INFO OpenShift file "redis-service.yaml" created            
INFO OpenShift file "result-service.yaml" created           
INFO OpenShift file "vote-deploymentconfig.yaml" created    
INFO OpenShift file "vote-imagestream.yaml" created         
INFO OpenShift file "worker-deploymentconfig.yaml" created  
INFO OpenShift file "worker-imagestream.yaml" created       
INFO OpenShift file "db-deploymentconfig.yaml" created      
INFO OpenShift file "db-imagestream.yaml" created           
INFO OpenShift file "redis-deploymentconfig.yaml" created   
INFO OpenShift file "redis-imagestream.yaml" created        
INFO OpenShift file "result-deploymentconfig.yaml" created  
INFO OpenShift file "result-imagestream.yaml" created  
```

Il supporte également la création de buildconfig pour la directive de build dans un service. Par défaut, il utilise le répertoire distant de la branche git courante comme répertoire source, et la branche courante comme branche source pour le build. Vous pouvez spécifier un repo source et une branche différents en utilisant respectivement les options ``--build-repo`` et ``--build-branch``.

```sh
$ kompose --provider openshift --file buildconfig/docker-compose.yml convert
WARN [foo] Service cannot be created because of missing port.
INFO OpenShift Buildconfig using git@github.com:rtnpro/kompose.git::master as source.
INFO OpenShift file "foo-deploymentconfig.yaml" created     
INFO OpenShift file "foo-imagestream.yaml" created          
INFO OpenShift file "foo-buildconfig.yaml" created
```

{{< note >}}
Si vous poussez manuellement les artefacts OpenShift en utilisant ``oc create -f``, vous devez vous assurer que vous poussez l'artefact imagestream avant l'artefact buildconfig, pour contourner ce problème OpenShift : https://github.com/openshift/origin/issues/4518 .
{{< /note >}}

## `kompose up`

Kompose propose un moyen simple de déployer votre application "composée" sur Kubernetes ou OpenShift via `kompose up`.


### Kubernetes
```sh
$ kompose --file ./examples/docker-guestbook.yml up
We are going to create Kubernetes deployments and services for your Dockerized application.
If you need different kind of resources, use the 'kompose convert' and 'kubectl apply -f' commands instead.

INFO Successfully created service: redis-master   
INFO Successfully created service: redis-slave    
INFO Successfully created service: frontend       
INFO Successfully created deployment: redis-master
INFO Successfully created deployment: redis-slave
INFO Successfully created deployment: frontend    

Your application has been deployed to Kubernetes. You can run 'kubectl get deployment,svc,pods' for details.

$ kubectl get deployment,svc,pods
NAME                                              DESIRED       CURRENT       UP-TO-DATE   AVAILABLE   AGE
deployment.extensions/frontend                    1             1             1            1           4m
deployment.extensions/redis-master                1             1             1            1           4m
deployment.extensions/redis-slave                 1             1             1            1           4m

NAME                         TYPE               CLUSTER-IP    EXTERNAL-IP   PORT(S)      AGE
service/frontend             ClusterIP          10.0.174.12   <none>        80/TCP       4m
service/kubernetes           ClusterIP          10.0.0.1      <none>        443/TCP      13d
service/redis-master         ClusterIP          10.0.202.43   <none>        6379/TCP     4m
service/redis-slave          ClusterIP          10.0.1.85     <none>        6379/TCP     4m

NAME                                READY         STATUS        RESTARTS     AGE
pod/frontend-2768218532-cs5t5       1/1           Running       0            4m
pod/redis-master-1432129712-63jn8   1/1           Running       0            4m
pod/redis-slave-2504961300-nve7b    1/1           Running       0            4m
```

**Note**:

- Vous devez avoir un cluster Kubernetes en cours d'exécution avec kubectl pré-configuré.
- Seuls les déploiements et les services sont générés et déployés dans Kubernetes. Si vous avez besoin d'autres types de ressources, utilisez les commandes `kompose convert` et `kubectl apply -f` à la place.

### OpenShift
```sh
$ kompose --file ./examples/docker-guestbook.yml --provider openshift up
We are going to create OpenShift DeploymentConfigs and Services for your Dockerized application.
If you need different kind of resources, use the 'kompose convert' and 'oc create -f' commands instead.

INFO Successfully created service: redis-slave    
INFO Successfully created service: frontend       
INFO Successfully created service: redis-master   
INFO Successfully created deployment: redis-slave
INFO Successfully created ImageStream: redis-slave
INFO Successfully created deployment: frontend    
INFO Successfully created ImageStream: frontend   
INFO Successfully created deployment: redis-master
INFO Successfully created ImageStream: redis-master

Your application has been deployed to OpenShift. You can run 'oc get dc,svc,is' for details.

$ oc get dc,svc,is
NAME               REVISION                              DESIRED       CURRENT    TRIGGERED BY
dc/frontend        0                                     1             0          config,image(frontend:v4)
dc/redis-master    0                                     1             0          config,image(redis-master:e2e)
dc/redis-slave     0                                     1             0          config,image(redis-slave:v1)
NAME               CLUSTER-IP                            EXTERNAL-IP   PORT(S)    AGE
svc/frontend       172.30.46.64                          <none>        80/TCP     8s
svc/redis-master   172.30.144.56                         <none>        6379/TCP   8s
svc/redis-slave    172.30.75.245                         <none>        6379/TCP   8s
NAME               DOCKER REPO                           TAGS          UPDATED
is/frontend        172.30.12.200:5000/fff/frontend                     
is/redis-master    172.30.12.200:5000/fff/redis-master                 
is/redis-slave     172.30.12.200:5000/fff/redis-slave    v1  
```

**Note**:

- Vous devez avoir un cluster OpenShift en cours d'exécution avec `oc` pré-configuré (`oc login`)

## `kompose down`

Une fois que vous avez déployé l'application "composée" sur Kubernetes, `$ kompose down` vous
facilitera la suppression de l'application en supprimant ses déploiements et services. Si vous avez besoin de supprimer d'autres ressources, utilisez la commande 'kubectl'.

```sh
$ kompose --file docker-guestbook.yml down
INFO Successfully deleted service: redis-master   
INFO Successfully deleted deployment: redis-master
INFO Successfully deleted service: redis-slave    
INFO Successfully deleted deployment: redis-slave
INFO Successfully deleted service: frontend       
INFO Successfully deleted deployment: frontend
```

**Note**:

- Vous devez avoir un cluster Kubernetes en cours d'exécution avec kubectl pré-configuré.

## Construire et pousser des images de docker

Kompose permet de construire et de pousser des images Docker. Lorsque vous utilisez la clé `build` dans votre fichier Docker Compose, votre image sera :

  - Automatiquement construite avec le Docker en utilisant la clé "image" spécifiée dans votre fichier
  - Être poussé vers le bon dépôt Docker en utilisant les identifiants locaux (situés dans  `.docker/config`)

Utilisation d'un [exemple de fichier Docker Compose](https://raw.githubusercontent.com/kubernetes/kompose/master/examples/buildconfig/docker-compose.yml):

```yaml
version: "2"

services:
    foo:
        build: "./build"
        image: docker.io/foo/bar
```

En utilisant `kompose up` avec une clé `build` :

```none
$ kompose up
INFO Build key detected. Attempting to build and push image 'docker.io/foo/bar'
INFO Building image 'docker.io/foo/bar' from directory 'build'
INFO Image 'docker.io/foo/bar' from directory 'build' built successfully
INFO Pushing image 'foo/bar:latest' to registry 'docker.io'
INFO Attempting authentication credentials 'https://index.docker.io/v1/
INFO Successfully pushed image 'foo/bar:latest' to registry 'docker.io'
INFO We are going to create Kubernetes Deployments, Services and PersistentVolumeClaims for your Dockerized application. If you need different kind of resources, use the 'kompose convert' and 'kubectl apply -f' commands instead.

INFO Deploying application in "default" namespace
INFO Successfully created Service: foo            
INFO Successfully created Deployment: foo         

Your application has been deployed to Kubernetes. You can run 'kubectl get deployment,svc,pods,pvc' for details.
```

Afin de désactiver cette fonctionnalité, ou de choisir d'utiliser la génération de BuildConfig (avec OpenShift) `--build (local|build-config|none)` peut être passé.

```sh
# Désactiver la construction/poussée d'images Docker
$ kompose up --build none

# Générer des artefacts de Build Config pour OpenShift
$ kompose up --provider openshift --build build-config
```

## Autres conversions

La transformation par défaut `komposer` va générer des [Déploiements](/docs/concepts/workloads/controllers/deployment/) et [Services](/docs/concepts/services-networking/service/) de Kubernetes, au format yaml. Vous avez une autre option pour générer json avec `-j`. Vous pouvez aussi générer des objets de [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), ou [Helm](https://github.com/helm/helm) charts.

```sh
$ kompose convert -j
INFO Kubernetes file "redis-svc.json" created
INFO Kubernetes file "web-svc.json" created
INFO Kubernetes file "redis-deployment.json" created
INFO Kubernetes file "web-deployment.json" created
```
Les fichiers `*-deployment.json` contiennent les objets Déploiements.

```sh
$ kompose convert --replication-controller
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-replicationcontroller.yaml" created
INFO Kubernetes file "web-replicationcontroller.yaml" created
```

Les fichiers `*-replicationcontroller.yaml` contiennent les objets du Contrôleur de Réplication. Si vous voulez spécifier des répliques (la valeur par défaut est 1), utilisez l'option `--replicas` : `$ kompose convert --replication-controller --replicas 3`

```sh
$ kompose convert --daemon-set
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-daemonset.yaml" created
INFO Kubernetes file "web-daemonset.yaml" created
```

Les fichiers `*-daemonset.yaml` contiennent les objets du Daemon Set

Si vous voulez générer un Chart à utiliser avec [Helm](https://github.com/kubernetes/helm), faites-le simplement :

```sh
$ kompose convert -c
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-deployment.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
chart created in "./docker-compose/"

$ tree docker-compose/
docker-compose
├── Chart.yaml
├── README.md
└── templates
    ├── redis-deployment.yaml
    ├── redis-svc.yaml
    ├── web-deployment.yaml
    └── web-svc.yaml
```

La structure du Chart est destinée à fournir un modèle pour la construction de vos chartes de Helm.

## Étiquettes

`kompose` supporte les étiquettes spécifiques à Kompose dans le fichier `docker-compose.yml` afin de définir explicitement le comportement d'un service lors de la conversion.

- Le fichier `kompose.service.type` définit le type de service à créer.

Par exemple :

```yaml
version: "2"
services:
  nginx:
    image: nginx
    dockerfile: foobar
    build: ./foobar
    cap_add:
      - ALL
    container_name: foobar
    labels:
      kompose.service.type: nodeport
```

- `kompose.service.expose` définit si le service doit être accessible depuis l'extérieur du cluster ou non. Si la valeur est fixée à "true", le fournisseur définit automatiquement l'extrémité, et pour toute autre valeur, la valeur est définie comme le nom d'hôte. Si plusieurs ports sont définis dans un service, le premier est choisi pour être l'exposé.
  - Pour le fournisseur Kubernetes, une ressource ingress est créée et il est supposé qu'un contrôleur ingress a déjà été configuré.
  - Pour le fournisseur OpenShift, une route est créée.

Par exemple :

```yaml
version: "2"
services:
  web:
    image: tuna/docker-counter23
    ports:
     - "5000:5000"
    links:
     - redis
    labels:
      kompose.service.expose: "counter.example.com"
  redis:
    image: redis:3.0
    ports:
     - "6379"
```

Les options actuellement supportées sont :

| Key                  | Value                               |
|----------------------|-------------------------------------|
| kompose.service.type | nodeport / clusterip / loadbalancer |
| kompose.service.expose| true / hostname |

{{< note >}}
Le label `kompose.service.type` doit être défini avec `ports` uniquement, sinon `kompose` échouera.
{{< /note >}}

## Redémarrer

Si vous voulez créer des pods normaux sans contrôleurs, vous pouvez utiliser la construction
`restart` de docker-compose pour définir cela. Suivez le tableau ci-dessous pour voir ce qui se passe avec la valeur de `restart`.

| `docker-compose` `restart` | object created    | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | controller object | `Always`            |
| `always`                   | controller object | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |

{{< note >}}
L'objet contrôleur peut être `déploiement` ou `replicationcontroller`, etc.
{{< /note >}}

Par exemple, le service `pival` deviendra un Pod. Ce conteneur a calculé la valeur de `pi`.

```yaml
version: '2'

services:
  pival:
    image: perl
    command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
    restart: "on-failure"
```

### Avertissement concernant les configurations de déploiement

Si le fichier Docker Compose a un volume spécifié pour un service, la stratégie Deployment (Kubernetes) ou DeploymentConfig (OpenShift) est changée en "Recreate" au lieu de "RollingUpdate" (par défaut). Ceci est fait pour éviter que plusieurs instances d'un service n'accèdent à un volume en même temps.

Si le fichier Docker Compose a un nom de service avec `_` dedans (par exemple `web_service`), alors il sera remplacé par `-` et le nom du service sera renommé en conséquence (par exemple `web-service`). Kompose fait cela parce que "Kubernetes" n'autorise pas `_` dans le nom de l'objet.

Veuillez noter que changer le nom du service peut casser certains fichiers `docker-compose`.

## Versions du Docker Compose

Kompose supporte les versions Docker Compose : 1, 2 et 3. Nous avons un support limité sur les versions 2.1 et 3.2 en raison de leur nature expérimentale.

Une liste complète sur la compatibilité entre les trois versions est donnée dans notre [document de conversion](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md) incluant une liste de toutes les clés Docker Compose incompatibles.


