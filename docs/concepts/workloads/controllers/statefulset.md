---
assignees:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSets
redirect_from:
- "/docs/concepts/abstractions/controllers/statefulsets/"
- "/docs/concepts/abstractions/controllers/statefulsets.html"
---

{% capture overview %}
**StatefulSets are a beta feature in 1.7. This feature replaces the 
PetSets feature from 1.4. Users of PetSets are referred to the 1.5 
[Upgrade Guide](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/)
for further information on how to upgrade existing PetSets to StatefulSets.**

A StatefulSet is a Controller that provides a unique identity to its Pods. It provides
guarantees about the ordering of deployment and scaling.
{% endcapture %}

{% capture body %}

## Using StatefulSets

StatefulSets are valuable for applications that require one or more of the 
following.

* Stable, unique network identifiers.
* Stable, persistent storage.
* Ordered, graceful deployment and scaling.
* Ordered, graceful deletion and termination.
* Ordered, automated rolling updates.

In the above, stable is synonymous with persistence across Pod (re)scheduling.
If an application doesn't require any stable identifiers or ordered deployment, 
deletion, or scaling, you should deploy your application with a controller that 
provides a set of stateless replicas. Controllers such as 
[Deployment](/docs/concepts/workloads/controllers/deployment/) or 
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) may be better suited to your stateless needs.

