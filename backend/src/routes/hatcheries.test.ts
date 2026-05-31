const mockQuery = jest.fn();
const mockTransaction = jest.fn((callback) => callback({ query: mockQuery }));

jest.mock('../db', () => ({
  query: (...args: unknown[]) => mockQuery(...args),
  transaction: (callback: any) => mockTransaction(callback),
}));

import { hatcheriesRouter } from './hatcheries';

function getHandler(router: any, path: string, method: 'get' | 'post' | 'patch') {
  const layer = router.stack.find((entry: any) => {
    return entry.route?.path === path && entry.route?.methods?.[method];
  });

  if (!layer) {
    throw new Error(`${method.toUpperCase()} handler not found for ${path}`);
  }

  // Return the main handler (the last layer in the route stack)
  return layer.route.stack[layer.route.stack.length - 1].handle;
}

describe('Hatcheries Router Enhancements', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockTransaction.mockClear();
  });

  describe('GET /lookup-farmer', () => {
    it('returns 400 if uid query parameter is missing', async () => {
      const handler = getHandler(hatcheriesRouter, '/lookup-farmer', 'get');
      const req = { query: {} };
      const res = {
        statusCode: 200,
        body: undefined as any,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: unknown) {
          this.body = payload;
          return this;
        },
      };
      const next = jest.fn();

      await handler(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ success: false, error: 'UID is required' });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('returns 404 if farmer is not found with given UID', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });

      const handler = getHandler(hatcheriesRouter, '/lookup-farmer', 'get');
      const req = { query: { uid: 'FM-PAT-9999' } };
      const res = {
        statusCode: 200,
        body: undefined as any,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: unknown) {
          this.body = payload;
          return this;
        },
      };
      const next = jest.fn();

      await handler(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ success: false, error: 'Farmer not found with the given UID.' });
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('returns 400 if district is provided but does not match farmer district', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'user-1', name: 'Ramesh', phone_number: '+919999999999', district_code: 'patna', district_name: 'Patna' }],
        rowCount: 1,
      });

      const handler = getHandler(hatcheriesRouter, '/lookup-farmer', 'get');
      const req = { query: { uid: 'FM-PAT-1111', district: 'Gaya' } };
      const res = {
        statusCode: 200,
        body: undefined as any,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: unknown) {
          this.body = payload;
          return this;
        },
      };
      const next = jest.fn();

      await handler(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Farmer district mismatch');
    });

    it('returns 200 with farmer details if matching UID and district', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'user-1', name: 'Ramesh', phone: '+919999999999', districtCode: 'patna', districtName: 'Patna' }],
        rowCount: 1,
      });

      const handler = getHandler(hatcheriesRouter, '/lookup-farmer', 'get');
      const req = { query: { uid: 'FM-PAT-1111', district: 'Patna' } };
      const res = {
        statusCode: 200,
        body: undefined as any,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: unknown) {
          this.body = payload;
          return this;
        },
      };
      const next = jest.fn();

      await handler(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Ramesh');
    });
  });

  describe('POST /batches/:batchId/sales', () => {
    it('automatically calculates price per piece for per_piece model', async () => {
      // 1. mock batch check query
      mockQuery.mockResolvedValueOnce({
        rows: [{ current_stage: 'fingerling_ready', species_name: 'Rohu', species_variant: null, operator_id: 'op-1' }],
        rowCount: 1,
      });
      // 2. mock farmer UID lookup (optional, not provided in body)
      // 3. mock sale insert query
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'sale-1', transaction_ref: 'TXN123' }],
        rowCount: 1,
      });

      const handler = getHandler(hatcheriesRouter, '/batches/:batchId/sales', 'post');
      const req = {
        params: { batchId: 'batch-1' },
        auth: { userId: 'op-1' },
        body: {
          pricing_model: 'per_piece',
          buyer_name: 'Sohan',
          buyer_phone: '9876543210',
          buyer_district: 'Patna',
          quantity_pieces: 10000,
          total_amount: 25000,
        },
      };
      const res = {
        statusCode: 200,
        body: undefined as any,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: unknown) {
          this.body = payload;
          return this;
        },
      };
      const next = jest.fn();

      await handler(req, res, next);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.transaction_ref).toBe('TXN123');

      // Verify the insert parameters had calculated price_per_piece = 2.50
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall[0]).toContain('INSERT INTO fingerling_sales');
      const params = insertCall[1];
      const quantityPieces = params[5];
      const quantityKg = params[6];
      const pricePerPiece = params[8];
      const pricePerKg = params[9];

      expect(quantityPieces).toBe(10000);
      expect(quantityKg).toBeNull();
      expect(pricePerPiece).toBe(2.50);
      expect(pricePerKg).toBeNull();
    });

    it('automatically calculates pieces and unit price for per_kg model based on average weight', async () => {
      // 1. mock batch check query
      mockQuery.mockResolvedValueOnce({
        rows: [{ current_stage: 'fingerling_ready', species_name: 'Rohu', species_variant: null, operator_id: 'op-1' }],
        rowCount: 1,
      });
      // 2. mock sale insert query
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'sale-2', transaction_ref: 'TXN456' }],
        rowCount: 1,
      });

      const handler = getHandler(hatcheriesRouter, '/batches/:batchId/sales', 'post');
      const req = {
        params: { batchId: 'batch-2' },
        auth: { userId: 'op-1' },
        body: {
          pricing_model: 'per_kg',
          buyer_name: 'Madan',
          buyer_phone: '9876543211',
          buyer_district: 'Gaya',
          quantity_kg: 50,
          avg_weight_g: 10,
          total_amount: 15000,
        },
      };
      const res = {
        statusCode: 200,
        body: undefined as any,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: unknown) {
          this.body = payload;
          return this;
        },
      };
      const next = jest.fn();

      await handler(req, res, next);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);

      // Verify calculation details:
      // quantity_pieces = (50kg * 1000g/kg) / 10g/piece = 5000 pieces
      // price_per_kg = 15000 / 50 = 300
      // price_per_piece = 15000 / 5000 = 3.00
      const insertCall = mockQuery.mock.calls[1];
      const params = insertCall[1];
      const quantityPieces = params[5];
      const quantityKg = params[6];
      const pricePerPiece = params[8];
      const pricePerKg = params[9];

      expect(quantityPieces).toBe(5000);
      expect(quantityKg).toBe(50);
      expect(pricePerPiece).toBe(3);
      expect(pricePerKg).toBe(300);
    });
  });
});
