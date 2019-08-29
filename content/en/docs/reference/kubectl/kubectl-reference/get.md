---
title: get
content_template: templates/tool-reference
---

### Overview
Display one or many resources

 Prints a table of the most important information about the specified resources. You can filter the list using a label selector and the --selector flag. If the desired resource type is namespaced you will only see results in your current namespace unless you pass --all-namespaces.

 Uninitialized objects are not shown unless --include-uninitialized is passed.

 By specifying the output as 'template' and providing a Go template as the value of the --template flag, you can filter the attributes of the fetched resources.

Use "kubectl api-resources" for a complete list of supported resources.

### Usage

`get [(-o|--output=)json|yaml|wide|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=...] (TYPE[.VERSION][.GROUP] [NAME | -l label] | TYPE[.VERSION][.GROUP]/NAME ...) [flags]`


### Example

 List all pods in ps output format.

```shell
kubectl get pods
```

 List all pods in ps output format with more information (such as node name).

```shell
kubectl get pods -o wide
```

 List a single replication controller with specified NAME in ps output format.

```shell
kubectl get replicationcontroller web
```

 List deployments in JSON output format, in the "v1" version of the "apps" API group:

```shell
kubectl get deployments.v1.apps -o json
```

 List a single pod in JSON output format.

```shell
kubectl get -o json pod web-pod-13je7
```

 List a pod identified by type and name specified in "pod.yaml" in JSON output format.

```shell
kubectl get -f pod.yaml -o json
```

 List resources from a directory with kustomization.yaml - e.g. dir/kustomization.yaml.

```shell
kubectl get -k dir/
```

 Return only the phase value of the specified pod.

```shell
kubectl get -o template pod/web-pod-13je7 --template={{.status.phase}}
```

 List resource information in custom columns.

```shell
kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[0].name,IMAGE:.spec.containers[0].image
```

 List all replication controllers and services together in ps output format.

```shell
kubectl get rc,services
```

 List one or more resources by their type and names.

```shell
kubectl get rc/web service/frontend pods/web-pod-13je7
```




### Flags

<div class="table-responsive"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>all-namespaces</td><td>A</td><td>false</td><td>If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>chunk-size</td><td></td><td>500</td><td>Return large lists in chunks rather than all at once. Pass 0 to disable. This flag is beta and may change in the future.</td>
    </tr>
    <tr>
    <td>export</td><td></td><td>false</td><td>If true, use 'export' for the resources.  Exported resources are stripped of cluster-specific information.</td>
    </tr>
    <tr>
    <td>field-selector</td><td></td><td></td><td>Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector key1=value1,key2=value2). The server only supports a limited number of field queries per type.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to get from a server.</td>
    </tr>
    <tr>
    <td>ignore-not-found</td><td></td><td>false</td><td>If the requested object does not exist the command will return exit code 0.</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>label-columns</td><td>L</td><td>[]</td><td>Accepts a comma separated list of labels that are going to be presented as columns. Names are case-sensitive. You can also use multiple flag options like -L label1 -L label2...</td>
    </tr>
    <tr>
    <td>no-headers</td><td></td><td>false</td><td>When using the default or custom-column output format, don't print headers (default print headers).</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath].</td>
    </tr>
    <tr>
    <td>raw</td><td></td><td></td><td>Raw URI to request from the server.  Uses the transport specified by the kubeconfig file.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>server-print</td><td></td><td>true</td><td>If true, have the server return the appropriate table output. Supports extension APIs and CRDs.</td>
    </tr>
    <tr>
    <td>show-kind</td><td></td><td>false</td><td>If present, list the resource type for the requested object(s).</td>
    </tr>
    <tr>
    <td>show-labels</td><td></td><td>false</td><td>When printing, show all labels as the last column (default hide labels column)</td>
    </tr>
    <tr>
    <td>sort-by</td><td></td><td></td><td>If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>use-openapi-print-columns</td><td></td><td>false</td><td>If true, use x-kubernetes-print-column metadata (if present) from the OpenAPI schema for displaying a resource.</td>
    </tr>
    <tr>
    <td>watch</td><td>w</td><td>false</td><td>After listing/getting the requested object, watch for changes. Uninitialized objects are excluded if no object name is provided.</td>
    </tr>
    <tr>
    <td>watch-only</td><td></td><td>false</td><td>Watch for changes to the requested object(s), without listing/getting first.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

