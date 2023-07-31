---
layout: blog
title: Introducing kustomize; Template-free Configuration Customization for Kubernetes
date: 2018-05-29
---

**Authors:** Jeff Regan (Google), Phil Wittrock (Google)

[**kustomize**]: https://github.com/kubernetes-sigs/kustomize
[hello world]: https://github.com/kubernetes-sigs/kustomize/blob/master/examples/helloWorld
[kustomization]: https://github.com/kubernetes-sigs/kustomize/blob/master/docs/glossary.md#kustomization
[mailing list]: https://groups.google.com/forum/#!forum/kustomize
[open an issue]: https://github.com/kubernetes-sigs/kustomize/issues/new
[subproject]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/0008-kustomize.md
[SIG-CLI]: https://github.com/kubernetes/community/tree/master/sig-cli
[workflow]: https://github.com/kubernetes-sigs/kustomize/blob/master/docs/workflows.md

If you run a Kubernetes environment, chances are you’ve
customized a Kubernetes configuration — you've copied
some API object YAML files and edited them to suit
your needs.

But there are drawbacks to this approach — it can be
hard to go back to the source material and incorporate
any improvements that were made to it. Today Google is
announcing [**kustomize**], a command-line tool
contributed as a [subproject] of [SIG-CLI].  The tool
provides a new, purely *declarative* approach to
configuration customization that adheres to and
leverages the familiar and carefully designed
Kubernetes API.

Here’s a common scenario. Somewhere on the internet you
find someone’s Kubernetes configuration for a content
management system.  It's a set of files containing YAML
specifications of Kubernetes API objects. Then, in some
corner of your own company you find a configuration for
a database to back that CMS — a database you prefer
because you know it well.

You want to use these together, somehow. Further, you
want to customize the files so that your resource
instances appear in the cluster with a label that
distinguishes them from a colleague’s resources who’s
doing the same thing in the same cluster.
You also want to set appropriate values for CPU, memory
and replica count.

Additionally, you’ll want *multiple variants* of the
entire configuration: a small variant (in terms of
computing resources used) devoted to testing and
experimentation, and a much larger variant devoted to
serving outside users in production. Likewise, other
teams will want their own variants.

This raises all sorts of questions.  Do you copy your
configuration to multiple locations and edit them
independently? What if you have dozens of development
teams who need slightly different variations of the
stack? How do you maintain and upgrade the aspects of
configuration that they share in common?  Workflows
using **kustomize** provide answers to these questions.

## Customization is reuse

Kubernetes configurations aren't code (being YAML
specifications of API objects, they are more strictly
viewed as data), but configuration lifecycle has many
similarities to code lifecycle.

You should keep configurations in version
control. Configuration owners aren’t necessarily the
same set of people as configuration
users. Configurations may be used as parts of a larger
whole. Users will want to *reuse* configurations for
different purposes.

One approach to configuration reuse, as with code
reuse, is to simply copy it all and customize the
copy. As with code, severing the connection to the
source material makes it difficult to benefit from
ongoing improvements to the source material. Taking
this approach with many teams or environments, each
with their own variants of a configuration, makes a
simple upgrade intractable.

Another approach to reuse is to express the source
material as a parameterized template.  A tool processes
the template—executing any embedded scripting and
replacing parameters with desired values—to generate
the configuration. Reuse comes from using different
sets of values with the same template. The challenge
here is that the templates and value files are not
specifications of Kubernetes API resources. They are,
necessarily, a new thing, a new language, that wraps
the Kubernetes API. And yes, they can be powerful, but
bring with them learning and tooling costs. Different
teams want different changes—so almost every
specification that you can include in a YAML file
becomes a parameter that needs a value. As a result,
the value sets get large, since all parameters (that
don't have trusted defaults) must be specified for
replacement. This defeats one of the goals of
reuse—keeping the differences between the variants
small in size and easy to understand in the absence of
a full resource declaration.

## A new option for configuration customization

Compare that to **kustomize**, where the tool’s
behavior is determined by declarative specifications
expressed in a file called `kustomization.yaml`.

The **kustomize** program reads the file and the
Kubernetes API resource files it references, then emits
complete resources to standard output. This text output
can be further processed by other tools, or streamed
directly to **kubectl** for application to a cluster.

For example, if a file called `kustomization.yaml`
containing

```
   commonLabels:
     app: hello
   resources:
   - deployment.yaml
   - configMap.yaml
   - service.yaml
```

is in the current working directory, along with
the three resource files it mentions, then running

```
kustomize build
```

emits a YAML stream that includes the three given
resources, and adds a common label `app: hello` to
each resource.

Similarly, you can use a *commonAnnotations* field to
add an annotation to all resources, and a *namePrefix*
field to add a common prefix to all resource
names. This trivial yet common customization is just
the beginning.

A more common use case is that you’ll need multiple
variants of a common set of resources, e.g., a
*development*, *staging* and *production* variant.

For this purpose, **kustomize** supports the idea of an
*overlay* and a *base*. Both are represented by a
kustomization file. The base declares things that the
variants share in common (both resources and a common
customization of those resources), and the overlays
declare the differences.

Here’s a file system layout to manage a *staging* and
*production* variant of a given cluster app:

```
   someapp/
   ├── base/
   │   ├── kustomization.yaml
   │   ├── deployment.yaml
   │   ├── configMap.yaml
   │   └── service.yaml
   └── overlays/
      ├── production/
      │   └── kustomization.yaml
      │   ├── replica_count.yaml
      └── staging/
          ├── kustomization.yaml
          └── cpu_count.yaml
```

The file `someapp/base/kustomization.yaml` specifies the
common resources and common customizations to those
resources (e.g., they all get some label, name prefix
and annotation).

The contents of
`someapp/overlays/production/kustomization.yaml` could
be

```
   commonLabels:
    env: production
   bases:
   - ../../base
   patches:
   - replica_count.yaml
```

This kustomization specifies a *patch* file
`replica_count.yaml`, which could be:

```
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: the-deployment
   spec:
     replicas: 100
```

A patch is a partial resource declaration, in this case
a patch of the deployment in
`someapp/base/deployment.yaml`, modifying only the
*replicas* count to handle production traffic.

The patch, being a partial deployment spec, has a clear
context and purpose and can be validated even if it’s
read in isolation from the remaining
configuration. It’s not just a context free *{parameter
name, value}* tuple.

To create the resources for the production variant, run

```
kustomize build someapp/overlays/production
```

The result is printed to stdout as a set of complete
resources, ready to be applied to a cluster.  A
similar command defines the staging environment.

## In summary

With **kustomize**, you can manage an arbitrary number
of distinctly customized Kubernetes configurations
using only Kubernetes API resource files. Every
artifact that **kustomize** uses is plain YAML and can
be validated and processed as such.  kustomize encourages
a fork/modify/rebase [workflow].

To get started, try the [hello world] example.
For discussion and feedback, join the [mailing list] or
[open an issue].  Pull requests are welcome.
