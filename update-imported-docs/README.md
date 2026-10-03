> **Deprecated:** The `update-imported-docs` workflow is deprecated. Use the
> [generator-specific reference documentation guides](https://kubernetes.io/docs/contribute/generate-ref-docs/)
> instead. This file is retained temporarily for discoverability and is planned
> for removal in a follow-up change.

### Update Kubernetes reference docs

The `update-imported-docs` script generates the Kubernetes reference docs (component and tool pages, kubectl-command
reference, and Kubernetes API reference).

For the supported generation workflows, view the
[reference documentation contributor guides](https://kubernetes.io/docs/contribute/generate-ref-docs/).

### General Usage

```shell
./update-imported-docs <configuration-file.yml> <k8s_release>
```

For example:

```shell
./update-imported-docs reference.yml 1.17
```
