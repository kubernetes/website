---
assignees:
- bprashanth
- janetkuo
- thockin
title: Debug Services
redirect_from:
- "/docs/user-guide/debugging-services/"
- "/docs/user-guide/debugging-services.html"
---

An issue that comes up rather frequently for new installations of Kubernetes is
that `Services` are not working properly.  You've run all your `Pods` and
`Deployments`, but you get no response when you try to access them.
This document will hopefully help you to figure out what's going wrong.

* TOC
{:toc}

## Conventions

Throughout this doc you will see various commands that you can run.  Some
commands need to be run within a `Pod`, others on a Kubernetes `Node`, and others
can run anywhere you have `kubectl` and credentials for the cluster.  To make it
clear what is expected, this document will use the following conventions.

If the command "COMMAND" is expected to run in a `Pod` and produce "OUTPUT":

```shell
u@pod$ COMMAND
OUTPUT
```

If the command "COMMAND" is expected to run on a `Node` and produce "OUTPUT":

```shell
u@node$ COMMAND
OUTPUT
```

If the command is "kubectl ARGS":

```shell
$ kubectl ARGS
OUTPUT
```

## Running commands in a Pod

For many steps here you will want to see what a `Pod` running in the cluster
sees.  You can start a busybox `Pod` and run commands in it:

```shell
$ kubectl run -i --tty busybox --image=busybox --generator="run-pod/v1"
Waiting for pod default/busybox to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ #
```

If you already have a running `Pod`, run a command in it using:

```shell
$ kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

or run an interactive shell with:

```shell
$ kubectl exec -ti <POD-NAME> -c <CONTAINER-NAME> sh
/ #
```

## Setup

For the purposes of this walk-through, let's run some `Pods`.  Since you're
probably debugging your own `Service` you can substitute your own details, or you
can follow along and get a second data point.

```shell
$ kubectl run hostnames --image=gcr.io/google_containers/serve_hostname \
                        --labels=app=hostnames \
                        --port=9376 \
                        --replicas=3
deployment "hostnames" created
```

`kubectl` commands will print the type and name of the resource created or mutated, which can then be used in subsequent commands. 
Note that this is the same as if you had started the `Deployment` with
the following YAML:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: hostnames
spec:
  selector:
    app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: gcr.io/google_containers/serve_hostname
        ports:
        - containerPort: 9376
          protocol: TCP
```

Confirm your `Pods` are running:

```shell
$ kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

## Does the Service exist?

The astute reader will have noticed that we did not actually create a `Service`
yet - that is intentional.  This is a step that sometimes gets forgotten, and
is the first thing to check.

So what would happen if I tried to access a non-existent `Service`?  Assuming you
have another `Pod` that consumes this `Service` by name you would get something
like:

```shell
u@pod$ wget -qO- hostnames
wget: bad address 'hostname'
```

or:

```shell
u@pod$ echo $HOSTNAMES_SERVICE_HOST
```

So the first thing to check is whether that `Service` actually exists:

```shell
$ kubectl get svc hostnames
Error from server (NotFound): services "hostnames" not found
```

So we have a culprit, let's create the `Service`.  As before, this is for the
walk-through - you can use your own `Service`'s details here.

```shell
$ kubectl expose deployment hostnames --port=80 --target-port=9376
service "hostnames" exposed
```

And read it back, just to be sure:

```shell
$ kubectl get svc hostnames
NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   10.0.0.226   <none>        80/TCP    5s
```

As before, this is the same as if you had started the `Service` with YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

Now you can confirm that the `Service` exists.

## Does the Service work by DNS?

From a `Pod` in the same `Namespace`:

```shell
u@pod$ nslookup hostnames
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames
Address: 10.0.1.175
```

If this fails, perhaps your `Pod` and `Service` are in different
`Namespaces`, try a namespace-qualified name:

```shell
u@pod$ nslookup hostnames.default
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default
Address: 10.0.1.175
```

If this works, you'll need to ensure that `Pods` and `Services` run in the same
`Namespace`.  If this still fails, try a fully-qualified name:

```shell
u@pod$ nslookup hostnames.default.svc.cluster.local
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

Note the suffix here: "default.svc.cluster.local".  The "default" is the
`Namespace` we're operating in.  The "svc" denotes that this is a `Service`.
The "cluster.local" is your cluster domain.

You can also try this from a `Node` in the cluster (note: 10.0.0.10 is my DNS
`Service`):

