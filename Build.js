const Build = class{

    /**
     * Функция пытается загрузить файл(скрипт или стили)
     * Отдает промис с результатом загрузка успешна или нет
     * @param {string} src
     * @returns {Promise}
     */
    static async loadFile(src){
        if(typeof(src) !== 'string'){
            console.error('Build.loadFile(src: string) --- src not type string')
            return new PromiseRejectionEvent()
        }
        let type = null
        if(src.endsWith('.js')) type = 'script'
        if(src.endsWith('.css')) type = 'link'
        if(!type){
            console.log('Build.loadFile: not correct type file')
            return new PromiseRejectionEvent()
        }
        return new Promise((res, rej) => {
            const element = document.createElement(type)
            element.onload = res
            element.onerror = rej
            switch(type){
                case 'script':
                    element.src = src
                    break
                case 'link':
                    element.href = src
                    element.rel = 'stylesheet'
                    break
            }
            document.head.appendChild(element)
        })
    }

    /**
     * Загрузчик конфигурации из файла
     * @param {string} configFile 
     */
    static async start(configFile){
        //Пытается загрузить файл конфигурации
        try{
            await Build.loadFile(configFile)
        }catch(e){
            console.error('Build.start: Not Found Config File ' + configFile)
            return
        }
        //Пытается получить конфигурацию
        if(!Array.isArray(Build.config)){
            console.error('Build.start: Not Found Build.config')
            return
        }

        const listFile = []

        Build.config.forEach(arr => {
            if(!Array.isArray(arr)) return
            if(arr.length < 2) return
            let [tmpls, ...list] = arr
            tmpls = tmpls.split('|')
            list.forEach(name => {
                tmpls.forEach(tmpl => {
                    listFile.push(tmpl.replace(/\$/g, name))
                })
            })
        })

        for(let i = 0; i < listFile.length; i++){
            const src = listFile[i]
            try{
                await Build.loadFile(src)
            }catch(e){
                console.log('Build: Not Found File ' + src)
                return
            }
        }

    }

}

