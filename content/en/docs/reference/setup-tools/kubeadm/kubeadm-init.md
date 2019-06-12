---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm init
content_template: templates/concept
weight: 20
---
{{% capture overview %}}
This command initializes a Kubernetes control-plane node.
{{% /capture %}}

{{% capture body %}}

{{< include "generated/kubeadm_init.md" >}}

### Init workflow {#init-workflow}
`kubeadm init` bootstraps a Kubernetes control-plane node by executing the
following steps:

1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--ignore-preflight-errors=<list-of-errors>`.

1. Generates a self-signed CA (or using an existing one if provided) to set up
   identities for each component in the cluster. If the user has provided their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default) this step is skipped as described in the
   [Using custom certificates](#custom-certificates) document.
   The APIServer certs will have additional SAN entries for any `--apiserver-cert-extra-sans` arguments, lowercased if necessary.

1. Writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each with its own identity, as well as an additional
   kubeconfig file for administration named `admin.conf`.

1. Generates static Pod manifests for the API server,
   controller manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest is generated for etcd.

   Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup.

   Once control plane Pods are up and running, the `kubeadm init` sequence can continue.

1. Apply labels and taints to the control-plane node so that no additional workloads will
   run there.

1. Generates the token that additional nodes can use to register
   themselves with a control-plane in the future. Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) docs.

1. Makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests.

   See [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) for additional info.

1. Installs a DNS server (CoreDNS) and the kube-proxy addon components via the API server.
   In Kubernetes version 1.11 and later CoreDNS is the default DNS server.
   To install kube-dns instead of CoreDNS, the DNS addon has to configured in the kubeadm `ClusterConfiguration`. For more information about the configuration see the section
   `Using kubeadm init with a configuration file` bellow.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.

### Using init phases with kubeadm {#init-phases}

Kubeadm allows you create a control-plane node in phases. In 1.13 the `kubeadm init phase` command has graduated to GA from it’s previous alpha state under `kubeadm alpha phase`.

To view the ordered list of phases and sub-phases you can call `kubeadm init --help`. The list will be located at the top of the help screen and each phase will have a description next to it.
Note that by calling `kubeadm init` all of the phases and sub-phases will be executed in this exact order.

Some phases have unique flags, so if you want to have a look at the list of available options add `--help`, for example:

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

You can also use `--help` to see the list of sub-phases for a certain parent phase:

```shell
sudo kubeadm init phase control-plane --help
```

`kubeadm init` also expose a flag called `--skip-phases` that can be used to skip certain phases. The flag accepts a list of phase names and the names can be taken from the above ordered list.

An example:

```shell
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# you can now modify the control plane and etcd manifest files
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

What this example would do is write the manifest files for the control plane and etcd in `/etc/kubernetes/manifests` based on the configuration in `configfile.yaml`. This allows you to modify the files and then skip these phases using `--skip-phases`. By calling the last command you will create a control plane node with the custom manifest files.

### Using kubeadm init with a configuration file {#config-file}

{{< caution >}}
The config file is still considered beta and may change in future versions.
{{< /caution >}}

It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed in the `--config` option.

In Kubernetes 1.11 and later, the default configuration can be printed out using the
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

It is **recommended** that you migrate your old `v1alpha3` configuration to `v1beta1` using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command,
because `v1alpha3` will be removed in Kubernetes 1.15.

For more details on each field in the `v1beta1` configuration you can navigate to our
[API reference pages](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta1).

### Adding kube-proxy parameters {#kube-proxy}

For information about kube-proxy parameters in the kubeadm configuration see:
- [kube-proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)

For information about enabling IPVS mode with kubeadm see:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

### Passing custom flags to control plane components {#control-plane-flags}

For information about passing flags to control plane components see:
- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

### Using custom images {#custom-images}

By default, kubeadm pulls images from `k8s.gcr.io`, unless
the requested Kubernetes version is a CI version. In this case,
`gcr.io/kubernetes-ci-images` is used.

