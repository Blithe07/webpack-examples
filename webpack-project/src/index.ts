import './index.less'
import { cloneDeep } from 'lodash'
import { alterMsg } from './click-message'
import('./common')
const node = document.createElement('span')
node.textContent = 'hello world'
node.style.color = '#fff'
// 同步导入
node.addEventListener('click', () => {
    alterMsg('同步')
})
document.body.appendChild(node)
const obj1 = { a: '1', b: '2' }
const obj2 = cloneDeep(obj1)
console.log(obj2);
