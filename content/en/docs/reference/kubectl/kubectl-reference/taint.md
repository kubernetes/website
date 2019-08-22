---
title: taint
content_template: templates/tool-reference
---

### Overview
Update the taints on one or more nodes.

  *  A taint consists of a key, value, and effect. As an argument here, it is expressed as key=value:effect.
  *  The key must begin with a letter or number, and may contain letters, numbers, hyphens, dots, and underscores, up to  253 characters.
  *  Optionally, the key can begin with a DNS subdomain prefix and a single '/', like example.com/my-app
  *  The value is optional. If given, it must begin with a letter or number, and may contain letters, numbers, hyphens, dots, and underscores, up to  63 characters.
  *  The effect must be NoSchedule, PreferNoSchedule or NoExecute.
  *  Currently taint can only apply to node.

### Usage

`taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N`


### Example

 Update node 'foo' with a taint with key 'dedicated' and value 'special-user' and effect 'NoSchedule'. # If a taint with that key and effect already exists, its value is replaced as specified.

```shell
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

 Remove from node 'foo' the taint with key 'dedicated' and effect 'NoSchedule' if one exists.

```shell
kubectl taint nodes foo dedicated:NoSchedule-
```

 Remove from node 'foo' all the taints with key 'dedicated'

```shell
kubectl taint nodes foo dedicated-
```

 Add a taint with key 'dedicated' on nodes having label mylabel=X

```shell
kubectl taint node -l myLabel=X  dedicated=foo:PreferNoSchedule
```

 Add to node 'foo' a taint with key 'bar' and no value

```shell
kubectl taint nodes foo bar:NoSchedule
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
    <td>all</td><td></td><td>false</td><td>Select all nodes in the cluster</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>overwrite</td><td></td><td>false</td><td>If true, allow taints to be overwritten, otherwise reject taint updates that overwrite existing taints.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version
<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

