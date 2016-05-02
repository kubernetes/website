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

When the cluster is created by `kube-up.sh`, on Google Compute Engine (GCE),
and on several other cloud providers, the API server serves on port 443.  On
GCE, a firewall rule is configured on the project to allow external HTTPS
access to the API. Other cluster setup methods vary.

