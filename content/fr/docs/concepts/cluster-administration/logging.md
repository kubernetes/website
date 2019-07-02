---
reviewers:
- piosz
- x13n
title: Architecture de Journalisation d'évènements (logging)
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

La journalisation des évènements systèmes et d'applications peuvent aider à comprendre ce qui se passe dans un cluster. Les journaux sont particulièrement utiles pour débogguer les problèmes et surveiller l'activité du cluster. La plupart des application modernes ont un mécanisme de journalisation d'évènements, et la plupart des environnements d'exécution de conteneur ont été désigné pour supporter la journalisation des évènements. La méthode de journalisation la plus facile et la plus répandue pour des applications conteneurisées est d'écrire dans les flux de sortie standard et d'erreur standard (`stdout` et `stderr`).

Malgré cela, la fonctionnalité de journalisation fournie nativement par l'environnement d'exécution de conteneur n'est pas suffisante comme solution complète de journalisation. Quand un conteneur crash, quand un Pod est expulsé ou quand un nœud disparaît, il est utile de pouvoir accéder au journal d'événement de l'application. C'est pourquoi les journaux doivent avoir leur propre espace de stockage et cycle de vie indépendamment des nœuds, Pods ou conteneurs. Ce concept est appelé _journalisation des évènements au niveau du cluster_ (cluster-level-logging). Un backend dédié pour stocker, analyser et faire des requêtes est alors nécessaire. Kubernetes n'offre pas nativement de solution de stockage pour les journaux mais il est possible d'intégrer de nombreuses solutions de journalisation d'évènements dans un cluster Kubernetes.


{{% /capture %}}


{{% capture body %}}

L'architecture de journalisation des évènements au niveau du cluster est décrite en considérant qu'un backend de journalisation est présent a l'intérieur ou à l'extérieur du cluster. Même sans avoir l'intention de journaliser les évènements au niveau du cluster, il est intéressant de savoir comment les journaux sont conservés et gérés au niveau d'un nœud.

## Journalisation simple d'évènements dans Kubernetes

Dans cette section, nous allons voir un exemple simple de journalisation d'évènements avec le flux de sortie standard. Cette démonstration utilise un [manifeste pour un Pod](/examples/debug/counter-pod.yaml) qui contient un conteneur qui écrit du texte sur le flux de sortie standard chaque seconde.

{{< codenew file="debug/counter-pod.yaml" >}}

Pour lancer ce Pod, on utilise la commande suivante:

```shell
kubectl apply -f https://k8s.io/fr/examples/debug/counter-pod.yaml
pod/counter created
```

Pour récupérer les événements du conteneur d'un pod, on utilise la commande `kubectl logs` de la manière suivante:

```shell
kubectl logs counter
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

On peut utilisez `kubectl logs` pour récupérer les évènements de l'instanciation précédente d'un Pod en utilisant l'option `--previous` quand par exemple le conteneur à crashé.

Si le Pod a plusieurs conteneurs, il faut spécifier le nom du conteneur dont on veut récupérer le journal d'évènement. Dans notre exemple le conteneur s'appelle `count` donc on peut utiliser `kubectl logs counter count`. Plus de détails dans la [documentation de `kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs)

## Journalisation d'évènements au niveau du nœud

