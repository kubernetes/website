---
title: Installer Kubernetes avec Minikube
content_type: concept
---

<!-- overview -->

Minikube est un outil facilitant l’exécution locale de Kubernetes.
Minikube exécute un cluster Kubernetes à nœud unique dans une machine virtuelle (VM) de votre ordinateur portable pour les utilisateurs qui souhaitent essayer Kubernetes ou le développer au quotidien.



<!-- body -->

## Fonctionnalités de Minikube

Minikube prend en charge les fonctionnalités Kubernetes suivantes:

* DNS
* NodePorts
* ConfigMaps et Secrets
* Dashboards
* Container Runtime: Docker, [CRI-O](https://cri-o.io/), et [containerd](https://github.com/containerd/containerd)
* Activation de la CNI (Container Network Interface)
* Ingress

## Installation

Consultez [Installation de Minikube](/docs/tasks/tools/install-minikube/).

## Démarrage rapide

Cette brève démonstration vous explique comment démarrer, utiliser et supprimer les minikube localement.
Suivez les étapes ci-dessous pour commencer et explorer Minikube.

1. Lancez Minikube et créez un cluster:

    ```shell
    minikube start
    ```

    Le résultat est similaire à ceci:

    ```text
    Starting local Kubernetes cluster...
    Running pre-create checks...
    Creating machine...
    Starting local Kubernetes cluster...
    ```

    Pour plus d'informations sur le démarrage de votre cluster avec une version spécifique de Kubernetes, une machine virtuelle ou un environnement de conteneur, voir [Démarrage d'un cluster](#starting-a-cluster).

2. Vous pouvez maintenant interagir avec votre cluster à l'aide de kubectl.
   Pour plus d'informations, voir [Interagir avec votre cluster](#interacting-with-your-cluster).

    Créons un déploiement Kubernetes en utilisant une image existante nommée `echoserver`, qui est un serveur HTTP, et exposez-la sur le port 8080 à l’aide de `--port`.

    ```shell
    kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.10
    ```

    Le résultat est similaire à ceci:

    ```text
    deployment.apps/hello-minikube created
    ```

3. Pour accéder au Deployment `hello-minikube`, exposez-le comme un Service:

    ```shell
    kubectl expose deployment hello-minikube --type=NodePort --port=8080
    ```

    L'option `--type=NodePort` spécifie le type du Service.

    Le résultat est similaire à ceci:

    ```text
    service/hello-minikube exposed
    ```

4. Le Pod `hello-minikube` est maintenant lancé, mais vous devez attendre que le Pod soit opérationnel avant d'y accéder via le Service.

   Vérifiez si le Pod est opérationnel:

   ```shell
   kubectl get pod
   ```

   Si la sortie affiche le `STATUS` comme `ContainerCreating`, le Pod est toujours en cours de création:

   ```text
   NAME                              READY     STATUS              RESTARTS   AGE
   hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
   ```

   Si la sortie indique le statut `STATUS` comme `Running`, le Pod est maintenant opérationnel:

   ```text
   NAME                              READY     STATUS    RESTARTS   AGE
   hello-minikube-3383150820-vctvh   1/1       Running   0          13s
   ```

5. Obtenez l'URL du Service exposé pour afficher les détails du service:

   ```shell
   minikube service hello-minikube --url
   ```

6. Pour afficher les détails de votre cluster local, copiez et collez l’URL que vous avez obtenue en tant que sortie dans votre navigateur.

    Le résultat est similaire à ceci:

    ```text
    Hostname: hello-minikube-7c77b68cff-8wdzq

    Pod Information:
        -no pod information available-

    Server values:
        server_version=nginx: 1.13.3 - lua: 10008

    Request Information:
        client_address=172.17.0.1
        method=GET
        real path=/
        query=
        request_version=1.1
        request_scheme=http
        request_uri=http://192.168.99.100:8080/

    Request Headers:
        accept=*/*
        host=192.168.99.100:30674
        user-agent=curl/7.47.0

    Request Body:
        -no body in request-
    ```

    Si vous ne souhaitez plus que le service et le cluster s'exécutent, vous pouvez les supprimer.

7. Supprimez le Service `hello-minikube`:

   ```shell
    kubectl delete services hello-minikube
    ```

    Le résultat est similaire à ceci:

    ```text
    service "hello-minikube" deleted
    ```

8. Supprimez le Deployment `hello-minikube`:

    ```shell
    kubectl delete deployment hello-minikube
    ```

    Le résultat est similaire à ceci:

    ```text
    deployment.extensions "hello-minikube" deleted
    ```

9. Arrêtez le cluster de minikube local:

    ```shell
    minikube stop
    ```

    Le résultat est similaire à ceci:

    ```text
    Stopping "minikube"...
    "minikube" stopped.
    ```

    Pour plus d'informations, voir [Arrêt d'un cluster](#stopping-a-cluster).

10. Supprimez le cluster de minikube local:

    ```shell
    minikube delete
    ```

    Le résultat est similaire à ceci:

    ```text
    Deleting "minikube" ...
    The "minikube" cluster has been deleted.
    ```

    Pour plus d'informations, voir [Suppression d'un cluster](#deleting-a-cluster).

## Gérer votre cluster

### Démarrer un cluster

La commande `minikube start` peut être utilisée pour démarrer votre cluster.
Cette commande crée et configure une machine virtuelle qui exécute un cluster Kubernetes à un seul nœud.
Cette commande configure également [kubectl](/docs/user-guide/kubectl-overview/) pour communiquer avec ce cluster.

{{< note >}}
Si vous êtes derrière un proxy Web, vous devez transmettre ces informations à la commande `minikube start`:

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```

Malheureusement, définir les seules variables d'environnement ne fonctionne pas.

Minikube crée également un contexte "minikube" et le définit par défaut dans kubectl.
Pour revenir à ce contexte, exécutez la commande suivante: `kubectl config use-context minikube`.
{{< /note >}}

#### Spécifier la version de Kubernetes

Vous pouvez spécifier la version de Kubernetes pour Minikube à utiliser en ajoutant la chaîne `--kubernetes-version` à la commande `minikube start`.
Par exemple, pour exécuter la version {{< param "fullversion" >}}, procédez comme suit:

```shell
minikube start --kubernetes-version {{< param "fullversion" >}}
```

#### Spécification du pilote de machine virtuelle

Vous pouvez changer le pilote de machine virtuelle en ajoutant l'indicateur `--vm-driver=<nom_du_pilote>` à `minikube start`.
Par exemple, la commande serait:

```shell
minikube start --vm-driver=<nom_du_pilote>
```

Minikube prend en charge les pilotes suivants:
{{< note >}}
Voir [DRIVERS](https://minikube.sigs.k8s.io/docs/drivers/) pour plus de détails sur les pilotes pris en charge et comment installer les plugins.
{{< /note >}}

* virtualbox
* vmwarefusion
* kvm2 ([installation du pilote](https://minikube.sigs.k8s.io/docs/drivers/#kvm2-driver))
* hyperkit ([installation du pilote](https://minikube.sigs.k8s.io/docs/drivers/#hyperkit-driver))
* hyperv ([installation du pilote](https://minikube.sigs.k8s.io/docs/drivers/#hyperv-driver))
Notez que l'adresse IP ci-dessous est dynamique et peut changer. Il peut être récupéré avec `minikube ip`.
* vmware ([installation du pilote](https://minikube.sigs.k8s.io/docs/drivers/#vmware-unified-driver)) (VMware unified driver)
* none (Exécute les composants Kubernetes sur l’hôte et non sur une machine virtuelle. Il n'est pas recommandé d'exécuter le pilote none sur des postes de travail personnels. L'utilisation de ce pilote nécessite Docker ([docker installer](https://docs.docker.com/install/linux/docker-ce/ubuntu/)) et un environnement Linux)

#### Démarrage d'un cluster sur des exécutions de conteneur alternatives

Vous pouvez démarrer Minikube aux exécutions de conteneurs suivantes.
{{< tabs name="container_runtimes" >}}
{{% tab name="containerd" %}}
Pour utiliser [containerd](https://github.com/containerd/containerd) en tant que moteur d'exécution du conteneur, exécutez:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

Ou vous pouvez utiliser la version étendue:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```

{{% /tab %}}
{{% tab name="CRI-O" %}}
Pour utiliser [CRI-O](https://cri-o.io/) comme environnement d'exécution du conteneur, exécutez:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```

Ou vous pouvez utiliser la version étendue:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```

{{% /tab %}}
{{< /tabs >}}

#### Utiliser des images locales en réutilisant le démon Docker

Lorsque vous utilisez une seule machine virtuelle pour Kubernetes, il est utile de réutiliser le démon Docker intégré de Minikube.
La réutilisation du démon intégré signifie que vous n’avez pas besoin de créer un registre Docker sur votre ordinateur hôte et d’y insérer l’image.
Au lieu de cela, vous pouvez créer le même démon Docker que Minikube, ce qui accélère les expériences locales.

{{< note >}}
Assurez-vous de marquer votre image Docker avec autre chose que la plus récente et utilisez cette balise pour extraire l'image.
Parce que `:latest` est la valeur par défaut, avec une stratégie d'extraction d'image par défaut correspondante de `Always`, une erreur d'extraction d'image (`ErrImagePull`) est éventuellement générée si vous n'avez pas l'image Docker dans le registre par défaut de Docker (généralement DockerHub). .
{{< /note >}}

Pour travailler avec le démon Docker sur votre hôte Mac/Linux, utilisez la commande `docker-env` dans votre shell:

```shell
eval $(minikube docker-env)
```

Vous pouvez maintenant utiliser Docker sur la ligne de commande de votre ordinateur hôte Mac/Linux pour communiquer avec le démon Docker dans la VM Minikube:

```shell
docker ps
```

{{< note >}}
Sur Centos 7, Docker peut signaler l’erreur suivante:

```text
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

Vous pouvez résoudre ce problème en mettant à jour `/etc/sysconfig/docker` pour vous assurer que les modifications de l'environnement de Minikube sont respectées:

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```

{{< /note >}}

### Configuration de Kubernetes

Minikube a une fonction de "configurateur" qui permet aux utilisateurs de configurer les composants Kubernetes avec des valeurs arbitraires.
Pour utiliser cette fonctionnalité, vous pouvez utiliser l'indicateur `--extra-config` de la commande `minikube start`.

Cet indicateur est répété, vous pouvez donc le transmettre plusieurs fois avec plusieurs valeurs différentes pour définir plusieurs options.

Cet indicateur prend une chaîne de la forme `composant.key=valeur`, où `composant` est l'une des chaînes de la liste ci-dessous, `key` est une valeur de la structure de configuration et `valeur` est la valeur à définir.

Des clés valides peuvent être trouvées en examinant la documentation de Kubernetes `composantconfigs` pour chaque composant.
Voici la documentation pour chaque configuration prise en charge:

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

#### Exemples

Pour changer le paramètre `MaxPods` en 5 sur le Kubelet, passez cet indicateur: `--extra-config=kubelet.MaxPods=5`.

Cette fonctionnalité prend également en charge les structures imbriquées.
Pour modifier le paramètre `LeaderElection.LeaderElect` sur `true` sur le planificateur, transmettez cet indicateur: `--extra-config=scheduler.LeaderElection.LeaderElect=true`.

Pour définir le `AuthorizationMode` du `apiserver` sur `RBAC`, vous pouvez utiliser: `--extra-config=apiserver.authorization-mode=RBAC`.

### Arrêter un cluster

La commande `minikube stop` peut être utilisée pour arrêter votre cluster.
Cette commande arrête la machine virtuelle Minikube, mais conserve tout l'état et les données du cluster.
Le redémarrage du cluster le restaurera à son état précédent.

### Suppression d'un cluster

La commande `minikube delete` peut être utilisée pour supprimer votre cluster.
Cette commande ferme et supprime la machine virtuelle Minikube.
Aucune donnée ou état n'est conservé.

### Mise à niveau de minikube

Voir [upgrade minikube](https://minikube.sigs.k8s.io/docs/start/macos/)

## Interagir avec votre cluster

### Kubectl

La commande `minikube start` crée [un contexte kubectl](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-) appelé "minikube".
Ce contexte contient la configuration pour communiquer avec votre cluster Minikube.

Minikube définit automatiquement ce contexte par défaut, mais si vous devez y revenir ultérieurement, exécutez:

`kubectl config use-context minikube`,

Ou passez le contexte sur chaque commande comme ceci: `kubectl get pods --context=minikube`.

### Dashboard

Pour accéder au [Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/), lancez cette commande dans un shell après avoir lancé Minikube pour obtenir l'adresse:

```shell
minikube dashboard
```

### Services

Pour accéder à un service exposé via un port de nœud, exécutez cette commande dans un shell après le démarrage de Minikube pour obtenir l'adresse:

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

## La mise en réseau

La machine virtuelle Minikube est exposée au système hôte via une adresse IP routable uniquement depuis le hôte, qui peut être obtenue à l'aide de la commande `minikube ip`.
Tous les services de type `NodePort` sont accessibles via cette adresse IP, sur le NodePort.

Pour déterminer le NodePort pour votre service, vous pouvez utiliser une commande `kubectl` comme celle-ci:

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

## Volumes persistants

Minikube supporte les [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) de type `hostPath`.
Ces volumes persistants sont mappés vers un répertoire à l'intérieur de la VM Minikube.

La machine virtuelle Minikube démarre dans un fichier tmpfs, de sorte que la plupart des répertoires ne seront pas conservés lors des redémarrages avec (`minikube stop`).
Toutefois, Minikube est configuré pour conserver les fichiers stockés dans les répertoires d’hôte suivants:

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

Voici un exemple de configuration PersistentVolume permettant de conserver des données dans le répertoire `/data`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

## Dossiers hôtes montés

Certains pilotes vont monter un dossier hôte dans la VM afin de pouvoir facilement partager des fichiers entre la VM et l'hôte.
Celles-ci ne sont pas configurables pour le moment et diffèrent selon le pilote et le système d'exploitation que vous utilisez.

{{< note >}}
Le partage de dossier hôte n'est pas encore implémenté dans le pilote KVM.
{{< /note >}}

| Pilote        | OS      | HostFolder  | VM          |
|---------------|---------|-------------|-------------|
| VirtualBox    | Linux   | ``/home``   |``/hosthome``|
| VirtualBox    | macOS   | ``/Users``  |``/Users``   |
| VirtualBox    | Windows | ``C:/Users``|``/c/Users`` |
| VMware Fusion | macOS   | ``/Users``  |``/Users``   |
| Xhyve         | macOS   | ``/Users``  |``/Users``   |

## Registres de conteneurs privés

Pour accéder à un registre de conteneurs privé, suivez les étapes de [cette page](/docs/concepts/containers/images/).

Nous vous recommandons d'utiliser `ImagePullSecrets`, mais si vous souhaitez configurer l'accès sur la VM Minikube, vous pouvez placer le `.dockercfg` dans le repertoire `/home/docker` ou le `config.json` dans le repertoire `/home/docker/.docker`.

## Add-ons

Pour que Minikube puisse démarrer ou redémarrer correctement des addons personnalisés, placez les addons que vous souhaitez lancer avec Minikube dans le répertoire `~/.minikube/addons`.
Les extensions de ce dossier seront déplacées vers la VM Minikube et lancées à chaque démarrage ou redémarrage de Minikube.

## Utilisation de Minikube avec un proxy HTTP

Minikube crée une machine virtuelle qui inclut Kubernetes et un démon Docker.
Lorsque Kubernetes tente de planifier des conteneurs à l'aide de Docker, le démon Docker peut nécessiter un accès réseau externe pour extraire les conteneurs.

Si vous êtes derrière un proxy HTTP, vous devrez peut-être fournir à Docker les paramètres de proxy.
Pour ce faire, transmettez les variables d’environnement requises en tant qu’indicateurs lors de la création de `minikube start`.

Par exemple:

```shell
minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

Si l'adresse de votre machine virtuelle est 192.168.99.100, il est probable que vos paramètres de proxy empêcheront `kubectl` de l'atteindre directement.
Pour contourner la configuration du proxy pour cette adresse IP, vous devez modifier vos paramètres no_proxy.
Vous pouvez le faire avec:

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

## Problèmes connus

Les fonctionnalités nécessitant plusieurs nœuds ne fonctionneront pas dans Minikube.

## Conception

Minikube utilise [libmachine](https://github.com/docker/machine/tree/master/libmachine) pour le provisionnement de machines virtuelles, et [kubeadm](https://github.com/kubernetes/kubeadm) mettre en service un cluster Kubernetes.

Pour plus d'informations sur Minikube, voir la [proposition](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).

## Liens supplémentaires

* **Objectifs et non-objectifs**: Pour les objectifs et non-objectifs du projet Minikube, veuillez consulter notre [roadmap](https://git.k8s.io/minikube/docs/contributors/roadmap.md).
* **Guide de développement**: Voir [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) pour avoir un aperçu de comment envoyer des pull requests.
* **Construire Minikube**: Pour obtenir des instructions sur la création / test de Minikube à partir des sources, voir le [guide de build](https://git.k8s.io/minikube/docs/contributors/build_guide.md).
* **Ajout d'une nouvelle dépendance**: Pour savoir comment ajouter une nouvelle dépendance à Minikube, voir la section [guide d'ajout de dépendances](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md).
* **Ajout d'un nouvel addon**: Pour savoir comment ajouter un nouvel addon pour Minikube, reportez-vous au [Ajout d’un addon](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md).
* **MicroK8s**: Les utilisateurs de Linux qui souhaitent éviter d’exécuter une machine virtuelle peuvent envisager [MicroK8s](https://microk8s.io/).

## Communauté

Les contributions, questions et commentaires sont les bienvenus et sont encouragés !
Les développeurs de minikube sont dans le canal #minikube du [Slack](https://kubernetes.slack.com) de Kubernetes (recevoir une invitation [ici](http://slack.kubernetes.io/)).
Nous avons également la liste de diffusion [kubernetes-dev Google Groupes](https://groups.google.com/forum/#!forum/kubernetes-dev).
Si vous publiez sur la liste, veuillez préfixer votre sujet avec "minikube:".
