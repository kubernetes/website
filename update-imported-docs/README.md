### Update Kubernetes reference docs

This `update-imported-docs.py` script generates the Kubernetes reference docs (component/tool pages, kubectl-command, Kubernetes API reference).

<!-- TODO: Update this information -->
[Generating Reference Pages for Kubernetes Components and Tools](https://kubernetes.io/docs/contribute/generate-ref-docs/kubernetes-components/) contains detailed instructions for using this tool.

### General Usage

```shell
python3 update-imported-docs.py <config_file> <k8s_release>
```