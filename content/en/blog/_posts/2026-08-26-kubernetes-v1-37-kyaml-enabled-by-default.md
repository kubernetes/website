---
layout: blog
title: "Kubernetes v1.37: KYAML is enabled by default"
date: 2026-08-26T10:30:00-08:00
slug: kubernetes-v1-37-kyaml-enabled-by-default
author: Tim Hockin (Google)
---

Kubernetes manifests are most commonly authored in YAML, a format whose
flexibility can introduce ambiguity and subtle errors. To address this, SIG CLI
introduced KYAML, a Kubernetes-specific output format for `kubectl`, as an alpha
feature in Kubernetes v1.34, gated behind the `KUBECTL_KYAML` environment
variable. KYAML graduated to beta in v1.35.

With the release of Kubernetes v1.37, KYAML output is now stable and **enabled
by default**. Setting the `KUBECTL_KYAML` environment variable is no longer
required to request KYAML output from `kubectl`.

## What is KYAML?

KYAML is a Kubernetes-specific dialect of YAML, designed to be safer and less
ambiguous than hand-authored YAML. Its defining property is that KYAML is a
**strict subset of YAML**. Every KYAML document is also a valid YAML document,
which means KYAML can be passed to any version of `kubectl`, and any compliant
YAML parser can read it.

KYAML follows a small set of rules, defined by [KEP-5295](https://kep.k8s.io/5295):

* Value strings are always double-quoted.
* Keys are left unquoted unless they would otherwise be ambiguous.
* Mappings (associative arrays) always use `{}`.
* Lists always use `[]`.

This explicit structure resembles JSON. Unlike JSON, however, KYAML supports
comments, permits trailing commas, and does not require keys to be quoted.

## Why KYAML?

KYAML addresses specific shortcomings in both YAML and JSON as formats for
describing Kubernetes objects.

YAML relies on significant whitespace, so an incorrect indentation can change
the meaning of a document or render it invalid. In addition, YAML's optional
string-quoting can lead to unintended type coercion. A well-known example is
["The Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/),
in which the country code `NO` is interpreted as the boolean `false`.

JSON is not whitespace-sensitive, but it has its own limitations: it does not
support comments, does not tolerate trailing commas, and requires every key to
be quoted.

KYAML combines JSON's explicit, unambiguous structure with the conveniences of
YAML. The result is output that is unambiguous and, because it is not
whitespace-sensitive, straightforward to edit and patch in tools such as Helm.

## How it works

KYAML is a `kubectl` output format, requested with the `-o` (or `--output`)
flag, in the same way as YAML or JSON:

```shell
kubectl get service hostnames -o kyaml
```

The output looks like this:

```yaml
---
{
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "hostnames",
    },
    name: "hostnames",
    namespace: "default",
  },
  spec: {
    clusterIP: "10.0.162.160",
    ports: [{
      port: 80,
      protocol: "TCP",
      targetPort: 9376,
    }],
    selector: {
      app: "hostnames",
    },
    type: "ClusterIP",
  },
}
```

Note the braces around every mapping, the brackets around the list, the
double-quoted string values, and the trailing commas. Because the structure is
explicit, the document can be reindented without changing its meaning.

### Requesting KYAML output

KYAML is available wherever `-o yaml` or `-o json` can be used, for example:

```shell
kubectl get pods -o kyaml
kubectl get deployment nginx -o kyaml
kubectl get configmap my-config -o kyaml
```

YAML and JSON output remain available. KYAML is an additional format, not a
replacement.

### Migrating from the environment variable

During the alpha and beta stages, requesting KYAML required setting
`KUBECTL_KYAML="true"` before `kubectl` would accept `-o kyaml`. As of v1.37
this is no longer necessary: the format is enabled by default and the
environment variable is no longer required.

Any existing `KUBECTL_KYAML` setting in a shell profile or CI configuration can
be removed. Leaving it in place has no effect.

## What changed in v1.37

The primary change is that **KYAML output is enabled by default**. There is no
feature gate to enable and no environment variable to set. All other behavior is
unchanged from the alpha and beta stages: KYAML remains a strict subset of YAML,
and Kubernetes continues to accept ordinary YAML and JSON as input. The way
manifests are written is unaffected, and there are no plans to change it.

## Examples

The following shows the same Kubernetes object rendered in three formats.

YAML (`-o yaml`):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
  namespace: default
data:
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"
```

JSON (`-o json`):

```json
{
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": {
    "name": "game-config",
    "namespace": "default"
  },
  "data": {
    "player_initial_lives": "3",
    "ui_properties_file_name": "user-interface.properties"
  }
}
```

KYAML (`-o kyaml`):

```yaml
---
{
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: "game-config",
    namespace: "default",
  },
  data: {
    player_initial_lives: "3",
    ui_properties_file_name: "user-interface.properties",
  },
}
```

In the KYAML output, `player_initial_lives` is unambiguously the string `"3"`
rather than an integer, which is precisely the kind of ambiguity KYAML is
designed to eliminate.

## How do I get involved?

KYAML was developed by [SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli).
For further detail, see [KEP-5295](https://kep.k8s.io/5295) and the
[`kubectl` reference documentation](/docs/reference/kubectl/).

Feedback from users is welcome. SIG CLI can be reached on the
[#sig-cli](https://kubernetes.slack.com/messages/sig-cli) channel on Kubernetes
Slack, on the [SIG CLI mailing list](https://groups.google.com/g/kubernetes-sig-cli),
and at the regular [community meetings](https://github.com/kubernetes/community/tree/master/sig-cli#meetings).