## Limitations
* StatefulSet is a beta resource, not available in any Kubernetes release prior to 1.5.
* As with all alpha/beta resources, you can disable StatefulSet through the `--runtime-config` option passed to the apiserver.
* The storage for a given Pod must either be provisioned by a [PersistentVolume Provisioner](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/README.md) based on the requested `storage class`, or pre-provisioned by an admin.
* Deleting and/or scaling a StatefulSet down will *not* delete the volumes associated with the StatefulSet. This is done to ensure data safety, which is generally more valuable than an automatic purge of all related StatefulSet resources.
* StatefulSets currently require a [Headless Service](/docs/concepts/services-networking/service/#headless-services) to be responsible for the network identity of the Pods. You are responsible for creating this Service.

## Components
The example below demonstrates the components of a StatefulSet. 

* A Headless Service, named nginx, is used to control the network domain. 
* The StatefulSet, named web, has a Spec that indicates that 3 replicas of the nginx container will be launched in unique Pods.
* The volumeClaimTemplates will provide stable storage using [PersistentVolumes](/docs/concepts/storage/volumes/) provisioned by a 
 PersistentVolume Provisioner.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: gcr.io/google_containers/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
      annotations:
        volume.beta.kubernetes.io/storage-class: anything
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```

## Pod Identity
StatefulSet Pods have a unique identity that is comprised of an ordinal, a 
stable network identity, and stable storage. The identity sticks to the Pod, 
regardless of which node it's (re)scheduled on.

### Ordinal Index

For a StatefulSet with N replicas, each Pod in the StatefulSet will be 
assigned an integer ordinal, in the range [0,N), that is unique over the Set. 

### Stable Network ID

Each Pod in a StatefulSet derives its hostname from the name of the StatefulSet 
and the ordinal of the Pod. The pattern for the constructed hostname 
is `$(statefulset name)-$(ordinal)`. The example above will create three Pods 
named `web-0,web-1,web-2`.
A StatefulSet can use a [Headless Service](/docs/concepts/services-networking/service/#headless-services)
to control the domain of its Pods. The domain managed by this Service takes the form: 
`$(service name).$(namespace).svc.cluster.local`, where "cluster.local" 
is the [cluster domain](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md). 
As each Pod is created, it gets a matching DNS subdomain, taking the form: 
`$(podname).$(governing service domain)`, where the governing service is defined 
by the `serviceName` field on the StatefulSet.

Here are some examples of choices for Cluster Domain, Service name, 
StatefulSet name, and how that affects the DNS names for the StatefulSet's Pods.

Cluster Domain | Service (ns/name) | StatefulSet (ns/name)  | StatefulSet Domain  | Pod DNS | Pod Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

Note that Cluster Domain will be set to `cluster.local` unless 
[otherwise configured](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md).

### Stable Storage

Kubernetes creates one [PersistentVolume](/docs/concepts/storage/volumes/) for each 
VolumeClaimTemplate. In the nginx example above, each Pod will receive a single PersistentVolume 
with a storage class of `anything` and 1 Gib of provisioned storage. When a Pod is (re)scheduled 
onto a node, its `volumeMounts` mount the PersistentVolumes associated with its 
PersistentVolume Claims. Note that, the PersistentVolumes associated with the 
Pods' PersistentVolume Claims are not deleted when the Pods, or StatefulSet are deleted. 
This must be done manually.

## Deployment and Scaling Guarantees

* For a StatefulSet with N replicas, when Pods are being deployed, they are created sequentially, in order from {0..N-1}. 
* When Pods are being deleted, they are terminated in reverse order, from {N-1..0}.
* Before a scaling operation is applied to a Pod, all of its predecessors must be Running and Ready. 
* Before a Pod is terminated, all of its successors must be completely shutdown.

The StatefulSet should not specify a `pod.Spec.TerminationGracePeriodSeconds` of 0. This practice is unsafe and strongly discouraged. For further explanation, please refer to [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).

When the nginx example above is created, three Pods will be deployed in the order 
web-0, web-1, web-2. web-1 will not be deployed before web-0 is 
[Running and Ready](/docs/user-guide/pod-states), and web-2 will not be deployed until 
web-1 is Running and Ready. If web-0 should fail, after web-1 is Running and Ready, but before 
web-2 is launched, web-2 will not be launched until web-0 is successfully relaunched and 
becomes Running and Ready. 

If a user were to scale the deployed example by patching the StatefulSet such that
`replicas=1`, web-2 would be terminated first. web-1 would not be terminated until web-2 
is fully shutdown and deleted. If web-0 were to fail after web-2 has been terminated and 
is completely shutdown, but prior to web-1's termination, web-1 would not be terminated 
until web-0 is Running and Ready.

### Pod Management Policies
In Kubernetes 1.7 and later, StatefulSet allows you to relax its ordering guarantees while 
preserving its uniqueness and identity guarantees via its `.spec.podManagementPolicy` field.

#### OrderedReady Pod Management

`OrderedReady` pod management is the default for StatefulSets. It implements the behavior 
described [above](#deployment-and-scaling-guarantees).

#### Parallel Pod Management

`Parallel` pod management tells the StatefulSet controller to launch or 
terminate all Pods in parallel, and to not wait for Pods to become Running 
and Ready or completely terminated prior to launching or terminating another 
Pod.

## Update Strategies

In Kuberentes 1.7 and later, StatefulSet's `.spec.updateStrategy` field allows you to configure 
and disable automated rolling updates for containers, labels, resource request/limits, and 
annotations for the Pods in a StatefulSet.

### On Delete

The `OnDelete` update strategy implements the legacy (1.6 and prior) behavior. It is the default 
strategy when `spec.updateStrategy` is left unspecified. When a StatefulSet's 
`.spec.updateStrategy.type` is set to `OnDelete`, the StatefulSet controller will not automatically 
update the Pods in a StatefulSet. Users must manually delete Pods to cause the controller to 
create new Pods that reflect modifications made to a StatefulSet's `.spec.template`.

### Rolling Updates

The `RollingUpdate` update strategy implements automated, rolling update for the Pods in a 
StatefulSet. When a StatefulSet's `.spec.updateStrategy.type` is set to `RollingUpdate`, the 
StatefulSet controller will delete and recreate each Pod in the StatefulSet. It will proceed 
in the same order as Pod termination (from the largest ordinal to the smallest), updating 
each Pod one at a time. It will wait until an updated Pod is Running and Ready prior to 
updating its predecessor.

#### Partitions

The `RollingUpdate` update strategy can be partitioned, by specifying a 
`.spec.updateStrategy.rollingUpdate.partition`. If a partition is specified, all Pods with an 
ordinal that is greater than or equal to the partition will be updated when the StatefulSet's 
`.spec.template` is updated. All Pods with an ordinal that is less than the partition will not 
be updated, and, even if they are deleted, they will be recreated at the previous version. If a 
StatefulSet's `.spec.updateStrategy.rollingUpdate.partition` is greater than its `.spec.replicas`, 
updates to its `.spec.template` will not be propagated to its Pods.
In most cases you will not need to use a partition, but they are useful if you want to stage an 
update, roll out a canary, or perform a phased roll out.

{% endcapture %}
{% capture whatsnext %}

* Follow an example of [deploying a stateful application](/docs/tutorials/stateful-application/basic-stateful-set). 

{% endcapture %}
{% include templates/concept.md %}
