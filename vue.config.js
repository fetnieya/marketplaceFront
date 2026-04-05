const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
    transpileDependencies: ['swiper', 'vue-router'],
    chainWebpack: config => {
        // Configurer pour accepter les fichiers .mjs sans extension explicite
        config.resolve.extensions.add('.mjs')
        config.resolve.set('fullySpecified', false)
        
        // Ajouter les alias pour résoudre les modules core-js v2 vers v3
        config.resolve.alias
            .set('core-js/modules/es6.regexp.split', 'core-js/es/regexp/split')
            .set('core-js/modules/es6.regexp.match', 'core-js/es/regexp/match')
            .set('core-js/modules/es6.regexp.replace', 'core-js/es/regexp/replace')
            .set('core-js/modules/es6.regexp.to-string', 'core-js/es/regexp/to-string')
            .set('core-js/modules/es6.regexp.constructor', 'core-js/es/regexp/constructor')
            .set('core-js/modules/es6.regexp.search', 'core-js/es/regexp/search')
            .set('core-js/modules/es7.array.includes', 'core-js/es/array/includes')
            .set('core-js/modules/es6.string.includes', 'core-js/es/string/includes')
            .set('core-js/modules/es6.string.starts-with', 'core-js/es/string/starts-with')
            .set('core-js/modules/es6.string.ends-with', 'core-js/es/string/ends-with')
            .set('core-js/modules/es6.string.iterator', 'core-js/es/string/iterator')
            .set('core-js/modules/es6.object.keys', 'core-js/es/object/keys')
            .set('core-js/modules/es6.array.find', 'core-js/es/array/find')
            .set('core-js/modules/es6.array.find-index', 'core-js/es/array/find-index')
            .set('core-js/modules/es6.array.from', 'core-js/es/array/from')
            .set('core-js/modules/es6.map', 'core-js/es/map')
            .set('core-js/modules/es6.set', 'core-js/es/set')
            .set('core-js/modules/es6.symbol', 'core-js/es/symbol')
            .set('core-js/modules/es7.symbol.async-iterator', 'core-js/es/symbol/async-iterator')
            .set('core-js/modules/web.dom.iterable', 'core-js/web/dom-collections/iterator')
    },
    configureWebpack: config => {
        // Désactiver fullySpecified pour permettre les imports sans extension
        if (!config.resolve) {
            config.resolve = {}
        }
        config.resolve.fullySpecified = false
        
        // Ajouter les alias dans configureWebpack aussi pour une meilleure compatibilité
        if (!config.resolve.alias) {
            config.resolve.alias = {}
        }
        Object.assign(config.resolve.alias, {
            'core-js/modules/es6.regexp.split': 'core-js/es/regexp/split',
            'core-js/modules/es6.regexp.match': 'core-js/es/regexp/match',
            'core-js/modules/es6.regexp.replace': 'core-js/es/regexp/replace',
            'core-js/modules/es6.regexp.to-string': 'core-js/es/regexp/to-string',
            'core-js/modules/es6.regexp.constructor': 'core-js/es/regexp/constructor',
            'core-js/modules/es6.regexp.search': 'core-js/es/regexp/search',
            'core-js/modules/es7.array.includes': 'core-js/es/array/includes',
            'core-js/modules/es6.string.includes': 'core-js/es/string/includes',
            'core-js/modules/es6.string.starts-with': 'core-js/es/string/starts-with',
            'core-js/modules/es6.string.ends-with': 'core-js/es/string/ends-with',
            'core-js/modules/es6.string.iterator': 'core-js/es/string/iterator',
            'core-js/modules/es6.object.keys': 'core-js/es/object/keys',
            'core-js/modules/es6.array.find': 'core-js/es/array/find',
            'core-js/modules/es6.array.find-index': 'core-js/es/array/find-index',
            'core-js/modules/es6.array.from': 'core-js/es/array/from',
            'core-js/modules/es6.map': 'core-js/es/map',
            'core-js/modules/es6.set': 'core-js/es/set',
            'core-js/modules/es6.symbol': 'core-js/es/symbol',
            'core-js/modules/es7.symbol.async-iterator': 'core-js/es/symbol/async-iterator',
            'core-js/modules/web.dom.iterable': 'core-js/web/dom-collections/iterator'
        })
    }
})