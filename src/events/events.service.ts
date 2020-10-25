import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { Event } from './events.schema'

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name)
        private eventModel: Model<Event>,
    ) {}

    async create(name: string): Promise<Event> {
        const createdEvent = new this.eventModel({ name: name });
        return createdEvent.save();
    }

    async readOne(id: string): Promise<Event> {
        return this.eventModel.findById(id).orFail().exec();
    }

    async readAll(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }

    async update(id: string, name: string): Promise<Event> {
        // https://github.com/Automattic/mongoose/issues/6161#issuecomment-368242099
        if(name == null) {
            const validationError = new Error.ValidationError(null);
            validationError.addError('docField', new Error.ValidatorError({ message: 'Empty name.' }));

            throw validationError;
        }
        return this.eventModel.findByIdAndUpdate(
            id, { name: name }, { new: true }
        ).orFail().exec();
    }

    async delete(id: string): Promise<Event> {
        return this.eventModel.findByIdAndDelete(id).orFail().exec();
    }
}
