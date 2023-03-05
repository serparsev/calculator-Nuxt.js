import { shallowMount } from '@vue/test-utils'
import Calculator from '@/components/calculator/Index.vue'

describe('Calculator component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Calculator)
  })

  it('Display is 0 at start', () => {
    const display = wrapper.get('#display')

    expect(display.element.value).toEqual('0')
    expect(wrapper.vm.display).toBe('0')
  })

  it('The Keyboard has all the keys', () => {
    const keyboard = [
      [
        { id: 'clear', value: 'AC', type: 'clear' },
        { id: 'back', value: '<--', type: 'back' }
      ],
      [
        { id: '7', value: '7', type: 'number' },
        { id: '8', value: '8', type: 'number' },
        { id: '9', value: '9', type: 'number' },
        { id: 'add', value: '+', type: 'operation' }
      ],
      [
        { id: '4', value: '4', type: 'number' },
        { id: '5', value: '5', type: 'number' },
        { id: '6', value: '6', type: 'number' },
        { id: 'sub', value: '-', type: 'operation' }
      ],
      [
        { id: '1', value: '1', type: 'number' },
        { id: '2', value: '2', type: 'number' },
        { id: '3', value: '3', type: 'number' },
        { id: 'mult', value: '*', type: 'operation' }
      ],
      [
        { id: '0', value: '0', type: 'number' },
        { id: 'dot', value: '.', type: 'number' },
        { id: 'equal', value: '=', type: 'equals' },
        { id: 'div', value: '/', type: 'operation' }
      ]
    ]

    expect(wrapper.vm.keyboard).toEqual(keyboard)
  })

  it('it operates with 2 or more operands', async () => {
    wrapper.find('#button-7').vm.$emit('onClick')
    wrapper.find('#button-0').vm.$emit('onClick')

    wrapper.find('#button-sub').vm.$emit('onClick')

    wrapper.find('#button-1').vm.$emit('onClick')
    wrapper.find('#button-0').vm.$emit('onClick')

    wrapper.find('#button-add').vm.$emit('onClick')

    wrapper.find('#button-5').vm.$emit('onClick')

    wrapper.find('#button-equal').vm.$emit('onClick')

    await wrapper.vm.$nextTick()

    const display = wrapper.get('#display')
    expect(display.element.value).toEqual('65')
  })

  it('operates with negative numbers', async () => {
    wrapper.find('#button-sub').vm.$emit('onClick')
    wrapper.find('#button-5').vm.$emit('onClick')

    wrapper.find('#button-mult').vm.$emit('onClick')

    wrapper.find('#button-2').vm.$emit('onClick')

    wrapper.find('#button-equal').vm.$emit('onClick')

    await wrapper.vm.$nextTick()

    const display = wrapper.get('#display')
    expect(display.element.value).toEqual('-10')
  })

  it('operates with decimals numbers', async () => {
    wrapper.find('#button-3').vm.$emit('onClick')
    wrapper.find('#button-dot').vm.$emit('onClick')
    wrapper.find('#button-3').vm.$emit('onClick')
    wrapper.find('#button-3').vm.$emit('onClick')

    wrapper.find('#button-add').vm.$emit('onClick')

    wrapper.find('#button-2').vm.$emit('onClick')

    wrapper.find('#button-equal').vm.$emit('onClick')

    await wrapper.vm.$nextTick()

    const display = wrapper.get('#display')
    expect(display.element.value).toEqual('5.33')
  })

  it('operates with decimals numbers', async () => {
    wrapper.find('#button-3').vm.$emit('onClick')
    wrapper.find('#button-dot').vm.$emit('onClick')
    wrapper.find('#button-3').vm.$emit('onClick')
    wrapper.find('#button-3').vm.$emit('onClick')

    wrapper.find('#button-add').vm.$emit('onClick')

    wrapper.find('#button-2').vm.$emit('onClick')

    wrapper.find('#button-equal').vm.$emit('onClick')

    await wrapper.vm.$nextTick()

    const display = wrapper.get('#display')
    expect(display.element.value).toEqual('5.33')
  })

  it('shows math error when introduced alphabetical characters', async () => {
    const display = wrapper.get('#display')
    display.element.value = 'ABC'

    wrapper.find('#button-equal').vm.$emit('onClick')

    await wrapper.vm.$nextTick()

    expect(display.element.value).toEqual('Math Err')
  })

  it('shows syntax error when operation is not valid', async () => {
    const display = wrapper.get('#display')
    wrapper.vm.operands = ['335', '45']

    wrapper.find('#button-equal').vm.$emit('onClick')

    await wrapper.vm.$nextTick()

    expect(display.element.value).toEqual('Syntax Err')
  })
})
