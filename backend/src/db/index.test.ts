import type { PoolClient } from 'pg';
import { pool, transaction } from './index';

describe('transaction', () => {
  it('passes the checked-out client to the callback and commits on success', async () => {
    const client = {
      query: jest.fn(),
      release: jest.fn(),
    } as unknown as PoolClient;

    const connectSpy = jest.spyOn(pool, 'connect').mockResolvedValue(client);

    const callback = jest.fn(async (receivedClient: PoolClient) => {
      expect(receivedClient).toBe(client);
      await receivedClient.query('SELECT 1');
      return 'ok';
    });

    await expect(transaction(callback)).resolves.toBe('ok');
    expect(client.query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(client.query).toHaveBeenNthCalledWith(2, 'SELECT 1');
    expect(client.query).toHaveBeenNthCalledWith(3, 'COMMIT');
    expect(client.release).toHaveBeenCalledTimes(1);

    connectSpy.mockRestore();
  });

  it('rolls back and releases the client when the callback throws', async () => {
    const client = {
      query: jest.fn(),
      release: jest.fn(),
    } as unknown as PoolClient;

    const connectSpy = jest.spyOn(pool, 'connect').mockResolvedValue(client);

    await expect(transaction(async () => {
      throw new Error('boom');
    })).rejects.toThrow('boom');

    expect(client.query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(client.query).toHaveBeenNthCalledWith(2, 'ROLLBACK');
    expect(client.release).toHaveBeenCalledTimes(1);

    connectSpy.mockRestore();
  });
});
