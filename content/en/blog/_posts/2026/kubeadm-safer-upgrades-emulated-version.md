---
layout: blog
title: "kubeadm: Safer Control Plane Upgrades with Emulated Versions"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: kubeadm-safer-upgrades-emulated-version
author: >
  Paco Xu (DaoCloud)
---

For a long time, a Kubernetes control plane upgrade could only move forward.
As soon as a new kube-apiserver starts, it serves the APIs and turns on the features
of the new release, and clients and controllers can start to depend on them.
If you find a problem a few hours later, going back to the previous minor release is risky:
by then, the cluster may already store data that the older release does not understand.

[KEP-4330: Compatibility Versions](https://github.com/kubernetes/enhancements/tree/master/keps/sig-architecture/4330-compatibility-versions)
gives cluster administrators a way out. Control plane components can emulate an earlier
Kubernetes release through the `--emulated-version` command line argument, so a minor
version upgrade can happen in two steps: first you upgrade the binaries while the cluster
keeps behaving like the old release, then you switch on the new behavior once you are confident.

This article looks at compatibility versions from the point of view of
[kubeadm](/docs/reference/setup-tools/kubeadm/). kubeadm does not add a new API for this.
Everything you need is already there: `extraArgs` in the kubeadm `ClusterConfiguration`,
the phases of `kubeadm upgrade`, and the documented way to reconfigure a kubeadm cluster.
As an example, the walkthrough below upgrades a cluster from v1.37 to v1.38.

## What is an emulated version?

The [emulation option](/docs/concepts/cluster-administration/compatibility-version/)
is set with the `--emulated-version` argument of the control plane components;
kube-apiserver, kube-controller-manager, and kube-scheduler have accepted it since Kubernetes v1.32.
The emulated version can't be newer than the binary version, and each binary lists the range
it supports in its `--help` output. For example, kube-scheduler v1.37 accepts `1.34` to `1.37`.

When a component runs with an emulated version:

- capabilities that were introduced after the emulated version are not available;
- capabilities that were removed after the emulated version are still available;
- feature gates use the defaults of the emulated version.

Each component also has a minimum compatibility version, which you can set with
`--min-compatibility-version` since v1.35. It controls which older releases the component
stays compatible with, for example through the storage versions it writes to etcd,
and it defaults to one minor version below the emulated version.
The workflow in this article relies on that default, so you don't need to set it.

This is what makes a two-step upgrade possible. A v1.38 kube-apiserver that emulates v1.37
does not serve APIs or enable features that only exist in v1.38, so neither clients nor
controllers can start to use them, and the data it writes to etcd stays readable by v1.37.
As long as the emulated version stays at 1.37, moving the binaries back to v1.37 remains an option.

Here is how the state of the cluster changes during the upgrade:

| Stage | Control plane binaries | Emulated version | kube-proxy and kubelets | Roll back the binaries? |
| ----- | ---------------------- | ---------------- | ----------------------- | ----------------------- |
| Before the upgrade | v1.37 | 1.37 | v1.37 | Not applicable |
| Validation window (after step 2) | v1.38 | 1.37 | v1.37 | Possible |
| Finalized (after step 4) | v1.38 | 1.38 | Upgraded to v1.38 in step 5 | Not recommended |

## How kubeadm fits in

When this topic came up in [kubeadm#3263](https://github.com/kubernetes/kubeadm/issues/3263),
the conclusion was that kubeadm should not wrap configuration that is already possible with
`extraArgs` or component configuration. For compatibility versions, existing kubeadm features
cover the whole flow:

- `extraArgs` in the [v1beta4 `ClusterConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4/)
  pass `--emulated-version` to kube-apiserver, kube-controller-manager, and kube-scheduler.
  `kubeadm upgrade apply` and `kubeadm upgrade node` render the new static Pod manifests
  from the `ClusterConfiguration` stored in the `kubeadm-config` ConfigMap,
  so an argument stored there carries over to the new binaries.
- The `--skip-phases` flag of [`kubeadm upgrade`](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade-phase/)
  keeps CoreDNS and kube-proxy at their current version during the validation window.
- The steps in [Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/)
  raise the emulated version once you are done.

If you ever need `--min-compatibility-version`, you can set it the same way.

What kubeadm does not do is keep track of the emulated version for you. In particular,
the kubelet and kube-proxy don't support `--emulated-version`, and KEP-4330 restates the
[version skew policy](/releases/version-skew-policy/) in terms of the emulated version of
the API server: neither the kubelet nor kube-proxy may be newer than the version that
kube-apiserver emulates. Keep both at v1.37 until you finalize the upgrade.

## Before you begin

- You need a cluster that was created with kubeadm and runs v1.37.
- Read the v1.38 release notes and the [kubeadm upgrade guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
  Everything in that guide still applies; this article only changes the order of some steps.
  If you normally pass `--patches` to kubeadm, keep passing the same directory to every
  kubeadm command in this article.
- Back up etcd and the `/etc/kubernetes` directory on every control plane node.
- Rehearse the whole procedure, including the rollback, on a test cluster.

## Step 1: Pin the emulated version in the ClusterConfiguration

Edit the `ClusterConfiguration` that kubeadm stores in the cluster:

```shell
kubectl edit configmap kubeadm-config -n kube-system
```

Under `data.ClusterConfiguration`, add an `emulated-version` argument for the three
control plane components, next to any `extraArgs` you already have:

```yaml
apiServer:
  extraArgs:
  - name: emulated-version
    value: "1.37"
controllerManager:
  extraArgs:
  - name: emulated-version
    value: "1.37"
scheduler:
  extraArgs:
  - name: emulated-version
    value: "1.37"
```

Quote the value, so that YAML treats `1.37` as a string. The configuration is stored as a
YAML string inside the ConfigMap and is not validated when you save it, so check the
indentation carefully.

Nothing restarts at this point. The new argument is used the next time kubeadm writes the
static Pod manifests, which happens in the next step.

## Step 2: Upgrade the control plane binaries

Follow the [kubeadm upgrade guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
for the control plane nodes, with two differences: skip the `addon` phase,
and don't upgrade the kubelet yet.

On the first control plane node, after upgrading the kubeadm package to v1.38:

```shell
sudo kubeadm upgrade plan
sudo kubeadm upgrade apply v1.38.x --skip-phases=addon
```

Then, on each of the other control plane nodes, one node at a time:

```shell
sudo kubeadm upgrade node --skip-phases=addon
```

If you drive upgrades with an `UpgradeConfiguration` file instead of flags,
the same setting is available as `apply.skipPhases` and `node.skipPhases`.

kubeadm writes new static Pod manifests that use the v1.38 images. Because the
`ClusterConfiguration` now contains the extra argument, every new component starts with
`--emulated-version=1.37`. By default, kubeadm upgrades CoreDNS and kube-proxy once all
control plane instances run the new version; skipping the `addon` phase keeps both add-ons
untouched until step 5.

For clusters with more than one control plane node, this has a nice side effect.
kubeadm upgrades control plane nodes one at a time, so for a while new and old components
run side by side. With the emulated version pinned, the upgraded kube-controller-manager and
kube-scheduler keep acting like v1.37, which matches the API servers that haven't been upgraded yet.

Check the result. The API server reports its binary version, its emulated version,
and its minimum compatibility version:

```shell
kubectl get --raw /version
```

The output is similar to this:

```
{
  "major": "1",
  "minor": "38",
  "emulationMajor": "1",
  "emulationMinor": "37",
  "minCompatibilityMajor": "1",
  "minCompatibilityMinor": "36",
  "gitVersion": "v1.38.x",
  ...
}
```

You can also confirm the argument on every control plane node:

```shell
sudo grep -- '--emulated-version' /etc/kubernetes/manifests/*.yaml
```

## Step 3: Validate the new binaries

You now have a validation window: the control plane runs the v1.38 binaries,
but behaves like v1.37. Use it to watch for the problems that are hard to spot in a
test environment, such as performance regressions, changes in behavior that are not
guarded by feature gates, or issues with webhooks, operators, and other clients that
talk to the new binaries. Run your usual smoke tests and keep an eye on your control plane
metrics and SLOs.

How long you stay in this state is up to you. Treat it as a transition, though,
not as a place to stay: plan to either finalize the upgrade or roll back.

## If something goes wrong: roll back the binaries

As long as the emulated version is still 1.37, you can move the control plane back to the
v1.37 binaries. kubeadm has no dedicated rollback command, but its version checks allow
moving the control plane down by one minor version, so you can use the v1.37 kubeadm binary:

1. On each control plane node, install the kubeadm v1.37 package again.
1. On the first control plane node, run `sudo kubeadm upgrade apply v1.37.x`.
1. On each of the other control plane nodes, one at a time, run `sudo kubeadm upgrade node`.

kubeadm writes static Pod manifests that use the v1.37 images again. The `emulated-version`
argument can stay in the `ClusterConfiguration`: it now matches the binary version,
and it pins the emulated version again on your next upgrade attempt. CoreDNS, kube-proxy,
and the kubelets were never upgraded, so there is nothing else to revert.

Downgrading with kubeadm is not part of the regular upgrade guide,
so rehearse this path on a test cluster before you rely on it.

## Step 4: Finalize the upgrade

When you are happy with the new binaries, raise the emulated version.
First, edit the `kubeadm-config` ConfigMap again, and either remove the three
`emulated-version` entries or set their value to `"1.38"`.
Removing them returns the components to the default, which is the binary version.
Setting them to `"1.38"` has the same effect today, and it means that your next
kubeadm upgrade (to v1.39) starts with the emulated version already pinned.

Then apply the change to the static Pod manifests, as described in
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/).
Save the updated `ClusterConfiguration` to a file and copy it to every control plane node:

```shell
kubectl get configmap kubeadm-config -n kube-system \
  -o jsonpath='{.data.ClusterConfiguration}' > clusterconfig.yaml
```

Update kube-apiserver on every control plane node first, one node at a time.
Wait for the API server to become healthy before you move on to the next node:

```shell
sudo kubeadm init phase control-plane apiserver --config clusterconfig.yaml
```

Then update kube-controller-manager and kube-scheduler on every control plane node:

```shell
sudo kubeadm init phase control-plane controller-manager --config clusterconfig.yaml
sudo kubeadm init phase control-plane scheduler --config clusterconfig.yaml
```

This order keeps kube-controller-manager and kube-scheduler from emulating a newer version
than the API servers they talk to.

The kube-apiserver manifest also contains settings that are specific to each node,
such as the advertise address. If a control plane node does not use the address that
kubeadm detects by default, add an `InitConfiguration` with that node's `localAPIEndpoint`
to the file before you run the command on that node. In any case, back up
`/etc/kubernetes/manifests` first, and compare the new manifests with the old ones.

Afterwards, `kubectl get --raw /version` reports `"emulationMinor": "38"`.

If a problem only shows up after this step, KEP-4330 also describes an emulation version
rollback: you set the emulated version back to 1.37 and keep the v1.38 binaries.

## Step 5: Upgrade the add-ons and the nodes

With the control plane behaving like v1.38, upgrade CoreDNS and kube-proxy
from any control plane node:

```shell
sudo kubeadm upgrade node phase addon all
```

Then upgrade the kubelet on all nodes, exactly as the
[kubeadm upgrade guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) describes:
drain the node, upgrade the kubelet and kubectl packages, restart the kubelet,
and uncordon the node. On worker nodes, run `sudo kubeadm upgrade node` first, as usual.

## Things to keep in mind

- **Alpha features and alpha APIs are outside the scope of emulation.**
  Don't count on alpha functionality to behave like the emulated version.
- **Feature gates follow the emulated version.** Setting a feature gate that does not exist
  yet in the emulated version is rejected, so add feature gates that are new in v1.38
  only after you finalize the upgrade.
- **Beta APIs that are disabled by default need extra care.** If you enable such an API,
  read about the `--emulation-forward-compatible` argument of kube-apiserver in the KEP first.
- **kubeadm still upgrades one minor version at a time.** KEP-4330 also opens the door to
  skip-version upgrades of the binaries, but kubeadm doesn't support that.
- **KEP-4330 is in alpha at the time of writing.** Check the KEP and the `--help` output
  of your binaries before you rely on this workflow in production.

## What's next?

Whether kubeadm should do more, for example an upgrade option that pins the emulated
version for you, depends on your feedback. If you try this workflow, please share your
experience in [kubeadm#3263](https://github.com/kubernetes/kubeadm/issues/3263).

If you run highly available control planes, also have a look at the
[Mixed Version Proxy](/blog/2026/05/15/kubernetes-1-36-feature-mixed-version-proxy-beta/),
which graduated to beta in v1.36 and also makes control plane upgrades safer.

## Acknowledgments

Thanks to the kubeadm maintainers and KEP-4330 contributors:

- Alexander Zielenski ([alexzielenski](https://github.com/alexzielenski))
- Baofa Fan ([carlory](https://github.com/carlory))
- Davanum Srinivas ([dims](https://github.com/dims))
- David Eads ([deads2k](https://github.com/deads2k))
- Han Kang ([logicalhan](https://github.com/logicalhan))
- HirazawaUi ([HirazawaUi](https://github.com/HirazawaUi))
- Joe Betz ([jpbetz](https://github.com/jpbetz))
- John Belamaric ([johnbelamaric](https://github.com/johnbelamaric))
- Jordan Liggitt ([liggitt](https://github.com/liggitt))
- Lubomir I. Ivanov ([neolit123](https://github.com/neolit123))
- Sata Qiu ([SataQiu](https://github.com/SataQiu))
- Siyuan Zhang ([siyuanfoundation](https://github.com/siyuanfoundation))
- Tim Hockin ([thockin](https://github.com/thockin))
- Wojciech Tyczyński ([wojtek-t](https://github.com/wojtek-t))
- Yongrui Lin ([yongruilin](https://github.com/yongruilin))

## How do I get involved?

kubeadm is developed by
[SIG Cluster Lifecycle](https://github.com/kubernetes/community/blob/master/sig-cluster-lifecycle/README.md).
You can join the discussion here:

- [kubeadm#3263](https://github.com/kubernetes/kubeadm/issues/3263): guidance for using compatibility versions with kubeadm
- [KEP-4330 enhancement issue](https://github.com/kubernetes/enhancements/issues/4330)
- Slack: [#kubeadm](https://kubernetes.slack.com/messages/kubeadm) or [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle)
- [Mailing list](https://groups.google.com/g/kubernetes-sig-cluster-lifecycle)
