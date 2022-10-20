#!/bin/bash
echo "Install and build provider-ui..."
(cd provider-ui && npm install && npm run build)
echo "Install and build provider-api..."
(cd provider-api && npm install && npm run build)
