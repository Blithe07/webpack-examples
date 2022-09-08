import './index.less'
import('./common')
const node = document.createElement('span')
node.textContent = 'hello world'
node.style.color = '#fff'

// 异步导入，多数情况下我们没必要为小模块使用动态加载能力，会增大文件体积
// 常见的用法是配合 SPA 的前端路由能力实现页面级别的动态加载(前端路由懒加载)
node.addEventListener('click', async () => {
    const method = await import('./click-message')
    method.alterMsg('异步')
})
document.body.appendChild(node)