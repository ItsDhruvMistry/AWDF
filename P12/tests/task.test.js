const request = require('supertest');
const app = require('../app');

describe('Task Management API - CI/CD Automated Test Suite', () => {

  test('GET /tasks returns status code 200 and list of tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('POST /tasks creates a new task and returns status code 201', async () => {
    const newTask = { title: 'Implement Automated Unit Tests' };
    const res = await request(app)
      .post('/tasks')
      .send(newTask);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newTask.title);
    expect(res.body.completed).toBe(false);
  });

  test('POST /tasks without title returns status code 400 Bad Request', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Title is required');
  });

  test('GET /tasks/999 returns status code 404 for nonexistent task', async () => {
    const res = await request(app).get('/tasks/999');
    expect(res.statusCode).toBe(404);
  });
});
