---
layout: blog
title: "How to Pretty-Print Your Kubernetes YAML as KYAML and Why You'd Want To"
draft: true
slug: how-to-pretty-print-kubernetes-yaml-as-kyaml
author: >
  [Kashish Verma](https://github.com/KashishV999)
---

YAML has been the standard way to write Kubernetes manifests for years. Every example, tutorial, and configuration file you come across is written in it. The problem isn't that YAML is a bad format. It's that YAML gives you a lot of choices, and not all of them are equally good for writing Kubernetes manifests. Some features make files harder to read, some are easy to misuse and others can lead to surprising behavior.

The interesting part is that Kubernetes doesn't actually need most of those features. It only relies on a small subset of YAML. This led to a simple question: if Kubernetes only needs a small part of YAML, why not *standardize*  on that part and avoid the rest? Instead of introducing a new configuration language, [SIG CLI](https://github.com/kubernetes/community/tree/main/sig-cli) introduced **KYAML**, a stricter, more consistent way to write YAML. 


## What is KYAML? 

***KYAML is a strict subset (or "dialect") of standard YAML, designed to be parseable by the existing ecosystem without any changes, as proposed in [KEP 5295](https://www.kubernetes.dev/resources/keps/5295/).*** It does not introduce a new format or a new parser. It just narrows the scope of choices you make when writing YAML, so everyone ends up making the same ones.

Think of it less like a new language and more like an agreed-upon style. ***Everything valid in KYAML is valid YAML.*** 


## How KYAML solves it

Standard YAML has a few well-known traps and JSON is not without its own.

**Whitespace sensitivity.** Indentation defines structure in YAML, which means a wrongly indented file can remain syntactically valid while representing a different object than intended. This gets especially painful with templating tools like Helm, where you are manipulating indentation from outside the YAML context.

**Silent type coercion.** String quoting is optional in YAML, which sounds convenient until it is not. Some values that look like strings get coerced into other types without warning. The classic example is the ["Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/).

```yaml
country: NO
```

In standard YAML, `NO` is parsed as a boolean `false`, not the string `"NO"` and it has caught more than a few people off guard.

**JSON is not the answer either.** It lacks comment support, is strict about trailing commas, and requires every key to be quoted, none of which makes for a good config writing experience.

***KYAML addresses all of these by making structure and types explicit:***

- Does not depend on whitespace for structure
- Always quotes value strings so no silent type coercion
- Always uses `{}` for maps and structs
- Always uses `[]` for lists
- Allows comments and trailing commas, unlike JSON
- Includes a `---` header to distinguish it from JSON at a glance, since both start with `{`

YAML calls this **flow style**, as opposed to the conventional **block style** most people use. KYAML sits halfway between JSON and YAML, more explicit than default YAML, friendlier than JSON.

Here is the same Pod manifest written in both formats for comparison.

### Standard YAML
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: demo
spec:
  containers:
    - name: nginx
      image: nginx:1.20
```

### KYAML
```yaml
---
{
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "my-pod",
    labels: {
      app: "demo",
    },
  },
  spec: {
    containers: [{
      name: "nginx",
      image: "nginx:1.20",
    }],
  },
}
```

Notice the double-quoted string values, the braces around every mapping, the brackets around the list and the trailing commas. The additional syntax makes the document structure explicit instead of relying on indentation.

## How to pretty print YAML as KYAML

There are different ways to get KYAML output.

### Option 1: kubectl -o kyaml

Since Kubernetes 1.34, `kubectl` supports KYAML as a native output format. 
```bash
# Kubernetes 1.35+ (beta; feature enabled by default, still requires -o kyaml CLI param)
kubectl get deployment my-app -o kyaml

# Kubernetes 1.34 (alpha, opt-in)
export KUBECTL_KYAML=true
kubectl get deployment my-app -o kyaml
```

To save the output to a file:

```bash
kubectl get deployment my-app -o kyaml > my-app.yaml
```

There are currently no plans to make KYAML the default output format. If you prefer using KYAML by default, you can configure your preferred default with `kuberc`. For more details, see the [kuberc documentation](https://kubernetes.io/docs/reference/kubectl/kuberc/).

```bash
# Kubernetes 1.36+
kubectl kuberc set --section defaults --command get --option output=kyaml

# Kubernetes 1.33–1.35 (alpha prefix still required)
kubectl alpha kuberc set --section defaults --command get --option output=kyaml
```

### Option 2: yamlfmt

For converting existing files, Google's `yamlfmt` added a dedicated [`kyaml` formatter](https://github.com/google/yamlfmt/blob/main/docs/config-file.md#kyaml-formatter) in v0.21.0.

Install via Go, or grab a binary from the [releases page](https://github.com/google/yamlfmt/releases):

```bash
go install github.com/google/yamlfmt/cmd/yamlfmt@latest
```

It is also available as a [pre-commit hook](https://github.com/google/yamlfmt/blob/main/docs/pre-commit.md) and as a [Docker image](https://github.com/google/yamlfmt) for CI pipelines.

Add a `.yamlfmt` config to your project root:

```yaml
formatter:
  type: kyaml
```

Preview the output without modifying your file:

```bash
yamlfmt -dry my-deployment.yaml
```

then apply:

```bash
yamlfmt my-deployment.yaml
```

To convert an entire directory:

```bash
yamlfmt ./k8s/
```

The `kyaml` formatter takes no additional configuration and does not share options with the default formatter so mixing them will cause an error.


## Is KYAML worth adopting?

Every valid KYAML file is a valid YAML file. So whatever you write in KYAML, your existing tools, your `kubectl`, your CI pipelines, none of them need to change. You can even pass KYAML as input to any version of `kubectl`, not just 1.34+, because at the end of the day it is just YAML.

KYAML is not strictly necessary. You can keep writing block-style YAML and things will work. But it is a *deliberate choice* to make your configs less error-prone and more consistent especially across a team or a larger repo. 

*It is less of a migration and more of a better habit.*