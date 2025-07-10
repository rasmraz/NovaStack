import axios from 'axios';
import { logger } from '../utils/logger';

interface MoneroWalletConfig {
  rpcUrl: string;
  username: string;
  password: string;
}

interface MoneroBalance {
  balance: number;
  unlockedBalance: number;
}

interface MoneroAddress {
  address: string;
  addressIndex: number;
}

interface MoneroTransfer {
  amount: number;
  address: string;
  paymentId?: string;
  priority?: number;
  mixin?: number;
}

interface MoneroTransferResult {
  txHash: string;
  txKey: string;
  amount: number;
  fee: number;
}

export class MoneroWalletService {
  private config: MoneroWalletConfig;
  private rpcId: number = 0;

  constructor(config: MoneroWalletConfig) {
    this.config = config;
  }

  private async makeRpcCall(method: string, params: any = {}): Promise<any> {
    try {
      const response = await axios.post(this.config.rpcUrl + '/json_rpc', {
        jsonrpc: '2.0',
        id: ++this.rpcId,
        method,
        params
      }, {
        auth: {
          username: this.config.username,
          password: this.config.password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.error) {
        throw new Error(`Monero RPC Error: ${response.data.error.message}`);
      }

      return response.data.result;
    } catch (error) {
      logger.error('Monero RPC call failed:', error);
      throw error;
    }
  }

  async getBalance(): Promise<MoneroBalance> {
    const result = await this.makeRpcCall('get_balance');
    return {
      balance: result.balance / 1e12, // Convert from atomic units to XMR
      unlockedBalance: result.unlocked_balance / 1e12
    };
  }

  async getAddress(accountIndex: number = 0, addressIndex: number = 0): Promise<MoneroAddress> {
    const result = await this.makeRpcCall('get_address', {
      account_index: accountIndex,
      address_index: [addressIndex]
    });
    
    return {
      address: result.address,
      addressIndex: result.addresses[0].address_index
    };
  }

  async createAddress(accountIndex: number = 0, label?: string): Promise<MoneroAddress> {
    const result = await this.makeRpcCall('create_address', {
      account_index: accountIndex,
      label
    });
    
    return {
      address: result.address,
      addressIndex: result.address_index
    };
  }

  async transfer(transfers: MoneroTransfer[]): Promise<MoneroTransferResult> {
    const destinations = transfers.map(transfer => ({
      amount: Math.floor(transfer.amount * 1e12), // Convert XMR to atomic units
      address: transfer.address
    }));

    const params: any = {
      destinations,
      priority: transfers[0]?.priority || 1,
      mixin: transfers[0]?.mixin || 10,
      get_tx_key: true,
      get_tx_hex: true
    };

    if (transfers[0]?.paymentId) {
      params.payment_id = transfers[0].paymentId;
    }

    const result = await this.makeRpcCall('transfer', params);
    
    return {
      txHash: result.tx_hash,
      txKey: result.tx_key,
      amount: result.amount / 1e12,
      fee: result.fee / 1e12
    };
  }

  async getTransfers(
    in_transfers: boolean = true,
    out_transfers: boolean = true,
    pending: boolean = true,
    failed: boolean = false,
    pool: boolean = true
  ): Promise<any[]> {
    const result = await this.makeRpcCall('get_transfers', {
      in: in_transfers,
      out: out_transfers,
      pending,
      failed,
      pool
    });

    const transfers = [];
    
    if (result.in) transfers.push(...result.in);
    if (result.out) transfers.push(...result.out);
    if (result.pending) transfers.push(...result.pending);
    if (result.failed) transfers.push(...result.failed);
    if (result.pool) transfers.push(...result.pool);

    return transfers.map(transfer => ({
      ...transfer,
      amount: transfer.amount / 1e12,
      fee: transfer.fee ? transfer.fee / 1e12 : 0
    }));
  }

  async getTransferByTxId(txId: string): Promise<any> {
    const result = await this.makeRpcCall('get_transfer_by_txid', {
      txid: txId
    });

    return {
      ...result.transfer,
      amount: result.transfer.amount / 1e12,
      fee: result.transfer.fee ? result.transfer.fee / 1e12 : 0
    };
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      const result = await this.makeRpcCall('validate_address', {
        address
      });
      return result.valid;
    } catch (error) {
      return false;
    }
  }

  async getHeight(): Promise<number> {
    const result = await this.makeRpcCall('get_height');
    return result.height;
  }

  async rescanBlockchain(): Promise<void> {
    await this.makeRpcCall('rescan_blockchain');
  }

  async refresh(): Promise<number> {
    const result = await this.makeRpcCall('refresh');
    return result.blocks_fetched;
  }

  async stop(): Promise<void> {
    await this.makeRpcCall('stop_wallet');
  }

  // Utility methods for NovaStack specific operations
  async createUserWallet(userId: string): Promise<MoneroAddress> {
    return this.createAddress(0, `user_${userId}`);
  }

  async processInvestment(
    fromAddress: string,
    toAddress: string,
    amount: number,
    startupId: string
  ): Promise<MoneroTransferResult> {
    // Validate addresses
    const isFromValid = await this.validateAddress(fromAddress);
    const isToValid = await this.validateAddress(toAddress);

    if (!isFromValid || !isToValid) {
      throw new Error('Invalid Monero address provided');
    }

    // Create transfer with payment ID for tracking
    const paymentId = this.generatePaymentId(startupId);
    
    return this.transfer([{
      address: toAddress,
      amount,
      paymentId
    }]);
  }

  private generatePaymentId(startupId: string): string {
    // Generate a 16-character hex payment ID based on startup ID
    const hash = require('crypto').createHash('sha256').update(startupId).digest('hex');
    return hash.substring(0, 16);
  }

  async getInvestmentHistory(startupId: string): Promise<any[]> {
    const paymentId = this.generatePaymentId(startupId);
    const transfers = await this.getTransfers();
    
    return transfers.filter(transfer => 
      transfer.payment_id === paymentId
    );
  }
}

// Singleton instance
let moneroWallet: MoneroWalletService | null = null;

export function getMoneroWallet(): MoneroWalletService {
  if (!moneroWallet) {
    const config: MoneroWalletConfig = {
      rpcUrl: process.env.MONERO_WALLET_RPC_URL || 'http://localhost:18083',
      username: process.env.MONERO_WALLET_USER || 'novastack',
      password: process.env.MONERO_WALLET_PASSWORD || 'wallet_password'
    };
    
    moneroWallet = new MoneroWalletService(config);
  }
  
  return moneroWallet;
}

export default MoneroWalletService;