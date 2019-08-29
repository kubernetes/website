---
title: exec
content_template: templates/tool-reference
---

### Overview
Execute a command in a container.

### Usage

`exec (POD | TYPE/NAME) [-c CONTAINER] [flags] -- COMMAND [args...]`


### Example

 Get output from running 'date' command from pod mypod, using the first container by default

```shell
kubectl exec mypod date
```

 Get output from running 'date' command in ruby-container from pod mypod

```shell
kubectl exec mypod -c ruby-container date
```

 Switch to raw terminal mode, sends stdin to 'bash' in ruby-container from pod mypod # and sends stdout/stderr from 'bash' back to the client

```shell
kubectl exec mypod -c ruby-container -i -t -- bash -il
```

 List contents of /usr from the first container of pod mypod and sort by modification time. # If the command you want to execute in the pod has any flags in common (e.g. -i), # you must use two dashes (--) to separate your command's flags/arguments. # Also note, do not surround your command and its flags/arguments with quotes # unless that is how you would execute it normally (i.e., do ls -t /usr, not "ls -t /usr").

```shell
kubectl exec mypod -i -t -- ls -t /usr
```

 Get output from running 'date' command from the first pod of the deployment mydeployment, using the first container by default

```shell
kubectl exec deploy/mydeployment date
```

 Get output from running 'date' command from the first pod of the service myservice, using the first container by default

```shell
kubectl exec svc/myservice date
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
    <td>container</td><td>c</td><td></td><td>Container name. If omitted, the first container in the pod will be chosen</td>
    </tr>
    <tr>
    <td>pod-running-timeout</td><td></td><td>1m0s</td><td>The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running</td>
    </tr>
    <tr>
    <td>stdin</td><td>i</td><td>false</td><td>Pass stdin to the container</td>
    </tr>
    <tr>
    <td>tty</td><td>t</td><td>false</td><td>Stdin is a TTY</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

