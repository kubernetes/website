---
assignees:
- bgrant0607
- janetkuo
- thockin

---

You've seen [how to configure and deploy pods and containers](/docs/user-guide/configuring-containers), using some of the most common configuration parameters. This section dives into additional features that are especially useful for running applications in production.

* TOC
{:toc}

## Persistent storage

The container file system only lives as long as the container does, so when a container crashes and restarts, changes to the filesystem will be lost and the container will restart from a clean slate. To access more-persistent storage, outside the container file system, you need a [*volume*](/docs/user-guide/volumes). This is especially important to stateful applications, such as key-value stores and databases.

For example, [Redis](http://redis.io/) is a key-value cache and store, which we use in the [guestbook](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/) and other examples. We can add a volume to it to store persistent data as follows:

{% include code.html language="yaml" file="redis-deployment.yaml" ghlink="/docs/user-guide/redis-deployment.yaml" %}

`emptyDir` volumes live for the lifespan of the [pod](/docs/user-guide/pods), which is longer than the lifespan of any one container, so if the container fails and is restarted, our storage will live on.

In addition to the local disk storage provided by `emptyDir`, Kubernetes supports many different network-attached storage solutions, including PD on GCE and EBS on EC2, which are preferred for critical data, and will handle details such as mounting and unmounting the devices on the nodes. See [the volumes doc](/docs/user-guide/volumes) for more details.

## Distributing credentials

Many applications need credentials, such as passwords, OAuth tokens, and TLS keys, to authenticate with other applications, databases, and services. Storing these credentials in container images or environment variables is less than ideal, since the credentials can then be copied by anyone with access to the image, pod/container specification, host file system, or host Docker daemon.

Kubernetes provides a mechanism, called [*secrets*](/docs/user-guide/secrets), that facilitates delivery of sensitive credentials to applications. A `Secret` is a simple resource containing a map of data. For instance, you can create a simple secret with a username and password as follows:

```shell
$ kubectl create secret generic mysecret --from-literal=username="admin",password="1234"
secret "mysecret" created
```

This is equivalent to `kubectl create -f`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MTIzNA==
```

As with other resources, the created secret can be viewed with `get`:

```shell
$ kubectl get secrets
NAME                  TYPE                                  DATA      AGE
default-token-zirbw   kubernetes.io/service-account-token   3         3h
mysecret              Opaque                                2         2m
```

To use the secret, you need to reference it in a pod or pod template. The `secret` volume source enables you to mount it as an in-memory directory into your containers.

{% include code.html language="yaml" file="redis-secret-deployment.yaml" ghlink="/docs/user-guide/redis-secret-deployment.yaml" %}

For more details, see the [secrets document](/docs/user-guide/secrets), [example](/docs/user-guide/secrets/) and [design doc](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/secrets.md).

## Authenticating with a private image registry

Secrets can also be used to pass [image registry credentials](/docs/user-guide/images/#using-a-private-registry).

The easiest way to create a secret for Docker registry is:

```shell
$ kubectl create secret docker-registry myregistrykey --docker-username=janedoe --docker-password=●●●●●●●●●●● --docker-email=jdoe@example.com
secret "myregistrykey" created
```

Alternatively, you can do the equivalent with the following steps. First, create a `.docker/config.json`, such as by running `docker login <registry.domain>`.
Then put the resulting `.docker/config.json` file into a [secret resource](secrets.md).  For example:

```shell
$ docker login
Username: janedoe
Password: ●●●●●●●●●●●
Email: jdoe@example.com
WARNING: login credentials saved in /Users/jdoe/.docker/config.json.
Login Succeeded

$ echo $(cat ~/.docker/config.json)
{ "https://index.docker.io/v1/": { "auth": "ZmFrZXBhc3N3b3JkMTIK", "email": "jdoe@example.com" } }

$ cat ~/.docker/config.json | base64
eyAiaHR0cHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEvIjogeyAiYXV0aCI6ICJabUZyWlhCaGMzTjNiM0prTVRJSyIsICJlbWFpbCI6ICJqZG9lQGV4YW1wbGUuY29tIiB9IH0K

$ cat > /tmp/image-pull-secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
data:
  .dockerconfigjson: eyAiaHR0cHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEvIjogeyAiYXV0aCI6ICJabUZyWlhCaGMzTjNiM0prTVRJSyIsICJlbWFpbCI6ICJqZG9lQGV4YW1wbGUuY29tIiB9IH0K
type: kubernetes.io/dockerconfigjson
EOF

$ kubectl create -f /tmp/image-pull-secret.yaml
secret "myregistrykey" created
```

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a pod definition.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
```

## Helper containers

[Pods](/docs/user-guide/pods) support running multiple containers co-located together. They can be used to host vertically integrated application stacks, but their primary motivation is to support auxiliary helper programs that assist the primary application. Typical examples are data pullers, data pushers, and proxies.

Such containers typically need to communicate with one another, often through the file system. This can be achieved by mounting the same volume into both containers. An example of this pattern would be a web server with a [program that polls a git repository](http://releases.k8s.io/{{page.githubbranch}}/contrib/git-sync/) for new updates:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: my-nginx
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      volumes:
      - name: www-data
        emptyDir: {}
      containers:
      - name: nginx
        image: nginx
        # This container reads from the www-data volume
        volumeMounts:
        - mountPath: /srv/www
          name: www-data
          readOnly: true
      - name: git-monitor
        image: myrepo/git-monitor
        env:
        - name: GIT_REPO
          value: http://github.com/some/repo.git
        # This container writes to the www-data volume
        volumeMounts:
        - mountPath: /data
          name: www-data
```

More examples can be found in our [blog article](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html) and [presentation slides](http://www.slideshare.net/Docker/slideshare-burns).

## Resource management

Kubernetes's scheduler will place applications only where they have adequate CPU and memory, but it can only do so if it knows how much [resources they require](/docs/user-guide/compute-resources). The consequence of specifying too little CPU is that the containers could be starved of CPU if too many other containers were scheduled onto the same node. Similarly, containers could die unpredictably due to running out of memory if no memory were requested, which can be especially likely for large-memory applications.

If no resource requirements are specified, a nominal amount of resources is assumed. (This default is applied via a [LimitRange](/docs/admin/limitrange/) for the default [Namespace](/docs/user-guide/namespaces). It can be viewed with `kubectl describe limitrange limits`.) You may explicitly specify the amount of resources required as follows:

{% include code.html language="yaml" file="redis-resource-deployment.yaml" ghlink="/docs/user-guide/redis-resource-deployment.yaml" %}

The container will die due to OOM (out of memory) if it exceeds its specified limit, so specifying a value a little higher than expected generally improves reliability. By specifying request, pod is guaranteed to be able to use that much of resource when needed. See [Resource QoS](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/resource-qos.md) for the difference between resource limits and requests.

If you're not sure how much resources to request, you can first launch the application without specifying resources, and use [resource usage monitoring](/docs/user-guide/monitoring) to determine appropriate values.

## Liveness and readiness probes (aka health checks)

Many applications running for long periods of time eventually transition to broken states, and cannot recover except by restarting them. Kubernetes provides [*liveness probes*](/docs/user-guide/pod-states/#container-probes) to detect and remedy such situations.

A common way to probe an application is using HTTP, which can be specified as follows:

{% include code.html language="yaml" file="nginx-probe-deployment.yaml" ghlink="/docs/user-guide/nginx-probe-deployment.yaml" %}

Other times, applications are only temporarily unable to serve, and will recover on their own. Typically in such cases you'd prefer not to kill the application, but don't want to send it requests, either, since the application won't respond correctly or at all. A common such scenario is loading large data or configuration files during application startup. Kubernetes provides *readiness probes* to detect and mitigate such situations. Readiness probes are configured similarly to liveness probes, just using the `readinessProbe` field. A pod with containers reporting that they are not ready will not receive traffic through Kubernetes [services](/docs/user-guide/connecting-applications).

For more details (e.g., how to specify command-based probes), see the [example in the walkthrough](/docs/user-guide/walkthrough/k8s201/#health-checking), the [standalone example](/docs/user-guide/liveness/), and the [documentation](/docs/user-guide/pod-states/#container-probes).

## Handling initialization

Applications often need a set of initialization steps prior to performing their day job. This may include:

* Waiting for other components (like a database or web service) to be available
* Performing configuration templating from environment variables into a config file
* Registering the pod into a central database, or fetching remote configuration from that database
* Downloading application dependencies, seed data, or preconfiguring disk

Kubernetes now includes an alpha feature known as **init containers**, which are one or more containers in a pod that get a chance to run and initialize shared volumes prior to the other application containers starting.  An init container is exactly like a regular container, except that it always runs to completion and each init container must complete successfully before the next one is started. If the init container fails (exits with a non-zero exit code) on a `RestartNever` pod the pod will fail - otherwise it will be restarted until it succeeds or the user deletes the pod.

Since init containers are an alpha feature, they are specified by setting the `pod.alpha.kubernetes.io/init-containers` annotation on a pod (or replica set, deployment, daemon set, pet set, or job). The value of the annotation must be a string containing a JSON array of container definitions:

{% include code.html language="yaml" file="nginx-init-containers.yaml" ghlink="/docs/user-guide/nginx-init-containers.yaml" %}

The status of the init containers is returned as another annotation - `pod.alpha.kubernetes.io/init-container-statuses` -- as an array of the container statuses (similar to the `status.containerStatuses` field).

Init containers support all of the same features as normal containers, including resource limits, volumes, and security settings. The resource requests and limits for an init container are handled slightly different than normal containers since init containers are run one at a time instead of all at once - any limits or quotas will be applied based on the largest init container resource quantity, rather than as the sum of quantities. Init containers do not support readiness probes since they will run to completion before the pod can be ready.


## Lifecycle hooks and termination notice

Of course, nodes and applications may fail at any time, but many applications benefit from clean shutdown, such as to complete in-flight requests, when the termination of the application is deliberate. To support such cases, Kubernetes supports two kinds of notifications:

* Kubernetes will send SIGTERM to applications, which can be handled in order to effect graceful termination. SIGKILL is sent a configurable number of seconds later if the application does not terminate sooner (defaults to 30 seconds, controlled by `spec.terminationGracePeriodSeconds`).
* Kubernetes supports the (optional) specification of a [*pre-stop lifecycle hook*](/docs/user-guide/container-environment/#container-hooks), which will execute prior to sending SIGTERM.

The specification of a pre-stop hook is similar to that of probes, but without the timing-related parameters. For example:

{% include code.html language="yaml" file="nginx-lifecycle-deployment.yaml" ghlink="/docs/user-guide/nginx-lifecycle-deployment.yaml" %}

## Termination message

In order to achieve a reasonably high level of availability, especially for actively developed applications, it's important to debug failures quickly. Kubernetes can speed debugging by surfacing causes of fatal errors in a way that can be display using [`kubectl`](/docs/user-guide/kubectl/kubectl) or the [UI](/docs/user-guide/ui), in addition to general [log collection](/docs/user-guide/logging). It is possible to specify a `terminationMessagePath` where a container will write its 'death rattle'?, such as assertion failure messages, stack traces, exceptions, and so on. The default path is `/dev/termination-log`.

Here is a toy example:

{% include code.html language="yaml" file="pod-w-message.yaml" ghlink="/docs/user-guide/pod-w-message.yaml" %}

The message is recorded along with the other state of the last (i.e., most recent) termination:

```shell{% raw %}
$ kubectl create -f ./pod-w-message.yaml
pod "pod-w-message" created
$ sleep 70
$ kubectl get pods/pod-w-message -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"
Sleep expired
$ kubectl get pods/pod-w-message -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.exitCode}}{{end}}"
0
{% endraw %}```

## What's next?

[Learn more about managing deployments.](/docs/user-guide/managing-deployments)
