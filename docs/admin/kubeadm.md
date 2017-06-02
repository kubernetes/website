---
assignees:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: kubeadm Setup Tool
---

This document provides information on how to use kubeadm's advanced options.

Running `kubeadm init` bootstraps a Kubernetes cluster. This consists of the
following steps:

1. kubeadm runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--skip-preflight-checks`.

1. kubeadm generates a token that additional nodes can use to register
   themselves with the master in future.  Optionally, the user can provide a
   token.

1. kubeadm generates a self-signed CA to provision identities for each component
   (including nodes) in the cluster.  It also generates client certificates to
   be used by various components.

1. Outputting a kubeconfig file for the kubelet to use to connect to the API
   server, as well as an additional kubeconfig file for administration.

1. kubeadm generates Kubernetes Static Pod manifests for the API server,
   controller manager and scheduler.  It places them in
   `/etc/kubernetes/manifests`. The kubelet watches this directory for Pods to
   create on startup. These are the core components of Kubernetes. Once they are
   up and running kubeadm can set up and manage any additional components.

1. kubeadm "taints" the master node so that only control plane components will
   run there.  It also sets up the RBAC authorization system and writes a
   special ConfigMap that is used to bootstrap trust with the kubelets.

1. kubeadm installs add-on components via the API server.  Right now this is
   the internal DNS server and the kube-proxy DaemonSet.

Running `kubeadm join` on each node in the cluster consists of the following
steps:

1. kubeadm downloads root CA information from the API server.  It uses the token
   to verify the authenticity of that data.

1. kubeadm creates a local key pair.  It prepares a certificate signing request
   (CSR) and sends that off to the API server for signing.  The bootstrap token
   is used to authenticate.  The API server is configured to sign this
   automatically.

1. kubeadm configures the local kubelet to connect to the API server

## Usage

Fields that support multiple values do so either with comma separation, or by
specifying the flag multiple times.

The kubeadm command line interface is currently in **beta**.  We are aiming to
not break any scripted use of the main `kubeadm init` and `kubeadm join`.  The
single exception here is the format of the kubeadm config file as detailed
below.  That format is still considered alpha and may change.

### `kubeadm init`

It is usually sufficient to run `kubeadm init` without any flags, but in some
cases you might like to override the default behaviour. Here we specify all the
flags that can be used to customise the Kubernetes installation.

- `--apiserver-advertise-address`

This is the address the API Server will advertise to other members of the
cluster.  This is also the address used to construct the suggested `kubeadm
join` line at the end of the init process.  If not set (or set to 0.0.0.0) then
IP for the default interface will be used.

This address is also added to the certifcate that the API Server uses.

- `--apiserver-bind-port`

The port that the API server will bind on.  This defaults to 6443.

- `--apiserver-cert-extra-sans`

Additional hostnames or IP addresses that should be added to the Subject
Alternate Name section for the certificate that the API Server will use.  If you
expose the API Server through a load balancer and public DNS you could specify
this with

```
--apiserver-cert-extra-sans=kubernetes.example.com,kube.example.com,10.100.245.1
```

- `--cert-dir`

The path where to save and store the certificates.  The default is
"/etc/kubernetes/pki".

- `--config`

A kubeadm specific [config file](#config-file).  This can be used to specify an
extended set of options including passing arbitrary command line flags to the
control plane components.

- `--kubernetes-version` (default 'latest') the kubernetes version to initialise

The **v1.6** version of kubeadm only supports building clusters that are at
least **v1.6.0**.  There are many reasons for this including kubeadm's use of
RBAC, the Bootstrap Token system, and enhancements to the Certificates API. With
this flag you can try any future version of Kubernetes.  Check [releases
page](https://github.com/kubernetes/kubernetes/releases) for a full list of
available versions.

- `--pod-network-cidr`

For certain networking solutions the Kubernetes master can also play a role in
allocating network ranges (CIDRs) to each node. This includes many cloud
providers and flannel. You can specify a subnet range that will be broken down
and handed out to each node with the `--pod-network-cidr` flag. This should be a
minimum of a /16 so controller-manager is able to assign /24 subnets to each
node in the cluster. If you are using flannel with [this
manifest](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml)
you should use `--pod-network-cidr=10.244.0.0/16`. Most CNI based networking
solutions do not require this flag.

- `--service-cidr` (default '10.96.0.0/12')

You can use the `--service-cidr` flag to override the subnet Kubernetes uses to
assign pods IP addresses. If you do, you will also need to update the
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file to reflect this
change else DNS will not function correctly.

- `--service-dns-domain` (default 'cluster.local')

By default, `kubeadm init` deploys a cluster that assigns services with DNS
names `<service_name>.<namespace>.svc.cluster.local`. You can use the
`--service-dns-domain` to change the DNS name suffix. Again, you will need to
update the `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file
accordingly else DNS will not function correctly.

