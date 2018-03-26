---
reviewers:
- bprashanth
- davidopp
title: Configure Your Cloud Provider's Firewalls
---

Many cloud providers (e.g. Google Compute Engine) define firewalls that help prevent inadvertent
exposure to the internet.  When exposing a service to the external world, you may need to open up
one or more ports in these firewalls to serve traffic.  This document describes this process, as
well as any provider specific details that may be necessary.

### Restrict Access For LoadBalancer Service

 When using a Service with `spec.type: LoadBalancer`, you can specify the IP ranges that are allowed to access the load balancer
 by using `spec.loadBalancerSourceRanges`. This field takes a list of IP CIDR ranges, which Kubernetes will use to configure firewall exceptions.
 This feature is currently supported on Google Compute Engine, Google Kubernetes Engine and AWS. This field will be ignored if the cloud provider does not support the feature.

 Assuming 10.0.0.0/8 is the internal subnet. In the following example, a load balancer will be created that is only accessible to cluster internal IPs.
 This will not allow clients from outside of your Kubernetes cluster to access the load balancer.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  ports:
  - port: 8765
    targetPort: 9376
  selector:
    app: example
  type: LoadBalancer
  loadBalancerSourceRanges:
  - 10.0.0.0/8
```

 In the following example, a load balancer will be created that is only accessible to clients with IP addresses from 130.211.204.1 and 130.211.204.2.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  ports:
  - port: 8765
    targetPort: 9376
  selector:
    app: example
  type: LoadBalancer
  loadBalancerSourceRanges:
  - 130.211.204.1/32
  - 130.211.204.2/32
```

### Google Compute Engine

When using a Service with `spec.type: LoadBalancer`, the firewall will be
opened automatically.  When using `spec.type: NodePort`, however, the firewall
is *not* opened by default.

Google Compute Engine firewalls are documented [elsewhere](https://cloud.google.com/compute/docs/networking#firewalls_1).

You can add a firewall with the `gcloud` command line tool:

```shell
gcloud compute firewall-rules create my-rule --allow=tcp:<port>
```

**Note**
There is one important security note when using firewalls on Google Compute Engine:

as of Kubernetes v1.0.0, GCE firewalls are defined per-vm, rather than per-ip
address.  This means that when you open a firewall for a service's ports,
anything that serves on that port on that VM's host IP address may potentially
serve traffic.  Note that this is not a problem for other Kubernetes services,
as they listen on IP addresses that are different than the host node's external
IP address.

Consider:

   * You create a Service with an external load balancer (IP Address 1.2.3.4)
     and port 80
   * You open the firewall for port 80 for all nodes in your cluster, so that
     the external Service actually can deliver packets to your Service
   * You start an nginx server, running on port 80 on the host virtual machine
     (IP Address 2.3.4.5).  This nginx is also exposed to the internet on
     the VM's external IP address.

Consequently, please be careful when opening firewalls in Google Compute Engine
or Google Kubernetes Engine.  You may accidentally be exposing other services to
the wilds of the internet.

This will be fixed in an upcoming release of Kubernetes.

### Other cloud providers

Coming soon.
