---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSet Basics
---

{% capture overview %}
This tutorial provides an introduction to manage applications with
[StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/). It 
demonstrates how to create, delete, scale, and update the container image of a 
StatefulSet.
{% endcapture %}

{% capture prerequisites %}
Before you begin this tutorial, you should familiarize yourself with the 
following Kubernetes concepts.

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/admin/dns/)
* [Headless Services](/docs/user-guide/services/#headless-services)
* [PersistentVolumes](/docs/user-guide/volumes/)
* [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)
* [kubectl CLI](/docs/user-guide/kubectl)

This tutorial assumes that your cluster is configured to dynamically provision 
PersistentVolumes. If your cluster is not configured to do so, you
will have to manually provision five 1 GiB volumes prior to starting this 
tutorial.
{% endcapture %}

{% capture objectives %}
StatefulSets are intended to be used with stateful applications and distributed 
systems. However, the administration of stateful applications and 
distributed systems on Kubernetes is a broad, complex topic. In order to 
demonstrate the basic features of a StatefulSet, and to not conflate the former 
topic with the latter, you will deploy a simple web application using StatefulSets.

After this tutorial, you will be familiar with the following.

* How to create a StatefulSet
* How a StatefulSet manages its Pods
* How to delete a StatefulSet
* How to scale a StatefulSet
* How to update the container image of a StatefulSet's Pods
{% endcapture %}

{% capture lessoncontent %}
## Creating a StatefulSet 

Begin by creating a StatefulSet using the example below. It is similar to the 
example presented in the
[StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/) concept. It creates 
a [Headless Service](/docs/user-guide/services/#headless-services), `nginx`, to 
control the domain of the StatefulSet, `web`. 

{% include code.html language="yaml" file="web.yaml" ghlink="/docs/tutorials/stateful-application/web.yaml" %}

Download the example above, and save it to a file named `web.yaml`

You will need to use two terminal windows. In the first terminal, use 
[`kubectl get`](/docs/user-guide/kubectl/kubectl_get/) to watch the creation 
of the StatefulSet's Pods.

```shell
kubectl get pods -w -l app=nginx
```

In the second terminal, use 
[`kubectl create`](/docs/user-guide/kubectl/kubectl_create/) to create the 
Headless Service and StatefulSet defined in `web.yaml`.

```shell
kubectl create -f web.yaml 
service "nginx" created
statefulset "web" created
```

The command above creates two Pods, each running an 
[NGINX](https://www.nginx.com) webserver. Get the `nginx` Service and the 
`web` StatefulSet to verify that they were created successfully.

```shell
kubectl get service nginx
NAME      CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     None         <none>        80/TCP    12s

kubectl get statefulset web
NAME      DESIRED   CURRENT   AGE
web       2         1         20s
```

### Ordered Pod Creation

For a StatefulSet with N replicas, when Pods are being deployed, they are 
created sequentially, in order from {0..N-1}. Examine the output of the 
`kubectl get` command in the first terminal. Eventually, the output will 
look like the example below.

```shell
kubectl get pods -w -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         19s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

Notice that the `web-0` Pod is launched and set to Pending prior to 
launching `web-1`. In fact, `web-1` is not launched until `web-0` is 
[Running and Ready](/docs/user-guide/pod-states). 

## Pods in a StatefulSet
Unlike Pods in other controllers, the Pods in a StatefulSet have a unique 
ordinal index and a stable network identity.

### Examining the Pod's Ordinal Index

Get the StatefulSet's Pods.

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m

```

As mentioned in the [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/) 
concept, the Pods in a StatefulSet have a sticky, unique identity. This identity 
is based on a unique ordinal index that is assigned to each Pod by the Stateful
Set controller. The Pods' names take the form 
`<statefulset name>-<ordinal index>`. Since the `web` StatefulSet has two 
replicas, it creates two Pods, `web-0` and `web-1`.

### Using Stable Network Identities
Each Pod has a stable hostname based on its ordinal index. Use
[`kubectl exec`](/docs/user-guide/kubectl/kubectl_exec/) to execute the 
`hostname` command in each Pod. 

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
web-0
web-1
```

Use [`kubectl run`](/docs/user-guide/kubectl/kubectl_run/) to execute 
a container that provides the `nslookup` command from the `dnsutils` package. 
Using `nslookup` on the Pods' hostnames, you can examine their in-cluster DNS 
addresses.

```shell
kubectl run -i --tty --image busybox dns-test --restart=Never --rm /bin/sh 
nslookup web-0.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.6

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.6
```

The CNAME of the headless service points to SRV records (one for each Pod that 
is Running and Ready). The SRV records point to A record entries that 
contain the Pods' IP addresses. 

In one terminal, watch the StatefulSet's Pods. 

```shell
kubectl get pod -w -l app=nginx
```
In a second terminal, use
[`kubectl delete`](/docs/user-guide/kubectl/kubectl_delete/) to delete all 
the Pods in the StatefulSet.

```shell
kubectl delete pod -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```

Wait for the StatefulSet to restart them, and for both Pods to transition to 
Running and Ready.

```shell
kubectl get pod -w -l app=nginx
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

Use `kubectl exec` and `kubectl run` to view the Pods hostnames and in-cluster 
DNS entries.

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
web-0
web-1

kubectl run -i --tty --image busybox dns-test --restart=Never --rm /bin/sh 
nslookup web-0.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.7

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.8
```

The Pods' ordinals, hostnames, SRV records, and A record names have not changed, 
but the IP addresses associated with the Pods may have changed. In the cluster 
used for this tutorial, they have. This is why it is important not to configure 
other applications to connect to Pods in a StatefulSet by IP address.


If you need to find and connect to the active members of a StatefulSet, you 
should query the CNAME of the Headless Service 
(`nginx.default.svc.cluster.local`). The SRV records associated with the 
CNAME will contain only the Pods in the StatefulSet that are Running and 
Ready.

If your application already implements connection logic that tests for 
liveness and readiness, you can use the SRV records of the Pods ( 
`web-0.nginx.default.svc.cluster.local`,
`web-1.nginx.default.svc.cluster.local`), as they are stable, and your 
application will be able to discover the Pods' addresses when they transition 
to Running and Ready.

### Writing to Stable Storage

Get the PersistentVolumeClaims for `web-0` and `web-1`.

```shell
kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```
The StatefulSet controller created two PersistentVolumeClaims that are 
bound to two [PersistentVolumes](/docs/user-guide/volumes/). As the cluster used 
in this tutorial is configured to dynamically provision PersistentVolumes, the 
PersistentVolumes were created and bound automatically.

The NGINX webservers, by default, will serve an index file at 
`/usr/share/nginx/html/index.html`. The `volumeMounts` field in the 
StatefulSets `spec` ensures that the `/usr/share/nginx/html` directory is 
backed by a PersistentVolume.

Write the Pods' hostnames to their `index.html` files and verify that the NGINX 
webservers serve the hostnames.

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'echo $(hostname) > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

In one terminal, watch the StatefulSet's Pods.

```shell
kubectl get pod -w -l app=nginx
```

In a second terminal, delete all of the StatefulSet's Pods.

```shell
kubectl delete pod -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```
Examine the output of the `kubectl get` command in the first terminal, and wait 
for all of the Pods to transition to Running and Ready.

```shell
kubectl get pod -w -l app=nginx
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

Verify the web servers continue to serve their hostnames.

```
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

Event though `web-0` and `web-1` were rescheduled, they continue to serve their 
hostnames because the PersistentVolumes associated with their Persistent 
Volume Claims are remounted to their `volumeMount`s. No matter what node `web-0`
and `web-1` are scheduled on, their PersistentVolumes will be mounted to the 
appropriate mount points.

## Scaling a StatefulSet
Scaling a StatefulSet refers to increasing or decreasing the number of replicas. 
This is accomplished by updating the `replicas` field. You can use either
[`kubectl scale`](/docs/user-guide/kubectl/kubectl_scale/) or
[`kubectl patch`](/docs/user-guide/kubectl/kubectl_patch/) to scale a Stateful 
Set.

### Scaling Up

In one terminal window, watch the Pods in the StatefulSet.

```shell
kubectl get pods -w -l app=nginx
```

In another terminal window, use `kubectl scale` to scale the number of replicas 
to 5.

```shell
kubectl scale statefulset web --replicas=5
statefulset "web" scaled
```

Examine the output of the `kubectl get` command in the first terminal, and wait 
for the three additional Pods to transition to Running and Ready.

```shell
kubectl get pods -w -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2h
web-1     1/1       Running   0          2h
NAME      READY     STATUS    RESTARTS   AGE
web-2     0/1       Pending   0          0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       ContainerCreating   0         0s
web-3     1/1       Running   0         18s
web-4     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-4     0/1       ContainerCreating   0         0s
web-4     1/1       Running   0         19s
```

The StatefulSet controller scaled the number of replicas. As with
[StatefulSet creation](#ordered-pod-creation), the StatefulSet controller
created each Pod sequentially with respect to its ordinal index, and it 
waited for each Pod's predecessor to be Running and Ready before launching the 
subsequent Pod.

### Scaling Down

In one terminal, watch the StatefulSet's Pods.

```shell
kubectl get pods -w -l app=nginx
```

In another terminal, use `kubectl patch` to scale the StatefulSet back down to 
3 replicas.

```shell
kubectl patch statefulset web -p '{"spec":{"replicas":3}}'
"web" patched
```

Wait for `web-4` and `web-3` to transition to Terminating.

```
kubectl get pods -w -l app=nginx
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3h
web-1     1/1       Running             0          3h
web-2     1/1       Running             0          55s
web-3     1/1       Running             0          36s
web-4     0/1       ContainerCreating   0          18s
NAME      READY     STATUS    RESTARTS   AGE
web-4     1/1       Running   0          19s
web-4     1/1       Terminating   0         24s
web-4     1/1       Terminating   0         24s
web-3     1/1       Terminating   0         42s
web-3     1/1       Terminating   0         42s
```

### Ordered Pod Termination

The controller deleted one Pod at a time, with respect to its ordinal index, 
in reverse order, and it waited for each to be completely shutdown before 
deleting the next.

Get the StatefulSet's PersistentVolumeClaims. 

```shell
kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h

```

There are still five PersistentVolumeClaims and five PersistentVolumes. 
When exploring a Pod's [stable storage](#stable-storage), we saw that the 
PersistentVolumes mounted to the Pods of a StatefulSet are not deleted when 
the StatefulSet's Pods are deleted. This is still true when Pod deletion is 
caused by scaling the StatefulSet down. This feature can be used to facilitate 
upgrading the container images of Pods in a StatefulSet.

## Updating Containers
As demonstrated in the [Scaling a StatefulSet](#scaling-a-statefulset) section,
the `replicas` field of a StatefulSet is mutable. The only other field of a 
StatefulSet that can be updated is the `spec.template.containers` field. 

StatefulSet currently *does not* support automated image upgrade. However, you 
can update the `image` field of any container in the podTemplate and delete 
StatefulSet's Pods one by one, the StatefulSet controller will recreate 
each Pod with the new image.

Patch the container image for the `web` StatefulSet.

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"gcr.io/google_containers/nginx-slim:0.7"}]'
"web" patched
```

Delete the `web-0` Pod.

```shell
kubectl delete pod web-0
pod "web-0" deleted
```

Watch `web-0`, and wait for the Pod to transition to Running and Ready.

```shell
kubectl get pod web-0 -w
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          54s
web-0     1/1       Terminating   0         1m
web-0     0/1       Terminating   0         1m
web-0     0/1       Terminating   0         1m
web-0     0/1       Terminating   0         1m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         3s
```

Get the Pods to view their container images.

```shell{% raw %}
for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8
{% endraw %}```

`web-0` has had its image updated. Complete the update by deleting the remaining
Pods.

```shell
kubectl delete pod web-1 web-2
pod "web-1" deleted
pod "web-2" deleted
```

Watch the Pods, and wait for all of them to transition to Running and Ready.

```
kubectl get pods -w -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          8m
web-1     1/1       Running   0          4h
web-2     1/1       Running   0          23m
NAME      READY     STATUS        RESTARTS   AGE
web-1     1/1       Terminating   0          4h
web-1     1/1       Terminating   0         4h
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-2     1/1       Terminating   0         23m
web-2     1/1       Terminating   0         23m
web-1     1/1       Running   0         4s
web-2     0/1       Pending   0         0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         36s
```

Get the Pods to view their container images.

```shell{% raw %}
for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
{% endraw %}```

All the Pods in the StatefulSet are now running a new container image.

## Deleting StatefulSets

StatefulSet supports both Non-Cascading and Cascading deletion. In a 
Non-Cascading Delete, the StatefulSet's Pods are not deleted when the Stateful
Set is deleted. In a Cascading Delete, both the StatefulSet and its Pods are 
deleted.

### Non-Cascading Delete

In one terminal window, watch the Pods in the StatefulSet.

```
kubectl get pods -w -l app=nginx
```

Use [`kubectl delete`](/docs/user-guide/kubectl/kubectl_delete/) to delete the 
StatefulSet. Make sure to supply the `--cascade=false` parameter to the 
command. This parameter tells Kubernetes to only delete the StatefulSet, and to 
not delete any of its Pods.

```shell
kubectl delete statefulset web --cascade=false
statefulset "web" deleted
```

Get the Pods to examine their status.

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```

Even though `web` has been deleted, all of the Pods are still Running and Ready.
Delete `web-0`.

```shell
kubectl delete pod web-0
pod "web-0" deleted
```

Get the StatefulSet's Pods.

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          10m
web-2     1/1       Running   0          7m
```

As the `web` StatefulSet has been deleted, `web-0` has not been relaunched.

In one terminal, watch the StatefulSet's Pods.

```
kubectl get pods -w -l app=nginx
```

In a second terminal, recreate the StatefulSet. Note that, unless
you deleted the `nginx` Service ( which you should not have ), you will see 
an error indicating that the Service already exists.

```shell
kubectl create -f web.yaml 
statefulset "web" created
Error from server (AlreadyExists): error when creating "web.yaml": services "nginx" already exists
```

Ignore the error. It only indicates that an attempt was made to create the nginx
Headless Service even though that Service already exists. 

Examine the output of the `kubectl get` command running in the first terminal.

```shell
kubectl get pods -w -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          16m
web-2     1/1       Running   0          2m
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         18s
web-2     1/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
```

When the `web` StatefulSet was recreated, it first relaunched `web-0`. 
Since `web-1` was already Running and Ready, when `web-0` transitioned to
 Running and Ready, it simply adopted this Pod. Since you recreated the StatefulSet 
 with `replicas` equal to 2, once `web-0` had been recreated, and once 
 `web-1` had been determined to already be Running and Ready, `web-2` was 
 terminated. 

Let's take another look at the contents of the `index.html` file served by the 
Pods' webservers.

```shell
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

Even though you deleted both the StatefulSet and the `web-0` Pod, it still 
serves the hostname originally entered into its `index.html` file. This is 
because the StatefulSet never deletes the PersistentVolumes associated with a 
Pod. When you recreated the StatefulSet and it relaunched `web-0`, its original 
PersistentVolume was remounted.

### Cascading Delete

In one terminal window, watch the Pods in the StatefulSet.

```shell
kubectl get pods -w -l app=nginx
```

In another terminal, delete the StatefulSet again. This time, omit the 
`--cascade=false` parameter.

```shell
kubectl delete statefulset web
statefulset "web" deleted
```
Examine the output of the `kubectl get` command running in the first terminal, 
and wait for all of the Pods to transition to Terminating.

```shell
kubectl get pods -w -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          11m
web-1     1/1       Running   0          27m
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Terminating   0          12m
web-1     1/1       Terminating   0         29m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m

```

As you saw in the [Scaling Down](#ordered-pod-termination) section, the Pods 
are terminated one at a time, with respect to the reverse order of their ordinal 
indices. Before terminating a Pod, the StatefulSet controller waits for 
the Pod's successor to be completely terminated.

Note that, while a cascading delete will delete the StatefulSet and its Pods, 
it will not delete the Headless Service associated with the StatefulSet. You
must delete the `nginx` Service manually.

```shell
kubectl delete service nginx
service "nginx" deleted
```

Recreate the StatefulSet and Headless Service one more time.

```shell
kubectl create -f web.yaml 
service "nginx" created
statefulset "web" created
```

When all of the StatefulSet's Pods transition to Running and Ready, retrieve 
the contents of their `index.html` files.

```shell
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

Even though you completely deleted the StatefulSet, and all of its Pods, the 
Pods are recreated with their PersistentVolumes mounted, and `web-0` and 
`web-1` will still serve their hostnames.

Finally delete the `web` StatefulSet and the `nginx` service.

```shell
kubectl delete service nginx
service "nginx" deleted

kubectl delete statefulset web
statefulset "web" deleted
```

{% endcapture %}

{% capture cleanup %}
You will need to delete the persistent storage media for the PersistentVolumes
used in this tutorial. Follow the necessary steps, based on your environment, 
storage configuration, and provisioning method, to ensure that all storage is 
reclaimed.
{% endcapture %}

{% include templates/tutorial.md %}