You can override this behavior by using [kubeadm with a configuration file](#config-file).
Allowed customization are:

* To provide an alternative `imageRepository` to be used instead of
  `k8s.gcr.io`.
* To set `useHyperKubeImage` to `true` to use the HyperKube image.
* To provide a specific `imageRepository` and `imageTag` for etcd or DNS add-on.

Please note that the configuration field `kubernetesVersion` or the command line flag
`--kubernetes-version` affect the version of the images.

### Using custom certificates {#custom-certificates}

By default, kubeadm generates all the certificates needed for a cluster to run.
You can override this behavior by providing your own certificates.

To do so, you must place them in whatever directory is specified by the
`--cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`.

If a given certificate and private key pair exists, kubeadm skips the
generation step and existing files are used for the prescribed
use case. This means you can, for example, copy an existing CA into `/etc/kubernetes/pki/ca.crt`
and `/etc/kubernetes/pki/ca.key`, and kubeadm will use this CA for signing the rest
of the certs.

#### External CA mode {#external-ca-mode}

It is also possible to provide just the `ca.crt` file and not the
`ca.key` file (this is only available for the root CA file, not other cert pairs).
If all other certificates and kubeconfig files are in place, kubeadm recognizes
this condition and activates the "External CA" mode. kubeadm will proceed without the
CA key on disk.

Instead, run the controller-manager standalone with `--controllers=csrsigner` and
point to the CA certificate and key.

### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}

The kubeadm package ships with configuration for how the kubelet should
be run. Note that the `kubeadm` CLI command never touches this drop-in file.
This drop-in file belongs to the kubeadm deb/rpm package.

To find out more about how kubeadm manages the kubelet have a look at
[this page](/docs/setup/independent/kubelet-integration).

### Use kubeadm with CRI runtimes

Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.
The container runtime used by default is Docker, which is enabled through the built-in
`dockershim` CRI implementation inside of the `kubelet`.

Other CRI-based runtimes include:

- [cri-containerd](https://github.com/containerd/cri-containerd)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

Refer to the [CRI installation instructions](/docs/setup/cri) for more information.

After you have successfully installed `kubeadm` and `kubelet`, execute
these two additional steps:

1. Install the runtime shim on every node, following the installation
   document in the runtime shim project listing above.

1. Configure kubelet to use the remote CRI runtime. Please remember to change
   `RUNTIME_ENDPOINT` to your own value like `/var/run/{your_runtime}.sock`:

```shell
cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
[Service]
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT"
EOF
systemctl daemon-reload
```

Now `kubelet` is ready to use the specified CRI runtime, and you can continue
with the `kubeadm init` and `kubeadm join` workflow to deploy Kubernetes cluster.

You may also want to set `--cri-socket` to `kubeadm init` and `kubeadm reset` when
using an external CRI implementation.

### Setting the node name

By default, `kubeadm` assigns a node name based on a machine's host address. You can override this setting with the `--node-name`flag.
The flag passes the appropriate [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options)
to the kubelet.

Be aware that overriding the hostname can [interfere with cloud providers](https://github.com/kubernetes/website/pull/8873).

### Self-hosting the Kubernetes control plane {#self-hosting}

As of 1.8, you can experimentally create a _self-hosted_ Kubernetes control
plane. This means that key components such as the API server, controller
manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/)
configured in the kubelet via static files.

To create a self-hosted cluster see the `kubeadm alpha selfhosting` command.

#### Caveats

1. Self-hosting in 1.8 and later has some important limitations. In particular, a
  self-hosted cluster _cannot recover from a reboot of the control-plane node_
  without manual intervention.

1. A self-hosted cluster is not upgradeable using `kubeadm upgrade`.

1. By default, self-hosted control plane Pods rely on credentials loaded from
  [`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
  volumes. Except for initial creation, these credentials are not managed by
  kubeadm.

1. The self-hosted portion of the control plane does not include etcd,
  which still runs as a static Pod.

#### Process

The self-hosting bootstrap process is documented in the [kubeadm design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting).

In summary, `kubeadm alpha selfhosting` works as follows:

  1. Waits for this bootstrap static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting.

  1. Uses the static control plane Pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.
    It also modifies these manifests where necessary, for example adding new volumes
    for secrets.

  1. Creates DaemonSets in the `kube-system` namespace and waits for the
     resulting Pods to be running.

  1. Once self-hosted Pods are operational, their associated static Pods are deleted
     and kubeadm moves on to install the next component. This triggers kubelet to
     stop those static Pods.

  1. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active.

### Running kubeadm without an internet connection

For running kubeadm without an internet connection you have to pre-pull the required control-plane images.

In Kubernetes 1.11 and later, you can list and pull the images using the `kubeadm config images` sub-command:

```shell
kubeadm config images list
kubeadm config images pull
```

In Kubernetes 1.12 and later, the `k8s.gcr.io/kube-*`, `k8s.gcr.io/etcd` and `k8s.gcr.io/pause` images
don't require an `-${ARCH}` suffix.

### Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), you can parallelize the
token distribution for easier automation. To implement this automation, you must
know the IP address that the control-plane node will have after it is started.

1.  Generate a token. This token must have the form  `<6 character string>.<16
    character string>`.  More formally, it must match the regex:
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm can generate a token for you:

    ```shell
    kubeadm token generate
    ```

1. Start both the control-plane node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.

Once the cluster is up, you can grab the admin credentials from the control-plane node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.

Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).

{{% /capture %}}

{{% capture whatsnext %}}
* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) to understand more about
`kubeadm init` phases
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
{{% /capture %}}
