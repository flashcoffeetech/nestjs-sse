import { HttpService } from '@nestjs/axios';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { interval, Observable, map, from, lastValueFrom, of } from 'rxjs';
import { PrismaService } from './prisma.service';
import { Todo } from '@prisma/client';

export interface MessageEvent {
  data: string | object | Todo;
}

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private prisma: PrismaService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  sendEvent(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((num: number) => {
        return { data: `hello ${num}` };
      }),
    );
  }

  getWeather() {
    return this.httpService
      .get(
        'https://api.openweathermap.org/data/2.5/weather?q=cairo&appid=c9661625b3eb09eed099288fbfad560a',
      )
      .pipe(
        map((response) => {
          console.log('Weather', response.data);
          return { data: response.data };
        }),
      );
  }

  getTodo(id: number): Observable<MessageEvent> {
    const todoObj = this.prisma.todo.findFirst({
      where: {
        id,
      },
    });
    return from(todoObj).pipe(
      map((todo) => {
        console.log('Todo', todo);
        return { data: todo, retry: 10000 };
      }),
    );
  }
}
