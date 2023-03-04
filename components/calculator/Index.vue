<template>
  <div class="calculator">
    <pre>{{ logs }}</pre>
    <input v-model="display" class="display" type="text" disabled>

    <div v-for="(row, rowIndex) in keyboard" :key="`row-${rowIndex}`" class="buttons-row">
      <ButtonComponent
        v-for="(button, buttonIndex) in row"
        :key="`button-${buttonIndex}`"
        :value="button.value"
        :type="button.type"
        @onClick="handleClick(button)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import ButtonComponent from './Button.vue'

interface Button {
  value: string;
  type: string
}

@Component({
  components: {
    ButtonComponent
  }
})
export default class Calculator extends Vue {
  display: string = '0'
  keyboard: Button[][] = [
    [
      { value: 'AC', type: 'clear' },
      { value: '<--', type: 'back' }
    ],
    [
      { value: '7', type: 'number' },
      { value: '8', type: 'number' },
      { value: '9', type: 'number' },
      { value: '+', type: 'operation' }
    ],
    [
      { value: '4', type: 'number' },
      { value: '5', type: 'number' },
      { value: '6', type: 'number' },
      { value: '-', type: 'operation' }
    ],
    [
      { value: '1', type: 'number' },
      { value: '2', type: 'number' },
      { value: '3', type: 'number' },
      { value: '*', type: 'operation' }
    ],
    [
      { value: '0', type: 'number' },
      { value: '.', type: 'number' },
      { value: '=', type: 'equals' },
      { value: '/', type: 'operation' }
    ]
  ]

  operands: string[] = []
  operand: string = ''
  index: number = 0
  logs: string[] = []

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
    if (this.display === '0') {
      this.operand = number
    } else {
      this.operand += number
    }

    this.operands[this.index] = this.operand

    this.updateDisplay()
  }

  private handleOperation (operator: string): void {
    this.operand = ''
    this.operands.push(operator)
    this.index = this.operands.length

    this.updateDisplay()
  }

  private handleCalculate (): void {
    const calc = this.operands.join(' ')

    if (this.isValidString(calc)) {
      const result = eval(calc).toFixed(2)
      const rounded = Math.round(result * 100) / 100
      this.operands = [rounded.toString()]
      this.operand = ''

      const logEntry = `${calc} = ${rounded}`
      this.logs.push(logEntry)

      this.updateDisplay()
    } else {
      this.display = 'Math Err'
    }
  }

  private isValidString (string: string): boolean {
    const regex = /^-?[0-9]+(\.[0-9]+)?([+\-*\/][0-9]+(\.[0-9]+)?)*$/

    return regex.test(string.replaceAll(' ', ''))
  }

  private handleRemove (): void {
    this.operands.pop()

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

<style scoped>
.calculator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 300px;
  background-color: #E0E0E0;
  border: 1px solid #CCCCCC;
  padding: 20px;
  box-shadow: 3px 3px 5px rgba(0,0,0,0.1);
}

.display {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 20px;
  text-align: right;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.1);
}

.buttons-row {
  display: flex;
  justify-content: space-between;
}
</style>
