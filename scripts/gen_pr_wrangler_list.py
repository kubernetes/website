#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Wed Jun 19 16:04:16 2019

@author: josiah

                 if '@' in line:
                        lsp=line.split('|')
                        map(str.strip, lsp)
                        datetime_object = datetime.strptime(lsp[0], '%b %d')
                        print(datetime_object)
                        print(lsp[1])

"""
from random import shuffle
from datetime import datetime

def create_new_wranger_doc():
    path_to_wiki='../../website.wiki/PR-Wranglers.md'
    path_to_owners='../OWNERS_ALIASES'
    path_to_output='../../website.wiki/PR-Wranglers-new.md'
    
    #Scrape the new list of possible wranglers from the OWNERS_ALIASES file
    with open(path_to_owners) as f:
        wranglers=get_wranglers(f)
        print(wranglers)
        
    #Read the Byes from the PR-Wranglers.md file
    with open(path_to_wiki) as f:
        byes=get_byes(f)
        print(byes)
                    
    #Create the new list of Wranglers and Byes
    #Recreate the new PR-Wranglers.md file from the old one
    with open(path_to_output,"w+"):
        with open(path_to_wiki) as f:
            for line in f:
                if 'Schedule' in line:
                    line=schedule_title(line)
                for line in f:
                    pass
    return

def schedule_title(line):
    lsp=line.split()
    try:
        int(lsp[1])
    except ValueError:
        print("Got "+lsp[1]+" instead of year, couldn't convert it to int")
    lsp[1]=lsp[1]+1
    if lsp[3] is 'Q1/Q2':
        lsp[3]='Q3/Q4'
    elif lsp[3] is 'Q3/Q4':
        lsp[3]='Q1/Q2'
    else:
        raise Exception('Could not find Q1/Q2 or Q3/Q4, instead got '+lsp[3])
    line=" ".join(lsp)
    return(line)       

def get_byes(f):
    byes=[]
    for line in f:
        if 'Byes Q2' in line or 'Byes Q4' in line:
            for line in f:
                if len(line)<2:
                    pass
                elif line[0] is '@':
                    byes.append(line.strip())
                else:
                    return byes
    return

def get_wranglers(f):
    wranglers=[]
    for line in f:
        if 'sig-docs-en-owners' in line:
            for line in f:
                line=line.strip();
                if line[0] is '-':
                    wranglers.append(line[1:].strip())
                else:
                    return wranglers
    return