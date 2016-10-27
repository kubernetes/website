---
assignees:
- bprashanth
- foxish

---

* TOC
{:toc}

__Terminology__

Throughout this doc you will see a few terms that are sometimes used interchangeably elsewhere, that might cause confusion. This section attempts to clarify them.

* Node: A single virtual or physical machine in a Kubernetes cluster.
* Cluster: A group of nodes in a single failure domain, unless mentioned otherwise.
* Persistent Volume Claim (PVC): A request for storage, typically a [persistent volume](/docs/user-guide/persistent-volumes/walkthrough/).
* Host name: The hostname attached to the UTS namespace of the pod, i.e the output of `hostname` in the pod.
* DNS/Domain name: A *cluster local* domain name resolvable using standard methods (eg: [gethostbyname](http://linux.die.net/man/3/gethostbyname)).
* Ordinality: the property of being "ordinal", or occupying a position in a sequence.
* Pet: a single member of a PetSet; more generally, a stateful application.
* Peer: a process running a server, capable of communicating with other such processes.

__Prerequisites__

This doc assumes familiarity with the following Kubernetes concepts:

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/admin/dns/)
* [Headless Services](/docs/user-guide/services/#headless-services)
* [Persistent Volumes](/docs/user-guide/volumes/)
* [Persistent Volume Provisioning](http://releases.k8s.io/{{page.githubbranch}}/examples/experimental/persistent-volume-provisioning/README.md)

You need a working Kubernetes cluster at version >= 1.3, with a healthy DNS [cluster addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md) at version >= 15. You cannot use PetSet on a hosted Kubernetes provider that has disabled `alpha` resources.

## What is a PetSet?

In Kubernetes, most pod management abstractions group them into disposable units of work that compose a micro service. Replication controllers for example, are designed with a weak guarantee - that there should be N replicas of a particular pod template. The pods are treated as stateless units, if one of them is unhealthy or superseded by a newer version, the system just disposes it.

```
    foo.default.svc.cluster.local
             |service|
             /       \
    | pod-asdf |    | pod-zxcv |
```

A PetSet, in contrast, is a group of stateful pods that require a stronger notion of identity. The document refers to these as "clustered applications".

```
   *.foo.default.svc.cluster.local
    | mysql-0 | <-> | mysql-1 |
      [pv 0]          [pv 1]
```

The co-ordinated deployment of clustered applications is notoriously hard. They require stronger notions of identity and membership, which they use in opaque internal protocols, and are especially prone to race conditions and deadlock. Traditionally administrators have deployed these applications by leveraging nodes as stable, long-lived entities with persistent storage and static ips.

The goal of PetSet is to decouple this dependency by assigning identities to individual instances of an application that are not anchored to the underlying physical infrastructure. For the rest of this document we will refer to these entities as "Pets". Our use of this term is predated by the "Pets vs Cattle" analogy.

__Relationship between Pets and Pods__: PetSet requires there be {0..N-1} Pets. Each Pet has a deterministic name - PetSetName-Ordinal, and a unique identity. Each Pet has at most one pod, and each PetSet has at most one Pet with a given identity.

## When to use PetSet?

A PetSet ensures that a specified number of "pets" with unique identities are running at any given time. The identity of a Pet is comprised of:

* a stable hostname, available in DNS
* an ordinal index
* stable storage: linked to the ordinal & hostname

These properties are useful in deploying stateful applications. However most stateful applications are also clustered, meaning they form groups with strict membership requirements that rely on stored state. PetSet also helps with the 2 most common problems encountered managing such clustered applications:

* discovery of peers for quorum
* startup/teardown ordering

Only use PetSet if your application requires some or all of these properties. Managing pods as stateless replicas is vastly easier.

Example workloads for PetSet:

* Databases like MySQL or PostgreSQL that require a single instance attached to a NFS persistent volume at any time
* Clustered software like Zookeeper, Etcd, or Elasticsearch that require stable membership.

## Alpha limitations

Before you start deploying applications as PetSets, there are a few limitations you should understand.

* PetSet is an *alpha* resource, not available in any Kubernetes release prior to 1.3.
* As with all alpha/beta resources, it can be disabled through the `--runtime-config` option passed to the apiserver, and in fact most likely will be disabled on hosted offerings of Kubernetes.
* The only updatable field on a PetSet is `replicas`
* The storage for a given pet must either be provisioned by a [persistent volume provisioner](http://releases.k8s.io/{{page.githubbranch}}/examples/experimental/persistent-volume-provisioning/README.md) based on the requested `storage class`, or pre-provisioned by an admin. Note that persistent volume provisioning is also currently in alpha.
* Deleting and/or scaling a PetSet down will *not* delete the volumes associated with the PetSet. This is done to ensure safety first, your data is more valuable than an auto purge of all related PetSet resources. **Deleting the Persistent Volume Claims will result in a deletion of the associated volumes**.
* All PetSets currently require a "governing service", or a Service responsible for the network identity of the pets. The user is responsible for this Service.
* Updating an existing PetSet is currently a manual process, meaning you either need to deploy a new PetSet with the new image version, or orphan Pets one by one, update their image, and join them back to the cluster.

## Example PetSet

We'll create a basic PetSet to demonstrate how Pets are assigned unique and "sticky" identities.

{% include code.html language="yaml" file="petset.yaml" ghlink="/docs/user-guide/petset.yaml" %}

Saving this config into `petset.yaml` and submitting it to a Kubernetes cluster should create the defined PetSet and Pets it manages:

```shell
$ kubectl create -f petset.yaml
service "nginx" created
petset "nginx" created
```

## Pet Identity

The identity of a Pet sticks to it, regardless of which node it's (re) scheduled on. We can examine the identity of the pets we just created.

### Ordinal index

you should see 2 pods with predictable names formatted thus: `$(petset name)-$(ordinal index assigned by petset controller)`

```shell
$ kubectl get po
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          10m
web-1     1/1       Running   0          10m
```

### Stable storage

2 persistent volumes, one per pod. This is auto created by the PetSet based on the `volumeClaimTemplate` field

```shell
$ kubectl get pv
NAME                                       CAPACITY   ACCESSMODES   STATUS    CLAIM               REASON    AGE
pvc-90234946-3717-11e6-a46e-42010af00002   1Gi        RWO           Bound     default/www-web-0             11m
pvc-902733c2-3717-11e6-a46e-42010af00002   1Gi        RWO           Bound     default/www-web-1             11m
```

### Network identity

The network identity has 2 parts. First, we created a headless Service that controls the domain within which we create Pets. The domain managed by this Service takes the form: `$(service name).$(namespace).svc.cluster.local`, where "cluster.local" is the [cluster domain](http://releases.k8s.io/{{page.githubbranch}}/build/kube-dns/README.md#how-do-i-configure-it). As each pet is created, it gets a matching DNS subdomain, taking the form: `$(petname).$(governing service domain)`, where the governing service is defined by the `serviceName` field on the PetSet.

Here are some examples of choices for Cluster Domain, Service name, PetSet name, and how that affects the DNS names for the Pets and the hostnames in the Pet's pods:

Cluster Domain | Service (ns/name) | PetSet (ns/name)  | PetSet Domain  | Pet DNS | Pet Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

Note that Cluster Domain will be set to `cluster.local` unless [otherwise configured](http://releases.k8s.io/{{page.githubbranch}}/build/kube-dns/README.md#how-do-i-configure-it).

Let's verify our assertion with a simple test.

```shell
$ kubectl get svc
NAME          CLUSTER-IP     EXTERNAL-IP       PORT(S)   AGE
nginx         None           <none>            80/TCP    12m
...
```

First, the PetSet provides a stable hostname:

```shell
$ for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
web-0
web-1
```

And the hostname is linked to the in-cluster DNS address:

```shell
$ kubectl run -i --tty --image busybox dns-test --restart=Never /bin/sh
dns-test # nslookup web-0.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.180.3.5

dns-test # nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.180.0.9
```

The containers are running nginx webservers, which by default will look for an index.html file in `/usr/share/nginx/html/index.html`. That directory is backed by a `PersistentVolume` created by the PetSet. So let's write our hostname there:

```shell
$ for i in 0 1; do
  kubectl exec web-$i -- sh -c 'echo $(hostname) > /usr/share/nginx/html/index.html';
done
```

And verify each webserver serves its own hostname:

```shell
$ for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

Now delete all pods in the petset:

```shell
$ kubectl delete po -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```

Wait for them to come back up, and try to retrieve the previously written hostname through the DNS name of the peer. They match, because the storage, DNS name, and hostname stick to the Pet no matter where it gets scheduled:

```shell
$ kubectl exec -it web-1 -- curl web-0.nginx
web-0
$ kubectl exec -it web-0 -- curl web-1.nginx
web-1
```

## Peer discovery

A pet can piece together its own identity:

1. Use the [downward api](/docs/user-guide/downward-api/) to find its pod name
2. Run `hostname` to find its DNS name
3. Run `mount` or `df` to find its volumes (usually this is unnecessary)

It's not necessary to "discover" the governing Service of a PetSet, since it's known at creation time you can simply pass it down through an [environment variable](/docs/user-guide/environment-guide).

Usually pets also need to find their peers. In the previous nginx example, we just used `kubectl` to get the names of existing pods, and as humans, we could tell which ones belonged to a given PetSet. Another way to find peers is by contacting the API server, just like `kubectl`, but that has several disadvantages (you end up implementing a Kubernetes specific init system that runs as pid 1 in your application container).

PetSet gives you a way to discover your peers using DNS records. To illustrate this we can use the previous example (note: one usually doesn't `apt-get` in a container).

```shell
$ kubectl exec -it web-0 /bin/sh
web-0 # apt-get update && apt-get install -y dnsutils
...

web-0 # nslookup -type=srv nginx.default
Server:		10.0.0.10
Address:	10.0.0.10#53

nginx.default.svc.cluster.local	service = 10 50 0 web-1.ub.default.svc.cluster.local.
nginx.default.svc.cluster.local	service = 10 50 0 web-0.ub.default.svc.cluster.local.
```

## Updating a PetSet

You cannot update any field of the PetSet except `spec.replicas` and the `containers` in the podTemplate. Updating `spec.replicas` will scale the PetSet, updating `containers` will not have any effect till a Pet is deleted, at which time it is recreated with the modified podTemplate.

## Scaling a PetSet

You can scale a PetSet by updating the "replicas" field. Note however that the controller will only:

1. Create one pet at a time, in order from {0..N-1}, and wait till each one is in [Running and Ready](/docs/user-guide/pod-states) before creating the next
2. Delete one pet at a time, in reverse order from {N-1..0}, and wait till each one is completely shutdown (past its [terminationGracePeriodSeconds](/docs/user-guide/pods/index#termination-of-pods)) before deleting the next

```shell
$ kubectl get po
NAME     READY     STATUS    RESTARTS   AGE
web-0    1/1       Running   0          30s
web-1    1/1       Running   0          36s

$ kubectl patch petset web -p '{"spec":{"replicas":3}}'
"web" patched

$ kubectl get po
NAME     READY     STATUS    RESTARTS   AGE
web-0    1/1       Running   0          40s
web-1    1/1       Running   0          46s
web-2    1/1       Running   0          8s
```

You can also use the `kubectl scale` command:

```shell
$ kubectl get petset
NAME      DESIRED   CURRENT   AGE
web       3         3         24m

$ kubectl scale petset web --replicas=5
petset "web" scaled

$ kubectl get po --watch-only
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          10m
web-1     1/1       Running             0          27m
web-2     1/1       Running             0          10m
web-3     1/1       Running             0          3m
web-4     0/1       ContainerCreating   0          48s

$ kubectl get petset web
NAME      DESIRED   CURRENT   AGE
web       5         5         30m
```

Note however, that scaling up to N and back down to M *will not* delete the volumes of the M-N pets, as described in the section on [deletion](#deleting-a-petset), i.e scaling back up to M creates new pets that use the same volumes. To see this in action, scale the PetSet back down to 3:

```shell
$ kubectl get po --watch-only
web-4     1/1       Terminating   0         4m
web-4     1/1       Terminating   0         4m
web-3     1/1       Terminating   0         6m
web-3     1/1       Terminating   0         6m
```

Note that we still have 5 pvcs:

```shell
$ kubectl get pvc
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-42ca5cef-8113-11e6-82f6-42010af00002   1Gi        RWO           32m
www-web-1   Bound     pvc-42de30af-8113-11e6-82f6-42010af00002   1Gi        RWO           32m
www-web-2   Bound     pvc-ba416413-8115-11e6-82f6-42010af00002   1Gi        RWO           14m
www-web-3   Bound     pvc-ba45f19c-8115-11e6-82f6-42010af00002   1Gi        RWO           14m
www-web-4   Bound     pvc-ba47674a-8115-11e6-82f6-42010af00002   1Gi        RWO           14m
```

This allows you to upgrade the image of a petset and have it come back up with the same data, as described in the next section.

## Image upgrades

PetSet currently *does not* support automated image upgrade as noted in the section on [limitations](#alpha-limitations), however you can update the `image` field of any container in the podTemplate and delete Pets one by one, the PetSet controller will recreate it with the new image.

Edit the image on the PetSet to `gcr.io/google_containers/nginx-slim:0.7` and delete 1 Pet:

```shell{% raw %}
$ for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8

$ kubectl delete po web-0
pod "web-0" deleted

$ for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8
{% endraw %}```

Delete the remaining 2:

```shell
$ kubectl delete po web-1 web-2
pod "web-1" deleted
pod "web-2" deleted
```

Wait till the PetSet is stable and check the images:

```shell{% raw %}
$ for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
{% endraw %}```

## Deleting a PetSet

Deleting a PetSet through kubectl will scale it down to 0, thereby deleting all the Pets. If you wish to delete just the PetSet and not the Pets, use `--cascade=false`:

```shell
$ kubectl delete -f petset.yaml --cascade=false
petset "web" deleted

$ kubectl get po -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          21h
web-1     1/1       Running   0          21h

$ kubectl delete po -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```

Deleting the pods will *not* delete the volumes. Until we finalize the recycle policy for these volumes they will have to get cleaned up by an admin. This is to ensure that you have the chance to copy data off the volume before deleting it. Simply deleting the PVC after the pods have left the [terminating state](/docs/user-guide/pods/index#termination-of-pods) should trigger deletion of the backing Persistent Volumes.

**Note: you will lose all your data once the PVC is deleted, do this with caution.**

```shell
$ kubectl get po -l app=nginx
$ kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-62d271cd-3822-11e6-b1b7-42010af00002   0                        21h
www-web-1   Bound     pvc-62d6750e-3822-11e6-b1b7-42010af00002   0                        21h

$ kubectl delete pvc -l app=nginx
$ kubectl get pv
```

If you simply want to clean everything:

```shell{% raw %}
$ grace=$(kubectl get po web-0 --template '{{.spec.terminationGracePeriodSeconds}}')
$ kubectl delete petset,po -l app=nginx
$ sleep $grace
$ kubectl delete pvc -l app=nginx
{% endraw %}
```

## Troubleshooting

You might have noticed an `annotations` field in all the PetSets shown above.

```yaml
annotations:
  pod.alpha.kubernetes.io/initialized: "true"
```

This field is a debugging hook. It pauses any scale up/down operations on the entire PetSet. If you'd like to pause a petset after each pet, set it to `false` in the template, wait for each pet to come up, verify it has initialized correctly, and then set it to `true` using `kubectl edit` on the pet (setting it to `false` on *any pet* is enough to pause the PetSet). If you don't need it, create the PetSet with it set to `true` as shown. This is surprisingly useful in debugging bootstrapping race conditions.

## Future Work

There are a LOT of planned improvements since PetSet is still in alpha.

* Data gravity and local storage
* Richer notification events
* Public network identities
* WAN cluster deployments (multi-AZ/region/cloud provider)
* Image and node upgrades

This list goes on, if you have examples, ideas or thoughts, please contribute.

## Alternatives

Deploying one RC of size 1/Service per pod is a popular alternative, as is simply deploying a DaemonSet that utilizes the identity of a Node.

## Next steps

The deployment and maintenance of stateful applications is a vast topic. The next step is to explore cluster bootstrapping and initialization, [here](/docs/user-guide/petset/bootstrapping/).
