const baseUrl = 'https://dummyjson.com/products';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('1-buscar todos os produtos', async () => {
  const mockData = { products: [{ id: 1, title: 'iPhone' }] };

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockData
  });

  const res = await fetch(`${baseUrl}`);
  const data = await res.json();

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}`);
  expect(data.products[0].title).toBe('iPhone');
});

test('2-buscar um produto pelo ID', async () => {
  const mockProduct = { id: 2, title: 'Samsung Galaxy' };

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockProduct
  });

  const res = await fetch(`${baseUrl}/2`);
  const data = await res.json();

  expect(data.id).toBe(2);
  expect(data.title).toBe('Samsung Galaxy');
});

test('3-buscar produtos por categoria', async () => {
  const mockData = { products: [{ id: 3, category: 'smartphones' }] };

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockData
  });

  const res = await fetch(`${baseUrl}/category/smartphones`);
  const data = await res.json();

  expect(data.products[0].category).toBe('smartphones');
});

test('4-lidar com erro de rede', async () => {
  (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

  await expect(fetch(`${baseUrl}/99`)).rejects.toThrow('Network Error');
});

test('5-adicionar um novo produto', async () => {
  const newProduct = { title: 'Novo Produto' };

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 100, ...newProduct })
  });

  const res = await fetch(`${baseUrl}/add`, {
    method: 'POST',
    body: JSON.stringify(newProduct),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();

  expect(data.id).toBe(100);
  expect(data.title).toBe('Novo Produto');
});

test('6-atualizar um produto', async () => {
  const updated = { title: 'Atualizado' };

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1, ...updated })
  });

  const res = await fetch(`${baseUrl}/1`, {
    method: 'PUT',
    body: JSON.stringify(updated),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();
  expect(data.title).toBe('Atualizado');
});

test('7-deletar um produto', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1, isDeleted: true })
  });

  const res = await fetch(`${baseUrl}/1`, { method: 'DELETE' });
  const data = await res.json();

  expect(data.isDeleted).toBe(true);
});

test('8-buscar produtos com limite e skip', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ products: [1, 2, 3], total: 100 })
  });

  const res = await fetch(`${baseUrl}?limit=3&skip=0`);
  const data = await res.json();

  expect(data.products.length).toBe(3);
  expect(data.total).toBe(100);
});

test('9-buscar por palavra-chave', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ products: [{ title: 'iPhone 14' }] })
  });

  const res = await fetch(`${baseUrl}/search?q=iphone`);
  const data = await res.json();

  expect(data.products[0].title.toLowerCase()).toContain('iphone');
});

test('10-falhar ao adicionar produto', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: async () => ({ message: 'Missing title' })
  });

  const res = await fetch(`${baseUrl}/add`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();

  expect(res.ok).toBe(false);
  expect(data.message).toBe('Missing title');
});
