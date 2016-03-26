#!/bin/bash

while :; 
  do
    system_profiler SPPowerDataType | grep "mAh\|Fully" | awk '{print $NF}'
  sleep $1
done
