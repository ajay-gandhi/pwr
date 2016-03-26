#!/bin/bash

while :; 
  do
    system_profiler SPPowerDataType | grep "mAh\|Fully"
  sleep $1
done
