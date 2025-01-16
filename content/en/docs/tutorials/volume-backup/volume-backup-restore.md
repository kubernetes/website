---
title: Volume Backup, Delete and Restore 
content_type: tutorial
weight: 10
---

<!-- overview -->
This tutorial provides an introduction to taking backups of a volume and restoring it. It demonstrates how to create, delete, and restore the volume using [gzip](https://www.gnu.org/software/gzip/).

## {{% heading "prerequisites" %}}
Before you begin this tutorial, you should familiarize yourself with the following Kubernetes concepts:

* [Pods](/docs/concepts/workloads/pods/)
* [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
* The [kubectl](/docs/reference/kubectl/kubectl/) command line tool

{{% include "task-tutorial-prereqs.md" %}}

You should configure kubectl to use a context that uses the default namespace. If you are
using an existing cluster, make sure it's okay to use that cluster's default namespace to
practice. Ideally, practice in a cluster that doesn't run any real workloads.

## {{% heading "objectives" %}}
After this tutorial, you will be familiar with the following.
1. Understanding the importance of volume backups
1. Backing up kubernetes volumes
1. Deleting and recreating volumes
1. Restoring applications with backed-up data
1. Practical workflow for backup and restore

Use the existing yaml file from the [Configure a Pod to Use a PersistentVolume for Storage](/tasks/configure-pod-container/configure-persistent-volume-storage/) task, to configure PersistentVolume (PV) and PersistentVolumeClaim (PVC). Then follow the steps from the beginning, to create a `hostpath` and `index.html` file as well.

View information about the PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

The output shows that the PersistentVolume has a `STATUS` of `Available`. This
means it has not yet been bound to a PersistentVolumeClaim.

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s
```

After you create the PersistentVolumeClaim, the Kubernetes control plane looks
for a PersistentVolume that satisfies the claim's requirements. If the control
plane finds a suitable PersistentVolume with the same StorageClass, it binds the
claim to the volume.

Look again at the PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Now the output shows a `STATUS` of `Bound`.

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m
```

Look at the PersistentVolumeClaim:

```shell
kubectl get pvc task-pv-claim
```

The output shows that the PersistentVolumeClaim is bound to your PersistentVolume,
`task-pv-volume`.

```
NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s
```

## Create a Pod
The next step is to create a Pod that uses your PersistentVolumeClaim as a volume.

Here is the configuration file for the Pod:

{{% code_sample file="pods/storage/pv-pod-backup.yaml" %}}

Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but it does not specify a PersistentVolume. From the Pod's point of view, the claim is a volume.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod-backup.yaml
```

Verify that the container in the Pod is running;

```shell
kubectl get pod pv-pod-backup
```

Get a shell to the container running in your Pod:

```shell
kubectl exec -it pv-pod-backup -- /bin/bash
```

In your shell, verify that httpd:2.4 is serving the `index.html` file from the
hostPath volume:

```shell
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
apt update
apt install curl
curl http://localhost/
```

The output shows the text that you wrote to the `index.html` file on the
hostPath volume:

```
Hello from Kubernetes storage
```

If you see that message, you have successfully configured a Pod to
use storage from a PersistentVolumeClaim.

## Backup, Delete and Restore Volumes

### Create Backup

The process involves accessing the pod to interact with its file system, navigating to the mounted volume directory ```(/usr/local/apache2/htdocs)``` containing the data to be backed up, and compressing the directory contents into a ```.tar.gz``` file stored in the pod's temporary directory ```(/tmp)```. After exiting the pod shell, the backup file is transferred to the local machine using ```kubectl cp```, ensuring the data is securely saved outside the pod environment for restoration or safekeeping.

**Access the Pod:** 
To start the backup process, first, access the pod that has the volume you want to back up:

```shell
kubectl exec -it pv-pod-backup -- /bin/bash
```

This command opens an interactive shell inside the specified pod (pv-pod-backup).

**Navigate to the Mounted Volume Directory:**
Once inside the pod, navigate to the directory where the volume is mounted:
```shell
cd /usr/local/apache2/htdocs
```
This directory contains the data you wish to back up.

**Create a Compressed Backup File (gzip):**
Use the tar command to create a compressed backup file of the directory's contents:
```shell
tar -czvf /tmp/volume-backup.tar.gz .
```
**Exit the pod:**
After creating the backup file, exit the pod:
```
exit
```
**Copy the Backup to Local Machine:**
Use ```kubectl cp``` to copy the backup file from the pod to your local system:
```shell
kubectl cp pv-pod-backup:/tmp/volume-backup.tar.gz ./volume-backup.tar.gz
```
This saves the backup file ```volume-backup.tar.gz``` in your current local directory.

### Delete the data from volume
 To understand the backup use, The process involves accessing the pod to navigate to the mounted volume directory ```/usr/local/apache2/htdocs```, deleting all files and subdirectories within it using ```rm -rf *```, and verifying the deletion by listing the directory contents ```ls -l```. Finally, the pod shell is exited after confirming the directory is empty.
 
**Access the Pod Again:**
To delete the data from the volume, access the pod that uses the volume:
```shell
kubectl exec -it task-pv-pod -- /bin/bash
```
**Navigate to the Mounted Volume Directory:**
Inside the pod, go to the directory where the volume is mounted:
```shell
cd /usr/local/apache2/htdocs
```
**Delete All Files:**
Delete all files and subdirectories in the volume:
```shell
rm -rf *
```
**Verify the Deletion:**
List the contents of the directory to confirm it is empty:
```shell
ls -l
```
If the deletion was successful, no files or directories will be listed.

**Exit the Pod:**
After verifying the deletion, exit the pod:
```shell
exit
```

### Restore the Backup Data
The process involves copying the backup file (volume-backup.tar.gz) from the local machine to the pod's temporary directory using kubectl cp. Then, access the pod shell, navigate to the mounted volume directory (/usr/local/apache2/htdocs), and extract the backup using tar. Finally, verify the restored files with ls -l and exit the pod shell.

**Copy the Backup File to the Pod:**
Transfer the backup file from your local machine back to the pod:
```shell
kubectl cp ./volume-backup.tar.gz pv-pod-backup:/tmp/volume-backup.tar.gz
```
This copies the backup file to the /tmp directory of the pv-pod-backup pod.

**Access the Pod:**
Open an interactive shell inside the pod:
```shell
kubectl exec -it task-pv-pod -- /bin/bash
```
**Extract the Backup:**
Navigate to the mounted volume directory and extract the backup:
```shell
cd /usr/local/apache2/htdocs
tar -xzvf /tmp/volume-backup.tar.gz
```
**Verify the Restoration:** 
List the contents of the directory to confirm the files have been restored:
```shell
ls -l
```
If successful, you should see all the files and directories from the backup.

**Exit the Pod:**
```shell
exit
```
### Test the Restored Data
Now Check the status of the Pod ```pv-pod-backup``` Whether it is in ```Running``` state or not. If it is in ```Running``` state then restoring the volume worked perfectly fine.
```shell
kubectl get pod pv-pod-backup -o wide
```
Now You can again check the output by access the pods
```shell
kubectl exec -it pv-pod-backup -- /bin/bash
```
To run the restored file run 
```shell
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
apt update
apt install curl
curl http://localhost/
```
## Understanding the importance of volume backups
Some key points about importance of volume backup are:
1. Backups keep your data safe if it's accidentally deleted, corrupted, or lost due to  hardware failure.
1. If your system crashes or faces an attack, backups help restore data and reduce downtime.
1. Backups let you transfer data between environments or cloud platforms without losing it.
1. Losing data can stop your work. Backups help avoid this.
1. Migrate data from development to testing or production environments.
1. Backups allow you to create a safe copy of your production data for Testing new features or bug fixes.Training new team members on real-world data.
