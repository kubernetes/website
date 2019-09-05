---
title: plugin
noedit: true
layout: kuberef
---

### Overview
Provides utilities for interacting with plugins.

 Plugins provide extended functionality that is not part of the major command-line distribution. Please refer to the documentation and examples for more information about how write your own plugins.

### Usage

`plugin [flags]`






<hr>

## list


### Overview
List all available plugin files on a user's PATH.

 Available plugin files are those that are: - executable - anywhere on the user's PATH - begin with "kubectl-"

### Usage

`list`




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
    <td>name-only</td><td></td><td>false</td><td>If true, display only the binary name of each plugin, rather than its full path</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

