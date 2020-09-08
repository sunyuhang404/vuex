
/**
 * 提供 store 在 Vue 实例上的装载注入
 */

export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  // 如果是 2.0 的, 通过 mixin 把 store 混入到 beforeCreate 里面
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // 1.x 版本的注入方式
    // 替换 Vue 对象原型的 _init 方法
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * 初始化 vue 跟组件的时候 把传入的 store 设置到 this 的 $store属性上
   * 子组件从父组件引用 $store 属性, 层层嵌套设置
   */
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
