# Custom cluster NAT (masquerade)

# ip-masq-agent

The ip-masq-agent configures `iptables` rules to `MASQUERADE` traffic outside link-local (optional, enabled by default) and additional arbitrary IP ranges.

It creates an `iptables` chain called `IP-MASQ-AGENT`, which contains match rules for link local (`169.254.0.0/16`) and each of the user-specified IP ranges. It also creates a rule in `POSTROUTING` that jumps to this chain for any traffic not bound for a `LOCAL` destination.

IPs that match the rules (except for the final rule) in `IP-MASQ-AGENT` are *not* subject to `MASQUERADE` via the `IP-MASQ-AGENT` chain (they `RETURN` early from the chain). The final rule in the `IP-MASQ-AGENT` chain will `MASQUERADE` any non-`LOCAL` traffic.

`RETURN` in `IP-MASQ-AGENT` resumes rule processing at the next rule the calling chain, `POSTROUTING`. Take care to avoid creating additional rules in `POSTROUTING` that cause packets bound for your configured ranges to undergo `MASQUERADE`.

## Launching the agent as a DaemonSet
This repo includes an example yaml file that can be used to launch the ip-masq-agent as a DaemonSet in a Kubernetes cluster.

```
kubectl create -f ip-masq-agent.yaml
```

The spec in `ip-masq-agent.yaml` specifies the `kube-system` namespace for the DaemonSet Pods.

## Configuring the agent

Important: You should not attempt to run this agent in a cluster where the Kubelet is also configuring a non-masquerade CIDR. You can pass `--non-masquerade-cidr=0.0.0.0/0` to the Kubelet to nullify its rule, which will prevent the Kubelet from interfering with this agent.

By default, the agent is configured to treat the three private IP ranges specified by [RFC 1918](https://tools.ietf.org/html/rfc1918) as non-masquerade CIDRs. These ranges are `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. The agent will also treat link-local (`169.254.0.0/16`) as a non-masquerade CIDR by default.

By default, the agent is configured to reload its configuration from the `/etc/config/ip-masq-agent` file in its container every 60 seconds.

The agent configuration file should be written in yaml or json syntax, and may contain three optional keys:
- `nonMasqueradeCIDRs []string`: A list strings in CIDR notation that specify the non-masquerade ranges.
- `masqLinkLocal bool`: Whether to masquerade traffic to `169.254.0.0/16`. False by default.
- `resyncInterval string`: The interval at which the agent attempts to reload config from disk. The syntax is any format accepted by Go's [time.ParseDuration](https://golang.org/pkg/time/#ParseDuration) function.

The agent will look for a config file in its container at `/etc/config/ip-masq-agent`. This file can be provided via a `ConfigMap`, plumbed into the container via a `ConfigMapVolumeSource`. As a result, the agent can be reconfigured in a live cluster by creating or editing this `ConfigMap`.

This repo includes a directory-representation of a `ConfigMap` that can configure the agent (the `agent-config` directory). To use this directory to create the `ConfigMap` in your cluster:

```
kubectl create configmap ip-masq-agent --from-file=agent-config --namespace=kube-system
```

Note that we created the `ConfigMap` in the same namespace as the DaemonSet Pods, and named the `ConfigMap` to match the spec in `ip-masq-agent.yaml`. This is necessary for the `ConfigMap` to appear in the Pods' filesystems.

## Rationale
(from the [incubator proposal](https://gist.github.com/mtaufen/253309166e7d5aa9e9b560600a438447))

This agent solves the problem of configuring the CIDR ranges for non-masquerade in a cluster (via iptables rules). Today, this is accomplished by passing a `--non-masquerade-cidr` flag to the Kubelet, which only allows one CIDR to be configured as non-masquerade. [RFC 1918](https://tools.ietf.org/html/rfc1918), however, defines three ranges (`10/8`, `172.16/12`, `192.168/16`) for the private IP address space.

Some users will want to communicate between these ranges without masquerade - for instance, if an organization's existing network uses the `10/8` range, they may wish to run their cluster and `Pod`s in `192.168/16` to avoid IP conflicts. They will also want these `Pod`s to be able to communicate efficiently (no masquerade) with each-other *and* with their existing network resources in `10/8`. This requires that every node in their cluster skips masquerade for both ranges.

We are trying to eliminate networking code from the Kubelet, so rather than extend the Kubelet to accept multiple CIDRs, ip-masq-agent allows you to run a DaemonSet that configures a list of CIDRs as non-masquerade.

## Incubator

This is a [Kubernetes Incubator project](https://github.com/kubernetes/community/blob/master/incubator.md). The incubator team for the project is:

- Author: Mike Taufen (@mtaufen)
- Sponsor: Tim Hockin (@thockin)
- Champion: Bowei Du (@bowei)
- SIG: sig-awesome

## Releasing

See [RELEASE](RELEASE.md).

## Developing

Clone the repo to `$GOPATH/src/k8s.io/ip-masq-agent`.

The build tooling is based on [thockin/go-build-template](https://github.com/thockin/go-build-template).

Run `make` or `make build` to compile the ip-masq-agent.  This will use a Docker image
to build the agent, with the current directory volume-mounted into place.  This
will store incremental state for the fastest possible build.  Run `make
all-build` to build for all architectures.

Run `make test` to run the unit tests.

Run `make container` to build the container image.  It will calculate the image
tag based on the most recent git tag, and whether the repo is "dirty" since
that tag (see `make version`).  Run `make all-container` to build containers
for all architectures.

Run `make push` to push the container image to `REGISTRY`.  Run `make all-push`
to push the container images for all architectures.

Run `make clean` to clean up.
