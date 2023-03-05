<template>
  <div class="calculator">
    <LogScreen :logs="getLogs" />

    <input id="display" v-model="display" class="display" type="text" disabled>

    <div v-for="(row, rowIndex) in keyboard" :key="`row-${rowIndex}`" class="buttons-row">
      <ButtonComponent
        v-for="(button, buttonIndex) in row"
        :id="`button-${button.id}`"
        :key="`button-${buttonIndex}`"
        :value="button.value"
        :type="button.type"
        @onClick="handleClick(button)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { Getter, Action } from 'vuex-class'
import { ActionContext } from 'vuex'
import ButtonComponent from './Button.vue'
import LogScreen from './LogScreen.vue'
import { Button, StateType } from '@/types'

@Component({
  components: {
    ButtonComponent,
    LogScreen
  }
})

export default class Calculator extends Vue {
  @Getter getLogs: number
  @Action addLog!: ActionContext<StateType, StateType>

  display: string = '0'
  keyboard: Button[][] = [
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

  operands: string[] = []
  operand: string = ''
  index: number = 0
  hasPreviosResult: boolean = false

  // Handle different action depending on which key is pressed
  handleClick (button: Button): void {
    switch (button.type) {
      case button.type = 'clear':
        this.handleClear()
        break

      case button.type = 'back':
        this.handleRemove()
        break

      case button.type = 'operation':
        this.handleOperation(button.value)
        break

      case button.type = 'number':
        this.handleNumber(button.value)
        break

      case button.type = 'equals':
        this.handleCalculate()
        break
    }
  }

  private handleNumber (number: string): void {
    // In case a number is selected after making a calculation it resets the operations list
    if (this.display === '0' || this.hasPreviosResult) {
      this.operand = number
      this.hasPreviosResult = false
      this.index = 0
    } else {
      this.operand += number
    }

    // Add the operand at the same position until a operator is pressed
    this.operands[this.index] = this.operand

    this.updateDisplay()
  }

  private handleOperation (operator: string): void {
    // Once the operator is pressed, the input number is defined
    this.operand = ''
    this.hasPreviosResult = false
    this.operands.push(operator)
    this.index = this.operands.length

    this.updateDisplay()
  }

  private handleCalculate (): void {
    const calc = this.operands.join(' ')

    if (this.isValidString(calc)) {
      try {
        const result = eval(calc).toFixed(2)
        const rounded = Math.round(result * 100) / 100
        this.operands = [rounded.toString()]
        this.hasPreviosResult = true
        this.index = 1
        this.operand = ''

        const logEntry = `${calc} = ${rounded}`

        this.$store.dispatch('addLog', logEntry)

        this.updateDisplay()
      } catch {
        this.display = 'Syntax Err'
      }
    } else {
      this.display = 'Math Err'
    }
  }

  private isValidString (string: string): boolean {
    const regex = /^-?\d*\.?\d+(?:[-+*\/]-?\d*\.?\d+)*$/

    return regex.test(string.replaceAll(' ', ''))
  }

  private handleRemove (): void {
    this.operands.pop()
    this.index = this.operands.length

    if (!this.operands.length) {
      this.display = '0'
    } else {
      this.operand = ''

      this.updateDisplay()
    }
  }

  private handleClear (): void {
    this.operands = []
    this.index = 0
    this.display = '0'
  }

  private updateDisplay (): void {
    this.display = this.operands.join(' ')
  }
}
</script>

<style lang="scss" scoped>
.calculator {
  @apply absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-10;
  @apply bg-stone-300 drop-shadow-md;
  @apply rounded border border-black;
}

.display {
  @apply w-full box-border mb-5 p-5;
  @apply text-xl text-right bg-white;
  @apply rounded border border-black;
  @apply drop-shadow-md;
}

.buttons-row {
  @apply flex justify-between
}
</style>
