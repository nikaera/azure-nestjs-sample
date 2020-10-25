import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Error } from 'mongoose';

@Catch(Error)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    switch(exception.name) {
      case Error.ValidationError.name:
      case Error.CastError.name:
        response.status(HttpStatus.BAD_REQUEST).json({});
        break;
      case Error.DocumentNotFoundError.name:
        response.status(HttpStatus.NOT_FOUND).json({});
        break;
    }
  }
}