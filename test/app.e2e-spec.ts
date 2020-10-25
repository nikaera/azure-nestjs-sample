import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from '../src/events/events.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { CreateEventDto, UpdateEventDto } from '../src/events/events.dto';
import { Event } from '../src/events/events.schema'

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        EventsModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const getEventAll = async (): Promise<Array<Event>> => {
    const res = await request(app.getHttpServer()).get('/events');
    expect(res.status).toEqual(200);

    return res.body as Array<Event>;
  }

  describe('EventsController (e2e)', () => {
    describe('Create API of Event', () => {
      it('OK /events (POST)', async () => {
        const body: CreateEventDto = {
          name: "test-event"
        }
        const res = await request(app.getHttpServer())
          .post('/events')
          .set('Accept', 'application/json')
          .send(body);
        expect(res.status).toEqual(201);

        const eventResponse = res.body as Event;
        expect(eventResponse).toHaveProperty('_id');
        expect(eventResponse.name).toEqual(body.name);
      });

      it('NG /events (POST): Incorrect parameters', async () => {
        const body = {
          namee: "test-event"
        }
        const res = await request(app.getHttpServer())
          .post('/events')
          .set('Accept', 'application/json')
          .send(body);
        expect(res.status).toEqual(400);
      });

      it('NG /events (POST): Empty parameters.', async () => {
        const body = {}
        const res = await request(app.getHttpServer())
          .post('/events')
          .set('Accept', 'application/json')
          .send(body);
        expect(res.status).toEqual(400);
      });
    });

    describe('Read API of Event', () => {
      it('OK /events (GET)', async () => {
        const eventsResponse = await getEventAll();
        expect(eventsResponse.length).toEqual(1);
      });

      it('OK /events/:id (GET)', async () => {
        const eventsResponse = await getEventAll();

        const res = await request(app.getHttpServer())
          .get(`/events/${eventsResponse[0]._id}`);
        expect(res.status).toEqual(200);

        const eventResponse = res.body as Event;
        expect(eventResponse).toHaveProperty('_id');
        expect(eventResponse.name).toEqual('test-event');
      });

      it('NG /events/:id (GET): Invalid id.', async () => {
        const res = await request(app.getHttpServer())
          .get('/events/XXXXXXXXXXX');
        expect(res.status).toEqual(400);
      });

      it('NG /events/:id (GET): id that doesn\'t exist.', async () => {
        const res = await request(app.getHttpServer())
          .get('/events/5349b4ddd2781d08c09890f4');
        expect(res.status).toEqual(404);
      });
    });

      describe('Update API of Event', () => {
        it('OK /events/:id (PATCH)', async () => {
          const eventsResponse = await getEventAll();

          const body: UpdateEventDto = {
            name: "new-test-event"
          }
          const res = await request(app.getHttpServer())
            .patch(`/events/${eventsResponse[0]._id}`)
            .set('Accept', 'application/json')
            .send(body);
          expect(res.status).toEqual(200);

          const eventResponse = res.body as Event;
          expect(eventResponse).toHaveProperty('_id');
          expect(eventResponse.name).toEqual(body.name);
        });

        it('NG /events/:id (PATCH): Incorrect parameters', async () => {
          const eventsResponse = await getEventAll();

          const body = {
            namee: "new-test-event"
          }
          const res = await request(app.getHttpServer())
            .patch(`/events/${eventsResponse[0]._id}`)
            .set('Accept', 'application/json')
            .send(body);
          expect(res.status).toEqual(400);
        });

        it('NG /events/:id (PATCH): Empty parameters.', async () => {
          const eventsResponse = await getEventAll();

          const body = {}
          const res = await request(app.getHttpServer())
            .patch(`/events/${eventsResponse[0]._id}`)
            .set('Accept', 'application/json')
            .send(body);
          expect(res.status).toEqual(400);
        });

        it('NG /events/:id (PATCH): Empty id.', async () => {
          const body = {
            namee: "new-test-event"
          }
          const res = await request(app.getHttpServer())
            .patch('/events')
            .set('Accept', 'application/json')
            .send(body);
          expect(res.status).toEqual(404);
        });

        it('NG /events/:id (PATCH): Invalid id.', async () => {
          const body: UpdateEventDto = {
            name: "new-test-event"
          }
          const res = await request(app.getHttpServer())
            .patch('/events/XXXXXXXXXXX')
            .set('Accept', 'application/json')
            .send(body);
          expect(res.status).toEqual(400);
        });

        it('NG /events/:id (PATCH): id that doesn\'t exist.', async () => {
          const body: UpdateEventDto = {
            name: "new-test-event"
          }
          const res = await request(app.getHttpServer())
            .patch('/events/5349b4ddd2781d08c09890f4')
            .set('Accept', 'application/json')
            .send(body);
          expect(res.status).toEqual(404);
        });
      });

      describe('Delete API of Event', () => {
        it('OK /events/:id (DELETE)', async () => {
          const eventsResponse = await getEventAll();

          const res = await request(app.getHttpServer())
            .delete(`/events/${eventsResponse[0]._id}`);
          expect(res.status).toEqual(200);
        });

        it('NG /events/:id (DELETE): Empty id.', async () => {
          const res = await request(app.getHttpServer())
            .delete('/events')
          expect(res.status).toEqual(404);
        });

        it('NG /events/:id (DELETE): Invalid id.', async () => {
          const res = await request(app.getHttpServer())
            .delete('/events/XXXXXXXXXXX')
          expect(res.status).toEqual(400);
        });

        it('NG /events/:id (DELETE): id that doesn\'t exist.', async () => {
          const res = await request(app.getHttpServer())
            .delete('/events/5349b4ddd2781d08c09890f4');
          expect(res.status).toEqual(404);
        });
      });
  })

  afterEach(async () => {
    await app.close();
  });
});
