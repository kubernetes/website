---
title: Using Source IP
content_template: templates/tutorial
---

{{% capture overview %}}

Applications running in a Kubernetes cluster find and communicate with each
other, and the outside world, through the Service abstraction. This document
explains what happens to the source IP of packets sent to different types
of Services, and how you can toggle this behavior according to your needs.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## Terminology

This document makes use of the following terms:

* [NAT](https://en.wikipedia.org/wiki/Network_address_translation): network address translation
* [Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT): replacing the source IP on a packet, usually with a node's IP
* [Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT): replacing the destination IP on a packet, usually with a pod IP
* [VIP](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies): a virtual IP, such as the one assigned to every Kubernetes Service
* [Kube-proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies): a network daemon that orchestrates Service VIP management on every node


## Prerequisites

You must have a working Kubernetes 1.5 cluster to run the examples in this
document. The examples use a small nginx webserver that echoes back the source
IP of requests it receives through an HTTP header. You can create it as follows:

```console
kubectl run source-ip-app --image=k8s.gcr.io/echoserver:1.4
```
The output is:
```
deployment.apps/source-ip-app created
```

{{% /capture %}}

{{% capture objectives %}}

* Expose a simple application through various types of Services
* Understand how each Service type handles source IP NAT
* Understand the tradeoffs involved in preserving source IP

{{% /capture %}}


{{% capture lessoncontent %}}

## Source IP for Services with Type=ClusterIP

Packets sent to ClusterIP from within the cluster are never source NAT'd if
you're running kube-proxy in [iptables mode](/docs/concepts/services-networking/service/#proxy-mode-iptables),
which is the default since Kubernetes 1.2. Kube-proxy exposes its mode through
a `proxyMode` endpoint:

```console
kubectl get nodes
```
The output is similar to this:
```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```
Get the proxy mode on one of the node
```console
kubernetes-node-6jst $ curl localhost:10249/proxyMode
```
The output is:
```
iptables
```

You can test source IP preservation by creating a Service over the source IP app:

```console
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```
The output is:
```
service/clusterip exposed
```
```console
kubectl get svc clusterip
```
The output is similar to:
```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

And hitting the `ClusterIP` from a pod in the same cluster:

```console
kubectl run busybox -it --image=busybox --restart=Never --rm
```
The output is similar to this:
```
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
The client_address is always the client pod's IP address, whether the client pod and server pod are in the same node or in different nodes.

## Source IP for Services with Type=NodePort

As of Kubernetes 1.5, packets sent to Services with [Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
are source NAT'd by default. You can test this by creating a `NodePort` Service:

```console
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```
The output is:
```
service/nodeport exposed
```

```console
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="ExternalIP")].address }')
```

If you're running on a cloudprovider, you may need to open up a firewall-rule
for the `nodes:nodeport` reported above.
Now you can try reaching the Service from outside the cluster through the node
port allocated above.

```console
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```
The output is similar to:
```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

Note that these are not the correct client IPs, they're cluster internal IPs. This is what happens:

* Client sends packet to `node2:nodePort`
* `node2` replaces the source IP address (SNAT) in the packet with its own IP address
* `node2` replaces the destination IP on the packet with the pod IP
* packet is routed to node 1, and then to the endpoint
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


To avoid this, Kubernetes has a feature to preserve the client source IP
[(check here for feature availability)](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip).
Setting `service.spec.externalTrafficPolicy` to the value `Local` will only
proxy requests to local endpoints, never forwarding traffic to other nodes
and thereby preserving the original source IP address. If there are no
local endpoints, packets sent to the node are dropped, so you can rely
on the correct source-ip in any packet processing rules you might apply a
packet that make it through to the endpoint.

Set the `service.spec.externalTrafficPolicy` field as follows:

```console
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```
The output is:
```
service/nodeport patched
```

Now, re-run the test:

```console
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```
The output is:
```
client_address=104.132.1.79
```

Note that you only got one reply, with the *right* client IP, from the one node on which the endpoint pod
is running.

This is what happens:

* client sends packet to `node2:nodePort`, which doesn't have any endpoints
* packet is dropped
* client sends packet to `node1:nodePort`, which *does* have endpoints
* node1 routes packet to endpoint with the correct source IP

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



## Source IP for Services with Type=LoadBalancer

As of Kubernetes 1.5, packets sent to Services with [Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) are
source NAT'd by default, because all schedulable Kubernetes nodes in the
`Ready` state are eligible for loadbalanced traffic. So if packets arrive
at a node without an endpoint, the system proxies it to a node *with* an
endpoint, replacing the source IP on the packet with the IP of the node (as
described in the previous section).

You can test this by exposing the source-ip-app through a loadbalancer

```console
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```
The output is:
```
service/loadbalancer exposed
```

Print IPs of the Service:
```console
kubectl get svc loadbalancer
```
The output is similar to this:
```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   104.198.149.140   80/TCP    5m
```

```console
curl 104.198.149.140
```
The output is similar to this:
```
CLIENT VALUES:
client_address=10.240.0.5
...
```

However, if you're running on Google Kubernetes Engine/GCE, setting the same `service.spec.externalTrafficPolicy`
field to `Local` forces nodes *without* Service endpoints to remove
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
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

You should immediately see the `service.spec.healthCheckNodePort` field allocated
by Kubernetes:

```console
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```
The output is similar to this:
```
  healthCheckNodePort: 32122
```

The `service.spec.healthCheckNodePort` field points to a port on every node
serving the health check at `/healthz`. You can test this:

```console
kubectl get pod -o wide -l run=source-ip-app
```
The output is similar to this:
```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```
Curl the `/healthz` endpoint on different nodes.
```console
kubernetes-node-6jst $ curl localhost:32122/healthz
```
The output is similar to this:
```
1 Service Endpoints found
```
```console
kubernetes-node-jj1t $ curl localhost:32122/healthz
```
The output is similar to this:
```
No Service Endpoints Found
```

A service controller running on the master is responsible for allocating the cloud
loadbalancer, and when it does so, it also allocates HTTP health checks
pointing to this port/path on each node. Wait about 10 seconds for the 2 nodes
without endpoints to fail health checks, then curl the lb ip:

```console
curl 104.198.149.140
```
The output is similar to this:
```
CLIENT VALUES:
client_address=104.132.1.79
...
```

__Cross platform support__

As of Kubernetes 1.5, support for source IP preservation through Services
with Type=LoadBalancer is only implemented in a subset of cloudproviders
(GCP and Azure). The cloudprovider you're running on might fulfill the
request for a loadbalancer in a few different ways:

1. With a proxy that terminates the client connection and opens a new connection
to your nodes/endpoints. In such cases the source IP will always be that of the
cloud LB, not that of the client.

2. With a packet forwarder, such that requests from the client sent to the
loadbalancer VIP end up at the node with the source IP of the client, not
an intermediate proxy.

Loadbalancers in the first category must use an agreed upon
protocol between the loadbalancer and backend to communicate the true client IP
such as the HTTP [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For)
header, or the [proxy protocol](http://www.haproxy.org/download/1.5/doc/proxy-protocol.txt).
Loadbalancers in the second category can leverage the feature described above
by simply creating an HTTP health check pointing at the port stored in
the `service.spec.healthCheckNodePort` field on the Service.

{{% /capture %}}

{{% capture cleanup %}}

Delete the Services:

```console
kubectl delete svc -l run=source-ip-app
```

Delete the Deployment, ReplicaSet and Pod:

```console
kubectl delete deployment source-ip-app
```

{{% /capture %}}

{{% capture whatsnext %}}
* Learn more about [connecting applications via services](/docs/concepts/services-networking/connect-applications-service/)
* Learn more about [loadbalancing](/docs/user-guide/load-balancer)
{{% /capture %}}


