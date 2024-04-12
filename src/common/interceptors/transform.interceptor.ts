import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        author: 'Được tạo bởi MielCoder - Phạm Duy Khánh',
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: '',
        data: data,
      })),
    );
  }
}
