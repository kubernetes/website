
Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run

### Synopsis

Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run

```
kubeadm upgrade diff [version] [flags]
```

### Options

```
      --api-server-manifest string           path to API server manifest (default "/etc/kubernetes/manifests/kube-apiserver.yaml")
  -c, --context-lines int                    How many lines of context in the diff (default 3)
      --controller-manager-manifest string   path to controller manifest (default "/etc/kubernetes/manifests/kube-controller-manager.yaml")
  -h, --help                                 help for diff
      --scheduler-manifest string            path to scheduler manifest (default "/etc/kubernetes/manifests/kube-scheduler.yaml")
```

### Options inherited from parent commands

```
      --allow-experimental-upgrades        Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
      --allow-release-candidate-upgrades   Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
      --config string                      Path to kubeadm config file. WARNING: Usage of a configuration file is experimental!
      --feature-gates string               A set of key=value pairs that describe feature gates for various features.Options are:
                                           Auditing=true|false (ALPHA - default=false)
                                           CoreDNS=true|false (default=true)
                                           DynamicKubeletConfig=true|false (ALPHA - default=false)
                                           SelfHosting=true|false (ALPHA - default=false)
                                           StoreCertsInSecrets=true|false (ALPHA - default=false)
      --ignore-preflight-errors strings    A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --kubeconfig string                  The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
      --print-config                       Specifies whether the configuration file that will be used in the upgrade should be printed or not.
```

