---
title: Configurer les Liveness, Readiness et Startup Probes
content_type: task
weight: 110
---

<!-- overview -->

Cette page montre comment configurer les liveness, readiness et startup probes pour les conteneurs.

Le [Kubelet](/docs/admin/kubelet/) utilise les liveness probes pour détecter quand redémarrer un conteneur. Par exemple, les Liveness probes pourraient attraper un deadlock dans le cas où une application est en cours d'exécution, mais qui est incapable de traiter les requêtes. Le redémarrage d'un conteneur dans un tel état rend l'application plus disponible malgré les bugs.

Le Kubelet utilise readiness probes pour savoir quand un conteneur est prêt à accepter le trafic. Un Pod est considéré comme prêt lorsque tous ses conteneurs sont prêts.
Ce signal sert notamment à contrôler les pods qui sont utilisés comme backends pour les Services. Lorsqu'un Pod n'est pas prêt, il est retiré des équilibreurs de charge des Services.

Le Kubelet utilise startup probes pour savoir quand une application d'un conteneur a démarré.
Si une telle probe est configurée, elle désactive les contrôles de liveness et readiness jusqu'à cela réussit, en s'assurant que ces probes n'interfèrent pas avec le démarrage de l'application.
Cela peut être utilisé dans le cas des liveness checks sur les conteneurs à démarrage lent, en les évitant de se faire tuer par le Kubelet avant qu'ils ne soient opérationnels.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Définir une commande de liveness

De nombreuses applications fonctionnant pour des longues périodes finissent par passer à des états de rupture et ne peuvent pas se rétablir, sauf en étant redémarrées. Kubernetes fournit des liveness probes pour détecter et remédier à ces situations.

Dans cet exercice, vous allez créer un Pod qui exécute un conteneur basé sur l'image  `k8s.gcr.io/busybox`. Voici le fichier de configuration pour le Pod :

{{< codenew file="pods/probe/exec-liveness.yaml" >}}

Dans le fichier de configuration, vous constatez que le Pod a un seul conteneur.
Le champ `periodSeconds` spécifie que le Kubelet doit effectuer un check de liveness toutes les 5 secondes. Le champ `initialDelaySeconds` indique au Kubelet qu'il devrait attendre 5 secondes avant d'effectuer la première probe. Pour effectuer une probe, le Kubelet exécute la commande `cat /tmp/healthy` dans le conteneur. Si la commande réussit, elle renvoie 0, et le Kubelet considère que le conteneur est vivant et en bonne santé. Si la commande renvoie une valeur non nulle, le Kubelet tue le conteneur et le redémarre.

Au démarrage, le conteneur exécute cette commande :

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600"
```

Pour les 30 premières secondes de la vie du conteneur, il y a un fichier `/tmp/healthy`.
Donc pendant les 30 premières secondes, la commande `cat /tmp/healthy` renvoie un code de succès. Après 30 secondes, `cat /tmp/healthy` renvoie un code d'échec.

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

Dans les 30 secondes, visualisez les événements du Pod :

```shell
kubectl describe pod liveness-exec
```

La sortie indique qu'aucune liveness probe n'a encore échoué :

```shell
FirstSeen    LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
24s       24s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "k8s.gcr.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "k8s.gcr.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
```

Après 35 secondes, visualisez à nouveau les événements du Pod :

```shell
kubectl describe pod liveness-exec
```

Au bas de la sortie, il y a des messages indiquant que les liveness probes ont échoué, et que les conteneurs ont été tués et recréés.

```shell
FirstSeen LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
37s       37s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "k8s.gcr.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "k8s.gcr.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
2s        2s      1   {kubelet worker0}   spec.containers{liveness}   Warning     Unhealthy   Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```

Attendez encore 30 secondes et vérifiez que le conteneur a été redémarré :

```shell
kubectl get pod liveness-exec
```

La sortie montre que `RESTARTS` a été incrémenté :

```shell
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Définir une requête HTTP de liveness

Un autre type de liveness probe utilise une requête GET HTTP. Voici la configuration
d'un Pod qui fait fonctionner un conteneur basé sur l'image `k8s.gcr.io/liveness`.

{{< codenew file="pods/probe/http-liveness.yaml" >}}

