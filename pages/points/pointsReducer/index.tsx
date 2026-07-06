import { Branches } from 'services/api/BranchesApimodule'

export const BANKOMATS = 'BANKOMATS'
export const POS_TERMINALS = 'POS_TERMINALS'
export const BRANCHES = 'BRANCHES'
export const PEYMENT_POINTS = 'PEYMENT_POINTS'

export const SERVICE = 'SERVICE'
export const CITY = 'CITY'
export const REGION = 'REGION'
export const TIME_WORK = 'TIME_WORK'
export const ALL_POINTS_SAVE = 'ALL_POINTS_SAVE'
export const MODE = 'MODE'
export const RESET_FILTER = 'RESET_FILTER'
export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const REFRESH_FILTER = 'REFRESH_FILTER'
export const ADD_FILTER = "ADD_FILTER"
export const SELECT_BRANCH = 'SELECT_BRANCH'
export const TYPE = 'TYPE'
export const POINTS_STATE = {
  service: 'branches',
  city: '',
  region: '',
  mode: '',
  branch_type: '',
  type: '',
  loader: false,
  all_data: null,
}
export interface PointState {
  service: string
  city: string
  region: string
  mode: number
  type: string
  loader: boolean
  branch_type: string
  all_data: Branches[] | null
}

export const ServiceReducer = (
  state: PointState,
  action: { type: string; payloaud: string }
) => {
  switch (action.type) {
    case CITY:
      return { ...state, city: action.payloaud }
    case REGION:
      return {
        ...state,
        region: action.payloaud,
      }
    case MODE:
      return {
        ...state,
        mode: action.payloaud,
      }
    case ALL_POINTS_SAVE:
      return {
        ...state,
        all_data: action.payloaud,
      }
    case SERVICE:
      return {
        ...state,
        service: action.payloaud,
      }
    case TYPE:
      return {
        ...state,
        type: action.payloaud,
      }
    case RESET_FILTER:
      return {
        ...state,
        city: action.payloaud,
        region: action.payloaud,
        mode: action.payloaud,
        branch_type: action.payloaud,
        type: action.payloaud,
      }
    case TOGGLE_FILTER:
      return {
        ...state,
        loader: action.payloaud,
      }
    case REFRESH_FILTER:
      return {
        ...state,
        service: 'branches',
        city: '',
        region: '',
        mode: '',
        branch_type: '',
        type: '',
        loader: false,
      }
    case SELECT_BRANCH:
      return {
        ...state,
        branch_type: action.payloaud
      };
    case ADD_FILTER:

      return {
        ...state,
        ...action.payloaud as any
      }
  }
}
