---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
---

{% capture overview %}

This page shows how to use StatefulSets to run workloads that typically run on
virtual machines (VMs).

{% endcapture %}


{% capture objectives %}

* Learn about the differences between VMs and
[StatefulSets](/docs/user-guide/petset). *TODO: replace this link with the new stateful set concept guide*

* Learn about the similarities of VMs and StatefulSets.

* Learn about the runtime initialization of StatefulSets.

* Run a VM-style workload by using a StatefulSet and a Kubernetes a feature called
[init containers](http://kubernetes.io/docs/user-guide/production-pods/#handling-initialization).

* Run a StatefulSet of nginx servers, and specify one server as the master.

* Illustrate two patterns that are common in stateful applications:

    * Transferring state across application restart, so that a future incarnation of
    the application gets initialized with the computations of its past incarnation.

    * Initializing the runtime environment of a stateful app based on existing conditions,
    like a list of currently healthy peers.

{% endcapture %}


{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* Your Kubernetes cluster must be running Kubernetes version 1.5 or later.

* Familiarize yourself with the terminology in
[StatefulSet concept document](/docs/user-guide/petset). *TODO: replace this link to the new stateful set concept guide*

{% endcapture %}


{% capture lessoncontent %}

### Characteristics of VMs and StatefulSets

Kubernetes [Pods](/docs/user-guide/pods/) are different from VMs, specifically:

* With VMs, you migrate; with Pods, you start a replacement with a different IP address.
* VMs automatically get persistent storage; Pods need to explicitly ask for it by name.

### Simulating VMs

A Pod in a StatefulSet simulates a VM in the sense that it has a consistent
identity. Just as a VM has a consistent identity across migrations, each Pod in a
StatefulSet has a consistent identity across restarts.

To further simulate a VM, a Pod needs a way to initialize its user environment
when the the Pod starts. Also, tools like `kubectl exec` must not be allowed to
enter the Pod's application container until after the user environment is
initialized.

### Transferring state across application restart

Traditional applications that incrementally build state usually need strong
guarantees that they will run for an extended period of time without being
restarted. This is tricky to achieve with applications that run in containers.

Instead of guaranteeing that containers will not be restarted, Kubernetes provides
a way to ensure that when a container stops and restarts, all of of the state
accumulated by the stopped container is transferred to the future container. The
resource that provides this capability is the StatefulSet.

In this portion of the tutorial, you create a StatefulSet based on this
configuration file:

{% include code.html language="yaml" file="statefulset_vm.yaml" ghlink="/docs/tutorials/stateful-application/statefulset_vm.yaml" %}

1. Create the StatefulSet:

        export REPO=https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master
        kubectl create -f $REPO/docs/tutorials/stateful-application/statefulset_vm.yaml

    Output:

        service "ub" created
        statefulset "vm" created

1. Verify that the StatefulSet has two Pods:

        kubectl get pods

    The output is similar to this:

        NAME      READY     STATUS     RESTARTS   AGE
        vm-0      1/1       Running    0          37s
        vm-1      1/1       Running    0          2m

1. Get a shell to the application container running in Pod vm-0:

        kubectl exec -it vm-0 /bin/sh

1. In your vm-0 shell, install nginx:

        vm-0 # apt-get update
        vm-0 # apt-get install nginx -y

1. Delete Pod vm-0:

        kubectl delete pods vm-0

1. Because the Pod belongs to a StatefulSet, it gets recreated with all of the
StatefulSet properties, as well as the installed nginx packages.

    Verify that Pod vm-0 has been recreated:

        kubectl get pods

1. Get a shell to the application container running in the new Pod:

        kubectl exec -it vm-0 /bin/sh

1. In your shell, verify that nginx is installed by starting nginx:

        vm-0 # mkdir -p /var/log/nginx /var/lib/nginx; nginx -g 'daemon off;'

1. Get a shell to the application container running in Pod vm-1:

        kubectl exec -it vm-1 /bin/sh

1. In your vm-1 shell, install netcat:

        vm-1 # apt-get update
        vm-1 # apt-get install netcat -y

1. Access Pod vm-0 from Pod vm-1:

        vm-1 # printf "GET / HTTP/1.0\r\n\r\n" | netcat vm-0.ub 80

It's worth exploring what just happened. The init container runs before
the application container runs. The init container copies shared libraries
from the rootfs, while preserving user-installed packages.

Note: The command in the init container must be idempotent, or it could corrupt
data stored by a previous incarnation.

        pod.alpha.kubernetes.io/init-containers: '[
            {
                "name": "rootfs",
                "image": "ubuntu:15.10",
                "command": [
                    "/bin/sh",
                    "-c",
                    "for d in usr lib etc; do cp -vnpr /$d/* /${d}mnt; done;"
                ],
                "volumeMounts": [
                    {
                        "name": "usr",
                        "mountPath": "/usrmnt"
                    },
                    {
                        "name": "lib",
                        "mountPath": "/libmnt"
                    },
                    {
                        "name": "etc",
                        "mountPath": "/etcmnt"
                    }
                ]
            }
        ]'


### Initializing state based on environment

Most clustered applications, such as MySQL, require an administrator to create
a configuration file based on the current state of the world. The most common
dynamic variable in a configuration file is a list of peers running similar
database servers that are currently serving requests.

The [StatefulSet user guide](/docs/user-guide/petset#peer-discovery)
touches on this idea.
*TODO: replace this link with the new StatefulSet concept guide*

In this portion of the tutorial, you create a StatefulSet of nginx servers, and
you make one of them a master. The other nginx servers will proxy requests to
the master. See
[user guide](/docs/user-guide/petset).
*TODO: replace this link with the new StatefulSet concept guide*

The StatefulSet uses the
[peer-finder](https://github.com/kubernetes/contrib/tree/master/pets/peer-finder)
helper script to handle peer discovery.

The peer finder takes three important arguments:

* A DNS domain.
* An `on-start` script to run with the initial constituency of the given domain as input.
* An `on-change` script to run every time the constituency of the given domain changes.

The peer finder performs these actions:

* Poll DNS for SRV records of a given domain till the `hostname` of the Pod it's
running in shows up as a subdomain.

* Pipe the sorted list of subdomains to the script specified by its `--on-start`
argument.

* Exit with the appropriate error code if no `--on-change` script is specified.

* Loop, invoking `--on-change` for every change.

The nginx StatefulSet is based on this configuration file:

{% include code.html language="yaml" file="statefulset_peers.yaml" ghlink="/docs/tutorials/stateful-application/statefulset_peers.yaml" %}

1. Create the StatefulSet of nginx servers:

        export REPO=https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master
        kubectl create -f $REPO/docs/tutorials/stateful-application/statefulset_peers.yaml

    Output:

        service "nginx" created
        statefulset "web" created

1. Watch the Pods:

        kubectl get pods --watch-only

    Output:

        NAME      READY     STATUS    RESTARTS   AGE
        web-0     0/1       Pending   0          7s
        web-0     0/1       Init:0/1   0         18s
        web-0     0/1       PodInitializing   0         20s
        web-0     1/1       Running   0         21s
        web-1     0/1       Pending   0         0s
        web-1     0/1       Init:0/1   0         0s
        web-1     0/1       PodInitializing   0         20s
        web-1     1/1       Running   0         21s

1. List the Pods:

        kubectl get pods

    Output:

        NAME      READY     STATUS    RESTARTS   AGE
        web-0     1/1       Running   0          1m
        web-1     1/1       Running   0          47s

1. Verify that web-1 redirects requests to the master:

        $ kubectl exec -it web-1 -- curl localhost

    Output:

        web-0

1. If you scale the cluster, the new Pods have the same master. To test this,
set the `replicas` field to 5:

        kubectl scale statefulset web --replicas=5

1. List the nginx Pods:

        kubectl get pods -l app=nginx

    Output:

        NAME      READY     STATUS    RESTARTS   AGE
        web-0     1/1       Running   0          2h
        web-1     1/1       Running   0          2h
        web-2     1/1       Running   0          1h
        web-3     1/1       Running   0          1h
        web-4     1/1       Running   0          1h

1. Verify that all Pods have the same master:

        for i in $(seq 0 4); do kubectl exec -it web-$i -- curl localhost; done | sort | uniq

It's important to understand that the nginx config file is generated by passing
an init script to the peer finder:

    echo `
    readarray PEERS;
    if [ 1 = ${#PEERS[@]} ]; then
        echo \"events{} http { server{ } }\";
    else
        echo \"events{} http { server{ location / { proxy_pass http://${PEERS[0]}; } } }\";
    fi;` > /conf/nginx.conf

The script performs these actions:

* Read a list of peers from stdin.
* If there's only one, promote it to master.
* If there's more than one, proxy requests to the 0th member of the list.
* Write the config to a `hostPath` volume shared with the parent StatefulSet.

**Important:** In practice all Pods should query their peers for the current
master, instead of making assumptions based on the index.

{% endcapture %}


{% capture whatsnext %}

* You can deploy some example StatefulSets found
[here](https://github.com/kubernetes/kubernetes/tree/master/test/e2e/testing-manifests/petset),
or write your own.

{% endcapture %}

{% include templates/tutorial.md %}
