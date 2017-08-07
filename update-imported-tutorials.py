#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Copyright 2017 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This program imports the tutorials from
https://github.com/kubernetes/examples and makes necessary modifications to
check them in as Jekyll-compatible documentation pages.
"""

import os.path
import shutil
import urllib.request

SRC_REPO = 'kubernetes/examples'
SRC_TREE = 'master'

# mapping of tutorials in kubernetes/examples to their
# equivalent files here: (examples-path, docs-path, new-title, imports-map)
TUTORIALS = [
    ('guestbook/README.md',
        './docs/tutorials/stateless-application/guestbook.md',
        "Example: Deploying PHP Guestbook application with Redis", {
            "guestbook/redis-master-deployment.yaml" : "./docs/tutorials/stateless-application/guestbook/redis-master-deployment.yaml",
            "guestbook/redis-master-service.yaml" : "./docs/tutorials/stateless-application/guestbook/redis-master-service.yaml",
            "guestbook/redis-slave-deployment.yaml" : "./docs/tutorials/stateless-application/guestbook/redis-slave-deployment.yaml",
            "guestbook/redis-slave-service.yaml" : "./docs/tutorials/stateless-application/guestbook/redis-slave-service.yaml",
            "guestbook/frontend-deployment.yaml" : "./docs/tutorials/stateless-application/guestbook/frontend-deployment.yaml",
            "guestbook/frontend-service.yaml" : "./docs/tutorials/stateless-application/guestbook/frontend-service.yaml",
        }),
    ('mysql-wordpress-pd/README.md',
        './docs/tutorials/stateful-application/mysql-wordpress-persistent-volume.md',
        "Example: WordPress and MySQL with Persistent Volumes", {}),
    ('cassandra/README.md',
        './docs/tutorials/stateful-application/cassandra.md',
        "Example: Deploying Cassandra with Stateful Sets",
        {
            "cassandra/cassandra-service.yaml": "./docs/tutorials/stateful-application/cassandra-service.yaml",
            "cassandra/cassandra-statefulset.yaml": "./docs/tutorials/stateful-application/cassandra-statefulset.yaml",
        }),
]


def main():
    for (src_path, dst_path, new_title, imports) in TUTORIALS:
        print('Processing {0}'.format(src_path))

        imports[src_path] = dst_path # add source itself as import file
        for src_path, dst_path in imports.items():
            src_url = 'https://github.com/{0}/raw/{1}/{2}'.format(SRC_REPO,
                SRC_TREE, src_path)
            dst_dir = os.path.dirname(dst_path)
            if not os.path.exists(dst_dir):
                print('Creating directory {0}.'.format(dst_dir))
                os.makedirs(dst_dir)

            print('Downloading {0}'.format(src_url))
            with urllib.request.urlopen(src_url) as resp, \
                    open(dst_path, 'wb') as out_file:
                shutil.copyfileobj(resp, out_file)
            print('Saved to {0}'.format(dst_path))

        print('Processing {0}'.format(dst_path))
        remove_excluded_snippets(dst_path)
        insert_do_not_update(dst_path)
        insert_title(dst_path, new_title)
        print('Processed {0}'.format(dst_path))


def remove_excluded_snippets(path):
    """Remove content between '<!-- EXCLUDE_FROM_DOCS BEGIN -->' and
    '<!-- EXCLUDE_FROM_DOCS END -->' markers (including the markers)
    in the specified file. Markers must appear on their own lines."""

    marker_begin = '<!-- EXCLUDE_FROM_DOCS BEGIN -->\n'
    marker_end = '<!-- EXCLUDE_FROM_DOCS END -->\n'

    new_lines = []
    started = False
    excluded_blocks = 0
    with open(path, 'r') as f:
        for line_no, line in enumerate(f):
            ref = '{0}:{1}'.format(path, line_no)
            if (marker_begin.rstrip('\n') in line and
                (line != marker_begin and line != marker_end.rstrip('\n'))) or \
                (marker_end.rstrip('\n') in line and (line != marker_end and
                    line != marker_end.rstrip('\n'))):
                raise Exception('{0}: EXCLUDE_FROM_DOCS marker must be on its own line'.format(ref))
            if not started:
                if line == marker_end:
                    raise Exception('{0}: encountered END before BEGIN'.format(ref))
                elif line == marker_begin:
                    started = True
                else:
                    new_lines.append(line.rstrip('\n'))
            else:
                if line == marker_begin:
                    raise Exception('{0}: encountered BEGIN again before END'.format(ref))
                elif line == marker_end:
                    started = False
                    excluded_blocks += 1
                else:
                    continue
    if started:
        raise Exception('encountered EOF before END')
    print('{0} EXCLUDE_FROM_DOCS blocks removed.'.format(excluded_blocks))
    with open(path, 'w') as f:
        f.write('\n'.join(new_lines))


def insert_title(path, title):
    """Inserts title in Jekyll metadata format to the file."""
    prepend_file(path, '---\ntitle: "{0}"\n---\n\n'.format(title))


def insert_do_not_update(path):
    notice = '<!--' + '\n' * 15 + 'DO NOT UPDATE THIS FILE!\n\n' \
        + 'Submit a patch to https://github.com/kubernetes/examples and\n' \
        + 'once it is merged, run ./update-imported-tutorials.sh to\n' \
        + 'import it to the website.' + '\n' * 15 + '-->\n\n'
    prepend_file(path, notice)


def prepend_file(path, ss):
    with open(path, 'r') as f:
        for line in f:
            ss += line
    with open(path, 'w') as f:
        f.write(ss)

if __name__ == '__main__':
    main()
