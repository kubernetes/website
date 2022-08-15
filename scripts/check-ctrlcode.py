#!/usr/bin/env python3

import os
import sys
import re

def main():
    args = sys.argv
    if (len(args) != 3):
        print("Usage: ./check-ctrlcode.py <dir> <ext>")
        sys.exit(1)

    dirpath = args[1]
    ext = args[2]

    fullpath = os.path.abspath(dirpath)
    if (os.path.isdir(fullpath) is not True):
        print("Directory not found.")
        sys.exit(1)

    check_dir(fullpath, ext)

def check_dir(path, ext):
    for f in os.listdir(path):
        if(f[0] == "."):
            continue
        fullpath = os.path.join(path, f)
        if(os.path.isdir(fullpath)):
            check_dir(fullpath, ext)
            continue
        exts = os.path.splitext(f)
        if(exts[1] != ext):
            continue
        check_ctrlcode(fullpath)

def check_ctrlcode(filepath):
    line = 0
    with open(filepath, encoding='utf-8') as f:
        while True:
            str = f.readline()
            if(str == ""):
                break
            line = line + 1
            # check 0x00-0x1f except 0x09(HT), 0x0a(LF), 0x0d(CR)
            pattern = re.compile('[\u0000-\u0008\u000b\u000c\u000e-\u001f]')
            m = pattern.search(str)
            if(m == None):
                continue
            pos = m.end()
            ctrl = m.group().encode("utf-8")
            print("{0} <L{1}:{2}:{3}>: {4}\n".format(filepath, line, pos, ctrl, str.replace('\n','')))


main()
