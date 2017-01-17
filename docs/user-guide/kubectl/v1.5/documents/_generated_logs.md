------------

# logs

>bdocs-tab:example Return snapshot logs from pod nginx with only one container

```bdocs-tab:example_shell
kubectl logs nginx
```

>bdocs-tab:example Return snapshot of previous terminated ruby container logs from pod web-1

```bdocs-tab:example_shell
kubectl logs -p -c ruby web-1
```

>bdocs-tab:example Begin streaming the logs of the ruby container in pod web-1

```bdocs-tab:example_shell
kubectl logs -f -c ruby web-1
```

>bdocs-tab:example Display only the most recent 20 lines of output in pod nginx

```bdocs-tab:example_shell
kubectl logs --tail=20 nginx
```

>bdocs-tab:example Show all logs from pod nginx written in the last hour

```bdocs-tab:example_shell
kubectl logs --since=1h nginx
```


Print the logs for a container in a pod. If the pod has only one container, the container name is optional.

### Usage

`$ logs [-f] [-p] POD [-c CONTAINER]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
container | c |  | Print the logs of this container 
follow | f | false | Specify if the logs should be streamed. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
interactive |  | false | If true, prompt the user for input when required. 
limit-bytes |  | 0 | Maximum bytes of logs to return. Defaults to no limit. 
previous | p | false | If true, print the logs for the previous instance of the container in a pod if it exists. 
since |  | 0s | Only return logs newer than a relative duration like 5s, 2m, or 3h. Defaults to all logs. Only one of since-time / since may be used. 
since-time |  |  | Only return logs after a specific date (RFC3339). Defaults to all logs. Only one of since-time / since may be used. 
tail |  | -1 | Lines of recent log file to display. Defaults to -1, showing all log lines. 
timestamps |  | false | Include timestamps on each line in the log output 


