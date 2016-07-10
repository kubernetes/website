---
---

This document describes what ports the Kubernetes apiserver
may serve on and how to reach them.  The audience is
cluster administrators who want to customize their cluster
or understand the details.

Most questions about accessing the cluster are covered
in [Accessing the cluster](/docs/user-guide/accessing-the-cluster).


## Ports and IPs Served On

The Kubernetes API is served by the Kubernetes apiserver process.  Typically,
there is one of these running on a single kubernetes-master node.

By default the Kubernetes APIserver serves HTTP on 2 ports:

  1. `Localhost Port`:

          - serves HTTP
          - default is port 8080, change with `--insecure-port` flag.
          - defaults IP is localhost, change with `--insecure-bind-address` flag.
          - no authentication or authorization checks in HTTP
          - protected by need to have host access

  2. `Secure Port`:
  
          - default is port 6443, change with `--secure-port` flag.
          - default IP is first non-localhost network interface, change with `--bind-address` flag.
          - serves HTTPS.  Set cert with `--tls-cert-file` and key with `--tls-private-key-file` flag.
          - uses token-file or client-certificate based [authentication](/docs/admin/authentication).
          - uses policy-based [authorization](/docs/admin/authorization).

## Proxies and Firewall rules

Additionally, in some configurations there is a proxy (nginx) running
on the same machine as the apiserver process.  The proxy serves HTTPS protected
by Basic Auth on port 443, and proxies to the apiserver on localhost:8080. In
these configurations the secure port is typically set to 6443.

A firewall rule is typically configured to allow external HTTPS access to port
443.

The above are defaults and reflect how Kubernetes is deployed to Google Compute
Engine using `kube-up.sh.` Other cloud providers may vary.

## Use Cases vs IP:Ports

There are differently configured serving ports to serve a variety of uses cases:

   1. Clients outside of a Kubernetes cluster, such as human running `kubectl`
on a desktop machine. Currently, accesses the Localhost Port via a proxy (nginx)
running on the `kubernetes-master` machine.  The proxy can use cert-based
authentication or token-based authentication.
   2. Processes running in Containers on Kubernetes that need to read from
the apiserver. Currently, these can use a [service account](/docs/user-guide/service-accounts).
   3. Scheduler and Controller-manager processes, which need to do read-write
API operations, using service accounts to avoid the need to be co-located.
   4. Kubelets, which need to do read-write API operations and are necessarily
on different machines than the apiserver.  Kubelet uses the Secure Port
to get their pods, to find the services that a pod can see, and to
write events. Credentials are distributed to kubelets at cluster
setup time. Kubelet and kube-proxy can use cert-based authentication or
token-based authentication.

## Expected changes

   - Policy will limit the actions kubelets can do via the authed port.
