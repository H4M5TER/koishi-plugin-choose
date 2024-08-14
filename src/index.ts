import { Context, z } from 'koishi'

export const name = 'choose'

export interface Config {
  delimiters: string
}

export const Config: z<Config> = z.object({
  delimiters: z.string().default('[\/,;，、；]|还是|或(?:者|是)?').description('分隔符正则表达式，请注意 split 方法会把捕获组里的内容追加到分割出的数组里，因此使用非捕获组'),
})

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('choose')
  ctx.i18n.define('zh-CN', require('../locales/zh-CN'))
  const delimiters = new RegExp(config.delimiters, 'u')
  ctx.command('choose <input:text>')
    .action(({ session }, input) => {
      const choices = input.split(delimiters).filter(Boolean).map(choice => choice.trim())
      if (!choices.length) return session.text('.no-choices')
      // logger.debug('delimiters: ', delimiters)
      // logger.debug('choices: ', choices)
      const chosen = choices[Math.floor(Math.random() * choices.length)]
      return session.text('.chosen', [chosen])
    })
}
