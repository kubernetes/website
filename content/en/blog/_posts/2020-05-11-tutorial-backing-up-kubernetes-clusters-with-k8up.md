---
layout: blog
title: "Tutorial: Backing up Kubernetes Clusters with K8up"
date: 2020-05-11
slug: tutorial-backing-up-kubernetes-clusters-with-k8up
---

# Tutorial: Backing up Kubernetes Clusters with K8up

One of the most common questions we got from companies moving to Kubernetes has always had to do with backups: how can we ensure that the information in our pods and services can be quickly and safely restored in case of problems?

This situation is so common that at [VSHN](https://vshn.ch/) we decided to tackle it with our own Kubernetes operator for backups, which we called [**K8up**](https://k8up.io/).

This tutorial is available in three versions, each in its own branch of the [GitHub repository](https://github.com/vshn/k8up-tutorial) bundled with this text:

- [Minikube](https://github.com/kubernetes/minikube) in the [`master` branch](https://github.com/vshn/k8up-tutorial).
- [k3s](https://k3s.io/) in the [`k3d` branch](https://github.com/vshn/k8up-tutorial/tree/k3d).
- [Red Hat CodeReady Containers](https://developers.redhat.com/products/codeready-containers) (OpenShift 4.3) in the [`openshift` branch](https://github.com/vshn/k8up-tutorial/tree/openshift).

## What is K8up?

K8up (pronounced "/keɪtæpp/" or simply "ketchup") is a Kubernetes operator distributed via a Helm chart, compatible with [OpenShift](https://www.openshift.com/) and plain Kubernetes. It allows cluster operators to:

- Backup all PVCs marked as `ReadWriteMany` or with a specific annotation.
- Perform individual, on-demand backups.
- Schedule backups to be executed on a regular basis.
- Schedule archivals (for example to AWS Glacier), usually executed in longer intervals.
- Perform "Application Aware" backups, containing the output of any tool capable of writing to `stdout`.
- Check the backup repository for its integrity.
- Prune old backups from a repository.
- Based on top of [Restic](https://restic.readthedocs.io/en/latest/), it can save backups in Amazon S3 buckets, and Minio (used we’ll see in this tutorial.)

K8up is written in [Go](https://golang.org/) and is an open source project [hosted in GitHub](https://github.com/vshn/k8up).

![Logo of the K8up project](https://raw.githubusercontent.com/vshn/k8up-tutorial/master/assets/images/logo.png)

## Introduction

This tutorial will show you how to backup a small [Minikube](https://github.com/kubernetes/minikube) cluster running on your laptop. We are going to deploy [Minio](https://min.io/), [MariaDB](https://mariadb.com/) and [WordPress](https://wordpress.org/) on this cluster, and create a blog post in our new website. Later we’re going to "deface" it, so that we can safely restore it later. Through this process, you are going to learn more about K8up and its capabilities.

All the scripts and YAML files are available in GitHub: [github.com/vshn/k8up-tutorial](https://github.com/vshn/k8up-tutorial).

### Requirements

This tutorial has been tested in both Linux (Ubuntu 18.04) and macOS (10.15 Catalina.) Please install the following software packages before starting:

- Make sure PyYAML 5.1 or later is installed: `pip install PyYAML==5.1`
- The `kubectl` command.
- The [Restic](https://restic.net/) backup application.
- The latest version of [Minikube](https://github.com/kubernetes/minikube) (1.9 at the time of this writing.)
- [Helm](https://helm.sh/), required to install K8up in your cluster.
- [k9s](https://k9scli.io/) to display the contents of our clusters on the terminal.
- [jq](https://stedolan.github.io/jq/), a lightweight and flexible command-line JSON processor.

## Tutorial

It consists of six steps to be executed in sequence:

1.  [Setting up the cluster](#step_1).
2.  [Creating a blog](#step_2).
3.  [Backing up the blog](#step_3).
4.  [Restoring the contents of the backup](#step_4).
5.  [Scheduling regular backups](#step_5).
6.  [Cleaning up](#step_6).

Let’s get started!

### Setting up the cluster

**NOTE:** The operations of this step can be executed at once using the `scripts/1_setup.sh` script in the [GitHub repository of this tutorial](https://github.com/vshn/k8up-tutorial).

1.  Start your minikube instance with a configuration slightly more powerful than the default one:

    - `minikube start --memory 4096 --disk-size 60g --cpus 4`

On some laptops, running Minikube on battery power severely undermines its performance, and pods can take really long to start. Make sure to be plugged in to power before starting this tutorial.

1.  Copy all required secrets and passwords into the cluster:

    - `kubectl apply -k secrets`

2.  Install and run [Minio](https://min.io/) in your cluster:

    - `kubectl apply -k minio`

3.  Install MariaDB in your cluster:

    - `kubectl apply -k mariadb`

4.  Install WordPress:

    - `kubectl apply -k wordpress`

5.  Install K8up in Minikube:

    - `helm repo add appuio charts.appuio.ch`
    - `helm repo update`
    - `helm install appuio/k8up --generate-name --set k8up.backupImage.tag=v0.1.8-root`

After finishing all these steps, check that everything is running; the easiest way is to launch `k9s` and leave it running in its own terminal window, and of course you can use the usual `kubectl get pods`.

In `k9s` you can easily delete a pod by going to the "Pods" view (type :, write `pods` at the prompt and hit Enter), selecting the pod to delete with the arrow keys, and hitting the <span class="keycombo">CTRL+D</span> key shortcut.

![Deleting a pod with k9s](https://raw.githubusercontent.com/vshn/k8up-tutorial/master/assets/images/k9s-delete.png)

### Viewing Minio and WordPress on a browser

**NOTE:** The operations of this step can be executed at once using the `scripts/2_browser.sh` script in the [GitHub repository of this tutorial](https://github.com/vshn/k8up-tutorial).

1. Open WordPress in your default browser using the `minikube service wordpress` command. You should see the WordPress installation wizard appearing on your browser window.
2. Open Minio in your default browser with the `minikube service minio` command.
    - You can login into minio with these credentials: access key `minio`, secret key `minio123`.

#### Setting up the new blog

Follow these instructions in the WordPress installation wizard to create your blog:

1. Select your language from the list and click the Continue button.
2. Fill the form to create new blog.
3. Create a user `admin`.
4. Copy the random password shown, or use your own password.
5. Click the Install WordPress button.

![WordPress installer](https://raw.githubusercontent.com/vshn/k8up-tutorial/master/assets/images/wordpress-install.png)

1. Log in to the WordPress console using the user and password.
    - Create one or many new blog posts, for example using pictures from [Unsplash](https://unsplash.com/).
2. Enter some text or generate some random text using a [Lorem ipsum generator](https://lipsum.com/).
3. Click on the "Document" tab.
4. Add the image as "Featured image".
5. Click "Publish" and see the new blog post on the site.

### Backing up the blog

**NOTE:** The operations of this step can be executed at once using the `scripts/3_backup.sh` script in the [GitHub repository of this tutorial](https://github.com/vshn/k8up-tutorial).

To trigger a backup, use the command `kubectl apply -f k8up/backup.yaml`. You can see the job in the "Jobs" section of `k9s`.

Running the `logs` command on a backup pod brings the following information:

    $ kubectl logs backupjob-1564752600-6rcb4
    No repository available, initialising...
    created restic repository edaea22006 at s3:http://minio:9000/backups

    Please note that knowledge of your password is required to access
    the repository. Losing your password means that your data is
    irrecoverably lost.
    Removing locks...
    created new cache in /root/.cache/restic
    successfully removed locks
    Listing all pods with annotation appuio.ch/backupcommand in namespace default
    Adding default/mariadb-9588f5d7d-xmbc7 to backuplist
    Listing snapshots
    snapshots command:
    0 Snapshots
    backing up via mariadb stdin...
    Backup command: /bin/bash, -c, mysqldump -uroot -p"${MARIADB_ROOT_PASSWORD}" --all-databases
    done: 0.00%
    backup finished! new files: 1 changed files: 0 bytes added: 4184711
    Listing snapshots
    snapshots command:
    1 Snapshots
    sending webhook Listing snapshots
    snapshots command:
    1 Snapshots
    backing up...
    Starting backup for folder wordpress-pvc
    done: 0.00%
    backup finished! new files: 1932 changed files: 0 bytes added: 44716176
    Listing snapshots
    snapshots command:
    2 Snapshots
    sending webhook Listing snapshots
    snapshots command:
    2 Snapshots
    Removing locks...
    successfully removed locks
    Listing snapshots
    snapshots command:
    2 Snapshots

If you look at the Minio browser window, there should be now a set of folders that appeared out of nowhere. That’s your backup in Restic format!

![Minio browser showing backup repository](https://raw.githubusercontent.com/vshn/k8up-tutorial/master/assets/images/minio-browser.png)

#### How does K8up work?

K8up runs Restic in the background to perform its job. It will automatically backup the following:

1. All PVCs in the cluster with the `ReadWriteMany` attribute.
2. All PVCs in the cluster with the `k8up.syn.tools/backup: "true"` annotation.

The PVC definition below shows how to add the required annotation for K8up to do its job.

    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: wordpress-pvc
      labels:
        app: wordpress
      annotations:
        k8up.syn.tools/backup: "true"
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 10Gi

Just like any other Kubernetes object, K8up uses YAML files to describe every single action: backups, restores, archival, etc. The most important part of the YAML files used by K8up is the `backend` object:

    backend:
      repoPasswordSecretRef:
        name: backup-repo
        key: password
      s3:
        endpoint: http://minio:9000
        bucket: backups
        accessKeyIDSecretRef:
          name: minio-credentials
          key: username
        secretAccessKeySecretRef:
          name: minio-credentials
          key: password

This object specifies two major keys:

- `repoPasswordSecretRef` contains the reference to the secret that contains the Restic password. This is used to open, read and write to the backup repository.
- `s3` specifies the location and credentials of the storage where the Restic backup is located. The only valid option at this moment is an AWS S3 compatible location, such as a Minio server in our case.

### Restoring a backup

**NOTE:** The operations of this step can be executed at once using the `scripts/4_restore.sh` script in the [GitHub repository of this tutorial](https://github.com/vshn/k8up-tutorial).

Let’s pretend now that an attacker has gained access to your blog: we will remove all blog posts and images from the WordPress installation and empty the trash.

![Defaced WordPress site!](https://raw.githubusercontent.com/vshn/k8up-tutorial/master/assets/images/wordpress-defaced.png)

Oh noes! But don’t worry: thanks to K8up you can bring your old blog back in a few minutes.

There are many ways to restore Restic backups, for example locally (useful for debugging or inspection) and remotely (on PVCs or S3 buckets, for example.)

#### Restoring locally

To restore using Restic, set these variables (in a Unix-based system; for Windows, the commands are different):

    export KUBECONFIG=""
    export RESTIC_REPOSITORY=s3:$(minikube service minio --url)/backups/
    export RESTIC_PASSWORD=p@ssw0rd
    export AWS_ACCESS_KEY_ID=minio
    export AWS_SECRET_ACCESS_KEY=minio123

**NOTE:** You can create these variables simply running `source scripts/environment.sh` using the script provided in the [GitHub repository of this tutorial](https://github.com/vshn/k8up-tutorial).

With these variables in your environment, run the command `restic snapshots` to see the list of backups, and `restic restore XXXXX --target ~/restore` to trigger a restore, where XXXXX is one of the IDs appearing in the results of the snapshots command.

#### Restoring the WordPress PVC

K8up is able to restore data directly on specified PVCs. This requires some manual steps.

1. Using the steps in the previous section, "Restore Locally," check the ID of the snapshot you would like to restore:

    $ source scripts/environment.sh
    $ restic snapshots
    $ restic snapshots XXXXXXXX --json | jq -r '.[0].id'

2. Use that long ID in your restore YAML file `k8up/restore/wordpress.yaml`:

    - Make sure the `restoreMethod:folder:claimName:` value corresponds to the `Paths` value of the snapshot you want to restore.

    - Replace the `snapshot` key with the long ID you just found:

```
apiVersion: backup.appuio.ch/v1alpha1
kind: Restore
metadata:
  name: restore-wordpress
spec:
  snapshot: 00e168245753439689922c6dff985b117b00ca0e859cc69cc062ac48bf8df8a3
  restoreMethod:
    folder:
      claimName: wordpress-pvc
  backend:
```

3. Apply the changes:

    - `kubectl apply -f k8up/restore/wordpress.yaml`

    - Use the `kubectl get pods` commands to see when your restore job is done.

If you use the `kubectl get pods --sort-by=.metadata.creationTimestamp` command to order the pods in descending age order; at the bottom of the list you will see the restore job pod.

#### Restoring the MariaDB pod

In the case of the MariaDB pod, we have used a `backupcommand` annotation. This means that we have to "pipe" the contents of the backup into the `mysql` command of the pod, so that the information can be restored.

Follow these steps to restore the database:

1. Retrieve the ID of the MariaDB snapshot:

    `restic snapshots --json --last --path /default-mariadb | jq -r '.[0].id'`

2. Save the contents of the backup locally:

    `restic dump SNAPSHOT_ID /default-mariadb > backup.sql`

3. Get the name of the MariaDB pod:

    `kubectl get pods | grep mariadb | awk '{print $1}'`

4. Copy the backup into the MariaDB pod:

    `kubectl cp backup.sql MARIADB_POD:/`

5. Get a shell to the MariaDB pod:

    `kubectl exec -it MARIADB_POD — /bin/bash`

6. Execute the `mysql` command in the MariaDB pod to restore the database:

    `mysql -uroot -p"${MARIADB_ROOT_PASSWORD}" < /backup.sql`

Now refresh your WordPress browser window and you should see the previous state of the WordPress installation restored, working and looking as expected!

![WordPress website restored](https://raw.githubusercontent.com/vshn/k8up-tutorial/master/assets/images/wordpress-restored.png)

### Scheduling regular backups

**NOTE:** The operations of this step can be executed at once using the `scripts/5_schedule.sh` script in the [GitHub repository of this tutorial](https://github.com/vshn/k8up-tutorial).

Instead of performing backups manually, you can also set a schedule for backups. This requires specifying the schedule in `cron` format.

    backup:
      schedule: '*/2 * * * *'    # backup every 2 minutes
      keepJobs: 4
      promURL: http://minio:9000

Use [crontab.guru](https://crontab.guru/) to help you set up complex schedule formats in `cron` syntax.

The schedule can also specify `archive` and `check` tasks to be executed regularly.

    archive:
      schedule: '0 0 1 * *'       # archive every week
      restoreMethod:
        s3:
          endpoint: http://minio:9000
          bucket: archive
          accessKeyIDSecretRef:
            name: minio-credentials
            key: username
          secretAccessKeySecretRef:
            name: minio-credentials
            key: password
    check:
      schedule: '0 1 * * 1'      # monthly check
      promURL: http://minio:9000

Run the `kubectl apply -f k8up/schedule.yaml` command. This will setup an automatic schedule to backup the PVCs every 5 minutes (for minutes that are divisors of 5).

Wait for at most 2 minutes, and run the `restic snapshots` to see more backups piling up in the repository.

Running the `watch restic snapshots` command will give you a live console with your current snapshots on a terminal window, updated every 2 seconds.

### Cleaning up the cluster

**NOTE:** The operations of this step can be executed at once using the `scripts/6_stop.sh` script in the [GitHub repository of this tutorial](https://github.com/vshn/k8up-tutorial).

When you are done with this tutorial, just execute the `minikube stop` command to shut the cluster down. You can also `minikube delete` it, if you would like to get rid of it completely.

## Conclusion

We hope that this walkthrough has given you a good overview of K8up and its capabilities. But it can do much more than that! We haven’t talked about the archive, prune, and check commands, or about the backup of any data piped to `stdout` (called "Application Aware" backups.) You can check these features in the [K8up documentation website](https://k8up.io/) where they are described in detail.

K8up is still a work in progress, but it is already being used in production in many clusters. It is also an [open source project](https://github.com/vshn/k8up), and everybody is welcome to use it freely, and even better, to contribute to it!
