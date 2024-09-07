---
title: kubeadm init
content_type: concept
weight: 20
---

<!-- overview -->

This command initializes a Kubernetes control-plane node.

<!-- body -->

{{< include "generated/kubeadm_init/_index.md" >}}

### Init workflow {#init-workflow}

`kubeadm init` bootstraps a Kubernetes control-plane node by executing the
following steps:

1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--ignore-preflight-errors=<list-of-errors>`.

1. Generates a self-signed CA to set up identities for each component in the cluster. The user can provide their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default).
   The APIServer certs will have additional SAN entries for any `--apiserver-cert-extra-sans`
   arguments, lowercased if necessary.

1. Writes kubeconfig files in `/etc/kubernetes/` for the kubelet, the controller-manager and the
   scheduler to use to connect to the API server, each with its own identity. Also
   additional kubeconfig files are written, for kubeadm as administrative entity (`admin.conf`)
   and for a super admin user that can bypass RBAC (`super-admin.conf`).

1. Generates static Pod manifests for the API server,
   controller-manager and scheduler. In case an external etcd is not provided,
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
   [TLS Bootstrap](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests.

   See [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) for additional info.

1. Installs a DNS server (CoreDNS) and the kube-proxy addon components via the API server.
   In Kubernetes version 1.11 and later CoreDNS is the default DNS server.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.

   {{< warning >}}
   kube-dns usage with kubeadm is deprecated as of v1.18 and is removed in v1.21.
   {{< /warning >}}

### Using init phases with kubeadm {#init-phases}

Kubeadm allows you to create a control-plane node in phases using the `kubeadm init phase` command.

To view the ordered list of phases and sub-phases you can call `kubeadm init --help`. The list
will be located at the top of the help screen and each phase will have a description next to it.
Note that by calling `kubeadm init` all of the phases and sub-phases will be executed in this exact order.

Some phases have unique flags, so if you want to have a look at the list of available options add
`--help`, for example:

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

You can also use `--help` to see the list of sub-phases for a certain parent phase:

```shell
sudo kubeadm init phase control-plane --help
```

`kubeadm init` also exposes a flag called `--skip-phases` that can be used to skip certain phases.
The flag accepts a list of phase names and the names can be taken from the above ordered list.

An example:

```shell
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# you can now modify the control plane and etcd manifest files
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

What this example would do is write the manifest files for the control plane and etcd in
`/etc/kubernetes/manifests` based on the configuration in `configfile.yaml`. This allows you to
modify the files and then skip these phases using `--skip-phases`. By calling the last command you
will create a control plane node with the custom manifest files.

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Alternatively, you can use the `skipPhases` field under `InitConfiguration`.

### Using kubeadm init with a configuration file {#config-file}

{{< caution >}}
The config file is still considered beta and may change in future versions.
{{< /caution >}}

It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed using the `--config` flag and it must
contain a `ClusterConfiguration` structure and optionally more structures separated by `---\n`
Mixing `--config` with others flags may not be allowed in some cases.

The default configuration can be printed out using the
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

If your configuration is not using the latest version it is **recommended** that you migrate using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

For more information on the fields and usage of the configuration you can navigate to our
[API reference page](/docs/reference/config-api/kubeadm-config.v1beta4/).

### Using kubeadm init with feature gates {#feature-gates}

Kubeadm supports a set of feature gates that are unique to kubeadm and can only be applied
during cluster creation with `kubeadm init`. These features can control the behavior
of the cluster. Feature gates are removed after a feature graduates to GA.

To pass a feature gate you can either use the `--feature-gates` flag for
`kubeadm init`, or you can add items into the `featureGates` field when you pass
a [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-ClusterConfiguration)
using `--config`.

