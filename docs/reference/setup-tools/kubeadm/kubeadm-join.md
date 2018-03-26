---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm join
---
{% capture overview %}
{% endcapture %}

{% capture body %}
{% include_relative generated/kubeadm_join.md %}

### The joining workflow

`kubeadm join` bootstraps a Kubernetes worker node and joins it to the cluster.
This action consists of the following steps:

1. kubeadm downloads necessary cluster information from the API server.
   By default, it uses the bootstrap token and the CA key hash to verify the
   authenticity of that data. The root CA can also be discovered directly via a
   file or URL.

1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it first retrieves the kubelet init configuration from the master and writes it to
   the disk. When kubelet starts up, kubeadm updates the node `Node.spec.configSource` property of the node.
   See [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
   and [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet/) 
   for more information about Dynamic Kubelet Configuration.

1. Once the cluster information is known, kubelet can start the TLS bootstrapping
   process.

   The TLS bootstrap uses the shared token to temporarily authenticate
   with the Kubernetes API server to submit a certificate signing request (CSR); by
   default the control plane signs this CSR request automatically.

1. Finally, kubeadm configures the local kubelet to connect to the API
   server with the definitive identity assigned to the node.

### Discovering what cluster CA to trust

The kubeadm discovery has several options, each with security tradeoffs.
The right method for your environment depends on how you provision nodes and the
security expectations you have about your network and node lifecycles.

#### Token-based discovery with CA pinning

This is the default mode in Kubernetes 1.8 and above. In this mode, kubeadm downloads
the cluster configuration (including root CA) and validates it using the token
as well as validating that the root CA public key matches the provided hash and
that the API server certificate is valid under the root CA.

The CA key hash has the format `sha256:<hex_encoded_hash>`. By default, the hash value is returned in the `kubeadm join` command printed at the end of `kubeadm init` or in the output of `kubeadm token create --print-join-command`. It is in a standard format (see [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)) and can also be calculated by 3rd party tools or provisioning systems. For example, using the OpenSSL CLI:

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

**Example `kubeadm join` command:**

```bash
kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443
```

**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if other worker nodes or the network are compromised.

 - Convenient to execute manually since all of the information required fits
   into a single `kubeadm join` command that is easy to copy and paste.

**Disadvantages:**

 - The CA hash is not normally known until the master has been provisioned,
   which can make it more difficult to build automated provisioning tools that
   use kubeadm. By generating your CA in beforehand, you may workaround this
   limitation though.

#### Token-based discovery without CA pinning

_This was the default in Kubernetes 1.7 and earlier_, but comes with some
important caveats. This mode relies only on the symmetric token to sign
(HMAC-SHA256) the discovery information that establishes the root of trust for
the master. It's still possible in Kubernetes 1.8 and above using the
`--discovery-token-unsafe-skip-ca-verification` flag, but you should consider
using one of the other modes if possible.

**Example `kubeadm join` command:**

```
kubeadm join --token abcdef.1234567890abcdef --discovery-token-unsafe-skip-ca-verification 1.2.3.4:6443`
```

**Advantages:**

 - Still protects against many network-level attacks.

 - The token can be generated ahead of time and shared with the master and
   worker nodes, which can then bootstrap in parallel without coordination. This
   allows it to be used in many provisioning scenarios.

**Disadvantages:**

 - If an attacker is able to steal a bootstrap token via some vulnerability,
   they can use that token (along with network-level access) to impersonate the
   master to other bootstrapping nodes. This may or may not be an appropriate
   tradeoff in your environment.

#### File or HTTPS-based discovery
This provides an out-of-band way to establish a root of trust between the master
and bootstrapping nodes.   Consider using this mode if you are building automated provisioning
using kubeadm.

**Example `kubeadm join` commands:**

 - `kubeadm join --discovery-file path/to/file.conf` (local file)

 - `kubeadm join --discovery-file https://url/file.conf` (remote HTTPS URL)

**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if the network or other worker nodes are compromised.

**Disadvantages:**

 - Requires that you have some way to carry the discovery information from
   the master to the bootstrapping nodes. This might be possible, for example,
   via your cloud provider or provisioning tool. The information in this file is
   not secret, but HTTPS or equivalent is required to ensure its integrity.

### Securing your installation even more {#securing-more}

The defaults for kubeadm may not work for everyone. This section documents how to tighten up a kubeadm installation
at the cost of some usability.

#### Turning off auto-approval of node client certificates

By default, there is a CSR auto-approver enabled that basically approves any client certificate request
for a kubelet when a Bootstrap Token was used when authenticating. If you don't want the cluster to
automatically approve kubelet client certs, you can turn it off by executing this command:

```console
$ kubectl delete clusterrole kubeadm:node-autoapprove-bootstrap
```

After that, `kubeadm join` will block until the admin has manually approved the CSR in flight:

```console
$ kubectl get csr
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   18s       system:bootstrap:878f07   Pending

$ kubectl certificate approve node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ
certificatesigningrequest "node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ" approved

$ kubectl get csr
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   1m        system:bootstrap:878f07   Approved,Issued
```

Only after `kubectl certificate approve` has been run, `kubeadm join` can proceed.

#### Turning off public access to the cluster-info ConfigMap

In order to achieve the joining flow using the token as the only piece of validation information, a
 ConfigMap with some data needed for validation of the master's identity is exposed publicly by
default. While there is no private data in this ConfigMap, some users might wish to turn
it off regardless. Doing so will disable the ability to use the `--discovery-token` flag of the
`kubeadm join` flow. Here are the steps to do so:

* Fetch the `cluster-info` file from the API Server:

```console
$ kubectl -n kube-public get cm cluster-info -o yaml | grep "kubeconfig:" -A11 | grep "apiVersion" -A10 | sed "s/    //" | tee cluster-info.yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <ca-cert>
    server: https://<ip>:<port>
  name: ""
contexts: []
current-context: ""
kind: Config
preferences: {}
users: []
```

* Use the `cluster-info.yaml` file as an argument to `kubeadm join --discovery-file`.

* Turn off public access to the `cluster-info` ConfigMap:

```console
$ kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
```

These commands should be run after `kubeadm init` but before `kubeadm join`.

### Using kubeadm join with a configuration file {#config-file}

**Caution:** The config file is
still considered alpha and may change in future versions.
{: .caution}

It's possible to configure `kubeadm join` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in the `--config` option.

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: NodeConfiguration
caCertPath: <path|string>
discoveryFile: <path|string>
discoveryToken: <string>
discoveryTokenAPIServers:
- <address|string>
- <address|string>
nodeName: <string>
tlsBootstrapToken: <string>
token: <string>
discoveryTokenCACertHashes:
- <SHA-256 hash|string>
- <SHA-256 hash|string>
discoveryTokenUnsafeSkipCAVerification: <bool>
```
{% endcapture %}

{% capture whatsnext %}
* [kubeadm init](kubeadm-init.md) to bootstrap a Kubernetes master node
* [kubeadm token](kubeadm-token.md) to manage tokens for `kubeadm join`
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
{% endcapture %}

{% include templates/concept.md %}
