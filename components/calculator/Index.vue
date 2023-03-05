<template>
  <div class="calculator">
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
import Vue from 'vue'
import Component from 'vue-class-component'

import ButtonComponent from './Button.vue'

interface Button {
  id: string,
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
  logs: string[] = []
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
        this.logs.push(logEntry)

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
