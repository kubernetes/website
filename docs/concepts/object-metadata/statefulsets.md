---
---

{% capture overview %}
**StatefulSets are a beta feature in 1.5. This feature replaces the deprecated 
PetSets feature from 1.4. Users of PetSets are referred to the 1.5 
[Upgrade Guide](/docs/task/upgrade-to-statefulset)
for further information on how to upgrade existing PetSets to StatefulSets.**

A StatefulSet is a Controller that ensures that, at most, a given number of
replicas of a Pod are running at a time. Pods in a Stateful Set have an ordinal
(a unique integer index in the StatefulSet), a stable, unique network id that is 
avialable in DNS, and stable, persistent storage.

For a StatefulSet with N replicas, when Pods are being deployed, they are 
created sequentially, in order from {0..N-1}. Before a new Pod is deployed, all 
of its predecessors must be [Running and Ready](/docs/user-guide/pod-states). 
When Pods are being deleted, they are terminated in reverse order, from {N-1..0}, 
and no pod is terminated until its successors have been terminated and are
completely shutdown or its [Termination Grace Period](/docs/user-guide/pods/index#termination-of-pods))
has elapsed.

The exmpale below demonstrates the components of a StatefulSet. 

* A [Headless Service](/docs/user-guide/services/#headless-services), named nginx, is used to control the network domain. 
* The StatefulSet, named web, has a Spec that indicates that 3 replicas of the nginx container will be launched in unique Pods.
* The volumeClaimTemplates, will provide stable storage using [Persistent Volumes](/docs/user-guide/volumes/) provisioned by a 
 [Persistent Volume Provisioner](http://releases.k8s.io/{{page.githubbranch}}/examples/experimental/persistent-volume-provisioning/README.md).

```yaml
---
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
      annotations:
        pod.alpha.kubernetes.io/initialized: "true"
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
        volume.alpha.kubernetes.io/storage-class: anything
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```

{% endcapture %}

{% capture body %}
### When to Use a Stateful Set
StatefulSets are valuable for applications that require one or more of the 
following.

* Stable, unique network identifiers.
* Stable, persistent storage.
* Ordered, graceful deployment and scaling.
* Ordered, graceful deletion and termination.

As it is generally easier to manage, if an application doesn't require any of 
the above garuantees, and if it is feasible to do so, it should be deployed as 
a set of stateless replicas.

### Limitations
* StatefulSet is a beta resource, not available in any Kubernetes release prior to 1.5.
* As with all alpha/beta resources, it can be disabled through the `--runtime-config` option passed to the apiserver.
* The only updatable field on a StatefulSet is `replicas`
* The storage for a given pet must either be provisioned by a [Persistent Volume Provisioner](http://releases.k8s.io/{{page.githubbranch}}/examples/experimental/persistent-volume-provisioning/README.md) based on the requested `storage class`, or pre-provisioned by an admin.
* Deleting and/or scaling a StatefulSet down will *not* delete the volumes associated with the StatefulSet. This is done to ensure safety first, your data is more valuable than an auto purge of all related PetSet resources. **Deleting the Persistent Volume Claims will result in a deletion of the associated volumes**.
* All StatefulSets currently require a [Headless Service](/docs/user-guide/services/#headless-services) to be responsible for the network identity of the pets. The user is responsible for this Service.
* Updating an existing StatefulSet is currently a manual process, meaning you either need to deploy a new StatefulSet with the new image version, or orphan Pets one by one, update their image, and join them back to the cluster.

### Pod Identity
StatefulSet Pods have a unique identity that is comprised of an ordinal, a 
stable network identity, and stable storage. The identity sticks to the Pod, 
regardless of which node it's (re) scheduled on.

__Ordinal Index__

For a StatefulSet with N replicas, each Pod in the StatefulSet will be 
assinged a integer ordinal, in the range [0,N), that is unique over the Set. 

__Stable Network Id__

The hostname of a Pod in a StatefulSet is derived from the name of the 
StatefulSet and the ordinal of the Pod. The pattern for the constructed hostname 
is `$(statefulset name)-$(ordinal)`. The example above will create three Pods 
named `web-0,web-1,web-2`.
A StatelefulSet can use a [Headless Service](/docs/user-guide/services/#headless-services)
to control the domain of its Pods. The domain managed by this Service takes the form: 
`$(service name).$(namespace).svc.cluster.local`, where "cluster.local" 
is the [cluster domain](http://releases.k8s.io/{{page.githubbranch}}/build/kube-dns/README.md#how-do-i-configure-it). 
As each Pod is created, it gets a matching DNS subdomain, taking the form: 
`$(podname).$(governing service domain)`, where the governing service is defined 
by the `serviceName` field on the StatefulSet.

Here are some examples of choices for Cluster Domain, Service name, 
StatefulSet name, and how that affects the DNS names for the StatefulSet's Pods.

Cluster Domain | Service (ns/name) | PetSet (ns/name)  | PetSet Domain  | Pet DNS | Pet Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

Note that Cluster Domain will be set to `cluster.local` unless [otherwise configured](http://releases.k8s.io/{{page.githubbranch}}/build/kube-dns/README.md#how-do-i-configure-it).

__Stable Storage__

[Persistent Volumes](/docs/user-guide/volumes/), one for each VolumeClaimTemplate, 
are created based on the `volumeClaimTemplates` field of the StatefulSet. In the 
example above, each Pod will recieve a single persistent volume with a storage 
class of anything and 1 Gib of provisioned storage. When a Pod is (re)scheculed,
its volume(s) are avialable on the node on which it is launched. Note that, the 
volumes associated with the Pods' Persistent Volume  Claims are not deleted when
the Pods, or Stateful Set are deleted. This must be done manually.

### Deployment and Scaling Garuantees
{% endcapture %}
When the exmample above is created, three Pods will be deployed in the order 
web-0, web-1, web-2. web-1 will not be deployed before web-0 is 
[Running and Ready](/docs/user-guide/pod-states), and web-2 will not be until 
web-1 is Running and Ready.

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related task](...).
{% endcapture %}

{% include templates/concept.md %}
