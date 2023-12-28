---
reviewers:
- jsafrane
title: Create static Pods
weight: 220
content_type: task
---

<!-- overview -->


*Static Pods* are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Unlike Pods that are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}});
instead, the kubelet watches each static Pod (and restarts it if it fails).

Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.
The Pod names will be suffixed with the node hostname with a leading hyphen.

{{< note >}}
If you are running clustered Kubernetes and are using static
Pods to run a Pod on every node, you should probably be using a
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} instead.
{{< /note >}}

{{< note >}}
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
{{< /note >}}

{{< note >}}
Static pods do not support [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/).
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

This page assumes you're using {{< glossary_tooltip term_id="cri-o" >}} to run Pods,
and that your nodes are running the Fedora operating system.
Instructions for other distributions or Kubernetes installations may vary.

<!-- steps -->

## Create a static pod {#static-pod-creation}

You can configure a static Pod with either a
[file system hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#configuration-files)
or a [web hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http).

### Filesystem-hosted static Pod manifest {#configuration-files}

Manifests are standard Pod definitions in JSON or YAML format in a specific directory.
Use the `staticPodPath: <the directory>` field in the
[kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/),
which periodically scans the directory and creates/deletes static Pods as YAML/JSON files appear/disappear there.
Note that the kubelet will ignore files starting with dots when scanning the specified directory.

For example, this is how to start a simple web server as a static Pod:

1. Choose a node where you want to run the static Pod. In this example, it's `my-node1`.

    ```shell
    ssh my-node1
    ```

1. Choose a directory, say `/etc/kubernetes/manifests` and place a web server
   Pod definition there, for example `/etc/kubernetes/manifests/static-web.yaml`:

   ```shell
   # Run this command on the node where kubelet is running
   mkdir -p /etc/kubernetes/manifests/
   cat <<EOF >/etc/kubernetes/manifests/static-web.yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: static-web
     labels:
       role: myrole
   spec:
     containers:
       - name: web
         image: nginx
         ports:
           - name: web
             containerPort: 80
             protocol: TCP
   EOF
   ```

1. Configure the kubelet on that node to set a `staticPodPath` value in the
   [kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/).  
   See [Set Kubelet Parameters Via A Configuration File](/docs/tasks/administer-cluster/kubelet-config-file/)
   for more information.

   An alternative and deprecated method is to configure the kubelet on that node
   to look for static Pod manifests locally, using a command line argument.
   To use the deprecated approach, start the kubelet with the  
   `--pod-manifest-path=/etc/kubernetes/manifests/` argument.
      
1. Restart the kubelet. On Fedora, you would run:

   ```shell
   # Run this command on the node where the kubelet is running
   systemctl restart kubelet
   ```

### Web-hosted static pod manifest {#pods-created-via-http}

Kubelet periodically downloads a file specified by `--manifest-url=<URL>` argument
and interprets it as a JSON/YAML file that contains Pod definitions.
Similar to how [filesystem-hosted manifests](#configuration-files) work, the kubelet
refetches the manifest on a schedule. If there are changes to the list of static
Pods, the kubelet applies them.

To use this approach:

1. Create a YAML file and store it on a web server so that you can pass the URL of that file to the kubelet.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    ```

1. Configure the kubelet on your selected node to use this web manifest by
   running it with `--manifest-url=<manifest-url>`.
   On Fedora, edit `/etc/kubernetes/kubelet` to include this line:

   ```shell
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<manifest-url>"
   ```

1. Restart the kubelet. On Fedora, you would run:

   ```shell
   # Run this command on the node where the kubelet is running
   systemctl restart kubelet
   ```

## Observe static pod behavior {#behavior-of-static-pods}

When the kubelet starts, it automatically starts all defined static Pods. As you have
defined a static Pod and restarted the kubelet, the new static Pod should
already be running.

You can view running containers (including static Pods) by running (on the node):
```shell
# Run this command on the node where the kubelet is running
crictl ps
```

The output might be something like:

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

{{< note >}}
`crictl` outputs the image URI and SHA-256 checksum. `NAME` will look more like:
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`.
{{< /note >}}

You can see the mirror Pod on the API server:

```shell
kubectl get pods
```
```
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

{{< note >}}
Make sure the kubelet has permission to create the mirror Pod in the API server.
If not, the creation request is rejected by the API server.
{{< /note >}}

{{< glossary_tooltip term_id="label" text="Labels" >}} from the static Pod are
propagated into the mirror Pod. You can use those labels as normal via
{{< glossary_tooltip term_id="selector" text="selectors" >}}, etc.

If you try to use `kubectl` to delete the mirror Pod from the API server,
the kubelet _doesn't_ remove the static Pod:

```shell
kubectl delete pod static-web-my-node1
```
```
pod "static-web-my-node1" deleted
```
You can see that the Pod is still running:
```shell
kubectl get pods
```
```
NAME                  READY   STATUS    RESTARTS   AGE
static-web-my-node1   1/1     Running   0          4s
```

Back on your node where the kubelet is running, you can try to stop the container manually.
You'll see that, after a time, the kubelet will notice and will restart the Pod
automatically:

```shell
# Run these commands on the node where the kubelet is running
crictl stop 129fd7d382018 # replace with the ID of your container
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```
Once you identify the right container, you can get the logs for that container with `crictl`:

```shell
# Run these commands on the node where the container is running
crictl logs <container_id>
```

```console
10.240.0.48 - - [16/Nov/2022:12:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nov/2022:12:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nove/2022:12:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

To find more about how to debug using `crictl`, please visit
[_Debugging Kubernetes nodes with crictl_](/docs/tasks/debug/debug-cluster/crictl/).

## Dynamic addition and removal of static pods

The running kubelet periodically scans the configured directory
(`/etc/kubernetes/manifests` in our example) for changes and
adds/removes Pods as files appear/disappear in this directory.

```shell
# This assumes you are using filesystem-hosted static Pod configuration
# Run these commands on the node where the container is running
#
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# You see that no nginx container is running
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```
```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```
## {{% heading "whatsnext" %}}

* [Generate static Pod manifests for control plane components](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [Generate static Pod manifest for local etcd](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [Debugging Kubernetes nodes with `crictl`](/docs/tasks/debug/debug-cluster/crictl/)
* [Learn more about `crictl`](https://github.com/kubernetes-sigs/cri-tools).
* [Map `docker` CLI commands to `crictl`](/docs/reference/tools/map-crictl-dockercli/).
* [Set up etcd instances as static pods managed by a kubelet](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)

