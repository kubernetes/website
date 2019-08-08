---
title: attach
content_template: templates/tool-reference
---

### Overview
Attach to a process that is already running inside an existing container.

### Usage

`$ attach (POD | TYPE/NAME) -c CONTAINER`


### Example

 Get output from running pod 123456-7890, using the first container by default

```shell
kubectl attach 123456-7890
```

 Get output from ruby-container from pod 123456-7890

```shell
kubectl attach 123456-7890 -c ruby-container
```

 Switch to raw terminal mode, sends stdin to 'bash' in ruby-container from pod 123456-7890 # and sends stdout/stderr from 'bash' back to the client

```shell
kubectl attach 123456-7890 -c ruby-container -i -t
```

 Get output from the first pod of a ReplicaSet named nginx

```shell
kubectl attach rs/nginx
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



