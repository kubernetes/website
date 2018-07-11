## Upgrading your `v1alpha1` kubeadm configuration files to `v1alpha2`

This document explains what semantics have changed between `v1alpha1` and `v1alpha2` of the kubeadm config API types, and why. `v1alpha2` was released with kubeadm v1.11.

#### Important notes

- The `v1alpha1` and `v1alpha2` APIs **aren't marked stable** yet, so their semantics will (possibly significantly) change before reaching `v1beta1`. Between `v1beta1` and `v1` the delta is expected to be small/non-existent.
- **All your `v1alpha1`  configuration files can be read by kubeadm v1.11 and are automatically upgraded to `v1alpha2` internally**. This means you don't _technically_ need to read this document and upgrade each field separately, kubeadm takes care of this automatically under the hood.
  - The policy is the follwing: If a given API version `v1alphaY` was released in kubeadm v1.Z to replace the existing `v1alphaX` API version, reading `v1alphaX` files in kubeadm v1.Z will work, but kubeadm v1.Z will only _write_ the newer API version `v1alphaY` 


#### Using the `kubeadm config migrate` command for automatic conversion

There is  a `kubeadm config migrate` command you might use to convert your old `v1alpha1` configuration files to the newer `v1alpha2` spec. For instance, if you have your existing configuration file `config-v1alpha1.yaml` and want to get the matching `v1alpha2` spec, run the following command:

```
kubeadm config migrate --old-config config-v1alpha1.yaml --new-config config-v1alpha1.yaml
```

You can also omit the `--new-config` flag and `kubeadm` will print to `stdout`.


### API Changes between `v1alpha1` and `v1alpha2`

#### The `.CloudProvider` and `.PrivilegedPods`fields are gone

In-tree cloud providers that `.CloudProvider` once enabled on a best-effort, experimental 
basis are deprecated, and use of [out-of-tree cloud providers](#TODO) is encouraged instead.
If you still want to enable the in-tree cloud provider extensions, utilize the extra argument 
string-string maps that already exist like this:

```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
apiServerExtraArgs:
  cloud-provider: foo
controllerManagerExtraArgs:
  cloud-provider: foo
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: foo
```

The `.PrivilegedPods` boolean field made the API Server and controller manager Static
Pods be privileged Pods, as there is one cloud provider that needs that. However, this can be
equally well by editing the Static Pod manifests after `kubeadm init` has been run.

#### The unused `.Etcd.SelfHosted` field has been removed

It was never actually used by anything in kubeadm, only planned to be used in the future. 
However, the SIG Cluster Lifecycle team decided to not proceed with the feature.

#### The `.Etcd` has been refactored

There are two modes of hosting etcd for kubeadm clusters: locally or externally. Still, this
wasn't reflected in the `v1alpha1` config, hosting fields from both modes under the same
`.Etcd` struct like this:

```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
etcd:
  caFile: ""
  certFile: ""
  dataDir: /var/lib/etcd
  endpoints: null
  image: ""
  keyFile: ""
```

Now, in `v1alpha2`, this is the way to configure a locally-hosted etcd instance:

```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
etcd:
  local:
    dataDir: /var/lib/etcd
    extraArgs:
      enable-pprof: true
    serverCertSANs:
    - my-awesome-extra-hostname
    peerCertSANs:
    - my-awesome-extra-hostname
```

This is how you tell kubeadm to use an external etcd cluster using `v1alpha2`:

```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
etcd:
  external:
    caFile: /etc/kubernetes/pki/etcd/ca.crt
    certFile: /etc/kubernetes/pki/etcd/server.crt
    endpoints:
    - https://first-etcd-instance:2379
    - https://second-etcd-instance:2379
    - https://third-etcd-instance:2379
    keyFile: /etc/kubernetes/pki/etcd/server.key
```

#### `.NodeName` and `.CRISocket` have been moved to `.NodeRegistration`

What was formerly `.NodeName` in `v1alpha1` is now `.NodeRegistration.Name` in `v1alpha2`. `.CRISocket` in `v1alpha1` has been moved to `.NodeRegistration.CRISocket`.

This change was made for both `MasterConfiguration` and `NodeConfiguration`.

Note that the `.NodeRegistration` field is not uploaded to the `kubeadm-config` ConfigMap, instead only used at `kubeadm init` or `kubeadm join` time.

#### `.NoTaintMaster` has been removed

The `.NoTaintMaster` boolean field isn't necessary anymore, given the addition of the 
`.NodeRegistration.Taints` slice consisting of `v1.Taint` object. By default, this field
is omitted when marshalling the struct, and this field is a pointer so it is `nil` by default.
If `.NodeRegistration.Taints` is `nil` when `kubeadm init` runs, the default master
taint is automatically gonna be applied. If you don't want the master taint to be applied, set 
`.NodeRegistration.Taints` to an empty slice, which tells kubeadm this is an intentional choice.

In other words, `noTaintMaster: true` is now:

```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
nodeRegistration:
  taints: {}
```

#### The Bootstrap Token-related fields have been put in the same struct

In `v1alpha1`, there were these four fields directly under `MasterConfiguration`:

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
token: s73ybu.6tw6wnqgp5z0wb77
tokenGroups:
- system:bootstrappers:kubeadm:default-node-token
tokenTTL: 24h0m0s
tokenUsages:
- signing
- authentication
```

This layout has several drawbacks, inclusive of the "token" prefix being duplicated for all fields, 
that it's not possible to specify several bootstrap tokens at once, and that similar fields should
not be hosted in the top-level `MasterConfiguration` struct.

In `v1alpha2`, there is a slice of called `.BootstrapTokens` that contains `BootstrapToken` objects that look like this: 

```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
bootstrapTokens:
- description: "John Doe's Bootstrap Token for tomorrow"
  groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: s73ybu.6tw6wnqgp5z0wb77
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
```

There is also a new `expires` field you may use instead of setting a time-to-live value, which has the effect that the actual expiration time is dependent on the time `kubeadm init` executes, which might not be ideal in some environments. The `expires` field solves this need. It expects the `time.RFC3339` Go time format.

```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
bootstrapTokens:
- token: s73ybu.6tw6wnqgp5z0wb77
  expires: 2020-01-01T01:01:01Z
- token: jqrk5l.m7x2bnmgqoia1w2x
  expires: 2030-01-01T01:01:01Z
```
