import { ActionContext } from 'vuex'
import { StateType } from '@/types'

export const state = () => ({
  logs: []
})

export const getters = {
  getLogs (state: StateType): string[] {
    return state.logs
  }
}

export const mutations = {
  addLog (state: StateType, log: string) {
    // Method to keep only 4 logs
    if (state.logs.length === 4) {
      state.logs.shift() // Deletes the first log
    }

    state.logs.push(log)
  }
}

export const actions = {
  addLog (ctx: ActionContext<StateType, StateType>, log: string): void {
    ctx.commit('addLog', log)
  }
}
