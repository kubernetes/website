### Update Kubernetes reference docs

The `update-imported-docs` script generates the Kubernetes reference docs (component and tool pages, kubectl-command
reference, and Kubernetes API reference).

For detailed information about the generation process, view the
[Generating Reference Documentation Quickstart Guide](https://kubernetes.io/docs/contribute/generate-ref-docs/quickstart/).

### General Usage

```shell
./update-imported-docs <configuration-file.yml> <k8s_release>
```

For example:

```shell
./update-imported-docs reference.yml 1.17
```
