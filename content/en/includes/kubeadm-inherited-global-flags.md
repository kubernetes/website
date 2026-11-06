### Inherited global flags {#inherited-global-flags}

The generated options table on each `kubeadm` subcommand page lists
flags for that subcommand only. The parent `kubeadm` command also
accepts global flags that apply to **every** subcommand (`init`,
`join`, `upgrade`, `reset`, `token`, and the rest).

Use `-v` / `--v` to set log verbosity. `--v=5` is usually enough for
troubleshooting; `--v=10` prints each API client request and its body.
`--rootfs` is inherited as well. Run `kubeadm --help` to see the full
list.