```shell
u@node$ nslookup hostnames.default.svc.cluster.local 10.0.0.10
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

If you are able to do a fully-qualified name lookup but not a relative one, you
need to check that your `kubelet` is running with the right flags.
The `--cluster-dns` flag needs to point to your DNS `Service`'s IP and the
`--cluster-domain` flag needs to be your cluster's domain - we assumed
"cluster.local" in this document, but yours might be different, in which case
you should change that in all of the commands above.

### Does any Service exist in DNS?

If the above still fails - DNS lookups are not working for your `Service` - we
can take a step back and see what else is not working.  The Kubernetes master
`Service` should always work:

```shell
u@pod$ nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes
Address 1: 10.0.0.1
```

If this fails, you might need to go to the kube-proxy section of this doc, or
even go back to the top of this document and start over, but instead of
debugging your own `Service`, debug DNS.

## Does the Service work by IP?

The next thing to test is whether your `Service` works at all.  From a
`Node` in your cluster, access the `Service`'s IP (from `kubectl get` above).

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton

u@node$ curl 10.0.1.175:80
hostnames-yp2kp

u@node$ curl 10.0.1.175:80
hostnames-bvc05
```

If your `Service` is working, you should get correct responses.  If not, there
are a number of things that could be going wrong.  Read on.

## Is the Service correct?

It might sound silly, but you should really double and triple check that your
`Service` is correct and matches your `Pods`.  Read back your `Service` and
verify it:

```shell
$ kubectl get service hostnames -o json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "selfLink": "/api/v1/namespaces/default/services/hostnames",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

Is the port you are trying to access in `spec.ports[]`?  Is the `targetPort`
correct for your `Pods`?  If you meant it to be a numeric port, is it a number
(9376) or a string "9376"?  If you meant it to be a named port, do your `Pods`
expose a port with the same name?  Is the port's `protocol` the same as the
`Pod`'s?

## Does the Service have any Endpoints?

If you got this far, we assume that you have confirmed that your `Service`
exists and is resolved by DNS.  Now let's check that the `Pods` you ran are
actually being selected by the `Service`.

Earlier we saw that the `Pods` were running.  We can re-check that:

```shell
$ kubectl get pods -l app=hostnames
NAME              READY     STATUS    RESTARTS   AGE
hostnames-0uton   1/1       Running   0          1h
hostnames-bvc05   1/1       Running   0          1h
hostnames-yp2kp   1/1       Running   0          1h
```

The "AGE" column says that these `Pods` are about an hour old, which implies that
they are running fine and not crashing.

The `-l app=hostnames` argument is a label selector - just like our `Service`
has.  Inside the Kubernetes system is a control loop which evaluates the
selector of every `Service` and saves the results into an `Endpoints` object.

```shell
$ kubectl get endpoints hostnames
NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

This confirms that the control loop has found the correct `Pods` for your
`Service`.  If the `hostnames` row is blank, you should check that the
`spec.selector` field of your `Service` actually selects for `metadata.labels`
values on your `Pods`.

## Are the Pods working?

At this point, we know that your `Service` exists and has selected your `Pods`.
Let's check that the `Pods` are actually working - we can bypass the `Service`
mechanism and go straight to the `Pods`.

```shell
u@pod$ wget -qO- 10.244.0.5:9376
hostnames-0uton

pod $ wget -qO- 10.244.0.6:9376
hostnames-bvc05

u@pod$ wget -qO- 10.244.0.7:9376
hostnames-yp2kp
```

We expect each `Pod` in the `Endpoints` list to return its own hostname.  If
this is not what happens (or whatever the correct behavior is for your own
`Pods`), you should investigate what's happening there.  You might find
`kubectl logs` to be useful or `kubectl exec` directly to your `Pods` and check
service from there.

## Is the kube-proxy working?

If you get here, your `Service` is running, has `Endpoints`, and your `Pods`
are actually serving.  At this point, the whole `Service` proxy mechanism is
suspect.  Let's confirm it, piece by piece.

### Is kube-proxy running?

Confirm that `kube-proxy` is running on your `Nodes`.  You should get something
like the below:

```shell
u@node$ ps auxw | grep kube-proxy
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

Next, confirm that it is not failing something obvious, like contacting the
master.  To do this, you'll have to look at the logs.  Accessing the logs
depends on your `Node` OS.  On some OSes it is a file, such as
/var/log/kube-proxy.log, while other OSes use `journalctl` to access logs.  You
should see something like:

```shell
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:53.999055    5063 server.go:255] Tearing down userspace rules. Errors here are acceptable.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

If you see error messages about not being able to contact the master, you
should double-check your `Node` configuration and installation steps.

### Is kube-proxy writing iptables rules?

One of the main responsibilities of `kube-proxy` is to write the `iptables`
rules which implement `Services`.  Let's check that those rules are getting
written.

The kube-proxy can run in either "userspace" mode or "iptables" mode.
Hopefully you are using the newer, faster, more stable "iptables" mode.  You
should see one of the following cases.

#### Userspace

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-PORTALS-CONTAINER -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j REDIRECT --to-ports 48577
-A KUBE-PORTALS-HOST -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j DNAT --to-destination 10.240.115.247:48577
```

There should be 2 rules for each port on your `Service` (just one in this
example) - a "KUBE-PORTALS-CONTAINER" and a "KUBE-PORTALS-HOST".  If you do
not see these, try restarting `kube-proxy` with the `-V` flag set to 4, and
then look at the logs again.

#### Iptables

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

There should be 1 rule in `KUBE-SERVICES`, 1 or 2 rules per endpoint in
`KUBE-SVC-(hash)` (depending on `SessionAffinity`), one `KUBE-SEP-(hash)` chain
per endpoint, and a few rules in each `KUBE-SEP-(hash)` chain.  The exact rules
will vary based on your exact config (including node-ports and load-balancers).

### Is kube-proxy proxying?

Assuming you do see the above rules, try again to access your `Service` by IP:

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton
```

