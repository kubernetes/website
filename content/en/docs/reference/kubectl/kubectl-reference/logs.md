---
title: logs
content_template: templates/tool-reference
---

### Overview
Print the logs for a container in a pod or specified resource. If the pod has only one container, the container name is optional.

### Usage

`logs [-f] [-p] (POD | TYPE/NAME) [-c CONTAINER]`


### Example

 Return snapshot logs from pod nginx with only one container

```shell
kubectl logs nginx
```

 Return snapshot logs from pod nginx with multi containers

```shell
kubectl logs nginx --all-containers=true
```

 Return snapshot logs from all containers in pods defined by label app=nginx

```shell
kubectl logs -lapp=nginx --all-containers=true
```

 Return snapshot of previous terminated ruby container logs from pod web-1

```shell
kubectl logs -p -c ruby web-1
```

 Begin streaming the logs of the ruby container in pod web-1

```shell
kubectl logs -f -c ruby web-1
```

 Begin streaming the logs from all containers in pods defined by label app=nginx

```shell
kubectl logs -f -lapp=nginx --all-containers=true
```

 Display only the most recent 20 lines of output in pod nginx

```shell
kubectl logs --tail=20 nginx
```

 Show all logs from pod nginx written in the last hour

```shell
kubectl logs --since=1h nginx
```

 Return snapshot logs from first container of a job named hello

```shell
kubectl logs job/hello
```

 Return snapshot logs from container nginx-1 of a deployment named nginx

```shell
kubectl logs deployment/nginx -c nginx-1
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
    <td>all-containers</td><td></td><td>false</td><td>Get all containers' logs in the pod(s).</td>
    </tr>
    <tr>
    <td>container</td><td>c</td><td></td><td>Print the logs of this container</td>
    </tr>
    <tr>
    <td>follow</td><td>f</td><td>false</td><td>Specify if the logs should be streamed.</td>
    </tr>
    <tr>
    <td>ignore-errors</td><td></td><td>false</td><td>If watching / following pod logs, allow for any errors that occur to be non-fatal</td>
    </tr>
    <tr>
    <td>limit-bytes</td><td></td><td>0</td><td>Maximum bytes of logs to return. Defaults to no limit.</td>
    </tr>
    <tr>
    <td>max-log-requests</td><td></td><td>5</td><td>Specify maximum number of concurrent logs to follow when using by a selector. Defaults to 5.</td>
    </tr>
    <tr>
    <td>pod-running-timeout</td><td></td><td>20s</td><td>The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running</td>
    </tr>
    <tr>
    <td>previous</td><td>p</td><td>false</td><td>If true, print the logs for the previous instance of the container in a pod if it exists.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on.</td>
    </tr>
    <tr>
    <td>since</td><td></td><td>0s</td><td>Only return logs newer than a relative duration like 5s, 2m, or 3h. Defaults to all logs. Only one of since-time / since may be used.</td>
    </tr>
    <tr>
    <td>since-time</td><td></td><td></td><td>Only return logs after a specific date (RFC3339). Defaults to all logs. Only one of since-time / since may be used.</td>
    </tr>
    <tr>
    <td>tail</td><td></td><td>-1</td><td>Lines of recent log file to display. Defaults to -1 with no selector, showing all log lines otherwise 10, if a selector is provided.</td>
    </tr>
    <tr>
    <td>timestamps</td><td></td><td>false</td><td>Include timestamps on each line in the log output</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version
<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