Dans le fichier de configuration, vous pouvez voir que le Pod a un seul conteneur.
Le champ `periodSeconds` spécifie que le Kubelet doit effectuer une liveness probe toutes les 3 secondes. Le champ `initialDelaySeconds` indique au Kubelet qu'il devrait attendre 3 secondes avant d'effectuer la première probe. Pour effectuer une probe, le Kubelet envoie une requête HTTP GET au serveur qui s'exécute dans le conteneur et écoute sur le port 8080. Si le handler du chemin `/healthz` du serveur renvoie un code de succès, le Kubelet considère que le conteneur est vivant et en bonne santé. Si le handler renvoie un code d'erreur, le Kubelet tue le conteneur et le redémarre.

Tout code supérieur ou égal à 200 et inférieur à 400 indique un succès. Tout autre code indique un échec.

Vous pouvez voir le code source du serveur dans
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

Pendant les 10 premières secondes où le conteneur est en vie, le handler `/healthz` renvoie un statut de 200. Après cela, le handler renvoie un statut de 500.

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("erreur: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

Le Kubelet commence à effectuer des contrôles de santé 3 secondes après le démarrage du conteneur.
Ainsi, les premiers contrôles de santé seront réussis. Mais après 10 secondes, les contrôles de santé échoueront, et le Kubelet tuera et redémarrera le conteneur.

Pour essayer le HTTP liveness check, créez un Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Après 10 secondes, visualisez les événements du Pod pour vérifier que les liveness probes ont échoué et le conteneur a été redémarré :

```shell
kubectl describe pod liveness-http
```

Dans les versions antérieures à la v1.13 (y compris la v1.13), au cas où la variable d'environnement `http_proxy` (ou `HTTP_PROXY`) est définie sur le noeud où tourne un Pod, le HTTP liveness probe utilise ce proxy.
Dans les versions postérieures à la v1.13, les paramètres de la variable d'environnement du HTTP proxy local n'affectent pas le HTTP liveness probe.

## Définir une TCP liveness probe

Un troisième type de liveness probe utilise un TCP Socket. Avec cette configuration, le Kubelet tentera d'ouvrir un socket vers votre conteneur sur le port spécifié.
S'il arrive à établir une connexion, le conteneur est considéré comme étant en bonne santé, s'il n'y arrive pas, c'est un échec.

{{< codenew file="pods/probe/tcp-liveness-readiness.yaml" >}}

Comme vous le voyez, la configuration pour un check TCP est assez similaire à un check HTTP.
Cet exemple utilise à la fois des readiness et liveness probes. Le Kubelet transmettra la première readiness probe 5 secondes après le démarrage du conteneur. Il tentera de se connecter au conteneur `goproxy` sur le port 8080. Si la probe réussit, le conteneur sera marqué comme prêt. Kubelet continuera à effectuer ce check tous les 10 secondes.

En plus de la readiness probe, cette configuration comprend une liveness probe.
Le Kubelet effectuera la première liveness probe 15 secondes après que le conteneur démarre. Tout comme la readiness probe, celle-ci tentera de se connecter au conteneur de `goproxy` sur le port 8080. Si la liveness probe échoue, le conteneur sera redémarré.

Pour essayer la TCP liveness check, créez un Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

Après 15 secondes, visualisez les événements de Pod pour vérifier les liveness probes :

```shell
kubectl describe pod goproxy
```

## Utilisation d'un port nommé

Vous pouvez utiliser un [ContainerPort](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerport-v1-core) nommé pour les HTTP or TCP liveness probes : 

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## Protéger les conteneurs à démarrage lent avec des startup probes {#define-startup-probes}

Parfois, vous devez faire face à des applications legacy qui peuvent nécessiter un temps de démarrage supplémentaire lors de leur première initialisation.
Dans de telles situations, il peut être compliqué de régler les paramètres de la liveness probe sans compromettre la réponse rapide aux blocages qui ont motivé une telle probe.
L'astuce est de configurer une startup probe avec la même commande, HTTP ou TCP check avec un `failureThreshold * periodSeconds` assez long pour couvrir le pire des scénarios des temps de démarrage.

Ainsi, l'exemple précédent deviendrait :

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

Grâce à la startup probe, l'application aura un maximum de 5 minutes (30 * 10 = 300s) pour terminer son démarrage.
Une fois que la startup probe a réussi, la liveness probe prend le relais pour fournir une réponse rapide aux blocages de conteneurs.
Si la startup probe ne réussit jamais, le conteneur est tué après 300s puis soumis à la `restartPolicy` (politique de redémarrage) du Pod.

## Définir les readiness probes

Parfois, les applications sont temporairement incapables de servir le trafic.
Par exemple, une application peut avoir besoin de charger des larges données ou des fichiers de configuration pendant le démarrage, ou elle peut dépendre de services externes après le démarrage.
Dans ces cas, vous ne voulez pas tuer l'application, mais vous ne voulez pas non plus lui envoyer de requêtes. Kubernetes fournit des readiness probes pour détecter et atténuer ces situations. Un pod avec des conteneurs qui signale qu'elle n'est pas prête ne reçoit pas de trafic par les services de Kubernetes.

{{< note >}}
Readiness probes fonctionnent sur le conteneur pendant tout son cycle de vie.
{{< /note >}}

Readiness probes sont configurées de la même façon que les liveness probes. La seule différence est que vous utilisez le champ `readinessProbe` au lieu du champ `livenessProbe`.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

La configuration des readiness probes HTTP et TCP reste également identique à celle des liveness probes.

Les readiness et liveness probes peuvent être utilisées en parallèle pour le même conteneur.
L'utilisation des deux peut garantir que le trafic n'atteigne pas un conteneur qui n'est pas prêt et que les conteneurs soient redémarrés en cas de défaillance.

## Configurer les Probes

{{< comment >}}
Éventuellement, une partie de cette section pourrait être déplacée vers un sujet conceptuel.
{{< /comment >}}

[Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) ont un certain nombre de champs qui vous pouvez utiliser pour contrôler plus précisément le comportement de la vivacité et de la disponibilité des probes :

* `initialDelaySeconds`: Nombre de secondes après le démarrage du conteneur avant que les liveness et readiness probes ne soient lancées. La valeur par défaut est de 0 seconde. La valeur minimale est 0.
* `periodSeconds`: La fréquence (en secondes) à laquelle la probe doit être effectuée. La valeur par défaut est de 10 secondes. La valeur minimale est de 1.
* `timeoutSeconds`: Nombre de secondes après lequel la probe time out. Valeur par défaut à 1 seconde. La valeur minimale est de 1.
* `successThreshold`: Le minimum de succès consécutifs pour que la probe soit considérée comme réussie après avoir échoué. La valeur par défaut est 1. Doit être 1 pour la liveness probe. La valeur minimale est de 1.
* `failureThreshold`: Quand un Pod démarre et que la probe échoue, Kubernetes va tenter `failureThreshold` fois avant d'abandonner. Abandonner en cas de liveness probe signifie le redémarrage du conteneur. En cas de readiness probe, le Pod sera marqué Unready.
La valeur par défaut est 3, la valeur minimum est 1.

[HTTP probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
ont des champs supplémentaires qui peuvent être définis sur `httpGet` :

* `host`: Nom de l'hôte auquel se connecter, par défaut l'IP du pod. Vous voulez peut être mettre "Host" en httpHeaders à la place.
* `scheme`: Schéma à utiliser pour se connecter à l'hôte (HTTP ou HTTPS). La valeur par défaut est HTTP.
* `path`: Chemin d'accès sur le serveur HTTP.
* `httpHeaders`: En-têtes personnalisés à définir dans la requête. HTTP permet des en-têtes répétés.
* `port`: Nom ou numéro du port à accéder sur le conteneur. Le numéro doit être dans un intervalle de 1 à 65535.

Pour une probe HTTP, le Kubelet envoie une requête HTTP au chemin et au port spécifiés pour effectuer la vérification. Le Kubelet envoie la probe à l'adresse IP du Pod, à moins que l'adresse ne soit surchargée par le champ optionnel `host` dans `httpGet`. Si Le champ `scheme` est mis à `HTTPS`, le Kubelet envoie une requête HTTPS en ignorant la vérification du certificat. Dans la plupart des scénarios, vous ne voulez pas définir le champ `host`.
Voici un scénario où vous le mettriez en place. Supposons que le conteneur écoute sur 127.0.0.1 et que le champ `hostNetwork` du Pod a la valeur true. Alors `host`, sous `httpGet`, devrait être défini à 127.0.0.1. Si votre Pod repose sur des hôtes virtuels, ce qui est probablement plus courant, vous ne devriez pas utiliser `host`, mais plutôt mettre l'en-tête `Host` dans `httpHeaders`.

Le Kubelet fait la connexion de la probe au noeud, pas dans le Pod, ce qui signifie que vous ne pouvez pas utiliser un nom de service dans le paramètre `host` puisque le Kubelet est incapable pour le résoudre.

## {{% heading whatsnext %}}

* Pour en savoir plus sur
[Probes des Conteneurs](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

### Référence

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)


