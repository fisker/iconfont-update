import Iconfont from './lib/iconfont.js'
import signale from './lib/signale.js'

export default async function download(config) {
  const iconfont = new Iconfont(config)

  let project = await iconfont.info()

  if (!project) {
    signale.fatal(new Error(`access project ${config.project} denied.`))
  }

  if (project.project.font_is_old) {
    await iconfont.update()
  }

  await iconfont.download()
}
