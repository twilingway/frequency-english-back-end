import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, map, of } from 'rxjs';
import axios, { isCancel, AxiosError } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { error } from 'console';

interface YandexAnswer {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}

@Injectable()
export class YandexService {
  private readonly logger = new Logger(YandexService.name);
  private yandexUrl;
  private apiKey;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    (this.yandexUrl = this.configService.get('YANDEX_API_SPEECH_URL')),
      (this.apiKey = this.configService.get('YANDEX_API_SPEECH'));
  }

  generateResponse(content: string): Observable<string> {
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Api-Key ${this.apiKey}`,
    };
    const data2 = {
      text: content,
      lang: 'en-US',
      voice: 'john',
      speed: '0.8',
      format: 'mp3',
      folderId: this.configService.get('YANDEX_API_SPEECH_FOLDER_ID'),
      sampleRateHertz: '48000',
    };

    console.log('yandex data :>> ', data2);
    axios
      .post(this.yandexUrl, data2, {
        headers,
        responseType: 'stream',
      })
      .then(({ data }) => {
        console.log('res >> ', data);
        const stream = data;
        stream.on('data', (data) => {
          console.log(data);
          const p = path.resolve(__dirname, 'src');
          console.log(' __dirname :>> ', p);
          fs.promises.writeFile(
            path.resolve(
              __dirname,
              '..',
              'src',
              'translations',
              `/${content}.mp3`,
            ),
            data,
            {
              encoding: 'binary',
            },
          );
        });

        stream.on('end', () => {
          console.log('stream done');
        });
        return stream;
      })
      .catch((error) => console.log('error >> ', error));

    return this.httpService
      .post(this.yandexUrl, data2, {
        headers,
        responseType: 'stream',
      })
      .pipe(
        map(({ data }) => {
          // console.log('yandex :>> ', data);
          const stream = data.data;
          stream.on('data', (data) => {
            console.log(data);
            fs.promises.writeFile(
              __dirname + '/src/translations/' + `/${content}.mp3`,
              data,
              {
                encoding: 'binary',
              },
            );
          });

          stream.on('end', () => {
            console.log('stream done');
          });
          return stream;
        }),
        catchError((err) => {
          this.logger.error(err);
          // throw new ForbiddenException('API not available');
          return of('Произошла ошибка');
        }),
      );
  }
}
