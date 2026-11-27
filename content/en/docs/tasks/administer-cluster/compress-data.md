---
title: Compressing API Data at Rest
reviewers:
- jpbetz
- deads2k
content_type: task
min-kubernetes-server-version: v1.38
weight: 217
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.38" state="alpha" >}}

Storage compression has no feature gate. You turn it on with the kube-apiserver flag
`--storage-compression-config`.

The Kubernetes API server can compress API objects before it writes them to
{{< glossary_tooltip text="etcd" term_id="etcd" >}}. You pick the resources to compress
in a configuration file. Compressed objects take less space in the etcd database, in its
backups and snapshots, and in the data that etcd replicates between its members.

Clients can't tell that an object was compressed. Every object reads back exactly as it was
written, and nothing about the Kubernetes API changes. Compression doesn't raise the size
limit for objects, and it doesn't reduce the memory the API server uses to cache objects. It's
also separate from [API response compression](/docs/reference/using-api/api-concepts/#response-compression),
which compresses the responses that the API server sends to clients.

When you also [encrypt data at rest](/docs/tasks/administer-cluster/encrypt-data/), the API
server compresses each object first and encrypts it afterwards. Encrypted data doesn't compress,
so in an encrypted cluster the API server is the only place left to shrink an object: nothing
below it (etcd, its storage engine, or the filesystem) can.

Large objects, such as big ConfigMaps or custom resources, gain the most. The API server spends
CPU time compressing each write of a selected resource and decompressing each read of a compressed
object. Small objects gain almost nothing for that cost, so the API server leaves objects below a
size threshold alone.

This page shows how to turn compression on, check that it's working, compress objects that are
already stored, and turn compression off. It also explains what you must do before you roll the
control plane back to a release older than v1.38.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* The steps on this page assume that each kube-apiserver runs as a
  {{< glossary_tooltip text="static Pod" term_id="static-pod" >}} on a control
  plane node. If you run it another way, for example from a Deployment or a systemd
  unit, set the same flags wherever your setup configures kube-apiserver, make the
  file readable to it, and restart each API server.

* Every kube-apiserver in your cluster must run Kubernetes v1.38 or later. Finish upgrading the
  whole control plane before you turn on compression, because older API servers can't read
  compressed objects.

* You must be ready to set
  [`--min-compatibility-version`](/docs/reference/command-line-tools-reference/kube-apiserver/)
  to 1.38 or later on every kube-apiserver. In v1.38 it defaults to 1.37. The steps on this page
  set it in the same restart that turns on compression. It can't be higher than
  [`--emulated-version`](/docs/concepts/cluster-administration/compatibility-version/#emulated-version),
  so if you set `--emulated-version`, that must be 1.38 or later too.

  The flag declares the oldest control plane version that the API server stays compatible with,
  and raising it changes more than compression. Each feature gate whose default depends on it
  switches to its newer default, unless you set that gate yourself. In the `--feature-gates` help
  text, those gates carry the note `if --min-compatibility-version>=1.38`. The API server can also
  pick a newer storage version for some resources. Plan as if you can't roll back below v1.38. If
  you ever have to, follow [Roll back to a release older than v1.38](#downgrade) first.

* To look at stored data directly, you need the `etcdctl` command line tool and credentials for
  your cluster's etcd. The scan in [Roll back to a release older than v1.38](#downgrade) also
  needs `jq` 1.6 or later.

{{< version-check >}}

<!-- steps -->

## Understanding the storage compression configuration {#understanding-the-configuration}

The kube-apiserver flag `--storage-compression-config` takes the path to a file that contains a
StorageCompressionConfiguration. If you don't set the flag, the API server compresses nothing and
stores the same bytes it would store without this feature.

Here's an example:

```yaml
---
#
# This is an example configuration.
# Check whether it suits your cluster before you use it.
#
apiVersion: apiserver.config.k8s.io/v1alpha1
kind: StorageCompressionConfiguration
compressionResources:
  # The API server checks entries in order. The first entry that
  # matches a resource decides how that resource is stored.
  - resources:
      - events               # small and short-lived, so not worth compressing
    algorithm: None          # None keeps a resource out of a later wildcard
  - resources:
      - widgets.example.com  # a custom resource, as <resource>.<group>
    algorithm: Deflate
    minSize: 512             # compress values of 512 bytes or more
  - resources:
      - '*.*'                # every resource in every group, except Secrets
    algorithm: Deflate       # minSize defaults to 1Ki
```

`compressionResources` is an ordered list. Each entry lists one or more resources in `resources`,
sets `algorithm` to Deflate or None, and can set `minSize`. A resource that no entry matches isn't
compressed, and if `compressionResources` is empty or missing, nothing is compressed. Ordering works
the same way as in an EncryptionConfiguration: to keep a resource out of a wildcard, give it an
entry with `algorithm` set to None, ahead of the wildcard. The `events` resource also covers Events
that clients write through the `events.k8s.io` API group, because the API server stores both the
same way.

The API server reads the file once, at startup. It refuses to start if anything in the file is
invalid, including a field name it doesn't recognize. Editing the file changes nothing until you
restart the API server.

For the full schema, see the
[kube-apiserver configuration API (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/)
reference. That page lists the kind under the `apiserver.k8s.io/v1alpha1` package, but your file
must use `apiVersion: apiserver.config.k8s.io/v1alpha1`.

### Naming resources {#resource-selectors}

Each item in `resources` is a selector. Selectors take the same forms that EncryptionConfiguration
accepts:

{{< table caption="Storage compression selectors" >}}
| Selector | What it selects |
|---|---|
| `<resource>` | A resource in the core API group, for example `configmaps` |
| `<resource>.<group>` | A resource in another API group, for example `deployments.apps` or `widgets.example.com` |
| `*.<group>` | Every resource in an API group, for example `*.apps` |
| `*.` | Every resource in the core API group, except Secrets |
| `*.*` | Every resource that kube-apiserver stores, in every API group, custom resources included, except Secrets |
{{< /table >}}

To see which resources a wildcard selects in your cluster, run:

```shell
kubectl api-resources --verbs=list,update -o name
```

The list includes `secrets`, which no wildcard selects. Each resource is printed as `<resource>`
for the core API group or `<resource>.<group>` for other groups, the same form as a selector. `*.`
selects the core group resources, `*.<group>` selects the resources in that group, and `*.*`
selects them all. Leave out resources that
[aggregated API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
serve, because kube-apiserver doesn't store them and its configuration doesn't apply to them.
`kubectl get apiservices` lists their API groups with a SERVICE other than `Local`.

The API server refuses to start if a selector:

* is `*` on its own, or has the form `<resource>.*`
* contains a capital letter
* is in the `extensions` group, or in the `events.k8s.io` group (use `events` instead)
* names `apiserveripinfo`, `serviceipallocations` or `servicenodeportallocations`, which have no
  REST API
* repeats or overlaps another selector in the same entry, for example `configmaps` beside `*.`, or
  `*.apps` beside `*.*`
* is already covered by a selector in an earlier entry, for example `configmaps` in an entry that
  comes after one listing `*.`. The earlier entry always matches first, so the later selector could
  never take effect. Put the more specific entry first.

Every entry needs at least one selector. The API server doesn't check that a selector names a
resource that exists, so a misspelled name silently matches nothing.

### Algorithm and size threshold {#algorithm-and-minsize}

Deflate compresses values with DEFLATE ([RFC 1951](https://www.rfc-editor.org/rfc/rfc1951)).
None stores values uncompressed. You use None to keep resources out of a later wildcard, or to
stop compressing a resource.

`minSize` is the size, in bytes, of the smallest value that the API server compresses. It's a
[quantity](/docs/reference/kubernetes-api/definitions/quantity-resource/) such as 512 or 4Ki,
and it defaults to 1Ki. A fraction rounds up to the next whole byte. The value must be at least 64
and less than 1472Ki, otherwise the API server refuses to start. The size that counts is that of
the object as the API server stores it, before any encryption: protobuf for built-in resources,
and usually JSON for custom resources. That's often smaller than what `kubectl get -o yaml` shows
you.

Whatever `minSize` says, the API server never compresses a value larger than 1472 KiB. That
ceiling keeps every compressed value small enough to be written back uncompressed within etcd's
default request limit of 1.5 MiB, which you rely on when you stop compressing. It's also why
compression can't help you store larger objects: the API server stores anything above the
ceiling uncompressed, so etcd rejects an oversized object just as it would without compression.

If DEFLATE can't make a value smaller (random binary data, for example), the API server stores the
value uncompressed with a 9-byte header in front of it, so the value grows by 9 bytes.

### Secrets {#secrets}

No wildcard ever selects Secrets. To compress them, name `secrets` in an entry. Because no wildcard
reaches it, `secrets` can sit in the same entry as `*.` or `*.*`. When you compress Secrets, the
API server logs a warning at startup similar to:

```
--storage-compression-config=/etc/kubernetes/compression/storage-compression.yaml compresses secrets. A Secret's size in etcd shows how compressible its contents are, even when encryption at rest is configured.
```

{{< alert color="caution" title="Caution" >}}
Compression makes an object's stored size depend on its contents, not only on its length. Someone
who can read etcd or its backups, and who can change part of an object without being able to read
it, can learn about the rest of the object by watching its stored size change. Before you name
`secrets`, check that nobody can `update` or `patch` them without `get` or `list`.
{{< /alert >}}

## Compress data {#compress-data}

Turning on compression starts a one-time burst of etcd writes. When an API server reads an object
that isn't stored the way its configuration asks, it rewrites that object on the next update, even
an update that changes nothing. [Compress existing data](#compress-existing-data) explains the
burst, and how a storage version migration lets you choose when it happens.

### Write a compression configuration file

On one control plane host, save a configuration file as
`/etc/kubernetes/compression/storage-compression.yaml`. This example compresses ConfigMaps of
1 KiB or more:

```yaml
apiVersion: apiserver.config.k8s.io/v1alpha1
kind: StorageCompressionConfiguration
compressionResources:
  - resources:
      - configmaps
    algorithm: Deflate
```

### Use the compression configuration file

1. Edit the manifest for the `kube-apiserver` static Pod,
   `/etc/kubernetes/manifests/kube-apiserver.yaml`, so that it's similar to:

   ```yaml
   ---
   #
   # This is a fragment of a manifest for a static Pod.
   # Check whether this is correct for your cluster and for your API server.
   #
   apiVersion: v1
   kind: Pod
   metadata:
     name: kube-apiserver
     namespace: kube-system
   spec:
     containers:
     - command:
       - kube-apiserver
       ...
       - --min-compatibility-version=1.38                                            # add this line
       - --storage-compression-config=/etc/kubernetes/compression/storage-compression.yaml  # add this line
       volumeMounts:
       ...
       - name: compression                       # add this line
         mountPath: /etc/kubernetes/compression  # add this line
         readOnly: true                          # add this line
       ...
     volumes:
     ...
     - name: compression                         # add this line
       hostPath:                                 # add this line
         path: /etc/kubernetes/compression       # add this line
         type: DirectoryOrCreate                 # add this line
     ...
   ```

   If the manifest already sets `--min-compatibility-version`, change that value rather than adding
   the flag a second time.

1. Save the manifest. The kubelet sees the change and restarts the API server.

1. Check that the API server is running again. If it isn't, its log says why. The API server
   refuses to start when its configuration compresses something but `--min-compatibility-version`
   is below 1.38. This check doesn't apply if every entry sets `algorithm` to None, because such a
   configuration compresses nothing. Without `--min-compatibility-version`, the log contains an
   error similar to:

   ```
   --storage-compression-config "/etc/kubernetes/compression/storage-compression.yaml": compressing resources requires --min-compatibility-version 1.38 or later, because older apiservers can't read compressed values; the server's is 1.37
   ```

Compression is now on for one control plane host.

### Reconfigure other control plane hosts {#reconfigure-other-hosts}

Copy the file to every other control plane host and make the same manifest change on each, one
host at a time. A mistake in the file stops the API server from starting, so if you change one host
at a time, the others keep serving while you fix it.

{{< alert color="caution" title="Caution" >}}
Use the same file on every control plane host, byte for byte. API servers that disagree about what
to compress keep rewriting each other's objects, which turns a one-time burst of writes into a
permanent one. Some disagreement during a rolling restart is expected and short. Finish the rollout
to every host, and [confirm that the hashes match](#confirm-config-hash), before you start a storage
version migration.
{{< /alert >}}

Later changes to the file follow the same pattern. The kubelet only restarts a static Pod when its
manifest changes, so after you edit the compression file alone, restart each API server yourself.
For example, you can temporarily move the manifest out of `/etc/kubernetes/manifests/` and then
move it back.

### Confirm that every API server loaded the same file {#confirm-config-hash}

Each API server reports the file it loaded in the `apiserver_storage_compression_last_config_info`
metric. Query each API server directly rather than through a load balancer, for example:

```shell
kubectl get --raw /metrics --server=https://<control-plane-host>:6443 \
  | grep '^apiserver_storage_compression_last_config_info'
```

Use your API server's `--secure-port` if it isn't the default 6443.

The output is similar to:

```
apiserver_storage_compression_last_config_info{apiserver_id_hash="sha256:1634971faf0b36a7e5ad7e69d7e9ea3ee6232b0df43dde48569efe66d7f983ab",hash="sha256:28d8ed2da2f5d1e70b68c40d020be462cbb48c15b527ed85cea8199f75833f26"} 1
```

`apiserver_id_hash` identifies the API server, so it's different on each host. `hash` is the
SHA-256 of the file's bytes, and it must be the same on every API server. Two files that differ
only in a comment report different hashes. If a host reports a different `hash`, or no series at
all, fix its file or its flags and restart it.

## Verify that written data is compressed {#verify}

Once an API server restarts with the file, it compresses selected objects whenever it writes them.
Objects that were already stored stay uncompressed until something writes them again; see
[Compress existing data](#compress-existing-data).

### Without encryption at rest {#verify-without-encryption}

Without encryption at rest, etcd holds the compressed value itself, so you can see it with
`etcdctl`.

1. Create a ConfigMap that's larger than 1 KiB:

   ```shell
   kubectl create configmap compressed-example -n default \
     --from-literal=data="$(yes 'compress me' | head -n 200)"
   ```

1. Read that ConfigMap out of etcd:

   ```shell
   ETCDCTL_API=3 etcdctl \
      --cacert=/etc/kubernetes/pki/etcd/ca.crt   \
      --cert=/etc/kubernetes/pki/etcd/server.crt \
      --key=/etc/kubernetes/pki/etcd/server.key  \
      get /registry/configmaps/default/compressed-example | hexdump -C
   ```

   The output is similar to this (abbreviated):

   ```hexdump
   00000000  2f 72 65 67 69 73 74 72  79 2f 63 6f 6e 66 69 67  |/registry/config|
   00000010  6d 61 70 73 2f 64 65 66  61 75 6c 74 2f 63 6f 6d  |maps/default/com|
   00000020  70 72 65 73 73 65 64 2d  65 78 61 6d 70 6c 65 0a  |pressed-example.|
   00000030  00 6b 38 73 01 7a 92 a9  30 b7 14 ec cf 31 4e c3  |.k8s.z..0....1N.|
   00000040  30 14 c6 f1 d7 0a 05 e3  01 2a 8b 29 0b 60 31 21  |0........*.).`1!|
   [...]
   00000110  7b fb bc 24 fe 93 10 1c  1c 1c 1c 1c 1c 1c 1c fc  |{..$............|
   00000120  6f c7 20 e1 7b 00 0a                              |o. .{..|
   00000127
   ```

   The first 48 bytes are the etcd key and a newline. The value starts at offset `0x30`.

1. Check that the value starts with `00 6b 38 73`, a zero byte followed by the letters `k8s`. An
   uncompressed ConfigMap starts with `6b 38 73 00` instead: the letters `k8s` and then a zero
   byte, the prefix of the protobuf storage format. (An uncompressed custom resource stored as JSON
   starts with `{`.) The first 9 bytes of a compressed value are a header:

   {{< table caption="Header of a compressed value" >}}
   | Bytes of the value | In this example | Meaning |
   |---|---|---|
   | 0 | `00` | Marks the value as compressed. No storage format that Kubernetes uses starts with this byte. |
   | 1 to 3 | `6b 38 73` | The letters `k8s`. |
   | 4 | `01` | The algorithm. `01` is DEFLATE. `00` means DEFLATE didn't make the value smaller, so the serialized object follows the header unchanged. |
   | 5 to 8 | `7a 92 a9 30` | A CRC-32C checksum, stored little-endian, over every byte of the value except these four. |
   | 9 onward | `b7 14 ec ...` | For DEFLATE, the uncompressed length as a LEB128 varint (`b7 14` is 2615 bytes), then the compressed data. |
   {{< /table >}}

   This object takes 246 bytes in etcd instead of 2615, because its data repeats one phrase.
   Real objects usually compress less.

1. Check that the ConfigMap reads back unchanged through the API:

   ```shell
   kubectl get configmap compressed-example -n default -o jsonpath='{.data.data}' | head -n 3
   ```

   The output is:

   ```
   compress me
   compress me
   compress me
   ```

### With encryption at rest {#verify-with-encryption}

With encryption at rest, the compressed value sits inside the ciphertext. The value in etcd starts
with the same `k8s:enc:` prefix as it did without compression (for example,
`k8s:enc:aescbc:v1:key1:`), and nothing visible in etcd tells you whether the value is compressed.

Check the API server's metrics instead. Create the ConfigMap from the previous section, then run:

```shell
kubectl get --raw /metrics \
  | grep '^apiserver_storage_compression_operations_total.*resource="configmaps"'
```

The output is similar to:

```
apiserver_storage_compression_operations_total{operation="from_storage",outcome="deflate",resource="configmaps"} 1
apiserver_storage_compression_operations_total{operation="to_storage",outcome="deflate",resource="configmaps"} 1
apiserver_storage_compression_operations_total{operation="to_storage",outcome="unframed_below_threshold",resource="configmaps"} 3
```

A sample with `operation="to_storage"` and `outcome="deflate"` means that this API server compressed
a ConfigMap when it wrote it. Only the API server that handled a write counts it. If you see no
`to_storage` samples, query each API server directly, as in
[Confirm that every API server loaded the same file](#confirm-config-hash). This check works
without encryption at rest too. [Monitor compression](#monitor) explains the other outcomes.

## Compress existing data {#compress-existing-data}

The API server compresses an object when it writes it, so objects stored before you turned on
compression stay uncompressed until something writes them again.

Whenever the API server reads an object whose stored form doesn't match the configuration, it marks
the object so that the next update writes it again, even if nothing in it changed. Normally the API
server skips the etcd write for an update that changes nothing, which is why controllers that keep
reapplying an unchanged object don't create etcd revisions. Until every object has been rewritten
once, those no-op updates become real writes. The burst ends by itself, but on a large cluster with
busy controllers you'll notice it. A storage version migration rewrites a resource's objects on
your schedule, instead of whenever updates happen to reach them.

1. Confirm that every API server reports the same `hash` in
   `apiserver_storage_compression_last_config_info`. A migration that runs while API servers
   disagree can report success and still leave objects in the old form.

1. Create a manifest named `migrate-configmaps.yaml` for a
   [storage version migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/):

   ```yaml
   apiVersion: storagemigration.k8s.io/v1
   kind: StorageVersionMigration
   metadata:
     name: configmaps-compression
   spec:
     resource:
       group: ""
       resource: configmaps
   ```

   For a custom resource, set `group` to its API group and `resource` to its plural name, for
   example `example.com` and `widgets`.

1. Create the StorageVersionMigration:

   ```shell
   kubectl create -f migrate-configmaps.yaml
   ```

1. Wait for the migration to succeed:

   ```shell
   kubectl wait --for=condition=Succeeded --timeout=30m \
     storageversionmigration.storagemigration.k8s.io/configmaps-compression
   ```

   If the wait times out, look for a `Failed` condition and its message in `status.conditions`:

   ```shell
   kubectl get storageversionmigration.storagemigration.k8s.io/configmaps-compression -o yaml
   ```

1. Repeat these steps for each resource you compress, except [Events](#events). On a large
   cluster, migrate one resource at a time. If you used a wildcard,
   [list the resources it selects](#resource-selectors) first.

A migration rewrites each object whose stored form doesn't match the configuration. Here, that's
every ConfigMap between `minSize` and 1472 KiB that's still stored uncompressed. Each rewrite is one
etcd write, one etcd revision, and one watch event for every client that watches the resource.
Objects already stored the way the configuration asks are left alone.

You can watch the burst:

* `apiserver_storage_compression_rewrites_needed_total{direction="to_framed"}` for the resource
  rises while the migration runs, and stops rising once every object has been rewritten.
* `etcd_requests_total{operation="update",group="",resource="configmaps"}` counts the writes.
  Unlike the compression metrics, it has separate `group` and `resource` labels, so for a custom
  resource you'd match `group="example.com",resource="widgets"`.
* The etcd database grows with the extra revisions until they're compacted.

To see what compression saved, compare `apiserver_storage_size_bytes`, the size of the etcd
database file, from before you turned compression on with its value afterwards. Take the second
reading once the migrations have finished, etcd has compacted the old revisions (by default, the
API server requests a compaction every 5 minutes), and you've
[defragmented](/docs/tasks/administer-cluster/configure-upgrade-etcd/#cluster-defragmentation)
etcd. The file doesn't shrink until you defragment it.

{{< alert color="info" title="Note" >}}
A StorageVersionMigration runs once and can't be rerun. If you change the compression configuration
on any API server while a migration is running, the migration can report success over objects that
were written under the old configuration. Once every API server reports the same `hash` again,
create another migration with a different name.
{{< /alert >}}

Changing `minSize` also changes the form that some objects should be stored in, so treat it like
any other configuration change: roll it out, confirm the hashes, then migrate.

### Compressed Events {#events}

You can't migrate Events with a StorageVersionMigration. The migration controller reads objects
from the garbage collector's cache, and by default the garbage collector ignores Events, so a
migration for `events` never reports `Succeeded` or `Failed`. You don't need one, because each Event
expires after the kube-apiserver's `--event-ttl` (1 hour by default), and any update before then
rewrites it in the form the configuration asks for.

## Monitor compression {#monitor}

The API server exposes seven metrics for compression, all at ALPHA stability. Each API server
reports only what it did itself, so read the metrics from every API server. There's no metric for
the compression ratio or for bytes saved: on a resource with only a few objects, such a metric
would reveal how compressible each object is.

### Activity

`apiserver_storage_compression_operations_total` counts reads and writes by `resource`, `operation`
and `outcome`. `operation` is `to_storage` for writes and `from_storage` for reads. `resource` is
named the way you name it in the configuration, such as `configmaps` or `widgets.example.com`.
`outcome` is one of:

{{< table caption="Values of the outcome label" >}}
| `outcome` | Meaning |
|---|---|
| `deflate` | The value is compressed. |
| `stored` | The value has the 9-byte header but is uncompressed, because DEFLATE didn't make it smaller. |
| `unframed_below_threshold` | The value is smaller than `minSize`, so it isn't compressed. |
| `unframed_above_max` | The value is larger than 1472 KiB, so it isn't compressed. |
| `unframed_legacy` | Reads only. The value was stored before compression applied to it, and its next write compresses it. |
{{< /table >}}

The API server counts the `unframed_*` outcomes only for resources that its configuration
compresses. If a resource you meant to compress has no samples at all, check how you spelled it, and
check that no earlier entry sets it to None.

`apiserver_storage_compression_duration_seconds` is a histogram of time spent compressing
(`operation="to_storage"`) and decompressing (`operation="from_storage"`). It leaves out encryption
and the time spent waiting to decompress.

Whether compressing a resource pays off depends on the space it saves in etcd (see
[Compress existing data](#compress-existing-data)) against what it costs the API server: CPU time
to compress writes and decompress reads, which this histogram shows, and memory for decompression.
To see the total effect, compare the API server's `process_cpu_seconds_total` and
`process_resident_memory_bytes`, and its read and write latency, before and after you turn
compression on for the resource. If the cost outweighs the savings,
[stop compressing](#stop-compressing) that resource.

### Configuration and migration

`apiserver_storage_compression_last_config_info` has one series per API server, with the labels
`apiserver_id_hash` and `hash`, as shown in
[Confirm that every API server loaded the same file](#confirm-config-hash). Only API servers
started with `--storage-compression-config` report it.

`apiserver_storage_compression_rewrites_needed_total` counts reads that found an object stored in a
different form from the one the configuration asks for, by `resource` and `direction`. A `direction`
of `to_framed` means the object is uncompressed and should be compressed, and `to_unframed` means
the opposite. The counter rises after you change the configuration and goes quiet once a migration
has rewritten the resource. If it keeps rising in both directions and never goes quiet, your API
servers disagree about the configuration; compare their hashes. The counter only sees objects that
something reads, so a quiet counter doesn't prove that every object has been rewritten.

### Errors

A healthy cluster has no series at all for the two error counters. A series appears the first time
the counter increases.

`apiserver_storage_compression_format_errors_total` counts compressed values, by `resource`, that
failed their checksum or couldn't be parsed. Reads of those objects fail, and so does any LIST that
includes them. The API server log, at verbosity 2 (`-v=2`) or higher, gives the storage key and
says which of these two errors happened.

* A failed checksum means that the stored bytes are damaged. The API server reports the object as
  corrupt, and you can restore it from a backup or remove it with
  [unsafe deletion](/docs/reference/using-api/api-concepts/#force-deletion). The aesgcm, secretbox
  and KMS v2 encryption providers detect damage before decompression starts, so you only see this
  with aescbc, KMS v1, or no encryption.
* A malformed value with a valid checksum comes from a bug in the API server, or from someone with
  write access to etcd who crafted the bytes. The API server doesn't report the object as corrupt,
  and unsafe deletion refuses to remove it. Rolling back doesn't help, because releases older than
  v1.38 can't read any compressed value. Raise the API server's log verbosity to `-v=4` so that it
  logs why it rejected the value, and report the problem as a Kubernetes bug with that reason. If
  you can't wait for a fix, back up etcd and then delete the key directly with `etcdctl del`. The
  API server has no way to remove it for you.

`apiserver_storage_compression_unsupported_algorithm_total` counts values, by `resource`, that use
a compression algorithm this API server doesn't implement. A kube-apiserver from a later release
wrote them, and they're intact. Every v1.38 API server reads every value that v1.38 writes, so you
shouldn't see this within a supported version skew. If you do, upgrade the API server that reports
it. Don't try to delete the objects: they aren't corrupt, and unsafe deletion refuses them anyway.
The API server log at `-v=2` gives the algorithm and the storage key.

### Decompression capacity

`apiserver_storage_compression_inflation_wait_seconds` is a histogram of how long reads wait for a
decompression slot. To bound the memory that decompression uses, the API server decompresses at most
twice `GOMAXPROCS` values at once, with a minimum of 4 and a maximum of 384. Each slot can hold up
to about 1.5 MiB while it decompresses a value at the ceiling, so the limit also bounds the memory
that decompression can use at once. If the 99th percentile
of this wait rises while `apiserver_storage_compression_duration_seconds` stays flat, reads are
queueing for slots. The watch cache keeps objects already decompressed, so a LIST that the cache
serves decompresses nothing. A LIST that falls back to etcd decompresses every object it returns,
which makes it the largest burst of decompression a client can cause. That happens, for example,
while an API server's watch cache is still filling, when watch caching is turned off for the
resource, or when a consistent read can't wait for the cache to catch up. You can limit how many of
those LISTs run at once with
[API Priority and Fairness](/docs/concepts/cluster-administration/flow-control/). A read whose
request is canceled while it waits gives up and fails.

## Stop compressing a resource {#stop-compressing}

You can stop compressing a resource in three ways:

* Give it an entry with `algorithm` set to None, ahead of the wildcard that selects it.
* If you named the resource, remove it from its entry's `resources` list (and remove the entry if
  that leaves it empty), or set that entry's `algorithm` to None, which stops compressing every
  resource in the entry. Removing the resource only works if no wildcard later in the file also
  selects it.
* Remove the `--storage-compression-config` flag from every kube-apiserver. That stops compression
  for every resource.

For example, this configuration keeps compressing the rest of the core API group but stops
compressing ConfigMaps. Like the first example on this page, it also keeps Events out of the
wildcard:

```yaml
apiVersion: apiserver.config.k8s.io/v1alpha1
kind: StorageCompressionConfiguration
compressionResources:
  - resources:
      - events
      - configmaps       # stop compressing ConfigMaps
    algorithm: None
  - resources:
      - '*.'
    algorithm: Deflate
```

Roll the change out the same way you turned compression on: one control plane host at a time, then
[confirm that every API server loaded the same file](#confirm-config-hash). If you removed the flag,
confirm instead that no API server reports `apiserver_storage_compression_last_config_info`.

Reads keep working whatever you change. Every API server from v1.38 on decompresses any compressed
value, regardless of its own configuration, so turning compression off can't make data unreadable.
Turning it off doesn't decompress anything already stored, though. Compressed objects stay that way
until something writes them, and the API server marks them for rewriting when it reads them, so you
get the same one-time burst of writes as when you turned compression on. To rewrite them now, run a
storage version migration for the resource as in
[Compress existing data](#compress-existing-data), with a different name, for example
`configmaps-decompression`. `apiserver_storage_compression_rewrites_needed_total{direction="to_unframed"}`
shows the progress. Events are the exception: they expire instead, as described in
[Compressed Events](#events).

If compressing a resource causes trouble, such as slower writes, stopping compression for that
resource is enough. You don't need to roll back the control plane.

## Roll back to a release older than v1.38 {#downgrade}

{{< alert color="danger" title="Warning" >}}
Kubernetes releases older than v1.38 can't read compressed values. If a kube-apiserver older than
v1.38 finds even one compressed object, every LIST of that resource fails and every watch on it
ends, so the API server stops serving that resource. Before you roll back, follow the steps in this
section, in order. They rewrite every compressed object uncompressed and let compressed Events
expire, so that etcd holds no compressed values.
{{< /alert >}}

1. One control plane host at a time, remove the `--storage-compression-config` flag from the
   kube-apiserver manifest. (Setting every entry to None also stops compression, but releases
   before v1.38 don't recognize the flag and won't start with it, so you'll have to remove it
   anyway.)

1. Wait for every kube-apiserver to restart, then confirm that none of them reports
   `apiserver_storage_compression_last_config_info`.

1. For each resource that you've compressed at any point, including every resource that a wildcard
   selected ([list them](#resource-selectors) if you need to), create a StorageVersionMigration
   with a name you haven't used before, as in [Compress existing data](#compress-existing-data).
   Wait for each one to succeed. Skip Events. If you compressed them, wait at least `--event-ttl`
   plus a few minutes after the last API server stopped compressing them, so that every compressed
   Event has expired.

1. Confirm that the `Succeeded` condition is true on every one of those migrations. In a cluster
   without encryption at rest, you can also scan etcd for compressed values, including Events. This
   command prints the key of every value that starts with `00 6b 38` (`AGs4` in base64), so it
   prints nothing once no compressed value remains:

   ```shell
   ETCDCTL_API=3 etcdctl \
      --cacert=/etc/kubernetes/pki/etcd/ca.crt   \
      --cert=/etc/kubernetes/pki/etcd/server.crt \
      --key=/etc/kubernetes/pki/etcd/server.key  \
      get /registry/ --prefix -w json \
     | jq -r '.kvs[]? | select(.value | startswith("AGs4")) | .key | @base64d'
   ```

   That reads the whole database. On a large cluster, scan one resource at a time by narrowing the
   prefix, for example to `/registry/configmaps/` or `/registry/events/`.

1. Check that nothing else needs `--min-compatibility-version` to stay at 1.38 or later, such as
   a feature gate that turned on when you raised it. The steps above only rewrite compressed values.

1. Roll back the control plane. Set `--min-compatibility-version` no higher than the release you
   roll back to, because an older kube-apiserver won't start with a value above its own version.

Do these steps in order. A migration that runs while a resource is still selected only compresses
each object again. No metric can tell you when the job is done: the compression counters only see
values that something reads, so an object nobody reads never shows up in them. What tells you the
job is done is a successful migration for each resource except Events, started only after every API
server had stopped compressing that resource.

If you've already rolled back and the older API server can't read some objects
(`apiserver_storage_decode_errors_total` rises and LISTs of that resource fail), roll forward to
v1.38 or later. The older release reports those objects as corrupt, which makes them eligible for
unsafe deletion with `ignoreStoreReadErrorWithClusterBreakingPotential`. Don't delete them. They're
intact, and any API server from v1.38 on reads them. After rolling forward, follow the steps above
before you try the rollback again.

## Alpha limitations {#limitations}

* API Priority and Fairness estimates the cost of a LIST from the average stored size of the
  resource's objects (the
  [`SizeBasedListCostEstimate`](/docs/reference/command-line-tools-reference/feature-gates/#SizeBasedListCostEstimate)
  feature gate, enabled by default). For a compressed resource that's the compressed size, so
  API Priority and Fairness undercharges LISTs that the API server serves from etcd, roughly in
  proportion to the compression ratio, and can admit more of them at once than it should. LISTs
  served from the watch cache have a separate cap. The decompression limit still bounds the memory
  that decompression uses.
* Tools that read etcd values directly, such as `auger` and `etcdhelper`, don't understand
  compressed values. In a cluster without encryption at rest, they can't show you what a compressed
  object contains.
* The API server reads the configuration file only at startup. There's no automatic reload, unlike
  `--encryption-provider-config-automatic-reload` for encryption at rest.
* You can't configure the DEFLATE compression level or the decompression limit.
* Turning off compression for a resource always marks its compressed objects for rewriting. You
  can't stop compressing writes while leaving existing compressed objects as they are.
* The 1472 KiB ceiling assumes that etcd runs with its default `--max-request-bytes` of 1.5 MiB.
  If your etcd uses a lower limit, a compressed object close to that limit might be too large to
  write back uncompressed. On such a cluster, don't compress resources whose objects come close to
  etcd's limit.
* When an API server starts, it fills its watch cache by reading every object of each resource, so
  compressing a large resource adds decompression work to every API server start.

## {{% heading "whatsnext" %}}

* Read the [kube-apiserver configuration API (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/)
  reference
* See the [Kubernetes metrics reference](/docs/reference/instrumentation/metrics/)
* Learn more about [storage version migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/)
* Learn how to [encrypt data at rest](/docs/tasks/administer-cluster/encrypt-data/)
* Read [KEP-6264](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/6264-storage-object-compression),
  the design proposal for storage object compression
