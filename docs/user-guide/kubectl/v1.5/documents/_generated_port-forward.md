------------

# port-forward

>bdocs-tab:example Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in the pod

```bdocs-tab:example_shell
kubectl port-forward mypod 5000 6000
```

>bdocs-tab:example Listen on port 8888 locally, forwarding to 5000 in the pod

```bdocs-tab:example_shell
kubectl port-forward mypod 8888:5000
```

>bdocs-tab:example Listen on a random port locally, forwarding to 5000 in the pod

```bdocs-tab:example_shell
kubectl port-forward mypod :5000
```

>bdocs-tab:example Listen on a random port locally, forwarding to 5000 in the pod

```bdocs-tab:example_shell
kubectl port-forward  mypod 0:5000
```


Forward one or more local ports to a pod.

### Usage

`$ port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
pod | p |  | Pod name 


