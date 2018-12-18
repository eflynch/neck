#!/bin/bash
cd neck 
npm install
npm run build
cd ..
cp -r neck/app/* docs/

