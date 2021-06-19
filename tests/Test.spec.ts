import { mount } from '@vue/test-utils'
import Login from '../src/views/login/index.vue'

test('Login.vue', async () => {
  const wrapper = mount(Login)
  expect(wrapper.html()).toContain('Unit Test Page')
  expect(wrapper.html()).toContain('count is: 0')
  await wrapper.find('button').trigger('click')
  expect(wrapper.html()).toContain('count is: 1')
})
