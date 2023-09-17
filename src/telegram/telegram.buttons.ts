import { Markup } from 'telegraf';

export function actionButtons() {
  //   return Markup.inlineKeyboard(
  //     [
  //       Markup.button.callback('📝 Выучить новое слово', 'newWord'),
  //       Markup.button.callback('📖 Показать список выученных слов', 'list'),
  //     ],
  //     {
  //       columns: 2,
  //     },
  //   );
  return Markup.keyboard(
    [
      Markup.button.callback('📝 Выучить новое слово', 'newWord'),
      Markup.button.callback('📖 Показать список выученных слов', 'list'),
    ],
    {
      columns: 1,
    },
  ).resize();
}

export function actionButtons2() {
  //   return Markup.inlineKeyboard(
  //     [
  //       Markup.button.callback('📝 Выучить новое слово', 'newWord'),
  //       Markup.button.callback('📖 Показать список выученных слов', 'list'),
  //     ],
  //     {
  //       columns: 2,
  //     },
  //   );
  return Markup.keyboard(
    [
      Markup.button.callback('📝 Учить', 'newWord'),
      Markup.button.callback('✅ Я знаю это слово', 'list'),
    ],
    {
      columns: 1,
    },
  ).resize();
}
