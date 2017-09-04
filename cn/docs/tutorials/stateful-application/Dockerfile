# This is an image with Percona XtraBackup, mysql-client and ncat installed.
FROM debian:jessie

RUN \
  echo "deb http://repo.percona.com/apt jessie main" > /etc/apt/sources.list.d/percona.list \
  && echo "deb-src http://repo.percona.com/apt jessie main" >> /etc/apt/sources.list.d/percona.list \
  && apt-key adv --keyserver keys.gnupg.net --recv-keys 8507EFA5

RUN \
  apt-get update && apt-get install -y --no-install-recommends \
    percona-xtrabackup-24 \
    mysql-client \
    nmap \
  && rm -rf /var/lib/apt/lists/*

CMD ["bash"]

