------------

# exec

>bdocs-tab:example Get output from running 'date' from pod 123456-7890, using the first container by default

```bdocs-tab:example_shell
kubectl exec 123456-7890 date
```

>bdocs-tab:example Get output from running 'date' in ruby-container from pod 123456-7890

```bdocs-tab:example_shell
kubectl exec 123456-7890 -c ruby-container date
```

>bdocs-tab:example Switch to raw terminal mode, sends stdin to 'bash' in ruby-container from pod 123456-7890 # and sends stdout/stderr from 'bash' back to the client

```bdocs-tab:example_shell
kubectl exec 123456-7890 -c ruby-container -i -t -- bash -il
```


Execute a command in a container.

### Usage

`$ exec POD [-c CONTAINER] -- COMMAND [args...]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
container | c |  | Container name. If omitted, the first container in the pod will be chosen 
pod | p |  | Pod name 
stdin | i | false | Pass stdin to the container 
tty | t | false | Stdin is a TTY 


