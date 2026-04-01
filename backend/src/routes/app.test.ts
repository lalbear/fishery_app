const mockQuery = jest.fn();
const mockBuildTreeQuery = jest.fn();

jest.mock('../db', () => ({
  query: (...args: unknown[]) => mockQuery(...args),
  buildTreeQuery: (...args: unknown[]) => mockBuildTreeQuery(...args),
}));

import { marketRouter } from './market';
import { speciesRouter } from './species';

function getGetHandler(router: any, path: string) {
  const layer = router.stack.find((entry: any) => entry.route?.path === path && entry.route?.methods?.get);

  if (!layer) {
    throw new Error(`GET handler not found for ${path}`);
  }

  return layer.route.stack[0].handle;
}

describe('route wiring', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockBuildTreeQuery.mockReset();
  });

  it('registers specific species routes before the generic :id route', () => {
    const orderedPaths = speciesRouter.stack
      .filter((layer: any) => layer.route?.path)
      .map((layer: any) => layer.route.path);

    expect(orderedPaths.indexOf('/search')).toBeLessThan(orderedPaths.indexOf('/:id'));
    expect(orderedPaths.indexOf('/category/:category')).toBeLessThan(orderedPaths.indexOf('/:id'));
    expect(orderedPaths.indexOf('/:id/tree')).toBeLessThan(orderedPaths.indexOf('/:id'));
  });

  it('rejects invalid market day windows before hitting the database', async () => {
    const handler = getGetHandler(marketRouter, '/prices/species/:speciesId');
    const req = { params: { speciesId: 'species-1' }, query: { days: 'abc' } };
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
    expect(res.body).toEqual({
      success: false,
      error: 'days must be an integer between 1 and 365',
    });
    expect(mockQuery).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