If this fails and you are using the userspace proxy, you can try accessing the
proxy directly.  If you are using the iptables proxy, skip this section.

Look back at the `iptables-save` output above, and extract the
port number that `kube-proxy` is using for your `Service`.  In the above
examples it is "48577".  Now connect to that:

```shell
u@node$ curl localhost:48577
hostnames-yp2kp
```

If this still fails, look at the `kube-proxy` logs for specific lines like:

```shell
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

If you don't see those, try restarting `kube-proxy` with the `-V` flag set to 4, and
then look at the logs again.

Services provide load balancing across a set of pods. There are several common
problems that can make services not work properly. The following instructions
should help debug service problems.

First, verify that there are endpoints for the service. For every service
object, the apiserver makes an `endpoints` resource available.

You can view this resource with:

    $ kubectl get endpoints ${SERVICE_NAME}

Make sure that the endpoints match up with the number of containers that you
expect to be a member of your service. For example, if your service is for an
nginx container with 3 replicas, you would expect to see three different IP
addresses in the service's endpoints.

### My service is missing endpoints

If you are missing endpoints, try listing pods using the labels that service
uses. Imagine that you have a service where the labels are:

    ...
    spec:
      - selector:
         name: nginx
         type: frontend

You can use:

    $ kubectl get pods --selector=name=nginx,type=frontend

to list pods that match this selector. Verify that the list matches the pods
that you expect to provide your service.

If the list of pods matches expectations, but your endpoints are still empty,
it's possible that you don't have the right ports exposed. If your service has
a `containerPort` specified, but the pods that are selected don't have that
port listed, then they won't be added to the endpoints list.

Verify that the pod's `containerPort` matches up with the service's
`containerPort`.

### Network traffic is not forwarded

If you can connect to the service, but the connection is immediately dropped,
and there are endpoints in the endpoints list, it's likely that the proxy can't
contact your pods.

There are three things to check:

* Are your pods working correctly?  Look for restart count, and
  [debug pods](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/#debugging-pods).

* Can you connect to your pods directly?  Get the IP address for the pod, and
  try to connect directly to that IP.

* Is your application serving on the port that you configured? Container
  Engine doesn't do port remapping, so if your application serves on 8080,
  the `containerPort` field needs to be 8080.

### A Pod cannot reach itself via Service IP

This mostly happens when `kube-proxy` is running in `iptables` mode and Pods
are connected with bridge network. The `Kubelet` exposes a `hairpin-mode`
[flag](/docs/admin/kubelet/) that allows endpoints of a Service to loadbalance back to themselves
if they try to access their own Service VIP. The `hairpin-mode` flag must either be
set to `hairpin-veth` or `promiscuous-bridge`.

The common steps to trouble shoot this are as follows:

* Confirm `hairpin-mode` is set to `hairpin-veth` or `promiscuous-bridge`.
You should see something like the below. `hairpin-mode` is set to
`promiscuous-bridge` in the following example.

```shell
u@node$ ps auxw|grep kubelet
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0

```

* Confirm the effective `hairpin-mode`. To do this, you'll have to look at
kubelet log. Accessing the logs depends on your Node OS. On some OSes it
is a file, such as /var/log/kubelet.log, while other OSes use `journalctl`
to access logs. Please be noted that the effective hairpin mode may not
match `--hairpin-mode` flag due to compatibility. Check if there is any log
lines with key word `hairpin` in kubelet.log. There should be log lines
indicating the effective hairpin mode, like something below.

```shell
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* If the effective hairpin mode is `hairpin-veth`, ensure the `Kubelet` has
the permission to operate in `/sys` on node. If everything works properly,
you should see something like:

```shell
u@node$ for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
1
1
1
1
```

* If the effective hairpin mode is `promiscuous-bridge`, ensure `Kubelet`
has the permission to manipulate linux bridge on node. If cbr0` bridge is
used and configured properly, you should see:

```shell
u@node$ ifconfig cbr0 |grep PROMISC
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1

```

* Seek help if none of above works out.


## Seek help

If you get this far, something very strange is happening.  Your `Service` is
running, has `Endpoints`, and your `Pods` are actually serving.  You have DNS
working, `iptables` rules installed, and `kube-proxy` does not seem to be
misbehaving.  And yet your `Service` is not working.  You should probably let
us know, so we can help investigate!

Contact us on
[Slack](/docs/troubleshooting/#slack) or
[email](https://groups.google.com/forum/#!forum/google-containers) or
[GitHub](https://github.com/kubernetes/kubernetes).

## More information

Visit [troubleshooting document](/docs/troubleshooting/) for more information.