![Journalisation d'évènements au niveau du nœud](/images/docs/user-guide/logging/logging-node-level.png)

Tout ce qu'une application conteneurisée écrit sur `stdout` ou `stderr` est pris en compte et redirigé par l'environment d'exécution des conteneurs. Par exemple, Docker redirige ces deux flux à un [driver de journalisation (EN)](https://docs.docker.com/engine/admin/logging/overview) qui est configuré dans Kubernetes pour écrire dans a fichier au format json.

{{< note >}}
Le driver json de Docker traite chaque ligne comme un message différent. Avec ce driver il n'y a pas de support direct pour des messages multi-lignes. Il faut donc traiter les messages multi-lignes au niveau de l'agent de journalisation ou plus haut.
{{< /note >}}

Par défaut quand un conteneur redémarre, le kubelet ne conserve le journal que d'un seul conteneur terminé. Quand un Pod est expulsé d'un nœud, tous ses conteneurs sont aussi expulsés avec leurs journaux d'évènements.

Quand on utilise la journalisation d'évènements au niveau du nœud, il faut prendre garde à mettre en place une politique de rotation des journaux adéquate afin qu'ils n'utilisent pas tout l'espace de stockage du nœud. Kubernetes n'a pas en charge la rotation des journaux cette rotation, c'est à l'outil de déploiement de le prendre en compte.

Par exemple, dans les clusters Kubernetes déployés avec le script `kube-up.sh` [`logrotate`](https://linux.die.net/man/8/logrotate) est configuré pour s'exécuter toutes les heures. Il est aussi possible de configurer l'environnement d'exécution des conteneurs pour que la rotation des journaux s'exécute automatiquement, e.g. en utilisant le paramètre `log-opt` de Docker.
Dans le script `kube-up.sh`, c'est cette méthode qui est utilisés pour des images COS sur GCP et sinon c'est la première méthode dans tous les autres cas. Avec les deux méthodes la rotation par défaut est configurée quand la taille d'un journal atteint 10MO.

Ce [script][cosConfigureHelper] montre de manière détaillée comment `kube-up.sh` met en place la journalisation d'évènement pour des images COS sur GCP.

Quand [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) s'exécute comme dans le premier exemple de journalisation simple le kubelet du nœud gère la requête et lit directement depuis le fichier de journal et retourne son contenu dans la réponse.

{{< note >}}
À l'heure actuelle, si un système externe a effectué la rotation des journaux, seul le contenu du dernier fichier journal sera disponible avec `kubectl logs`. Par exemple quand le journal atteint 10MO, `logrotate` effectue une rotation, il y a alors 2 fichers, un de 10MO et un de vide, à ce moment là `kubectl logs` retournera une réponse vide.
{{< /note >}}

[cosConfigureHelper]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh

### System component logs

There are two types of system components: those that run in a container and those
that do not run in a container. For example:

* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and container runtime, for example Docker, do not run in containers.

On machines with systemd, the kubelet and container runtime write to journald. If
systemd is not present, they write to `.log` files in the `/var/log` directory.
System components inside containers always write to the `/var/log` directory,
bypassing the default logging mechanism. They use the [klog][klog]
logging library. You can find the conventions for logging severity for those
components in the [development docs on logging](https://git.k8s.io/community/contributors/devel/logging.md).

Similarly to the container logs, system component logs in the `/var/log`
directory should be rotated. In Kubernetes clusters brought up by
the `kube-up.sh` script, those logs are configured to be rotated by
the `logrotate` tool daily or once the size exceeds 100MB.

[klog]: https://github.com/kubernetes/klog

## Cluster-level logging architectures

While Kubernetes does not provide a native solution for cluster-level logging, there are several common approaches you can consider. Here are some options:

* Use a node-level logging agent that runs on every node.
* Include a dedicated sidecar container for logging in an application pod.
* Push logs directly to a backend from within an application.

### Using a node logging agent

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)

You can implement cluster-level logging by including a _node-level logging agent_ on each node. The logging agent is a dedicated tool that exposes logs or pushes logs to a backend. Commonly, the logging agent is a container that has access to a directory with log files from all of the application containers on that node.

Because the logging agent must run on every node, it's common to implement it as either a DaemonSet replica, a manifest pod, or a dedicated native process on the node. However the latter two approaches are deprecated and highly discouraged.

Using a node-level logging agent is the most common and encouraged approach for a Kubernetes cluster, because it creates only one agent per node, and it doesn't require any changes to the applications running on the node. However, node-level logging _only works for applications' standard output and standard error_.

Kubernetes doesn't specify a logging agent, but two optional logging agents are packaged with the Kubernetes release: [Stackdriver Logging](/docs/user-guide/logging/stackdriver) for use with Google Cloud Platform, and [Elasticsearch](/docs/user-guide/logging/elasticsearch). You can find more information and instructions in the dedicated documents. Both use [fluentd](http://www.fluentd.org/) with custom configuration as an agent on the node.

### Using a sidecar container with the logging agent

You can use a sidecar container in one of the following ways:

* The sidecar container streams application logs to its own `stdout`.
* The sidecar container runs a logging agent, which is configured to pick up logs from an application container.

#### Streaming sidecar container

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

By having your sidecar containers stream to their own `stdout` and `stderr`
streams, you can take advantage of the kubelet and the logging agent that
already run on each node. The sidecar containers read logs from a file, a socket,
or the journald. Each individual sidecar container prints log to its own `stdout`
or `stderr` stream.

This approach allows you to separate several log streams from different
parts of your application, some of which can lack support
for writing to `stdout` or `stderr`. The logic behind redirecting logs
is minimal, so it's hardly a significant overhead. Additionally, because
`stdout` and `stderr` are handled by the kubelet, you can use built-in tools
like `kubectl logs`.

Consider the following example. A pod runs a single container, and the container
writes to two different log files, using two different formats. Here's a
configuration file for the Pod:

{{< codenew file="admin/logging/two-files-counter-pod.yaml" >}}

It would be a mess to have log entries of different formats in the same log
stream, even if you managed to redirect both components to the `stdout` stream of
the container. Instead, you could introduce two sidecar containers. Each sidecar
container could tail a particular log file from a shared volume and then redirect
the logs to its own `stdout` stream.

Here's a configuration file for a pod that has two sidecar containers:

{{< codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" >}}

Now when you run this pod, you can access each log stream separately by
running the following commands:

```shell
kubectl logs counter count-log-1
```
```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

```shell
kubectl logs counter count-log-2
```
```
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
```

The node-level agent installed in your cluster picks up those log streams
automatically without any further configuration. If you like, you can configure
the agent to parse log lines depending on the source container.

Note, that despite low CPU and memory usage (order of couple of millicores
for cpu and order of several megabytes for memory), writing logs to a file and
then streaming them to `stdout` can double disk usage. If you have
an application that writes to a single file, it's generally better to set
`/dev/stdout` as destination rather than implementing the streaming sidecar
container approach.

Sidecar containers can also be used to rotate log files that cannot be
rotated by the application itself. An example
of this approach is a small container running logrotate periodically.
However, it's recommended to use `stdout` and `stderr` directly and leave rotation
and retention policies to the kubelet.

#### Sidecar container with a logging agent

![Sidecar container with a logging agent](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

If the node-level logging agent is not flexible enough for your situation, you
can create a sidecar container with a separate logging agent that you have
configured specifically to run with your application.

{{< note >}}
Using a logging agent in a sidecar container can lead
to significant resource consumption. Moreover, you won't be able to access
those logs using `kubectl logs` command, because they are not controlled
by the kubelet.
{{< /note >}}

As an example, you could use [Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/),
which uses fluentd as a logging agent. Here are two configuration files that
you can use to implement this approach. The first file contains
a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to configure fluentd.

{{< codenew file="admin/logging/fluentd-sidecar-config.yaml" >}}

{{< note >}}
The configuration of fluentd is beyond the scope of this article. For
information about configuring fluentd, see the
[official fluentd documentation](http://docs.fluentd.org/).
{{< /note >}}

The second file describes a pod that has a sidecar container running fluentd.
The pod mounts a volume where fluentd can pick up its configuration data.

{{< codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" >}}

After some time you can find log messages in the Stackdriver interface.

Remember, that this is just an example and you can actually replace fluentd
with any logging agent, reading from any source inside an application
container.

### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)

You can implement cluster-level logging by exposing or pushing logs directly from
every application; however, the implementation for such a logging mechanism
is outside the scope of Kubernetes.

{{% /capture %}}