- `--skip-preflight-checks`

By default, kubeadm runs a series of preflight checks to validate the system
before making any changes. Advanced users can use this flag to bypass these if
necessary.

- `--token`

By default, `kubeadm init` automatically generates the token used to initialise
each new node. If you would like to manually specify this token, you can use the
`--token` flag. The token must be of the format `[a-z0-9]{6}\.[a-z0-9]{16}`.  A
compatible random token can be generated `kubeadm token generate`.  Tokens can
be managed through the API after the cluster is created.  See the [section on
managing tokens](#manage-tokens) below.

- `--token-ttl`

This sets an expiration time for the token.  This is specified as a duration
from the current time.  After this time the token will no longer be valid and
will be removed. A value of 0 specifies that the token never expires.  0 is the
default.  See the [section on managing tokens](#manage-tokens) below.

### `kubeadm join`

When joining a kubeadm initialized cluster, we need to establish bidirectional
trust. This is split into discovery (having the Node trust the Kubernetes
master) and TLS bootstrap (having the Kubernetes master trust the Node).

There are 2 main schemes for discovery. The first is to use a shared token along
with the IP address of the API server. The second is to provide a file (a subset
of the standard kubeconfig file). This file can be a local file or downloaded
via an HTTPS URL. The forms are `kubeadm join --discovery-token
abcdef.1234567890abcdef 1.2.3.4:6443`, `kubeadm join --discovery-file
path/to/file.conf` or `kubeadm join --discovery-file https://url/file.conf`.
Only one form can be used. If the discovery information is loaded from a URL,
HTTPS must be used and the host installed CA bundle is used to verify the
connection.

The TLS bootstrap mechanism is also driven via a shared token. This is used to
temporarily authenticate with the Kubernetes master to submit a certificate
signing request (CSR) for a locally created key pair. By default kubeadm will
set up the Kubernetes master to automatically approve these signing requests.
This token is passed in with the `--tls-bootstrap-token abcdef.1234567890abcdef`
flag.

Often times the same token is use for both parts. In this case, the `--token` flag
can be used instead of specifying the each token individually.

Here's an example on how to use it:

`kubeadm join --token=abcdef.1234567890abcdef 192.168.1.1:6443`

Specific options:

- `--config`

Extended options a specified in the [kubeadm specific config file](#config-file).

- `--skip-preflight-checks`

By default, kubeadm runs a series of preflight checks to validate the system
before making any changes. Advanced users can use this flag to bypass these if
necessary.

- `--discovery-file`

A local file path or HTTPS URL.  The file specified must be a kubeconfig file
with nothing but an unnamed cluster entry.  This is used to find both the
location of the API server to join along with a root CA bundle to use when
talking to that server.

This might look something like this:

``` yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <really long certificate data>
    server: https://10.138.0.2:6443
  name: ""
contexts: []
current-context: ""
kind: Config
preferences: {}
users: []
```

- `--discovery-token`

The discovery token is used along with the address of the API server (as an
unnamed argument) to download and verify information about the cluster.  The
most critical part of the cluster information is the root CA bundle used to
verify the identity of the server during subsequent TLS connections.

- `--tls-bootstrap-token`

The token used to authenticate to the API server for the purposes of TLS
bootstrapping.

- `--token=<token>`

Often times the same token is used for both `--discovery-token` and
`--tls-bootstrap-token`.  This option specifies the same token for both.  Other
flags override this flag if present.

## Using kubeadm with a configuration file {#config-file}

**WARNING:** While kubeadm command line interface is in beta, the config file is
still considered alpha and may change in future versions.

It's possible to configure kubeadm with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in to the `--config` option on
both `kubeadm init` and `kubeadm join`.

### Sample Master Configuration

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
api:
  advertiseAddress: <address|string>
  bindPort: <int>
etcd:
  endpoints:
  - <endpoint1|string>
  - <endpoint2|string>
  caFile: <path|string>
  certFile: <path|string>
  keyFile: <path|string>
networking:
  dnsDomain: <string>
  serviceSubnet: <cidr>
  podSubnet: <cidr>
kubernetesVersion: <string>
cloudProvider: <string>
authorizationModes:
- <authorizationMode1|string>
- <authorizationMode2|string>
token: <string>
tokenTTL: <time duration>
selfHosted: <bool>
apiServerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
controllerManagerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
schedulerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
apiServerCertSANs:
  - <name1|string>
  - <name2|string>
certificatesDir: <string>
```
In addition, if authorizationMode is set to `ABAC`, you should write the config to `/etc/kubernetes/abac_policy.json`.
However, if authorizationMode is set to `Webhook`, you should write the config to `/etc/kubernetes/webhook_authz.conf`.

### Sample Node Configuration

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: NodeConfiguration
caCertPath: <path|string>
discoveryFile: <path|string>
discoveryToken: <string>

# Currently only the first server is used as a target for the cluster
# bootstrap flow.
discoveryTokenAPIServers:
  - <address|string>
  - <address|string>

tlsBootstrapToken: <string>
```

## Managing Tokens {#manage-tokens}

You can use the `kubeadm` tool to manage tokens on a running cluster.  It will
automatically grab the default admin credentials on a master from a `kubeadm`
created cluster (`/etc/kubernetes/admin.conf`).  You can specify an alternate
kubeconfig file for credentials with the `--kubeconfig` to the following
commands.

* `kubeadm token list` Lists the tokens along with when they expire and what the
  approved usages are.
* `kubeadm token create` Creates a new token.
    * `--description` Set the description on the new token.
    * `--ttl duration` Set expiration time of the token as a delta from "now".
      Default is 0 for no expiration. The unit of the duration is seconds.
    * `--usages` Set the ways that the token can be used.  The default is
      `signing,authentication`.  These are the usages as described above.
* `kubeadm token delete <token id>|<token id>.<token secret>` Delete a token.
  The token can either be identified with just an ID or with the entire token
  value.  Only the ID is used; the token is still deleted if the secret does not
  match.

In addition, you can use the `kubeadm token generate` command to locally creates
a new token.  This token is of the correct form for specifying with the
`--token` argument to `kubeadm init`.

For the gory details on how the tokens are implemented (including managing them
outside of kubeadm) see the [Bootstrap Token
docs](/docs/admin/bootstrap-tokens/).

## Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/admin/kubeadm/), you can
parallelize the token distribution for easier automation. To implement this
automation, you must know the IP address that the master will have after it is
started.

1.  Generate a token.  This token must have the form  `<6 character string>.<16
    character string>`.  More formally, it must match the regex
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    Kubeadm can generate a token for you:

    ``` bash
    kubeadm token generate
    ```

1. Start both the master node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.

Once the cluster is up, you can grab the admin credentials from the master node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.

## Environment variables

There are some environment variables that modify the way that kubeadm works.
Most users will have no need to set these. These environment variables are a
short-term solution, eventually they will be integrated in the kubeadm
configuration file.

| Variable | Default | Description |
| --- | --- | --- |
| `KUBE_KUBERNETES_DIR` | `/etc/kubernetes` | Where most configuration files are written to and read from |
| `KUBE_HYPERKUBE_IMAGE` | | If set, use a single hyperkube image with this name. If not set, individual images per server component will be used. |
| `KUBE_ETCD_IMAGE` | `gcr.io/google_containers/etcd-<arch>:3.0.17` | The etcd container image to use. |
| `KUBE_REPO_PREFIX` | `gcr.io/google_containers` | The image prefix for all images that are used. |

If `KUBE_KUBERNETES_DIR` is specified, you may need to rewrite the arguments of the kubelet.
(e.g. --kubeconfig, --pod-manifest-path)

If `KUBE_REPO_PREFIX` is specified, you may need to set the kubelet flag `--pod-infra-container-image` which specifies which pause image to use.
Defaults to `gcr.io/google_containers/pause-${ARCH}:3.0` where `${ARCH}` can be one of `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.

```bash
cat > /etc/systemd/system/kubelet.service.d/20-pod-infra-image.conf <<EOF
[Service]
Environment="KUBELET_EXTRA_ARGS=--pod-infra-container-image=<your-image>"
EOF
systemctl daemon-reload
systemctl restart kubelet
```

If you want to use kubeadm with an http proxy, you may need to configure it to
support http_proxy, https_proxy, or no_proxy.

For example, if your kube master node IP address is 10.18.17.16 and you have a
proxy which supports both http/https on 10.18.17.16 port 8080, you can use the
following command:

```bash
export PROXY_PORT=8080
export PROXY_IP=10.18.17.16
export http_proxy=http://$PROXY_IP:$PROXY_PORT
export HTTP_PROXY=$http_proxy
export https_proxy=$http_proxy
export HTTPS_PROXY=$http_proxy
export no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com,example.com,10.18.17.16"
```

Remember to change `proxy_ip` and add a kube master node IP address to
`no_proxy`.

## Releases and release notes

If you already have kubeadm installed and want to upgrade, run `apt-get update
&& apt-get upgrade` or `yum update` to get the latest version of kubeadm.

Refer to the
[CHANGELOG.md](https://github.com/kubernetes/kubeadm/blob/master/CHANGELOG.md)
for more information.
