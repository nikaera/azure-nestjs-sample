import { Param, Body, Controller, Get, Post, Patch, Delete, UseFilters } from '@nestjs/common';
import { EventsService } from './events.service'
import { Event } from './events.schema'
import {
    CreateEventDto,
    UpdateEventDto
} from './events.dto'
import { MongooseExceptionFilter } from '../mongoose.exception.filter';

@Controller('events')
@UseFilters(MongooseExceptionFilter)
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    async create(@Body() request: CreateEventDto): Promise<Event> {
        return this.eventsService.create(request.name)
    }

    @Get(':id')
    async readOne(@Param('id') id: string): Promise<Event> {
        return this.eventsService.readOne(id)
    }

    @Get()
    async readAll(): Promise<Event[]> {
        return this.eventsService.readAll()
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() request: UpdateEventDto): Promise<Event> {
        return this.eventsService.update(id, request.name)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Event> {
        return this.eventsService.delete(id)
    }
}
