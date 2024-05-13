---
layout: blog
title: "Use KPNG to Write Specialized kube-proxiers"
date: 2021-10-18
slug: use-kpng-to-write-specialized-kube-proxiers
author: >
  Lars Ekman (Ericsson)
---

The post will show you how to create a specialized service kube-proxy
style network proxier using Kubernetes Proxy NG
[kpng](https://github.com/kubernetes-sigs/kpng) without interfering
with the existing kube-proxy. The kpng project aims at renewing the
the default Kubernetes Service implementation, the "kube-proxy". An
important feature of kpng is that it can be used as a library to
create proxiers outside K8s. While this is useful for CNI-plugins that
replaces the kube-proxy it also opens the possibility for anyone to
create a proxier for a special purpose.


## Define a service that uses a specialized proxier

```
apiVersion: v1
kind: Service
metadata:
  name: kpng-example
  labels:
    service.kubernetes.io/service-proxy-name: kpng-example
spec:
  clusterIP: None
  ipFamilyPolicy: RequireDualStack
  externalIPs:
  - 10.0.0.55
  - 1000::55
  selector:
    app: kpng-alpine
  ports:
  - port: 6000
```

If the `service.kubernetes.io/service-proxy-name` label is defined the
`kube-proxy` will ignore the service. A custom controller can watch
services with the label set to it's own name, "kpng-example" in
this example, and setup specialized load-balancing.

The `service.kubernetes.io/service-proxy-name` label is [not
new](https://kubernetes.io/docs/reference/labels-annotations-taints/#servicekubernetesioservice-proxy-name),
but so far is has been quite hard to write a specialized proxier.

The common use for a specialized proxier is assumed to be handling
external traffic for some use-case not supported by K8s. In that
case `ClusterIP` is not needed, so we use a "headless" service in this
example.


## Specialized proxier using kpng

A [kpng](https://github.com/kubernetes-sigs/kpng) based proxier
consists of the `kpng` controller handling all the K8s api related
functions, and a "backend" implementing the load-balancing. The
backend can be linked with the `kpng` controller binary or be a
separate program communicating with the controller using gRPC.

```
kpng kube --service-proxy-name=kpng-example to-api
```

This starts the `kpng` controller and tell it to watch only services
with the "kpng-example" service proxy name. The "to-api" parameter
will open a gRPC server for backends.

You can test this yourself outside your cluster. Please see the example
below.

Now we start a backend that simply prints the updates from the
controller.

```
$ kubectl apply -f kpng-example.yaml
$ kpng-json | jq     # (this is the backend)
{
  "Service": {
    "Namespace": "default",
    "Name": "kpng-example",
    "Type": "ClusterIP",
    "IPs": {
      "ClusterIPs": {},
      "ExternalIPs": {
        "V4": [
          "10.0.0.55"
        ],
        "V6": [
          "1000::55"
        ]
      },
      "Headless": true
    },
    "Ports": [
      {
        "Protocol": 1,
        "Port": 6000,
        "TargetPort": 6000
      }
    ]
  },
  "Endpoints": [
    {
      "IPs": {
        "V6": [
          "1100::202"
        ]
      },
      "Local": true
    },
    {
      "IPs": {
        "V4": [
          "11.0.2.2"
        ]
      },
      "Local": true
    },
    {
      "IPs": {
        "V4": [
          "11.0.1.2"
        ]
      }
    },
    {
      "IPs": {
        "V6": [
          "1100::102"
        ]
      }
    }
  ]
}
```

A real backend would use some mechanism to load-balance traffic from
the external IPs to the endpoints.



## Writing a backend

The `kpng-json` backend looks like this:

```go
package main
import (
        "os"
        "encoding/json"
        "sigs.k8s.io/kpng/client"
)
func main() {
        client.Run(jsonPrint)
}
func jsonPrint(items []*client.ServiceEndpoints) {
        enc := json.NewEncoder(os.Stdout)
        for _, item := range items {
                _ = enc.Encode(item)
        }
}
```

(yes, that is the entire program)

A real backend would of course be much more complex, but this
illustrates how `kpng` let you focus on load-balancing.

You can have several backends connected to a `kpng` controller, so
during development or debug it can be useful to let something like the
`kpng-json` backend run in parallel with your real backend.


## Example


The complete example can be found [here](https://github.com/kubernetes-sigs/kpng/tree/master/examples/pipe-exec).

As an example we implement an "all-ip" backend. It direct all traffic
for the externalIPs to a local endpoint, regardless of ports and upper
layer protocols. There is a
[KEP](https://github.com/kubernetes/enhancements/pull/2611) for this
function and this example is a much simplified version.

To direct all traffic from an external address to a local POD [only
one iptables rule is
needed](https://github.com/kubernetes/enhancements/pull/2611#issuecomment-895061013),
for instance;

```
ip6tables -t nat -A PREROUTING -d 1000::55/128 -j DNAT --to-destination 1100::202
```

As you can see the addresses are in the call to the backend and all it
have to do is:

* Extract the addresses with `Local: true`
* Setup iptables rules for the `ExternalIPs`

A script doing that may look like:

```
xip=$(cat /tmp/out | jq -r .Service.IPs.ExternalIPs.V6[0])
podip=$(cat /tmp/out | jq -r '.Endpoints[]|select(.Local == true)|select(.IPs.V6 != null)|.IPs.V6[0]')
ip6tables -t nat -A PREROUTING -d $xip/128 -j DNAT --to-destination $podip
```

Assuming the JSON output above is stored in `/tmp/out` ([jq](https://jqlang.github.io/jq/) is an *awesome* program!).


As this is an example we make it really simple for ourselves by using
a minor variation of the `kpng-json` backend above. Instead of just
printing, a program is called and the JSON output is passed as `stdin`
to that program. The backend can be tested stand-alone:

```
CALLOUT=jq kpng-callout
```

Where `jq` can be replaced with your own program or script. A script
may look like the example above.  For more info and the complete
example please see [https://github.com/kubernetes-sigs/kpng/tree/master/examples/pipe-exec](https://github.com/kubernetes-sigs/kpng/tree/master/examples/pipe-exec).


## Summary

While [kpng](https://github.com/kubernetes-sigs/kpng) is in early
stage of development this post wants to show how you may build your
own specialized K8s proxiers in the future. The only thing your
applications need to do is to add the
`service.kubernetes.io/service-proxy-name` label in the Service
manifest.

It is a tedious process to get new features into the `kube-proxy` and
it is not unlikely that they will be rejected, so to write a
specialized proxier may be the only option.
