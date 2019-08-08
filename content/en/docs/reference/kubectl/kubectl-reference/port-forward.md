---
title: port-forward
content_template: templates/tool-reference
---

### Overview
Forward one or more local ports to a pod. This command requires the node to have 'socat' installed.

 Use resource type/name such as deployment/mydeployment to select a pod. Resource type defaults to 'pod' if omitted.

 If there are multiple pods matching the criteria, a pod will be selected automatically. The forwarding session ends when the selected pod terminates, and rerun of the command is needed to resume forwarding.

### Usage

`$ port-forward TYPE/NAME [options] [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N]`


### Example

 Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in the pod

```shell
kubectl port-forward pod/mypod 5000 6000
```

 Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in a pod selected by the deployment

```shell
kubectl port-forward deployment/mydeployment 5000 6000
```

 Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in a pod selected by the service

```shell
kubectl port-forward service/myservice 5000 6000
```

 Listen on port 8888 locally, forwarding to 5000 in the pod

```shell
kubectl port-forward pod/mypod 8888:5000
```

 Listen on port 8888 on all addresses, forwarding to 5000 in the pod

```shell
kubectl port-forward --address 0.0.0.0 pod/mypod 8888:5000
```

 Listen on port 8888 on localhost and selected IP, forwarding to 5000 in the pod

```shell
kubectl port-forward --address localhost,10.19.21.23 pod/mypod 8888:5000
```

 Listen on a random port locally, forwarding to 5000 in the pod

```shell
kubectl port-forward pod/mypod :5000
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
    <td>address</td><td></td><td>[localhost]</td><td>Addresses to listen on (comma separated). Only accepts IP addresses or localhost as a value. When localhost is supplied, kubectl will try to bind on both 127.0.0.1 and ::1 and will fail if neither of these addresses are available to bind.</td>
    </tr>
    <tr>
    <td>pod-running-timeout</td><td></td><td>1m0s</td><td>The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running</td>
    </tr>
</tbody>
</table></div>



