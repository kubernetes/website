---
---

* TOC
{:toc}

## Overview

This purpose of this guide is to help you become familiar with the runtime initialization of [Pet Sets](/docs/user-guide/petset). This guide assumes the same prerequisites, and uses the same terminology as the [Pet Set user document](/docs/user-guide/petset).

The most common way to initialize the runtime in a containerized environment, is through a custom [entrypoint](https://docs.docker.com/engine/reference/builder/#entrypoint). While this is not necessarily bad, making your application pid 1, and treating containers as processes in general is good for a few reasons outside the scope of this document. Doing so allows you to run docker images from third-party vendors without modification. We will not be writing custom entrypoints for this example, but using a feature called [init containers](http://releases.k8s.io/{{page.githubbranch}}/docs/proposals/container-init.md), to explain 2 common patterns that come up deploying Pet Sets.

1. Transferring state across Pet restart, so that a future Pet is initialized with the computations of its past incarnation
2. Initializing the runtime environment of a Pet based on existing conditions, like a list of currently healthy peers

## Example I: transferring state across Pet restart

This example shows you how to "carry over" runtime state across Pet restart by simulating virtual machines with a Pet Set.

### Background

Applications that incrementally build state usually need strong guarantees that they will not restart for extended durations. This is tricky to achieve with containers, so instead, we will ensure that the results of previous computations are trasferred to future pets. Doing so is straight-forward using vanilla Persistent Volumes (which Pet Set already gives you), unless the volume mount point itself needs to be initialized for the Pet to start. This is exactly the case with "virtual machine" docker images, like those based on ubuntu or fedora. Such images embed the entier rootfs of the distro, including package managers like `apt-get` that assume a certain layout of the filesystem. Meaning:

* If you mount an empty volume under `/usr`, you won't be able to `apt-get`
* If you mount an empty volume under `/lib`, all your `apt-gets` will fail because there are no system libraries
* If you clobber either of those, previous `apt-get` results will be dysfunctional

### Simulating Virtual Machines

Since Pet Set already gives each Pet a consistent identity, all we need is a way to initialize the user environment before allowing tools like `kubectl exec` to enter the application container.

Download [this](petset_vm.yaml) petset into a file called petset_vm.yaml, and create it:

```shell
$ kubectl create -f petset_vm.yaml
service "ub" created
petset "vm" created
```

This should give you 2 pods.

```shell
$ kubectl get po
NAME      READY     STATUS     RESTARTS   AGE
vm-0      1/1       Running    0          37s
vm-1      1/1       Running    0          2m
```

We can exec into one and install nginx

```shell
$ kubectl exec -it vm-0 /bin/sh
vm-0 # apt-get update
...
vm-0 # apt-get install nginx -y
```

On killing this pod we need it to come back with all the Pet Set properties, as well as the installed nginx packages.

```shell
$ kubectl delete po vm-0
pod "vm-0" deleted

$ kubectl get po
NAME      READY     STATUS    RESTARTS   AGE
vm-0      1/1       Running   0          1m
vm-1      1/1       Running   0          4m
```

Now you can exec back into vm-0 and start nginx

```shell
$ kubectl exec -it vm-0 /bin/sh
vm-0 # mkdir -p /var/log/nginx /var/lib/nginx; nginx -g 'daemon off;'

```

And access it from anywhere in the cluster (and because this is an example that simulates vms, we're going to apt-get install netcat too)

```shell
$ kubectl exec -it vm-1 /bin/sh
vm-1 # apt-get update
...
vm-1 # apt-get install netcat -y
vm-1 # printf "GET / HTTP/1.0\r\n\r\n" | netcat vm-0.ub 80
```

It's worth exploring what just happened. Init containers run sequentially *before* the application container. In this example we used the init container to copy shared libraries from the rootfs, while preserving user installed packages across container restart.

```yaml
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
```

**It's important to note that the init container, when used this way, must be idempotent, or it'll end up clobbering data stored by a previous incarnation.**


## Example II: initializing state based on environment

In this example we are going to setup a cluster of nginx servers, just like we did in the Pet Set [user guide](/docs/user-guide/petset), but make one of them a master. All the other nginx servers will simply proxy requests to the master. This is a common deployment pattern for databases like Mysql, but we're going to replace the database with a stateless webserver to simplify the problem.

### Background

Most clustered applications, such as mysql, require an admin to create a config file based on the current state of the world. The most common dynamic variable in such config files is a list of peers, or other Pets running similar database servers that are currently serving requests. The Pet Set user guide already [touched on this topic](/docs/user-guide/petset#peer-discovery), we'll explore it in greater depth in the context of writing a config file with a list of peers.

Here's a tiny peer finder helper script that handles peer discovery, [available here](https://github.com/kubernetes/contrib/tree/master/pets/peer-finder). The peer finder takes 3 important arguments:

* A DNS domain
* An `on-start` script to run with the initial constituency of the given domain as input
* An `on-change` script to run everytime the constituency of the given domain changes

The role of the peer finder:

* Poll DNS for SRV records of a given domain till the `hostname` of the pod it's running in shows up as a subdomain
* Pipe the sorted list of subdomains to the script specified by its `--on-start` argument
* Exit with the appropriate error code if no `--on-change` script is specified
* Loop invoking `--on-change` for every change

You can invoke the peer finder inside the Pets we created in the last example:

```shell
$ kubectl exec -it vm-0 /bin/sh
vm-0 # apt-get update
...
vm-0 # apt-get install curl -y
vm-0 # curl -sSL -o /peer-finder https://storage.googleapis.com/kubernetes-release/pets/peer-finder
vm-0 # chmod -c 755 peer-finder

vm-0 # ./peer-finder
2016/06/23 21:25:46 Incomplete args, require -on-change and/or -on-start, -service and -ns or an env var for POD_NAMESPACE.

vm-0 # ./peer-finder -on-start 'tee' -service ub -ns default

2016/06/23 21:30:21 Peer list updated
was []
now [vm-0.ub.default.svc.cluster.local vm-1.ub.default.svc.cluster.local]
2016/06/23 21:30:21 execing: tee with stdin: vm-0.ub.default.svc.cluster.local
vm-1.ub.default.svc.cluster.local
2016/06/23 21:30:21 vm-0.ub.default.svc.cluster.local
vm-1.ub.default.svc.cluster.local
2016/06/23 21:30:22 Peer finder exiting
```

### Nginx master/slave cluster

Lets create a Pet Set that writes out its own config based on a list of peers at initalization time, as described above.

Download and create [this](petset_peers.yaml) petset. It will setup 2 nginx webservers, but the second one will proxy all requests to the first:

```shell
$ kubectl create -f petset_peers.yaml
service "nginx" created
petset "web" created

$ kubectl get po --watch-only
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          7s
web-0     0/1       Init:0/1   0         18s
web-0     0/1       PodInitializing   0         20s
web-0     1/1       Running   0         21s
web-1     0/1       Pending   0         0s
web-1     0/1       Init:0/1   0         0s
web-1     0/1       PodInitializing   0         20s
web-1     1/1       Running   0         21s

$ kubectl get po
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          47s
```

web-1 will redirect all requests to it's "master":

```shell
$ kubectl exec -it web-1 -- curl localhost
web-0
```

If you scale the cluster, the new pods parent themselves to the same master. To test this you can `kubectl edit` the petset and change the `replicas` field to 5:

```shell
$ kubectl edit petset web
... 

$ kubectl get po -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2h
web-1     1/1       Running   0          2h
web-2     1/1       Running   0          1h
web-3     1/1       Running   0          1h
web-4     1/1       Running   0          1h

$ for i in $(seq 0 4); do kubectl exec -it web-$i -- curl localhost; done | sort | uniq
web-0
```

Understanding how we generated the nginx config is important, we did so by passing an init script to the peer finder:

```shell
echo `
readarray PEERS;
if [ 1 = ${#PEERS[@]} ]; then
  echo \"events{} http { server{ } }\";
else
  echo \"events{} http { server{ location / { proxy_pass http://${PEERS[0]}; } } }\";
fi;` > /conf/nginx.conf
```

All that does is:

* read in a list of peers from stdin
* if there's only 1, promote it to master
* if there's more than 1, proxy requests to the 0th member of the list
* write the config to a `hostPath` volume shared with the parent PetSet

**It's important to note that in practice all Pets should query their peers for the current master, instead of making assumptions based on the index.**

## Next Steps

You can deploy some example Pet Sets found [here](https://github.com/kubernetes/kubernetes/tree/master/test/e2e/testing-manifests/petset), or write your own.