Passing [feature gates for core Kubernetes components](/docs/reference/command-line-tools-reference/feature-gates)
directly to kubeadm is not supported. Instead, it is possible to pass them by
[Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

List of feature gates:

{{< table caption="kubeadm feature gates" >}}
Feature | Default | Alpha | Beta | GA
:-------|:--------|:------|:-----|:----
`ControlPlaneKubeletLocalMode` | `false` | 1.31 | - | -
`EtcdLearnerMode` | `true` | 1.27 | 1.29 | -
`PublicKeysECDSA` | `false` | 1.19 | - | -
`WaitForAllControlPlaneComponents` | `false` | 1.30 | - | -
{{< /table >}}

{{< note >}}
Once a feature gate goes GA its value becomes locked to `true` by default.
{{< /note >}}

Feature gate descriptions:

`ControlPlaneKubeletLocalMode`
: With this feature gate enabled, when joining a new control plane node, kubeadm will configure the kubelet
to connect to the local kube-apiserver. This ensures that there will not be a violation of the version skew
policy during rolling upgrades.

`EtcdLearnerMode`
: With this feature gate enabled, when joining a new control plane node, a new etcd member will be created
as a learner and promoted to a voting member only after the etcd data are fully aligned.

`PublicKeysECDSA`
: Can be used to create a cluster that uses ECDSA certificates instead of the default RSA algorithm.
Renewal of existing ECDSA certificates is also supported using `kubeadm certs renew`, but you cannot
switch between the RSA and ECDSA algorithms on the fly or during upgrades. Kubernetes
{{< skew currentVersion >}} has a bug where keys in generated kubeconfig files are set use RSA
despite the feature gate being enabled. Kubernetes versions before v1.31 had a bug where keys in generated kubeconfig files
were set use RSA, even when you had enabled the `PublicKeysECDSA` feature gate.

`WaitForAllControlPlaneComponents`
: With this feature gate enabled kubeadm will wait for all control plane components (kube-apiserver,
kube-controller-manager, kube-scheduler) on a control plane node to report status 200 on their `/healthz`
endpoints. These checks are performed on `https://127.0.0.1:PORT/healthz`, where `PORT` is taken from
`--secure-port` of a component. If you specify custom `--secure-port` values in the kubeadm configuration
they will be respected. Without the feature gate enabled, kubeadm will only wait for the kube-apiserver
on a control plane node to become ready. The wait process starts right after the kubelet on the host
is started by kubeadm. You are advised to enable this feature gate in case you wish to observe a ready
state from all control plane components during the `kubeadm init` or `kubeadm join` command execution.

List of deprecated feature gates:

{{< table caption="kubeadm deprecated feature gates" >}}
Feature | Default | Alpha | Beta | GA | Deprecated
:-------|:--------|:------|:-----|:---|:----------
`RootlessControlPlane` | `false` | 1.22 | - | - | 1.31
{{< /table >}}

Feature gate descriptions:

`RootlessControlPlane`
: Setting this flag configures the kubeadm deployed control plane component static Pod containers
for `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `etcd` to run as non-root users.
If the flag is not set, those components run as root. You can change the value of this feature gate before
you upgrade to a newer version of Kubernetes.

List of removed feature gates:

{{< table caption="kubeadm removed feature gates" >}}
Feature | Alpha | Beta | GA | Removed
:-------|:------|:-----|:---|:-------
`IPv6DualStack` | 1.16 | 1.21 | 1.23 | 1.24
`UnversionedKubeletConfigMap` | 1.22 | 1.23 | 1.25 | 1.26
`UpgradeAddonsBeforeControlPlane` | 1.28 | - | - | 1.31
{{< /table >}}

Feature gate descriptions:

`IPv6DualStack`
: This flag helps to configure components dual stack when the feature is in progress. For more details on Kubernetes
dual-stack support see [Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).

`UnversionedKubeletConfigMap`
: This flag controls the name of the {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} where kubeadm stores
kubelet configuration data. With this flag not specified or set to `true`, the ConfigMap is named `kubelet-config`.
If you set this flag to `false`, the name of the ConfigMap includes the major and minor version for Kubernetes
(for example: `kubelet-config-{{< skew currentVersion >}}`). Kubeadm ensures that RBAC rules for reading and writing
that ConfigMap are appropriate for the value you set. When kubeadm writes this ConfigMap (during `kubeadm init`
or `kubeadm upgrade apply`), kubeadm respects the value of `UnversionedKubeletConfigMap`. When reading that ConfigMap
(during `kubeadm join`, `kubeadm reset`, `kubeadm upgrade ...`), kubeadm attempts to use unversioned ConfigMap name first;
if that does not succeed, kubeadm falls back to using the legacy (versioned) name for that ConfigMap.

`UpgradeAddonsBeforeControlPlane`
: This feature gate has been removed. It was introduced in v1.28 as a deprecated feature and then removed in v1.31. For documentation on older versions, please switch to the corresponding website version.

### Adding kube-proxy parameters {#kube-proxy}

For information about kube-proxy parameters in the kubeadm configuration see:
- [kube-proxy reference](/docs/reference/config-api/kube-proxy-config.v1alpha1/)

For information about enabling IPVS mode with kubeadm see:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

### Passing custom flags to control plane components {#control-plane-flags}

For information about passing flags to control plane components see:
- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

### Running kubeadm without an Internet connection {#without-internet-connection}

For running kubeadm without an Internet connection you have to pre-pull the required control-plane images.

You can list and pull the images using the `kubeadm config images` sub-command:

```shell
kubeadm config images list
kubeadm config images pull
```

You can pass `--config` to the above commands with a [kubeadm configuration file](#config-file)
to control the `kubernetesVersion` and `imageRepository` fields.

All default `registry.k8s.io` images that kubeadm requires support multiple architectures.

### Using custom images {#custom-images}

By default, kubeadm pulls images from `registry.k8s.io`. If the
requested Kubernetes version is a CI label (such as `ci/latest`)
`gcr.io/k8s-staging-ci-images` is used.

You can override this behavior by using [kubeadm with a configuration file](#config-file).
Allowed customization are:

* To provide `kubernetesVersion` which affects the version of the images.
* To provide an alternative `imageRepository` to be used instead of
  `registry.k8s.io`.
* To provide a specific `imageRepository` and `imageTag` for etcd or CoreDNS.

Image paths between the default `registry.k8s.io` and a custom repository specified using
`imageRepository` may differ for backwards compatibility reasons. For example,
one image might have a subpath at `registry.k8s.io/subpath/image`, but be defaulted
to `my.customrepository.io/image` when using a custom repository.

To ensure you push the images to your custom repository in paths that kubeadm
can consume, you must:

* Pull images from the defaults paths at `registry.k8s.io` using `kubeadm config images {list|pull}`.
* Push images to the paths from `kubeadm config images list --config=config.yaml`,
where `config.yaml` contains the custom `imageRepository`, and/or `imageTag`
for etcd and CoreDNS.
* Pass the same `config.yaml` to `kubeadm init`.

#### Custom sandbox (pause) images {#custom-pause-image}

To set a custom image for these you need to configure this in your
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to use the image.
Consult the documentation for your container runtime to find out how to change this setting;
for selected container runtimes, you can also find advice within the
[Container Runtimes](/docs/setup/production-environment/container-runtimes/) topic.

### Uploading control-plane certificates to the cluster

By adding the flag `--upload-certs` to `kubeadm init` you can temporary upload
the control-plane certificates to a Secret in the cluster. Please note that this Secret
will expire automatically after 2 hours. The certificates are encrypted using
a 32byte key that can be specified using `--certificate-key`. The same key can be used
to download the certificates when additional control-plane nodes are joining, by passing
`--control-plane` and `--certificate-key` to `kubeadm join`.

The following phase command can be used to re-upload the certificates after expiration:

```shell
kubeadm init phase upload-certs --upload-certs --config=SOME_YAML_FILE
```
{{< note >}}
A predefined `certificateKey` can be provided in `InitConfiguration` when passing the
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/) with `--config`.
{{< /note >}}

If a predefined certificate key is not passed to `kubeadm init` and
`kubeadm init phase upload-certs` a new key will be generated automatically.

The following command can be used to generate a new key on demand:

```shell
kubeadm certs certificate-key
```

### Certificate management with kubeadm

For detailed information on certificate management with kubeadm see
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
The document includes information about using external CA, custom certificates
and certificate renewal.

### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}

The `kubeadm` package ships with a configuration file for running the `kubelet` by `systemd`.
Note that the kubeadm CLI never touches this drop-in file. This drop-in file is part of the kubeadm
DEB/RPM package.

For further information, see
[Managing the kubeadm drop-in file for systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).

### Use kubeadm with CRI runtimes

By default kubeadm attempts to detect your container runtime. For more details on this detection,
see the [kubeadm CRI installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

### Setting the node name

By default, `kubeadm` assigns a node name based on a machine's host address.
You can override this setting with the `--node-name` flag.
The flag passes the appropriate [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options)
value to the kubelet.

Be aware that overriding the hostname can
[interfere with cloud providers](https://github.com/kubernetes/website/pull/8873).

### Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/),
you can parallelize the token distribution for easier automation. To implement this automation,
you must know the IP address that the control-plane node will have after it is started, or use a
DNS name or an address of a load balancer.

1. Generate a token. This token must have the form  `<6 character string>.<16
   character string>`. More formally, it must match the regex:
   `[a-z0-9]{6}\.[a-z0-9]{16}`.

   kubeadm can generate a token for you:

   ```shell
    kubeadm token generate
   ```

1. Start both the control-plane node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.

1. Similar can be done for `--certificate-key` when joining additional control-plane
   nodes. The key can be generated using:

   ```shell
   kubeadm certs certificate-key
   ```

Once the cluster is up, you can use the `/etc/kubernetes/admin.conf` file from
a control-plane node to talk to the cluster with administrator credentials or
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).

Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).

## {{% heading "whatsnext" %}}

* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) to understand more about
  `kubeadm init` phases
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes
  worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes
  cluster to a newer version
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made
  to this host by `kubeadm init` or `kubeadm join`

