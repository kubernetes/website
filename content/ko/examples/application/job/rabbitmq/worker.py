#!/usr/bin/env python

# 표준 출력만 출력하고 10초 동안 대기한다.
import sys
import time
print("Processing " + sys.stdin.readlines()[0])
time.sleep(10)
