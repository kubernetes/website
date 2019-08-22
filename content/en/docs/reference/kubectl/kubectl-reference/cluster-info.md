---
title: cluster-info
content_template: templates/tool-reference
---

### Overview
Display addresses of the master and services with label kubernetes.io/cluster-service=true To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

### Usage

`cluster-info`


### Example

 Print the address of the master and cluster services

```shell
kubectl cluster-info
```






<hr>

## dump


### Overview
Dumps cluster info out suitable for debugging and diagnosing cluster problems.  By default, dumps everything to stdout. You can optionally specify a directory with --output-directory.  If you specify a directory, kubernetes will build a set of files in that directory.  By default only dumps things in the 'kube-system' namespace, but you can switch to a different namespace with the --namespaces flag, or specify --all-namespaces to dump all namespaces.

 The command also dumps the logs of all of the pods in the cluster, these logs are dumped into different directories based on namespace and pod name.

### Usage

`dump`


### Example
 Dump current cluster state to stdout

```shell
kubectl cluster-info dump
```

 Dump current cluster state to /path/to/cluster-state

```shell
kubectl cluster-info dump --output-directory=/path/to/cluster-state
```

 Dump all namespaces to stdout

```shell
kubectl cluster-info dump --all-namespaces
```

 Dump a set of namespaces to /path/to/cluster-state

```shell
kubectl cluster-info dump --namespaces default,kube-system --output-directory=/path/to/cluster-state
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>all-namespaces</td><td>A</td><td>false</td><td>If true, dump all namespaces.  If true, --namespaces is ignored.</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>namespaces</td><td></td><td>[]</td><td>A comma separated list of namespaces to dump.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td>json</td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>output-directory</td><td></td><td></td><td>Where to output the files.  If empty or '-' uses stdout, otherwise creates a directory hierarchy in that directory</td>
    </tr>
    <tr>
    <td>pod-running-timeout</td><td></td><td>20s</td><td>The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version
<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

