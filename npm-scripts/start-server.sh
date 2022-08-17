#!/usr/bin/env bash

echo "Reading shell file"
if [ ! -d "./server/node_modules" ]; then
  printf "Installing dependencies...\n"
  npm --prefix server install
  printf "Dependencies installed \033[1;32mok\033[0m!\n"

else
  printf "Initiating local development environment...\n"
  printf "\033[1;32mHappy hacking!\033[0m"
  npm --prefix server run dev
fi
