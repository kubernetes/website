------------

# cp

>bdocs-tab:example !!!Important Note!!! # Requires that the 'tar' binary is present in your container # image.  If 'tar' is not present, 'kubectl cp' will fail. # Copy /tmp/foo_dir local directory to /tmp/bar_dir in a remote pod in the default namespace

```bdocs-tab:example_shell
kubectl cp /tmp/foo_dir <some-pod>:/tmp/bar_dir
```

>bdocs-tab:example Copy /tmp/foo local file to /tmp/bar in a remote pod in a specific container

```bdocs-tab:example_shell
kubectl cp /tmp/foo <some-pod>:/tmp/bar -c <specific-container>
```

>bdocs-tab:example Copy /tmp/foo local file to /tmp/bar in a remote pod in namespace <some-namespace>

```bdocs-tab:example_shell
kubectl cp /tmp/foo <some-namespace>/<some-pod>:/tmp/bar
```

>bdocs-tab:example Copy /tmp/foo from a remote pod to /tmp/bar locally

```bdocs-tab:example_shell
kubectl cp <some-namespace>/<some-pod>:/tmp/foo /tmp/bar
```


Copy files and directories to and from containers.

### Usage

`$ cp <file-spec-src> <file-spec-dest>`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
container | c |  | Container name. If omitted, the first container in the pod will be chosen 


