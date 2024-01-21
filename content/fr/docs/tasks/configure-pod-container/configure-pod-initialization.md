---
title: Configurer l'initialisation du pod
content_type: task
weight: 130
---

<!-- overview -->
Cette page montre comment utiliser un Init conteneur pour initialiser un Pod avant de lancer un conteneur d'application.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Créer un Pod qui a un Init Container

Dans cet exercice, vous allez créer un Pod qui a un conteneur d'application et Init conteneur. Le conteneur d'initialisation est achevé avant que le conteneur d'application ne démarre.

Voici le fichier de configuration du Pod :

{{% codenew file="pods/init-containers.yaml" %}}

Dans le fichier de configuration, vous pouvez voir que le Pod a un Volume que le conteneur d'initialisation et le conteneur d'application partagent.

Le conteneur d'initialisation monte le volume partagé à `/work-dir`, et le conteneur d'application monte le volume partagé à `/usr/share/nginx/html`. Le conteneur d'initialisation exécute la commande suivante puis se termine :

    wget -O /work-dir/index.html http://kubernetes.io

Remarquez que le conteneur d'initialisation écrit le fichier `index.html` dans le répertoire racine
du serveur nginx.

Créez le Pod :

    kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml

Vérifiez que le conteneur nginx fonctionne :

    kubectl get pod init-demo

La sortie montre que le conteneur nginx est en cours d'exécution :

    NAME        READY     STATUS    RESTARTS   AGE
    init-demo   1/1       Running   0          1m

Entrez dans la console shell du conteneur nginx du Pod init-demo :

    kubectl exec -it init-demo -- /bin/bash

Dans votre shell, envoyez une requête GET au serveur nginx :

    root@nginx:~# apt-get update
    root@nginx:~# apt-get install curl
    root@nginx:~# curl localhost

La sortie montre que nginx sert la page web qui a été écrite par le conteneur d'initialisation :

    <!Doctype html>
    <html id="home">

    <head>
    ...
    "url": "http://kubernetes.io/"}</script>
    </head>
    <body>
      ...
      <p>Kubernetes is open source giving you the freedom to take advantage ...</p>
      ...



## {{% heading "whatsnext" %}}


* Pour en savoir plus sur
[communiquer entre conteneurs fonctionnant dans le même Pod](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Pour en savoir plus sur [Init Conteneurs](/docs/concepts/workloads/pods/init-containers/).
* Pour en savoir plus sur [Volumes](/docs/concepts/storage/volumes/).
* Pour en savoir plus sur [Débogage des Init Conteneurs](/docs/tasks/debug/debug-application/debug-init-containers/)




