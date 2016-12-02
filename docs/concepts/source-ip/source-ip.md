---
---

{% capture overview %}
Applications running in a Kubernetes cluster find and communicate with each
other, and the outside world, through the Service abstraction. This document
explains what happens to the source IP of packets sent to different types
of Services, and how you can toggle this behavior according to your needs.
{% endcapture %}

{% capture body %}

### Terminology

Throughout this document, we will use the following terms:

* [NAT](https://en.wikipedia.org/wiki/Network_address_translation): network address translation
* [Source NAT](/docs/user-guide/services/#ips-and-vips): replacing the source IP on a packet, usually with a node's IP
* [Destination NAT](/docs/user-guide/services/#ips-and-vips): replacing the destination IP on a packet, usually with a pod IP
* [VIP](/docs/user-guide/services/#ips-and-vips): a virtual IP, such as the one assigned to every Kubernetes Service
* [Kube-proxy](/docs/user-guide/services/#virtual-ips-and-service-proxies): a network daemon that orchestrates Service VIP management on every node

### Prerequisites

A working, Kubernetes 1.5 cluster is required for the examples in this document.
We will also use a tiny nginx webserver that echoes back the source IP of
requests it receives through a HTTP header. You can create it as follows:

```console
$ kubectl run source-ip-app --image=gcr.io/google_containers/echoserver:1.4
deployment "source-ip-app" created
```

### Source IP for Services with Type=ClusterIP

Packets sent to the ClusterIP of a Service are never source NAT'd if you're
running kube-proxy in [iptables mode](/docs/user-guide/services/#proxy-mode-iptables). Kube-proxy
exposes its mode through a `proxyMode` endpoint:

```console
$ kubectl get no
NAME                           STATUS                     AGE
kubernetes-minion-group-6jst   Ready                      2h
kubernetes-minion-group-cx31   Ready                      2h
kubernetes-minion-group-jj1t   Ready                      2h

kubernetes-minion-group-6jst $ curl localhost:10249/proxyMode
iptables
```

You can test source IP preservation by creating a Service over the source IP app:

```console
$ kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
service "clusterip" exposed

$ kubectl get svc clusterip
NAME         CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    10.0.170.92   <none>        80/TCP    51s
```

And hitting the `ClusterIP` from a pod in the same cluster

```console
$ kubectl run busybox -it --image=busybox --restart=Never
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc noqueue
    link/ether 0a:58:0a:f4:03:08 brd ff:ff:ff:ff:ff:ff
    inet 10.244.3.8/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::188a:84ff:feb0:26a5/64 scope link
       valid_lft forever preferred_lft forever

# wget -qO - 10.0.170.92
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```

### Source IP for Services with Type=NodePort

As of Kubernetes 1.5, packets sent to Services with [Type=NodePort](/docs/user-guide/services/#type-nodeport)
are source NAT'd by default. You can test this by creating a `NodePort`
Service

```console
$ kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
service "nodeport" exposed

$ NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
$ NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="ExternalIP")].address }')
```

if you're running on a cloudprovider, you need to open up a firewall-rule for
the `nodes:nodeport` reported above.
Now we can try reaching the Service from outside the cluster through the node
port allocated above.

```console
$ for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

Note that these are not your IPs, they're cluster internal IPs. This is what happens:

* Client sends packet to `node2:nodePort`, which doesn't have any endpoints
* `node2` replaces the source IP on the packet with its own (SNAT)
* `node2` replaces the destination IP on the packet with the pod IP
* the pod IP is routed to node 1, and then to the endpoint
* the pod's reply is routed back to node2
* the pod's reply is sent back to the client

Visually:

```
          client
             \ ^
              \ \
               v \
   node 1 <--- node 2
    | ^   SNAT
    | |   --->
    v |
 endpoint
```


To avoid this, we have a beta feature in 1.5, triggered by the `service.beta.kubernetes.io/external-traffic`
[annotation](/docs/user-guide/load-balancer/#loss-of-client-source-ip-for-external-traffic). Setting it to the value `OnlyLocal` will only proxy requests to
local endpoints, preserving the source IP. If there are no local endpoints,
packets sent to the node are dropped.

Lets set it and rerun the same test:

```console
$ kubectl annotate service nodeport service.beta.kubernetes.io/external-traffic=OnlyLocal
service "nodeport" annotated

$ for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; do
client_address=104.132.1.79
```

Note that you only got one reply, with the *right* client IP, from the one node on which the endpoint pod
is running on.

This is what happens:

* client sends packet to `node2:nodePort`, which doesn't have any endpoints
* packets are dropped
* client sends packet to `node1:nodePort`, which *does* have endpoints
* node1 routes packets to endpoint with the correct source IP

Visually:

```
        client
       ^ /   \
      / /     \
     / v       X
   node 1     node 2
    ^ |
    | |
    | v
 endpoint
```



### Source IP for Services with Type=LoadBalancer

As of Kubernetes 1.5, packets sent to Services with [Type=LoadBalancer](/docs/user-guide/services/#type-loadbalancer) are
source NAT'd by default, because all schedulable Kubernetes nodes in the
`Ready` state are eligible for loadbalanced traffic. So if packets arrive
at a node without an endpoint, we need to proxy it to a node *with* an
endpoint, replacing the source IP on the packet with the IP of the node (as
described in the previous section).

you can test this by exposing the source-ip-app through a loadbalancer

```console
$ kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
service "loadbalancer" exposed

$ kubectl get svc loadbalancer
NAME           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   10.0.65.118   104.198.149.140   80/TCP    5m

$ curl 104.198.149.140
CLIENT VALUES:
client_address=10.240.0.5
...
```

However, if you're running on GKE/GCE, setting the same `service.beta.kubernetes.io/external-traffic`
annotation to `OnlyLocal` forces nodes *without* Service endpoints to remove
themselves from the list of nodes eligible for loadbalanced traffic by
deliberately failing health checks.

Visually:

```
                      client
                        |
                      lb VIP
                     / ^
                    v /
health check --->   node 1   node 2 <--- health check
        200  <---   ^ |             ---> 500
                    | V
                 endpoint
```

You can test this by setting the annotation:

```console
$ kubectl annotate service loadbalancer service.beta.kubernetes.io/external-traffic=OnlyLocal
```

and waiting O(10s) for the 2 nodes without endpoints to fail health checks,
before curling the lb ip:

```console
$ curl 104.198.149.140
CLIENT VALUES:
client_address=104.132.1.79
...
```

We expect to roll this feature out across a wider range of cloud providers
before GA.

{% endcapture %}

{% capture whatsnext %}
* Learn more about [connecting applications via services](/docs/user-guide/connecting-applications/)
* Learn more about [loadbalancing](/docs/user-guide/load-balancer)
{% endcapture %}

{% include templates/concept.md %}
