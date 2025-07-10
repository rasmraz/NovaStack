#!/bin/bash

# Initialize Monero wallet for NovaStack
# This script creates a new wallet if it doesn't exist

WALLET_DIR="/wallet"
WALLET_NAME="novastack"
WALLET_PASSWORD="novastack_wallet_password_2024"

# Create wallet directory if it doesn't exist
mkdir -p $WALLET_DIR

# Create password file
echo "$WALLET_PASSWORD" > $WALLET_DIR/password

# Check if wallet already exists
if [ ! -f "$WALLET_DIR/$WALLET_NAME" ]; then
    echo "Creating new Monero wallet..."
    
    # Create new wallet
    monero-wallet-cli \
        --daemon-address=monero:18081 \
        --trusted-daemon \
        --generate-new-wallet=$WALLET_DIR/$WALLET_NAME \
        --password-file=$WALLET_DIR/password \
        --mnemonic-language=English \
        --command="exit"
    
    echo "Wallet created successfully!"
    
    # Display wallet address
    monero-wallet-cli \
        --daemon-address=monero:18081 \
        --trusted-daemon \
        --wallet-file=$WALLET_DIR/$WALLET_NAME \
        --password-file=$WALLET_DIR/password \
        --command="address"
else
    echo "Wallet already exists at $WALLET_DIR/$WALLET_NAME"
fi

# Set proper permissions
chmod 600 $WALLET_DIR/$WALLET_NAME*
chmod 600 $WALLET_DIR/password

echo "Wallet initialization complete!"