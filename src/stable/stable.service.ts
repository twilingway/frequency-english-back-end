import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, map, of, firstValueFrom } from 'rxjs';
import * as fs from 'fs';

interface ITxt2imgParameters {
  enable_hr: false;
  denoising_strength: 0;
  firstphase_width: 0;
  firstphase_height: 0;
  hr_scale: 2;
  hr_upscaler: null;
  hr_second_pass_steps: 0;
  hr_resize_x: 0;
  hr_resize_y: 0;
  hr_sampler_name: null;
  hr_prompt: '';
  hr_negative_prompt: '';
  prompt: 'maltese puppy';
  styles: null;
  seed: -1;
  subseed: -1;
  subseed_strength: 0;
  seed_resize_from_h: -1;
  seed_resize_from_w: -1;
  sampler_name: null;
  batch_size: 1;
  n_iter: 1;
  steps: 20;
  cfg_scale: 7;
  width: 512;
  height: 512;
  restore_faces: false;
  tiling: false;
  do_not_save_samples: false;
  do_not_save_grid: false;
  negative_prompt: null;
  eta: null;
  s_min_uncond: 0;
  s_churn: 0;
  s_tmax: null;
  s_tmin: 0;
  s_noise: 1;
  override_settings: null;
  override_settings_restore_afterwards: true;
  script_args: [];
  sampler_index: 'Euler';
  script_name: null;
  send_images: true;
  save_images: false;
  alwayson_scripts: any;
}

interface StableTxt2imgAnswer {
  images: string[];
  // parameters: ITxt2imgParameters;
  info: string;
}

@Injectable()
export class StableService {
  private readonly logger = new Logger(StableService.name);
  private stableUrl;
  // private apiKey;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // this.stableUrl = process.env.STABLE_API_URL;
    this.stableUrl = this.configService.get('STABLE_API_URL');
    // (this.apiKey = this.configService.get('YANDEX_API_SPEECH'));
  }

  async txt2img(prompt: string): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      // Authorization: `Api-Key ${this.apiKey}`,
    };
    const payload = {
      prompt: prompt,
      steps: 20,
      width: 512,
      height: 768,
      cfg_scale: 7,
      sampler_index: 'Euler a',
    };
    console.log('txt2img :>> ');
    console.log('this.stableUrl :>>', this.stableUrl + '/sdapi/v1/txt2img');
    const res = await firstValueFrom(
      this.httpService
        .post<StableTxt2imgAnswer>(
          this.stableUrl + '/sdapi/v1/txt2img',
          payload,
          {
            headers,
            // responseType: 'stream',
          },
        )
        .pipe(
          map(({ data }) => {
            console.log('data.images :>> ', data.images);
            return data.images[0];
            // const stream = data.data;
            // stream.on('data', (data) => {
            //   console.log(data);
            //   fs.promises.writeFile(
            //     __dirname + '/src/translations/' + '/You.mp3',
            //     data,
            //     {
            //       encoding: 'binary',
            //     },
            //   );
            // });

            // stream.on('end', () => {
            //   console.log('stream done');
            // });
            // return stream;
          }),
          catchError((err) => {
            this.logger.error(err);
            return of('Произошла ошибка');
          }),
        ),
    );
    console.log('imageData :>> ', res);
    return res;
  }
}
