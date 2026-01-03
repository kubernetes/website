---
title: " How did the Quake demo from DockerCon Work? "
date: 2015-07-02
slug: how-did-quake-demo-from-dockercon-work
url: /blog/2015/07/How-Did-Quake-Demo-From-Dockercon-Work
author: >
   Saied Kazemi (Google)
---
Shortly after its release in 2013, Docker became a very popular open source container management tool for Linux.  Docker has a rich set of commands to control the execution of a container. Commands such as start, stop, restart, kill, pause, and unpause. However, what is still missing is the ability to Checkpoint and Restore (C/R) a container natively via Docker itself.



We’ve been actively working with upstream and community developers to add support in Docker for native C/R and hope that checkpoint and restore commands will be introduced in Docker 1.8.  As of this writing, it’s possible to C/R a container externally because this functionality was recently merged in libcontainer.



External container C/R was demo’d at DockerCon 2015:



 ![Screen Shot 2015-06-30 at 3.37.46 PM.png](https://lh4.googleusercontent.com/MectR1Mh-7XA0Q5cqiQPrtNxnBE-EDkKR6XJQfazYcIJg3mSbWTcV9EyRfhu6VbIP_sFdMVCXRH1l8YYIuG05SiuO_WqaXPvOf41j0CN8eD9djd6E4joS9Y5Aljlpi64NnffiRY)



Container C/R offers many benefits including the following:  

- Stop and restart the Docker daemon (say for an upgrade) without having to kill the running containers and restarting them from scratch, losing precious work they had done when they were stopped
- Reboot the system without having to restart the containers from scratch. Same benefits as use case 1 above
- Speed up the start time of slow-start applications
- “Forensic debugging" of processes running in a container by examining their checkpoint images (open files, memory segments, etc.)
- Migrate containers by restoring them on a different machine  

CRIU

Implementing C/R functionality from scratch is a major undertaking and a daunting task.  Fortunately, there is a powerful open source tool written in C that has been used in production for checkpointing and restoring entire process trees in Linux.  The tool is called CRIU which stands for Checkpoint Restore In Userspace (http://criu.org).  CRIU works by:

- Freezing a running application.
- Checkpointing the address space and state of the entire process tree to a collection of “image” files.
- Restoring the process tree from checkpoint image files.
- Resuming application from the point it was frozen.

In April 2014, we decided to find out if CRIU could checkpoint and restore Docker containers to facilitate container migration.


#### Phase 1 - External C/R

The first phase of this effort invoking CRIU directly to dump a process tree running inside a container and determining why the checkpoint or restore operation failed.  There were quite a few issues that caused CRIU failure.  The following three issues were among the more challenging ones.  

#### External Bind Mounts

Docker sets up /etc/{hostname,hosts,resolv.conf} as targets with source files outside the container's mount namespace.

The --ext-mount-map command line option was added to CRIU to specify the path of the external bind mounts.  For example, assuming default Docker configuration, /etc/hostname in the container's mount namespace is bind mounted from the source at /var/lib/docker/containers/\<container-id\>/hostname.  When checkpointing, we tell CRIU to record /etc/hostname's "map" as, say, etc\_hostname. When restoring, we tell CRIU that the file previously recorded as etc\_hostname should be mapped from the external bind mount at /var/lib/docker/containers/\<container-id\>/hostname.



 ![ext_bind_mount.png](https://lh5.googleusercontent.com/STJqmZ-Z_b-rzLVj3vdFbI0687bnb7pgtiBzfZeELl3Ibp7I9EyV5SV55ykp2x0Bwx2M0ZQBYVCgWIAtsxBq9xPEpVTi29lhhYVlfYHx9VKBYge27VtCMS5j_B2JWHHXH0qAqy0)


#### AUFS Pathnames

Docker initially used AUFS as its preferred filesystem which is still in wide usage (the preferred filesystem is now OverlayFS)..  Due to a bug, the AUFS symbolic link paths of /proc/\<pid\>/map\_files point inside AUFS branches instead of their pathnames relative to the container's root. This problem has been fixed in AUFS source code but hasn't made it to all the distros yet.  CRIU would get confused seeing the same file in its physical location (in the branch) and its logical location (from the root of mount namespace).

The --root command line option that was used only during restore was generalized to understand the root of the mount namespace during checkpoint and automatically "fix" the exposed AUFS pathnames.


#### Cgroups


After checkpointing, the Docker daemon removes the container’s cgroups subdirectories (because the container has “exited”).  This causes restore to fail.

The --manage-cgroups command line option was added to CRIU to dump and restore the process's cgroups along with their properties.


The CRIU command lines are a simple container are shown below:  
```  
$ docker run -d busybox:latest /bin/sh -c 'i=0; while true; do echo $i \>\> /foo; i=$(expr $i + 1); sleep 3; done'  

$ docker ps  
CONTAINER ID  IMAGE           COMMAND           CREATED        STATUS  
168aefb8881b  busybox:latest  "/bin/sh -c 'i=0; 6 seconds ago  Up 4 seconds  

$ sudo criu dump -o dump.log -v4 -t 17810 \  
        -D /tmp/img/\<container\_id\> \  
        --root /var/lib/docker/aufs/mnt/\<container\_id\> \  
        --ext-mount-map /etc/resolv.conf:/etc/resolv.conf \  
        --ext-mount-map /etc/hosts:/etc/hosts \  
        --ext-mount-map /etc/hostname:/etc/hostname \  
        --ext-mount-map /.dockerinit:/.dockerinit \  
        --manage-cgroups \  
        --evasive-devices  

$ docker ps -a  
CONTAINER ID  IMAGE           COMMAND           CREATED        STATUS  
168aefb8881b  busybox:latest  "/bin/sh -c 'i=0; 6 minutes ago  Exited (-1) 4 minutes ago  

$ sudo mount -t aufs -o br=\  
/var/lib/docker/aufs/diff/\<container\_id\>:\  
/var/lib/docker/aufs/diff/\<container\_id\>-init:\  
/var/lib/docker/aufs/diff/a9eb172552348a9a49180694790b33a1097f546456d041b6e82e4d7716ddb721:\  
/var/lib/docker/aufs/diff/120e218dd395ec314e7b6249f39d2853911b3d6def6ea164ae05722649f34b16:\  
/var/lib/docker/aufs/diff/42eed7f1bf2ac3f1610c5e616d2ab1ee9c7290234240388d6297bc0f32c34229:\  
/var/lib/docker/aufs/diff/511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158:\  
none /var/lib/docker/aufs/mnt/\<container\_id\>  

$ sudo criu restore -o restore.log -v4 -d  
        -D /tmp/img/\<container\_id\> \  
        --root /var/lib/docker/aufs/mnt/\<container\_id\> \  
        --ext-mount-map /etc/resolv.conf:/var/lib/docker/containers/\<container\_id\>/resolv.conf \  
        --ext-mount-map /etc/hosts:/var/lib/docker/containers/\<container\_id\>/hosts \  
        --ext-mount-map /etc/hostname:/var/lib/docker/containers/\<container\_id\>/hostname \  
        --ext-mount-map /.dockerinit:/var/lib/docker/init/dockerinit-1.0.0 \  
        --manage-cgroups \  
        --evasive-devices  

$ ps -ef | grep /bin/sh  
root     18580     1  0 12:38 ?        00:00:00 /bin/sh -c i=0; while true; do echo $i \>\> /foo; i=$(expr $i + 1); sleep 3; done  

$ docker ps -a  
CONTAINER ID  IMAGE           COMMAND           CREATED        STATUS  
168aefb8881b  busybox:latest  "/bin/sh -c 'i=0; 7 minutes ago  Exited (-1) 5 minutes ago  

docker\_cr.sh
  ```

Since the command line arguments to CRIU were long, a helper script called docker\_cr.sh was provided in the CRIU source tree to simplify the process.  So, for the above container, one would simply C/R the container as follows (for details see [http://criu.org/Docker](http://criu.org/Docker)):

```  
$ sudo docker\_cr.sh -c 4397   
dump successful  

$ sudo docker\_cr.sh -r 4397  
restore successful  
```
At the end of Phase 1, it was possible to externally checkpoint and restore a Docker 1.0 container using either VFS, AUFS, or UnionFS storage drivers with CRIU v1.3.

#### Phase 2 - Native C/R

While external C/R served as a successful proof of concept for container C/R, it had the following limitations:


1. State of a checkpointed container would show as "Exited".
2. Docker commands such as logs, kill, etc. will not work on a restored container.
3. The restored process tree will be a child of /etc/init instead of the Docker daemon.

Therefore, the second phase of the effort concentrated on adding native checkpoint and restore commands to Docker.


#### libcontainer, nsinit

Libcontainer is Docker’s native execution driver.  It provides a set of APIs to create and manage containers.  The first step of adding native support was the introduction of two methods, checkpoint() and restore(), to libcontainer and the corresponding checkpoint and restore subcommands to nsinit.  Nsinit is a simple utility that is used to test and debug libcontainer.

#### docker checkpoint, docker restore

With C/R support in libcontainer, the next step was adding checkpoint and restore subcommands to Docker itself. A big challenge in this step was to rebuild the “plumbing” between the container and the daemon.  When the daemon initially starts a container, it sets up individual pipes between itself (parent) and the standard input, output, and error file descriptors of the container (child).  This is how docker logs can show the output of a container.  

When a container exits after being checkpointed, the pipes between it and the daemon are deleted.  During container restore, it’s actually CRIU that is the parent.  Therefore, setting up a pipe between the child (container) and an unrelated process (Docker daemon) required is not a bit of challenge.

To address this issue, the --inherit-fd command line option was added to CRIU.  Using this option, the Docker daemon tells CRIU to let the restored container “inherit” certain file descriptors passed from the daemon to CRIU.

The first version of native C/R was demo'ed at the Linux Plumbers Conference (LPC) in October 2014 ([http://linuxplumbersconf.org/2014/ocw/proposals/1899](http://linuxplumbersconf.org/2014/ocw/proposals/1899)).


 ![external_cr.png](https://lh3.googleusercontent.com/8R9X9CJxoqZBj0n9IdYHnrp8dCZTNcdpueUgUIggALAV4mWBoRkm4k89BPB6ApCHyMnlailY6YwBUKDgtjlQm3rGU6KOWNK3s8Bmq46BP_qetl6z97l3k44GXPG8oE_az0142DU)


The LPC demo was done with a simple container that did not require network connectivity.  Support for restoring network connections was done in early 2015 and demonstrated in this 2-minute [video clip](https://www.youtube.com/watch?v=HFt9v6yqsXo).

#### Current Status of Container C/R

In May 2015, the criu branch of libcontainer was merged into master.  Using the newly-introduced lightweight [runC](https://blog.docker.com/2015/06/runc/) container runtime, container migration was demo’ed at DockerCon15.  In this
[![demo](https://img.youtube.com/vi/7vZ9dRKRMyc/0.jpg)](https://www.youtube.com/watch?v=?mL9AFkJJAq0) (minute 23:00), a container running Quake was checkpointed and restored on a different machine, effectively implementing container migration.

At the time of this writing, there are two repos on GitHub that have native C/R support in Docker:
- [Docker 1.5](https://github.com/SaiedKazemi/docker/tree/cr) (old libcontainer, relatively stable)
- [Docker 1.7](https://github.com/boucher/docker/tree/cr-combined) (newer, less stable)  

Work is underway to merge C/R functionality into Docker.  You can use either of the above repositories to experiment with Docker C/R.  If you are using OverlayFS or your container workload uses AIO, please note the following:



#### OverlayFS  
When OverlayFS support was officially merged into the Linux kernel version 3.18, it became the preferred storage driver (instead of AUFS) .  However, OverlayFS in 3.18 has the following issues:
- /proc/\<pid\>/fdinfo/\<fd\> contains mnt\_id which isn’t in /proc/\<pid\>/mountinfo
- /proc/\<pid\>/fd/\<fd\> does not contain an absolute path to the opened file

Both issues are fixed in this [patch](https://lkml.org/lkml/2015/3/20/372) but the patch has not been merged upstream yet.

#### AIO
If you are using a kernel older than 3.19 and your container uses AIO, you need the following kernel patches from 3.19:


- [torvalds: bd9b51e7](https://git.kernel.org/?p=linux/kernel/git/torvalds/linux-2.6.git;a=commit;h=bd9b51e7) by Al Viro
- [torvalds: e4a0d3e72](https://git.kernel.org/?p=linux/kernel/git/torvalds/linux-2.6.git;a=commit;h=e4a0d3e72) by Pavel Emelyanov